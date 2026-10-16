var jl = Object.defineProperty;
var Ul = (e, t, n) => t in e ? jl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var zi = (e, t, n) => Ul(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as me, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Tt, useMemo as Ne, useCallback as Rn, useSyncExternalStore as ri, useId as at, createContext as Bl, useContext as Kl, Fragment as ai } from "react";
import { useKeySequence as Gl, EntityReferenceMultiSelector as cr, SortableList as Ds, TagBadge as Vl, EntityReferenceSelector as Ji, EntityDetailTabs as zl, FilterDialog as _s, VIDEO_CRITERIA as ao, DetailListToolbar as ya, PERFORMER_CRITERIA as oi, AUDIO_CRITERIA as js, NarrativeText as Jl, AUDIO_SORT_OPTIONS as Hl, VIDEO_SORT_OPTIONS as Us, AudioPlayer as Ql, VideoPlayer as Bs, formatDuration as Ks, getResolutionLabel as Wl, ConfirmDialog as Yl, TAG_CRITERIA as Xl, TAG_SORT_OPTIONS as Zl, TagTile as ed, VideoCard as td } from "@cove/runtime/components";
import { Search as Sa, Flag as Un, Check as Xr, Pencil as Wr, Ban as Qa, ChevronDown as ii, Plus as ka, Pin as Gs, GripVertical as Vs, AlertTriangle as _n, Copy as zs, Trash2 as oo, X as Ea, Mic as nd, Users as Js, Tag as Hs, Headphones as Qs, Film as io, ChevronLeft as Aa, MoreHorizontal as rd, RectangleHorizontal as ad, LayoutGrid as si, ChevronRight as Ws, Save as od, RotateCcw as id, Layers as Hi, Undo2 as sd, RefreshCw as cd, ExternalLink as Ys, SkipForward as ld, Upload as dd, Download as Xs, ArrowUp as ud, ArrowDown as fd, Loader2 as pd, List as hd, Grid3X3 as md } from "@cove/runtime/lucide-react";
import { extensionFetch as gd } from "@cove/runtime/api";
import { createPortal as bd } from "react-dom";
const ci = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, li = Object.keys(
  ci
);
function wa(e) {
  return e === "excludes" || e === "excludesAll";
}
function di(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Zs(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function yd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const ec = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ae(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function ui(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return ui(Le(e));
}
function wd(e) {
  return Le(e) === "video";
}
function Le(e) {
  return e.entityType ?? "video";
}
const or = [
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
], so = [
  or.slice(0, 11),
  or.slice(11, 22),
  or.slice(22)
];
function ga(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function va(e) {
  return ga(e) ?? e.toLocaleUpperCase();
}
const ir = "none";
function Or(e) {
  return typeof e == "string" && or.includes(e);
}
function fi(e) {
  const t = e.shortcut;
  return Or(t) || t === ir ? t : "auto";
}
function tc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = fi(s);
    if (l !== ir) {
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
  const i = or.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function vd(e, t, n) {
  const { keys: r, actionOn: o } = tc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Or(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Or));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Or(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Na(e) {
  var n;
  return Ae(e) && !rc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !wd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Le(e) !== "tag" && e.actions.some(
    (r) => pi(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Bn(r, Le(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const Nd = {
  video: 1e3,
  audio: 250
};
function Yt(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Nd[t], n(e.perPage, 40))
    )
  };
}
function Qi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function ar(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ae(e) ? [e.entityType, ...r, e.occurrence] : Le(e) === "video" ? r : [Le(e), ...r]
  );
}
function Bn(e, t) {
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
  ) && !pi(e) : !1;
}
function qd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function jn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function dr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function nc(e) {
  return "steps" in e && e.steps.length > 0;
}
function sr(e) {
  return "steps" in e ? e.steps.some((t) => jn(t.mode)) : !1;
}
function pi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (jn(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ca(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || ec.includes(n.entityType)) && (!qd(n.entityType) || rc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Sd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Bn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Bn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Na(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Sd(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function Wi(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function kd(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function Yi(e, t, n) {
  return { ...structuredClone(e), id: n, name: kd(e.name, t) };
}
function rc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && li.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || Ed(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function Ed(e) {
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
function Xi(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Zi(e, t, n, r) {
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
function Ad(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function Cd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function un(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Td(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Id(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function $d(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Rd(e, t) {
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
const ac = "ext:com.midnightrider.data-quality:configuration", Od = "ext:cove-data-quality:video-reviews", Lo = "ext:com.midnightrider.data-quality:progress";
class Wa extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    zi(this, "remote");
    this.remote = r;
  }
}
function oc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof Wa ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Ta = /* @__PURE__ */ new Map(), ja = /* @__PURE__ */ new Map(), Ir = (e, t) => e.includes("*") || e.includes(t), Ya = (e) => we(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Md = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Do(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Gr(e) {
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
    reviews: Ca(JSON.stringify(t.reviews)),
    deletedIds: Do(t.deletedIds),
    importedIds: Do(t.importedIds)
  };
}
function Fd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = Ca(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Do(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function ic(e) {
  const t = await we("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function hi(e, t) {
  const n = (ja.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return ja.set(e, n), n.finally(() => {
    ja.get(e) === n && ja.delete(e);
  }).catch(() => {
  }), n;
}
let pa = null;
function xd() {
  if (pa) return pa;
  const e = Pd();
  return pa = e, e.finally(() => {
    pa === e && (pa = null);
  }).catch(() => {
  }), e;
}
async function Pd() {
  const e = await we("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return hi(t, () => Ld(e, t));
}
async function Ld(e, t) {
  var h;
  const n = String(e.user.id), r = Ir(e.permissions, "savedfilters.read"), o = r && Ir(e.permissions, "savedfilters.write"), i = r ? (await Ya(ac)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (i.length > 1) {
    const g = (y) => {
      const { revision: N, ...v } = Gr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (i.some((y) => g(y) !== g(i[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const y of i.slice(1))
        await we(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    i.splice(1);
  }
  let s = i.length ? Gr(i[0].uiOptions) : Md();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = Gr(l));
  let d = !i.length;
  if (i.length && f && l) {
    const g = Gr(l);
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
      reviews: Wi(s.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), y = Fd(n);
    if (i.length && y.reviews.some((k) => {
      const O = s.reviews.find((x) => x.id === k.id);
      return O && JSON.stringify(O) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Ya(Od)).flatMap(
      (k) => Ca(k.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (k) => !y.reviews.some((O) => O.id === k)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Wi(
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
    recordId: (h = i[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: o,
    durable: o
  };
  if (Ta.set(t, p), d && o) {
    const g = s;
    i.length && (p.config = Gr(i[0].uiOptions)), await sc(t, g), s = p.config;
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
    canWrite: Ir(e.permissions, "videos.write"),
    canWriteVideos: Ir(e.permissions, "videos.write"),
    canWriteAudios: Ir(e.permissions, "audios.write"),
    canWriteTags: Ir(e.permissions, "tags.write"),
    canReadTagGroups: Ir(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function sc(e, t) {
  const n = Ta.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await ic(n), n.recordId != null) {
      const i = await we(
        `/api/savedfilters/${n.recordId}`
      ), s = Gr(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new Wa(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const o = await we(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: ac,
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
const Xa = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), Dd = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Xa(e, n) !== Xa(t, n)
);
function _d(e, t) {
  return hi(e, async () => {
    var r;
    const n = Ta.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    for (let o = 1; ; o++) {
      const i = n.config.reviews, s = t(i);
      if (s === i) return i;
      Ca(JSON.stringify(s));
      const c = i.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
      try {
        return await sc(e, {
          ...n.config,
          reviews: s,
          deletedIds: [
            .../* @__PURE__ */ new Set([...n.config.deletedIds, ...c])
          ].filter((l) => !s.some((f) => f.id === l))
        }), s;
      } catch (l) {
        const f = l instanceof Wa ? l.remote : void 0;
        if (!f || o >= 3) throw l;
        const d = Dd(i, s).find(
          (p) => Xa(i, p) !== Xa(f.reviews, p)
        );
        if (d !== void 0) {
          const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
          throw new Wa(
            `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.`
          );
        }
        n.config = f;
      }
    }
  });
}
function es(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function jd(e, t) {
  const n = Ta.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? es(r) : null;
  if (!n.readable) return o;
  const i = (await Ya(Lo)).find(
    (c) => c.name === t
  ), s = i ? es(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function Ud(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return hi(r, async () => {
    const o = Ta.get(e);
    if (!(o != null && o.writable)) return;
    await ic(o);
    const i = (await Ya(Lo)).find(
      (s) => s.name === t
    );
    await we(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Lo,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function ur(e) {
  return e === "audio" ? "audios" : "videos";
}
const Bd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Gn(e) {
  return Bd[e];
}
const Za = "confirmed_absent_tags", mi = "Confirmed absent tags", co = "confirmed_absent_occurrence_tags", cc = {
  key: Za,
  label: mi,
  type: "tag",
  subject: "tag assessments"
}, gi = {
  key: co,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Kd = {
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
function Kn(e) {
  return Array.isArray(e) ? e.map(Kn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Kd[n] ?? n : t === "key" && typeof n == "string" && [
        Za,
        co
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Kn(n)
    ])
  ) : e;
}
async function lc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await gd(e, { ...t, headers: r });
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
async function we(e, t = {}) {
  return await lc(e, t, "fail");
}
function Gd(e, t = {}) {
  return lc(e, t, "null");
}
const Vd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let zd = 0;
function eo(e, t) {
  return we(
    `/api/${ur(e)}/${t}?dqRead=${Vd}-${++zd}`,
    { cache: "no-store" }
  );
}
function dc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Kn({
      findFilter: Yt(t, _e(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function zr(e, t, n) {
  return we(
    `/api/${ur(_e(e))}/find`,
    { method: "POST", signal: n, body: dc(e, t) }
  );
}
async function uc(e, t, n) {
  return (await we(
    `/api/${ur(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: dc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Eo(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, we("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Kn({
        findFilter: Yt(t),
        objectFilter: r
      })
    )
  });
}
function Jd(e) {
  return we("/api/taggroups", { signal: e });
}
function _o(e, t, n = 1280) {
  return `/api/${ur(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function jo(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function ts(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Hd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Qd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function lo(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await we(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await we("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Kn({
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
async function bi(e, t) {
  const n = dr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await lo(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function Wd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function yi(e, t) {
  const r = (await we("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Wd(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Gn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function fc(e, t) {
  const n = await yi(e, t);
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
function pc(e = "video") {
  return yi(cc, e);
}
function Yd(e = "video") {
  return fc(cc, e);
}
function hc(e = "video") {
  return yi(gi, e);
}
function Xd(e = "video") {
  return fc(gi, e);
}
function to(e) {
  return [...new Set(e)];
}
function mc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === co
  ), o = r === void 0 ? [] : n[r];
  return to(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function Zd(e) {
  let t;
  try {
    t = await hc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${gi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function eu(e, t, n, r, o, i) {
  await we(`/api/${ur(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: to(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function tu(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${mi} custom field is not available.`
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
async function gc(e, t, n) {
  if (!Bn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Gn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (sr(t)) {
    let l;
    try {
      l = await pc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${mi} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const o = to(n), i = (await bi(t)).map((l) => ({
    mode: l.mode,
    tagIds: to(l.tagIds)
  })), c = [
    ...i.filter((l) => !jn(l.mode)),
    ...i.filter((l) => jn(l.mode))
  ].map(
    (l) => tu(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await we(`/api/${ur(e)}/bulk`, {
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
async function nu(e, t) {
  if (!Bn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await we("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ua = (e) => e >= "0" && e <= "9";
function ns(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function rs(e, t) {
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
    const i = ns(e[n]), s = ns(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function bc(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || rs(e.tagGroupName, t.tagGroupName) || rs(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Mr(e) {
  return [...e].sort(bc);
}
const Uo = /* @__PURE__ */ new Map();
function ru(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function wi(e, t, n) {
  const r = dr(e), o = [], i = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      i.push(h);
      continue;
    }
    const g = h.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || o.push(y), N ?? [y];
    });
    i.push({ mode: "REMOVE", tagIds: g.filter((y) => !r.has(y)) });
  }
  const s = [
    ...i.filter((h) => !jn(h.mode)),
    ...i.filter((h) => jn(h.mode))
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
function au(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Mr(t);
}
function yc(e) {
  return wc(ru(e));
}
function wc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return ee(() => (i.current = !0, () => {
    i.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), lo([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function qt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function xr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = qt(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function as(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => qt(t.group) !== "");
}
function vc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Nc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function qc(e) {
  return dr(e).size > 0 || Nc(e).size > 0;
}
function ou(e) {
  return xr(e).filter(
    (t) => !t.actions.some((n) => qc(e[n]))
  );
}
function Bo(e, t) {
  const n = vc(t), r = new Set(t.absent);
  return xr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...dr(e[c])], f = [...Nc(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function Ko(e) {
  return e.filter((t) => t.answers.length === 0);
}
function iu(e, t, n) {
  const r = { ids: [...vc(t)], absent: t.absent }, o = wi(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const Jr = "review";
function su(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function cu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function $r(e, t) {
  const n = new Set(su(e));
  return t.filter((r) => n.has(r.id));
}
function os(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of $r(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(Jr, () => ({
        key: Jr,
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
    ...i.filter((s) => s.key === Jr),
    ...i.filter((s) => s.key !== Jr)
  ];
}
function Go(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function vi(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => Go(s.key, s.members, o) && !(c > i && Go(o.key, o.members, s))
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
function lu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Go(n.key, n.tagIds ?? [], e)
  );
}
function Sc(...e) {
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
    ...n.filter((r) => r.key === Jr),
    ...n.filter((r) => r.key !== Jr)
  ];
}
function du(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function kc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = du(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function uu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => kc(o, r, n))
  );
}
function fu(e, t, n) {
  return t.filter((r) => r.tagIds !== null && kc(e, r, n));
}
function pu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function Ni(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [pu(e.mixed)] : []
  ];
}
function hu(e) {
  const t = Ni(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function mu(e, t, n) {
  const r = $r(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Vo = "-", is = "Ctrl+a", gu = "Ctrl/⌘A", bu = ["f", "g", "k", "n", "m", ",", "."], Ao = "Shift+", Ec = {
  ",": [";", "<"],
  ".": [":", ">"]
}, yu = new Set(Object.values(Ec).flat()), ss = { Comma: ",", Period: "." };
function wu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(ss, t.code) ? ss[t.code] : void 0;
}
function Zr(e) {
  return Ne(() => tc(e), [e]);
}
function qi({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = Zr(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  Tt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = or.filter(
    (h) => s.actionOn.has(h) || bu.includes(h)
  ).join(" "), p = Ne(() => {
    const h = (N, v) => {
      var k, O;
      const w = c.current;
      if (N === is) (k = w.onSelectAll) == null || k.call(w);
      else if (N === Vo) (O = w.onFind) == null || O.call(w);
      else {
        const x = yu.has(N), B = x || N.startsWith(Ao), C = x ? wu(v) : B ? N.slice(Ao.length) : N, D = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        D !== void 0 && w.onAction(D, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(is, "local")), l && y.push(g(Vo));
    for (const N of d ? d.split(" ") : []) {
      const v = Ec[N];
      y.push(g(N), ...(v ?? [`${Ao}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, d, l, f]);
  Gl(p, t);
}
const vu = {
  find: Vo,
  selectAll: gu
};
function Si() {
  return vu;
}
const Nu = 600 * 1e3, ki = /* @__PURE__ */ new Map(), Ac = /* @__PURE__ */ new Map(), rr = /* @__PURE__ */ new Map();
function Cc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Ac.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Tc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Ac.set(e.tagGroupId, e.tagGroupSortOrder), ki.set(e.id, { tag: e, at: Date.now() });
}
function Ic(e) {
  const t = ki.get(e);
  if (!(!t || Date.now() - t.at > Nu))
    return Cc(t.tag);
}
function $c(e) {
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
function zo(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Tc($c({ ...n, name: r }));
  }
}
function qu(e) {
  const t = rr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: we(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var d, p;
        const i = ((d = o == null ? void 0 : o.name) == null ? void 0 : d.trim()) || null;
        if (rr.get(e) === r && rr.delete(e), !i) return null;
        const s = $c({ ...o, id: e, name: i }), c = (p = ki.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Tc(f), Cc(f);
      },
      () => (rr.get(e) === r && rr.delete(e), null)
    )
  };
  return rr.set(e, r), r;
}
function cs() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Co(e) {
  const t = {};
  for (const n of e) {
    const r = Ic(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Su(e, t) {
  if (t != null && t.aborted) return Promise.reject(cs());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = Ic(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = qu(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && rr.get(f) === d && (rr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), i(cs()));
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
function Rc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ia(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = T(() => ({
    key: t,
    tags: Co(To(t))
  }));
  return ee(() => {
    const o = To(t), i = Co(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return Su(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Co(To(t));
}
function ea(e) {
  const t = Ia(e);
  return Ne(() => Rc(t), [t]);
}
function To(e) {
  return e ? e.split(",").map(Number) : [];
}
const ku = "(max-width: 760px)";
function Oc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Rn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return ri(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function $a() {
  return Oc(ku);
}
function Eu(e, t, n = !1) {
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
function Lr(e, t, n = [], r) {
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
  const o = dr(e), i = (s) => o.has(s) || [...o].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => Eu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function uo(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Ei({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = $a(), [f, d] = T(""), [p, h] = T(0), g = $(null), y = $(null), N = $(null), v = $(null), w = $(null), k = $(/* @__PURE__ */ new Set()), O = at(), x = ea(Ne(() => uo(e), [e])), B = Zr(e), C = Ne(() => {
    const j = f.trim().toLocaleLowerCase(), V = (M) => M ? or.indexOf(M) : or.length;
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
    !j || r != null && r(j.action) || s(j.action, o && V);
  }
  function J(j) {
    var M;
    j.stopPropagation();
    const V = j.code || j.key;
    if (j.repeat || k.current.add(V), !un(j)) {
      if (j.repeat && !k.current.has(V)) {
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
            /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
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
                  onClick: (M) => ne(j, M.shiftKey || i && nc(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(me, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ga(j.key) ? !0 : void 0, children: j.key }),
                      ga(j.key) && /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ga(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Lr(j.action, x, t, n).map(
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
function Mc() {
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
function Ai(e) {
  return ri(e.subscribe, e.get, e.get);
}
function Fc(e, t) {
  const n = $(t);
  Tt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function xc(e, t) {
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
const Au = [], Jo = so.map(
  (e, t) => ({ indent: t, keys: e })
), ls = Jo.length - 1;
function St({ binding: e, hidden: t }) {
  const n = t ? void 0 : ga(e), r = /* @__PURE__ */ a(
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
function Ba(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Pc(e) {
  return so.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Lc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(me, { children: r.map((o, i) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === r.length - 1 && n
  ] }, i)) });
}
function Dc({
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
          /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
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
function Cu({
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
                /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
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
          o.key
        );
      })
    }
  );
}
function Tu({ checked: e, onChange: t }) {
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
function Iu({
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
  attention: p = Au,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = Si(), N = Zr(e), v = $a();
  Fc(i, v);
  const w = at(), k = ea(
    Ne(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), O = Jo.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), x = O.includes(Jo[ls]), B = e.length - N.actionOn.size, C = Ne(
    () => d && !f ? xr(e) : [],
    [d, f, e]
  ), D = Ne(
    () => C.length && r ? Bo(e, r) : null,
    [C, e, r]
  ), P = new Map(
    Ko(D ?? []).flatMap(
      (S) => S.actions.filter((ce) => qc(e[ce])).map((ce) => [ce, S.name])
    )
  ), ne = Ne(
    () => e.map((S) => f ? [] : fu(S, p, o)),
    [e, p, o, f]
  ), J = (S) => S.map(hu).join("; "), j = ne.map(J), V = C.length > 0 && /* @__PURE__ */ a(
    Cu,
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
    const ce = Lr(e[S], k, [], o).map((de) => de.text).join(", "), A = P.get(S), Y = j[S];
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
        children: /* @__PURE__ */ a(Un, {})
      }
    )
  ) : null, L = (S) => ({
    onMouseEnter: () => i.set(S),
    onMouseLeave: () => i.clear(S),
    onFocus: () => i.set(S),
    onBlur: () => i.clear(S)
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
            Ba(A) && " ",
            Ba(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(ce)
          ]
        }
      )
    ] }, S);
  }, Q = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Wr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Pc(N), ce = (A) => {
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
            i.clear(Y), s(Y, pe.shiftKey || h && nc(Y));
          },
          ...f ? {} : xc(i, Y),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Y.label }),
            Ba(Y) && " ",
            Ba(Y) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
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
              ds,
              {
                actions: e,
                keyMap: N,
                names: k,
                tags: r,
                trees: o,
                preview: i,
                findKey: y.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(Tu, { checked: h, onChange: g })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Lc,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Dc,
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
            ds,
            {
              actions: e,
              keyMap: N,
              names: k,
              tags: r,
              trees: o,
              preview: i,
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
          S.indent === ls && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
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
                  /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
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
function ds({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const l = Ai(i), f = l ? e.indexOf(l) : -1;
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
  const d = t.keys[f], p = r && l.steps.length ? wi(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(St, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Lr(l, n, [], o).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function _c({
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
  const y = Si(), N = Zr(e), v = $a(), w = at(), k = ea(Ne(() => uo(e), [e])), [O] = T(() => Mc());
  Fc(O, v);
  const x = $(null), B = $u(x, e, !v), C = Pc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), P = e.length - D.length, ne = (M) => Lr(M, k, t, n).map((_) => _.text).join(", "), J = (M) => ({
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
          O.clear(_), i(_);
        },
        ...g ? {} : xc(O, _),
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
                Lc,
                {
                  groups: C,
                  renderAction: V,
                  find: /* @__PURE__ */ a(
                    Dc,
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
                      onClick: () => i(W),
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
                      /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Wr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Ru,
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
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: ne(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function $u(e, t, n) {
  const [r, o] = T(!1);
  return Tt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, g = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((P) => P.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (D) => y.map((P) => {
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
function Ru({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = Ai(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(St, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Lr(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const us = 1e3;
async function Ou(e, t, n) {
  const r = await we(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await we(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Kn({
            findFilter: {
              page: l,
              perPage: us,
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
    if (l * us >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = _e(e), c = Ae(e) ? await Fu(
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
function Mu(e) {
  return JSON.stringify(
    Kn({
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
async function Fu(e, t, n) {
  const r = new Array(t.length).fill(0), o = new AbortController(), i = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && i(), n == null || n.addEventListener("abort", i, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !o.signal.aborted; ) {
            const c = s++;
            r[c] = (await we(
              `/api/${ur(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Mu(t[c])
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
function xu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Pu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Lu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of dr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Du(e, t, n) {
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
function _u(e, t) {
  var r;
  const n = qt(e);
  return ((r = xr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const ju = (e) => e instanceof Error ? e.message : "Request failed.";
function Uu({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), g = $(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const y = Gn(_e(t)), N = Ae(t), v = N ? "performer" : y.one;
  function w(M) {
    var L;
    (L = g.current.get(M)) == null || L.abort();
    const _ = new AbortController();
    g.current.set(M, _), l((W) => ({ ...W, [M]: { status: "loading" } })), Ou(t, M, _.signal).then(
      (W) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "ready", group: W }
        }));
      },
      (W) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "failed", message: ju(W) }
        }));
      }
    );
  }
  function k(M) {
    var ae;
    const _ = i.filter((H) => !M.includes(H));
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
    for (const H of M) i.includes(H) || w(H);
  }
  const O = i.flatMap((M) => {
    const _ = c[M];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), x = O.length === i.length, B = i.some(
    (M) => {
      var _;
      return (((_ = c[M]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    xu(O).map((M) => [M.parent.id, M])
  ), D = Pu(O), P = new Map(O.map((M) => [M.parent.id, M.parent.name])), ne = Lu(t.actions), J = (M) => f[M] ?? !ne.has(M), j = x ? [...C.values()].flatMap((M) => {
    const _ = _u(M.parent.name, t.actions);
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
      cr,
      {
        entityType: "tag",
        values: i,
        onChange: k,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((M) => {
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
              ({ child: M, answerGroup: _ }) => Du(
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
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Bu(e, t, n, r) {
  const o = qt(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: qt(c) === o });
    return i;
  }
  const s = qt(r);
  for (const c of t)
    qt(c).includes(s) && i.push({ kind: "group", name: c, selected: qt(c) === o });
  return s && !t.some((c) => qt(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Ku(e) {
  return e.kind === "group" ? `group:${qt(e.name)}` : e.kind;
}
function Gu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Vu = /* @__PURE__ */ new Set([
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
]), zu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ka = 4, fs = 240;
function Ju(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Hu(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Qu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), y = $(!1), N = $(!1), [v, w] = T(!1), [k, O] = T(null), [x, B] = T(null), [C, D] = T(!1), P = e.group ?? "", ne = Ne(
    () => Bu(t, n, P, k),
    [t, n, P, k]
  ), J = ne.map(Ku), j = x === null ? -1 : J.indexOf(x), V = (A) => `${s}-option-${A}`, M = (A) => o(A ? { ...e, group: A } : Gu(e)), _ = () => {
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
    A.kind === "group" && A.selected && k === null || M(A.kind === "none" ? "" : A.name), Q();
  }
  function H() {
    const A = f.current, Y = p.current;
    if (!A || !Y) return;
    const de = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Ee = (pe ? pe.offsetTop + pe.height : window.innerHeight) - de.bottom - Ka, ke = de.top - G - Ka, ve = Math.min(Y.scrollHeight, fs), He = Ee < ve && ke > Ee;
    Y.style.left = `${de.left}px`, Y.style.width = `${de.width}px`, Y.style.top = `${He ? de.top - Ka : de.bottom + Ka}px`, Y.style.transform = He ? "translateY(-100%)" : "", Y.style.maxHeight = `${Math.max(0, Math.min(fs, He ? ke : Ee))}px`, Hu(A, Y, de, g.current) || Q();
  }
  Tt(() => {
    var A;
    v && (f.current && (g.current = Ju(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
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
    if (un(A)) return;
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
        const de = A.key === "ArrowDown" ? 1 : -1, pe = k !== null && qt(k) && J.length > 1 ? 1 : 0, G = j < 0 ? de > 0 ? pe : J.length - 1 : (j + de + J.length) % J.length;
        B(J[G]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? ae(ne[j]) : (_(), Q()));
  }
  function ce(A) {
    var de;
    if (A.key === "Tab") {
      Q(), A.shiftKey && ((de = d.current) == null || de.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || un(A) && !zu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = d.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Vu.has(A.key) && !un(A) && D(!1), S(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || un(A) || (A.preventDefault(), A.stopPropagation(), Q());
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
                children: /* @__PURE__ */ a(ii, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && bd(
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
                    A.kind === "new" && /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Xr, { className: "dq-combobox-check", "aria-hidden": "true" })
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
const nr = [
  ...so,
  ["auto", ir]
];
function jc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : fi(e[n]);
}
function Wu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = T(!1), c = $(null), l = n.keys[t], f = jc(e, n, t), d = Or(f), p = n.duplicatePins.has(t) ? ` (${va(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${va(l)}, ${d ? "pinned" : "Auto"}${p}` : f === ir ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
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
        "aria-expanded": i,
        title: "Choose the key",
        onClick: () => s(!i),
        children: [
          l ? /* @__PURE__ */ a(St, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Gs, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      Yu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          o(y), g();
        },
        onClose: g
      }
    )
  ] });
}
function Yu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], l = jc(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Tt(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Or(N) && d(N), (v = p(N)) == null || v.focus();
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
    const v = (P = N.target.dataset) == null ? void 0 : P.choice, w = v ? nr.findIndex((ne) => ne.includes(v)) : -1;
    if (!v || w < 0) return;
    const k = nr[w].indexOf(v), O = (ne) => ne == null ? void 0 : ne[Math.min(k, ne.length - 1)], x = {
      ArrowLeft: nr[w][k - 1],
      ArrowRight: nr[w][k + 1],
      ArrowUp: O(nr[w - 1]),
      ArrowDown: O(nr[w + 1]),
      Home: nr[w][0],
      End: nr[w].at(-1)
    };
    if (!Object.hasOwn(x, N.key)) return;
    N.preventDefault();
    const B = x[N.key];
    B && h(B);
  }
  const y = (N) => {
    const v = Or(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: fi(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(me, { children: [
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: so.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const k = y(w), O = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${va(w)}: ${O}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => o(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(St, { binding: w }),
                    (k == null ? void 0 : k.pinned) && /* @__PURE__ */ a(Gs, { "aria-hidden": "true" })
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
                "data-choice": ir,
                tabIndex: 0,
                "aria-pressed": l === ir,
                onClick: () => o(ir),
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
const Xu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Zu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function ef(e, t) {
  if (Bn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (pi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Uc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function tf(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function nf({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const l = Le(e), f = l !== "tag", d = e.actions, p = Zr(d), h = ea(Ne(() => uo(d), [d])), g = Ne(
    () => f ? xr(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === i), N = Ne(
    () => f && y >= 0 ? xr(
      d.filter((G, be) => be !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = Ne(
    () => new Set(
      v ? ou(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [k, O] = T(""), [x, B] = T(!1), [C, D] = T(
    null
  ), P = at(), ne = `${P}-from-tags`, J = $(null), j = $(null), V = $(null), M = $(null), _ = $(/* @__PURE__ */ new WeakMap()), L = (G) => {
    let be = _.current.get(G);
    return be || (be = crypto.randomUUID(), _.current.set(G, be)), be;
  }, W = k.trim().toLocaleLowerCase(), Q = W ? d.filter((G) => G.label.toLocaleLowerCase().includes(W)) : d, ae = (G) => t({ ...e, actions: G }), H = (G, be) => ae(d.map((Ee, ke) => ke === G ? be : Ee));
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
    !c || !i || (Q.some((G) => G.id === i) ? ce(i, "label") : (O(""), M.current = { id: i, part: "label" }));
  }, [c]);
  function A() {
    const G = tf(l);
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
    ae(d.filter((ve, He) => He !== G)), i === be.id && s(null), M.current = ke ? { id: ke.id, part: "toggle" } : "add";
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
              /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: k,
              onChange: (G) => O(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && k && !un(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
          G.key !== "Escape" || G.defaultPrevented || un(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          Uu,
          {
            id: ne,
            review: e,
            disabled: o,
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
      Ds,
      {
        items: Q,
        getKey: (G) => G.id,
        disabled: o || !!W,
        className: "dq-action-list",
        onReorder: (G) => ae(G),
        renderItem: (G, { dragHandleProps: be, isOver: Ee }) => {
          const ke = d.indexOf(G), ve = i === G.id;
          return /* @__PURE__ */ a(
            rf,
            {
              action: G,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Wu,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (He) => ae(vd(d, ke, He))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(qt(G.group)),
              effect: Lr(G, h, n, r),
              open: ve,
              detailId: `${P}-detail-${G.id}`,
              dragHandleProps: be,
              isOver: Ee,
              reorderDisabled: o || !!W,
              onToggle: () => s(ve ? null : G.id),
              onDuplicate: () => Y(ke),
              onDelete: () => de(ke),
              children: "steps" in G ? /* @__PURE__ */ a(
                af,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ae(e),
                  saving: o,
                  stepKey: L,
                  rememberStepKey: (He, fe) => _.current.set(He, L(fe)),
                  onChange: (He) => H(ke, He)
                }
              ) : /* @__PURE__ */ a(
                sf,
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
      k.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function rf({
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
  children: y
}) {
  const N = e.label.trim() || "New action", v = ef(e, t), w = "steps" in e && qt(e.group) ? e.group.trim() : "";
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
              style: Uc(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(Vs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: i.map((k, O) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${va(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                  `${va(r)} is pinned twice`
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(zs, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(ii, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Bc({
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
function af({
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
  Tt(() => {
    var g, y;
    const h = d.current;
    h != null && (d.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(Bc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Qu,
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
          Ds,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              of,
              {
                step: h,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: o,
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
              /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function of({
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
      "data-step-tone": Zu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Uc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(Vs, { "aria-hidden": "true" }),
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
            children: Xu.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          cr,
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
            children: /* @__PURE__ */ a(Ea, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function sf({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(Bc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const Kc = Bl(!1);
function cf({ children: e }) {
  return /* @__PURE__ */ a(Kc.Provider, { value: !0, children: e });
}
function Xt({ tag: e, name: t }) {
  const n = Kl(Kc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Vl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function lf({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Gn(_e(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      cr,
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
function df({
  review: e,
  onChange: t
}) {
  const n = Gn(_e(e)).many, r = e.occurrence, o = Zs(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ia([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: yd(r, d) }), f = (d, p) => l(
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
        (v, w) => w !== p && v.tagId === d.tagId
      ), y = (v) => g.some((w) => w.categoryTagId === v), N = `${d.tagId}#${o.slice(0, p).filter((v) => v.tagId === d.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Xt, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Ji,
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
            onClick: () => l(o.filter((v, w) => w !== p)),
            children: /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
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
                  disabled: y(void 0),
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
      Ji,
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
const Gc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Vc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, uf = {
  video: io,
  audio: Qs,
  tag: Hs,
  performerOccurrence: Js,
  audioPerformerOccurrence: nd
};
function zc({ entityType: e }) {
  const t = uf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Gc[e] });
}
const ff = 2e6;
function Jc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function pf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Ci(e) {
  Jc([e], pf(e));
}
async function hf(e) {
  if (e.size > ff) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ca(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Qr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function Hc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: o,
  autoFocus: i = !1
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
          children: ec.map((s) => /* @__PURE__ */ a("option", { value: s, children: Vc[s] }, s))
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
function mf(e, t) {
  const n = Le(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function gf({
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
function Qc({
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
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => Ae(e) && e.occurrence.tagIds.length > 0
  ), [k, O] = T(""), [x, B] = T(null), [C, D] = T(0), [P, ne] = T(!1), J = $(null), j = $(null), V = $(null), M = mf(e, w), _ = Le(e), L = Ne(() => Qr(e), [e]);
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
    const H = { ...e, name: e.name.trim() }, S = Na(H);
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
      (A) => !Bn(A, _)
    );
    ce && (v("Actions"), B(ce.id), D((A) => A + 1));
  }
  const ae = k || l;
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
          H.key !== "Escape" || H.defaultPrevented || s || un(H) || (H.preventDefault(), H.stopPropagation(), W());
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
                children: /* @__PURE__ */ a(Ea, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            zl,
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
                    Hc,
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
                  Ae(e) && /* @__PURE__ */ a(df, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Ci(e),
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
                children: /* @__PURE__ */ a(bf, { review: e, onChange: t })
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
                  nf,
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
            w && Ae(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(lf, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ae || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            ae && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
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
      gf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), g();
        }
      }
    )
  ] });
}
function bf({
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
        ps,
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
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          hs,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(wf, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          hs,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(vf, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        ps,
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
            cr,
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
        cr,
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
      yf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function yf({
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
            children: /* @__PURE__ */ a(oo, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || un(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          _s,
          {
            open: !0,
            onClose: () => o(null),
            criteria: ao,
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
function ps({
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
function hs({
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
function wf() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function vf() {
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
const Ho = "The queue differs from the saved review.";
function Wc({
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
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = $(null);
  Ef(v);
  const w = Af(v), [k, O] = T({ differs: h, text: "" });
  return k.differs !== h && O({
    differs: h,
    text: h ? k.differs === !1 ? Ho : k.text : ""
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
          children: /* @__PURE__ */ a(Aa, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Gc[n], children: /* @__PURE__ */ a(zc, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(Wr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(Nf, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function Nf({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), o = `${Ho} Save these filters to the review.`, i = e.onSave ? `${Ho} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(me, { children: [
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
          /* @__PURE__ */ a(od, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(id, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const qf = ["queue", "summary", "name", "layout", "range"], Sf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, kf = "(min-width: 1400px)";
function Ja(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function ms(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = qf.filter(
    (i) => e.querySelector(Sf[i])
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
function Ef(e) {
  const t = Oc(kf), [n, r] = T(0), o = $(!1);
  Tt(() => {
    e.current && (o.current = !ms(e.current, t));
  }, [e, t, n]), Tt(() => {
    const i = e.current;
    i && t && !o.current && !Ja(i) && (o.current = !ms(i, t));
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
function Af(e) {
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
function Yc({
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
        children: /* @__PURE__ */ a(Aa, { "aria-hidden": "true" })
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
          un(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(Ws, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Xc({
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
          /* @__PURE__ */ a(ad, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(si, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Cf({
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
function Ti({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = T(!1), [i, s] = T(!1), c = $(null), l = $(null), f = at();
  Tt(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = l.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < g && h.top > y);
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
        onClick: () => o((h) => !h),
        children: /* @__PURE__ */ a(rd, { "aria-hidden": "true" })
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
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(ai, { children: [
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
function no(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Ii(e) {
  return String(e.type).toLowerCase() === "tag";
}
function $i(e) {
  return !!String(e ?? "").trim();
}
function Ri(e) {
  return [
    ...new Set(
      no(e.customFieldCriteria).filter(Ii).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !$i(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Oi(e, t) {
  const n = no(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!Ii(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !$i(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function Zc(e, t, n) {
  const r = no(e.customFieldCriteria);
  if (!r.length) return e;
  const o = no(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!Ii(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(l[p] ?? "")];
      g && l[h] === g && !$i(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Tf(e, t, n) {
  if (!Bn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), o = n.steps.some((c) => jn(c.mode)) ? await Zd(r) : "", i = await bi(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !jn(l.mode)),
    ...i.filter((l) => jn(l.mode))
  ]) {
    const l = (f) => eu(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await rl(
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
async function Mi(e, t) {
  const n = e.occurrence;
  if (di(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await we("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Kn({
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
function el(e) {
  return wa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Fi(e, t) {
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
  }, s = el(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
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
                      key: co,
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
async function xi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => lo([n], t))
  );
}
function tl(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function If(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function $f(e, t, n, r, o) {
  if (!el(e)) return !1;
  const i = mc(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((l) => r.includes(l))
  );
}
async function nl(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || tl(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = _e(e), i = await zr(
    Fi(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await xi(c, r) : [], f = new Array(i.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; d < i.items.length; ) {
        const p = d++, h = i.items[p], g = await we(
          `/api/tagapplications?hostType=${o}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === o && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return If(e.occurrence, v, l) && !$f(c, h, y.id, v, l) ? [
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
  ), { items: f.flat(), totalCount: i.totalCount };
}
async function rl(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = _e(e), i = await eo(o, t.media.id);
  if (!i.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await we(s)).filter(
    (f) => f.hostType === o && f.hostId === i.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await we("/api/tagapplications", {
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
function Yr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Rf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function vn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? mc(
      await eo(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await we(Rf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return zo(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await eo(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  zo(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === Za
  ) ?? Za, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
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
async function Pi(e, t, n) {
  if (t.occurrence && Ae(e))
    await rl(
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
      o.length && await we(
        `/api/${ur(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Of(e, t, n) {
  t.occurrence && Ae(e) ? await Tf(e, t.occurrence, n) : await gc(_e(e), n, [t.media.id]);
}
function Qo(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Yr(o(t.ids), o(n.ids)),
    absence: Yr(o(t.absent), o(n.absent))
  };
}
function Mf(e, t) {
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
class al extends Error {
}
const Wo = (e) => e instanceof Error ? e.message : "Request failed.", gs = (e) => [...e].sort((t, n) => t - n), qa = (e, t) => JSON.stringify(gs(e)) === JSON.stringify(gs(t)), Yo = (e) => !!(e.tags.added.length || e.tags.removed.length);
function ro(e, t, n, r) {
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
function Ff(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function xf(e, t, n, r) {
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
      l = (await we(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new al(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Pf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Bn(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = wa(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await xi(o.occurrence, n) : [];
  await xf(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await bi(h, n)
    }))
  ), l = structuredClone(Ff(c));
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
  const d = await Mi(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await nl(o, d, h, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = ro(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: qa(N.ids, v.desired) ? "unchanged" : "pending"
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
function Lf(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!qa(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return qa(o(e), o(t));
}
async function ol(e, t, n, r) {
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
function il(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function sl(e) {
  return e.entries.filter((t) => t.operation);
}
async function Df(e, t, n, r, o = !1) {
  await ol(
    il(e, o),
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
        if (s = await vn(_e(e.review), i.item, !1), !Lf(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = Wo(h);
        return;
      }
      const c = ro(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Yr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Pi(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await vn(_e(e.review), i.item, !1);
        p = !0, i.expected = h;
        const g = Qo(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = Yo(g) ? g : void 0, d) throw d;
        if (!qa(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = Wo(h), !p)
          try {
            const g = await vn(_e(e.review), i.item, !1);
            i.expected = g;
            const y = Qo(
              i.item,
              i.before,
              g,
              e.touched
            );
            i.operation = Yo(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function _f(e, t, n) {
  await ol(
    sl(e),
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
        const c = await vn(_e(e.review), r.item, !1);
        Mf(o, c), s = !0, await Pi(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await vn(_e(e.review), r.item, !1);
        if (!qa(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Wo(c)}`, r.status = "failed", s)
          try {
            const l = await vn(_e(e.review), r.item, !1), f = Qo(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = Yo(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const cl = (e, t) => t.count - e.count || bc(e, t);
async function jf(e, t, n) {
  const r = _e(e), o = e.occurrence, [i, s] = await Promise.all([
    we(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    xi(o, n)
  ]), c = i.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  zo(c.map((y) => y.tag));
  const l = await Promise.all(
    s.map(async (y, N) => {
      const v = o.conditionTagIds[N];
      return (await we(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...o.tagIds
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
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(cl);
  }, h = s.map((y, N) => ({
    id: o.conditionTagIds[N],
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
function Uf(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...o].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...dr(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function Li(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const o = (g) => g.flatMap((y) => r.get(y) ?? []).sort(cl), i = (g) => g.members ?? g.tags.map((y) => y.id), s = xr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...dr(t[N])]))
    ];
    return y.length ? [{ ...g, answers: y, tags: o(y) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], l = e.groups.filter((g) => g.id !== null).map((g) => {
    const y = `tag:${g.id}`, N = i(g), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: Uf(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
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
    members: i(p).filter((g) => !d.has(g)),
    tags: h,
    mixed: []
  }), l;
}
const Io = { summary: null, error: "" };
function ll(e, t, n = 0) {
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
    value: Io
  });
  return ee(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Io }), e === null || t === null) return;
    const c = new AbortController();
    return jf(e, t, c.signal).then((l) => {
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
  }, [o, n]), i.key === o ? i.value : Io;
}
function Bf(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = lu(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => o.add(h.name));
  }
  const i = qt(e.name), s = [...r].filter((f) => qt(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function Kf(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function Xo({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = Uo,
  flags: i = [],
  className: s = ""
}) {
  const c = Gn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Li(e, r, o) : [], d = vi(f), p = (h) => [
    ...new Set(
      i.filter((g) => {
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
          const g = h.kind === "other" ? [] : p(h.members), y = Bf(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Kf(h, y),
                  children: [
                    /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Xt, { tag: v }),
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
function Hr({
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
const bs = 5;
function Gf(e, t) {
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
const ys = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Zo = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], ws = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Vf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, $o = 250;
function ma(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function zf({ step: e }) {
  const t = Zo.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Zo.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(Xr, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function vs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(ai, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function ha({
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
        n && /* @__PURE__ */ u(me, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Ns({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Mr(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Xt, { tag: o })
    ] }) }, `added-${o.id}`)),
    Mr(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(Xt, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function qs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > $o && /* @__PURE__ */ u("span", { children: [
        "First ",
        $o.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, $o).map((i) => {
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
                ma(i, n)
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
function Jf(e) {
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
function Hf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [k, O] = T(!1), [x, B] = T(""), [C, D] = T(!1), [P, ne] = T(""), [J, j] = T(null), [V, M] = T(null), [_, L] = T([]), [W, Q] = T(0), ae = $(null), H = $(null), S = $(null), ce = $(!1), A = $(!1), Y = $(null), de = $(!1), pe = $(!1), G = $({ onClose: i });
  G.current = { onClose: i };
  const be = at(), Ee = l === "run", ke = (J == null ? void 0 : J.kind) === "undo", ve = Ee && d ? d.review : e, He = Zr(ve.actions), fe = ve.occurrence, ot = _e(ve), We = Gn(ot), Pt = We.queue, Zt = Ee && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !sr(I))
  ), Vt = Zt.filter((I) => y.includes(I.id)), et = fe.targetMode === "selected" && fe.performerIds.length === 1, Be = ll(
    ve,
    s && et ? fe.performerIds[0] : null,
    W
  ), Ke = Ri(ve.view.objectFilter), Ye = Ia(
    s ? [...uo(Zt), ...fe.conditionTagIds, ...Ke] : []
  ), fr = Ne(() => Rc(Ye), [Ye]), ht = (I) => h[I] ?? Ye[I] ?? { id: I, name: `Tag ${I}` }, Vn = JSON.stringify(
    Object.fromEntries(
      Ke.flatMap((I) => {
        var oe;
        const K = (oe = Ye[I]) == null ? void 0 : oe.name;
        return K ? [[String(I), K]] : [];
      })
    )
  ), tt = Ne(
    () => Oi(ve.view.objectFilter, JSON.parse(Vn)),
    [ve.view.objectFilter, Vn]
  );
  ee(() => {
    var I, K, oe;
    s && ((I = ae.current) == null || I.showModal(), (oe = (K = ae.current) == null ? void 0 : K.querySelector(".dq-batch-answer input")) == null || oe.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var qe;
      const K = ae.current, oe = document.activeElement;
      if (!K || oe && oe !== document.body && K.contains(oe)) return;
      (qe = (l === "answers" ? K.querySelector(".dq-batch-answer input:checked") ?? K.querySelector(".dq-batch-answer input") : K.querySelector("[data-batch-focus]")) ?? H.current) == null || qe.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, k, d]), ee(() => {
    if (s || t || !ce.current) return;
    const I = requestAnimationFrame(() => {
      const K = S.current;
      if (!ce.current || !K || K.disabled) return;
      ce.current = !1;
      const oe = document.activeElement;
      (!oe || oe === document.body) && K.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || fe.targetMode !== "selected") return;
    const I = new AbortController();
    return L([]), Gf(fe.performerIds.slice(0, bs), I.signal).then((K) => {
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
    if (!k) return;
    const I = (K) => {
      K.preventDefault(), K.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [k]);
  function Ce() {
    f("answers"), p(null), g({}), j(null), w(!1), N([]), ne(""), B(""), D(!1), M(null);
  }
  function Ge() {
    pe.current || (c(!1), G.current.onClose(de.current), de.current = !1, Ce(), ce.current = !0);
  }
  function Ve(I, K) {
    N(
      (oe) => K ? [...oe, I] : oe.filter((ie) => ie !== I)
    ), p(null), g({}), ne(""), B(""), D(!1), M(null);
  }
  function It() {
    f("answers"), M(null), ne("");
  }
  function pr() {
    f("preview"), d || Mn();
  }
  function fn() {
    var I;
    A.current = !0, (I = Y.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function $t(I) {
    M(
      (K) => (K == null ? void 0 : K.group) === I.group && K.reason === I.reason ? null : I
    );
  }
  const mt = (I, K) => (V == null ? void 0 : V.group) === I && V.reason === K;
  async function Mn() {
    if (!Vt.length || pe.current) return;
    pe.current = !0, O(!0), B(""), D(!1), ne("Loading all matching occurrences…"), p(null), g({}), M(null);
    const I = new AbortController();
    Y.current = I;
    try {
      const K = await Pf(
        e,
        Vt,
        I.signal,
        (ie) => ne(`Loaded ${ie.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const oe = {};
      for (const ie of K.entries)
        for (const qe of ie.before.applications ?? [])
          oe[qe.tag.id] = qe.tag;
      g(oe), p(K), ne("Preview ready. No tags have been changed.");
    } catch (K) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : K instanceof Error ? K.message : String(K)
      ), D(!I.signal.aborted && K instanceof al), ne("");
    } finally {
      pe.current = !1, O(!1), Y.current = null;
    }
  }
  async function Nn(I) {
    if (!d || pe.current) return;
    const K = (I === "undo" ? sl(d) : il(d, I === "retry")).length;
    pe.current = !0, A.current = !1, de.current = !0, O(!0), f("run"), B(""), j({ kind: I, total: K, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const oe = () => j((qe) => qe && { ...qe, done: qe.done + 1 });
    let ie = !1;
    try {
      I === "undo" ? await _f(d, () => A.current, oe) : await Df(d, v, () => A.current, oe, I === "retry"), ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (qe) {
      ie = !0, ne(""), B(qe instanceof Error ? qe.message : String(qe));
    } finally {
      pe.current = !1;
      const qe = A.current || ie;
      j((Pe) => Pe && { ...Pe, stopped: qe }), O(!1), Q((Pe) => Pe + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], kt = Ne(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        ro(I.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), zt = (I) => kt.get(I.item.key), pn = (I) => Yr(I.before.ids, zt(I).desired), qn = (I) => {
    const K = pn(I);
    return I.status === "pending" && (K.added.length > 0 || K.removed.length > 0);
  }, ze = (I) => I.conflict || zt(I).kept.length > 0 || zt(I).replaced.length > 0, Et = Ne(() => {
    const I = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: I.filter(qn).length,
      correct: I.filter((K) => K.status === "unchanged").length,
      different: I.filter(ze).length,
      hosts: new Set(I.map((K) => K.item.media.id)).size,
      added: [...new Set(I.flatMap((K) => pn(K).added))],
      removed: [...new Set(I.flatMap((K) => pn(K).removed))]
    };
  }, [kt]), ue = Ne(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((I) => I.item.media.date).sort((I, K) => I.item.media.date.localeCompare(K.item.media.date)),
    [d]
  ), U = Ee ? Jf(he) : null, Fe = (I) => He.keys[ve.actions.findIndex((K) => K.id === I)] ?? "", gt = (I) => Lr(I, fr, [], r), Sn = wa(fe.condition) && fe.includeSubtags !== !1 && fe.conditionTagIds.length > 0, se = ue[0], Rt = ue.length > 1 ? ue[ue.length - 1] : void 0, Lt = (I) => `/${ot}/${I.item.media.id}`, zn = et ? _[0] : void 0, kn = Ne(
    () => n ? Sc(
      n,
      Be.summary ? vi(
        Li(Be.summary, ve.actions, r ?? Uo)
      ) : []
    ) : [],
    [n, Be.summary, ve.actions, r]
  ), En = uu(Vt, kn, r ?? Uo), hn = n ?? [], je = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: qn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ze }
  };
  function Qe() {
    const I = Vf[fe.condition], K = !!I && fe.conditionTagIds.length > 0, oe = fe.performerIds.slice(0, bs), ie = String(ve.view.filter.q ?? "").trim(), qe = fe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      di(fe) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : fe.targetMode === "selected" ? /* @__PURE__ */ u(me, { children: [
        oe.map((Pe, Te) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Hr, { performer: { id: Pe, name: _[Te] ?? "" } }),
          _[Te] ?? "…"
        ] }, Pe)),
        fe.performerIds.length > oe.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (fe.performerIds.length - oe.length).toLocaleString(),
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
              ya,
              {
                filter: {},
                objectFilter: fe.performerFilter,
                criteriaDefinitions: oi,
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
        K ? I : ci[fe.condition],
        K && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Mr(fe.conditionTagIds.map(ht)).map((Pe) => /* @__PURE__ */ a(Xt, { tag: Pe }, Pe.id)) })
      ] }),
      K && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: fe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      wa(fe.condition) && fe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: qe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          qe
        ] })
      ] }),
      ie && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        ie,
        "”"
      ] }),
      Object.keys(ve.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Pt} filters`,
          children: /* @__PURE__ */ a(
            ya,
            {
              filter: ve.view.filter,
              objectFilter: tt,
              criteriaDefinitions: ot === "audio" ? js : ao,
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
  function st(I, K, oe = !0) {
    if (!I.length) return null;
    const ie = /* @__PURE__ */ a("strong", { children: zn || "This performer" }), qe = oe ? `Check the earliest and latest ${We.many} before applying, or narrow the batch with a date filter.` : "", Pe = I.every((Te) => Te.tagIds === null && !Te.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Pe ? /* @__PURE__ */ u("p", { children: [
          ie,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Te) => Te.flags).join(", ") }),
          ".",
          " ",
          qe
        ] }) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("p", { children: [
            ie,
            " needs attention where the chosen answers apply.",
            qe && ` ${qe}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Te) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Te.tagIds === null ? "Whole review" : Te.name }),
            ":",
            " ",
            Ni(Te).join("; ")
          ] }, Te.key)) })
        ] }),
        K && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: Lt(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ma(se, ot),
            " · ",
            se.item.media.date
          ] }),
          Rt && /* @__PURE__ */ u("a", { href: Lt(Rt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ma(Rt, ot),
            " · ",
            Rt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function At() {
    const I = En.filter((oe) => oe.tagIds === null), K = En.filter((oe) => oe.tagIds !== null);
    return /* @__PURE__ */ u(me, { children: [
      Qe(),
      st(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${et ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Zt.map((oe, ie) => {
            const qe = Fe(oe.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(oe.id),
                  "aria-labelledby": `${be}-answer-${ie}`,
                  "aria-describedby": `${be}-effect-${ie}`,
                  onChange: (Pe) => Ve(oe.id, Pe.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: qe && /* @__PURE__ */ a(St, { binding: qe, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${be}-answer-${ie}`,
                    className: "dq-batch-answer-label",
                    title: oe.label,
                    children: oe.label
                  }
                ),
                /* @__PURE__ */ a(vs, { id: `${be}-effect-${ie}`, parts: gt(oe) })
              ] })
            ] }, oe.id);
          }) })
        ] }),
        et && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: st(K, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Xo,
            {
              ...Be,
              mediaKind: ot,
              actions: ve.actions,
              trees: r,
              flags: hn,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Jn(I) {
    const K = Et, oe = V && ys.has(V.group) ? V.group : null, ie = oe ? he.filter(je[oe].test) : [], qe = (Pe) => {
      const Te = zt(Pe), Ie = Te.skipped ? Yr(
        Pe.before.ids,
        ro(Pe.before.ids, I.action, I.categories, !0).desired
      ) : pn(Pe), Ot = !Ie.added.length && !Ie.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Te.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ot ? !Te.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(Ns, { added: Ie.added, removed: Ie.removed, tag: ht }),
        Te.kept.map((ge, ct) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Mr(ge.existing.map(ht)).map((Se) => /* @__PURE__ */ a(Xt, { tag: Se }, Se.id)),
          " ",
          "instead of",
          " ",
          Mr(ge.tagIds.map(ht)).map((Se) => /* @__PURE__ */ a(Xt, { tag: Se }, Se.id))
        ] }, ct))
      ] });
    };
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            ha,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${K.hosts.toLocaleString()} ${K.hosts === 1 ? Pt : `${Pt}s`}`,
              pressed: mt("matching"),
              onToggle: () => $t({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            ha,
            {
              value: K.willChange,
              label: "will change",
              tone: "add",
              pressed: mt("change"),
              onToggle: () => $t({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            ha,
            {
              value: K.correct,
              label: "already correct, no write",
              pressed: mt("correct"),
              onToggle: () => $t({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            ha,
            {
              value: K.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mt("different"),
              onToggle: () => $t({ group: "different" })
            }
          )
        ] }),
        ie.length > 0 ? /* @__PURE__ */ a(
          qs,
          {
            title: je[oe].title,
            entries: ie,
            mediaKind: ot,
            resultHeading: "Planned change",
            describe: qe
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: se ? `Dates ${se.item.media.date}${Rt ? ` to ${Rt.item.media.date}` : ""}` : "No dates" }),
          se && /* @__PURE__ */ a(
            "a",
            {
              href: Lt(se),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${We.one}, ${se.item.media.date}`,
              title: ma(se, ot),
              children: "Open earliest"
            }
          ),
          Rt && /* @__PURE__ */ a(
            "a",
            {
              href: Lt(Rt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${We.one}, ${Rt.item.media.date}`,
              title: ma(Rt, ot),
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
            Ns,
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
          Sn ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Hn() {
    return /* @__PURE__ */ u(me, { children: [
      Qe(),
      st(En, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${et ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${be}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${be}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: It, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Vt.map((I) => {
            const K = Fe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                K && /* @__PURE__ */ a(St, { binding: K, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(vs, { parts: gt(I) })
            ] }, I.id);
          }) })
        ] }),
        et && /* @__PURE__ */ a(
          Xo,
          {
            ...Be,
            mediaKind: ot,
            actions: ve.actions,
            trees: r,
            flags: hn,
            className: "dq-batch-card"
          }
        )
      ] }),
      k ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Jn(d)
    ] });
  }
  function en(I) {
    const K = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, oe = K.kind === "apply" ? he.length - I.counts.pending : K.done, ie = K.kind === "apply" ? he.length : K.total, qe = k ? K.kind === "undo" ? "Undoing batch…" : K.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : K.kind === "undo" ? K.stopped ? "Undo stopped" : "Undo finished" : K.stopped ? "Stopped" : "Finished", Pe = ie ? Math.round(oe / ie * 100) : 100, Te = V && !ys.has(V.group) ? V.group : null, Ie = (ge) => ws.find((ct) => ct.status === ge).label, Ot = Te ? he.filter(
      (ge) => ge.status === Te && (!V.reason || ge.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: qe }),
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
            children: /* @__PURE__ */ a("span", { style: { width: `${Pe}%` } })
          }
        ),
        !k && K.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
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
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ws.map((ge) => /* @__PURE__ */ a(
          ha,
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
          qs,
          {
            title: V.reason ? `${Ie(Te)}: ${V.reason}` : `${Ie(Te)} occurrences`,
            entries: Ot,
            mediaKind: ot,
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
            disabled: k,
            onClick: () => void Nn("undo"),
            children: [
              /* @__PURE__ */ a(sd, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? K.stopped || k ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Qn() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Vt.length,
        onClick: pr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: fn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Et.willChange,
        onClick: () => void Nn("apply"),
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
        onClick: () => void Mn(),
        children: "Preview again"
      },
      "again"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: fn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(ai, { children: [
      U.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void Nn("retry"), children: "Retry failed" }),
      U.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Nn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(cf, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Zt.length,
        onClick: () => {
          Ce(), o(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Hi, { "aria-hidden": "true" }),
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
            /* @__PURE__ */ a(Hi, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${be}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: k,
                onClick: Ge,
                children: /* @__PURE__ */ a(Ea, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(zf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: H,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Zo.find((I) => I.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  P && /* @__PURE__ */ a("p", { role: "status", children: P }),
                  x && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: x })
                ] }),
                l === "answers" ? At() : l === "preview" ? Hn() : en(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: k, onClick: It, children: [
              /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Ce, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Ge, children: "Close" }),
            Qn()
          ] })
        ]
      }
    )
  ] });
}
const dl = "data-quality.description-collapsed.v1";
function Qf() {
  try {
    return localStorage.getItem(dl) === "true";
  } catch {
    return !1;
  }
}
function Wf({
  details: e,
  label: t
}) {
  const [n, r] = T(Qf), o = Rn(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(dl, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Jl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Yf = (e) => "";
function Xf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = Yf,
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
          children: /* @__PURE__ */ a(cd, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: d.map((g) => {
      const y = `${g.count.toLocaleString()} matching ${g.count === 1 ? i.one : i.many}`, N = s(g.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${g.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === g.id ? "true" : void 0,
          disabled: o,
          onClick: () => c(g.id),
          children: [
            /* @__PURE__ */ a(Hr, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(Un, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Zf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], ep = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function tp(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Ga(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function np(e, t) {
  const n = di(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ga(r, "or")}`,
    includesAll: `has ${Ga(r, "and")}`,
    excludes: `has none of ${Ga(r, "or")}`,
    excludesAll: `missing ${Ga(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function rp({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = at(), h = ea(e.conditionTagIds), g = np(e, h);
  Tt(() => {
    const w = f.current;
    if (!i || !w) return;
    const k = () => l(tp(w));
    k(), window.addEventListener("resize", k);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), x = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of x) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", k), O == null || O.disconnect();
    };
  }, [i]), ee(() => {
    var k, O;
    if (!i) return;
    const w = (k = d.current) == null ? void 0 : k.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (O = d.current) == null || O.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || un(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const O = [...d.current.querySelectorAll(ep)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
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
        "aria-expanded": i,
        "aria-controls": i ? p : void 0,
        title: g,
        onClick: () => i ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Js, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(ii, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ u(me, { children: [
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Zf.map(({ mode: w, label: k }) => /* @__PURE__ */ a(
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
                cr,
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
                  ya,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: oi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(Wr, { "aria-hidden": "true" }),
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
                  children: li.map((w) => /* @__PURE__ */ a("option", { value: w, children: ci[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ a(
                  cr,
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
                  wa(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function ap(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function op(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Gd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await we(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Kn({
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
function ul(e, t, n) {
  const r = Fi(e, [t]);
  return uc(r, r.view.filter, n);
}
function fl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function ei(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function ip(e, t, n, r, o = {}) {
  const i = Ha(e), s = ap(e), c = tl(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await op(e, r),
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
    complete: !y && ei(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !ei(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await ul(e, N.id, r);
          v > 0 && fl(d, { ...N, count: v }), (y = o.onProgress) == null || y.call(o, g(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), g(!1);
}
function sp(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && fl(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: ei(e.candidates, e.cursor, o, e.limit)
  };
}
const ti = /* @__PURE__ */ new Map();
function cp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function pl(e, t) {
  const n = cp(t);
  return ti.set(e, n), n;
}
function lp(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || ti.has(e)) return;
    const r = new AbortController();
    return we(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = pl(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return ti.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Ro = { exports: {} }, Ss;
function dp() {
  return Ss || (Ss = 1, (function(e) {
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
          var p, h, g = {}, y = {}, N = "", v = "", w = "", k = 2, O = 3, x = 2, B = [], C = 0, D = 0, P;
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
                k--, k == 0 && (k = Math.pow(2, x), x++), delete y[w];
              } else
                for (h = g[w], p = 0; p < x; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              k--, k == 0 && (k = Math.pow(2, x), x++), g[v] = O++, w = String(N);
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
          var p = [], h = 4, g = 4, y = 3, N = "", v = [], w, k, O, x, B, C, D, P = { val: d(0), position: f, index: 1 };
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
          for (p[3] = D, k = D, v.push(D); ; ) {
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
  })(Ro)), Ro.exports;
}
var hl = dp();
function lr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => lr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && lr(n[s], r[s])
  );
}
function up(e) {
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
        async (p) => [p, await lo([p])]
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
function ml(e, t, n) {
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
function fp(e, t, n) {
  var s;
  const r = ml(e, t, n), o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [];
  return {
    performers: i.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: i.includes("tags") && ((s = o == null ? void 0 : o.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function pp({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: o,
  onToggle: i
}) {
  var y, N;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((v) => (r[v] ?? []).filter((w) => w !== v))
  ), l = s.every((v) => r[v]), f = Dr(
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
  const p = f.filter((v) => !d.has(v)), h = ea(p);
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
          disabled: o,
          onClick: () => i(v),
          children: [
            k && /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
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
function hp({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: o,
  countsPaused: i,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Dr(e.view.objectFilter, t, c).bins, f = mp(e, t, n, i);
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
              disabled: o,
              onClick: () => s(N.key),
              children: [
                v && /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
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
function mp(e, t, n, r) {
  var d;
  const [o, i] = T({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = $(null);
  return ee(() => {
    var y, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), g = Dr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (p++, uc(bl(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || i((k) => ({ ...k, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [l, r]), o;
}
function Rr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function gp(e) {
  if (!Rr(e) || Object.keys(e).length !== 1 || !Rr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Rr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function gl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function bp(e, t) {
  const n = t.find(
    (r) => lr(e, gl(r.filter))
  );
  return n ? n.key : gp(e);
}
function Dr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && lr(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Rr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = bp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !Rr(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && Rr(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && Rr(g.group) ? d = g.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function bl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = Dr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (i.includes(t) ? i.filter((d) => d !== t) : [...i.filter((d) => !c || s(d) !== c), t]).reduce(yp, { ...e, view: { ...e.view, objectFilter: o } });
}
function yp(e, t) {
  var i, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (i = e.presentation) == null ? void 0 : i.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = gl(c.filter);
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
const fo = [
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
], wp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Pr(e) {
  const t = Ae(e) ? e.occurrence : void 0;
  return {
    filter: Yt({
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
function ks(e) {
  return hl.compressToEncodedURIComponent(JSON.stringify(e));
}
function Es(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : hl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function ni(e, t) {
  let n;
  if (Ae(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!fo.some((c) => c !== "performer" && t.has(c))) {
    const c = Pr(e);
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
    ...wp,
    ...Es(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !li.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Yt(o, _e(e)),
      objectFilter: Es(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const As = { dataQualityOpenedFromList: !0 };
function yl() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function wl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...As }, "", e) : window.history.replaceState(yl() ? { ...As } : null, "", e);
}
function ba(e, t) {
  const n = new URLSearchParams(window.location.search);
  fo.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", ks(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", ks(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), wl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function On(e, t) {
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
function Fr(e) {
  const t = e;
  return On(t, Pr(t));
}
function Cs(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !lr(
    JSON.parse(ar(On(e, t))),
    JSON.parse(ar(On(e, Pr(e))))
  );
}
function Di(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Le(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function vl(e, t) {
  if (Le(e) !== "video") return e;
  const { base: n, bins: r } = Dr(
    e.view.objectFilter,
    t.view.objectFilter,
    Di(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Va(e, t) {
  if (Le(e) !== "video") return t;
  const { base: n, bins: r } = Dr(
    t.objectFilter,
    e.view.objectFilter,
    Di(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function Ts(e, t) {
  return !t || !Ae(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Oo(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const dn = (e) => e instanceof Error ? e.message : "Request failed.", vp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Mo = 50, Np = [], Is = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function qp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Wl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Ks(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Sp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Qs, {}) : /* @__PURE__ */ a(io, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: _o(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function kp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: o,
  actionTagIds: i,
  label: s
}) {
  const c = !!n && !r, l = Ai(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ia(
    Ne(() => [...i, ...d ?? []], [i, d])
  ), h = (J) => p[J] ?? { id: J, name: p[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => Mr(J.map(h)), y = f && e ? wi(f, e, o) : null, N = e ? au(e) : [], v = new Set(N.map((J) => J.id)), w = new Set(y == null ? void 0 : y.removed), k = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), x = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((J) => !v.has(J))), D = n ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Qa, { "aria-hidden": "true" }),
          O.has(J.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(Xt, { tag: J })
          ] }) : /* @__PURE__ */ a(Xt, { tag: J })
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
              /* @__PURE__ */ a(Xt, { tag: J })
            ] }),
            k.has(J.id) && x
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Xt, { tag: J }) }, J.id)
        ),
        B.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Xt, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Xt, { tag: J }) }),
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
function Ep({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    Ni(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Ap({
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
  var yn;
  const d = _e(e), p = Gn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || h;
  }, y = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = ni(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = dn(m), N.current = { query: Pr(e), startAtEnd: !1 };
    }
  const [w, k] = T(null), [O, x] = T(""), B = $(null), C = $(null), D = $(null), P = $(null), [ne, J] = T(!!v.current), j = $(0), [V, M] = T(N.current.query), _ = $(V);
  _.current = V;
  const [L, W] = T(0), Q = $(N.current.startAtEnd), [ae, H] = T([]), [S, ce] = T(null), A = $(null), [Y, de] = T(null), [pe, G] = T(0), be = Ne(() => {
    var X;
    if (!S) return null;
    const m = ae.findIndex((le) => le.key === S.key), E = ((X = A.current) == null ? void 0 : X.key) === S.key ? A.current : null;
    return (m >= 0 ? ae.slice(m + 1) : E ? ae.filter((le) => !E.before.includes(le.key)) : []).find((le) => le.media.id !== S.media.id) ?? null;
  }, [S, ae]), [Ee, ke] = T(0), [ve, He] = T(!1), [fe, ot] = T(!1), We = $(!1), Pt = $(0), Zt = $(!1), Vt = $(null), et = $(!0), Be = $(null);
  ee(() => (et.current = !0, () => {
    et.current = !1;
  }), []);
  const [Ke, Ye] = T(v.current), [fr, ht] = T(""), [Vn, tt] = T(""), [Ce, Ge] = T(null), [Ve, It] = T(!1), [pr, fn] = T([]), $t = $([]), mt = $(null), Mn = $(null), Nn = $(null);
  ee(() => {
    var m, E;
    Ve && ((E = (m = Nn.current) == null ? void 0 : m.querySelector("input")) == null || E.focus());
  }, [Ve]);
  const he = $(null);
  ee(() => {
    if (fe) return;
    const m = he.current;
    he.current = null;
    const E = document.activeElement;
    m != null && m.isConnected && (!E || E === document.body) && m.focus();
  }, [fe]);
  const [kt, zt] = T(!1), [pn, qn] = T(!1), ze = $a(), [Et, ue] = T(!1), U = l ?? Et, Fe = f ?? ue;
  ee(() => {
    if (ve || kt || !Mn.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(Is)) return;
      const E = Mn.current;
      Mn.current = null;
      const F = document.activeElement;
      F && F !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [ve, kt, L]);
  const [gt, Sn] = T([]), [se, Rt] = T({}), Lt = $(null), [zn, kn] = T({});
  ee(() => {
    let m = !0;
    return Promise.all(
      Ri(V.objectFilter).map(
        async (E) => [
          String(E),
          (await we(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      m && kn(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [V.objectFilter]);
  const En = Ne(
    () => Oi(V.objectFilter, zn),
    [zn, V.objectFilter]
  ), hn = $(0), je = $(e);
  je.current = e;
  const Qe = w ?? e, st = Ne(
    () => On(Qe, V),
    [Qe, V]
  ), At = Ne(
    () => Ts(st, V.performerFocus),
    [st, V.performerFocus]
  ), Jn = $(At);
  Jn.current = At;
  const Hn = $(st);
  Hn.current = st;
  const [en, Qn] = T("items"), [I, K] = T(null), oe = $(null), ie = $("");
  function qe(m) {
    const E = typeof m == "function" ? m(oe.current) : m;
    oe.current = E, K(E);
  }
  const [Pe, Te] = T(!1), [Ie, Ot] = T(null), ge = $(null), ct = Ae(st) ? Ha(st) : "", [Se, Fn] = T(0), [Re, hr] = T(null);
  ee(() => () => {
    var m;
    return (m = ge.current) == null ? void 0 : m.controller.abort();
  }, []), ee(() => {
    const m = ge.current;
    !m || m.signature === ct || (m.controller.abort(), ge.current = null, Te(!1));
  }, [ct]), ee(() => {
    var F;
    const m = oe.current;
    if (en !== "performers" || !ct || ((F = ge.current) == null ? void 0 : F.signature) === ct || ie.current === ct || (m == null ? void 0 : m.signature) === ct && m.complete)
      return;
    const E = (m == null ? void 0 : m.signature) === ct ? m : null;
    yr(m, (E == null ? void 0 : E.limit) ?? Mo);
  }, [en, ct, I, Ie, Pe]);
  const Jt = V.performerFocus;
  ee(() => {
    if (!Jt) {
      hr(null);
      return;
    }
    let m = !0;
    return we(`/api/performers/${Jt}`).then((E) => {
      const F = pl(Jt, E.tags);
      m && hr({ id: Jt, name: E.name, tags: F });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [Jt]);
  const ta = JSON.stringify(
    Ae(st) ? Zs(st.occurrence) : []
  ), Dt = Ne(() => JSON.parse(ta), [ta]), na = Ne(() => cu(Dt), [Dt]), Mt = wc(na), tn = Ia(na), mr = (m) => {
    var E;
    return ((E = tn[m]) == null ? void 0 : E.name) ?? (tn[m] === null ? "Unavailable tag" : "…");
  }, An = (m) => ({
    name: mr(m),
    tagIds: Mt.get(m) ?? [m],
    resolved: Mt.has(m)
  }), gr = ll(
    Ae(st) ? st : null,
    Jt ?? null,
    Se
  ), pt = Cs(e, V), bt = Cs(e, Va(e, V)), nt = fe || ve || Ve, it = Number(V.filter.page);
  function lt(m, E = !1) {
    We.current || (Pt.current++, ht(""), v.current = "", Q.current = E, _.current = m, M(m), ke(0), He(!0), E || ba(e.id, m), W((F) => F + 1));
  }
  function yt() {
    if (We.current = !1, ot(!1), et.current && Be.current) {
      const m = Be.current;
      Be.current = null, lt(m.query, m.startAtEnd);
    }
  }
  ee(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = ni(
            je.current,
            new URLSearchParams(window.location.search)
          );
          We.current ? Be.current = E : lt(E.query, E.startAtEnd);
        } catch (E) {
          Ye(dn(E));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), ee(() => (r(fe || ve || Ve || !!w), () => r(!1)), [fe, ve, Ve, !!w, r]);
  async function Wn(m, E, F) {
    if (Ae(m)) {
      const le = await nl(
        m,
        Lt.current,
        E,
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
    const X = await zr(
      m,
      { ...m.view.filter, page: E },
      F
    );
    return {
      items: X.items.map((le) => ({ key: String(le.id), media: le })),
      totalCount: X.totalCount
    };
  }
  function xn(m, E, F, X = !1, le = !1) {
    if (!et.current || Be.current) return;
    J(!0), H(
      le ? m.items : Oo(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), _t(F, X);
    const ye = {
      ..._.current,
      filter: { ..._.current.filter, page: E }
    };
    _.current = ye, M(ye), ba(e.id, ye);
  }
  function _t(m, E = !1) {
    Pt.current++, (m == null ? void 0 : m.key) !== (S == null ? void 0 : S.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (S == null ? void 0 : S.media.id) && de(E && m ? m.media.id : null), ce(m);
  }
  ee(() => {
    if (v.current) return;
    const m = new AbortController();
    P.current = m;
    const E = ++hn.current;
    return He(!0), Ye(""), tt(""), A.current = null, de(null), ce(null), H([]), It(!1), (async () => {
      const F = Ts(
        On(je.current, _.current),
        _.current.performerFocus
      );
      Lt.current = Ae(F) ? await Mi(F, m.signal) : null;
      let X = Number(F.view.filter.page), le = await Wn(F, X, m.signal);
      const ye = Math.max(
        1,
        Math.ceil(le.totalCount / Number(F.view.filter.perPage))
      );
      (Q.current || X > ye) && (X = ye, le = await Wn(F, X, m.signal)), Q.current = !1;
      const ut = F.view.startFrom === "end" ? -1 : 1;
      for (; Ae(F) && !le.items.length && X + ut >= 1 && X + ut <= ye && !m.signal.aborted; )
        X += ut, le = await Wn(F, X, m.signal);
      if (E !== hn.current || m.signal.aborted) return;
      const Ft = Oo(le.items, F.view.startFrom === "end");
      xn(le, X, Ft[0] ?? null);
    })().catch((F) => {
      !m.signal.aborted && E === hn.current && Ye(dn(F));
    }).finally(() => {
      !m.signal.aborted && E === hn.current && (J(!0), He(!1));
    }), () => {
      m.abort(), hn.current++;
    };
  }, [L, e.id]);
  const mn = $(null);
  ee(() => {
    if ((S == null ? void 0 : S.key) !== mn.current && Ge(null), mn.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let m = !0;
    return vn(d, S).then((E) => {
      m && (Ge(E), Sn(
        Ae(e) ? E.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((E) => {
      m && Ye(`Could not load current tags. ${dn(E)}`);
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
          (await we(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      m && Rt(Object.fromEntries(E));
    }).catch((E) => {
      m && Ye(dn(E));
    }), () => {
      m = !1;
    };
  }, [e]);
  function _r(m, E = A.current) {
    const F = ae.findIndex((Ue) => Ue.key === m.key), X = V.startFrom === "end" ? -1 : 1, le = (E == null ? void 0 : E.key) === m.key, ye = le ? E : { key: m.key, page: it, before: ae.slice(0, F + 1).map((Ue) => Ue.key), after: ae.slice(F + 1).map((Ue) => Ue.key) }, ut = new Set(ye.after), Ft = new Set(ye.before), sn = ae.find((Ue) => ut.has(Ue.key) || (X === 1 || it < ye.page) && le && !Ft.has(Ue.key));
    return { direction: X, cursor: ye, remainingKeys: ut, visitedKeys: Ft, nextLoaded: sn };
  }
  async function Yn(m = !1, E = !1, F = !1, X = () => !0, le = A.current) {
    if (!S) return;
    const { direction: ye, cursor: ut, remainingKeys: Ft, visitedKeys: sn, nextLoaded: Ue } = _r(S, le);
    if (!m && Ue) {
      _t(Ue, F);
      return;
    }
    const Ln = m ? sn : new Set(ae.map((Bt) => Bt.key));
    let vt = ye === -1 && !m ? Math.max(1, it - 1) : it;
    for (; et.current && !Be.current; ) {
      let Bt = await Wn(At, vt);
      const rt = Math.max(
        1,
        Math.ceil(Bt.totalCount / Number(V.filter.perPage))
      );
      vt > rt && (vt = rt, Bt = await Wn(At, vt));
      const Nt = Oo(Bt.items, ye === -1), $n = new Map(Nt.map((Kt) => [Kt.key, Kt])), Er = m ? ut.after.flatMap((Kt) => {
        const xa = $n.get(Kt);
        return xa ? [xa] : [];
      }) : [], Ar = new Set(Er.map((Kt) => Kt.key)), Cr = m ? {
        ...Bt,
        items: [
          ...Er,
          ...Nt.filter(
            (Kt) => Kt.key !== S.key && !Ar.has(Kt.key)
          )
        ]
      } : { ...Bt, items: Nt };
      if (!X()) return;
      if (E) {
        A.current = ut, xn(Cr, vt, S, !1, !0);
        return;
      }
      const da = ye === -1 && it === 1 && !m ? void 0 : Cr.items.find(
        (Kt) => !Ln.has(Kt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && ye === -1 && vt === ut.page) || Ft.has(Kt.key))
      );
      if (da || (ye === -1 ? vt <= 1 : vt >= rt)) {
        xn(
          Cr,
          vt,
          da ?? null,
          F,
          !0
        ), da || tt(
          Bt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      vt += ye;
    }
  }
  async function nn(m, E = !1, F = !1, X = !1) {
    var Bt;
    if (Zt.current && m && S && !F && !X && !w && !Ve) {
      Vt.current = { action: m, stay: E, key: S.key };
      return;
    }
    if (w || !S || We.current || ve || Ve && !F)
      return;
    const le = F || X || !!(m != null && m.steps.length);
    if (le && (!t || !Ce) || m && sr(m) && !n) return;
    const ye = !E && !F && !X && le && m !== void 0 && Ce !== null && as(e) && Ko(Bo(e.actions, iu(m, Ce, jt))).length > 0, ut = F && ((Bt = Nn.current) != null && Bt.contains(document.activeElement)) ? document.activeElement : null;
    We.current = !0, ot(!0), Ye(""), tt(""), Zt.current = !0;
    const Ft = A.current, sn = le && !E && !ye ? _r(S).nextLoaded ?? null : null;
    sn && (H(
      (rt) => rt.filter((Nt) => Nt.key !== S.key)
    ), _t(sn, !0));
    let Ue = !1, Ln = !1, vt = [];
    try {
      if (le) {
        const rt = await vn(d, S);
        if (m)
          await Of(At, S, m);
        else {
          const $n = X && Ae(e) ? e.occurrence.tagIds.filter((Cr) => rt.ids.includes(Cr)) : $t.current, Ar = Yr($n, X ? gt : pr);
          await Pi(At, S, Ar);
        }
        const Nt = await vn(d, S);
        sn || Ge(Nt), Ln = !0, It(!1), ye && (vt = Ko(Bo(e.actions, Nt))), tt(
          vt.length ? `Tags saved. Staying until answered: ${vt.map(($n) => $n.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (De(S.occurrence.performer.id), Fn(($n) => $n + 1));
      }
      if (!et.current || Be.current) return;
      if (le)
        if (sn) {
          const rt = Pt.current;
          Ue = !0, Zt.current = !1, yt(), Yn(!0, !1, !0, () => Pt.current === rt && !We.current, Ft).catch((Nt) => {
            Pt.current === rt && Ye(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${dn(Nt)}`);
          });
        } else vt.length || await Yn(!0, E, !E);
      else E || await Yn();
      E && F && requestAnimationFrame(() => {
        var rt;
        return (rt = mt.current) == null ? void 0 : rt.focus();
      });
    } catch (rt) {
      if (Ye(
        Ln ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${dn(rt)}` : le ? `Saving stopped. ${vp(dn(rt))}${F || X ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${dn(rt)}`
      ), le && !Ln) {
        he.current = ut, sn && (H(ae), de(null), G((Nt) => Nt + 1), ce(S), A.current = Ft);
        try {
          Ge(await vn(d, S));
        } catch {
          Ge(null), Ye(
            (Nt) => `${Nt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ue || (Zt.current = !1, yt());
    }
  }
  ee(() => {
    const m = Vt.current;
    if (!(!m || fe || We.current)) {
      if ((S == null ? void 0 : S.key) !== m.key || Ke) {
        Vt.current = null;
        return;
      }
      Ce && (Vt.current = null, nn(m.action, m.stay));
    }
  }, [fe, Ce, S, Ke]);
  const $e = !Ve && !w && !kt && !pn && (S != null || ve || fe);
  qi({
    surface: "local",
    enabled: $e,
    actions: e.actions,
    onAction: (m, E) => {
      const F = e.actions[m];
      F && nn(F, E);
    },
    onFind: () => qn(!0)
  });
  const br = (m) => fe || ve || !Ce || !!w || !t && m.steps.length > 0 || !n && sr(m);
  function gn() {
    !o || w || We.current || Ve || (D.current = document.activeElement, C.current = {
      error: Ke,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(_.current),
      items: ae,
      current: S,
      total: Ee,
      targets: Lt.current,
      stayedCursor: A.current
    }, Pt.current++, k(structuredClone(e)), x(""), tt(""), Ye(""));
  }
  ee(() => {
    if (!i) {
      j.current = 0;
      return;
    }
    i !== j.current && ne && !ve && (j.current = i, gn(), s == null || s());
  }, [i, ve, ne]);
  function ra() {
    k(null), x(""), requestAnimationFrame(() => {
      const m = D.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function Xn() {
    var E;
    const m = C.current;
    !m || fe || ((E = P.current) == null || E.abort(), hn.current++, _.current = m.query, M(m.query), H(m.items), ce(m.current), ke(m.total), Lt.current = m.targets, A.current = m.stayedCursor, He(!1), Ye(m.error), tt(""), window.history.replaceState(window.history.state, "", m.url), ra());
  }
  async function po() {
    if (!w || !o || We.current) return;
    const m = On(
      { ...w, name: w.name.trim() },
      Va(je.current, _.current)
    ), E = Na(m);
    if (E) {
      x(E);
      return;
    }
    We.current = !0, ot(!0), x("");
    try {
      if (await o(m) === !1) throw new Error("Could not save review.");
      ra(), tt("Review saved.");
    } catch (F) {
      x(oc(F));
    } finally {
      yt();
    }
  }
  async function aa() {
    if (!o || We.current) return;
    const m = Va(je.current, _.current), E = On(je.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    We.current = !0, ot(!0), Ye(""), ht("");
    try {
      if (await o(E) === !1) throw new Error("Could not save review.");
      tt("Queue saved to this review.");
    } catch (F) {
      ht("Could not save queue. " + dn(F));
    } finally {
      yt();
    }
  }
  const dt = V.performerScope, rn = (m) => {
    const { performerFocus: E, ...F } = _.current, X = E && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    lt(
      {
        ...F,
        ...X ? { performerFocus: E } : {},
        filter: { ...F.filter, page: 1 },
        performerScope: { ...dt, ...m }
      },
      F.startFrom === "end"
    );
  };
  async function yr(m, E) {
    var le;
    const F = Hn.current;
    if (!Ae(F)) return;
    (le = ge.current) == null || le.controller.abort();
    const X = {
      signature: Ha(F),
      controller: new AbortController()
    };
    ge.current = X, ie.current = "", Te(!0), Ot(null);
    try {
      const ye = await ip(F, m, E, X.controller.signal, {
        onProgress: (ut) => {
          ge.current === X && qe(ut);
        }
      });
      ge.current === X && qe(ye);
    } catch (ye) {
      ge.current === X && !X.controller.signal.aborted && (ie.current = X.signature, Ot({ signature: X.signature, message: dn(ye) }));
    } finally {
      ge.current === X && (ge.current = null, Te(!1));
    }
  }
  function bn() {
    var m;
    (m = ge.current) == null || m.controller.abort(), ge.current = null, Te(!1), qe((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function De(m) {
    var X;
    const E = Hn.current;
    if (!Ae(E)) return;
    if (ge.current) {
      bn();
      return;
    }
    const F = Ha(E);
    if (!(((X = oe.current) == null ? void 0 : X.signature) !== F || oe.current.partial))
      try {
        const le = await ul(E, m);
        if (ge.current) {
          bn();
          return;
        }
        qe(
          (ye) => (ye == null ? void 0 : ye.signature) === F ? sp(ye, m, le) : ye
        );
      } catch {
        qe(
          (le) => (le == null ? void 0 : le.signature) === F ? { ...le, partial: !0, complete: !1 } : le
        );
      }
  }
  const wr = V.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === V.performerFocus) : void 0, wt = Re && Re.id === V.performerFocus ? { ...Re, flags: $r(Dt, Re.tags) } : wr ? { ...wr, flags: $r(Dt, wr.tags) } : null, jr = (m) => {
    if ((Re == null ? void 0 : Re.id) === m)
      return $r(Dt, Re.tags);
    const E = I == null ? void 0 : I.candidates.find((F) => F.id === m);
    return E ? $r(Dt, E.tags) : void 0;
  }, an = ((yn = S == null ? void 0 : S.occurrence) == null ? void 0 : yn.performer.id) ?? null, vr = an === null ? void 0 : jr(an), Ur = lp(
    Dt.length > 0 && an !== null && an !== V.performerFocus && vr === void 0 ? an : null
  ), Ra = vr ?? (Ur ? $r(Dt, Ur) : []), jt = yc(Qe.actions), Oa = gr.summary && V.performerFocus ? vi(Li(gr.summary, Qe.actions, jt)) : [], Zn = os(Dt, (wt == null ? void 0 : wt.flags) ?? [], An), er = Sc(
    os(Dt, Ra, An),
    an !== null && an === V.performerFocus ? Oa : []
  ), ho = JSON.stringify(er), Br = Ne(() => er, [ho]), mo = JSON.stringify(Zn), Ma = Ne(() => Zn, [mo]), oa = (m) => mu(Dt, m, mr);
  function ia(m) {
    if (We.current) return;
    const E = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    lt(E, E.startFrom === "end"), Qn("items");
  }
  function go() {
    const { performerFocus: m, ...E } = _.current;
    lt(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const Ut = $(null);
  Ut.current ?? (Ut.current = Mc());
  const Nr = Ut.current, qr = Ne(
    () => Qe.actions.flatMap((m) => m.steps.flatMap((E) => E.tagIds)),
    [Qe.actions]
  ), Pn = $(null);
  ee(() => {
    const m = Pn.current, E = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !E) return;
    const F = m.getBoundingClientRect(), X = E.getBoundingClientRect();
    X.top < F.top ? m.scrollTop -= F.top - X.top : X.bottom > F.bottom && (m.scrollTop += X.bottom - F.bottom);
  }, [S == null ? void 0 : S.key, en]);
  const Sr = $(null), on = $(null);
  ee(() => {
    var F, X;
    const m = on.current;
    if (!m) return;
    on.current = null;
    const E = [...((F = Sr.current) == null ? void 0 : F.querySelectorAll(".dq-partner")) ?? []];
    (X = E.find((le) => le.dataset.partnerKey === m) ?? E[0]) == null || X.focus();
  }, [S == null ? void 0 : S.key]);
  const Cn = fe || ve || Ve || !!w, Tn = Ne(
    () => w ? On(w, Va(e, V)) : null,
    [w, e, V]
  ), Fa = Ne(
    () => Tn != null && Qr(Fr(Tn)) !== Qr(Fr(e)),
    [Tn, e]
  );
  function bo() {
    S ? vn(d, S).then(Ge).catch((m) => Ye(dn(m))) : lt(_.current);
  }
  const sa = Ke ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ke,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: fe, onClick: bo, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, ca = fe || ve || S != null && !Ce, la = Math.max(1, Number(V.filter.perPage) || 1), kr = $(1);
  ve || (kr.current = Math.max(1, Math.ceil(Ee / la)));
  const In = kr.current, Oe = dt && S ? ae.filter(
    (m) => m.media.id === S.media.id && m.key !== S.key
  ) : [], yo = (m) => {
    var E;
    return m.title || ((E = m.files[0]) == null ? void 0 : E.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, Kr = S ? qp(S.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": dt ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var X;
        const E = m.target instanceof Element ? m.target.closest("button") : null, F = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((X = E == null ? void 0 : E.textContent) == null ? void 0 : X.trim()) ?? "";
        E && !E.closest(Is) && /^(Filters|Edit filter:|Edit criteria)/.test(F) && (Mn.current = E);
      },
      children: [
        /* @__PURE__ */ a(
          Wc,
          {
            name: e.name,
            description: e.description,
            entityType: Le(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Cn || !!(c != null && c.busy),
            onEdit: w ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : gn,
            editDisabled: !w && (Cn || !o || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: fe || Ve, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  ya,
                  {
                    filter: V.filter,
                    objectFilter: En,
                    criteriaDefinitions: d === "audio" ? js : ao,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ee,
                    sortOptions: d === "audio" ? Hl : Us,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Yc,
                      {
                        page: Math.min(Math.max(1, it || 1), In),
                        pages: In,
                        onPage: (m) => lt({
                          ..._.current,
                          filter: Yt(
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
                          filter: Yt(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      lt(
                        {
                          ..._.current,
                          objectFilter: Zc(
                            m,
                            zn,
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
                rp,
                {
                  scope: dt,
                  disabled: fe || Ve,
                  editing: !!w,
                  onChange: rn,
                  onEditCriteria: () => zt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Xc,
                {
                  mode: "single",
                  disabled: Cn || !!c.busy,
                  onChange: () => {
                    var m;
                    return (m = c.onGrid) == null ? void 0 : m.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(me, { children: [
              Ae(At) && t && /* @__PURE__ */ a(
                Hf,
                {
                  review: At,
                  disabled: nt || !!w,
                  performerAttention: V.performerFocus ? Ma : void 0,
                  trees: jt,
                  onOpen: () => {
                    We.current = !0, ot(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const E = _.current.performerFocus;
                      E ? De(E) : bn(), Fn((F) => F + 1), yt(), v.current || He(!0), W((F) => F + 1);
                    } else yt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Ti,
                {
                  disabled: Cn,
                  items: c.moreItems({
                    onSelect: gn,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Hr,
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
              wt != null && wt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: oa(wt.flags), children: [
                /* @__PURE__ */ a(Un, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: oa(wt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: nt,
                  onClick: go,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: pt,
            queueChange: !w && pt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: bt ? () => void aa() : void 0,
              saveDisabled: nt || !o,
              onReset: () => {
                const m = Pr(e);
                lt(m, m.startFrom === "end");
              },
              resetDisabled: nt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && Tn && /* @__PURE__ */ a(
            Qc,
            {
              drawerRef: B,
              draft: Tn,
              onChange: (m) => k(m),
              direction: V.startFrom,
              onDirectionChange: (m) => lt({ ..._.current, startFrom: m }),
              tagGroups: Np,
              trees: jt,
              saving: fe,
              saveDisabled: ve,
              error: O,
              dirty: Fa,
              criteriaChanged: bt,
              notices: sa && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: sa }),
              onSave: () => void po(),
              onCancel: Xn
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
                        /* @__PURE__ */ a("span", { children: yo(S.media) }),
                        /* @__PURE__ */ a(Ys, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Kr && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Kr })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, be].filter(Boolean).map((m) => {
                    var X, le, ye, ut, Ft;
                    const E = m, F = E.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: F ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": F ? void 0 : !0,
                        inert: F ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          Ql,
                          {
                            streamUrl: jo("audio", E.media.id),
                            format: ((X = E.media.files[0]) == null ? void 0 : X.format) ?? "",
                            title: g(E.media),
                            coverUrl: F ? _o("audio", E.media) : void 0,
                            duration: ((le = E.media.files[0]) == null ? void 0 : le.duration) ?? 0,
                            autostart: F && Y === E.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Bs,
                          {
                            videoId: E.media.id,
                            streamUrl: jo("video", E.media.id),
                            posterUrl: F ? _o("video", E.media) : void 0,
                            duration: ((ye = E.media.files[0]) == null ? void 0 : ye.duration) ?? 0,
                            format: (ut = E.media.files[0]) == null ? void 0 : ut.format,
                            audioCodec: (Ft = E.media.files[0]) == null ? void 0 : Ft.audioCodec,
                            extensionSurface: F ? "quick-view" : void 0,
                            autostart: F && Y === E.media.id,
                            keyboardShortcutsEnabled: F,
                            showAbLoop: F,
                            clip: E.media.parentVideoId != null ? {
                              start: E.media.clipStartSec ?? 0,
                              end: E.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${E.media.id}:${pe}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ a(
                    Wf,
                    {
                      details: S.media.details,
                      label: p.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: ve ? "Loading review…" : Ee ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              Qe.actions.length > 0 ? /* @__PURE__ */ a(
                Iu,
                {
                  actions: Qe.actions,
                  isDisabled: (m) => Ve || br(m),
                  busy: ca,
                  tags: Ce,
                  trees: jt,
                  preview: Nr,
                  onApply: (m, E) => void nn(m, E),
                  onFind: () => qn(!0),
                  findDisabled: Ve || !!w,
                  paused: !!w,
                  waitForGroups: as(Qe),
                  attention: Br,
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
                          onChange: (E) => Sn(
                            e.occurrence.multiple ? E.target.checked ? [...gt, m] : gt.filter((F) => F !== m) : [m]
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
                          onClick: () => Sn([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void nn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void nn(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Sr, children: [
                S && /* @__PURE__ */ u(me, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Hr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: dt ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    Br.length > 0 && /* @__PURE__ */ a(Ep, { entries: Br })
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
                          var E, F, X;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = m.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (F = m.occurrence) == null ? void 0 : F.performer.name,
                              "data-partner-key": m.key,
                              disabled: nt,
                              onClick: () => {
                                on.current = S.key, _t(m), Ye("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Hr, { performer: m.occurrence.performer }),
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
                    kp,
                    {
                      tags: Ce,
                      preview: Nr,
                      trees: jt,
                      actionTagIds: qr,
                      label: `Current ${dt ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: Ve && !fe && (!Ce || Ce.ids.length !== $t.current.length || Ce.ids.some((m) => !$t.current.includes(m))),
                      editor: Ve && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: Nn,
                          disabled: fe,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              dt ? "occurrence" : p.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              cr,
                              {
                                entityType: "tag",
                                values: pr,
                                onChange: fn,
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
                                  onClick: () => void nn(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ce,
                                  onClick: () => void nn(void 0, !1, !0),
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
                  Xo,
                  {
                    ...gr,
                    mediaKind: d,
                    actions: Qe.actions,
                    trees: jt,
                    flags: Ma
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && sa,
                  !w && fr && /* @__PURE__ */ a("p", { role: "alert", children: fr }),
                  Vn && /* @__PURE__ */ a("p", { role: "status", children: Vn })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": ca || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: mt,
                      className: "dq-button",
                      disabled: nt || !!w || !t || !Ce,
                      onClick: () => {
                        Pt.current++, $t.current = [...Ce.ids], fn([...Ce.ids]), It(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Hs, { "aria-hidden": "true" }),
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
                      onClick: () => void nn(),
                      children: [
                        /* @__PURE__ */ a(ld, { "aria-hidden": "true" }),
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
                        "aria-pressed": en === "items",
                        onClick: () => Qn("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": en === "performers",
                        onClick: () => Qn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              dt && en === "performers" ? /* @__PURE__ */ a(
                Xf,
                {
                  ranking: (I == null ? void 0 : I.signature) === ct ? I : null,
                  busy: Pe,
                  error: (Ie == null ? void 0 : Ie.signature) === ct ? Ie.message : "",
                  focus: V.performerFocus,
                  disabled: nt,
                  labels: p,
                  flagLabel: oa,
                  onFocus: ia,
                  onMore: () => {
                    const m = oe.current;
                    m && yr(m, m.limit + Mo);
                  },
                  onRefresh: () => {
                    qe(null), yr(null, Mo);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Pn, children: ae.map((m) => {
                var F;
                const E = (S == null ? void 0 : S.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(m),
                    "aria-label": y(m),
                    "aria-current": E ? "true" : void 0,
                    disabled: nt,
                    onClick: () => {
                      _t(m), Ye(""), tt("");
                    },
                    children: [
                      /* @__PURE__ */ a(Sp, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(me, { children: [
                            /* @__PURE__ */ a(Hr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (F = m.media.files[0]) != null && F.duration ? Ks(m.media.files[0].duration) : ""
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
          _s,
          {
            open: kt,
            onClose: () => zt(!1),
            criteria: oi,
            activeFilter: dt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              zt(!1), rn({ performerFilter: m });
            }
          }
        ),
        pn && /* @__PURE__ */ a(
          Ei,
          {
            actions: e.actions,
            trees: jt,
            isDisabled: (m) => br(m),
            tapStays: ze && U,
            onApply: (m, E) => {
              qn(!1), nn(m, E);
            },
            onClose: () => qn(!1)
          }
        )
      ]
    }
  );
}
const Nl = "data-quality.reviews-sort.v1", Cp = { sort: "name", direction: "asc" };
function Tp() {
  try {
    const e = JSON.parse(localStorage.getItem(Nl) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Cp;
}
function Ip(e) {
  try {
    localStorage.setItem(
      Nl,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function ql(e, t, n, r) {
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
function Fo(e, t) {
  const n = Le(e), r = Gn(ui(n)), o = n === "tag" ? "tag" : Ae(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function $p({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Fo(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Fo(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Fo(e, t)
    ] })
  ] });
}
function Rp({
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
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = $(null), w = Ne(
    () => ql(e, t, n, r),
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
              /* @__PURE__ */ a(dd, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Xs, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
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
              children: r === "asc" ? /* @__PURE__ */ a(ud, { "aria-hidden": "true" }) : /* @__PURE__ */ a(fd, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(zc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: x.name }),
                    x.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: x.description, children: x.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Vc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a($p, { review: x, count: t[x.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Ti, { label: `Actions for ${x.name}`, items: N(x) }) })
          ] }, x.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(io, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Sl(e, { id: t, name: n, description: r }) {
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
function Op({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), l = $(null), f = $(i);
  f.current = i;
  const d = $(null), p = at();
  ee(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = l.current) == null || y.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(i);
  ee(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!o.name.trim() || h.current && !i && N) && ((w = l.current) == null || w.focus()), h.current = i;
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
                  disabled: i,
                  onClick: g,
                  children: /* @__PURE__ */ a(Ea, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Hc,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Le(o) && t(Sl(y, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => Ci(o), children: "Export draft" }),
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
const Mp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Fp(e, t, n, r) {
  return vl(
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
function $s(e, t) {
  return Le(t) === "video" && Dr(t.view.objectFilter, e.view.objectFilter, Di(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Rs(e, t) {
  return lr(
    JSON.parse(ar(Fr(e))),
    JSON.parse(ar(Fr(t)))
  );
}
const xo = 180;
function Os(e) {
  return Le(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ms(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Fs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Po(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  fo.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  wl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function xp(e) {
  return Yt({ ...e, page: 1 });
}
function kl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Vr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Pp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(si, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(md, { "aria-hidden": "true" }) }
], Lp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(si, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(hd, { "aria-hidden": "true" }) }
], xs = [], El = "(min-width: 900px)";
function Dp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(El);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function _p() {
  return typeof window.matchMedia == "function" && window.matchMedia(El).matches;
}
function jp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [k, O] = T([]), [x, B] = T(""), [C, D] = T(!0), [P, ne] = T("account"), [J, j] = T(""), [V, M] = T(""), [_, L] = T(!1), [W, Q] = T(!1), [ae, H] = T(""), [S, ce] = T(Fs), A = $(S);
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
  const [fe, ot] = T(Tp), { sort: We, direction: Pt } = fe, Zt = (b) => {
    const q = { ...fe, ...b };
    ot(q), Ip(q);
  }, Vt = $(null), et = $(null), [Be, Ke] = T(null), [Ye, fr] = T(!1), [ht, Vn] = T(!1), [tt, Ce] = T(null), [Ge, Ve] = T(null), It = !!tt || !!Ge, pr = $(It);
  pr.current = It;
  const fn = Ye || !!Ge || ht, [$t, mt] = T(0), [Mn, Nn] = T(!1), [he, kt] = T(null), zt = $(null), pn = $(null), qn = $(null), [ze, Et] = T(
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
  ), Fe = U ? Le(U) : "video", gt = ui(Fe), Sn = U ? Ae(U) : !1, se = Fe === "video" ? U : null, Rt = !!(U != null && U.actions.some(sr)), Lt = Sn && Rt, zn = (!!se || Fe === "audio" || Sn) && Rt, [kn, En] = T(null), hn = (kn == null ? void 0 : kn.id) === (U == null ? void 0 : U.id) ? kn == null ? void 0 : kn.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", je = Sn || Fe === "audio" || Fe === "video" && hn === "single", [Qe, st] = T(0), At = $(-1), Jn = $(!1), Hn = $(je);
  Hn.current = je, ee(() => {
    const b = () => {
      const q = Hn.current;
      if (!q && Xn.current) {
        Jn.current = !0;
        return;
      }
      At.current = -1, $n(), q || st((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const en = gt === "audio" ? h : d, Qn = Fe === "tag" ? "Tag" : gt === "audio" ? "Audio" : "Video", I = Fe === "tag" ? y : en, K = $(
    null
  ), oe = up(se), [ie, qe] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Pe, Te] = T({
    page: 1,
    perPage: 40
  }), [Ie, Ot] = T({ items: [], totalCount: 0 }), [ge, ct] = T(S);
  ge !== S && (ct(S), Ot({ items: [], totalCount: 0 }), Q(!1));
  const [Se, Fn] = T(!1), [Re, hr] = T(""), [Jt, ta] = T(!1), [Dt, na] = T(!1), [Mt, tn] = T(() => /* @__PURE__ */ new Set()), mr = $(Mt);
  mr.current = Mt;
  const An = $(/* @__PURE__ */ new Map()), gr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [pt, bt] = T(null), nt = $(pt);
  nt.current = pt;
  const [it, lt] = T(!1), yt = $(it);
  yt.current = it;
  const Wn = $(null), [xn, _t] = T(!1), [mn, _r] = T("grid"), [Yn, nn] = T(xo), [$e, br] = T(!1), [gn, ra] = T(!1), Xn = $(!1), [po, aa] = T(""), [dt, rn] = T(""), [yr, bn] = T(""), [De, wr] = T(null), [wt, jr] = T(""), [an, vr] = T(!1), [Ur, Ra] = T({}), jt = $(/* @__PURE__ */ new Map()), Oa = $(null), Zn = $(null), er = !!U, ho = ri(Dp, _p, () => !1) && er, [Br, mo] = T({ top: 0, bottom: 0 });
  Tt(() => {
    if (!er) return;
    const b = () => {
      const R = Zn.current;
      if (!R) return;
      const z = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), re = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      mo(
        (Z) => Z.top === z && Z.bottom === re ? Z : { top: z, bottom: re }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [er]);
  const [Ma, oa] = T(0), ia = $(null), go = Rn((b) => {
    var R;
    if ((R = ia.current) == null || R.disconnect(), ia.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => oa(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), ia.current = q;
  }, []), Ut = $(0), Nr = $(0), qr = $(null), Pn = $(null), Sr = yc(
    U && !je ? he ? [...U.actions, ...he.draft.actions] : U.actions : xs
  ), on = Ne(
    () => he && U && ue ? Fp(he.draft, U, ie, ue) : null,
    [he, U, ie, ue]
  ), Cn = Ne(
    () => U && ue ? vl(
      { ...ue, view: { ...U.view, filter: { ...ie, page: 1 } } },
      ue
    ) : null,
    [U, ue, ie]
  ), Tn = Ne(
    () => ue ? Qr(Fr(ue)) : "",
    [ue]
  ), Fa = Ne(
    () => Cn != null && Qr(Fr(Cn)) !== Tn,
    [Cn, Tn]
  ), bo = Ne(
    () => on != null && Qr(Fr(on)) !== Tn,
    [on, Tn]
  );
  ee(() => {
    if (!dt) return;
    const b = window.setTimeout(() => rn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [dt]), ee(() => {
    if (!Be || Be.alert) return;
    const b = window.setTimeout(() => Ke(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Be]), ee(() => {
    const b = se ? Ri(se.view.objectFilter) : [];
    if (Ra({}), !b.length) return;
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
      R && Ra(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const sa = Ne(
    () => se ? Oi(
      se.view.objectFilter,
      Ur
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [Ur, U, se]
  ), ca = Rn(async () => {
    c(!0), f("");
    try {
      const b = await xd();
      n(b.reviews), i(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), ne(b.storage ?? "account"), j(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), Po(""));
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
    return B(""), Jd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), ee(() => {
    ca();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof pe.current[q.id] == "number") continue;
      (Ae(q) ? Mi(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : zr(Fi(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Le(q) === "tag" ? Eo(
        q,
        Yt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : zr(
        q,
        Yt({ ...q.view.filter, page: 1, perPage: 1 }),
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
    et.current = null, (z = (b === "heading" ? null : [...((R = Zn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Vt.current) == null || z.focus();
  }, [S, s, Ge, t]);
  const la = $(0), kr = Rn(async () => {
    const b = ++la.current;
    wr(null), jr("");
    try {
      const q = await (Lt ? hc(gt) : pc(gt));
      b === la.current && wr(q);
    } catch (q) {
      if (b !== la.current) return;
      wr(null), jr(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Lt, gt]);
  ee(() => {
    kr();
  }, [kr]);
  const In = Rn(
    async (b, q, R = !1, z = !1) => {
      var Je, xe;
      const te = ++Ut.current;
      (Je = qr.current) == null || Je.abort();
      const re = new AbortController();
      qr.current = re, q = Yt(q);
      const Z = Number(q.page);
      R && (q = { ...q, page: 1 }), qe(q), na(R), Fn(!0), hr("");
      try {
        const Xe = (Me) => Le(b) === "tag" ? Eo(
          b,
          Me,
          re.signal
        ) : zr(
          b,
          Me,
          re.signal
        );
        let ft = await Xe(q);
        const Ht = Math.max(
          1,
          Math.ceil(ft.totalCount / Number(q.perPage))
        ), Ct = R ? Ht : Math.min(Z, Ht);
        return Number(q.page) !== Ct && (q = { ...q, page: Ct }, ft = await Xe(q)), te === Ut.current && (((xe = Pn.current) == null ? void 0 : xe.page) !== Ct && (Pn.current = {
          page: Ct,
          ids: new Set(ft.items.map((Me) => Me.id))
        }), Ot(ft), z && X(
          () => new Set(ft.items.map((Me) => Me.id))
        ), qe(q), Te(q)), ft;
      } catch (Xe) {
        throw te === Ut.current && hr(
          Xe instanceof Error ? Xe.message : "Could not load the review queue."
        ), Xe;
      } finally {
        te === Ut.current && Fn(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (Nr.current += 1, At.current = -1, Ut.current += 1, (q = qr.current) == null || q.abort(), kt(null), zt.current = null, Q(!1), H(""), M(""), L(!1), tn(/* @__PURE__ */ new Set()), An.current.clear(), bt(null), lt(!1), br(!1), Xn.current = !1, aa(""), rn(""), bn(""), Ot({ items: [], totalCount: 0 }), Pn.current = null, ta(!1), !U || je) {
      Fn(!1), Et(null);
      return;
    }
    let b = !0;
    return Fn(!0), (async () => {
      let R = ue ?? U;
      Et(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (Le(U) === "video" && fo.some((xe) => te.has(xe)))
        try {
          const xe = R;
          z = ni(xe, te);
          const Xe = On(xe, z.query);
          (z.query.startFrom !== (xe.view.startFrom ?? "end") || !lr(
            JSON.parse(ar(Xe)),
            JSON.parse(ar(On(xe, Pr(xe))))
          )) && (R = Xe, Et(R));
        } catch (xe) {
          ta(!0), hr(xe instanceof Error ? xe.message : "Could not read review URL."), Fn(!1);
          return;
        }
      let re = null;
      try {
        re = await jd(o, U.id);
      } catch (xe) {
        b && (L(!0), M(
          xe instanceof Error ? xe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Z = (re == null ? void 0 : re.signature) === ar(R) ? re : null, Je = z ? z.query.filter : Z ? Yt(Z.filter) : xp(R.view.filter);
      qe(Je), _r(
        Z ? Ms(Z.displayMode, Le(U)) : Os(U)
      ), nn(
        Z ? Z.cardSize ?? xo : xo
      );
      try {
        const xe = await In(
          R,
          Je,
          z ? z.startAtEnd : !Z && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const Xe = Qi(
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
      b = !1, Nr.current++, Ut.current++, (R = qr.current) == null || R.abort();
    };
  }, [U == null ? void 0 : U.id, je, Qe]), ee(() => {
    if (!(!$t || je || !U)) {
      if (Jt) {
        mt(0);
        return;
      }
      $e || he || gn || ae !== `${U.id}:${Qe}` || (mt(0), qo());
    }
  }, [
    $t,
    je,
    U == null ? void 0 : U.id,
    ae,
    $e,
    gn,
    Qe,
    Jt
  ]), ee(() => {
    !se || je || !W || Se || Re || $e || Jn.current || At.current !== Qe || ba(se.id, {
      filter: ie,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, je, W, Se, Re, ie, $e, Qe]);
  const Oe = Ne(
    () => Ie.items.map((b) => b.id),
    [Ie.items]
  );
  ee(() => {
    if (!W || !U || !o || Se || Re || $e || (ze == null ? void 0 : ze.id) === U.id || _ || At.current !== Qe)
      return;
    const b = {
      version: 1,
      signature: ar(U),
      filter: ie,
      focusedId: pt,
      index: Math.max(0, Oe.indexOf(pt ?? -1)),
      displayMode: mn,
      cardSize: Yn,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + U.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (V) return;
    let q = !0;
    const R = window.setTimeout(() => {
      Ud(o, U.id, b).catch((z) => {
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
    o,
    U,
    Se,
    Re,
    $e,
    ie,
    pt,
    Oe,
    mn,
    Yn,
    ze,
    V,
    _,
    Qe
  ]);
  const yo = Ie.items.find((b) => b.id === pt) ?? null, Kr = Fe === "video" ? yo : null;
  it && Kr && (Wn.current = Kr);
  const yn = Kr ?? (it ? Wn.current : null), m = Xi(Mt, pt), E = Oe.length > 0 && Oe.every((b) => Mt.has(b)), F = Rn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (pr.current || Id(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = jt.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    W && !yt.current && F(nt.current);
  }, [W, F]), ee(() => {
    Se || !Oe.length || (nt.current == null || !Oe.includes(nt.current)) && (bt(Oe[0]), yt.current || F(Oe[0]));
  }, [F, Oe, Se]);
  const X = Rn(
    (b) => {
      tn((q) => {
        const R = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(z) !== R.has(z) && An.current.set(
            z,
            (An.current.get(z) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), le = Rn(
    (b) => {
      if (!Oe.length) return;
      const q = Math.max(
        0,
        Oe.indexOf(nt.current ?? Oe[0])
      ), R = Oe[Math.max(0, Math.min(Oe.length - 1, q + b))];
      bt(R), yt.current || F(R);
    },
    [F, Oe]
  ), ye = Rn(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = z != null && (!v || !k.some((Ze) => Ze.id === z)), re = "effect" in b && R && !v, Z = Xi(
        mr.current,
        nt.current
      );
      if (!U || Xn.current || Se || Re) return;
      const Je = R && !I ? `${Qn} write permission is required to apply ${b.label}.` : re || te ? `${b.label} needs a tag group that is unavailable.` : sr(b) && (De == null ? void 0 : De.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Z.length ? "" : `Select or focus a ${Fe} before applying ${b.label}.`;
      if (Je) {
        bn(Je);
        return;
      }
      const xe = ++Nr.current, Xe = U.id, ft = [...Oe], Ht = Ie, Ct = nt.current, Me = new Set(mr.current), cn = new Map(
        Z.map((Ze) => [Ze, An.current.get(Ze) ?? 0])
      ), Tr = () => xe === Nr.current && U.id === Xe;
      Xn.current = !0, br(!0), aa(
        mr.current.size ? `${Z.length} selected ${Fe}s` : `the focused ${Fe}`
      ), rn(""), bn("");
      const Gi = Ht.items.filter(
        (Ze) => !Z.includes(Ze.id)
      ), Ll = Gi.map((Ze) => Ze.id), Vi = Zi(
        ft,
        Ll,
        Ct,
        Z.includes(Ct ?? -1)
      );
      q || (Ot({
        items: Gi,
        totalCount: Ht.totalCount
      }), tn((Ze) => {
        const Qt = new Set(Ze);
        for (const wn of Z) Qt.delete(wn);
        return Qt;
      }), bt(Vi), yt.current || F(Vi));
      let So = !1;
      try {
        if ("effect" in b ? await nu(b, Z) : await gc(gt, b, Z), So = !0, !Tr()) return;
        q || tn((Ze) => {
          const Qt = new Set(Ze);
          for (const wn of Z)
            (An.current.get(wn) ?? 0) === cn.get(wn) && Qt.delete(wn);
          return Qt;
        }), rn(
          `${b.label}: ${Z.length} ${Fe}${Z.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (Ze) {
        if (!Tr()) return;
        Ot(Ht), tn((Qt) => {
          const wn = new Set(Qt);
          for (const ln of Z)
            Me.has(ln) && (An.current.get(ln) ?? 0) === cn.get(ln) && wn.add(ln);
          return wn;
        }), bt(Ct), yt.current || F(Ct), bn(
          Ze instanceof Error ? Ze.message : "Action failed."
        );
      }
      try {
        if (!Tr()) return;
        if (q) {
          const Gt = Fe === "tag" ? await Eo(U, ie) : await zr(U, ie), tr = new Map(
            Gt.items.map((xt) => [xt.id, xt])
          );
          if (Fe !== "tag" && await Promise.all(
            Z.filter((xt) => !tr.has(xt)).map(async (xt) => {
              const fa = await eo(gt, xt).catch(() => null);
              fa && tr.set(xt, fa);
            })
          ), !Tr()) return;
          const _a = new Set(Z), Dn = "effect" in b ? b.effect : null, Wt = (Dn == null ? void 0 : Dn.mode) === "SET_TAG_GROUP" ? k.find((xt) => xt.id === Dn.tagGroupId) : void 0, ko = (xt) => Dn && Dn.mode !== "SKIP" && _a.has(xt.id) ? {
            ...xt,
            tagGroupId: (Wt == null ? void 0 : Wt.id) ?? null,
            tagGroupName: (Wt == null ? void 0 : Wt.name) ?? null,
            tagGroupColor: (Wt == null ? void 0 : Wt.color) ?? null
          } : xt;
          Ot((xt) => ({
            items: xt.items.map((fa) => tr.get(fa.id) ?? ko(fa)),
            totalCount: Gt.totalCount
          }));
          return;
        }
        const Ze = new Set(Z), Qt = gr && ft.length > 0 && ft.every((Gt) => Ze.has(Gt)), wn = await In(U, ie, !1, Qt);
        if (!Tr()) return;
        let ln = wn.items.map((Gt) => Gt.id);
        const Da = Pn.current, Dl = (Da == null ? void 0 : Da.page) === Number(ie.page) && ln.some((Gt) => Da.ids.has(Gt)), _l = (U.view.startFrom ?? "end") !== "beginning";
        if (wn.totalCount > 0 && Number(ie.page) > 1 && (!ln.length || _l && !Dl)) {
          const Gt = Math.max(1, Number(ie.page) - 1), tr = { ...ie, page: Gt };
          qe(tr), ln = (await In(
            U,
            tr,
            !1,
            Qt
          )).items.map((Wt) => Wt.id), tn(
            (Wt) => new Set([...Wt].filter((ko) => ln.includes(ko)))
          );
          const Dn = ln.at(-1) ?? null;
          bt(Dn), yt.current || F(Dn);
        } else {
          tn(
            (tr) => new Set([...tr].filter((_a) => ln.includes(_a)))
          );
          const Gt = Zi(
            ft,
            ln,
            Ct,
            So && Z.includes(Ct ?? -1)
          );
          bt(Gt), yt.current && Gt == null && lt(!1), yt.current || F(Gt);
        }
      } catch (Ze) {
        Tr() && bn(
          (Qt) => `${Qt ? `${Qt} ` : ""}${So ? "The action completed, but " : ""}the queue could not be refreshed. ${Ze instanceof Error ? Ze.message : "Refresh failed."}`
        );
      } finally {
        Tr() && (Xn.current = !1, br(!1), aa(""), Jn.current && (Jn.current = !1, $n(), st((Ze) => Ze + 1)));
      }
    },
    [
      I,
      v,
      k,
      Fe,
      De,
      In,
      ie,
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
    if (mn === "list") return 1;
    const b = (R = Oa.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Ft = $(() => {
  });
  Ft.current = (b) => {
    var re;
    if (je || b.defaultPrevented || b.repeat || un(b) || b.ctrlKey || b.altKey || b.metaKey || It) return;
    const q = b.target, R = q instanceof Node && ((re = Zn.current) == null ? void 0 : re.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z) return;
    if (xn) {
      b.key === "Escape" && (Vr(b), _t(!1));
      return;
    }
    if (it && b.key === "Escape") {
      Vr(b), lt(!1), F(nt.current);
      return;
    }
    if (!Td(q)) return;
    const te = Cd(q);
    if (b.key === "Escape") {
      Vr(b), X(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!it && b.key === " " && te) {
      Vr(b), pt != null && X((Z) => za(Z, pt));
      return;
    }
    if (!($e || Se) && !it && b.key === "Enter" && pt != null && te) {
      if (Fe !== "tag" && he) return;
      Vr(b), Fe === "tag" ? window.open(`/tag/${pt}`, "_blank", "noopener,noreferrer") : lt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => Ft.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const sn = $(
    () => {
    }
  );
  sn.current = (b) => {
    var re;
    if (je || It || it || xn || $e || Se || !Oe.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((re = Zn.current) == null ? void 0 : re.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z || !b.key.startsWith("Arrow") || !$d(q)) return;
    const te = Rd(b.key, ut());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), le(te));
  }, ee(() => {
    const b = (q) => sn.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Ue = (he == null ? void 0 : he.saving) === !0 || gn, Ln = $e || Se && !W || Ue, vt = Si();
  qi({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !je && !It && !he && !it && !xn && !Re && (Ie.items.length > 0 || Se || $e),
    actions: (U == null ? void 0 : U.actions) ?? xs,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && ye(R, q);
    },
    onFind: () => _t(!0),
    onSelectAll: () => X((b) => Ad(b, Oe))
  }), ee(() => _t(!1), [je, it, U == null ? void 0 : U.id]);
  function Bt(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = R != null && !k.some((te) => te.id === R);
    return $e || Se || !!Re || q && !I || "effect" in b && q && (!v || z) || sr(b) && (De == null ? void 0 : De.kind) !== "ready" || !m.length;
  }
  function rt(b) {
    En(null), mt(0), Ke(null), ce(b), Po(b, !!b && !U);
  }
  function Nt() {
    Ee.current || (yl() ? (Ee.current = !0, window.history.back()) : rt(""));
  }
  function $n() {
    const b = Ee.current;
    Ee.current = !1;
    let q = Fs();
    q && !be.current && !G.current.some((z) => z.id === q) && (q = "", Po(""));
    const R = A.current;
    q !== R && (mt(0), b || Ke(null), !q && R && (et.current ?? (et.current = { reviewId: R }))), ce(q);
  }
  function Er() {
    et.current = "heading", Ke(null), Nt();
  }
  function Ar(b) {
    b !== S && rt(b), mt((q) => q + 1);
  }
  function Cr() {
    Ke(null), Ce({
      review: Sl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function da(b) {
    if (fn || !C) return;
    Ke(null);
    const q = crypto.randomUUID();
    let R;
    const z = S;
    Vn(!0);
    try {
      if (!await ua((re) => (R = Yi(
        re.find((Z) => Z.id === b.id) ?? b,
        re,
        q
      ), [...re, R]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      A.current !== z ? Ke({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : Ar(R.id);
    } catch (te) {
      Ke({
        text: `“${b.name}” was not duplicated. ${Pa(te)}`,
        alert: !0
      });
    } finally {
      Vn(!1);
    }
  }
  async function Kt() {
    if (!tt || tt.saving) return;
    const b = { ...tt.review, name: tt.review.name.trim() }, q = Na(b);
    if (q) {
      Ce({ ...tt, error: q });
      return;
    }
    Ce({ ...tt, saving: !0, error: "" });
    try {
      if (!await ua((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Ce(null), Ar(b.id);
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
  async function xa() {
    if (!Ge || Ge.pending) return;
    const b = Ge.review, q = ql(t, Y, We, Pt).map((te) => te.id), R = q.filter((te) => te !== b.id), z = R[Math.min(q.indexOf(b.id), R.length - 1)];
    Ve({ review: b, pending: !0 });
    try {
      if (!await ua((te) => te.filter((re) => re.id !== b.id)))
        throw new Error("Could not save reviews.");
      et.current = b.id !== S && z ? { reviewId: z } : "heading", Ke({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ke({ text: `“${b.name}” was not deleted. ${Pa(te)}`, alert: !0 });
    } finally {
      Ve(null);
    }
  }
  async function Al(b) {
    if (!(fn || !C)) {
      Ke(null), fr(!0);
      try {
        const q = await hf(b);
        let R = 0, z = 0;
        if (q.length && !await ua((re) => {
          const Z = [...re];
          R = z = 0;
          for (const Je of q) {
            const xe = Z.find((Xe) => Xe.id === Je.id);
            if (!xe) Z.push(Je);
            else if (JSON.stringify(xe) !== JSON.stringify(Je))
              Z.push(Yi(Je, Z, crypto.randomUUID())), z++;
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
        Ke({ alert: !0, text: `Could not import “${b.name}”. ${Pa(q)}` });
      } finally {
        fr(!1);
      }
    }
  }
  function Pa(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function _i(b) {
    const q = !C || fn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(zs, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void da(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Xs, { "aria-hidden": "true" }),
        onSelect: () => Ci(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(oo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ke(null), Ve({ review: b, pending: !1 });
        }
      }
    ];
  }
  function ji(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Wr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || ht
      },
      ..._i(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
        separated: !0,
        disabled: ht,
        onSelect: Er
      }
    ];
  }
  async function ua(b) {
    if (!o) return !1;
    let q = [];
    const R = await _d(o, (Z) => {
      q = Z;
      const Je = b(Z);
      return Je === Z ? Z : Je.map(Kp);
    });
    if (n(R), !ke.current) return !0;
    const z = A.current;
    z && !R.some((Z) => Z.id === z) && Nt();
    const te = q.find((Z) => Z.id === z), re = R.find((Z) => Z.id === z);
    return re && te && ((re.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && En(null), re.view.displayMode !== te.view.displayMode && _r(Os(re))), !0;
  }
  function wo(b) {
    return ua((q) => Bp(q, b));
  }
  function Cl(b) {
    return wo(b).catch((q) => {
      throw A.current !== b.id && vo(b, q), q;
    });
  }
  function vo(b, q) {
    var z;
    if (!ke.current) return;
    const R = ((z = G.current.find((te) => te.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Ke({ text: `“${R}” was not saved. ${Pa(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(Ps, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Hp().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Ls,
        {
          message: l,
          onRetry: () => void ca()
        }
      )
    ] });
  const No = /* @__PURE__ */ u(me, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    zn && (De == null ? void 0 : De.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      De.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: an,
          onClick: () => {
            vr(!0), jr(""), (Lt ? Xd(gt) : Yd(gt)).then(kr).catch(
              (b) => jr(
                `Could not create the ${Lt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => vr(!1));
          },
          children: an ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    zn && ((De == null ? void 0 : De.kind) === "incompatible" || wt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(_n, {}),
      wt || (De == null ? void 0 : De.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: an,
          onClick: () => {
            vr(!0), kr().finally(
              () => vr(!1)
            );
          },
          children: an ? "Checking…" : "Check again"
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
      /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
      Be.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Be.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Zn,
      className: `data-quality-page${er ? " dq-page-fit" : ""}`,
      style: er ? {
        "--dq-fit-top": `${Br.top}px`,
        "--dq-fit-bottom": `${Br.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Be && !Be.alert ? Be.text : "" }),
        U && je ? /* @__PURE__ */ a(
          Ap,
          {
            review: ue ?? U,
            canWrite: Sn ? y : en,
            canAssess: (De == null ? void 0 : De.kind) === "ready" && en,
            onBusy: br,
            editRequest: $t,
            onEditRequestHandled: () => mt(0),
            onSaveDefaults: C ? Cl : void 0,
            pageControls: {
              onBack: Er,
              moreItems: (b) => ji(ue ?? U, b),
              onGrid: se ? () => En({ id: se.id, mode: "multiple" }) : void 0,
              notices: No,
              busy: ht
            },
            stayOnTap: Mn,
            onStayOnTapChange: Nn
          },
          U.id
        ) : U ? xl(U) : /* @__PURE__ */ a(
          Rp,
          {
            reviews: t,
            counts: Y,
            sort: We,
            direction: Pt,
            onSortChange: (b) => Zt({ sort: b }),
            onDirectionChange: (b) => Zt({ direction: b }),
            storage: Mp[P],
            canConfigure: C,
            busy: fn,
            headingRef: Vt,
            notices: No,
            onOpen: rt,
            onNew: () => Cr(),
            onImport: (b) => void Al(b),
            onExportAll: () => Jc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Wr, { "aria-hidden": "true" }),
                disabled: !C || fn,
                onSelect: () => Ar(b.id)
              },
              ..._i(b)
            ]
          }
        ),
        it && yn && se && /* @__PURE__ */ a(
          Jp,
          {
            video: yn,
            review: se,
            details: fp(yn, se, oe.ids),
            selectedCount: Mt.size,
            pending: $e,
            refreshing: Se || !!Re,
            error: yr,
            canWrite: d,
            assessmentReady: (De == null ? void 0 : De.kind) === "ready",
            trees: Sr,
            selected: Mt.has(yn.id),
            hasPrevious: Oe.indexOf(yn.id) > 0,
            hasNext: Oe.indexOf(yn.id) >= 0 && Oe.indexOf(yn.id) < Oe.length - 1,
            onToggleSelected: () => X((b) => za(b, yn.id)),
            onPrevious: () => le(-1),
            onNext: () => le(1),
            onClose: () => {
              lt(!1), F(nt.current);
            },
            onAction: ye,
            findOpen: xn,
            onFindOpenChange: _t
          }
        ),
        xn && U && !je && !it && /* @__PURE__ */ a(
          Ei,
          {
            actions: U.actions,
            tagGroups: k,
            trees: Sr,
            isDisabled: Bt,
            onApply: (b, q) => {
              _t(!1), ye(b, q);
            },
            onClose: () => _t(!1)
          }
        ),
        tt && /* @__PURE__ */ a(
          Op,
          {
            draft: tt,
            onChange: (b) => Ce((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void Kt(),
            onCancel: () => Ce(null)
          }
        ),
        /* @__PURE__ */ a(
          Yl,
          {
            open: !!Ge,
            title: "Delete review?",
            message: Ge ? `“${Ge.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ge == null ? void 0 : Ge.pending) ?? !1,
            onConfirm: () => void xa(),
            onCancel: () => Ve((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function La(b, q, R = !1, z = !0) {
    const te = nt.current, re = Math.max(0, Oe.indexOf(te ?? -1));
    try {
      const Z = In(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), Je = Ut.current, xe = await Z;
      if (Je !== Ut.current) return;
      const Xe = xe.items.map((Ht) => Ht.id);
      tn(
        (Ht) => new Set([...Ht].filter((Ct) => Xe.includes(Ct)))
      );
      const ft = Qi(Xe, te, re);
      bt(ft), z && !yt.current && F(ft, !1);
    } catch {
    }
  }
  function Tl(b) {
    const q = K.current;
    if (K.current = null, Ln || !U || !ue) return;
    const R = q ?? U.view.objectFilter, z = lr(
      R,
      ue.view.objectFilter
    ) ? ue.view.objectFilter : R, te = Yt({ ...b, page: 1 }), re = {
      ...U,
      view: {
        ...U.view,
        filter: te,
        objectFilter: z
      }
    }, Z = !Rs(re, ue), Je = Z ? re : ue;
    Et(Z ? re : null), rn(Z ? "" : "Review queue defaults restored."), La(Je, te, Je.view.startFrom !== "beginning");
  }
  function Il() {
    if ($e || Se || Ue || !ue) return;
    K.current = null;
    const b = Yt({
      ...ue.view.filter,
      page: 1
    });
    Et(null), rn("Review queue defaults restored."), La(
      ue,
      b,
      ue.view.startFrom !== "beginning",
      !1
    );
  }
  function $l() {
    if ($e || Se || Re || Ue || !U || !Cn || !C)
      return;
    const b = U, q = Cn;
    ra(!0), wo(q).then((R) => {
      !R || A.current !== q.id || (Et($s(q, b)), rn("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? vo(q, R) : bn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => ra(!1));
  }
  function qo() {
    if (!U || !ue || Xn.current || he || gn) return;
    pn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, zt.current = {
      temporaryReview: ze,
      filter: ie,
      loadedFilter: Pe,
      queue: Ie,
      queueError: Re,
      retryFromEnd: Dt,
      selectedIds: new Set(Mt),
      focusedId: pt,
      pageCursor: Pn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...ue,
      view: { ...ue.view, startFrom: U.view.startFrom ?? "end" }
    });
    _t(!1), lt(!1), rn(""), bn(""), kt({ draft: b, saving: !1, error: "" });
  }
  function Ui() {
    kt(null), zt.current = null;
    const b = pn.current;
    pn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : F(nt.current, !1);
    });
  }
  function Rl() {
    var q;
    if (!he || he.saving) return;
    const b = zt.current;
    b && (Ut.current += 1, (q = qr.current) == null || q.abort(), K.current = null, Fn(!1), Et(b.temporaryReview), qe(b.filter), Te(b.loadedFilter), Ot(b.queue), hr(b.queueError), na(b.retryFromEnd), X(() => b.selectedIds), bt(b.focusedId), Pn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Ui();
  }
  async function Ol() {
    if (!he || he.saving || !on || !U) return;
    const b = U, q = { ...on, name: on.name.trim() }, R = Na(q);
    if (R) {
      kt((z) => z && { ...z, error: R });
      return;
    }
    kt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await wo(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      Et($s(q, b)), Le(q) === "video" && ba(q.id, {
        filter: ie,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), rn("Review saved."), Ui();
    } catch (z) {
      if (A.current !== q.id) {
        vo(q, z);
        return;
      }
      kt(
        (te) => te && {
          ...te,
          saving: !1,
          error: oc(z)
        }
      );
    }
  }
  function Bi() {
    U && In(U, ie, Dt, gr).catch(() => {
    });
  }
  function Ml() {
    tn(/* @__PURE__ */ new Set()), An.current.clear(), bt(null);
  }
  function Fl(b) {
    !U || $e || Ue || b === Number(ie.page) || Up(
      { ...ie, page: b },
      U,
      (q, R) => In(q, R, !1, gr),
      Ml
    );
  }
  function Ki(b) {
    if (!se || !ue || $e || Se || Ue) return;
    const q = bl(se, b, ue.view.objectFilter), R = !Rs(q, ue);
    Et(R ? q : null), R ? La(q, { ...ie, page: 1 }) : La(
      ue,
      { ...ie, page: 1 },
      ue.view.startFrom !== "beginning"
    );
  }
  function xl(b) {
    var xe, Xe, ft, Ht, Ct;
    const q = Fe === "tag", R = q ? "tag" : "video", z = Math.max(1, Number(ie.perPage) || 40), te = Math.max(1, Math.ceil(Ie.totalCount / z)), re = Math.min(Math.max(1, Number(ie.page) || 1), te), Z = [
      I ? "" : `${Qn} write permission is required to apply actions.`,
      q && x ? `Tag groups are unavailable. ${x}` : ""
    ].filter(Boolean), Je = !!yr && !it;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Wc,
            {
              name: b.name,
              description: b.description,
              entityType: Fe,
              onBack: Er,
              backDisabled: $e || !!he || ht,
              onEdit: he ? () => {
                var Me;
                return (Me = qn.current) == null ? void 0 : Me.focus();
              } : qo,
              editDisabled: !he && ($e || Se || Jt || gn || ht || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Ln, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  ya,
                  {
                    filter: Re ? Pe : ie,
                    onFilterChange: Tl,
                    totalCount: Ie.totalCount,
                    sortOptions: q ? Zl : Us,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: mn,
                    zoomLevel: (Yn - 225) / 50,
                    onZoomChange: (Me) => nn(Math.round(225 + Me * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Xl : ao,
                    customFieldEntityType: Fe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: sa,
                    onObjectFilterChange: (Me) => {
                      Ln || (K.current = Fe === "video" ? Zc(
                        Me,
                        Ur,
                        b.view.objectFilter
                      ) : Me);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Yc, { page: re, pages: te, onPage: Fl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(me, { children: [
                se && /* @__PURE__ */ a(
                  Xc,
                  {
                    mode: "multiple",
                    disabled: $e || Se || It || !!he || gn || ht,
                    onChange: () => En({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Cf,
                  {
                    options: q ? Lp : Pp,
                    value: mn,
                    onChange: (Me) => _r(Ms(Me, Fe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Ti,
                {
                  disabled: $e || !!he,
                  items: ji(ue ?? b, {
                    onSelect: qo,
                    disabled: Se || Jt || gn || !C
                  })
                }
              ),
              queueDiffers: W ? (ze == null ? void 0 : ze.id) === S : void 0,
              queueChange: !he && (ze == null ? void 0 : ze.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Fa ? $l : void 0,
                saveDisabled: $e || Se || !!Re || Ue || !C,
                onReset: Il,
                resetDisabled: $e || Se || Ue
              } : void 0,
              chipsAfter: (Xe = (xe = se == null ? void 0 : se.presentation) == null ? void 0 : xe.binParents) != null && Xe.length || (Ht = (ft = se == null ? void 0 : se.presentation) == null ? void 0 : ft.filterBins) != null && Ht.length ? /* @__PURE__ */ u(me, { children: [
                !!((Ct = se.presentation.binParents) != null && Ct.length) && /* @__PURE__ */ a(
                  pp,
                  {
                    videos: Ie.items,
                    review: se,
                    savedObjectFilter: (ue ?? se).view.objectFilter,
                    trees: oe.ids,
                    disabled: $e || Se || Ue,
                    onToggle: Ki
                  }
                ),
                /* @__PURE__ */ a(
                  hp,
                  {
                    review: se,
                    savedObjectFilter: (ue ?? se).view.objectFilter,
                    queueFilter: ie,
                    queueCount: Se || Re ? null : Ie.totalCount,
                    disabled: $e || Se || Ue,
                    countsPaused: $e || Se || Ue || !W,
                    onToggle: Ki
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          No,
          se && oe.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: oe.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && on && /* @__PURE__ */ a(
              Qc,
              {
                drawerRef: qn,
                draft: on,
                onChange: (Me) => kt((cn) => cn && { ...cn, draft: Me }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Me) => kt(
                  (cn) => cn && {
                    ...cn,
                    draft: { ...cn.draft, view: { ...cn.draft.view, startFrom: Me } }
                  }
                ),
                tagGroups: k,
                trees: Sr,
                saving: he.saving,
                saveDisabled: Se || !!Re,
                error: he.error,
                dirty: bo,
                criteriaChanged: Fa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Re && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Re,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Bi, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Ol(),
                onCancel: Rl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Ma}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !Ie.items.length && /* @__PURE__ */ a(Ps, { label: "Loading review queue…" }),
                    Re && !Se && /* @__PURE__ */ a(
                      Ls,
                      {
                        message: Re,
                        retryLabel: Jt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Jt && ue && Le(ue) === "video") {
                            const Me = Pr(ue);
                            ba(ue.id, { ...Me, filter: { ...Me.filter, page: void 0 } }), st((cn) => cn + 1);
                            return;
                          }
                          Bi();
                        }
                      }
                    ),
                    !$e && !Se && !Re && !Ie.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(io, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ie.items.length && /* @__PURE__ */ a("div", { ref: Oa, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: mn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Yn}px` },
                        children: Ie.items.map(Pl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: go, children: /* @__PURE__ */ a(
                    _c,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: k,
                      trees: Sr,
                      isDisabled: Bt,
                      paused: !!he,
                      busy: $e || Se,
                      onApply: (Me) => void ye(Me),
                      onFind: () => _t(!0),
                      status: $e ? `Applying action to ${po}…` : "",
                      summary: /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Mt.size ? `${Mt.size} selected` : pt == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Oe.length || E,
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
                          /* @__PURE__ */ a(_n, { "aria-hidden": "true" }),
                          yr
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
  function Pl(b) {
    var R, z, te;
    if (Fe === "tag") {
      const re = b;
      return /* @__PURE__ */ a(
        Gp,
        {
          tag: re,
          displayMode: mn === "list" ? "list" : "grid",
          focused: re.id === pt,
          selected: Mt.has(re.id),
          setRef: (Z) => {
            Z ? jt.current.set(re.id, Z) : jt.current.delete(re.id);
          },
          onFocus: () => bt(re.id),
          onToggle: () => {
            X((Z) => za(Z, re.id)), F(re.id, !1);
          },
          onOpen: () => window.open(`/tag/${re.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        re.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Vp,
      {
        video: ml(q, se, oe.ids),
        showTagBins: ((z = (R = se == null ? void 0 : se.presentation) == null ? void 0 : R.annotations) == null ? void 0 : z.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: mn,
        cardsScroll: ho,
        focused: q.id === pt,
        selected: Mt.has(q.id),
        setRef: (re) => {
          re ? jt.current.set(q.id, re) : jt.current.delete(q.id);
        },
        onFocus: () => bt(q.id),
        onToggle: () => X((re) => za(re, q.id)),
        onPreview: () => {
          he || (bt(q.id), lt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Up(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function za(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Bp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Kp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Gp({
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
  return /* @__PURE__ */ a(
    "article",
    {
      ref: o,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${r ? ", selected" : ""}`,
      onFocus: i,
      onClick: (f) => {
        i(), f.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${r ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ a(
        ed,
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
function Vp({
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
  var v, w;
  const p = kl(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Tt(() => {
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
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          td,
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
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(zp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function zp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [o, i] = T(!1), [s, c] = T(!1), [l, f] = T(!1);
  return ee(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), c(!0);
      return;
    }
    const p = t ? d.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => i(y.isIntersecting),
      { root: p, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
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
    return we(Qd(e.id), {
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
      src: Hd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Jp({
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
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: k,
  onFindOpenChange: O
}) {
  const x = $(null), B = $a(), C = $(null), D = $(null), P = e.files[0], ne = kl(e), J = (L) => o || i || "steps" in L && L.steps.length > 0 && !c || sr(L) && !l;
  qi({
    surface: "overlay",
    enabled: !k,
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
    if (k || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
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
      !L.repeat && !o && !i && (L.key === "ArrowUp" && p && y(), L.key === "ArrowDown" && h && N());
    else return;
    Vr(L);
  }
  function M(L) {
    const W = x.current, Q = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !W || !Q || !W.contains(Q) || Q.closest(".dq-player, .dq-find-action") || L.detail === 0 || W.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (k) return;
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
                disabled: !p || o || i,
                onClick: y,
                children: [
                  /* @__PURE__ */ a(Aa, { "aria-hidden": "true" }),
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
                disabled: !h || o || i,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(St, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ws, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(Xr, {}) }),
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
                children: /* @__PURE__ */ a(Ys, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(Ea, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ a(
            Bs,
            {
              autostart: !0,
              streamUrl: jo("video", e.id),
              posterUrl: ts(e),
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
          ) : /* @__PURE__ */ a("img", { src: ts(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            _c,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: J,
              busy: o || i,
              onApply: (L) => void w(L),
              onFind: () => O(!0),
              status: o ? `Applying action to ${_}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ a(
          Ei,
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
async function Hp() {
  const e = await we("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function Ps({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(pd, { className: "dq-spin" }),
    e
  ] });
}
function Ls({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(_n, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const nh = { components: { DataQualityPage: jp } };
export {
  jp as DataQualityPage,
  nh as default,
  lr as objectFiltersEqual
};
