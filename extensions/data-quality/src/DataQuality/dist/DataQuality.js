var Dl = Object.defineProperty;
var _l = (e, t, n) => t in e ? Dl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ko = (e, t, n) => _l(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as me, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Tt, useMemo as Ne, useCallback as $n, useSyncExternalStore as Zi, useId as at, createContext as jl, useContext as Ul, Fragment as eo } from "react";
import { useKeySequence as Bl, EntityReferenceMultiSelector as sr, SortableList as xs, TagBadge as Kl, EntityReferenceSelector as Go, EntityDetailTabs as Gl, FilterDialog as Ps, VIDEO_CRITERIA as ti, DetailListToolbar as ga, PERFORMER_CRITERIA as to, AUDIO_CRITERIA as Ls, NarrativeText as Vl, AUDIO_SORT_OPTIONS as zl, VIDEO_SORT_OPTIONS as Ds, AudioPlayer as Jl, VideoPlayer as _s, formatDuration as js, getResolutionLabel as Hl, ConfirmDialog as Ql, TAG_CRITERIA as Wl, TAG_SORT_OPTIONS as Yl, TagTile as Xl, VideoCard as Zl } from "@cove/runtime/components";
import { Search as Na, Flag as _n, Check as Yr, Pencil as Qr, Ban as za, ChevronDown as no, Plus as qa, Pin as Us, GripVertical as Bs, AlertTriangle as Ln, Copy as Ks, Trash2 as ni, X as Sa, Mic as ed, Users as Gs, Tag as Vs, Headphones as zs, Film as ri, ChevronLeft as ka, MoreHorizontal as td, RectangleHorizontal as nd, LayoutGrid as ro, ChevronRight as Js, Save as rd, RotateCcw as ad, Layers as Vo, Undo2 as id, RefreshCw as od, ExternalLink as Hs, SkipForward as sd, Upload as cd, Download as Qs, ArrowUp as ld, ArrowDown as dd, Loader2 as ud, List as fd, Grid3X3 as pd } from "@cove/runtime/lucide-react";
import { extensionFetch as hd } from "@cove/runtime/api";
import { createPortal as md } from "react-dom";
const ao = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, io = Object.keys(
  ao
);
function ba(e) {
  return e === "excludes" || e === "excludesAll";
}
function oo(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Ws(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function gd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const Ys = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ae(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function so(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return so(Le(e));
}
function bd(e) {
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
], ai = [
  ar.slice(0, 11),
  ar.slice(11, 22),
  ar.slice(22)
];
function ha(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ya(e) {
  return ha(e) ?? e.toLocaleUpperCase();
}
const ir = "none";
function Rr(e) {
  return typeof e == "string" && ar.includes(e);
}
function co(e) {
  const t = e.shortcut;
  return Rr(t) || t === ir ? t : "auto";
}
function Xs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const l = co(s);
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
function yd(e, t, n) {
  const { keys: r, actionOn: i } = Xs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
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
function wa(e) {
  var n;
  return Ae(e) && !ec(e.occurrence) ? "Complete the optional occurrence condition before saving." : !bd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Le(e) !== "tag" && e.actions.some(
    (r) => lo(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => jn(r, Le(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const wd = {
  video: 1e3,
  audio: 250
};
function Qt(e, t = "video") {
  const n = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(wd[t], n(e.perPage, 40))
    )
  };
}
function zo(e, t, n) {
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
function jn(e, t) {
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
  ) && !lo(e) : !1;
}
function vd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Dn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function lr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Zs(e) {
  return "steps" in e && e.steps.length > 0;
}
function or(e) {
  return "steps" in e ? e.steps.some((t) => Dn(t.mode)) : !1;
}
function lo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Dn(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ea(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Ys.includes(n.entityType)) && (!vd(n.entityType) || ec(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Nd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && jn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && jn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => wa(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Nd(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function Jo(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const i of r)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function qd(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function Ho(e, t, n) {
  return { ...structuredClone(e), id: n, name: qd(e.name, t) };
}
function ec(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && io.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Sd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Sd(e) {
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
function Qo(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Wo(e, t, n, r) {
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
function kd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    r ? n.delete(i) : n.add(i);
  return n;
}
function Ed(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function dn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Ad(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Cd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Td(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Id(e, t) {
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
const tc = "ext:com.midnightrider.data-quality:configuration", $d = "ext:cove-data-quality:video-reviews", Mi = "ext:com.midnightrider.data-quality:progress";
class Ja extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    Ko(this, "remote");
    this.remote = r;
  }
}
function nc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof Ja ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Aa = /* @__PURE__ */ new Map(), La = /* @__PURE__ */ new Map(), Tr = (e, t) => e.includes("*") || e.includes(t), Ha = (e) => we(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Rd = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Fi(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Kr(e) {
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
    reviews: Ea(JSON.stringify(t.reviews)),
    deletedIds: Fi(t.deletedIds),
    importedIds: Fi(t.importedIds)
  };
}
function Od(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = Ea(o);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Fi(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function rc(e) {
  const t = await we("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function uo(e, t) {
  const n = (La.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return La.set(e, n), n.finally(() => {
    La.get(e) === n && La.delete(e);
  }).catch(() => {
  }), n;
}
let ua = null;
function Md() {
  if (ua) return ua;
  const e = Fd();
  return ua = e, e.finally(() => {
    ua === e && (ua = null);
  }).catch(() => {
  }), e;
}
async function Fd() {
  const e = await we("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return uo(t, () => xd(e, t));
}
async function xd(e, t) {
  var h;
  const n = String(e.user.id), r = Tr(e.permissions, "savedfilters.read"), i = r && Tr(e.permissions, "savedfilters.write"), o = r ? (await Ha(tc)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (o.length > 1) {
    const g = (y) => {
      const { revision: N, ...v } = Kr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (o.some((y) => g(y) !== g(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await we(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Kr(o[0].uiOptions) : Rd();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && l && (s = Kr(l));
  let d = !o.length;
  if (o.length && f && l) {
    const g = Kr(l);
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
      reviews: Jo(s.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), y = Od(n);
    if (o.length && y.reviews.some((E) => {
      const O = s.reviews.find((x) => x.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Ha($d)).flatMap(
      (E) => Ea(E.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (E) => !y.reviews.some((O) => O.id === E)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Jo(
        y.reviews,
        s.reviews,
        N.filter(
          (E) => !y.known.includes(E.id) && !s.importedIds.includes(E.id)
        )
      ).filter((E) => !w.has(E.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((E) => E.id)
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
  if (Aa.set(t, p), d && i) {
    const g = s;
    o.length && (p.config = Kr(o[0].uiOptions)), await ac(t, g), s = p.config;
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
async function ac(e, t) {
  const n = Aa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await rc(n), n.recordId != null) {
      const o = await we(
        `/api/savedfilters/${n.recordId}`
      ), s = Kr(o.uiOptions);
      if (s.revision !== n.config.revision)
        throw new Ja(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const i = await we(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: tc,
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
const Qa = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), Pd = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Qa(e, n) !== Qa(t, n)
);
function Ld(e, t) {
  return uo(e, async () => {
    var r;
    const n = Aa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    for (let i = 1; ; i++) {
      const o = n.config.reviews, s = t(o);
      if (s === o) return o;
      Ea(JSON.stringify(s));
      const c = o.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
      try {
        return await ac(e, {
          ...n.config,
          reviews: s,
          deletedIds: [
            .../* @__PURE__ */ new Set([...n.config.deletedIds, ...c])
          ].filter((l) => !s.some((f) => f.id === l))
        }), s;
      } catch (l) {
        const f = l instanceof Ja ? l.remote : void 0;
        if (!f || i >= 3) throw l;
        const d = Pd(o, s).find(
          (p) => Qa(o, p) !== Qa(f.reviews, p)
        );
        if (d !== void 0) {
          const p = (r = s.find((h) => h.id === d) ?? o.find((h) => h.id === d)) == null ? void 0 : r.name;
          throw new Ja(
            `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.`
          );
        }
        n.config = f;
      }
    }
  });
}
function Yo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Dd(e, t) {
  const n = Aa.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Yo(r) : null;
  if (!n.readable) return i;
  const o = (await Ha(Mi)).find(
    (c) => c.name === t
  ), s = o ? Yo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function _d(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return uo(r, async () => {
    const i = Aa.get(e);
    if (!(i != null && i.writable)) return;
    await rc(i);
    const o = (await Ha(Mi)).find(
      (s) => s.name === t
    );
    await we(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Mi,
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
const jd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Bn(e) {
  return jd[e];
}
const Wa = "confirmed_absent_tags", fo = "Confirmed absent tags", ii = "confirmed_absent_occurrence_tags", ic = {
  key: Wa,
  label: fo,
  type: "tag",
  subject: "tag assessments"
}, po = {
  key: ii,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Ud = {
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
function Un(e) {
  return Array.isArray(e) ? e.map(Un) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Ud[n] ?? n : t === "key" && typeof n == "string" && [
        Wa,
        ii
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Un(n)
    ])
  ) : e;
}
async function oc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await hd(e, { ...t, headers: r });
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
async function we(e, t = {}) {
  return await oc(e, t, "fail");
}
function Bd(e, t = {}) {
  return oc(e, t, "null");
}
const Kd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Gd = 0;
function Ya(e, t) {
  return we(
    `/api/${dr(e)}/${t}?dqRead=${Kd}-${++Gd}`,
    { cache: "no-store" }
  );
}
function sc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Un({
      findFilter: Qt(t, _e(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Vr(e, t, n) {
  return we(
    `/api/${dr(_e(e))}/find`,
    { method: "POST", signal: n, body: sc(e, t) }
  );
}
async function cc(e, t, n) {
  return (await we(
    `/api/${dr(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: sc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Ni(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, we("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Un({
        findFilter: Qt(t),
        objectFilter: r
      })
    )
  });
}
function Vd(e) {
  return we("/api/taggroups", { signal: e });
}
function xi(e, t, n = 1280) {
  return `/api/${dr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Pi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Xo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function zd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Jd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function oi(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await we(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await we("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Un({
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
async function ho(e, t) {
  const n = lr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await oi(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Hd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function mo(e, t) {
  const r = (await we("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Hd(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Bn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function lc(e, t) {
  const n = await mo(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await we(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await we("/api/custom-fields", {
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
function dc(e = "video") {
  return mo(ic, e);
}
function Qd(e = "video") {
  return lc(ic, e);
}
function uc(e = "video") {
  return mo(po, e);
}
function Wd(e = "video") {
  return lc(po, e);
}
function Xa(e) {
  return [...new Set(e)];
}
function fc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ii
  ), i = r === void 0 ? [] : n[r];
  return Xa(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Yd(e) {
  let t;
  try {
    t = await uc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${po.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Xd(e, t, n, r, i, o) {
  await we(`/api/${dr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Xa(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Zd(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${fo} custom field is not available.`
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
async function pc(e, t, n) {
  if (!jn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Bn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (or(t)) {
    let l;
    try {
      l = await dc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${fo} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const i = Xa(n), o = (await ho(t)).map((l) => ({
    mode: l.mode,
    tagIds: Xa(l.tagIds)
  })), c = [
    ...o.filter((l) => !Dn(l.mode)),
    ...o.filter((l) => Dn(l.mode))
  ].map(
    (l) => Zd(l, i, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await we(`/api/${dr(e)}/bulk`, {
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
async function eu(e, t) {
  if (!jn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await we("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Da = (e) => e >= "0" && e <= "9";
function Zo(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function es(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (Da(e[n]) && Da(t[r])) {
      const c = n, l = r;
      for (; n < e.length && Da(e[n]); ) n++;
      for (; r < t.length && Da(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(l, r).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const o = Zo(e[n]), s = Zo(t[r]);
    if (o !== s) return o < s ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function hc(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || es(e.tagGroupName, t.tagGroupName) || es(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Or(e) {
  return [...e].sort(hc);
}
const Li = /* @__PURE__ */ new Map();
function tu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function go(e, t, n) {
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
    ...o.filter((h) => !Dn(h.mode)),
    ...o.filter((h) => Dn(h.mode))
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
function nu(e) {
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
function mc(e) {
  return gc(tu(e));
}
function gc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return ee(() => (o.current = !0, () => {
    o.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), oi([c]).then(
        (l) => {
          o.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function qt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Fr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = qt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function ts(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => qt(t.group) !== "");
}
function bc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function yc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function wc(e) {
  return lr(e).size > 0 || yc(e).size > 0;
}
function ru(e) {
  return Fr(e).filter(
    (t) => !t.actions.some((n) => wc(e[n]))
  );
}
function Di(e, t) {
  const n = bc(t), r = new Set(t.absent);
  return Fr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const l = [...lr(e[c])], f = [...yc(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function _i(e) {
  return e.filter((t) => t.answers.length === 0);
}
function au(e, t, n) {
  const r = { ids: [...bc(t)], absent: t.absent }, i = go(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const zr = "review";
function iu(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function ou(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Ir(e, t) {
  const n = new Set(iu(e));
  return t.filter((r) => n.has(r.id));
}
function ns(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Ir(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? i(zr, () => ({
        key: zr,
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
    ...o.filter((s) => s.key === zr),
    ...o.filter((s) => s.key !== zr)
  ];
}
function ji(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function bo(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => ji(s.key, s.members, i) && !(c > o && ji(i.key, i.members, s))
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
function su(e, t) {
  return t.filter(
    (n) => n.key === e.key || ji(n.key, n.tagIds ?? [], e)
  );
}
function vc(...e) {
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
    ...n.filter((r) => r.key === zr),
    ...n.filter((r) => r.key !== zr)
  ];
}
function cu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const i of r.tagIds)
        for (const o of r.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function Nc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = cu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function lu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => Nc(i, r, n))
  );
}
function du(e, t, n) {
  return t.filter((r) => r.tagIds !== null && Nc(e, r, n));
}
function uu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function yo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [uu(e.mixed)] : []
  ];
}
function fu(e) {
  const t = yo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function pu(e, t, n) {
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
const Ui = "-", rs = "Ctrl+a", hu = "Ctrl/⌘A", mu = ["f", "g", "k", "n", "m", ",", "."], qi = "Shift+", qc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, gu = new Set(Object.values(qc).flat()), as = { Comma: ",", Period: "." };
function bu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(as, t.code) ? as[t.code] : void 0;
}
function Xr(e) {
  return Ne(() => Xs(e), [e]);
}
function wo({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = Xr(n), c = $({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  Tt(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const l = !!i && n.length > 0, f = e === "local" && !!o, d = ar.filter(
    (h) => s.actionOn.has(h) || mu.includes(h)
  ).join(" "), p = Ne(() => {
    const h = (N, v) => {
      var E, O;
      const w = c.current;
      if (N === rs) (E = w.onSelectAll) == null || E.call(w);
      else if (N === Ui) (O = w.onFind) == null || O.call(w);
      else {
        const x = gu.has(N), B = x || N.startsWith(qi), C = x ? bu(v) : B ? N.slice(qi.length) : N, D = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        D !== void 0 && w.onAction(D, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(rs, "local")), l && y.push(g(Ui));
    for (const N of d ? d.split(" ") : []) {
      const v = qc[N];
      y.push(g(N), ...(v ?? [`${qi}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, d, l, f]);
  Bl(p, t);
}
const yu = {
  find: Ui,
  selectAll: hu
};
function vo() {
  return yu;
}
const wu = 600 * 1e3, No = /* @__PURE__ */ new Map(), Sc = /* @__PURE__ */ new Map(), nr = /* @__PURE__ */ new Map();
function kc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Sc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Ec(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Sc.set(e.tagGroupId, e.tagGroupSortOrder), No.set(e.id, { tag: e, at: Date.now() });
}
function Ac(e) {
  const t = No.get(e);
  if (!(!t || Date.now() - t.at > wu))
    return kc(t.tag);
}
function Cc(e) {
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
function Bi(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Ec(Cc({ ...n, name: r }));
  }
}
function vu(e) {
  const t = nr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: we(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, p;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (nr.get(e) === r && nr.delete(e), !o) return null;
        const s = Cc({ ...i, id: e, name: o }), c = (p = No.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Ec(f), kc(f);
      },
      () => (nr.get(e) === r && nr.delete(e), null)
    )
  };
  return nr.set(e, r), r;
}
function is() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Si(e) {
  const t = {};
  for (const n of e) {
    const r = Ac(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Nu(e, t) {
  if (t != null && t.aborted) return Promise.reject(is());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = Ac(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = vu(i);
      s.waiters += 1, r.push({ id: i, entry: s });
    }
  }
  return r.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && nr.get(f) === d && (nr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), o(is()));
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
function Tc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ca(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: Si(ki(t))
  }));
  return ee(() => {
    const i = ki(t), o = Si(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return Nu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Si(ki(t));
}
function Zr(e) {
  const t = Ca(e);
  return Ne(() => Tc(t), [t]);
}
function ki(e) {
  return e ? e.split(",").map(Number) : [];
}
const qu = "(max-width: 760px)";
function Ic(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = $n(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Zi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ta() {
  return Ic(qu);
}
function Su(e, t, n = !1) {
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
      (c) => Su(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function si(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function qo({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const l = Ta(), [f, d] = T(""), [p, h] = T(0), g = $(null), y = $(null), N = $(null), v = $(null), w = $(null), E = $(/* @__PURE__ */ new Set()), O = at(), x = Zr(Ne(() => si(e), [e])), B = Xr(e), C = Ne(() => {
    const j = f.trim().toLocaleLowerCase(), V = (M) => M ? ar.indexOf(M) : ar.length;
    return e.map((M, _) => ({ action: M, index: _, key: B.keys[_] })).sort((M, _) => V(M.key) - V(_.key)).filter((M) => !j || M.action.label.toLocaleLowerCase().includes(j));
  }, [e, B, f]), D = C.length ? Math.min(p, C.length - 1) : -1, P = (j) => `${O}-option-${j}`;
  Tt(() => {
    var j, V, M;
    return v.current = document.activeElement, w.current = ((V = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var L;
      const _ = v.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((L = w.current) != null && L.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var j, V, M;
    D < 0 || (M = (V = (j = y.current) == null ? void 0 : j.querySelector(`[id="${P(C[D].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [D, C]);
  function ne(j, V) {
    !j || r != null && r(j.action) || s(j.action, i && V);
  }
  function J(j) {
    var M;
    j.stopPropagation();
    const V = j.code || j.key;
    if (j.repeat || E.current.add(V), !dn(j)) {
      if (j.repeat && !E.current.has(V)) {
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
      } else j.key === "Tab" && (j.preventDefault(), (M = g.current) == null || M.focus());
    }
  }
  return /* @__PURE__ */ u(me, { children: [
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
            /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
              ref: y,
              id: `${O}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: C.map((j, V) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: P(j.index),
                  tabIndex: -1,
                  "aria-selected": V === D,
                  disabled: (r == null ? void 0 : r(j.action)) ?? !1,
                  onClick: (M) => ne(j, M.shiftKey || o && Zs(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(me, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ha(j.key) ? !0 : void 0, children: j.key }),
                      ha(j.key) && /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ha(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Pr(j.action, x, t, n).map(
                      (M, _) => /* @__PURE__ */ a("span", { "data-effect-tone": M.tone, children: M.text }, _)
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
function $c() {
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
function So(e) {
  return Zi(e.subscribe, e.get, e.get);
}
function Rc(e, t) {
  const n = $(t);
  Tt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Oc(e, t) {
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
const ku = [], Ki = ai.map(
  (e, t) => ({ indent: t, keys: e })
), os = Ki.length - 1;
function St({ binding: e, hidden: t }) {
  const n = t ? void 0 : ha(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(me, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function _a(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Mc(e) {
  return ai.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Fc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(me, { children: r.map((i, o) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === r.length - 1 && n
  ] }, o)) });
}
function xc({
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
          /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
function Eu({
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
                /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(me, { children: [
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
function Au({ checked: e, onChange: t }) {
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
function Cu({
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
  attention: p = ku,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = vo(), N = Xr(e), v = Ta();
  Rc(o, v);
  const w = at(), E = Zr(
    Ne(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), O = Ki.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), x = O.includes(Ki[os]), B = e.length - N.actionOn.size, C = Ne(
    () => d && !f ? Fr(e) : [],
    [d, f, e]
  ), D = Ne(
    () => C.length && r ? Di(e, r) : null,
    [C, e, r]
  ), P = new Map(
    _i(D ?? []).flatMap(
      (S) => S.actions.filter((ce) => wc(e[ce])).map((ce) => [ce, S.name])
    )
  ), ne = Ne(
    () => e.map((S) => f ? [] : du(S, p, i)),
    [e, p, i, f]
  ), J = (S) => S.map(fu).join("; "), j = ne.map(J), V = C.length > 0 && /* @__PURE__ */ a(
    Eu,
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
  ), M = (S) => {
    const ce = Pr(e[S], E, [], i).map((de) => de.text).join(", "), A = P.get(S), Y = j[S];
    return [
      ce,
      A === void 0 ? "" : `${A}: not answered yet`,
      Y ? `Needs attention: ${Y}` : ""
    ].filter(Boolean).join(". ");
  }, _ = (S) => j[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${j[S]}`,
        children: /* @__PURE__ */ a(_n, {})
      }
    )
  ) : null, L = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), W = (S) => {
    const ce = N.actionOn.get(S), A = ce === void 0 ? void 0 : e[ce];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(St, { binding: S, hidden: !0 })
        },
        S
      );
    const Y = t(A), de = `${w}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : L(A), children: [
      /* @__PURE__ */ a("span", { id: de, className: "dq-sr-only", children: M(ce) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": S,
          "aria-describedby": de,
          "data-group-open": P.has(ce) || void 0,
          "data-attention": j[ce] ? !0 : void 0,
          disabled: Y,
          onClick: (pe) => s(A, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(St, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            _a(A) && " ",
            _a(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(ce)
          ]
        }
      )
    ] }, S);
  }, Q = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Mc(N), ce = (A) => {
      const Y = e[A], de = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Y.label,
          "aria-keyshortcuts": de,
          "aria-describedby": `${w}-effect-${de}`,
          "data-group-open": P.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(Y),
          onClick: (pe) => {
            o.clear(Y), s(Y, pe.shiftKey || h && Zs(Y));
          },
          ...f ? {} : Oc(o, Y),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Y.label }),
            _a(Y) && " ",
            _a(Y) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(A)
          ]
        },
        de
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
              ss,
              {
                actions: e,
                keyMap: N,
                names: E,
                tags: r,
                trees: i,
                preview: o,
                findKey: y.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(Au, { checked: h, onChange: g })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Fc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                xc,
                {
                  extra: B,
                  findKey: y.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: M(A) }, A)) })
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
        /* @__PURE__ */ a(St, { binding: y.find }),
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
        /* @__PURE__ */ u("div", { className: `dq-pad-header${V ? " dq-pad-header-groups" : ""}`, children: [
          f ? Q : /* @__PURE__ */ a(
            ss,
            {
              actions: e,
              keyMap: N,
              names: E,
              tags: r,
              trees: i,
              preview: o,
              findKey: y.find
            }
          ),
          V ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              V,
              ae,
              H
            ] })
          ) : /* @__PURE__ */ u(me, { children: [
            !f && ae,
            H
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(W),
          S.indent === os && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(St, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
function ss({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const l = So(o), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(me, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(St, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? go(l, r, i) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(St, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Pr(l, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Pc({
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
  const y = vo(), N = Xr(e), v = Ta(), w = at(), E = Zr(Ne(() => si(e), [e])), [O] = T(() => $c());
  Rc(O, v);
  const x = $(null), B = Tu(x, e, !v), C = Mc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), P = e.length - D.length, ne = (M) => Pr(M, E, t, n).map((_) => _.text).join(", "), J = (M) => ({
    onMouseEnter: () => O.set(M),
    onMouseLeave: () => O.clear(M),
    onFocus: () => O.set(M),
    onBlur: (_) => {
      _.currentTarget.contains(_.relatedTarget) || O.clear(M);
    }
  }), j = l ?? (v ? void 0 : f), V = (M) => {
    const _ = e[M];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: _.label,
        "aria-keyshortcuts": N.keys[M] || void 0,
        "aria-describedby": `${w}-effect-${M}`,
        disabled: g || r(_),
        onClick: () => {
          O.clear(_), o(_);
        },
        ...g ? {} : Oc(O, _),
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
                Fc,
                {
                  groups: C,
                  renderAction: V,
                  find: /* @__PURE__ */ a(
                    xc,
                    {
                      extra: P,
                      findKey: y.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((M, _) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                M.map((L) => {
                  const W = e[L], Q = N.keys[L];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: W.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${w}-effect-${L}`,
                      disabled: g || r(W),
                      onClick: () => o(W),
                      ...g ? {} : J(W),
                      children: [
                        Q && /* @__PURE__ */ a(St, { binding: Q }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: W.label })
                      ]
                    },
                    W.id
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
                      /* @__PURE__ */ a(St, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Iu,
          {
            actions: e,
            keyMap: N,
            preview: O,
            names: E,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: ne(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Tu(e, t, n) {
  const [r, i] = T(!1);
  return Tt(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(o), h = parseFloat(p.columnGap) || 0, g = o.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((P) => P.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (D) => y.map((P) => {
        let ne = 1, J = 0;
        for (const j of P)
          J > 0 && J + v + j > D ? (ne += 1, J = j) : J += (J > 0 ? v : 0) + j;
        return ne;
      }), x = (D) => Math.max(1, D.reduce((P, ne) => P + ne, 0)), B = O(g), C = x(O(g - E));
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
function Iu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = So(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(St, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Pr(c, r, i, o).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const cs = 1e3;
async function $u(e, t, n) {
  const r = await we(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await we(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Un({
            findFilter: {
              page: l,
              perPage: cs,
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
    if (l * cs >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = _e(e), c = Ae(e) ? await Ou(
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
function Ru(e) {
  return JSON.stringify(
    Un({
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
async function Ou(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            r[c] = (await we(
              `/api/${dr(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: Ru(t[c])
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
function Mu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Fu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function xu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of lr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Pu(e, t, n) {
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
function Lu(e, t) {
  var r;
  const n = qt(e);
  return ((r = Fr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Du = (e) => e instanceof Error ? e.message : "Request failed.";
function _u({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), g = $(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const y = Bn(_e(t)), N = Ae(t), v = N ? "performer" : y.one;
  function w(M) {
    var L;
    (L = g.current.get(M)) == null || L.abort();
    const _ = new AbortController();
    g.current.set(M, _), l((W) => ({ ...W, [M]: { status: "loading" } })), $u(t, M, _.signal).then(
      (W) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "ready", group: W }
        }));
      },
      (W) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "failed", message: Du(W) }
        }));
      }
    );
  }
  function E(M) {
    var ae;
    const _ = o.filter((H) => !M.includes(H));
    for (const H of _)
      (ae = g.current.get(H)) == null || ae.abort(), g.current.delete(H);
    const L = (H) => {
      const S = c[H];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, W = new Set(M.flatMap(L)), Q = _.flatMap(L).filter((H) => !W.has(H));
    d(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => !Q.includes(Number(S)))
      )
    ), h(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => M.includes(Number(S)))
      )
    ), l(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([S]) => M.includes(Number(S)))
      )
    ), s(M);
    for (const H of M) o.includes(H) || w(H);
  }
  const O = o.flatMap((M) => {
    const _ = c[M];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), x = O.length === o.length, B = o.some(
    (M) => {
      var _;
      return (((_ = c[M]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Mu(O).map((M) => [M.parent.id, M])
  ), D = Fu(O), P = new Map(O.map((M) => [M.parent.id, M.parent.name])), ne = xu(t.actions), J = (M) => f[M] ?? !ne.has(M), j = x ? [...C.values()].flatMap((M) => {
    const _ = Lu(M.parent.name, t.actions);
    return M.children.filter((L) => J(L.id)).map((L) => ({ child: L, answerGroup: _ }));
  }) : [], V = (M, _) => d((L) => ({
    ...L,
    ...Object.fromEntries(M.children.map((W) => [W.id, _]))
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
        onChange: E,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((M) => {
      const _ = c[M];
      if (!_ || _.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, M);
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
              onClick: () => w(M),
              children: "Retry"
            }
          )
        ] }, M);
      const L = C.get(M);
      if (!L) return null;
      const W = L.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: W }),
        _.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[M] ?? !1,
                disabled: n,
                onChange: (Q) => h((ae) => ({
                  ...ae,
                  [M]: Q.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            W,
            " tree"
          ] }),
          L.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(me, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${W}`,
                  onClick: () => V(L, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${W}`,
                  onClick: () => V(L, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: L.children.map((Q) => {
              const ae = ne.get(Q.id) ?? [], H = (D.get(Q.id) ?? []).filter((S) => S !== M).map((S) => `“${P.get(S)}”`);
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
      ] }, M);
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
              ({ child: M, answerGroup: _ }) => Pu(
                M,
                (D.get(M.id) ?? []).filter(
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
function ju(e, t, n, r) {
  const i = qt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: qt(c) === i });
    return o;
  }
  const s = qt(r);
  for (const c of t)
    qt(c).includes(s) && o.push({ kind: "group", name: c, selected: qt(c) === i });
  return s && !t.some((c) => qt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Uu(e) {
  return e.kind === "group" ? `group:${qt(e.name)}` : e.kind;
}
function Bu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Ku = /* @__PURE__ */ new Set([
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
]), Gu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), ja = 4, ls = 240;
function Vu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function zu(e, t, n, r) {
  for (const o of r) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function Ju({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = at(), s = at(), c = at(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), y = $(!1), N = $(!1), [v, w] = T(!1), [E, O] = T(null), [x, B] = T(null), [C, D] = T(!1), P = e.group ?? "", ne = Ne(
    () => ju(t, n, P, E),
    [t, n, P, E]
  ), J = ne.map(Uu), j = x === null ? -1 : J.indexOf(x), V = (A) => `${s}-option-${A}`, M = (A) => i(A ? { ...e, group: A } : Bu(e)), _ = () => {
    var Y;
    const A = ((Y = d.current) == null ? void 0 : Y.value) ?? P;
    A.trim() !== A && M(A.trim());
  };
  function L(A) {
    O(null), B(A), w(!0);
  }
  const W = (A) => {
    var Y, de;
    return A instanceof Node && (((Y = l.current) == null ? void 0 : Y.contains(A)) || ((de = p.current) == null ? void 0 : de.contains(A))) === !0;
  };
  function Q() {
    var A, Y;
    (A = p.current) != null && A.contains(document.activeElement) && ((Y = h.current) == null || Y.focus({ preventScroll: !0 })), w(!1), O(null), B(null), D(!1);
  }
  function ae(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), Q();
  }
  function H() {
    const A = f.current, Y = p.current;
    if (!A || !Y) return;
    const de = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Ee = (pe ? pe.offsetTop + pe.height : window.innerHeight) - de.bottom - ja, ke = de.top - G - ja, ve = Math.min(Y.scrollHeight, ls), He = Ee < ve && ke > Ee;
    Y.style.left = `${de.left}px`, Y.style.width = `${de.width}px`, Y.style.top = `${He ? de.top - ja : de.bottom + ja}px`, Y.style.transform = He ? "translateY(-100%)" : "", Y.style.maxHeight = `${Math.max(0, Math.min(ls, He ? ke : Ee))}px`, zu(A, Y, de, g.current) || Q();
  }
  Tt(() => {
    var A;
    v && (f.current && (g.current = Vu(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
  }, [v]), Tt(() => {
    v && H();
  }), ee(() => {
    if (!v) return;
    const A = () => H(), Y = (G) => {
      W(G.target) || Q();
    }, de = [...g.current, window], pe = window.visualViewport;
    for (const G of de) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), pe == null || pe.addEventListener("resize", A), pe == null || pe.addEventListener("scroll", A), document.addEventListener("pointerdown", Y), () => {
      for (const G of de) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), pe == null || pe.removeEventListener("resize", A), pe == null || pe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", Y);
    };
  }, [v]), ee(() => {
    var A, Y, de;
    j >= 0 && ((de = (Y = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : Y.scrollIntoView) == null || de.call(Y, { block: "nearest" }));
  }, [j]);
  function S(A) {
    if (dn(A)) return;
    const Y = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (Y && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), L(A.altKey ? null : qt(P) ? `group:${qt(P)}` : "none");
      return;
    }
    if (v)
      if (Y) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && Q();
          return;
        }
        const de = A.key === "ArrowDown" ? 1 : -1, pe = E !== null && qt(E) && J.length > 1 ? 1 : 0, G = j < 0 ? de > 0 ? pe : J.length - 1 : (j + de + J.length) % J.length;
        B(J[G]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? ae(ne[j]) : (_(), Q()));
  }
  function ce(A) {
    var de;
    if (A.key === "Tab") {
      Q(), A.shiftKey && ((de = d.current) == null || de.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || dn(A) && !Gu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = d.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Ku.has(A.key) && !dn(A) && D(!1), S(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || dn(A) || (A.preventDefault(), A.stopPropagation(), Q());
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
                "aria-activedescendant": v && j >= 0 ? V(j) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: P,
                onChange: (A) => {
                  M(A.target.value), O(A.target.value), B(null), w(!0);
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
                  var de;
                  const A = y.current;
                  y.current = !1;
                  const Y = document.activeElement === d.current;
                  v ? Q() : (N.current = A && !Y, L(null)), (!A || Y) && ((de = d.current) == null || de.focus());
                },
                children: /* @__PURE__ */ a(no, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && md(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: p,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": j >= 0 ? V(j) : void 0,
              "data-tap-focus": C || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: ce,
              onBlur: (A) => {
                W(A.relatedTarget) || Q();
              },
              children: ne.map((A, Y) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(Y),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": Y === j || void 0,
                  onMouseMove: () => {
                    Y !== j && B(J[Y]);
                  },
                  onClick: () => ae(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Yr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                J[Y]
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
  ...ai,
  ["auto", ir]
];
function Lc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : co(e[n]);
}
function Hu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = $(null), l = n.keys[t], f = Lc(e, n, t), d = Rr(f), p = n.duplicatePins.has(t) ? ` (${ya(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${ya(l)}, ${d ? "pinned" : "Auto"}${p}` : f === ir ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(me, { children: [
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
          l ? /* @__PURE__ */ a(St, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ a(
      Qu,
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
function Qu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i,
  onClose: o
}) {
  const s = $(null), c = n.keys[t], l = Lc(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Tt(() => {
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
    const E = tr[w].indexOf(v), O = (ne) => ne == null ? void 0 : ne[Math.min(E, ne.length - 1)], x = {
      ArrowLeft: tr[w][E - 1],
      ArrowRight: tr[w][E + 1],
      ArrowUp: O(tr[w - 1]),
      ArrowDown: O(tr[w + 1]),
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
      pinned: co(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(me, { children: [
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ai.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const E = y(w), O = E ? `${E.own ? "this action" : E.label}, ${E.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${E ? "" : " dq-key-choice-free"}${E != null && E.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${ya(w)}: ${O}`,
                "aria-pressed": !!(E != null && E.own && E.pinned),
                title: E ? `${E.label} (${E.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(St, { binding: w }),
                    (E == null ? void 0 : E.pinned) && /* @__PURE__ */ a(Us, { "aria-hidden": "true" })
                  ] }),
                  E && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: E.label })
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
const Wu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Yu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Xu(e, t) {
  if (jn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (lo(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Dc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Zu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function ef({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const l = Le(e), f = l !== "tag", d = e.actions, p = Xr(d), h = Zr(Ne(() => si(d), [d])), g = Ne(
    () => f ? Fr(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === o), N = Ne(
    () => f && y >= 0 ? Fr(
      d.filter((G, be) => be !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = Ne(
    () => new Set(
      v ? ru(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [E, O] = T(""), [x, B] = T(!1), [C, D] = T(
    null
  ), P = at(), ne = `${P}-from-tags`, J = $(null), j = $(null), V = $(null), M = $(null), _ = $(/* @__PURE__ */ new WeakMap()), L = (G) => {
    let be = _.current.get(G);
    return be || (be = crypto.randomUUID(), _.current.set(G, be)), be;
  }, W = E.trim().toLocaleLowerCase(), Q = W ? d.filter((G) => G.label.toLocaleLowerCase().includes(W)) : d, ae = (G) => t({ ...e, actions: G }), H = (G, be) => ae(d.map((Ee, ke) => ke === G ? be : Ee));
  function S(G) {
    var be;
    return [...((be = V.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ee) => Ee.dataset.actionId === G
    );
  }
  function ce(G, be) {
    const Ee = S(G), ke = Ee == null ? void 0 : Ee.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  Tt(() => {
    var be;
    const G = M.current;
    G && (M.current = null, (G === "add" || !ce(G.id, G.part)) && ((be = j.current) == null || be.focus()));
  }), ee(() => {
    !c || !o || (Q.some((G) => G.id === o) ? ce(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const G = Zu(l);
    O(""), ae([...d, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function Y(G) {
    const be = d[G], { shortcut: Ee, ...ke } = structuredClone(be), ve = {
      ...ke,
      ...Ee === ir ? { shortcut: Ee } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    ae([...d.slice(0, G + 1), ve, ...d.slice(G + 1)]), s(ve.id), M.current = { id: ve.id, part: "label" };
  }
  function de(G) {
    const be = d[G], Ee = Q.indexOf(be), ke = Q[Ee + 1] ?? Q[Ee - 1];
    ae(d.filter((ve, He) => He !== G)), o === be.id && s(null), M.current = ke ? { id: ke.id, part: "toggle" } : "add";
  }
  function pe() {
    B(!1), requestAnimationFrame(() => {
      var G;
      return (G = J.current) == null ? void 0 : G.focus();
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
              /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: E,
              onChange: (G) => O(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && E && !dn(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
              onChange: (G) => t({
                ...e,
                stayUntilGroupsAnswered: G.target.checked ? !0 : void 0
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
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || dn(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          _u,
          {
            id: ne,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const be = [...d, ...G];
              ae(be), D({ actions: be, count: G.length }), pe();
            },
            onCancel: pe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: Q.length > 0 && /* @__PURE__ */ a(
      xs,
      {
        items: Q,
        getKey: (G) => G.id,
        disabled: i || !!W,
        className: "dq-action-list",
        onReorder: (G) => ae(G),
        renderItem: (G, { dragHandleProps: be, isOver: Ee }) => {
          const ke = d.indexOf(G), ve = o === G.id;
          return /* @__PURE__ */ a(
            tf,
            {
              action: G,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Hu,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (He) => ae(yd(d, ke, He))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(qt(G.group)),
              effect: Pr(G, h, n, r),
              open: ve,
              detailId: `${P}-detail-${G.id}`,
              dragHandleProps: be,
              isOver: Ee,
              reorderDisabled: i || !!W,
              onToggle: () => s(ve ? null : G.id),
              onDuplicate: () => Y(ke),
              onDelete: () => de(ke),
              children: "steps" in G ? /* @__PURE__ */ a(
                nf,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ae(e),
                  saving: i,
                  stepKey: L,
                  rememberStepKey: (He, fe) => _.current.set(He, L(fe)),
                  onChange: (He) => H(ke, He)
                }
              ) : /* @__PURE__ */ a(
                af,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (He) => H(ke, He)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !Q.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function tf({
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
  const N = e.label.trim() || "New action", v = Xu(e, t), w = "steps" in e && qt(e.group) ? e.group.trim() : "";
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
              style: Dc(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(Bs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((E, O) => /* @__PURE__ */ a("span", { "data-effect-tone": E.tone, children: E.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ya(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
                  `${ya(r)} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
                  `${w} can't be answered`
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
              children: /* @__PURE__ */ a(Ks, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(no, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function _c({
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
function nf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const l = at(), f = $(null), d = $(null);
  Tt(() => {
    var g, y;
    const h = d.current;
    h != null && (d.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(_c, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Ju,
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
          xs,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              rf,
              {
                step: h,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((w, E) => E === g ? v : w));
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
              /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function rf({
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
      "data-step-tone": Yu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Dc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(Bs, { "aria-hidden": "true" }),
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
            children: Wu.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
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
            children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function af({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, i = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, o = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(_c, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const jc = jl(!1);
function of({ children: e }) {
  return /* @__PURE__ */ a(jc.Provider, { value: !0, children: e });
}
function Wt({ tag: e, name: t }) {
  const n = Ul(jc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Kl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function sf({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Bn(_e(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
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
function cf({
  review: e,
  onChange: t
}) {
  const n = Bn(_e(e)).many, r = e.occurrence, i = Ws(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ca([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: gd(r, d) }), f = (d, p) => l(
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
          /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Wt, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Go,
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
            children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
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
      Go,
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
const Uc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Bc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, lf = {
  video: ri,
  audio: zs,
  tag: Vs,
  performerOccurrence: Gs,
  audioPerformerOccurrence: ed
};
function Kc({ entityType: e }) {
  const t = lf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Uc[e] });
}
const df = 2e6;
function Gc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function uf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ko(e) {
  Gc([e], uf(e));
}
async function ff(e) {
  if (e.size > df) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ea(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Hr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Vc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ u(me, { children: [
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
          children: Ys.map((s) => /* @__PURE__ */ a("option", { value: s, children: Bc[s] }, s))
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
function pf(e, t) {
  const n = Le(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function hf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), i = at(), o = at();
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
function zc({
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
  ), [E, O] = T(""), [x, B] = T(null), [C, D] = T(0), [P, ne] = T(!1), J = $(null), j = $(null), V = $(null), M = pf(e, w), _ = Le(e), L = Ne(() => Hr(e), [e]);
  ee(() => O(""), [L]), ee(() => {
    var ce, A;
    if (P) return;
    const H = J.current;
    if (J.current = null, !H) return;
    (A = H.isConnected && !!((ce = V.current) != null && ce.contains(H)) && !(H instanceof HTMLButtonElement && H.disabled) ? H : V.current) == null || A.focus({ preventScroll: !0 });
  }, [P]);
  function W() {
    if (!(s || P)) {
      if (!f) {
        g();
        return;
      }
      J.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ne(!0);
    }
  }
  function Q() {
    const H = { ...e, name: e.name.trim() }, S = wa(H);
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
      (A) => !jn(A, _)
    );
    ce && (v("Actions"), B(ce.id), D((A) => A + 1));
  }
  const ae = E || l;
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (H) => {
          V.current = H, y && (y.current = H);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (H) => {
          H.key !== "Escape" || H.defaultPrevented || s || dn(H) || (H.preventDefault(), H.stopPropagation(), W());
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
                onClick: W,
                children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Gl,
            {
              tabs: M.map((H) => ({
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
                    Vc,
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
                  Ae(e) && /* @__PURE__ */ a(cf, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => ko(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            M.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(mf, { review: e, onChange: t })
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
                  ef,
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
                children: /* @__PURE__ */ a(sf, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ae || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            ae && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
              ae
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: W, children: "Cancel" }),
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
      hf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), g();
        }
      }
    )
  ] });
}
function mf({
  review: e,
  onChange: t
}) {
  const n = at(), r = e.view, i = (d) => t({ ...e, view: { ...r, ...d } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
        ds,
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
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          us,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(bf, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          us,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(yf, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        ds,
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
      gf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function gf({
  bins: e,
  onChange: t
}) {
  const n = at(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, l) => t(
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
            children: /* @__PURE__ */ a(ni, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || dn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Ps,
          {
            open: !0,
            onClose: () => i(null),
            criteria: ti,
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
function ds({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const i = at();
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
function us({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: i,
  onChoose: o
}) {
  const s = at(), c = at();
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
function bf() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function yf() {
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
const Gi = "The queue differs from the saved review.";
function Jc({
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
  Sf(v);
  const w = kf(v), [E, O] = T({ differs: h, text: "" });
  return E.differs !== h && O({
    differs: h,
    text: h ? E.differs === !1 ? Gi : E.text : ""
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
          children: /* @__PURE__ */ a(ka, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Uc[n], children: /* @__PURE__ */ a(Kc, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(Qr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(wf, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: E.text })
  ] });
}
function wf({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), i = `${Gi} Save these filters to the review.`, o = e.onSave ? `${Gi} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(me, { children: [
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
          /* @__PURE__ */ a(rd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(ad, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const vf = ["queue", "summary", "name", "layout", "range"], Nf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, qf = "(min-width: 1400px)";
function Ga(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function fs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const i = vf.filter(
    (o) => e.querySelector(Nf[o])
  );
  for (let o = 1; o <= i.length && !Ga(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ga(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ga(e) ? !0 : (r(), !1);
}
function Sf(e) {
  const t = Ic(qf), [n, r] = T(0), i = $(!1);
  Tt(() => {
    e.current && (i.current = !fs(e.current, t));
  }, [e, t, n]), Tt(() => {
    const o = e.current;
    o && t && !i.current && !Ga(o) && (i.current = !fs(o, t));
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
function kf(e) {
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
function Hc({
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
        children: /* @__PURE__ */ a(ka, { "aria-hidden": "true" })
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
          dn(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(Js, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Qc({
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
          /* @__PURE__ */ a(nd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(ro, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Ef({
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
function Eo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = $(null), l = $(null), f = at();
  Tt(() => {
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
        children: /* @__PURE__ */ a(td, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: l,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(eo, { children: [
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
function Za(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ao(e) {
  return String(e.type).toLowerCase() === "tag";
}
function Co(e) {
  return !!String(e ?? "").trim();
}
function To(e) {
  return [
    ...new Set(
      Za(e.customFieldCriteria).filter(Ao).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Co(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Io(e, t) {
  const n = Za(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!Ao(o)) return o;
    const s = { ...o };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !Co(o[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Wc(e, t, n) {
  const r = Za(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Za(n.customFieldCriteria), o = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!Ao(l)) return l;
    const f = i.find((p) => o(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(l[p] ?? "")];
      g && l[h] === g && !Co(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Af(e, t, n) {
  if (!jn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), i = n.steps.some((c) => Dn(c.mode)) ? await Yd(r) : "", o = await ho(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((l) => !Dn(l.mode)),
    ...o.filter((l) => Dn(l.mode))
  ]) {
    const l = (f) => Xd(
      i,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await el(
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
async function $o(e, t) {
  const n = e.occurrence;
  if (oo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await we("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Un({
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
function Yc(e) {
  return ba(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Ro(e, t) {
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
  }, s = Yc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
                      key: ii,
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
async function Oo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => oi([n], t))
  );
}
function Xc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Cf(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function Tf(e, t, n, r, i) {
  if (!Yc(e)) return !1;
  const o = fc(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((l) => r.includes(l))
  );
}
async function Zc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || Xc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = _e(e), o = await Vr(
    Ro(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = o.items.length ? await Oo(c, r) : [], f = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const p = d++, h = o.items[p], g = await we(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return Cf(e.occurrence, v, l) && !Tf(c, h, y.id, v, l) ? [
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
async function el(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = _e(e), o = await Ya(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await we(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await we("/api/tagapplications", {
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
      r.has(f.tag.id) && !l.has(f.tag.id) && await we(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await we(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Wr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function If(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function wn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? fc(
      await Ya(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await we(If(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Bi(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await Ya(e, t.media.id), i = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  Bi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === Wa
  ) ?? Wa, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
async function Mo(e, t, n) {
  if (t.occurrence && Ae(e))
    await el(
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
      i.length && await we(
        `/api/${dr(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function $f(e, t, n) {
  t.occurrence && Ae(e) ? await Af(e, t.occurrence, n) : await pc(_e(e), n, [t.media.id]);
}
function Vi(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Wr(i(t.ids), i(n.ids)),
    absence: Wr(i(t.absent), i(n.absent))
  };
}
function Rf(e, t) {
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
class tl extends Error {
}
const zi = (e) => e instanceof Error ? e.message : "Request failed.", ps = (e) => [...e].sort((t, n) => t - n), va = (e, t) => JSON.stringify(ps(e)) === JSON.stringify(ps(t)), Ji = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ei(e, t, n, r) {
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
function Of(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Mf(e, t, n, r) {
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
      l = (await we(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new tl(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Ff(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !jn(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ba(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Oo(i.occurrence, n) : [];
  await Mf(i, o, s, n);
  const c = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await ho(h, n)
    }))
  ), l = structuredClone(Of(c));
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
  const d = await $o(i, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await Zc(i, d, h, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = ei(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: va(N.ids, v.desired) ? "unchanged" : "pending"
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
function xf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!va(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return va(i(e), i(t));
}
async function nl(e, t, n, r) {
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
function rl(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function al(e) {
  return e.entries.filter((t) => t.operation);
}
async function Pf(e, t, n, r, i = !1) {
  await nl(
    rl(e, i),
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
        if (s = await wn(_e(e.review), o.item, !1), !xf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = zi(h);
        return;
      }
      const c = ei(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Wr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : h ? "skipped" : "unchanged", o.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Mo(e.review, o.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await wn(_e(e.review), o.item, !1);
        p = !0, o.expected = h;
        const g = Vi(
          o.item,
          o.before,
          h,
          e.touched
        );
        if (o.operation = Ji(g) ? g : void 0, d) throw d;
        if (!va(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (h) {
        if (o.status = "failed", o.error = zi(h), !p)
          try {
            const g = await wn(_e(e.review), o.item, !1);
            o.expected = g;
            const y = Vi(
              o.item,
              o.before,
              g,
              e.touched
            );
            o.operation = Ji(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function Lf(e, t, n) {
  await nl(
    al(e),
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
        const c = await wn(_e(e.review), r.item, !1);
        Rf(i, c), s = !0, await Mo(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const l = await wn(_e(e.review), r.item, !1);
        if (!va(
          l.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${zi(c)}`, r.status = "failed", s)
          try {
            const l = await wn(_e(e.review), r.item, !1), f = Vi(
              r.item,
              r.before,
              l,
              o
            );
            r.operation = Ji(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const il = (e, t) => t.count - e.count || hc(e, t);
async function Df(e, t, n) {
  const r = _e(e), i = e.occurrence, [o, s] = await Promise.all([
    we(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Oo(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Bi(c.map((y) => y.tag));
  const l = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await we(`/api/tags/${v}`, { signal: n })).name;
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
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(il);
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
function _f(e, t, n, r) {
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
function Fo(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(il), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Fr(t).flatMap((g) => {
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
      mixed: _f(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((E) => v.has(E))).flatMap(
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
const Ei = { summary: null, error: "" };
function ol(e, t, n = 0) {
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
    value: Ei
  });
  return ee(() => {
    if (s((l) => l.key === i ? l : { key: i, value: Ei }), e === null || t === null) return;
    const c = new AbortController();
    return Df(e, t, c.signal).then((l) => {
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
  }, [i, n]), o.key === i ? o.value : Ei;
}
function jf(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = su(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => i.add(h.name));
  }
  const o = qt(e.name), s = [...r].filter((f) => qt(f) !== o), c = s.length < r.size, l = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: l };
}
function Uf(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Hi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = Li,
  flags: o = [],
  className: s = ""
}) {
  const c = Bn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Fo(e, r, i) : [], d = bo(f), p = (h) => [
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
          const g = h.kind === "other" ? [] : p(h.members), y = jf(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Uf(h, y),
                  children: [
                    /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Wt, { tag: v }),
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
function Jr({
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
const hs = 5;
function Bf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await we(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const ms = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Qi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], gs = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Kf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ai = 250;
function pa(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Gf({ step: e }) {
  const t = Qi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Qi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Yr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function bs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(eo, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function fa({
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
        n && /* @__PURE__ */ u(me, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function ys({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Or(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Wt, { tag: i })
    ] }) }, `added-${i.id}`)),
    Or(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(Wt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function ws({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: i
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ai && /* @__PURE__ */ u("span", { children: [
        "First ",
        Ai.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, Ai).map((o) => {
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
                pa(o, n)
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
function Vf(e) {
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
function zf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [E, O] = T(!1), [x, B] = T(""), [C, D] = T(!1), [P, ne] = T(""), [J, j] = T(null), [V, M] = T(null), [_, L] = T([]), [W, Q] = T(0), ae = $(null), H = $(null), S = $(null), ce = $(!1), A = $(!1), Y = $(null), de = $(!1), pe = $(!1), G = $({ onClose: o });
  G.current = { onClose: o };
  const be = at(), Ee = l === "run", ke = (J == null ? void 0 : J.kind) === "undo", ve = Ee && d ? d.review : e, He = Xr(ve.actions), fe = ve.occurrence, it = _e(ve), We = Bn(it), xt = We.queue, Yt = Ee && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !or(I))
  ), Gt = Yt.filter((I) => y.includes(I.id)), et = fe.targetMode === "selected" && fe.performerIds.length === 1, Be = ol(
    ve,
    s && et ? fe.performerIds[0] : null,
    W
  ), Ke = To(ve.view.objectFilter), Ye = Ca(
    s ? [...si(Yt), ...fe.conditionTagIds, ...Ke] : []
  ), ur = Ne(() => Tc(Ye), [Ye]), ht = (I) => h[I] ?? Ye[I] ?? { id: I, name: `Tag ${I}` }, Kn = JSON.stringify(
    Object.fromEntries(
      Ke.flatMap((I) => {
        var ie;
        const K = (ie = Ye[I]) == null ? void 0 : ie.name;
        return K ? [[String(I), K]] : [];
      })
    )
  ), tt = Ne(
    () => Io(ve.view.objectFilter, JSON.parse(Kn)),
    [ve.view.objectFilter, Kn]
  );
  ee(() => {
    var I, K, ie;
    s && ((I = ae.current) == null || I.showModal(), (ie = (K = ae.current) == null ? void 0 : K.querySelector(".dq-batch-answer input")) == null || ie.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var qe;
      const K = ae.current, ie = document.activeElement;
      if (!K || ie && ie !== document.body && K.contains(ie)) return;
      (qe = (l === "answers" ? K.querySelector(".dq-batch-answer input:checked") ?? K.querySelector(".dq-batch-answer input") : K.querySelector("[data-batch-focus]")) ?? H.current) == null || qe.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, E, d]), ee(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const K = S.current;
      if (!ce.current || !K || K.disabled) return;
      ce.current = !1;
      const ie = document.activeElement;
      (!ie || ie === document.body) && K.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || fe.targetMode !== "selected") return;
    const I = new AbortController();
    return L([]), Bf(fe.performerIds.slice(0, hs), I.signal).then((K) => {
      I.signal.aborted || L(K);
    }).catch(() => {
    }), () => I.abort();
  }, [s, fe.targetMode, JSON.stringify(fe.performerIds)]), ee(
    () => () => {
      var I;
      A.current = !0, (I = Y.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!E) return;
    const I = (K) => {
      K.preventDefault(), K.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Ce() {
    f("answers"), p(null), g({}), j(null), w(!1), N([]), ne(""), B(""), D(!1), M(null);
  }
  function Ge() {
    pe.current || (c(!1), G.current.onClose(de.current), de.current = !1, Ce(), ce.current = !0);
  }
  function Ve(I, K) {
    N(
      (ie) => K ? [...ie, I] : ie.filter((oe) => oe !== I)
    ), p(null), g({}), ne(""), B(""), D(!1), M(null);
  }
  function It() {
    f("answers"), M(null), ne("");
  }
  function fr() {
    f("preview"), d || On();
  }
  function un() {
    var I;
    A.current = !0, (I = Y.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function $t(I) {
    M(
      (K) => (K == null ? void 0 : K.group) === I.group && K.reason === I.reason ? null : I
    );
  }
  const mt = (I, K) => (V == null ? void 0 : V.group) === I && V.reason === K;
  async function On() {
    if (!Gt.length || pe.current) return;
    pe.current = !0, O(!0), B(""), D(!1), ne("Loading all matching occurrences…"), p(null), g({}), M(null);
    const I = new AbortController();
    Y.current = I;
    try {
      const K = await Ff(
        e,
        Gt,
        I.signal,
        (oe) => ne(`Loaded ${oe.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const ie = {};
      for (const oe of K.entries)
        for (const qe of oe.before.applications ?? [])
          ie[qe.tag.id] = qe.tag;
      g(ie), p(K), ne("Preview ready. No tags have been changed.");
    } catch (K) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : K instanceof Error ? K.message : String(K)
      ), D(!I.signal.aborted && K instanceof tl), ne("");
    } finally {
      pe.current = !1, O(!1), Y.current = null;
    }
  }
  async function vn(I) {
    if (!d || pe.current) return;
    const K = (I === "undo" ? al(d) : rl(d, I === "retry")).length;
    pe.current = !0, A.current = !1, de.current = !0, O(!0), f("run"), B(""), j({ kind: I, total: K, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ie = () => j((qe) => qe && { ...qe, done: qe.done + 1 });
    let oe = !1;
    try {
      I === "undo" ? await Lf(d, () => A.current, ie) : await Pf(d, v, () => A.current, ie, I === "retry"), ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (qe) {
      oe = !0, ne(""), B(qe instanceof Error ? qe.message : String(qe));
    } finally {
      pe.current = !1;
      const qe = A.current || oe;
      j((Pe) => Pe && { ...Pe, stopped: qe }), O(!1), Q((Pe) => Pe + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], kt = Ne(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        ei(I.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Vt = (I) => kt.get(I.item.key), fn = (I) => Wr(I.before.ids, Vt(I).desired), Nn = (I) => {
    const K = fn(I);
    return I.status === "pending" && (K.added.length > 0 || K.removed.length > 0);
  }, ze = (I) => I.conflict || Vt(I).kept.length > 0 || Vt(I).replaced.length > 0, Et = Ne(() => {
    const I = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: I.filter(Nn).length,
      correct: I.filter((K) => K.status === "unchanged").length,
      different: I.filter(ze).length,
      hosts: new Set(I.map((K) => K.item.media.id)).size,
      added: [...new Set(I.flatMap((K) => fn(K).added))],
      removed: [...new Set(I.flatMap((K) => fn(K).removed))]
    };
  }, [kt]), ue = Ne(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((I) => I.item.media.date).sort((I, K) => I.item.media.date.localeCompare(K.item.media.date)),
    [d]
  ), U = Ee ? Vf(he) : null, Fe = (I) => He.keys[ve.actions.findIndex((K) => K.id === I)] ?? "", gt = (I) => Pr(I, ur, [], r), qn = ba(fe.condition) && fe.includeSubtags !== !1 && fe.conditionTagIds.length > 0, se = ue[0], Rt = ue.length > 1 ? ue[ue.length - 1] : void 0, Pt = (I) => `/${it}/${I.item.media.id}`, Gn = et ? _[0] : void 0, Sn = Ne(
    () => n ? vc(
      n,
      Be.summary ? bo(
        Fo(Be.summary, ve.actions, r ?? Li)
      ) : []
    ) : [],
    [n, Be.summary, ve.actions, r]
  ), kn = lu(Gt, Sn, r ?? Li), pn = n ?? [], je = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Nn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ze }
  };
  function Qe() {
    const I = Kf[fe.condition], K = !!I && fe.conditionTagIds.length > 0, ie = fe.performerIds.slice(0, hs), oe = String(ve.view.filter.q ?? "").trim(), qe = fe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      oo(fe) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : fe.targetMode === "selected" ? /* @__PURE__ */ u(me, { children: [
        ie.map((Pe, Te) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Jr, { performer: { id: Pe, name: _[Te] ?? "" } }),
          _[Te] ?? "…"
        ] }, Pe)),
        fe.performerIds.length > ie.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (fe.performerIds.length - ie.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(me, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              ga,
              {
                filter: {},
                objectFilter: fe.performerFilter,
                criteriaDefinitions: to,
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
        K ? I : ao[fe.condition],
        K && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Or(fe.conditionTagIds.map(ht)).map((Pe) => /* @__PURE__ */ a(Wt, { tag: Pe }, Pe.id)) })
      ] }),
      K && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: fe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ba(fe.condition) && fe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: qe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          qe
        ] })
      ] }),
      oe && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        oe,
        "”"
      ] }),
      Object.keys(ve.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${xt} filters`,
          children: /* @__PURE__ */ a(
            ga,
            {
              filter: ve.view.filter,
              objectFilter: tt,
              criteriaDefinitions: it === "audio" ? Ls : ti,
              customFieldEntityType: it,
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
  function st(I, K, ie = !0) {
    if (!I.length) return null;
    const oe = /* @__PURE__ */ a("strong", { children: Gn || "This performer" }), qe = ie ? `Check the earliest and latest ${We.many} before applying, or narrow the batch with a date filter.` : "", Pe = I.every((Te) => Te.tagIds === null && !Te.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Pe ? /* @__PURE__ */ u("p", { children: [
          oe,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Te) => Te.flags).join(", ") }),
          ".",
          " ",
          qe
        ] }) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("p", { children: [
            oe,
            " needs attention where the chosen answers apply.",
            qe && ` ${qe}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Te) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Te.tagIds === null ? "Whole review" : Te.name }),
            ":",
            " ",
            yo(Te).join("; ")
          ] }, Te.key)) })
        ] }),
        K && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: Pt(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            pa(se, it),
            " · ",
            se.item.media.date
          ] }),
          Rt && /* @__PURE__ */ u("a", { href: Pt(Rt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            pa(Rt, it),
            " · ",
            Rt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function At() {
    const I = kn.filter((ie) => ie.tagIds === null), K = kn.filter((ie) => ie.tagIds !== null);
    return /* @__PURE__ */ u(me, { children: [
      Qe(),
      st(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${et ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Yt.map((ie, oe) => {
            const qe = Fe(ie.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(ie.id),
                  "aria-labelledby": `${be}-answer-${oe}`,
                  "aria-describedby": `${be}-effect-${oe}`,
                  onChange: (Pe) => Ve(ie.id, Pe.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: qe && /* @__PURE__ */ a(St, { binding: qe, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${be}-answer-${oe}`,
                    className: "dq-batch-answer-label",
                    title: ie.label,
                    children: ie.label
                  }
                ),
                /* @__PURE__ */ a(bs, { id: `${be}-effect-${oe}`, parts: gt(ie) })
              ] })
            ] }, ie.id);
          }) })
        ] }),
        et && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: st(K, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Hi,
            {
              ...Be,
              mediaKind: it,
              actions: ve.actions,
              trees: r,
              flags: pn,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Vn(I) {
    const K = Et, ie = V && ms.has(V.group) ? V.group : null, oe = ie ? he.filter(je[ie].test) : [], qe = (Pe) => {
      const Te = Vt(Pe), Ie = Te.skipped ? Wr(
        Pe.before.ids,
        ei(Pe.before.ids, I.action, I.categories, !0).desired
      ) : fn(Pe), Ot = !Ie.added.length && !Ie.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Te.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ot ? !Te.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ys, { added: Ie.added, removed: Ie.removed, tag: ht }),
        Te.kept.map((ge, ct) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Or(ge.existing.map(ht)).map((Se) => /* @__PURE__ */ a(Wt, { tag: Se }, Se.id)),
          " ",
          "instead of",
          " ",
          Or(ge.tagIds.map(ht)).map((Se) => /* @__PURE__ */ a(Wt, { tag: Se }, Se.id))
        ] }, ct))
      ] });
    };
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            fa,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${K.hosts.toLocaleString()} ${K.hosts === 1 ? xt : `${xt}s`}`,
              pressed: mt("matching"),
              onToggle: () => $t({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.willChange,
              label: "will change",
              tone: "add",
              pressed: mt("change"),
              onToggle: () => $t({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.correct,
              label: "already correct, no write",
              pressed: mt("correct"),
              onToggle: () => $t({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mt("different"),
              onToggle: () => $t({ group: "different" })
            }
          )
        ] }),
        oe.length > 0 ? /* @__PURE__ */ a(
          ws,
          {
            title: je[ie].title,
            entries: oe,
            mediaKind: it,
            resultHeading: "Planned change",
            describe: qe
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: se ? `Dates ${se.item.media.date}${Rt ? ` to ${Rt.item.media.date}` : ""}` : "No dates" }),
          se && /* @__PURE__ */ a(
            "a",
            {
              href: Pt(se),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${We.one}, ${se.item.media.date}`,
              title: pa(se, it),
              children: "Open earliest"
            }
          ),
          Rt && /* @__PURE__ */ a(
            "a",
            {
              href: Pt(Rt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${We.one}, ${Rt.item.media.date}`,
              title: pa(Rt, it),
              children: "Open latest"
            }
          ),
          ue.length < he.length && /* @__PURE__ */ u("span", { children: [
            (he.length - ue.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (K.added.length > 0 || K.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            ys,
            {
              added: K.added,
              removed: K.removed,
              tag: ht,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      K.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${be}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${be}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => w(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => w(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ u("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          qn ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function zn() {
    return /* @__PURE__ */ u(me, { children: [
      Qe(),
      st(kn, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${et ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${be}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${be}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: It, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Gt.map((I) => {
            const K = Fe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                K && /* @__PURE__ */ a(St, { binding: K, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(bs, { parts: gt(I) })
            ] }, I.id);
          }) })
        ] }),
        et && /* @__PURE__ */ a(
          Hi,
          {
            ...Be,
            mediaKind: it,
            actions: ve.actions,
            trees: r,
            flags: pn,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Vn(d)
    ] });
  }
  function Xt(I) {
    const K = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ie = K.kind === "apply" ? he.length - I.counts.pending : K.done, oe = K.kind === "apply" ? he.length : K.total, qe = E ? K.kind === "undo" ? "Undoing batch…" : K.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : K.kind === "undo" ? K.stopped ? "Undo stopped" : "Undo finished" : K.stopped ? "Stopped" : "Finished", Pe = oe ? Math.round(ie / oe * 100) : 100, Te = V && !ms.has(V.group) ? V.group : null, Ie = (ge) => gs.find((ct) => ct.status === ge).label, Ot = Te ? he.filter(
      (ge) => ge.status === Te && (!V.reason || ge.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: qe }),
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
            children: /* @__PURE__ */ a("span", { style: { width: `${Pe}%` } })
          }
        ),
        !E && K.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (K.total - I.recorded).toLocaleString(),
          " of",
          " ",
          K.total.toLocaleString(),
          " ",
          K.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: gs.map((ge) => /* @__PURE__ */ a(
          fa,
          {
            value: I.counts[ge.status],
            label: ge.label,
            tone: ge.tone,
            pressed: mt(ge.status),
            onToggle: () => $t({ group: ge.status })
          },
          ge.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((ge) => {
          const ct = mt(ge.status, ge.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              ge.count.toLocaleString(),
              " ",
              ge.status,
              ": ",
              ge.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ct,
                onClick: () => $t({ group: ge.status, reason: ge.error }),
                children: ct ? "Hide them" : "Show them"
              }
            )
          ] }, `${ge.status}-${ge.error}`);
        }) }),
        Ot.length > 0 ? /* @__PURE__ */ a(
          ws,
          {
            title: V.reason ? `${Ie(Te)}: ${V.reason}` : `${Ie(Te)} occurrences`,
            entries: Ot,
            mediaKind: it,
            resultHeading: "Result",
            describe: (ge) => ge.error ?? Ie(ge.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      I.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: E,
            onClick: () => void vn("undo"),
            children: [
              /* @__PURE__ */ a(id, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? K.stopped || E ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Jn() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Gt.length,
        onClick: fr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: un, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Et.willChange,
        onClick: () => void vn("apply"),
        children: [
          "Apply to ",
          Et.willChange.toLocaleString(),
          " ",
          Et.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: It, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void On(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: un, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(eo, { children: [
      U.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void vn("retry"), children: "Retry failed" }),
      U.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void vn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(of, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Yt.length,
        onClick: () => {
          Ce(), i(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Vo, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: ae,
        className: "dq-batch-dialog",
        "aria-labelledby": `${be}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Ge();
        },
        onClose: () => {
          var I;
          pe.current ? (I = ae.current) == null || I.showModal() : Ge();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Vo, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${be}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: E,
                onClick: Ge,
                children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Gf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: H,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Qi.find((I) => I.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  P && /* @__PURE__ */ a("p", { role: "status", children: P }),
                  x && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: x })
                ] }),
                l === "answers" ? At() : l === "preview" ? zn() : Xt(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: It, children: [
              /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ce, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ge, children: "Close" }),
            Jn()
          ] })
        ]
      }
    )
  ] });
}
const sl = "data-quality.description-collapsed.v1";
function Jf() {
  try {
    return localStorage.getItem(sl) === "true";
  } catch {
    return !1;
  }
}
function Hf({
  details: e,
  label: t
}) {
  const [n, r] = T(Jf), i = $n(() => {
    r((o) => {
      const s = !o;
      try {
        localStorage.setItem(sl, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Vl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Qf = (e) => "";
function Wf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: s = Qf,
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
          children: /* @__PURE__ */ a(od, { "aria-hidden": "true" })
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
            /* @__PURE__ */ a(Jr, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(_n, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Yf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Xf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Zf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Ua(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function ep(e, t) {
  const n = oo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ua(r, "or")}`,
    includesAll: `has ${Ua(r, "and")}`,
    excludes: `has none of ${Ua(r, "or")}`,
    excludesAll: `missing ${Ua(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function tp({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = at(), h = Zr(e.conditionTagIds), g = ep(e, h);
  Tt(() => {
    const w = f.current;
    if (!o || !w) return;
    const E = () => l(Zf(w));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), x = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of x) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", E), O == null || O.disconnect();
    };
  }, [o]), ee(() => {
    var E, O;
    if (!o) return;
    const w = (E = d.current) == null ? void 0 : E.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (O = d.current) == null || O.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || dn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const O = [...d.current.querySelectorAll(Xf)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
          (D, P) => D.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const x = O[0], B = O[O.length - 1], C = document.activeElement;
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
          /* @__PURE__ */ a(Gs, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(no, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ u(me, { children: [
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Yf.map(({ mode: w, label: E }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: E
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
                  ga,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: to,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
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
                  children: io.map((w) => /* @__PURE__ */ a("option", { value: w, children: ao[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(me, { children: [
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
                  ba(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function Va(e) {
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
function np(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function rp(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await Bd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await we(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Un({
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
function cl(e, t, n) {
  const r = Ro(e, [t]);
  return cc(r, r.view.filter, n);
}
function ll(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Wi(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function ap(e, t, n, r, i = {}) {
  const o = Va(e), s = np(e), c = Xc(e.occurrence), l = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await rp(e, r),
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
    complete: !y && Wi(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !Wi(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await cl(e, N.id, r);
          v > 0 && ll(d, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), g(!1);
}
function ip(e, t, n) {
  const r = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && ll(i, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: i,
    complete: Wi(e.candidates, e.cursor, i, e.limit)
  };
}
const Yi = /* @__PURE__ */ new Map();
function op(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function dl(e, t) {
  const n = op(t);
  return Yi.set(e, n), n;
}
function sp(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || Yi.has(e)) return;
    const r = new AbortController();
    return we(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = dl(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Yi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Ci = { exports: {} }, vs;
function cp() {
  return vs || (vs = 1, (function(e) {
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
          var p, h, g = {}, y = {}, N = "", v = "", w = "", E = 2, O = 3, x = 2, B = [], C = 0, D = 0, P;
          for (P = 0; P < l.length; P += 1)
            if (N = l.charAt(P), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
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
                E--, E == 0 && (E = Math.pow(2, x), x++), delete y[w];
              } else
                for (h = g[w], p = 0; p < x; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              E--, E == 0 && (E = Math.pow(2, x), x++), g[v] = O++, w = String(N);
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
              E--, E == 0 && (E = Math.pow(2, x), x++), delete y[w];
            } else
              for (h = g[w], p = 0; p < x; p++)
                C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
            E--, E == 0 && (E = Math.pow(2, x), x++);
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
          var p = [], h = 4, g = 4, y = 3, N = "", v = [], w, E, O, x, B, C, D, P = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
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
          for (p[3] = D, E = D, v.push(D); ; ) {
            if (P.index > l)
              return "";
            for (O = 0, B = Math.pow(2, y), C = 1; C != B; )
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
            if (h == 0 && (h = Math.pow(2, y), y++), p[D])
              N = p[D];
            else if (D === g)
              N = E + E.charAt(0);
            else
              return null;
            v.push(N), p[g++] = E + N.charAt(0), h--, E = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Ci)), Ci.exports;
}
var ul = cp();
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
function lp(e) {
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
        async (p) => [p, await oi([p])]
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
function fl(e, t, n) {
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
function dp(e, t, n) {
  var s;
  const r = fl(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: o.includes("tags") && ((s = i == null ? void 0 : i.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function up({
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
        const E = d.get(w.id) ?? { name: w.name, count: 0 };
        E.count++, d.set(w.id, E);
      }
  const p = f.filter((v) => !d.has(v)), h = Zr(p);
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
      const E = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": E,
          title: E ? `Show every video again, not only ${w.name}` : `Show only videos tagged ${w.name}`,
          disabled: i,
          onClick: () => o(v),
          children: [
            E && /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
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
function fp({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Lr(e.view.objectFilter, t, c).bins, f = pp(e, t, n, o);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const g of c) {
    const y = ((h = g.group) == null ? void 0 : h.trim()) ?? "";
    d.set(y, [...d.get(y) ?? [], g]);
  }
  return /* @__PURE__ */ a(me, { children: [...d].map(([g, y]) => /* @__PURE__ */ u(
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
                v && /* @__PURE__ */ a(Yr, { "aria-hidden": "true" }),
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
function pp(e, t, n, r) {
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
      g.includes(v.key) || (p++, cc(hl(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || o((E) => ({ ...E, [v.key]: w }));
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
function hp(e) {
  if (!$r(e) || Object.keys(e).length !== 1 || !$r(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !$r(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function pl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function mp(e, t) {
  const n = t.find(
    (r) => cr(e, pl(r.filter))
  );
  return n ? n.key : hp(e);
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
    const c = s.children, l = mp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !$r(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && $r(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && $r(g.group) ? d = g.group : p = !1;
    if (!p) break;
    i.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: i };
}
function hl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Lr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (o.includes(t) ? o.filter((d) => d !== t) : [...o.filter((d) => !c || s(d) !== c), t]).reduce(gp, { ...e, view: { ...e.view, objectFilter: i } });
}
function gp(e, t) {
  var o, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (o = e.presentation) == null ? void 0 : o.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = pl(c.filter);
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
const ci = [
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
], bp = {
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
    filter: Qt({
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
function Ns(e) {
  return ul.compressToEncodedURIComponent(JSON.stringify(e));
}
function qs(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : ul.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function Xi(e, t) {
  let n;
  if (Ae(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ci.some((c) => c !== "performer" && t.has(c))) {
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
    ...bp,
    ...qs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !io.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Qt(i, _e(e)),
      objectFilter: qs(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const Ss = { dataQualityOpenedFromList: !0 };
function ml() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function gl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...Ss }, "", e) : window.history.replaceState(ml() ? { ...Ss } : null, "", e);
}
function ma(e, t) {
  const n = new URLSearchParams(window.location.search);
  ci.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", Ns(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", Ns(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), gl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function Rn(e, t) {
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
  return Rn(t, xr(t));
}
function ks(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !cr(
    JSON.parse(rr(Rn(e, t))),
    JSON.parse(rr(Rn(e, xr(e))))
  );
}
function xo(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Le(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function bl(e, t) {
  if (Le(e) !== "video") return e;
  const { base: n, bins: r } = Lr(
    e.view.objectFilter,
    t.view.objectFilter,
    xo(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ba(e, t) {
  if (Le(e) !== "video") return t;
  const { base: n, bins: r } = Lr(
    t.objectFilter,
    e.view.objectFilter,
    xo(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function Es(e, t) {
  return !t || !Ae(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Ti(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const ln = (e) => e instanceof Error ? e.message : "Request failed.", yp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Ii = 50, wp = [], As = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function vp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Hl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? js(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Np({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(zs, {}) : /* @__PURE__ */ a(ri, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: xi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function qp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const c = !!n && !r, l = So(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ca(
    Ne(() => [...o, ...d ?? []], [o, d])
  ), h = (J) => p[J] ?? { id: J, name: p[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => Or(J.map(h)), y = f && e ? go(f, e, i) : null, N = e ? nu(e) : [], v = new Set(N.map((J) => J.id)), w = new Set(y == null ? void 0 : y.removed), E = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), x = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((J) => !v.has(J))), D = n ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
          O.has(J.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(Wt, { tag: J })
          ] }) : /* @__PURE__ */ a(Wt, { tag: J })
        ]
      },
      J.id
    )) })
  ] }), ne = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(me, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (J) => w.has(J.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(Wt, { tag: J })
            ] }),
            E.has(J.id) && x
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Wt, { tag: J }) }, J.id)
        ),
        B.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Wt, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Wt, { tag: J }) }),
          x
        ] }, `absent-${J.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && P
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(me, { children: [
    !c && ne,
    n,
    n && P && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: P })
  ] });
}
function Sp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    yo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function kp({
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
  var bn;
  const d = _e(e), p = Bn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var k;
    return m.title || ((k = m.files[0]) == null ? void 0 : k.basename) || h;
  }, y = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = Xi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = ln(m), N.current = { query: xr(e), startAtEnd: !1 };
    }
  const [w, E] = T(null), [O, x] = T(""), B = $(null), C = $(null), D = $(null), P = $(null), [ne, J] = T(!!v.current), j = $(0), [V, M] = T(N.current.query), _ = $(V);
  _.current = V;
  const [L, W] = T(0), Q = $(N.current.startAtEnd), [ae, H] = T([]), [S, ce] = T(null), A = $(null), [Y, de] = T(null), [pe, G] = T(0), be = Ne(() => {
    var X;
    if (!S) return null;
    const m = ae.findIndex((le) => le.key === S.key), k = ((X = A.current) == null ? void 0 : X.key) === S.key ? A.current : null;
    return (m >= 0 ? ae.slice(m + 1) : k ? ae.filter((le) => !k.before.includes(le.key)) : []).find((le) => le.media.id !== S.media.id) ?? null;
  }, [S, ae]), [Ee, ke] = T(0), [ve, He] = T(!1), [fe, it] = T(!1), We = $(!1), xt = $(0), Yt = $(!1), Gt = $(null), et = $(!0), Be = $(null);
  ee(() => (et.current = !0, () => {
    et.current = !1;
  }), []);
  const [Ke, Ye] = T(v.current), [ur, ht] = T(""), [Kn, tt] = T(""), [Ce, Ge] = T(null), [Ve, It] = T(!1), [fr, un] = T([]), $t = $([]), mt = $(null), On = $(null), vn = $(null);
  ee(() => {
    var m, k;
    Ve && ((k = (m = vn.current) == null ? void 0 : m.querySelector("input")) == null || k.focus());
  }, [Ve]);
  const he = $(null);
  ee(() => {
    if (fe) return;
    const m = he.current;
    he.current = null;
    const k = document.activeElement;
    m != null && m.isConnected && (!k || k === document.body) && m.focus();
  }, [fe]);
  const [kt, Vt] = T(!1), [fn, Nn] = T(!1), ze = Ta(), [Et, ue] = T(!1), U = l ?? Et, Fe = f ?? ue;
  ee(() => {
    if (ve || kt || !On.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(As)) return;
      const k = On.current;
      On.current = null;
      const F = document.activeElement;
      F && F !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [ve, kt, L]);
  const [gt, qn] = T([]), [se, Rt] = T({}), Pt = $(null), [Gn, Sn] = T({});
  ee(() => {
    let m = !0;
    return Promise.all(
      To(V.objectFilter).map(
        async (k) => [
          String(k),
          (await we(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      m && Sn(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [V.objectFilter]);
  const kn = Ne(
    () => Io(V.objectFilter, Gn),
    [Gn, V.objectFilter]
  ), pn = $(0), je = $(e);
  je.current = e;
  const Qe = w ?? e, st = Ne(
    () => Rn(Qe, V),
    [Qe, V]
  ), At = Ne(
    () => Es(st, V.performerFocus),
    [st, V.performerFocus]
  ), Vn = $(At);
  Vn.current = At;
  const zn = $(st);
  zn.current = st;
  const [Xt, Jn] = T("items"), [I, K] = T(null), ie = $(null), oe = $("");
  function qe(m) {
    const k = typeof m == "function" ? m(ie.current) : m;
    ie.current = k, K(k);
  }
  const [Pe, Te] = T(!1), [Ie, Ot] = T(null), ge = $(null), ct = Ae(st) ? Va(st) : "", [Se, Mn] = T(0), [Re, pr] = T(null);
  ee(() => () => {
    var m;
    return (m = ge.current) == null ? void 0 : m.controller.abort();
  }, []), ee(() => {
    const m = ge.current;
    !m || m.signature === ct || (m.controller.abort(), ge.current = null, Te(!1));
  }, [ct]), ee(() => {
    var F;
    const m = ie.current;
    if (Xt !== "performers" || !ct || ((F = ge.current) == null ? void 0 : F.signature) === ct || oe.current === ct || (m == null ? void 0 : m.signature) === ct && m.complete)
      return;
    const k = (m == null ? void 0 : m.signature) === ct ? m : null;
    br(m, (k == null ? void 0 : k.limit) ?? Ii);
  }, [Xt, ct, I, Ie, Pe]);
  const zt = V.performerFocus;
  ee(() => {
    if (!zt) {
      pr(null);
      return;
    }
    let m = !0;
    return we(`/api/performers/${zt}`).then((k) => {
      const F = dl(zt, k.tags);
      m && pr({ id: zt, name: k.name, tags: F });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [zt]);
  const ea = JSON.stringify(
    Ae(st) ? Ws(st.occurrence) : []
  ), Lt = Ne(() => JSON.parse(ea), [ea]), ta = Ne(() => ou(Lt), [Lt]), Mt = gc(ta), Zt = Ca(ta), hr = (m) => {
    var k;
    return ((k = Zt[m]) == null ? void 0 : k.name) ?? (Zt[m] === null ? "Unavailable tag" : "…");
  }, En = (m) => ({
    name: hr(m),
    tagIds: Mt.get(m) ?? [m],
    resolved: Mt.has(m)
  }), mr = ol(
    Ae(st) ? st : null,
    zt ?? null,
    Se
  ), pt = ks(e, V), bt = ks(e, Ba(e, V)), nt = fe || ve || Ve, ot = Number(V.filter.page);
  function lt(m, k = !1) {
    We.current || (xt.current++, ht(""), v.current = "", Q.current = k, _.current = m, M(m), ke(0), He(!0), k || ma(e.id, m), W((F) => F + 1));
  }
  function yt() {
    if (We.current = !1, it(!1), et.current && Be.current) {
      const m = Be.current;
      Be.current = null, lt(m.query, m.startAtEnd);
    }
  }
  ee(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = Xi(
            je.current,
            new URLSearchParams(window.location.search)
          );
          We.current ? Be.current = k : lt(k.query, k.startAtEnd);
        } catch (k) {
          Ye(ln(k));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), ee(() => (r(fe || ve || Ve || !!w), () => r(!1)), [fe, ve, Ve, !!w, r]);
  async function Hn(m, k, F) {
    if (Ae(m)) {
      const le = await Zc(
        m,
        Pt.current,
        k,
        F
      );
      return {
        items: le.items.map((ye) => ({
          key: ye.key,
          media: ye.media,
          occurrence: ye
        })),
        totalCount: le.totalCount
      };
    }
    const X = await Vr(
      m,
      { ...m.view.filter, page: k },
      F
    );
    return {
      items: X.items.map((le) => ({ key: String(le.id), media: le })),
      totalCount: X.totalCount
    };
  }
  function Fn(m, k, F, X = !1, le = !1) {
    if (!et.current || Be.current) return;
    J(!0), H(
      le ? m.items : Ti(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), Dt(F, X);
    const ye = {
      ..._.current,
      filter: { ..._.current.filter, page: k }
    };
    _.current = ye, M(ye), ma(e.id, ye);
  }
  function Dt(m, k = !1) {
    xt.current++, (m == null ? void 0 : m.key) !== (S == null ? void 0 : S.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (S == null ? void 0 : S.media.id) && de(k && m ? m.media.id : null), ce(m);
  }
  ee(() => {
    if (v.current) return;
    const m = new AbortController();
    P.current = m;
    const k = ++pn.current;
    return He(!0), Ye(""), tt(""), A.current = null, de(null), ce(null), H([]), It(!1), (async () => {
      const F = Es(
        Rn(je.current, _.current),
        _.current.performerFocus
      );
      Pt.current = Ae(F) ? await $o(F, m.signal) : null;
      let X = Number(F.view.filter.page), le = await Hn(F, X, m.signal);
      const ye = Math.max(
        1,
        Math.ceil(le.totalCount / Number(F.view.filter.perPage))
      );
      (Q.current || X > ye) && (X = ye, le = await Hn(F, X, m.signal)), Q.current = !1;
      const ut = F.view.startFrom === "end" ? -1 : 1;
      for (; Ae(F) && !le.items.length && X + ut >= 1 && X + ut <= ye && !m.signal.aborted; )
        X += ut, le = await Hn(F, X, m.signal);
      if (k !== pn.current || m.signal.aborted) return;
      const Ft = Ti(le.items, F.view.startFrom === "end");
      Fn(le, X, Ft[0] ?? null);
    })().catch((F) => {
      !m.signal.aborted && k === pn.current && Ye(ln(F));
    }).finally(() => {
      !m.signal.aborted && k === pn.current && (J(!0), He(!1));
    }), () => {
      m.abort(), pn.current++;
    };
  }, [L, e.id]);
  const hn = $(null);
  ee(() => {
    if ((S == null ? void 0 : S.key) !== hn.current && Ge(null), hn.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let m = !0;
    return wn(d, S).then((k) => {
      m && (Ge(k), qn(
        Ae(e) ? k.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((k) => {
      m && Ye(`Could not load current tags. ${ln(k)}`);
    }), () => {
      m = !1;
    };
  }, [S]), ee(() => {
    if (!Ae(e) || e.actions.length)
      return;
    let m = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await we(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      m && Rt(Object.fromEntries(k));
    }).catch((k) => {
      m && Ye(ln(k));
    }), () => {
      m = !1;
    };
  }, [e]);
  function Dr(m, k = A.current) {
    const F = ae.findIndex((Ue) => Ue.key === m.key), X = V.startFrom === "end" ? -1 : 1, le = (k == null ? void 0 : k.key) === m.key, ye = le ? k : { key: m.key, page: ot, before: ae.slice(0, F + 1).map((Ue) => Ue.key), after: ae.slice(F + 1).map((Ue) => Ue.key) }, ut = new Set(ye.after), Ft = new Set(ye.before), an = ae.find((Ue) => ut.has(Ue.key) || (X === 1 || ot < ye.page) && le && !Ft.has(Ue.key));
    return { direction: X, cursor: ye, remainingKeys: ut, visitedKeys: Ft, nextLoaded: an };
  }
  async function Qn(m = !1, k = !1, F = !1, X = () => !0, le = A.current) {
    if (!S) return;
    const { direction: ye, cursor: ut, remainingKeys: Ft, visitedKeys: an, nextLoaded: Ue } = Dr(S, le);
    if (!m && Ue) {
      Dt(Ue, F);
      return;
    }
    const Pn = m ? an : new Set(ae.map((Ut) => Ut.key));
    let vt = ye === -1 && !m ? Math.max(1, ot - 1) : ot;
    for (; et.current && !Be.current; ) {
      let Ut = await Hn(At, vt);
      const rt = Math.max(
        1,
        Math.ceil(Ut.totalCount / Number(V.filter.perPage))
      );
      vt > rt && (vt = rt, Ut = await Hn(At, vt));
      const Nt = Ti(Ut.items, ye === -1), In = new Map(Nt.map((Bt) => [Bt.key, Bt])), kr = m ? ut.after.flatMap((Bt) => {
        const Ma = In.get(Bt);
        return Ma ? [Ma] : [];
      }) : [], Er = new Set(kr.map((Bt) => Bt.key)), Ar = m ? {
        ...Ut,
        items: [
          ...kr,
          ...Nt.filter(
            (Bt) => Bt.key !== S.key && !Er.has(Bt.key)
          )
        ]
      } : { ...Ut, items: Nt };
      if (!X()) return;
      if (k) {
        A.current = ut, Fn(Ar, vt, S, !1, !0);
        return;
      }
      const la = ye === -1 && ot === 1 && !m ? void 0 : Ar.items.find(
        (Bt) => !Pn.has(Bt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && ye === -1 && vt === ut.page) || Ft.has(Bt.key))
      );
      if (la || (ye === -1 ? vt <= 1 : vt >= rt)) {
        Fn(
          Ar,
          vt,
          la ?? null,
          F,
          !0
        ), la || tt(
          Ut.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      vt += ye;
    }
  }
  async function en(m, k = !1, F = !1, X = !1) {
    var Ut;
    if (Yt.current && m && S && !F && !X && !w && !Ve) {
      Gt.current = { action: m, stay: k, key: S.key };
      return;
    }
    if (w || !S || We.current || ve || Ve && !F)
      return;
    const le = F || X || !!(m != null && m.steps.length);
    if (le && (!t || !Ce) || m && or(m) && !n) return;
    const ye = !k && !F && !X && le && m !== void 0 && Ce !== null && ts(e) && _i(Di(e.actions, au(m, Ce, _t))).length > 0, ut = F && ((Ut = vn.current) != null && Ut.contains(document.activeElement)) ? document.activeElement : null;
    We.current = !0, it(!0), Ye(""), tt(""), Yt.current = !0;
    const Ft = A.current, an = le && !k && !ye ? Dr(S).nextLoaded ?? null : null;
    an && (H(
      (rt) => rt.filter((Nt) => Nt.key !== S.key)
    ), Dt(an, !0));
    let Ue = !1, Pn = !1, vt = [];
    try {
      if (le) {
        const rt = await wn(d, S);
        if (m)
          await $f(At, S, m);
        else {
          const In = X && Ae(e) ? e.occurrence.tagIds.filter((Ar) => rt.ids.includes(Ar)) : $t.current, Er = Wr(In, X ? gt : fr);
          await Mo(At, S, Er);
        }
        const Nt = await wn(d, S);
        an || Ge(Nt), Pn = !0, It(!1), ye && (vt = _i(Di(e.actions, Nt))), tt(
          vt.length ? `Tags saved. Staying until answered: ${vt.map((In) => In.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (De(S.occurrence.performer.id), Mn((In) => In + 1));
      }
      if (!et.current || Be.current) return;
      if (le)
        if (an) {
          const rt = xt.current;
          Ue = !0, Yt.current = !1, yt(), Qn(!0, !1, !0, () => xt.current === rt && !We.current, Ft).catch((Nt) => {
            xt.current === rt && Ye(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${ln(Nt)}`);
          });
        } else vt.length || await Qn(!0, k, !k);
      else k || await Qn();
      k && F && requestAnimationFrame(() => {
        var rt;
        return (rt = mt.current) == null ? void 0 : rt.focus();
      });
    } catch (rt) {
      if (Ye(
        Pn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${ln(rt)}` : le ? `Saving stopped. ${yp(ln(rt))}${F || X ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${ln(rt)}`
      ), le && !Pn) {
        he.current = ut, an && (H(ae), de(null), G((Nt) => Nt + 1), ce(S), A.current = Ft);
        try {
          Ge(await wn(d, S));
        } catch {
          Ge(null), Ye(
            (Nt) => `${Nt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ue || (Yt.current = !1, yt());
    }
  }
  ee(() => {
    const m = Gt.current;
    if (!(!m || fe || We.current)) {
      if ((S == null ? void 0 : S.key) !== m.key || Ke) {
        Gt.current = null;
        return;
      }
      Ce && (Gt.current = null, en(m.action, m.stay));
    }
  }, [fe, Ce, S, Ke]);
  const $e = !Ve && !w && !kt && !fn && (S != null || ve || fe);
  wo({
    surface: "local",
    enabled: $e,
    actions: e.actions,
    onAction: (m, k) => {
      const F = e.actions[m];
      F && en(F, k);
    },
    onFind: () => Nn(!0)
  });
  const gr = (m) => fe || ve || !Ce || !!w || !t && m.steps.length > 0 || !n && or(m);
  function mn() {
    !i || w || We.current || Ve || (D.current = document.activeElement, C.current = {
      error: Ke,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(_.current),
      items: ae,
      current: S,
      total: Ee,
      targets: Pt.current,
      stayedCursor: A.current
    }, xt.current++, E(structuredClone(e)), x(""), tt(""), Ye(""));
  }
  ee(() => {
    if (!o) {
      j.current = 0;
      return;
    }
    o !== j.current && ne && !ve && (j.current = o, mn(), s == null || s());
  }, [o, ve, ne]);
  function na() {
    E(null), x(""), requestAnimationFrame(() => {
      const m = D.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function Wn() {
    var k;
    const m = C.current;
    !m || fe || ((k = P.current) == null || k.abort(), pn.current++, _.current = m.query, M(m.query), H(m.items), ce(m.current), ke(m.total), Pt.current = m.targets, A.current = m.stayedCursor, He(!1), Ye(m.error), tt(""), window.history.replaceState(window.history.state, "", m.url), na());
  }
  async function li() {
    if (!w || !i || We.current) return;
    const m = Rn(
      { ...w, name: w.name.trim() },
      Ba(je.current, _.current)
    ), k = wa(m);
    if (k) {
      x(k);
      return;
    }
    We.current = !0, it(!0), x("");
    try {
      if (await i(m) === !1) throw new Error("Could not save review.");
      na(), tt("Review saved.");
    } catch (F) {
      x(nc(F));
    } finally {
      yt();
    }
  }
  async function ra() {
    if (!i || We.current) return;
    const m = Ba(je.current, _.current), k = Rn(je.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    We.current = !0, it(!0), Ye(""), ht("");
    try {
      if (await i(k) === !1) throw new Error("Could not save review.");
      tt("Queue saved to this review.");
    } catch (F) {
      ht("Could not save queue. " + ln(F));
    } finally {
      yt();
    }
  }
  const dt = V.performerScope, tn = (m) => {
    const { performerFocus: k, ...F } = _.current, X = k && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    lt(
      {
        ...F,
        ...X ? { performerFocus: k } : {},
        filter: { ...F.filter, page: 1 },
        performerScope: { ...dt, ...m }
      },
      F.startFrom === "end"
    );
  };
  async function br(m, k) {
    var le;
    const F = zn.current;
    if (!Ae(F)) return;
    (le = ge.current) == null || le.controller.abort();
    const X = {
      signature: Va(F),
      controller: new AbortController()
    };
    ge.current = X, oe.current = "", Te(!0), Ot(null);
    try {
      const ye = await ap(F, m, k, X.controller.signal, {
        onProgress: (ut) => {
          ge.current === X && qe(ut);
        }
      });
      ge.current === X && qe(ye);
    } catch (ye) {
      ge.current === X && !X.controller.signal.aborted && (oe.current = X.signature, Ot({ signature: X.signature, message: ln(ye) }));
    } finally {
      ge.current === X && (ge.current = null, Te(!1));
    }
  }
  function gn() {
    var m;
    (m = ge.current) == null || m.controller.abort(), ge.current = null, Te(!1), qe((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function De(m) {
    var X;
    const k = zn.current;
    if (!Ae(k)) return;
    if (ge.current) {
      gn();
      return;
    }
    const F = Va(k);
    if (!(((X = ie.current) == null ? void 0 : X.signature) !== F || ie.current.partial))
      try {
        const le = await cl(k, m);
        if (ge.current) {
          gn();
          return;
        }
        qe(
          (ye) => (ye == null ? void 0 : ye.signature) === F ? ip(ye, m, le) : ye
        );
      } catch {
        qe(
          (le) => (le == null ? void 0 : le.signature) === F ? { ...le, partial: !0, complete: !1 } : le
        );
      }
  }
  const yr = V.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === V.performerFocus) : void 0, wt = Re && Re.id === V.performerFocus ? { ...Re, flags: Ir(Lt, Re.tags) } : yr ? { ...yr, flags: Ir(Lt, yr.tags) } : null, _r = (m) => {
    if ((Re == null ? void 0 : Re.id) === m)
      return Ir(Lt, Re.tags);
    const k = I == null ? void 0 : I.candidates.find((F) => F.id === m);
    return k ? Ir(Lt, k.tags) : void 0;
  }, nn = ((bn = S == null ? void 0 : S.occurrence) == null ? void 0 : bn.performer.id) ?? null, wr = nn === null ? void 0 : _r(nn), jr = sp(
    Lt.length > 0 && nn !== null && nn !== V.performerFocus && wr === void 0 ? nn : null
  ), Ia = wr ?? (jr ? Ir(Lt, jr) : []), _t = mc(Qe.actions), $a = mr.summary && V.performerFocus ? bo(Fo(mr.summary, Qe.actions, _t)) : [], Yn = ns(Lt, (wt == null ? void 0 : wt.flags) ?? [], En), Xn = vc(
    ns(Lt, Ia, En),
    nn !== null && nn === V.performerFocus ? $a : []
  ), di = JSON.stringify(Xn), Ur = Ne(() => Xn, [di]), ui = JSON.stringify(Yn), Ra = Ne(() => Yn, [ui]), aa = (m) => pu(Lt, m, hr);
  function ia(m) {
    if (We.current) return;
    const k = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    lt(k, k.startFrom === "end"), Jn("items");
  }
  function fi() {
    const { performerFocus: m, ...k } = _.current;
    lt(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const jt = $(null);
  jt.current ?? (jt.current = $c());
  const vr = jt.current, Nr = Ne(
    () => Qe.actions.flatMap((m) => m.steps.flatMap((k) => k.tagIds)),
    [Qe.actions]
  ), xn = $(null);
  ee(() => {
    const m = xn.current, k = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !k) return;
    const F = m.getBoundingClientRect(), X = k.getBoundingClientRect();
    X.top < F.top ? m.scrollTop -= F.top - X.top : X.bottom > F.bottom && (m.scrollTop += X.bottom - F.bottom);
  }, [S == null ? void 0 : S.key, Xt]);
  const qr = $(null), rn = $(null);
  ee(() => {
    var F, X;
    const m = rn.current;
    if (!m) return;
    rn.current = null;
    const k = [...((F = qr.current) == null ? void 0 : F.querySelectorAll(".dq-partner")) ?? []];
    (X = k.find((le) => le.dataset.partnerKey === m) ?? k[0]) == null || X.focus();
  }, [S == null ? void 0 : S.key]);
  const An = fe || ve || Ve || !!w, Cn = Ne(
    () => w ? Rn(w, Ba(e, V)) : null,
    [w, e, V]
  ), Oa = Ne(
    () => Cn != null && Hr(Mr(Cn)) !== Hr(Mr(e)),
    [Cn, e]
  );
  function pi() {
    S ? wn(d, S).then(Ge).catch((m) => Ye(ln(m))) : lt(_.current);
  }
  const oa = Ke ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ke,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: fe, onClick: pi, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, sa = fe || ve || S != null && !Ce, ca = Math.max(1, Number(V.filter.perPage) || 1), Sr = $(1);
  ve || (Sr.current = Math.max(1, Math.ceil(Ee / ca)));
  const Tn = Sr.current, Oe = dt && S ? ae.filter(
    (m) => m.media.id === S.media.id && m.key !== S.key
  ) : [], hi = (m) => {
    var k;
    return m.title || ((k = m.files[0]) == null ? void 0 : k.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, Br = S ? vp(S.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": dt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var X;
        const k = m.target instanceof Element ? m.target.closest("button") : null, F = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((X = k == null ? void 0 : k.textContent) == null ? void 0 : X.trim()) ?? "";
        k && !k.closest(As) && /^(Filters|Edit filter:|Edit criteria)/.test(F) && (On.current = k);
      },
      children: [
        /* @__PURE__ */ a(
          Jc,
          {
            name: e.name,
            description: e.description,
            entityType: Le(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: An || !!(c != null && c.busy),
            onEdit: w ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : mn,
            editDisabled: !w && (An || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: fe || Ve, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  ga,
                  {
                    filter: V.filter,
                    objectFilter: kn,
                    criteriaDefinitions: d === "audio" ? Ls : ti,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ee,
                    sortOptions: d === "audio" ? zl : Ds,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Hc,
                      {
                        page: Math.min(Math.max(1, ot || 1), Tn),
                        pages: Tn,
                        onPage: (m) => lt({
                          ..._.current,
                          filter: Qt(
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
                          filter: Qt(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      lt(
                        {
                          ..._.current,
                          objectFilter: Wc(
                            m,
                            Gn,
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
            trailing: /* @__PURE__ */ u(me, { children: [
              dt && /* @__PURE__ */ a(
                tp,
                {
                  scope: dt,
                  disabled: fe || Ve,
                  editing: !!w,
                  onChange: tn,
                  onEditCriteria: () => Vt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Qc,
                {
                  mode: "single",
                  disabled: An || !!c.busy,
                  onChange: () => {
                    var m;
                    return (m = c.onGrid) == null ? void 0 : m.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(me, { children: [
              Ae(At) && t && /* @__PURE__ */ a(
                zf,
                {
                  review: At,
                  disabled: nt || !!w,
                  performerAttention: V.performerFocus ? Ra : void 0,
                  trees: _t,
                  onOpen: () => {
                    We.current = !0, it(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const k = _.current.performerFocus;
                      k ? De(k) : gn(), Mn((F) => F + 1), yt(), v.current || He(!0), W((F) => F + 1);
                    } else yt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Eo,
                {
                  disabled: An,
                  items: c.moreItems({
                    onSelect: mn,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Jr,
                {
                  performer: {
                    id: V.performerFocus,
                    name: (wt == null ? void 0 : wt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (wt == null ? void 0 : wt.name) ?? `performer ${V.performerFocus}` })
              ] }),
              wt != null && wt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: aa(wt.flags), children: [
                /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: aa(wt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: nt,
                  onClick: fi,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: pt,
            queueChange: !w && pt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: bt ? () => void ra() : void 0,
              saveDisabled: nt || !i,
              onReset: () => {
                const m = xr(e);
                lt(m, m.startFrom === "end");
              },
              resetDisabled: nt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && Cn && /* @__PURE__ */ a(
            zc,
            {
              drawerRef: B,
              draft: Cn,
              onChange: (m) => E(m),
              direction: V.startFrom,
              onDirectionChange: (m) => lt({ ..._.current, startFrom: m }),
              tagGroups: wp,
              trees: _t,
              saving: fe,
              saveDisabled: ve,
              error: O,
              dirty: Oa,
              criteriaChanged: bt,
              notices: oa && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: oa }),
              onSave: () => void li(),
              onCancel: Wn
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${d}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${p.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: hi(S.media) }),
                        /* @__PURE__ */ a(Hs, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Br && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Br })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, be].filter(Boolean).map((m) => {
                    var X, le, ye, ut, Ft;
                    const k = m, F = k.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: F ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": F ? void 0 : !0,
                        inert: F ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          Jl,
                          {
                            streamUrl: Pi("audio", k.media.id),
                            format: ((X = k.media.files[0]) == null ? void 0 : X.format) ?? "",
                            title: g(k.media),
                            coverUrl: F ? xi("audio", k.media) : void 0,
                            duration: ((le = k.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            autostart: F && Y === k.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          _s,
                          {
                            videoId: k.media.id,
                            streamUrl: Pi("video", k.media.id),
                            posterUrl: F ? xi("video", k.media) : void 0,
                            duration: ((ye = k.media.files[0]) == null ? void 0 : ye.duration) ?? 0,
                            format: (ut = k.media.files[0]) == null ? void 0 : ut.format,
                            audioCodec: (Ft = k.media.files[0]) == null ? void 0 : Ft.audioCodec,
                            extensionSurface: F ? "quick-view" : void 0,
                            autostart: F && Y === k.media.id,
                            keyboardShortcutsEnabled: F,
                            showAbLoop: F,
                            clip: k.media.parentVideoId != null ? {
                              start: k.media.clipStartSec ?? 0,
                              end: k.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${k.media.id}:${pe}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ a(
                    Hf,
                    {
                      details: S.media.details,
                      label: p.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: ve ? "Loading review…" : Ee ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              Qe.actions.length > 0 ? /* @__PURE__ */ a(
                Cu,
                {
                  actions: Qe.actions,
                  isDisabled: (m) => Ve || gr(m),
                  busy: sa,
                  tags: Ce,
                  trees: _t,
                  preview: vr,
                  onApply: (m, k) => void en(m, k),
                  onFind: () => Nn(!0),
                  findDisabled: Ve || !!w,
                  paused: !!w,
                  waitForGroups: ts(Qe),
                  attention: Ur,
                  stayOnTap: U,
                  onStayOnTapChange: Fe
                }
              ) : Ae(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || fe || Ve || !Ce || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((m) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: gt.includes(m),
                          onChange: (k) => qn(
                            e.occurrence.multiple ? k.target.checked ? [...gt, m] : gt.filter((F) => F !== m) : [m]
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
                          onClick: () => qn([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void en(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void en(void 0, !1, !1, !0),
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
                S && /* @__PURE__ */ u(me, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Jr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: dt ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    Ur.length > 0 && /* @__PURE__ */ a(Sp, { entries: Ur })
                  ] }),
                  Oe.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${p.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          p.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Oe.map((m) => {
                          var k, F, X;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = m.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (F = m.occurrence) == null ? void 0 : F.performer.name,
                              "data-partner-key": m.key,
                              disabled: nt,
                              onClick: () => {
                                rn.current = S.key, Dt(m), Ye("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Jr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (X = m.occurrence) == null ? void 0 : X.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    qp,
                    {
                      tags: Ce,
                      preview: vr,
                      trees: _t,
                      actionTagIds: Nr,
                      label: `Current ${dt ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: Ve && !fe && (!Ce || Ce.ids.length !== $t.current.length || Ce.ids.some((m) => !$t.current.includes(m))),
                      editor: Ve && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: vn,
                          disabled: fe,
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
                                onChange: un,
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
                                  onClick: () => void en(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ce,
                                  onClick: () => void en(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    It(!1), requestAnimationFrame(() => {
                                      var m;
                                      return (m = mt.current) == null ? void 0 : m.focus();
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
                Ae(st) && V.performerFocus && /* @__PURE__ */ a(
                  Hi,
                  {
                    ...mr,
                    mediaKind: d,
                    actions: Qe.actions,
                    trees: _t,
                    flags: Ra
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && oa,
                  !w && ur && /* @__PURE__ */ a("p", { role: "alert", children: ur }),
                  Kn && /* @__PURE__ */ a("p", { role: "status", children: Kn })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": sa || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: mt,
                      className: "dq-button",
                      disabled: nt || !!w || !t || !Ce,
                      onClick: () => {
                        xt.current++, $t.current = [...Ce.ids], un([...Ce.ids]), It(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Vs, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: nt || !!w,
                      onClick: () => void en(),
                      children: [
                        /* @__PURE__ */ a(sd, { "aria-hidden": "true" }),
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
                        "aria-pressed": Xt === "items",
                        onClick: () => Jn("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Xt === "performers",
                        onClick: () => Jn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              dt && Xt === "performers" ? /* @__PURE__ */ a(
                Wf,
                {
                  ranking: (I == null ? void 0 : I.signature) === ct ? I : null,
                  busy: Pe,
                  error: (Ie == null ? void 0 : Ie.signature) === ct ? Ie.message : "",
                  focus: V.performerFocus,
                  disabled: nt,
                  labels: p,
                  flagLabel: aa,
                  onFocus: ia,
                  onMore: () => {
                    const m = ie.current;
                    m && br(m, m.limit + Ii);
                  },
                  onRefresh: () => {
                    qe(null), br(null, Ii);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: xn, children: ae.map((m) => {
                var F;
                const k = (S == null ? void 0 : S.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(m),
                    "aria-label": y(m),
                    "aria-current": k ? "true" : void 0,
                    disabled: nt,
                    onClick: () => {
                      Dt(m), Ye(""), tt("");
                    },
                    children: [
                      /* @__PURE__ */ a(Np, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(me, { children: [
                            /* @__PURE__ */ a(Jr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (F = m.media.files[0]) != null && F.duration ? js(m.media.files[0].duration) : ""
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
          Ps,
          {
            open: kt,
            onClose: () => Vt(!1),
            criteria: to,
            activeFilter: dt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              Vt(!1), tn({ performerFilter: m });
            }
          }
        ),
        fn && /* @__PURE__ */ a(
          qo,
          {
            actions: e.actions,
            trees: _t,
            isDisabled: (m) => gr(m),
            tapStays: ze && U,
            onApply: (m, k) => {
              Nn(!1), en(m, k);
            },
            onClose: () => Nn(!1)
          }
        )
      ]
    }
  );
}
const yl = "data-quality.reviews-sort.v1", Ep = { sort: "name", direction: "asc" };
function Ap() {
  try {
    const e = JSON.parse(localStorage.getItem(yl) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Ep;
}
function Cp(e) {
  try {
    localStorage.setItem(
      yl,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function wl(e, t, n, r) {
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
function $i(e, t) {
  const n = Le(e), r = Bn(so(n)), i = n === "tag" ? "tag" : Ae(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function Tp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      $i(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      $i(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      $i(e, t)
    ] })
  ] });
}
function Ip({
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
  const v = $(null), w = Ne(
    () => wl(e, t, n, r),
    [e, t, n, r]
  ), E = e.every((x) => t[x.id] !== void 0), O = r === "asc" ? "ascending" : "descending";
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
              /* @__PURE__ */ a(cd, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Qs, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: E ? e.some((x) => t[x.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              "aria-label": `Sort direction: ${O}`,
              title: `Sort direction: ${O}`,
              onClick: () => o(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(ld, { "aria-hidden": "true" }) : /* @__PURE__ */ a(dd, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Kc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: x.name }),
                    x.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: x.description, children: x.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Bc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Tp, { review: x, count: t[x.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Eo, { label: `Actions for ${x.name}`, items: N(x) }) })
          ] }, x.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(ri, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function vl(e, { id: t, name: n, description: r }) {
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
function $p({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: s } = e, c = $(null), l = $(null), f = $(o);
  f.current = o;
  const d = $(null), p = at();
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
                  children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Vc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Le(i) && t(vl(y, i));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => ko(i), children: "Export draft" }),
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
const Rp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Op(e, t, n, r) {
  return bl(
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
function Cs(e, t) {
  return Le(t) === "video" && Lr(t.view.objectFilter, e.view.objectFilter, xo(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Ts(e, t) {
  return cr(
    JSON.parse(rr(Mr(e))),
    JSON.parse(rr(Mr(t)))
  );
}
const Ri = 180;
function Is(e) {
  return Le(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function $s(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Rs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Oi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ci.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  gl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Mp(e) {
  return Qt({ ...e, page: 1 });
}
function Nl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Gr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Fp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(ro, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(pd, { "aria-hidden": "true" }) }
], xp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(ro, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(fd, { "aria-hidden": "true" }) }
], Os = [], ql = "(min-width: 900px)";
function Pp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ql);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Lp() {
  return typeof window.matchMedia == "function" && window.matchMedia(ql).matches;
}
function Dp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [E, O] = T([]), [x, B] = T(""), [C, D] = T(!0), [P, ne] = T("account"), [J, j] = T(""), [V, M] = T(""), [_, L] = T(!1), [W, Q] = T(!1), [ae, H] = T(""), [S, ce] = T(Rs), A = $(S);
  A.current = S;
  const [Y, de] = T({}), pe = $(Y);
  pe.current = Y;
  const G = $(t);
  G.current = t;
  const be = $(s);
  be.current = s;
  const Ee = $(!1), ke = $(!0);
  ee(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [ve, He] = T(!S);
  ve !== !S && (He(!S), S || de({}));
  const [fe, it] = T(Ap), { sort: We, direction: xt } = fe, Yt = (b) => {
    const q = { ...fe, ...b };
    it(q), Cp(q);
  }, Gt = $(null), et = $(null), [Be, Ke] = T(null), [Ye, ur] = T(!1), [ht, Kn] = T(!1), [tt, Ce] = T(null), [Ge, Ve] = T(null), It = !!tt || !!Ge, fr = $(It);
  fr.current = It;
  const un = Ye || !!Ge || ht, [$t, mt] = T(0), [On, vn] = T(!1), [he, kt] = T(null), Vt = $(null), fn = $(null), Nn = $(null), [ze, Et] = T(
    null
  ), ue = t.find((b) => b.id === S) ?? null, U = Ne(
    () => (ze == null ? void 0 : ze.id) === S && ue ? { ...ue, view: {
      ...ue.view,
      filter: ze.view.filter,
      objectFilter: ze.view.objectFilter,
      searchMode: ze.view.searchMode,
      startFrom: ze.view.startFrom
    } } : ue,
    [ze, S, ue]
  ), Fe = U ? Le(U) : "video", gt = so(Fe), qn = U ? Ae(U) : !1, se = Fe === "video" ? U : null, Rt = !!(U != null && U.actions.some(or)), Pt = qn && Rt, Gn = (!!se || Fe === "audio" || qn) && Rt, [Sn, kn] = T(null), pn = (Sn == null ? void 0 : Sn.id) === (U == null ? void 0 : U.id) ? Sn == null ? void 0 : Sn.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", je = qn || Fe === "audio" || Fe === "video" && pn === "single", [Qe, st] = T(0), At = $(-1), Vn = $(!1), zn = $(je);
  zn.current = je, ee(() => {
    const b = () => {
      const q = zn.current;
      if (!q && Wn.current) {
        Vn.current = !0;
        return;
      }
      At.current = -1, In(), q || st((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const Xt = gt === "audio" ? h : d, Jn = Fe === "tag" ? "Tag" : gt === "audio" ? "Audio" : "Video", I = Fe === "tag" ? y : Xt, K = $(
    null
  ), ie = lp(se), [oe, qe] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Pe, Te] = T({
    page: 1,
    perPage: 40
  }), [Ie, Ot] = T({ items: [], totalCount: 0 }), [ge, ct] = T(S);
  ge !== S && (ct(S), Ot({ items: [], totalCount: 0 }), Q(!1));
  const [Se, Mn] = T(!1), [Re, pr] = T(""), [zt, ea] = T(!1), [Lt, ta] = T(!1), [Mt, Zt] = T(() => /* @__PURE__ */ new Set()), hr = $(Mt);
  hr.current = Mt;
  const En = $(/* @__PURE__ */ new Map()), mr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [pt, bt] = T(null), nt = $(pt);
  nt.current = pt;
  const [ot, lt] = T(!1), yt = $(ot);
  yt.current = ot;
  const Hn = $(null), [Fn, Dt] = T(!1), [hn, Dr] = T("grid"), [Qn, en] = T(Ri), [$e, gr] = T(!1), [mn, na] = T(!1), Wn = $(!1), [li, ra] = T(""), [dt, tn] = T(""), [br, gn] = T(""), [De, yr] = T(null), [wt, _r] = T(""), [nn, wr] = T(!1), [jr, Ia] = T({}), _t = $(/* @__PURE__ */ new Map()), $a = $(null), Yn = $(null), Xn = !!U, di = Zi(Pp, Lp, () => !1) && Xn, [Ur, ui] = T({ top: 0, bottom: 0 });
  Tt(() => {
    if (!Xn) return;
    const b = () => {
      const R = Yn.current;
      if (!R) return;
      const z = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), re = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      ui(
        (Z) => Z.top === z && Z.bottom === re ? Z : { top: z, bottom: re }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [Xn]);
  const [Ra, aa] = T(0), ia = $(null), fi = $n((b) => {
    var R;
    if ((R = ia.current) == null || R.disconnect(), ia.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => aa(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), ia.current = q;
  }, []), jt = $(0), vr = $(0), Nr = $(null), xn = $(null), qr = mc(
    U && !je ? he ? [...U.actions, ...he.draft.actions] : U.actions : Os
  ), rn = Ne(
    () => he && U && ue ? Op(he.draft, U, oe, ue) : null,
    [he, U, oe, ue]
  ), An = Ne(
    () => U && ue ? bl(
      { ...ue, view: { ...U.view, filter: { ...oe, page: 1 } } },
      ue
    ) : null,
    [U, ue, oe]
  ), Cn = Ne(
    () => ue ? Hr(Mr(ue)) : "",
    [ue]
  ), Oa = Ne(
    () => An != null && Hr(Mr(An)) !== Cn,
    [An, Cn]
  ), pi = Ne(
    () => rn != null && Hr(Mr(rn)) !== Cn,
    [rn, Cn]
  );
  ee(() => {
    if (!dt) return;
    const b = window.setTimeout(() => tn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [dt]), ee(() => {
    if (!Be || Be.alert) return;
    const b = window.setTimeout(() => Ke(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Be]), ee(() => {
    const b = se ? To(se.view.objectFilter) : [];
    if (Ia({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (z) => {
        var te;
        try {
          const re = await we(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (te = re.name) != null && te.trim() ? [String(z), re.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      R && Ia(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const oa = Ne(
    () => se ? Io(
      se.view.objectFilter,
      jr
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [jr, U, se]
  ), sa = $n(async () => {
    c(!0), f("");
    try {
      const b = await Md();
      n(b.reviews), o(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), ne(b.storage ?? "account"), j(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), Oi(""));
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
    return B(""), Vd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), ee(() => {
    sa();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof pe.current[q.id] == "number") continue;
      (Ae(q) ? $o(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : Vr(Ro(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Le(q) === "tag" ? Ni(
        q,
        Qt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Vr(
        q,
        Qt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || de((te) => ({
          ...te,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || de((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), Tt(() => {
    var R, z;
    const b = et.current;
    if (S || s || !b) return;
    et.current = null, (z = (b === "heading" ? null : [...((R = Yn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Gt.current) == null || z.focus();
  }, [S, s, Ge, t]);
  const ca = $(0), Sr = $n(async () => {
    const b = ++ca.current;
    yr(null), _r("");
    try {
      const q = await (Pt ? uc(gt) : dc(gt));
      b === ca.current && yr(q);
    } catch (q) {
      if (b !== ca.current) return;
      yr(null), _r(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Pt, gt]);
  ee(() => {
    Sr();
  }, [Sr]);
  const Tn = $n(
    async (b, q, R = !1, z = !1) => {
      var Je, xe;
      const te = ++jt.current;
      (Je = Nr.current) == null || Je.abort();
      const re = new AbortController();
      Nr.current = re, q = Qt(q);
      const Z = Number(q.page);
      R && (q = { ...q, page: 1 }), qe(q), ta(R), Mn(!0), pr("");
      try {
        const Xe = (Me) => Le(b) === "tag" ? Ni(
          b,
          Me,
          re.signal
        ) : Vr(
          b,
          Me,
          re.signal
        );
        let ft = await Xe(q);
        const Jt = Math.max(
          1,
          Math.ceil(ft.totalCount / Number(q.perPage))
        ), Ct = R ? Jt : Math.min(Z, Jt);
        return Number(q.page) !== Ct && (q = { ...q, page: Ct }, ft = await Xe(q)), te === jt.current && (((xe = xn.current) == null ? void 0 : xe.page) !== Ct && (xn.current = {
          page: Ct,
          ids: new Set(ft.items.map((Me) => Me.id))
        }), Ot(ft), z && X(
          () => new Set(ft.items.map((Me) => Me.id))
        ), qe(q), Te(q)), ft;
      } catch (Xe) {
        throw te === jt.current && pr(
          Xe instanceof Error ? Xe.message : "Could not load the review queue."
        ), Xe;
      } finally {
        te === jt.current && Mn(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (vr.current += 1, At.current = -1, jt.current += 1, (q = Nr.current) == null || q.abort(), kt(null), Vt.current = null, Q(!1), H(""), M(""), L(!1), Zt(/* @__PURE__ */ new Set()), En.current.clear(), bt(null), lt(!1), gr(!1), Wn.current = !1, ra(""), tn(""), gn(""), Ot({ items: [], totalCount: 0 }), xn.current = null, ea(!1), !U || je) {
      Mn(!1), Et(null);
      return;
    }
    let b = !0;
    return Mn(!0), (async () => {
      let R = ue ?? U;
      Et(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (Le(U) === "video" && ci.some((xe) => te.has(xe)))
        try {
          const xe = R;
          z = Xi(xe, te);
          const Xe = Rn(xe, z.query);
          (z.query.startFrom !== (xe.view.startFrom ?? "end") || !cr(
            JSON.parse(rr(Xe)),
            JSON.parse(rr(Rn(xe, xr(xe))))
          )) && (R = Xe, Et(R));
        } catch (xe) {
          ea(!0), pr(xe instanceof Error ? xe.message : "Could not read review URL."), Mn(!1);
          return;
        }
      let re = null;
      try {
        re = await Dd(i, U.id);
      } catch (xe) {
        b && (L(!0), M(
          xe instanceof Error ? xe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Z = (re == null ? void 0 : re.signature) === rr(R) ? re : null, Je = z ? z.query.filter : Z ? Qt(Z.filter) : Mp(R.view.filter);
      qe(Je), Dr(
        Z ? $s(Z.displayMode, Le(U)) : Is(U)
      ), en(
        Z ? Z.cardSize ?? Ri : Ri
      );
      try {
        const xe = await Tn(
          R,
          Je,
          z ? z.startAtEnd : !Z && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const Xe = zo(
          xe.items.map((ft) => ft.id),
          (Z == null ? void 0 : Z.focusedId) ?? null,
          (Z == null ? void 0 : Z.index) ?? 0
        );
        bt(Xe), F(Xe);
      } catch {
      }
      b && (At.current = Qe, Q(!0), H(`${U.id}:${Qe}`));
    })(), () => {
      var R;
      b = !1, vr.current++, jt.current++, (R = Nr.current) == null || R.abort();
    };
  }, [U == null ? void 0 : U.id, je, Qe]), ee(() => {
    if (!(!$t || je || !U)) {
      if (zt) {
        mt(0);
        return;
      }
      $e || he || mn || ae !== `${U.id}:${Qe}` || (mt(0), yi());
    }
  }, [
    $t,
    je,
    U == null ? void 0 : U.id,
    ae,
    $e,
    mn,
    Qe,
    zt
  ]), ee(() => {
    !se || je || !W || Se || Re || $e || Vn.current || At.current !== Qe || ma(se.id, {
      filter: oe,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, je, W, Se, Re, oe, $e, Qe]);
  const Oe = Ne(
    () => Ie.items.map((b) => b.id),
    [Ie.items]
  );
  ee(() => {
    if (!W || !U || !i || Se || Re || $e || (ze == null ? void 0 : ze.id) === U.id || _ || At.current !== Qe)
      return;
    const b = {
      version: 1,
      signature: rr(U),
      filter: oe,
      focusedId: pt,
      index: Math.max(0, Oe.indexOf(pt ?? -1)),
      displayMode: hn,
      cardSize: Qn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + U.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (V) return;
    let q = !0;
    const R = window.setTimeout(() => {
      _d(i, U.id, b).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    W,
    i,
    U,
    Se,
    Re,
    $e,
    oe,
    pt,
    Oe,
    hn,
    Qn,
    ze,
    V,
    _,
    Qe
  ]);
  const hi = Ie.items.find((b) => b.id === pt) ?? null, Br = Fe === "video" ? hi : null;
  ot && Br && (Hn.current = Br);
  const bn = Br ?? (ot ? Hn.current : null), m = Qo(Mt, pt), k = Oe.length > 0 && Oe.every((b) => Mt.has(b)), F = $n((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (fr.current || Cd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = _t.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    W && !yt.current && F(nt.current);
  }, [W, F]), ee(() => {
    Se || !Oe.length || (nt.current == null || !Oe.includes(nt.current)) && (bt(Oe[0]), yt.current || F(Oe[0]));
  }, [F, Oe, Se]);
  const X = $n(
    (b) => {
      Zt((q) => {
        const R = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(z) !== R.has(z) && En.current.set(
            z,
            (En.current.get(z) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), le = $n(
    (b) => {
      if (!Oe.length) return;
      const q = Math.max(
        0,
        Oe.indexOf(nt.current ?? Oe[0])
      ), R = Oe[Math.max(0, Math.min(Oe.length - 1, q + b))];
      bt(R), yt.current || F(R);
    },
    [F, Oe]
  ), ye = $n(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = z != null && (!v || !E.some((Ze) => Ze.id === z)), re = "effect" in b && R && !v, Z = Qo(
        hr.current,
        nt.current
      );
      if (!U || Wn.current || Se || Re) return;
      const Je = R && !I ? `${Jn} write permission is required to apply ${b.label}.` : re || te ? `${b.label} needs a tag group that is unavailable.` : or(b) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Z.length ? "" : `Select or focus a ${Fe} before applying ${b.label}.`;
      if (Je) {
        gn(Je);
        return;
      }
      const xe = ++vr.current, Xe = U.id, ft = [...Oe], Jt = Ie, Ct = nt.current, Me = new Set(hr.current), on = new Map(
        Z.map((Ze) => [Ze, En.current.get(Ze) ?? 0])
      ), Cr = () => xe === vr.current && U.id === Xe;
      Wn.current = !0, gr(!0), ra(
        hr.current.size ? `${Z.length} selected ${Fe}s` : `the focused ${Fe}`
      ), tn(""), gn("");
      const Uo = Jt.items.filter(
        (Ze) => !Z.includes(Ze.id)
      ), Fl = Uo.map((Ze) => Ze.id), Bo = Wo(
        ft,
        Fl,
        Ct,
        Z.includes(Ct ?? -1)
      );
      q || (Ot({
        items: Uo,
        totalCount: Jt.totalCount
      }), Zt((Ze) => {
        const Ht = new Set(Ze);
        for (const yn of Z) Ht.delete(yn);
        return Ht;
      }), bt(Bo), yt.current || F(Bo));
      let wi = !1;
      try {
        if ("effect" in b ? await eu(b, Z) : await pc(gt, b, Z), wi = !0, !Cr()) return;
        q || Zt((Ze) => {
          const Ht = new Set(Ze);
          for (const yn of Z)
            (En.current.get(yn) ?? 0) === on.get(yn) && Ht.delete(yn);
          return Ht;
        }), tn(
          `${b.label}: ${Z.length} ${Fe}${Z.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (Ze) {
        if (!Cr()) return;
        Ot(Jt), Zt((Ht) => {
          const yn = new Set(Ht);
          for (const sn of Z)
            Me.has(sn) && (En.current.get(sn) ?? 0) === on.get(sn) && yn.add(sn);
          return yn;
        }), bt(Ct), yt.current || F(Ct), gn(
          Ze instanceof Error ? Ze.message : "Action failed."
        );
      }
      try {
        if (!Cr()) return;
        if (q) {
          const Kt = Fe === "tag" ? await Ni(U, oe) : await Vr(U, oe), Zn = new Map(
            Kt.items.map((cn) => [cn.id, cn])
          );
          if (Fe !== "tag" && await Promise.all(
            Z.filter((cn) => !Zn.has(cn)).map(async (cn) => {
              const er = await Ya(gt, cn).catch(() => null);
              er && Zn.set(cn, er);
            })
          ), !Cr()) return;
          Ot((cn) => ({
            items: cn.items.map((er) => Zn.get(er.id) ?? er),
            totalCount: Kt.totalCount
          }));
          return;
        }
        const Ze = new Set(Z), Ht = mr && ft.length > 0 && ft.every((Kt) => Ze.has(Kt)), yn = await Tn(U, oe, !1, Ht);
        if (!Cr()) return;
        let sn = yn.items.map((Kt) => Kt.id);
        const Pa = xn.current, xl = (Pa == null ? void 0 : Pa.page) === Number(oe.page) && sn.some((Kt) => Pa.ids.has(Kt)), Pl = (U.view.startFrom ?? "end") !== "beginning";
        if (yn.totalCount > 0 && Number(oe.page) > 1 && (!sn.length || Pl && !xl)) {
          const Kt = Math.max(1, Number(oe.page) - 1), Zn = { ...oe, page: Kt };
          qe(Zn), sn = (await Tn(
            U,
            Zn,
            !1,
            Ht
          )).items.map((vi) => vi.id), Zt(
            (vi) => new Set([...vi].filter((Ll) => sn.includes(Ll)))
          );
          const er = sn.at(-1) ?? null;
          bt(er), yt.current || F(er);
        } else {
          Zt(
            (Zn) => new Set([...Zn].filter((cn) => sn.includes(cn)))
          );
          const Kt = Wo(
            ft,
            sn,
            Ct,
            wi && Z.includes(Ct ?? -1)
          );
          bt(Kt), yt.current && Kt == null && lt(!1), yt.current || F(Kt);
        }
      } catch (Ze) {
        Cr() && gn(
          (Ht) => `${Ht ? `${Ht} ` : ""}${wi ? "The action completed, but " : ""}the queue could not be refreshed. ${Ze instanceof Error ? Ze.message : "Refresh failed."}`
        );
      } finally {
        Cr() && (Wn.current = !1, gr(!1), ra(""), Vn.current && (Vn.current = !1, In(), st((Ze) => Ze + 1)));
      }
    },
    [
      I,
      v,
      E,
      Fe,
      De,
      Tn,
      oe,
      F,
      Oe,
      Ie,
      Se,
      Re,
      U
    ]
  );
  function ut() {
    var R;
    if (hn === "list") return 1;
    const b = (R = $a.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Ft = $(() => {
  });
  Ft.current = (b) => {
    var re;
    if (je || b.defaultPrevented || b.repeat || dn(b) || b.ctrlKey || b.altKey || b.metaKey || It) return;
    const q = b.target, R = q instanceof Node && ((re = Yn.current) == null ? void 0 : re.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z) return;
    if (Fn) {
      b.key === "Escape" && (Gr(b), Dt(!1));
      return;
    }
    if (ot && b.key === "Escape") {
      Gr(b), lt(!1), F(nt.current);
      return;
    }
    if (!Ad(q)) return;
    const te = Ed(q);
    if (b.key === "Escape") {
      Gr(b), X(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!ot && b.key === " " && te) {
      Gr(b), pt != null && X((Z) => Ka(Z, pt));
      return;
    }
    if (!($e || Se) && !ot && b.key === "Enter" && pt != null && te) {
      if (Fe !== "tag" && he) return;
      Gr(b), Fe === "tag" ? window.open(`/tag/${pt}`, "_blank", "noopener,noreferrer") : lt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => Ft.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const an = $(
    () => {
    }
  );
  an.current = (b) => {
    var re;
    if (je || It || ot || Fn || $e || Se || !Oe.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((re = Yn.current) == null ? void 0 : re.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z || !b.key.startsWith("Arrow") || !Td(q)) return;
    const te = Id(b.key, ut());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), le(te));
  }, ee(() => {
    const b = (q) => an.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Ue = (he == null ? void 0 : he.saving) === !0 || mn, Pn = $e || Se && !W || Ue, vt = vo();
  wo({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !je && !It && !he && !ot && !Fn && !Re && (Ie.items.length > 0 || Se || $e),
    actions: (U == null ? void 0 : U.actions) ?? Os,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && ye(R, q);
    },
    onFind: () => Dt(!0),
    onSelectAll: () => X((b) => kd(b, Oe))
  }), ee(() => Dt(!1), [je, ot, U == null ? void 0 : U.id]);
  function Ut(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = R != null && !E.some((te) => te.id === R);
    return $e || Se || !!Re || q && !I || "effect" in b && q && (!v || z) || or(b) && (De == null ? void 0 : De.kind) !== "ready" || !m.length;
  }
  function rt(b) {
    kn(null), mt(0), Ke(null), ce(b), Oi(b, !!b && !U);
  }
  function Nt() {
    Ee.current || (ml() ? (Ee.current = !0, window.history.back()) : rt(""));
  }
  function In() {
    const b = Ee.current;
    Ee.current = !1;
    let q = Rs();
    q && !be.current && !G.current.some((z) => z.id === q) && (q = "", Oi(""));
    const R = A.current;
    q !== R && (mt(0), b || Ke(null), !q && R && (et.current ?? (et.current = { reviewId: R }))), ce(q);
  }
  function kr() {
    et.current = "heading", Ke(null), Nt();
  }
  function Er(b) {
    b !== S && rt(b), mt((q) => q + 1);
  }
  function Ar() {
    Ke(null), Ce({
      review: vl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function la(b) {
    if (un || !C) return;
    Ke(null);
    const q = crypto.randomUUID();
    let R;
    const z = S;
    Kn(!0);
    try {
      if (!await da((re) => (R = Ho(
        re.find((Z) => Z.id === b.id) ?? b,
        re,
        q
      ), [...re, R]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      A.current !== z ? Ke({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : Er(R.id);
    } catch (te) {
      Ke({
        text: `“${b.name}” was not duplicated. ${Fa(te)}`,
        alert: !0
      });
    } finally {
      Kn(!1);
    }
  }
  async function Bt() {
    if (!tt || tt.saving) return;
    const b = { ...tt.review, name: tt.review.name.trim() }, q = wa(b);
    if (q) {
      Ce({ ...tt, error: q });
      return;
    }
    Ce({ ...tt, saving: !0, error: "" });
    try {
      if (!await da((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Ce(null), Er(b.id);
    } catch (R) {
      Ce(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function Ma() {
    if (!Ge || Ge.pending) return;
    const b = Ge.review, q = wl(t, Y, We, xt).map((te) => te.id), R = q.filter((te) => te !== b.id), z = R[Math.min(q.indexOf(b.id), R.length - 1)];
    Ve({ review: b, pending: !0 });
    try {
      if (!await da((te) => te.filter((re) => re.id !== b.id)))
        throw new Error("Could not save reviews.");
      et.current = b.id !== S && z ? { reviewId: z } : "heading", Ke({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ke({ text: `“${b.name}” was not deleted. ${Fa(te)}`, alert: !0 });
    } finally {
      Ve(null);
    }
  }
  async function Sl(b) {
    if (!(un || !C)) {
      Ke(null), ur(!0);
      try {
        const q = await ff(b);
        let R = 0, z = 0;
        if (q.length && !await da((re) => {
          const Z = [...re];
          R = z = 0;
          for (const Je of q) {
            const xe = Z.find((Xe) => Xe.id === Je.id);
            if (!xe) Z.push(Je);
            else if (JSON.stringify(xe) !== JSON.stringify(Je))
              Z.push(Ho(Je, Z, crypto.randomUUID())), z++;
            else continue;
            R++;
          }
          return R ? Z : re;
        }))
          throw new Error("Could not save reviews.");
        const te = q.length - R;
        Ke({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}` + (z ? ` (${z === 1 ? "1 as a copy" : `${z} as copies`} beside a listed version that differs)` : "") + "." + (te === 1 ? " 1 review already in the list stays as it is." : te ? ` ${te} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Ke({ alert: !0, text: `Could not import “${b.name}”. ${Fa(q)}` });
      } finally {
        ur(!1);
      }
    }
  }
  function Fa(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function Po(b) {
    const q = !C || un;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ks, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void la(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Qs, { "aria-hidden": "true" }),
        onSelect: () => ko(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(ni, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ke(null), Ve({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Lo(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || ht
      },
      ...Po(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
        separated: !0,
        disabled: ht,
        onSelect: kr
      }
    ];
  }
  async function da(b) {
    if (!i) return !1;
    let q = [];
    const R = await Ld(i, (Z) => {
      q = Z;
      const Je = b(Z);
      return Je === Z ? Z : Je.map(Up);
    });
    if (n(R), !ke.current) return !0;
    const z = A.current;
    z && !R.some((Z) => Z.id === z) && Nt();
    const te = q.find((Z) => Z.id === z), re = R.find((Z) => Z.id === z);
    return re && te && ((re.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && kn(null), re.view.displayMode !== te.view.displayMode && Dr(Is(re))), !0;
  }
  function mi(b) {
    return da((q) => jp(q, b));
  }
  function kl(b) {
    return mi(b).catch((q) => {
      throw A.current !== b.id && gi(b, q), q;
    });
  }
  function gi(b, q) {
    var z;
    if (!ke.current) return;
    const R = ((z = G.current.find((te) => te.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Ke({ text: `“${R}” was not saved. ${Fa(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(Ms, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void zp().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Fs,
        {
          message: l,
          onRetry: () => void sa()
        }
      )
    ] });
  const bi = /* @__PURE__ */ u(me, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    Gn && (De == null ? void 0 : De.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      De.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: nn,
          onClick: () => {
            wr(!0), _r(""), (Pt ? Wd(gt) : Qd(gt)).then(Sr).catch(
              (b) => _r(
                `Could not create the ${Pt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => wr(!1));
          },
          children: nn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Gn && ((De == null ? void 0 : De.kind) === "incompatible" || wt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Ln, {}),
      wt || (De == null ? void 0 : De.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: nn,
          onClick: () => {
            wr(!0), Sr().finally(
              () => wr(!1)
            );
          },
          children: nn ? "Checking…" : "Check again"
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
    V && /* @__PURE__ */ u("p", { role: "alert", children: [
      V,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            M(""), L(!1);
          },
          children: _ ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Be && (Be.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
      Be.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Be.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Yn,
      className: `data-quality-page${Xn ? " dq-page-fit" : ""}`,
      style: Xn ? {
        "--dq-fit-top": `${Ur.top}px`,
        "--dq-fit-bottom": `${Ur.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Be && !Be.alert ? Be.text : "" }),
        U && je ? /* @__PURE__ */ a(
          kp,
          {
            review: ue ?? U,
            canWrite: qn ? y : Xt,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && Xt,
            onBusy: gr,
            editRequest: $t,
            onEditRequestHandled: () => mt(0),
            onSaveDefaults: C ? kl : void 0,
            pageControls: {
              onBack: kr,
              moreItems: (b) => Lo(ue ?? U, b),
              onGrid: se ? () => kn({ id: se.id, mode: "multiple" }) : void 0,
              notices: bi,
              busy: ht
            },
            stayOnTap: On,
            onStayOnTapChange: vn
          },
          U.id
        ) : U ? Ol(U) : /* @__PURE__ */ a(
          Ip,
          {
            reviews: t,
            counts: Y,
            sort: We,
            direction: xt,
            onSortChange: (b) => Yt({ sort: b }),
            onDirectionChange: (b) => Yt({ direction: b }),
            storage: Rp[P],
            canConfigure: C,
            busy: un,
            headingRef: Gt,
            notices: bi,
            onOpen: rt,
            onNew: () => Ar(),
            onImport: (b) => void Sl(b),
            onExportAll: () => Gc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Qr, { "aria-hidden": "true" }),
                disabled: !C || un,
                onSelect: () => Er(b.id)
              },
              ...Po(b)
            ]
          }
        ),
        ot && bn && se && /* @__PURE__ */ a(
          Vp,
          {
            video: bn,
            review: se,
            details: dp(bn, se, ie.ids),
            selectedCount: Mt.size,
            pending: $e,
            refreshing: Se || !!Re,
            error: br,
            canWrite: d,
            assessmentReady: (De == null ? void 0 : De.kind) === "ready",
            trees: qr,
            selected: Mt.has(bn.id),
            hasPrevious: Oe.indexOf(bn.id) > 0,
            hasNext: Oe.indexOf(bn.id) >= 0 && Oe.indexOf(bn.id) < Oe.length - 1,
            onToggleSelected: () => X((b) => Ka(b, bn.id)),
            onPrevious: () => le(-1),
            onNext: () => le(1),
            onClose: () => {
              lt(!1), F(nt.current);
            },
            onAction: ye,
            findOpen: Fn,
            onFindOpenChange: Dt
          }
        ),
        Fn && U && !je && !ot && /* @__PURE__ */ a(
          qo,
          {
            actions: U.actions,
            tagGroups: E,
            trees: qr,
            isDisabled: Ut,
            onApply: (b, q) => {
              Dt(!1), ye(b, q);
            },
            onClose: () => Dt(!1)
          }
        ),
        tt && /* @__PURE__ */ a(
          $p,
          {
            draft: tt,
            onChange: (b) => Ce((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void Bt(),
            onCancel: () => Ce(null)
          }
        ),
        /* @__PURE__ */ a(
          Ql,
          {
            open: !!Ge,
            title: "Delete review?",
            message: Ge ? `“${Ge.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ge == null ? void 0 : Ge.pending) ?? !1,
            onConfirm: () => void Ma(),
            onCancel: () => Ve((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function xa(b, q, R = !1, z = !0) {
    const te = nt.current, re = Math.max(0, Oe.indexOf(te ?? -1));
    try {
      const Z = Tn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), Je = jt.current, xe = await Z;
      if (Je !== jt.current) return;
      const Xe = xe.items.map((Jt) => Jt.id);
      Zt(
        (Jt) => new Set([...Jt].filter((Ct) => Xe.includes(Ct)))
      );
      const ft = zo(Xe, te, re);
      bt(ft), z && !yt.current && F(ft, !1);
    } catch {
    }
  }
  function El(b) {
    const q = K.current;
    if (K.current = null, Pn || !U || !ue) return;
    const R = q ?? U.view.objectFilter, z = cr(
      R,
      ue.view.objectFilter
    ) ? ue.view.objectFilter : R, te = Qt({ ...b, page: 1 }), re = {
      ...U,
      view: {
        ...U.view,
        filter: te,
        objectFilter: z
      }
    }, Z = !Ts(re, ue), Je = Z ? re : ue;
    Et(Z ? re : null), tn(Z ? "" : "Review queue defaults restored."), xa(Je, te, Je.view.startFrom !== "beginning");
  }
  function Al() {
    if ($e || Se || Ue || !ue) return;
    K.current = null;
    const b = Qt({
      ...ue.view.filter,
      page: 1
    });
    Et(null), tn("Review queue defaults restored."), xa(
      ue,
      b,
      ue.view.startFrom !== "beginning",
      !1
    );
  }
  function Cl() {
    if ($e || Se || Re || Ue || !U || !An || !C)
      return;
    const b = U, q = An;
    na(!0), mi(q).then((R) => {
      !R || A.current !== q.id || (Et(Cs(q, b)), tn("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? gi(q, R) : gn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => na(!1));
  }
  function yi() {
    if (!U || !ue || Wn.current || he || mn) return;
    fn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Vt.current = {
      temporaryReview: ze,
      filter: oe,
      loadedFilter: Pe,
      queue: Ie,
      queueError: Re,
      retryFromEnd: Lt,
      selectedIds: new Set(Mt),
      focusedId: pt,
      pageCursor: xn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...ue,
      view: { ...ue.view, startFrom: U.view.startFrom ?? "end" }
    });
    Dt(!1), lt(!1), tn(""), gn(""), kt({ draft: b, saving: !1, error: "" });
  }
  function Do() {
    kt(null), Vt.current = null;
    const b = fn.current;
    fn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : F(nt.current, !1);
    });
  }
  function Tl() {
    var q;
    if (!he || he.saving) return;
    const b = Vt.current;
    b && (jt.current += 1, (q = Nr.current) == null || q.abort(), K.current = null, Mn(!1), Et(b.temporaryReview), qe(b.filter), Te(b.loadedFilter), Ot(b.queue), pr(b.queueError), ta(b.retryFromEnd), X(() => b.selectedIds), bt(b.focusedId), xn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Do();
  }
  async function Il() {
    if (!he || he.saving || !rn || !U) return;
    const b = U, q = { ...rn, name: rn.name.trim() }, R = wa(q);
    if (R) {
      kt((z) => z && { ...z, error: R });
      return;
    }
    kt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await mi(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      Et(Cs(q, b)), Le(q) === "video" && ma(q.id, {
        filter: oe,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), tn("Review saved."), Do();
    } catch (z) {
      if (A.current !== q.id) {
        gi(q, z);
        return;
      }
      kt(
        (te) => te && {
          ...te,
          saving: !1,
          error: nc(z)
        }
      );
    }
  }
  function _o() {
    U && Tn(U, oe, Lt, mr).catch(() => {
    });
  }
  function $l() {
    Zt(/* @__PURE__ */ new Set()), En.current.clear(), bt(null);
  }
  function Rl(b) {
    !U || $e || Ue || b === Number(oe.page) || _p(
      { ...oe, page: b },
      U,
      (q, R) => Tn(q, R, !1, mr),
      $l
    );
  }
  function jo(b) {
    if (!se || !ue || $e || Se || Ue) return;
    const q = hl(se, b, ue.view.objectFilter), R = !Ts(q, ue);
    Et(R ? q : null), R ? xa(q, { ...oe, page: 1 }) : xa(
      ue,
      { ...oe, page: 1 },
      ue.view.startFrom !== "beginning"
    );
  }
  function Ol(b) {
    var xe, Xe, ft, Jt, Ct;
    const q = Fe === "tag", R = q ? "tag" : "video", z = Math.max(1, Number(oe.perPage) || 40), te = Math.max(1, Math.ceil(Ie.totalCount / z)), re = Math.min(Math.max(1, Number(oe.page) || 1), te), Z = [
      I ? "" : `${Jn} write permission is required to apply actions.`,
      q && x ? `Tag groups are unavailable. ${x}` : ""
    ].filter(Boolean), Je = !!br && !ot;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Jc,
            {
              name: b.name,
              description: b.description,
              entityType: Fe,
              onBack: kr,
              backDisabled: $e || !!he || ht,
              onEdit: he ? () => {
                var Me;
                return (Me = Nn.current) == null ? void 0 : Me.focus();
              } : yi,
              editDisabled: !he && ($e || Se || zt || mn || ht || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Pn, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  ga,
                  {
                    filter: Re ? Pe : oe,
                    onFilterChange: El,
                    totalCount: Ie.totalCount,
                    sortOptions: q ? Yl : Ds,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: hn,
                    zoomLevel: (Qn - 225) / 50,
                    onZoomChange: (Me) => en(Math.round(225 + Me * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Wl : ti,
                    customFieldEntityType: Fe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: oa,
                    onObjectFilterChange: (Me) => {
                      Pn || (K.current = Fe === "video" ? Wc(
                        Me,
                        jr,
                        b.view.objectFilter
                      ) : Me);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Hc, { page: re, pages: te, onPage: Rl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(me, { children: [
                se && /* @__PURE__ */ a(
                  Qc,
                  {
                    mode: "multiple",
                    disabled: $e || Se || It || !!he || mn || ht,
                    onChange: () => kn({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Ef,
                  {
                    options: q ? xp : Fp,
                    value: hn,
                    onChange: (Me) => Dr($s(Me, Fe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Eo,
                {
                  disabled: $e || !!he,
                  items: Lo(ue ?? b, {
                    onSelect: yi,
                    disabled: Se || zt || mn || !C
                  })
                }
              ),
              queueDiffers: W ? (ze == null ? void 0 : ze.id) === S : void 0,
              queueChange: !he && (ze == null ? void 0 : ze.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Oa ? Cl : void 0,
                saveDisabled: $e || Se || !!Re || Ue || !C,
                onReset: Al,
                resetDisabled: $e || Se || Ue
              } : void 0,
              chipsAfter: (Xe = (xe = se == null ? void 0 : se.presentation) == null ? void 0 : xe.binParents) != null && Xe.length || (Jt = (ft = se == null ? void 0 : se.presentation) == null ? void 0 : ft.filterBins) != null && Jt.length ? /* @__PURE__ */ u(me, { children: [
                !!((Ct = se.presentation.binParents) != null && Ct.length) && /* @__PURE__ */ a(
                  up,
                  {
                    videos: Ie.items,
                    review: se,
                    savedObjectFilter: (ue ?? se).view.objectFilter,
                    trees: ie.ids,
                    disabled: $e || Se || Ue,
                    onToggle: jo
                  }
                ),
                /* @__PURE__ */ a(
                  fp,
                  {
                    review: se,
                    savedObjectFilter: (ue ?? se).view.objectFilter,
                    queueFilter: oe,
                    queueCount: Se || Re ? null : Ie.totalCount,
                    disabled: $e || Se || Ue,
                    countsPaused: $e || Se || Ue || !W,
                    onToggle: jo
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          bi,
          se && ie.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: ie.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && rn && /* @__PURE__ */ a(
              zc,
              {
                drawerRef: Nn,
                draft: rn,
                onChange: (Me) => kt((on) => on && { ...on, draft: Me }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Me) => kt(
                  (on) => on && {
                    ...on,
                    draft: { ...on.draft, view: { ...on.draft.view, startFrom: Me } }
                  }
                ),
                tagGroups: E,
                trees: qr,
                saving: he.saving,
                saveDisabled: Se || !!Re,
                error: he.error,
                dirty: pi,
                criteriaChanged: Oa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Re && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Re,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: _o, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Il(),
                onCancel: Tl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Ra}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !Ie.items.length && /* @__PURE__ */ a(Ms, { label: "Loading review queue…" }),
                    Re && !Se && /* @__PURE__ */ a(
                      Fs,
                      {
                        message: Re,
                        retryLabel: zt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (zt && ue && Le(ue) === "video") {
                            const Me = xr(ue);
                            ma(ue.id, { ...Me, filter: { ...Me.filter, page: void 0 } }), st((on) => on + 1);
                            return;
                          }
                          _o();
                        }
                      }
                    ),
                    !$e && !Se && !Re && !Ie.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ri, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ie.items.length && /* @__PURE__ */ a("div", { ref: $a, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: hn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Qn}px` },
                        children: Ie.items.map(Ml)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: fi, children: /* @__PURE__ */ a(
                    Pc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: E,
                      trees: qr,
                      isDisabled: Ut,
                      paused: !!he,
                      busy: $e || Se,
                      onApply: (Me) => void ye(Me),
                      onFind: () => Dt(!0),
                      status: $e ? `Applying action to ${li}…` : "",
                      summary: /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Mt.size ? `${Mt.size} selected` : pt == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Oe.length || k,
                            onClick: () => X((Me) => /* @__PURE__ */ new Set([...Me, ...Oe])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(St, { binding: vt.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Mt.size,
                            onClick: () => X(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(St, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: Z.length ? Z.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: Je || dt ? /* @__PURE__ */ u(me, { children: [
                        Je && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
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
  function Ml(b) {
    var R, z, te;
    if (Fe === "tag") {
      const re = b;
      return /* @__PURE__ */ a(
        Bp,
        {
          tag: re,
          displayMode: hn === "list" ? "list" : "grid",
          focused: re.id === pt,
          selected: Mt.has(re.id),
          setRef: (Z) => {
            Z ? _t.current.set(re.id, Z) : _t.current.delete(re.id);
          },
          onFocus: () => bt(re.id),
          onToggle: () => {
            X((Z) => Ka(Z, re.id)), F(re.id, !1);
          },
          onOpen: () => window.open(`/tag/${re.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        re.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Kp,
      {
        video: fl(q, se, ie.ids),
        showTagBins: ((z = (R = se == null ? void 0 : se.presentation) == null ? void 0 : R.annotations) == null ? void 0 : z.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: hn,
        cardsScroll: di,
        focused: q.id === pt,
        selected: Mt.has(q.id),
        setRef: (re) => {
          re ? _t.current.set(q.id, re) : _t.current.delete(q.id);
        },
        onFocus: () => bt(q.id),
        onToggle: () => X((re) => Ka(re, q.id)),
        onPreview: () => {
          he || (bt(q.id), lt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function _p(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Ka(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function jp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Up(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Bp({
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
  return /* @__PURE__ */ a(
    "article",
    {
      ref: i,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${r ? ", selected" : ""}`,
      onFocus: o,
      onClick: (f) => {
        o(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${r ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ a(
        Xl,
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
            onClick: (f) => {
              f.stopPropagation(), s();
            },
            children: r ? "✓" : ""
          }
        ),
        /* @__PURE__ */ a("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
        /* @__PURE__ */ a("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ a("span", { children: e.description || "" }),
        /* @__PURE__ */ u("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Kp({
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
  const p = Nl(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Tt(() => {
    const E = h.current;
    if (!E) return;
    const O = E.querySelector(
      `a[href="/video/${e.id}"]`
    ), x = E.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    x && (x.id = B), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", B), O.classList.add("dq-card-link"));
    const C = E.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const D = E.querySelector(
      'button[title="Quick View"]'
    );
    D && D.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (E) => {
        h.current = E, s(E);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (E) => {
        c(), E.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          Zl,
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
          (v = e.tags) == null ? void 0 : v.map((E) => /* @__PURE__ */ a("span", { children: E.name }, E.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Gp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Gp({ video: e, cardsScroll: t }) {
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
    return we(Jd(e.id), {
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
      src: zd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Vp({
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
  findOpen: E,
  onFindOpenChange: O
}) {
  const x = $(null), B = Ta(), C = $(null), D = $(null), P = e.files[0], ne = Nl(e), J = (L) => i || o || "steps" in L && L.steps.length > 0 && !c || or(L) && !l;
  wo({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (L, W) => {
      const Q = t.actions[L];
      Q && w(Q, W);
    },
    onFind: () => O(!0)
  }), ee(() => {
    var W;
    const L = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (W = x.current) == null || W.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = L;
    };
  }, []);
  function j(L) {
    var ae, H, S;
    if (L.key !== "Tab") return;
    const W = [
      ...((ae = x.current) == null ? void 0 : ae.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!W.length) {
      L.preventDefault(), (H = x.current) == null || H.focus();
      return;
    }
    const Q = W.indexOf(
      document.activeElement
    );
    L.shiftKey && Q <= 0 ? (L.preventDefault(), (S = W.at(-1)) == null || S.focus()) : !L.shiftKey && Q === W.length - 1 && (L.preventDefault(), W[0].focus());
  }
  function V(L) {
    if (E || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const W = L.key === "ArrowLeft" || L.key === "ArrowRight";
    if (L.altKey && !W) return;
    const Q = C.current, ae = L.currentTarget.querySelector("video");
    if (L.key === "Enter" || L.key === "Escape")
      L.repeat || v();
    else if (L.key === " " && Q)
      L.repeat || Q.toggle();
    else if (W && Q)
      Q.seekBy(
        (L.key === "ArrowLeft" ? -1 : 1) * (L.shiftKey ? 5 : L.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(L.key) && Q) {
      const H = D.current;
      if (!L.repeat && (H == null ? void 0 : H.videoId) === e.id) {
        const S = [P == null ? void 0 : P.duration, ae == null ? void 0 : ae.duration].find(
          (de) => de != null && Number.isFinite(de) && de > 0
        ) ?? 0, ce = e.parentVideoId != null, A = ce ? e.clipStartSec ?? 0 : 0, Y = (ce ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(Y) && Y > 0 && Number.isFinite(H.time) && Q.seekBy(A + Y * Number(L.key) / 10 - H.time);
      }
    } else if (L.key === "ArrowUp" || L.key === "ArrowDown")
      !L.repeat && !i && !o && (L.key === "ArrowUp" && p && y(), L.key === "ArrowDown" && h && N());
    else return;
    Gr(L);
  }
  function M(L) {
    const W = x.current, Q = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !W || !Q || !W.contains(Q) || Q.closest(".dq-player, .dq-find-action") || L.detail === 0 || W.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (E) return;
    let L = 0;
    const W = requestAnimationFrame(() => {
      L = requestAnimationFrame(() => {
        var ae;
        const Q = document.activeElement;
        (ae = x.current) != null && ae.isConnected && (!Q || Q === document.body || Q === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(W), cancelAnimationFrame(L);
    };
  }, [E, i, o, h, p, e.id, B]);
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
      onKeyDownCapture: V,
      onMouseDown: (L) => {
        L.target === L.currentTarget && v();
      },
      onClick: M,
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
                  /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(St, { binding: "↑", hidden: !0 })
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
                  !B && /* @__PURE__ */ a(St, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Js, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(Yr, {}) }),
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
                children: /* @__PURE__ */ a(Hs, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ a(
            _s,
            {
              autostart: !0,
              streamUrl: Pi("video", e.id),
              posterUrl: Xo(e),
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
          ) : /* @__PURE__ */ a("img", { src: Xo(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Pc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: J,
              busy: i || o,
              onApply: (L) => void w(L),
              onFind: () => O(!0),
              status: i ? `Applying action to ${_}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ a(
          qo,
          {
            actions: t.actions,
            trees: f,
            isDisabled: J,
            onApply: (L, W) => {
              O(!1), w(L, W);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function zp() {
  const e = await we("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Ms({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(ud, { className: "dq-spin" }),
    e
  ] });
}
function Fs({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Ln, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const eh = { components: { DataQualityPage: Dp } };
export {
  Dp as DataQualityPage,
  eh as default,
  cr as objectFiltersEqual
};
