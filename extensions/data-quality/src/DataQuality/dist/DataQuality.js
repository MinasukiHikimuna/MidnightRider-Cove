var Gl = Object.defineProperty;
var Kl = (e, t, n) => t in e ? Gl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Yi = (e, t, n) => Kl(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as ge, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Ct, useMemo as qe, useCallback as Nn, useSyncExternalStore as ii, useId as at, createContext as zl, useContext as Vl, Fragment as si } from "react";
import { useKeySequence as Jl, EntityReferenceMultiSelector as sr, SortableList as zs, TagBadge as Hl, EntityReferenceSelector as Xi, EntityDetailTabs as Ql, FilterDialog as Vs, VIDEO_CRITERIA as oo, DetailListToolbar as va, PERFORMER_CRITERIA as ci, AUDIO_CRITERIA as Js, NarrativeText as Wl, AUDIO_SORT_OPTIONS as Yl, VIDEO_SORT_OPTIONS as Hs, AudioPlayer as Xl, VideoPlayer as Qs, formatDuration as Ws, getResolutionLabel as Zl, ConfirmDialog as ed, TAG_CRITERIA as td, TAG_SORT_OPTIONS as nd, TagTile as rd, VideoCard as ad } from "@cove/runtime/components";
import { Search as Ea, Flag as Gn, Check as Zr, Pencil as Yr, Ban as Qa, ChevronDown as li, Plus as Aa, Pin as Ys, GripVertical as Xs, AlertTriangle as Un, Copy as Zs, Trash2 as io, X as Ca, Mic as od, Users as ec, Tag as tc, Headphones as nc, Film as so, ChevronLeft as Ta, MoreHorizontal as id, RectangleHorizontal as sd, LayoutGrid as di, ChevronRight as rc, Save as cd, RotateCcw as ld, Layers as Zi, Undo2 as dd, RefreshCw as ud, ExternalLink as ac, SkipForward as fd, Upload as pd, Download as oc, ArrowUp as hd, ArrowDown as md, Loader2 as gd, List as bd, Grid3X3 as yd } from "@cove/runtime/lucide-react";
import { extensionFetch as wd } from "@cove/runtime/api";
import { createPortal as vd } from "react-dom";
const ui = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, fi = Object.keys(
  ui
);
function Na(e) {
  return e === "excludes" || e === "excludesAll";
}
function co(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function ic(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Nd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const Wa = { min: 115, max: 625 }, qd = (e) => Math.min(Wa.max, Math.max(Wa.min, e)), sc = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ae(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function pi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return pi(Le(e));
}
function Sd(e) {
  return Le(e) === "video";
}
function Le(e) {
  return e.entityType ?? "video";
}
const ar = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "å",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "ö",
  "ä",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  ",",
  "."
], lo = [
  ar.slice(0, 11),
  ar.slice(11, 22),
  ar.slice(22)
];
function ya(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function qa(e) {
  return ya(e) ?? e.toLocaleUpperCase();
}
const or = "none";
function Rr(e) {
  return typeof e == "string" && ar.includes(e);
}
function hi(e) {
  const t = e.shortcut;
  return Rr(t) || t === or ? t : "auto";
}
function cc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = hi(s);
    if (l !== or) {
      if (l !== "auto") {
        if (!n.has(l)) {
          n.set(l, c), t[c] = l;
          return;
        }
        r.add(c);
      }
      o.push(c);
    }
  });
  const i = ar.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function kd(e, t, n) {
  const { keys: r, actionOn: o } = cc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Rr(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Rr));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Rr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Sa(e) {
  var n;
  return Ae(e) && !dc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Sd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Le(e) !== "tag" && e.actions.some(
    (r) => mi(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => Kn(r, Le(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const Ed = {
  video: 1e3,
  audio: 250
};
function tn(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Ed[t], n(e.perPage, 40))
    )
  };
}
function es(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function rr(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ae(e) ? [e.entityType, ...r, e.occurrence] : Le(e) === "video" ? r : [Le(e), ...r]
  );
}
function Kn(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (r) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(r.mode) && r.tagIds.length > 0 && r.tagIds.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && !mi(e) : !1;
}
function Ad(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Bn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function lr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function lc(e) {
  return "steps" in e && e.steps.length > 0;
}
function ir(e) {
  return "steps" in e ? e.steps.some((t) => Bn(t.mode)) : !1;
}
function mi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Bn(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ia(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || sc.includes(n.entityType)) && (!Ad(n.entityType) || dc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Cd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Kn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Kn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Sa(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Cd(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= Wa.min && n.cardSize <= Wa.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function ts(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function Td(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function ns(e, t, n) {
  return { ...structuredClone(e), id: n, name: Td(e.name, t) };
}
function dc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && fi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Id(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Id(e) {
  if (!Array.isArray(e)) return !1;
  const t = (r) => Number.isSafeInteger(r) && r > 0, n = /* @__PURE__ */ new Set();
  return e.every((r) => {
    if (!r || typeof r != "object" || Array.isArray(r)) return !1;
    const { tagId: o, categoryTagId: i } = r;
    if (!t(o) || i !== void 0 && !t(i))
      return !1;
    const s = `${o}:${i ?? ""}`;
    return n.has(s) ? !1 : (n.add(s), !0);
  });
}
function rs(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function as(e, t, n, r) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!r && t.includes(n)) return n;
  const o = Math.max(0, e.indexOf(n));
  if (r) {
    for (const i of e.slice(o + 1))
      if (t.includes(i)) return i;
    if (t.includes(n)) {
      for (const i of e.slice(0, o).reverse())
        if (t.includes(i)) return i;
      return n;
    }
  }
  return t[Math.min(o, t.length - 1)];
}
function $d(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function Rd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function fn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Od(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Md(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Fd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function xd(e, t) {
  switch (e) {
    case "ArrowLeft":
      return -1;
    case "ArrowRight":
      return 1;
    case "ArrowUp":
      return -t;
    case "ArrowDown":
      return t;
    default:
      return 0;
  }
}
const uc = "ext:com.midnightrider.data-quality:configuration", Pd = "ext:cove-data-quality:video-reviews", jo = "ext:com.midnightrider.data-quality:progress";
class Ya extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    Yi(this, "remote");
    this.remote = r;
  }
}
function fc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof Ya ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const $a = /* @__PURE__ */ new Map(), ja = /* @__PURE__ */ new Map(), Tr = (e, t) => e.includes("*") || e.includes(t), Xa = (e) => ve(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ld = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Uo(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function zr(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 2)
    throw new Error(
      "Unsupported Data Quality configuration version. Existing data has been kept."
    );
  if (typeof t.revision != "string")
    throw new Error(
      "Invalid configuration revision. Existing data has been kept."
    );
  return {
    ...t,
    reviews: Ia(JSON.stringify(t.reviews)),
    deletedIds: Uo(t.deletedIds),
    importedIds: Uo(t.importedIds)
  };
}
function Dd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = Ia(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Uo(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function pc(e) {
  const t = await ve("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function gi(e, t) {
  const n = (ja.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ja.set(e, n), n.finally(() => {
    ja.get(e) === n && ja.delete(e);
  }).catch(() => {
  }), n;
}
let ma = null;
function _d() {
  if (ma) return ma;
  const e = jd();
  return ma = e, e.finally(() => {
    ma === e && (ma = null);
  }).catch(() => {
  }), e;
}
async function jd() {
  const e = await ve("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return gi(t, () => Ud(e, t));
}
async function Ud(e, t) {
  var h;
  const n = String(e.user.id), r = Tr(e.permissions, "savedfilters.read"), o = r && Tr(e.permissions, "savedfilters.write"), i = r ? (await Xa(uc)).filter((g) => g.name === "Data Quality configuration").sort((g, w) => g.id - w.id) : [];
  if (i.length > 1) {
    const g = (w) => {
      const { revision: N, ...v } = zr(w.uiOptions);
      return JSON.stringify(v);
    };
    if (i.some((w) => g(w) !== g(i[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const w of i.slice(1))
        await ve(`/api/savedfilters/${w.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${w.id}` })
        });
    i.splice(1);
  }
  let s = i.length ? zr(i[0].uiOptions) : Ld();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = zr(l));
  let d = !i.length;
  if (i.length && f && l) {
    const g = zr(l);
    if (g.reviews.some((N) => {
      const v = s.reviews.find((y) => y.id === N.id);
      return v && JSON.stringify(v) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const w = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...g.deletedIds])
    ];
    s = {
      ...s,
      reviews: ts(s.reviews, g.reviews).filter(
        (N) => !w.includes(N.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), w = Dd(n);
    if (i.length && w.reviews.some((k) => {
      const O = s.reviews.find((x) => x.id === k.id);
      return O && JSON.stringify(O) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Xa(Pd)).flatMap(
      (k) => Ia(k.uiOptions ?? "[]")
    ) : [], v = w.known.filter(
      (k) => !w.reviews.some((O) => O.id === k)
    ), y = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: ts(
        w.reviews,
        s.reviews,
        N.filter(
          (k) => !w.known.includes(k.id) && !s.importedIds.includes(k.id)
        )
      ).filter((k) => !y.has(k.id)),
      deletedIds: [...y],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...N.map((k) => k.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== g);
  }
  const p = {
    userId: n,
    recordId: (h = i[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: o,
    durable: o
  };
  if ($a.set(t, p), d && o) {
    const g = s;
    i.length && (p.config = zr(i[0].uiOptions)), await hc(t, g), s = p.config;
  } else i.length || (localStorage.setItem(t, JSON.stringify(s)), !r && (!c || f) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!r) localStorage.setItem(`${t}:migrated`, "true");
  else if (o)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: s.reviews,
    storageKey: t,
    canWrite: Tr(e.permissions, "videos.write"),
    canWriteVideos: Tr(e.permissions, "videos.write"),
    canWriteAudios: Tr(e.permissions, "audios.write"),
    canWriteTags: Tr(e.permissions, "tags.write"),
    canReadTagGroups: Tr(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function hc(e, t) {
  const n = $a.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await pc(n), n.recordId != null) {
      const i = await ve(
        `/api/savedfilters/${n.recordId}`
      ), s = zr(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new Ya(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const o = await ve(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: uc,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(r)
        })
      }
    );
    n.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = r, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
const Za = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), Bd = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Za(e, n) !== Za(t, n)
);
function Gd(e, t) {
  return gi(e, async () => {
    var r;
    const n = $a.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    for (let o = 1; ; o++) {
      const i = n.config.reviews, s = t(i);
      if (s === i) return i;
      Ia(JSON.stringify(s));
      const c = i.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
      try {
        return await hc(e, {
          ...n.config,
          reviews: s,
          deletedIds: [
            .../* @__PURE__ */ new Set([...n.config.deletedIds, ...c])
          ].filter((l) => !s.some((f) => f.id === l))
        }), s;
      } catch (l) {
        const f = l instanceof Ya ? l.remote : void 0;
        if (!f || o >= 3) throw l;
        const d = Bd(i, s).find(
          (p) => Za(i, p) !== Za(f.reviews, p)
        );
        if (d !== void 0) {
          const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
          throw new Ya(
            `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.`
          );
        }
        n.config = f;
      }
    }
  });
}
function os(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && !Number.isFinite(t.cardSize) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t.cardSize === null ? t : { ...t, cardSize: qd(t.cardSize) };
}
async function Kd(e, t) {
  const n = $a.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? os(r) : null;
  if (!n.readable) return o;
  const i = (await Xa(jo)).find(
    (c) => c.name === t
  ), s = i ? os(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function zd(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return gi(r, async () => {
    const o = $a.get(e);
    if (!(o != null && o.writable)) return;
    await pc(o);
    const i = (await Xa(jo)).find(
      (s) => s.name === t
    );
    await ve(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: jo,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function dr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Vd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Vn(e) {
  return Vd[e];
}
const eo = "confirmed_absent_tags", bi = "Confirmed absent tags", uo = "confirmed_absent_occurrence_tags", mc = {
  key: eo,
  label: bi,
  type: "tag",
  subject: "tag assessments"
}, yi = {
  key: uo,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Jd = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  INCLUDES: "includes",
  EXCLUDES: "excludes",
  INCLUDES_ALL: "includesAll",
  EXCLUDES_ALL: "excludesAll",
  IS_NULL: "isNull",
  NOT_NULL: "notNull",
  BETWEEN: "between",
  NOT_BETWEEN: "notBetween",
  MATCHES_REGEX: "matchesRegex",
  NOT_MATCHES_REGEX: "notMatchesRegex",
  UNDER_PATH: "underPath",
  NOT_UNDER_PATH: "notUnderPath"
};
function zn(e) {
  return Array.isArray(e) ? e.map(zn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Jd[n] ?? n : t === "key" && typeof n == "string" && [
        eo,
        uo
      ].includes(n.toLowerCase()) ? n.toLowerCase() : zn(n)
    ])
  ) : e;
}
async function gc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await wd(e, { ...t, headers: r });
  if (o.status === 404 && n === "null") return null;
  if (!o.ok) {
    let s = o.statusText || `Request failed (${o.status}).`;
    try {
      const c = await o.json();
      s = c.message || c.detail || c.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (o.status === 204 || o.status === 205) return;
  const i = await o.text();
  return i ? JSON.parse(i) : void 0;
}
async function ve(e, t = {}) {
  return await gc(e, t, "fail");
}
function Hd(e, t = {}) {
  return gc(e, t, "null");
}
const Qd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Wd = 0;
function to(e, t) {
  return ve(
    `/api/${dr(e)}/${t}?dqRead=${Qd}-${++Wd}`,
    { cache: "no-store" }
  );
}
function bc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    zn({
      findFilter: tn(t, _e(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Jr(e, t, n) {
  return ve(
    `/api/${dr(_e(e))}/find`,
    { method: "POST", signal: n, body: bc(e, t) }
  );
}
async function wi(e, t, n) {
  return (await ve(
    `/api/${dr(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: bc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function To(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, ve("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      zn({
        findFilter: tn(t),
        objectFilter: r
      })
    )
  });
}
function Yd(e) {
  return ve("/api/taggroups", { signal: e });
}
function Bo(e, t, n = 1280) {
  return `/api/${dr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Go(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function is(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Xd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Zd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function fo(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ve(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await ve("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          zn({
            findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [r],
                modifier: "INCLUDES",
                depth: -1
              }
            }
          })
        )
      });
      for (const s of i.items) n.add(s.id);
      if (o * 1e3 >= i.totalCount) break;
      if (!i.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function vi(e, t) {
  const n = lr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await fo(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function eu(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ni(e, t) {
  const r = (await ve("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = eu(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Vn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function yc(e, t) {
  const n = await Ni(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ve(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ve("/api/custom-fields", {
      method: "POST",
      body: JSON.stringify({
        key: e.key,
        label: e.label,
        type: e.type,
        entityTypes: [t],
        filterable: !0,
        sortable: !1,
        isMultiValue: !0
      })
    });
  }
}
function wc(e = "video") {
  return Ni(mc, e);
}
function tu(e = "video") {
  return yc(mc, e);
}
function vc(e = "video") {
  return Ni(yi, e);
}
function nu(e = "video") {
  return yc(yi, e);
}
function no(e) {
  return [...new Set(e)];
}
function Nc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === uo
  ), o = r === void 0 ? [] : n[r];
  return no(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function ru(e) {
  let t;
  try {
    t = await vc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${yi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function au(e, t, n, r, o, i) {
  await ve(`/api/${dr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: no(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function ou(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${bi} custom field is not available.`
      );
    return { customFields: { [n]: r }, customFieldMode: i };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: r, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: r, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: r, tagMode: "ADD", ...o("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: r, tagMode: "REMOVE", ...o("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...o("REMOVE") };
  }
}
async function qc(e, t, n) {
  if (!Kn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Vn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (ir(t)) {
    let l;
    try {
      l = await wc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${bi} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const o = no(n), i = (await vi(t)).map((l) => ({
    mode: l.mode,
    tagIds: no(l.tagIds)
  })), c = [
    ...i.filter((l) => !Bn(l.mode)),
    ...i.filter((l) => Bn(l.mode))
  ].map(
    (l) => ou(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await ve(`/api/${dr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[l])
      });
    } catch (f) {
      throw new Error(
        // Cove applies a bulk step whole or not at all, so only earlier steps can have been saved.
        `${l ? `${l} of ${c.length} steps were saved before step ${l + 1} failed.` : "Nothing was saved."} ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function iu(e, t) {
  if (!Kn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ve("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ua = (e) => e >= "0" && e <= "9";
function ss(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function cs(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (Ua(e[n]) && Ua(t[r])) {
      const c = n, l = r;
      for (; n < e.length && Ua(e[n]); ) n++;
      for (; r < t.length && Ua(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(l, r).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const i = ss(e[n]), s = ss(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Sc(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || cs(e.tagGroupName, t.tagGroupName) || cs(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Or(e) {
  return [...e].sort(Sc);
}
const Ko = /* @__PURE__ */ new Map();
function su(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function qi(e, t, n) {
  const r = lr(e), o = [], i = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      i.push(h);
      continue;
    }
    const g = h.tagIds.flatMap((w) => {
      const N = n.get(w);
      return N || o.push(w), N ?? [w];
    });
    i.push({ mode: "REMOVE", tagIds: g.filter((w) => !r.has(w)) });
  }
  const s = [
    ...i.filter((h) => !Bn(h.mode)),
    ...i.filter((h) => Bn(h.mode))
  ], c = new Set(t.ids), l = new Set(t.absent);
  for (const h of s)
    for (const g of h.tagIds)
      switch (h.mode) {
        case "ADD":
          c.add(g);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(g);
          break;
        case "MARK_PRESENT":
          c.add(g), l.delete(g);
          break;
        case "MARK_ABSENT":
          c.delete(g), l.add(g);
          break;
        case "CLEAR_ABSENCE":
          l.delete(g);
          break;
      }
  const f = new Set(t.ids), d = new Set(t.absent), p = [...new Set(e.steps.flatMap((h) => h.tagIds))];
  return {
    added: p.filter((h) => c.has(h) && !f.has(h)),
    removed: [...f].filter((h) => !c.has(h)),
    markedAbsent: p.filter((h) => l.has(h) && !d.has(h)),
    absenceCleared: [...d].filter((h) => !l.has(h)),
    unresolvedTrees: [...new Set(o)]
  };
}
function cu(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Or(t);
}
function kc(e) {
  return Ec(su(e));
}
function Ec(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return ee(() => (i.current = !0, () => {
    i.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), fo([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Et(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Fr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = Et(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function ls(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Et(t.group) !== "");
}
function Ac(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Cc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Tc(e) {
  return lr(e).size > 0 || Cc(e).size > 0;
}
function lu(e) {
  return Fr(e).filter(
    (t) => !t.actions.some((n) => Tc(e[n]))
  );
}
function zo(e, t) {
  const n = Ac(t), r = new Set(t.absent);
  return Fr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...lr(e[c])], f = [...Cc(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function Vo(e) {
  return e.filter((t) => t.answers.length === 0);
}
function du(e, t, n) {
  const r = { ids: [...Ac(t)], absent: t.absent }, o = qi(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const Hr = "review";
function uu(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function fu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Ir(e, t) {
  const n = new Set(uu(e));
  return t.filter((r) => n.has(r.id));
}
function ds(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Ir(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(Hr, () => ({
        key: Hr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : o(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: d, resolved: p } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: d,
          flags: [],
          mixed: [],
          ...p ? {} : { unresolved: !0 }
        };
      });
      l.flags.includes(s.name) || l.flags.push(s.name);
    }
  const i = [...r.values()];
  return [
    ...i.filter((s) => s.key === Hr),
    ...i.filter((s) => s.key !== Hr)
  ];
}
function Jo(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function Si(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => Jo(s.key, s.members, o) && !(c > i && Jo(o.key, o.members, s))
  ), r = /* @__PURE__ */ new Map();
  return t.forEach((o, i) => {
    !r.has(o.key) && !n(o, i) && r.set(o.key, {
      key: o.key,
      name: o.name,
      tagIds: o.members,
      flags: [],
      mixed: o.tags
    });
  }), [...r.values()];
}
function pu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Jo(n.key, n.tagIds ?? [], e)
  );
}
function Ic(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.flat()) {
    const o = t.get(r.key);
    if (!o) {
      t.set(r.key, { ...r, flags: [...r.flags] });
      continue;
    }
    for (const i of r.flags) o.flags.includes(i) || o.flags.push(i);
    o.mixed.length || (o.mixed = r.mixed), o.unresolved && !r.unresolved && delete o.unresolved, o.tagIds !== null && r.tagIds !== null && (o.tagIds = [.../* @__PURE__ */ new Set([...o.tagIds, ...r.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((r) => r.key === Hr),
    ...n.filter((r) => r.key !== Hr)
  ];
}
function hu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function $c(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = hu(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function mu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => $c(o, r, n))
  );
}
function gu(e, t, n) {
  return t.filter((r) => r.tagIds !== null && $c(e, r, n));
}
function bu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function ki(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [bu(e.mixed)] : []
  ];
}
function yu(e) {
  const t = ki(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function wu(e, t, n) {
  const r = Ir(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Ho = "-", us = "Ctrl+a", vu = "Ctrl/⌘A", Nu = ["f", "g", "k", "n", "m", ",", "."], Io = "Shift+", Rc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, qu = new Set(Object.values(Rc).flat()), fs = { Comma: ",", Period: "." };
function Su(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(fs, t.code) ? fs[t.code] : void 0;
}
function ea(e) {
  return qe(() => cc(e), [e]);
}
function Ei({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = ea(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  Ct(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = ar.filter(
    (h) => s.actionOn.has(h) || Nu.includes(h)
  ).join(" "), p = qe(() => {
    const h = (N, v) => {
      var k, O;
      const y = c.current;
      if (N === us) (k = y.onSelectAll) == null || k.call(y);
      else if (N === Ho) (O = y.onFind) == null || O.call(y);
      else {
        const x = qu.has(N), B = x || N.startsWith(Io), C = x ? Su(v) : B ? N.slice(Io.length) : N, D = C === void 0 ? void 0 : y.keyMap.actionOn.get(C);
        D !== void 0 && y.onAction(D, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (y) => {
        y != null && y.repeat || h((y == null ? void 0 : y.sequence) ?? N, y);
      }
    }), w = [];
    f && w.push(g(us, "local")), l && w.push(g(Ho));
    for (const N of d ? d.split(" ") : []) {
      const v = Rc[N];
      w.push(g(N), ...(v ?? [`${Io}${N}`]).map((y) => g(y)));
    }
    return w;
  }, [e, d, l, f]);
  Jl(p, t);
}
const ku = {
  find: Ho,
  selectAll: vu
};
function Ai() {
  return ku;
}
const Eu = 600 * 1e3, Ci = /* @__PURE__ */ new Map(), Oc = /* @__PURE__ */ new Map(), nr = /* @__PURE__ */ new Map();
function Mc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Oc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Fc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Oc.set(e.tagGroupId, e.tagGroupSortOrder), Ci.set(e.id, { tag: e, at: Date.now() });
}
function xc(e) {
  const t = Ci.get(e);
  if (!(!t || Date.now() - t.at > Eu))
    return Mc(t.tag);
}
function Pc(e) {
  return {
    id: e.id,
    name: e.name,
    sortName: e.sortName,
    color: e.color,
    tagGroupId: e.tagGroupId,
    tagGroupName: e.tagGroupName,
    tagGroupColor: e.tagGroupColor,
    tagGroupSortOrder: e.tagGroupSortOrder,
    imagePath: e.imagePath,
    hasImage: e.hasImage
  };
}
function Qo(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Fc(Pc({ ...n, name: r }));
  }
}
function Au(e) {
  const t = nr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ve(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var d, p;
        const i = ((d = o == null ? void 0 : o.name) == null ? void 0 : d.trim()) || null;
        if (nr.get(e) === r && nr.delete(e), !i) return null;
        const s = Pc({ ...o, id: e, name: i }), c = (p = Ci.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Fc(f), Mc(f);
      },
      () => (nr.get(e) === r && nr.delete(e), null)
    )
  };
  return nr.set(e, r), r;
}
function ps() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function $o(e) {
  const t = {};
  for (const n of e) {
    const r = xc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Cu(e, t) {
  if (t != null && t.aborted) return Promise.reject(ps());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = xc(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = Au(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && nr.get(f) === d && (nr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), i(ps()));
    };
    t == null || t.addEventListener("abort", l, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: d }) => d.promise.then((p) => [f, p])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", l), c();
        for (const [d, p] of f) n[d] = p;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function Lc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ra(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = T(() => ({
    key: t,
    tags: $o(Ro(t))
  }));
  return ee(() => {
    const o = Ro(t), i = $o(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return Cu(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : $o(Ro(t));
}
function ta(e) {
  const t = Ra(e);
  return qe(() => Lc(t), [t]);
}
function Ro(e) {
  return e ? e.split(",").map(Number) : [];
}
const Tu = "(max-width: 760px)";
function Dc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Nn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return ii(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Oa() {
  return Dc(Tu);
}
function Iu(e, t, n = !1) {
  switch (e) {
    case "ADD":
      return { text: `+ ${t}`, tone: "add" };
    case "REMOVE":
      return { text: `− ${t}`, tone: "remove" };
    case "REMOVE_TREE":
      return { text: n ? `− rest of ${t}` : `− ${t} tree`, tone: "remove" };
    case "MARK_PRESENT":
      return { text: `Mark ${t} present`, tone: "assess" };
    case "MARK_ABSENT":
      return { text: `Mark ${t} absent`, tone: "assess" };
    case "CLEAR_ABSENCE":
      return { text: `Clear ${t} absence`, tone: "neutral" };
  }
}
function Pr(e, t, n = [], r) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const c = n.find((l) => l.id === s.tagGroupId);
    return [
      {
        text: c ? `Assign ${c.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const o = lr(e), i = (s) => o.has(s) || [...o].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => Iu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function po(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ti({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = Oa(), [f, d] = T(""), [p, h] = T(0), g = $(null), w = $(null), N = $(null), v = $(null), y = $(null), k = $(/* @__PURE__ */ new Set()), O = at(), x = ta(qe(() => po(e), [e])), B = ea(e), C = qe(() => {
    const j = f.trim().toLocaleLowerCase(), z = (F) => F ? ar.indexOf(F) : ar.length;
    return e.map((F, _) => ({ action: F, index: _, key: B.keys[_] })).sort((F, _) => z(F.key) - z(_.key)).filter((F) => !j || F.action.label.toLocaleLowerCase().includes(j));
  }, [e, B, f]), D = C.length ? Math.min(p, C.length - 1) : -1, P = (j) => `${O}-option-${j}`;
  Ct(() => {
    var j, z, F;
    return v.current = document.activeElement, y.current = ((z = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : z.closest('[role="dialog"]')) ?? null, (F = g.current) == null || F.focus({ preventScroll: !0 }), () => {
      var L;
      const _ = v.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((L = y.current) != null && L.isConnected) && y.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var j, z, F;
    D < 0 || (F = (z = (j = w.current) == null ? void 0 : j.querySelector(`[id="${P(C[D].index)}"]`)) == null ? void 0 : z.scrollIntoView) == null || F.call(z, { block: "nearest" });
  }, [D, C]);
  function ne(j, z) {
    !j || r != null && r(j.action) || s(j.action, o && z);
  }
  function J(j) {
    var F;
    j.stopPropagation();
    const z = j.code || j.key;
    if (j.repeat || k.current.add(z), !fn(j)) {
      if (j.repeat && !k.current.has(z)) {
        j.preventDefault();
        return;
      }
      if (j.key === "Escape")
        j.preventDefault(), j.repeat || c();
      else if (j.key === "Enter")
        j.preventDefault(), j.repeat || ne(C[D], j.shiftKey);
      else if (j.key === "ArrowDown" || j.key === "ArrowUp") {
        if (j.preventDefault(), !C.length) return;
        const _ = j.key === "ArrowDown" ? 1 : -1;
        h((D + _ + C.length) % C.length);
      } else j.key === "Tab" && (j.preventDefault(), (F = g.current) == null || F.focus());
    }
  }
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${l ? " dq-find-mobile" : ""}`,
        onKeyDown: J,
        onMouseDown: (j) => {
          j.target !== g.current && j.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(Ea, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: g,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${O}-list`,
                "aria-activedescendant": D >= 0 ? P(C[D].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (j) => {
                  d(j.target.value), h(0);
                }
              }
            ),
            !l && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          C.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: w,
              id: `${O}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: C.map((j, z) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: P(j.index),
                  tabIndex: -1,
                  "aria-selected": z === D,
                  disabled: (r == null ? void 0 : r(j.action)) ?? !1,
                  onClick: (F) => ne(j, F.shiftKey || i && lc(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(ge, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ya(j.key) ? !0 : void 0, children: j.key }),
                      ya(j.key) && /* @__PURE__ */ u(ge, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ya(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Pr(j.action, x, t, n).map(
                      (F, _) => /* @__PURE__ */ a("span", { "data-effect-tone": F.tone, children: F.text }, _)
                    ) })
                  ]
                }
              ) }, j.action.id))
            }
          ) : /* @__PURE__ */ u("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            f.trim(),
            "”."
          ] }),
          !l && /* @__PURE__ */ u("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies"
            ] }),
            o && /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Shift" }),
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ u("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "↑" }),
              /* @__PURE__ */ a("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function _c() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (r) => {
    r !== e && (e = r, t.forEach((o) => o()));
  };
  return {
    get: () => e,
    set: n,
    clear: (r) => {
      e === r && n(null);
    },
    subscribe: (r) => (t.add(r), () => t.delete(r))
  };
}
function Ii(e) {
  return ii(e.subscribe, e.get, e.get);
}
function jc(e, t) {
  const n = $(t);
  Ct(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Uc(e, t) {
  return {
    onPointerEnter: (n) => {
      n.pointerType === "mouse" && e.set(t);
    },
    onPointerLeave: (n) => {
      n.pointerType === "mouse" && e.clear(t);
    },
    onFocus: () => e.set(t),
    onBlur: () => e.clear(t)
  };
}
const $u = [], Wo = lo.map(
  (e, t) => ({ indent: t, keys: e })
), hs = Wo.length - 1;
function At({ binding: e, hidden: t }) {
  const n = t ? void 0 : ya(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(ge, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function Ba(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Bc(e) {
  return lo.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Gc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(ge, { children: r.map((o, i) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === r.length - 1 && n
  ] }, i)) });
}
function Kc({
  extra: e,
  findKey: t,
  disabled: n,
  onFind: r
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: r,
      children: [
        /* @__PURE__ */ u("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ a(Ea, { "aria-hidden": "true" }),
          "Find"
        ] }),
        e > 0 && /* @__PURE__ */ u("span", { className: "dq-mobile-more", children: [
          e,
          " more"
        ] })
      ]
    }
  );
}
function Ru({
  groups: e,
  statuses: t,
  actions: n,
  attentionOf: r
}) {
  return /* @__PURE__ */ a(
    "ul",
    {
      className: "dq-group-checklist",
      "aria-label": "Answer groups",
      title: "A plain action moves on once every group has an answer",
      children: (t ?? e).map((o) => {
        const i = t ? o.answers : null, s = i ? i.length ? "answered" : "open" : "unknown", c = i == null ? void 0 : i.map((d) => n[d].label).join(", "), l = r(o), f = s === "answered" ? `${o.name}: ${c}` : s === "open" ? `${o.name}: not answered yet` : o.name;
        return /* @__PURE__ */ u(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": l ? !0 : void 0,
            title: l ? `${f}. Needs attention: ${l}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: o.name }),
              l && /* @__PURE__ */ u("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a(Zr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a("span", { className: "dq-group-ring", "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", not answered yet" })
              ] })
            ]
          },
          o.key
        );
      })
    }
  );
}
function Ou({ checked: e, onChange: t }) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": e,
      className: "dq-stay-switch",
      onClick: () => t(!e),
      children: [
        /* @__PURE__ */ a("span", { className: "dq-stay-track", "aria-hidden": "true" }),
        "Stay on this item"
      ]
    }
  );
}
function Mu({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: o,
  preview: i,
  onApply: s,
  onFind: c,
  findDisabled: l,
  paused: f = !1,
  waitForGroups: d = !1,
  attention: p = $u,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const w = Ai(), N = ea(e), v = Oa();
  jc(i, v);
  const y = at(), k = ta(
    qe(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), O = Wo.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), x = O.includes(Wo[hs]), B = e.length - N.actionOn.size, C = qe(
    () => d && !f ? Fr(e) : [],
    [d, f, e]
  ), D = qe(
    () => C.length && r ? zo(e, r) : null,
    [C, e, r]
  ), P = new Map(
    Vo(D ?? []).flatMap(
      (S) => S.actions.filter((ce) => Tc(e[ce])).map((ce) => [ce, S.name])
    )
  ), ne = qe(
    () => e.map((S) => f ? [] : gu(S, p, o)),
    [e, p, o, f]
  ), J = (S) => S.map(yu).join("; "), j = ne.map(J), z = C.length > 0 && /* @__PURE__ */ a(
    Ru,
    {
      groups: C,
      statuses: D,
      actions: e,
      attentionOf: (S) => J([
        ...new Map(
          S.actions.flatMap((ce) => ne[ce]).map((ce) => [ce.key, ce])
        ).values()
      ])
    }
  ), F = (S) => {
    const ce = Pr(e[S], k, [], o).map((ue) => ue.text).join(", "), A = P.get(S), Z = j[S];
    return [
      ce,
      A === void 0 ? "" : `${A}: not answered yet`,
      Z ? `Needs attention: ${Z}` : ""
    ].filter(Boolean).join(". ");
  }, _ = (S) => j[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${j[S]}`,
        children: /* @__PURE__ */ a(Gn, {})
      }
    )
  ) : null, L = (S) => ({
    onMouseEnter: () => i.set(S),
    onMouseLeave: () => i.clear(S),
    onFocus: () => i.set(S),
    onBlur: () => i.clear(S)
  }), X = (S) => {
    const ce = N.actionOn.get(S), A = ce === void 0 ? void 0 : e[ce];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(At, { binding: S, hidden: !0 })
        },
        S
      );
    const Z = t(A), ue = `${y}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : L(A), children: [
      /* @__PURE__ */ a("span", { id: ue, className: "dq-sr-only", children: F(ce) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": S,
          "aria-describedby": ue,
          "data-group-open": P.has(ce) || void 0,
          "data-attention": j[ce] ? !0 : void 0,
          disabled: Z,
          onClick: (me) => s(A, me.shiftKey),
          children: [
            /* @__PURE__ */ a(At, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            Ba(A) && " ",
            Ba(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", title: "Marks absent", children: [
              /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-pad-marker-text", children: "absent" })
            ] }),
            _(ce)
          ]
        }
      )
    ] }, S);
  }, Q = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Bc(N), ce = (A) => {
      const Z = e[A], ue = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Z.label,
          "aria-keyshortcuts": ue,
          "aria-describedby": `${y}-effect-${ue}`,
          "data-group-open": P.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(Z),
          onClick: (me) => {
            i.clear(Z), s(Z, me.shiftKey || h && lc(Z));
          },
          ...f ? {} : Uc(i, Z),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Z.label }),
            Ba(Z) && " ",
            Ba(Z) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(A)
          ]
        },
        ue
      );
    };
    return /* @__PURE__ */ u(
      "section",
      {
        className: `dq-pad dq-pad-mobile${f ? " dq-pad-paused" : ""}`,
        "aria-label": f ? "Actions, paused while editing" : "Actions",
        "aria-busy": n || void 0,
        children: [
          /* @__PURE__ */ u("div", { className: "dq-pad-header", children: [
            f ? Q : /* @__PURE__ */ a(
              ms,
              {
                actions: e,
                keyMap: N,
                names: k,
                tags: r,
                trees: o,
                preview: i,
                findKey: w.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(Ou, { checked: h, onChange: g })
          ] }),
          z,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Gc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Kc,
                {
                  extra: B,
                  findKey: w.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((A) => /* @__PURE__ */ a("span", { id: `${y}-effect-${N.keys[A]}`, children: F(A) }, A)) })
        ]
      }
    );
  }
  const ae = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), H = !x && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": B ? `Find action, ${B} more` : "Find action",
      "aria-keyshortcuts": w.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(At, { binding: w.find }),
        /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-pad${f ? " dq-pad-paused" : ""}`,
      "aria-label": f ? "Actions, paused while editing" : "Actions",
      "aria-busy": n || void 0,
      children: [
        /* @__PURE__ */ u("div", { className: `dq-pad-header${z ? " dq-pad-header-groups" : ""}`, children: [
          f ? Q : /* @__PURE__ */ a(
            ms,
            {
              actions: e,
              keyMap: N,
              names: k,
              tags: r,
              trees: o,
              preview: i,
              findKey: w.find
            }
          ),
          z ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              z,
              ae,
              H
            ] })
          ) : /* @__PURE__ */ u(ge, { children: [
            !f && ae,
            H
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(X),
          S.indent === hs && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": w.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(At, { binding: w.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(Ea, { "aria-hidden": "true" }),
                  B ? `${B} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, S.indent))
      ]
    }
  );
}
function ms({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const l = Ii(i), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(ge, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(At, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? qi(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(At, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Pr(l, n, [], o).map((g, w) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, w)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function zc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: o,
  onApply: i,
  onFind: s,
  summary: c,
  hints: l,
  keyHints: f,
  notices: d,
  status: p,
  className: h = "",
  paused: g = !1
}) {
  const w = Ai(), N = ea(e), v = Oa(), y = at(), k = ta(qe(() => po(e), [e])), [O] = T(() => _c());
  jc(O, v);
  const x = $(null), B = Fu(x, e, !v), C = Bc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), P = e.length - D.length, ne = (F) => Pr(F, k, t, n).map((_) => _.text).join(", "), J = (F) => ({
    onMouseEnter: () => O.set(F),
    onMouseLeave: () => O.clear(F),
    onFocus: () => O.set(F),
    onBlur: (_) => {
      _.currentTarget.contains(_.relatedTarget) || O.clear(F);
    }
  }), j = l ?? (v ? void 0 : f), z = (F) => {
    const _ = e[F];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: _.label,
        "aria-keyshortcuts": N.keys[F] || void 0,
        "aria-describedby": `${y}-effect-${F}`,
        disabled: g || r(_),
        onClick: () => {
          O.clear(_), i(_);
        },
        ...g ? {} : Uc(O, _),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: _.label })
      },
      _.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: x,
      className: `dq-action-bar${v ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ a("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ a("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: `dq-bar-tiles${v ? " dq-mobile-actions" : ""}`,
            "aria-busy": o || void 0,
            children: [
              v && e.length > 0 && /* @__PURE__ */ a(
                Gc,
                {
                  groups: C,
                  renderAction: z,
                  find: /* @__PURE__ */ a(
                    Kc,
                    {
                      extra: P,
                      findKey: w.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((F, _) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                F.map((L) => {
                  const X = e[L], Q = N.keys[L];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: X.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${y}-effect-${L}`,
                      disabled: g || r(X),
                      onClick: () => i(X),
                      ...g ? {} : J(X),
                      children: [
                        Q && /* @__PURE__ */ a(At, { binding: Q }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: X.label })
                      ]
                    },
                    X.id
                  );
                }),
                _ === C.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": P > 0 ? `Find action, ${P} more` : "Find action",
                    "aria-keyshortcuts": w.find,
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(At, { binding: w.find, hidden: !0 }),
                      /* @__PURE__ */ a(Ea, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: P > 0 ? `${P} more` : "Find action" })
                    ]
                  }
                )
              ] }, _)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        j && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: j }),
        g ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          xu,
          {
            actions: e,
            keyMap: N,
            preview: O,
            names: k,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((F) => /* @__PURE__ */ a("span", { id: `${y}-effect-${F}`, children: ne(e[F]) }, e[F].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Fu(e, t, n) {
  const [r, o] = T(!1);
  return Ct(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, g = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), w = [...i.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((P) => P.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, y = i.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (y ? y.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (D) => w.map((P) => {
        let ne = 1, J = 0;
        for (const j of P)
          J > 0 && J + v + j > D ? (ne += 1, J = j) : J += (J > 0 ? v : 0) + j;
        return ne;
      }), x = (D) => Math.max(1, D.reduce((P, ne) => P + ne, 0)), B = O(g), C = x(O(g - k));
      o(
        1 + x(B) < C || 1 + x(B) === C && B.every((D) => D === 1)
      );
    }, l = new ResizeObserver(c);
    l.observe(i);
    for (const p of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      l.observe(p);
    c();
    let f = !0;
    return (d = document.fonts) == null || d.ready.then(() => {
      f && c();
    }), () => {
      f = !1, l.disconnect();
    };
  }, [e, t, n]), r;
}
function xu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = Ii(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(At, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Pr(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const gs = 1e3;
async function Pu(e, t, n) {
  const r = await ve(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await ve(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          zn({
            findFilter: {
              page: l,
              perPage: gs,
              sort: "name",
              direction: "asc"
            },
            objectFilter: {
              parentsCriterion: { value: [t], modifier: "INCLUDES" }
            }
          })
        )
      }
    );
    for (const d of f.items) o.set(d.id, d);
    if (l * gs >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = _e(e), c = Ae(e) ? await Du(
    s,
    i.map((l) => l.id),
    n
  ) : i.map((l) => (s === "audio" ? l.audioCount : l.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: i.map((l, f) => ({ id: l.id, name: l.name, uses: c[f] })).sort(
      (l, f) => f.uses - l.uses || l.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Lu(e) {
  return JSON.stringify(
    zn({
      findFilter: { page: 1, perPage: 1 },
      objectFilter: {
        performerFilterCriterion: {
          mode: "atLeastOne",
          conditionOperator: "and",
          performerOccurrenceTagsCriterion: {
            modifier: "includes",
            value: [e],
            depth: 0
          }
        }
      }
    })
  );
}
async function Du(e, t, n) {
  const r = new Array(t.length).fill(0), o = new AbortController(), i = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && i(), n == null || n.addEventListener("abort", i, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !o.signal.aborted; ) {
            const c = s++;
            r[c] = (await ve(
              `/api/${dr(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Lu(t[c])
              }
            )).count;
          }
        } catch (c) {
          throw o.abort(), c;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", i);
  }
  return o.signal.throwIfAborted(), r;
}
function _u(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function ju(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Uu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of lr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Bu(e, t, n) {
  return {
    id: crypto.randomUUID(),
    label: e.name,
    steps: [
      { mode: "ADD", tagIds: [e.id] },
      ...t.length ? [{ mode: "REMOVE_TREE", tagIds: t }] : []
    ],
    ...n != null && n.trim() ? { group: n.trim() } : {}
  };
}
function Gu(e, t) {
  var r;
  const n = Et(e);
  return ((r = Fr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Ku = (e) => e instanceof Error ? e.message : "Request failed.";
function zu({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), g = $(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const F of g.current.values()) F.abort();
    },
    []
  );
  const w = Vn(_e(t)), N = Ae(t), v = N ? "performer" : w.one;
  function y(F) {
    var L;
    (L = g.current.get(F)) == null || L.abort();
    const _ = new AbortController();
    g.current.set(F, _), l((X) => ({ ...X, [F]: { status: "loading" } })), Pu(t, F, _.signal).then(
      (X) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [F]: { status: "ready", group: X }
        }));
      },
      (X) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [F]: { status: "failed", message: Ku(X) }
        }));
      }
    );
  }
  function k(F) {
    var ae;
    const _ = i.filter((H) => !F.includes(H));
    for (const H of _)
      (ae = g.current.get(H)) == null || ae.abort(), g.current.delete(H);
    const L = (H) => {
      const S = c[H];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, X = new Set(F.flatMap(L)), Q = _.flatMap(L).filter((H) => !X.has(H));
    d(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => !Q.includes(Number(S)))
      )
    ), h(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => F.includes(Number(S)))
      )
    ), l(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => F.includes(Number(S)))
      )
    ), s(F);
    for (const H of F) i.includes(H) || y(H);
  }
  const O = i.flatMap((F) => {
    const _ = c[F];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), x = O.length === i.length, B = i.some(
    (F) => {
      var _;
      return (((_ = c[F]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    _u(O).map((F) => [F.parent.id, F])
  ), D = ju(O), P = new Map(O.map((F) => [F.parent.id, F.parent.name])), ne = Uu(t.actions), J = (F) => f[F] ?? !ne.has(F), j = x ? [...C.values()].flatMap((F) => {
    const _ = Gu(F.parent.name, t.actions);
    return F.children.filter((L) => J(L.id)).map((L) => ({ child: L, answerGroup: _ }));
  }) : [], z = (F, _) => d((L) => ({
    ...L,
    ...Object.fromEntries(F.children.map((X) => [X.id, _]))
  }));
  return /* @__PURE__ */ u("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ a("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ u("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ a(
      sr,
      {
        entityType: "tag",
        values: i,
        onChange: k,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((F) => {
      const _ = c[F];
      if (!_ || _.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, F);
      if (_.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            _.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => y(F),
              children: "Retry"
            }
          )
        ] }, F);
      const L = C.get(F);
      if (!L) return null;
      const X = L.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: X }),
        _.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(ge, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[F] ?? !1,
                disabled: n,
                onChange: (Q) => h((ae) => ({
                  ...ae,
                  [F]: Q.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          L.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(ge, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => z(L, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => z(L, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: L.children.map((Q) => {
              const ae = ne.get(Q.id) ?? [], H = (D.get(Q.id) ?? []).filter((S) => S !== F).map((S) => `“${P.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: J(Q.id),
                    disabled: n,
                    onChange: (S) => d((ce) => ({
                      ...ce,
                      [Q.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  Q.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    Q.uses.toLocaleString(),
                    " ",
                    Q.uses === 1 ? w.one : w.many
                  ] }),
                  H.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    H.join(", ")
                  ] }),
                  ae.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    ae[0].label || "New action",
                    "”",
                    ae.length > 1 ? ` and ${ae.length - 1} more` : ""
                  ] })
                ] })
              ] }, Q.id);
            }) })
          ] })
        ] })
      ] }, F);
    }),
    /* @__PURE__ */ u("div", { className: "dq-row", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !j.length,
          onClick: () => r(
            j.map(
              ({ child: F, answerGroup: _ }) => Bu(
                F,
                (D.get(F.id) ?? []).filter(
                  (L) => p[L]
                ),
                _
              )
            )
          ),
          children: j.length ? `Add ${j.length} action${j.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Vu(e, t, n, r) {
  const o = Et(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: Et(c) === o });
    return i;
  }
  const s = Et(r);
  for (const c of t)
    Et(c).includes(s) && i.push({ kind: "group", name: c, selected: Et(c) === o });
  return s && !t.some((c) => Et(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Ju(e) {
  return e.kind === "group" ? `group:${Et(e.name)}` : e.kind;
}
function Hu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Qu = /* @__PURE__ */ new Set([
  "Shift",
  "Control",
  "Alt",
  "AltGraph",
  "Meta",
  "OS",
  "Super",
  "Hyper",
  "Fn",
  "FnLock",
  "Symbol",
  "SymbolLock",
  "CapsLock",
  "NumLock",
  "ScrollLock"
]), Wu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ga = 4, bs = 240;
function Yu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Xu(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Zu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), w = $(!1), N = $(!1), [v, y] = T(!1), [k, O] = T(null), [x, B] = T(null), [C, D] = T(!1), P = e.group ?? "", ne = qe(
    () => Vu(t, n, P, k),
    [t, n, P, k]
  ), J = ne.map(Ju), j = x === null ? -1 : J.indexOf(x), z = (A) => `${s}-option-${A}`, F = (A) => o(A ? { ...e, group: A } : Hu(e)), _ = () => {
    var Z;
    const A = ((Z = d.current) == null ? void 0 : Z.value) ?? P;
    A.trim() !== A && F(A.trim());
  };
  function L(A) {
    O(null), B(A), y(!0);
  }
  const X = (A) => {
    var Z, ue;
    return A instanceof Node && (((Z = l.current) == null ? void 0 : Z.contains(A)) || ((ue = p.current) == null ? void 0 : ue.contains(A))) === !0;
  };
  function Q() {
    var A, Z;
    (A = p.current) != null && A.contains(document.activeElement) && ((Z = h.current) == null || Z.focus({ preventScroll: !0 })), y(!1), O(null), B(null), D(!1);
  }
  function ae(A) {
    A.kind === "group" && A.selected && k === null || F(A.kind === "none" ? "" : A.name), Q();
  }
  function H() {
    const A = f.current, Z = p.current;
    if (!A || !Z) return;
    const ue = A.getBoundingClientRect(), me = window.visualViewport, K = (me == null ? void 0 : me.offsetTop) ?? 0, Ee = (me ? me.offsetTop + me.height : window.innerHeight) - ue.bottom - Ga, ke = ue.top - K - Ga, Ne = Math.min(Z.scrollHeight, bs), Je = Ee < Ne && ke > Ee;
    Z.style.left = `${ue.left}px`, Z.style.width = `${ue.width}px`, Z.style.top = `${Je ? ue.top - Ga : ue.bottom + Ga}px`, Z.style.transform = Je ? "translateY(-100%)" : "", Z.style.maxHeight = `${Math.max(0, Math.min(bs, Je ? ke : Ee))}px`, Xu(A, Z, ue, g.current) || Q();
  }
  Ct(() => {
    var A;
    v && (f.current && (g.current = Yu(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
  }, [v]), Ct(() => {
    v && H();
  }), ee(() => {
    if (!v) return;
    const A = () => H(), Z = (K) => {
      X(K.target) || Q();
    }, ue = [...g.current, window], me = window.visualViewport;
    for (const K of ue) K.addEventListener("scroll", A);
    return window.addEventListener("resize", A), me == null || me.addEventListener("resize", A), me == null || me.addEventListener("scroll", A), document.addEventListener("pointerdown", Z), () => {
      for (const K of ue) K.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), me == null || me.removeEventListener("resize", A), me == null || me.removeEventListener("scroll", A), document.removeEventListener("pointerdown", Z);
    };
  }, [v]), ee(() => {
    var A, Z, ue;
    j >= 0 && ((ue = (Z = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : Z.scrollIntoView) == null || ue.call(Z, { block: "nearest" }));
  }, [j]);
  function S(A) {
    if (fn(A)) return;
    const Z = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (Z && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), L(A.altKey ? null : Et(P) ? `group:${Et(P)}` : "none");
      return;
    }
    if (v)
      if (Z) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && Q();
          return;
        }
        const ue = A.key === "ArrowDown" ? 1 : -1, me = k !== null && Et(k) && J.length > 1 ? 1 : 0, K = j < 0 ? ue > 0 ? me : J.length - 1 : (j + ue + J.length) % J.length;
        B(J[K]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? ae(ne[j]) : (_(), Q()));
  }
  function ce(A) {
    var ue;
    if (A.key === "Tab") {
      Q(), A.shiftKey && ((ue = d.current) == null || ue.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || fn(A) && !Wu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const me = d.current;
      me && (me.focus(), me.setSelectionRange(me.value.length, me.value.length));
      return;
    }
    !Qu.has(A.key) && !fn(A) && D(!1), S(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || fn(A) || (A.preventDefault(), A.stopPropagation(), Q());
      },
      children: [
        /* @__PURE__ */ u("div", { ref: l, className: "dq-action-field", children: [
          /* @__PURE__ */ a(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: i,
              onMouseDown: (A) => {
                v && A.preventDefault();
              },
              children: "Group"
            }
          ),
          /* @__PURE__ */ u("div", { ref: f, className: "dq-combobox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                ref: d,
                id: i,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && j >= 0 ? z(j) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: P,
                onChange: (A) => {
                  F(A.target.value), O(A.target.value), B(null), y(!0);
                },
                onClick: () => {
                  v || L(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  Q(), _();
                }
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: h,
                type: "button",
                className: "dq-combobox-toggle",
                tabIndex: -1,
                "aria-label": "Show groups",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                onPointerDown: (A) => {
                  w.current = A.pointerType === "touch";
                },
                onMouseDown: (A) => A.preventDefault(),
                onClick: () => {
                  var ue;
                  const A = w.current;
                  w.current = !1;
                  const Z = document.activeElement === d.current;
                  v ? Q() : (N.current = A && !Z, L(null)), (!A || Z) && ((ue = d.current) == null || ue.focus());
                },
                children: /* @__PURE__ */ a(li, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item. When a chosen performer's items answer a group in two different ways, their Existing answers mark the group Mixed." : "A group is one question with one answer per item." }),
        v && vd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: p,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": j >= 0 ? z(j) : void 0,
              "data-tap-focus": C || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: ce,
              onBlur: (A) => {
                X(A.relatedTarget) || Q();
              },
              children: ne.map((A, Z) => /* @__PURE__ */ u(
                "li",
                {
                  id: z(Z),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": Z === j || void 0,
                  onMouseMove: () => {
                    Z !== j && B(J[Z]);
                  },
                  onClick: () => ae(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Zr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                J[Z]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const tr = [
  ...lo,
  ["auto", or]
];
function Vc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : hi(e[n]);
}
function ef({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = T(!1), c = $(null), l = n.keys[t], f = Vc(e, n, t), d = Rr(f), p = n.duplicatePins.has(t) ? ` (${qa(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${qa(l)}, ${d ? "pinned" : "Auto"}${p}` : f === or ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
    var w;
    s(!1), (w = c.current) == null || w.focus();
  };
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${h}`,
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        title: "Choose the key",
        onClick: () => s(!i),
        children: [
          l ? /* @__PURE__ */ a(At, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Ys, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      tf,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (w) => {
          o(w), g();
        },
        onClose: g
      }
    )
  ] });
}
function tf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], l = Vc(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Ct(() => {
    var N, v, y;
    (N = p(c || l)) == null || N.focus(), (y = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || y.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Rr(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function g(N) {
    var C, D, P;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), i();
      return;
    }
    if (N.key === "Tab") {
      const ne = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], J = ne.indexOf(document.activeElement);
      N.preventDefault(), (D = ne[(J + (N.shiftKey ? -1 : 1) + ne.length) % ne.length]) == null || D.focus();
      return;
    }
    const v = (P = N.target.dataset) == null ? void 0 : P.choice, y = v ? tr.findIndex((ne) => ne.includes(v)) : -1;
    if (!v || y < 0) return;
    const k = tr[y].indexOf(v), O = (ne) => ne == null ? void 0 : ne[Math.min(k, ne.length - 1)], x = {
      ArrowLeft: tr[y][k - 1],
      ArrowRight: tr[y][k + 1],
      ArrowUp: O(tr[y - 1]),
      ArrowDown: O(tr[y + 1]),
      Home: tr[y][0],
      End: tr[y].at(-1)
    };
    if (!Object.hasOwn(x, N.key)) return;
    N.preventDefault();
    const B = x[N.key];
    B && h(B);
  }
  const w = (N) => {
    const v = Rr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: hi(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (N) => {
          N.preventDefault(), i();
        }
      }
    ),
    /* @__PURE__ */ u(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${r}`,
        className: "dq-key-picker",
        onKeyDown: g,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ u("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: lo.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((y) => {
            const k = w(y), O = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": y,
                tabIndex: y === f ? 0 : -1,
                "aria-label": `${qa(y)}: ${O}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(y),
                onClick: () => o(y),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(At, { binding: y }),
                    (k == null ? void 0 : k.pinned) && /* @__PURE__ */ a(Ys, { "aria-hidden": "true" })
                  ] }),
                  k && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: k.label })
                ]
              },
              y
            );
          }) }, v)) }),
          /* @__PURE__ */ u("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": "auto",
                tabIndex: 0,
                "aria-pressed": l === "auto",
                onClick: () => o("auto"),
                children: [
                  /* @__PURE__ */ a("strong", { children: "Auto" }),
                  /* @__PURE__ */ a("span", { children: "the next free key" })
                ]
              }
            ),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": or,
                tabIndex: 0,
                "aria-pressed": l === or,
                onClick: () => o(or),
                children: [
                  /* @__PURE__ */ a("strong", { children: "No key" }),
                  /* @__PURE__ */ a("span", { children: "Find action only" })
                ]
              }
            ),
            /* @__PURE__ */ a("p", { className: "dq-key-picker-hint", children: "The action on the key you choose takes this one's pinned key, or Auto." })
          ] })
        ]
      }
    )
  ] });
}
const nf = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function rf(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function af(e, t) {
  if (Kn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (mi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Jc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function of(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function sf({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const l = Le(e), f = l !== "tag", d = e.actions, p = ea(d), h = ta(qe(() => po(d), [d])), g = qe(
    () => f ? Fr(d).map((K) => K.name) : [],
    [f, d]
  ), w = d.findIndex((K) => K.id === i), N = qe(
    () => f && w >= 0 ? Fr(
      d.filter((K, we) => we !== w)
    ).map((K) => K.name) : [],
    [f, d, w]
  ), v = f && e.stayUntilGroupsAnswered === !0, y = qe(
    () => new Set(
      v ? lu(d).map((K) => K.key) : []
    ),
    [v, d]
  ), [k, O] = T(""), [x, B] = T(!1), [C, D] = T(
    null
  ), P = at(), ne = `${P}-from-tags`, J = $(null), j = $(null), z = $(null), F = $(null), _ = $(/* @__PURE__ */ new WeakMap()), L = (K) => {
    let we = _.current.get(K);
    return we || (we = crypto.randomUUID(), _.current.set(K, we)), we;
  }, X = k.trim().toLocaleLowerCase(), Q = X ? d.filter((K) => K.label.toLocaleLowerCase().includes(X)) : d, ae = (K) => t({ ...e, actions: K }), H = (K, we) => ae(d.map((Ee, ke) => ke === K ? we : Ee));
  function S(K) {
    var we;
    return [...((we = z.current) == null ? void 0 : we.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ee) => Ee.dataset.actionId === K
    );
  }
  function ce(K, we) {
    const Ee = S(K), ke = Ee == null ? void 0 : Ee.querySelector(
      we === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  Ct(() => {
    var we;
    const K = F.current;
    K && (F.current = null, (K === "add" || !ce(K.id, K.part)) && ((we = j.current) == null || we.focus()));
  }), ee(() => {
    !c || !i || (Q.some((K) => K.id === i) ? ce(i, "label") : (O(""), F.current = { id: i, part: "label" }));
  }, [c]);
  function A() {
    const K = of(l);
    O(""), ae([...d, K]), s(K.id), F.current = { id: K.id, part: "label" };
  }
  function Z(K) {
    const we = d[K], { shortcut: Ee, ...ke } = structuredClone(we), Ne = {
      ...ke,
      ...Ee === or ? { shortcut: Ee } : {},
      id: crypto.randomUUID(),
      label: `${we.label} copy`
    };
    ae([...d.slice(0, K + 1), Ne, ...d.slice(K + 1)]), s(Ne.id), F.current = { id: Ne.id, part: "label" };
  }
  function ue(K) {
    const we = d[K], Ee = Q.indexOf(we), ke = Q[Ee + 1] ?? Q[Ee - 1];
    ae(d.filter((Ne, Je) => Je !== K)), i === we.id && s(null), F.current = ke ? { id: ke.id, part: "toggle" } : "add";
  }
  function me() {
    B(!1), requestAnimationFrame(() => {
      var K;
      return (K = J.current) == null ? void 0 : K.focus();
    });
  }
  return /* @__PURE__ */ u("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ u("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ u("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ u(
          "button",
          {
            ref: j,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: J,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": x,
            "aria-controls": x ? ne : void 0,
            onClick: () => {
              D(null), B(!x);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(Ea, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: k,
              onChange: (K) => O(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && k && !fn(K) && (K.preventDefault(), K.stopPropagation(), O(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      f && /* @__PURE__ */ u("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: v,
              "aria-describedby": `${P}-groups-note`,
              onChange: (K) => t({
                ...e,
                stayUntilGroupsAnswered: K.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${P}-groups-note`, children: v && !g.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === d ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && x && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || fn(K) || (K.preventDefault(), K.stopPropagation(), me());
        },
        children: /* @__PURE__ */ a(
          zu,
          {
            id: ne,
            review: e,
            disabled: o,
            onAdd: (K) => {
              const we = [...d, ...K];
              ae(we), D({ actions: we, count: K.length }), me();
            },
            onCancel: me
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: z, children: Q.length > 0 && /* @__PURE__ */ a(
      zs,
      {
        items: Q,
        getKey: (K) => K.id,
        disabled: o || !!X,
        className: "dq-action-list",
        onReorder: (K) => ae(K),
        renderItem: (K, { dragHandleProps: we, isOver: Ee }) => {
          const ke = d.indexOf(K), Ne = i === K.id;
          return /* @__PURE__ */ a(
            cf,
            {
              action: K,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                ef,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: K.label.trim() || "New action",
                  onChoose: (Je) => ae(kd(d, ke, Je))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? K.shortcut : void 0,
              groupUnanswerable: "steps" in K && y.has(Et(K.group)),
              effect: Pr(K, h, n, r),
              open: Ne,
              detailId: `${P}-detail-${K.id}`,
              dragHandleProps: we,
              isOver: Ee,
              reorderDisabled: o || !!X,
              onToggle: () => s(Ne ? null : K.id),
              onDuplicate: () => Z(ke),
              onDelete: () => ue(ke),
              children: "steps" in K ? /* @__PURE__ */ a(
                lf,
                {
                  action: K,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ae(e),
                  saving: o,
                  stepKey: L,
                  rememberStepKey: (Je, pe) => _.current.set(Je, L(pe)),
                  onChange: (Je) => H(ke, Je)
                }
              ) : /* @__PURE__ */ a(
                uf,
                {
                  action: K,
                  tagGroups: n,
                  onChange: (Je) => H(ke, Je)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !Q.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      k.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function cf({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: o = !1,
  effect: i,
  open: s,
  detailId: c,
  dragHandleProps: l,
  isOver: f,
  reorderDisabled: d,
  onToggle: p,
  onDuplicate: h,
  onDelete: g,
  children: w
}) {
  const N = e.label.trim() || "New action", v = af(e, t), y = "steps" in e && Et(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ u(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${f ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ u("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              ...l,
              style: Jc(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(Xs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            y && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${y}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              y
            ] }),
            !s && /* @__PURE__ */ a(
              "span",
              {
                className: "dq-action-row-effect",
                title: i.map((k) => k.text).join(" "),
                children: i.map((k, O) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, O))
              }
            ),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", title: v, children: [
              /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: v })
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${qa(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${qa(r)} is pinned twice` })
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${y} can't be answered` })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${N}`,
              title: "Duplicate",
              onClick: h,
              children: /* @__PURE__ */ a(Zs, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: g,
              children: /* @__PURE__ */ a(io, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: p,
              children: /* @__PURE__ */ a(li, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: w })
      ]
    }
  );
}
function Hc({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ u("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Button label" }),
    /* @__PURE__ */ a(
      "input",
      {
        className: "dq-input dq-action-label-input",
        value: e.label,
        onChange: (n) => t(n.target.value)
      }
    )
  ] });
}
function lf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: o,
  stepKey: i,
  rememberStepKey: s,
  onChange: c
}) {
  const l = at(), f = $(null), d = $(null);
  Ct(() => {
    var g, w;
    const h = d.current;
    h != null && (d.current = null, (w = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || w.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Hc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Zu,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: r,
        onChange: c
      }
    ),
    /* @__PURE__ */ u("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": l, children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", id: l, children: "Steps" }),
      /* @__PURE__ */ u("div", { className: "dq-steps", ref: f, children: [
        e.steps.length > 0 ? /* @__PURE__ */ a(
          zs,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: g, dragHandleProps: w, isOver: N }) => /* @__PURE__ */ a(
              df,
              {
                step: h,
                index: g,
                dragHandleProps: w,
                isOver: N,
                saving: o,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((y, k) => k === g ? v : y));
                },
                onRemove: () => p(e.steps.filter((v, y) => y !== g))
              }
            )
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              d.current = e.steps.length, p([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function df({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: r,
  saving: o,
  onChange: i,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ u(
    "div",
    {
      className: `dq-step${r ? " dq-drag-over" : ""}`,
      "data-step-tone": rf(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Jc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(Xs, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: c })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${c} operation`,
            value: e.mode,
            onChange: (l) => i({ ...e, mode: l.target.value }),
            children: nf.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          sr,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (l) => i({ ...e, tagIds: l }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${c}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: o
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${c}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function uf({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Hc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ u("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ u(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: o,
          onChange: (s) => {
            const c = s.target.value;
            n({
              ...e,
              effect: c === "SKIP" ? { mode: "SKIP" } : c === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(c.slice(6)) }
            });
          },
          children: [
            /* @__PURE__ */ a("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ a("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            i && /* @__PURE__ */ a("option", { value: o, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ a("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
const Qc = zl(!1);
function ff({ children: e }) {
  return /* @__PURE__ */ a(Qc.Provider, { value: !0, children: e });
}
function nn({ tag: e, name: t }) {
  const n = Vl(Qc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Hl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function pf({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Vn(_e(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      sr,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (i) => o({ tagIds: i }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "checkbox",
          checked: n.multiple,
          onChange: (i) => o({ multiple: i.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      r
    ] }),
    /* @__PURE__ */ a("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function hf({
  review: e,
  onChange: t
}) {
  const n = Vn(_e(e)).many, r = e.occurrence, o = ic(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ra([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: Nd(r, d) }), f = (d, p) => l(
    o.map(
      (h, g) => g !== d ? h : p === void 0 ? { tagId: h.tagId } : { tagId: h.tagId, categoryTagId: p }
    )
  );
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group dq-flag-settings", children: [
    /* @__PURE__ */ a("legend", { children: "Performer flags" }),
    /* @__PURE__ */ u("p", { children: [
      "Flag performers whose profile has one of these tags, for example a tag noting that something changed during their career. ",
      /* @__PURE__ */ a("strong", { children: "Affects" }),
      " names the category the flag is about, that tag and everything under it: the flag then asks for attention only where an answer changes that category. Leave it empty for the whole review. Check a flagged performer’s earliest and latest ",
      n,
      " before applying one batch to all of them."
    ] }),
    o.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: o.map((d, p) => {
      const h = c(d.tagId), g = o.filter(
        (v, y) => y !== p && v.tagId === d.tagId
      ), w = (v) => g.some((y) => y.categoryTagId === v), N = `${d.tagId}#${o.slice(0, p).filter((v) => v.tagId === d.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(nn, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Xi,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (v) => f(p, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${h}`,
              excludeIds: g.flatMap(
                (v) => v.categoryTagId === void 0 ? [] : [v.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${h}`,
            title: "Remove flag",
            onClick: () => l(o.filter((v, y) => y !== p)),
            children: /* @__PURE__ */ a(io, { "aria-hidden": "true" })
          }
        ),
        i.length > 0 && /* @__PURE__ */ u(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${h}`,
            children: [
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === void 0,
                  disabled: w(void 0),
                  onClick: () => f(p, void 0),
                  children: "Whole review"
                }
              ),
              i.map((v) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === v,
                  disabled: w(v),
                  onClick: () => f(p, v),
                  children: c(v)
                },
                v
              ))
            ]
          }
        )
      ] }, N);
    }) }),
    /* @__PURE__ */ a(
      Xi,
      {
        entityType: "tag",
        value: void 0,
        onChange: (d) => {
          d !== void 0 && l([...o, { tagId: d }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: o.flatMap((d) => d.categoryTagId === void 0 ? [d.tagId] : [])
      }
    )
  ] });
}
const Wc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Yc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, mf = {
  video: so,
  audio: nc,
  tag: tc,
  performerOccurrence: ec,
  audioPerformerOccurrence: od
};
function Xc({ entityType: e }) {
  const t = mf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Wc[e] });
}
const gf = 2e6;
function Zc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function bf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function $i(e) {
  Zc([e], bf(e));
}
async function yf(e) {
  if (e.size > gf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ia(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Wr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function el({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: o,
  autoFocus: i = !1
}) {
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Le(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: sc.map((s) => /* @__PURE__ */ a("option", { value: s, children: Yc[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Review name" }),
      /* @__PURE__ */ a(
        "input",
        {
          ref: o,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: i,
          value: e.name,
          onChange: (s) => t({ ...e, name: s.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Description" }),
      /* @__PURE__ */ a(
        "textarea",
        {
          className: "dq-input",
          "aria-label": "Description",
          rows: 3,
          value: e.description,
          onChange: (s) => t({ ...e, description: s.target.value })
        }
      )
    ] })
  ] });
}
function wf(e, t) {
  const n = Le(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function vf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), o = at(), i = at();
  return ee(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = r.current) == null || s.focus();
  }, []), /* @__PURE__ */ u(
    "dialog",
    {
      ref: n,
      className: "dq-confirm-dialog",
      "aria-labelledby": o,
      "aria-describedby": i,
      "aria-modal": "true",
      onCancel: (s) => {
        s.preventDefault(), e();
      },
      onClose: e,
      children: [
        /* @__PURE__ */ a("h2", { id: o, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ a("p", { id: i, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ u("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ a("button", { ref: r, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function tl({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: r,
  tagGroups: o,
  trees: i,
  saving: s,
  saveDisabled: c = !1,
  error: l,
  dirty: f,
  criteriaChanged: d = !1,
  notices: p,
  onSave: h,
  onCancel: g,
  drawerRef: w
}) {
  const [N, v] = T("Review"), [y] = T(
    () => Ae(e) && e.occurrence.tagIds.length > 0
  ), [k, O] = T(""), [x, B] = T(null), [C, D] = T(0), [P, ne] = T(!1), J = $(null), j = $(null), z = $(null), F = wf(e, y), _ = Le(e), L = qe(() => Wr(e), [e]);
  ee(() => O(""), [L]), ee(() => {
    var ce, A;
    if (P) return;
    const H = J.current;
    if (J.current = null, !H) return;
    (A = H.isConnected && !!((ce = z.current) != null && ce.contains(H)) && !(H instanceof HTMLButtonElement && H.disabled) ? H : z.current) == null || A.focus({ preventScroll: !0 });
  }, [P]);
  function X() {
    if (!(s || P)) {
      if (!f) {
        g();
        return;
      }
      J.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ne(!0);
    }
  }
  function Q() {
    const H = { ...e, name: e.name.trim() }, S = Sa(H);
    if (!S) {
      O(""), h();
      return;
    }
    if (O(S), !H.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = j.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const ce = e.actions.find(
      (A) => !Kn(A, _)
    );
    ce && (v("Actions"), B(ce.id), D((A) => A + 1));
  }
  const ae = k || l;
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (H) => {
          z.current = H, w && (w.current = H);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (H) => {
          H.key !== "Escape" || H.defaultPrevented || s || fn(H) || (H.preventDefault(), H.stopPropagation(), X());
        },
        children: [
          /* @__PURE__ */ u("header", { className: "dq-drawer-header", children: [
            /* @__PURE__ */ u("div", { className: "dq-drawer-title", children: [
              /* @__PURE__ */ a("span", { className: "dq-eyebrow", children: "Edit review" }),
              /* @__PURE__ */ a("h2", { children: e.name.trim() || "Untitled review" })
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-icon-button",
                "aria-label": "Close editor",
                title: "Close without saving",
                disabled: s,
                onClick: X,
                children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ql,
            {
              tabs: F.map((H) => ({
                key: H,
                label: H,
                count: H === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (H) => v(H)
            }
          ) }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-body", children: /* @__PURE__ */ u("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ a(
                    el,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: j,
                      autoFocus: !0
                    }
                  ),
                  /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
                    /* @__PURE__ */ a("span", { children: "Review direction" }),
                    /* @__PURE__ */ u(
                      "select",
                      {
                        className: "dq-select",
                        "aria-label": "Review direction",
                        value: n,
                        onChange: (H) => r(H.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Ae(e) && /* @__PURE__ */ a(hf, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => $i(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            F.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(Nf, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: N !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ a(
                  sf,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: x,
                    onExpand: B,
                    reveal: C
                  }
                )
              }
            ),
            y && Ae(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(pf, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ae || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            ae && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
              ae
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: X, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || Q();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    P && /* @__PURE__ */ a(
      vf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), g();
        }
      }
    )
  ] });
}
function Nf({
  review: e,
  onChange: t
}) {
  const n = at(), r = e.view, o = (d) => t({ ...e, view: { ...r, ...d } }), i = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (d) => o({ selectAllOnLoad: d.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Le(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        ys,
        {
          label: "View",
          value: r.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (d) => o({ displayMode: d })
        }
      ),
      i,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (d) => t({ ...e, presentation: { ...s, ...d } }), l = s.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          ws,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(Sf, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          ws,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(kf, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        ys,
        {
          label: "Cards",
          value: r.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (d) => o({ displayMode: d })
        }
      ),
      i,
      /* @__PURE__ */ u("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ a("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([d, p]) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: l.includes(d),
              onChange: (h) => c({
                annotations: h.target.checked ? [...l, d] : l.filter((g) => g !== d)
              })
            }
          ),
          p
        ] }, d)) })
      ] }),
      l.includes("tags") && /* @__PURE__ */ u("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ u("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            sr,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (d) => c({ annotationParents: d }),
              placeholder: "Add a parent tag…",
              inputAriaLabel: "Add a parent tag for card tags",
              containerClassName: "dq-chip-input",
              inputClassName: "dq-chip-input-field",
              allowCreate: !1
            }
          ),
          /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Cards show only the tags under these parents, whatever the queue filters." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ a(
        sr,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (d) => c({ binParents: d }),
          placeholder: "Add a parent tag…",
          inputAriaLabel: "Add a parent tag for queue bins",
          containerClassName: "dq-chip-input",
          inputClassName: "dq-chip-input-field",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] }),
    /* @__PURE__ */ a(
      qf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function qf({
  bins: e,
  onChange: t
}) {
  const n = at(), [r, o] = T(null), i = e.find((c) => c.key === r), s = (c, l) => t(
    e.map((f) => {
      var p;
      if (f.key !== c) return f;
      const d = { ...f, ...l };
      return (p = d.group) != null && p.trim() || delete d.group, d;
    })
  );
  return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-title`, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-title`, children: "Queue filter bins" }),
    e.map((c, l) => {
      const f = c.label.trim() || `Filter bin ${l + 1}`, d = Object.keys(c.filter).length;
      return /* @__PURE__ */ u("div", { className: "dq-filter-bin", role: "group", "aria-label": f, children: [
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Name of ${f}`,
            placeholder: "Bin name",
            value: c.label,
            onChange: (p) => s(c.key, { label: p.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: c.group ?? "",
            onChange: (p) => s(c.key, { group: p.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": `Edit filter of ${f}`,
            onClick: () => o(c.key),
            children: d ? "Edit filter…" : "Set filter…"
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Delete ${f}`,
            title: "Delete",
            onClick: () => t(e.filter((p) => p.key !== c.key)),
            children: /* @__PURE__ */ a(io, { "aria-hidden": "true" })
          }
        )
      ] }, c.key);
    }),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button",
        onClick: () => {
          const c = crypto.randomUUID();
          t([...e, { key: c, label: "", filter: {} }]), o(c);
        },
        children: [
          /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || fn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          Vs,
          {
            open: !0,
            onClose: () => o(null),
            criteria: oo,
            activeFilter: i.filter,
            supportsFilterExpressions: !0,
            subjectLabel: i.label.trim() ? `videos in ${i.label.trim()}` : "videos in this bin",
            onApply: (c) => {
              o(null), s(i.key, { filter: c });
            }
          }
        )
      }
    )
  ] });
}
function ys({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const o = at();
  return /* @__PURE__ */ u("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ a("span", { className: "dq-setting-name", id: o, children: e }),
    /* @__PURE__ */ a("div", { className: "dq-segmented", role: "group", "aria-labelledby": o, children: n.map((i) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-pressed": t === i.value,
        onClick: () => t !== i.value && r(i.value),
        children: i.label
      },
      i.value
    )) })
  ] });
}
function ws({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: o,
  onChoose: i
}) {
  const s = at(), c = at();
  return /* @__PURE__ */ u("label", { className: "dq-layout-card", children: [
    o,
    /* @__PURE__ */ u("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": c,
          onChange: i
        }
      ),
      /* @__PURE__ */ a("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ a("span", { className: "dq-layout-card-text", id: c, children: r })
  ] });
}
function Sf() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function kf() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 44].flatMap(
      (t) => [8, 80, 152, 224].map((n) => /* @__PURE__ */ a(
        "rect",
        {
          className: e.has(`${n},${t}`) ? "dq-picture-selected" : "dq-picture-strong",
          x: n,
          y: t,
          width: "66",
          height: "30",
          rx: "3"
        },
        `${n},${t}`
      ))
    ),
    /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: "8", y: "80", width: "282", height: "10", rx: "3" })
  ] });
}
const Yo = "The queue differs from the saved review.";
function nl({
  name: e,
  description: t,
  entityType: n,
  onBack: r,
  backDisabled: o,
  onEdit: i,
  editDisabled: s,
  editing: c = !1,
  toolbar: l,
  trailing: f,
  trailingEnd: d,
  queueChange: p,
  queueDiffers: h,
  chipsStart: g,
  chipsAfter: w,
  chipsEnd: N
}) {
  const v = $(null);
  If(v);
  const y = $f(v), [k, O] = T({ differs: h, text: "" });
  return k.differs !== h && O({
    differs: h,
    text: h ? k.differs === !1 ? Yo : k.text : ""
  }), /* @__PURE__ */ u("header", { ref: v, className: "dq-review-header", children: [
    /* @__PURE__ */ u("div", { className: "dq-review-header-lead", children: [
      r && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: o,
          onClick: r,
          children: /* @__PURE__ */ a(Ta, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Wc[n], children: /* @__PURE__ */ a(Xc, { entityType: n }) }),
      /* @__PURE__ */ a("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ a("p", { className: "dq-sr-only", children: t }),
      i && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          "aria-haspopup": "dialog",
          "aria-expanded": c,
          disabled: s,
          onClick: i,
          children: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(Ef, { change: p, onPress: y }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    w && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: w }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function Ef({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), o = `${Yo} Save these filters to the review.`, i = e.onSave ? `${Yo} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(ge, { children: [
    e.onSave && /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: o,
        "aria-describedby": n,
        disabled: e.saveDisabled,
        onClick: () => {
          var s;
          t(), (s = e.onSave) == null || s.call(e);
        },
        children: [
          /* @__PURE__ */ a(cd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ a("span", { id: n, hidden: !0, children: o })
        ]
      }
    ),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": r,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ a(ld, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const Af = ["queue", "summary", "name", "layout", "range"], Cf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Tf = "(min-width: 1400px)";
function Ja(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function vs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = Af.filter(
    (i) => e.querySelector(Cf[i])
  );
  for (let i = 1; i <= o.length && !Ja(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ja(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ja(e) ? !0 : (r(), !1);
}
function If(e) {
  const t = Dc(Tf), [n, r] = T(0), o = $(!1);
  Ct(() => {
    e.current && (o.current = !vs(e.current, t));
  }, [e, t, n]), Ct(() => {
    const i = e.current;
    i && t && !o.current && !Ja(i) && (o.current = !vs(i, t));
  }), ee(() => {
    const i = e.current;
    if (!i || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(i);
    for (const c of i.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function $f(e) {
  const t = $(!1);
  return ee(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const r = document.activeElement, o = (r == null ? void 0 : r.closest(".dq-queue-button")) ?? null;
    if (r && r !== document.body && !o) {
      t.current = !1;
      return;
    }
    if (o && !o.disabled) return;
    const i = n.querySelector(".dq-queue-button") ?? n.querySelector(".dq-review-header-trail .dq-menu > button");
    !i || i.disabled || (t.current = !1, i.focus());
  }), () => {
    t.current = !0;
  };
}
function rl({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, o] = T(!1), [i, s] = T(""), c = $(null), l = $(null);
  ee(() => {
    var p;
    r && ((p = c.current) == null || p.select());
  }, [r]);
  const f = (p) => {
    o(!1), p && requestAnimationFrame(() => {
      var h;
      return (h = l.current) == null ? void 0 : h.focus();
    });
  }, d = () => {
    const p = Math.round(Number(i));
    f(!0), Number.isFinite(p) && p >= 1 && p !== e && n(Math.min(t, p));
  };
  return /* @__PURE__ */ u("span", { className: "dq-pager", children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ a(Ta, { "aria-hidden": "true" })
      }
    ),
    r ? /* @__PURE__ */ a(
      "input",
      {
        ref: c,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: i,
        onChange: (p) => s(p.target.value),
        onKeyDown: (p) => {
          fn(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
        },
        onBlur: () => f(!1)
      }
    ) : /* @__PURE__ */ u(
      "button",
      {
        ref: l,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          s(String(e)), o(!0);
        },
        children: [
          e,
          " / ",
          t
        ]
      }
    ),
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => n(e + 1),
        children: /* @__PURE__ */ a(rc, { "aria-hidden": "true" })
      }
    )
  ] });
}
function al({
  mode: e,
  disabled: t,
  onChange: n
}) {
  return /* @__PURE__ */ u("div", { className: "dq-segmented dq-layout-switch", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        title: "One item at a time",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ a(sd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Single" })
        ]
      }
    ),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        title: "Cards in a grid",
        "aria-pressed": e === "multiple",
        disabled: t,
        onClick: () => e !== "multiple" && n("multiple"),
        children: [
          /* @__PURE__ */ a(di, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Rf({
  options: e,
  value: t,
  disabled: n,
  onChange: r
}) {
  return /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((o) => /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      "aria-label": o.label,
      title: o.label,
      "aria-pressed": t === o.value,
      disabled: n,
      onClick: () => t !== o.value && r(o.value),
      children: o.icon
    },
    o.value
  )) });
}
function Ri({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = T(!1), [i, s] = T(!1), c = $(null), l = $(null), f = at();
  Ct(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = l.current.offsetHeight + 12, w = window.innerHeight - h.bottom;
    s(w < g && h.top > w);
  }, [r]), ee(() => {
    var h, g;
    r && ((g = (h = l.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), ee(() => {
    t && o(!1);
  }, [t]);
  const d = (h = !0) => {
    var g;
    o(!1), h && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const g = [
      ...((N = l.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], w = g.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), d();
    else if (h.key === "Tab")
      d(!1);
    else if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), !g.length) return;
      const y = h.key === "ArrowDown" ? 1 : -1;
      g[(w + y + g.length) % g.length].focus();
    } else (h.key === "Home" || h.key === "End") && (h.preventDefault(), (v = g.at(h.key === "Home" ? 0 : -1)) == null || v.focus());
  }, children: [
    /* @__PURE__ */ a(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": r,
        "aria-controls": r ? f : void 0,
        disabled: t,
        onClick: () => o((h) => !h),
        children: /* @__PURE__ */ a(id, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: l,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(si, { children: [
            h.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: h.danger ? "dq-menu-danger" : void 0,
                disabled: h.disabled,
                onClick: () => {
                  d(), h.onSelect();
                },
                children: [
                  h.icon,
                  h.label
                ]
              }
            )
          ] }, h.label))
        }
      )
    ] })
  ] });
}
function ro(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Oi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Mi(e) {
  return !!String(e ?? "").trim();
}
function Fi(e) {
  return [
    ...new Set(
      ro(e.customFieldCriteria).filter(Oi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Mi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function xi(e, t) {
  const n = ro(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!Oi(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !Mi(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function ol(e, t, n) {
  const r = ro(e.customFieldCriteria);
  if (!r.length) return e;
  const o = ro(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!Oi(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(l[p] ?? "")];
      g && l[h] === g && !Mi(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Of(e, t, n) {
  if (!Kn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), o = n.steps.some((c) => Bn(c.mode)) ? await ru(r) : "", i = await vi(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !Bn(l.mode)),
    ...i.filter((l) => Bn(l.mode))
  ]) {
    const l = (f) => au(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await cl(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: c.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(c.mode) ? c.tagIds : []
    )), c.mode === "MARK_ABSENT" && await l("ADD");
  }
  return s;
}
async function Pi(e, t) {
  const n = e.occurrence;
  if (co(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ve("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        zn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: i,
          filterExpression: o
        })
      )
    });
    if (c.items.forEach((l) => r.add(l.id)), s * 1e3 >= c.totalCount) return [...r];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function il(e) {
  return Na(e.condition) && e.hideConfirmedAbsent !== !1;
}
function ho(e, t) {
  const { _filterExpression: n, ...r } = e.view.objectFilter, o = e.occurrence, i = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...o.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: o.condition,
        value: o.conditionTagIds,
        depth: o.includeSubtags === !1 ? 0 : -1
      }
    }
  }, s = il(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: _e(e),
    actions: [],
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...n ? [{ group: n }] : [],
            { filter: r },
            { filter: { performerFilterCriterion: i } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: uo,
                      type: "text",
                      modifier: "notEquals",
                      value: s
                    }
                  ]
                }
              }
            ] : []
          ]
        }
      }
    }
  };
}
async function Li(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => fo([n], t))
  );
}
function sl(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Mf(e, t, n = e.conditionTagIds.map((r) => [r])) {
  const r = new Set(t), o = (i) => i.some((s) => r.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return r.size === 0;
    case "includes":
      return n.some(o);
    case "includesAll":
      return n.every(o);
    case "excludes":
      return !n.some(o);
    case "excludesAll":
      return !n.every(o);
  }
}
function Ff(e, t, n, r, o) {
  if (!il(e)) return !1;
  const i = Nc(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((l) => r.includes(l))
  );
}
async function Di(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || sl(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = _e(e), i = await Jr(
    ho(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await Li(c, r) : [], f = new Array(i.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; d < i.items.length; ) {
        const p = d++, h = i.items[p], g = await ve(
          `/api/tagapplications?hostType=${o}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((w) => s === null || s.has(w.id)).flatMap((w) => {
          const N = g.filter(
            (y) => y.hostType === o && y.hostId === h.id && y.contextType === "performer" && y.contextId === w.id
          ), v = N.map((y) => y.tag.id);
          return Mf(e.occurrence, v, l) && !Ff(c, h, w.id, v, l) ? [
            {
              key: `${h.id}:${w.id}`,
              media: h,
              performer: w,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: i.totalCount };
}
async function cl(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = _e(e), i = await to(o, t.media.id);
  if (!i.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ve(s)).filter(
    (f) => f.hostType === o && f.hostId === i.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await ve("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: i.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: f,
          sourceKey: "user"
        })
      });
    for (const f of c)
      r.has(f.tag.id) && !l.has(f.tag.id) && await ve(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ve(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Xr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function xf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function qn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? Nc(
      await to(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ve(xf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Qo(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await to(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  Qo(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === eo
  ) ?? eo, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: o.map((l) => l.id),
    names: o.map((l) => l.name),
    absent: s,
    tags: o
  };
}
async function _i(e, t, n) {
  if (t.occurrence && Ae(e))
    await cl(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: [...n.added, ...n.removed],
          multiple: !0
        }
      },
      t.occurrence,
      n.added
    );
  else
    for (const [r, o] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      o.length && await ve(
        `/api/${dr(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Pf(e, t, n) {
  t.occurrence && Ae(e) ? await Of(e, t.occurrence, n) : await qc(_e(e), n, [t.media.id]);
}
function Xo(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Xr(o(t.ids), o(n.ids)),
    absence: Xr(o(t.absent), o(n.absent))
  };
}
function Lf(e, t) {
  var n;
  for (const [r, o] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (r.added.some((i) => !o.includes(i)) || r.removed.some((i) => o.includes(i)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const r of e.tags.added) {
      const o = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === r).map((s) => s.id).sort(), i = t.applications.filter((s) => s.tag.id === r).map((s) => s.id).sort();
      if (JSON.stringify(o) !== JSON.stringify(i))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class ll extends Error {
}
const Zo = (e) => e instanceof Error ? e.message : "Request failed.", Ns = (e) => [...e].sort((t, n) => t - n), ka = (e, t) => JSON.stringify(Ns(e)) === JSON.stringify(Ns(t)), ei = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ao(e, t, n, r) {
  const o = new Set(e), i = new Set(e);
  for (const d of t.steps)
    for (const p of d.tagIds)
      d.mode === "ADD" ? i.add(p) : i.delete(p);
  const s = e.some((d) => !i.has(d));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((d) => d.mode === "ADD").flatMap((d) => d.tagIds)
  ), l = [], f = [];
  for (const d of n) {
    const p = d.filter((g) => i.has(g) && !o.has(g)), h = d.filter(
      (g) => i.has(g) && o.has(g) && !c.has(g)
    );
    !p.length || !h.length || (r ? (h.forEach((g) => i.delete(g)), f.push(...h)) : (p.forEach((g) => i.delete(g)), l.push({ tagIds: p, existing: h })));
  }
  return { desired: [...i], conflict: s, skipped: !1, kept: l, replaced: f };
}
function Df(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function _f(e, t, n, r) {
  for (const [o, i] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (d) => d.mode === "ADD" && d.tagIds.some((p) => i.includes(p))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[o];
    let l = `tag ${c}`;
    try {
      l = (await ve(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new ll(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function jf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Kn(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = Na(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Li(o.occurrence, n) : [];
  await _f(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await vi(h, n)
    }))
  ), l = structuredClone(Df(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...l.steps.flatMap((h) => h.tagIds),
      ...s.flat()
    ])
  ];
  o.view.filter = {
    ...o.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const d = await Pi(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await Di(o, d, h, n);
    for (const w of g.items) {
      const N = {
        ids: [...new Set(w.applications.map((y) => y.tag.id))],
        names: w.applications.map((y) => y.tag.name),
        absent: [],
        applications: w.applications
      }, v = ao(N.ids, l, s, !0);
      p.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ka(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(p.size), h * 250 >= g.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: i,
    action: l,
    categories: s,
    touched: f,
    entries: [...p.values()]
  };
}
function Uf(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!ka(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ka(o(e), o(t));
}
async function dl(e, t, n, r) {
  let o = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && o < e.length; ) {
        const i = e[o++];
        await n(i), r();
      }
    })
  );
}
function ul(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function fl(e) {
  return e.entries.filter((t) => t.operation);
}
async function Bf(e, t, n, r, o = !1) {
  await dl(
    ul(e, o),
    n,
    async (i) => {
      if (i.conflict && !t) {
        i.status = "skipped", i.error = "Conflicting answer skipped.";
        return;
      }
      if (i.unverified) {
        i.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let s;
      try {
        if (s = await qn(_e(e.review), i.item, !1), !Uf(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = Zo(h);
        return;
      }
      const c = ao(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Xr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await _i(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await qn(_e(e.review), i.item, !1);
        p = !0, i.expected = h;
        const g = Xo(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = ei(g) ? g : void 0, d) throw d;
        if (!ka(
          h.ids.filter((w) => e.touched.includes(w)),
          l.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = Zo(h), !p)
          try {
            const g = await qn(_e(e.review), i.item, !1);
            i.expected = g;
            const w = Xo(
              i.item,
              i.before,
              g,
              e.touched
            );
            i.operation = ei(w) ? w : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Gf(e, t, n) {
  await dl(
    fl(e),
    t,
    async (r) => {
      const o = r.operation;
      if (r.unverified) {
        r.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const i = [...o.tags.added, ...o.tags.removed];
      let s = !1;
      try {
        const c = await qn(_e(e.review), r.item, !1);
        Lf(o, c), s = !0, await _i(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await qn(_e(e.review), r.item, !1);
        if (!ka(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Zo(c)}`, r.status = "failed", s)
          try {
            const l = await qn(_e(e.review), r.item, !1), f = Xo(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = ei(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const pl = (e, t) => t.count - e.count || Sc(e, t);
async function Kf(e, t, n) {
  const r = _e(e), o = e.occurrence, [i, s] = await Promise.all([
    ve(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Li(o, n)
  ]), c = i.filter(
    (w) => w.hostType === r && w.contextType === "performer" && w.contextId === t
  );
  Qo(c.map((w) => w.tag));
  const l = await Promise.all(
    s.map(async (w, N) => {
      const v = o.conditionTagIds[N];
      return (await ve(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((w) => w.steps).filter((w) => w.mode === "ADD" || w.mode === "MARK_PRESENT").flatMap((w) => w.tagIds),
      ...o.tagIds
    ].filter((w) => !f.has(w))
  ), p = (w) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!w.has(v.tag.id)) continue;
      const y = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      y.hosts.add(v.hostId), N.set(v.tag.id, y);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(pl);
  }, h = s.map((w, N) => ({
    id: o.conditionTagIds[N],
    name: l[N],
    members: w,
    tags: p(new Set(w))
  }));
  d.size && h.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...d],
    tags: p(d)
  });
  const g = /* @__PURE__ */ new Set([...f, ...d]);
  return {
    answered: new Set(
      c.filter((w) => g.has(w.tag.id)).map((w) => w.hostId)
    ).size,
    groups: h
  };
}
function zf(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...o].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...lr(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function ji(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const w of g.tags) r.set(w.id, w);
  const o = (g) => g.flatMap((w) => r.get(w) ?? []).sort(pl), i = (g) => g.members ?? g.tags.map((w) => w.id), s = Fr(t).flatMap((g) => {
    const w = [
      ...new Set(g.actions.flatMap((N) => [...lr(t[N])]))
    ];
    return w.length ? [{ ...g, answers: w, tags: o(w) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], l = e.groups.filter((g) => g.id !== null).map((g) => {
    const w = `tag:${g.id}`, N = i(g), v = new Set(N);
    return {
      key: w,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: zf(g.id, N, t, n) ? c({ key: w, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((y) => y.answers.every((k) => v.has(k))).flatMap(
          (y) => c({
            key: `group:${y.key}`,
            name: y.name,
            members: y.answers,
            tags: y.tags
          })
        )
      )
    };
  }), f = l.map((g) => new Set(g.members)), d = /* @__PURE__ */ new Set();
  for (const g of s) {
    if (f.some((N) => g.answers.every((v) => N.has(v)))) continue;
    g.answers.forEach((N) => d.add(N));
    const w = `group:${g.key}`;
    l.push({
      key: w,
      kind: "group",
      name: g.name,
      members: g.answers,
      tags: g.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: w, name: g.name, members: g.answers, tags: g.tags })
    });
  }
  const p = e.groups.find((g) => g.id === null), h = (p == null ? void 0 : p.tags.filter((g) => !d.has(g.id))) ?? [];
  return p && h.length && l.push({
    key: "other",
    kind: "other",
    name: l.length ? "Other review tags" : "Review tags",
    members: i(p).filter((g) => !d.has(g)),
    tags: h,
    mixed: []
  }), l;
}
const Oo = { summary: null, error: "" };
function hl(e, t, n = 0) {
  const r = e == null ? void 0 : e.occurrence, o = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    r == null ? void 0 : r.condition,
    r == null ? void 0 : r.conditionTagIds,
    r == null ? void 0 : r.includeSubtags,
    r == null ? void 0 : r.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [i, s] = T({
    key: o,
    value: Oo
  });
  return ee(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Oo }), e === null || t === null) return;
    const c = new AbortController();
    return Kf(e, t, c.signal).then((l) => {
      c.signal.aborted || s({ key: o, value: { summary: l, error: "" } });
    }).catch((l) => {
      c.signal.aborted || s((f) => ({
        key: o,
        value: {
          summary: f.key === o ? f.value.summary : null,
          error: l instanceof Error ? l.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [o, n]), i.key === o ? i.value : Oo;
}
function Vf(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = pu(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => o.add(h.name));
  }
  const i = Et(e.name), s = [...r].filter((f) => Et(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function Jf(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function ti({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = Ko,
  flags: i = [],
  className: s = ""
}) {
  const c = Vn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? ji(e, r, o) : [], d = Si(f), p = (h) => [
    ...new Set(
      i.filter((g) => {
        var w;
        return (w = g.tagIds) == null ? void 0 : w.some((N) => h.includes(N));
      }).flatMap((g) => g.flags)
    )
  ];
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${s}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${l(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ u("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((h) => {
          const g = h.kind === "other" ? [] : p(h.members), w = Vf(h, d), N = w.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: w.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Jf(h, w),
                  children: [
                    /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                    "Mixed",
                    w.names.length > 0 ? /* @__PURE__ */ u("span", { className: "dq-answer-mixed-names", children: [
                      w.here && " here",
                      N,
                      ` ${w.here ? "and in" : "in"} ${w.names.join(", ")}`
                    ] }) : N
                  ]
                }
              ),
              g.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${g.join(", ")}`,
                  children: [
                    /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(nn, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                ", ",
                l(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, h.key);
        }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Qr({
  performer: e
}) {
  return /* @__PURE__ */ u("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ a(
      "img",
      {
        src: `/api/performers/${e.id}/image?max=64`,
        alt: "",
        loading: "lazy",
        onError: (t) => {
          t.currentTarget.style.display = "none";
        }
      },
      e.id
    )
  ] });
}
const qs = 5;
function Hf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ve(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const Ss = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), ni = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], ks = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Qf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Mo = 250;
function ba(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Wf({ step: e }) {
  const t = ni.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: ni.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(Zr, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Es({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(si, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function ga({
  value: e,
  label: t,
  detail: n,
  tone: r,
  pressed: o,
  onToggle: i
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? r : void 0,
      "aria-pressed": o && e > 0,
      disabled: !e,
      onClick: i,
      children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ a("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ u(ge, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function As({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Or(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(nn, { tag: o })
    ] }) }, `added-${o.id}`)),
    Or(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(nn, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function Cs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > Mo && /* @__PURE__ */ u("span", { children: [
        "First ",
        Mo.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ u("table", { children: [
      /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
        /* @__PURE__ */ a("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ a("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ a("th", { scope: "col", children: r })
      ] }) }),
      /* @__PURE__ */ a("tbody", { children: t.slice(0, Mo).map((i) => {
        var s;
        return /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
            "a",
            {
              href: `/${n}/${i.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = i.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                ba(i, n)
              ]
            }
          ) }),
          /* @__PURE__ */ a("td", { className: "dq-batch-list-date", children: i.item.media.date ?? "" }),
          /* @__PURE__ */ a("td", { children: o(i) })
        ] }, i.item.key);
      }) })
    ] }) })
  ] });
}
function Ts(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let r = 0, o = !1;
  for (const i of e)
    if (t[i.status] += 1, i.operation && (r += 1), i.status === "failed" && !i.unverified && (o = !0), (i.status === "skipped" || i.status === "failed") && i.error) {
      const s = `${i.status}\0${i.error}`, c = n.get(s) ?? { status: i.status, error: i.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: r, retryable: o };
}
function Yf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [w, N] = T([]), [v, y] = T(!1), [k, O] = T(!1), [x, B] = T(""), [C, D] = T(!1), [P, ne] = T(""), [J, j] = T(null), [z, F] = T(null), [_, L] = T([]), [X, Q] = T(0), ae = $(null), H = $(null), S = $(null), ce = $(!1), A = $(!1), Z = $(null), ue = $(!1), me = $(!1), K = $({ onClose: i });
  K.current = { onClose: i };
  const we = at(), Ee = l === "run", ke = (J == null ? void 0 : J.kind) === "undo", Ne = Ee && d ? d.review : e, Je = ea(Ne.actions), pe = Ne.occurrence, ot = _e(Ne), Ye = Vn(ot), Dt = Ye.queue, Jt = Ee && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !ir(I))
  ), Ht = Jt.filter((I) => w.includes(I.id)), nt = pe.targetMode === "selected" && pe.performerIds.length === 1, Be = hl(
    Ne,
    s && nt ? pe.performerIds[0] : null,
    X
  ), Ge = Fi(Ne.view.objectFilter), Xe = Ra(
    s ? [...po(Jt), ...pe.conditionTagIds, ...Ge] : []
  ), ur = qe(() => Lc(Xe), [Xe]), gt = (I) => h[I] ?? Xe[I] ?? { id: I, name: `Tag ${I}` }, Jn = JSON.stringify(
    Object.fromEntries(
      Ge.flatMap((I) => {
        var oe;
        const G = (oe = Xe[I]) == null ? void 0 : oe.name;
        return G ? [[String(I), G]] : [];
      })
    )
  ), Ze = qe(
    () => xi(Ne.view.objectFilter, JSON.parse(Jn)),
    [Ne.view.objectFilter, Jn]
  );
  ee(() => {
    var I, G, oe;
    s && ((I = ae.current) == null || I.showModal(), (oe = (G = ae.current) == null ? void 0 : G.querySelector(".dq-batch-answer input")) == null || oe.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var de;
      const G = ae.current, oe = document.activeElement;
      if (!G || oe && oe !== document.body && G.contains(oe)) return;
      (de = (l === "answers" ? G.querySelector(".dq-batch-answer input:checked") ?? G.querySelector(".dq-batch-answer input") : G.querySelector("[data-batch-focus]")) ?? H.current) == null || de.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, k, d]), ee(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const G = S.current;
      if (!ce.current || !G || G.disabled) return;
      ce.current = !1;
      const oe = document.activeElement;
      (!oe || oe === document.body) && G.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || pe.targetMode !== "selected") return;
    const I = new AbortController();
    return L([]), Hf(pe.performerIds.slice(0, qs), I.signal).then((G) => {
      I.signal.aborted || L(G);
    }).catch(() => {
    }), () => I.abort();
  }, [s, pe.targetMode, JSON.stringify(pe.performerIds)]), ee(
    () => () => {
      var I;
      A.current = !0, (I = Z.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!k) return;
    const I = (G) => {
      G.preventDefault(), G.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [k]);
  function Ce() {
    f("answers"), p(null), g({}), j(null), y(!1), N([]), ne(""), B(""), D(!1), F(null);
  }
  function Ke() {
    me.current || (c(!1), K.current.onClose(ue.current), ue.current = !1, Ce(), ce.current = !0);
  }
  function ze(I, G) {
    N(
      (oe) => G ? [...oe, I] : oe.filter((ie) => ie !== I)
    ), p(null), g({}), ne(""), B(""), D(!1), F(null);
  }
  function Rt() {
    f("answers"), F(null), ne("");
  }
  function fr() {
    f("preview"), d || Fn();
  }
  function pn() {
    var I;
    A.current = !0, (I = Z.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function Ot(I) {
    F(
      (G) => (G == null ? void 0 : G.group) === I.group && G.reason === I.reason ? null : I
    );
  }
  const bt = (I, G) => (z == null ? void 0 : z.group) === I && z.reason === G;
  async function Fn() {
    if (!Ht.length || me.current) return;
    me.current = !0, O(!0), B(""), D(!1), ne("Loading all matching occurrences…"), p(null), g({}), F(null);
    const I = new AbortController();
    Z.current = I;
    try {
      const G = await jf(
        e,
        Ht,
        I.signal,
        (ie) => ne(`Loaded ${ie.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const oe = {};
      for (const ie of G.entries)
        for (const de of ie.before.applications ?? [])
          oe[de.tag.id] = de.tag;
      g(oe), p(G), ne("Preview ready. No tags have been changed.");
    } catch (G) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : G instanceof Error ? G.message : String(G)
      ), D(!I.signal.aborted && G instanceof ll), ne("");
    } finally {
      me.current = !1, O(!1), Z.current = null;
    }
  }
  async function Sn(I) {
    if (!d || me.current) return;
    const G = (I === "undo" ? fl(d) : ul(d, I === "retry")).length;
    me.current = !0, A.current = !1, ue.current = !0, O(!0), f("run"), B(""), j({ kind: I, total: G, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const oe = () => j((de) => de && { ...de, done: de.done + 1 });
    let ie = !1;
    try {
      I === "undo" ? await Gf(d, () => A.current, oe) : await Bf(d, v, () => A.current, oe, I === "retry");
      const { counts: de } = Ts(d.entries), Re = de.skipped + de.failed;
      ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? `Batch undo finished.${de.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${de.changed.toLocaleString()} changed`,
          de.unchanged && `${de.unchanged.toLocaleString()} unchanged`,
          de.skipped && `${de.skipped.toLocaleString()} skipped`,
          de.failed && `${de.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${Re ? " Inspect them below." : ""}`
      );
    } catch (de) {
      ie = !0, ne(""), B(de instanceof Error ? de.message : String(de));
    } finally {
      me.current = !1;
      const de = A.current || ie;
      j((Re) => Re && { ...Re, stopped: de }), O(!1), Q((Re) => Re + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], Tt = qe(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        ao(I.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Qt = (I) => Tt.get(I.item.key), hn = (I) => Xr(I.before.ids, Qt(I).desired), kn = (I) => {
    const G = hn(I);
    return I.status === "pending" && (G.added.length > 0 || G.removed.length > 0);
  }, Ve = (I) => I.conflict || Qt(I).kept.length > 0 || Qt(I).replaced.length > 0, It = qe(() => {
    const I = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: I.filter(kn).length,
      correct: I.filter((G) => G.status === "unchanged").length,
      different: I.filter(Ve).length,
      hosts: new Set(I.map((G) => G.item.media.id)).size,
      added: [...new Set(I.flatMap((G) => hn(G).added))],
      removed: [...new Set(I.flatMap((G) => hn(G).removed))]
    };
  }, [Tt]), fe = qe(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((I) => I.item.media.date).sort((I, G) => I.item.media.date.localeCompare(G.item.media.date)),
    [d]
  ), U = Ee ? Ts(he) : null, Fe = (I) => Je.keys[Ne.actions.findIndex((G) => G.id === I)] ?? "", yt = (I) => Pr(I, ur, [], r), En = Na(pe.condition) && pe.includeSubtags !== !1 && pe.conditionTagIds.length > 0, se = fe[0], Mt = fe.length > 1 ? fe[fe.length - 1] : void 0, _t = (I) => `/${ot}/${I.item.media.id}`, Hn = nt ? _[0] : void 0, An = qe(
    () => n ? Ic(
      n,
      Be.summary ? Si(
        ji(Be.summary, Ne.actions, r ?? Ko)
      ) : []
    ) : [],
    [n, Be.summary, Ne.actions, r]
  ), Cn = mu(Ht, An, r ?? Ko), mn = n ?? [], je = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: kn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ve }
  };
  function He() {
    const I = Qf[pe.condition], G = !!I && pe.conditionTagIds.length > 0, oe = pe.performerIds.slice(0, qs), ie = String(Ne.view.filter.q ?? "").trim(), de = pe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      co(pe) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : pe.targetMode === "selected" ? /* @__PURE__ */ u(ge, { children: [
        oe.map((Re, Te) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Qr, { performer: { id: Re, name: _[Te] ?? "" } }),
          _[Te] ?? "…"
        ] }, Re)),
        pe.performerIds.length > oe.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (pe.performerIds.length - oe.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(ge, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              va,
              {
                filter: {},
                objectFilter: pe.performerFilter,
                criteriaDefinitions: ci,
                totalCount: 0,
                sortOptions: [],
                showSearch: !1,
                showSort: !1,
                showPagingControls: !1,
                onFilterChange: () => {
                },
                onObjectFilterChange: () => {
                }
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        G ? I : ui[pe.condition],
        G && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Or(pe.conditionTagIds.map(gt)).map((Re) => /* @__PURE__ */ a(nn, { tag: Re }, Re.id)) })
      ] }),
      G && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: pe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Na(pe.condition) && pe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: de, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          de
        ] })
      ] }),
      ie && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        ie,
        "”"
      ] }),
      Object.keys(Ne.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Dt} filters`,
          children: /* @__PURE__ */ a(
            va,
            {
              filter: Ne.view.filter,
              objectFilter: Ze,
              criteriaDefinitions: ot === "audio" ? Js : oo,
              customFieldEntityType: ot,
              totalCount: 0,
              sortOptions: [],
              showSearch: !1,
              showSort: !1,
              showPagingControls: !1,
              onFilterChange: () => {
              },
              onObjectFilterChange: () => {
              }
            }
          )
        }
      )
    ] });
  }
  function st(I, G, oe = !0) {
    if (!I.length) return null;
    const ie = /* @__PURE__ */ a("strong", { children: Hn || "This performer" }), de = oe ? `Check the earliest and latest ${Ye.many} before applying, or narrow the batch with a date filter.` : "", Re = I.every((Te) => Te.tagIds === null && !Te.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Re ? /* @__PURE__ */ u("p", { children: [
          ie,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Te) => Te.flags).join(", ") }),
          ".",
          " ",
          de
        ] }) : /* @__PURE__ */ u(ge, { children: [
          /* @__PURE__ */ u("p", { children: [
            ie,
            " needs attention where the chosen answers apply.",
            de && ` ${de}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Te) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Te.tagIds === null ? "Whole review" : Te.name }),
            ":",
            " ",
            ki(Te).join("; ")
          ] }, Te.key)) })
        ] }),
        G && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: _t(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ba(se, ot),
            " · ",
            se.item.media.date
          ] }),
          Mt && /* @__PURE__ */ u("a", { href: _t(Mt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ba(Mt, ot),
            " · ",
            Mt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function $t() {
    const I = Cn.filter((oe) => oe.tagIds === null), G = Cn.filter((oe) => oe.tagIds !== null);
    return /* @__PURE__ */ u(ge, { children: [
      He(),
      st(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${nt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Jt.map((oe, ie) => {
            const de = Fe(oe.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: w.includes(oe.id),
                  "aria-labelledby": `${we}-answer-${ie}`,
                  "aria-describedby": `${we}-effect-${ie}`,
                  onChange: (Re) => ze(oe.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: de && /* @__PURE__ */ a(At, { binding: de, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${we}-answer-${ie}`,
                    className: "dq-batch-answer-label",
                    title: oe.label,
                    children: oe.label
                  }
                ),
                /* @__PURE__ */ a(Es, { id: `${we}-effect-${ie}`, parts: yt(oe) })
              ] })
            ] }, oe.id);
          }) })
        ] }),
        nt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: st(G, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            ti,
            {
              ...Be,
              mediaKind: ot,
              actions: Ne.actions,
              trees: r,
              flags: mn,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Qn(I) {
    const G = It, oe = z && Ss.has(z.group) ? z.group : null, ie = oe ? he.filter(je[oe].test) : [], de = (Re) => {
      const Te = Qt(Re), Ie = Te.skipped ? Xr(
        Re.before.ids,
        ao(Re.before.ids, I.action, I.categories, !0).desired
      ) : hn(Re), Ft = !Ie.added.length && !Ie.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Te.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ft ? !Te.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(As, { added: Ie.added, removed: Ie.removed, tag: gt }),
        Te.kept.map((ye, ct) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Or(ye.existing.map(gt)).map((Se) => /* @__PURE__ */ a(nn, { tag: Se }, Se.id)),
          " ",
          "instead of",
          " ",
          Or(ye.tagIds.map(gt)).map((Se) => /* @__PURE__ */ a(nn, { tag: Se }, Se.id))
        ] }, ct))
      ] });
    };
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            ga,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${G.hosts.toLocaleString()} ${G.hosts === 1 ? Dt : `${Dt}s`}`,
              pressed: bt("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            ga,
            {
              value: G.willChange,
              label: "will change",
              tone: "add",
              pressed: bt("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            ga,
            {
              value: G.correct,
              label: "already correct, no write",
              pressed: bt("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            ga,
            {
              value: G.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: bt("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        ie.length > 0 ? /* @__PURE__ */ a(
          Cs,
          {
            title: je[oe].title,
            entries: ie,
            mediaKind: ot,
            resultHeading: "Planned change",
            describe: de
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: se ? `Dates ${se.item.media.date}${Mt ? ` to ${Mt.item.media.date}` : ""}` : "No dates" }),
          se && /* @__PURE__ */ a(
            "a",
            {
              href: _t(se),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ye.one}, ${se.item.media.date}`,
              title: ba(se, ot),
              children: "Open earliest"
            }
          ),
          Mt && /* @__PURE__ */ a(
            "a",
            {
              href: _t(Mt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ye.one}, ${Mt.item.media.date}`,
              title: ba(Mt, ot),
              children: "Open latest"
            }
          ),
          fe.length < he.length && /* @__PURE__ */ u("span", { children: [
            (he.length - fe.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (G.added.length > 0 || G.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            As,
            {
              added: G.added,
              removed: G.removed,
              tag: gt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      G.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${we}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${we}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => y(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => y(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ u("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          En ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function xn() {
    return /* @__PURE__ */ u(ge, { children: [
      He(),
      st(Cn, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${nt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${we}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${we}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: Rt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ht.map((I) => {
            const G = Fe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                G && /* @__PURE__ */ a(At, { binding: G, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(Es, { parts: yt(I) })
            ] }, I.id);
          }) })
        ] }),
        nt && /* @__PURE__ */ a(
          ti,
          {
            ...Be,
            mediaKind: ot,
            actions: Ne.actions,
            trees: r,
            flags: mn,
            className: "dq-batch-card"
          }
        )
      ] }),
      k ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Qn(d)
    ] });
  }
  function rn(I) {
    const G = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, oe = G.kind === "apply" ? he.length - I.counts.pending : G.done, ie = G.kind === "apply" ? he.length : G.total, de = k ? G.kind === "undo" ? "Undoing batch…" : G.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : G.kind === "undo" ? G.stopped ? "Undo stopped" : "Undo finished" : G.stopped ? "Stopped" : "Finished", Re = ie ? Math.round(oe / ie * 100) : 100, Te = z && !Ss.has(z.group) ? z.group : null, Ie = (ye) => ks.find((ct) => ct.status === ye).label, Ft = Te ? he.filter(
      (ye) => ye.status === Te && (!z.reason || ye.error === z.reason)
    ) : [];
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: de }),
          /* @__PURE__ */ u("span", { children: [
            oe.toLocaleString(),
            " of ",
            ie.toLocaleString(),
            " processed"
          ] })
        ] }),
        /* @__PURE__ */ a(
          "span",
          {
            className: "dq-batch-bar",
            role: "progressbar",
            "aria-label": "Batch progress",
            "aria-valuemin": 0,
            "aria-valuemax": ie,
            "aria-valuenow": oe,
            children: /* @__PURE__ */ a("span", { style: { width: `${Re}%` } })
          }
        ),
        !k && G.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (G.total - I.recorded).toLocaleString(),
          " of",
          " ",
          G.total.toLocaleString(),
          " ",
          G.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ks.map((ye) => /* @__PURE__ */ a(
          ga,
          {
            value: I.counts[ye.status],
            label: G.kind === "undo" && ye.status === "unchanged" ? "As before" : ye.label,
            tone: ye.tone,
            pressed: bt(ye.status),
            onToggle: () => Ot({ group: ye.status })
          },
          ye.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((ye) => {
          const ct = bt(ye.status, ye.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              ye.count.toLocaleString(),
              " ",
              ye.status,
              ": ",
              ye.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ct,
                onClick: () => Ot({ group: ye.status, reason: ye.error }),
                children: ct ? "Hide them" : "Show them"
              }
            )
          ] }, `${ye.status}-${ye.error}`);
        }) }),
        Ft.length > 0 ? /* @__PURE__ */ a(
          Cs,
          {
            title: z.reason ? `${Ie(Te)}: ${z.reason}` : `${Ie(Te)} occurrences`,
            entries: Ft,
            mediaKind: ot,
            resultHeading: "Result",
            describe: (ye) => ye.error ?? Ie(ye.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      I.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: k,
            onClick: () => void Sn("undo"),
            children: [
              /* @__PURE__ */ a(dd, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? G.stopped || k ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Wn() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ht.length,
        onClick: fr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: pn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !It.willChange,
        onClick: () => void Sn("apply"),
        children: [
          "Apply to ",
          It.willChange.toLocaleString(),
          " ",
          It.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Rt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Fn(),
        children: "Preview again"
      },
      "again"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: pn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(si, { children: [
      U.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void Sn("retry"), children: "Retry failed" }),
      U.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Sn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(ff, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: Jt.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !Jt.length,
        onClick: () => {
          Ce(), o(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Zi, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: ae,
        className: "dq-batch-dialog",
        "aria-labelledby": `${we}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Ke();
        },
        onClose: () => {
          var I;
          me.current ? (I = ae.current) == null || I.showModal() : Ke();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Zi, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${we}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: k,
                onClick: Ke,
                children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Wf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: H,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${ni.find((I) => I.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  P && /* @__PURE__ */ a("p", { role: "status", children: P }),
                  x && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: x })
                ] }),
                l === "answers" ? $t() : l === "preview" ? xn() : rn(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: k, onClick: Rt, children: [
              /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Ce, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Ke, children: "Close" }),
            Wn()
          ] })
        ]
      }
    )
  ] });
}
const ml = "data-quality.description-collapsed.v1";
function Xf() {
  try {
    return localStorage.getItem(ml) === "true";
  } catch {
    return !1;
  }
}
function Zf({
  details: e,
  label: t
}) {
  const [n, r] = T(Xf), o = Nn(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(ml, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ u("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: o,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Wl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const ep = (e) => "";
function tp({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = ep,
  onFocus: c,
  onMore: l,
  onRefresh: f
}) {
  var h;
  const d = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
  return /* @__PURE__ */ u("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ u("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ u("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ u("p", { role: "status", children: [
        "Counting matching ",
        i.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: d.length ? `Most matching ${i.queue}s first` : `No performer has matching ${i.many}.` }) : null,
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: f,
          children: /* @__PURE__ */ a(ud, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: d.map((g) => {
      const w = `${g.count.toLocaleString()} matching ${g.count === 1 ? i.one : i.many}`, N = s(g.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${w}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === g.id ? "true" : void 0,
          disabled: o,
          onClick: () => c(g.id),
          children: [
            /* @__PURE__ */ a(Qr, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(Gn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    p && !t && !n && /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const np = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], rp = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function ap(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Ka(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function op(e, t) {
  const n = co(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ka(r, "or")}`,
    includesAll: `has ${Ka(r, "and")}`,
    excludes: `has none of ${Ka(r, "or")}`,
    excludesAll: `missing ${Ka(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function ip({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = at(), h = ta(e.conditionTagIds), g = op(e, h);
  Ct(() => {
    const y = f.current;
    if (!i || !y) return;
    const k = () => l(ap(y));
    k(), window.addEventListener("resize", k);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), x = [y, y.closest(".dq-review-header-trail"), y.closest("header")];
    for (const B of x) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", k), O == null || O.disconnect();
    };
  }, [i]), ee(() => {
    var k, O;
    if (!i) return;
    const y = (k = d.current) == null ? void 0 : k.querySelector('[aria-pressed="true"]');
    y && !y.disabled ? y.focus() : (O = d.current) == null || O.focus();
  }, [i]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var y;
      return (y = f.current) == null ? void 0 : y.focus();
    });
  }, N = (y) => {
    if (!(y.target instanceof Element && y.target.closest('[role="dialog"]') !== d.current || y.defaultPrevented || fn(y))) {
      if (y.key === "Escape")
        y.preventDefault(), w();
      else if (y.key === "Tab" && d.current) {
        const O = [...d.current.querySelectorAll(rp)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
          (D, P) => D.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const x = O[0], B = O[O.length - 1], C = document.activeElement;
        y.shiftKey && (C === x || C === d.current) ? (y.preventDefault(), B.focus()) : !y.shiftKey && C === B && (y.preventDefault(), x.focus());
      }
    }
  }, v = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ u("div", { className: "dq-scope", children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        "aria-controls": i ? p : void 0,
        title: g,
        onClick: () => i ? w() : s(!0),
        children: [
          /* @__PURE__ */ a(ec, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(li, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: w }),
      /* @__PURE__ */ u(
        "div",
        {
          ref: d,
          id: p,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: c ? {
            top: c.top,
            left: c.left,
            width: c.width,
            maxHeight: c.maxHeight
          } : void 0,
          onKeyDown: N,
          children: [
            /* @__PURE__ */ u("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: np.map(({ mode: y, label: k }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === y,
                  onClick: () => e.targetMode !== y && r({ targetMode: y }),
                  children: k
                },
                y
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                sr,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (y) => r({ performerIds: y }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ u("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ a("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ a(
                  va,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: ci,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (y) => r({ performerFilter: y })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ a(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (y) => r({ condition: y.target.value }),
                  children: fi.map((y) => /* @__PURE__ */ a("option", { value: y, children: ui[y] }, y))
                }
              ),
              v && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a(
                  sr,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (y) => r({ conditionTagIds: y }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ u("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ a(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (y) => r({ includeSubtags: y.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  Na(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ a(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (y) => r({ hideConfirmedAbsent: y.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ a("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: w, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Ha(e) {
  const {
    page: t,
    perPage: n,
    sort: r,
    direction: o,
    sorts: i,
    seed: s,
    ...c
  } = e.view.filter, {
    performerFlags: l,
    flagPerformerTagIds: f,
    ...d
  } = e.occurrence;
  return JSON.stringify([
    e.entityType,
    c,
    e.view.objectFilter,
    e.view.searchMode,
    d
  ]);
}
function sp(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function cp(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Hd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await ve(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            zn({
              findFilter: {
                page: l,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: c,
              filterExpression: s
            })
          )
        }
      );
      if (i.push(...f.items.map(r)), l * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return i.sort((s, c) => c.total - s.total || s.id - c.id);
}
const lp = 3e3, Is = 250;
async function dp(e, t, n, r) {
  const o = ho(e, t);
  if (await wi(o, o.view.filter, n) > lp) return null;
  const { sorts: i, seed: s, ...c } = e.view.filter, l = {
    ...e,
    view: {
      ...e.view,
      filter: { ...c, perPage: Is, sort: "id", direction: "asc" }
    }
  }, f = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    n.throwIfAborted();
    const p = await Di(l, t, d, n);
    for (const h of p.items)
      f.set(h.performer.id, (f.get(h.performer.id) ?? 0) + 1);
    if (r(f), d * Is >= p.totalCount) return f;
  }
}
function gl(e, t, n) {
  const r = ho(e, [t]);
  return wi(r, r.view.filter, n);
}
function bl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function ri(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function up(e, t, n, r, o = {}) {
  const i = Ha(e), s = sp(e), c = sl(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await cp(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = l;
  if (l.cursor === 0 && !l.ranked.length && f.length > 1) {
    const w = new Map(f.map((y) => [y.id, y])), N = (y) => [...y].flatMap(([k, O]) => {
      const x = w.get(k);
      return x && O > 0 ? [{ ...x, count: O }] : [];
    }).sort((k, O) => O.count - k.count || k.name.localeCompare(O.name)), v = await dp(
      e,
      co(e.occurrence) ? null : f.map((y) => y.id),
      r,
      (y) => {
        var k;
        return (k = o.onProgress) == null ? void 0 : k.call(o, { ...l, ranked: N(y), limit: n, complete: !1, partial: !0 });
      }
    );
    if (v)
      return { ...l, cursor: f.length, ranked: N(v), limit: n, complete: !0 };
  }
  const d = [...l.ranked];
  let p = l.cursor, h = !1;
  const g = (w) => ({
    ...l,
    cursor: p,
    ranked: [...d],
    limit: n,
    complete: !w && ri(f, p, d, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var w;
        for (; !h && !ri(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await gl(e, N.id, r);
          v > 0 && bl(d, { ...N, count: v }), (w = o.onProgress) == null || w.call(o, g(!0));
        }
      })
    );
  } catch (w) {
    throw h = !0, w;
  }
  return r.throwIfAborted(), g(!1);
}
function fp(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && bl(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: ri(e.candidates, e.cursor, o, e.limit)
  };
}
const ai = /* @__PURE__ */ new Map();
function pp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function yl(e, t) {
  const n = pp(t);
  return ai.set(e, n), n;
}
function hp(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || ai.has(e)) return;
    const r = new AbortController();
    return ve(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = yl(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return ai.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Fo = { exports: {} }, $s;
function mp() {
  return $s || ($s = 1, (function(e) {
    var t = (function() {
      var n = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", i = {};
      function s(l, f) {
        if (!i[l]) {
          i[l] = {};
          for (var d = 0; d < l.length; d++)
            i[l][l.charAt(d)] = d;
        }
        return i[l][f];
      }
      var c = {
        compressToBase64: function(l) {
          if (l == null) return "";
          var f = c._compress(l, 6, function(d) {
            return r.charAt(d);
          });
          switch (f.length % 4) {
            // To produce valid Base64
            default:
            // When could this happen ?
            case 0:
              return f;
            case 1:
              return f + "===";
            case 2:
              return f + "==";
            case 3:
              return f + "=";
          }
        },
        decompressFromBase64: function(l) {
          return l == null ? "" : l == "" ? null : c._decompress(l.length, 32, function(f) {
            return s(r, l.charAt(f));
          });
        },
        compressToUTF16: function(l) {
          return l == null ? "" : c._compress(l, 15, function(f) {
            return n(f + 32);
          }) + " ";
        },
        decompressFromUTF16: function(l) {
          return l == null ? "" : l == "" ? null : c._decompress(l.length, 16384, function(f) {
            return l.charCodeAt(f) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(l) {
          for (var f = c.compress(l), d = new Uint8Array(f.length * 2), p = 0, h = f.length; p < h; p++) {
            var g = f.charCodeAt(p);
            d[p * 2] = g >>> 8, d[p * 2 + 1] = g % 256;
          }
          return d;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(l) {
          if (l == null)
            return c.decompress(l);
          for (var f = new Array(l.length / 2), d = 0, p = f.length; d < p; d++)
            f[d] = l[d * 2] * 256 + l[d * 2 + 1];
          var h = [];
          return f.forEach(function(g) {
            h.push(n(g));
          }), c.decompress(h.join(""));
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(l) {
          return l == null ? "" : c._compress(l, 6, function(f) {
            return o.charAt(f);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(l) {
          return l == null ? "" : l == "" ? null : (l = l.replace(/ /g, "+"), c._decompress(l.length, 32, function(f) {
            return s(o, l.charAt(f));
          }));
        },
        compress: function(l) {
          return c._compress(l, 16, function(f) {
            return n(f);
          });
        },
        _compress: function(l, f, d) {
          if (l == null) return "";
          var p, h, g = {}, w = {}, N = "", v = "", y = "", k = 2, O = 3, x = 2, B = [], C = 0, D = 0, P;
          for (P = 0; P < l.length; P += 1)
            if (N = l.charAt(P), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, w[N] = !0), v = y + N, Object.prototype.hasOwnProperty.call(g, v))
              y = v;
            else {
              if (Object.prototype.hasOwnProperty.call(w, y)) {
                if (y.charCodeAt(0) < 256) {
                  for (p = 0; p < x; p++)
                    C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                  for (h = y.charCodeAt(0), p = 0; p < 8; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < x; p++)
                    C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                  for (h = y.charCodeAt(0), p = 0; p < 16; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                }
                k--, k == 0 && (k = Math.pow(2, x), x++), delete w[y];
              } else
                for (h = g[y], p = 0; p < x; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              k--, k == 0 && (k = Math.pow(2, x), x++), g[v] = O++, y = String(N);
            }
          if (y !== "") {
            if (Object.prototype.hasOwnProperty.call(w, y)) {
              if (y.charCodeAt(0) < 256) {
                for (p = 0; p < x; p++)
                  C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                for (h = y.charCodeAt(0), p = 0; p < 8; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < x; p++)
                  C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                for (h = y.charCodeAt(0), p = 0; p < 16; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              }
              k--, k == 0 && (k = Math.pow(2, x), x++), delete w[y];
            } else
              for (h = g[y], p = 0; p < x; p++)
                C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
            k--, k == 0 && (k = Math.pow(2, x), x++);
          }
          for (h = 2, p = 0; p < x; p++)
            C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
          for (; ; )
            if (C = C << 1, D == f - 1) {
              B.push(d(C));
              break;
            } else D++;
          return B.join("");
        },
        decompress: function(l) {
          return l == null ? "" : l == "" ? null : c._decompress(l.length, 32768, function(f) {
            return l.charCodeAt(f);
          });
        },
        _decompress: function(l, f, d) {
          var p = [], h = 4, g = 4, w = 3, N = "", v = [], y, k, O, x, B, C, D, P = { val: d(0), position: f, index: 1 };
          for (y = 0; y < 3; y += 1)
            p[y] = y;
          for (O = 0, B = Math.pow(2, 2), C = 1; C != B; )
            x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 1:
              for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 2:
              return "";
          }
          for (p[3] = D, k = D, v.push(D); ; ) {
            if (P.index > l)
              return "";
            for (O = 0, B = Math.pow(2, w), C = 1; C != B; )
              x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
            switch (D = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(O), D = g - 1, h--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (x > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(O), D = g - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, w), w++), p[D])
              N = p[D];
            else if (D === g)
              N = k + k.charAt(0);
            else
              return null;
            v.push(N), p[g++] = k + N.charAt(0), h--, k = N, h == 0 && (h = Math.pow(2, w), w++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Fo)), Fo.exports;
}
var wl = mp();
function cr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => cr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && cr(n[s], r[s])
  );
}
function gp(e) {
  var c, l, f;
  const [t, n] = T({}), [r, o] = T(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await fo([p])]
      )
    ).then((p) => {
      d && n(Object.fromEntries(p));
    }).catch(() => {
      d && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      d = !1;
    };
  }, [s]), { ids: t, error: r };
}
function vl(e, t, n) {
  const r = t == null ? void 0 : t.presentation, o = (r == null ? void 0 : r.annotations) ?? [], i = (r == null ? void 0 : r.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: o.includes("date") ? e.date : void 0,
    studioId: o.includes("studio") ? e.studioId : void 0,
    studioName: o.includes("studio") ? e.studioName : void 0,
    performers: o.includes("performers") ? e.performers : [],
    tags: o.includes("tags") && i.length > 0 ? (e.tags ?? []).filter(
      (s) => i.some(
        (c) => {
          var l;
          return c !== s.id && ((l = n[c]) == null ? void 0 : l.includes(s.id));
        }
      )
    ) : []
  };
}
function bp(e, t, n) {
  var s;
  const r = vl(e, t, n), o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [];
  return {
    performers: i.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: i.includes("tags") && ((s = o == null ? void 0 : o.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function yp({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: o,
  onToggle: i
}) {
  var w, N;
  const s = ((w = t.presentation) == null ? void 0 : w.binParents) ?? [], c = new Set(
    s.flatMap((v) => (r[v] ?? []).filter((y) => y !== v))
  ), l = s.every((v) => r[v]), f = Lr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!l || c.has(v))
  ), d = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const y of v.tags ?? [])
      if (c.has(y.id)) {
        const k = d.get(y.id) ?? { name: y.name, count: 0 };
        k.count++, d.set(y.id, k);
      }
  const p = f.filter((v) => !d.has(v)), h = ta(p);
  for (const v of p)
    d.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const g = [...d].sort((v, y) => v[1].name.localeCompare(y[1].name));
  return /* @__PURE__ */ u("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    g.map(([v, y]) => {
      const k = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": k,
          title: k ? `Show every video again, not only ${y.name}` : `Show only videos tagged ${y.name}`,
          disabled: o,
          onClick: () => i(v),
          children: [
            k && /* @__PURE__ */ a(Zr, { "aria-hidden": "true" }),
            y.name,
            " ",
            /* @__PURE__ */ a("span", { className: "dq-bin-count", children: y.count })
          ]
        },
        v
      );
    }),
    !g.length && /* @__PURE__ */ a("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function wp({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: o,
  countsPaused: i,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Lr(e.view.objectFilter, t, c).bins, f = vp(e, t, n, i);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const g of c) {
    const w = ((h = g.group) == null ? void 0 : h.trim()) ?? "";
    d.set(w, [...d.get(w) ?? [], g]);
  }
  return /* @__PURE__ */ a(ge, { children: [...d].map(([g, w]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": g ? `${g} bins` : "Filter bins",
      children: [
        g && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: g }),
        w.map((N) => {
          const v = l.includes(N.key), y = v ? r : f[N.key];
          return /* @__PURE__ */ u(
            "button",
            {
              className: "dq-bin",
              type: "button",
              "aria-pressed": v,
              title: v ? `Show every video again, not only ${N.label}` : `Show only videos matching ${N.label}`,
              disabled: o,
              onClick: () => s(N.key),
              children: [
                v && /* @__PURE__ */ a(Zr, { "aria-hidden": "true" }),
                N.label,
                " ",
                /* @__PURE__ */ a("span", { className: "dq-bin-count", children: y ?? "…" })
              ]
            },
            N.key
          );
        })
      ]
    },
    g
  )) });
}
function vp(e, t, n, r) {
  var d;
  const [o, i] = T({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = $(null);
  return ee(() => {
    var w, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), g = Lr(
      e.view.objectFilter,
      t,
      (w = e.presentation) == null ? void 0 : w.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (p++, wi(ql(e, v.key, t), n, h.signal).then((y) => {
        h.signal.aborted || i((k) => ({ ...k, [v.key]: y }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [l, r]), o;
}
function $r(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Np(e) {
  if (!$r(e) || Object.keys(e).length !== 1 || !$r(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !$r(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function Nl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function qp(e, t) {
  const n = t.find(
    (r) => cr(e, Nl(r.filter))
  );
  return n ? n.key : Np(e);
}
function Lr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && cr(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!$r(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = qp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !$r(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && $r(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && $r(g.group) ? d = g.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function ql(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = Lr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (i.includes(t) ? i.filter((d) => d !== t) : [...i.filter((d) => !c || s(d) !== c), t]).reduce(Sp, { ...e, view: { ...e.view, objectFilter: o } });
}
function Sp(e, t) {
  var i, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (i = e.presentation) == null ? void 0 : i.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = Nl(c.filter);
  }
  const { _filterExpression: r, ...o } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(o).length ? [{ filter: o }] : [],
            ...r ? [{ group: r }] : [],
            n
          ]
        }
      }
    }
  };
}
const mo = [
  "q",
  "page",
  "perPage",
  "sort",
  "direction",
  "sorts",
  "seed",
  "filters",
  "searchMode",
  "performerScope",
  "performer",
  "startFrom"
], kp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function xr(e) {
  const t = Ae(e) ? e.occurrence : void 0;
  return {
    filter: tn({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, _e(e)),
    objectFilter: structuredClone(e.view.objectFilter),
    searchMode: e.view.searchMode,
    startFrom: e.view.startFrom ?? "end",
    ...t ? {
      performerScope: {
        targetMode: t.targetMode,
        performerIds: [...t.performerIds],
        performerFilter: structuredClone(t.performerFilter),
        condition: t.condition,
        conditionTagIds: [...t.conditionTagIds],
        includeSubtags: t.includeSubtags ?? !0,
        hideConfirmedAbsent: t.hideConfirmedAbsent ?? !0
      }
    } : {}
  };
}
function Rs(e) {
  return wl.compressToEncodedURIComponent(JSON.stringify(e));
}
function Os(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : wl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function oi(e, t) {
  let n;
  if (Ae(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!mo.some((c) => c !== "performer" && t.has(c))) {
    const c = xr(e);
    return {
      query: n ? { ...c, performerFocus: n } : c,
      startAtEnd: c.startFrom === "end"
    };
  }
  const o = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (o.seed = Number(t.get("seed"))), t.get("sorts")) {
    const c = t.get("sorts").split(",").map((l) => {
      const f = l.lastIndexOf(":");
      return { key: l.slice(0, f), direction: l.slice(f + 1) };
    });
    if (c.some((l) => !l.key || !["asc", "desc"].includes(l.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = c, o.sort = c[0].key, o.direction = c[0].direction;
  }
  let i;
  if (Ae(e) && (i = {
    ...kp,
    ...Os(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !fi.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: tn(o, _e(e)),
      objectFilter: Os(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const Ms = { dataQualityOpenedFromList: !0 };
function Sl() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function kl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...Ms }, "", e) : window.history.replaceState(Sl() ? { ...Ms } : null, "", e);
}
function wa(e, t) {
  const n = new URLSearchParams(window.location.search);
  mo.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", Rs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", Rs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), kl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function Mn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ae(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Mr(e) {
  const t = e;
  return Mn(t, xr(t));
}
function Fs(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !cr(
    JSON.parse(rr(Mn(e, t))),
    JSON.parse(rr(Mn(e, xr(e))))
  );
}
function Ui(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Le(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function El(e, t) {
  if (Le(e) !== "video") return e;
  const { base: n, bins: r } = Lr(
    e.view.objectFilter,
    t.view.objectFilter,
    Ui(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function za(e, t) {
  if (Le(e) !== "video") return t;
  const { base: n, bins: r } = Lr(
    t.objectFilter,
    e.view.objectFilter,
    Ui(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function xs(e, t) {
  return !t || !Ae(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function xo(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const un = (e) => e instanceof Error ? e.message : "Request failed.", Ep = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Po = 50, Ap = [], Ps = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Cp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Zl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Ws(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Tp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(nc, {}) : /* @__PURE__ */ a(so, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Bo(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function Ip({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: o,
  actionTagIds: i,
  label: s
}) {
  const c = !!n && !r, l = Ii(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ra(
    qe(() => [...i, ...d ?? []], [i, d])
  ), h = (J) => p[J] ?? { id: J, name: p[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => Or(J.map(h)), w = f && e ? qi(f, e, o) : null, N = e ? cu(e) : [], v = new Set(N.map((J) => J.id)), y = new Set(w == null ? void 0 : w.removed), k = new Set(w == null ? void 0 : w.markedAbsent), O = new Set(w == null ? void 0 : w.absenceCleared), x = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((w == null ? void 0 : w.added) ?? []), C = g(((w == null ? void 0 : w.markedAbsent) ?? []).filter((J) => !v.has(J))), D = n ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
          O.has(J.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(nn, { tag: J })
          ] }) : /* @__PURE__ */ a(nn, { tag: J })
        ]
      },
      J.id
    )) })
  ] }), ne = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(ge, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (J) => y.has(J.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(nn, { tag: J })
            ] }),
            k.has(J.id) && x
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(nn, { tag: J }) }, J.id)
        ),
        B.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(nn, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(nn, { tag: J }) }),
          x
        ] }, `absent-${J.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && P
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(ge, { children: [
    !c && ne,
    n,
    n && P && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: P })
  ] });
}
function $p({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    ki(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Rp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: i = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: l,
  onStayOnTapChange: f
}) {
  var wn;
  const d = _e(e), p = Vn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || h;
  }, w = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = oi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = un(m), N.current = { query: xr(e), startAtEnd: !1 };
    }
  const [y, k] = T(null), [O, x] = T(""), B = $(null), C = $(null), D = $(null), P = $(null), [ne, J] = T(!!v.current), j = $(0), [z, F] = T(N.current.query), _ = $(z);
  _.current = z;
  const [L, X] = T(0), Q = $(N.current.startAtEnd), [ae, H] = T([]), [S, ce] = T(null), A = $(null), [Z, ue] = T(null), [me, K] = T(0), we = qe(() => {
    var W;
    if (!S) return null;
    const m = ae.findIndex((le) => le.key === S.key), E = ((W = A.current) == null ? void 0 : W.key) === S.key ? A.current : null;
    return (m >= 0 ? ae.slice(m + 1) : E ? ae.filter((le) => !E.before.includes(le.key)) : []).find((le) => le.media.id !== S.media.id) ?? null;
  }, [S, ae]), [Ee, ke] = T(0), [Ne, Je] = T(!1), [pe, ot] = T(!1), Ye = $(!1), Dt = $(0), Jt = $(!1), Ht = $(null), nt = $(!0), Be = $(null);
  ee(() => (nt.current = !0, () => {
    nt.current = !1;
  }), []);
  const [Ge, Xe] = T(v.current), [ur, gt] = T(""), [Jn, Ze] = T(""), [Ce, Ke] = T(null), [ze, Rt] = T(!1), [fr, pn] = T([]), Ot = $([]), bt = $(null), Fn = $(null), Sn = $(null);
  ee(() => {
    var m, E;
    ze && ((E = (m = Sn.current) == null ? void 0 : m.querySelector("input")) == null || E.focus());
  }, [ze]);
  const he = $(null);
  ee(() => {
    if (pe) return;
    const m = he.current;
    he.current = null;
    const E = document.activeElement;
    m != null && m.isConnected && (!E || E === document.body) && m.focus();
  }, [pe]);
  const [Tt, Qt] = T(!1), [hn, kn] = T(!1), Ve = Oa(), [It, fe] = T(!1), U = l ?? It, Fe = f ?? fe;
  ee(() => {
    if (Ne || Tt || !Fn.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(Ps)) return;
      const E = Fn.current;
      Fn.current = null;
      const M = document.activeElement;
      M && M !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [Ne, Tt, L]);
  const [yt, En] = T([]), [se, Mt] = T({}), _t = $(null), [Hn, An] = T({});
  ee(() => {
    let m = !0;
    return Promise.all(
      Fi(z.objectFilter).map(
        async (E) => [
          String(E),
          (await ve(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      m && An(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [z.objectFilter]);
  const Cn = qe(
    () => xi(z.objectFilter, Hn),
    [Hn, z.objectFilter]
  ), mn = $(0), je = $(e);
  je.current = e;
  const He = y ?? e, st = qe(
    () => Mn(He, z),
    [He, z]
  ), $t = qe(
    () => xs(st, z.performerFocus),
    [st, z.performerFocus]
  ), Qn = $($t);
  Qn.current = $t;
  const xn = $(st);
  xn.current = st;
  const [rn, Wn] = T("items"), [I, G] = T(null), oe = $(null), ie = $("");
  function de(m) {
    const E = typeof m == "function" ? m(oe.current) : m;
    oe.current = E, G(E);
  }
  const [Re, Te] = T(!1), [Ie, Ft] = T(null), ye = $(null), ct = Ae(st) ? Ha(st) : "", [Se, Pn] = T(0), [Oe, pr] = T(null);
  ee(() => () => {
    var m;
    return (m = ye.current) == null ? void 0 : m.controller.abort();
  }, []), ee(() => {
    const m = ye.current;
    !m || m.signature === ct || (m.controller.abort(), ye.current = null, Te(!1));
  }, [ct]), ee(() => {
    var M;
    const m = oe.current;
    if (rn !== "performers" || !ct || ((M = ye.current) == null ? void 0 : M.signature) === ct || ie.current === ct || (m == null ? void 0 : m.signature) === ct && m.complete)
      return;
    const E = (m == null ? void 0 : m.signature) === ct ? m : null;
    br(m, (E == null ? void 0 : E.limit) ?? Po);
  }, [rn, ct, I, Ie, Re]);
  const Wt = z.performerFocus;
  ee(() => {
    if (!Wt) {
      pr(null);
      return;
    }
    let m = !0;
    return ve(`/api/performers/${Wt}`).then((E) => {
      const M = yl(Wt, E.tags);
      m && pr({ id: Wt, name: E.name, tags: M });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [Wt]);
  const na = JSON.stringify(
    Ae(st) ? ic(st.occurrence) : []
  ), jt = qe(() => JSON.parse(na), [na]), ra = qe(() => fu(jt), [jt]), xt = Ec(ra), an = Ra(ra), hr = (m) => {
    var E;
    return ((E = an[m]) == null ? void 0 : E.name) ?? (an[m] === null ? "Unavailable tag" : "…");
  }, Tn = (m) => ({
    name: hr(m),
    tagIds: xt.get(m) ?? [m],
    resolved: xt.has(m)
  }), mr = hl(
    Ae(st) ? st : null,
    Wt ?? null,
    Se
  ), pt = Fs(e, z), wt = Fs(e, za(e, z)), Qe = pe || Ne || ze, it = Number(z.filter.page);
  function lt(m, E = !1) {
    Ye.current || (Dt.current++, gt(""), v.current = "", Q.current = E, _.current = m, F(m), ke(0), Je(!0), E || wa(e.id, m), X((M) => M + 1));
  }
  function vt() {
    if (Ye.current = !1, ot(!1), nt.current && Be.current) {
      const m = Be.current;
      Be.current = null, lt(m.query, m.startAtEnd);
    }
  }
  ee(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = oi(
            je.current,
            new URLSearchParams(window.location.search)
          );
          Ye.current ? Be.current = E : lt(E.query, E.startAtEnd);
        } catch (E) {
          Xe(un(E));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), ee(() => (r(pe || Ne || ze || !!y), () => r(!1)), [pe, Ne, ze, !!y, r]);
  async function Yn(m, E, M) {
    if (Ae(m)) {
      const le = await Di(
        m,
        _t.current,
        E,
        M
      );
      return {
        items: le.items.map((be) => ({
          key: be.key,
          media: be.media,
          occurrence: be
        })),
        totalCount: le.totalCount
      };
    }
    const W = await Jr(
      m,
      { ...m.view.filter, page: E },
      M
    );
    return {
      items: W.items.map((le) => ({ key: String(le.id), media: le })),
      totalCount: W.totalCount
    };
  }
  function Ln(m, E, M, W = !1, le = !1) {
    if (!nt.current || Be.current) return;
    J(!0), H(
      le ? m.items : xo(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), Ut(M, W);
    const be = {
      ..._.current,
      filter: { ..._.current.filter, page: E }
    };
    _.current = be, F(be), wa(e.id, be);
  }
  function Ut(m, E = !1) {
    Dt.current++, (m == null ? void 0 : m.key) !== (S == null ? void 0 : S.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (S == null ? void 0 : S.media.id) && ue(E && m ? m.media.id : null), ce(m);
  }
  ee(() => {
    if (v.current) return;
    const m = new AbortController();
    P.current = m;
    const E = ++mn.current;
    return Je(!0), Xe(""), Ze(""), A.current = null, ue(null), ce(null), H([]), Rt(!1), (async () => {
      const M = xs(
        Mn(je.current, _.current),
        _.current.performerFocus
      );
      _t.current = Ae(M) ? await Pi(M, m.signal) : null;
      let W = Number(M.view.filter.page), le = await Yn(M, W, m.signal);
      const be = Math.max(
        1,
        Math.ceil(le.totalCount / Number(M.view.filter.perPage))
      );
      (Q.current || W > be) && (W = be, le = await Yn(M, W, m.signal)), Q.current = !1;
      const et = M.view.startFrom === "end" ? -1 : 1;
      for (; Ae(M) && !le.items.length && W + et >= 1 && W + et <= be && !m.signal.aborted; )
        W += et, le = await Yn(M, W, m.signal);
      if (E !== mn.current || m.signal.aborted) return;
      const Pt = xo(le.items, M.view.startFrom === "end");
      Ln(le, W, Pt[0] ?? null);
    })().catch((M) => {
      !m.signal.aborted && E === mn.current && Xe(un(M));
    }).finally(() => {
      !m.signal.aborted && E === mn.current && (J(!0), Je(!1));
    }), () => {
      m.abort(), mn.current++;
    };
  }, [L, e.id]);
  const gn = $(null);
  ee(() => {
    if ((S == null ? void 0 : S.key) !== gn.current && Ke(null), gn.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let m = !0;
    return qn(d, S).then((E) => {
      m && (Ke(E), En(
        Ae(e) ? E.ids.filter((M) => e.occurrence.tagIds.includes(M)) : []
      ));
    }).catch((E) => {
      m && Xe(`Could not load current tags. ${un(E)}`);
    }), () => {
      m = !1;
    };
  }, [S]), ee(() => {
    if (!Ae(e) || e.actions.length)
      return;
    let m = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (E) => [
          E,
          (await ve(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      m && Mt(Object.fromEntries(E));
    }).catch((E) => {
      m && Xe(un(E));
    }), () => {
      m = !1;
    };
  }, [e]);
  function Dr(m, E = A.current) {
    const M = ae.findIndex((Ue) => Ue.key === m.key), W = z.startFrom === "end" ? -1 : 1, le = (E == null ? void 0 : E.key) === m.key, be = le ? E : { key: m.key, page: it, before: ae.slice(0, M + 1).map((Ue) => Ue.key), after: ae.slice(M + 1).map((Ue) => Ue.key) }, et = new Set(be.after), Pt = new Set(be.before), dn = ae.find((Ue) => et.has(Ue.key) || (W === 1 || it < be.page) && le && !Pt.has(Ue.key));
    return { direction: W, cursor: be, remainingKeys: et, visitedKeys: Pt, nextLoaded: dn };
  }
  async function Xn(m = !1, E = !1, M = !1, W = () => !0, le = A.current) {
    if (!S) return;
    const { direction: be, cursor: et, remainingKeys: Pt, visitedKeys: dn, nextLoaded: Ue } = Dr(S, le);
    if (!m && Ue) {
      Ut(Ue, M);
      return;
    }
    const jn = m ? dn : new Set(ae.map((Kt) => Kt.key));
    let qt = be === -1 && !m ? Math.max(1, it - 1) : it;
    for (; nt.current && !Be.current; ) {
      let Kt = await Yn($t, qt);
      const rt = Math.max(
        1,
        Math.ceil(Kt.totalCount / Number(z.filter.perPage))
      );
      qt > rt && (qt = rt, Kt = await Yn($t, qt));
      const St = xo(Kt.items, be === -1), On = new Map(St.map((zt) => [zt.key, zt])), kr = m ? et.after.flatMap((zt) => {
        const La = On.get(zt);
        return La ? [La] : [];
      }) : [], Er = new Set(kr.map((zt) => zt.key)), Ar = m ? {
        ...Kt,
        items: [
          ...kr,
          ...St.filter(
            (zt) => zt.key !== S.key && !Er.has(zt.key)
          )
        ]
      } : { ...Kt, items: St };
      if (!W()) return;
      if (E) {
        A.current = et, Ln(Ar, qt, S, !1, !0);
        return;
      }
      const ua = be === -1 && it === 1 && !m ? void 0 : Ar.items.find(
        (zt) => !jn.has(zt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && be === -1 && qt === et.page) || Pt.has(zt.key))
      );
      if (ua || (be === -1 ? qt <= 1 : qt >= rt)) {
        Ln(
          Ar,
          qt,
          ua ?? null,
          M,
          !0
        ), ua || Ze(
          Kt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      qt += be;
    }
  }
  async function on(m, E = !1, M = !1, W = !1) {
    var Kt;
    if (Jt.current && m && S && !M && !W && !y && !ze) {
      Ht.current = { action: m, stay: E, key: S.key };
      return;
    }
    if (y || !S || Ye.current || Ne || ze && !M)
      return;
    const le = M || W || !!(m != null && m.steps.length);
    if (le && (!t || !Ce) || m && ir(m) && !n) return;
    const be = !E && !M && !W && le && m !== void 0 && Ce !== null && ls(e) && Vo(zo(e.actions, du(m, Ce, Bt))).length > 0, et = M && ((Kt = Sn.current) != null && Kt.contains(document.activeElement)) ? document.activeElement : null;
    Ye.current = !0, ot(!0), Xe(""), Ze(""), Jt.current = !0;
    const Pt = A.current, dn = le && !E && !be ? Dr(S).nextLoaded ?? null : null;
    dn && (H(
      (rt) => rt.filter((St) => St.key !== S.key)
    ), Ut(dn, !0));
    let Ue = !1, jn = !1, qt = [];
    try {
      if (le) {
        const rt = await qn(d, S);
        if (m)
          await Pf($t, S, m);
        else {
          const On = W && Ae(e) ? e.occurrence.tagIds.filter((Ar) => rt.ids.includes(Ar)) : Ot.current, Er = Xr(On, W ? yt : fr);
          await _i($t, S, Er);
        }
        const St = await qn(d, S);
        dn || Ke(St), jn = !0, Rt(!1), be && (qt = Vo(zo(e.actions, St))), Ze(
          qt.length ? `Tags saved. Staying until answered: ${qt.map((On) => On.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (De(S.occurrence.performer.id), Pn((On) => On + 1));
      }
      if (!nt.current || Be.current) return;
      if (le)
        if (dn) {
          const rt = Dt.current;
          Ue = !0, Jt.current = !1, vt(), Xn(!0, !1, !0, () => Dt.current === rt && !Ye.current, Pt).catch((St) => {
            Dt.current === rt && Xe(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${un(St)}`);
          });
        } else qt.length || await Xn(!0, E, !E);
      else E || await Xn();
      E && M && requestAnimationFrame(() => {
        var rt;
        return (rt = bt.current) == null ? void 0 : rt.focus();
      });
    } catch (rt) {
      if (Xe(
        jn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${un(rt)}` : le ? `Saving stopped. ${Ep(un(rt))}${M || W ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${un(rt)}`
      ), le && !jn) {
        he.current = et, dn && (H(ae), ue(null), K((St) => St + 1), ce(S), A.current = Pt);
        try {
          Ke(await qn(d, S));
        } catch {
          Ke(null), Xe(
            (St) => `${St} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ue || (Jt.current = !1, vt());
    }
  }
  ee(() => {
    const m = Ht.current;
    if (!(!m || pe || Ye.current)) {
      if ((S == null ? void 0 : S.key) !== m.key || Ge) {
        Ht.current = null;
        return;
      }
      Ce && (Ht.current = null, on(m.action, m.stay));
    }
  }, [pe, Ce, S, Ge]);
  const $e = !ze && !y && !Tt && !hn && (S != null || Ne || pe);
  Ei({
    surface: "local",
    enabled: $e,
    actions: e.actions,
    onAction: (m, E) => {
      const M = e.actions[m];
      M && on(M, E);
    },
    onFind: () => kn(!0)
  });
  const gr = (m) => pe || Ne || !Ce || !!y || !t && m.steps.length > 0 || !n && ir(m);
  function bn() {
    !o || y || Ye.current || ze || (D.current = document.activeElement, C.current = {
      error: Ge,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(_.current),
      items: ae,
      current: S,
      total: Ee,
      targets: _t.current,
      stayedCursor: A.current
    }, Dt.current++, k(structuredClone(e)), x(""), Ze(""), Xe(""));
  }
  ee(() => {
    if (!i) {
      j.current = 0;
      return;
    }
    i !== j.current && ne && !Ne && (j.current = i, bn(), s == null || s());
  }, [i, Ne, ne]);
  function aa() {
    k(null), x(""), requestAnimationFrame(() => {
      const m = D.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function Zn() {
    var E;
    const m = C.current;
    !m || pe || ((E = P.current) == null || E.abort(), mn.current++, _.current = m.query, F(m.query), H(m.items), ce(m.current), ke(m.total), _t.current = m.targets, A.current = m.stayedCursor, Je(!1), Xe(m.error), Ze(""), window.history.replaceState(window.history.state, "", m.url), aa());
  }
  async function go() {
    if (!y || !o || Ye.current) return;
    const m = Mn(
      { ...y, name: y.name.trim() },
      za(je.current, _.current)
    ), E = Sa(m);
    if (E) {
      x(E);
      return;
    }
    Ye.current = !0, ot(!0), x("");
    try {
      if (await o(m) === !1) throw new Error("Could not save review.");
      aa(), Ze("Review saved.");
    } catch (M) {
      x(fc(M));
    } finally {
      vt();
    }
  }
  async function oa() {
    if (!o || Ye.current) return;
    const m = za(je.current, _.current), E = Mn(je.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    Ye.current = !0, ot(!0), Xe(""), gt("");
    try {
      if (await o(E) === !1) throw new Error("Could not save review.");
      Ze("Queue saved to this review.");
    } catch (M) {
      gt("Could not save queue. " + un(M));
    } finally {
      vt();
    }
  }
  const dt = z.performerScope, sn = (m) => {
    const { performerFocus: E, ...M } = _.current, W = E && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    lt(
      {
        ...M,
        ...W ? { performerFocus: E } : {},
        filter: { ...M.filter, page: 1 },
        performerScope: { ...dt, ...m }
      },
      M.startFrom === "end"
    );
  };
  async function br(m, E) {
    var le;
    const M = xn.current;
    if (!Ae(M)) return;
    (le = ye.current) == null || le.controller.abort();
    const W = {
      signature: Ha(M),
      controller: new AbortController()
    };
    ye.current = W, ie.current = "", Te(!0), Ft(null);
    try {
      const be = await up(M, m, E, W.controller.signal, {
        onProgress: (et) => {
          ye.current === W && de(et);
        }
      });
      ye.current === W && de(be);
    } catch (be) {
      ye.current === W && !W.controller.signal.aborted && (ie.current = W.signature, Ft({ signature: W.signature, message: un(be) }));
    } finally {
      ye.current === W && (ye.current = null, Te(!1));
    }
  }
  function yn() {
    var m;
    (m = ye.current) == null || m.controller.abort(), ye.current = null, Te(!1), de((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function De(m) {
    var W;
    const E = xn.current;
    if (!Ae(E)) return;
    if (ye.current) {
      yn();
      return;
    }
    const M = Ha(E);
    if (!(((W = oe.current) == null ? void 0 : W.signature) !== M || oe.current.partial))
      try {
        const le = await gl(E, m);
        if (ye.current) {
          yn();
          return;
        }
        de(
          (be) => (be == null ? void 0 : be.signature) === M ? fp(be, m, le) : be
        );
      } catch {
        de(
          (le) => (le == null ? void 0 : le.signature) === M ? { ...le, partial: !0, complete: !1 } : le
        );
      }
  }
  const yr = z.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === z.performerFocus) : void 0, Nt = Oe && Oe.id === z.performerFocus ? { ...Oe, flags: Ir(jt, Oe.tags) } : yr ? { ...yr, flags: Ir(jt, yr.tags) } : null, _r = (m) => {
    if ((Oe == null ? void 0 : Oe.id) === m)
      return Ir(jt, Oe.tags);
    const E = I == null ? void 0 : I.candidates.find((M) => M.id === m);
    return E ? Ir(jt, E.tags) : void 0;
  }, cn = ((wn = S == null ? void 0 : S.occurrence) == null ? void 0 : wn.performer.id) ?? null, wr = cn === null ? void 0 : _r(cn), jr = hp(
    jt.length > 0 && cn !== null && cn !== z.performerFocus && wr === void 0 ? cn : null
  ), Ma = wr ?? (jr ? Ir(jt, jr) : []), Bt = kc(He.actions), Fa = mr.summary && z.performerFocus ? Si(ji(mr.summary, He.actions, Bt)) : [], Dn = ds(jt, (Nt == null ? void 0 : Nt.flags) ?? [], Tn), er = Ic(
    ds(jt, Ma, Tn),
    cn !== null && cn === z.performerFocus ? Fa : []
  ), bo = JSON.stringify(er), Ur = qe(() => er, [bo]), yo = JSON.stringify(Dn), xa = qe(() => Dn, [yo]), ia = (m) => wu(jt, m, hr);
  function sa(m) {
    if (Ye.current) return;
    const E = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    lt(E, E.startFrom === "end"), Wn("items");
  }
  function wo() {
    const { performerFocus: m, ...E } = _.current;
    lt(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const Gt = $(null);
  Gt.current ?? (Gt.current = _c());
  const vr = Gt.current, Nr = qe(
    () => He.actions.flatMap((m) => m.steps.flatMap((E) => E.tagIds)),
    [He.actions]
  ), _n = $(null);
  ee(() => {
    var et;
    const m = _n.current, E = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !E) return;
    const M = m.getBoundingClientRect(), W = E.getBoundingClientRect(), le = (et = E.nextElementSibling) == null ? void 0 : et.getBoundingClientRect(), be = le && le.bottom - W.top <= M.height ? Math.max(le.bottom, W.bottom) : W.bottom;
    W.top < M.top ? m.scrollTop -= M.top - W.top : be > M.bottom && (m.scrollTop += be - M.bottom);
  }, [S == null ? void 0 : S.key, rn]);
  const qr = $(null), ln = $(null);
  ee(() => {
    var M, W;
    const m = ln.current;
    if (!m) return;
    ln.current = null;
    const E = [...((M = qr.current) == null ? void 0 : M.querySelectorAll(".dq-partner")) ?? []];
    (W = E.find((le) => le.dataset.partnerKey === m) ?? E[0]) == null || W.focus();
  }, [S == null ? void 0 : S.key]);
  const In = pe || Ne || ze || !!y, $n = qe(
    () => y ? Mn(y, za(e, z)) : null,
    [y, e, z]
  ), Pa = qe(
    () => $n != null && Wr(Mr($n)) !== Wr(Mr(e)),
    [$n, e]
  );
  function vo() {
    S ? qn(d, S).then(Ke).catch((m) => Xe(un(m))) : lt(_.current);
  }
  const ca = Ge ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ge,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: pe, onClick: vo, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, la = pe || Ne || S != null && !Ce, da = Math.max(1, Number(z.filter.perPage) || 1), Sr = $(1);
  Ne || (Sr.current = Math.max(1, Math.ceil(Ee / da)));
  const Rn = Sr.current, Me = dt && S ? ae.filter(
    (m) => m.media.id === S.media.id && m.key !== S.key
  ) : [], No = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, Br = S ? Cp(S.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": dt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var W;
        const E = m.target instanceof Element ? m.target.closest("button") : null, M = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((W = E == null ? void 0 : E.textContent) == null ? void 0 : W.trim()) ?? "";
        E && !E.closest(Ps) && /^(Filters|Edit filter:|Edit criteria)/.test(M) && (Fn.current = E);
      },
      children: [
        /* @__PURE__ */ a(
          nl,
          {
            name: e.name,
            description: e.description,
            entityType: Le(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: In || !!(c != null && c.busy),
            onEdit: y ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : bn,
            editDisabled: !y && (In || !o || !!(c != null && c.busy)),
            editing: !!y,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: pe || ze, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  va,
                  {
                    filter: z.filter,
                    objectFilter: Cn,
                    criteriaDefinitions: d === "audio" ? Js : oo,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ee,
                    sortOptions: d === "audio" ? Yl : Hs,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      rl,
                      {
                        page: Math.min(Math.max(1, it || 1), Rn),
                        pages: Rn,
                        onPage: (m) => lt({
                          ..._.current,
                          filter: tn(
                            { ..._.current.filter, page: m },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (m) => {
                      (m.sort !== _.current.filter.sort || m.direction !== _.current.filter.direction) && (m = { ...m, sorts: void 0 }), lt(
                        {
                          ..._.current,
                          filter: tn(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      lt(
                        {
                          ..._.current,
                          objectFilter: ol(
                            m,
                            Hn,
                            _.current.objectFilter
                          ),
                          filter: { ..._.current.filter, page: 1 }
                        },
                        _.current.startFrom === "end"
                      );
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(ge, { children: [
              dt && /* @__PURE__ */ a(
                ip,
                {
                  scope: dt,
                  disabled: pe || ze,
                  editing: !!y,
                  onChange: sn,
                  onEditCriteria: () => Qt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                al,
                {
                  mode: "single",
                  disabled: In || !!c.busy,
                  onChange: () => {
                    var m;
                    return (m = c.onGrid) == null ? void 0 : m.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(ge, { children: [
              Ae($t) && t && /* @__PURE__ */ a(
                Yf,
                {
                  review: $t,
                  disabled: Qe || !!y,
                  performerAttention: z.performerFocus ? xa : void 0,
                  trees: Bt,
                  onOpen: () => {
                    Ye.current = !0, ot(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const E = _.current.performerFocus;
                      E ? De(E) : yn(), Pn((M) => M + 1), vt(), v.current || Je(!0), X((M) => M + 1);
                    } else vt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Ri,
                {
                  disabled: In,
                  items: c.moreItems({
                    onSelect: bn,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: z.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Qr,
                {
                  performer: {
                    id: z.performerFocus,
                    name: (Nt == null ? void 0 : Nt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (Nt == null ? void 0 : Nt.name) ?? `performer ${z.performerFocus}` })
              ] }),
              Nt != null && Nt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: ia(Nt.flags), children: [
                /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ia(Nt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Qe,
                  onClick: wo,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: pt,
            queueChange: !y && pt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: wt ? () => void oa() : void 0,
              saveDisabled: Qe || !o,
              onReset: () => {
                const m = xr(e);
                lt(m, m.startFrom === "end");
              },
              resetDisabled: Qe
            } : void 0,
            chipsEnd: y ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          y && $n && /* @__PURE__ */ a(
            tl,
            {
              drawerRef: B,
              draft: $n,
              onChange: (m) => k(m),
              direction: z.startFrom,
              onDirectionChange: (m) => lt({ ..._.current, startFrom: m }),
              tagGroups: Ap,
              trees: Bt,
              saving: pe,
              saveDisabled: Ne,
              error: O,
              dirty: Pa,
              criteriaChanged: wt,
              notices: ca && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: ca }),
              onSave: () => void go(),
              onCancel: Zn
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${d}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${p.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: No(S.media) }),
                        /* @__PURE__ */ a(ac, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Br && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Br })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, we].filter(Boolean).map((m) => {
                    var W, le, be, et, Pt;
                    const E = m, M = E.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: M ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": M ? void 0 : !0,
                        inert: M ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          Xl,
                          {
                            streamUrl: Go("audio", E.media.id),
                            format: ((W = E.media.files[0]) == null ? void 0 : W.format) ?? "",
                            title: g(E.media),
                            coverUrl: M ? Bo("audio", E.media) : void 0,
                            duration: ((le = E.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            autostart: M && Z === E.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Qs,
                          {
                            videoId: E.media.id,
                            streamUrl: Go("video", E.media.id),
                            posterUrl: M ? Bo("video", E.media) : void 0,
                            duration: ((be = E.media.files[0]) == null ? void 0 : be.duration) ?? 0,
                            format: (et = E.media.files[0]) == null ? void 0 : et.format,
                            audioCodec: (Pt = E.media.files[0]) == null ? void 0 : Pt.audioCodec,
                            extensionSurface: M ? "quick-view" : void 0,
                            autostart: M && Z === E.media.id,
                            keyboardShortcutsEnabled: M,
                            showAbLoop: M,
                            clip: E.media.parentVideoId != null ? {
                              start: E.media.clipStartSec ?? 0,
                              end: E.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${E.media.id}:${me}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ a(
                    Zf,
                    {
                      details: S.media.details,
                      label: p.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Ne ? "Loading review…" : Ee ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              He.actions.length > 0 ? /* @__PURE__ */ a(
                Mu,
                {
                  actions: He.actions,
                  isDisabled: (m) => ze || gr(m),
                  busy: la,
                  tags: Ce,
                  trees: Bt,
                  preview: vr,
                  onApply: (m, E) => void on(m, E),
                  onFind: () => kn(!0),
                  findDisabled: ze || !!y,
                  paused: !!y,
                  waitForGroups: ls(He),
                  attention: Ur,
                  stayOnTap: U,
                  onStayOnTapChange: Fe
                }
              ) : Ae(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || pe || ze || !Ce || !!y || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((m) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: yt.includes(m),
                          onChange: (E) => En(
                            e.occurrence.multiple ? E.target.checked ? [...yt, m] : yt.filter((M) => M !== m) : [m]
                          )
                        }
                      ),
                      se[m] ?? "Loading tag…"
                    ] }, m)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => En([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void on(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void on(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: qr, children: [
                S && /* @__PURE__ */ u(ge, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Qr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: dt ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    Ur.length > 0 && /* @__PURE__ */ a($p, { entries: Ur })
                  ] }),
                  Me.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${p.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          p.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Me.map((m) => {
                          var E, M, W;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = m.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (M = m.occurrence) == null ? void 0 : M.performer.name,
                              "data-partner-key": m.key,
                              disabled: Qe,
                              onClick: () => {
                                ln.current = S.key, Ut(m), Xe("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Qr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (W = m.occurrence) == null ? void 0 : W.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    Ip,
                    {
                      tags: Ce,
                      preview: vr,
                      trees: Bt,
                      actionTagIds: Nr,
                      label: `Current ${dt ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: ze && !pe && (!Ce || Ce.ids.length !== Ot.current.length || Ce.ids.some((m) => !Ot.current.includes(m))),
                      editor: ze && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: Sn,
                          disabled: pe,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              dt ? "occurrence" : p.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              sr,
                              {
                                entityType: "tag",
                                values: fr,
                                onChange: pn,
                                placeholder: "Choose tags for this item...",
                                allowCreate: !1
                              }
                            ),
                            /* @__PURE__ */ u("div", { className: "dq-row", children: [
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button primary",
                                  disabled: !Ce,
                                  onClick: () => void on(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ce,
                                  onClick: () => void on(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Rt(!1), requestAnimationFrame(() => {
                                      var m;
                                      return (m = bt.current) == null ? void 0 : m.focus();
                                    });
                                  },
                                  children: "Cancel"
                                }
                              )
                            ] })
                          ]
                        }
                      )
                    }
                  )
                ] }),
                Ae(st) && z.performerFocus && /* @__PURE__ */ a(
                  ti,
                  {
                    ...mr,
                    mediaKind: d,
                    actions: He.actions,
                    trees: Bt,
                    flags: xa
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !y && ca,
                  !y && ur && /* @__PURE__ */ a("p", { role: "alert", children: ur }),
                  Jn && /* @__PURE__ */ a("p", { role: "status", children: Jn })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": la || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: bt,
                      className: "dq-button",
                      disabled: Qe || !!y || !t || !Ce,
                      onClick: () => {
                        Dt.current++, Ot.current = [...Ce.ids], pn([...Ce.ids]), Rt(!0), Ze("");
                      },
                      children: [
                        /* @__PURE__ */ a(tc, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Qe || !!y,
                      onClick: () => void on(),
                      children: [
                        /* @__PURE__ */ a(fd, { "aria-hidden": "true" }),
                        "Skip",
                        dt ? " performer" : ` ${p.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              dt && /* @__PURE__ */ u(
                "div",
                {
                  className: "dq-segmented dq-segmented-fill",
                  role: "group",
                  "aria-label": "Queue view",
                  children: [
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": rn === "items",
                        onClick: () => Wn("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": rn === "performers",
                        onClick: () => Wn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              dt && rn === "performers" ? /* @__PURE__ */ a(
                tp,
                {
                  ranking: (I == null ? void 0 : I.signature) === ct ? I : null,
                  busy: Re,
                  error: (Ie == null ? void 0 : Ie.signature) === ct ? Ie.message : "",
                  focus: z.performerFocus,
                  disabled: Qe,
                  labels: p,
                  flagLabel: ia,
                  onFocus: sa,
                  onMore: () => {
                    const m = oe.current;
                    m && br(m, m.limit + Po);
                  },
                  onRefresh: () => {
                    de(null), br(null, Po);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: _n, children: ae.map((m) => {
                var M;
                const E = (S == null ? void 0 : S.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: w(m),
                    "aria-label": w(m),
                    "aria-current": E ? "true" : void 0,
                    disabled: Qe,
                    onClick: () => {
                      Ut(m), Xe(""), Ze("");
                    },
                    children: [
                      /* @__PURE__ */ a(Tp, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(ge, { children: [
                            /* @__PURE__ */ a(Qr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (M = m.media.files[0]) != null && M.duration ? Ws(m.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  m.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        dt && /* @__PURE__ */ a(
          Vs,
          {
            open: Tt,
            onClose: () => Qt(!1),
            criteria: ci,
            activeFilter: dt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              Qt(!1), sn({ performerFilter: m });
            }
          }
        ),
        hn && /* @__PURE__ */ a(
          Ti,
          {
            actions: e.actions,
            trees: Bt,
            isDisabled: (m) => gr(m),
            tapStays: Ve && U,
            onApply: (m, E) => {
              kn(!1), on(m, E);
            },
            onClose: () => kn(!1)
          }
        )
      ]
    }
  );
}
const Al = "data-quality.reviews-sort.v1", Op = { sort: "name", direction: "asc" };
function Mp() {
  try {
    const e = JSON.parse(localStorage.getItem(Al) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Op;
}
function Fp(e) {
  try {
    localStorage.setItem(
      Al,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Cl(e, t, n, r) {
  const o = r === "asc" ? 1 : -1;
  return [...e].sort((i, s) => {
    if (n === "count") {
      const c = t[i.id], l = t[s.id], f = typeof c == "number", d = typeof l == "number";
      if (f !== d) return f ? -1 : 1;
      if (f && d && c !== l)
        return (c - l) * o;
    }
    return i.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * o;
  });
}
function Lo(e, t) {
  const n = Le(e), r = Vn(pi(n)), o = n === "tag" ? "tag" : Ae(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function xp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Lo(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Lo(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Lo(e, t)
    ] })
  ] });
}
function Pp({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: o,
  onDirectionChange: i,
  storage: s,
  canConfigure: c,
  busy: l,
  headingRef: f,
  notices: d,
  onOpen: p,
  onNew: h,
  onImport: g,
  onExportAll: w,
  rowMenuItems: N
}) {
  const v = $(null), y = qe(
    () => Cl(e, t, n, r),
    [e, t, n, r]
  ), k = e.every((x) => t[x.id] !== void 0), O = r === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ u("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ u("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ a("h1", { ref: f, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ u("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !c || l,
            onClick: () => {
              var x;
              return (x = v.current) == null ? void 0 : x.click();
            },
            children: [
              /* @__PURE__ */ a(pd, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            ref: v,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (x) => {
              var C;
              const B = (C = x.target.files) == null ? void 0 : C[0];
              x.target.value = "", B && g(B);
            }
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Download every review as one review file",
            disabled: !e.length,
            onClick: w,
            children: [
              /* @__PURE__ */ a(oc, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || l,
            onClick: h,
            children: [
              /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    d,
    e.length ? /* @__PURE__ */ u("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ u("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ u("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: k ? e.some((x) => t[x.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (x) => o(x.target.value),
                children: [
                  /* @__PURE__ */ a("option", { value: "name", children: "Name" }),
                  /* @__PURE__ */ a("option", { value: "count", children: "Matching items" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-reviews-direction",
              "aria-label": `Sort direction: ${O}`,
              title: `Sort direction: ${O}`,
              onClick: () => i(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(hd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(md, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? O : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? O : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: y.map((x) => {
          const B = Le(x);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(x.id)}`,
                "data-review-id": x.id,
                onClick: (C) => {
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), p(x.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Xc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: x.name }),
                    x.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: x.description, children: x.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Yc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(xp, { review: x, count: t[x.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Ri, { label: `Actions for ${x.name}`, items: N(x) }) })
          ] }, x.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(so, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Tl(e, { id: t, name: n, description: r }) {
  const o = { id: t, name: n, description: r }, i = (s, c = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...c
  });
  switch (e) {
    case "tag":
      return {
        ...o,
        entityType: "tag",
        view: {
          ...i({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } }
        },
        actions: []
      };
    case "audio":
      return {
        ...o,
        entityType: "audio",
        view: i({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: []
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...o,
        entityType: e,
        view: i({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: [],
        occurrence: {
          targetMode: "all",
          performerIds: [],
          performerFilter: {},
          condition: "any",
          conditionTagIds: [],
          tagIds: [],
          multiple: !0
        }
      };
    default:
      return {
        ...o,
        entityType: "video",
        view: i({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: []
      };
  }
}
function Lp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), l = $(null), f = $(i);
  f.current = i;
  const d = $(null), p = at();
  ee(() => {
    var w;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (w = l.current) == null || w.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(i);
  ee(() => {
    var v, y;
    const w = document.activeElement, N = !w || w === document.body || !((v = c.current) != null && v.contains(w));
    s && (!o.name.trim() || h.current && !i && N) && ((y = l.current) == null || y.focus()), h.current = i;
  }, [s, i]);
  const g = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": p,
      "aria-modal": "true",
      onCancel: (w) => {
        w.preventDefault(), g();
      },
      onClose: () => {
        var w;
        f.current ? (w = c.current) == null || w.showModal() : r();
      },
      children: /* @__PURE__ */ u(
        "form",
        {
          onSubmit: (w) => {
            w.preventDefault(), f.current || n();
          },
          children: [
            /* @__PURE__ */ u("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ a("h2", { id: p, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: i,
                  onClick: g,
                  children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  el,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== Le(o) && t(Tl(w, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => $i(o), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: i, onClick: g, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": i || void 0, children: i ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Dp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function _p(e, t, n, r) {
  return El(
    {
      ...e,
      view: {
        ...e.view,
        filter: { ...n, page: 1 },
        objectFilter: t.view.objectFilter,
        searchMode: t.view.searchMode
      }
    },
    r
  );
}
function Ls(e, t) {
  return Le(t) === "video" && Lr(t.view.objectFilter, e.view.objectFilter, Ui(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Ds(e, t) {
  return cr(
    JSON.parse(rr(Mr(e))),
    JSON.parse(rr(Mr(t)))
  );
}
const Do = 180;
function _s(e) {
  return Le(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function js(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Us() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function _o(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  mo.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  kl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function jp(e) {
  return tn({ ...e, page: 1 });
}
function Il(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Vr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Up = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(di, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(yd, { "aria-hidden": "true" }) }
], Bp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(di, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(bd, { "aria-hidden": "true" }) }
], Bs = [], $l = "(min-width: 900px)";
function Gp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia($l);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Kp() {
  return typeof window.matchMedia == "function" && window.matchMedia($l).matches;
}
function zp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [w, N] = T(!1), [v, y] = T(!1), [k, O] = T([]), [x, B] = T(""), [C, D] = T(!0), [P, ne] = T("account"), [J, j] = T(""), [z, F] = T(""), [_, L] = T(!1), [X, Q] = T(!1), [ae, H] = T(""), [S, ce] = T(Us), A = $(S);
  A.current = S;
  const [Z, ue] = T({}), me = $(Z);
  me.current = Z;
  const K = $(t);
  K.current = t;
  const we = $(s);
  we.current = s;
  const Ee = $(!1), ke = $(!0);
  ee(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [Ne, Je] = T(!S);
  Ne !== !S && (Je(!S), S || ue({}));
  const [pe, ot] = T(Mp), { sort: Ye, direction: Dt } = pe, Jt = (b) => {
    const q = { ...pe, ...b };
    ot(q), Fp(q);
  }, Ht = $(null), nt = $(null), [Be, Ge] = T(null), [Xe, ur] = T(!1), [gt, Jn] = T(!1), [Ze, Ce] = T(null), [Ke, ze] = T(null), Rt = !!Ze || !!Ke, fr = $(Rt);
  fr.current = Rt;
  const pn = Xe || !!Ke || gt, [Ot, bt] = T(0), [Fn, Sn] = T(!1), [he, Tt] = T(null), Qt = $(null), hn = $(null), kn = $(null), [Ve, It] = T(
    null
  ), fe = t.find((b) => b.id === S) ?? null, U = qe(
    () => (Ve == null ? void 0 : Ve.id) === S && fe ? { ...fe, view: {
      ...fe.view,
      filter: Ve.view.filter,
      objectFilter: Ve.view.objectFilter,
      searchMode: Ve.view.searchMode,
      startFrom: Ve.view.startFrom
    } } : fe,
    [Ve, S, fe]
  ), Fe = U ? Le(U) : "video", yt = pi(Fe), En = U ? Ae(U) : !1, se = Fe === "video" ? U : null, Mt = !!(U != null && U.actions.some(ir)), _t = En && Mt, Hn = (!!se || Fe === "audio" || En) && Mt, [An, Cn] = T(null), mn = (An == null ? void 0 : An.id) === (U == null ? void 0 : U.id) ? An == null ? void 0 : An.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", je = En || Fe === "audio" || Fe === "video" && mn === "single", [He, st] = T(0), $t = $(-1), Qn = $(!1), xn = $(je);
  xn.current = je, ee(() => {
    const b = () => {
      const q = xn.current;
      if (!q && Zn.current) {
        Qn.current = !0;
        return;
      }
      $t.current = -1, On(), q || st((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const rn = yt === "audio" ? h : d, Wn = Fe === "tag" ? "Tag" : yt === "audio" ? "Audio" : "Video", I = Fe === "tag" ? w : rn, G = $(
    null
  ), oe = gp(se), [ie, de] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Re, Te] = T({
    page: 1,
    perPage: 40
  }), [Ie, Ft] = T({ items: [], totalCount: 0 }), [ye, ct] = T(S);
  ye !== S && (ct(S), Ft({ items: [], totalCount: 0 }), Q(!1));
  const [Se, Pn] = T(!1), [Oe, pr] = T(""), [Wt, na] = T(!1), [jt, ra] = T(!1), [xt, an] = T(() => /* @__PURE__ */ new Set()), hr = $(xt);
  hr.current = xt;
  const Tn = $(/* @__PURE__ */ new Map()), mr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [pt, wt] = T(null), Qe = $(pt);
  Qe.current = pt;
  const [it, lt] = T(!1), vt = $(it);
  vt.current = it;
  const Yn = $(null), [Ln, Ut] = T(!1), [gn, Dr] = T("grid"), [Xn, on] = T(Do), [$e, gr] = T(!1), [bn, aa] = T(!1), Zn = $(!1), [go, oa] = T(""), [dt, sn] = T(""), [br, yn] = T(""), [De, yr] = T(null), [Nt, _r] = T(""), [cn, wr] = T(!1), [jr, Ma] = T({}), Bt = $(/* @__PURE__ */ new Map()), Fa = $(null), Dn = $(null), er = !!U, bo = ii(Gp, Kp, () => !1) && er, [Ur, yo] = T({ top: 0, bottom: 0 });
  Ct(() => {
    if (!er) return;
    const b = () => {
      const R = Dn.current;
      if (!R) return;
      const V = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), re = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      yo(
        (Y) => Y.top === V && Y.bottom === re ? Y : { top: V, bottom: re }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [er]);
  const [xa, ia] = T(0), sa = $(null), wo = Nn((b) => {
    var R;
    if ((R = sa.current) == null || R.disconnect(), sa.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => ia(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), sa.current = q;
  }, []), Gt = $(0), vr = $(0), Nr = $(null), _n = $(null), qr = kc(
    U && !je ? he ? [...U.actions, ...he.draft.actions] : U.actions : Bs
  ), ln = qe(
    () => he && U && fe ? _p(he.draft, U, ie, fe) : null,
    [he, U, ie, fe]
  ), In = qe(
    () => U && fe ? El(
      { ...fe, view: { ...U.view, filter: { ...ie, page: 1 } } },
      fe
    ) : null,
    [U, fe, ie]
  ), $n = qe(
    () => fe ? Wr(Mr(fe)) : "",
    [fe]
  ), Pa = qe(
    () => In != null && Wr(Mr(In)) !== $n,
    [In, $n]
  ), vo = qe(
    () => ln != null && Wr(Mr(ln)) !== $n,
    [ln, $n]
  );
  ee(() => {
    if (!dt) return;
    const b = window.setTimeout(() => sn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [dt]), ee(() => {
    if (!Be || Be.alert) return;
    const b = window.setTimeout(() => Ge(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Be]), ee(() => {
    const b = se ? Fi(se.view.objectFilter) : [];
    if (Ma({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (V) => {
        var te;
        try {
          const re = await ve(`/api/tags/${V}`, {
            signal: q.signal
          });
          return (te = re.name) != null && te.trim() ? [String(V), re.name] : null;
        } catch {
          return null;
        }
      })
    ).then((V) => {
      R && Ma(
        Object.fromEntries(V.filter((te) => te !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const ca = qe(
    () => se ? xi(
      se.view.objectFilter,
      jr
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [jr, U, se]
  ), la = Nn(async () => {
    c(!0), f("");
    try {
      const b = await _d();
      n(b.reviews), i(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), y(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), ne(b.storage ?? "account"), j(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), _o(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [S]);
  ee(() => {
    if (!v) {
      O([]), B("");
      return;
    }
    const b = new AbortController();
    return B(""), Yd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), ee(() => {
    la();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof me.current[q.id] == "number") continue;
      (Ae(q) ? Pi(q, b.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : Jr(ho(q, V), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Le(q) === "tag" ? To(
        q,
        tn({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Jr(
        q,
        tn({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((V) => {
        b.signal.aborted || ue((te) => ({
          ...te,
          [q.id]: V.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || ue((V) => ({ ...V, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), Ct(() => {
    var R, V;
    const b = nt.current;
    if (S || s || !b) return;
    nt.current = null, (V = (b === "heading" ? null : [...((R = Dn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Ht.current) == null || V.focus();
  }, [S, s, Ke, t]);
  const da = $(0), Sr = Nn(async () => {
    const b = ++da.current;
    yr(null), _r("");
    try {
      const q = await (_t ? vc(yt) : wc(yt));
      b === da.current && yr(q);
    } catch (q) {
      if (b !== da.current) return;
      yr(null), _r(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [_t, yt]);
  ee(() => {
    Sr();
  }, [Sr]);
  const Rn = Nn(
    async (b, q, R = !1, V = !1, te = () => !0) => {
      var xe, ht;
      const re = ++Gt.current;
      (xe = Nr.current) == null || xe.abort();
      const Y = new AbortController();
      Nr.current = Y, q = tn(q);
      const We = Number(q.page);
      R && (q = { ...q, page: 1 }), de(q), ra(R), Pn(!0), pr("");
      try {
        const ut = (ft) => Le(b) === "tag" ? To(
          b,
          ft,
          Y.signal
        ) : Jr(
          b,
          ft,
          Y.signal
        );
        let mt = await ut(q);
        const Vt = Math.max(
          1,
          Math.ceil(mt.totalCount / Number(q.perPage))
        ), Pe = R ? Vt : Math.min(We, Vt);
        return Number(q.page) !== Pe && (q = { ...q, page: Pe }, mt = await ut(q)), re === Gt.current && te(mt) && (((ht = _n.current) == null ? void 0 : ht.page) !== Pe && (_n.current = {
          page: Pe,
          ids: new Set(mt.items.map((ft) => ft.id))
        }), Ft(mt), V && W(
          () => new Set(mt.items.map((ft) => ft.id))
        ), de(q), Te(q)), mt;
      } catch (ut) {
        throw re === Gt.current && pr(
          ut instanceof Error ? ut.message : "Could not load the review queue."
        ), ut;
      } finally {
        re === Gt.current && Pn(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (vr.current += 1, $t.current = -1, Gt.current += 1, (q = Nr.current) == null || q.abort(), Tt(null), Qt.current = null, Q(!1), H(""), F(""), L(!1), an(/* @__PURE__ */ new Set()), Tn.current.clear(), wt(null), lt(!1), gr(!1), Zn.current = !1, oa(""), sn(""), yn(""), Ft({ items: [], totalCount: 0 }), _n.current = null, na(!1), !U || je) {
      Pn(!1), It(null);
      return;
    }
    let b = !0;
    return Pn(!0), (async () => {
      let R = fe ?? U;
      It(null);
      let V = null;
      const te = new URLSearchParams(window.location.search);
      if (Le(U) === "video" && mo.some((xe) => te.has(xe)))
        try {
          const xe = R;
          V = oi(xe, te);
          const ht = Mn(xe, V.query);
          (V.query.startFrom !== (xe.view.startFrom ?? "end") || !cr(
            JSON.parse(rr(ht)),
            JSON.parse(rr(Mn(xe, xr(xe))))
          )) && (R = ht, It(R));
        } catch (xe) {
          na(!0), pr(xe instanceof Error ? xe.message : "Could not read review URL."), Pn(!1);
          return;
        }
      let re = null;
      try {
        re = await Kd(o, U.id);
      } catch (xe) {
        b && (L(!0), F(
          xe instanceof Error ? xe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Y = (re == null ? void 0 : re.signature) === rr(R) ? re : null, We = V ? V.query.filter : Y ? tn(Y.filter) : jp(R.view.filter);
      de(We), Dr(
        Y ? js(Y.displayMode, Le(U)) : _s(U)
      ), on(
        Y ? Y.cardSize ?? Do : Do
      );
      try {
        const xe = await Rn(
          R,
          We,
          V ? V.startAtEnd : !Y && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const ht = es(
          xe.items.map((ut) => ut.id),
          (Y == null ? void 0 : Y.focusedId) ?? null,
          (Y == null ? void 0 : Y.index) ?? 0
        );
        wt(ht), M(ht);
      } catch {
      }
      b && ($t.current = He, Q(!0), H(`${U.id}:${He}`));
    })(), () => {
      var R;
      b = !1, vr.current++, Gt.current++, (R = Nr.current) == null || R.abort();
    };
  }, [U == null ? void 0 : U.id, je, He]), ee(() => {
    if (!(!Ot || je || !U)) {
      if (Wt) {
        bt(0);
        return;
      }
      $e || he || bn || ae !== `${U.id}:${He}` || (bt(0), Eo());
    }
  }, [
    Ot,
    je,
    U == null ? void 0 : U.id,
    ae,
    $e,
    bn,
    He,
    Wt
  ]), ee(() => {
    !se || je || !X || Se || Oe || $e || Qn.current || $t.current !== He || wa(se.id, {
      filter: ie,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, je, X, Se, Oe, ie, $e, He]);
  const Me = qe(
    () => Ie.items.map((b) => b.id),
    [Ie.items]
  );
  ee(() => {
    if (!X || !U || !o || Se || Oe || $e || (Ve == null ? void 0 : Ve.id) === U.id || _ || $t.current !== He)
      return;
    const b = {
      version: 1,
      signature: rr(U),
      filter: ie,
      focusedId: pt,
      index: Math.max(0, Me.indexOf(pt ?? -1)),
      displayMode: gn,
      cardSize: Xn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + U.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (z) return;
    let q = !0;
    const R = window.setTimeout(() => {
      zd(o, U.id, b).catch((V) => {
        q && F(
          "Progress is kept in this browser, but account sync failed. " + (V instanceof Error ? V.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    X,
    o,
    U,
    Se,
    Oe,
    $e,
    ie,
    pt,
    Me,
    gn,
    Xn,
    Ve,
    z,
    _,
    He
  ]);
  const No = Ie.items.find((b) => b.id === pt) ?? null, Br = Fe === "video" ? No : null;
  it && Br && (Yn.current = Br);
  const wn = Br ?? (it ? Yn.current : null), m = rs(xt, pt), E = Me.length > 0 && Me.every((b) => xt.has(b)), M = Nn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var V;
      if (fr.current || Md(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = Bt.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    X && !vt.current && M(Qe.current);
  }, [X, M]), ee(() => {
    Se || !Me.length || (Qe.current == null || !Me.includes(Qe.current)) && (wt(Me[0]), vt.current || M(Me[0]));
  }, [M, Me, Se]);
  const W = Nn(
    (b) => {
      an((q) => {
        const R = b(q);
        for (const V of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(V) !== R.has(V) && Tn.current.set(
            V,
            (Tn.current.get(V) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), le = Nn(
    (b) => {
      if (!Me.length) return;
      const q = Math.max(
        0,
        Me.indexOf(Qe.current ?? Me[0])
      ), R = Me[Math.max(0, Math.min(Me.length - 1, q + b))];
      wt(R), vt.current || M(R);
    },
    [M, Me]
  ), be = Nn(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", V = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = V != null && (!v || !k.some((tt) => tt.id === V)), re = "effect" in b && R && !v, Y = rs(
        hr.current,
        Qe.current
      );
      if (!U || Zn.current || Se || Oe) return;
      const We = R && !I ? `${Wn} write permission is required to apply ${b.label}.` : re || te ? `${b.label} needs a tag group that is unavailable.` : ir(b) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Y.length ? "" : `Select or focus a ${Fe} before applying ${b.label}.`;
      if (We) {
        yn(We);
        return;
      }
      const xe = ++vr.current, ht = U.id, ut = [...Me], mt = Ie, Vt = Qe.current, Pe = new Set(hr.current), ft = new Map(
        Y.map((tt) => [tt, Tn.current.get(tt) ?? 0])
      ), Cr = () => xe === vr.current && U.id === ht;
      Zn.current = !0, gr(!0), oa(
        hr.current.size ? `${Y.length} selected ${Fe}s` : `the focused ${Fe}`
      ), sn(""), yn("");
      const Ji = mt.items.filter(
        (tt) => !Y.includes(tt.id)
      ), Bl = Ji.map((tt) => tt.id), Hi = as(
        ut,
        Bl,
        Vt,
        Y.includes(Vt ?? -1)
      );
      q || (Ft({
        items: Ji,
        totalCount: mt.totalCount
      }), an((tt) => {
        const Yt = new Set(tt);
        for (const Xt of Y) Yt.delete(Xt);
        return Yt;
      }), wt(Hi), vt.current || M(Hi));
      let Ao = !1;
      try {
        if ("effect" in b ? await iu(b, Y) : await qc(yt, b, Y), Ao = !0, !Cr()) return;
        q || an((tt) => {
          const Yt = new Set(tt);
          for (const Xt of Y)
            (Tn.current.get(Xt) ?? 0) === ft.get(Xt) && Yt.delete(Xt);
          return Yt;
        }), sn(
          `${b.label}: ${Y.length} ${Fe}${Y.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (tt) {
        if (!Cr()) return;
        Ft(mt), an((Yt) => {
          const Xt = new Set(Yt);
          for (const Gr of Y)
            Pe.has(Gr) && (Tn.current.get(Gr) ?? 0) === ft.get(Gr) && Xt.add(Gr);
          return Xt;
        }), wt(Vt), vt.current || M(Vt), yn(
          tt instanceof Error ? tt.message : "Action failed."
        );
      }
      try {
        if (!Cr()) return;
        if (q) {
          const kt = Fe === "tag" ? await To(U, ie) : await Jr(U, ie), vn = new Map(
            kt.items.map((Lt) => [Lt.id, Lt])
          );
          if (Fe !== "tag" && await Promise.all(
            Y.filter((Lt) => !vn.has(Lt)).map(async (Lt) => {
              const ha = await to(yt, Lt).catch(() => null);
              ha && vn.set(Lt, ha);
            })
          ), !Cr()) return;
          const Kr = new Set(Y), Zt = "effect" in b ? b.effect : null, en = (Zt == null ? void 0 : Zt.mode) === "SET_TAG_GROUP" ? k.find((Lt) => Lt.id === Zt.tagGroupId) : void 0, Co = (Lt) => Zt && Zt.mode !== "SKIP" && Kr.has(Lt.id) ? {
            ...Lt,
            tagGroupId: (en == null ? void 0 : en.id) ?? null,
            tagGroupName: (en == null ? void 0 : en.name) ?? null,
            tagGroupColor: (en == null ? void 0 : en.color) ?? null
          } : Lt;
          Ft((Lt) => ({
            items: Lt.items.map((ha) => vn.get(ha.id) ?? Co(ha)),
            totalCount: kt.totalCount
          }));
          return;
        }
        const tt = new Set(Y), Yt = mr && ut.length > 0 && ut.every((kt) => tt.has(kt)), Xt = _n.current, Gr = (U.view.startFrom ?? "end") !== "beginning", Qi = (kt) => {
          const vn = kt.items.map((Zt) => Zt.id), Kr = (Xt == null ? void 0 : Xt.page) === Number(ie.page) && vn.some((Zt) => Xt.ids.has(Zt));
          return kt.totalCount > 0 && Number(ie.page) > 1 && (!vn.length || Gr && !Kr);
        }, Wi = await Rn(U, ie, !1, Yt, (kt) => !Qi(kt));
        if (!Cr()) return;
        let pa = Wi.items.map((kt) => kt.id);
        if (Qi(Wi)) {
          const kt = Math.max(1, Number(ie.page) - 1), vn = { ...ie, page: kt };
          de(vn), pa = (await Rn(
            U,
            vn,
            !1,
            Yt
          )).items.map((en) => en.id), an(
            (en) => new Set([...en].filter((Co) => pa.includes(Co)))
          );
          const Zt = pa.at(-1) ?? null;
          wt(Zt), vt.current || M(Zt);
        } else {
          an(
            (vn) => new Set([...vn].filter((Kr) => pa.includes(Kr)))
          );
          const kt = as(
            ut,
            pa,
            Vt,
            Ao && Y.includes(Vt ?? -1)
          );
          wt(kt), vt.current && kt == null && lt(!1), vt.current || M(kt);
        }
      } catch (tt) {
        Cr() && yn(
          (Yt) => `${Yt ? `${Yt} ` : ""}${Ao ? "The action completed, but " : ""}the queue could not be refreshed. ${tt instanceof Error ? tt.message : "Refresh failed."}`
        );
      } finally {
        Cr() && (Zn.current = !1, gr(!1), oa(""), Qn.current && (Qn.current = !1, On(), st((tt) => tt + 1)));
      }
    },
    [
      I,
      v,
      k,
      Fe,
      De,
      Rn,
      ie,
      M,
      Me,
      Ie,
      Se,
      Oe,
      U
    ]
  );
  function et() {
    var R;
    if (gn === "list") return 1;
    const b = (R = Fa.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Pt = $(() => {
  });
  Pt.current = (b) => {
    var re;
    if (je || b.defaultPrevented || b.repeat || fn(b) || b.ctrlKey || b.altKey || b.metaKey || Rt) return;
    const q = b.target, R = q instanceof Node && ((re = Dn.current) == null ? void 0 : re.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!R && !V) return;
    if (Ln) {
      b.key === "Escape" && (Vr(b), Ut(!1));
      return;
    }
    if (it && b.key === "Escape") {
      Vr(b), lt(!1), M(Qe.current);
      return;
    }
    if (!Od(q)) return;
    const te = Rd(q);
    if (b.key === "Escape") {
      Vr(b), W(() => /* @__PURE__ */ new Set()), q instanceof HTMLElement && q.closest(".dq-action-bar") && M(Qe.current, !1);
      return;
    }
    if (!it && b.key === " " && te) {
      Vr(b), pt != null && W((Y) => Va(Y, pt));
      return;
    }
    if (!($e || Se) && !it && b.key === "Enter" && pt != null && te) {
      if (Fe !== "tag" && he) return;
      Vr(b), Fe === "tag" ? window.open(`/tag/${pt}`, "_blank", "noopener,noreferrer") : lt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => Pt.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const dn = $(
    () => {
    }
  );
  dn.current = (b) => {
    var re;
    if (je || Rt || it || Ln || $e || Se || !Me.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((re = Dn.current) == null ? void 0 : re.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!R && !V || !b.key.startsWith("Arrow") || !Fd(q)) return;
    const te = xd(b.key, et());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), le(te));
  }, ee(() => {
    const b = (q) => dn.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), ee(() => {
    const b = (q) => {
      var V;
      const R = q.target;
      !(R instanceof HTMLInputElement) || R.type !== "range" || !((V = Dn.current) != null && V.contains(R)) || xn.current || R.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (R.blur(), M(Qe.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [M]);
  const Ue = (he == null ? void 0 : he.saving) === !0 || bn, jn = $e || Se && !X || Ue, qt = Ai();
  Ei({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !je && !Rt && !he && !it && !Ln && !Oe && (Ie.items.length > 0 || Se || $e),
    actions: (U == null ? void 0 : U.actions) ?? Bs,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && be(R, q);
    },
    onFind: () => Ut(!0),
    onSelectAll: () => W((b) => $d(b, Me))
  }), ee(() => Ut(!1), [je, it, U == null ? void 0 : U.id]);
  function Kt(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, V = R != null && !k.some((te) => te.id === R);
    return $e || Se || !!Oe || q && !I || "effect" in b && q && (!v || V) || ir(b) && (De == null ? void 0 : De.kind) !== "ready" || !m.length;
  }
  function rt(b) {
    Cn(null), bt(0), Ge(null), ce(b), _o(b, !!b && !U);
  }
  function St() {
    Ee.current || (Sl() ? (Ee.current = !0, window.history.back()) : rt(""));
  }
  function On() {
    const b = Ee.current;
    Ee.current = !1;
    let q = Us();
    q && !we.current && !K.current.some((V) => V.id === q) && (q = "", _o(""));
    const R = A.current;
    q !== R && (bt(0), b || Ge(null), !q && R && (nt.current ?? (nt.current = { reviewId: R }))), ce(q);
  }
  function kr() {
    nt.current = "heading", Ge(null), St();
  }
  function Er(b) {
    b !== S && rt(b), bt((q) => q + 1);
  }
  function Ar() {
    Ge(null), Ce({
      review: Tl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function ua(b) {
    if (pn || !C) return;
    Ge(null);
    const q = crypto.randomUUID();
    let R;
    const V = S;
    Jn(!0);
    try {
      if (!await fa((re) => (R = ns(
        re.find((Y) => Y.id === b.id) ?? b,
        re,
        q
      ), [...re, R]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      A.current !== V ? Ge({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : Er(R.id);
    } catch (te) {
      Ge({
        text: `“${b.name}” was not duplicated. ${Da(te)}`,
        alert: !0
      });
    } finally {
      Jn(!1);
    }
  }
  async function zt() {
    if (!Ze || Ze.saving) return;
    const b = { ...Ze.review, name: Ze.review.name.trim() }, q = Sa(b);
    if (q) {
      Ce({ ...Ze, error: q });
      return;
    }
    Ce({ ...Ze, saving: !0, error: "" });
    try {
      if (!await fa((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Ce(null), Er(b.id);
    } catch (R) {
      Ce(
        (V) => V && {
          ...V,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function La() {
    if (!Ke || Ke.pending) return;
    const b = Ke.review, q = Cl(t, Z, Ye, Dt).map((te) => te.id), R = q.filter((te) => te !== b.id), V = R[Math.min(q.indexOf(b.id), R.length - 1)];
    ze({ review: b, pending: !0 });
    try {
      if (!await fa((te) => te.filter((re) => re.id !== b.id)))
        throw new Error("Could not save reviews.");
      nt.current = b.id !== S && V ? { reviewId: V } : "heading", Ge({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ge({ text: `“${b.name}” was not deleted. ${Da(te)}`, alert: !0 });
    } finally {
      ze(null);
    }
  }
  async function Rl(b) {
    if (!(pn || !C)) {
      Ge(null), ur(!0);
      try {
        const q = await yf(b);
        let R = 0, V = 0;
        if (q.length && !await fa((re) => {
          const Y = [...re];
          R = V = 0;
          for (const We of q) {
            const xe = Y.find((ht) => ht.id === We.id);
            if (!xe) Y.push(We);
            else if (JSON.stringify(xe) !== JSON.stringify(We))
              Y.push(ns(We, Y, crypto.randomUUID())), V++;
            else continue;
            R++;
          }
          return R ? Y : re;
        }))
          throw new Error("Could not save reviews.");
        const te = q.length - R;
        Ge({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}` + (V ? ` (${V === 1 ? "1 as a copy" : `${V} as copies`} beside a listed version that differs)` : "") + "." + (te === 1 ? " 1 review already in the list stays as it is." : te ? ` ${te} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Ge({ alert: !0, text: `Could not import “${b.name}”. ${Da(q)}` });
      } finally {
        ur(!1);
      }
    }
  }
  function Da(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function Bi(b) {
    const q = !C || pn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Zs, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void ua(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(oc, { "aria-hidden": "true" }),
        onSelect: () => $i(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(io, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ge(null), ze({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Gi(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || gt
      },
      ...Bi(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
        separated: !0,
        disabled: gt,
        onSelect: kr
      }
    ];
  }
  async function fa(b) {
    if (!o) return !1;
    let q = [];
    const R = await Gd(o, (Y) => {
      q = Y;
      const We = b(Y);
      return We === Y ? Y : We.map(Hp);
    });
    if (n(R), !ke.current) return !0;
    const V = A.current;
    V && !R.some((Y) => Y.id === V) && St();
    const te = q.find((Y) => Y.id === V), re = R.find((Y) => Y.id === V);
    return re && te && ((re.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && Cn(null), re.view.displayMode !== te.view.displayMode && Dr(_s(re))), !0;
  }
  function qo(b) {
    return fa((q) => Jp(q, b));
  }
  function Ol(b) {
    return qo(b).catch((q) => {
      throw A.current !== b.id && So(b, q), q;
    });
  }
  function So(b, q) {
    var V;
    if (!ke.current) return;
    const R = ((V = K.current.find((te) => te.id === b.id)) == null ? void 0 : V.name) ?? b.name;
    Ge({ text: `“${R}” was not saved. ${Da(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(Gs, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Zp().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Ks,
        {
          message: l,
          onRetry: () => void la()
        }
      )
    ] });
  const ko = /* @__PURE__ */ u(ge, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    Hn && (De == null ? void 0 : De.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      De.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: cn,
          onClick: () => {
            wr(!0), _r(""), (_t ? nu(yt) : tu(yt)).then(Sr).catch(
              (b) => _r(
                `Could not create the ${_t ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => wr(!1));
          },
          children: cn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Hn && ((De == null ? void 0 : De.kind) === "incompatible" || Nt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Un, {}),
      Nt || (De == null ? void 0 : De.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: cn,
          onClick: () => {
            wr(!0), Sr().finally(
              () => wr(!1)
            );
          },
          children: cn ? "Checking…" : "Check again"
        }
      )
    ] }),
    r && /* @__PURE__ */ u("details", { children: [
      /* @__PURE__ */ a("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ a("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const b = localStorage.getItem("page-videos") ?? "[]", q = URL.createObjectURL(
              new Blob([b], { type: "application/json" })
            ), R = document.createElement("a");
            R.href = q, R.download = "data-quality-unassigned-legacy-reviews.json", R.click(), URL.revokeObjectURL(q);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    z && /* @__PURE__ */ u("p", { role: "alert", children: [
      z,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            F(""), L(!1);
          },
          children: _ ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Be && (Be.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
      Be.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Be.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Dn,
      className: `data-quality-page${er ? " dq-page-fit" : ""}`,
      style: er ? {
        "--dq-fit-top": `${Ur.top}px`,
        "--dq-fit-bottom": `${Ur.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Be && !Be.alert ? Be.text : "" }),
        U && je ? /* @__PURE__ */ a(
          Rp,
          {
            review: fe ?? U,
            canWrite: En ? w : rn,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && rn,
            onBusy: gr,
            editRequest: Ot,
            onEditRequestHandled: () => bt(0),
            onSaveDefaults: C ? Ol : void 0,
            pageControls: {
              onBack: kr,
              moreItems: (b) => Gi(fe ?? U, b),
              onGrid: se ? () => Cn({ id: se.id, mode: "multiple" }) : void 0,
              notices: ko,
              busy: gt
            },
            stayOnTap: Fn,
            onStayOnTapChange: Sn
          },
          U.id
        ) : U ? jl(U) : /* @__PURE__ */ a(
          Pp,
          {
            reviews: t,
            counts: Z,
            sort: Ye,
            direction: Dt,
            onSortChange: (b) => Jt({ sort: b }),
            onDirectionChange: (b) => Jt({ direction: b }),
            storage: Dp[P],
            canConfigure: C,
            busy: pn,
            headingRef: Ht,
            notices: ko,
            onOpen: rt,
            onNew: () => Ar(),
            onImport: (b) => void Rl(b),
            onExportAll: () => Zc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
                disabled: !C || pn,
                onSelect: () => Er(b.id)
              },
              ...Bi(b)
            ]
          }
        ),
        it && wn && se && /* @__PURE__ */ a(
          Xp,
          {
            video: wn,
            review: se,
            details: bp(wn, se, oe.ids),
            selectedCount: xt.size,
            pending: $e,
            refreshing: Se || !!Oe,
            error: br,
            canWrite: d,
            assessmentReady: (De == null ? void 0 : De.kind) === "ready",
            trees: qr,
            selected: xt.has(wn.id),
            hasPrevious: Me.indexOf(wn.id) > 0,
            hasNext: Me.indexOf(wn.id) >= 0 && Me.indexOf(wn.id) < Me.length - 1,
            onToggleSelected: () => W((b) => Va(b, wn.id)),
            onPrevious: () => le(-1),
            onNext: () => le(1),
            onClose: () => {
              lt(!1), M(Qe.current);
            },
            onAction: be,
            findOpen: Ln,
            onFindOpenChange: Ut
          }
        ),
        Ln && U && !je && !it && /* @__PURE__ */ a(
          Ti,
          {
            actions: U.actions,
            tagGroups: k,
            trees: qr,
            isDisabled: Kt,
            onApply: (b, q) => {
              Ut(!1), be(b, q);
            },
            onClose: () => Ut(!1)
          }
        ),
        Ze && /* @__PURE__ */ a(
          Lp,
          {
            draft: Ze,
            onChange: (b) => Ce((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void zt(),
            onCancel: () => Ce(null)
          }
        ),
        /* @__PURE__ */ a(
          ed,
          {
            open: !!Ke,
            title: "Delete review?",
            message: Ke ? `“${Ke.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ke == null ? void 0 : Ke.pending) ?? !1,
            onConfirm: () => void La(),
            onCancel: () => ze((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function _a(b, q, R = !1, V = !0) {
    const te = Qe.current, re = Math.max(0, Me.indexOf(te ?? -1));
    try {
      const Y = Rn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), We = Gt.current, xe = await Y;
      if (We !== Gt.current) return;
      const ht = xe.items.map((mt) => mt.id);
      an(
        (mt) => new Set([...mt].filter((Vt) => ht.includes(Vt)))
      );
      const ut = es(ht, te, re);
      wt(ut), V && !vt.current && M(ut, !1);
    } catch {
    }
  }
  function Ml(b) {
    const q = G.current;
    if (G.current = null, jn || !U || !fe) return;
    const R = q ?? U.view.objectFilter, V = cr(
      R,
      fe.view.objectFilter
    ) ? fe.view.objectFilter : R, te = tn({ ...b, page: 1 }), re = {
      ...U,
      view: {
        ...U.view,
        filter: te,
        objectFilter: V
      }
    }, Y = !Ds(re, fe), We = Y ? re : fe;
    It(Y ? re : null), sn(Y ? "" : "Review queue defaults restored."), _a(We, te, We.view.startFrom !== "beginning");
  }
  function Fl() {
    if ($e || Se || Ue || !fe) return;
    G.current = null;
    const b = tn({
      ...fe.view.filter,
      page: 1
    });
    It(null), sn("Review queue defaults restored."), _a(
      fe,
      b,
      fe.view.startFrom !== "beginning",
      !1
    );
  }
  function xl() {
    if ($e || Se || Oe || Ue || !U || !In || !C)
      return;
    const b = U, q = In;
    aa(!0), qo(q).then((R) => {
      !R || A.current !== q.id || (It(Ls(q, b)), sn("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? So(q, R) : yn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => aa(!1));
  }
  function Eo() {
    if (!U || !fe || Zn.current || he || bn) return;
    hn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Qt.current = {
      temporaryReview: Ve,
      filter: ie,
      loadedFilter: Re,
      queue: Ie,
      queueError: Oe,
      retryFromEnd: jt,
      selectedIds: new Set(xt),
      focusedId: pt,
      pageCursor: _n.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...fe,
      view: { ...fe.view, startFrom: U.view.startFrom ?? "end" }
    });
    Ut(!1), lt(!1), sn(""), yn(""), Tt({ draft: b, saving: !1, error: "" });
  }
  function Ki() {
    Tt(null), Qt.current = null;
    const b = hn.current;
    hn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : M(Qe.current, !1);
    });
  }
  function Pl() {
    var q;
    if (!he || he.saving) return;
    const b = Qt.current;
    b && (Gt.current += 1, (q = Nr.current) == null || q.abort(), G.current = null, Pn(!1), It(b.temporaryReview), de(b.filter), Te(b.loadedFilter), Ft(b.queue), pr(b.queueError), ra(b.retryFromEnd), W(() => b.selectedIds), wt(b.focusedId), _n.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Ki();
  }
  async function Ll() {
    if (!he || he.saving || !ln || !U) return;
    const b = U, q = { ...ln, name: ln.name.trim() }, R = Sa(q);
    if (R) {
      Tt((V) => V && { ...V, error: R });
      return;
    }
    Tt((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await qo(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      It(Ls(q, b)), Le(q) === "video" && wa(q.id, {
        filter: ie,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), sn("Review saved."), Ki();
    } catch (V) {
      if (A.current !== q.id) {
        So(q, V);
        return;
      }
      Tt(
        (te) => te && {
          ...te,
          saving: !1,
          error: fc(V)
        }
      );
    }
  }
  function zi() {
    U && Rn(U, ie, jt, mr).catch(() => {
    });
  }
  function Dl() {
    an(/* @__PURE__ */ new Set()), Tn.current.clear(), wt(null);
  }
  function _l(b) {
    !U || $e || Ue || b === Number(ie.page) || Vp(
      { ...ie, page: b },
      U,
      (q, R) => Rn(q, R, !1, mr),
      Dl
    );
  }
  function Vi(b) {
    if (!se || !fe || $e || Se || Ue) return;
    const q = ql(se, b, fe.view.objectFilter), R = !Ds(q, fe);
    It(R ? q : null), R ? _a(q, { ...ie, page: 1 }) : _a(
      fe,
      { ...ie, page: 1 },
      fe.view.startFrom !== "beginning"
    );
  }
  function jl(b) {
    var xe, ht, ut, mt, Vt;
    const q = Fe === "tag", R = q ? "tag" : "video", V = Math.max(1, Number(ie.perPage) || 40), te = Math.max(1, Math.ceil(Ie.totalCount / V)), re = Math.min(Math.max(1, Number(ie.page) || 1), te), Y = [
      I ? "" : `${Wn} write permission is required to apply actions.`,
      q && x ? `Tag groups are unavailable. ${x}` : ""
    ].filter(Boolean), We = !!br && !it;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            nl,
            {
              name: b.name,
              description: b.description,
              entityType: Fe,
              onBack: kr,
              backDisabled: $e || !!he || gt,
              onEdit: he ? () => {
                var Pe;
                return (Pe = kn.current) == null ? void 0 : Pe.focus();
              } : Eo,
              editDisabled: !he && ($e || Se || Wt || bn || gt || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: jn, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  va,
                  {
                    filter: Oe ? Re : ie,
                    onFilterChange: Ml,
                    totalCount: Ie.totalCount,
                    sortOptions: q ? nd : Hs,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: gn,
                    zoomLevel: (Xn - 225) / 50,
                    onZoomChange: (Pe) => on(Math.round(225 + Pe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? td : oo,
                    customFieldEntityType: Fe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: ca,
                    onObjectFilterChange: (Pe) => {
                      jn || (G.current = Fe === "video" ? ol(
                        Pe,
                        jr,
                        b.view.objectFilter
                      ) : Pe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(rl, { page: re, pages: te, onPage: _l })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(ge, { children: [
                se && /* @__PURE__ */ a(
                  al,
                  {
                    mode: "multiple",
                    disabled: $e || Se || Rt || !!he || bn || gt,
                    onChange: () => Cn({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Rf,
                  {
                    options: q ? Bp : Up,
                    value: gn,
                    onChange: (Pe) => Dr(js(Pe, Fe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Ri,
                {
                  disabled: $e || !!he,
                  items: Gi(fe ?? b, {
                    onSelect: Eo,
                    disabled: Se || Wt || bn || !C
                  })
                }
              ),
              queueDiffers: X ? (Ve == null ? void 0 : Ve.id) === S : void 0,
              queueChange: !he && (Ve == null ? void 0 : Ve.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Pa ? xl : void 0,
                saveDisabled: $e || Se || !!Oe || Ue || !C,
                onReset: Fl,
                resetDisabled: $e || Se || Ue
              } : void 0,
              chipsAfter: (ht = (xe = se == null ? void 0 : se.presentation) == null ? void 0 : xe.binParents) != null && ht.length || (mt = (ut = se == null ? void 0 : se.presentation) == null ? void 0 : ut.filterBins) != null && mt.length ? /* @__PURE__ */ u(ge, { children: [
                !!((Vt = se.presentation.binParents) != null && Vt.length) && /* @__PURE__ */ a(
                  yp,
                  {
                    videos: Ie.items,
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    trees: oe.ids,
                    disabled: $e || Se || Ue,
                    onToggle: Vi
                  }
                ),
                /* @__PURE__ */ a(
                  wp,
                  {
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    queueFilter: ie,
                    queueCount: Se || Oe ? null : Ie.totalCount,
                    disabled: $e || Se || Ue,
                    countsPaused: $e || Se || Ue || !X,
                    onToggle: Vi
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ko,
          se && oe.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: oe.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && ln && /* @__PURE__ */ a(
              tl,
              {
                drawerRef: kn,
                draft: ln,
                onChange: (Pe) => Tt((ft) => ft && { ...ft, draft: Pe }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Pe) => Tt(
                  (ft) => ft && {
                    ...ft,
                    draft: { ...ft.draft, view: { ...ft.draft.view, startFrom: Pe } }
                  }
                ),
                tagGroups: k,
                trees: qr,
                saving: he.saving,
                saveDisabled: Se || !!Oe,
                error: he.error,
                dirty: vo,
                criteriaChanged: Pa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Oe && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Oe,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: zi, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Ll(),
                onCancel: Pl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${xa}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !Ie.items.length && /* @__PURE__ */ a(Gs, { label: "Loading review queue…" }),
                    Oe && !Se && /* @__PURE__ */ a(
                      Ks,
                      {
                        message: Oe,
                        retryLabel: Wt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Wt && fe && Le(fe) === "video") {
                            const Pe = xr(fe);
                            wa(fe.id, { ...Pe, filter: { ...Pe.filter, page: void 0 } }), st((ft) => ft + 1);
                            return;
                          }
                          zi();
                        }
                      }
                    ),
                    !$e && !Se && !Oe && !Ie.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(so, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ie.items.length && /* @__PURE__ */ a("div", { ref: Fa, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: gn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Xn}px` },
                        children: Ie.items.map(Ul)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: wo, children: /* @__PURE__ */ a(
                    zc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: k,
                      trees: qr,
                      isDisabled: Kt,
                      paused: !!he,
                      busy: $e || Se,
                      onApply: (Pe) => void be(Pe),
                      onFind: () => Ut(!0),
                      status: $e ? `Applying action to ${go}…` : "",
                      summary: /* @__PURE__ */ u(ge, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: xt.size ? `${xt.size} selected` : pt == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Me.length || E,
                            onClick: () => W((Pe) => /* @__PURE__ */ new Set([...Pe, ...Me])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(At, { binding: qt.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !xt.size,
                            onClick: () => W(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(At, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: Y.length ? Y.join(" ") : void 0,
                      keyHints: q ? he ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: We || dt ? /* @__PURE__ */ u(ge, { children: [
                        We && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                          br
                        ] }),
                        dt && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: dt })
                      ] }) : void 0
                    }
                  ) })
                ]
              }
            )
          ] })
        ]
      }
    );
  }
  function Ul(b) {
    var R, V, te;
    if (Fe === "tag") {
      const re = b;
      return /* @__PURE__ */ a(
        Qp,
        {
          tag: re,
          displayMode: gn === "list" ? "list" : "grid",
          focused: re.id === pt,
          selected: xt.has(re.id),
          setRef: (Y) => {
            Y ? Bt.current.set(re.id, Y) : Bt.current.delete(re.id);
          },
          onFocus: () => wt(re.id),
          onToggle: () => {
            W((Y) => Va(Y, re.id)), M(re.id, !1);
          },
          onOpen: () => window.open(`/tag/${re.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        re.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Wp,
      {
        video: vl(q, se, oe.ids),
        showTagBins: ((V = (R = se == null ? void 0 : se.presentation) == null ? void 0 : R.annotations) == null ? void 0 : V.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: gn,
        cardsScroll: bo,
        focused: q.id === pt,
        selected: xt.has(q.id),
        setRef: (re) => {
          re ? Bt.current.set(q.id, re) : Bt.current.delete(q.id);
        },
        onFocus: () => wt(q.id),
        onToggle: () => W((re) => Va(re, q.id)),
        onPreview: () => {
          he || (wt(q.id), lt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Vp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Va(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Jp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Hp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Qp({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: o,
  onFocus: i,
  onToggle: s,
  onOpen: c,
  onNavigate: l
}) {
  const f = $(null), d = Nn(
    (p) => {
      f.current = p, o(p);
    },
    [o]
  );
  return Ct(() => {
    var h;
    const p = (h = f.current) == null ? void 0 : h.querySelector(
      'button[data-dq-selection], button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    p && (p.dataset.dqSelection = "", p.setAttribute("aria-label", r ? `Deselect ${e.name}` : `Select ${e.name}`));
  }), /* @__PURE__ */ a(
    "article",
    {
      ref: d,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${r ? ", selected" : ""}`,
      onFocus: i,
      onClick: (p) => {
        i(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${r ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ a(
        rd,
        {
          tag: e,
          selected: r,
          onSelect: s,
          onClick: c,
          onNavigate: l
        }
      ) : /* @__PURE__ */ u("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            "aria-label": r ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": r,
            onClick: (p) => {
              p.stopPropagation(), s();
            },
            children: r ? "✓" : ""
          }
        ),
        /* @__PURE__ */ a("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
        /* @__PURE__ */ a("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ a("span", { children: e.description || "" }),
        /* @__PURE__ */ a("span", { children: `${e.videoCount ?? 0} ${e.videoCount === 1 ? "video" : "videos"}` })
      ] })
    }
  );
}
function Wp({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: o,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: l,
  onPreview: f,
  onNavigate: d
}) {
  var v, y;
  const p = Il(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Ct(() => {
    const k = h.current;
    if (!k) return;
    const O = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), x = k.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    x && (x.id = B), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", B), O.classList.add("dq-card-link"));
    const C = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const D = k.querySelector(
      'button[title="Quick View"]'
    );
    D && D.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (k) => {
        h.current = k, s(k);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (k) => {
        c(), k.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          ad,
          {
            video: g,
            selected: i,
            onSelect: l,
            onNavigate: d,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ u("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (v = e.tags) == null ? void 0 : v.map((k) => /* @__PURE__ */ a("span", { children: k.name }, k.id)),
          !((y = e.tags) != null && y.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Yp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Yp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [o, i] = T(!1), [s, c] = T(!1), [l, f] = T(!1);
  return ee(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), c(!0);
      return;
    }
    const p = t ? d.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([w]) => i(w.isIntersecting),
      { root: p, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([w]) => c(w.isIntersecting && w.intersectionRatio >= 0.6),
      { root: p, threshold: [0, 0.6, 1] }
    );
    return h.observe(d), g.observe(d), () => {
      h.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), ee(() => {
    if (!o) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return ve(Zd(e.id), {
      signal: d.signal
    }).then((p) => {
      d.signal.aborted || f(p.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [o, e.id]), ee(() => {
    const d = r.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [l, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: l && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: Xd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Xp({
  video: e,
  review: t,
  details: n,
  selectedCount: r,
  pending: o,
  refreshing: i,
  error: s,
  canWrite: c,
  assessmentReady: l,
  trees: f,
  selected: d,
  hasPrevious: p,
  hasNext: h,
  onToggleSelected: g,
  onPrevious: w,
  onNext: N,
  onClose: v,
  onAction: y,
  findOpen: k,
  onFindOpenChange: O
}) {
  const x = $(null), B = Oa(), C = $(null), D = $(null), P = e.files[0], ne = Il(e), J = (L) => o || i || "steps" in L && L.steps.length > 0 && !c || ir(L) && !l;
  Ei({
    surface: "overlay",
    enabled: !k,
    actions: t.actions,
    onAction: (L, X) => {
      const Q = t.actions[L];
      Q && y(Q, X);
    },
    onFind: () => O(!0)
  }), ee(() => {
    var X;
    const L = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (X = x.current) == null || X.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = L;
    };
  }, []);
  function j(L) {
    var ae, H, S;
    if (L.key !== "Tab") return;
    const X = [
      ...((ae = x.current) == null ? void 0 : ae.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!X.length) {
      L.preventDefault(), (H = x.current) == null || H.focus();
      return;
    }
    const Q = X.indexOf(
      document.activeElement
    );
    L.shiftKey && Q <= 0 ? (L.preventDefault(), (S = X.at(-1)) == null || S.focus()) : !L.shiftKey && Q === X.length - 1 && (L.preventDefault(), X[0].focus());
  }
  function z(L) {
    if (k || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const X = L.key === "ArrowLeft" || L.key === "ArrowRight";
    if (L.altKey && !X) return;
    const Q = C.current, ae = L.currentTarget.querySelector("video");
    if (L.key === "Enter" || L.key === "Escape")
      L.repeat || v();
    else if (L.key === " " && Q)
      L.repeat || Q.toggle();
    else if (X && Q)
      Q.seekBy(
        (L.key === "ArrowLeft" ? -1 : 1) * (L.shiftKey ? 5 : L.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(L.key) && Q) {
      const H = D.current;
      if (!L.repeat && (H == null ? void 0 : H.videoId) === e.id) {
        const S = [P == null ? void 0 : P.duration, ae == null ? void 0 : ae.duration].find(
          (ue) => ue != null && Number.isFinite(ue) && ue > 0
        ) ?? 0, ce = e.parentVideoId != null, A = ce ? e.clipStartSec ?? 0 : 0, Z = (ce ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(Z) && Z > 0 && Number.isFinite(H.time) && Q.seekBy(A + Z * Number(L.key) / 10 - H.time);
      }
    } else if (L.key === "ArrowUp" || L.key === "ArrowDown")
      !L.repeat && !o && !i && (L.key === "ArrowUp" && p && w(), L.key === "ArrowDown" && h && N());
    else return;
    Vr(L);
  }
  function F(L) {
    const X = x.current, Q = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !X || !Q || !X.contains(Q) || Q.closest(".dq-player, .dq-find-action") || L.detail === 0 || X.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (k) return;
    let L = 0;
    const X = requestAnimationFrame(() => {
      L = requestAnimationFrame(() => {
        var ae;
        const Q = document.activeElement;
        (ae = x.current) != null && ae.isConnected && (!Q || Q === document.body || Q === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(X), cancelAnimationFrame(L);
    };
  }, [k, o, i, h, p, e.id, B]);
  const _ = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: x,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ne}`,
      className: `dq-preview${B ? " dq-preview-mobile" : ""}`,
      onKeyDown: j,
      onKeyDownCapture: z,
      onMouseDown: (L) => {
        L.target === L.currentTarget && v();
      },
      onClick: F,
      children: [
        /* @__PURE__ */ u("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ u("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "ArrowUp",
                title: "Previous video",
                disabled: !p || o || i,
                onClick: w,
                children: [
                  /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(At, { binding: "↑", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "ArrowDown",
                title: "Next video",
                disabled: !h || o || i,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(At, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(rc, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ne }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((L) => /* @__PURE__ */ a("li", { children: L.name }, L.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Actions apply to ",
                _
              ] })
            ] }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": d,
                disabled: i,
                onClick: g,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(Zr, {}) }),
                  "Selected"
                ]
              }
            ),
            /* @__PURE__ */ a(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": `Open ${ne} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a(ac, { "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": "Close preview",
                "aria-keyshortcuts": "Escape",
                title: "Close preview",
                onClick: v,
                children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ a(
            Qs,
            {
              autostart: !0,
              streamUrl: Go("video", e.id),
              posterUrl: is(e),
              format: P.format,
              audioCodec: P.audioCodec,
              duration: P.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (L) => {
                D.current = { videoId: e.id, time: L };
              },
              onPlaybackControlRegister: (L) => (C.current = L, () => {
                C.current === L && (C.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: is(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            zc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: J,
              busy: o || i,
              onApply: (L) => void y(L),
              onFind: () => O(!0),
              status: o ? `Applying action to ${_}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ a(
          Ti,
          {
            actions: t.actions,
            trees: f,
            isDisabled: J,
            onApply: (L, X) => {
              O(!1), y(L, X);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function Zp() {
  const e = await ve("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let r = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (r = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([r], { type: "application/json" })
  ), i = document.createElement("a");
  i.href = o, i.download = "data-quality-browser-recovery.json", i.click(), URL.revokeObjectURL(o);
}
function Gs({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(gd, { className: "dq-spin" }),
    e
  ] });
}
function Ks({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Un, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const sh = { components: { DataQualityPage: zp } };
export {
  zp as DataQualityPage,
  sh as default,
  cr as objectFiltersEqual
};
