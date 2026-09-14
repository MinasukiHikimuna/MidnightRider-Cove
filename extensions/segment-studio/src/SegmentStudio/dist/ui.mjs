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
function ru(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function ks(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function ou(e, t = 1, r = 48) {
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
function au(e, t, r, o, i = 2) {
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
function iu(e) {
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
function su(e) {
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
function lu(e, t) {
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
function du(e, t) {
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
function cu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, nl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function uu(e) {
  return e === "review" ? "review" : "editor";
}
function Qe(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
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
  const r = e.identities.map((i) => Qe(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Qe(t, e.activeIdentity) || r[0]
  };
}
function il(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function mu(e, t) {
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
function gu(e, t = null, r = !1) {
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
    const m = [...e].sort((y, h) => String(y.slotDefinitionId).localeCompare(String(h.slotDefinitionId))), p = [...t].sort((y, h) => String(y.name).localeCompare(String(h.name)) || Number(lt(y)) - Number(lt(h)));
    return [{
      assignments: Object.fromEntries(m.map((y, h) => [String(y.slotDefinitionId), String(lt(p[h]))])),
      description: p.map((y) => y.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, y) => ({ performer: p, index: y })).filter(({ performer: p }) => {
    var y;
    return !((y = m.genderHints) != null && y.length) || m.genderHints.some((h) => Zt(h) === Zt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : ra(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(lt(m)), p]));
  function f(m, p, y) {
    if (s.length >= a) return;
    const h = c.slice(m), I = i ? h.filter((T) => T.length > 0).length : ra(h.map((T) => T.filter((A) => !p.has(String(lt(t[A]))))), t.length);
    if (y + I < g) return;
    if (m === e.length) {
      if (y !== g) return;
      const T = Object.fromEntries(d.map(({ slot: C, performer: S }) => [String(C.slotDefinitionId), S ? String(lt(S)) : ""])), A = o.length === 0 ? Object.values(T).sort().join(",") : [...new Set(e.map((C) => String(C.label || "")))].map((C) => `${C}:${d.filter(({ slot: S }) => String(S.label || "") === C).map(({ performer: S }) => S ? String(lt(S)) : "").sort().join(",")}`).join("|");
      !l.has(A) && s.length < a && (l.add(A), s.push({
        assignments: T,
        description: d.map(({ slot: C, performer: S }) => o.length ? `${C.label}: ${(S == null ? void 0 : S.name) || "Unassigned"}` : (S == null ? void 0 : S.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[m], K = [...d].reverse().find(({ slot: T }) => na(T) === na(x)), F = K ? u.get(String(lt(K.performer))) : -1;
    for (const T of c[m]) {
      const A = t[T], C = lt(A);
      if (!(T < F) && !(C == null || !i && p.has(String(C))) && (d.push({ slot: x, performer: A }), i || p.add(String(C)), f(m + 1, p, y + 1), i || p.delete(String(C)), d.pop(), s.length >= a))
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
  const o = lt, i = new Set((t || []).map(o)), a = new Set((r || []).map(Zt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = Zt(l.gender || l.genderIdentity), f = Zt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: pe, useId: ti, useLayoutEffect: Ml, useMemo: ze, useReducer: El, useRef: ge, useState: j, useSyncExternalStore: Dl } = ro, n = ro.createElement, ni = "/api/plugins/segment-studio";
function Ge(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(cn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = eo();
    return t[e] = r, window.localStorage.setItem(cn, JSON.stringify(t)), r;
  } catch {
    return eo();
  }
}
function Ue(e) {
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
async function te(e, t, r = 0) {
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
    return await Ol(250 * (r + 1), t == null ? void 0 : t.signal), te(e, t, r + 1);
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
function Te(e) {
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
  const i = `bin-empty:${e.fingerprint}`, a = await te("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ge(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ue(i), {
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
const Ft = {
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
function pu(e, t) {
  return {
    ...(Ft[e] || Ft.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ii(e) {
  return { ...(Ft[e] || Ft.unreviewed).badge };
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
  const i = Ft[e] || Ft.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
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
  const r = Ft[e] || Ft.unreviewed;
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
function fu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Wl(e, t = document) {
  return !(e.defaultPrevented || _l(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function yu(e, t = document, r = !1, o = {}) {
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
function bu(e, t) {
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
  const o = ge(null), i = `performer-slots-${ti()}`, [a, s] = j(null);
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
function Lt(e, t) {
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
  const i = e.findIndex((h) => h.markers.some((I) => I.segment.id === t));
  if (i < 0) {
    const h = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && h.sort((I, x) => sa(I, x, o)), ((u = h[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((h) => h.segment.id === t);
  if (r === "left" || r === "right") {
    const h = r === "left" ? -1 : 1, I = Math.min(a.markers.length - 1, Math.max(0, s + h));
    return ((f = a.markers[I]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((y = [...e[l].markers].sort(c ? (h, I) => sa(h, I, Number(o)) : (h, I) => Math.abs(h.segment.startSec - d) - Math.abs(I.segment.startSec - d) || h.segment.startSec - I.segment.startSec || h.segment.id - I.segment.id)[0]) == null ? void 0 : y.segment) ?? null;
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
function hu(e, t, r) {
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
function vu(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function xu(e, t) {
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
function wd(e, t) {
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
function Ot(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function yi(e, t) {
  return (e || []).find((r) => kn(t, r)) || null;
}
function bi(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Nd(e, t) {
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
function Id({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = ua;
  const d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let g = [];
  function u() {
    l = o == null && i.length === 0 && a == null ? ua : Object.freeze({
      running: o ? fr(o) : null,
      queued: Object.freeze(i.map(fr)),
      lastFailure: a
    });
    for (const T of [...c]) T();
    if (o == null && i.length === 0) {
      const T = g;
      g = [];
      for (const A of T) A();
    }
  }
  function f(T, A) {
    d.set(T.id, A.status), T.resolve(A);
  }
  function m(T) {
    if (T.dependsOn == null) return "met";
    const A = d.get(T.dependsOn);
    return A === "fulfilled" ? "met" : A != null ? "failed" : "pending";
  }
  function p(T) {
    o = T;
    const A = { ...e(), taskId: T.id, targets: T.targets };
    A.resolveTargets = () => T.targets.map((S) => yi(A.segments, S)).filter(Boolean), u();
    let C;
    try {
      C = T.run(A);
    } catch (S) {
      C = Promise.reject(S);
    }
    Promise.resolve(C).then(
      (S) => y(T, { status: "fulfilled", value: S }),
      (S) => y(T, { status: "rejected", error: S })
    );
  }
  function y(T, A) {
    T.settled || (T.settled = !0, f(T, A), !s && (o = null, A.status === "rejected" && (a = Object.freeze({ id: T.id, kind: T.kind, error: A.error })), u(), t && h()));
  }
  function h() {
    if (s || o != null) return;
    let T = !1;
    for (let A = 0; A < i.length; A += 1) {
      const C = i[A], S = m(C);
      if (S === "failed") {
        i = i.filter((w) => w !== C), f(C, { status: "dropped", reason: "dependency-failed" }), T = !0, A -= 1;
        continue;
      }
      if (S !== "pending" && !(C.exclusive && A > 0) && !i.slice(0, A).some((w) => fi(w.targets, C.targets)) && !(C.ready && !C.ready(e(), fr(C)))) {
        i = i.filter((w) => w !== C), p(C);
        return;
      }
    }
    T && u();
  }
  function I(T) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((M) => M.exclusive) || o != null && T.whenBusy !== "enqueue") return null;
    let C;
    const S = new Promise((M) => {
      C = M;
    }), w = {
      id: r++,
      kind: T.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: T.lockId ?? -1,
      targets: Object.freeze([...T.targets || []]),
      exclusive: T.exclusive === !0,
      dependsOn: T.dependsOn ?? null,
      ready: T.ready || null,
      meta: T.meta ?? null,
      run: T.run,
      resolve: C
    };
    return i = [...i, w], u(), h(), { id: w.id, done: S };
  }
  function x(T = {}) {
    let A = null;
    const C = I({
      ...T,
      whenBusy: "reject",
      run: () => new Promise((w) => {
        A = w;
      })
    });
    if (!C) return null;
    if (A == null)
      return F((w) => w.id === C.id), null;
    let S = !1;
    return () => {
      S || (S = !0, A(), (o == null ? void 0 : o.id) === C.id && y(o, { status: "fulfilled", value: void 0 }));
    };
  }
  function K(T, A) {
    let C = !1;
    for (const S of i)
      S.targets.some((w) => w.id === T && w.itemId == null && w.nativeSegmentId == null) && (S.targets = Object.freeze(S.targets.map((w) => w.id === T ? { ...A } : w)), C = !0);
    return C && u(), C;
  }
  function F(T) {
    const A = i.filter((C) => T(fr(C)));
    if (A.length === 0) return 0;
    i = i.filter((C) => !A.includes(C));
    for (const C of A) f(C, { status: "cancelled" });
    return u(), h(), A.length;
  }
  return {
    enqueue: I,
    acquire: x,
    cancel: F,
    retarget: K,
    poke: h,
    subscribe(T) {
      return c.add(T), () => c.delete(T);
    },
    getSnapshot: () => l,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((T) => g.push(T));
    },
    dispose() {
      if (s) return;
      const T = i;
      i = [], s = !0;
      for (const C of T) f(C, { status: "cancelled" });
      c.clear();
      const A = g;
      g = [];
      for (const C of A) C();
    }
  };
}
let Cd = 1;
function qt() {
  return `pending-${Cd++}`;
}
function $d(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function xr(e, t) {
  return (t || []).some((r) => kn(r, e));
}
function Td(e, t) {
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
function hi(e, t) {
  return t && (e || []).find((r) => {
    var o;
    return ((o = r.meta) == null ? void 0 : o.kind) === "held-tag" && !r.settled && xr(t, r.targets);
  }) || null;
}
function Ad(e) {
  return (e || []).filter((t) => t.op === "insert" && !t.settled).map((t) => t.segment);
}
function vi(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function Rd(e, t) {
  const r = (e || []).filter((o) => !vi(o, t));
  return r.length === (e || []).length ? e : r;
}
function Md(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !vi(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function Ed(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Dd(e, t) {
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
  return $d(r);
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
function Pd(e, t) {
  switch (t.type) {
    case "add":
      return Td(e, t.entry);
    case "discard":
      return Rd(e, t.key);
    case "settle":
      return Md(e, t.key);
    case "retarget":
      return Ed(e, t.temporaryId, t.identity);
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
function Od(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, enqueueSave: i, pendingChanges: a, retargetSaveTasks: s, currentTime: l, detail: d, editorFilters: c, endInput: g, hideDerivedSegments: u, historyRef: f, mediaDuration: m, onConflict: p, onDetailChange: y, onReload: h, optimisticSegmentIdRef: I, pendingDuplicateRef: x, pendingFirstSegmentStartSecRef: K, pendingTagEditSegmentIdRef: F, replaceSegmentSelection: T, savingSegmentId: A, segments: C, selectedSegment: S, selectedSegmentIdRef: w, selectedSegments: M, selectionAnchorIdRef: z, selectionRangeBaseIdsRef: re, setCreatingSegmentId: L, setEditorFilters: E, setFirstSegmentTagOpen: R, setHideDerivedSegments: _, setHistory: ie, setHistoryOpen: ae, setPublishApprovedError: be, setSaveMessage: V, setSelectedSegmentGroupKey: J, setSelectedSegmentId: ne, setSelectedSegmentIds: Y, setTagEditing: fe, startInput: ye, tagEditingRef: ve, timelineDuration: oe, video: ue } = e;
  function ce(B) {
    f.current = B || zt, ie(f.current);
  }
  async function Z(B, H, q, O, W = null) {
    var G;
    try {
      const Q = await te(`/videos/${ue.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: f.current.revision,
          kind: B,
          label: H,
          beforeState: q,
          afterState: O,
          receiptId: W
        })
      });
      return ce(Q), !0;
    } catch (Q) {
      return Q.status === 409 && ((G = Q.payload) != null && G.current) && ce(Q.payload.current), V("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function X(B, H, q = !0, O = null, W = !1, G = H, Q = !0) {
    if (!B || A != null) return null;
    const Ce = t("segment", B.id);
    if (!Ce) return null;
    try {
      return await U(B, H, {
        recordHistory: q,
        historyLabel: O,
        optimisticValues: W ? G : null,
        restoreSelectionOnFailure: Q
      });
    } finally {
      Ce();
    }
  }
  async function U(B, H, {
    recordHistory: q = !0,
    historyLabel: O = null,
    optimisticValues: W = null,
    pendingChangeId: G = null,
    restoreSelectionOnFailure: Q = !0,
    onReload: Ce = h,
    onConflict: Pe = p
  } = {}) {
    var bt;
    const Ne = M.map((Ze) => Ze.id), Ke = w.current, Be = q && !r ? crypto.randomUUID() : null;
    V(q ? "Saving directly to Cove…" : "Restoring history…");
    const Ee = G ?? (W ? qt() : null);
    W && !G && o({
      type: "add",
      entry: { id: Ee, op: "patch", targets: [Ot(B)], values: W }
    });
    const et = () => {
      Ee && o({ type: "settle", key: Ee });
    };
    try {
      if (r && B.nativeSegmentId == null && B.itemId != null) {
        const rt = `draft-update:${ue.id}:${B.itemId}:${B.revision}:${H.tagId}:${H.startSec}:${H.endSec ?? "open"}:${H.reviewState ?? B.reviewState}`, ct = await te(`/videos/${ue.id}/drafts/${B.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(rt),
            expectedRevision: B.revision,
            startSec: H.startSec,
            endSec: H.endSec,
            tagId: H.tagId,
            reviewState: H.reviewState
          })
        });
        Ue(rt);
        const ot = {
          ...B,
          ...ct.draft,
          id: B.id,
          itemId: B.itemId
        };
        return q && await Z(
          "segment.update",
          O || "Changed segment",
          gr(B, r),
          gr(
            ot,
            r
          )
        ), ma(B, H, r) ? await Ce() : y((ut) => ({
          ...ut,
          approvedSetVersion: ct.approvedSetVersion || ut.approvedSetVersion,
          segments: (ut.segments || []).map((_e) => _e.id === B.id ? ot : _e).sort((_e, ht) => _e.startSec - ht.startSec || _e.id - ht.id)
        }), ue.id), et(), V(((bt = ct.draft) == null ? void 0 : bt.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ot;
      }
      const Ze = await te(`/videos/${ue.id}/segments/${B.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...H,
          expectedUpdatedAt: B.updatedAt,
          historyReceiptId: Be
        })
      }), mt = {
        ...B,
        ...Ze,
        reviewState: H.reviewState ?? B.reviewState
      };
      return ma(B, H, r) ? await Ce() : y((rt) => ({
        ...rt,
        segments: (rt.segments || []).map((ct) => ct.id === B.id ? mt : ct).sort((ct, ot) => ct.startSec - ot.startSec || ct.id - ot.id)
      }), ue.id), et(), q && await Z(
        "segment.update",
        O || "Changed segment",
        gr(B, r),
        gr(
          mt,
          r
        ),
        Be
      ), V(q ? "Saved to Cove" : "History restored"), mt;
    } catch (Ze) {
      return Ee && o({ type: "discard", key: Ee }), Ee && Q && (Y(Ne), ne(Ke), z.current = Ke, re.current = []), Ze.status === 409 ? (V("Conflict — loading the latest segment…"), await Pe()) : V(Ze.message || "Unable to save the segment."), null;
    }
  }
  async function se() {
    if (!r) return !1;
    const B = C.filter((O) => !O.published && O.reviewState === "approved").length;
    if (B === 0 || A != null) return !1;
    const H = `complete-review:${ue.id}:${d.approvedSetVersion}`, q = t("publish", -1);
    if (!q) return !1;
    be(""), V(`Publishing ${B} Approved draft${B === 1 ? "" : "s"}…`);
    try {
      const O = await te(`/videos/${ue.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(H),
          expectedApprovedSetVersion: d.approvedSetVersion
        })
      });
      Ue(H), ce(zt), ae(!1);
      const W = await h(), G = ml(
        C,
        w.current,
        O.published
      ), Q = G ? Qe(W == null ? void 0 : W.segments, G) : null;
      return Q && ne(Q.id), V(`${O.published.length} Approved draft${O.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (O) {
      const W = O.status === 409 ? "The approved drafts changed. Review the updated list and try again." : O.message || "Unable to publish the approved drafts.";
      return O.status === 409 && await p(), be(W), V(W), !1;
    } finally {
      q();
    }
  }
  async function $(B = null, H = null) {
    if (A != null || b()) return;
    const q = B != null ? K.current : null, O = Number.isFinite(q) ? q : l, W = Math.min(oe, O + 20);
    if (W <= O) {
      V("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const G = ll(C, S, B);
    if (G.kind === "choose-tag") {
      K.current = O, V(""), R(!0);
      return;
    }
    if (G.kind === "invalid-selection") {
      V("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: Q } = G, Ce = `create-draft:${ue.id}:${Q}:${O}`, Pe = r ? null : crypto.randomUUID(), Ne = w.current, Ke = {
      ...S || {},
      id: I.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: Q,
      tagName: H || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: Q === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: O,
      endSec: W,
      // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
      reviewState: r ? "approved" : "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Be = Sd(d, Ke), Ee = Lt(
      dn(Be.segments, Be.segmentGroups || [], Be.performerSlots || []),
      Ke.id
    ), et = i({
      kind: "create",
      lockId: -1,
      run: (Ze) => bt(Ze)
    });
    if (!et) return;
    await et.done;
    async function bt({ onReload: Ze, taskId: mt }) {
      var ct;
      const rt = qt();
      o({ type: "add", entry: { id: rt, taskId: mt, op: "insert", segment: Ke } }), R(!1), G.openTagEditor && (L(Ke.id), F.current = Ke.id, fe(!0)), T(Ke.id), J(Ee);
      try {
        let ot;
        if (r) {
          const ht = await te(`/videos/${ue.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: Ge(Ce), tagId: Q, startSec: O, endSec: W })
          });
          Ue(Ce), ot = { itemId: (ct = ht.draft) == null ? void 0 : ct.itemId };
        } else
          ot = { nativeSegmentId: (await te(`/videos/${ue.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: Q,
              startSec: O,
              endSec: W,
              historyReceiptId: Pe
            })
          })).id };
        K.current = null, R(!1);
        const ut = await Ze();
        if (o({ type: "discard", key: rt }), !ut) {
          T(Ne), V(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${G.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const _e = Qe(ut == null ? void 0 : ut.segments, ot);
        _e ? (o({ type: "retarget", temporaryId: Ke.id, identity: Ot(_e) }), s(Ke.id, Ot(_e)), G.openTagEditor && (ve.current && (F.current = _e.id), L(_e.id)), T(_e.id), J(Lt(
          dn(ut.segments || [], ut.segmentGroups || [], ut.performerSlots || []),
          _e.id
        )), r || await Z(
          "segment.create",
          "Created segment",
          Rt([], !1),
          Rt([_e], !1),
          Pe
        )) : (fe(!1), V(`Segment created, but it could not be selected${G.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (ot) {
        throw o({ type: "discard", key: rt }), T(Ne), B != null && R(!0), V(ot.message || "Unable to create the draft."), ot;
      } finally {
        L(null);
      }
    }
  }
  function b() {
    return hi(a, S) ? (V("Close the tag field to save the new segment's tag first."), !0) : !1;
  }
  async function k() {
    if (M.length !== 1 || !S || A != null || b()) return;
    const B = l;
    if (B <= S.startSec || S.endSec != null && B >= S.endSec) {
      V("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const H = `split-draft:${S.itemId}:${S.revision}:${B}`, q = r ? null : Rt([S], !1), O = r ? null : crypto.randomUUID(), W = t("split", S.id);
    if (W)
      try {
        let G = null;
        r && S.nativeSegmentId == null ? (await te(`/videos/${ue.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(H),
            expectedRevision: S.revision,
            splitSec: B
          })
        }), Ue(H)) : G = { nativeSegmentId: (await te(`/videos/${ue.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: B,
            historyReceiptId: O
          })
        })).id };
        const Q = await h();
        if (!r) {
          const Ce = [
            Qe(Q == null ? void 0 : Q.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Qe(
              Q == null ? void 0 : Q.segments,
              G
            )
          ].filter(Boolean);
          await Z(
            "segment.split",
            "Split segment",
            q,
            Rt(Ce, !1),
            O
          );
        }
        V(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (G) {
        G.status === 409 ? await p() : V(G.message || "Unable to split the draft.");
      } finally {
        W();
      }
  }
  async function v(B = !1) {
    var G, Q;
    if (M.length !== 1 || !S || A != null || b()) return;
    const H = B ? l : S.startSec, q = sl(ue.id, S, B, H), O = r ? null : crypto.randomUUID(), W = t("duplicate", S.id);
    if (W)
      try {
        const Ce = ((G = x.current) == null ? void 0 : G.operationKey) === q ? x.current : null;
        let Pe = (Ce == null ? void 0 : Ce.duplicateIdentity) ?? null;
        if (Pe == null && r && S.nativeSegmentId == null) {
          const Be = await te(`/videos/${ue.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ge(q),
              expectedRevision: S.revision,
              startSec: B ? H : null
            })
          });
          Pe = Jo(!1, Be), x.current = { operationKey: q, duplicateIdentity: Pe };
        } else if (Pe == null) {
          const Be = await te(`/videos/${ue.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: B ? H : null,
              historyReceiptId: O
            })
          });
          Pe = Jo(!0, Be), x.current = { operationKey: q, duplicateIdentity: Pe };
        }
        const Ne = await h(), Ke = Qe(Ne == null ? void 0 : Ne.segments, Pe);
        if (Ke) {
          r || await Z(
            "segment.duplicate",
            "Duplicated segment",
            Rt([], !1),
            Rt([Ke], !1),
            O
          );
          const Be = Ha(
            Ke,
            Ne.performerSlots || [],
            c,
            u,
            Ne.segmentGroups || []
          );
          E(Be.filters), _(Be.hideDerivedSegments), Y([Ke.id]), ne(Ke.id), z.current = Ke.id, re.current = [], J(Lt(
            dn(Ne.segments || [], Ne.segmentGroups || [], Ne.performerSlots || []),
            Ke.id
          )), r && S.nativeSegmentId == null && Ue(q), x.current = null, V(B ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          V("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (Ce) {
        ((Q = x.current) == null ? void 0 : Q.operationKey) === q ? V("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Ce.status === 409 ? await p() : V(Ce.message || "Unable to duplicate the draft.");
      } finally {
        W();
      }
  }
  async function P() {
    if (M.length !== 1 || !S) return;
    const B = Number(ye), H = g.trim() === "" ? null : Number(g), q = Ko(B, H, m);
    if (q.error) {
      V(q.error);
      return;
    }
    if (B === S.startSec && H === S.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await X(S, { startSec: B, endSec: H, tagId: S.tagId }, !0, null, !0);
  }
  async function le(B, H) {
    if (M.length !== 1 || !S) return;
    const q = Ko(B, H, m);
    if (q.error) {
      V(q.error);
      return;
    }
    if (B === S.startSec && H === S.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await X(S, { startSec: B, endSec: H, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: ce, recordHistoryAction: Z, mutateSegment: X, runSegmentMutation: U, completeReview: se, createSegment: $, splitSegment: k, duplicateSegment: v, saveTiming: P, applyShortcutTiming: le };
}
function Ld() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(Bo).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Bo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Fd() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(Go).matches);
  return pe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Go), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function jd() {
  try {
    return Rs(window.localStorage.getItem(Da));
  } catch {
    return { ...Tt };
  }
}
function Bd() {
  try {
    return en(JSON.parse(window.localStorage.getItem(Pa) || "[]"));
  } catch {
    return [];
  }
}
function Gd(e) {
  try {
    window.localStorage.setItem(Pa, JSON.stringify(en(e)));
  } catch {
  }
}
function Ud(e) {
  try {
    window.localStorage.setItem(Da, JSON.stringify(e));
  } catch {
  }
}
function Kd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(La) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function zd(e) {
  try {
    return window.localStorage.setItem(La, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Hd({ status: e }) {
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
  }, `${Ft[t].symbol}${e[t]}`)));
}
function qd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = lo(a), [m, p] = j(() => _r(o, f)), [y, h] = j(!1), [I, x] = j(""), K = ge(!1), F = o.map((M) => `${M.slotDefinitionId}:${M.performerId || ""}`).join("|"), T = f.map((M) => lt(M)).join("|"), A = Xa(
    o,
    f
  );
  pe(() => {
    p(_r(o, f)), x("");
  }, [t, r, F, T]);
  async function C(M = m) {
    if (!K.current) {
      K.current = !0, h(!0), x("Saving performer slots…");
      try {
        const z = _r(o.map((E) => ({
          ...E,
          performerId: M[E.slotDefinitionId] || null
        })), f), re = o.map((E) => {
          const R = z[E.slotDefinitionId] ? Number(z[E.slotDefinitionId]) : null, _ = f.find((ie) => String(lt(ie)) === String(R));
          return {
            ...E,
            performerId: R,
            performerName: (_ == null ? void 0 : _.name) || null
          };
        });
        if (s(re) === !1) {
          x("");
          return;
        }
        const L = await te(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((E) => ({ slotDefinitionId: E.slotDefinitionId, performerId: z[E.slotDefinitionId] ? Number(z[E.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(L, {
          beforeState: Nr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Nr([{
            segmentId: t,
            itemId: r,
            revision: L.revision,
            slots: L.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(z.message || "Unable to save performer slots.");
      } finally {
        K.current = !1, h(!1);
      }
    }
  }
  function S(M, z) {
    x(`Option ${z + 1} applied; save to confirm.`), p({ ...m, ...M.assignments });
  }
  async function w(M) {
    const z = { ...m, ...M.assignments };
    p(z), await C(z);
  }
  return pe(() => {
    if (u)
      return u.current = (M) => K.current || !A[M] ? !1 : (w(A[M]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    A.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, A.map((M, z) => n("button", {
        key: z,
        type: "button",
        disabled: y,
        onClick: () => S(M, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${M.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, M.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${A.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((M) => n("label", { key: M.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, Ct(M)),
      (M.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(M.genderHints || []).map($r).join(" · ")}`) : null,
      n("select", { key: "select", value: m[M.slotDefinitionId] || "", disabled: y, onChange: (z) => p({ ...m, [M.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ei(f, f, M.genderHints).map((z) => n("option", { key: lt(z), value: lt(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: y, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, I)])
  ]);
}
function _d({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a, acquireSaveLock: s = () => () => {
} }) {
  var C;
  const l = ((C = t[0]) == null ? void 0 : C.slots) || [], d = lo(r), c = Xa(
    l,
    d
  ), g = "__mixed__", u = () => Object.fromEntries(l.map((S, w) => {
    const M = t.map((z) => {
      var re;
      return String(((re = z.slots[w]) == null ? void 0 : re.performerId) || "");
    });
    return [S.slotDefinitionId, M.every((z) => z === M[0]) ? M[0] : g];
  })), [f, m] = j(u), [p, y] = j(!1), [h, I] = j(""), x = ge(!1), K = t.map((S) => `${S.itemId ?? `native:${S.segmentId}`}:${S.revision}:${S.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  pe(() => {
    m(u());
  }, [K]);
  async function F(S = f) {
    if (x.current) return;
    const w = s();
    if (!w) {
      I("Wait for the current save to finish before saving performer slots.");
      return;
    }
    x.current = !0, y(!0), I(`Saving performer slots for ${t.length} segments…`);
    const M = [];
    try {
      for (const z of t) {
        const re = z.slots.map((E, R) => {
          const _ = S[l[R].slotDefinitionId];
          return {
            slotDefinitionId: E.slotDefinitionId,
            performerId: _ === g ? E.performerId || null : _ ? Number(_) : null
          };
        }), L = await te(z.itemId != null ? `/videos/${e}/drafts/${z.itemId}/slots` : `/videos/${e}/segments/${z.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: z.revision, assignments: re })
        });
        M.push({
          segmentId: z.segmentId,
          itemId: z.itemId,
          revision: L.revision,
          slots: L.slots || []
        });
      }
      I("Performer slots saved."), await o({
        beforeState: Nr(t),
        afterState: Nr(M)
      });
    } catch (z) {
      const re = await i();
      z.status === 409 ? I(re ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : I(z.message || (re ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      x.current = !1, y(!1), w();
    }
  }
  function T(S, w) {
    I(`Option ${w + 1} applied; save to confirm.`), m({ ...f, ...S.assignments });
  }
  async function A(S) {
    const w = { ...f, ...S.assignments };
    m(w), await F(w);
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
        onClick: () => T(S, w),
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
        onClick: () => F(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function jt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Wd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return jt(t);
  const o = [...new Set(r.map((i) => jt(i.sourceKey, i.sourceDisplayName)))];
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
function Vd({ hidden: e }) {
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
function Jd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = j(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Wd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            jt(u.sourceKey, u.sourceDisplayName)
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
function Yd({
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
  const [u, f] = j([]), m = e.flatMap((I) => I.lanes.map((x) => x.key)), p = m.join("|");
  pe(() => {
    const I = new Set(m);
    f((x) => x.filter((K) => I.has(K)));
  }, [p]);
  const y = Ir(t), h = !!mi(
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
      Xl({ mergeable: h, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const K = u.includes(x.key), F = x.markers.some(({ segment: A }) => A.id === r), T = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${F ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": K,
            "aria-controls": T,
            "aria-current": F ? "true" : void 0,
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
            id: T,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: A }) => {
            const C = A.endSec == null ? Te(A.startSec) : `${Te(A.startSec)} – ${Te(A.endSec)}`;
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
                jt(A.sourceKey)
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
function Qd(e, t, r = null) {
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
function Zd(e, t, r, o = null, i = !1) {
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
    const i = Ft[r];
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
function Xd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
function ec({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
function tc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function _n() {
  window.dispatchEvent(new CustomEvent(no));
}
function Ni({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = j(null);
  pe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await te("/bin"), u = Number(g == null ? void 0 : g.totalCount);
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
  const i = tc(r);
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
function nc({ mode: e, onModeChange: t, disabled: r = !1 }) {
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
function rc({ minimum: e, maximum: t, onChange: r }) {
  const o = ge(null), [i, a] = j("maximum"), s = (f, m) => {
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
    const p = f === "minimum" ? e : t, y = f === "minimum" ? 0 : e, h = f === "minimum" ? t : 1, I = m.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (x = p - I), ["ArrowRight", "ArrowUp"].includes(m.key) && (x = p + I), m.key === "PageDown" && (x = p - 0.1), m.key === "PageUp" && (x = p + 0.1), m.key === "Home" && (x = y), m.key === "End" && (x = h), x != null && (m.preventDefault(), s(f, Math.min(h, Math.max(y, x))));
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
function oc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
function ac({
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
  const u = Mt(e), f = [...new Map((a || []).map((h) => [
    Number(h.tagId),
    h.tagName || `Tag ${h.tagId}`
  ])).entries()].sort((h, I) => h[1].localeCompare(I[1]) || h[0] - I[0]), m = (h) => d(Mt({ ...u, ...h })), p = (h) => m({
    reviewStates: u.reviewStates.includes(h) ? u.reviewStates.filter((I) => I !== h) : [...u.reviewStates, h]
  }), y = (h) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${h ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && g();
    },
    onKeyDownCapture: (h) => At(h, { onCancel: g })
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
        n("div", { className: "flex flex-wrap gap-2" }, It.map((h) => {
          const I = u.reviewStates.includes(h), x = Ft[h];
          return n("button", {
            key: h,
            type: "button",
            onClick: () => p(h),
            "aria-pressed": I,
            className: y(I)
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
            const I = Number(lt(h));
            return n("button", {
              key: I,
              type: "button",
              onClick: () => m({ performerId: I }),
              "aria-pressed": u.performerId === I,
              className: y(u.performerId === I)
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
            ...f.map(([h, I]) => n("option", { key: h, value: h }, I))
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
          }, jt(h)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(rc, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: h, maximum: I }) => m({
            confidenceMin: h,
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
        n(Vd, { key: "icon", hidden: t }),
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
function ic({ reviewMode: e, bindings: t, onClose: r }) {
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
function sc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = hd(e), [l, d] = j([]), c = s.map((g) => g.tagName).join("|");
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
            const y = `${Te(p.startSec)}${p.endSec == null ? "" : ` – ${Te(p.endSec)}`}`, h = r === p.id;
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
function lc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = j(""), [a, s] = j(0), l = ge(null), d = ze(() => Tl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Rl(d);
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
      var T;
      const p = f.segment || f, y = p.endSec == null ? Te(p.startSec) : `${Te(p.startSec)} – ${Te(p.endSec)}`, h = `${jt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, I = m === c, x = m > 0 ? d[m - 1].groupKey : null, K = g && f.groupKey !== x ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, F = n("button", {
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
        (T = f.performers) != null && T.length ? n(Tr, {
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
      return K ? [K, F] : [F];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function dc(e) {
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
function cc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = ze(() => dc(e), [e]), [l, d] = j([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = ge(null);
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
            const h = y.endSec == null ? Te(y.startSec) : `${Te(y.startSec)} – ${Te(y.endSec)}`, I = `${jt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", { key: y.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(un, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
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
function uc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = $l(e), [s, l] = j(() => /* @__PURE__ */ new Set()), [d, c] = j(() => new Set(a.map((y) => y.key))), g = a.flatMap((y) => d.has(y.key) ? y.candidates : []), u = (y) => l((h) => {
    const I = new Set(h);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), f = (y) => c((h) => {
    const I = new Set(h);
    return I.has(y) ? I.delete(y) : I.add(y), I;
  }), m = (y) => y.assignment.map(({ slot: h, performer: I }) => `${h.label || `Slot ${h.sortOrder + 1}`}: ${I.name}`).join(", "), p = (y) => `segment-studio-auto-assign-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
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
            y.assignment.map(({ slot: h, performer: I }) => {
              const x = h.label || `Slot ${h.sortOrder + 1}`;
              return n("span", {
                key: h.slotDefinitionId,
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
          y.candidates.map((h) => {
            const I = h.endSec == null ? Te(h.startSec) : `${Te(h.startSec)} – ${Te(h.endSec)}`, x = `${jt(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", {
              key: h.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(un, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                h.tagName || "Tag segment"
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
function mc({ preview: e, onConfirm: t, onClose: r }) {
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
function gc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = j(!1), d = ge(null);
  if (mo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Te(e.endSec);
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
        `${Te(e.startSec)} – ${c}`
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
function pc(e) {
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
function fc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = ge(null);
  mo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = pc(c);
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
                `${m.rootTagName} @ ${Te(m.rootStartSec)}`
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
function yc({
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
  onDetailChange: I,
  setSaveMessage: x,
  acquireSaveLock: K,
  onSlotsChanged: F,
  onRecordHistory: T,
  onCancelQueuedReview: A,
  splitSegment: C,
  duplicateSegment: S,
  provenance: w,
  lineage: M,
  onNavigateLineageItem: z,
  tagEditing: re,
  onCancelTagEditing: L,
  detailPanelRef: E,
  onReduceSelection: R
}) {
  var ve, oe, ue, ce;
  const _ = ge(null), ie = ge(null), ae = () => {
    var Z;
    (Z = ie.current) == null || Z.call(ie), ie.current = null;
  }, be = ge(null), V = ge(null), J = ge(null), ne = ge(null), [Y, fe] = j(!1);
  pe(() => {
    _.current && (_.current.scrollTop = 0), fe(!1);
  }, [t == null ? void 0 : t.id]), pe(() => {
    var Z, X;
    Y && ((X = (Z = be.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || X.focus({ preventScroll: !0 }));
  }, [Y]);
  function ye() {
    fe(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = y.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((se) => se.isDerived), X = e && g ? Zl(f, r) : null, U = (X == null ? void 0 : X.map((se, $) => {
      var k;
      const b = r[$];
      return {
        segmentId: b.nativeSegmentId,
        itemId: b.published ? null : b.itemId,
        revision: (k = m.performerSlotRevisions) == null ? void 0 : k[b.id],
        slots: se
      };
    })) || [];
    return n(ro.Fragment, null, [
      n(Yd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: E,
        onReduceSelection: R,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: U.length > 0 && a == null,
        onEditSlots: () => fe(!0),
        slotButtonRef: y,
        saveMessage: i
      }),
      re && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && L();
        },
        onKeyDownCapture: (se) => At(se, { onCancel: L })
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
          onChange: (se, $) => se == null ? L() : l(se, $ == null ? void 0 : $.label),
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
      Y && U.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (se) => {
          se.target === se.currentTarget && ye();
        },
        onKeyDownCapture: (se) => {
          var b, k;
          if (!(typeof ((b = se.target) == null ? void 0 : b.closest) == "function" ? se.target.closest("input, textarea, select, [contenteditable='true']") : null) && !se.repeat && !se.ctrlKey && !se.altKey && !se.metaKey && !se.shiftKey && /^[1-9]$/.test(se.key) && ((k = ne.current) != null && k.call(ne, Number(se.key) - 1))) {
            se.preventDefault(), se.stopPropagation();
            return;
          }
          At(se, { onCancel: ye });
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
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(_d, {
          videoId: p.id,
          targets: U,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: ne,
          acquireSaveLock: () => K("slots", -1),
          onSaved: async ({ beforeState: se, afterState: $ }) => {
            await T(
              "performer-slots.assign",
              `Assigned performers to ${U.length} segments`,
              se,
              $
            ), ye(), await F();
          },
          onConflict: F
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
        e && t ? n(un, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Ar, { key: "derived" }) : null,
        t && re ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), L());
          },
          onKeyDown: (Z) => {
            Vl(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(Wn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, X) => Z == null ? L() : l(Z, X == null ? void 0 : X.label),
          disabled: dl(a, t.id, s) || ((ve = M.data) == null ? void 0 : ve.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Te(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Te(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Hd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(gi, {
        assignments: u.map((Z) => {
          const X = nd(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: X.label,
            performer: X.filled ? { id: Number(Z.performerId), name: X.performer } : null,
            title: X.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Jd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: w
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
          (oe = M.data.parents) != null && oe.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...M.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => z(Z.itemId),
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
          disabled: a != null || !g || u.length === 0,
          onClick: () => fe(!0),
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
    Y && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && ye();
      },
      onKeyDownCapture: (Z) => {
        var U, se;
        if (!(typeof ((U = Z.target) == null ? void 0 : U.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((se = J.current) != null && se.call(J, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        At(Z, {
          onCancel: ye,
          onConfirm: () => {
            var $;
            return ($ = V.current) == null ? void 0 : $.click();
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
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(qd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ce = m.performerSlotRevisions) == null ? void 0 : ce[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: V,
        shortcutRef: J,
        onOptimisticSave: (Z) => {
          I((U) => Wr(
            U,
            t.id,
            Z
          ), p.id);
          const X = K("slots", t.id);
          if (!X)
            return x("Wait for the current save to finish before saving performer slots."), !1;
          ie.current = X, x("Saving performer slots…"), ye();
        },
        onSaved: async (Z, { beforeState: X, afterState: U }) => {
          I((se) => Wr(
            se,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), x("Performer slots saved.");
          try {
            await T(
              "performer-slots.assign",
              "Assigned performers",
              X,
              U
            ), await F(Z) || A([t]);
          } finally {
            ae();
          }
        },
        onRollback: async (Z, X) => {
          A([t]), I((U) => {
            var se;
            return Wr(
              U,
              t.id,
              Z,
              (se = m.performerSlotRevisions) == null ? void 0 : se[t.id]
            );
          }, p.id), x(X.message || "Unable to save performer slots.");
          try {
            X.status === 409 && await F();
          } finally {
            ae();
          }
        },
        onConflict: F
      }))
    ])) : null
  ]);
}
function bc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: y, onSelectAll: h, onConfigureTag: I, onSeekTime: x, centerRef: K, showReviewState: F = !0, swimlaneTitleWidth: T, onSwimlaneTitleWidthChange: A }) {
  const C = ge(null), S = ge(null), [w, M] = j(0), [z, re] = j({ scrollTop: 0, height: 320 }), [L, E] = j(null), R = ze(
    () => dn(e, r, o),
    [e, r, o]
  ), _ = ze(
    () => ci(o),
    [o]
  ), ie = ze(() => fo(R), [R]), ae = ze(
    () => sd(ie, i, r.length > 0),
    [ie, i, r.length]
  ), be = ze(
    () => ui(ae.rows, Math.max(0, z.scrollTop - 24), z.height),
    [ae, z]
  ), V = Math.max(0, Number(d) || 0), J = As(w), ne = hr(T, J), Y = ne / 16, fe = $s(c, V, Y), ye = ks(V), ve = ws(V, Math.max(1, w - Y * 16), g), oe = ye.filter((k, v) => v === 0 || v % ve === 0), ue = ze(() => R.map((k) => `${k.key}:${k.trackCount}:${k.markers.map(({ segment: v, track: P }) => `${v.id}:${v.startSec}:${v.endSec ?? ""}:${P}`).join(",")}`).join("|"), [R]);
  function ce() {
    const k = S.current;
    if (!k) return;
    const v = k.querySelector("[data-timeline-track]"), P = k.firstElementChild, le = v == null ? void 0 : v.getBoundingClientRect(), B = P == null ? void 0 : P.getBoundingClientRect(), H = le && B ? Math.max(0, le.left - B.left) : Y * 16, q = (B == null ? void 0 : B.width) ?? k.scrollWidth;
    k.scrollTo({
      left: Cs(c, V, q, k.clientWidth, H, Ba),
      behavior: "smooth"
    });
  }
  pe(() => (K.current = ce, () => {
    K.current === ce && (K.current = null);
  })), pe(() => {
    ce();
  }, [g]);
  function Z() {
    const k = S.current, v = ae.rows.find((q) => q.kind === "lane" && q.lane.markers.some(({ segment: O }) => O.id === s));
    if (!k || !v) return;
    const P = 24, le = v.top + P, B = le + v.height;
    let H = k.scrollTop;
    le < k.scrollTop + P ? H = Math.max(0, le - P) : B > k.scrollTop + k.clientHeight && (H = Math.max(0, B - k.clientHeight)), H !== k.scrollTop && (k.scrollTop = H), re({ scrollTop: H, height: k.clientHeight });
  }
  pe(() => {
    Z();
  }, [s, ue, ae]), pe(() => {
    const k = S.current, v = ae.rows.find((q) => q.kind === "group" && q.group.key === a);
    if (!k || !v) return;
    const P = 24, le = v.top + P, B = le + v.height;
    let H = k.scrollTop;
    le < k.scrollTop + P ? H = Math.max(0, le - P) : B > k.scrollTop + k.clientHeight && (H = Math.max(0, B - k.clientHeight)), H !== k.scrollTop && (k.scrollTop = H), re({ scrollTop: H, height: k.clientHeight });
  }, [a, ae]), pe(() => {
    const k = S.current;
    if (!k || typeof ResizeObserver > "u") return;
    const v = () => {
      M(k.clientWidth), re({ scrollTop: k.scrollTop, height: k.clientHeight }), Z();
    }, P = new ResizeObserver(v);
    return P.observe(k), v(), () => P.disconnect();
  }, [s, ue, ae]);
  function X(k) {
    if (!(V > 0)) return;
    const v = k.currentTarget.getBoundingClientRect(), P = Math.min(1, Math.max(0, (k.clientX - v.left) / v.width));
    x(P * V);
  }
  function U(k) {
    const v = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let P = null;
    Object.hasOwn(v, k.key) && (P = c + v[k.key]), k.key === "Home" && (P = 0), k.key === "End" && (P = V), P != null && (k.preventDefault(), k.stopPropagation(), x(Math.min(V, Math.max(0, P))));
  }
  function se(k) {
    var P;
    const v = (P = C.current) == null ? void 0 : P.getBoundingClientRect();
    v && A(hr(k.clientX - v.left, J));
  }
  function $(k) {
    const v = k.shiftKey ? 40 : 16;
    let P = null;
    k.key === "ArrowLeft" && (P = ne - v), k.key === "ArrowRight" && (P = ne + v), k.key === "Home" && (P = 160), k.key === "End" && (P = J), P != null && (k.preventDefault(), k.stopPropagation(), A(hr(P, J)));
  }
  const b = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: C,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (k) => {
          (k.metaKey || k.ctrlKey) && (k.preventDefault(), h == null || h());
        },
        onKeyDown: (k) => {
          k.key !== "Enter" && k.key !== " " || (k.preventDefault(), h == null || h());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: b, disabled: g <= 1, onClick: () => u(kr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: b, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: b, disabled: g >= 8, onClick: () => u(kr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: b, onClick: ce, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(J),
      "aria-valuenow": Math.round(ne),
      "aria-valuetext": `${Math.round(ne)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (k) => {
        k.currentTarget.setPointerCapture(k.pointerId), se(k);
      },
      onPointerMove: (k) => {
        k.currentTarget.hasPointerCapture(k.pointerId) && se(k);
      },
      onKeyDown: $,
      onDoubleClick: () => A(Tt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ne - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: S,
      onScroll: (k) => re({
        scrollTop: k.currentTarget.scrollTop,
        height: k.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ts(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${Y}rem minmax(0,1fr)`, height: "1.5rem" } }, [
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
          "aria-valuetext": Te(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: X,
          onKeyDown: U
        }, oe.map((k, v) => n("span", {
          key: k,
          className: `absolute top-0 ${Ns(v, oe.length, V > 0 ? k / V * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Is(v, oe.length, V > 0 ? k / V * 100 : 0)
        }, Te(k))).concat(t.map((k) => {
          const v = V > 0 ? k.startSec / V * 100 : 0;
          return n("button", {
            key: `shot-boundary:${k.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Te(k.startSec)} – ${Te(k.endSec)}`,
            title: `Shot boundary · ${k.source || "manual"} · ${Te(k.startSec)} – ${Te(k.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${v}%`, width: "2px" },
            onClick: (P) => {
              P.stopPropagation(), x(k.startSec);
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
            ...zo(fe),
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
        style: R.length > 0 ? { height: ae.height } : void 0
      }, [
        R.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...zo(fe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        R.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : be.map((k) => {
          var W;
          const v = k.group, P = i.includes(v.key), le = a === v.key, B = Cr(le);
          if (k.kind === "group") return n("div", {
            key: k.key,
            "data-segment-group": v.key,
            "data-segment-group-collapsed": P ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Y}rem minmax(0,1fr)`,
              backgroundColor: B,
              top: k.top,
              height: k.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (G) => {
                if (G.metaKey || G.ctrlKey) {
                  y(v.lanes.flatMap((Q) => Q.markers.map((Ce) => Ce.segment.id)));
                  return;
                }
                f(v.key), m(v.key);
              },
              "aria-expanded": !P,
              "aria-current": le ? "true" : void 0,
              "data-selected-timeline-group": le ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: v.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: B
              },
              title: `${P ? "Expand" : "Collapse"} ${v.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, P ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, v.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              P ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${v.lanes.length} swimlane${v.lanes.length === 1 ? "" : "s"} hidden`
                ),
                F ? n(Xt, { key: "states", counts: v.counts }) : null
              ] : null
            )
          ]);
          const H = k.lane, q = zl(k.laneIndex), O = H.markers.some(({ segment: G }) => G.id === s);
          return n("div", {
            key: k.key,
            "data-grouped-swimlane": v.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${Y}rem minmax(0,1fr)`,
              top: k.top,
              height: k.height,
              backgroundColor: q
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": O ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Hl(O, q),
              title: `${Jn(H)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Jn(H),
              onClick: (G) => {
                (G.metaKey || G.ctrlKey) && y(H.markers.map((Q) => Q.segment.id));
              },
              onMouseEnter: () => E(H.key),
              onMouseLeave: () => E((G) => G === H.key ? null : G)
            }, [
              H.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (G) => {
                  G.stopPropagation(), I({ tagId: H.tagId, tagName: H.label, trigger: G.currentTarget });
                },
                "aria-label": `Configure ${H.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: L === H.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.label),
              (W = H.performers) != null && W.length ? n(Tr, {
                key: "performers",
                performers: H.performers,
                performerAssignments: H.performerAssignments
              }) : null,
              F ? n(Xt, { key: "counts", counts: H.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, H.markers.map(({ segment: G, track: Q }) => {
              var Ze;
              const Ce = Jr(G.startSec, V), Pe = G.endSec == null ? G.startSec : Math.max(G.startSec, G.endSec), Ne = Math.max(0, Jr(Pe, V) - Ce), Ke = l.includes(G.id), Be = G.id === s, Ee = po(_.get(G.id)), et = G.endSec == null ? Te(G.startSec) : `${Te(G.startSec)} – ${Te(G.endSec)}`, bt = (Ze = li[Ee]) == null ? void 0 : Ze.label;
              return n("button", {
                key: G.id,
                type: "button",
                onClick: (mt) => {
                  mt.stopPropagation(), p(G, {
                    additive: mt.metaKey || mt.ctrlKey,
                    rangeSegmentIds: mt.shiftKey ? H.markers.map((rt) => rt.segment.id) : null
                  });
                },
                "aria-pressed": Ke,
                "aria-current": Be ? "true" : void 0,
                "data-selected-timeline-marker": Be ? "true" : void 0,
                "data-selected-segment-shortcut-target": Be ? "true" : void 0,
                "aria-label": F ? `${G.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${G.reviewState}${bt ? `, ${bt}` : ""}, ${et}` : `${G.tagName || "Tag segment"}${H.performerLabel ? `, ${H.performerLabel}` : ""}, ${et}`,
                title: F ? `${G.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${G.reviewState}${bt ? ` · ${bt}` : ""} · ${et}` : `${G.tagName || "Tag segment"}${H.performerLabel ? ` · ${H.performerLabel}` : ""} · ${et}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...F ? Gl(G.reviewState, Ke, Ee, Be) : Ul(Ke, Be),
                  left: `${Ce}%`,
                  top: `${ql(Q)}rem`,
                  width: Kl(G.endSec, Ne),
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
  const [a, s] = j(null), [l, d] = j([]), [c, g] = j(null), [u, f] = j(""), [m, p] = j(!0), [y, h] = j(null), [I, x] = j(""), [K, F] = j(!1), T = ge(null), A = ge(0);
  pe(() => {
    const L = requestAnimationFrame(() => {
      var E;
      return (E = T.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [e]), pe(() => {
    const L = new AbortController();
    return p(!0), x(""), Promise.all([
      r ? te(`/slot-definitions/${e}`, { signal: L.signal }) : Promise.resolve(null),
      te("/segment-groups", { signal: L.signal })
    ]).then(([E, R]) => {
      const _ = R.find((ie) => (ie.tags || []).some((ae) => Number(ae.tagId) === Number(e)));
      s(E), d(R), g((_ == null ? void 0 : _.id) ?? null), f(_ == null ? "" : String(_.id)), F(!1);
    }).catch((E) => {
      E.name !== "AbortError" && x(E.message || "Unable to load tag configuration.");
    }).finally(() => {
      L.signal.aborted || p(!1);
    }), () => L.abort();
  }, [r, e]);
  function C(L, E) {
    s({
      ...a,
      definitions: a.definitions.map((R, _) => _ === L ? { ...R, ...E } : R)
    });
  }
  function S(L, E) {
    const R = L + E;
    if (R < 0 || R >= a.definitions.length) return;
    const _ = [...a.definitions];
    [_[L], _[R]] = [_[R], _[L]], s({
      ...a,
      definitions: _.map((ie, ae) => ({ ...ie, sortOrder: ae }))
    });
  }
  function w(L) {
    const E = a.definitions[L], R = Number(E.assignmentCount) || 0, _ = R === 0 ? "" : ` and its ${R} assignment${R === 1 ? "" : "s"}`;
    window.confirm(`Delete “${Ct(E)}”${_}?`) && (R > 0 && F(!0), s({
      ...a,
      definitions: a.definitions.filter((ie, ae) => ae !== L).map((ie, ae) => ({ ...ie, sortOrder: ae }))
    }));
  }
  async function M() {
    var E;
    h("slots"), x("Saving performer slots…");
    let L;
    try {
      L = await te(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: K,
          definitions: a.definitions.map((R, _) => {
            var ie;
            return {
              id: R.id || void 0,
              label: ((ie = R.label) == null ? void 0 : ie.trim()) || null,
              sortOrder: _,
              genderHints: R.genderHints || []
            };
          })
        })
      }), s(L), F(!1);
    } catch (R) {
      R.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (E = R.payload) != null && E.current && (s(R.payload.current), F(!1))) : x(R.message || "Unable to save performer slots."), h(null);
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
  async function z() {
    const L = u === "" ? null : Number(u);
    if (L !== c) {
      h("group"), x("Saving tag group…");
      try {
        await te(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: L })
        });
      } catch (E) {
        x(E.message || "Unable to assign the tag group."), h(null);
        return;
      }
      try {
        const [E, R] = await Promise.allSettled([
          te("/segment-groups"),
          o()
        ]);
        if (E.status === "fulfilled") {
          d(E.value);
          const _ = E.value.find((ae) => (ae.tags || []).some((be) => Number(be.tagId) === Number(e))), ie = (_ == null ? void 0 : _.id) ?? null;
          g(ie), f(ie == null ? "" : String(ie));
        }
        x(
          E.status === "fulfilled" && R.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        h(null);
      }
    }
  }
  l.find((L) => Number(L.id) === Number(c));
  const re = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (L) => {
      L.target === L.currentTarget && !y && i();
    },
    onKeyDownCapture: (L) => At(L, {
      onCancel: y ? void 0 : i
    })
  }, n("section", {
    ref: T,
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
            onChange: (L) => f(L.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((L) => n("option", { key: L.id, value: String(L.id) }, L.name))
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
              onChange: (L) => s({ ...a, allowSamePerformerInMultipleSlots: L.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((L, E) => n("article", {
            key: L.id || L._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: L.label || "",
                disabled: y != null,
                onChange: (R) => C(E, { label: R.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, hs.map((R) => n("label", { key: R, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: y != null,
                  checked: (L.genderHints || []).includes(R),
                  onChange: (_) => C(E, {
                    genderHints: _.target.checked ? [.../* @__PURE__ */ new Set([...L.genderHints || [], R])] : (L.genderHints || []).filter((ie) => ie !== R)
                  })
                }),
                n("span", { key: "text" }, $r(R))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${L.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: y != null || E === 0, onClick: () => S(E, -1), className: re, "aria-label": `Move ${Ct(L)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: y != null || E === a.definitions.length - 1, onClick: () => S(E, 1), className: re, "aria-label": `Move ${Ct(L)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: y != null, onClick: () => w(E), className: `${re} text-red-300` }, "Delete")
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
              className: re
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
function hc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function vc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: y, centerTimelineRef: h, closeEditorFilters: I, closeFirstSegmentTagDialog: x, closeMaterializeDialog: K, closeMergeConfirmation: F, closePublishApprovedDialog: T, closeTagEditing: A, collapsedSegmentGroups: C, commonActionsRef: S, compatibilityMode: w, configuringTag: M, createSegment: z, creatingSegmentId: re, currentTime: L, deleteRejectedSegments: E, detail: R, detailPanelRef: _, detailWidth: ie, duplicateSegment: ae, editorFilters: be, editorLayout: V, editorRef: J, exportingExamples: ne, filtersButtonRef: Y, filtersOpen: fe, firstSegmentTagOpen: ye, focusRowRef: ve, handleSeparatorKeyDown: oe, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: ce, hasNextUnreviewed: Z, hasPreviousUnreviewed: X, hideDerivedSegments: U, history: se, historyOpen: $, historySaving: b, horizontalLayoutSize: k, importNativeSegments: v, incorrectExamples: P, incorrectExamplesOpen: le, lineage: B, markerRailWidth: H, materializeButtonRef: q, materializeCancelButtonRef: O, materializeDerivedSegments: W, materializeError: G, materializeLoading: Q, materializeOpen: Ce, materializePreview: Pe, materializing: Ne, mediaStackRef: Ke, mergeCancelButtonRef: Be, mergeConfirmation: Ee, mergeSaving: et, mergeSelectedSwimlane: bt, nativeImportState: Ze, onDetailChange: mt, onNavigate: rt, onReload: ct, onSlotsChanged: ot, openPublishApprovedDialog: ut, panelSeparatorProps: _e, pendingInitialSeekRef: ht, performerSlots: ee, performerSlotsAvailable: de, playbackControlsRef: Ae, previewDerivedSegments: $e, provenance: xe, provenanceSources: Oe, publishApprovedCancelButtonRef: Je, publishApprovedDrafts: He, publishApprovedError: Ie, publishApprovedOpen: Me, quickSearchOpen: We, railScrollRef: ke, railToggleRef: Le, recordHistoryAction: Ye, rejectedDeletionPreview: he, removeIncorrectExample: je, removingExampleId: De, restoreHistoryTarget: $t, runEditorAction: tt, saveMessage: it, saveTag: St, saveTiming: kt, savingSegmentId: Se, seekRef: we, segmentGroups: qe, segmentRailLayout: gt, segments: at, selectAllVideoSegments: _t, selectSegment: dt, selectSegmentCollection: Wt, selectedGroups: Vt, selectedPerformerSlots: wn, selectedSegment: Kt, selectedSegmentGroupKey: Nn, selectedSegmentIds: mn, selectedSegments: Jt, selectedSlotStatus: In, setAutoAssignError: tn, setAutoAssignOpen: nn, setConfiguringTag: Cn, setCurrentTime: Rr, setEditorFilters: Xn, setEditorLayout: Mr, setFiltersOpen: $n, setHideDerivedSegments: Tn, setHistoryOpen: An, setIncorrectExamplesOpen: rn, setQuickSearchOpen: er, setRailViewport: tr, setRejectedDeletionPreview: Rn, setSaveMessage: on, setSelectedSegmentGroupKey: gn, setSelectedSegmentId: Mn, setShortcutsOpen: vt, setTimelineZoom: nr, shotBoundaries: En, shortcutsOpen: rr, slotButtonRef: or, splitLayout: Et, splitSegment: Dn, startFullAnalysis: ar, stepVideoFrame: ir, tagEditing: Pn, tagSearchRef: On, timelineDuration: Ln, timelineRatioBounds: nt, timelineZoom: pt, toggleSegmentGroup: sr, toggleSegmentRail: Er, updateTimelineRatio: Dt, video: Ve, videoPerformers: lr, visibleCounts: Fn, visibleSegmentRailRows: jn, visibleSegments: pn, wideLayout: Yt, workspaceRef: Dr } = e, Bn = ze(
    () => at.filter((N) => !N.published && N.reviewState === "approved"),
    [at]
  ), dr = ps(oo), Gn = Bn.length, Bt = Pe ? Pe.createCount + Pe.linkCount : null, ft = Se != null, an = Jt.length > 0, Un = Jt.length === 1, Pr = an && Jt.every((N) => N.reviewState === "approved"), Or = an && Jt.every((N) => N.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: ft },
    { id: "marker.editTag", label: "Edit tag", disabled: ft || !an },
    { id: "marker.setStart", label: "Set start", disabled: ft || !Un },
    { id: "marker.setEnd", label: "Set end", disabled: ft || !Un },
    { id: "marker.split", label: "Split", disabled: ft || !Un },
    ...w ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !X, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Pr ? "Unapprove" : "Approve", disabled: ft || !an, tone: "approve" },
      { id: "marker.reject", label: Or ? "Unreject" : "Reject", disabled: ft || !an, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...w ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: ft || !p, tone: "reject" }
    ]
  ];
  function wt(N) {
    const Re = mn.includes(N.id), xt = N.id === (Kt == null ? void 0 : Kt.id), yt = N.endSec == null ? Te(N.startSec) : `${Te(N.startSec)} – ${Te(N.endSec)}`, Qt = `${jt(N.sourceKey)}${N.confidence != null ? ` · ${Math.round(N.confidence * 100)}%` : ""}`;
    return n("button", {
      key: N.id,
      type: "button",
      onClick: (Gt) => dt(N, { additive: Gt.metaKey || Gt.ctrlKey }),
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
          title: Qt
        }, Qt)
      ])
    ]);
  }
  const Xe = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", sn = [...se.actions || []].reverse().find((N) => N.sequence <= se.cursorSequence);
  return n("section", {
    ref: J,
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
            onClick: (N) => Si(N, rt, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ve.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ve.title || `Video ${Ve.id}`
          }, Ve.title || `Video ${Ve.id}`)),
          ...lr.map((N) => n(Yn, {
            key: lt(N),
            performer: { id: lt(N), name: N.name },
            compact: !0,
            tooltip: N.name
          })),
          w ? n(Xt, { key: "review-counts", counts: Fn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          w ? null : n(Ni, { key: "bin", onNavigate: rt, compact: !0 }),
          n(Ii, { key: "settings", onNavigate: rt, compact: !0 })
        ])
      ]),
      w && R.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${R.nativeImportCount} Cove segment${R.nativeImportCount === 1 ? "" : "s"} ${R.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Ze.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Ze.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => v("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => v("approved"),
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
            disabled: Se != null || d.length === 0,
            onClick: () => {
              tn(""), nn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          w ? n("button", {
            key: "materialize-derived",
            ref: q,
            type: "button",
            disabled: Se != null || Q || Ne || Bt === 0,
            onClick: $e,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, Q ? "Analyzing…" : `Auto-Materialize${Bt != null ? ` (${Bt})` : ""}`) : null,
          w ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: Se != null || Gn === 0,
            onClick: (N) => ut(N.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Me,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Gn ? ` (${Gn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ne || De != null || P.length === 0,
            onClick: () => rn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": le,
            "aria-label": `Open AI feedback collection, ${P.length} example${P.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${P.length ? ` (${P.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: Y,
            type: "button",
            onClick: () => $n(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": fe,
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
            disabled: (w ? se.actions.length === 0 : sn == null) || Se != null || b,
            onClick: w ? () => An((N) => !N) : () => $t(
              sn.sequence - 1
            ),
            "aria-haspopup": w ? "dialog" : void 0,
            "aria-expanded": w ? $ : void 0,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, w ? `History${se.actions.length ? ` (${se.actions.length})` : ""}` : sn ? `Undo ${sn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Le,
            type: "button",
            onClick: Er,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": V.markerRailOpen,
            className: Xe
          }, [
            n(yr, { key: "icon", name: "list" }),
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
          onClick: () => An(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...se.actions].reverse().map((N) => n("button", {
          key: N.sequence,
          type: "button",
          disabled: b,
          onClick: () => $t(N.sequence),
          "aria-current": se.cursorSequence === N.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${N.sequence > se.cursorSequence ? "text-secondary" : "text-foreground"} ${se.cursorSequence === N.sequence ? "bg-accent/15" : ""}`
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
          disabled: b,
          onClick: () => $t(se.baselineSequence),
          "aria-current": se.cursorSequence === se.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${se.cursorSequence === se.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    fe ? n(ac, {
      key: "editor-filters",
      filters: be,
      hideDerivedSegments: U,
      performers: lr,
      provenanceSources: Oe,
      reviewCounts: l,
      segments: at,
      segmentGroups: qe,
      reviewMode: w,
      onChange: Xn,
      onHideDerivedChange: Tn,
      onClose: I
    }) : null,
    ye ? n(oc, {
      key: "first-segment-tag-dialog",
      saving: Se != null,
      error: it,
      onSelect: (N, Re) => z(N, Re),
      onClose: x
    }) : null,
    We ? n(lc, {
      key: "quick-search-dialog",
      segments: Al(o),
      onSelect: (N) => {
        er(!1), dt(N, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        er(!1), requestAnimationFrame(() => {
          var N;
          return (N = J.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(uc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => nn(!1)
    }) : null,
    Ee ? n(gc, {
      key: "merge-selection-dialog",
      merge: Ee,
      processing: et,
      undoable: !w,
      cancelButtonRef: Be,
      onConfirm: (N) => bt(!0, N, Ee),
      onClose: F
    }) : null,
    Ce ? n(fc, {
      key: "materialize-derived-dialog",
      preview: Pe,
      loading: Q,
      processing: Ne,
      error: G,
      cancelButtonRef: O,
      onConfirm: W,
      onClose: () => {
        Ne || K();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Dr,
      className: `${Et ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      V.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Yt ? { position: "absolute", top: 0, right: 0, width: H, height: k.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        at.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : pn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: ke,
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
            const yt = C.includes(N.group.key), Qt = N.group.lanes.reduce((Gt, Fr) => Gt + Fr.markers.length, 0);
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
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Qt),
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
          ref: Ke,
          className: `${Et ? "min-h-0 flex-1" : ""} grid`,
          style: Et ? {
            gridTemplateRows: `minmax(16rem, ${(1 - V.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${V.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ve,
            className: "grid min-h-0 gap-2",
            style: Yt ? {
              gridTemplateColumns: V.markerRailOpen ? `${ie}px 0.5rem minmax(0,1fr) 0.5rem ${H}px` : `${ie}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(yc, {
              key: "tools",
              compatibilityMode: w,
              selectedSegment: Kt,
              selectedSegments: Jt,
              selectedGroups: Vt,
              saveMessage: it,
              savingSegmentId: Se,
              creatingSegmentId: re,
              acquireSaveLock: t,
              setSaveMessage: on,
              saveTag: St,
              slotStatus: In,
              performerSlotsAvailable: de,
              selectedPerformerSlots: wn,
              performerSlots: ee,
              detail: R,
              onDetailChange: mt,
              onCancelQueuedReview: m,
              video: Ve,
              slotButtonRef: or,
              tagSearchRef: On,
              tagEditing: Pn,
              onCancelTagEditing: A,
              detailPanelRef: _,
              onReduceSelection: (N) => {
                dt(N), requestAnimationFrame(() => {
                  var Re;
                  return (Re = _.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
                });
              },
              saveTiming: kt,
              onSlotsChanged: ot,
              onRecordHistory: Ye,
              splitSegment: Dn,
              duplicateSegment: ae,
              provenance: xe,
              lineage: B,
              onNavigateLineageItem: (N) => {
                const Re = at.find((xt) => xt.itemId === N);
                Re && Mn(Re.id);
              }
            }),
            Yt ? n(
              "div",
              { key: "detail-separator", ..._e("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ve.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n($a, {
                streamUrl: `/api/stream/video/${Ve.id}`,
                posterUrl: `/api/stream/video/${Ve.id}/screenshot?v=${encodeURIComponent(Ve.updatedAt || "")}`,
                format: Ve.videoFile.format,
                audioCodec: Ve.videoFile.audioCodec,
                duration: Ve.videoFile.duration,
                videoId: Ve.id,
                trackingEnabled: !1,
                onSeekRegister: (N) => {
                  we.current = N, Il(ht.current, at, N) && (ht.current = null);
                },
                onPlaybackControlRegister: (N) => {
                  Ae.current = N;
                },
                onTimeUpdate: Rr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Yt && V.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ..._e("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Yt && V.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
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
                onClick: (Qt) => {
                  const Gt = Qt.currentTarget;
                  tt(N.id, { target: Gt, preserveFocus: !0 }), N.focusWhenDisabled && requestAnimationFrame(() => {
                    hc(Gt, S.current, N.focusWhenDisabled);
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
                disabled: !Ve.videoFile,
                onClick: () => ir(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(fs, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ve.videoFile,
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
            "aria-valuemin": Math.round(nt.minimum * 100),
            "aria-valuemax": Math.round(nt.maximum * 100),
            "aria-valuenow": Math.round(V.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(V.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ue,
            onPointerMove: ce,
            onKeyDown: oe,
            onDoubleClick: () => Dt(Tt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Et ? void 0 : { height: "20rem" } }, n(bc, {
            segments: pn,
            shotBoundaries: En,
            segmentGroups: qe,
            performerSlots: ee,
            collapsedGroupKeys: C,
            selectedGroupKey: Nn,
            selectedSegmentId: Kt == null ? void 0 : Kt.id,
            selectedSegmentIds: mn,
            duration: Ln,
            currentTime: L,
            zoom: pt,
            onZoomChange: nr,
            onSelectGroup: gn,
            onToggleGroup: sr,
            onSelect: (N, Re) => dt(N, Re),
            onSelectSegments: Wt,
            onSelectAll: _t,
            onConfigureTag: (N) => Cn(N),
            onSeekTime: (N) => {
              var Re;
              return (Re = we.current) == null ? void 0 : Re.call(we, N, !1);
            },
            centerRef: h,
            showReviewState: w,
            swimlaneTitleWidth: V.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (N) => Mr((Re) => ({ ...Re, swimlaneTitleWidth: N }))
          }))
        ])
      ])
    ]),
    M ? n(bo, {
      key: `configure-tag:${M.tagId}`,
      tagId: M.tagId,
      tagName: M.tagName,
      performerSlotsEnabled: w,
      onSaved: ct,
      onClose: () => {
        const N = M.trigger;
        Cn(null), requestAnimationFrame(() => {
          var Re;
          N != null && N.isConnected ? N.focus({ preventScroll: !0 }) : (Re = J.current) == null || Re.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Me ? n(cc, {
      key: "publish-approved-dialog",
      drafts: Bn,
      processing: Se === -1,
      error: Ie,
      cancelButtonRef: Je,
      onConfirm: He,
      onClose: T
    }) : null,
    he ? n(mc, {
      key: "rejected-deletion-dialog",
      preview: he,
      onConfirm: () => {
        E(he), requestAnimationFrame(() => {
          var N;
          return (N = J.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Rn(null), requestAnimationFrame(() => {
          var N;
          return (N = J.current) == null ? void 0 : N.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    rr ? n(ic, {
      key: "shortcuts-dialog",
      reviewMode: w,
      bindings: dr,
      onClose: () => vt(!1)
    }) : null,
    le ? n(sc, {
      key: "incorrect-examples-dialog",
      examples: P,
      exporting: ne,
      removingExampleId: De,
      onExport: y,
      onRemove: je,
      onClose: () => rn(!1)
    }) : null
  ]);
}
function xc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: y, setSelectedSegmentId: h, setSelectedSegmentIds: I } = e;
  function x(C) {
    const S = Lt(t, C);
    S && u((w) => pi(w, S));
  }
  function K(C) {
    h(C), I(C == null ? [] : [C]), c.current = C, g.current = [];
  }
  function F(C, {
    focusEditor: S = !1,
    seekToSegment: w = !1,
    additive: M = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var L, E;
    const re = zs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, C.id, z, M);
    I(re.selectedSegmentIds), h(re.activeSegmentId), c.current = re.anchorSegmentId, g.current = re.rangeBaseSegmentIds, re.activeSegmentId != null && y(Lt(t, re.activeSegmentId)), x(C.id), S && ((L = r.current) == null || L.focus({ preventScroll: !0 })), w && ((E = i.current) == null || E.call(i, C.startSec, !1));
  }
  function T(C) {
    const S = Us(
      d,
      l,
      C
    );
    I(S.selectedSegmentIds), h(S.activeSegmentId), c.current = S.activeSegmentId, g.current = [], S.activeSegmentId != null && (y(Lt(t, S.activeSegmentId)), x(S.activeSegmentId));
  }
  function A() {
    var w;
    const C = qs(s), S = C.includes(l) ? l : C[0] ?? null;
    f(Mt({})), m(!1), I(C), h(S), c.current = S, g.current = [], S != null && y(Lt(
      dn(s, a, o),
      S
    )), p(C.length === 0 ? "There are no segments to select." : `${C.length} segments selected. Collapsed Segment groups keep their selected segments.`), (w = r.current) == null || w.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: K, selectSegment: F, selectSegmentCollection: T, selectAllVideoSegments: A };
}
function Sc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: y, selectedGroups: h, selectedSegment: I, selectedSegmentIdRef: x, selectedSegments: K, selectionAnchorIdRef: F, selectionRangeBaseIdsRef: T, setMergeConfirmation: A, setSaveMessage: C, setSelectedSegmentId: S, setSelectedSegmentIds: w, video: M } = e;
  function z() {
    A(null), requestAnimationFrame(() => {
      var R;
      return (R = a.current) == null ? void 0 : R.focus({ preventScroll: !0 });
    });
  }
  async function re(R = !1, _ = !1, ie = null) {
    if (y != null) return;
    const ae = ie || mi(
      h,
      { nativeOnly: !o }
    );
    if (!ae) {
      C("Select at least two segments from one swimlane.");
      return;
    }
    if (!R && Ka()) {
      A(ae);
      return;
    }
    _ && za(!1);
    const be = ae.endSec == null ? "open end" : Te(ae.endSec);
    let V = ae.segments[0];
    const J = o ? null : Rt(ae.segments, !1), ne = o ? null : crypto.randomUUID(), Y = ae.segments.map((ue) => ue.id), fe = wd(i, ae.segments).segments.find((ue) => ue.id === V.id), ye = {
      startSec: fe.startSec,
      endSec: fe.endSec,
      sourceKey: fe.sourceKey,
      sourceRunId: fe.sourceRunId,
      confidence: fe.confidence,
      isDerived: fe.isDerived
    }, ve = r("merge", ae.segments[0].id);
    if (!ve) return;
    z();
    const oe = qt();
    s({
      type: "add",
      entry: { id: oe, op: "merge", targets: ae.segments.map(Ot), values: ye }
    }), w([V.id]), S(V.id), F.current = V.id, T.current = [];
    try {
      const ue = ae.segments.slice(1);
      if (!o || V.nativeSegmentId != null) {
        const ce = ue.map((X) => {
          const U = `merge-native-selection:${M.id}:${V.id}:${X.id}:${V.updatedAt}:${X.updatedAt}`;
          return { key: U, operationId: Ge(U), segmentId: X.id, expectedUpdatedAt: X.updatedAt };
        }), Z = await te(`/videos/${M.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: V.id,
            expectedSurvivorUpdatedAt: V.updatedAt,
            consumedSegments: ce.map(({ key: X, ...U }) => U),
            historyReceiptId: ne
          })
        });
        V = Z.survivor, u((X) => ia(X, Z), M.id), s({ type: "settle", key: oe }), ce.forEach(({ key: X }) => Ue(X));
      } else {
        const ce = ue.map((X) => {
          const U = `merge-draft-selection:${M.id}:${V.itemId}:${X.itemId}:${V.revision}:${X.revision}`;
          return { key: U, operationId: Ge(U), itemId: X.itemId, expectedRevision: X.revision };
        }), Z = await te(`/videos/${M.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: V.itemId,
            expectedSurvivorRevision: V.revision,
            consumedDrafts: ce.map(({ key: X, ...U }) => U)
          })
        });
        V = Z.survivor, u((X) => ia(X, Z), M.id), s({ type: "settle", key: oe }), ce.forEach(({ key: X }) => Ue(X));
      }
      w([V.id]), S(V.id), F.current = V.id, T.current = [], o ? t(zt) : await m(
        "segments.merge",
        `Merged ${ae.segments.length} segments`,
        J,
        Rt([V], !1),
        ne
      ), p(V.id), C(`${ae.segments.length} segments merged into ${Te(ae.startSec)} – ${be}.`);
    } catch (ue) {
      s({ type: "discard", key: oe }), w(Y), S((I == null ? void 0 : I.id) ?? Y[0] ?? null), F.current = (I == null ? void 0 : I.id) ?? Y[0] ?? null, T.current = [], ue.status === 409 ? await g() : C(ue.message || "Unable to merge selected segments.");
    } finally {
      ve();
    }
  }
  function L(R, _ = K, ie = I) {
    if (_.length === 0) return Promise.resolve(null);
    const ae = ol(R, _, ie), be = Math.max(0, ae.identities.indexOf(ae.activeIdentity)), V = bi(d()) != null, J = l({
      kind: "review",
      lockId: ae.activeIdentity.id,
      targets: ae.identities,
      whenBusy: "enqueue",
      // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
      run: (ne) => E(ne, {
        ...ae,
        identities: ne.targets,
        activeIdentity: ne.targets[be]
      })
    });
    return J ? (V && C(`${R === "approved" ? "Approval" : "Rejection"} queued…`), J.done) : (C("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function E({ detail: R, segments: _, onConflict: ie, onReload: ae }, be) {
    var Z;
    const V = al(be, _);
    if (!V) {
      C("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: J, selectedSegments: ne, selectedSegment: Y } = V, fe = rl(ne, J), ye = ne.filter((X) => X.reviewState !== fe);
    if (ye.length === 0) return;
    const ve = ne.map((X) => ({
      id: X.id,
      itemId: X.itemId,
      nativeSegmentId: X.nativeSegmentId
    })), oe = ve.find((X) => X.id === (Y == null ? void 0 : Y.id)) || ve[0], ue = (X, U = !1) => {
      if (!(X != null && X.segments) || !U && !Zr(x.current, oe.id))
        return;
      const se = ve.map((b) => Qe(X == null ? void 0 : X.segments, b)).filter(Boolean), $ = Qe(X == null ? void 0 : X.segments, oe) || se[0] || null;
      w(se.map((b) => b.id)), S(($ == null ? void 0 : $.id) ?? null), F.current = ($ == null ? void 0 : $.id) ?? null, T.current = [];
    };
    C(`Updating ${ye.length} selected segment${ye.length === 1 ? "" : "s"}…`);
    const ce = qt();
    s({
      type: "add",
      entry: { id: ce, op: "patch", targets: ye.map(Ot), values: { reviewState: fe } }
    });
    try {
      const X = await te(`/videos/${M.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: fe,
          segments: ne.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), U = new Map((X.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (ve.forEach((b) => {
        const k = U.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        k && (b.nativeSegmentId = k.nativeSegmentId, b.itemId = k.itemId);
      }), X.history && t(X.history), fe === "rejected" || (X.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        ue(await ae()), s({ type: "settle", key: ce }), C(`${X.updatedCount} selected segment${X.updatedCount === 1 ? "" : "s"} ${fe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const $ = (b) => ({
        ...b,
        approvedSetVersion: X.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((k) => {
          const v = U.get(k.nativeSegmentId != null ? `native:${k.nativeSegmentId}` : `item:${k.itemId}`);
          return v ? {
            ...k,
            id: v.nativeSegmentId != null ? v.nativeSegmentId : -v.itemId,
            itemId: v.itemId,
            nativeSegmentId: v.nativeSegmentId,
            published: v.nativeSegmentId != null,
            reviewState: fe,
            revision: v.nativeSegmentId != null ? k.revision : v.revision,
            updatedAt: v.updatedAt
          } : k;
        })
      });
      u($, M.id), s({ type: "settle", key: ce }), ue($(R)), C(`${X.updatedCount} selected segment${X.updatedCount === 1 ? "" : "s"} ${fe === "approved" ? "approved" : fe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (X) {
      s({ type: "discard", key: ce }), X.status === 409 && ((Z = X.payload) != null && Z.currentHistory) && t(X.payload.currentHistory);
      const U = X.status === 409 ? await ie() : R;
      ue(U, !0), C(X.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: re, saveSelectedReviewState: L };
}
function kc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, cancelSaveTasks: p, dispatchPendingChanges: y, enqueueSave: h, exportingExamples: I, hideDerivedSegments: x, incorrectExamples: K, lineage: F, materializeButtonRef: T, materializePreview: A, materializeRestoreFocusRef: C, materializing: S, mutateSegment: w, runSegmentMutation: M, pendingChanges: z, onConflict: re, onDetailChange: L, onReload: E, performerSlots: R, recordHistoryAction: _, refreshMaterializationPreview: ie, removingExampleId: ae, revealSegmentGroupForSelection: be, savingSegmentId: V, segmentGroups: J, segments: ne, selectedSegment: Y, selectedSegmentIdRef: fe, selectedSegments: ye, selectionAnchorIdRef: ve, selectionRangeBaseIdsRef: oe, setAutoAssignError: ue, setAutoAssignOpen: ce, setAutoAssigning: Z, setEditorFilters: X, setExportingExamples: U, setHideDerivedSegments: se, setIncorrectExamples: $, setMaterializeError: b, setMaterializeLoading: k, setMaterializeOpen: v, setMaterializePreview: P, setMaterializing: le, setRejectedDeletionPreview: B, setRemovingExampleId: H, setSaveMessage: q, setSelectedSegmentGroupKey: O, setSelectedSegmentId: W, setSelectedSegmentIds: G, video: Q } = e;
  async function Ce() {
    var ke, Le, Ye;
    if (ye.length === 0 || !Y || V != null) return;
    const ee = yd(ye, K), de = ee.segments;
    if (de.length === 0) return;
    const Ae = ye.map((he) => ({
      id: he.id,
      itemId: he.itemId,
      nativeSegmentId: he.nativeSegmentId
    })), $e = Ae.find((he) => he.id === Y.id) || Ae[0], xe = [], Oe = [];
    let Je = !1, He = u, Ie = !1;
    const Me = [], We = r("feedback", $e.id);
    if (We) {
      q(ee.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const he = async (Se, we) => {
          const qe = Se.nativeSegmentId != null, gt = ee.action === "remove" ? `incorrect-example-remove:${Q.id}:${we == null ? void 0 : we.id}:${we == null ? void 0 : we.revision}:${we == null ? void 0 : we.representationRevision}` : `incorrect-example-collect:${Q.id}:${qe ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`}`;
          if (ee.action === "remove" && !we)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let at;
          try {
            at = ee.action === "remove" ? await te(
              `/videos/${Q.id}/incorrect-examples/${we.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Ge(gt),
                  expectedExampleRevision: we.revision,
                  expectedRepresentationRevision: we.representationRevision
                })
              }
            ) : await te(`/videos/${Q.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ge(gt),
                nativeSegmentId: qe ? Se.nativeSegmentId : null,
                itemId: qe ? null : Se.itemId,
                expectedUpdatedAt: qe ? Se.updatedAt : null,
                expectedRevision: qe ? null : Se.revision
              })
            });
          } catch (_t) {
            throw _t.operationKey = gt, _t;
          }
          if (!bd(ee.action, at))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ue(gt), at;
        };
        for (const Se of de) {
          const we = ee.action === "remove" ? K.find((qe) => qe.itemId != null && qe.itemId === Se.itemId) : null;
          try {
            const qe = Ae.find((dt) => dt.id === Se.id);
            let gt = Qe(
              He == null ? void 0 : He.segments,
              qe
            ) || Se, at;
            try {
              at = await he(gt, we);
            } catch (dt) {
              if (dt.status === 409 && ((Le = (ke = dt.payload) == null ? void 0 : ke.result) == null ? void 0 : Le.code) === "OPERATION_REPLAYED")
                He = await te(
                  `/videos/${Q.id}/editor`
                ), Ie = !0, Me.length = 0, Ue(dt.operationKey), at = dt.payload.result;
              else {
                if (ee.action !== "collect" || dt.status !== 409) throw dt;
                const Wt = await te(
                  `/videos/${Q.id}/editor`
                );
                He = Wt, Ie = !0, Me.length = 0;
                const Vt = Qe(
                  Wt == null ? void 0 : Wt.segments,
                  qe
                );
                if (!Vt) throw dt;
                gt = Vt, at = await he(gt, null);
              }
            }
            qe && at.itemId != null && (qe.itemId = at.itemId), He = vr(
              He,
              at.editorDelta
            ), Me.push(at.editorDelta);
            const _t = { segment: Se, result: at, example: we };
            xe.push(_t);
          } catch (qe) {
            if (Oe.push(qe), ![400, 404, 409].includes(qe.status)) break;
          }
        }
        if (c && xe.length > 0) {
          const Se = ee.action === "remove", we = xe.length;
          await _(
            Se ? "feedback.remove" : "feedback.collect",
            Se ? `Removed ${we} incorrect AI example${we === 1 ? "" : "s"}` : `Collected ${we} incorrect AI example${we === 1 ? "" : "s"}`,
            pr(xe, Se),
            pr(xe, !Se)
          ) || (Je = !0);
        }
        xe.some(({ result: Se }) => Se.representation === "basicNativeBin") && _n();
        const je = Zr(
          fe.current,
          $e.id
        ), De = ee.action === "collect" && xe.some(({ segment: Se }) => Se.id === $e.id), $t = xe.map(({ segment: Se }) => Se.id), tt = De ? Ws(
          o,
          $t,
          $e.id
        ) : null, it = De ? (tt == null ? void 0 : tt.id) ?? null : $e.id;
        je && De && (G(tt ? [tt.id] : []), W((tt == null ? void 0 : tt.id) ?? wr), ve.current = (tt == null ? void 0 : tt.id) ?? null, oe.current = []);
        const St = await te(`/videos/${Q.id}/incorrect-examples`);
        $(St);
        const kt = He;
        if (L(Ie ? kt : (Se) => Me.reduce(vr, Se), Q.id), je && Zr(
          fe.current,
          it
        )) {
          let Se, we;
          De ? (we = tt ? Qe(kt == null ? void 0 : kt.segments, {
            id: tt.id,
            itemId: tt.itemId,
            nativeSegmentId: tt.nativeSegmentId
          }) : null, Se = we ? [we] : []) : (Se = Ae.map((qe) => Qe(kt == null ? void 0 : kt.segments, qe)).filter(Boolean), we = Qe(kt == null ? void 0 : kt.segments, $e) || Se[0] || null), G(Se.map((qe) => qe.id)), W((we == null ? void 0 : we.id) ?? (De ? wr : null)), ve.current = (we == null ? void 0 : we.id) ?? null, oe.current = [], O(we ? Lt(o, we.id) : null), we && be(we.id);
        }
        if (Oe.length > 0) {
          const Se = ((Ye = Oe[0]) == null ? void 0 : Ye.message) || "Only segments with registered AI provenance can be collected.";
          xe.length === 0 ? q(Se) : ee.action === "remove" ? q(
            `Partially removed ${xe.length} of ${de.length} selected incorrect examples. ${Se}`
          ) : q(
            `Partially collected ${xe.length} of ${de.length} selected segments. ${Se}`
          );
        } else if (ee.action === "remove")
          q(
            `${xe.length} incorrect example${xe.length === 1 ? "" : "s"} removed and ${xe.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Se = xe.filter(({ result: we }) => we.representation === "basicNativeBin").length;
          q(Se === xe.length ? `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${xe.length} incorrect AI example${xe.length === 1 ? "" : "s"} collected and ${xe.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Je && q("The change saved, but editor history could not be updated.");
      } catch (he) {
        q(he.message || "Unable to update the selected incorrect examples.");
      } finally {
        We();
      }
    }
  }
  async function Pe(ee) {
    if (!ee || ae != null || I) return;
    const de = r("feedback", -1);
    if (!de) {
      q("Wait for the current save to finish before removing the incorrect example.");
      return;
    }
    try {
      await Ne(ee);
    } finally {
      de();
    }
  }
  async function Ne(ee) {
    var Ae, $e;
    H(ee.id);
    const de = `incorrect-example-remove:${Q.id}:${ee.id}:${ee.revision}:${ee.representationRevision}`;
    try {
      let xe, Oe = !1;
      try {
        xe = await te(
          `/videos/${Q.id}/incorrect-examples/${ee.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ge(de),
              expectedExampleRevision: ee.revision,
              expectedRepresentationRevision: ee.representationRevision
            })
          }
        );
      } catch (Ie) {
        if (Ie.status !== 409 || (($e = (Ae = Ie.payload) == null ? void 0 : Ae.result) == null ? void 0 : $e.code) !== "OPERATION_REPLAYED")
          throw Ie;
        xe = Ie.payload.result, Oe = !0;
      }
      Ue(de);
      let Je = !0;
      if (c) {
        const Me = [{ segment: Qe(u.segments, {
          itemId: ee.itemId
        }) || {
          id: ee.itemId == null ? null : -ee.itemId,
          itemId: ee.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: ee.representationRevision
        }, result: xe, example: ee }];
        Je = await _(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          pr(Me, !0),
          pr(Me, !1)
        );
      }
      const He = await te(
        `/videos/${Q.id}/incorrect-examples`
      );
      $(He), Oe ? await E() : L(
        (Ie) => vr(Ie, xe.editorDelta),
        Q.id
      ), ee.representation === "basicNativeBin" && _n(), q(Je ? Oe ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : ee.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (xe) {
      xe.status === 409 && await re(), q(xe.message || "Unable to remove the incorrect example.");
    } finally {
      H(null);
    }
  }
  async function Ke() {
    if (I || ae != null || K.length === 0) return;
    U(!0);
    const ee = `incorrect-example-export:${Q.id}:${K.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await vd(
        Q.id,
        K
      ), Ae = new FormData();
      Ae.append("metadata", JSON.stringify({
        operationId: Ge(ee),
        examples: de.captures
      }));
      for (const Ie of de.files)
        Ae.append(Ie.fieldName, Ie.file);
      const $e = await te(
        `/videos/${Q.id}/incorrect-examples/export`,
        { method: "POST", body: Ae }
      ), xe = await Ll($e.downloadUrl), Oe = URL.createObjectURL(xe.blob), Je = document.createElement("a");
      Je.href = Oe, Je.download = xe.fileName, Je.click(), setTimeout(() => URL.revokeObjectURL(Oe), 1e3);
      const He = await te(
        `/training-exports/${$e.id}/complete`,
        { method: "POST" }
      );
      Ue(ee), $(await te(
        `/videos/${Q.id}/incorrect-examples`
      )), q(
        `Downloaded ${$e.exampleCount} incorrect example${$e.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${He.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      q(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      U(!1);
    }
  }
  async function Be(ee = null) {
    const de = ne.filter((ke) => ke.reviewState === "rejected"), Ae = de.length, $e = K.some((ke) => ke.representation === "fullItem");
    if (ee == null && Ae === 0 && !$e) {
      q("There are no rejected segments to delete.");
      return;
    }
    if (ee == null) {
      const ke = r("delete-rejected", -1);
      if (!ke) return;
      q("Preparing deletion summary…");
      try {
        const Le = await te(`/videos/${Q.id}/rejected/deletion/preview`, { method: "POST" }), Ye = Number(Le.deletedSegmentCount) || 0, he = Number(Le.deferredRejectedSegmentCount) || 0, je = Number(Le.protectedIncorrectExampleCount) || 0;
        if (Ye === 0) {
          he > 0 ? q(
            `${he} feedback-protected rejected segment${he === 1 ? "" : "s"} kept. ${je} AI feedback example${je === 1 ? "" : "s"} must be exported before ${he === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : q("There are no rejected segments to delete.");
          return;
        }
        if (!ri(Le, q)) return;
        B(Le), q("");
      } catch (Le) {
        q(Le.message || "Unable to prepare rejected segment deletion.");
      } finally {
        ke();
      }
      return;
    }
    const xe = ee, Oe = Number(xe.deferredRejectedSegmentCount) || 0, Je = fe.current, He = Oe === 0 ? kd(u, de.map((ke) => ke.id)) : u, Ie = He.segments.find((ke) => ke.reviewState === "unreviewed") || He.segments[0] || null, Me = r("delete-rejected", -1);
    if (!Me) return;
    B(null), q("Deleting rejected segments…");
    const We = Oe === 0 ? qt() : null;
    We && (y({
      type: "add",
      entry: { id: We, op: "remove", targets: de.map(Ot) }
    }), G(Ie ? [Ie.id] : []), W((Ie == null ? void 0 : Ie.id) ?? null), ve.current = (Ie == null ? void 0 : Ie.id) ?? null, oe.current = []);
    try {
      const ke = `rejected-dependency-delete:${Q.id}:${xe.fingerprint}`, Le = await te(`/videos/${Q.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(ke),
          fingerprint: xe.fingerprint
        })
      });
      Ue(ke), await E(), We && y({ type: "settle", key: We }), Le.deletedSegmentCount > 0 && t(zt);
      const Ye = Oe > 0 ? ` ${Oe} feedback-protected rejected segment${Oe === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      q(`${Le.deletedSegmentCount} segment${Le.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ye}`);
    } catch (ke) {
      We && y({ type: "discard", key: We }), G(Je == null ? [] : [Je]), W(Je), ve.current = Je, oe.current = [], q(ke.message || "Unable to delete rejected segments.");
    } finally {
      Me();
    }
  }
  async function Ee(ee = i) {
    if (a || ee.length === 0) return;
    const de = r("auto-assign", -1);
    if (!de) {
      ue("Wait for the current save to finish before assigning performers.");
      return;
    }
    try {
      await et(ee);
    } finally {
      de();
    }
  }
  async function et(ee) {
    Z(!0), ue("");
    try {
      const de = await te(`/videos/${Q.id}/segments/auto-assign-performer-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nativeSegmentIds: ee.flatMap((Ae) => Ae.nativeSegmentId == null ? [] : [Ae.nativeSegmentId]),
          itemIds: ee.flatMap((Ae) => Ae.published || Ae.itemId == null ? [] : [Ae.itemId])
        })
      });
      ce(!1), await E(), q(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
    } catch (de) {
      ue(de.message || "Unable to auto-assign performers.");
    } finally {
      Z(!1);
    }
  }
  async function bt() {
    v(!0), b(""), !A && (k(!0), ie());
  }
  function Ze() {
    C.current = !0, v(!1), requestAnimationFrame(() => {
      var ee;
      return (ee = T.current) == null ? void 0 : ee.focus({ preventScroll: !0 });
    });
  }
  async function mt() {
    if (!A || S || A.createCount + A.linkCount === 0)
      return;
    const ee = r("materialize", -1);
    if (!ee) {
      b("Wait for the current save to finish before materializing derived segments.");
      return;
    }
    try {
      await rt();
    } finally {
      ee();
    }
  }
  async function rt() {
    le(!0), b("");
    let ee;
    try {
      const de = `materialize-derived:${Q.id}:${A.fingerprint}`;
      ee = await te(`/videos/${Q.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(de),
          fingerprint: A.fingerprint,
          maxDepth: 3
        })
      }), Ue(de);
    } catch (de) {
      de.status === 409 && P(null), b(de.message || "Unable to materialize derived segments."), le(!1);
      return;
    }
    P((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await E(), Ze(), P(null);
      const de = ee.createdCount + ee.linkedCount;
      q(`${ee.createdCount} derived segment${ee.createdCount === 1 ? "" : "s"} created and ${ee.linkedCount} existing segment${ee.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && q("Every applicable derivation was already materialized.");
    } catch {
      b("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    le(!1);
  }
  async function ct(ee, de = null) {
    var xe, Oe, Je, He;
    const Ae = {
      tagId: ee,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (ye.length > 1) {
      const Ie = ye.filter((he) => he.tagId !== ee);
      if (Ie.length === 0) {
        d();
        return;
      }
      const Me = ye.map((he) => ({
        id: he.id,
        itemId: he.itemId,
        nativeSegmentId: he.nativeSegmentId
      })), We = ye.map((he) => !c || he.nativeSegmentId != null ? `native:${he.nativeSegmentId}:${he.updatedAt}` : `item:${he.itemId}:${he.revision}`).sort().join(","), ke = `bulk-tag:${Q.id}:${ee}:${We}`, Le = r("tag", (Y == null ? void 0 : Y.id) ?? Ie[0].id);
      if (!Le) return;
      q(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const Ye = qt();
      y({
        type: "add",
        entry: { id: Ye, op: "patch", targets: Ie.map(Ot), values: Ae }
      }), d();
      try {
        const he = c ? null : crypto.randomUUID();
        await te(`/videos/${Q.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(ke),
            tagId: ee,
            historyReceiptId: he,
            segments: ye.map((it) => {
              const St = !c || it.nativeSegmentId != null;
              return {
                nativeSegmentId: St ? it.nativeSegmentId : null,
                itemId: St ? null : it.itemId,
                expectedUpdatedAt: St ? it.updatedAt : null,
                expectedRevision: St ? null : it.revision
              };
            })
          })
        }), Ue(ke);
        const je = Rt(
          ye,
          c
        ), De = await E();
        y({ type: "settle", key: Ye });
        const $t = Me.map((it) => Qe(De == null ? void 0 : De.segments, it)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          je,
          Rt($t, c),
          he
        );
        const tt = Me.map((it) => Qe(De == null ? void 0 : De.segments, it)).filter(Boolean);
        G(tt.map((it) => it.id)), W(((xe = tt.find((it) => it.id === (Y == null ? void 0 : Y.id))) == null ? void 0 : xe.id) ?? ((Oe = tt[0]) == null ? void 0 : Oe.id) ?? null), d(), q(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (he) {
        y({ type: "discard", key: Ye });
        const je = Me.map(($t) => Qe(u.segments, $t)).filter(Boolean), De = Qe(u.segments, {
          id: Y == null ? void 0 : Y.id,
          itemId: Y == null ? void 0 : Y.itemId,
          nativeSegmentId: Y == null ? void 0 : Y.nativeSegmentId
        }) || je[0] || null;
        G(je.map(($t) => $t.id)), W((De == null ? void 0 : De.id) ?? null), ve.current = (De == null ? void 0 : De.id) ?? null, oe.current = [], he.status === 409 && await re(), q(he.message || "Unable to change the selected segment tags.");
      } finally {
        Le();
      }
      return;
    }
    if (ye.length !== 1 || !Y) return;
    const $e = hi(z, Y);
    if (Y.id === g || $e) {
      const Ie = $e ? { segmentId: Y.id, tagId: $e.values.tagId, tagName: $e.meta.tagName } : null, Me = cl(Ie, Y, ee, de);
      if ($e && (p((We) => {
        var ke;
        return ((ke = We.meta) == null ? void 0 : ke.pendingChangeId) === $e.id;
      }), y({ type: "discard", key: $e.id })), Me && !ot(Y, Me)) {
        d();
        return;
      }
      if (Me) {
        const We = Ha(
          { ...Y, tagId: Me.tagId },
          R,
          f,
          x,
          J
        );
        X(We.filters), se(We.hideDerivedSegments), q("Tag change queued…");
      } else $e && q("");
      d();
      return;
    }
    if (ee === Y.tagId) {
      d();
      return;
    }
    if (Y.itemId != null && ((He = (Je = F.data) == null ? void 0 : Je.children) == null ? void 0 : He.length) > 0) {
      const Ie = r("lineage-tag", Y.id);
      if (!Ie) return;
      q("Checking lineage impact…");
      let Me;
      try {
        Me = await te(`/items/${Y.itemId}/tag-change/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expectedRevision: Y.revision, tagId: ee })
        });
      } catch (Ye) {
        Ye.status === 409 ? (q("Lineage changed — loading the latest segments…"), await re()) : q(Ye.message || "Unable to reconcile the lineage.");
        return;
      } finally {
        Ie();
      }
      const We = Me.deletedItemIds.length > 0 || Me.removedEdgeIds.length > 0;
      if (We && !window.confirm(
        `Changing this tag removes ${Me.removedEdgeIds.length} lineage edge${Me.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Me.deletedItemIds.length} derived segment${Me.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
      )) {
        q("Tag change canceled.");
        return;
      }
      const ke = r("lineage-tag", Y.id);
      if (!ke) {
        q("Wait for the current save to finish before changing the tag.");
        return;
      }
      const Le = qt();
      y({
        type: "add",
        entry: { id: Le, op: "patch", targets: [Ot(Y)], values: Ae }
      }), d();
      try {
        const Ye = `tag-change:${Y.itemId}:${Y.revision}:${Me.componentFingerprint}:${ee}`;
        await te(`/items/${Y.itemId}/tag-change/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(Ye),
            expectedRevision: Y.revision,
            componentFingerprint: Me.componentFingerprint,
            tagId: ee
          })
        }), Ue(Ye), await E(), y({ type: "settle", key: Le }), d(), q(We ? "Tag changed and lineage reconciled." : "Tag changed.");
      } catch (Ye) {
        y({ type: "discard", key: Le }), G([Y.id]), W(Y.id), ve.current = Y.id, oe.current = [], Ye.status === 409 ? (q("Lineage changed — loading the latest segments…"), await re()) : q(Ye.message || "Unable to reconcile the lineage.");
      } finally {
        ke();
      }
      return;
    }
    d(), await w(Y, {
      startSec: Y.startSec,
      endSec: Y.endSec,
      tagId: ee
    }, !0, null, !0, Ae);
  }
  function ot(ee, de) {
    const Ae = qt();
    y({
      type: "add",
      entry: {
        id: Ae,
        op: "patch",
        targets: [Ot(ee)],
        values: { tagId: de.tagId, tagName: de.tagName || "Tag segment", tagSortName: null },
        meta: { kind: "held-tag", tagName: de.tagName }
      }
    });
    const $e = z.find((Oe) => Oe.op === "insert" && Oe.segment.id === ee.id);
    return h({
      kind: "held-tag",
      whenBusy: "enqueue",
      targets: [Ot(ee)],
      dependsOn: ($e == null ? void 0 : $e.taskId) ?? null,
      meta: { pendingChangeId: Ae },
      ready: (Oe, Je) => {
        const He = yi(Oe.segments, Je.targets[0]);
        return !He || ul(Oe, He.id);
      },
      run: (Oe) => ut(Oe, Ae, de)
    }) ? !0 : (y({ type: "discard", key: Ae }), q("Wait for the history restore to finish."), !1);
  }
  async function ut(ee, de, Ae) {
    const [$e] = ee.resolveTargets();
    if (!$e || $e.tagId === Ae.tagId) {
      y({ type: "discard", key: de });
      return;
    }
    await M($e, {
      startSec: $e.startSec,
      endSec: $e.endSec,
      tagId: Ae.tagId
    }, {
      pendingChangeId: de,
      restoreSelectionOnFailure: !1,
      onReload: ee.onReload,
      onConflict: ee.onConflict
    }) || q(`The new segment was not retagged${Ae.tagName ? ` to ${Ae.tagName}` : ""}. Choose its tag again.`);
  }
  async function _e() {
    var He, Ie, Me, We;
    if (!l || !Y || V != null) return;
    const ee = [...ye].sort((ke, Le) => Number(ke.nativeSegmentId ?? ke.id) - Number(Le.nativeSegmentId ?? Le.id)), de = new Set(ee.map((ke) => ke.id)), Ae = ee.map((ke) => `${ke.nativeSegmentId ?? ke.id}:${ke.updatedAt}`).join("|"), $e = r("bin", Y.id);
    if (!$e) return;
    q(`Moving ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin…`);
    const xe = `bulk-move:${Q.id}:${Ae}`, Oe = Ge(xe), Je = c ? null : crypto.randomUUID();
    try {
      const ke = (je = !1) => te(`/videos/${Q.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe,
          segments: ee.map((De) => ({
            segmentId: De.nativeSegmentId ?? De.id,
            expectedUpdatedAt: De.updatedAt
          })),
          discardMissingImage: je,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Je
        })
      });
      let Le;
      try {
        Le = await ke(
          co(xe)
        );
      } catch (je) {
        if (((He = je.payload) == null ? void 0 : He.code) !== "missing-image" || !window.confirm(`${je.message}

Continue and discard the missing image reference?`)) throw je;
        uo(xe), Le = await ke(!0);
      }
      Ue(xe), _n();
      const Ye = new Map((Le.items || []).map((je) => [
        Number(je.segmentId),
        je
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin`,
        Rt(ee, !1),
        Rt(ee.map((je) => {
          const De = Ye.get(
            Number(je.nativeSegmentId ?? je.id)
          );
          return {
            ...je,
            recycleBinItemId: (De == null ? void 0 : De.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (De == null ? void 0 : De.revision) ?? null
          };
        }), !1),
        Je
      );
      const he = _s(o, de, Y.id);
      L((je) => ({
        ...je,
        segments: (je.segments || []).filter((De) => !de.has(De.id))
      }), Q.id), G(he ? [he.id] : []), W((he == null ? void 0 : he.id) ?? null), ve.current = (he == null ? void 0 : he.id) ?? null, oe.current = [], he && (O(Lt(o, he.id)), be(he.id)), requestAnimationFrame(() => {
        var je;
        return (je = m.current) == null ? void 0 : je.focus({ preventScroll: !0 });
      }), q(`Moved ${ee.length} segment${ee.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (ke) {
      const Le = ((Ie = ke.payload) == null ? void 0 : Ie.code) || ((We = (Me = ke.payload) == null ? void 0 : Me.result) == null ? void 0 : We.code);
      ke.status === 409 && Le === "CANONICAL_SEGMENT_CHANGED" ? await re() : q(ke.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      $e();
    }
  }
  async function ht() {
    if (!(c || s.current || V != null)) {
      s.current = !0, q("Checking the recycling bin…");
      try {
        const ee = await te("/bin"), de = await ai(ee, () => q("Emptying the recycling bin…"));
        if (de.status === "empty") {
          q("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          q("The recycling bin was not emptied.");
          return;
        }
        q(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (ee) {
        q(ee.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Ce, removeIncorrectExample: Pe, captureTrainingExport: Ke, deleteRejectedSegments: Be, autoAssignPerformers: Ee, previewDerivedSegments: bt, closeMaterializeDialog: Ze, materializeDerivedSegments: mt, saveTag: ct, moveToBin: _e, emptyRecyclingBin: ht };
}
function wc(e) {
  const { acceptHistory: t, acquireSaveLock: r, enqueueSave: o, getSaveQueueSnapshot: i, commonActionsRef: a, compatibilityMode: s, currentTime: l, detail: d, editorLayout: c, focusRowRef: g, history: u, historyRef: f, historySaving: m, horizontalLayoutSize: p, mediaStackHeight: y, mediaStackRef: h, onDetailChange: I, onReload: x, railToggleRef: K, recordHistoryAction: F, savingSegmentId: T, setCollapsedSegmentGroups: A, setEditorLayout: C, setHistorySaving: S, setIncorrectExamples: w, setSaveMessage: M, shotBoundaries: z, timelineDuration: re, video: L, workspaceRef: E } = e;
  async function R($, b, k) {
    var B, H, q, O;
    const v = $.type === "segment" ? [$] : $.segments || [], P = (b == null ? void 0 : b.type) === "segment" ? [b] : (b == null ? void 0 : b.segments) || [];
    let le = k;
    for (const [W, G] of v.entries()) {
      const Q = P[W], Ce = ((B = G.identity) == null ? void 0 : B.nativeSegmentId) != null || ((H = G.identity) == null ? void 0 : H.published) === !0, Pe = ((q = Q == null ? void 0 : Q.identity) == null ? void 0 : q.recycleBinItemId) ?? ((O = Q == null ? void 0 : Q.identity) == null ? void 0 : O.itemId);
      let Ne = Qe(le.segments, Q == null ? void 0 : Q.identity) || Qe(le.segments, G.identity);
      if (!Ne && Ce && Pe != null && Q.identity.revision != null) {
        const Ee = `history-restore:${L.id}:${Pe}:${Q.identity.revision}`;
        await te(`/bin/${Pe}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(Ee),
            expectedRevision: Q.identity.revision
          })
        }), Ue(Ee), le = await x(), Ne = le.segments.find((et) => et.tagId === G.values.tagId && et.startSec === G.values.startSec && et.endSec === G.values.endSec);
      }
      if (!Ne)
        throw new Error("A segment in this history state no longer exists.");
      if ((Ne.nativeSegmentId != null || Ne.published === !0) !== Ce) {
        if (Ce) {
          const Ee = Ne.recycleBinItemId ?? Ne.itemId ?? Pe;
          if (Ee == null)
            throw new Error("This recycled segment can no longer be restored.");
          const et = `history-restore:${L.id}:${Ee}:${Ne.revision}:${G.values.reviewState ?? "native"}`;
          await te(`/bin/${Ee}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ge(et),
              expectedRevision: Ne.revision
            })
          }), Ue(et);
        } else {
          const Ee = `history-bin:${L.id}:${Ne.nativeSegmentId}:${Ne.updatedAt}:${G.values.reviewState}`;
          await te(`/videos/${L.id}/segments/${Ne.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ge(Ee),
              expectedUpdatedAt: Ne.updatedAt,
              reviewState: G.values.reviewState
            })
          }), Ue(Ee);
        }
        if (le = await x(), !Ce)
          continue;
        if (Ne = Qe(le.segments, G.identity) || le.segments.find((Ee) => Ee.tagId === G.values.tagId && Ee.startSec === G.values.startSec && Ee.endSec === G.values.endSec), !Ne)
          throw new Error("The restored segment could not be found.");
      }
      const Be = G.values;
      if (Ne.nativeSegmentId == null && Ne.itemId != null) {
        const Ee = `history-draft-update:${L.id}:${Ne.itemId}:${Ne.revision}:${Be.tagId}:${Be.startSec}:${Be.endSec ?? "open"}:${Be.reviewState}`;
        await te(`/videos/${L.id}/drafts/${Ne.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(Ee),
            expectedRevision: Ne.revision,
            ...Be
          })
        }), Ue(Ee);
      } else
        await te(`/videos/${L.id}/segments/${Ne.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Be, expectedUpdatedAt: Ne.updatedAt })
        });
      le = await x();
    }
    return le;
  }
  async function _($, b) {
    var k;
    for (const v of $.targets || []) {
      const P = Qe(b.segments, v.identity);
      if (!P)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const le = (k = b.performerSlotRevisions) == null ? void 0 : k[P.id];
      await te(P.published ? `/videos/${L.id}/segments/${P.nativeSegmentId}/slots` : `/videos/${L.id}/drafts/${P.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: le,
          assignments: v.assignments
        })
      }), b = await x();
    }
    return b;
  }
  async function ie($, b, k) {
    if (!s)
      throw new Error("AI feedback history is only available in Full mode.");
    let v = b, P = await te(`/videos/${L.id}/incorrect-examples`);
    const le = (B) => P.find((H) => {
      var q;
      return H.id === B.exampleId || ((q = B.collectedIdentity) == null ? void 0 : q.itemId) != null && H.itemId === B.collectedIdentity.itemId;
    });
    for (const [B, H] of ($.entries || []).entries()) {
      const q = `history-feedback:${L.id}:${k.action.sequence}:${k.direction}:${B}`, O = le(H);
      if ($.collected && O) {
        Ue(q);
        continue;
      }
      let W;
      if ($.collected) {
        const G = Qe(
          v.segments,
          H.collectedIdentity
        ) || Qe(
          v.segments,
          H.originalIdentity
        );
        if (!G)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const Q = G.nativeSegmentId != null;
        W = await te(`/videos/${L.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ge(q),
            nativeSegmentId: Q ? G.nativeSegmentId : null,
            itemId: Q ? null : G.itemId,
            expectedUpdatedAt: Q ? G.updatedAt : null,
            expectedRevision: Q ? null : G.revision
          })
        });
      } else {
        if (!O) {
          Ue(q);
          continue;
        }
        W = await te(
          `/videos/${L.id}/incorrect-examples/${O.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ge(q),
              expectedExampleRevision: O.revision,
              expectedRepresentationRevision: O.representationRevision
            })
          }
        );
      }
      Ue(q), v = vr(
        v,
        W.editorDelta
      ), P = await te(
        `/videos/${L.id}/incorrect-examples`
      );
    }
    return w(P), v;
  }
  async function ae($, b, k = []) {
    const v = $.state;
    if (!s && ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")) {
      const le = `basic-history:${L.id}:${f.current.revision}:${$.action.sequence}:${$.direction}`, B = await te(`/videos/${L.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(le),
          expectedHistoryRevision: f.current.revision,
          actionSequence: $.action.sequence,
          direction: $.direction
        })
      });
      return t(B.history), k.push(le), x();
    }
    const P = $.direction === "backward" ? $.action.afterState : $.action.beforeState;
    if ((v == null ? void 0 : v.type) === "composite") {
      let le = b;
      const B = (P == null ? void 0 : P.type) === "composite" ? P.states || [] : [];
      for (const [H, q] of (v.states || []).entries()) {
        const O = B[H];
        le = await ae({
          ...$,
          state: q,
          action: {
            ...$.action,
            beforeState: $.direction === "backward" ? q : O,
            afterState: $.direction === "backward" ? O : q
          }
        }, le, k);
      }
      return le;
    }
    if ((v == null ? void 0 : v.type) === "segment" || (v == null ? void 0 : v.type) === "segments")
      return R(
        v,
        P,
        b
      );
    if ((v == null ? void 0 : v.type) === "performerSlots")
      return _(v, b);
    if ((v == null ? void 0 : v.type) === "incorrectExamples")
      return ie(v, b, $);
    if ((v == null ? void 0 : v.type) === "shots") {
      const le = qn(b.shotBoundaries || []), B = await te(`/videos/${L.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(`history-shots:${L.id}:${le}:${v.fingerprint}`),
          expectedFingerprint: le,
          boundaries: v.boundaries
        })
      });
      return { ...b, shotBoundaries: B };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function be($) {
    if (m || T != null || $ === u.cursorSequence)
      return;
    const b = Yl(u, $);
    if (b.length === 0) return;
    const k = o({
      kind: "history",
      lockId: -1,
      exclusive: !0,
      run: (v) => V(v.detail, $, b)
    });
    k && await k.done;
  }
  async function V($, b, k) {
    var v;
    S(!0), M(`Restoring ${k.length} history ${k.length === 1 ? "action" : "actions"}…`);
    try {
      let P = $;
      const le = [];
      for (const H of k)
        P = await ae(
          H,
          P,
          le
        );
      const B = s ? await te(`/videos/${L.id}/history/cursor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedRevision: f.current.revision,
          targetSequence: b
        })
      }) : f.current;
      le.forEach(Ue), t(B), await x(), M("History restored.");
    } catch (P) {
      P.status === 409 && ((v = P.payload) != null && v.current) && t(P.payload.current), await x(), M(P.message || "Unable to restore editor history.");
    } finally {
      S(!1);
    }
  }
  function J($) {
    C((b) => ({ ...b, timelineRatio: so($, y) }));
  }
  function ne($) {
    var v, P;
    const b = (v = h.current) == null ? void 0 : v.getBoundingClientRect();
    if (!b) return;
    const k = ((P = a.current) == null ? void 0 : P.offsetHeight) || 0;
    J(Ms(
      $.clientY,
      b.top + k,
      Math.max(0, b.height - k)
    ));
  }
  function Y($) {
    $.currentTarget.setPointerCapture($.pointerId), ne($);
  }
  function fe($) {
    $.currentTarget.hasPointerCapture($.pointerId) && ne($);
  }
  function ye($) {
    const b = $.shiftKey ? 0.1 : 0.05;
    let k = null;
    $.key === "ArrowUp" && (k = c.timelineRatio + b), $.key === "ArrowDown" && (k = c.timelineRatio - b);
    const v = io(y);
    $.key === "Home" && (k = v.minimum), $.key === "End" && (k = v.maximum), k != null && ($.preventDefault(), $.stopPropagation(), J(k));
  }
  function ve($) {
    const b = $ === "detailWidth" ? p.focusRow : p.workspace, k = p.workspace > 0 ? Yr(p.workspace, 600) : 560, v = ln(c.markerRailWidth, k), P = $ === "detailWidth" ? 344 + (c.markerRailOpen ? v + 24 : 0) : 600;
    return b > 0 ? Yr(b, P) : 560;
  }
  function oe($, b) {
    C((k) => ({ ...k, [$]: ln(b, ve($)) }));
  }
  function ue($, b) {
    var v, P;
    const k = b === "detailWidth" ? (v = g.current) == null ? void 0 : v.getBoundingClientRect() : (P = E.current) == null ? void 0 : P.getBoundingClientRect();
    k && oe(b, b === "detailWidth" ? $.clientX - k.left : k.right - $.clientX);
  }
  function ce($, b) {
    const k = ve($), v = ln(c[$], k);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": b,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(k),
      "aria-valuenow": Math.round(v),
      "aria-valuetext": `${Math.round(v)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (P) => {
        P.currentTarget.setPointerCapture(P.pointerId), ue(P, $);
      },
      onPointerMove: (P) => {
        P.currentTarget.hasPointerCapture(P.pointerId) && ue(P, $);
      },
      onKeyDown: (P) => {
        const le = P.shiftKey ? 40 : 16;
        let B = null;
        P.key === "ArrowLeft" && (B = $ === "detailWidth" ? -le : le), P.key === "ArrowRight" && (B = $ === "detailWidth" ? le : -le);
        let H = B == null ? null : v + B;
        P.key === "Home" && (H = 240), P.key === "End" && (H = k), H != null && (P.preventDefault(), P.stopPropagation(), oe($, H));
      },
      onDoubleClick: () => oe($, Tt[$]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Z() {
    C(($) => ({ ...$, markerRailOpen: !$.markerRailOpen })), requestAnimationFrame(() => {
      var $;
      return ($ = K.current) == null ? void 0 : $.focus({ preventScroll: !0 });
    });
  }
  function X($) {
    A((b) => b.includes($) ? b.filter((k) => k !== $) : en([...b, $]));
  }
  function U($, b = !0, k = l) {
    const v = i().running != null, P = o({
      kind: "shots",
      lockId: -1,
      whenBusy: "enqueue",
      run: (le) => se(le.detail, $, b, k)
    });
    return P ? (v && M($ === "split" ? "Shot boundary queued…" : "Shot merge queued…"), P.done.then((le) => le.value ?? null)) : (M("Wait for the history restore to finish."), Promise.resolve(null));
  }
  async function se($, b, k, v) {
    var q;
    const P = ($ == null ? void 0 : $.shotBoundaries) || [], le = Number((q = L.videoFile) == null ? void 0 : q.duration) || re, B = qn(P), H = `shot-${b}:${L.id}:${v.toFixed(3)}:${le.toFixed(3)}:${B}`;
    M(b === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const O = await te(`/videos/${L.id}/shot-boundaries/${b}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Ge(H), timeSec: v })
      });
      return Ue(H), I((W) => ({ ...W, shotBoundaries: O }), L.id), k && await F(
        "shots.update",
        b === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: P,
          fingerprint: B
        },
        {
          type: "shots",
          boundaries: O,
          fingerprint: qn(O)
        }
      ), M(b === "split" ? "Shot boundary added." : "Shots merged."), O;
    } catch (O) {
      return M(O.message || "Unable to edit shot boundaries."), null;
    }
  }
  return { applySegmentHistoryState: R, applyPerformerSlotHistoryState: _, applyHistoryState: ae, restoreHistoryTarget: be, updateTimelineRatio: J, updateTimelineRatioFromPointer: ne, handleSeparatorPointerDown: Y, handleSeparatorPointerMove: fe, handleSeparatorKeyDown: ye, panelWidthMaximum: ve, updatePanelWidth: oe, handlePanelSeparatorPointer: ue, panelSeparatorProps: ce, toggleSegmentRail: Z, toggleSegmentGroup: X, mutateShotBoundary: U };
}
function Nc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: y, mutateShotBoundary: h, openPublishApprovedDialog: I, playbackControlsRef: x, playbackShortcutConfig: K, saveSelectedReviewState: F, seekRef: T, segmentGroupKeys: A, selectSegment: C, selectedSegment: S, selectedSegmentGroupForSegment: w, selectedSegmentGroupKey: M, selectedSegments: z, setCollapsedSegmentGroups: re, setIncorrectExamplesOpen: L, setQuickSearchOpen: E, setSaveMessage: R, setSelectedSegmentGroupKey: _, setTagEditing: ie, setTimelineZoom: ae, shotBoundaries: be, slotButtonRef: V, splitSegment: J, swimlanes: ne, timelineDuration: Y, toggleIncorrectExample: fe, toggleSegmentGroup: ye, updateTimelineRatio: ve, videoFrameRate: oe, visibleSegments: ue } = e;
  function ce(U) {
    var se, $;
    (se = x.current) == null || se.pause(), ($ = x.current) == null || $.seekBy(pl(U, oe));
  }
  function Z(U, se) {
    if (z.length > 1 && Zs(U.id))
      return;
    let $ = null;
    U.id === "video.playPause" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.toggle();
    }), U.id === "video.seekSmallBackward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(-K.smallSeekTime);
    }), U.id === "video.seekSmallForward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(K.smallSeekTime);
    }), U.id === "video.seekMediumBackward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(-K.mediumSeekTime);
    }), U.id === "video.seekMediumForward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(K.mediumSeekTime);
    }), U.id === "video.seekLongBackward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(-K.longSeekTime);
    }), U.id === "video.seekLongForward" && ($ = () => {
      var b;
      return (b = x.current) == null ? void 0 : b.seekBy(K.longSeekTime);
    }), U.id === "video.playSelected" && S && ($ = () => {
      var b;
      (b = T.current) == null || b.call(T, S.startSec, !0), requestAnimationFrame(() => {
        var k;
        return (k = g.current) == null ? void 0 : k.focus({ preventScroll: !0 });
      });
    }), (U.id === "video.playPreviousSegment" || U.id === "video.playNextSegment") && ($ = () => {
      var k;
      const b = to(
        ne,
        S == null ? void 0 : S.id,
        U.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !b || b.id === (S == null ? void 0 : S.id) || (C(b, { focusEditor: !0, seekToSegment: !1 }), (k = T.current) == null || k.call(T, b.startSec, !0));
    }), U.id.startsWith("video.seekPercent") && ($ = () => {
      var k;
      const b = Number(U.id.slice(17)) / 10;
      (k = T.current) == null || k.call(T, Vs(m ?? Y, b), !1);
    }), U.id === "video.jumpToSegmentStart" && S && ($ = () => {
      var b;
      return (b = T.current) == null ? void 0 : b.call(T, S.startSec, !1);
    }), U.id === "video.jumpToSegmentEnd" && S && ($ = () => {
      var b;
      return (b = T.current) == null ? void 0 : b.call(T, S.endSec ?? S.startSec, !1);
    }), U.id === "video.jumpToVideoStart" && ($ = () => {
      var b;
      return (b = T.current) == null ? void 0 : b.call(T, 0, !1);
    }), U.id === "video.jumpToVideoEnd" && ($ = () => {
      var b;
      return (b = T.current) == null ? void 0 : b.call(T, Y, !1);
    }), U.id.startsWith("video.frame") && ($ = () => {
      const b = U.id.includes("Small") ? "small" : U.id.includes("Medium") ? "medium" : "long", k = K[`${b}FrameStep`] * (U.id.endsWith("Backward") ? -1 : 1);
      ce(k);
    }), U.id.startsWith("navigation.swimlane") && ($ = () => {
      const b = U.id.slice(19).toLowerCase(), k = to(ne, S == null ? void 0 : S.id, b, s);
      k && C(k, { focusEditor: !0, seekToSegment: !1 });
    }), (U.id === "navigation.extendSwimlaneLeft" || U.id === "navigation.extendSwimlaneRight") && ($ = () => {
      const b = md(
        t,
        S == null ? void 0 : S.id,
        U.id.endsWith("Left") ? "left" : "right"
      );
      b && C(b.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: b.segmentIds
      });
    }), (U.id === "navigation.segmentGroupUp" || U.id === "navigation.segmentGroupDown") && ($ = () => {
      const b = gd(
        A,
        M ?? w,
        U.id.endsWith("Up") ? -1 : 1
      );
      b && _(b);
    }), (U.id === "navigation.previousAtPlayhead" || U.id === "navigation.nextAtPlayhead") && ($ = () => {
      const b = Es(ue, s, U.id === "navigation.previousAtPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && C(b, { focusEditor: !0, seekToSegment: !1 });
    }), U.id === "navigation.nearestInCurrentSwimlane" && ($ = () => {
      const b = Ss(
        ne,
        S == null ? void 0 : S.id,
        s
      );
      b && C(b, { focusEditor: !0, seekToSegment: !1 });
    }), U.id.includes("Unreviewed") && ($ = () => {
      const b = Sr(
        ne,
        S == null ? void 0 : S.id,
        U.id.startsWith("navigation.previous") ? -1 : 1,
        U.id.endsWith("Global")
      );
      b && C(b, { focusEditor: !se.preserveFocus, seekToSegment: !1 });
    }), (U.id === "navigation.nextTouchingPlayhead" || U.id === "navigation.previousTouchingPlayhead") && ($ = () => {
      const b = xs(ne, s, U.id === "navigation.previousTouchingPlayhead" ? -1 : 1, S == null ? void 0 : S.id);
      b && C(b, { focusEditor: !0, seekToSegment: !1 });
    }), U.id === "navigation.quickSearch" && ($ = () => E(!0)), (U.id === "navigation.previousShot" || U.id === "navigation.nextShot") && ($ = () => {
      var k;
      const b = gl(be, s, U.id === "navigation.previousShot" ? -1 : 1);
      b && ((k = T.current) == null || k.call(T, b.startSec, !1));
    }), U.id === "shot.split" && ($ = () => h("split")), U.id === "shot.merge" && ($ = () => h("merge")), U.id === "marker.create" && ($ = () => a()), U.id === "marker.duplicate" && ($ = () => d(!1)), U.id === "marker.duplicateAtPlayhead" && ($ = () => d(!0)), U.id === "marker.split" && ($ = () => J()), U.id === "marker.editTag" && ($ = () => {
      var b;
      if (z.length > 1 && z.some((k) => k.isDerived)) {
        R("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((b = f.data) != null && b.tagReadOnly) {
        R("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ie(!0);
    }), U.id === "marker.setStart" && S && ($ = () => r(s, S.endSec)), U.id === "marker.setEnd" && S && ($ = () => r(S.startSec, s)), U.id === "marker.copyTiming" && S && ($ = () => {
      R(zd(S) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), U.id === "marker.pasteTiming" && S && ($ = () => {
      const b = Kd();
      if (!b) {
        R("No copied segment timing is available.");
        return;
      }
      r(b.startSec, b.endSec);
    }), U.id === "marker.mergeSelection" && ($ = () => p()), U.id === "marker.moveToBin" && ($ = () => y()), U.id === "marker.toggleIncorrectExample" && S && ($ = () => fe()), U.id === "marker.openIncorrectExamples" && ($ = () => L(!0)), U.id === "markerGroup.toggleCollapse" && M && ($ = () => ye(M)), U.id === "markerGroup.toggleAll" && ($ = () => re((b) => ud(b, A))), U.id === "marker.assignSlots" && ($ = () => {
      var b;
      return (b = V.current) == null ? void 0 : b.click();
    }), U.id === "navigation.zoomIn" && ($ = () => ae((b) => kr(b + 0.5))), U.id === "navigation.zoomOut" && ($ = () => ae((b) => kr(b - 0.5))), U.id === "navigation.resetZoom" && ($ = () => ae(1)), U.id === "navigation.centerPlayhead" && ($ = () => {
      var b;
      return (b = o.current) == null ? void 0 : b.call(o);
    }), U.id === "layout.growSwimlanes" && ($ = () => ve(c.timelineRatio + 0.05)), U.id === "layout.shrinkSwimlanes" && ($ = () => ve(c.timelineRatio - 0.05)), U.id === "marker.confirm" && S && ($ = () => F("approved")), U.id === "system.publishApproved" && ($ = () => I(se.target)), U.id === "marker.reject" && S && ($ = () => F("rejected")), U.id === "system.emptyBin" && ($ = () => u()), U.id === "system.deleteRejected" && ($ = () => l()), $ && $();
  }
  function X(U, se) {
    const $ = Qn.find((b) => b.id === U);
    $ && xn($, i) && Z($, se);
  }
  return {
    executeShortcutById: X,
    stepVideoFrame: (U) => ce(U < 0 ? -1 : 1)
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
function Ic(e, t, r = !1, o = 0, i = "", a = () => () => {
}) {
  const [s, l] = j(null), [d, c] = j(null), [g, u] = j(""), [f, m] = j({
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
      await te(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: eo(), reviewState: x })
      }), await t(), m({ busy: !1, reviewState: null, error: "" });
    } catch (F) {
      m({
        busy: !1,
        reviewState: null,
        error: F.message || "Unable to import Cove segments."
      });
    } finally {
      K();
    }
  }
  async function h(x) {
    try {
      const K = await te(`/videos/${e}/analysis-runs`, {
        signal: x.signal
      });
      if (!x.isActive()) return null;
      const F = (K == null ? void 0 : K[0]) || null;
      return l(F), (F == null ? void 0 : F.status) === "completed" && p.current !== F.id && (p.current = F.id, await t()), ((F == null ? void 0 : F.status) === "failed" || (F == null ? void 0 : F.status) === "cancelled") && u(F.errorMessage || "Video analysis did not complete."), F;
    } catch (K) {
      return x.isActive() && K.name !== "AbortError" && u(K.message || "Unable to load video analysis status."), null;
    }
  }
  async function I(x = null) {
    u("");
    const K = x || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), F = K.includes("omnishotcut") && o > 0;
    if (!(F && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const T = await te(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: K,
            replaceShotBoundaries: F,
            expectedShotBoundaryFingerprint: F ? i : null
          })
        });
        l(T);
      } catch (T) {
        u(T.message || "Unable to start video analysis.");
      }
  }
  return pe(() => {
    if (!ba(r)) {
      l(null), c(null), u("");
      return;
    }
    const x = ha();
    return h(x), te("/analysis/status", { signal: x.signal }).then((K) => {
      x.isActive() && (c(K), K.configured || u(""));
    }).catch((K) => {
      x.isActive() && K.name !== "AbortError" && u(K.message || "Unable to check video analysis readiness.");
    }), x.dispose;
  }, [e, r]), pe(() => {
    if (!ba(r) || (s == null ? void 0 : s.status) !== "queued" && (s == null ? void 0 : s.status) !== "running") return;
    const x = ha();
    let K = setTimeout(async function F() {
      await h(x), x.isActive() && (K = setTimeout(F, 2500));
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
function Cc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function $c({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Do, Po, Oo, Lo, Fo;
  const [g, u] = j(null), [f, m] = j([]), p = ge(null), y = ge(null), h = ge([]), I = ge(null), [x, K] = j(() => Mt({})), [F, T] = j(!1), [A, C] = j(Js), [S, w] = j(0), M = ge(null), [z] = j(() => Id({
    getContext: () => M.current,
    drainAfterSettle: !1
  })), re = Dl(z.subscribe, z.getSnapshot), L = bi(re), E = (D, me) => z.acquire({ kind: D, lockId: me }), R = (D) => z.enqueue(D), _ = (D) => z.cancel(D), ie = (D, me) => z.retarget(D, me), ae = z.getSnapshot, [be, V] = El(Pd, []), [J, ne] = j(""), [Y, fe] = j(""), [ye, ve] = j(""), [oe, ue] = j(1), [ce, Z] = j(jd), [X, U] = j(0), [se, $] = j({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [b, k] = j(zt), v = ge(zt), [P, le] = j(!1), [B, H] = j(!1), [q, O] = j(!1), W = ge(!1);
  W.current = q;
  const [G, Q] = j(null), [Ce, Pe] = j(!1), [Ne, Ke] = j(null), [Be, Ee] = j(null), et = ge(null), [bt, Ze] = j(!1), [mt, rt] = j(""), ct = ge(null), ot = ge(null), ut = ge(!1), [_e, ht] = j(Bd), [ee, de] = j(null), [Ae, $e] = j(!1), [xe, Oe] = j(!1), [Je, He] = j(!1), [Ie, Me] = j(!1), [We, ke] = j(!1), [Le, Ye] = j(""), {
    analysisError: he,
    analysisRun: je,
    analysisStatus: De,
    importNativeSegments: $t,
    nativeImportState: tt,
    startFullAnalysis: it
  } = Ic(
    e.video.id,
    o,
    l,
    ((Do = e.shotBoundaries) == null ? void 0 : Do.length) || 0,
    qn(e.shotBoundaries || []),
    (D, me) => z.acquire({ kind: D, lockId: me })
  ), [St, kt] = j(!1), [Se, we] = j(null), [qe, gt] = j(l), [at, _t] = j(0), [dt, Wt] = j(!1), [Vt, wn] = j(""), [Kt, Nn] = j(null), mn = ge(null), Jt = ge(null), In = ge(!1), [tn, nn] = j([]), [Cn, Rr] = j(!1), [Xn, Mr] = j(null), $n = Ld(), Tn = ge(null), An = ge(null), rn = ge(null), er = ge(s), tr = ge(null), Rn = ge(null), on = ge(null), gn = ge(null), Mn = ge(null), vt = ge(null), nr = ge(null), En = ge(null), rr = ge(null), or = ge(null), Et = ge(null), Dn = ge(null), ar = ge(-1e12), ir = ge(null), Pn = ge(null), [On, Ln] = j({ scrollTop: 0, height: 512 });
  pe(() => {
    if (!St || dt || !Vt) return;
    const D = requestAnimationFrame(() => {
      var me;
      return (me = Jt.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(D);
  }, [St, dt, Vt]), pe(() => {
    if (!In.current || St || qe) return;
    const D = requestAnimationFrame(() => {
      var me;
      (me = mn.current) == null || me.focus({ preventScroll: !0 }), In.current = !1;
    });
    return () => cancelAnimationFrame(D);
  }, [St, qe]);
  const nt = e.video, pt = e.segments || Hn, sr = ze(() => JSON.stringify({
    segments: pt.map((D) => [
      D.id,
      D.itemId,
      D.nativeSegmentId,
      D.tagId,
      D.startSec,
      D.endSec,
      D.reviewState,
      D.published,
      D.sourceKey,
      D.sourceRunId,
      D.confidence,
      D.revision,
      D.updatedAt
    ]),
    performerSlots: (e.performerSlots || Hn).map((D) => [
      D.segmentId,
      D.slotDefinitionId,
      D.performerId,
      D.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [pt, e.performerSlots, e.itemMetadata]);
  pe(() => {
    if (!l) {
      we(null), gt(!1);
      return;
    }
    if (L != null) {
      gt(!0);
      return;
    }
    let D = !0;
    gt(!0);
    const me = setTimeout(() => {
      te(`/videos/${nt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Fe) => {
        D && (we(Fe), wn(""));
      }).catch((Fe) => {
        D && (we(null), wn(Fe.message || "Unable to preview derived segments."));
      }).finally(() => {
        D && gt(!1);
      });
    }, 150);
    return () => {
      D = !1, clearTimeout(me);
    };
  }, [l, nt.id, sr, at, L]);
  const Er = () => _t((D) => D + 1), Dt = e.segmentGroups || Hn, Ve = e.performerSlots || Hn, lr = l && e.performerSlotsAvailable !== !1, Fn = ze(
    () => (e.performerCandidates || []).filter((D) => D.isVideoPerformer),
    [e.performerCandidates]
  ), jn = e.shotBoundaries || Hn, pn = ze(
    () => ci(Ve),
    [Ve]
  ), Yt = ze(
    () => pt.map((D) => {
      const me = pn.get(D.id) || [];
      return {
        ...D,
        slots: me,
        assignment: me.every((Fe) => Fe.performerId == null) ? Cl(me, Fn) : null
      };
    }).filter((D) => D.slots.length > 0 && D.assignment != null),
    [pt, pn, Fn]
  ), Dr = Number((Po = nt.videoFile) == null ? void 0 : Po.frameRate) > 0 ? Number(nt.videoFile.frameRate) : 30;
  function Bn() {
    const D = W.current;
    O(!1), D && requestAnimationFrame(() => {
      var me;
      return (me = vt.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
  }
  function dr() {
    L == null && (Dn.current = null, Pe(!1), ne(""), requestAnimationFrame(() => {
      var D;
      return (D = vt.current) == null ? void 0 : D.focus({ preventScroll: !0 });
    }));
  }
  function Gn() {
    T(!1), requestAnimationFrame(() => {
      var D, me;
      (D = En.current) != null && D.isConnected ? En.current.focus({ preventScroll: !0 }) : (me = vt.current) == null || me.focus({ preventScroll: !0 });
    });
  }
  pe(() => {
    Et.current === g ? (Et.current = null, O(!0)) : O(!1);
  }, [g]), pe(() => {
    var me;
    if (!q) return;
    const D = (me = or.current) == null ? void 0 : me.querySelector("input");
    document.activeElement !== D && (D == null || D.focus({ preventScroll: !0 }), D == null || D.select());
  }, [q, g]), pe(() => {
    var me;
    if (q) return;
    const D = (me = vt.current) == null ? void 0 : me.ownerDocument;
    D && D.activeElement === D.body && vt.current.focus({ preventScroll: !0 });
  }, [q]), pe(() => {
    var Fe, st, Pt;
    const D = dn(
      zr(
        e.segments,
        e.performerSlots || [],
        Mt({}),
        l && A,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), me = ((Fe = e.segments.find((bn) => bn.id === s)) == null ? void 0 : Fe.id) ?? ((st = Ga(D)) == null ? void 0 : st.id) ?? null;
    u(me), m(me == null ? [] : [me]), y.current = me, h.current = [], de(Lt(D, me)), K(Mt({})), T(!1), Dn.current = null, Pe(!1), ue(1), ne(""), k(zt), v.current = zt, le(!1), (Pt = vt.current) == null || Pt.focus({ preventScroll: !0 });
  }, [nt.id, s]), pe(() => {
    const D = new AbortController();
    return te(`/videos/${nt.id}/incorrect-examples`, { signal: D.signal }).then(nn).catch((me) => {
      me.name !== "AbortError" && nn([]);
    }), () => D.abort();
  }, [nt.id, d == null ? void 0 : d.effectiveMode]), pe(() => {
    const D = new AbortController();
    return te(`/videos/${nt.id}/history`, { signal: D.signal }).then((me) => {
      const Fe = me || zt;
      v.current = Fe, k(Fe);
    }).catch((me) => {
      me.name !== "AbortError" && ne(me.message || "Unable to load editor history.");
    }), () => D.abort();
  }, [nt.id]), pe(() => {
    Ud(ce);
  }, [ce.timelineRatio, ce.markerRailOpen, ce.detailWidth, ce.markerRailWidth, ce.swimlaneTitleWidth]), pe(() => {
    Gd(_e);
  }, [_e]), pe(() => {
    Ys(A);
  }, [A]), pe(() => {
    const D = Rn.current;
    if (!a || !D || typeof ResizeObserver > "u") return;
    const me = () => {
      var Pt;
      const st = Math.max(0, D.clientHeight - (((Pt = on.current) == null ? void 0 : Pt.offsetHeight) || 0));
      U(st), Z((bn) => {
        const jo = so(bn.timelineRatio, st);
        return jo === bn.timelineRatio ? bn : { ...bn, timelineRatio: jo };
      });
    }, Fe = new ResizeObserver(me);
    return Fe.observe(D), on.current && Fe.observe(on.current), me(), () => Fe.disconnect();
  }, [a]), pe(() => {
    if (!$n || typeof ResizeObserver > "u") return;
    const D = Mn.current, me = gn.current;
    if (!D || !me) return;
    const Fe = () => $({
      workspace: D.clientWidth,
      focusRow: me.clientWidth,
      focusRowHeight: me.clientHeight
    }), st = new ResizeObserver(Fe);
    return st.observe(D), st.observe(me), Fe(), () => st.disconnect();
  }, [$n, ce.markerRailOpen]);
  const Bt = ze(
    () => Dd(pt, be),
    [pt, be]
  );
  Ml(() => {
    xi(be, e) !== be && V({ type: "prune", detail: e });
  }, [e, be]);
  const ft = ze(
    () => la(
      zr(
        Bt,
        Ve,
        x,
        l && A,
        Dt
      ),
      tn,
      !0
    ),
    [
      Bt,
      Ve,
      x,
      A,
      Dt,
      l,
      tn
    ]
  ), an = Object.fromEntries(It.map((D) => [D, ft.filter((me) => me.reviewState === D).length])), Un = la(
    zr(
      Bt,
      Ve,
      { ...x, reviewStates: It },
      l && A,
      Dt
    ),
    tn,
    !0
  ), Pr = Object.fromEntries(It.map((D) => [D, Un.filter((me) => me.reviewState === D).length])), Or = [...new Set(Bt.map((D) => D.sourceKey).filter(Boolean))].sort((D, me) => jt(D).localeCompare(jt(me))), Lr = Fs(
    x,
    l && A
  ), wt = ze(
    () => dn(ft, Dt, Ve),
    [ft, Dt, Ve]
  ), Xe = Gs(
    wt,
    g,
    s
  ), sn = ze(() => {
    const D = Ad(be);
    return D.length === 0 ? pt : [...pt, ...D];
  }, [pt, be]), N = Xe == null ? null : sn.find((D) => D.id === Xe.id) || Xe, Re = _o(sn, _o(ft, f).map((D) => D.id)), xt = !l && Re.length > 0 && Re.every((D) => D.nativeSegmentId != null), yt = ft.map((D) => D.id), Qt = yt.join("|");
  p.current = (N == null ? void 0 : N.id) ?? null;
  const Gt = pn.get(N == null ? void 0 : N.id) || [], Fr = po(Gt), ho = ze(
    () => ld(wt, f),
    [wt, f]
  ), jr = ze(() => fo(wt), [wt]), Kn = ze(
    () => id(jr, _e),
    [jr, _e]
  ), Ci = ze(
    () => ui(
      Kn.rows,
      On.scrollTop,
      On.height
    ),
    [Kn, On]
  ), Br = ze(
    () => cd(wt, _e),
    [wt, _e]
  ), $i = Sr(Br, N == null ? void 0 : N.id, -1, !0) != null, Ti = Sr(Br, N == null ? void 0 : N.id, 1, !0) != null, fn = N ? Lt(wt, N.id) : null, Gr = Dt.length > 0 ? jr.map((D) => D.key) : [], Ai = Gr.join("|"), cr = Math.max(
    0,
    Number((Oo = nt.videoFile) == null ? void 0 : Oo.duration) || 0,
    ...Bt.map((D) => Number(D.endSec ?? D.startSec) || 0)
  ), vo = Number((Lo = nt.videoFile) == null ? void 0 : Lo.duration) > 0 ? Number(nt.videoFile.duration) : null;
  b.actions;
  const Ri = Ja();
  pe(() => {
    const D = g === wr ? g : (N == null ? void 0 : N.id) ?? null;
    D !== g && u(D);
  }, [N, g]), pe(() => {
    m((D) => {
      const me = Hs(
        D,
        yt,
        (N == null ? void 0 : N.id) ?? null
      );
      return me.length === D.length && me.every((Fe, st) => Fe === D[st]) ? D : me;
    });
  }, [Qt, N == null ? void 0 : N.id]);
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
    fe(Xe == null ? "" : String(Xe.startSec)), ve((Xe == null ? void 0 : Xe.endSec) == null ? "" : String(Xe.endSec));
  }, [Xe == null ? void 0 : Xe.id, Xe == null ? void 0 : Xe.startSec, Xe == null ? void 0 : Xe.endSec]), pe(() => {
    fn && ht((D) => pi(D, fn));
  }, [nt.id, s, fn]), pe(() => {
    de((D) => pd(Gr, D, fn));
  }, [nt.id, Ai, fn]), pe(() => {
    if (!ce.markerRailOpen || (N == null ? void 0 : N.id) == null) return;
    const D = Pn.current, me = Kn.rows.find((Pt) => Pt.kind === "segment" && Pt.segment.id === N.id);
    if (!D || !me) return;
    const Fe = me.top + me.height;
    let st = D.scrollTop;
    me.top < D.scrollTop ? st = me.top : Fe > D.scrollTop + D.clientHeight && (st = Math.max(0, Fe - D.clientHeight)), st !== D.scrollTop && (D.scrollTop = st), Ln({ scrollTop: st, height: D.clientHeight });
  }, [N == null ? void 0 : N.id, Kn, ce.markerRailOpen]), pe(() => {
    const D = Pn.current;
    if (!ce.markerRailOpen || !D) return;
    const me = () => Ln({
      scrollTop: D.scrollTop,
      height: D.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      me();
      return;
    }
    const Fe = new ResizeObserver(me);
    return Fe.observe(D), me(), () => Fe.disconnect();
  }, [ce.markerRailOpen]);
  const { revealSegmentGroupForSelection: xo, replaceSegmentSelection: Ei, selectSegment: So, selectSegmentCollection: Di, selectAllVideoSegments: Pi } = xc({
    allSwimlanes: wt,
    editorRef: vt,
    performerSlots: Ve,
    seekRef: Tn,
    segmentGroups: Dt,
    segments: pt,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setCollapsedSegmentGroups: ht,
    setEditorFilters: K,
    setHideDerivedSegments: C,
    setSaveMessage: ne,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Kr, recordHistoryAction: ur, mutateSegment: Oi, runSegmentMutation: Li, completeReview: Fi, createSegment: ko, splitSegment: wo, duplicateSegment: No, saveTiming: ji, applyShortcutTiming: Bi } = Od({
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorFilters: x,
    endInput: ye,
    hideDerivedSegments: A,
    historyRef: v,
    mediaDuration: vo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: ar,
    pendingDuplicateRef: ir,
    pendingFirstSegmentStartSecRef: Dn,
    pendingTagEditSegmentIdRef: Et,
    enqueueSave: R,
    pendingChanges: be,
    retargetSaveTasks: ie,
    replaceSegmentSelection: Ei,
    savingSegmentId: L,
    segments: pt,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setCreatingSegmentId: Q,
    setEditorFilters: K,
    setFirstSegmentTagOpen: Pe,
    setHideDerivedSegments: C,
    setHistory: k,
    setHistoryOpen: le,
    setPublishApprovedError: rt,
    setSaveMessage: ne,
    acquireSaveLock: E,
    dispatchPendingChanges: V,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: O,
    startInput: Y,
    tagEditingRef: W,
    timelineDuration: cr,
    video: nt
  });
  function Io(D = null) {
    var st;
    if (!l || L != null || !pt.some((Pt) => !Pt.published && Pt.reviewState === "approved")) return;
    const me = ((st = vt.current) == null ? void 0 : st.ownerDocument) ?? document, Fe = me.activeElement === me.body ? null : me.activeElement;
    ot.current = D != null && D.isConnected && D !== me.body ? D : Fe, rt(""), Ze(!0);
  }
  function Co() {
    L == null && (Ze(!1), rt(""), requestAnimationFrame(() => {
      Cc(
        ot.current,
        vt.current
      ), ot.current = null;
    }));
  }
  async function Gi() {
    await Fi() && Co();
  }
  const { closeMergeConfirmation: Ui, mergeSelectedSwimlane: $o, saveSelectedReviewState: Ki } = Sc({
    acceptHistory: Kr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: I,
    getSaveQueueSnapshot: ae,
    historyRef: v,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ur,
    revealSegmentGroupForSelection: xo,
    savingSegmentId: L,
    selectedGroups: ho,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setMergeConfirmation: Ke,
    setSaveMessage: ne,
    acquireSaveLock: E,
    dispatchPendingChanges: V,
    enqueueSave: R,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: nt
  }), zi = (D) => {
    const me = (D || []).map(Ot);
    z.cancel((Fe) => Fe.kind === "review" && fi(Fe.targets, me));
  };
  M.current = {
    detail: e,
    segments: pt,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    tagEditing: q,
    selectedSegmentIds: f,
    activeSegmentId: (N == null ? void 0 : N.id) ?? null
  }, pe(() => {
    z.poke();
  });
  const { toggleIncorrectExample: Hi, removeIncorrectExample: qi, captureTrainingExport: _i, deleteRejectedSegments: To, autoAssignPerformers: Wi, previewDerivedSegments: Vi, closeMaterializeDialog: Ji, materializeDerivedSegments: Yi, saveTag: Qi, moveToBin: Zi, emptyRecyclingBin: Xi } = kc({
    acceptHistory: Kr,
    allSwimlanes: wt,
    autoAssignCandidates: Yt,
    autoAssigning: We,
    binEmptyingRef: ut,
    canMoveSelectionToBin: xt,
    closeTagEditing: Bn,
    compatibilityMode: l,
    creatingSegmentId: G,
    detail: e,
    editorFilters: x,
    editorRef: vt,
    exportingExamples: Cn,
    hideDerivedSegments: A,
    incorrectExamples: tn,
    lineage: Ur,
    materializeButtonRef: mn,
    materializePreview: Se,
    materializeRestoreFocusRef: In,
    materializing: dt,
    mutateSegment: Oi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Ve,
    cancelSaveTasks: _,
    dispatchPendingChanges: V,
    enqueueSave: R,
    pendingChanges: be,
    runSegmentMutation: Li,
    recordHistoryAction: ur,
    refreshMaterializationPreview: Er,
    removingExampleId: Xn,
    revealSegmentGroupForSelection: xo,
    savingSegmentId: L,
    segmentGroups: Dt,
    segments: pt,
    selectedSegment: N,
    selectedSegmentIdRef: p,
    selectedSegments: Re,
    selectionAnchorIdRef: y,
    selectionRangeBaseIdsRef: h,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Me,
    setAutoAssigning: ke,
    setEditorFilters: K,
    setExportingExamples: Rr,
    setHideDerivedSegments: C,
    setIncorrectExamples: nn,
    setMaterializeError: wn,
    setMaterializeLoading: gt,
    setMaterializeOpen: kt,
    setMaterializePreview: we,
    setMaterializing: Wt,
    setRemovingExampleId: Mr,
    setRejectedDeletionPreview: Ee,
    setSaveMessage: ne,
    acquireSaveLock: E,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: nt
  }), { restoreHistoryTarget: es, updateTimelineRatio: Ao, handleSeparatorPointerDown: ts, handleSeparatorPointerMove: ns, handleSeparatorKeyDown: rs, panelWidthMaximum: Ro, panelSeparatorProps: os, toggleSegmentRail: as, toggleSegmentGroup: Mo, mutateShotBoundary: is } = wc({
    acceptHistory: Kr,
    compatibilityMode: l,
    currentTime: S,
    detail: e,
    editorLayout: ce,
    focusRowRef: gn,
    history: b,
    historyRef: v,
    historySaving: B,
    horizontalLayoutSize: se,
    mediaStackHeight: X,
    mediaStackRef: Rn,
    commonActionsRef: on,
    onDetailChange: t,
    onReload: o,
    railToggleRef: nr,
    recordHistoryAction: ur,
    savingSegmentId: L,
    setCollapsedSegmentGroups: ht,
    setEditorLayout: Z,
    setHistorySaving: H,
    setIncorrectExamples: nn,
    setSaveMessage: ne,
    acquireSaveLock: E,
    enqueueSave: R,
    getSaveQueueSnapshot: ae,
    shotBoundaries: jn,
    timelineDuration: cr,
    video: nt,
    workspaceRef: Mn
  }), { executeShortcutById: Eo, stepVideoFrame: ss } = Nc({
    allSwimlanes: wt,
    applyShortcutTiming: Bi,
    centerTimelineRef: tr,
    compatibilityMode: l,
    createSegment: ko,
    currentTime: S,
    deleteRejectedSegments: To,
    duplicateSegment: No,
    editorLayout: ce,
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
    selectedSegmentGroupKey: ee,
    selectedSegments: Re,
    setCollapsedSegmentGroups: ht,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: Oe,
    setSaveMessage: ne,
    setSelectedSegmentGroupKey: de,
    setTagEditing: O,
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
  const ls = ze(() => Qn.map((D) => ({
    id: D.id,
    enabled: xn(D, l),
    surface: "local",
    action: (me) => {
      var Fe;
      return (Fe = rn.current) == null ? void 0 : Fe.call(rn, D.id, me);
    }
  })), [l]);
  Ta(oo, ls);
  const ds = io(X), cs = ln(ce.markerRailWidth, Ro("markerRailWidth")), us = ln(ce.detailWidth, Ro("detailWidth"));
  return n(vc, {
    activeFilterCount: Lr,
    allSwimlanes: wt,
    analysisError: he,
    analysisRun: je,
    analysisStatus: De,
    approvalFacetCounts: Pr,
    autoAssignCandidates: Yt,
    autoAssignError: Le,
    autoAssignOpen: Ie,
    autoAssignPerformers: Wi,
    autoAssigning: We,
    canMoveSelectionToBin: xt,
    captureTrainingExport: _i,
    cancelQueuedReviewsForSegments: zi,
    removeIncorrectExample: qi,
    rejectedDeletionPreview: Be,
    centerTimelineRef: tr,
    closeEditorFilters: Gn,
    closeFirstSegmentTagDialog: dr,
    closeMaterializeDialog: Ji,
    closeMergeConfirmation: Ui,
    closePublishApprovedDialog: Co,
    closeTagEditing: Bn,
    collapsedSegmentGroups: _e,
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
    editorLayout: ce,
    editorRef: vt,
    exportingExamples: Cn,
    filtersButtonRef: En,
    filtersOpen: F,
    firstSegmentTagOpen: Ce,
    focusRowRef: gn,
    handleSeparatorKeyDown: rs,
    handleSeparatorPointerDown: ts,
    handleSeparatorPointerMove: ns,
    hideDerivedSegments: A,
    history: b,
    historyOpen: P,
    historySaving: B,
    hasNextUnreviewed: Ti,
    hasPreviousUnreviewed: $i,
    horizontalLayoutSize: se,
    importNativeSegments: $t,
    incorrectExamples: tn,
    incorrectExamplesOpen: Je,
    removingExampleId: Xn,
    lineage: Ur,
    markerRailWidth: cs,
    materializeButtonRef: mn,
    materializeCancelButtonRef: Jt,
    materializeDerivedSegments: Yi,
    materializeError: Vt,
    materializeLoading: qe,
    materializeOpen: St,
    materializePreview: Se,
    materializing: dt,
    mediaStackRef: Rn,
    mergeCancelButtonRef: et,
    mergeConfirmation: Ne,
    mergeSaving: Nd(re, "merge"),
    mergeSelectedSwimlane: $o,
    nativeImportState: tt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Io,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: os,
    pendingInitialSeekRef: er,
    performerSlots: Ve,
    performerSlotsAvailable: lr,
    playbackControlsRef: An,
    previewDerivedSegments: Vi,
    provenance: Mi,
    provenanceSources: Or,
    publishApprovedCancelButtonRef: ct,
    publishApprovedDrafts: Gi,
    publishApprovedError: mt,
    publishApprovedOpen: bt,
    quickSearchOpen: xe,
    railScrollRef: Pn,
    railToggleRef: nr,
    recordHistoryAction: ur,
    restoreHistoryTarget: es,
    runEditorAction: Eo,
    stepVideoFrame: ss,
    saveMessage: J,
    setSaveMessage: ne,
    saveTag: Qi,
    saveTiming: ji,
    savingSegmentId: L,
    acquireSaveLock: E,
    seekRef: Tn,
    segmentGroups: Dt,
    segmentRailLayout: Kn,
    segments: Bt,
    selectAllVideoSegments: Pi,
    selectSegment: So,
    selectSegmentCollection: Di,
    selectedGroups: ho,
    selectedPerformerSlots: Gt,
    selectedSegment: Xe,
    selectedSegmentGroupKey: ee,
    selectedSegmentIds: f,
    selectedSegments: Re,
    selectedSlotStatus: Fr,
    setAutoAssignError: Ye,
    setAutoAssignOpen: Me,
    setConfiguringTag: Nn,
    setCurrentTime: w,
    setEditorFilters: K,
    setEditorLayout: Z,
    setFiltersOpen: T,
    setHideDerivedSegments: C,
    setHistoryOpen: le,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: Oe,
    setRejectedDeletionPreview: Ee,
    setRailViewport: Ln,
    setSelectedSegmentGroupKey: de,
    setSelectedSegmentId: u,
    setShortcutsOpen: $e,
    setTimelineZoom: ue,
    shotBoundaries: jn,
    shortcutsOpen: Ae,
    slotButtonRef: rr,
    splitLayout: a,
    splitSegment: wo,
    startFullAnalysis: it,
    tagEditing: q,
    creatingSegmentId: G,
    tagSearchRef: or,
    timelineDuration: cr,
    timelineRatioBounds: ds,
    timelineZoom: oe,
    toggleSegmentGroup: Mo,
    toggleSegmentRail: as,
    updateTimelineRatio: Ao,
    video: nt,
    videoPerformers: Fn,
    visibleCounts: an,
    visibleSegmentRailRows: Ci,
    visibleSegments: ft,
    wideLayout: $n,
    workspaceRef: Mn
  });
}
const Tc = /* @__PURE__ */ new Set(["queued", "running"]);
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
function Ac() {
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
async function Rc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await va(i, async (m) => {
    try {
      const [p, y] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((I) => Tc.has(I == null ? void 0 : I.status)))
        throw new Error("A Full Scan is already queued or running.");
      const h = (y == null ? void 0 : y.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: h };
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
    } catch (h) {
      return xa(m, h);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Mc(e = [], t = []) {
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
function Ec(e = [], t = "", r = "all") {
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
function Dc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, y) => (p.sortOrder ?? 0) - (y.sortOrder ?? 0) || Number(p.id) - Number(y.id)).forEach((p, y) => {
    [...p.tags || []].sort((h, I) => (h.sortOrder ?? 0) - (I.sortOrder ?? 0) || Number(h.tagId) - Number(I.tagId)).forEach((h, I) => r.set(Number(h.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? y,
      tagSortOrder: h.sortOrder ?? I
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, y) {
    const h = Number(p);
    if (!o.has(h)) {
      const I = r.get(h);
      o.set(h, {
        tagId: h,
        name: y || `Tag ${h}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (I == null ? void 0 : I.key) || "ungrouped",
        segmentGroupId: (I == null ? void 0 : I.id) ?? null,
        segmentGroupName: (I == null ? void 0 : I.name) || "Ungrouped",
        segmentGroupSortOrder: (I == null ? void 0 : I.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (I == null ? void 0 : I.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(h);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const y = i(p.sourceTagId, p.sourceTagName), h = i(p.derivedTagId, p.derivedTagName);
    y.outgoingRuleCount++, h.incomingRuleCount++;
    const I = `${y.tagId}:${h.tagId}`;
    a.has(I) || a.set(I, {
      id: I,
      sourceTagId: y.tagId,
      derivedTagId: h.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(I);
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
      const C = y.shift();
      h.push(C);
      for (const S of d.get(C) || [])
        c.has(S) || (c.add(S), y.push(S));
    }
    const I = new Set(h), x = h.map((C) => o.get(C)), K = l.filter((C) => I.has(C.sourceTagId) && I.has(C.derivedTagId)), F = K.flatMap((C) => C.rules), T = x.filter((C) => C.outgoingRuleCount === 0).sort((C, S) => Nt(C.name, S.name)), A = T.length > 0 ? T : [...x].sort((C, S) => Nt(C.name, S.name));
    g.push({
      id: [...h].sort((C, S) => C - S).join(":"),
      label: A.length > 1 ? `${A[0].name} + ${A.length - 1}` : ((m = A[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: x,
      connections: K,
      rules: F,
      segmentGroupKeys: [...new Set(x.map((C) => C.segmentGroupKey))],
      materializedEdgeCount: F.reduce(
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
      var h;
      return (h = u.get(y.segmentGroupKey)) == null ? void 0 : h.componentIds.add(p.id);
    }), p.rules.forEach((y) => {
      var h, I;
      (h = u.get(o.get(Number(y.sourceTagId)).segmentGroupKey)) == null || h.ruleIds.add(y.id), (I = u.get(o.get(Number(y.derivedTagId)).segmentGroupKey)) == null || I.ruleIds.add(y.id);
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
function Pc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((w) => [w.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((w) => {
    var M, z;
    (M = g.get(w.sourceTagId)) == null || M.add(w.derivedTagId), (z = u.get(w.derivedTagId)) == null || z.add(w.sourceTagId);
  });
  const f = new Map(e.nodes.map((w) => {
    var M;
    return [
      w.tagId,
      ((M = u.get(w.tagId)) == null ? void 0 : M.size) || 0
    ];
  })), m = new Map(e.nodes.map((w) => [w.tagId, 0])), p = e.nodes.filter((w) => f.get(w.tagId) === 0).sort((w, M) => Nt(w.name, M.name)).map((w) => w.tagId), y = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const w = p.shift();
    if (!y.has(w)) {
      y.add(w);
      for (const M of g.get(w) || [])
        m.set(M, Math.max(m.get(M) || 0, (m.get(w) || 0) + 1)), f.set(M, f.get(M) - 1), f.get(M) === 0 && p.push(M);
    }
  }
  y.size !== e.nodes.length && e.nodes.filter((w) => !y.has(w.tagId)).sort((w, M) => Nt(w.name, M.name)).forEach((w) => m.set(w.tagId, 0));
  const h = Math.max(0, ...m.values()), I = Math.max(
    t,
    240 + h * 296
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
  const K = [...x.values()].sort((w, M) => w.sortOrder - M.sortOrder || Nt(w.name, M.name));
  let F = 28;
  const T = [], A = K.map((w) => {
    const M = /* @__PURE__ */ new Map();
    w.nodes.forEach((R) => {
      const _ = m.get(R.tagId) || 0;
      M.has(_) || M.set(_, []), M.get(_).push(R);
    });
    for (const R of M.values())
      R.sort((_, ie) => _.segmentGroupTagSortOrder - ie.segmentGroupTagSortOrder || Nt(_.name, ie.name));
    const z = Math.max(1, ...[...M.values()].map((R) => R.length)), re = z * 58 + (z - 1) * 18, L = 70 + re, E = {
      ...w,
      x: 12,
      y: F,
      width: I - 24,
      height: L
    };
    for (const [R, _] of M.entries()) {
      const ie = _.length * 58 + Math.max(0, _.length - 1) * 18, ae = (re - ie) / 2;
      _.forEach((be, V) => T.push({
        ...be,
        rank: R,
        x: 28 + R * 296,
        y: F + 34 + 18 + ae + V * 76,
        width: 184,
        height: 58
      }));
    }
    return F += L + 16, E;
  }), C = new Map(T.map((w) => [w.tagId, w])), S = e.connections.map((w) => {
    const M = C.get(w.sourceTagId), z = C.get(w.derivedTagId), re = M.x + M.width, L = M.y + M.height / 2, E = z.x, R = z.y + z.height / 2, _ = Math.max(48, (E - re) * 0.48);
    return {
      ...w,
      path: `M ${re} ${L} C ${re + _} ${L}, ${E - _} ${R}, ${E} ${R}`
    };
  });
  return {
    width: I,
    height: Math.max(r, F - 16 + 28),
    nodes: T,
    connections: S,
    groups: A
  };
}
function Oc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Pc(d, {
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
      const y = m.get(p.sourceTagId), h = m.get(p.derivedTagId), I = y.x + y.width, x = y.y + y.height / 2, K = h.x, F = h.y + h.height / 2, T = Math.max(48, (K - I) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${I} ${x} C ${I + T} ${x}, ${K - T} ${F}, ${K} ${F}`
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
function Lc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Fc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: y, materializationOffer: h, materializeOutgoingRules: I, materializeRule: x, message: K, normalizedQuery: F, query: T, refreshConfiguredTag: A, revealEditor: C, rules: S, save: w, segmentGroupKey: M, selectedNode: z, selectedRule: re, selection: L, setConfiguringTag: E, setDraft: R, setListSort: _, setMaterializationOffer: ie, setQuery: ae, setSegmentGroupKey: be, setSelection: V, setView: J, sortedVisibleRules: ne, sourceSlots: Y, sourceSlotsLoading: fe, updateMapping: ye, updateTag: ve, view: oe, visibleComponents: ue, visibleRules: ce } = e;
  function Z(b) {
    const k = m.nodes.find((P) => P.tagId === Number(b.sourceTagId)), v = m.nodes.find((P) => P.tagId === Number(b.derivedTagId));
    return (k == null ? void 0 : k.segmentGroupKey) === (v == null ? void 0 : v.segmentGroupKey) ? k.segmentGroupKey : "cross-group";
  }
  function X() {
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
          onClick: () => R(null),
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
              onChange: (b, k) => ve("source", b, k == null ? void 0 : k.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !fe && Y.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (b) => E({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: b.currentTarget
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
              onChange: (b, k) => ve("derived", b, k == null ? void 0 : k.label),
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
              onClick: (b) => E({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: b.currentTarget
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
            disabled: r || Y.length === 0 || s.length === 0,
            onClick: () => R((b) => ({
              ...b,
              slotMappings: [...b.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((b, k) => n("div", { key: k, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: b.sourceSlotDefinitionId,
              disabled: r,
              onChange: (v) => ye(k, "sourceSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${k + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...Y.map((v) => n("option", { key: v.id, value: v.id }, Ct(v)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: b.derivedSlotDefinitionId,
              disabled: r,
              onChange: (v) => ye(k, "derivedSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${k + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((v) => n("option", { key: v.id, value: v.id }, Ct(v)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => R((v) => ({
                ...v,
                slotMappings: v.slotMappings.filter((P, le) => le !== k)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${k + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((b) => !b.sourceSlotDefinitionId || !b.derivedSlotDefinitionId),
          onClick: w,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => R(null), className: o }, "Cancel")
      ])
    ]);
  }
  function U() {
    if (z) {
      const v = ce.filter((B) => Number(B.derivedTagId) === z.tagId), P = ce.filter((B) => Number(B.sourceTagId) === z.tagId), le = (B, H, q) => n("div", {
        key: B.id,
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
            `${B.sourceTagName} → ${B.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          q ? n("button", {
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
          onClick: (B) => E({
            tagId: z.tagId,
            tagName: z.name,
            trigger: B.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        P.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => I(z, P),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${P.length})`) : null,
        P.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...P.map((B) => le(B, "Derives", !0))
        ]) : null,
        v.length ? n("details", {
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
              v.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            v.map((B) => le(B, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!re)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const b = m.nodes.find((v) => v.tagId === Number(re.sourceTagId)), k = m.nodes.find((v) => v.tagId === Number(re.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (b == null ? void 0 : b.segmentGroupName) || "Ungrouped"),
          (b == null ? void 0 : b.segmentGroupKey) !== (k == null ? void 0 : k.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(k == null ? void 0 : k.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${re.sourceTagName} → ${re.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${re.edgeCount} materialized lineage edge${re.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (h == null ? void 0 : h.ruleId) === re.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => x(re, h),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => ie(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        re.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : re.slotMappings.map((v, P) => n("div", {
          key: `${v.sourceSlotDefinitionId}:${v.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: v.sourceSlotLabel || "Unnamed slot" },
            v.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: v.derivedSlotLabel || "Unnamed slot" },
            v.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          re.createdAt ? new Date(re.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          re.updatedAt ? new Date(re.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(re),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(re),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(re),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function se() {
    if (ue.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, F ? "No derivation relationships match your search." : "No derivation rules.");
    const b = z == null ? void 0 : z.tagId, k = /* @__PURE__ */ new Set();
    return z && (k.add(z.tagId), p.connections.forEach((v) => {
      (v.sourceTagId === z.tagId || v.derivedTagId === z.tagId) && (k.add(v.sourceTagId), k.add(v.derivedTagId));
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
        ...p.groups.map((v) => n("div", {
          key: `group:${v.componentId}:${v.key}`,
          className: `absolute rounded-xl border ${M === v.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${v.x}px`,
            top: `${v.y}px`,
            width: `${v.width}px`,
            height: `${v.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: v.name
        }, v.name))),
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
          ...p.connections.map((v) => {
            const P = b === v.sourceTagId || b === v.derivedTagId, le = z != null, B = P ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${v.id}:visible`,
              d: v.path,
              fill: "none",
              stroke: B,
              strokeWidth: P ? 2.5 : 1.5,
              opacity: le && !P ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((v) => {
          const P = !F || v.name.toLocaleLowerCase().includes(F), le = z != null, B = k.has(v.tagId), H = (z == null ? void 0 : z.tagId) === v.tagId;
          return n("button", {
            key: `node:${v.tagId}`,
            type: "button",
            onClick: () => V({ type: "node", id: v.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${H ? "border-accent bg-accent/15 ring-2 ring-accent/25" : B ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${v.x}px`,
              top: `${v.y}px`,
              width: `${v.width}px`,
              height: `${v.height}px`,
              opacity: !P || le && !B ? 0.62 : 1
            },
            title: `${v.name} — ${v.segmentGroupName}`,
            "aria-label": `${v.name}, ${v.incomingRuleCount} incoming and ${v.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, v.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${v.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${v.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((v) => v.rules.length > 1).map((v) => {
          const P = p.nodes.find((B) => B.tagId === v.sourceTagId), le = p.nodes.find((B) => B.tagId === v.derivedTagId);
          return n("div", {
            key: `bundle:${v.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(P.x + P.width + le.x) / 2 - 24}px`,
              top: `${(P.y + P.height / 2 + le.y + le.height / 2) / 2 - 10}px`
            },
            "aria-label": `${v.rules.length} rules connect ${v.rules[0].sourceTagName} to ${v.rules[0].derivedTagName}`
          }, `${v.rules.length} rules`);
        })
      ])
    ]);
  }
  function $() {
    if (ue.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        F ? "No derivation relationships match your search." : "No derivation rules."
      );
    const b = /* @__PURE__ */ new Map();
    ne.forEach((v) => {
      const P = Z(v);
      b.has(P) || b.set(P, []), b.get(P).push(v);
    });
    const k = [
      ...m.segmentGroups.map((v) => v.key),
      "cross-group"
    ].filter((v) => b.has(v));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, k.map((v) => {
      const P = m.segmentGroups.find((H) => H.key === v), le = v === "cross-group" ? "Cross-group relationships" : (P == null ? void 0 : P.name) || "Ungrouped", B = b.get(v);
      return n("section", { key: v, "aria-label": le }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, le),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${B.length} rule${B.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${le} derivation rules` }, [
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
          ...B.map((H) => n("button", {
            key: H.id,
            type: "button",
            role: "row",
            onClick: () => V({ type: "rule", id: H.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(re == null ? void 0 : re.id) === H.id ? "bg-accent/10" : ""}`,
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
          `${S.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          R(f()), V(null), C();
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
          value: T,
          onChange: (b) => {
            ae(b.target.value), V(null);
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
          onChange: (b) => {
            be(b.target.value), V(null), R(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((b) => n("option", { key: b.key, value: b.key }, b.name))
        ])
      ]),
      oe === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: y,
          onChange: (b) => _(b.target.value),
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
        ].map(([b, k]) => n("button", {
          key: b,
          type: "button",
          onClick: () => {
            J(b), b === "graph" && (L == null ? void 0 : L.type) === "rule" && V(null);
          },
          "aria-pressed": oe === b,
          className: `rounded px-3 py-1.5 text-sm font-medium ${oe === b ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, k))
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
        oe === "graph" ? se() : $()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? X() : U()
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
        const b = i.trigger;
        E(null), requestAnimationFrame(() => {
          b != null && b.isConnected && b.focus();
        });
      }
    }) : null
  ]);
}
function jc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = j([]), [a, s] = j(null), [l, d] = j([]), [c, g] = j([]), [u, f] = j(!1), [m, p] = j(!1), [y, h] = j(!1), [I, x] = j(""), [K, F] = j(""), [T, A] = j("graph"), [C, S] = j("all"), [w, M] = j(null), [z, re] = j("relationship"), [L, E] = j(null), [R, _] = j(null), ie = ge(null), ae = ge(null), be = ti().replace(/:/g, "");
  function V() {
    requestAnimationFrame(() => {
      var O;
      return (O = ie.current) == null ? void 0 : O.scrollIntoView({ block: "nearest" });
    });
  }
  async function J(O) {
    const W = await te("/derivation-rules", O ? { signal: O } : void 0);
    i(W || []);
  }
  pe(() => {
    const O = new AbortController();
    return J(O.signal).catch((W) => {
      W.name !== "AbortError" && x(W.message || "Unable to load derived segment rules.");
    }), () => O.abort();
  }, []), pe(() => {
    const O = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), te(`/slot-definitions/${a.sourceTagId}`, { signal: O.signal }).then((W) => d(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && d([]);
    }).finally(() => {
      O.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), te(`/slot-definitions/${a.derivedTagId}`, { signal: O.signal }).then((W) => g(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && g([]);
    }).finally(() => {
      O.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => O.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), pe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const O = `${a.sourceTagId}:${a.derivedTagId}`;
    ae.current !== O && (ae.current = O, s((W) => !W || Number(W.sourceTagId) !== Number(a.sourceTagId) || Number(W.derivedTagId) !== Number(a.derivedTagId) ? W : td(W, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ne(O, W = !1) {
    W || M({ type: "rule", id: O.id }), ae.current = null, s({
      ruleId: O.id,
      sourceTagId: O.sourceTagId,
      sourceTagName: O.sourceTagName,
      derivedTagId: O.derivedTagId,
      derivedTagName: O.derivedTagName,
      slotMappings: O.slotMappings.map((G) => ({
        sourceSlotDefinitionId: G.sourceSlotDefinitionId,
        derivedSlotDefinitionId: G.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), V();
  }
  function Y(O, W, G = "") {
    ae.current = null, O === "source" ? (d([]), f(W != null)) : (g([]), p(W != null)), s((Q) => ({
      ...Q,
      [`${O}TagId`]: W == null ? null : Number(W),
      [`${O}TagName`]: G || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function fe(O) {
    (a == null ? void 0 : a.ruleId) == null && (ae.current = null);
    const W = [J(), t == null ? void 0 : t()];
    return O.draftKind === "source" ? (f(!0), W.push(te(`/slot-definitions/${O.tagId}`).then((G) => d(G.definitions || [])).finally(() => f(!1)))) : O.draftKind === "derived" && (p(!0), W.push(te(`/slot-definitions/${O.tagId}`).then((G) => g(G.definitions || [])).finally(() => p(!1)))), Promise.all(W);
  }
  function ye(O, W, G) {
    s((Q) => ({
      ...Q,
      slotMappings: Q.slotMappings.map((Ce, Pe) => Pe === O ? { ...Ce, [W]: G } : Ce)
    }));
  }
  async function ve() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const O = Sa(a, o);
    if (O) {
      x(O.message);
      return;
    }
    if (a.slotMappings.some((W) => !W.sourceSlotDefinitionId || !W.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    h(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let W = null;
      if (a.ruleId != null) {
        const Q = await te(
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
      x("Saving derived segment rule…");
      const G = await te("/derivation-rules", {
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
      if (await J(), M(T === "graph" ? { type: "node", id: Number(G.sourceTagId) } : { type: "rule", id: G.id }), s(null), a.ruleId == null)
        try {
          const Q = await te(
            `/derivation-rules/${G.id}/materialization/preview`,
            { method: "POST" }
          );
          E(
            Q.createCount + Q.linkCount > 0 ? Q : null
          ), x(Q.createCount + Q.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          E(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        E(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (W) {
      x(W.message || "Unable to save derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function oe(O) {
    h(!0), x("Previewing rule deletion…");
    try {
      const W = await te(
        `/derivation-rules/${O.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${O.sourceTagName} → ${O.derivedTagName}?

Deleted segments: ${W.deletedSegmentCount}
Removed lineage edges: ${W.removedEdgeCount}
Shared derived segments retained: ${W.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const G = `derivation-rule-delete:${O.id}:${W.fingerprint}`;
      await te(`/derivation-rules/${O.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(G),
          fingerprint: W.fingerprint
        })
      }), Ue(G), await J(), (a == null ? void 0 : a.ruleId) === O.id && s(null), (w == null ? void 0 : w.type) === "rule" && w.id === O.id && M(null), (L == null ? void 0 : L.ruleId) === O.id && E(null), x(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (W) {
      x(W.message || "Unable to delete derived segment rule.");
    } finally {
      h(!1);
    }
  }
  async function ue(O, W = null) {
    const G = W || await te(
      `/derivation-rules/${O.id}/materialization/preview`,
      { method: "POST" }
    );
    if (G.createCount + G.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const Q = `derivation-rule-materialize:${O.id}:${G.fingerprint}`, Ce = await te(`/derivation-rules/${O.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ge(Q),
        fingerprint: G.fingerprint
      })
    });
    return Ue(Q), Ce;
  }
  async function ce(O, W = null) {
    h(!0), x("Finding pending derivations…");
    try {
      const G = await ue(O, W);
      if (E(null), await J(), G.createdCount + G.linkedCount === 0) {
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
  async function Z(O, W) {
    if (W.length === 0) return;
    h(!0), x(`Finding pending derivations from ${O.name}…`);
    let G = 0, Q = 0;
    try {
      for (const Ce of W) {
        const Pe = await ue(Ce);
        G += Pe.createdCount, Q += Pe.linkedCount;
      }
      E(null), await J(), x(G + Q === 0 ? `Every outgoing derivation from ${O.name} is already materialized.` : `${G} derived segment${G === 1 ? "" : "s"} created and ${Q} existing segment${Q === 1 ? "" : "s"} linked from ${O.name}.`);
    } catch (Ce) {
      await J().catch(() => {
      }), x(Ce.message || `Unable to materialize derivations from ${O.name}.`);
    } finally {
      h(!1);
    }
  }
  const X = Sa(a, o), U = ze(
    () => Dc(o, e),
    [o, e]
  ), se = K.trim().toLocaleLowerCase(), b = U.components.filter((O) => C === "all" || O.segmentGroupKeys.includes(C)).filter((O) => !se || O.nodes.some((W) => W.name.toLocaleLowerCase().includes(se))), k = b.flatMap((O) => O.rules), v = new Set(
    b.flatMap((O) => O.nodes.map((W) => W.tagId))
  ), P = ze(
    () => Oc(b),
    [b]
  ), le = T === "list" ? Lc(
    w,
    k,
    se.length > 0
  ) : null, B = (w == null ? void 0 : w.type) === "node" && U.nodes.find((O) => O.tagId === w.id && v.has(O.tagId)) || null, H = [...k].sort((O, W) => z === "source" ? Nt(O.sourceTagName, W.sourceTagName) || Nt(O.derivedTagName, W.derivedTagName) : z === "target" ? Nt(O.derivedTagName, W.derivedTagName) || Nt(O.sourceTagName, W.sourceTagName) : z === "materialized" ? (Number(W.edgeCount) || 0) - (Number(O.edgeCount) || 0) || Nt(O.sourceTagName, W.sourceTagName) : Nt(
    `${O.sourceTagName} ${O.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Fc, {
    arrowMarkerId: be,
    busy: y,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: R,
    deleteRule: oe,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: X,
    editRule: ne,
    editorRef: ie,
    emptyDraft: r,
    graph: U,
    layout: P,
    listSort: z,
    materializationOffer: L,
    materializeOutgoingRules: Z,
    materializeRule: ce,
    message: I,
    normalizedQuery: se,
    query: K,
    refreshConfiguredTag: fe,
    revealEditor: V,
    rules: o,
    save: ve,
    segmentGroupKey: C,
    selectedNode: B,
    selectedRule: le,
    selection: w,
    setConfiguringTag: _,
    setDraft: s,
    setListSort: re,
    setMaterializationOffer: E,
    setQuery: F,
    setSegmentGroupKey: S,
    setSelection: M,
    setView: A,
    sortedVisibleRules: H,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ye,
    updateTag: Y,
    view: T,
    visibleComponents: b,
    visibleRules: k
  });
}
function Bc() {
  const [e, t] = j(Ja), r = [
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
function Gc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = j([]), [a, s] = j(!1), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j("all"), [y, h] = j(() => /* @__PURE__ */ new Set()), [I, x] = j(null);
  pe(() => {
    if (!e || a) return;
    const E = new AbortController();
    return d(!0), g(""), te("/slot-definitions", { signal: E.signal }).then((R) => {
      i(R || []), s(!0);
    }).catch((R) => {
      R.name !== "AbortError" && g(R.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      E.signal.aborted || d(!1);
    }), () => E.abort();
  }, [e, a]);
  async function K() {
    d(!0), g("");
    try {
      const E = await te("/slot-definitions");
      i(E || []), s(!0);
    } catch (E) {
      g(E.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function F() {
    const [E] = await Promise.all([
      te("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(E || []), s(!0), g("");
  }
  function T() {
    const E = I == null ? void 0 : I.trigger;
    x(null), requestAnimationFrame(() => {
      E != null && E.isConnected && E.focus({ preventScroll: !0 });
    });
  }
  function A(E) {
    h((R) => {
      const _ = new Set(R);
      return _.has(E) ? _.delete(E) : _.add(E), _;
    });
  }
  const C = ze(
    () => Mc(t, o),
    [t, o]
  ), S = ze(
    () => Ec(C, u, m),
    [C, u, m]
  ), w = C.flatMap((E) => E.tags), M = w.filter((E) => E.definitions.length > 0).length, z = w.length - M, re = [
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
        `${w.length} tags · ${M} with slots · ${z} without slots`
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
          re.map(([E, R]) => n("button", {
            key: E,
            type: "button",
            onClick: () => p(E),
            "aria-pressed": m === E,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === E ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, R))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => h(/* @__PURE__ */ new Set()),
          className: L
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => h(new Set(C.map((E) => E.overviewKey))),
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
        onClick: K,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && S.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, S.map((E) => {
      const R = y.has(E.overviewKey), _ = E.tags.filter((ie) => ie.definitions.length > 0).length;
      return n("article", {
        key: E.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => A(E.overviewKey),
          "aria-expanded": !R,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, R ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, E.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${E.tags.length} tag${E.tags.length === 1 ? "" : "s"} · ${_} with slots`
          )
        ]),
        R ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          E.tags.map((ie) => n("li", {
            key: ie.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: ie.tagName }, ie.tagName),
              ie.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            ie.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${ie.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, ie.definitions.map((ae) => n("li", {
              key: ae.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, Ct(ae)),
              ...(ae.genderHints || []).map((be) => n("span", {
                key: be,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, $r(be)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ae) => x({
                tagId: ie.tagId,
                tagName: ie.tagName,
                trigger: ae.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ie.tagName}`,
              className: `${L} self-start`,
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
      onSaved: F,
      onClose: T
    }) : null
  ]);
}
function Uc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = j("general"), [a, s] = j([]), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j(null), [y, h] = j(!0), [I, x] = j(!1), [K, F] = j(""), [T, A] = j(!0), [C, S] = j(Ka), w = bl(t), M = w.map(([R]) => R);
  pe(() => {
    M.includes(o) || i(M[0] || "general");
  }, [t.effectiveMode]);
  async function z(R) {
    const _ = await te("/segment-groups", R ? { signal: R } : void 0);
    s(_ || []);
  }
  pe(() => {
    const R = new AbortController();
    return z(R.signal).catch((_) => {
      _.name !== "AbortError" && g(_.message || "Unable to load tag groups.");
    }), () => R.abort();
  }, []), pe(() => {
    if (t.effectiveMode !== "full") {
      h(!1);
      return;
    }
    const R = new AbortController();
    return F(""), h(!0), Promise.all([
      te("/analysis/settings", { signal: R.signal }),
      te("/analysis/status", { signal: R.signal })
    ]).then(([_, ie]) => {
      A(!0), f((_ == null ? void 0 : _.baseUrl) || ""), p(ie);
    }).catch((_) => {
      if (_.name !== "AbortError") {
        if (_.status === 403) {
          A(!1), F("You do not have permission to manage the analysis service connection.");
          return;
        }
        F(_.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      R.signal.aborted || h(!1);
    }), () => R.abort();
  }, [t.effectiveMode]);
  async function re(R) {
    if (R !== t.requestedMode) {
      d(!0), g("");
      try {
        const _ = await te(
          `/preferences/transition?mode=${encodeURIComponent(R)}`
        );
        let ie = !1, ae = null, be = null, V = null, J = !1;
        if (t.requestedMode === "basic" && R === "full") {
          if (!window.confirm(xl(
            _.recyclingBinCount,
            _.protectedRecyclingBinCount
          )))
            return;
          J = !0, _.recyclingBinCount > 0 && (ie = !0, V = _.recyclingBinFingerprint, ae = `mode-switch-empty-bin:${V}`, be = Ge(ae));
        }
        let ne = !1;
        if (t.requestedMode === "full" && R === "basic") {
          if (!window.confirm(vl(
            _.extensionOwnedSegmentCount
          )))
            return;
          ne = !0;
        }
        const Y = await te("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: R,
            confirmHiddenExtensionOwnedSegments: ne,
            confirmBasicHistoryCleanup: J,
            emptyRecyclingBin: ie,
            operationId: be,
            expectedRecyclingBinFingerprint: V
          })
        });
        ae && Ue(ae), r == null || r(Ya(Y)), g("Workflow mode saved.");
      } catch (_) {
        g(_.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function L(R) {
    R.preventDefault(), x(!0), F("");
    try {
      const _ = await te("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((_ == null ? void 0 : _.baseUrl) || "");
      const ie = await te("/analysis/status");
      p(ie), F(_ != null && _.baseUrl ? ie != null && ie.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ie == null ? void 0 : ie.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (_) {
      F(_.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const E = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (R) => Si(R, e, E), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      w.map(([R, _]) => n("button", {
        key: R,
        type: "button",
        onClick: () => i(R),
        "aria-current": o === R ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === R ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, _))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Bc)
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
      n(nc, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: re,
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
          onChange: (R) => {
            const _ = R.target.checked;
            za(_), S(_);
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
            onChange: (R) => f(R.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: y || I || !T,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: y || I || !T,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, I ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        K || (y ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    M.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(jc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    M.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Gc, {
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
function Kc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
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
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Te(e.startSec)} to ${e.endSec == null ? "end of video" : Te(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Te(e.startSec)} → end` : `${Te(e.startSec)} – ${Te(e.endSec)}`)
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
function zc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
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
  const r = ze(() => {
    const J = Aa("ext:com.midnightrider.segment-studio:segments");
    return J ? {
      ...Hr,
      defaultFilter: { ...Hr.defaultFilter, ...J.findFilter || {} },
      defaultObjectFilter: J.objectFilter || {}
    } : Hr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Ra(r), [l, d] = j(null), [c, g] = j({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = j(null), [m, p] = j(null), [y, h] = j(0), [I, x] = j(""), [K, F] = j(!0), [T, A] = j(""), C = ge(0), S = Xo(o, i), w = S.activityTagId, M = vn(i.slots), z = ze(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (J) => Object.keys(vn(J)).length > 0,
    sanitize: (J) => qr(w, vn(J)),
    summarize: (J) => `${Object.keys(vn(J)).length} assigned`,
    renderEditor: (J, ne) => w ? n(ka, {
      facets: l,
      values: vn(J),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (Y, fe) => {
        const ye = { ...vn(J) };
        fe ? ye[Y] = Number(fe) : delete ye[Y], ne(qr(w, ye));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [w, l, c.performerSlotsAvailable]), re = JSON.stringify(S);
  pe(() => {
    if (d(null), !w) return;
    const J = new AbortController();
    return te(`/browse/activities/${w}/facets`, { signal: J.signal }).then(d).catch((ne) => {
      ne.status === 403 ? d({ slots: [], restricted: !0 }) : ne.name !== "AbortError" && A(ne.message);
    }), () => J.abort();
  }, [w]), pe(() => {
    const J = ++C.current, ne = new AbortController();
    return F(!0), A(""), te("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S), signal: ne.signal }).then((Y) => {
      J === C.current && g({ ...Y, totalCount: Y.totalCount ?? Y.total ?? 0 });
    }).catch((Y) => {
      if (!(J !== C.current || Y.name === "AbortError")) {
        if (Y.status === 400 && Y.message.includes("unrestricted performer read access")) {
          g((fe) => ({ ...fe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), A("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        A(Y.message);
      }
    }).finally(() => {
      J === C.current && F(!1);
    }), () => {
      C.current++, ne.abort();
    };
  }, [re, y]);
  const L = c.items.findIndex((J) => J.key === u), E = c.items[L] || null;
  function R(J) {
    s(J), a({ ...o, page: 1 });
  }
  function _(J) {
    const ne = Xo(o, J), Y = J.slots && ne.activityTagId != null && ne.slotAssignments.length > 0 ? J.slots : void 0;
    R({ ...J, slots: Y });
  }
  function ie(J, ne) {
    const Y = { ...M };
    ne ? Y[J] = Number(ne) : delete Y[J], R({ ...i, slots: qr(w, Y) });
  }
  function ae() {
    const J = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => J == null ? void 0 : J.focus());
  }
  async function be(J) {
    var fe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(J.key), x("");
    const ne = `browse-restore:${J.itemId}:${J.revision}`, Y = Ge(ne);
    try {
      const ye = (ve = !1) => te(`/bin/${J.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Y,
          expectedRevision: J.revision,
          discardMissingImage: ve
        })
      });
      try {
        await ye(co(ne));
      } catch (ve) {
        if (((fe = ve.payload) == null ? void 0 : fe.code) !== "missing-image" || !window.confirm(`${ve.message}

Continue and discard the missing image reference?`))
          throw ve;
        uo(ne), await ye(!0);
      }
      Ue(ne), u === J.key && f(null), x("Segment restored to Cove."), h((ve) => ve + 1);
    } catch (ye) {
      x(ye.message || "Unable to restore the segment."), ye.status === 409 && h((ve) => ve + 1);
    } finally {
      p(null);
    }
  }
  async function V(J) {
    p(J.key), x("");
    try {
      const ne = await te(`/items/${J.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: J.revision })
      });
      if (!ri(ne, x) || !jl(ne))
        return;
      const Y = `browse-dependency-delete:${J.itemId}:${ne.fingerprint}`;
      await te(`/items/${J.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ge(Y),
          fingerprint: ne.fingerprint
        })
      }), Ue(Y), u === J.key && f(null), x(`${ne.deletedSegmentCount} segment${ne.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), h((fe) => fe + 1);
    } catch (ne) {
      x(ne.message || "Unable to permanently delete the segment."), ne.status === 409 && h((Y) => Y + 1);
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
      error: T ? new Error(T) : null,
      onRetry: () => h((J) => J + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Zo.filter((J) => J.id !== "performers") : Zo,
      objectFilter: i,
      onObjectFilterChange: _,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      w ? n(ka, { key: "slots", facets: l, values: M, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ie }) : null,
      n(zc, { key: "player", item: E, index: L, count: c.items.length, onPrevious: () => {
        var J;
        return f((J = c.items[L - 1]) == null ? void 0 : J.key);
      }, onNext: () => {
        var J;
        return f((J = c.items[L + 1]) == null ? void 0 : J.key);
      }, onClose: ae, onNavigate: e }),
      I ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, I) : null,
      !K && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      K ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((J) => n(Kc, {
        key: J.key,
        item: J,
        selected: J.key === u,
        busy: m === J.key,
        onSelect: () => f(J.key),
        onRestore: be,
        onPurge: V
      })))
    ])
  ]);
}
function Hc({ onNavigate: e, profile: t }) {
  const [r, o] = j([]), [i, a] = j(""), [s, l] = j(0), [d, c] = j(!0), [g, u] = j(null), [f, m] = j(""), p = ge(null);
  async function y(x) {
    const K = await te("/bin", x ? { signal: x } : void 0);
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
  async function h(x) {
    var T;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(x.itemId), m("");
    const K = `restore:${x.itemId}:${x.revision}`, F = Ge(K);
    try {
      const A = (C = !1) => te(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: F, expectedRevision: x.revision, discardMissingImage: C })
      });
      try {
        await A(co(K));
      } catch (C) {
        if (((T = C.payload) == null ? void 0 : T.code) !== "missing-image" || !window.confirm(`${C.message}

Continue and discard the missing image reference?`)) throw C;
        uo(K), await A(!0);
      }
      Ue(K), await y(), _n(), m("Segment restored with a new native ID.");
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Te(x.startSec) : `${Te(x.startSec)} – ${Te(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => h(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
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
  const i = ze(() => {
    var ce;
    const oe = Aa(Na), ue = (ce = oe == null ? void 0 : oe.uiOptions) == null ? void 0 : ce.displayMode;
    return oe ? {
      ...zn,
      defaultFilter: { ...zn.defaultFilter, ...oe.findFilter || {} },
      defaultObjectFilter: oe.objectFilter || {},
      defaultDisplayMode: zn.allowedDisplayModes.includes(ue) ? ue : zn.defaultDisplayMode
    } : zn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Ra(i), [u, f] = j({ items: [], totalCount: 0 }), [m, p] = j(!0), [y, h] = j(""), [I, x] = j(0), [K, F] = j(/* @__PURE__ */ new Set()), [T, A] = j(null), [C, S] = j({ busy: !1, error: "", announcement: "" }), w = ge(0), M = ge(null), z = ge(null);
  z.current || (z.current = Ac());
  const re = JSON.stringify(a), L = JSON.stringify(s), E = t || r === "review";
  pe(() => {
    z.current.selectionChanged(), M.current = null, F(/* @__PURE__ */ new Set()), S((oe) => ({ busy: oe.busy, error: "", announcement: "" }));
  }, [re, L]), pe(() => {
    if (!E) return;
    const oe = new AbortController();
    return te("/analysis/status", { signal: oe.signal }).then(A).catch((ue) => {
      ue.name !== "AbortError" && A({ configured: !0, ready: !1, error: ue.message || "Unable to check Full Scan readiness." });
    }), () => oe.abort();
  }, [E]), pe(() => {
    const oe = ++w.current, ue = new AbortController();
    return p(!0), h(""), te(`/videos?${Qd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ue.signal }).then((ce) => {
      oe === w.current && f(ce);
    }).catch((ce) => {
      oe === w.current && ce.name !== "AbortError" && h(ce.message || "Unable to discover videos.");
    }).finally(() => {
      oe === w.current && p(!1);
    }), () => {
      w.current++, ue.abort();
    };
  }, [re, L, t, r, I]);
  function R(oe) {
    d({ ...oe, page: oe.page || 1 });
  }
  function _(oe) {
    c(oe), d({ ...a, page: 1 });
  }
  function ie(oe, ue = !1) {
    F((ce) => Zd(
      ce,
      u.items.map((Z) => Z.videoId),
      oe,
      M.current,
      ue
    )), M.current = oe;
  }
  function ae() {
    M.current = null, F(new Set(u.items.map((oe) => oe.videoId)));
  }
  function be() {
    M.current = null, F(/* @__PURE__ */ new Set());
  }
  function V() {
    M.current = null, F((oe) => new Set(u.items.map((ue) => ue.videoId).filter((ue) => !oe.has(ue))));
  }
  async function J(oe = ["aiTagging", "omnishotcut"]) {
    const ue = z.current.begin();
    if (ue) {
      S({ busy: !0, error: "", announcement: "" });
      try {
        const ce = await Rc(
          [...K],
          oe,
          te,
          (Z) => window.confirm(Z)
        );
        if (ce.cancelled) {
          S({ busy: !1, error: "", announcement: "" });
          return;
        }
        ce.queuedIds.length > 0 && z.current.ownsCurrentSelection(ue) && (ce.queuedIds.includes(M.current) && (M.current = null), F((Z) => {
          const X = new Set(Z);
          return ce.queuedIds.forEach((U) => X.delete(U)), X;
        })), S({
          busy: !1,
          announcement: ce.queuedIds.length > 0 ? `${ce.queuedIds.length} ${ce.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ce.failed.length > 0 ? `${ce.failed.length} selected ${ce.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ce.failed[0].error}` : ""
        });
      } catch (ce) {
        S({ busy: !1, error: ce.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(ue);
      }
    }
  }
  const ne = t || r === "review" ? pa : pa.filter((oe) => !["reviewState", "shotBoundaries"].includes(oe.id)), Y = T === null || T.configured === !1 || T.ready === !1, fe = C.busy || Y, ye = (T == null ? void 0 : T.error) || (T === null ? "Checking Full Scan availability" : T.configured === !1 ? "Configure the analysis service before running Full Scan" : T.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ve = C.busy ? "Queueing scans…" : T === null ? "Checking Full Scan…" : T.configured === !1 ? "Full Scan not configured" : T.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
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
      onFilterChange: R,
      totalCount: u.totalCount,
      isLoading: m,
      error: y ? new Error(y) : null,
      onRetry: () => x((oe) => oe + 1),
      sortOptions: t || r === "review" ? [...ga, { value: "unreviewed_count", label: "Unreviewed count" }] : ga,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ne,
      objectFilter: s,
      onObjectFilterChange: _,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: E ? K : void 0,
      onSelectAll: E ? ae : void 0,
      onSelectNone: E ? be : void 0,
      onInvertSelection: E ? V : void 0,
      selectionActions: E ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: fe,
          onClick: () => J(),
          title: ye,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, ve),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": fe,
            title: ye,
            onClick: (oe) => {
              fe && oe.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${fe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Ea, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([oe, ue]) => n("button", {
            key: oe,
            type: "button",
            disabled: C.busy,
            onClick: (ce) => {
              var Z;
              (Z = ce.currentTarget.closest("details")) == null || Z.removeAttribute("open"), J(ue);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, oe)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, C.announcement),
      C.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, C.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((oe) => n(Xd, { key: oe.videoId, item: oe, onNavigate: e, showReviewStates: E, selected: K.has(oe.videoId), selectionActive: K.size > 0, onSelect: E ? ie : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((oe) => n(ec, { key: oe.videoId, item: oe, onNavigate: e, showReviewStates: E, selected: K.has(oe.videoId), selectionActive: K.size > 0, onSelect: E ? ie : null }))) : null
    ])
  ]);
}
function Ia({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = j(null), [s, l] = j(!0), [d, c] = j(""), g = ge(0), u = ge(0), f = ge(e), m = Fd();
  f.current = e;
  const [p] = j(() => Ds({
    beginRequest: () => ({ requestId: ++u.current, videoId: f.current }),
    fetchDetail: (F) => te(y(F.videoId)),
    isCurrent: (F) => mr(F.requestId, u.current, F.videoId, f.current),
    isSameVideo: (F) => F.videoId === f.current
  })), y = (F) => `/videos/${F}/editor`;
  async function h(F, T, A) {
    const C = await te(y(T), A ? { signal: A.signal } : void 0);
    return mr(F, A ? g.current : u.current, T, f.current) ? (a(C), !0) : !1;
  }
  pe(() => {
    const F = ++g.current, T = e, A = new AbortController();
    return a(null), l(!0), c(""), h(F, T, A).catch((C) => {
      mr(F, g.current, T, f.current) && C.name !== "AbortError" && c(C.message || "Unable to load the editor.");
    }).finally(() => {
      mr(F, g.current, T, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, A.abort();
    };
  }, [e]);
  function I(F, T) {
    a((A) => (A == null ? void 0 : A.video.id) !== T ? A : typeof F == "function" ? F(A) : F);
  }
  function x() {
    return p({
      onLoaded: (F) => {
        a(F), c("A newer canonical segment was loaded. Your stale change was not applied.");
      },
      onError: (F) => c(F.message || "Unable to reload the latest segment.")
    });
  }
  function K() {
    return p({
      onLoaded: (F) => {
        a(F), c("");
      },
      onError: (F) => c(F.message || "Unable to reload performer slots.")
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
    i ? n($c, {
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
function qc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function _c(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Wc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Vc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = fl(o), l = qc(e, t, window.location.pathname), d = _c(e, t, window.location.pathname), c = Wc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (hl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Uc, {
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
  if (c) return n(Hc, { onNavigate: r, profile: o });
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
function Jc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = j(null), [a, s] = j("");
  return pe(() => {
    const l = new AbortController();
    return te("/preferences", { signal: l.signal }).then((d) => i(Ya(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Vc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Yc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Qc(e, t) {
  const r = Yc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ku = {
  components: { SegmentStudioPage: Jc },
  actionHandlers: { openSegmentStudio: Qc }
};
export {
  wr as CLEARED_SEGMENT_SELECTION_ID,
  ga as DISCOVERY_SORT_OPTIONS,
  Ht as SEGMENT_STUDIO_CAPABILITIES,
  oo as SEGMENT_STUDIO_EXTENSION_ID,
  Qn as SEGMENT_STUDIO_SHORTCUTS,
  Fs as activeEditorFilterCount,
  Td as addPendingChange,
  td as applyDerivationRuleSlotSuggestions,
  vr as applyFeedbackEditorDelta,
  Dd as applyPendingChanges,
  ia as applySegmentMergeDelta,
  Ul as basicSegmentTimelineStyle,
  wl as browseClipEnd,
  Za as browseEditorHref,
  Xo as buildBrowseRequest,
  Dc as buildDerivationRuleGraph,
  Qd as buildDiscoverySearchParams,
  ks as buildMinuteTimelineTicks,
  Mc as buildPerformerSlotOverview,
  Al as buildSegmentQuickSearchEntries,
  id as buildSegmentRailRows,
  sd as buildTimelineRows,
  ru as buildTimelineTicks,
  Cs as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  ws as calculateMinuteLabelStride,
  ou as calculateMinuteTimelineWidth,
  As as calculateSwimlaneTitleMaximum,
  $s as calculateTimelinePlayheadPosition,
  io as calculateTimelineRatioBounds,
  Ms as calculateTimelineRatioFromPointer,
  au as calculateVerticalRevealOffset,
  ln as clampEditorPanelWidth,
  hr as clampSwimlaneTitleWidth,
  Ua as clampTimelineRatio,
  so as clampTimelineRatioForHeight,
  kr as clampTimelineZoom,
  Wd as compactProvenanceSummary,
  Ac as createBulkAnalysisCoordinator,
  Ds as createEditorReloader,
  ol as createQueuedReviewRequest,
  Id as createSaveQueue,
  ha as createSegmentAnalysisRequestScope,
  ku as default,
  Rd as discardPendingChange,
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
  Ec as filterPerformerSlotOverview,
  Tl as filterSegmentQuickSearch,
  cu as filterSegmentStudioShortcuts,
  gd as findAdjacentSegmentGroupKey,
  gl as findAdjacentShot,
  tl as findEditorShortcut,
  Ga as findInitialSegmentSelection,
  Ss as findNearestSegmentInCurrentSwimlane,
  ml as findPublishedSelectionIdentity,
  Qe as findSegmentByStableIdentity,
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
  dc as groupApprovedDraftsForPublishing,
  $l as groupAutoAssignCandidates,
  hd as groupIncorrectExamplesByTag,
  pc as groupMaterializationOutputs,
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
  gu as initialReviewFilter,
  Sd as insertSegmentProjection,
  mr as isCurrentEditorRequest,
  _l as isEditableTarget,
  fu as isEditorShortcutOwner,
  Nd as isKindRunning,
  Su as isSaveQueueBusy,
  Wc as isSegmentStudioBinRoute,
  _c as isSegmentStudioSegmentsRoute,
  qc as isSegmentStudioSettingsRoute,
  Pc as layoutDerivationRuleComponent,
  Oc as layoutDerivationRuleComponents,
  wd as mergeSegmentsProjection,
  Xl as multiSelectionActionHint,
  _s as nextSegmentAfterRemoval,
  Ws as nextUnreviewedAfterRemoval,
  en as normalizeCollapsedSegmentGroups,
  ya as normalizeDiscoveryIds,
  Mt as normalizeEditorSegmentFilters,
  Zt as normalizeGender,
  Yo as normalizeReviewFilter,
  Ya as normalizeSegmentStudioFeatureProfile,
  uu as normalizeSegmentStudioMode,
  Xr as normalizeSegmentStudioPublicMode,
  vn as parseBrowseSlotFilters,
  Rs as parseEditorLayout,
  Ps as parseHideDerivedSegmentsPreference,
  Os as parseMergeConfirmationPreference,
  Va as parsePlaybackShortcutConfig,
  Xs as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  hu as patchSegmentProjection,
  Pd as pendingChangesReducer,
  Ad as pendingInsertedSegments,
  Vs as percentageSeekTime,
  Il as performInitialSegmentSeek,
  lt as performerOptionId,
  Nr as performerSlotHistoryState,
  Ct as performerSlotLabel,
  nd as performerSlotPresentation,
  bu as performerSlotStatus,
  po as performerSlotStatusFromSegmentSlots,
  di as performerSlotsForSegment,
  jt as provenanceSourceLabel,
  xi as prunePendingChanges,
  cl as queueCreatedSegmentTagChoice,
  ei as rankPerformerOptions,
  pd as reconcileSegmentGroupKey,
  Hs as reconcileSelectedSegmentIds,
  tc as recyclingBinActionText,
  Bl as recyclingBinDeletionPrompt,
  oi as recyclingBinDeletionSummary,
  xl as recyclingBinModeSwitchPrompt,
  mu as removeQueuedReviewsForSegments,
  kd as removeSegmentsProjection,
  ta as requestedOwnedItemId,
  Nl as requestedSegmentId,
  Gs as resolveEditorSegmentSelection,
  al as resolveQueuedReviewRequest,
  ll as resolveSegmentCreationAction,
  hl as resolveSegmentStudioRoute,
  el as resolveSegmentStudioShortcuts,
  yi as resolveSegmentTarget,
  Lc as resolveSelectedDerivationRule,
  _o as resolveSelectedSegments,
  hc as restoreDisabledToolbarActionFocus,
  Cc as restorePublishApprovedFocus,
  vu as restoreSegmentFieldsProjection,
  xu as restoreSegmentsProjection,
  Ed as retargetPendingChanges,
  pi as revealCollapsedSegmentGroup,
  Rc as runSelectedDiscoveryAnalysis,
  kn as sameSegmentIdentity,
  bi as savingSegmentIdFrom,
  ii as segmentBadgeStyle,
  Cr as segmentGroupHeaderBackground,
  Lt as segmentGroupKeyForSegment,
  go as segmentHistoryIdentity,
  gr as segmentHistoryState,
  Ot as segmentIdentity,
  si as segmentRailItemStyle,
  pu as segmentStateStyle,
  Yc as segmentStudioActionTarget,
  fl as segmentStudioLegacyMode,
  Gl as segmentTimelineStyle,
  Rt as segmentsHistoryState,
  qs as selectAllVideoSegmentIds,
  Sl as selectedBrowseStates,
  mi as selectedSwimlaneMerge,
  Si as setBackLinkNavigation,
  Md as settlePendingChange,
  Ql as sharedPerformerSlotShape,
  Zl as sharedTagPerformerSlotShape,
  xn as shortcutAvailableInMode,
  nl as shortcutBindingDisplayText,
  iu as shortcutBindingFromEvent,
  lu as shortcutBindingsOverlap,
  du as shortcutModesOverlap,
  Zs as shortcutRequiresSingleSegment,
  qn as shotBoundaryFingerprint,
  Vl as shouldAcceptCurrentTagFromEnter,
  su as shouldExitShortcutCapture,
  yu as shouldHandleEditorShortcut,
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
  Zd as updateDiscoverySelection,
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
