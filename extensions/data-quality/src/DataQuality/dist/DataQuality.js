var Bl = Object.defineProperty;
var Gl = (e, t, n) => t in e ? Bl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Qo = (e, t, n) => Gl(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as ge, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Ct, useMemo as qe, useCallback as Nn, useSyncExternalStore as ro, useId as rt, createContext as Kl, useContext as zl, Fragment as ao } from "react";
import { useKeySequence as Vl, EntityReferenceMultiSelector as sr, SortableList as Bs, TagBadge as Jl, EntityReferenceSelector as Wo, EntityDetailTabs as Hl, FilterDialog as Gs, VIDEO_CRITERIA as ii, DetailListToolbar as va, PERFORMER_CRITERIA as io, AUDIO_CRITERIA as Ks, NarrativeText as Ql, AUDIO_SORT_OPTIONS as Wl, VIDEO_SORT_OPTIONS as zs, AudioPlayer as Yl, VideoPlayer as Vs, formatDuration as Js, getResolutionLabel as Xl, ConfirmDialog as Zl, TAG_CRITERIA as ed, TAG_SORT_OPTIONS as td, TagTile as nd, VideoCard as rd } from "@cove/runtime/components";
import { Search as Ea, Flag as Gn, Check as Zr, Pencil as Yr, Ban as Qa, ChevronDown as oo, Plus as Aa, Pin as Hs, GripVertical as Qs, AlertTriangle as Un, Copy as Ws, Trash2 as oi, X as Ca, Mic as ad, Users as Ys, Tag as Xs, Headphones as Zs, Film as si, ChevronLeft as Ta, MoreHorizontal as id, RectangleHorizontal as od, LayoutGrid as so, ChevronRight as ec, Save as sd, RotateCcw as cd, Layers as Yo, Undo2 as ld, RefreshCw as dd, ExternalLink as tc, SkipForward as ud, Upload as fd, Download as nc, ArrowUp as pd, ArrowDown as hd, Loader2 as md, List as gd, Grid3X3 as bd } from "@cove/runtime/lucide-react";
import { extensionFetch as yd } from "@cove/runtime/api";
import { createPortal as wd } from "react-dom";
const co = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, lo = Object.keys(
  co
);
function Na(e) {
  return e === "excludes" || e === "excludesAll";
}
function uo(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function rc(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function vd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const Wa = { min: 115, max: 625 }, Nd = (e) => Math.min(Wa.max, Math.max(Wa.min, e)), ac = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ae(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function fo(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return fo(Le(e));
}
function qd(e) {
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
], ci = [
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
const ir = "none";
function Rr(e) {
  return typeof e == "string" && ar.includes(e);
}
function po(e) {
  const t = e.shortcut;
  return Rr(t) || t === ir ? t : "auto";
}
function ic(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const l = po(s);
    if (l !== ir) {
      if (l !== "auto") {
        if (!n.has(l)) {
          n.set(l, c), t[c] = l;
          return;
        }
        r.add(c);
      }
      i.push(c);
    }
  });
  const o = ar.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const l = o[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function Sd(e, t, n) {
  const { keys: r, actionOn: i } = ic(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Rr(n)) {
    const c = i.get(n), l = r[t];
    c !== void 0 && c !== t && o.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...o.values()].filter(Rr));
  return e.map((c, l) => {
    const f = o.has(l) ? o.get(l) : Rr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Sa(e) {
  var n;
  return Ae(e) && !sc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !qd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Le(e) !== "tag" && e.actions.some(
    (r) => ho(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => Kn(r, Le(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const kd = {
  video: 1e3,
  audio: 250
};
function tn(e, t = "video") {
  const n = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(kd[t], n(e.perPage, 40))
    )
  };
}
function Xo(e, t, n) {
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
    ].includes(r.mode) && r.tagIds.length > 0 && r.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !ho(e) : !1;
}
function Ed(e) {
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
function oc(e) {
  return "steps" in e && e.steps.length > 0;
}
function or(e) {
  return "steps" in e ? e.steps.some((t) => Bn(t.mode)) : !1;
}
function ho(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Bn(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ia(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || ac.includes(n.entityType)) && (!Ed(n.entityType) || sc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Ad(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Kn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
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
function Ad(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= Wa.min && n.cardSize <= Wa.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function Zo(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const i of r)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function Cd(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function es(e, t, n) {
  return { ...structuredClone(e), id: n, name: Cd(e.name, t) };
}
function sc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && lo.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Td(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Td(e) {
  if (!Array.isArray(e)) return !1;
  const t = (r) => Number.isSafeInteger(r) && r > 0, n = /* @__PURE__ */ new Set();
  return e.every((r) => {
    if (!r || typeof r != "object" || Array.isArray(r)) return !1;
    const { tagId: i, categoryTagId: o } = r;
    if (!t(i) || o !== void 0 && !t(o))
      return !1;
    const s = `${i}:${o ?? ""}`;
    return n.has(s) ? !1 : (n.add(s), !0);
  });
}
function ts(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function ns(e, t, n, r) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!r && t.includes(n)) return n;
  const i = Math.max(0, e.indexOf(n));
  if (r) {
    for (const o of e.slice(i + 1))
      if (t.includes(o)) return o;
    if (t.includes(n)) {
      for (const o of e.slice(0, i).reverse())
        if (t.includes(o)) return o;
      return n;
    }
  }
  return t[Math.min(i, t.length - 1)];
}
function Id(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    r ? n.delete(i) : n.add(i);
  return n;
}
function $d(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function fn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Rd(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Od(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Md(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Fd(e, t) {
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
const cc = "ext:com.midnightrider.data-quality:configuration", xd = "ext:cove-data-quality:video-reviews", Li = "ext:com.midnightrider.data-quality:progress";
class Ya extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    Qo(this, "remote");
    this.remote = r;
  }
}
function lc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof Ya ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const $a = /* @__PURE__ */ new Map(), ja = /* @__PURE__ */ new Map(), Tr = (e, t) => e.includes("*") || e.includes(t), Xa = (e) => ve(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Pd = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Di(e) {
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
    deletedIds: Di(t.deletedIds),
    importedIds: Di(t.importedIds)
  };
}
function Ld(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Ia(o);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Di(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function dc(e) {
  const t = await ve("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function mo(e, t) {
  const n = (ja.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ja.set(e, n), n.finally(() => {
    ja.get(e) === n && ja.delete(e);
  }).catch(() => {
  }), n;
}
let ma = null;
function Dd() {
  if (ma) return ma;
  const e = _d();
  return ma = e, e.finally(() => {
    ma === e && (ma = null);
  }).catch(() => {
  }), e;
}
async function _d() {
  const e = await ve("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return mo(t, () => jd(e, t));
}
async function jd(e, t) {
  var h;
  const n = String(e.user.id), r = Tr(e.permissions, "savedfilters.read"), i = r && Tr(e.permissions, "savedfilters.write"), o = r ? (await Xa(cc)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (o.length > 1) {
    const g = (y) => {
      const { revision: N, ...v } = zr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (o.some((y) => g(y) !== g(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await ve(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? zr(o[0].uiOptions) : Pd();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && l && (s = zr(l));
  let d = !o.length;
  if (o.length && f && l) {
    const g = zr(l);
    if (g.reviews.some((N) => {
      const v = s.reviews.find((w) => w.id === N.id);
      return v && JSON.stringify(v) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...g.deletedIds])
    ];
    s = {
      ...s,
      reviews: Zo(s.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), y = Ld(n);
    if (o.length && y.reviews.some((k) => {
      const M = s.reviews.find((x) => x.id === k.id);
      return M && JSON.stringify(M) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Xa(xd)).flatMap(
      (k) => Ia(k.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (k) => !y.reviews.some((M) => M.id === k)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Zo(
        y.reviews,
        s.reviews,
        N.filter(
          (k) => !y.known.includes(k.id) && !s.importedIds.includes(k.id)
        )
      ).filter((k) => !w.has(k.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((k) => k.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== g);
  }
  const p = {
    userId: n,
    recordId: (h = o[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: i,
    durable: i
  };
  if ($a.set(t, p), d && i) {
    const g = s;
    o.length && (p.config = zr(o[0].uiOptions)), await uc(t, g), s = p.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(s)), !r && (!c || f) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!r) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
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
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function uc(e, t) {
  const n = $a.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await dc(n), n.recordId != null) {
      const o = await ve(
        `/api/savedfilters/${n.recordId}`
      ), s = zr(o.uiOptions);
      if (s.revision !== n.config.revision)
        throw new Ya(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const i = await ve(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: cc,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(r)
        })
      }
    );
    n.recordId = i.id;
  } else
    localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = r, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(r)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
const Za = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), Ud = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Za(e, n) !== Za(t, n)
);
function Bd(e, t) {
  return mo(e, async () => {
    var r;
    const n = $a.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    for (let i = 1; ; i++) {
      const o = n.config.reviews, s = t(o);
      if (s === o) return o;
      Ia(JSON.stringify(s));
      const c = o.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
      try {
        return await uc(e, {
          ...n.config,
          reviews: s,
          deletedIds: [
            .../* @__PURE__ */ new Set([...n.config.deletedIds, ...c])
          ].filter((l) => !s.some((f) => f.id === l))
        }), s;
      } catch (l) {
        const f = l instanceof Ya ? l.remote : void 0;
        if (!f || i >= 3) throw l;
        const d = Ud(o, s).find(
          (p) => Za(o, p) !== Za(f.reviews, p)
        );
        if (d !== void 0) {
          const p = (r = s.find((h) => h.id === d) ?? o.find((h) => h.id === d)) == null ? void 0 : r.name;
          throw new Ya(
            `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.`
          );
        }
        n.config = f;
      }
    }
  });
}
function rs(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && !Number.isFinite(t.cardSize) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t.cardSize === null ? t : { ...t, cardSize: Nd(t.cardSize) };
}
async function Gd(e, t) {
  const n = $a.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? rs(r) : null;
  if (!n.readable) return i;
  const o = (await Xa(Li)).find(
    (c) => c.name === t
  ), s = o ? rs(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Kd(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return mo(r, async () => {
    const i = $a.get(e);
    if (!(i != null && i.writable)) return;
    await dc(i);
    const o = (await Xa(Li)).find(
      (s) => s.name === t
    );
    await ve(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Li,
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
const zd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Vn(e) {
  return zd[e];
}
const ei = "confirmed_absent_tags", go = "Confirmed absent tags", li = "confirmed_absent_occurrence_tags", fc = {
  key: ei,
  label: go,
  type: "tag",
  subject: "tag assessments"
}, bo = {
  key: li,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Vd = {
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
      t === "modifier" && typeof n == "string" ? Vd[n] ?? n : t === "key" && typeof n == "string" && [
        ei,
        li
      ].includes(n.toLowerCase()) ? n.toLowerCase() : zn(n)
    ])
  ) : e;
}
async function pc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await yd(e, { ...t, headers: r });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let s = i.statusText || `Request failed (${i.status}).`;
    try {
      const c = await i.json();
      s = c.message || c.detail || c.error || s;
    } catch {
    }
    throw new Error(s);
  }
  if (i.status === 204 || i.status === 205) return;
  const o = await i.text();
  return o ? JSON.parse(o) : void 0;
}
async function ve(e, t = {}) {
  return await pc(e, t, "fail");
}
function Jd(e, t = {}) {
  return pc(e, t, "null");
}
const Hd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Qd = 0;
function ti(e, t) {
  return ve(
    `/api/${dr(e)}/${t}?dqRead=${Hd}-${++Qd}`,
    { cache: "no-store" }
  );
}
function hc(e, t) {
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
    { method: "POST", signal: n, body: hc(e, t) }
  );
}
async function mc(e, t, n) {
  return (await ve(
    `/api/${dr(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: hc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Ei(e, t, n) {
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
function Wd(e) {
  return ve("/api/taggroups", { signal: e });
}
function _i(e, t, n = 1280) {
  return `/api/${dr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ji(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function as(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Yd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Xd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function di(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ve(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await ve("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          zn({
            findFilter: { page: i, perPage: 1e3, sort: "id", direction: "asc" },
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
      for (const s of o.items) n.add(s.id);
      if (i * 1e3 >= o.totalCount) break;
      if (!o.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded."
        );
    }
  }
  return [...n];
}
async function yo(e, t) {
  const n = lr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await di(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Zd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function wo(e, t) {
  const r = (await ve("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Zd(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Vn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function gc(e, t) {
  const n = await wo(e, t);
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
function bc(e = "video") {
  return wo(fc, e);
}
function eu(e = "video") {
  return gc(fc, e);
}
function yc(e = "video") {
  return wo(bo, e);
}
function tu(e = "video") {
  return gc(bo, e);
}
function ni(e) {
  return [...new Set(e)];
}
function wc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === li
  ), i = r === void 0 ? [] : n[r];
  return ni(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function nu(e) {
  let t;
  try {
    t = await yc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${bo.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function ru(e, t, n, r, i, o) {
  await ve(`/api/${dr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: ni(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function au(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${go} custom field is not available.`
      );
    return { customFields: { [n]: r }, customFieldMode: o };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: r, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: r, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: r, tagMode: "ADD", ...i("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: r, tagMode: "REMOVE", ...i("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...i("REMOVE") };
  }
}
async function vc(e, t, n) {
  if (!Kn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Vn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (or(t)) {
    let l;
    try {
      l = await bc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${go} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const i = ni(n), o = (await yo(t)).map((l) => ({
    mode: l.mode,
    tagIds: ni(l.tagIds)
  })), c = [
    ...o.filter((l) => !Bn(l.mode)),
    ...o.filter((l) => Bn(l.mode))
  ].map(
    (l) => au(l, i, r)
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
function is(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function os(e, t) {
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
    const o = is(e[n]), s = is(t[r]);
    if (o !== s) return o < s ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Nc(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || os(e.tagGroupName, t.tagGroupName) || os(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Or(e) {
  return [...e].sort(Nc);
}
const Ui = /* @__PURE__ */ new Map();
function ou(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function vo(e, t, n) {
  const r = lr(e), i = [], o = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      o.push(h);
      continue;
    }
    const g = h.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: g.filter((y) => !r.has(y)) });
  }
  const s = [
    ...o.filter((h) => !Bn(h.mode)),
    ...o.filter((h) => Bn(h.mode))
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
    unresolvedTrees: [...new Set(i)]
  };
}
function su(e) {
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
function qc(e) {
  return Sc(ou(e));
}
function Sc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return ee(() => (o.current = !0, () => {
    o.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), di([c]).then(
        (l) => {
          o.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          i.current.delete(c);
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
    const i = Et(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function ss(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Et(t.group) !== "");
}
function kc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Ec(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Ac(e) {
  return lr(e).size > 0 || Ec(e).size > 0;
}
function cu(e) {
  return Fr(e).filter(
    (t) => !t.actions.some((n) => Ac(e[n]))
  );
}
function Bi(e, t) {
  const n = kc(t), r = new Set(t.absent);
  return Fr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const l = [...lr(e[c])], f = [...Ec(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function Gi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function lu(e, t, n) {
  const r = { ids: [...kc(t)], absent: t.absent }, i = vo(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const Hr = "review";
function du(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function uu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Ir(e, t) {
  const n = new Set(du(e));
  return t.filter((r) => n.has(r.id));
}
function cs(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Ir(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? i(Hr, () => ({
        key: Hr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
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
  const o = [...r.values()];
  return [
    ...o.filter((s) => s.key === Hr),
    ...o.filter((s) => s.key !== Hr)
  ];
}
function Ki(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function No(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Ki(s.key, s.members, i) && !(c > o && Ki(i.key, i.members, s))
  ), r = /* @__PURE__ */ new Map();
  return t.forEach((i, o) => {
    !r.has(i.key) && !n(i, o) && r.set(i.key, {
      key: i.key,
      name: i.name,
      tagIds: i.members,
      flags: [],
      mixed: i.tags
    });
  }), [...r.values()];
}
function fu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Ki(n.key, n.tagIds ?? [], e)
  );
}
function Cc(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.flat()) {
    const i = t.get(r.key);
    if (!i) {
      t.set(r.key, { ...r, flags: [...r.flags] });
      continue;
    }
    for (const o of r.flags) i.flags.includes(o) || i.flags.push(o);
    i.mixed.length || (i.mixed = r.mixed), i.unresolved && !r.unresolved && delete i.unresolved, i.tagIds !== null && r.tagIds !== null && (i.tagIds = [.../* @__PURE__ */ new Set([...i.tagIds, ...r.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((r) => r.key === Hr),
    ...n.filter((r) => r.key !== Hr)
  ];
}
function pu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const i of r.tagIds)
        for (const o of r.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function Tc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = pu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function hu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => Tc(i, r, n))
  );
}
function mu(e, t, n) {
  return t.filter((r) => r.tagIds !== null && Tc(e, r, n));
}
function gu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function qo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [gu(e.mixed)] : []
  ];
}
function bu(e) {
  const t = qo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function yu(e, t, n) {
  const r = Ir(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const zi = "-", ls = "Ctrl+a", wu = "Ctrl/⌘A", vu = ["f", "g", "k", "n", "m", ",", "."], Ai = "Shift+", Ic = {
  ",": [";", "<"],
  ".": [":", ">"]
}, Nu = new Set(Object.values(Ic).flat()), ds = { Comma: ",", Period: "." };
function qu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(ds, t.code) ? ds[t.code] : void 0;
}
function ea(e) {
  return qe(() => ic(e), [e]);
}
function So({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = ea(n), c = $({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  Ct(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const l = !!i && n.length > 0, f = e === "local" && !!o, d = ar.filter(
    (h) => s.actionOn.has(h) || vu.includes(h)
  ).join(" "), p = qe(() => {
    const h = (N, v) => {
      var k, M;
      const w = c.current;
      if (N === ls) (k = w.onSelectAll) == null || k.call(w);
      else if (N === zi) (M = w.onFind) == null || M.call(w);
      else {
        const x = Nu.has(N), B = x || N.startsWith(Ai), C = x ? qu(v) : B ? N.slice(Ai.length) : N, D = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        D !== void 0 && w.onAction(D, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(ls, "local")), l && y.push(g(zi));
    for (const N of d ? d.split(" ") : []) {
      const v = Ic[N];
      y.push(g(N), ...(v ?? [`${Ai}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, d, l, f]);
  Vl(p, t);
}
const Su = {
  find: zi,
  selectAll: wu
};
function ko() {
  return Su;
}
const ku = 600 * 1e3, Eo = /* @__PURE__ */ new Map(), $c = /* @__PURE__ */ new Map(), nr = /* @__PURE__ */ new Map();
function Rc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = $c.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Oc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && $c.set(e.tagGroupId, e.tagGroupSortOrder), Eo.set(e.id, { tag: e, at: Date.now() });
}
function Mc(e) {
  const t = Eo.get(e);
  if (!(!t || Date.now() - t.at > ku))
    return Rc(t.tag);
}
function Fc(e) {
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
function Vi(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Oc(Fc({ ...n, name: r }));
  }
}
function Eu(e) {
  const t = nr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ve(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, p;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (nr.get(e) === r && nr.delete(e), !o) return null;
        const s = Fc({ ...i, id: e, name: o }), c = (p = Eo.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Oc(f), Rc(f);
      },
      () => (nr.get(e) === r && nr.delete(e), null)
    )
  };
  return nr.set(e, r), r;
}
function us() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ci(e) {
  const t = {};
  for (const n of e) {
    const r = Mc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Au(e, t) {
  if (t != null && t.aborted) return Promise.reject(us());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = Mc(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = Eu(i);
      s.waiters += 1, r.push({ id: i, entry: s });
    }
  }
  return r.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && nr.get(f) === d && (nr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), o(us()));
    };
    t == null || t.addEventListener("abort", l, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: d }) => d.promise.then((p) => [f, p])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", l), c();
        for (const [d, p] of f) n[d] = p;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function xc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ra(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: Ci(Ti(t))
  }));
  return ee(() => {
    const i = Ti(t), o = Ci(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return Au(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ci(Ti(t));
}
function ta(e) {
  const t = Ra(e);
  return qe(() => xc(t), [t]);
}
function Ti(e) {
  return e ? e.split(",").map(Number) : [];
}
const Cu = "(max-width: 760px)";
function Pc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Nn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return ro(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Oa() {
  return Pc(Cu);
}
function Tu(e, t, n = !1) {
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
  const i = lr(e), o = (s) => i.has(s) || [...i].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => Tu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function ui(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ao({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const l = Oa(), [f, d] = T(""), [p, h] = T(0), g = $(null), y = $(null), N = $(null), v = $(null), w = $(null), k = $(/* @__PURE__ */ new Set()), M = rt(), x = ta(qe(() => ui(e), [e])), B = ea(e), C = qe(() => {
    const j = f.trim().toLocaleLowerCase(), z = (F) => F ? ar.indexOf(F) : ar.length;
    return e.map((F, _) => ({ action: F, index: _, key: B.keys[_] })).sort((F, _) => z(F.key) - z(_.key)).filter((F) => !j || F.action.label.toLocaleLowerCase().includes(j));
  }, [e, B, f]), D = C.length ? Math.min(p, C.length - 1) : -1, P = (j) => `${M}-option-${j}`;
  Ct(() => {
    var j, z, F;
    return v.current = document.activeElement, w.current = ((z = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : z.closest('[role="dialog"]')) ?? null, (F = g.current) == null || F.focus({ preventScroll: !0 }), () => {
      var L;
      const _ = v.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((L = w.current) != null && L.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var j, z, F;
    D < 0 || (F = (z = (j = y.current) == null ? void 0 : j.querySelector(`[id="${P(C[D].index)}"]`)) == null ? void 0 : z.scrollIntoView) == null || F.call(z, { block: "nearest" });
  }, [D, C]);
  function ne(j, z) {
    !j || r != null && r(j.action) || s(j.action, i && z);
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
                "aria-controls": `${M}-list`,
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
              ref: y,
              id: `${M}-list`,
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
                  onClick: (F) => ne(j, F.shiftKey || o && oc(j.action)),
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
            i && /* @__PURE__ */ u("span", { children: [
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
function Lc() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (r) => {
    r !== e && (e = r, t.forEach((i) => i()));
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
function Co(e) {
  return ro(e.subscribe, e.get, e.get);
}
function Dc(e, t) {
  const n = $(t);
  Ct(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function _c(e, t) {
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
const Iu = [], Ji = ci.map(
  (e, t) => ({ indent: t, keys: e })
), fs = Ji.length - 1;
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
function jc(e) {
  return ci.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Uc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(ge, { children: r.map((i, o) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === r.length - 1 && n
  ] }, o)) });
}
function Bc({
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
function $u({
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
      children: (t ?? e).map((i) => {
        const o = t ? i.answers : null, s = o ? o.length ? "answered" : "open" : "unknown", c = o == null ? void 0 : o.map((d) => n[d].label).join(", "), l = r(i), f = s === "answered" ? `${i.name}: ${c}` : s === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ u(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": l ? !0 : void 0,
            title: l ? `${f}. Needs attention: ${l}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: i.name }),
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
          i.key
        );
      })
    }
  );
}
function Ru({ checked: e, onChange: t }) {
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
function Ou({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: i,
  preview: o,
  onApply: s,
  onFind: c,
  findDisabled: l,
  paused: f = !1,
  waitForGroups: d = !1,
  attention: p = Iu,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = ko(), N = ea(e), v = Oa();
  Dc(o, v);
  const w = rt(), k = ta(
    qe(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), M = Ji.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), x = M.includes(Ji[fs]), B = e.length - N.actionOn.size, C = qe(
    () => d && !f ? Fr(e) : [],
    [d, f, e]
  ), D = qe(
    () => C.length && r ? Bi(e, r) : null,
    [C, e, r]
  ), P = new Map(
    Gi(D ?? []).flatMap(
      (S) => S.actions.filter((ce) => Ac(e[ce])).map((ce) => [ce, S.name])
    )
  ), ne = qe(
    () => e.map((S) => f ? [] : mu(S, p, i)),
    [e, p, i, f]
  ), J = (S) => S.map(bu).join("; "), j = ne.map(J), z = C.length > 0 && /* @__PURE__ */ a(
    $u,
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
    const ce = Pr(e[S], k, [], i).map((ue) => ue.text).join(", "), A = P.get(S), X = j[S];
    return [
      ce,
      A === void 0 ? "" : `${A}: not answered yet`,
      X ? `Needs attention: ${X}` : ""
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
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), Y = (S) => {
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
    const X = t(A), ue = `${w}-effect-${S}`;
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
          disabled: X,
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
    const S = jc(N), ce = (A) => {
      const X = e[A], ue = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": ue,
          "aria-describedby": `${w}-effect-${ue}`,
          "data-group-open": P.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(X),
          onClick: (me) => {
            o.clear(X), s(X, me.shiftKey || h && oc(X));
          },
          ...f ? {} : _c(o, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            Ba(X) && " ",
            Ba(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
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
              ps,
              {
                actions: e,
                keyMap: N,
                names: k,
                tags: r,
                trees: i,
                preview: o,
                findKey: y.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(Ru, { checked: h, onChange: g })
          ] }),
          z,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Uc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Bc,
                {
                  extra: B,
                  findKey: y.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: F(A) }, A)) })
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
      "aria-keyshortcuts": y.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(At, { binding: y.find }),
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
            ps,
            {
              actions: e,
              keyMap: N,
              names: k,
              tags: r,
              trees: i,
              preview: o,
              findKey: y.find
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
        M.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(Y),
          S.indent === fs && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(At, { binding: y.find }),
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
function ps({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const l = Co(o), f = l ? e.indexOf(l) : -1;
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
  const d = t.keys[f], p = r && l.steps.length ? vo(l, r, i) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(At, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Pr(l, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Gc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: l,
  keyHints: f,
  notices: d,
  status: p,
  className: h = "",
  paused: g = !1
}) {
  const y = ko(), N = ea(e), v = Oa(), w = rt(), k = ta(qe(() => ui(e), [e])), [M] = T(() => Lc());
  Dc(M, v);
  const x = $(null), B = Mu(x, e, !v), C = jc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), P = e.length - D.length, ne = (F) => Pr(F, k, t, n).map((_) => _.text).join(", "), J = (F) => ({
    onMouseEnter: () => M.set(F),
    onMouseLeave: () => M.clear(F),
    onFocus: () => M.set(F),
    onBlur: (_) => {
      _.currentTarget.contains(_.relatedTarget) || M.clear(F);
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
        "aria-describedby": `${w}-effect-${F}`,
        disabled: g || r(_),
        onClick: () => {
          M.clear(_), o(_);
        },
        ...g ? {} : _c(M, _),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: _.label })
      },
      _.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: x,
      className: `dq-action-bar${v ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ a("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ a("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: `dq-bar-tiles${v ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              v && e.length > 0 && /* @__PURE__ */ a(
                Uc,
                {
                  groups: C,
                  renderAction: z,
                  find: /* @__PURE__ */ a(
                    Bc,
                    {
                      extra: P,
                      findKey: y.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((F, _) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                F.map((L) => {
                  const Y = e[L], Q = N.keys[L];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${w}-effect-${L}`,
                      disabled: g || r(Y),
                      onClick: () => o(Y),
                      ...g ? {} : J(Y),
                      children: [
                        Q && /* @__PURE__ */ a(At, { binding: Q }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: Y.label })
                      ]
                    },
                    Y.id
                  );
                }),
                _ === C.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": P > 0 ? `Find action, ${P} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(At, { binding: y.find, hidden: !0 }),
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
          Fu,
          {
            actions: e,
            keyMap: N,
            preview: M,
            names: k,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((F) => /* @__PURE__ */ a("span", { id: `${w}-effect-${F}`, children: ne(e[F]) }, e[F].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Mu(e, t, n) {
  const [r, i] = T(!1);
  return Ct(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(o), h = parseFloat(p.columnGap) || 0, g = o.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((P) => P.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, M = (D) => y.map((P) => {
        let ne = 1, J = 0;
        for (const j of P)
          J > 0 && J + v + j > D ? (ne += 1, J = j) : J += (J > 0 ? v : 0) + j;
        return ne;
      }), x = (D) => Math.max(1, D.reduce((P, ne) => P + ne, 0)), B = M(g), C = x(M(g - k));
      i(
        1 + x(B) < C || 1 + x(B) === C && B.every((D) => D === 1)
      );
    }, l = new ResizeObserver(c);
    l.observe(o);
    for (const p of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
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
function Fu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = Co(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(At, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Pr(c, r, i, o).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const hs = 1e3;
async function xu(e, t, n) {
  const r = await ve(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
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
              perPage: hs,
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
    for (const d of f.items) i.set(d.id, d);
    if (l * hs >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = _e(e), c = Ae(e) ? await Lu(
    s,
    o.map((l) => l.id),
    n
  ) : o.map((l) => (s === "audio" ? l.audioCount : l.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: o.map((l, f) => ({ id: l.id, name: l.name, uses: c[f] })).sort(
      (l, f) => f.uses - l.uses || l.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Pu(e) {
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
async function Lu(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            r[c] = (await ve(
              `/api/${dr(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: Pu(t[c])
              }
            )).count;
          }
        } catch (c) {
          throw i.abort(), c;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", o);
  }
  return i.signal.throwIfAborted(), r;
}
function Du(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function _u(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function ju(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of lr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Uu(e, t, n) {
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
function Bu(e, t) {
  var r;
  const n = Et(e);
  return ((r = Fr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Gu = (e) => e instanceof Error ? e.message : "Request failed.";
function Ku({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), g = $(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const F of g.current.values()) F.abort();
    },
    []
  );
  const y = Vn(_e(t)), N = Ae(t), v = N ? "performer" : y.one;
  function w(F) {
    var L;
    (L = g.current.get(F)) == null || L.abort();
    const _ = new AbortController();
    g.current.set(F, _), l((Y) => ({ ...Y, [F]: { status: "loading" } })), xu(t, F, _.signal).then(
      (Y) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [F]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [F]: { status: "failed", message: Gu(Y) }
        }));
      }
    );
  }
  function k(F) {
    var ae;
    const _ = o.filter((H) => !F.includes(H));
    for (const H of _)
      (ae = g.current.get(H)) == null || ae.abort(), g.current.delete(H);
    const L = (H) => {
      const S = c[H];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, Y = new Set(F.flatMap(L)), Q = _.flatMap(L).filter((H) => !Y.has(H));
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
    for (const H of F) o.includes(H) || w(H);
  }
  const M = o.flatMap((F) => {
    const _ = c[F];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), x = M.length === o.length, B = o.some(
    (F) => {
      var _;
      return (((_ = c[F]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Du(M).map((F) => [F.parent.id, F])
  ), D = _u(M), P = new Map(M.map((F) => [F.parent.id, F.parent.name])), ne = ju(t.actions), J = (F) => f[F] ?? !ne.has(F), j = x ? [...C.values()].flatMap((F) => {
    const _ = Bu(F.parent.name, t.actions);
    return F.children.filter((L) => J(L.id)).map((L) => ({ child: L, answerGroup: _ }));
  }) : [], z = (F, _) => d((L) => ({
    ...L,
    ...Object.fromEntries(F.children.map((Y) => [Y.id, _]))
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
        values: o,
        onChange: k,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((F) => {
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
              onClick: () => w(F),
              children: "Retry"
            }
          )
        ] }, F);
      const L = C.get(F);
      if (!L) return null;
      const Y = L.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
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
            Y,
            " tree"
          ] }),
          L.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(ge, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Y}`,
                  onClick: () => z(L, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Y}`,
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
                    Q.uses === 1 ? y.one : y.many
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
              ({ child: F, answerGroup: _ }) => Uu(
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
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function zu(e, t, n, r) {
  const i = Et(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: Et(c) === i });
    return o;
  }
  const s = Et(r);
  for (const c of t)
    Et(c).includes(s) && o.push({ kind: "group", name: c, selected: Et(c) === i });
  return s && !t.some((c) => Et(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Vu(e) {
  return e.kind === "group" ? `group:${Et(e.name)}` : e.kind;
}
function Ju(e) {
  const { group: t, ...n } = e;
  return n;
}
const Hu = /* @__PURE__ */ new Set([
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
]), Qu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ga = 4, ms = 240;
function Wu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Yu(e, t, n, r) {
  for (const o of r) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function Xu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = rt(), s = rt(), c = rt(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), y = $(!1), N = $(!1), [v, w] = T(!1), [k, M] = T(null), [x, B] = T(null), [C, D] = T(!1), P = e.group ?? "", ne = qe(
    () => zu(t, n, P, k),
    [t, n, P, k]
  ), J = ne.map(Vu), j = x === null ? -1 : J.indexOf(x), z = (A) => `${s}-option-${A}`, F = (A) => i(A ? { ...e, group: A } : Ju(e)), _ = () => {
    var X;
    const A = ((X = d.current) == null ? void 0 : X.value) ?? P;
    A.trim() !== A && F(A.trim());
  };
  function L(A) {
    M(null), B(A), w(!0);
  }
  const Y = (A) => {
    var X, ue;
    return A instanceof Node && (((X = l.current) == null ? void 0 : X.contains(A)) || ((ue = p.current) == null ? void 0 : ue.contains(A))) === !0;
  };
  function Q() {
    var A, X;
    (A = p.current) != null && A.contains(document.activeElement) && ((X = h.current) == null || X.focus({ preventScroll: !0 })), w(!1), M(null), B(null), D(!1);
  }
  function ae(A) {
    A.kind === "group" && A.selected && k === null || F(A.kind === "none" ? "" : A.name), Q();
  }
  function H() {
    const A = f.current, X = p.current;
    if (!A || !X) return;
    const ue = A.getBoundingClientRect(), me = window.visualViewport, K = (me == null ? void 0 : me.offsetTop) ?? 0, Ee = (me ? me.offsetTop + me.height : window.innerHeight) - ue.bottom - Ga, ke = ue.top - K - Ga, Ne = Math.min(X.scrollHeight, ms), Je = Ee < Ne && ke > Ee;
    X.style.left = `${ue.left}px`, X.style.width = `${ue.width}px`, X.style.top = `${Je ? ue.top - Ga : ue.bottom + Ga}px`, X.style.transform = Je ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(ms, Je ? ke : Ee))}px`, Yu(A, X, ue, g.current) || Q();
  }
  Ct(() => {
    var A;
    v && (f.current && (g.current = Wu(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
  }, [v]), Ct(() => {
    v && H();
  }), ee(() => {
    if (!v) return;
    const A = () => H(), X = (K) => {
      Y(K.target) || Q();
    }, ue = [...g.current, window], me = window.visualViewport;
    for (const K of ue) K.addEventListener("scroll", A);
    return window.addEventListener("resize", A), me == null || me.addEventListener("resize", A), me == null || me.addEventListener("scroll", A), document.addEventListener("pointerdown", X), () => {
      for (const K of ue) K.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), me == null || me.removeEventListener("resize", A), me == null || me.removeEventListener("scroll", A), document.removeEventListener("pointerdown", X);
    };
  }, [v]), ee(() => {
    var A, X, ue;
    j >= 0 && ((ue = (X = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : X.scrollIntoView) == null || ue.call(X, { block: "nearest" }));
  }, [j]);
  function S(A) {
    if (fn(A)) return;
    const X = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (X && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), L(A.altKey ? null : Et(P) ? `group:${Et(P)}` : "none");
      return;
    }
    if (v)
      if (X) {
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
    if (A.key === "Dead" || A.key === "Process" || fn(A) && !Qu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const me = d.current;
      me && (me.focus(), me.setSelectionRange(me.value.length, me.value.length));
      return;
    }
    !Hu.has(A.key) && !fn(A) && D(!1), S(A);
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
              htmlFor: o,
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
                id: o,
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
                  F(A.target.value), M(A.target.value), B(null), w(!0);
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
                  y.current = A.pointerType === "touch";
                },
                onMouseDown: (A) => A.preventDefault(),
                onClick: () => {
                  var ue;
                  const A = y.current;
                  y.current = !1;
                  const X = document.activeElement === d.current;
                  v ? Q() : (N.current = A && !X, L(null)), (!A || X) && ((ue = d.current) == null || ue.focus());
                },
                children: /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item. When a chosen performer's items answer a group in two different ways, their Existing answers mark the group Mixed." : "A group is one question with one answer per item." }),
        v && wd(
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
                Y(A.relatedTarget) || Q();
              },
              children: ne.map((A, X) => /* @__PURE__ */ u(
                "li",
                {
                  id: z(X),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": X === j || void 0,
                  onMouseMove: () => {
                    X !== j && B(J[X]);
                  },
                  onClick: () => ae(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Zr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                J[X]
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
  ...ci,
  ["auto", ir]
];
function Kc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : po(e[n]);
}
function Zu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = $(null), l = n.keys[t], f = Kc(e, n, t), d = Rr(f), p = n.duplicatePins.has(t) ? ` (${qa(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${qa(l)}, ${d ? "pinned" : "Auto"}${p}` : f === ir ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
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
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          l ? /* @__PURE__ */ a(At, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Hs, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ a(
      ef,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          i(y), g();
        },
        onClose: g
      }
    )
  ] });
}
function ef({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i,
  onClose: o
}) {
  const s = $(null), c = n.keys[t], l = Kc(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Ct(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Rr(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function g(N) {
    var C, D, P;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ne = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], J = ne.indexOf(document.activeElement);
      N.preventDefault(), (D = ne[(J + (N.shiftKey ? -1 : 1) + ne.length) % ne.length]) == null || D.focus();
      return;
    }
    const v = (P = N.target.dataset) == null ? void 0 : P.choice, w = v ? tr.findIndex((ne) => ne.includes(v)) : -1;
    if (!v || w < 0) return;
    const k = tr[w].indexOf(v), M = (ne) => ne == null ? void 0 : ne[Math.min(k, ne.length - 1)], x = {
      ArrowLeft: tr[w][k - 1],
      ArrowRight: tr[w][k + 1],
      ArrowUp: M(tr[w - 1]),
      ArrowDown: M(tr[w + 1]),
      Home: tr[w][0],
      End: tr[w].at(-1)
    };
    if (!Object.hasOwn(x, N.key)) return;
    N.preventDefault();
    const B = x[N.key];
    B && h(B);
  }
  const y = (N) => {
    const v = Rr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: po(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (N) => {
          N.preventDefault(), o();
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ci.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const k = y(w), M = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${qa(w)}: ${M}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(At, { binding: w }),
                    (k == null ? void 0 : k.pinned) && /* @__PURE__ */ a(Hs, { "aria-hidden": "true" })
                  ] }),
                  k && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: k.label })
                ]
              },
              w
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
                onClick: () => i("auto"),
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
                "data-choice": ir,
                tabIndex: 0,
                "aria-pressed": l === ir,
                onClick: () => i(ir),
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
const tf = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function nf(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function rf(e, t) {
  if (Kn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (ho(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function zc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function af(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function of({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const l = Le(e), f = l !== "tag", d = e.actions, p = ea(d), h = ta(qe(() => ui(d), [d])), g = qe(
    () => f ? Fr(d).map((K) => K.name) : [],
    [f, d]
  ), y = d.findIndex((K) => K.id === o), N = qe(
    () => f && y >= 0 ? Fr(
      d.filter((K, ye) => ye !== y)
    ).map((K) => K.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = qe(
    () => new Set(
      v ? cu(d).map((K) => K.key) : []
    ),
    [v, d]
  ), [k, M] = T(""), [x, B] = T(!1), [C, D] = T(
    null
  ), P = rt(), ne = `${P}-from-tags`, J = $(null), j = $(null), z = $(null), F = $(null), _ = $(/* @__PURE__ */ new WeakMap()), L = (K) => {
    let ye = _.current.get(K);
    return ye || (ye = crypto.randomUUID(), _.current.set(K, ye)), ye;
  }, Y = k.trim().toLocaleLowerCase(), Q = Y ? d.filter((K) => K.label.toLocaleLowerCase().includes(Y)) : d, ae = (K) => t({ ...e, actions: K }), H = (K, ye) => ae(d.map((Ee, ke) => ke === K ? ye : Ee));
  function S(K) {
    var ye;
    return [...((ye = z.current) == null ? void 0 : ye.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ee) => Ee.dataset.actionId === K
    );
  }
  function ce(K, ye) {
    const Ee = S(K), ke = Ee == null ? void 0 : Ee.querySelector(
      ye === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  Ct(() => {
    var ye;
    const K = F.current;
    K && (F.current = null, (K === "add" || !ce(K.id, K.part)) && ((ye = j.current) == null || ye.focus()));
  }), ee(() => {
    !c || !o || (Q.some((K) => K.id === o) ? ce(o, "label") : (M(""), F.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const K = af(l);
    M(""), ae([...d, K]), s(K.id), F.current = { id: K.id, part: "label" };
  }
  function X(K) {
    const ye = d[K], { shortcut: Ee, ...ke } = structuredClone(ye), Ne = {
      ...ke,
      ...Ee === ir ? { shortcut: Ee } : {},
      id: crypto.randomUUID(),
      label: `${ye.label} copy`
    };
    ae([...d.slice(0, K + 1), Ne, ...d.slice(K + 1)]), s(Ne.id), F.current = { id: Ne.id, part: "label" };
  }
  function ue(K) {
    const ye = d[K], Ee = Q.indexOf(ye), ke = Q[Ee + 1] ?? Q[Ee - 1];
    ae(d.filter((Ne, Je) => Je !== K)), o === ye.id && s(null), F.current = ke ? { id: ke.id, part: "toggle" } : "add";
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
              onChange: (K) => M(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && k && !fn(K) && (K.preventDefault(), K.stopPropagation(), M(""));
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
          Ku,
          {
            id: ne,
            review: e,
            disabled: i,
            onAdd: (K) => {
              const ye = [...d, ...K];
              ae(ye), D({ actions: ye, count: K.length }), me();
            },
            onCancel: me
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: z, children: Q.length > 0 && /* @__PURE__ */ a(
      Bs,
      {
        items: Q,
        getKey: (K) => K.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (K) => ae(K),
        renderItem: (K, { dragHandleProps: ye, isOver: Ee }) => {
          const ke = d.indexOf(K), Ne = o === K.id;
          return /* @__PURE__ */ a(
            sf,
            {
              action: K,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Zu,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: K.label.trim() || "New action",
                  onChoose: (Je) => ae(Sd(d, ke, Je))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? K.shortcut : void 0,
              groupUnanswerable: "steps" in K && w.has(Et(K.group)),
              effect: Pr(K, h, n, r),
              open: Ne,
              detailId: `${P}-detail-${K.id}`,
              dragHandleProps: ye,
              isOver: Ee,
              reorderDisabled: i || !!Y,
              onToggle: () => s(Ne ? null : K.id),
              onDuplicate: () => X(ke),
              onDelete: () => ue(ke),
              children: "steps" in K ? /* @__PURE__ */ a(
                cf,
                {
                  action: K,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ae(e),
                  saving: i,
                  stepKey: L,
                  rememberStepKey: (Je, pe) => _.current.set(Je, L(pe)),
                  onChange: (Je) => H(ke, Je)
                }
              ) : /* @__PURE__ */ a(
                df,
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
function sf({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: l,
  isOver: f,
  reorderDisabled: d,
  onToggle: p,
  onDuplicate: h,
  onDelete: g,
  children: y
}) {
  const N = e.label.trim() || "New action", v = rf(e, t), w = "steps" in e && Et(e.group) ? e.group.trim() : "";
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
              style: zc(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(Qs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a(
              "span",
              {
                className: "dq-action-row-effect",
                title: o.map((k) => k.text).join(" "),
                children: o.map((k, M) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, M))
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
            i && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${w} can't be answered` })
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
              children: /* @__PURE__ */ a(Ws, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(oi, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Vc({
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
function cf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const l = rt(), f = $(null), d = $(null);
  Ct(() => {
    var g, y;
    const h = d.current;
    h != null && (d.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Vc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Xu,
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
          Bs,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              lf,
              {
                step: h,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((w, k) => k === g ? v : w));
                },
                onRemove: () => p(e.steps.filter((v, w) => w !== g))
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
function lf({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: r,
  saving: i,
  onChange: o,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ u(
    "div",
    {
      className: `dq-step${r ? " dq-drag-over" : ""}`,
      "data-step-tone": nf(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: zc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(Qs, { "aria-hidden": "true" }),
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
            onChange: (l) => o({ ...e, mode: l.target.value }),
            children: tf.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          sr,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (l) => o({ ...e, tagIds: l }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${c}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: i
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
function df({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, i = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, o = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Vc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ u("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ u(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
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
            o && /* @__PURE__ */ a("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ a("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
const Jc = Kl(!1);
function uf({ children: e }) {
  return /* @__PURE__ */ a(Jc.Provider, { value: !0, children: e });
}
function nn({ tag: e, name: t }) {
  const n = zl(Jc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Jl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function ff({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Vn(_e(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
        onChange: (o) => i({ tagIds: o }),
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
          onChange: (o) => i({ multiple: o.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      r
    ] }),
    /* @__PURE__ */ a("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function pf({
  review: e,
  onChange: t
}) {
  const n = Vn(_e(e)).many, r = e.occurrence, i = rc(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ra([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: vd(r, d) }), f = (d, p) => l(
    i.map(
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
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((d, p) => {
      const h = c(d.tagId), g = i.filter(
        (v, w) => w !== p && v.tagId === d.tagId
      ), y = (v) => g.some((w) => w.categoryTagId === v), N = `${d.tagId}#${i.slice(0, p).filter((v) => v.tagId === d.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(nn, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Wo,
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
            onClick: () => l(i.filter((v, w) => w !== p)),
            children: /* @__PURE__ */ a(oi, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ u(
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
                  disabled: y(void 0),
                  onClick: () => f(p, void 0),
                  children: "Whole review"
                }
              ),
              o.map((v) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === v,
                  disabled: y(v),
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
      Wo,
      {
        entityType: "tag",
        value: void 0,
        onChange: (d) => {
          d !== void 0 && l([...i, { tagId: d }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: i.flatMap((d) => d.categoryTagId === void 0 ? [d.tagId] : [])
      }
    )
  ] });
}
const Hc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Qc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, hf = {
  video: si,
  audio: Zs,
  tag: Xs,
  performerOccurrence: Ys,
  audioPerformerOccurrence: ad
};
function Wc({ entityType: e }) {
  const t = hf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Hc[e] });
}
const mf = 2e6;
function Yc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function gf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function To(e) {
  Yc([e], gf(e));
}
async function bf(e) {
  if (e.size > mf) throw new Error("Review files must be smaller than 2 MB.");
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
    (r, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Xc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: i,
  autoFocus: o = !1
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
          children: ac.map((s) => /* @__PURE__ */ a("option", { value: s, children: Qc[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Review name" }),
      /* @__PURE__ */ a(
        "input",
        {
          ref: i,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: o,
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
function yf(e, t) {
  const n = Le(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function wf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), i = rt(), o = rt();
  return ee(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = r.current) == null || s.focus();
  }, []), /* @__PURE__ */ u(
    "dialog",
    {
      ref: n,
      className: "dq-confirm-dialog",
      "aria-labelledby": i,
      "aria-describedby": o,
      "aria-modal": "true",
      onCancel: (s) => {
        s.preventDefault(), e();
      },
      onClose: e,
      children: [
        /* @__PURE__ */ a("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ a("p", { id: o, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ u("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ a("button", { ref: r, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Zc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: r,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: l,
  dirty: f,
  criteriaChanged: d = !1,
  notices: p,
  onSave: h,
  onCancel: g,
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => Ae(e) && e.occurrence.tagIds.length > 0
  ), [k, M] = T(""), [x, B] = T(null), [C, D] = T(0), [P, ne] = T(!1), J = $(null), j = $(null), z = $(null), F = yf(e, w), _ = Le(e), L = qe(() => Wr(e), [e]);
  ee(() => M(""), [L]), ee(() => {
    var ce, A;
    if (P) return;
    const H = J.current;
    if (J.current = null, !H) return;
    (A = H.isConnected && !!((ce = z.current) != null && ce.contains(H)) && !(H instanceof HTMLButtonElement && H.disabled) ? H : z.current) == null || A.focus({ preventScroll: !0 });
  }, [P]);
  function Y() {
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
      M(""), h();
      return;
    }
    if (M(S), !H.name) {
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
          z.current = H, y && (y.current = H);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (H) => {
          H.key !== "Escape" || H.defaultPrevented || s || fn(H) || (H.preventDefault(), H.stopPropagation(), Y());
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
                onClick: Y,
                children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Hl,
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
                    Xc,
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
                  Ae(e) && /* @__PURE__ */ a(pf, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => To(e),
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
                children: /* @__PURE__ */ a(vf, { review: e, onChange: t })
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
                  of,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: x,
                    onExpand: B,
                    reveal: C
                  }
                )
              }
            ),
            w && Ae(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(ff, { review: e, onChange: t })
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
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: Y, children: "Cancel" }),
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
      wf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), g();
        }
      }
    )
  ] });
}
function vf({
  review: e,
  onChange: t
}) {
  const n = rt(), r = e.view, i = (d) => t({ ...e, view: { ...r, ...d } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (d) => i({ selectAllOnLoad: d.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Le(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        gs,
        {
          label: "View",
          value: r.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (d) => i({ displayMode: d })
        }
      ),
      o,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (d) => t({ ...e, presentation: { ...s, ...d } }), l = s.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          bs,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(qf, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          bs,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(Sf, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        gs,
        {
          label: "Cards",
          value: r.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (d) => i({ displayMode: d })
        }
      ),
      o,
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
      Nf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function Nf({
  bins: e,
  onChange: t
}) {
  const n = rt(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, l) => t(
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
            onClick: () => i(c.key),
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
            children: /* @__PURE__ */ a(oi, { "aria-hidden": "true" })
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
          t([...e, { key: c, label: "", filter: {} }]), i(c);
        },
        children: [
          /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || fn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Gs,
          {
            open: !0,
            onClose: () => i(null),
            criteria: ii,
            activeFilter: o.filter,
            supportsFilterExpressions: !0,
            subjectLabel: o.label.trim() ? `videos in ${o.label.trim()}` : "videos in this bin",
            onApply: (c) => {
              i(null), s(o.key, { filter: c });
            }
          }
        )
      }
    )
  ] });
}
function gs({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const i = rt();
  return /* @__PURE__ */ u("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ a("span", { className: "dq-setting-name", id: i, children: e }),
    /* @__PURE__ */ a("div", { className: "dq-segmented", role: "group", "aria-labelledby": i, children: n.map((o) => /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        "aria-pressed": t === o.value,
        onClick: () => t !== o.value && r(o.value),
        children: o.label
      },
      o.value
    )) })
  ] });
}
function bs({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: i,
  onChoose: o
}) {
  const s = rt(), c = rt();
  return /* @__PURE__ */ u("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ u("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": s,
          "aria-describedby": c,
          onChange: o
        }
      ),
      /* @__PURE__ */ a("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ a("span", { className: "dq-layout-card-text", id: c, children: r })
  ] });
}
function qf() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Sf() {
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
const Hi = "The queue differs from the saved review.";
function el({
  name: e,
  description: t,
  entityType: n,
  onBack: r,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: l,
  trailing: f,
  trailingEnd: d,
  queueChange: p,
  queueDiffers: h,
  chipsStart: g,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = $(null);
  Tf(v);
  const w = If(v), [k, M] = T({ differs: h, text: "" });
  return k.differs !== h && M({
    differs: h,
    text: h ? k.differs === !1 ? Hi : k.text : ""
  }), /* @__PURE__ */ u("header", { ref: v, className: "dq-review-header", children: [
    /* @__PURE__ */ u("div", { className: "dq-review-header-lead", children: [
      r && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: r,
          children: /* @__PURE__ */ a(Ta, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Hc[n], children: /* @__PURE__ */ a(Wc, { entityType: n }) }),
      /* @__PURE__ */ a("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ a("p", { className: "dq-sr-only", children: t }),
      o && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button dq-icon-button-small",
          "aria-label": "Edit review",
          title: "Edit review",
          "aria-haspopup": "dialog",
          "aria-expanded": c,
          disabled: s,
          onClick: o,
          children: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(kf, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function kf({
  change: e,
  onPress: t
}) {
  const n = rt(), r = rt(), i = `${Hi} Save these filters to the review.`, o = e.onSave ? `${Hi} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(ge, { children: [
    e.onSave && /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": n,
        disabled: e.saveDisabled,
        onClick: () => {
          var s;
          t(), (s = e.onSave) == null || s.call(e);
        },
        children: [
          /* @__PURE__ */ a(sd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ a("span", { id: n, hidden: !0, children: i })
        ]
      }
    ),
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: o,
        "aria-describedby": r,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ a(cd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const Ef = ["queue", "summary", "name", "layout", "range"], Af = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Cf = "(min-width: 1400px)";
function Ja(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function ys(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const i = Ef.filter(
    (o) => e.querySelector(Af[o])
  );
  for (let o = 1; o <= i.length && !Ja(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ja(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ja(e) ? !0 : (r(), !1);
}
function Tf(e) {
  const t = Pc(Cf), [n, r] = T(0), i = $(!1);
  Ct(() => {
    e.current && (i.current = !ys(e.current, t));
  }, [e, t, n]), Ct(() => {
    const o = e.current;
    o && t && !i.current && !Ja(o) && (i.current = !ys(o, t));
  }), ee(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(o);
    for (const c of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function If(e) {
  const t = $(!1);
  return ee(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const r = document.activeElement, i = (r == null ? void 0 : r.closest(".dq-queue-button")) ?? null;
    if (r && r !== document.body && !i) {
      t.current = !1;
      return;
    }
    if (i && !i.disabled) return;
    const o = n.querySelector(".dq-queue-button") ?? n.querySelector(".dq-review-header-trail .dq-menu > button");
    !o || o.disabled || (t.current = !1, o.focus());
  }), () => {
    t.current = !0;
  };
}
function tl({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, i] = T(!1), [o, s] = T(""), c = $(null), l = $(null);
  ee(() => {
    var p;
    r && ((p = c.current) == null || p.select());
  }, [r]);
  const f = (p) => {
    i(!1), p && requestAnimationFrame(() => {
      var h;
      return (h = l.current) == null ? void 0 : h.focus();
    });
  }, d = () => {
    const p = Math.round(Number(o));
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
        value: o,
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
          s(String(e)), i(!0);
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
        children: /* @__PURE__ */ a(ec, { "aria-hidden": "true" })
      }
    )
  ] });
}
function nl({
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
          /* @__PURE__ */ a(od, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(so, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function $f({
  options: e,
  value: t,
  disabled: n,
  onChange: r
}) {
  return /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((i) => /* @__PURE__ */ a(
    "button",
    {
      type: "button",
      "aria-label": i.label,
      title: i.label,
      "aria-pressed": t === i.value,
      disabled: n,
      onClick: () => t !== i.value && r(i.value),
      children: i.icon
    },
    i.value
  )) });
}
function Io({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = $(null), l = $(null), f = rt();
  Ct(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = l.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < g && h.top > y);
  }, [r]), ee(() => {
    var h, g;
    r && ((g = (h = l.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), ee(() => {
    t && i(!1);
  }, [t]);
  const d = (h = !0) => {
    var g;
    i(!1), h && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const g = [
      ...((N = l.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = g.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), d();
    else if (h.key === "Tab")
      d(!1);
    else if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), !g.length) return;
      const w = h.key === "ArrowDown" ? 1 : -1;
      g[(y + w + g.length) % g.length].focus();
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
        onClick: () => i((h) => !h),
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
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(ao, { children: [
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
function ri(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function $o(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Ro(e) {
  return !!String(e ?? "").trim();
}
function Oo(e) {
  return [
    ...new Set(
      ri(e.customFieldCriteria).filter($o).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Ro(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Mo(e, t) {
  const n = ri(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!$o(o)) return o;
    const s = { ...o };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !Ro(o[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function rl(e, t, n) {
  const r = ri(e.customFieldCriteria);
  if (!r.length) return e;
  const i = ri(n.customFieldCriteria), o = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!$o(l)) return l;
    const f = i.find((p) => o(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(l[p] ?? "")];
      g && l[h] === g && !Ro(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Rf(e, t, n) {
  if (!Kn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), i = n.steps.some((c) => Bn(c.mode)) ? await nu(r) : "", o = await yo(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((l) => !Bn(l.mode)),
    ...o.filter((l) => Bn(l.mode))
  ]) {
    const l = (f) => ru(
      i,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await sl(
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
async function Fo(e, t) {
  const n = e.occurrence;
  if (uo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ve("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        zn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((l) => r.add(l.id)), s * 1e3 >= c.totalCount) return [...r];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function al(e) {
  return Na(e.condition) && e.hideConfirmedAbsent !== !1;
}
function xo(e, t) {
  const { _filterExpression: n, ...r } = e.view.objectFilter, i = e.occurrence, o = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...t === null ? {} : {
      performerIdsCriterion: { modifier: "includes", value: t }
    },
    ...i.condition === "any" ? {} : {
      performerOccurrenceTagsCriterion: {
        modifier: i.condition,
        value: i.conditionTagIds,
        depth: i.includeSubtags === !1 ? 0 : -1
      }
    }
  }, s = al(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: li,
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
async function Po(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => di([n], t))
  );
}
function il(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Of(e, t, n = e.conditionTagIds.map((r) => [r])) {
  const r = new Set(t), i = (o) => o.some((s) => r.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return r.size === 0;
    case "includes":
      return n.some(i);
    case "includesAll":
      return n.every(i);
    case "excludes":
      return !n.some(i);
    case "excludesAll":
      return !n.every(i);
  }
}
function Mf(e, t, n, r, i) {
  if (!al(e)) return !1;
  const o = wc(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((l) => r.includes(l))
  );
}
async function ol(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || il(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = _e(e), o = await Jr(
    xo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = o.items.length ? await Po(c, r) : [], f = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const p = d++, h = o.items[p], g = await ve(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return Of(e.occurrence, v, l) && !Mf(c, h, y.id, v, l) ? [
            {
              key: `${h.id}:${y.id}`,
              media: h,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function sl(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = _e(e), o = await ti(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ve(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await ve("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: i,
          hostId: o.id,
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
function Ff(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function qn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? wc(
      await ti(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ve(Ff(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Vi(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await ti(e, t.media.id), i = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  Vi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === ei
  ) ?? ei, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
  if (!Array.isArray(s) || s.some((l) => !Number.isSafeInteger(l)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((l) => l.id),
    names: i.map((l) => l.name),
    absent: s,
    tags: i
  };
}
async function Lo(e, t, n) {
  if (t.occurrence && Ae(e))
    await sl(
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
    for (const [r, i] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      i.length && await ve(
        `/api/${dr(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function xf(e, t, n) {
  t.occurrence && Ae(e) ? await Rf(e, t.occurrence, n) : await vc(_e(e), n, [t.media.id]);
}
function Qi(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Xr(i(t.ids), i(n.ids)),
    absence: Xr(i(t.absent), i(n.absent))
  };
}
function Pf(e, t) {
  var n;
  for (const [r, i] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (r.added.some((o) => !i.includes(o)) || r.removed.some((o) => i.includes(o)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const r of e.tags.added) {
      const i = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === r).map((s) => s.id).sort(), o = t.applications.filter((s) => s.tag.id === r).map((s) => s.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class cl extends Error {
}
const Wi = (e) => e instanceof Error ? e.message : "Request failed.", ws = (e) => [...e].sort((t, n) => t - n), ka = (e, t) => JSON.stringify(ws(e)) === JSON.stringify(ws(t)), Yi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ai(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const d of t.steps)
    for (const p of d.tagIds)
      d.mode === "ADD" ? o.add(p) : o.delete(p);
  const s = e.some((d) => !o.has(d));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((d) => d.mode === "ADD").flatMap((d) => d.tagIds)
  ), l = [], f = [];
  for (const d of n) {
    const p = d.filter((g) => o.has(g) && !i.has(g)), h = d.filter(
      (g) => o.has(g) && i.has(g) && !c.has(g)
    );
    !p.length || !h.length || (r ? (h.forEach((g) => o.delete(g)), f.push(...h)) : (p.forEach((g) => o.delete(g)), l.push({ tagIds: p, existing: h })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: l, replaced: f };
}
function Lf(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Df(e, t, n, r) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (d) => d.mode === "ADD" && d.tagIds.some((p) => o.includes(p))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let l = `tag ${c}`;
    try {
      l = (await ve(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new cl(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function _f(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Kn(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = Na(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Po(i.occurrence, n) : [];
  await Df(i, o, s, n);
  const c = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await yo(h, n)
    }))
  ), l = structuredClone(Lf(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...l.steps.flatMap((h) => h.tagIds),
      ...s.flat()
    ])
  ];
  i.view.filter = {
    ...i.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: void 0
  };
  const d = await Fo(i, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await ol(i, d, h, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = ai(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
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
    review: i,
    actions: o,
    action: l,
    categories: s,
    touched: f,
    entries: [...p.values()]
  };
}
function jf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!ka(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ka(i(e), i(t));
}
async function ll(e, t, n, r) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && i < e.length; ) {
        const o = e[i++];
        await n(o), r();
      }
    })
  );
}
function dl(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function ul(e) {
  return e.entries.filter((t) => t.operation);
}
async function Uf(e, t, n, r, i = !1) {
  await ll(
    dl(e, i),
    n,
    async (o) => {
      if (o.conflict && !t) {
        o.status = "skipped", o.error = "Conflicting answer skipped.";
        return;
      }
      if (o.unverified) {
        o.error = "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let s;
      try {
        if (s = await qn(_e(e.review), o.item, !1), !jf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = Wi(h);
        return;
      }
      const c = ai(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Xr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : h ? "skipped" : "unchanged", o.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Lo(e.review, o.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await qn(_e(e.review), o.item, !1);
        p = !0, o.expected = h;
        const g = Qi(
          o.item,
          o.before,
          h,
          e.touched
        );
        if (o.operation = Yi(g) ? g : void 0, d) throw d;
        if (!ka(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (h) {
        if (o.status = "failed", o.error = Wi(h), !p)
          try {
            const g = await qn(_e(e.review), o.item, !1);
            o.expected = g;
            const y = Qi(
              o.item,
              o.before,
              g,
              e.touched
            );
            o.operation = Yi(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function Bf(e, t, n) {
  await ll(
    ul(e),
    t,
    async (r) => {
      const i = r.operation;
      if (r.unverified) {
        r.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...i.tags.added, ...i.tags.removed];
      let s = !1;
      try {
        const c = await qn(_e(e.review), r.item, !1);
        Pf(i, c), s = !0, await Lo(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const l = await qn(_e(e.review), r.item, !1);
        if (!ka(
          l.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Wi(c)}`, r.status = "failed", s)
          try {
            const l = await qn(_e(e.review), r.item, !1), f = Qi(
              r.item,
              r.before,
              l,
              o
            );
            r.operation = Yi(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const fl = (e, t) => t.count - e.count || Nc(e, t);
async function Gf(e, t, n) {
  const r = _e(e), i = e.occurrence, [o, s] = await Promise.all([
    ve(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Po(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Vi(c.map((y) => y.tag));
  const l = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await ve(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !f.has(y))
  ), p = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!y.has(v.tag.id)) continue;
      const w = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), N.set(v.tag.id, w);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(fl);
  }, h = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: l[N],
    members: y,
    tags: p(new Set(y))
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
      c.filter((y) => g.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: h
  };
}
function Kf(e, t, n, r) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...i].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...lr(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function Do(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(fl), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Fr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...lr(t[N])]))
    ];
    return y.length ? [{ ...g, answers: y, tags: i(y) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], l = e.groups.filter((g) => g.id !== null).map((g) => {
    const y = `tag:${g.id}`, N = o(g), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: Kf(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((k) => v.has(k))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), f = l.map((g) => new Set(g.members)), d = /* @__PURE__ */ new Set();
  for (const g of s) {
    if (f.some((N) => g.answers.every((v) => N.has(v)))) continue;
    g.answers.forEach((N) => d.add(N));
    const y = `group:${g.key}`;
    l.push({
      key: y,
      kind: "group",
      name: g.name,
      members: g.answers,
      tags: g.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: g.name, members: g.answers, tags: g.tags })
    });
  }
  const p = e.groups.find((g) => g.id === null), h = (p == null ? void 0 : p.tags.filter((g) => !d.has(g.id))) ?? [];
  return p && h.length && l.push({
    key: "other",
    kind: "other",
    name: l.length ? "Other review tags" : "Review tags",
    members: o(p).filter((g) => !d.has(g)),
    tags: h,
    mixed: []
  }), l;
}
const Ii = { summary: null, error: "" };
function pl(e, t, n = 0) {
  const r = e == null ? void 0 : e.occurrence, i = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    r == null ? void 0 : r.condition,
    r == null ? void 0 : r.conditionTagIds,
    r == null ? void 0 : r.includeSubtags,
    r == null ? void 0 : r.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [o, s] = T({
    key: i,
    value: Ii
  });
  return ee(() => {
    if (s((l) => l.key === i ? l : { key: i, value: Ii }), e === null || t === null) return;
    const c = new AbortController();
    return Gf(e, t, c.signal).then((l) => {
      c.signal.aborted || s({ key: i, value: { summary: l, error: "" } });
    }).catch((l) => {
      c.signal.aborted || s((f) => ({
        key: i,
        value: {
          summary: f.key === i ? f.value.summary : null,
          error: l instanceof Error ? l.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), o.key === i ? o.value : Ii;
}
function zf(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = fu(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => i.add(h.name));
  }
  const o = Et(e.name), s = [...r].filter((f) => Et(f) !== o), c = s.length < r.size, l = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: l };
}
function Vf(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Xi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = Ui,
  flags: o = [],
  className: s = ""
}) {
  const c = Vn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Do(e, r, i) : [], d = No(f), p = (h) => [
    ...new Set(
      o.filter((g) => {
        var y;
        return (y = g.tagIds) == null ? void 0 : y.some((N) => h.includes(N));
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
          const g = h.kind === "other" ? [] : p(h.members), y = zf(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Vf(h, y),
                  children: [
                    /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ u("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      N,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
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
const vs = 5;
function Jf(e, t) {
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
const Ns = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Zi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], qs = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Hf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, $i = 250;
function ba(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Qf({ step: e }) {
  const t = Zi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Zi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Zr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Ss({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(ao, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function ga({
  value: e,
  label: t,
  detail: n,
  tone: r,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? r : void 0,
      "aria-pressed": i && e > 0,
      disabled: !e,
      onClick: o,
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
function ks({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Or(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(nn, { tag: i })
    ] }) }, `added-${i.id}`)),
    Or(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(nn, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function Es({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: i
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > $i && /* @__PURE__ */ u("span", { children: [
        "First ",
        $i.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, $i).map((o) => {
        var s;
        return /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = o.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                ba(o, n)
              ]
            }
          ) }),
          /* @__PURE__ */ a("td", { className: "dq-batch-list-date", children: o.item.media.date ?? "" }),
          /* @__PURE__ */ a("td", { children: i(o) })
        ] }, o.item.key);
      }) })
    ] }) })
  ] });
}
function As(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let r = 0, i = !1;
  for (const o of e)
    if (t[o.status] += 1, o.operation && (r += 1), o.status === "failed" && !o.unverified && (i = !0), (o.status === "skipped" || o.status === "failed") && o.error) {
      const s = `${o.status}\0${o.error}`, c = n.get(s) ?? { status: o.status, error: o.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: r, retryable: i };
}
function Wf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [k, M] = T(!1), [x, B] = T(""), [C, D] = T(!1), [P, ne] = T(""), [J, j] = T(null), [z, F] = T(null), [_, L] = T([]), [Y, Q] = T(0), ae = $(null), H = $(null), S = $(null), ce = $(!1), A = $(!1), X = $(null), ue = $(!1), me = $(!1), K = $({ onClose: o });
  K.current = { onClose: o };
  const ye = rt(), Ee = l === "run", ke = (J == null ? void 0 : J.kind) === "undo", Ne = Ee && d ? d.review : e, Je = ea(Ne.actions), pe = Ne.occurrence, at = _e(Ne), Ye = Vn(at), Dt = Ye.queue, Jt = Ee && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !or(I))
  ), Ht = Jt.filter((I) => y.includes(I.id)), tt = pe.targetMode === "selected" && pe.performerIds.length === 1, Be = pl(
    Ne,
    s && tt ? pe.performerIds[0] : null,
    Y
  ), Ge = Oo(Ne.view.objectFilter), Xe = Ra(
    s ? [...ui(Jt), ...pe.conditionTagIds, ...Ge] : []
  ), ur = qe(() => xc(Xe), [Xe]), gt = (I) => h[I] ?? Xe[I] ?? { id: I, name: `Tag ${I}` }, Jn = JSON.stringify(
    Object.fromEntries(
      Ge.flatMap((I) => {
        var ie;
        const G = (ie = Xe[I]) == null ? void 0 : ie.name;
        return G ? [[String(I), G]] : [];
      })
    )
  ), Ze = qe(
    () => Mo(Ne.view.objectFilter, JSON.parse(Jn)),
    [Ne.view.objectFilter, Jn]
  );
  ee(() => {
    var I, G, ie;
    s && ((I = ae.current) == null || I.showModal(), (ie = (G = ae.current) == null ? void 0 : G.querySelector(".dq-batch-answer input")) == null || ie.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var le;
      const G = ae.current, ie = document.activeElement;
      if (!G || ie && ie !== document.body && G.contains(ie)) return;
      (le = (l === "answers" ? G.querySelector(".dq-batch-answer input:checked") ?? G.querySelector(".dq-batch-answer input") : G.querySelector("[data-batch-focus]")) ?? H.current) == null || le.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, k, d]), ee(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const G = S.current;
      if (!ce.current || !G || G.disabled) return;
      ce.current = !1;
      const ie = document.activeElement;
      (!ie || ie === document.body) && G.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || pe.targetMode !== "selected") return;
    const I = new AbortController();
    return L([]), Jf(pe.performerIds.slice(0, vs), I.signal).then((G) => {
      I.signal.aborted || L(G);
    }).catch(() => {
    }), () => I.abort();
  }, [s, pe.targetMode, JSON.stringify(pe.performerIds)]), ee(
    () => () => {
      var I;
      A.current = !0, (I = X.current) == null || I.abort();
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
    f("answers"), p(null), g({}), j(null), w(!1), N([]), ne(""), B(""), D(!1), F(null);
  }
  function Ke() {
    me.current || (c(!1), K.current.onClose(ue.current), ue.current = !1, Ce(), ce.current = !0);
  }
  function ze(I, G) {
    N(
      (ie) => G ? [...ie, I] : ie.filter((oe) => oe !== I)
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
    A.current = !0, (I = X.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function Ot(I) {
    F(
      (G) => (G == null ? void 0 : G.group) === I.group && G.reason === I.reason ? null : I
    );
  }
  const bt = (I, G) => (z == null ? void 0 : z.group) === I && z.reason === G;
  async function Fn() {
    if (!Ht.length || me.current) return;
    me.current = !0, M(!0), B(""), D(!1), ne("Loading all matching occurrences…"), p(null), g({}), F(null);
    const I = new AbortController();
    X.current = I;
    try {
      const G = await _f(
        e,
        Ht,
        I.signal,
        (oe) => ne(`Loaded ${oe.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const ie = {};
      for (const oe of G.entries)
        for (const le of oe.before.applications ?? [])
          ie[le.tag.id] = le.tag;
      g(ie), p(G), ne("Preview ready. No tags have been changed.");
    } catch (G) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : G instanceof Error ? G.message : String(G)
      ), D(!I.signal.aborted && G instanceof cl), ne("");
    } finally {
      me.current = !1, M(!1), X.current = null;
    }
  }
  async function Sn(I) {
    if (!d || me.current) return;
    const G = (I === "undo" ? ul(d) : dl(d, I === "retry")).length;
    me.current = !0, A.current = !1, ue.current = !0, M(!0), f("run"), B(""), j({ kind: I, total: G, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ie = () => j((le) => le && { ...le, done: le.done + 1 });
    let oe = !1;
    try {
      I === "undo" ? await Bf(d, () => A.current, ie) : await Uf(d, v, () => A.current, ie, I === "retry");
      const { counts: le } = As(d.entries), Re = le.skipped + le.failed;
      ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? `Batch undo finished.${le.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${le.changed.toLocaleString()} changed`,
          le.unchanged && `${le.unchanged.toLocaleString()} unchanged`,
          le.skipped && `${le.skipped.toLocaleString()} skipped`,
          le.failed && `${le.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${Re ? " Inspect them below." : ""}`
      );
    } catch (le) {
      oe = !0, ne(""), B(le instanceof Error ? le.message : String(le));
    } finally {
      me.current = !1;
      const le = A.current || oe;
      j((Re) => Re && { ...Re, stopped: le }), M(!1), Q((Re) => Re + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], Tt = qe(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        ai(I.before.ids, d.action, d.categories, v)
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
  ), U = Ee ? As(he) : null, Fe = (I) => Je.keys[Ne.actions.findIndex((G) => G.id === I)] ?? "", yt = (I) => Pr(I, ur, [], r), En = Na(pe.condition) && pe.includeSubtags !== !1 && pe.conditionTagIds.length > 0, se = fe[0], Mt = fe.length > 1 ? fe[fe.length - 1] : void 0, _t = (I) => `/${at}/${I.item.media.id}`, Hn = tt ? _[0] : void 0, An = qe(
    () => n ? Cc(
      n,
      Be.summary ? No(
        Do(Be.summary, Ne.actions, r ?? Ui)
      ) : []
    ) : [],
    [n, Be.summary, Ne.actions, r]
  ), Cn = hu(Ht, An, r ?? Ui), mn = n ?? [], je = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: kn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ve }
  };
  function He() {
    const I = Hf[pe.condition], G = !!I && pe.conditionTagIds.length > 0, ie = pe.performerIds.slice(0, vs), oe = String(Ne.view.filter.q ?? "").trim(), le = pe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      uo(pe) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : pe.targetMode === "selected" ? /* @__PURE__ */ u(ge, { children: [
        ie.map((Re, Te) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Qr, { performer: { id: Re, name: _[Te] ?? "" } }),
          _[Te] ?? "…"
        ] }, Re)),
        pe.performerIds.length > ie.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (pe.performerIds.length - ie.length).toLocaleString(),
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
                criteriaDefinitions: io,
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
        G ? I : co[pe.condition],
        G && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Or(pe.conditionTagIds.map(gt)).map((Re) => /* @__PURE__ */ a(nn, { tag: Re }, Re.id)) })
      ] }),
      G && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: pe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Na(pe.condition) && pe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: le, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          le
        ] })
      ] }),
      oe && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        oe,
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
              criteriaDefinitions: at === "audio" ? Ks : ii,
              customFieldEntityType: at,
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
  function ot(I, G, ie = !0) {
    if (!I.length) return null;
    const oe = /* @__PURE__ */ a("strong", { children: Hn || "This performer" }), le = ie ? `Check the earliest and latest ${Ye.many} before applying, or narrow the batch with a date filter.` : "", Re = I.every((Te) => Te.tagIds === null && !Te.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Re ? /* @__PURE__ */ u("p", { children: [
          oe,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Te) => Te.flags).join(", ") }),
          ".",
          " ",
          le
        ] }) : /* @__PURE__ */ u(ge, { children: [
          /* @__PURE__ */ u("p", { children: [
            oe,
            " needs attention where the chosen answers apply.",
            le && ` ${le}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Te) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Te.tagIds === null ? "Whole review" : Te.name }),
            ":",
            " ",
            qo(Te).join("; ")
          ] }, Te.key)) })
        ] }),
        G && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: _t(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ba(se, at),
            " · ",
            se.item.media.date
          ] }),
          Mt && /* @__PURE__ */ u("a", { href: _t(Mt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ba(Mt, at),
            " · ",
            Mt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function $t() {
    const I = Cn.filter((ie) => ie.tagIds === null), G = Cn.filter((ie) => ie.tagIds !== null);
    return /* @__PURE__ */ u(ge, { children: [
      He(),
      ot(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${tt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Jt.map((ie, oe) => {
            const le = Fe(ie.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(ie.id),
                  "aria-labelledby": `${ye}-answer-${oe}`,
                  "aria-describedby": `${ye}-effect-${oe}`,
                  onChange: (Re) => ze(ie.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: le && /* @__PURE__ */ a(At, { binding: le, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ye}-answer-${oe}`,
                    className: "dq-batch-answer-label",
                    title: ie.label,
                    children: ie.label
                  }
                ),
                /* @__PURE__ */ a(Ss, { id: `${ye}-effect-${oe}`, parts: yt(ie) })
              ] })
            ] }, ie.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: ot(G, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Xi,
            {
              ...Be,
              mediaKind: at,
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
    const G = It, ie = z && Ns.has(z.group) ? z.group : null, oe = ie ? he.filter(je[ie].test) : [], le = (Re) => {
      const Te = Qt(Re), Ie = Te.skipped ? Xr(
        Re.before.ids,
        ai(Re.before.ids, I.action, I.categories, !0).desired
      ) : hn(Re), Ft = !Ie.added.length && !Ie.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Te.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ft ? !Te.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ks, { added: Ie.added, removed: Ie.removed, tag: gt }),
        Te.kept.map((be, st) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Or(be.existing.map(gt)).map((Se) => /* @__PURE__ */ a(nn, { tag: Se }, Se.id)),
          " ",
          "instead of",
          " ",
          Or(be.tagIds.map(gt)).map((Se) => /* @__PURE__ */ a(nn, { tag: Se }, Se.id))
        ] }, st))
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
        oe.length > 0 ? /* @__PURE__ */ a(
          Es,
          {
            title: je[ie].title,
            entries: oe,
            mediaKind: at,
            resultHeading: "Planned change",
            describe: le
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
              title: ba(se, at),
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
              title: ba(Mt, at),
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
            ks,
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
        /* @__PURE__ */ a("span", { id: `${ye}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ye}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => w(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => w(!0), children: "Replace it" })
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
      ot(Cn, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${tt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ye}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ye}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: Rt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ht.map((I) => {
            const G = Fe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                G && /* @__PURE__ */ a(At, { binding: G, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(Ss, { parts: yt(I) })
            ] }, I.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ a(
          Xi,
          {
            ...Be,
            mediaKind: at,
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
    const G = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ie = G.kind === "apply" ? he.length - I.counts.pending : G.done, oe = G.kind === "apply" ? he.length : G.total, le = k ? G.kind === "undo" ? "Undoing batch…" : G.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : G.kind === "undo" ? G.stopped ? "Undo stopped" : "Undo finished" : G.stopped ? "Stopped" : "Finished", Re = oe ? Math.round(ie / oe * 100) : 100, Te = z && !Ns.has(z.group) ? z.group : null, Ie = (be) => qs.find((st) => st.status === be).label, Ft = Te ? he.filter(
      (be) => be.status === Te && (!z.reason || be.error === z.reason)
    ) : [];
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: le }),
          /* @__PURE__ */ u("span", { children: [
            ie.toLocaleString(),
            " of ",
            oe.toLocaleString(),
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
            "aria-valuemax": oe,
            "aria-valuenow": ie,
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
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: qs.map((be) => /* @__PURE__ */ a(
          ga,
          {
            value: I.counts[be.status],
            label: G.kind === "undo" && be.status === "unchanged" ? "As before" : be.label,
            tone: be.tone,
            pressed: bt(be.status),
            onToggle: () => Ot({ group: be.status })
          },
          be.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((be) => {
          const st = bt(be.status, be.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              be.count.toLocaleString(),
              " ",
              be.status,
              ": ",
              be.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": st,
                onClick: () => Ot({ group: be.status, reason: be.error }),
                children: st ? "Hide them" : "Show them"
              }
            )
          ] }, `${be.status}-${be.error}`);
        }) }),
        Ft.length > 0 ? /* @__PURE__ */ a(
          Es,
          {
            title: z.reason ? `${Ie(Te)}: ${z.reason}` : `${Ie(Te)} occurrences`,
            entries: Ft,
            mediaKind: at,
            resultHeading: "Result",
            describe: (be) => be.error ?? Ie(be.status)
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
              /* @__PURE__ */ a(ld, { "aria-hidden": "true" }),
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
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: pn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(ao, { children: [
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
  return /* @__PURE__ */ u(uf, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: Jt.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !Jt.length,
        onClick: () => {
          Ce(), i(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Yo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: ae,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ye}-title`,
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
            /* @__PURE__ */ a(Yo, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ye}-title`, children: "Apply to all matching occurrences" }),
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
          /* @__PURE__ */ a(Qf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: H,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Zi.find((I) => I.id === l).label} step`,
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
const hl = "data-quality.description-collapsed.v1";
function Yf() {
  try {
    return localStorage.getItem(hl) === "true";
  } catch {
    return !1;
  }
}
function Xf({
  details: e,
  label: t
}) {
  const [n, r] = T(Yf), i = Nn(() => {
    r((o) => {
      const s = !o;
      try {
        localStorage.setItem(hl, String(s));
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
        onClick: i,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Ql, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Zf = (e) => "";
function ep({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: s = Zf,
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
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: d.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: f,
          children: /* @__PURE__ */ a(dd, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: d.map((g) => {
      const y = `${g.count.toLocaleString()} matching ${g.count === 1 ? o.one : o.many}`, N = s(g.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === g.id ? "true" : void 0,
          disabled: i,
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
        disabled: i,
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const tp = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], np = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function rp(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Ka(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function ap(e, t) {
  const n = uo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ka(r, "or")}`,
    includesAll: `has ${Ka(r, "and")}`,
    excludes: `has none of ${Ka(r, "or")}`,
    excludesAll: `missing ${Ka(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function ip({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = rt(), h = ta(e.conditionTagIds), g = ap(e, h);
  Ct(() => {
    const w = f.current;
    if (!o || !w) return;
    const k = () => l(rp(w));
    k(), window.addEventListener("resize", k);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), x = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of x) B && (M == null || M.observe(B));
    return () => {
      window.removeEventListener("resize", k), M == null || M.disconnect();
    };
  }, [o]), ee(() => {
    var k, M;
    if (!o) return;
    const w = (k = d.current) == null ? void 0 : k.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (M = d.current) == null || M.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || fn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const M = [...d.current.querySelectorAll(np)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
          (D, P) => D.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const x = M[0], B = M[M.length - 1], C = document.activeElement;
        w.shiftKey && (C === x || C === d.current) ? (w.preventDefault(), B.focus()) : !w.shiftKey && C === B && (w.preventDefault(), x.focus());
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
        "aria-expanded": o,
        "aria-controls": o ? p : void 0,
        title: g,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Ys, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: tp.map(({ mode: w, label: k }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: k
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                sr,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => r({ performerIds: w }),
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
                    criteriaDefinitions: io,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: i, children: [
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
                  onChange: (w) => r({ condition: w.target.value }),
                  children: lo.map((w) => /* @__PURE__ */ a("option", { value: w, children: co[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a(
                  sr,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => r({ conditionTagIds: w }),
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
                        onChange: (w) => r({ includeSubtags: w.target.checked })
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
                        onChange: (w) => r({ hideConfirmedAbsent: w.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ a("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
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
    direction: i,
    sorts: o,
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
function op(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function sp(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await Jd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
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
      if (o.push(...f.items.map(r)), l * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function ml(e, t, n) {
  const r = xo(e, [t]);
  return mc(r, r.view.filter, n);
}
function gl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function eo(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function cp(e, t, n, r, i = {}) {
  const o = Ha(e), s = op(e), c = il(e.occurrence), l = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await sp(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = l, d = [...l.ranked];
  let p = l.cursor, h = !1;
  const g = (y) => ({
    ...l,
    cursor: p,
    ranked: [...d],
    limit: n,
    complete: !y && eo(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !eo(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await ml(e, N.id, r);
          v > 0 && gl(d, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), g(!1);
}
function lp(e, t, n) {
  const r = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && gl(i, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: i,
    complete: eo(e.candidates, e.cursor, i, e.limit)
  };
}
const to = /* @__PURE__ */ new Map();
function dp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function bl(e, t) {
  const n = dp(t);
  return to.set(e, n), n;
}
function up(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || to.has(e)) return;
    const r = new AbortController();
    return ve(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = bl(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return to.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Ri = { exports: {} }, Cs;
function fp() {
  return Cs || (Cs = 1, (function(e) {
    var t = (function() {
      var n = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", o = {};
      function s(l, f) {
        if (!o[l]) {
          o[l] = {};
          for (var d = 0; d < l.length; d++)
            o[l][l.charAt(d)] = d;
        }
        return o[l][f];
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
            return i.charAt(f);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(l) {
          return l == null ? "" : l == "" ? null : (l = l.replace(/ /g, "+"), c._decompress(l.length, 32, function(f) {
            return s(i, l.charAt(f));
          }));
        },
        compress: function(l) {
          return c._compress(l, 16, function(f) {
            return n(f);
          });
        },
        _compress: function(l, f, d) {
          if (l == null) return "";
          var p, h, g = {}, y = {}, N = "", v = "", w = "", k = 2, M = 3, x = 2, B = [], C = 0, D = 0, P;
          for (P = 0; P < l.length; P += 1)
            if (N = l.charAt(P), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = M++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < x; p++)
                    C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < x; p++)
                    C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                }
                k--, k == 0 && (k = Math.pow(2, x), x++), delete y[w];
              } else
                for (h = g[w], p = 0; p < x; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              k--, k == 0 && (k = Math.pow(2, x), x++), g[v] = M++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < x; p++)
                  C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < x; p++)
                  C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              }
              k--, k == 0 && (k = Math.pow(2, x), x++), delete y[w];
            } else
              for (h = g[w], p = 0; p < x; p++)
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
          var p = [], h = 4, g = 4, y = 3, N = "", v = [], w, k, M, x, B, C, D, P = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (M = 0, B = Math.pow(2, 2), C = 1; C != B; )
            x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
          switch (M) {
            case 0:
              for (M = 0, B = Math.pow(2, 8), C = 1; C != B; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
              D = n(M);
              break;
            case 1:
              for (M = 0, B = Math.pow(2, 16), C = 1; C != B; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
              D = n(M);
              break;
            case 2:
              return "";
          }
          for (p[3] = D, k = D, v.push(D); ; ) {
            if (P.index > l)
              return "";
            for (M = 0, B = Math.pow(2, y), C = 1; C != B; )
              x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
            switch (D = M) {
              case 0:
                for (M = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(M), D = g - 1, h--;
                break;
              case 1:
                for (M = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), M |= (x > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(M), D = g - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), p[D])
              N = p[D];
            else if (D === g)
              N = k + k.charAt(0);
            else
              return null;
            v.push(N), p[g++] = k + N.charAt(0), h--, k = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Ri)), Ri.exports;
}
var yl = fp();
function cr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => cr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && cr(n[s], r[s])
  );
}
function pp(e) {
  var c, l, f;
  const [t, n] = T({}), [r, i] = T(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let d = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await di([p])]
      )
    ).then((p) => {
      d && n(Object.fromEntries(p));
    }).catch(() => {
      d && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      d = !1;
    };
  }, [s]), { ids: t, error: r };
}
function wl(e, t, n) {
  const r = t == null ? void 0 : t.presentation, i = (r == null ? void 0 : r.annotations) ?? [], o = (r == null ? void 0 : r.annotationParents) ?? [];
  return {
    ...e,
    details: void 0,
    organized: !1,
    groups: [],
    galleries: [],
    date: i.includes("date") ? e.date : void 0,
    studioId: i.includes("studio") ? e.studioId : void 0,
    studioName: i.includes("studio") ? e.studioName : void 0,
    performers: i.includes("performers") ? e.performers : [],
    tags: i.includes("tags") && o.length > 0 ? (e.tags ?? []).filter(
      (s) => o.some(
        (c) => {
          var l;
          return c !== s.id && ((l = n[c]) == null ? void 0 : l.includes(s.id));
        }
      )
    ) : []
  };
}
function hp(e, t, n) {
  var s;
  const r = wl(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: o.includes("tags") && ((s = i == null ? void 0 : i.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function mp({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: i,
  onToggle: o
}) {
  var y, N;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((v) => (r[v] ?? []).filter((w) => w !== v))
  ), l = s.every((v) => r[v]), f = Lr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!l || c.has(v))
  ), d = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (c.has(w.id)) {
        const k = d.get(w.id) ?? { name: w.name, count: 0 };
        k.count++, d.set(w.id, k);
      }
  const p = f.filter((v) => !d.has(v)), h = ta(p);
  for (const v of p)
    d.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const g = [...d].sort((v, w) => v[1].name.localeCompare(w[1].name));
  return /* @__PURE__ */ u("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    g.map(([v, w]) => {
      const k = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": k,
          title: k ? `Show every video again, not only ${w.name}` : `Show only videos tagged ${w.name}`,
          disabled: i,
          onClick: () => o(v),
          children: [
            k && /* @__PURE__ */ a(Zr, { "aria-hidden": "true" }),
            w.name,
            " ",
            /* @__PURE__ */ a("span", { className: "dq-bin-count", children: w.count })
          ]
        },
        v
      );
    }),
    !g.length && /* @__PURE__ */ a("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function gp({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Lr(e.view.objectFilter, t, c).bins, f = bp(e, t, n, o);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const g of c) {
    const y = ((h = g.group) == null ? void 0 : h.trim()) ?? "";
    d.set(y, [...d.get(y) ?? [], g]);
  }
  return /* @__PURE__ */ a(ge, { children: [...d].map(([g, y]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": g ? `${g} bins` : "Filter bins",
      children: [
        g && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: g }),
        y.map((N) => {
          const v = l.includes(N.key), w = v ? r : f[N.key];
          return /* @__PURE__ */ u(
            "button",
            {
              className: "dq-bin",
              type: "button",
              "aria-pressed": v,
              title: v ? `Show every video again, not only ${N.label}` : `Show only videos matching ${N.label}`,
              disabled: i,
              onClick: () => s(N.key),
              children: [
                v && /* @__PURE__ */ a(Zr, { "aria-hidden": "true" }),
                N.label,
                " ",
                /* @__PURE__ */ a("span", { className: "dq-bin-count", children: w ?? "…" })
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
function bp(e, t, n, r) {
  var d;
  const [i, o] = T({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = $(null);
  return ee(() => {
    var y, N;
    if (r || f.current === l) return;
    f.current = l, o({});
    let p = 0;
    const h = new AbortController(), g = Lr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (p++, mc(Nl(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || o((k) => ({ ...k, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [l, r]), i;
}
function $r(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function yp(e) {
  if (!$r(e) || Object.keys(e).length !== 1 || !$r(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !$r(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function vl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function wp(e, t) {
  const n = t.find(
    (r) => cr(e, vl(r.filter))
  );
  return n ? n.key : yp(e);
}
function Lr(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && cr(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!$r(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = wp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !$r(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && $r(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && $r(g.group) ? d = g.group : p = !1;
    if (!p) break;
    i.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: i };
}
function Nl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Lr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (o.includes(t) ? o.filter((d) => d !== t) : [...o.filter((d) => !c || s(d) !== c), t]).reduce(vp, { ...e, view: { ...e.view, objectFilter: i } });
}
function vp(e, t) {
  var o, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (o = e.presentation) == null ? void 0 : o.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = vl(c.filter);
  }
  const { _filterExpression: r, ...i } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(i).length ? [{ filter: i }] : [],
            ...r ? [{ group: r }] : [],
            n
          ]
        }
      }
    }
  };
}
const fi = [
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
], Np = {
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
function Ts(e) {
  return yl.compressToEncodedURIComponent(JSON.stringify(e));
}
function Is(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : yl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function no(e, t) {
  let n;
  if (Ae(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!fi.some((c) => c !== "performer" && t.has(c))) {
    const c = xr(e);
    return {
      query: n ? { ...c, performerFocus: n } : c,
      startAtEnd: c.startFrom === "end"
    };
  }
  const i = {
    q: t.get("q") ?? "",
    page: Number(t.get("page") ?? 1),
    perPage: Number(t.get("perPage") ?? 40),
    sort: t.get("sort") ?? "date",
    direction: t.get("direction") === "asc" ? "asc" : "desc"
  };
  if (t.has("seed") && (i.seed = Number(t.get("seed"))), t.get("sorts")) {
    const c = t.get("sorts").split(",").map((l) => {
      const f = l.lastIndexOf(":");
      return { key: l.slice(0, f), direction: l.slice(f + 1) };
    });
    if (c.some((l) => !l.key || !["asc", "desc"].includes(l.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Ae(e) && (o = {
    ...Np,
    ...Is(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !lo.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: tn(i, _e(e)),
      objectFilter: Is(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const $s = { dataQualityOpenedFromList: !0 };
function ql() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Sl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...$s }, "", e) : window.history.replaceState(ql() ? { ...$s } : null, "", e);
}
function wa(e, t) {
  const n = new URLSearchParams(window.location.search);
  fi.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", Ts(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", Ts(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Sl(`${window.location.pathname}?${n}${window.location.hash}`);
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
function Rs(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !cr(
    JSON.parse(rr(Mn(e, t))),
    JSON.parse(rr(Mn(e, xr(e))))
  );
}
function _o(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Le(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function kl(e, t) {
  if (Le(e) !== "video") return e;
  const { base: n, bins: r } = Lr(
    e.view.objectFilter,
    t.view.objectFilter,
    _o(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function za(e, t) {
  if (Le(e) !== "video") return t;
  const { base: n, bins: r } = Lr(
    t.objectFilter,
    e.view.objectFilter,
    _o(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function Os(e, t) {
  return !t || !Ae(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Oi(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const un = (e) => e instanceof Error ? e.message : "Request failed.", qp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Mi = 50, Sp = [], Ms = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function kp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Xl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Js(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Ep({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Zs, {}) : /* @__PURE__ */ a(si, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: _i(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function Ap({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const c = !!n && !r, l = Co(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ra(
    qe(() => [...o, ...d ?? []], [o, d])
  ), h = (J) => p[J] ?? { id: J, name: p[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => Or(J.map(h)), y = f && e ? vo(f, e, i) : null, N = e ? su(e) : [], v = new Set(N.map((J) => J.id)), w = new Set(y == null ? void 0 : y.removed), k = new Set(y == null ? void 0 : y.markedAbsent), M = new Set(y == null ? void 0 : y.absenceCleared), x = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((J) => !v.has(J))), D = n ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${M.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
          M.has(J.id) ? /* @__PURE__ */ u("del", { children: [
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
          (J) => w.has(J.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
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
function Cp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    qo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Tp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: l,
  onStayOnTapChange: f
}) {
  var wn;
  const d = _e(e), p = Vn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || h;
  }, y = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = no(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = un(m), N.current = { query: xr(e), startAtEnd: !1 };
    }
  const [w, k] = T(null), [M, x] = T(""), B = $(null), C = $(null), D = $(null), P = $(null), [ne, J] = T(!!v.current), j = $(0), [z, F] = T(N.current.query), _ = $(z);
  _.current = z;
  const [L, Y] = T(0), Q = $(N.current.startAtEnd), [ae, H] = T([]), [S, ce] = T(null), A = $(null), [X, ue] = T(null), [me, K] = T(0), ye = qe(() => {
    var Z;
    if (!S) return null;
    const m = ae.findIndex((de) => de.key === S.key), E = ((Z = A.current) == null ? void 0 : Z.key) === S.key ? A.current : null;
    return (m >= 0 ? ae.slice(m + 1) : E ? ae.filter((de) => !E.before.includes(de.key)) : []).find((de) => de.media.id !== S.media.id) ?? null;
  }, [S, ae]), [Ee, ke] = T(0), [Ne, Je] = T(!1), [pe, at] = T(!1), Ye = $(!1), Dt = $(0), Jt = $(!1), Ht = $(null), tt = $(!0), Be = $(null);
  ee(() => (tt.current = !0, () => {
    tt.current = !1;
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
      if (document.querySelector(Ms)) return;
      const E = Fn.current;
      Fn.current = null;
      const O = document.activeElement;
      O && O !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [Ne, Tt, L]);
  const [yt, En] = T([]), [se, Mt] = T({}), _t = $(null), [Hn, An] = T({});
  ee(() => {
    let m = !0;
    return Promise.all(
      Oo(z.objectFilter).map(
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
    () => Mo(z.objectFilter, Hn),
    [Hn, z.objectFilter]
  ), mn = $(0), je = $(e);
  je.current = e;
  const He = w ?? e, ot = qe(
    () => Mn(He, z),
    [He, z]
  ), $t = qe(
    () => Os(ot, z.performerFocus),
    [ot, z.performerFocus]
  ), Qn = $($t);
  Qn.current = $t;
  const xn = $(ot);
  xn.current = ot;
  const [rn, Wn] = T("items"), [I, G] = T(null), ie = $(null), oe = $("");
  function le(m) {
    const E = typeof m == "function" ? m(ie.current) : m;
    ie.current = E, G(E);
  }
  const [Re, Te] = T(!1), [Ie, Ft] = T(null), be = $(null), st = Ae(ot) ? Ha(ot) : "", [Se, Pn] = T(0), [Oe, pr] = T(null);
  ee(() => () => {
    var m;
    return (m = be.current) == null ? void 0 : m.controller.abort();
  }, []), ee(() => {
    const m = be.current;
    !m || m.signature === st || (m.controller.abort(), be.current = null, Te(!1));
  }, [st]), ee(() => {
    var O;
    const m = ie.current;
    if (rn !== "performers" || !st || ((O = be.current) == null ? void 0 : O.signature) === st || oe.current === st || (m == null ? void 0 : m.signature) === st && m.complete)
      return;
    const E = (m == null ? void 0 : m.signature) === st ? m : null;
    br(m, (E == null ? void 0 : E.limit) ?? Mi);
  }, [rn, st, I, Ie, Re]);
  const Wt = z.performerFocus;
  ee(() => {
    if (!Wt) {
      pr(null);
      return;
    }
    let m = !0;
    return ve(`/api/performers/${Wt}`).then((E) => {
      const O = bl(Wt, E.tags);
      m && pr({ id: Wt, name: E.name, tags: O });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [Wt]);
  const na = JSON.stringify(
    Ae(ot) ? rc(ot.occurrence) : []
  ), jt = qe(() => JSON.parse(na), [na]), ra = qe(() => uu(jt), [jt]), xt = Sc(ra), an = Ra(ra), hr = (m) => {
    var E;
    return ((E = an[m]) == null ? void 0 : E.name) ?? (an[m] === null ? "Unavailable tag" : "…");
  }, Tn = (m) => ({
    name: hr(m),
    tagIds: xt.get(m) ?? [m],
    resolved: xt.has(m)
  }), mr = pl(
    Ae(ot) ? ot : null,
    Wt ?? null,
    Se
  ), pt = Rs(e, z), wt = Rs(e, za(e, z)), Qe = pe || Ne || ze, it = Number(z.filter.page);
  function ct(m, E = !1) {
    Ye.current || (Dt.current++, gt(""), v.current = "", Q.current = E, _.current = m, F(m), ke(0), Je(!0), E || wa(e.id, m), Y((O) => O + 1));
  }
  function vt() {
    if (Ye.current = !1, at(!1), tt.current && Be.current) {
      const m = Be.current;
      Be.current = null, ct(m.query, m.startAtEnd);
    }
  }
  ee(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = no(
            je.current,
            new URLSearchParams(window.location.search)
          );
          Ye.current ? Be.current = E : ct(E.query, E.startAtEnd);
        } catch (E) {
          Xe(un(E));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), ee(() => (r(pe || Ne || ze || !!w), () => r(!1)), [pe, Ne, ze, !!w, r]);
  async function Yn(m, E, O) {
    if (Ae(m)) {
      const de = await ol(
        m,
        _t.current,
        E,
        O
      );
      return {
        items: de.items.map((we) => ({
          key: we.key,
          media: we.media,
          occurrence: we
        })),
        totalCount: de.totalCount
      };
    }
    const Z = await Jr(
      m,
      { ...m.view.filter, page: E },
      O
    );
    return {
      items: Z.items.map((de) => ({ key: String(de.id), media: de })),
      totalCount: Z.totalCount
    };
  }
  function Ln(m, E, O, Z = !1, de = !1) {
    if (!tt.current || Be.current) return;
    J(!0), H(
      de ? m.items : Oi(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), Ut(O, Z);
    const we = {
      ..._.current,
      filter: { ..._.current.filter, page: E }
    };
    _.current = we, F(we), wa(e.id, we);
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
      const O = Os(
        Mn(je.current, _.current),
        _.current.performerFocus
      );
      _t.current = Ae(O) ? await Fo(O, m.signal) : null;
      let Z = Number(O.view.filter.page), de = await Yn(O, Z, m.signal);
      const we = Math.max(
        1,
        Math.ceil(de.totalCount / Number(O.view.filter.perPage))
      );
      (Q.current || Z > we) && (Z = we, de = await Yn(O, Z, m.signal)), Q.current = !1;
      const dt = O.view.startFrom === "end" ? -1 : 1;
      for (; Ae(O) && !de.items.length && Z + dt >= 1 && Z + dt <= we && !m.signal.aborted; )
        Z += dt, de = await Yn(O, Z, m.signal);
      if (E !== mn.current || m.signal.aborted) return;
      const Pt = Oi(de.items, O.view.startFrom === "end");
      Ln(de, Z, Pt[0] ?? null);
    })().catch((O) => {
      !m.signal.aborted && E === mn.current && Xe(un(O));
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
        Ae(e) ? E.ids.filter((O) => e.occurrence.tagIds.includes(O)) : []
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
    const O = ae.findIndex((Ue) => Ue.key === m.key), Z = z.startFrom === "end" ? -1 : 1, de = (E == null ? void 0 : E.key) === m.key, we = de ? E : { key: m.key, page: it, before: ae.slice(0, O + 1).map((Ue) => Ue.key), after: ae.slice(O + 1).map((Ue) => Ue.key) }, dt = new Set(we.after), Pt = new Set(we.before), dn = ae.find((Ue) => dt.has(Ue.key) || (Z === 1 || it < we.page) && de && !Pt.has(Ue.key));
    return { direction: Z, cursor: we, remainingKeys: dt, visitedKeys: Pt, nextLoaded: dn };
  }
  async function Xn(m = !1, E = !1, O = !1, Z = () => !0, de = A.current) {
    if (!S) return;
    const { direction: we, cursor: dt, remainingKeys: Pt, visitedKeys: dn, nextLoaded: Ue } = Dr(S, de);
    if (!m && Ue) {
      Ut(Ue, O);
      return;
    }
    const jn = m ? dn : new Set(ae.map((Kt) => Kt.key));
    let qt = we === -1 && !m ? Math.max(1, it - 1) : it;
    for (; tt.current && !Be.current; ) {
      let Kt = await Yn($t, qt);
      const nt = Math.max(
        1,
        Math.ceil(Kt.totalCount / Number(z.filter.perPage))
      );
      qt > nt && (qt = nt, Kt = await Yn($t, qt));
      const St = Oi(Kt.items, we === -1), On = new Map(St.map((zt) => [zt.key, zt])), kr = m ? dt.after.flatMap((zt) => {
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
      if (!Z()) return;
      if (E) {
        A.current = dt, Ln(Ar, qt, S, !1, !0);
        return;
      }
      const ua = we === -1 && it === 1 && !m ? void 0 : Ar.items.find(
        (zt) => !jn.has(zt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && we === -1 && qt === dt.page) || Pt.has(zt.key))
      );
      if (ua || (we === -1 ? qt <= 1 : qt >= nt)) {
        Ln(
          Ar,
          qt,
          ua ?? null,
          O,
          !0
        ), ua || Ze(
          Kt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      qt += we;
    }
  }
  async function on(m, E = !1, O = !1, Z = !1) {
    var Kt;
    if (Jt.current && m && S && !O && !Z && !w && !ze) {
      Ht.current = { action: m, stay: E, key: S.key };
      return;
    }
    if (w || !S || Ye.current || Ne || ze && !O)
      return;
    const de = O || Z || !!(m != null && m.steps.length);
    if (de && (!t || !Ce) || m && or(m) && !n) return;
    const we = !E && !O && !Z && de && m !== void 0 && Ce !== null && ss(e) && Gi(Bi(e.actions, lu(m, Ce, Bt))).length > 0, dt = O && ((Kt = Sn.current) != null && Kt.contains(document.activeElement)) ? document.activeElement : null;
    Ye.current = !0, at(!0), Xe(""), Ze(""), Jt.current = !0;
    const Pt = A.current, dn = de && !E && !we ? Dr(S).nextLoaded ?? null : null;
    dn && (H(
      (nt) => nt.filter((St) => St.key !== S.key)
    ), Ut(dn, !0));
    let Ue = !1, jn = !1, qt = [];
    try {
      if (de) {
        const nt = await qn(d, S);
        if (m)
          await xf($t, S, m);
        else {
          const On = Z && Ae(e) ? e.occurrence.tagIds.filter((Ar) => nt.ids.includes(Ar)) : Ot.current, Er = Xr(On, Z ? yt : fr);
          await Lo($t, S, Er);
        }
        const St = await qn(d, S);
        dn || Ke(St), jn = !0, Rt(!1), we && (qt = Gi(Bi(e.actions, St))), Ze(
          qt.length ? `Tags saved. Staying until answered: ${qt.map((On) => On.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (De(S.occurrence.performer.id), Pn((On) => On + 1));
      }
      if (!tt.current || Be.current) return;
      if (de)
        if (dn) {
          const nt = Dt.current;
          Ue = !0, Jt.current = !1, vt(), Xn(!0, !1, !0, () => Dt.current === nt && !Ye.current, Pt).catch((St) => {
            Dt.current === nt && Xe(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${un(St)}`);
          });
        } else qt.length || await Xn(!0, E, !E);
      else E || await Xn();
      E && O && requestAnimationFrame(() => {
        var nt;
        return (nt = bt.current) == null ? void 0 : nt.focus();
      });
    } catch (nt) {
      if (Xe(
        jn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${un(nt)}` : de ? `Saving stopped. ${qp(un(nt))}${O || Z ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${un(nt)}`
      ), de && !jn) {
        he.current = dt, dn && (H(ae), ue(null), K((St) => St + 1), ce(S), A.current = Pt);
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
  const $e = !ze && !w && !Tt && !hn && (S != null || Ne || pe);
  So({
    surface: "local",
    enabled: $e,
    actions: e.actions,
    onAction: (m, E) => {
      const O = e.actions[m];
      O && on(O, E);
    },
    onFind: () => kn(!0)
  });
  const gr = (m) => pe || Ne || !Ce || !!w || !t && m.steps.length > 0 || !n && or(m);
  function bn() {
    !i || w || Ye.current || ze || (D.current = document.activeElement, C.current = {
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
    if (!o) {
      j.current = 0;
      return;
    }
    o !== j.current && ne && !Ne && (j.current = o, bn(), s == null || s());
  }, [o, Ne, ne]);
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
  async function pi() {
    if (!w || !i || Ye.current) return;
    const m = Mn(
      { ...w, name: w.name.trim() },
      za(je.current, _.current)
    ), E = Sa(m);
    if (E) {
      x(E);
      return;
    }
    Ye.current = !0, at(!0), x("");
    try {
      if (await i(m) === !1) throw new Error("Could not save review.");
      aa(), Ze("Review saved.");
    } catch (O) {
      x(lc(O));
    } finally {
      vt();
    }
  }
  async function ia() {
    if (!i || Ye.current) return;
    const m = za(je.current, _.current), E = Mn(je.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    Ye.current = !0, at(!0), Xe(""), gt("");
    try {
      if (await i(E) === !1) throw new Error("Could not save review.");
      Ze("Queue saved to this review.");
    } catch (O) {
      gt("Could not save queue. " + un(O));
    } finally {
      vt();
    }
  }
  const lt = z.performerScope, sn = (m) => {
    const { performerFocus: E, ...O } = _.current, Z = E && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    ct(
      {
        ...O,
        ...Z ? { performerFocus: E } : {},
        filter: { ...O.filter, page: 1 },
        performerScope: { ...lt, ...m }
      },
      O.startFrom === "end"
    );
  };
  async function br(m, E) {
    var de;
    const O = xn.current;
    if (!Ae(O)) return;
    (de = be.current) == null || de.controller.abort();
    const Z = {
      signature: Ha(O),
      controller: new AbortController()
    };
    be.current = Z, oe.current = "", Te(!0), Ft(null);
    try {
      const we = await cp(O, m, E, Z.controller.signal, {
        onProgress: (dt) => {
          be.current === Z && le(dt);
        }
      });
      be.current === Z && le(we);
    } catch (we) {
      be.current === Z && !Z.controller.signal.aborted && (oe.current = Z.signature, Ft({ signature: Z.signature, message: un(we) }));
    } finally {
      be.current === Z && (be.current = null, Te(!1));
    }
  }
  function yn() {
    var m;
    (m = be.current) == null || m.controller.abort(), be.current = null, Te(!1), le((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function De(m) {
    var Z;
    const E = xn.current;
    if (!Ae(E)) return;
    if (be.current) {
      yn();
      return;
    }
    const O = Ha(E);
    if (!(((Z = ie.current) == null ? void 0 : Z.signature) !== O || ie.current.partial))
      try {
        const de = await ml(E, m);
        if (be.current) {
          yn();
          return;
        }
        le(
          (we) => (we == null ? void 0 : we.signature) === O ? lp(we, m, de) : we
        );
      } catch {
        le(
          (de) => (de == null ? void 0 : de.signature) === O ? { ...de, partial: !0, complete: !1 } : de
        );
      }
  }
  const yr = z.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === z.performerFocus) : void 0, Nt = Oe && Oe.id === z.performerFocus ? { ...Oe, flags: Ir(jt, Oe.tags) } : yr ? { ...yr, flags: Ir(jt, yr.tags) } : null, _r = (m) => {
    if ((Oe == null ? void 0 : Oe.id) === m)
      return Ir(jt, Oe.tags);
    const E = I == null ? void 0 : I.candidates.find((O) => O.id === m);
    return E ? Ir(jt, E.tags) : void 0;
  }, cn = ((wn = S == null ? void 0 : S.occurrence) == null ? void 0 : wn.performer.id) ?? null, wr = cn === null ? void 0 : _r(cn), jr = up(
    jt.length > 0 && cn !== null && cn !== z.performerFocus && wr === void 0 ? cn : null
  ), Ma = wr ?? (jr ? Ir(jt, jr) : []), Bt = qc(He.actions), Fa = mr.summary && z.performerFocus ? No(Do(mr.summary, He.actions, Bt)) : [], Dn = cs(jt, (Nt == null ? void 0 : Nt.flags) ?? [], Tn), er = Cc(
    cs(jt, Ma, Tn),
    cn !== null && cn === z.performerFocus ? Fa : []
  ), hi = JSON.stringify(er), Ur = qe(() => er, [hi]), mi = JSON.stringify(Dn), xa = qe(() => Dn, [mi]), oa = (m) => yu(jt, m, hr);
  function sa(m) {
    if (Ye.current) return;
    const E = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    ct(E, E.startFrom === "end"), Wn("items");
  }
  function gi() {
    const { performerFocus: m, ...E } = _.current;
    ct(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const Gt = $(null);
  Gt.current ?? (Gt.current = Lc());
  const vr = Gt.current, Nr = qe(
    () => He.actions.flatMap((m) => m.steps.flatMap((E) => E.tagIds)),
    [He.actions]
  ), _n = $(null);
  ee(() => {
    const m = _n.current, E = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !E) return;
    const O = m.getBoundingClientRect(), Z = E.getBoundingClientRect();
    Z.top < O.top ? m.scrollTop -= O.top - Z.top : Z.bottom > O.bottom && (m.scrollTop += Z.bottom - O.bottom);
  }, [S == null ? void 0 : S.key, rn]);
  const qr = $(null), ln = $(null);
  ee(() => {
    var O, Z;
    const m = ln.current;
    if (!m) return;
    ln.current = null;
    const E = [...((O = qr.current) == null ? void 0 : O.querySelectorAll(".dq-partner")) ?? []];
    (Z = E.find((de) => de.dataset.partnerKey === m) ?? E[0]) == null || Z.focus();
  }, [S == null ? void 0 : S.key]);
  const In = pe || Ne || ze || !!w, $n = qe(
    () => w ? Mn(w, za(e, z)) : null,
    [w, e, z]
  ), Pa = qe(
    () => $n != null && Wr(Mr($n)) !== Wr(Mr(e)),
    [$n, e]
  );
  function bi() {
    S ? qn(d, S).then(Ke).catch((m) => Xe(un(m))) : ct(_.current);
  }
  const ca = Ge ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ge,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: pe, onClick: bi, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, la = pe || Ne || S != null && !Ce, da = Math.max(1, Number(z.filter.perPage) || 1), Sr = $(1);
  Ne || (Sr.current = Math.max(1, Math.ceil(Ee / da)));
  const Rn = Sr.current, Me = lt && S ? ae.filter(
    (m) => m.media.id === S.media.id && m.key !== S.key
  ) : [], yi = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, Br = S ? kp(S.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": lt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var Z;
        const E = m.target instanceof Element ? m.target.closest("button") : null, O = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((Z = E == null ? void 0 : E.textContent) == null ? void 0 : Z.trim()) ?? "";
        E && !E.closest(Ms) && /^(Filters|Edit filter:|Edit criteria)/.test(O) && (Fn.current = E);
      },
      children: [
        /* @__PURE__ */ a(
          el,
          {
            name: e.name,
            description: e.description,
            entityType: Le(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: In || !!(c != null && c.busy),
            onEdit: w ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : bn,
            editDisabled: !w && (In || !i || !!(c != null && c.busy)),
            editing: !!w,
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
                    criteriaDefinitions: d === "audio" ? Ks : ii,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ee,
                    sortOptions: d === "audio" ? Wl : zs,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      tl,
                      {
                        page: Math.min(Math.max(1, it || 1), Rn),
                        pages: Rn,
                        onPage: (m) => ct({
                          ..._.current,
                          filter: tn(
                            { ..._.current.filter, page: m },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (m) => {
                      (m.sort !== _.current.filter.sort || m.direction !== _.current.filter.direction) && (m = { ...m, sorts: void 0 }), ct(
                        {
                          ..._.current,
                          filter: tn(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      ct(
                        {
                          ..._.current,
                          objectFilter: rl(
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
              lt && /* @__PURE__ */ a(
                ip,
                {
                  scope: lt,
                  disabled: pe || ze,
                  editing: !!w,
                  onChange: sn,
                  onEditCriteria: () => Qt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                nl,
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
                Wf,
                {
                  review: $t,
                  disabled: Qe || !!w,
                  performerAttention: z.performerFocus ? xa : void 0,
                  trees: Bt,
                  onOpen: () => {
                    Ye.current = !0, at(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const E = _.current.performerFocus;
                      E ? De(E) : yn(), Pn((O) => O + 1), vt(), v.current || Je(!0), Y((O) => O + 1);
                    } else vt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Io,
                {
                  disabled: In,
                  items: c.moreItems({
                    onSelect: bn,
                    disabled: !i
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
              Nt != null && Nt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: oa(Nt.flags), children: [
                /* @__PURE__ */ a(Gn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: oa(Nt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Qe,
                  onClick: gi,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: pt,
            queueChange: !w && pt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: wt ? () => void ia() : void 0,
              saveDisabled: Qe || !i,
              onReset: () => {
                const m = xr(e);
                ct(m, m.startFrom === "end");
              },
              resetDisabled: Qe
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && $n && /* @__PURE__ */ a(
            Zc,
            {
              drawerRef: B,
              draft: $n,
              onChange: (m) => k(m),
              direction: z.startFrom,
              onDirectionChange: (m) => ct({ ..._.current, startFrom: m }),
              tagGroups: Sp,
              trees: Bt,
              saving: pe,
              saveDisabled: Ne,
              error: M,
              dirty: Pa,
              criteriaChanged: wt,
              notices: ca && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: ca }),
              onSave: () => void pi(),
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
                        /* @__PURE__ */ a("span", { children: yi(S.media) }),
                        /* @__PURE__ */ a(tc, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Br && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Br })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, ye].filter(Boolean).map((m) => {
                    var Z, de, we, dt, Pt;
                    const E = m, O = E.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: O ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": O ? void 0 : !0,
                        inert: O ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          Yl,
                          {
                            streamUrl: ji("audio", E.media.id),
                            format: ((Z = E.media.files[0]) == null ? void 0 : Z.format) ?? "",
                            title: g(E.media),
                            coverUrl: O ? _i("audio", E.media) : void 0,
                            duration: ((de = E.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            autostart: O && X === E.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Vs,
                          {
                            videoId: E.media.id,
                            streamUrl: ji("video", E.media.id),
                            posterUrl: O ? _i("video", E.media) : void 0,
                            duration: ((we = E.media.files[0]) == null ? void 0 : we.duration) ?? 0,
                            format: (dt = E.media.files[0]) == null ? void 0 : dt.format,
                            audioCodec: (Pt = E.media.files[0]) == null ? void 0 : Pt.audioCodec,
                            extensionSurface: O ? "quick-view" : void 0,
                            autostart: O && X === E.media.id,
                            keyboardShortcutsEnabled: O,
                            showAbLoop: O,
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
                    Xf,
                    {
                      details: S.media.details,
                      label: p.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Ne ? "Loading review…" : Ee ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              He.actions.length > 0 ? /* @__PURE__ */ a(
                Ou,
                {
                  actions: He.actions,
                  isDisabled: (m) => ze || gr(m),
                  busy: la,
                  tags: Ce,
                  trees: Bt,
                  preview: vr,
                  onApply: (m, E) => void on(m, E),
                  onFind: () => kn(!0),
                  findDisabled: ze || !!w,
                  paused: !!w,
                  waitForGroups: ss(He),
                  attention: Ur,
                  stayOnTap: U,
                  onStayOnTapChange: Fe
                }
              ) : Ae(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || pe || ze || !Ce || !!w || !S,
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
                            e.occurrence.multiple ? E.target.checked ? [...yt, m] : yt.filter((O) => O !== m) : [m]
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
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: lt ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    Ur.length > 0 && /* @__PURE__ */ a(Cp, { entries: Ur })
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
                          var E, O, Z;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = m.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (O = m.occurrence) == null ? void 0 : O.performer.name,
                              "data-partner-key": m.key,
                              disabled: Qe,
                              onClick: () => {
                                ln.current = S.key, Ut(m), Xe("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Qr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (Z = m.occurrence) == null ? void 0 : Z.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    Ap,
                    {
                      tags: Ce,
                      preview: vr,
                      trees: Bt,
                      actionTagIds: Nr,
                      label: `Current ${lt ? "occurrence" : p.one} tags`,
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
                              lt ? "occurrence" : p.one,
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
                Ae(ot) && z.performerFocus && /* @__PURE__ */ a(
                  Xi,
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
                  !w && ca,
                  !w && ur && /* @__PURE__ */ a("p", { role: "alert", children: ur }),
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
                      disabled: Qe || !!w || !t || !Ce,
                      onClick: () => {
                        Dt.current++, Ot.current = [...Ce.ids], pn([...Ce.ids]), Rt(!0), Ze("");
                      },
                      children: [
                        /* @__PURE__ */ a(Xs, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Qe || !!w,
                      onClick: () => void on(),
                      children: [
                        /* @__PURE__ */ a(ud, { "aria-hidden": "true" }),
                        "Skip",
                        lt ? " performer" : ` ${p.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              lt && /* @__PURE__ */ u(
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
              lt && rn === "performers" ? /* @__PURE__ */ a(
                ep,
                {
                  ranking: (I == null ? void 0 : I.signature) === st ? I : null,
                  busy: Re,
                  error: (Ie == null ? void 0 : Ie.signature) === st ? Ie.message : "",
                  focus: z.performerFocus,
                  disabled: Qe,
                  labels: p,
                  flagLabel: oa,
                  onFocus: sa,
                  onMore: () => {
                    const m = ie.current;
                    m && br(m, m.limit + Mi);
                  },
                  onRefresh: () => {
                    le(null), br(null, Mi);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: _n, children: ae.map((m) => {
                var O;
                const E = (S == null ? void 0 : S.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(m),
                    "aria-label": y(m),
                    "aria-current": E ? "true" : void 0,
                    disabled: Qe,
                    onClick: () => {
                      Ut(m), Xe(""), Ze("");
                    },
                    children: [
                      /* @__PURE__ */ a(Ep, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(ge, { children: [
                            /* @__PURE__ */ a(Qr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (O = m.media.files[0]) != null && O.duration ? Js(m.media.files[0].duration) : ""
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
        lt && /* @__PURE__ */ a(
          Gs,
          {
            open: Tt,
            onClose: () => Qt(!1),
            criteria: io,
            activeFilter: lt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              Qt(!1), sn({ performerFilter: m });
            }
          }
        ),
        hn && /* @__PURE__ */ a(
          Ao,
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
const El = "data-quality.reviews-sort.v1", Ip = { sort: "name", direction: "asc" };
function $p() {
  try {
    const e = JSON.parse(localStorage.getItem(El) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Ip;
}
function Rp(e) {
  try {
    localStorage.setItem(
      El,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Al(e, t, n, r) {
  const i = r === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], l = t[s.id], f = typeof c == "number", d = typeof l == "number";
      if (f !== d) return f ? -1 : 1;
      if (f && d && c !== l)
        return (c - l) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Fi(e, t) {
  const n = Le(e), r = Vn(fo(n)), i = n === "tag" ? "tag" : Ae(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function Op({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Fi(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Fi(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Fi(e, t)
    ] })
  ] });
}
function Mp({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: l,
  headingRef: f,
  notices: d,
  onOpen: p,
  onNew: h,
  onImport: g,
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = $(null), w = qe(
    () => Al(e, t, n, r),
    [e, t, n, r]
  ), k = e.every((x) => t[x.id] !== void 0), M = r === "asc" ? "ascending" : "descending";
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
              /* @__PURE__ */ a(fd, { "aria-hidden": "true" }),
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
            onClick: y,
            children: [
              /* @__PURE__ */ a(nc, { "aria-hidden": "true" }),
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
                onChange: (x) => i(x.target.value),
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
              "aria-label": `Sort direction: ${M}`,
              title: `Sort direction: ${M}`,
              onClick: () => o(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(pd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(hd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? M : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? M : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: w.map((x) => {
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
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Wc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: x.name }),
                    x.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: x.description, children: x.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Qc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Op, { review: x, count: t[x.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Io, { label: `Actions for ${x.name}`, items: N(x) }) })
          ] }, x.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(si, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Cl(e, { id: t, name: n, description: r }) {
  const i = { id: t, name: n, description: r }, o = (s, c = {}) => ({
    filter: { page: 1, perPage: 40, ...s },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...c
  });
  switch (e) {
    case "tag":
      return {
        ...i,
        entityType: "tag",
        view: {
          ...o({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } }
        },
        actions: []
      };
    case "audio":
      return {
        ...i,
        entityType: "audio",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: []
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...i,
        entityType: e,
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end" }),
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
        ...i,
        entityType: "video",
        view: o({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: []
      };
  }
}
function Fp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), l = $(null), f = $(o);
  f.current = o;
  const d = $(null), p = rt();
  ee(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = l.current) == null || y.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(o);
  ee(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!i.name.trim() || h.current && !o && N) && ((w = l.current) == null || w.focus()), h.current = o;
  }, [s, o]);
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
      onCancel: (y) => {
        y.preventDefault(), g();
      },
      onClose: () => {
        var y;
        f.current ? (y = c.current) == null || y.showModal() : r();
      },
      children: /* @__PURE__ */ u(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), f.current || n();
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
                  disabled: o,
                  onClick: g,
                  children: /* @__PURE__ */ a(Ca, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Xc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Le(i) && t(Cl(y, i));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => To(i), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: o, onClick: g, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const xp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Pp(e, t, n, r) {
  return kl(
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
function Fs(e, t) {
  return Le(t) === "video" && Lr(t.view.objectFilter, e.view.objectFilter, _o(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function xs(e, t) {
  return cr(
    JSON.parse(rr(Mr(e))),
    JSON.parse(rr(Mr(t)))
  );
}
const xi = 180;
function Ps(e) {
  return Le(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ls(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Ds() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Pi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  fi.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  Sl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Lp(e) {
  return tn({ ...e, page: 1 });
}
function Tl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Vr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Dp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(so, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(bd, { "aria-hidden": "true" }) }
], _p = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(so, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(gd, { "aria-hidden": "true" }) }
], _s = [], Il = "(min-width: 900px)";
function jp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Il);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Up() {
  return typeof window.matchMedia == "function" && window.matchMedia(Il).matches;
}
function Bp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [k, M] = T([]), [x, B] = T(""), [C, D] = T(!0), [P, ne] = T("account"), [J, j] = T(""), [z, F] = T(""), [_, L] = T(!1), [Y, Q] = T(!1), [ae, H] = T(""), [S, ce] = T(Ds), A = $(S);
  A.current = S;
  const [X, ue] = T({}), me = $(X);
  me.current = X;
  const K = $(t);
  K.current = t;
  const ye = $(s);
  ye.current = s;
  const Ee = $(!1), ke = $(!0);
  ee(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [Ne, Je] = T(!S);
  Ne !== !S && (Je(!S), S || ue({}));
  const [pe, at] = T($p), { sort: Ye, direction: Dt } = pe, Jt = (b) => {
    const q = { ...pe, ...b };
    at(q), Rp(q);
  }, Ht = $(null), tt = $(null), [Be, Ge] = T(null), [Xe, ur] = T(!1), [gt, Jn] = T(!1), [Ze, Ce] = T(null), [Ke, ze] = T(null), Rt = !!Ze || !!Ke, fr = $(Rt);
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
  ), Fe = U ? Le(U) : "video", yt = fo(Fe), En = U ? Ae(U) : !1, se = Fe === "video" ? U : null, Mt = !!(U != null && U.actions.some(or)), _t = En && Mt, Hn = (!!se || Fe === "audio" || En) && Mt, [An, Cn] = T(null), mn = (An == null ? void 0 : An.id) === (U == null ? void 0 : U.id) ? An == null ? void 0 : An.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", je = En || Fe === "audio" || Fe === "video" && mn === "single", [He, ot] = T(0), $t = $(-1), Qn = $(!1), xn = $(je);
  xn.current = je, ee(() => {
    const b = () => {
      const q = xn.current;
      if (!q && Zn.current) {
        Qn.current = !0;
        return;
      }
      $t.current = -1, On(), q || ot((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const rn = yt === "audio" ? h : d, Wn = Fe === "tag" ? "Tag" : yt === "audio" ? "Audio" : "Video", I = Fe === "tag" ? y : rn, G = $(
    null
  ), ie = pp(se), [oe, le] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Re, Te] = T({
    page: 1,
    perPage: 40
  }), [Ie, Ft] = T({ items: [], totalCount: 0 }), [be, st] = T(S);
  be !== S && (st(S), Ft({ items: [], totalCount: 0 }), Q(!1));
  const [Se, Pn] = T(!1), [Oe, pr] = T(""), [Wt, na] = T(!1), [jt, ra] = T(!1), [xt, an] = T(() => /* @__PURE__ */ new Set()), hr = $(xt);
  hr.current = xt;
  const Tn = $(/* @__PURE__ */ new Map()), mr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [pt, wt] = T(null), Qe = $(pt);
  Qe.current = pt;
  const [it, ct] = T(!1), vt = $(it);
  vt.current = it;
  const Yn = $(null), [Ln, Ut] = T(!1), [gn, Dr] = T("grid"), [Xn, on] = T(xi), [$e, gr] = T(!1), [bn, aa] = T(!1), Zn = $(!1), [pi, ia] = T(""), [lt, sn] = T(""), [br, yn] = T(""), [De, yr] = T(null), [Nt, _r] = T(""), [cn, wr] = T(!1), [jr, Ma] = T({}), Bt = $(/* @__PURE__ */ new Map()), Fa = $(null), Dn = $(null), er = !!U, hi = ro(jp, Up, () => !1) && er, [Ur, mi] = T({ top: 0, bottom: 0 });
  Ct(() => {
    if (!er) return;
    const b = () => {
      const R = Dn.current;
      if (!R) return;
      const V = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), re = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      mi(
        (W) => W.top === V && W.bottom === re ? W : { top: V, bottom: re }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [er]);
  const [xa, oa] = T(0), sa = $(null), gi = Nn((b) => {
    var R;
    if ((R = sa.current) == null || R.disconnect(), sa.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => oa(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), sa.current = q;
  }, []), Gt = $(0), vr = $(0), Nr = $(null), _n = $(null), qr = qc(
    U && !je ? he ? [...U.actions, ...he.draft.actions] : U.actions : _s
  ), ln = qe(
    () => he && U && fe ? Pp(he.draft, U, oe, fe) : null,
    [he, U, oe, fe]
  ), In = qe(
    () => U && fe ? kl(
      { ...fe, view: { ...U.view, filter: { ...oe, page: 1 } } },
      fe
    ) : null,
    [U, fe, oe]
  ), $n = qe(
    () => fe ? Wr(Mr(fe)) : "",
    [fe]
  ), Pa = qe(
    () => In != null && Wr(Mr(In)) !== $n,
    [In, $n]
  ), bi = qe(
    () => ln != null && Wr(Mr(ln)) !== $n,
    [ln, $n]
  );
  ee(() => {
    if (!lt) return;
    const b = window.setTimeout(() => sn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [lt]), ee(() => {
    if (!Be || Be.alert) return;
    const b = window.setTimeout(() => Ge(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Be]), ee(() => {
    const b = se ? Oo(se.view.objectFilter) : [];
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
    () => se ? Mo(
      se.view.objectFilter,
      jr
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [jr, U, se]
  ), la = Nn(async () => {
    c(!0), f("");
    try {
      const b = await Dd();
      n(b.reviews), o(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), ne(b.storage ?? "account"), j(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), Pi(""));
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
      M([]), B("");
      return;
    }
    const b = new AbortController();
    return B(""), Wd(b.signal).then(M).catch((q) => {
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
      (Ae(q) ? Fo(q, b.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : Jr(xo(q, V), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Le(q) === "tag" ? Ei(
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
    const b = tt.current;
    if (S || s || !b) return;
    tt.current = null, (V = (b === "heading" ? null : [...((R = Dn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Ht.current) == null || V.focus();
  }, [S, s, Ke, t]);
  const da = $(0), Sr = Nn(async () => {
    const b = ++da.current;
    yr(null), _r("");
    try {
      const q = await (_t ? yc(yt) : bc(yt));
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
      const W = new AbortController();
      Nr.current = W, q = tn(q);
      const We = Number(q.page);
      R && (q = { ...q, page: 1 }), le(q), ra(R), Pn(!0), pr("");
      try {
        const ut = (ft) => Le(b) === "tag" ? Ei(
          b,
          ft,
          W.signal
        ) : Jr(
          b,
          ft,
          W.signal
        );
        let mt = await ut(q);
        const Vt = Math.max(
          1,
          Math.ceil(mt.totalCount / Number(q.perPage))
        ), Pe = R ? Vt : Math.min(We, Vt);
        return Number(q.page) !== Pe && (q = { ...q, page: Pe }, mt = await ut(q)), re === Gt.current && te(mt) && (((ht = _n.current) == null ? void 0 : ht.page) !== Pe && (_n.current = {
          page: Pe,
          ids: new Set(mt.items.map((ft) => ft.id))
        }), Ft(mt), V && Z(
          () => new Set(mt.items.map((ft) => ft.id))
        ), le(q), Te(q)), mt;
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
    if (vr.current += 1, $t.current = -1, Gt.current += 1, (q = Nr.current) == null || q.abort(), Tt(null), Qt.current = null, Q(!1), H(""), F(""), L(!1), an(/* @__PURE__ */ new Set()), Tn.current.clear(), wt(null), ct(!1), gr(!1), Zn.current = !1, ia(""), sn(""), yn(""), Ft({ items: [], totalCount: 0 }), _n.current = null, na(!1), !U || je) {
      Pn(!1), It(null);
      return;
    }
    let b = !0;
    return Pn(!0), (async () => {
      let R = fe ?? U;
      It(null);
      let V = null;
      const te = new URLSearchParams(window.location.search);
      if (Le(U) === "video" && fi.some((xe) => te.has(xe)))
        try {
          const xe = R;
          V = no(xe, te);
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
        re = await Gd(i, U.id);
      } catch (xe) {
        b && (L(!0), F(
          xe instanceof Error ? xe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const W = (re == null ? void 0 : re.signature) === rr(R) ? re : null, We = V ? V.query.filter : W ? tn(W.filter) : Lp(R.view.filter);
      le(We), Dr(
        W ? Ls(W.displayMode, Le(U)) : Ps(U)
      ), on(
        W ? W.cardSize ?? xi : xi
      );
      try {
        const xe = await Rn(
          R,
          We,
          V ? V.startAtEnd : !W && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const ht = Xo(
          xe.items.map((ut) => ut.id),
          (W == null ? void 0 : W.focusedId) ?? null,
          (W == null ? void 0 : W.index) ?? 0
        );
        wt(ht), O(ht);
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
      $e || he || bn || ae !== `${U.id}:${He}` || (bt(0), qi());
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
    !se || je || !Y || Se || Oe || $e || Qn.current || $t.current !== He || wa(se.id, {
      filter: oe,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, je, Y, Se, Oe, oe, $e, He]);
  const Me = qe(
    () => Ie.items.map((b) => b.id),
    [Ie.items]
  );
  ee(() => {
    if (!Y || !U || !i || Se || Oe || $e || (Ve == null ? void 0 : Ve.id) === U.id || _ || $t.current !== He)
      return;
    const b = {
      version: 1,
      signature: rr(U),
      filter: oe,
      focusedId: pt,
      index: Math.max(0, Me.indexOf(pt ?? -1)),
      displayMode: gn,
      cardSize: Xn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + U.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (z) return;
    let q = !0;
    const R = window.setTimeout(() => {
      Kd(i, U.id, b).catch((V) => {
        q && F(
          "Progress is kept in this browser, but account sync failed. " + (V instanceof Error ? V.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    Y,
    i,
    U,
    Se,
    Oe,
    $e,
    oe,
    pt,
    Me,
    gn,
    Xn,
    Ve,
    z,
    _,
    He
  ]);
  const yi = Ie.items.find((b) => b.id === pt) ?? null, Br = Fe === "video" ? yi : null;
  it && Br && (Yn.current = Br);
  const wn = Br ?? (it ? Yn.current : null), m = ts(xt, pt), E = Me.length > 0 && Me.every((b) => xt.has(b)), O = Nn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var V;
      if (fr.current || Od(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = Bt.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    Y && !vt.current && O(Qe.current);
  }, [Y, O]), ee(() => {
    Se || !Me.length || (Qe.current == null || !Me.includes(Qe.current)) && (wt(Me[0]), vt.current || O(Me[0]));
  }, [O, Me, Se]);
  const Z = Nn(
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
  ), de = Nn(
    (b) => {
      if (!Me.length) return;
      const q = Math.max(
        0,
        Me.indexOf(Qe.current ?? Me[0])
      ), R = Me[Math.max(0, Math.min(Me.length - 1, q + b))];
      wt(R), vt.current || O(R);
    },
    [O, Me]
  ), we = Nn(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", V = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = V != null && (!v || !k.some((et) => et.id === V)), re = "effect" in b && R && !v, W = ts(
        hr.current,
        Qe.current
      );
      if (!U || Zn.current || Se || Oe) return;
      const We = R && !I ? `${Wn} write permission is required to apply ${b.label}.` : re || te ? `${b.label} needs a tag group that is unavailable.` : or(b) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : W.length ? "" : `Select or focus a ${Fe} before applying ${b.label}.`;
      if (We) {
        yn(We);
        return;
      }
      const xe = ++vr.current, ht = U.id, ut = [...Me], mt = Ie, Vt = Qe.current, Pe = new Set(hr.current), ft = new Map(
        W.map((et) => [et, Tn.current.get(et) ?? 0])
      ), Cr = () => xe === vr.current && U.id === ht;
      Zn.current = !0, gr(!0), ia(
        hr.current.size ? `${W.length} selected ${Fe}s` : `the focused ${Fe}`
      ), sn(""), yn("");
      const zo = mt.items.filter(
        (et) => !W.includes(et.id)
      ), Ul = zo.map((et) => et.id), Vo = ns(
        ut,
        Ul,
        Vt,
        W.includes(Vt ?? -1)
      );
      q || (Ft({
        items: zo,
        totalCount: mt.totalCount
      }), an((et) => {
        const Yt = new Set(et);
        for (const Xt of W) Yt.delete(Xt);
        return Yt;
      }), wt(Vo), vt.current || O(Vo));
      let Si = !1;
      try {
        if ("effect" in b ? await iu(b, W) : await vc(yt, b, W), Si = !0, !Cr()) return;
        q || an((et) => {
          const Yt = new Set(et);
          for (const Xt of W)
            (Tn.current.get(Xt) ?? 0) === ft.get(Xt) && Yt.delete(Xt);
          return Yt;
        }), sn(
          `${b.label}: ${W.length} ${Fe}${W.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (et) {
        if (!Cr()) return;
        Ft(mt), an((Yt) => {
          const Xt = new Set(Yt);
          for (const Gr of W)
            Pe.has(Gr) && (Tn.current.get(Gr) ?? 0) === ft.get(Gr) && Xt.add(Gr);
          return Xt;
        }), wt(Vt), vt.current || O(Vt), yn(
          et instanceof Error ? et.message : "Action failed."
        );
      }
      try {
        if (!Cr()) return;
        if (q) {
          const kt = Fe === "tag" ? await Ei(U, oe) : await Jr(U, oe), vn = new Map(
            kt.items.map((Lt) => [Lt.id, Lt])
          );
          if (Fe !== "tag" && await Promise.all(
            W.filter((Lt) => !vn.has(Lt)).map(async (Lt) => {
              const ha = await ti(yt, Lt).catch(() => null);
              ha && vn.set(Lt, ha);
            })
          ), !Cr()) return;
          const Kr = new Set(W), Zt = "effect" in b ? b.effect : null, en = (Zt == null ? void 0 : Zt.mode) === "SET_TAG_GROUP" ? k.find((Lt) => Lt.id === Zt.tagGroupId) : void 0, ki = (Lt) => Zt && Zt.mode !== "SKIP" && Kr.has(Lt.id) ? {
            ...Lt,
            tagGroupId: (en == null ? void 0 : en.id) ?? null,
            tagGroupName: (en == null ? void 0 : en.name) ?? null,
            tagGroupColor: (en == null ? void 0 : en.color) ?? null
          } : Lt;
          Ft((Lt) => ({
            items: Lt.items.map((ha) => vn.get(ha.id) ?? ki(ha)),
            totalCount: kt.totalCount
          }));
          return;
        }
        const et = new Set(W), Yt = mr && ut.length > 0 && ut.every((kt) => et.has(kt)), Xt = _n.current, Gr = (U.view.startFrom ?? "end") !== "beginning", Jo = (kt) => {
          const vn = kt.items.map((Zt) => Zt.id), Kr = (Xt == null ? void 0 : Xt.page) === Number(oe.page) && vn.some((Zt) => Xt.ids.has(Zt));
          return kt.totalCount > 0 && Number(oe.page) > 1 && (!vn.length || Gr && !Kr);
        }, Ho = await Rn(U, oe, !1, Yt, (kt) => !Jo(kt));
        if (!Cr()) return;
        let pa = Ho.items.map((kt) => kt.id);
        if (Jo(Ho)) {
          const kt = Math.max(1, Number(oe.page) - 1), vn = { ...oe, page: kt };
          le(vn), pa = (await Rn(
            U,
            vn,
            !1,
            Yt
          )).items.map((en) => en.id), an(
            (en) => new Set([...en].filter((ki) => pa.includes(ki)))
          );
          const Zt = pa.at(-1) ?? null;
          wt(Zt), vt.current || O(Zt);
        } else {
          an(
            (vn) => new Set([...vn].filter((Kr) => pa.includes(Kr)))
          );
          const kt = ns(
            ut,
            pa,
            Vt,
            Si && W.includes(Vt ?? -1)
          );
          wt(kt), vt.current && kt == null && ct(!1), vt.current || O(kt);
        }
      } catch (et) {
        Cr() && yn(
          (Yt) => `${Yt ? `${Yt} ` : ""}${Si ? "The action completed, but " : ""}the queue could not be refreshed. ${et instanceof Error ? et.message : "Refresh failed."}`
        );
      } finally {
        Cr() && (Zn.current = !1, gr(!1), ia(""), Qn.current && (Qn.current = !1, On(), ot((et) => et + 1)));
      }
    },
    [
      I,
      v,
      k,
      Fe,
      De,
      Rn,
      oe,
      O,
      Me,
      Ie,
      Se,
      Oe,
      U
    ]
  );
  function dt() {
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
      Vr(b), ct(!1), O(Qe.current);
      return;
    }
    if (!Rd(q)) return;
    const te = $d(q);
    if (b.key === "Escape") {
      Vr(b), Z(() => /* @__PURE__ */ new Set()), q instanceof HTMLElement && q.closest(".dq-action-bar") && O(Qe.current, !1);
      return;
    }
    if (!it && b.key === " " && te) {
      Vr(b), pt != null && Z((W) => Va(W, pt));
      return;
    }
    if (!($e || Se) && !it && b.key === "Enter" && pt != null && te) {
      if (Fe !== "tag" && he) return;
      Vr(b), Fe === "tag" ? window.open(`/tag/${pt}`, "_blank", "noopener,noreferrer") : ct(!0);
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
    if (!R && !V || !b.key.startsWith("Arrow") || !Md(q)) return;
    const te = Fd(b.key, dt());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), de(te));
  }, ee(() => {
    const b = (q) => dn.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), ee(() => {
    const b = (q) => {
      var V;
      const R = q.target;
      !(R instanceof HTMLInputElement) || R.type !== "range" || !((V = Dn.current) != null && V.contains(R)) || xn.current || R.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (R.blur(), O(Qe.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [O]);
  const Ue = (he == null ? void 0 : he.saving) === !0 || bn, jn = $e || Se && !Y || Ue, qt = ko();
  So({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !je && !Rt && !he && !it && !Ln && !Oe && (Ie.items.length > 0 || Se || $e),
    actions: (U == null ? void 0 : U.actions) ?? _s,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && we(R, q);
    },
    onFind: () => Ut(!0),
    onSelectAll: () => Z((b) => Id(b, Me))
  }), ee(() => Ut(!1), [je, it, U == null ? void 0 : U.id]);
  function Kt(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, V = R != null && !k.some((te) => te.id === R);
    return $e || Se || !!Oe || q && !I || "effect" in b && q && (!v || V) || or(b) && (De == null ? void 0 : De.kind) !== "ready" || !m.length;
  }
  function nt(b) {
    Cn(null), bt(0), Ge(null), ce(b), Pi(b, !!b && !U);
  }
  function St() {
    Ee.current || (ql() ? (Ee.current = !0, window.history.back()) : nt(""));
  }
  function On() {
    const b = Ee.current;
    Ee.current = !1;
    let q = Ds();
    q && !ye.current && !K.current.some((V) => V.id === q) && (q = "", Pi(""));
    const R = A.current;
    q !== R && (bt(0), b || Ge(null), !q && R && (tt.current ?? (tt.current = { reviewId: R }))), ce(q);
  }
  function kr() {
    tt.current = "heading", Ge(null), St();
  }
  function Er(b) {
    b !== S && nt(b), bt((q) => q + 1);
  }
  function Ar() {
    Ge(null), Ce({
      review: Cl("video", { id: crypto.randomUUID(), name: "", description: "" }),
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
      if (!await fa((re) => (R = es(
        re.find((W) => W.id === b.id) ?? b,
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
    const b = Ke.review, q = Al(t, X, Ye, Dt).map((te) => te.id), R = q.filter((te) => te !== b.id), V = R[Math.min(q.indexOf(b.id), R.length - 1)];
    ze({ review: b, pending: !0 });
    try {
      if (!await fa((te) => te.filter((re) => re.id !== b.id)))
        throw new Error("Could not save reviews.");
      tt.current = b.id !== S && V ? { reviewId: V } : "heading", Ge({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ge({ text: `“${b.name}” was not deleted. ${Da(te)}`, alert: !0 });
    } finally {
      ze(null);
    }
  }
  async function $l(b) {
    if (!(pn || !C)) {
      Ge(null), ur(!0);
      try {
        const q = await bf(b);
        let R = 0, V = 0;
        if (q.length && !await fa((re) => {
          const W = [...re];
          R = V = 0;
          for (const We of q) {
            const xe = W.find((ht) => ht.id === We.id);
            if (!xe) W.push(We);
            else if (JSON.stringify(xe) !== JSON.stringify(We))
              W.push(es(We, W, crypto.randomUUID())), V++;
            else continue;
            R++;
          }
          return R ? W : re;
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
  function jo(b) {
    const q = !C || pn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ws, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void ua(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(nc, { "aria-hidden": "true" }),
        onSelect: () => To(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(oi, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ge(null), ze({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Uo(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || gt
      },
      ...jo(b),
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
    if (!i) return !1;
    let q = [];
    const R = await Bd(i, (W) => {
      q = W;
      const We = b(W);
      return We === W ? W : We.map(zp);
    });
    if (n(R), !ke.current) return !0;
    const V = A.current;
    V && !R.some((W) => W.id === V) && St();
    const te = q.find((W) => W.id === V), re = R.find((W) => W.id === V);
    return re && te && ((re.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && Cn(null), re.view.displayMode !== te.view.displayMode && Dr(Ps(re))), !0;
  }
  function wi(b) {
    return fa((q) => Kp(q, b));
  }
  function Rl(b) {
    return wi(b).catch((q) => {
      throw A.current !== b.id && vi(b, q), q;
    });
  }
  function vi(b, q) {
    var V;
    if (!ke.current) return;
    const R = ((V = K.current.find((te) => te.id === b.id)) == null ? void 0 : V.name) ?? b.name;
    Ge({ text: `“${R}” was not saved. ${Da(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(js, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Wp().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Us,
        {
          message: l,
          onRetry: () => void la()
        }
      )
    ] });
  const Ni = /* @__PURE__ */ u(ge, { children: [
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
            wr(!0), _r(""), (_t ? tu(yt) : eu(yt)).then(Sr).catch(
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
          Tp,
          {
            review: fe ?? U,
            canWrite: En ? y : rn,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && rn,
            onBusy: gr,
            editRequest: Ot,
            onEditRequestHandled: () => bt(0),
            onSaveDefaults: C ? Rl : void 0,
            pageControls: {
              onBack: kr,
              moreItems: (b) => Uo(fe ?? U, b),
              onGrid: se ? () => Cn({ id: se.id, mode: "multiple" }) : void 0,
              notices: Ni,
              busy: gt
            },
            stayOnTap: Fn,
            onStayOnTapChange: Sn
          },
          U.id
        ) : U ? _l(U) : /* @__PURE__ */ a(
          Mp,
          {
            reviews: t,
            counts: X,
            sort: Ye,
            direction: Dt,
            onSortChange: (b) => Jt({ sort: b }),
            onDirectionChange: (b) => Jt({ direction: b }),
            storage: xp[P],
            canConfigure: C,
            busy: pn,
            headingRef: Ht,
            notices: Ni,
            onOpen: nt,
            onNew: () => Ar(),
            onImport: (b) => void $l(b),
            onExportAll: () => Yc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
                disabled: !C || pn,
                onSelect: () => Er(b.id)
              },
              ...jo(b)
            ]
          }
        ),
        it && wn && se && /* @__PURE__ */ a(
          Qp,
          {
            video: wn,
            review: se,
            details: hp(wn, se, ie.ids),
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
            onToggleSelected: () => Z((b) => Va(b, wn.id)),
            onPrevious: () => de(-1),
            onNext: () => de(1),
            onClose: () => {
              ct(!1), O(Qe.current);
            },
            onAction: we,
            findOpen: Ln,
            onFindOpenChange: Ut
          }
        ),
        Ln && U && !je && !it && /* @__PURE__ */ a(
          Ao,
          {
            actions: U.actions,
            tagGroups: k,
            trees: qr,
            isDisabled: Kt,
            onApply: (b, q) => {
              Ut(!1), we(b, q);
            },
            onClose: () => Ut(!1)
          }
        ),
        Ze && /* @__PURE__ */ a(
          Fp,
          {
            draft: Ze,
            onChange: (b) => Ce((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void zt(),
            onCancel: () => Ce(null)
          }
        ),
        /* @__PURE__ */ a(
          Zl,
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
      const W = Rn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), We = Gt.current, xe = await W;
      if (We !== Gt.current) return;
      const ht = xe.items.map((mt) => mt.id);
      an(
        (mt) => new Set([...mt].filter((Vt) => ht.includes(Vt)))
      );
      const ut = Xo(ht, te, re);
      wt(ut), V && !vt.current && O(ut, !1);
    } catch {
    }
  }
  function Ol(b) {
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
    }, W = !xs(re, fe), We = W ? re : fe;
    It(W ? re : null), sn(W ? "" : "Review queue defaults restored."), _a(We, te, We.view.startFrom !== "beginning");
  }
  function Ml() {
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
  function Fl() {
    if ($e || Se || Oe || Ue || !U || !In || !C)
      return;
    const b = U, q = In;
    aa(!0), wi(q).then((R) => {
      !R || A.current !== q.id || (It(Fs(q, b)), sn("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? vi(q, R) : yn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => aa(!1));
  }
  function qi() {
    if (!U || !fe || Zn.current || he || bn) return;
    hn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Qt.current = {
      temporaryReview: Ve,
      filter: oe,
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
    Ut(!1), ct(!1), sn(""), yn(""), Tt({ draft: b, saving: !1, error: "" });
  }
  function Bo() {
    Tt(null), Qt.current = null;
    const b = hn.current;
    hn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : O(Qe.current, !1);
    });
  }
  function xl() {
    var q;
    if (!he || he.saving) return;
    const b = Qt.current;
    b && (Gt.current += 1, (q = Nr.current) == null || q.abort(), G.current = null, Pn(!1), It(b.temporaryReview), le(b.filter), Te(b.loadedFilter), Ft(b.queue), pr(b.queueError), ra(b.retryFromEnd), Z(() => b.selectedIds), wt(b.focusedId), _n.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Bo();
  }
  async function Pl() {
    if (!he || he.saving || !ln || !U) return;
    const b = U, q = { ...ln, name: ln.name.trim() }, R = Sa(q);
    if (R) {
      Tt((V) => V && { ...V, error: R });
      return;
    }
    Tt((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await wi(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      It(Fs(q, b)), Le(q) === "video" && wa(q.id, {
        filter: oe,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), sn("Review saved."), Bo();
    } catch (V) {
      if (A.current !== q.id) {
        vi(q, V);
        return;
      }
      Tt(
        (te) => te && {
          ...te,
          saving: !1,
          error: lc(V)
        }
      );
    }
  }
  function Go() {
    U && Rn(U, oe, jt, mr).catch(() => {
    });
  }
  function Ll() {
    an(/* @__PURE__ */ new Set()), Tn.current.clear(), wt(null);
  }
  function Dl(b) {
    !U || $e || Ue || b === Number(oe.page) || Gp(
      { ...oe, page: b },
      U,
      (q, R) => Rn(q, R, !1, mr),
      Ll
    );
  }
  function Ko(b) {
    if (!se || !fe || $e || Se || Ue) return;
    const q = Nl(se, b, fe.view.objectFilter), R = !xs(q, fe);
    It(R ? q : null), R ? _a(q, { ...oe, page: 1 }) : _a(
      fe,
      { ...oe, page: 1 },
      fe.view.startFrom !== "beginning"
    );
  }
  function _l(b) {
    var xe, ht, ut, mt, Vt;
    const q = Fe === "tag", R = q ? "tag" : "video", V = Math.max(1, Number(oe.perPage) || 40), te = Math.max(1, Math.ceil(Ie.totalCount / V)), re = Math.min(Math.max(1, Number(oe.page) || 1), te), W = [
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
            el,
            {
              name: b.name,
              description: b.description,
              entityType: Fe,
              onBack: kr,
              backDisabled: $e || !!he || gt,
              onEdit: he ? () => {
                var Pe;
                return (Pe = kn.current) == null ? void 0 : Pe.focus();
              } : qi,
              editDisabled: !he && ($e || Se || Wt || bn || gt || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: jn, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  va,
                  {
                    filter: Oe ? Re : oe,
                    onFilterChange: Ol,
                    totalCount: Ie.totalCount,
                    sortOptions: q ? td : zs,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: gn,
                    zoomLevel: (Xn - 225) / 50,
                    onZoomChange: (Pe) => on(Math.round(225 + Pe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? ed : ii,
                    customFieldEntityType: Fe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: ca,
                    onObjectFilterChange: (Pe) => {
                      jn || (G.current = Fe === "video" ? rl(
                        Pe,
                        jr,
                        b.view.objectFilter
                      ) : Pe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(tl, { page: re, pages: te, onPage: Dl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(ge, { children: [
                se && /* @__PURE__ */ a(
                  nl,
                  {
                    mode: "multiple",
                    disabled: $e || Se || Rt || !!he || bn || gt,
                    onChange: () => Cn({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  $f,
                  {
                    options: q ? _p : Dp,
                    value: gn,
                    onChange: (Pe) => Dr(Ls(Pe, Fe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Io,
                {
                  disabled: $e || !!he,
                  items: Uo(fe ?? b, {
                    onSelect: qi,
                    disabled: Se || Wt || bn || !C
                  })
                }
              ),
              queueDiffers: Y ? (Ve == null ? void 0 : Ve.id) === S : void 0,
              queueChange: !he && (Ve == null ? void 0 : Ve.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Pa ? Fl : void 0,
                saveDisabled: $e || Se || !!Oe || Ue || !C,
                onReset: Ml,
                resetDisabled: $e || Se || Ue
              } : void 0,
              chipsAfter: (ht = (xe = se == null ? void 0 : se.presentation) == null ? void 0 : xe.binParents) != null && ht.length || (mt = (ut = se == null ? void 0 : se.presentation) == null ? void 0 : ut.filterBins) != null && mt.length ? /* @__PURE__ */ u(ge, { children: [
                !!((Vt = se.presentation.binParents) != null && Vt.length) && /* @__PURE__ */ a(
                  mp,
                  {
                    videos: Ie.items,
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    trees: ie.ids,
                    disabled: $e || Se || Ue,
                    onToggle: Ko
                  }
                ),
                /* @__PURE__ */ a(
                  gp,
                  {
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    queueFilter: oe,
                    queueCount: Se || Oe ? null : Ie.totalCount,
                    disabled: $e || Se || Ue,
                    countsPaused: $e || Se || Ue || !Y,
                    onToggle: Ko
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          Ni,
          se && ie.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: ie.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && ln && /* @__PURE__ */ a(
              Zc,
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
                dirty: bi,
                criteriaChanged: Pa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Oe && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Oe,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Go, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Pl(),
                onCancel: xl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${xa}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !Ie.items.length && /* @__PURE__ */ a(js, { label: "Loading review queue…" }),
                    Oe && !Se && /* @__PURE__ */ a(
                      Us,
                      {
                        message: Oe,
                        retryLabel: Wt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Wt && fe && Le(fe) === "video") {
                            const Pe = xr(fe);
                            wa(fe.id, { ...Pe, filter: { ...Pe.filter, page: void 0 } }), ot((ft) => ft + 1);
                            return;
                          }
                          Go();
                        }
                      }
                    ),
                    !$e && !Se && !Oe && !Ie.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(si, {}),
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
                        children: Ie.items.map(jl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: gi, children: /* @__PURE__ */ a(
                    Gc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: k,
                      trees: qr,
                      isDisabled: Kt,
                      paused: !!he,
                      busy: $e || Se,
                      onApply: (Pe) => void we(Pe),
                      onFind: () => Ut(!0),
                      status: $e ? `Applying action to ${pi}…` : "",
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
                            onClick: () => Z((Pe) => /* @__PURE__ */ new Set([...Pe, ...Me])),
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
                            onClick: () => Z(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(At, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: W.length ? W.join(" ") : void 0,
                      keyHints: q ? he ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: We || lt ? /* @__PURE__ */ u(ge, { children: [
                        We && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                          br
                        ] }),
                        lt && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: lt })
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
  function jl(b) {
    var R, V, te;
    if (Fe === "tag") {
      const re = b;
      return /* @__PURE__ */ a(
        Vp,
        {
          tag: re,
          displayMode: gn === "list" ? "list" : "grid",
          focused: re.id === pt,
          selected: xt.has(re.id),
          setRef: (W) => {
            W ? Bt.current.set(re.id, W) : Bt.current.delete(re.id);
          },
          onFocus: () => wt(re.id),
          onToggle: () => {
            Z((W) => Va(W, re.id)), O(re.id, !1);
          },
          onOpen: () => window.open(`/tag/${re.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        re.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Jp,
      {
        video: wl(q, se, ie.ids),
        showTagBins: ((V = (R = se == null ? void 0 : se.presentation) == null ? void 0 : R.annotations) == null ? void 0 : V.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: gn,
        cardsScroll: hi,
        focused: q.id === pt,
        selected: xt.has(q.id),
        setRef: (re) => {
          re ? Bt.current.set(q.id, re) : Bt.current.delete(q.id);
        },
        onFocus: () => wt(q.id),
        onToggle: () => Z((re) => Va(re, q.id)),
        onPreview: () => {
          he || (wt(q.id), ct(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Gp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Va(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Kp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function zp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Vp({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: c,
  onNavigate: l
}) {
  const f = $(null), d = Nn(
    (p) => {
      f.current = p, i(p);
    },
    [i]
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
      onFocus: o,
      onClick: (p) => {
        o(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${r ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ a(
        nd,
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
function Jp({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: l,
  onPreview: f,
  onNavigate: d
}) {
  var v, w;
  const p = Tl(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Ct(() => {
    const k = h.current;
    if (!k) return;
    const M = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), x = k.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    x && (x.id = B), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", B), M.classList.add("dq-card-link"));
    const C = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
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
      "aria-current": i ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (k) => {
        c(), k.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          rd,
          {
            video: g,
            selected: o,
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
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Hp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Hp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [i, o] = T(!1), [s, c] = T(!1), [l, f] = T(!1);
  return ee(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const p = t ? d.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: p, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: p, threshold: [0, 0.6, 1] }
    );
    return h.observe(d), g.observe(d), () => {
      h.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), ee(() => {
    if (!i) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return ve(Xd(e.id), {
      signal: d.signal
    }).then((p) => {
      d.signal.aborted || f(p.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [i, e.id]), ee(() => {
    const d = r.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [l, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: l && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: Yd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Qp({
  video: e,
  review: t,
  details: n,
  selectedCount: r,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: c,
  assessmentReady: l,
  trees: f,
  selected: d,
  hasPrevious: p,
  hasNext: h,
  onToggleSelected: g,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: k,
  onFindOpenChange: M
}) {
  const x = $(null), B = Oa(), C = $(null), D = $(null), P = e.files[0], ne = Tl(e), J = (L) => i || o || "steps" in L && L.steps.length > 0 && !c || or(L) && !l;
  So({
    surface: "overlay",
    enabled: !k,
    actions: t.actions,
    onAction: (L, Y) => {
      const Q = t.actions[L];
      Q && w(Q, Y);
    },
    onFind: () => M(!0)
  }), ee(() => {
    var Y;
    const L = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = x.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = L;
    };
  }, []);
  function j(L) {
    var ae, H, S;
    if (L.key !== "Tab") return;
    const Y = [
      ...((ae = x.current) == null ? void 0 : ae.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!Y.length) {
      L.preventDefault(), (H = x.current) == null || H.focus();
      return;
    }
    const Q = Y.indexOf(
      document.activeElement
    );
    L.shiftKey && Q <= 0 ? (L.preventDefault(), (S = Y.at(-1)) == null || S.focus()) : !L.shiftKey && Q === Y.length - 1 && (L.preventDefault(), Y[0].focus());
  }
  function z(L) {
    if (k || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = L.key === "ArrowLeft" || L.key === "ArrowRight";
    if (L.altKey && !Y) return;
    const Q = C.current, ae = L.currentTarget.querySelector("video");
    if (L.key === "Enter" || L.key === "Escape")
      L.repeat || v();
    else if (L.key === " " && Q)
      L.repeat || Q.toggle();
    else if (Y && Q)
      Q.seekBy(
        (L.key === "ArrowLeft" ? -1 : 1) * (L.shiftKey ? 5 : L.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(L.key) && Q) {
      const H = D.current;
      if (!L.repeat && (H == null ? void 0 : H.videoId) === e.id) {
        const S = [P == null ? void 0 : P.duration, ae == null ? void 0 : ae.duration].find(
          (ue) => ue != null && Number.isFinite(ue) && ue > 0
        ) ?? 0, ce = e.parentVideoId != null, A = ce ? e.clipStartSec ?? 0 : 0, X = (ce ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(X) && X > 0 && Number.isFinite(H.time) && Q.seekBy(A + X * Number(L.key) / 10 - H.time);
      }
    } else if (L.key === "ArrowUp" || L.key === "ArrowDown")
      !L.repeat && !i && !o && (L.key === "ArrowUp" && p && y(), L.key === "ArrowDown" && h && N());
    else return;
    Vr(L);
  }
  function F(L) {
    const Y = x.current, Q = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !Y || !Q || !Y.contains(Q) || Q.closest(".dq-player, .dq-find-action") || L.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (k) return;
    let L = 0;
    const Y = requestAnimationFrame(() => {
      L = requestAnimationFrame(() => {
        var ae;
        const Q = document.activeElement;
        (ae = x.current) != null && ae.isConnected && (!Q || Q === document.body || Q === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(L);
    };
  }, [k, i, o, h, p, e.id, B]);
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
                disabled: !p || i || o,
                onClick: y,
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
                disabled: !h || i || o,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(At, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(ec, { "aria-hidden": "true" })
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
                disabled: o,
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
                children: /* @__PURE__ */ a(tc, { "aria-hidden": "true" })
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
            Vs,
            {
              autostart: !0,
              streamUrl: ji("video", e.id),
              posterUrl: as(e),
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
          ) : /* @__PURE__ */ a("img", { src: as(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Gc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: J,
              busy: i || o,
              onApply: (L) => void w(L),
              onFind: () => M(!0),
              status: i ? `Applying action to ${_}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ a(
          Ao,
          {
            actions: t.actions,
            trees: f,
            isDisabled: J,
            onApply: (L, Y) => {
              M(!1), w(L, Y);
            },
            onClose: () => M(!1)
          }
        )
      ]
    }
  );
}
async function Wp() {
  const e = await ve("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let r = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (r = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([r], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = i, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(i);
}
function js({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(md, { className: "dq-spin" }),
    e
  ] });
}
function Us({
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
const ah = { components: { DataQualityPage: Bp } };
export {
  Bp as DataQualityPage,
  ah as default,
  cr as objectFiltersEqual
};
