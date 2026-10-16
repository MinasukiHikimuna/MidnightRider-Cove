var Kl = Object.defineProperty;
var zl = (e, t, n) => t in e ? Kl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Zi = (e, t, n) => zl(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as ge, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as Z, useLayoutEffect as Tt, useMemo as qe, useCallback as wn, useSyncExternalStore as ci, useId as at, createContext as Vl, useContext as Jl, Fragment as li } from "react";
import { useKeySequence as Hl, EntityReferenceMultiSelector as ir, SortableList as Js, TagBadge as Ql, EntityReferenceSelector as es, EntityDetailTabs as Wl, FilterDialog as Hs, VIDEO_CRITERIA as co, DetailListToolbar as qa, PERFORMER_CRITERIA as di, AUDIO_CRITERIA as Qs, NarrativeText as Yl, AUDIO_SORT_OPTIONS as Xl, VIDEO_SORT_OPTIONS as Ws, AudioPlayer as Zl, VideoPlayer as Ys, formatDuration as Xs, getResolutionLabel as ed, ConfirmDialog as td, TAG_CRITERIA as nd, TAG_SORT_OPTIONS as rd, TagTile as ad, VideoCard as od } from "@cove/runtime/components";
import { Search as Ca, Flag as jn, Check as ra, Pencil as ta, Ban as Za, ChevronDown as ui, Plus as Ta, Pin as Zs, GripVertical as ec, AlertTriangle as Dn, Copy as tc, Trash2 as lo, X as Ia, Mic as id, Users as nc, Tag as rc, Headphones as ac, Film as uo, ChevronLeft as $a, MoreHorizontal as sd, RectangleHorizontal as cd, LayoutGrid as fi, ChevronRight as oc, Save as ld, RotateCcw as dd, Layers as ts, Undo2 as ud, RefreshCw as fd, ExternalLink as ic, SkipForward as pd, Upload as hd, Download as sc, ArrowUp as md, ArrowDown as gd, Loader2 as bd, List as yd, Grid3X3 as wd } from "@cove/runtime/lucide-react";
import { extensionFetch as vd } from "@cove/runtime/api";
import { createPortal as Nd } from "react-dom";
const pi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, hi = Object.keys(
  pi
);
function Sa(e) {
  return e === "excludes" || e === "excludesAll";
}
function fo(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function cc(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function qd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const eo = { min: 115, max: 625 }, Sd = (e) => Math.min(eo.max, Math.max(eo.min, e)), lc = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ce(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function mi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return mi(De(e));
}
function kd(e) {
  return De(e) === "video";
}
function De(e) {
  return e.entityType ?? "video";
}
const rr = [
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
], po = [
  rr.slice(0, 11),
  rr.slice(11, 22),
  rr.slice(22)
];
function va(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ka(e) {
  return va(e) ?? e.toLocaleUpperCase();
}
const ar = "none";
function Tr(e) {
  return typeof e == "string" && rr.includes(e);
}
function gi(e) {
  const t = e.shortcut;
  return Tr(t) || t === ar ? t : "auto";
}
function dc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = gi(s);
    if (l !== ar) {
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
  const i = rr.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function Ed(e, t, n) {
  const { keys: r, actionOn: o } = dc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Tr(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Tr));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Tr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Ea(e) {
  var n;
  return Ce(e) && !fc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !kd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : De(e) !== "tag" && e.actions.some(
    (r) => bi(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => Un(r, De(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const Ad = {
  video: 1e3,
  audio: 250
};
function Bt(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Ad[t], n(e.perPage, 40))
    )
  };
}
function ns(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function nr(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ce(e) ? [e.entityType, ...r, e.occurrence] : De(e) === "video" ? r : [De(e), ...r]
  );
}
function Un(e, t) {
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
  ) && !bi(e) : !1;
}
function Cd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function _n(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function cr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function uc(e) {
  return "steps" in e && e.steps.length > 0;
}
function or(e) {
  return "steps" in e ? e.steps.some((t) => _n(t.mode)) : !1;
}
function bi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (_n(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ra(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || lc.includes(n.entityType)) && (!Cd(n.entityType) || fc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && Td(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Un(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Un(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Ea(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function Td(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= eo.min && n.cardSize <= eo.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function rs(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function Id(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function as(e, t, n) {
  return { ...structuredClone(e), id: n, name: Id(e.name, t) };
}
function fc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && hi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || $d(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function $d(e) {
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
function os(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function is(e, t, n, r) {
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
function Rd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function Od(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function sn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Md(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Fd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function xd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Pd(e, t) {
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
const pc = "ext:com.midnightrider.data-quality:configuration", Ld = "ext:cove-data-quality:video-reviews", Bo = "ext:com.midnightrider.data-quality:progress";
class to extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    Zi(this, "remote");
    this.remote = r;
  }
}
function hc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof to ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Oa = /* @__PURE__ */ new Map(), Ga = /* @__PURE__ */ new Map(), Er = (e, t) => e.includes("*") || e.includes(t), no = (e) => ve(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Dd = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Go(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Hr(e) {
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
    reviews: Ra(JSON.stringify(t.reviews)),
    deletedIds: Go(t.deletedIds),
    importedIds: Go(t.importedIds)
  };
}
function _d(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = Ra(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Go(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function mc(e) {
  const t = await ve("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function yi(e, t) {
  const n = (Ga.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ga.set(e, n), n.finally(() => {
    Ga.get(e) === n && Ga.delete(e);
  }).catch(() => {
  }), n;
}
let ba = null;
function jd() {
  if (ba) return ba;
  const e = Ud();
  return ba = e, e.finally(() => {
    ba === e && (ba = null);
  }).catch(() => {
  }), e;
}
async function Ud() {
  const e = await ve("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return yi(t, () => Bd(e, t));
}
async function Bd(e, t) {
  var h;
  const n = String(e.user.id), r = Er(e.permissions, "savedfilters.read"), o = r && Er(e.permissions, "savedfilters.write"), i = r ? (await no(pc)).filter((g) => g.name === "Data Quality configuration").sort((g, w) => g.id - w.id) : [];
  if (i.length > 1) {
    const g = (w) => {
      const { revision: N, ...v } = Hr(w.uiOptions);
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
  let s = i.length ? Hr(i[0].uiOptions) : Dd();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = Hr(l));
  let d = !i.length;
  if (i.length && f && l) {
    const g = Hr(l);
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
      reviews: rs(s.reviews, g.reviews).filter(
        (N) => !w.includes(N.id)
      ),
      deletedIds: w,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), w = _d(n);
    if (i.length && w.reviews.some((E) => {
      const O = s.reviews.find((F) => F.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await no(Ld)).flatMap(
      (E) => Ra(E.uiOptions ?? "[]")
    ) : [], v = w.known.filter(
      (E) => !w.reviews.some((O) => O.id === E)
    ), y = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: rs(
        w.reviews,
        s.reviews,
        N.filter(
          (E) => !w.known.includes(E.id) && !s.importedIds.includes(E.id)
        )
      ).filter((E) => !y.has(E.id)),
      deletedIds: [...y],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...w.known,
          ...N.map((E) => E.id)
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
  if (Oa.set(t, p), d && o) {
    const g = s;
    i.length && (p.config = Hr(i[0].uiOptions)), await gc(t, g), s = p.config;
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
    canWrite: Er(e.permissions, "videos.write"),
    canWriteVideos: Er(e.permissions, "videos.write"),
    canWriteAudios: Er(e.permissions, "audios.write"),
    canWriteTags: Er(e.permissions, "tags.write"),
    canReadTagGroups: Er(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function gc(e, t) {
  const n = Oa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await mc(n), n.recordId != null) {
      const i = await ve(
        `/api/savedfilters/${n.recordId}`
      ), s = Hr(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new to(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const o = await ve(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: pc,
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
const Wr = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), Gd = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Wr(e, n) !== Wr(t, n)
);
function Kd(e, t) {
  return yi(e, async () => {
    const n = Oa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config;
    try {
      return await zd(n, e, t);
    } catch (o) {
      throw n.config = r, o;
    }
  });
}
async function zd(e, t, n) {
  var r;
  for (let o = 1; ; o++) {
    const i = e.config.reviews, s = n(i);
    if (s === i) return i;
    Ra(JSON.stringify(s));
    const c = i.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
    try {
      return await gc(t, {
        ...e.config,
        reviews: s,
        deletedIds: [
          .../* @__PURE__ */ new Set([...e.config.deletedIds, ...c])
        ].filter((l) => !s.some((f) => f.id === l))
      }), s;
    } catch (l) {
      const f = l instanceof to ? l.remote : void 0;
      if (!f || o >= 3) throw l;
      const d = Gd(i, s).find(
        (p) => Wr(i, p) !== Wr(f.reviews, p) && Wr(f.reviews, p) !== Wr(s, p)
      );
      if (d !== void 0) {
        const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
        throw new to(
          f.reviews.some((h) => h.id === d) ? `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.` : `“${p ?? "This review"}” was deleted in another browser. Reload the page to see the reviews as they are now.`
        );
      }
      e.config = f;
    }
  }
}
function ss(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && !Number.isFinite(t.cardSize) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t.cardSize === null ? t : { ...t, cardSize: Sd(t.cardSize) };
}
async function Vd(e, t) {
  const n = Oa.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? ss(r) : null;
  if (!n.readable) return o;
  const i = (await no(Bo)).find(
    (c) => c.name === t
  ), s = i ? ss(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function Jd(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return yi(r, async () => {
    const o = Oa.get(e);
    if (!(o != null && o.writable)) return;
    await mc(o);
    const i = (await no(Bo)).find(
      (s) => s.name === t
    );
    await ve(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Bo,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function lr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Hd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Gn(e) {
  return Hd[e];
}
const ro = "confirmed_absent_tags", wi = "Confirmed absent tags", ho = "confirmed_absent_occurrence_tags", bc = {
  key: ro,
  label: wi,
  type: "tag",
  subject: "tag assessments"
}, vi = {
  key: ho,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Qd = {
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
function Bn(e) {
  return Array.isArray(e) ? e.map(Bn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Qd[n] ?? n : t === "key" && typeof n == "string" && [
        ro,
        ho
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Bn(n)
    ])
  ) : e;
}
async function yc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await vd(e, { ...t, headers: r });
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
  return await yc(e, t, "fail");
}
function Wd(e, t = {}) {
  return yc(e, t, "null");
}
const Yd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Xd = 0;
function ao(e, t) {
  return ve(
    `/api/${lr(e)}/${t}?dqRead=${Yd}-${++Xd}`,
    { cache: "no-store" }
  );
}
function wc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Bn({
      findFilter: Bt(t, _e(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Yr(e, t, n) {
  return ve(
    `/api/${lr(_e(e))}/find`,
    { method: "POST", signal: n, body: wc(e, t) }
  );
}
async function Ni(e, t, n) {
  return (await ve(
    `/api/${lr(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: wc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function $o(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, ve("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Bn({
        findFilter: Bt(t),
        objectFilter: r
      })
    )
  });
}
function Zd(e) {
  return ve("/api/taggroups", { signal: e });
}
function Ko(e, t, n = 1280) {
  return `/api/${lr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function zo(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function cs(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function eu(e) {
  return `/api/stream/video/${e}/preview`;
}
function tu(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function mo(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ve(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await ve("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Bn({
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
async function qi(e, t) {
  const n = cr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await mo(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function nu(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Si(e, t) {
  const r = (await ve("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = nu(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Gn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function vc(e, t) {
  const n = await Si(e, t);
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
function Nc(e = "video") {
  return Si(bc, e);
}
function ru(e = "video") {
  return vc(bc, e);
}
function qc(e = "video") {
  return Si(vi, e);
}
function au(e = "video") {
  return vc(vi, e);
}
function oo(e) {
  return [...new Set(e)];
}
function Sc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === ho
  ), o = r === void 0 ? [] : n[r];
  return oo(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function ou(e) {
  let t;
  try {
    t = await qc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${vi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function iu(e, t, n, r, o, i) {
  await ve(`/api/${lr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: oo(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function su(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${wi} custom field is not available.`
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
async function kc(e, t, n) {
  if (!Un(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Gn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (or(t)) {
    let l;
    try {
      l = await Nc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${wi} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (l.kind !== "ready") throw new Error(l.message);
    r = l.definition.key;
  }
  const o = oo(n), i = (await qi(t)).map((l) => ({
    mode: l.mode,
    tagIds: oo(l.tagIds)
  })), c = [
    ...i.filter((l) => !_n(l.mode)),
    ...i.filter((l) => _n(l.mode))
  ].map(
    (l) => su(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await ve(`/api/${lr(e)}/bulk`, {
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
async function cu(e, t) {
  if (!Un(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ve("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ka = (e) => e >= "0" && e <= "9";
function ls(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function ds(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (Ka(e[n]) && Ka(t[r])) {
      const c = n, l = r;
      for (; n < e.length && Ka(e[n]); ) n++;
      for (; r < t.length && Ka(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(l, r).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const i = ls(e[n]), s = ls(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ec(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || ds(e.tagGroupName, t.tagGroupName) || ds(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Ir(e) {
  return [...e].sort(Ec);
}
const Vo = /* @__PURE__ */ new Map();
function lu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function ki(e, t, n) {
  const r = cr(e), o = [], i = [];
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
    ...i.filter((h) => !_n(h.mode)),
    ...i.filter((h) => _n(h.mode))
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
function du(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Ir(t);
}
function Ac(e) {
  return Cc(lu(e));
}
function Cc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return Z(() => (i.current = !0, () => {
    i.current = !1;
  }), []), Z(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), mo([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function At(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Rr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = At(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function us(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => At(t.group) !== "");
}
function Tc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Ic(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function $c(e) {
  return cr(e).size > 0 || Ic(e).size > 0;
}
function uu(e) {
  return Rr(e).filter(
    (t) => !t.actions.some((n) => $c(e[n]))
  );
}
function Jo(e, t) {
  const n = Tc(t), r = new Set(t.absent);
  return Rr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...cr(e[c])], f = [...Ic(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function Ho(e) {
  return e.filter((t) => t.answers.length === 0);
}
function fu(e, t, n) {
  const r = { ids: [...Tc(t)], absent: t.absent }, o = ki(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const Xr = "review";
function pu(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function hu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Ar(e, t) {
  const n = new Set(pu(e));
  return t.filter((r) => n.has(r.id));
}
function fs(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Ar(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(Xr, () => ({
        key: Xr,
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
    ...i.filter((s) => s.key === Xr),
    ...i.filter((s) => s.key !== Xr)
  ];
}
function Qo(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function Ei(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => Qo(s.key, s.members, o) && !(c > i && Qo(o.key, o.members, s))
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
function mu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Qo(n.key, n.tagIds ?? [], e)
  );
}
function Rc(...e) {
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
    ...n.filter((r) => r.key === Xr),
    ...n.filter((r) => r.key !== Xr)
  ];
}
function gu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function Oc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = gu(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function bu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => Oc(o, r, n))
  );
}
function yu(e, t, n) {
  return t.filter((r) => r.tagIds !== null && Oc(e, r, n));
}
function wu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function Ai(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [wu(e.mixed)] : []
  ];
}
function vu(e) {
  const t = Ai(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Nu(e, t, n) {
  const r = Ar(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Wo = "-", ps = "Ctrl+a", qu = "Ctrl/⌘A", Su = ["f", "g", "k", "n", "m", ",", "."], Ro = "Shift+", Mc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, ku = new Set(Object.values(Mc).flat()), hs = { Comma: ",", Period: "." };
function Eu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(hs, t.code) ? hs[t.code] : void 0;
}
function aa(e) {
  return qe(() => dc(e), [e]);
}
function Ci({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = aa(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  Tt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = rr.filter(
    (h) => s.actionOn.has(h) || Su.includes(h)
  ).join(" "), p = qe(() => {
    const h = (N, v) => {
      var E, O;
      const y = c.current;
      if (N === ps) (E = y.onSelectAll) == null || E.call(y);
      else if (N === Wo) (O = y.onFind) == null || O.call(y);
      else {
        const F = ku.has(N), B = F || N.startsWith(Ro), C = F ? Eu(v) : B ? N.slice(Ro.length) : N, D = C === void 0 ? void 0 : y.keyMap.actionOn.get(C);
        D !== void 0 && y.onAction(D, B);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (y) => {
        y != null && y.repeat || h((y == null ? void 0 : y.sequence) ?? N, y);
      }
    }), w = [];
    f && w.push(g(ps, "local")), l && w.push(g(Wo));
    for (const N of d ? d.split(" ") : []) {
      const v = Mc[N];
      w.push(g(N), ...(v ?? [`${Ro}${N}`]).map((y) => g(y)));
    }
    return w;
  }, [e, d, l, f]);
  Hl(p, t);
}
const Au = {
  find: Wo,
  selectAll: qu
};
function Ti() {
  return Au;
}
const Cu = 600 * 1e3, Ii = /* @__PURE__ */ new Map(), Fc = /* @__PURE__ */ new Map(), tr = /* @__PURE__ */ new Map();
function xc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Fc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Pc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Fc.set(e.tagGroupId, e.tagGroupSortOrder), Ii.set(e.id, { tag: e, at: Date.now() });
}
function Lc(e) {
  const t = Ii.get(e);
  if (!(!t || Date.now() - t.at > Cu))
    return xc(t.tag);
}
function Dc(e) {
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
function Yo(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Pc(Dc({ ...n, name: r }));
  }
}
function Tu(e) {
  const t = tr.get(e);
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
        if (tr.get(e) === r && tr.delete(e), !i) return null;
        const s = Dc({ ...o, id: e, name: i }), c = (p = Ii.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Pc(f), xc(f);
      },
      () => (tr.get(e) === r && tr.delete(e), null)
    )
  };
  return tr.set(e, r), r;
}
function ms() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Oo(e) {
  const t = {};
  for (const n of e) {
    const r = Lc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Iu(e, t) {
  if (t != null && t.aborted) return Promise.reject(ms());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = Lc(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = Tu(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && tr.get(f) === d && (tr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), i(ms()));
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
function _c(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ma(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = T(() => ({
    key: t,
    tags: Oo(Mo(t))
  }));
  return Z(() => {
    const o = Mo(t), i = Oo(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return Iu(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Oo(Mo(t));
}
function oa(e) {
  const t = Ma(e);
  return qe(() => _c(t), [t]);
}
function Mo(e) {
  return e ? e.split(",").map(Number) : [];
}
const $u = "(max-width: 760px)";
function jc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = wn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return ci(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Fa() {
  return jc($u);
}
function Ru(e, t, n = !1) {
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
function Mr(e, t, n = [], r) {
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
  const o = cr(e), i = (s) => o.has(s) || [...o].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => Ru(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function go(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function $i({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = Fa(), [f, d] = T(""), [p, h] = T(0), g = $(null), w = $(null), N = $(null), v = $(null), y = $(null), E = $(/* @__PURE__ */ new Set()), O = at(), F = oa(qe(() => go(e), [e])), B = aa(e), C = qe(() => {
    const j = f.trim().toLocaleLowerCase(), z = (M) => M ? rr.indexOf(M) : rr.length;
    return e.map((M, _) => ({ action: M, index: _, key: B.keys[_] })).sort((M, _) => z(M.key) - z(_.key)).filter((M) => !j || M.action.label.toLocaleLowerCase().includes(j));
  }, [e, B, f]), D = C.length ? Math.min(p, C.length - 1) : -1, P = (j) => `${O}-option-${j}`;
  Tt(() => {
    var j, z, M;
    return v.current = document.activeElement, y.current = ((z = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : z.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var L;
      const _ = v.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((L = y.current) != null && L.isConnected) && y.current.focus({ preventScroll: !0 });
    };
  }, []), Z(() => {
    var j, z, M;
    D < 0 || (M = (z = (j = w.current) == null ? void 0 : j.querySelector(`[id="${P(C[D].index)}"]`)) == null ? void 0 : z.scrollIntoView) == null || M.call(z, { block: "nearest" });
  }, [D, C]);
  function ne(j, z) {
    !j || r != null && r(j.action) || s(j.action, o && z);
  }
  function J(j) {
    var M;
    j.stopPropagation();
    const z = j.code || j.key;
    if (j.repeat || E.current.add(z), !sn(j)) {
      if (j.repeat && !E.current.has(z)) {
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
            /* @__PURE__ */ a(Ca, { "aria-hidden": "true" }),
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
                  onClick: (M) => ne(j, M.shiftKey || i && uc(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(ge, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": va(j.key) ? !0 : void 0, children: j.key }),
                      va(j.key) && /* @__PURE__ */ u(ge, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: va(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Mr(j.action, F, t, n).map(
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
function Uc() {
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
function Ri(e) {
  return ci(e.subscribe, e.get, e.get);
}
function Bc(e, t) {
  const n = $(t);
  Tt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Gc(e, t) {
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
const Ou = [], Xo = po.map(
  (e, t) => ({ indent: t, keys: e })
), gs = Xo.length - 1;
function Ct({ binding: e, hidden: t }) {
  const n = t ? void 0 : va(e), r = /* @__PURE__ */ a(
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
function za(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Kc(e) {
  return po.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function zc({
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
function Vc({
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
          /* @__PURE__ */ a(Ca, { "aria-hidden": "true" }),
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
function Mu({
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
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a(ra, { "aria-hidden": "true" }),
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
function Fu({ checked: e, onChange: t }) {
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
function xu({
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
  attention: p = Ou,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const w = Ti(), N = aa(e), v = Fa();
  Bc(i, v);
  const y = at(), E = oa(
    qe(() => e.flatMap((k) => k.steps.flatMap((le) => le.tagIds)), [e])
  ), O = Xo.filter((k) => k.keys.some((le) => N.actionOn.has(le))), F = O.includes(Xo[gs]), B = e.length - N.actionOn.size, C = qe(
    () => d && !f ? Rr(e) : [],
    [d, f, e]
  ), D = qe(
    () => C.length && r ? Jo(e, r) : null,
    [C, e, r]
  ), P = new Map(
    Ho(D ?? []).flatMap(
      (k) => k.actions.filter((le) => $c(e[le])).map((le) => [le, k.name])
    )
  ), ne = qe(
    () => e.map((k) => f ? [] : yu(k, p, o)),
    [e, p, o, f]
  ), J = (k) => k.map(vu).join("; "), j = ne.map(J), z = C.length > 0 && /* @__PURE__ */ a(
    Mu,
    {
      groups: C,
      statuses: D,
      actions: e,
      attentionOf: (k) => J([
        ...new Map(
          k.actions.flatMap((le) => ne[le]).map((le) => [le.key, le])
        ).values()
      ])
    }
  ), M = (k) => {
    const le = Mr(e[k], E, [], o).map((ue) => ue.text).join(", "), A = P.get(k), X = j[k];
    return [
      le,
      A === void 0 ? "" : `${A}: not answered yet`,
      X ? `Needs attention: ${X}` : ""
    ].filter(Boolean).join(". ");
  }, _ = (k) => j[k] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${j[k]}`,
        children: /* @__PURE__ */ a(jn, {})
      }
    )
  ) : null, L = (k) => ({
    onMouseEnter: () => i.set(k),
    onMouseLeave: () => i.clear(k),
    onFocus: () => i.set(k),
    onBlur: () => i.clear(k)
  }), Y = (k) => {
    const le = N.actionOn.get(k), A = le === void 0 ? void 0 : e[le];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(Ct, { binding: k, hidden: !0 })
        },
        k
      );
    const X = t(A), ue = `${y}-effect-${k}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : L(A), children: [
      /* @__PURE__ */ a("span", { id: ue, className: "dq-sr-only", children: M(le) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": k,
          "aria-describedby": ue,
          "data-group-open": P.has(le) || void 0,
          "data-attention": j[le] ? !0 : void 0,
          disabled: X,
          onClick: (me) => s(A, me.shiftKey),
          children: [
            /* @__PURE__ */ a(Ct, { binding: k }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            za(A) && " ",
            za(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", title: "Marks absent", children: [
              /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-pad-marker-text", children: "absent" })
            ] }),
            _(le)
          ]
        }
      )
    ] }, k);
  }, Q = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(ta, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const k = Kc(N), le = (A) => {
      const X = e[A], ue = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": ue,
          "aria-describedby": `${y}-effect-${ue}`,
          "data-group-open": P.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(X),
          onClick: (me) => {
            i.clear(X), s(X, me.shiftKey || h && uc(X));
          },
          ...f ? {} : Gc(i, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            za(X) && " ",
            za(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
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
              bs,
              {
                actions: e,
                keyMap: N,
                names: E,
                tags: r,
                trees: o,
                preview: i,
                findKey: w.find,
                mobile: !0
              }
            ),
            g && /* @__PURE__ */ a(Fu, { checked: h, onChange: g })
          ] }),
          z,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            zc,
            {
              groups: k,
              renderAction: le,
              find: /* @__PURE__ */ a(
                Vc,
                {
                  extra: B,
                  findKey: w.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: k.flat().map((A) => /* @__PURE__ */ a("span", { id: `${y}-effect-${N.keys[A]}`, children: M(A) }, A)) })
        ]
      }
    );
  }
  const oe = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), H = !F && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": B ? `Find action, ${B} more` : "Find action",
      "aria-keyshortcuts": w.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(Ct, { binding: w.find }),
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
            bs,
            {
              actions: e,
              keyMap: N,
              names: E,
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
              oe,
              H
            ] })
          ) : /* @__PURE__ */ u(ge, { children: [
            !f && oe,
            H
          ] })
        ] }),
        O.map((k) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": k.indent, children: [
          k.keys.map(Y),
          k.indent === gs && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": w.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(Ct, { binding: w.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(Ca, { "aria-hidden": "true" }),
                  B ? `${B} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, k.indent))
      ]
    }
  );
}
function bs({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const l = Ri(i), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(ge, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(Ct, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? ki(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(Ct, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Mr(l, n, [], o).map((g, w) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, w)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Jc({
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
  const w = Ti(), N = aa(e), v = Fa(), y = at(), E = oa(qe(() => go(e), [e])), [O] = T(() => Uc());
  Bc(O, v);
  const F = $(null), B = Pu(F, e, !v), C = Kc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), P = e.length - D.length, ne = (M) => Mr(M, E, t, n).map((_) => _.text).join(", "), J = (M) => ({
    onMouseEnter: () => O.set(M),
    onMouseLeave: () => O.clear(M),
    onFocus: () => O.set(M),
    onBlur: (_) => {
      _.currentTarget.contains(_.relatedTarget) || O.clear(M);
    }
  }), j = l ?? (v ? void 0 : f), z = (M) => {
    const _ = e[M];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: _.label,
        "aria-keyshortcuts": N.keys[M] || void 0,
        "aria-describedby": `${y}-effect-${M}`,
        disabled: g || r(_),
        onClick: () => {
          O.clear(_), i(_);
        },
        ...g ? {} : Gc(O, _),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: _.label })
      },
      _.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: F,
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
                zc,
                {
                  groups: C,
                  renderAction: z,
                  find: /* @__PURE__ */ a(
                    Vc,
                    {
                      extra: P,
                      findKey: w.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((M, _) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                M.map((L) => {
                  const Y = e[L], Q = N.keys[L];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${y}-effect-${L}`,
                      disabled: g || r(Y),
                      onClick: () => i(Y),
                      ...g ? {} : J(Y),
                      children: [
                        Q && /* @__PURE__ */ a(Ct, { binding: Q }),
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
                    "aria-keyshortcuts": w.find,
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(Ct, { binding: w.find, hidden: !0 }),
                      /* @__PURE__ */ a(Ca, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(ta, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Lu,
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
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((M) => /* @__PURE__ */ a("span", { id: `${y}-effect-${M}`, children: ne(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Pu(e, t, n) {
  const [r, o] = T(!1);
  return Tt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, g = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), w = [...i.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((P) => P.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, y = i.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (y ? y.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (D) => w.map((P) => {
        let ne = 1, J = 0;
        for (const j of P)
          J > 0 && J + v + j > D ? (ne += 1, J = j) : J += (J > 0 ? v : 0) + j;
        return ne;
      }), F = (D) => Math.max(1, D.reduce((P, ne) => P + ne, 0)), B = O(g), C = F(O(g - E));
      o(
        1 + F(B) < C || 1 + F(B) === C && B.every((D) => D === 1)
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
function Lu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = Ri(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(Ct, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Mr(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const ys = 1e3;
async function Du(e, t, n) {
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
          Bn({
            findFilter: {
              page: l,
              perPage: ys,
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
    if (l * ys >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = _e(e), c = Ce(e) ? await ju(
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
function _u(e) {
  return JSON.stringify(
    Bn({
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
async function ju(e, t, n) {
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
              `/api/${lr(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: _u(t[c])
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
function Uu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Bu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Gu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of cr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Ku(e, t, n) {
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
function zu(e, t) {
  var r;
  const n = At(e);
  return ((r = Rr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Vu = (e) => e instanceof Error ? e.message : "Request failed.";
function Ju({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), g = $(/* @__PURE__ */ new Map());
  Z(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const w = Gn(_e(t)), N = Ce(t), v = N ? "performer" : w.one;
  function y(M) {
    var L;
    (L = g.current.get(M)) == null || L.abort();
    const _ = new AbortController();
    g.current.set(M, _), l((Y) => ({ ...Y, [M]: { status: "loading" } })), Du(t, M, _.signal).then(
      (Y) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        _.signal.aborted || l((Q) => ({
          ...Q,
          [M]: { status: "failed", message: Vu(Y) }
        }));
      }
    );
  }
  function E(M) {
    var oe;
    const _ = i.filter((H) => !M.includes(H));
    for (const H of _)
      (oe = g.current.get(H)) == null || oe.abort(), g.current.delete(H);
    const L = (H) => {
      const k = c[H];
      return (k == null ? void 0 : k.status) === "ready" ? k.group.children.map((le) => le.id) : [];
    }, Y = new Set(M.flatMap(L)), Q = _.flatMap(L).filter((H) => !Y.has(H));
    d(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([k]) => !Q.includes(Number(k)))
      )
    ), h(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([k]) => M.includes(Number(k)))
      )
    ), l(
      (H) => Object.fromEntries(
        Object.entries(H).filter(([k]) => M.includes(Number(k)))
      )
    ), s(M);
    for (const H of M) i.includes(H) || y(H);
  }
  const O = i.flatMap((M) => {
    const _ = c[M];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), F = O.length === i.length, B = i.some(
    (M) => {
      var _;
      return (((_ = c[M]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Uu(O).map((M) => [M.parent.id, M])
  ), D = Bu(O), P = new Map(O.map((M) => [M.parent.id, M.parent.name])), ne = Gu(t.actions), J = (M) => f[M] ?? !ne.has(M), j = F ? [...C.values()].flatMap((M) => {
    const _ = zu(M.parent.name, t.actions);
    return M.children.filter((L) => J(L.id)).map((L) => ({ child: L, answerGroup: _ }));
  }) : [], z = (M, _) => d((L) => ({
    ...L,
    ...Object.fromEntries(M.children.map((Y) => [Y.id, _]))
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
      ir,
      {
        entityType: "tag",
        values: i,
        onChange: E,
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
              onClick: () => y(M),
              children: "Retry"
            }
          )
        ] }, M);
      const L = C.get(M);
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
                checked: p[M] ?? !1,
                disabled: n,
                onChange: (Q) => h((oe) => ({
                  ...oe,
                  [M]: Q.target.checked
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
              const oe = ne.get(Q.id) ?? [], H = (D.get(Q.id) ?? []).filter((k) => k !== M).map((k) => `“${P.get(k)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: J(Q.id),
                    disabled: n,
                    onChange: (k) => d((le) => ({
                      ...le,
                      [Q.id]: k.target.checked
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
                  oe.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    oe[0].label || "New action",
                    "”",
                    oe.length > 1 ? ` and ${oe.length - 1} more` : ""
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
              ({ child: M, answerGroup: _ }) => Ku(
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
function Hu(e, t, n, r) {
  const o = At(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: At(c) === o });
    return i;
  }
  const s = At(r);
  for (const c of t)
    At(c).includes(s) && i.push({ kind: "group", name: c, selected: At(c) === o });
  return s && !t.some((c) => At(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Qu(e) {
  return e.kind === "group" ? `group:${At(e.name)}` : e.kind;
}
function Wu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Yu = /* @__PURE__ */ new Set([
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
]), Xu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Va = 4, ws = 240;
function Zu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function ef(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function tf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), w = $(!1), N = $(!1), [v, y] = T(!1), [E, O] = T(null), [F, B] = T(null), [C, D] = T(!1), P = e.group ?? "", ne = qe(
    () => Hu(t, n, P, E),
    [t, n, P, E]
  ), J = ne.map(Qu), j = F === null ? -1 : J.indexOf(F), z = (A) => `${s}-option-${A}`, M = (A) => o(A ? { ...e, group: A } : Wu(e)), _ = () => {
    var X;
    const A = ((X = d.current) == null ? void 0 : X.value) ?? P;
    A.trim() !== A && M(A.trim());
  };
  function L(A) {
    O(null), B(A), y(!0);
  }
  const Y = (A) => {
    var X, ue;
    return A instanceof Node && (((X = l.current) == null ? void 0 : X.contains(A)) || ((ue = p.current) == null ? void 0 : ue.contains(A))) === !0;
  };
  function Q() {
    var A, X;
    (A = p.current) != null && A.contains(document.activeElement) && ((X = h.current) == null || X.focus({ preventScroll: !0 })), y(!1), O(null), B(null), D(!1);
  }
  function oe(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), Q();
  }
  function H() {
    const A = f.current, X = p.current;
    if (!A || !X) return;
    const ue = A.getBoundingClientRect(), me = window.visualViewport, K = (me == null ? void 0 : me.offsetTop) ?? 0, Ae = (me ? me.offsetTop + me.height : window.innerHeight) - ue.bottom - Va, ke = ue.top - K - Va, Ne = Math.min(X.scrollHeight, ws), Je = Ae < Ne && ke > Ae;
    X.style.left = `${ue.left}px`, X.style.width = `${ue.width}px`, X.style.top = `${Je ? ue.top - Va : ue.bottom + Va}px`, X.style.transform = Je ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(ws, Je ? ke : Ae))}px`, ef(A, X, ue, g.current) || Q();
  }
  Tt(() => {
    var A;
    v && (f.current && (g.current = Zu(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
  }, [v]), Tt(() => {
    v && H();
  }), Z(() => {
    if (!v) return;
    const A = () => H(), X = (K) => {
      Y(K.target) || Q();
    }, ue = [...g.current, window], me = window.visualViewport;
    for (const K of ue) K.addEventListener("scroll", A);
    return window.addEventListener("resize", A), me == null || me.addEventListener("resize", A), me == null || me.addEventListener("scroll", A), document.addEventListener("pointerdown", X), () => {
      for (const K of ue) K.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), me == null || me.removeEventListener("resize", A), me == null || me.removeEventListener("scroll", A), document.removeEventListener("pointerdown", X);
    };
  }, [v]), Z(() => {
    var A, X, ue;
    j >= 0 && ((ue = (X = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : X.scrollIntoView) == null || ue.call(X, { block: "nearest" }));
  }, [j]);
  function k(A) {
    if (sn(A)) return;
    const X = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (X && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), L(A.altKey ? null : At(P) ? `group:${At(P)}` : "none");
      return;
    }
    if (v)
      if (X) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && Q();
          return;
        }
        const ue = A.key === "ArrowDown" ? 1 : -1, me = E !== null && At(E) && J.length > 1 ? 1 : 0, K = j < 0 ? ue > 0 ? me : J.length - 1 : (j + ue + J.length) % J.length;
        B(J[K]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? oe(ne[j]) : (_(), Q()));
  }
  function le(A) {
    var ue;
    if (A.key === "Tab") {
      Q(), A.shiftKey && ((ue = d.current) == null || ue.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || sn(A) && !Xu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const me = d.current;
      me && (me.focus(), me.setSelectionRange(me.value.length, me.value.length));
      return;
    }
    !Yu.has(A.key) && !sn(A) && D(!1), k(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || sn(A) || (A.preventDefault(), A.stopPropagation(), Q());
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
                  M(A.target.value), O(A.target.value), B(null), y(!0);
                },
                onClick: () => {
                  v || L(null);
                },
                onKeyDown: k,
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
                  const X = document.activeElement === d.current;
                  v ? Q() : (N.current = A && !X, L(null)), (!A || X) && ((ue = d.current) == null || ue.focus());
                },
                children: /* @__PURE__ */ a(ui, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item. When a chosen performer's items answer a group in two different ways, their Existing answers mark the group Mixed." : "A group is one question with one answer per item." }),
        v && Nd(
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
              onKeyDown: le,
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
                  onClick: () => oe(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(ra, { className: "dq-combobox-check", "aria-hidden": "true" })
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
const er = [
  ...po,
  ["auto", ar]
];
function Hc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : gi(e[n]);
}
function nf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = T(!1), c = $(null), l = n.keys[t], f = Hc(e, n, t), d = Tr(f), p = n.duplicatePins.has(t) ? ` (${ka(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${ka(l)}, ${d ? "pinned" : "Auto"}${p}` : f === ar ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
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
          l ? /* @__PURE__ */ a(Ct, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Zs, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      rf,
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
function rf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], l = Hc(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Tt(() => {
    var N, v, y;
    (N = p(c || l)) == null || N.focus(), (y = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || y.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Tr(N) && d(N), (v = p(N)) == null || v.focus();
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
    const v = (P = N.target.dataset) == null ? void 0 : P.choice, y = v ? er.findIndex((ne) => ne.includes(v)) : -1;
    if (!v || y < 0) return;
    const E = er[y].indexOf(v), O = (ne) => ne == null ? void 0 : ne[Math.min(E, ne.length - 1)], F = {
      ArrowLeft: er[y][E - 1],
      ArrowRight: er[y][E + 1],
      ArrowUp: O(er[y - 1]),
      ArrowDown: O(er[y + 1]),
      Home: er[y][0],
      End: er[y].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const B = F[N.key];
    B && h(B);
  }
  const w = (N) => {
    const v = Tr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: gi(e[v]) === N
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: po.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((y) => {
            const E = w(y), O = E ? `${E.own ? "this action" : E.label}, ${E.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${E ? "" : " dq-key-choice-free"}${E != null && E.own ? " dq-key-choice-own" : ""}`,
                "data-choice": y,
                tabIndex: y === f ? 0 : -1,
                "aria-label": `${ka(y)}: ${O}`,
                "aria-pressed": !!(E != null && E.own && E.pinned),
                title: E ? `${E.label} (${E.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(y),
                onClick: () => o(y),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Ct, { binding: y }),
                    (E == null ? void 0 : E.pinned) && /* @__PURE__ */ a(Zs, { "aria-hidden": "true" })
                  ] }),
                  E && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: E.label })
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
                "data-choice": ar,
                tabIndex: 0,
                "aria-pressed": l === ar,
                onClick: () => o(ar),
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
const af = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function of(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function sf(e, t) {
  if (Un(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (bi(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Qc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function cf(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function lf({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const l = De(e), f = l !== "tag", d = e.actions, p = aa(d), h = oa(qe(() => go(d), [d])), g = qe(
    () => f ? Rr(d).map((K) => K.name) : [],
    [f, d]
  ), w = d.findIndex((K) => K.id === i), N = qe(
    () => f && w >= 0 ? Rr(
      d.filter((K, ye) => ye !== w)
    ).map((K) => K.name) : [],
    [f, d, w]
  ), v = f && e.stayUntilGroupsAnswered === !0, y = qe(
    () => new Set(
      v ? uu(d).map((K) => K.key) : []
    ),
    [v, d]
  ), [E, O] = T(""), [F, B] = T(!1), [C, D] = T(
    null
  ), P = at(), ne = `${P}-from-tags`, J = $(null), j = $(null), z = $(null), M = $(null), _ = $(/* @__PURE__ */ new WeakMap()), L = (K) => {
    let ye = _.current.get(K);
    return ye || (ye = crypto.randomUUID(), _.current.set(K, ye)), ye;
  }, Y = E.trim().toLocaleLowerCase(), Q = Y ? d.filter((K) => K.label.toLocaleLowerCase().includes(Y)) : d, oe = (K) => t({ ...e, actions: K }), H = (K, ye) => oe(d.map((Ae, ke) => ke === K ? ye : Ae));
  function k(K) {
    var ye;
    return [...((ye = z.current) == null ? void 0 : ye.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ae) => Ae.dataset.actionId === K
    );
  }
  function le(K, ye) {
    const Ae = k(K), ke = Ae == null ? void 0 : Ae.querySelector(
      ye === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  Tt(() => {
    var ye;
    const K = M.current;
    K && (M.current = null, (K === "add" || !le(K.id, K.part)) && ((ye = j.current) == null || ye.focus()));
  }), Z(() => {
    !c || !i || (Q.some((K) => K.id === i) ? le(i, "label") : (O(""), M.current = { id: i, part: "label" }));
  }, [c]);
  function A() {
    const K = cf(l);
    O(""), oe([...d, K]), s(K.id), M.current = { id: K.id, part: "label" };
  }
  function X(K) {
    const ye = d[K], { shortcut: Ae, ...ke } = structuredClone(ye), Ne = {
      ...ke,
      ...Ae === ar ? { shortcut: Ae } : {},
      id: crypto.randomUUID(),
      label: `${ye.label} copy`
    };
    oe([...d.slice(0, K + 1), Ne, ...d.slice(K + 1)]), s(Ne.id), M.current = { id: Ne.id, part: "label" };
  }
  function ue(K) {
    const ye = d[K], Ae = Q.indexOf(ye), ke = Q[Ae + 1] ?? Q[Ae - 1];
    oe(d.filter((Ne, Je) => Je !== K)), i === ye.id && s(null), M.current = ke ? { id: ke.id, part: "toggle" } : "add";
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
              /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
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
            "aria-expanded": F,
            "aria-controls": F ? ne : void 0,
            onClick: () => {
              D(null), B(!F);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(Ca, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: E,
              onChange: (K) => O(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && E && !sn(K) && (K.preventDefault(), K.stopPropagation(), O(""));
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
    f && F && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || sn(K) || (K.preventDefault(), K.stopPropagation(), me());
        },
        children: /* @__PURE__ */ a(
          Ju,
          {
            id: ne,
            review: e,
            disabled: o,
            onAdd: (K) => {
              const ye = [...d, ...K];
              oe(ye), D({ actions: ye, count: K.length }), me();
            },
            onCancel: me
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: z, children: Q.length > 0 && /* @__PURE__ */ a(
      Js,
      {
        items: Q,
        getKey: (K) => K.id,
        disabled: o || !!Y,
        className: "dq-action-list",
        onReorder: (K) => oe(K),
        renderItem: (K, { dragHandleProps: ye, isOver: Ae }) => {
          const ke = d.indexOf(K), Ne = i === K.id;
          return /* @__PURE__ */ a(
            df,
            {
              action: K,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                nf,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: K.label.trim() || "New action",
                  onChoose: (Je) => oe(Ed(d, ke, Je))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? K.shortcut : void 0,
              groupUnanswerable: "steps" in K && y.has(At(K.group)),
              effect: Mr(K, h, n, r),
              open: Ne,
              detailId: `${P}-detail-${K.id}`,
              dragHandleProps: ye,
              isOver: Ae,
              reorderDisabled: o || !!Y,
              onToggle: () => s(Ne ? null : K.id),
              onDuplicate: () => X(ke),
              onDelete: () => ue(ke),
              children: "steps" in K ? /* @__PURE__ */ a(
                uf,
                {
                  action: K,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Ce(e),
                  saving: o,
                  stepKey: L,
                  rememberStepKey: (Je, pe) => _.current.set(Je, L(pe)),
                  onChange: (Je) => H(ke, Je)
                }
              ) : /* @__PURE__ */ a(
                pf,
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
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function df({
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
  const N = e.label.trim() || "New action", v = sf(e, t), y = "steps" in e && At(e.group) ? e.group.trim() : "";
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
              style: Qc(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(ec, { "aria-hidden": "true" })
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
                title: i.map((E) => E.text).join(" "),
                children: i.map((E, O) => /* @__PURE__ */ a("span", { "data-effect-tone": E.tone, children: E.text }, O))
              }
            ),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", title: v, children: [
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: v })
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ka(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${ka(r)} is pinned twice` })
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(tc, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(lo, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(ui, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: w })
      ]
    }
  );
}
function Wc({
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
function uf({
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
    var g, w;
    const h = d.current;
    h != null && (d.current = null, (w = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || w.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Wc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      tf,
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
          Js,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: g, dragHandleProps: w, isOver: N }) => /* @__PURE__ */ a(
              ff,
              {
                step: h,
                index: g,
                dragHandleProps: w,
                isOver: N,
                saving: o,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((y, E) => E === g ? v : y));
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
              /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function ff({
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
      "data-step-tone": of(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Qc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(ec, { "aria-hidden": "true" }),
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
            children: af.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          ir,
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
            children: /* @__PURE__ */ a(Ia, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function pf({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(Wc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const Yc = Vl(!1);
function hf({ children: e }) {
  return /* @__PURE__ */ a(Yc.Provider, { value: !0, children: e });
}
function tn({ tag: e, name: t }) {
  const n = Jl(Yc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Ql, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function mf({
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
      ir,
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
function gf({
  review: e,
  onChange: t
}) {
  const n = Gn(_e(e)).many, r = e.occurrence, o = cc(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ma([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: qd(r, d) }), f = (d, p) => l(
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
          /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(tn, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            es,
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
            children: /* @__PURE__ */ a(lo, { "aria-hidden": "true" })
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
      es,
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
const Xc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Zc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, bf = {
  video: uo,
  audio: ac,
  tag: rc,
  performerOccurrence: nc,
  audioPerformerOccurrence: id
};
function el({ entityType: e }) {
  const t = bf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Xc[e] });
}
const yf = 2e6;
function tl(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function wf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function Oi(e) {
  tl([e], wf(e));
}
async function vf(e) {
  if (e.size > yf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ra(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function ea(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function nl({
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
          value: De(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: lc.map((s) => /* @__PURE__ */ a("option", { value: s, children: Zc[s] }, s))
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
function Nf(e, t) {
  const n = De(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function qf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), o = at(), i = at();
  return Z(() => {
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
function rl({
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
    () => Ce(e) && e.occurrence.tagIds.length > 0
  ), [E, O] = T(""), [F, B] = T(null), [C, D] = T(0), [P, ne] = T(!1), J = $(null), j = $(null), z = $(null), M = Nf(e, y), _ = De(e), L = qe(() => ea(e), [e]);
  Z(() => O(""), [L]), Z(() => {
    var le, A;
    if (P) return;
    const H = J.current;
    if (J.current = null, !H) return;
    (A = H.isConnected && !!((le = z.current) != null && le.contains(H)) && !(H instanceof HTMLButtonElement && H.disabled) ? H : z.current) == null || A.focus({ preventScroll: !0 });
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
    const H = { ...e, name: e.name.trim() }, k = Ea(H);
    if (!k) {
      O(""), h();
      return;
    }
    if (O(k), !H.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = j.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const le = e.actions.find(
      (A) => !Un(A, _)
    );
    le && (v("Actions"), B(le.id), D((A) => A + 1));
  }
  const oe = E || l;
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
          H.key !== "Escape" || H.defaultPrevented || s || sn(H) || (H.preventDefault(), H.stopPropagation(), Y());
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
                children: /* @__PURE__ */ a(Ia, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Wl,
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
                    nl,
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
                  Ce(e) && /* @__PURE__ */ a(gf, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => Oi(e),
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
                children: /* @__PURE__ */ a(Sf, { review: e, onChange: t })
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
                  lf,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: F,
                    onExpand: B,
                    reveal: C
                  }
                )
              }
            ),
            y && Ce(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(mf, { review: e, onChange: t })
              }
            )
          ] }) }),
          (oe || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            oe && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              oe
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
      qf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), g();
        }
      }
    )
  ] });
}
function Sf({
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
  if (De(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        vs,
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
          Ns,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(Ef, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          Ns,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(Af, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        vs,
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
            ir,
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
        ir,
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
      kf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function kf({
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
            children: /* @__PURE__ */ a(lo, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || sn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          Hs,
          {
            open: !0,
            onClose: () => o(null),
            criteria: co,
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
function vs({
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
function Ns({
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
function Ef() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Af() {
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
const Zo = "The queue differs from the saved review.";
function al({
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
  Rf(v);
  const y = Of(v), [E, O] = T({ differs: h, text: "" });
  return E.differs !== h && O({
    differs: h,
    text: h ? E.differs === !1 ? Zo : E.text : ""
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
          children: /* @__PURE__ */ a($a, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Xc[n], children: /* @__PURE__ */ a(el, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(ta, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(Cf, { change: p, onPress: y }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    w && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: w }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: E.text })
  ] });
}
function Cf({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), o = `${Zo} Save these filters to the review.`, i = e.onSave ? `${Zo} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
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
          /* @__PURE__ */ a(ld, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(dd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const Tf = ["queue", "summary", "name", "layout", "range"], If = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, $f = "(min-width: 1400px)";
function Ya(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function qs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = Tf.filter(
    (i) => e.querySelector(If[i])
  );
  for (let i = 1; i <= o.length && !Ya(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ya(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ya(e) ? !0 : (r(), !1);
}
function Rf(e) {
  const t = jc($f), [n, r] = T(0), o = $(!1);
  Tt(() => {
    e.current && (o.current = !qs(e.current, t));
  }, [e, t, n]), Tt(() => {
    const i = e.current;
    i && t && !o.current && !Ya(i) && (o.current = !qs(i, t));
  }), Z(() => {
    const i = e.current;
    if (!i || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(i);
    for (const c of i.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function Of(e) {
  const t = $(!1);
  return Z(() => {
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
function ol({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, o] = T(!1), [i, s] = T(""), c = $(null), l = $(null);
  Z(() => {
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
        children: /* @__PURE__ */ a($a, { "aria-hidden": "true" })
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
          sn(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(oc, { "aria-hidden": "true" })
      }
    )
  ] });
}
function il({
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
          /* @__PURE__ */ a(cd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(fi, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Mf({
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
function Mi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = T(!1), [i, s] = T(!1), c = $(null), l = $(null), f = at();
  Tt(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = l.current.offsetHeight + 12, w = window.innerHeight - h.bottom;
    s(w < g && h.top > w);
  }, [r]), Z(() => {
    var h, g;
    r && ((g = (h = l.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), Z(() => {
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
        children: /* @__PURE__ */ a(sd, { "aria-hidden": "true" })
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
          children: e.map((h) => /* @__PURE__ */ u(li, { children: [
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
function io(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function Fi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function xi(e) {
  return !!String(e ?? "").trim();
}
function Pi(e) {
  return [
    ...new Set(
      io(e.customFieldCriteria).filter(Fi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !xi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Li(e, t) {
  const n = io(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!Fi(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !xi(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function sl(e, t, n) {
  const r = io(e.customFieldCriteria);
  if (!r.length) return e;
  const o = io(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!Fi(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(l[p] ?? "")];
      g && l[h] === g && !xi(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function Ff(e, t, n) {
  if (!Un(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), o = n.steps.some((c) => _n(c.mode)) ? await ou(r) : "", i = await qi(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !_n(l.mode)),
    ...i.filter((l) => _n(l.mode))
  ]) {
    const l = (f) => iu(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await dl(
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
async function Di(e, t) {
  const n = e.occurrence;
  if (fo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ve("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Bn({
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
function cl(e) {
  return Sa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function bo(e, t) {
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
  }, s = cl(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
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
                      key: ho,
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
async function _i(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => mo([n], t))
  );
}
function ll(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function xf(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function Pf(e, t, n, r, o) {
  if (!cl(e)) return !1;
  const i = Sc(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((l) => r.includes(l))
  );
}
async function ji(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || ll(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = _e(e), i = await Yr(
    bo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await _i(c, r) : [], f = new Array(i.items.length);
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
          return xf(e.occurrence, v, l) && !Pf(c, h, w.id, v, l) ? [
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
async function dl(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = _e(e), i = await ao(o, t.media.id);
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
function na(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Lf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function vn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? Sc(
      await ao(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ve(Lf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Yo(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await ao(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  Yo(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === ro
  ) ?? ro, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
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
async function Ui(e, t, n) {
  if (t.occurrence && Ce(e))
    await dl(
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
        `/api/${lr(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Df(e, t, n) {
  t.occurrence && Ce(e) ? await Ff(e, t.occurrence, n) : await kc(_e(e), n, [t.media.id]);
}
function ei(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: na(o(t.ids), o(n.ids)),
    absence: na(o(t.absent), o(n.absent))
  };
}
function _f(e, t) {
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
class ul extends Error {
}
const ti = (e) => e instanceof Error ? e.message : "Request failed.", Ss = (e) => [...e].sort((t, n) => t - n), Aa = (e, t) => JSON.stringify(Ss(e)) === JSON.stringify(Ss(t)), ni = (e) => !!(e.tags.added.length || e.tags.removed.length);
function so(e, t, n, r) {
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
function jf(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Uf(e, t, n, r) {
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
    throw new ul(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Bf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Un(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = Sa(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await _i(o.occurrence, n) : [];
  await Uf(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await qi(h, n)
    }))
  ), l = structuredClone(jf(c));
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
  const d = await Di(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await ji(o, d, h, n);
    for (const w of g.items) {
      const N = {
        ids: [...new Set(w.applications.map((y) => y.tag.id))],
        names: w.applications.map((y) => y.tag.name),
        absent: [],
        applications: w.applications
      }, v = so(N.ids, l, s, !0);
      p.set(w.key, {
        item: { key: w.key, media: w.media, occurrence: w },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: Aa(N.ids, v.desired) ? "unchanged" : "pending"
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
function Gf(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!Aa(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Aa(o(e), o(t));
}
async function fl(e, t, n, r) {
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
function pl(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function hl(e) {
  return e.entries.filter((t) => t.operation);
}
async function Kf(e, t, n, r, o = !1) {
  await fl(
    pl(e, o),
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
        if (s = await vn(_e(e.review), i.item, !1), !Gf(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = ti(h);
        return;
      }
      const c = so(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = na(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Ui(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await vn(_e(e.review), i.item, !1);
        p = !0, i.expected = h;
        const g = ei(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = ni(g) ? g : void 0, d) throw d;
        if (!Aa(
          h.ids.filter((w) => e.touched.includes(w)),
          l.filter((w) => e.touched.includes(w))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = ti(h), !p)
          try {
            const g = await vn(_e(e.review), i.item, !1);
            i.expected = g;
            const w = ei(
              i.item,
              i.before,
              g,
              e.touched
            );
            i.operation = ni(w) ? w : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function zf(e, t, n) {
  await fl(
    hl(e),
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
        _f(o, c), s = !0, await Ui(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await vn(_e(e.review), r.item, !1);
        if (!Aa(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${ti(c)}`, r.status = "failed", s)
          try {
            const l = await vn(_e(e.review), r.item, !1), f = ei(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = ni(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const ml = (e, t) => t.count - e.count || Ec(e, t);
async function Vf(e, t, n) {
  const r = _e(e), o = e.occurrence, [i, s] = await Promise.all([
    ve(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    _i(o, n)
  ]), c = i.filter(
    (w) => w.hostType === r && w.contextType === "performer" && w.contextId === t
  );
  Yo(c.map((w) => w.tag));
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
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(ml);
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
function Jf(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...o].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...cr(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function Bi(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const w of g.tags) r.set(w.id, w);
  const o = (g) => g.flatMap((w) => r.get(w) ?? []).sort(ml), i = (g) => g.members ?? g.tags.map((w) => w.id), s = Rr(t).flatMap((g) => {
    const w = [
      ...new Set(g.actions.flatMap((N) => [...cr(t[N])]))
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
      mixed: Jf(g.id, N, t, n) ? c({ key: w, name: g.name, members: N, tags: g.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((y) => y.answers.every((E) => v.has(E))).flatMap(
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
const Fo = { summary: null, error: "" };
function gl(e, t, n = 0) {
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
    value: Fo
  });
  return Z(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Fo }), e === null || t === null) return;
    const c = new AbortController();
    return Vf(e, t, c.signal).then((l) => {
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
  }, [o, n]), i.key === o ? i.value : Fo;
}
function Hf(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = mu(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => o.add(h.name));
  }
  const i = At(e.name), s = [...r].filter((f) => At(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function Qf(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function ri({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = Vo,
  flags: i = [],
  className: s = ""
}) {
  const c = Gn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Bi(e, r, o) : [], d = Ei(f), p = (h) => [
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
          const g = h.kind === "other" ? [] : p(h.members), w = Hf(h, d), N = w.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: w.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Qf(h, w),
                  children: [
                    /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(tn, { tag: v }),
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
function Zr({
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
const ks = 5;
function Wf(e, t) {
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
const Es = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), ai = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], As = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Yf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, xo = 250;
function wa(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Xf({ step: e }) {
  const t = ai.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: ai.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(ra, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Cs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(li, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function ya({
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
function Ts({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Ir(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(tn, { tag: o })
    ] }) }, `added-${o.id}`)),
    Ir(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(tn, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function Is({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > xo && /* @__PURE__ */ u("span", { children: [
        "First ",
        xo.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, xo).map((i) => {
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
                wa(i, n)
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
function $s(e) {
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
function Zf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [w, N] = T([]), [v, y] = T(!1), [E, O] = T(!1), [F, B] = T(""), [C, D] = T(!1), [P, ne] = T(""), [J, j] = T(null), [z, M] = T(null), [_, L] = T([]), [Y, Q] = T(0), oe = $(null), H = $(null), k = $(null), le = $(!1), A = $(!1), X = $(null), ue = $(!1), me = $(!1), K = $({ onClose: i });
  K.current = { onClose: i };
  const ye = at(), Ae = l === "run", ke = (J == null ? void 0 : J.kind) === "undo", Ne = Ae && d ? d.review : e, Je = aa(Ne.actions), pe = Ne.occurrence, ot = _e(Ne), Ze = Gn(ot), Mt = Ze.queue, Jt = Ae && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !or(I))
  ), Ht = Jt.filter((I) => w.includes(I.id)), rt = pe.targetMode === "selected" && pe.performerIds.length === 1, Be = gl(
    Ne,
    s && rt ? pe.performerIds[0] : null,
    Y
  ), Ge = Pi(Ne.view.objectFilter), et = Ma(
    s ? [...go(Jt), ...pe.conditionTagIds, ...Ge] : []
  ), dr = qe(() => _c(et), [et]), wt = (I) => h[I] ?? et[I] ?? { id: I, name: `Tag ${I}` }, Kn = JSON.stringify(
    Object.fromEntries(
      Ge.flatMap((I) => {
        var ie;
        const G = (ie = et[I]) == null ? void 0 : ie.name;
        return G ? [[String(I), G]] : [];
      })
    )
  ), tt = qe(
    () => Li(Ne.view.objectFilter, JSON.parse(Kn)),
    [Ne.view.objectFilter, Kn]
  );
  Z(() => {
    var I, G, ie;
    s && ((I = oe.current) == null || I.showModal(), (ie = (G = oe.current) == null ? void 0 : G.querySelector(".dq-batch-answer input")) == null || ie.focus());
  }, [s]), Z(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var de;
      const G = oe.current, ie = document.activeElement;
      if (!G || ie && ie !== document.body && G.contains(ie)) return;
      (de = (l === "answers" ? G.querySelector(".dq-batch-answer input:checked") ?? G.querySelector(".dq-batch-answer input") : G.querySelector("[data-batch-focus]")) ?? H.current) == null || de.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, E, d]), Z(() => {
    if (s || t || !le.current) return;
    const I = requestAnimationFrame(() => {
      const G = k.current;
      if (!le.current || !G || G.disabled) return;
      le.current = !1;
      const ie = document.activeElement;
      (!ie || ie === document.body) && G.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), Z(() => {
    if (!s || pe.targetMode !== "selected") return;
    const I = new AbortController();
    return L([]), Wf(pe.performerIds.slice(0, ks), I.signal).then((G) => {
      I.signal.aborted || L(G);
    }).catch(() => {
    }), () => I.abort();
  }, [s, pe.targetMode, JSON.stringify(pe.performerIds)]), Z(
    () => () => {
      var I;
      A.current = !0, (I = X.current) == null || I.abort();
    },
    []
  ), Z(() => {
    if (!E) return;
    const I = (G) => {
      G.preventDefault(), G.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Te() {
    f("answers"), p(null), g({}), j(null), y(!1), N([]), ne(""), B(""), D(!1), M(null);
  }
  function Ke() {
    me.current || (c(!1), K.current.onClose(ue.current), ue.current = !1, Te(), le.current = !0);
  }
  function ze(I, G) {
    N(
      (ie) => G ? [...ie, I] : ie.filter((re) => re !== I)
    ), p(null), g({}), ne(""), B(""), D(!1), M(null);
  }
  function Ft() {
    f("answers"), M(null), ne("");
  }
  function ur() {
    f("preview"), d || $n();
  }
  function cn() {
    var I;
    A.current = !0, (I = X.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function xt(I) {
    M(
      (G) => (G == null ? void 0 : G.group) === I.group && G.reason === I.reason ? null : I
    );
  }
  const vt = (I, G) => (z == null ? void 0 : z.group) === I && z.reason === G;
  async function $n() {
    if (!Ht.length || me.current) return;
    me.current = !0, O(!0), B(""), D(!1), ne("Loading all matching occurrences…"), p(null), g({}), M(null);
    const I = new AbortController();
    X.current = I;
    try {
      const G = await Bf(
        e,
        Ht,
        I.signal,
        (re) => ne(`Loaded ${re.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const ie = {};
      for (const re of G.entries)
        for (const de of re.before.applications ?? [])
          ie[de.tag.id] = de.tag;
      g(ie), p(G), ne("Preview ready. No tags have been changed.");
    } catch (G) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : G instanceof Error ? G.message : String(G)
      ), D(!I.signal.aborted && G instanceof ul), ne("");
    } finally {
      me.current = !1, O(!1), X.current = null;
    }
  }
  async function Nn(I) {
    if (!d || me.current) return;
    const G = (I === "undo" ? hl(d) : pl(d, I === "retry")).length;
    me.current = !0, A.current = !1, ue.current = !0, O(!0), f("run"), B(""), j({ kind: I, total: G, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const ie = () => j((de) => de && { ...de, done: de.done + 1 });
    let re = !1;
    try {
      I === "undo" ? await zf(d, () => A.current, ie) : await Kf(d, v, () => A.current, ie, I === "retry");
      const { counts: de } = $s(d.entries), Re = de.skipped + de.failed;
      ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? `Batch undo finished.${de.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${de.changed.toLocaleString()} changed`,
          de.unchanged && `${de.unchanged.toLocaleString()} unchanged`,
          de.skipped && `${de.skipped.toLocaleString()} skipped`,
          de.failed && `${de.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${Re ? " Inspect them below." : ""}`
      );
    } catch (de) {
      re = !0, ne(""), B(de instanceof Error ? de.message : String(de));
    } finally {
      me.current = !1;
      const de = A.current || re;
      j((Re) => Re && { ...Re, stopped: de }), O(!1), Q((Re) => Re + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], It = qe(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        so(I.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Qt = (I) => It.get(I.item.key), ln = (I) => na(I.before.ids, Qt(I).desired), qn = (I) => {
    const G = ln(I);
    return I.status === "pending" && (G.added.length > 0 || G.removed.length > 0);
  }, Ve = (I) => I.conflict || Qt(I).kept.length > 0 || Qt(I).replaced.length > 0, $t = qe(() => {
    const I = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: I.filter(qn).length,
      correct: I.filter((G) => G.status === "unchanged").length,
      different: I.filter(Ve).length,
      hosts: new Set(I.map((G) => G.item.media.id)).size,
      added: [...new Set(I.flatMap((G) => ln(G).added))],
      removed: [...new Set(I.flatMap((G) => ln(G).removed))]
    };
  }, [It]), fe = qe(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((I) => I.item.media.date).sort((I, G) => I.item.media.date.localeCompare(G.item.media.date)),
    [d]
  ), U = Ae ? $s(he) : null, xe = (I) => Je.keys[Ne.actions.findIndex((G) => G.id === I)] ?? "", Nt = (I) => Mr(I, dr, [], r), Sn = Sa(pe.condition) && pe.includeSubtags !== !1 && pe.conditionTagIds.length > 0, se = fe[0], Pt = fe.length > 1 ? fe[fe.length - 1] : void 0, Gt = (I) => `/${ot}/${I.item.media.id}`, zn = rt ? _[0] : void 0, kn = qe(
    () => n ? Rc(
      n,
      Be.summary ? Ei(
        Bi(Be.summary, Ne.actions, r ?? Vo)
      ) : []
    ) : [],
    [n, Be.summary, Ne.actions, r]
  ), En = bu(Ht, kn, r ?? Vo), dn = n ?? [], je = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: qn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ve }
  };
  function He() {
    const I = Yf[pe.condition], G = !!I && pe.conditionTagIds.length > 0, ie = pe.performerIds.slice(0, ks), re = String(Ne.view.filter.q ?? "").trim(), de = pe.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      fo(pe) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : pe.targetMode === "selected" ? /* @__PURE__ */ u(ge, { children: [
        ie.map((Re, Ie) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Zr, { performer: { id: Re, name: _[Ie] ?? "" } }),
          _[Ie] ?? "…"
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
              qa,
              {
                filter: {},
                objectFilter: pe.performerFilter,
                criteriaDefinitions: di,
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
        G ? I : pi[pe.condition],
        G && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Ir(pe.conditionTagIds.map(wt)).map((Re) => /* @__PURE__ */ a(tn, { tag: Re }, Re.id)) })
      ] }),
      G && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: pe.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Sa(pe.condition) && pe.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: de, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          de
        ] })
      ] }),
      re && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        re,
        "”"
      ] }),
      Object.keys(Ne.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Mt} filters`,
          children: /* @__PURE__ */ a(
            qa,
            {
              filter: Ne.view.filter,
              objectFilter: tt,
              criteriaDefinitions: ot === "audio" ? Qs : co,
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
  function ut(I, G, ie = !0) {
    if (!I.length) return null;
    const re = /* @__PURE__ */ a("strong", { children: zn || "This performer" }), de = ie ? `Check the earliest and latest ${Ze.many} before applying, or narrow the batch with a date filter.` : "", Re = I.every((Ie) => Ie.tagIds === null && !Ie.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Re ? /* @__PURE__ */ u("p", { children: [
          re,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Ie) => Ie.flags).join(", ") }),
          ".",
          " ",
          de
        ] }) : /* @__PURE__ */ u(ge, { children: [
          /* @__PURE__ */ u("p", { children: [
            re,
            " needs attention where the chosen answers apply.",
            de && ` ${de}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Ie) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Ie.tagIds === null ? "Whole review" : Ie.name }),
            ":",
            " ",
            Ai(Ie).join("; ")
          ] }, Ie.key)) })
        ] }),
        G && se && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: Gt(se), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            wa(se, ot),
            " · ",
            se.item.media.date
          ] }),
          Pt && /* @__PURE__ */ u("a", { href: Gt(Pt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            wa(Pt, ot),
            " · ",
            Pt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Rt() {
    const I = En.filter((ie) => ie.tagIds === null), G = En.filter((ie) => ie.tagIds !== null);
    return /* @__PURE__ */ u(ge, { children: [
      He(),
      ut(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${rt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Jt.map((ie, re) => {
            const de = xe(ie.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: w.includes(ie.id),
                  "aria-labelledby": `${ye}-answer-${re}`,
                  "aria-describedby": `${ye}-effect-${re}`,
                  onChange: (Re) => ze(ie.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: de && /* @__PURE__ */ a(Ct, { binding: de, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ye}-answer-${re}`,
                    className: "dq-batch-answer-label",
                    title: ie.label,
                    children: ie.label
                  }
                ),
                /* @__PURE__ */ a(Cs, { id: `${ye}-effect-${re}`, parts: Nt(ie) })
              ] })
            ] }, ie.id);
          }) })
        ] }),
        rt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: ut(G, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            ri,
            {
              ...Be,
              mediaKind: ot,
              actions: Ne.actions,
              trees: r,
              flags: dn,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Vn(I) {
    const G = $t, ie = z && Es.has(z.group) ? z.group : null, re = ie ? he.filter(je[ie].test) : [], de = (Re) => {
      const Ie = Qt(Re), $e = Ie.skipped ? na(
        Re.before.ids,
        so(Re.before.ids, I.action, I.categories, !0).desired
      ) : ln(Re), Lt = !$e.added.length && !$e.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Ie.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Lt ? !Ie.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(Ts, { added: $e.added, removed: $e.removed, tag: wt }),
        Ie.kept.map((be, ft) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Ir(be.existing.map(wt)).map((Se) => /* @__PURE__ */ a(tn, { tag: Se }, Se.id)),
          " ",
          "instead of",
          " ",
          Ir(be.tagIds.map(wt)).map((Se) => /* @__PURE__ */ a(tn, { tag: Se }, Se.id))
        ] }, ft))
      ] });
    };
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            ya,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${G.hosts.toLocaleString()} ${G.hosts === 1 ? Mt : `${Mt}s`}`,
              pressed: vt("matching"),
              onToggle: () => xt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            ya,
            {
              value: G.willChange,
              label: "will change",
              tone: "add",
              pressed: vt("change"),
              onToggle: () => xt({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            ya,
            {
              value: G.correct,
              label: "already correct, no write",
              pressed: vt("correct"),
              onToggle: () => xt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            ya,
            {
              value: G.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: vt("different"),
              onToggle: () => xt({ group: "different" })
            }
          )
        ] }),
        re.length > 0 ? /* @__PURE__ */ a(
          Is,
          {
            title: je[ie].title,
            entries: re,
            mediaKind: ot,
            resultHeading: "Planned change",
            describe: de
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: se ? `Dates ${se.item.media.date}${Pt ? ` to ${Pt.item.media.date}` : ""}` : "No dates" }),
          se && /* @__PURE__ */ a(
            "a",
            {
              href: Gt(se),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ze.one}, ${se.item.media.date}`,
              title: wa(se, ot),
              children: "Open earliest"
            }
          ),
          Pt && /* @__PURE__ */ a(
            "a",
            {
              href: Gt(Pt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ze.one}, ${Pt.item.media.date}`,
              title: wa(Pt, ot),
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
            Ts,
            {
              added: G.added,
              removed: G.removed,
              tag: wt,
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
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => y(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => y(!0), children: "Replace it" })
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
  function Rn() {
    return /* @__PURE__ */ u(ge, { children: [
      He(),
      ut(En, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${rt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ye}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ye}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: Ft, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ht.map((I) => {
            const G = xe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                G && /* @__PURE__ */ a(Ct, { binding: G, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(Cs, { parts: Nt(I) })
            ] }, I.id);
          }) })
        ] }),
        rt && /* @__PURE__ */ a(
          ri,
          {
            ...Be,
            mediaKind: ot,
            actions: Ne.actions,
            trees: r,
            flags: dn,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Vn(d)
    ] });
  }
  function nn(I) {
    const G = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, ie = G.kind === "apply" ? he.length - I.counts.pending : G.done, re = G.kind === "apply" ? he.length : G.total, de = E ? G.kind === "undo" ? "Undoing batch…" : G.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : G.kind === "undo" ? G.stopped ? "Undo stopped" : "Undo finished" : G.stopped ? "Stopped" : "Finished", Re = re ? Math.round(ie / re * 100) : 100, Ie = z && !Es.has(z.group) ? z.group : null, $e = (be) => As.find((ft) => ft.status === be).label, Lt = Ie ? he.filter(
      (be) => be.status === Ie && (!z.reason || be.error === z.reason)
    ) : [];
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: de }),
          /* @__PURE__ */ u("span", { children: [
            ie.toLocaleString(),
            " of ",
            re.toLocaleString(),
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
            "aria-valuemax": re,
            "aria-valuenow": ie,
            children: /* @__PURE__ */ a("span", { style: { width: `${Re}%` } })
          }
        ),
        !E && G.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
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
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: As.map((be) => /* @__PURE__ */ a(
          ya,
          {
            value: I.counts[be.status],
            label: G.kind === "undo" && be.status === "unchanged" ? "As before" : be.label,
            tone: be.tone,
            pressed: vt(be.status),
            onToggle: () => xt({ group: be.status })
          },
          be.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((be) => {
          const ft = vt(be.status, be.error);
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
                "aria-expanded": ft,
                onClick: () => xt({ group: be.status, reason: be.error }),
                children: ft ? "Hide them" : "Show them"
              }
            )
          ] }, `${be.status}-${be.error}`);
        }) }),
        Lt.length > 0 ? /* @__PURE__ */ a(
          Is,
          {
            title: z.reason ? `${$e(Ie)}: ${z.reason}` : `${$e(Ie)} occurrences`,
            entries: Lt,
            mediaKind: ot,
            resultHeading: "Result",
            describe: (be) => be.error ?? $e(be.status)
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
            onClick: () => void Nn("undo"),
            children: [
              /* @__PURE__ */ a(ud, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? G.stopped || E ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
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
        disabled: !Ht.length,
        onClick: ur,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: cn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !$t.willChange,
        onClick: () => void Nn("apply"),
        children: [
          "Apply to ",
          $t.willChange.toLocaleString(),
          " ",
          $t.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Ft, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void $n(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: cn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(li, { children: [
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
  return /* @__PURE__ */ u(hf, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: k,
        title: Jt.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !Jt.length,
        onClick: () => {
          Te(), o(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(ts, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: oe,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ye}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Ke();
        },
        onClose: () => {
          var I;
          me.current ? (I = oe.current) == null || I.showModal() : Ke();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(ts, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ye}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: E,
                onClick: Ke,
                children: /* @__PURE__ */ a(Ia, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Xf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: H,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${ai.find((I) => I.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  P && /* @__PURE__ */ a("p", { role: "status", children: P }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                l === "answers" ? Rt() : l === "preview" ? Rn() : nn(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: Ft, children: [
              /* @__PURE__ */ a($a, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Te, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ke, children: "Close" }),
            Jn()
          ] })
        ]
      }
    )
  ] });
}
const bl = "data-quality.description-collapsed.v1";
function ep() {
  try {
    return localStorage.getItem(bl) === "true";
  } catch {
    return !1;
  }
}
function tp({
  details: e,
  label: t
}) {
  const [n, r] = T(ep), o = wn(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(bl, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Yl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const np = (e) => "";
function rp({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = np,
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
          children: /* @__PURE__ */ a(fd, { "aria-hidden": "true" })
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
            /* @__PURE__ */ a(Zr, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(jn, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const ap = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], op = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function ip(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Ja(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function sp(e, t) {
  const n = fo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ja(r, "or")}`,
    includesAll: `has ${Ja(r, "and")}`,
    excludes: `has none of ${Ja(r, "or")}`,
    excludesAll: `missing ${Ja(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function cp({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = at(), h = oa(e.conditionTagIds), g = sp(e, h);
  Tt(() => {
    const y = f.current;
    if (!i || !y) return;
    const E = () => l(ip(y));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), F = [y, y.closest(".dq-review-header-trail"), y.closest("header")];
    for (const B of F) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", E), O == null || O.disconnect();
    };
  }, [i]), Z(() => {
    var E, O;
    if (!i) return;
    const y = (E = d.current) == null ? void 0 : E.querySelector('[aria-pressed="true"]');
    y && !y.disabled ? y.focus() : (O = d.current) == null || O.focus();
  }, [i]);
  const w = () => {
    s(!1), requestAnimationFrame(() => {
      var y;
      return (y = f.current) == null ? void 0 : y.focus();
    });
  }, N = (y) => {
    if (!(y.target instanceof Element && y.target.closest('[role="dialog"]') !== d.current || y.defaultPrevented || sn(y))) {
      if (y.key === "Escape")
        y.preventDefault(), w();
      else if (y.key === "Tab" && d.current) {
        const O = [...d.current.querySelectorAll(op)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
          (D, P) => D.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const F = O[0], B = O[O.length - 1], C = document.activeElement;
        y.shiftKey && (C === F || C === d.current) ? (y.preventDefault(), B.focus()) : !y.shiftKey && C === B && (y.preventDefault(), F.focus());
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
          /* @__PURE__ */ a(nc, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
          /* @__PURE__ */ a(ui, { "aria-hidden": "true" })
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: ap.map(({ mode: y, label: E }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === y,
                  onClick: () => e.targetMode !== y && r({ targetMode: y }),
                  children: E
                },
                y
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                ir,
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
                  qa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: di,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (y) => r({ performerFilter: y })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(ta, { "aria-hidden": "true" }),
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
                  children: hi.map((y) => /* @__PURE__ */ a("option", { value: y, children: pi[y] }, y))
                }
              ),
              v && /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ a(
                  ir,
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
                  Sa(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function Xa(e) {
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
function lp(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function dp(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Wd(
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
            Bn({
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
const up = 3e3, Rs = 250;
async function fp(e, t, n, r) {
  const o = bo(e, t);
  if (await Ni(o, o.view.filter, n) > up) return null;
  const { sorts: i, seed: s, ...c } = e.view.filter, l = {
    ...e,
    view: {
      ...e.view,
      filter: { ...c, perPage: Rs, sort: "id", direction: "asc" }
    }
  }, f = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    n.throwIfAborted();
    const p = await ji(l, t, d, n);
    for (const h of p.items)
      f.set(h.performer.id, (f.get(h.performer.id) ?? 0) + 1);
    if (r(f), d * Rs >= p.totalCount) return f;
  }
}
function yl(e, t, n) {
  const r = bo(e, [t]);
  return Ni(r, r.view.filter, n);
}
function wl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function oi(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function pp(e, t, n, r, o = {}) {
  const i = Xa(e), s = lp(e), c = ll(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await dp(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = l;
  if (l.cursor === 0 && !l.ranked.length && f.length > 1) {
    const w = new Map(f.map((y) => [y.id, y])), N = (y) => [...y].flatMap(([E, O]) => {
      const F = w.get(E);
      return F && O > 0 ? [{ ...F, count: O }] : [];
    }).sort((E, O) => O.count - E.count || E.name.localeCompare(O.name)), v = await fp(
      e,
      fo(e.occurrence) ? null : f.map((y) => y.id),
      r,
      (y) => {
        var E;
        return (E = o.onProgress) == null ? void 0 : E.call(o, { ...l, ranked: N(y), limit: n, complete: !1, partial: !0 });
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
    complete: !w && oi(f, p, d, n),
    ...w ? { partial: w } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var w;
        for (; !h && !oi(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await yl(e, N.id, r);
          v > 0 && wl(d, { ...N, count: v }), (w = o.onProgress) == null || w.call(o, g(!0));
        }
      })
    );
  } catch (w) {
    throw h = !0, w;
  }
  return r.throwIfAborted(), g(!1);
}
function hp(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && wl(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: oi(e.candidates, e.cursor, o, e.limit)
  };
}
const ii = /* @__PURE__ */ new Map();
function mp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function vl(e, t) {
  const n = mp(t);
  return ii.set(e, n), n;
}
function gp(e) {
  const [t, n] = T(null);
  if (Z(() => {
    if (e === null || ii.has(e)) return;
    const r = new AbortController();
    return ve(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = vl(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return ii.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Po = { exports: {} }, Os;
function bp() {
  return Os || (Os = 1, (function(e) {
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
          var p, h, g = {}, w = {}, N = "", v = "", y = "", E = 2, O = 3, F = 2, B = [], C = 0, D = 0, P;
          for (P = 0; P < l.length; P += 1)
            if (N = l.charAt(P), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, w[N] = !0), v = y + N, Object.prototype.hasOwnProperty.call(g, v))
              y = v;
            else {
              if (Object.prototype.hasOwnProperty.call(w, y)) {
                if (y.charCodeAt(0) < 256) {
                  for (p = 0; p < F; p++)
                    C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                  for (h = y.charCodeAt(0), p = 0; p < 8; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < F; p++)
                    C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                  for (h = y.charCodeAt(0), p = 0; p < 16; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                }
                E--, E == 0 && (E = Math.pow(2, F), F++), delete w[y];
              } else
                for (h = g[y], p = 0; p < F; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              E--, E == 0 && (E = Math.pow(2, F), F++), g[v] = O++, y = String(N);
            }
          if (y !== "") {
            if (Object.prototype.hasOwnProperty.call(w, y)) {
              if (y.charCodeAt(0) < 256) {
                for (p = 0; p < F; p++)
                  C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                for (h = y.charCodeAt(0), p = 0; p < 8; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < F; p++)
                  C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                for (h = y.charCodeAt(0), p = 0; p < 16; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              }
              E--, E == 0 && (E = Math.pow(2, F), F++), delete w[y];
            } else
              for (h = g[y], p = 0; p < F; p++)
                C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
            E--, E == 0 && (E = Math.pow(2, F), F++);
          }
          for (h = 2, p = 0; p < F; p++)
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
          var p = [], h = 4, g = 4, w = 3, N = "", v = [], y, E, O, F, B, C, D, P = { val: d(0), position: f, index: 1 };
          for (y = 0; y < 3; y += 1)
            p[y] = y;
          for (O = 0, B = Math.pow(2, 2), C = 1; C != B; )
            F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 1:
              for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 2:
              return "";
          }
          for (p[3] = D, E = D, v.push(D); ; ) {
            if (P.index > l)
              return "";
            for (O = 0, B = Math.pow(2, w), C = 1; C != B; )
              F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (D = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(O), D = g - 1, h--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  F = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = d(P.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(O), D = g - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, w), w++), p[D])
              N = p[D];
            else if (D === g)
              N = E + E.charAt(0);
            else
              return null;
            v.push(N), p[g++] = E + N.charAt(0), h--, E = N, h == 0 && (h = Math.pow(2, w), w++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Po)), Po.exports;
}
var Nl = bp();
function sr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => sr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && sr(n[s], r[s])
  );
}
function yp(e) {
  var c, l, f;
  const [t, n] = T({}), [r, o] = T(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Z(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await mo([p])]
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
function ql(e, t, n) {
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
function wp(e, t, n) {
  var s;
  const r = ql(e, t, n), o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [];
  return {
    performers: i.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: i.includes("tags") && ((s = o == null ? void 0 : o.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function vp({
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
  ), l = s.every((v) => r[v]), f = Fr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!l || c.has(v))
  ), d = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const y of v.tags ?? [])
      if (c.has(y.id)) {
        const E = d.get(y.id) ?? { name: y.name, count: 0 };
        E.count++, d.set(y.id, E);
      }
  const p = f.filter((v) => !d.has(v)), h = oa(p);
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
      const E = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": E,
          title: E ? `Show every video again, not only ${y.name}` : `Show only videos tagged ${y.name}`,
          disabled: o,
          onClick: () => i(v),
          children: [
            E && /* @__PURE__ */ a(ra, { "aria-hidden": "true" }),
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
function Np({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: o,
  countsPaused: i,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Fr(e.view.objectFilter, t, c).bins, f = qp(e, t, n, i);
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
                v && /* @__PURE__ */ a(ra, { "aria-hidden": "true" }),
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
function qp(e, t, n, r) {
  var d;
  const [o, i] = T({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = $(null);
  return Z(() => {
    var w, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), g = Fr(
      e.view.objectFilter,
      t,
      (w = e.presentation) == null ? void 0 : w.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (p++, Ni(kl(e, v.key, t), n, h.signal).then((y) => {
        h.signal.aborted || i((E) => ({ ...E, [v.key]: y }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [l, r]), o;
}
function Cr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Sp(e) {
  if (!Cr(e) || Object.keys(e).length !== 1 || !Cr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Cr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function Sl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function kp(e, t) {
  const n = t.find(
    (r) => sr(e, Sl(r.filter))
  );
  return n ? n.key : Sp(e);
}
function Fr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && sr(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Cr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = kp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !Cr(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && Cr(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && Cr(g.group) ? d = g.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function kl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = Fr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (i.includes(t) ? i.filter((d) => d !== t) : [...i.filter((d) => !c || s(d) !== c), t]).reduce(Ep, { ...e, view: { ...e.view, objectFilter: o } });
}
function Ep(e, t) {
  var i, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (i = e.presentation) == null ? void 0 : i.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = Sl(c.filter);
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
const yo = [
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
], Ap = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Or(e) {
  const t = Ce(e) ? e.occurrence : void 0;
  return {
    filter: Bt({
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
function Ms(e) {
  return Nl.compressToEncodedURIComponent(JSON.stringify(e));
}
function Fs(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : Nl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function si(e, t) {
  let n;
  if (Ce(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!yo.some((c) => c !== "performer" && t.has(c))) {
    const c = Or(e);
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
  if (Ce(e) && (i = {
    ...Ap,
    ...Fs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !hi.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Bt(o, _e(e)),
      objectFilter: Fs(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const xs = { dataQualityOpenedFromList: !0 };
function El() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Al(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...xs }, "", e) : window.history.replaceState(El() ? { ...xs } : null, "", e);
}
function Na(e, t) {
  const n = new URLSearchParams(window.location.search);
  yo.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", Ms(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", Ms(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Al(`${window.location.pathname}?${n}${window.location.hash}`);
}
function In(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ce(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function $r(e) {
  const t = e;
  return In(t, Or(t));
}
function Ps(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !sr(
    JSON.parse(nr(In(e, t))),
    JSON.parse(nr(In(e, Or(e))))
  );
}
function Gi(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return De(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function Cl(e, t) {
  if (De(e) !== "video") return e;
  const { base: n, bins: r } = Fr(
    e.view.objectFilter,
    t.view.objectFilter,
    Gi(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ha(e, t) {
  if (De(e) !== "video") return t;
  const { base: n, bins: r } = Fr(
    t.objectFilter,
    e.view.objectFilter,
    Gi(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function Ls(e, t) {
  return !t || !Ce(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Lo(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const on = (e) => e instanceof Error ? e.message : "Request failed.", Cp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Do = 50, Tp = [], Ds = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Ip(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? ed(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Xs(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function $p({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(ac, {}) : /* @__PURE__ */ a(uo, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Ko(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function Rp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: o,
  actionTagIds: i,
  label: s
}) {
  const c = !!n && !r, l = Ri(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ma(
    qe(() => [...i, ...d ?? []], [i, d])
  ), h = (J) => p[J] ?? { id: J, name: p[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => Ir(J.map(h)), w = f && e ? ki(f, e, o) : null, N = e ? du(e) : [], v = new Set(N.map((J) => J.id)), y = new Set(w == null ? void 0 : w.removed), E = new Set(w == null ? void 0 : w.markedAbsent), O = new Set(w == null ? void 0 : w.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((w == null ? void 0 : w.added) ?? []), C = g(((w == null ? void 0 : w.markedAbsent) ?? []).filter((J) => !v.has(J))), D = n ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
          O.has(J.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(tn, { tag: J })
          ] }) : /* @__PURE__ */ a(tn, { tag: J })
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
              /* @__PURE__ */ a(tn, { tag: J })
            ] }),
            E.has(J.id) && F
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(tn, { tag: J }) }, J.id)
        ),
        B.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(tn, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(tn, { tag: J }) }),
          F
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
function Op({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    Ai(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Mp({
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
  var _a;
  const d = _e(e), p = Gn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var S;
    return m.title || ((S = m.files[0]) == null ? void 0 : S.basename) || h;
  }, w = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = si(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = on(m), N.current = { query: Or(e), startAtEnd: !1 };
    }
  const [y, E] = T(null), [O, F] = T(""), B = $(null), C = $(null), D = $(null), P = $(null), [ne, J] = T(!!v.current), j = $(0), [z, M] = T(N.current.query), _ = $(z);
  _.current = z;
  const [L, Y] = T(0), Q = $(N.current.startAtEnd), [oe, H] = T([]), [k, le] = T(null), A = $(null), [X, ue] = T(null), [me, K] = T(0), ye = qe(() => {
    var ee;
    if (!k) return null;
    const m = oe.findIndex((ce) => ce.key === k.key), S = ((ee = A.current) == null ? void 0 : ee.key) === k.key ? A.current : null;
    return (m >= 0 ? oe.slice(m + 1) : S ? oe.filter((ce) => !S.before.includes(ce.key)) : []).find((ce) => ce.media.id !== k.media.id) ?? null;
  }, [k, oe]), [Ae, ke] = T(0), [Ne, Je] = T(!1), [pe, ot] = T(!1), Ze = $(!1), Mt = $(0), Jt = $(!1), Ht = $(null), rt = $(!0), Be = $(null);
  Z(() => (rt.current = !0, () => {
    rt.current = !1;
  }), []);
  const [Ge, et] = T(v.current), [dr, wt] = T(""), [Kn, tt] = T(""), [Te, Ke] = T(null), [ze, Ft] = T(!1), [ur, cn] = T([]), xt = $([]), vt = $(null), $n = $(null), Nn = $(null);
  Z(() => {
    var m, S;
    ze && ((S = (m = Nn.current) == null ? void 0 : m.querySelector("input")) == null || S.focus());
  }, [ze]);
  const he = $(null);
  Z(() => {
    if (pe) return;
    const m = he.current;
    he.current = null;
    const S = document.activeElement;
    m != null && m.isConnected && (!S || S === document.body) && m.focus();
  }, [pe]);
  const [It, Qt] = T(!1), [ln, qn] = T(!1), Ve = Fa(), [$t, fe] = T(!1), U = l ?? $t, xe = f ?? fe;
  Z(() => {
    if (Ne || It || !$n.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(Ds)) return;
      const S = $n.current;
      $n.current = null;
      const x = document.activeElement;
      x && x !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [Ne, It, L]);
  const [Nt, Sn] = T([]), [se, Pt] = T({}), Gt = $(null), [zn, kn] = T({});
  Z(() => {
    let m = !0;
    return Promise.all(
      Pi(z.objectFilter).map(
        async (S) => [
          String(S),
          (await ve(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      m && kn(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [z.objectFilter]);
  const En = qe(
    () => Li(z.objectFilter, zn),
    [zn, z.objectFilter]
  ), dn = $(0), je = $(e);
  je.current = e;
  const He = y ?? e, ut = qe(
    () => In(He, z),
    [He, z]
  ), Rt = qe(
    () => Ls(ut, z.performerFocus),
    [ut, z.performerFocus]
  ), Vn = $(Rt);
  Vn.current = Rt;
  const Rn = $(ut);
  Rn.current = ut;
  const [nn, Jn] = T("items"), [I, G] = T(null), ie = $(null), re = $("");
  function de(m) {
    const S = typeof m == "function" ? m(ie.current) : m;
    ie.current = S, G(S);
  }
  const [Re, Ie] = T(!1), [$e, Lt] = T(null), be = $(null), ft = Ce(ut) ? Xa(ut) : "", [Se, On] = T(0), [Oe, fr] = T(null);
  Z(() => () => {
    var m;
    return (m = be.current) == null ? void 0 : m.controller.abort();
  }, []), Z(() => {
    const m = be.current;
    !m || m.signature === ft || (m.controller.abort(), be.current = null, Ie(!1));
  }, [ft]), Z(() => {
    var x;
    const m = ie.current;
    if (nn !== "performers" || !ft || ((x = be.current) == null ? void 0 : x.signature) === ft || re.current === ft || (m == null ? void 0 : m.signature) === ft && m.complete)
      return;
    const S = (m == null ? void 0 : m.signature) === ft ? m : null;
    fn(m, (S == null ? void 0 : S.limit) ?? Do);
  }, [nn, ft, I, $e, Re]);
  const Wt = z.performerFocus;
  Z(() => {
    if (!Wt) {
      fr(null);
      return;
    }
    let m = !0;
    return ve(`/api/performers/${Wt}`).then((S) => {
      const x = vl(Wt, S.tags);
      m && fr({ id: Wt, name: S.name, tags: x });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [Wt]);
  const ia = JSON.stringify(
    Ce(ut) ? cc(ut.occurrence) : []
  ), Kt = qe(() => JSON.parse(ia), [ia]), sa = qe(() => hu(Kt), [Kt]), Dt = Cc(sa), rn = Ma(sa), pr = (m) => {
    var S;
    return ((S = rn[m]) == null ? void 0 : S.name) ?? (rn[m] === null ? "Unavailable tag" : "…");
  }, An = (m) => ({
    name: pr(m),
    tagIds: Dt.get(m) ?? [m],
    resolved: Dt.has(m)
  }), hr = gl(
    Ce(ut) ? ut : null,
    Wt ?? null,
    Se
  ), gt = Ps(e, z), qt = Ps(e, Ha(e, z)), Qe = pe || Ne || ze, it = Number(z.filter.page);
  function pt(m, S = !1) {
    Ze.current || (Mt.current++, wt(""), v.current = "", Q.current = S, _.current = m, M(m), ke(0), Je(!0), S || Na(e.id, m), Y((x) => x + 1));
  }
  function St() {
    if (Ze.current = !1, ot(!1), rt.current && Be.current) {
      const m = Be.current;
      Be.current = null, pt(m.query, m.startAtEnd);
    }
  }
  Z(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = si(
            je.current,
            new URLSearchParams(window.location.search)
          );
          Ze.current ? Be.current = S : pt(S.query, S.startAtEnd);
        } catch (S) {
          et(on(S));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), Z(() => (r(pe || Ne || ze || !!y), () => r(!1)), [pe, Ne, ze, !!y, r]);
  async function Hn(m, S, x) {
    if (Ce(m)) {
      const ce = await ji(
        m,
        Gt.current,
        S,
        x
      );
      return {
        items: ce.items.map((we) => ({
          key: we.key,
          media: we.media,
          occurrence: we
        })),
        totalCount: ce.totalCount
      };
    }
    const ee = await Yr(
      m,
      { ...m.view.filter, page: S },
      x
    );
    return {
      items: ee.items.map((ce) => ({ key: String(ce.id), media: ce })),
      totalCount: ee.totalCount
    };
  }
  function Mn(m, S, x, ee = !1, ce = !1) {
    if (!rt.current || Be.current) return;
    J(!0), H(
      ce ? m.items : Lo(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), zt(x, ee);
    const we = {
      ..._.current,
      filter: { ..._.current.filter, page: S }
    };
    _.current = we, M(we), Na(e.id, we);
  }
  function zt(m, S = !1) {
    Mt.current++, (m == null ? void 0 : m.key) !== (k == null ? void 0 : k.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (k == null ? void 0 : k.media.id) && ue(S && m ? m.media.id : null), le(m);
  }
  Z(() => {
    if (v.current) return;
    const m = new AbortController();
    P.current = m;
    const S = ++dn.current;
    return Je(!0), et(""), tt(""), A.current = null, ue(null), le(null), H([]), Ft(!1), (async () => {
      const x = Ls(
        In(je.current, _.current),
        _.current.performerFocus
      );
      Gt.current = Ce(x) ? await Di(x, m.signal) : null;
      let ee = Number(x.view.filter.page), ce = await Hn(x, ee, m.signal);
      const we = Math.max(
        1,
        Math.ceil(ce.totalCount / Number(x.view.filter.perPage))
      );
      (Q.current || ee > we) && (ee = we, ce = await Hn(x, ee, m.signal)), Q.current = !1;
      const Ye = x.view.startFrom === "end" ? -1 : 1;
      for (; Ce(x) && !ce.items.length && ee + Ye >= 1 && ee + Ye <= we && !m.signal.aborted; )
        ee += Ye, ce = await Hn(x, ee, m.signal);
      if (S !== dn.current || m.signal.aborted) return;
      const _t = Lo(ce.items, x.view.startFrom === "end");
      Mn(ce, ee, _t[0] ?? null);
    })().catch((x) => {
      !m.signal.aborted && S === dn.current && et(on(x));
    }).finally(() => {
      !m.signal.aborted && S === dn.current && (J(!0), Je(!1));
    }), () => {
      m.abort(), dn.current++;
    };
  }, [L, e.id]);
  const un = $(null), mr = $(0);
  Z(() => {
    if ((k == null ? void 0 : k.key) !== un.current && Ke(null), un.current = (k == null ? void 0 : k.key) ?? null, !k) return;
    let m = !0;
    const S = mr.current;
    return vn(d, k).then((x) => {
      !m || S !== mr.current || (Ke(x), Sn(
        Ce(e) ? x.ids.filter((ee) => e.occurrence.tagIds.includes(ee)) : []
      ));
    }).catch((x) => {
      m && et(`Could not load current tags. ${on(x)}`);
    }), () => {
      m = !1;
    };
  }, [k]), Z(() => {
    if (!Ce(e) || e.actions.length)
      return;
    let m = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await ve(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      m && Pt(Object.fromEntries(S));
    }).catch((S) => {
      m && et(on(S));
    }), () => {
      m = !1;
    };
  }, [e]);
  function gr(m, S = A.current) {
    const x = oe.findIndex((bt) => bt.key === m.key), ee = z.startFrom === "end" ? -1 : 1, ce = (S == null ? void 0 : S.key) === m.key, we = ce ? S : { key: m.key, page: it, before: oe.slice(0, x + 1).map((bt) => bt.key), after: oe.slice(x + 1).map((bt) => bt.key) }, Ye = new Set(we.after), _t = new Set(we.before), st = oe.find((bt) => Ye.has(bt.key) || (ee === 1 || it < we.page) && ce && !_t.has(bt.key));
    return { direction: ee, cursor: we, remainingKeys: Ye, visitedKeys: _t, nextLoaded: st };
  }
  async function xr(m = !1, S = !1, x = !1, ee = () => !0, ce = A.current) {
    if (!k) return;
    const { direction: we, cursor: Ye, remainingKeys: _t, visitedKeys: st, nextLoaded: bt } = gr(k, ce);
    if (!m && bt) {
      zt(bt, x);
      return;
    }
    const Nr = m ? st : new Set(oe.map((jt) => jt.key));
    let yt = we === -1 && !m ? Math.max(1, it - 1) : it;
    for (; rt.current && !Be.current; ) {
      let jt = await Hn(Rt, yt);
      const ct = Math.max(
        1,
        Math.ceil(jt.totalCount / Number(z.filter.perPage))
      );
      yt > ct && (yt = ct, jt = await Hn(Rt, yt));
      const kt = Lo(jt.items, we === -1), bn = new Map(kt.map((Vt) => [Vt.key, Vt])), qr = m ? Ye.after.flatMap((Vt) => {
        const ja = bn.get(Vt);
        return ja ? [ja] : [];
      }) : [], fa = new Set(qr.map((Vt) => Vt.key)), Sr = m ? {
        ...jt,
        items: [
          ...qr,
          ...kt.filter(
            (Vt) => Vt.key !== k.key && !fa.has(Vt.key)
          )
        ]
      } : { ...jt, items: kt };
      if (!ee()) return;
      if (S) {
        A.current = Ye, Mn(Sr, yt, k, !1, !0);
        return;
      }
      const pa = we === -1 && it === 1 && !m ? void 0 : Sr.items.find(
        (Vt) => !Nr.has(Vt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && we === -1 && yt === Ye.page) || _t.has(Vt.key))
      );
      if (pa || (we === -1 ? yt <= 1 : yt >= ct)) {
        Mn(
          Sr,
          yt,
          pa ?? null,
          x,
          !0
        ), pa || tt(
          jt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      yt += we;
    }
  }
  async function Ee(m, S = !1, x = !1, ee = !1) {
    var jt;
    if (Jt.current && m && k && !x && !ee && !y && !ze) {
      Ht.current = { action: m, stay: S, key: k.key };
      return;
    }
    if (y || !k || Ze.current || Ne || ze && !x)
      return;
    const ce = x || ee || !!(m != null && m.steps.length);
    if (ce && (!t || !Te) || m && or(m) && !n) return;
    const we = !S && !x && !ee && ce && m !== void 0 && Te !== null && us(e) && Ho(Jo(e.actions, fu(m, Te, pn))).length > 0, Ye = x && ((jt = Nn.current) != null && jt.contains(document.activeElement)) ? document.activeElement : null;
    Ze.current = !0, ot(!0), et(""), tt(""), Jt.current = !0, Mt.current++, mr.current++;
    const _t = A.current, st = ce && !S && !we ? gr(k).nextLoaded ?? null : null;
    st && (H(
      (ct) => ct.filter((kt) => kt.key !== k.key)
    ), zt(st, !0));
    let bt = !1, Nr = !1, yt = [];
    try {
      if (ce) {
        const ct = await vn(d, k);
        if (m)
          await Df(Rt, k, m);
        else {
          const bn = ee && Ce(e) ? e.occurrence.tagIds.filter((Sr) => ct.ids.includes(Sr)) : xt.current, fa = na(bn, ee ? Nt : ur);
          await Ui(Rt, k, fa);
        }
        const kt = await vn(d, k);
        st || Ke(kt), Nr = !0, Ft(!1), we && (yt = Ho(Jo(e.actions, kt))), tt(
          yt.length ? `Tags saved. Staying until answered: ${yt.map((bn) => bn.name).join(", ")}.` : "Tags saved."
        ), k.occurrence && (_r(k.occurrence.performer.id), On((bn) => bn + 1));
      }
      if (!rt.current || Be.current) return;
      if (ce)
        if (st) {
          const ct = Mt.current;
          bt = !0, Jt.current = !1, St(), xr(!0, !1, !0, () => Mt.current === ct && !Ze.current, _t).catch((kt) => {
            Mt.current === ct && et(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${on(kt)}`);
          });
        } else yt.length || await xr(!0, S, !S);
      else S || await xr();
      S && x && requestAnimationFrame(() => {
        var ct;
        return (ct = vt.current) == null ? void 0 : ct.focus();
      });
    } catch (ct) {
      if (et(
        Nr ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${on(ct)}` : ce ? `Saving stopped. ${Cp(on(ct))}${x || ee ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${on(ct)}`
      ), ce && !Nr) {
        he.current = Ye, st && (H(oe), ue(null), K((kt) => kt + 1), le(k), A.current = _t);
        try {
          Ke(await vn(d, k));
        } catch {
          Ke(null), et(
            (kt) => `${kt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      bt || (Jt.current = !1, St());
    }
  }
  Z(() => {
    const m = Ht.current;
    if (!(!m || pe || Ze.current)) {
      if ((k == null ? void 0 : k.key) !== m.key || Ge) {
        Ht.current = null;
        return;
      }
      Te && (Ht.current = null, Ee(m.action, m.stay));
    }
  }, [pe, Te, k, Ge]);
  const Pr = !ze && !y && !It && !ln && (k != null || Ne || pe);
  Ci({
    surface: "local",
    enabled: Pr,
    actions: e.actions,
    onAction: (m, S) => {
      const x = e.actions[m];
      x && Ee(x, S);
    },
    onFind: () => qn(!0)
  });
  const Cn = (m) => pe || Ne || !Te || !!y || !t && m.steps.length > 0 || !n && or(m);
  function Lr() {
    !o || y || Ze.current || ze || (D.current = document.activeElement, C.current = {
      error: Ge,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(_.current),
      items: oe,
      current: k,
      total: Ae,
      targets: Gt.current,
      stayedCursor: A.current
    }, Mt.current++, E(structuredClone(e)), F(""), tt(""), et(""));
  }
  Z(() => {
    if (!i) {
      j.current = 0;
      return;
    }
    i !== j.current && ne && !Ne && (j.current = i, Lr(), s == null || s());
  }, [i, Ne, ne]);
  function Fn() {
    E(null), F(""), requestAnimationFrame(() => {
      const m = D.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function wo() {
    var S;
    const m = C.current;
    !m || pe || ((S = P.current) == null || S.abort(), dn.current++, _.current = m.query, M(m.query), H(m.items), le(m.current), ke(m.total), Gt.current = m.targets, A.current = m.stayedCursor, Je(!1), et(m.error), tt(""), window.history.replaceState(window.history.state, "", m.url), Fn());
  }
  async function ca() {
    if (!y || !o || Ze.current) return;
    const m = In(
      { ...y, name: y.name.trim() },
      Ha(je.current, _.current)
    ), S = Ea(m);
    if (S) {
      F(S);
      return;
    }
    Ze.current = !0, ot(!0), F("");
    try {
      if (await o(m) === !1) throw new Error("Could not save review.");
      Fn(), tt("Review saved.");
    } catch (x) {
      F(hc(x));
    } finally {
      St();
    }
  }
  async function br() {
    if (!o || Ze.current) return;
    const m = Ha(je.current, _.current), S = In(je.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    Ze.current = !0, ot(!0), et(""), wt("");
    try {
      if (await o(S) === !1) throw new Error("Could not save review.");
      tt("Queue saved to this review.");
    } catch (x) {
      wt("Could not save queue. " + on(x));
    } finally {
      St();
    }
  }
  const We = z.performerScope, Dr = (m) => {
    const { performerFocus: S, ...x } = _.current, ee = S && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    pt(
      {
        ...x,
        ...ee ? { performerFocus: S } : {},
        filter: { ...x.filter, page: 1 },
        performerScope: { ...We, ...m }
      },
      x.startFrom === "end"
    );
  };
  async function fn(m, S) {
    var ce;
    const x = Rn.current;
    if (!Ce(x)) return;
    (ce = be.current) == null || ce.controller.abort();
    const ee = {
      signature: Xa(x),
      controller: new AbortController()
    };
    be.current = ee, re.current = "", Ie(!0), Lt(null);
    try {
      const we = await pp(x, m, S, ee.controller.signal, {
        onProgress: (Ye) => {
          be.current === ee && de(Ye);
        }
      });
      be.current === ee && de(we);
    } catch (we) {
      be.current === ee && !ee.controller.signal.aborted && (re.current = ee.signature, Lt({ signature: ee.signature, message: on(we) }));
    } finally {
      be.current === ee && (be.current = null, Ie(!1));
    }
  }
  function Pe() {
    var m;
    (m = be.current) == null || m.controller.abort(), be.current = null, Ie(!1), de((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function _r(m) {
    var ee;
    const S = Rn.current;
    if (!Ce(S)) return;
    if (be.current) {
      Pe();
      return;
    }
    const x = Xa(S);
    if (!(((ee = ie.current) == null ? void 0 : ee.signature) !== x || ie.current.partial))
      try {
        const ce = await yl(S, m);
        if (be.current) {
          Pe();
          return;
        }
        de(
          (we) => (we == null ? void 0 : we.signature) === x ? hp(we, m, ce) : we
        );
      } catch {
        de(
          (ce) => (ce == null ? void 0 : ce.signature) === x ? { ...ce, partial: !0, complete: !1 } : ce
        );
      }
  }
  const jr = z.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === z.performerFocus) : void 0, ht = Oe && Oe.id === z.performerFocus ? { ...Oe, flags: Ar(Kt, Oe.tags) } : jr ? { ...jr, flags: Ar(Kt, jr.tags) } : null, Ur = (m) => {
    if ((Oe == null ? void 0 : Oe.id) === m)
      return Ar(Kt, Oe.tags);
    const S = I == null ? void 0 : I.candidates.find((x) => x.id === m);
    return S ? Ar(Kt, S.tags) : void 0;
  }, an = ((_a = k == null ? void 0 : k.occurrence) == null ? void 0 : _a.performer.id) ?? null, Br = an === null ? void 0 : Ur(an), la = gp(
    Kt.length > 0 && an !== null && an !== z.performerFocus && Br === void 0 ? an : null
  ), yr = Br ?? (la ? Ar(Kt, la) : []), pn = Ac(He.actions), Qn = hr.summary && z.performerFocus ? Ei(Bi(hr.summary, He.actions, pn)) : [], Wn = fs(Kt, (ht == null ? void 0 : ht.flags) ?? [], An), xa = Rc(
    fs(Kt, yr, An),
    an !== null && an === z.performerFocus ? Qn : []
  ), Pa = JSON.stringify(xa), da = qe(() => xa, [Pa]), vo = JSON.stringify(Wn), La = qe(() => Wn, [vo]), wr = (m) => Nu(Kt, m, pr);
  function No(m) {
    if (Ze.current) return;
    const S = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    pt(S, S.startFrom === "end"), Jn("items");
  }
  function hn() {
    const { performerFocus: m, ...S } = _.current;
    pt(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const xn = $(null);
  xn.current ?? (xn.current = Uc());
  const Yn = xn.current, Xn = qe(
    () => He.actions.flatMap((m) => m.steps.flatMap((S) => S.tagIds)),
    [He.actions]
  ), vr = $(null);
  Z(() => {
    var Ye;
    const m = vr.current, S = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !S) return;
    const x = m.getBoundingClientRect(), ee = S.getBoundingClientRect(), ce = (Ye = S.nextElementSibling) == null ? void 0 : Ye.getBoundingClientRect(), we = ce && ce.bottom - ee.top <= x.height ? Math.max(ce.bottom, ee.bottom) : ee.bottom;
    ee.top < x.top ? m.scrollTop -= x.top - ee.top : we > x.bottom && (m.scrollTop += we - x.bottom);
  }, [k == null ? void 0 : k.key, nn]);
  const mn = $(null), Pn = $(null);
  Z(() => {
    var x, ee;
    const m = Pn.current;
    if (!m) return;
    Pn.current = null;
    const S = [...((x = mn.current) == null ? void 0 : x.querySelectorAll(".dq-partner")) ?? []];
    (ee = S.find((ce) => ce.dataset.partnerKey === m) ?? S[0]) == null || ee.focus();
  }, [k == null ? void 0 : k.key]);
  const Ln = pe || Ne || ze || !!y, Zn = qe(
    () => y ? In(y, Ha(e, z)) : null,
    [y, e, z]
  ), qo = qe(
    () => Zn != null && ea($r(Zn)) !== ea($r(e)),
    [Zn, e]
  );
  function So() {
    k ? vn(d, k).then(Ke).catch((m) => et(on(m))) : pt(_.current);
  }
  const Gr = Ge ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ge,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: pe, onClick: So, children: k ? "Reload tags" : "Retry queue" })
  ] }) : null, Kr = pe || Ne || k != null && !Te, zr = Math.max(1, Number(z.filter.perPage) || 1), Tn = $(1);
  Ne || (Tn.current = Math.max(1, Math.ceil(Ae / zr)));
  const Me = Tn.current, Da = We && k ? oe.filter(
    (m) => m.media.id === k.media.id && m.key !== k.key
  ) : [], ua = (m) => {
    var S;
    return m.title || ((S = m.files[0]) == null ? void 0 : S.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, gn = k ? Ip(k.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": We ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var ee;
        const S = m.target instanceof Element ? m.target.closest("button") : null, x = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((ee = S == null ? void 0 : S.textContent) == null ? void 0 : ee.trim()) ?? "";
        S && !S.closest(Ds) && /^(Filters|Edit filter:|Edit criteria)/.test(x) && ($n.current = S);
      },
      children: [
        /* @__PURE__ */ a(
          al,
          {
            name: e.name,
            description: e.description,
            entityType: De(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Ln || !!(c != null && c.busy),
            onEdit: y ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : Lr,
            editDisabled: !y && (Ln || !o || !!(c != null && c.busy)),
            editing: !!y,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: pe || ze, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  qa,
                  {
                    filter: z.filter,
                    objectFilter: En,
                    criteriaDefinitions: d === "audio" ? Qs : co,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ae,
                    sortOptions: d === "audio" ? Xl : Ws,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      ol,
                      {
                        page: Math.min(Math.max(1, it || 1), Me),
                        pages: Me,
                        onPage: (m) => pt({
                          ..._.current,
                          filter: Bt(
                            { ..._.current.filter, page: m },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (m) => {
                      (m.sort !== _.current.filter.sort || m.direction !== _.current.filter.direction) && (m = { ...m, sorts: void 0 }), pt(
                        {
                          ..._.current,
                          filter: Bt(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      pt(
                        {
                          ..._.current,
                          objectFilter: sl(
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
            trailing: /* @__PURE__ */ u(ge, { children: [
              We && /* @__PURE__ */ a(
                cp,
                {
                  scope: We,
                  disabled: pe || ze,
                  editing: !!y,
                  onChange: Dr,
                  onEditCriteria: () => Qt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                il,
                {
                  mode: "single",
                  disabled: Ln || !!c.busy,
                  onChange: () => {
                    var m;
                    return (m = c.onGrid) == null ? void 0 : m.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(ge, { children: [
              Ce(Rt) && t && /* @__PURE__ */ a(
                Zf,
                {
                  review: Rt,
                  disabled: Qe || !!y,
                  performerAttention: z.performerFocus ? La : void 0,
                  trees: pn,
                  onOpen: () => {
                    Ze.current = !0, ot(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const S = _.current.performerFocus;
                      S ? _r(S) : Pe(), On((x) => x + 1), St(), v.current || Je(!0), Y((x) => x + 1);
                    } else St();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Mi,
                {
                  disabled: Ln,
                  items: c.moreItems({
                    onSelect: Lr,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: z.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Zr,
                {
                  performer: {
                    id: z.performerFocus,
                    name: (ht == null ? void 0 : ht.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (ht == null ? void 0 : ht.name) ?? `performer ${z.performerFocus}` })
              ] }),
              ht != null && ht.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: wr(ht.flags), children: [
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: wr(ht.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Qe,
                  onClick: hn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: gt,
            queueChange: !y && gt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: qt ? () => void br() : void 0,
              saveDisabled: Qe || !o,
              onReset: () => {
                const m = Or(e);
                pt(m, m.startFrom === "end");
              },
              resetDisabled: Qe
            } : void 0,
            chipsEnd: y ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          y && Zn && /* @__PURE__ */ a(
            rl,
            {
              drawerRef: B,
              draft: Zn,
              onChange: (m) => E(m),
              direction: z.startFrom,
              onDirectionChange: (m) => pt({ ..._.current, startFrom: m }),
              tagGroups: Tp,
              trees: pn,
              saving: pe,
              saveDisabled: Ne,
              error: O,
              dirty: qo,
              criteriaChanged: qt,
              notices: Gr && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: Gr }),
              onSave: () => void ca(),
              onCancel: wo
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              k ? /* @__PURE__ */ u(ge, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${d}/${k.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${p.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: ua(k.media) }),
                        /* @__PURE__ */ a(ic, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  gn && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: gn })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [k, ye].filter(Boolean).map((m) => {
                    var ee, ce, we, Ye, _t;
                    const S = m, x = S.key === k.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: x ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": x ? void 0 : !0,
                        inert: x ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          Zl,
                          {
                            streamUrl: zo("audio", S.media.id),
                            format: ((ee = S.media.files[0]) == null ? void 0 : ee.format) ?? "",
                            title: g(S.media),
                            coverUrl: x ? Ko("audio", S.media) : void 0,
                            duration: ((ce = S.media.files[0]) == null ? void 0 : ce.duration) ?? 0,
                            autostart: x && X === S.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Ys,
                          {
                            videoId: S.media.id,
                            streamUrl: zo("video", S.media.id),
                            posterUrl: x ? Ko("video", S.media) : void 0,
                            duration: ((we = S.media.files[0]) == null ? void 0 : we.duration) ?? 0,
                            format: (Ye = S.media.files[0]) == null ? void 0 : Ye.format,
                            audioCodec: (_t = S.media.files[0]) == null ? void 0 : _t.audioCodec,
                            extensionSurface: x ? "quick-view" : void 0,
                            autostart: x && X === S.media.id,
                            keyboardShortcutsEnabled: x,
                            showAbLoop: x,
                            clip: S.media.parentVideoId != null ? {
                              start: S.media.clipStartSec ?? 0,
                              end: S.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${S.media.id}:${me}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ a(
                    tp,
                    {
                      details: k.media.details,
                      label: p.one
                    },
                    k.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Ne ? "Loading review…" : Ae ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              He.actions.length > 0 ? /* @__PURE__ */ a(
                xu,
                {
                  actions: He.actions,
                  isDisabled: (m) => ze || Cn(m),
                  busy: Kr,
                  tags: Te,
                  trees: pn,
                  preview: Yn,
                  onApply: (m, S) => void Ee(m, S),
                  onFind: () => qn(!0),
                  findDisabled: ze || !!y,
                  paused: !!y,
                  waitForGroups: us(He),
                  attention: da,
                  stayOnTap: U,
                  onStayOnTapChange: xe
                }
              ) : Ce(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || pe || ze || !Te || !!y || !k,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((m) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Nt.includes(m),
                          onChange: (S) => Sn(
                            e.occurrence.multiple ? S.target.checked ? [...Nt, m] : Nt.filter((x) => x !== m) : [m]
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
                          onClick: () => void Ee(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ee(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: mn, children: [
                k && /* @__PURE__ */ u(ge, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: k.occurrence ? k.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      k.occurrence && /* @__PURE__ */ a(Zr, { performer: k.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: k.occurrence ? k.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: We ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    da.length > 0 && /* @__PURE__ */ a(Op, { entries: da })
                  ] }),
                  Da.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${p.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          p.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Da.map((m) => {
                          var S, x, ee;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = m.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (x = m.occurrence) == null ? void 0 : x.performer.name,
                              "data-partner-key": m.key,
                              disabled: Qe,
                              onClick: () => {
                                Pn.current = k.key, zt(m), et("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Zr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (ee = m.occurrence) == null ? void 0 : ee.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    Rp,
                    {
                      tags: Te,
                      preview: Yn,
                      trees: pn,
                      actionTagIds: Xn,
                      label: `Current ${We ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: ze && !pe && (!Te || Te.ids.length !== xt.current.length || Te.ids.some((m) => !xt.current.includes(m))),
                      editor: ze && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: Nn,
                          disabled: pe,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              We ? "occurrence" : p.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              ir,
                              {
                                entityType: "tag",
                                values: ur,
                                onChange: cn,
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
                                  disabled: !Te,
                                  onClick: () => void Ee(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Te,
                                  onClick: () => void Ee(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Ft(!1), requestAnimationFrame(() => {
                                      var m;
                                      return (m = vt.current) == null ? void 0 : m.focus();
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
                Ce(ut) && z.performerFocus && /* @__PURE__ */ a(
                  ri,
                  {
                    ...hr,
                    mediaKind: d,
                    actions: He.actions,
                    trees: pn,
                    flags: La
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !y && Gr,
                  !y && dr && /* @__PURE__ */ a("p", { role: "alert", children: dr }),
                  Kn && /* @__PURE__ */ a("p", { role: "status", children: Kn })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                k && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Kr || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: vt,
                      className: "dq-button",
                      disabled: Qe || !!y || !t || !Te,
                      onClick: () => {
                        Mt.current++, xt.current = [...Te.ids], cn([...Te.ids]), Ft(!0), tt("");
                      },
                      children: [
                        /* @__PURE__ */ a(rc, { "aria-hidden": "true" }),
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
                      onClick: () => void Ee(),
                      children: [
                        /* @__PURE__ */ a(pd, { "aria-hidden": "true" }),
                        "Skip",
                        We ? " performer" : ` ${p.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              We && /* @__PURE__ */ u(
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
                        "aria-pressed": nn === "items",
                        onClick: () => Jn("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": nn === "performers",
                        onClick: () => Jn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              We && nn === "performers" ? /* @__PURE__ */ a(
                rp,
                {
                  ranking: (I == null ? void 0 : I.signature) === ft ? I : null,
                  busy: Re,
                  error: ($e == null ? void 0 : $e.signature) === ft ? $e.message : "",
                  focus: z.performerFocus,
                  disabled: Qe,
                  labels: p,
                  flagLabel: wr,
                  onFocus: No,
                  onMore: () => {
                    const m = ie.current;
                    m && fn(m, m.limit + Do);
                  },
                  onRefresh: () => {
                    de(null), fn(null, Do);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: vr, children: oe.map((m) => {
                var x;
                const S = (k == null ? void 0 : k.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: w(m),
                    "aria-label": w(m),
                    "aria-current": S ? "true" : void 0,
                    disabled: Qe,
                    onClick: () => {
                      zt(m), et(""), tt("");
                    },
                    children: [
                      /* @__PURE__ */ a($p, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(ge, { children: [
                            /* @__PURE__ */ a(Zr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (x = m.media.files[0]) != null && x.duration ? Xs(m.media.files[0].duration) : ""
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
        We && /* @__PURE__ */ a(
          Hs,
          {
            open: It,
            onClose: () => Qt(!1),
            criteria: di,
            activeFilter: We.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              Qt(!1), Dr({ performerFilter: m });
            }
          }
        ),
        ln && /* @__PURE__ */ a(
          $i,
          {
            actions: e.actions,
            trees: pn,
            isDisabled: (m) => Cn(m),
            tapStays: Ve && U,
            onApply: (m, S) => {
              qn(!1), Ee(m, S);
            },
            onClose: () => qn(!1)
          }
        )
      ]
    }
  );
}
const Tl = "data-quality.reviews-sort.v1", Fp = { sort: "name", direction: "asc" };
function xp() {
  try {
    const e = JSON.parse(localStorage.getItem(Tl) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return Fp;
}
function Pp(e) {
  try {
    localStorage.setItem(
      Tl,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Il(e, t, n, r) {
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
function _o(e, t) {
  const n = De(e), r = Gn(mi(n)), o = n === "tag" ? "tag" : Ce(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function Lp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      _o(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      _o(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(ge, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      _o(e, t)
    ] })
  ] });
}
function Dp({
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
    () => Il(e, t, n, r),
    [e, t, n, r]
  ), E = e.every((F) => t[F.id] !== void 0), O = r === "asc" ? "ascending" : "descending";
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
              var F;
              return (F = v.current) == null ? void 0 : F.click();
            },
            children: [
              /* @__PURE__ */ a(hd, { "aria-hidden": "true" }),
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
            onChange: (F) => {
              var C;
              const B = (C = F.target.files) == null ? void 0 : C[0];
              F.target.value = "", B && g(B);
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
              /* @__PURE__ */ a(sc, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Ta, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: E ? e.some((F) => t[F.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (F) => o(F.target.value),
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
              children: r === "asc" ? /* @__PURE__ */ a(md, { "aria-hidden": "true" }) : /* @__PURE__ */ a(gd, { "aria-hidden": "true" })
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
        /* @__PURE__ */ a("tbody", { children: y.map((F) => {
          const B = De(F);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(F.id)}`,
                "data-review-id": F.id,
                onClick: (C) => {
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), p(F.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(el, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Zc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Lp, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Mi, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(uo, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function $l(e, { id: t, name: n, description: r }) {
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
function _p({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), l = $(null), f = $(i);
  f.current = i;
  const d = $(null), p = at();
  Z(() => {
    var w;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (w = l.current) == null || w.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(i);
  Z(() => {
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
                  children: /* @__PURE__ */ a(Ia, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  nl,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (w) => {
                      w !== De(o) && t($l(w, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => Oi(o), children: "Export draft" }),
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
const jp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Up(e, t, n, r) {
  return Cl(
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
function _s(e, t) {
  return De(t) === "video" && Fr(t.view.objectFilter, e.view.objectFilter, Gi(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function js(e, t) {
  return sr(
    JSON.parse(nr($r(e))),
    JSON.parse(nr($r(t)))
  );
}
const jo = 180;
function Us(e) {
  return De(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Bs(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Gs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Uo(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  yo.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  Al(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Bp(e) {
  return Bt({ ...e, page: 1 });
}
function Rl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Qr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Gp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(fi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(wd, { "aria-hidden": "true" }) }
], Kp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(fi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(yd, { "aria-hidden": "true" }) }
], Ks = [], Ol = "(min-width: 900px)";
function zp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Ol);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Vp() {
  return typeof window.matchMedia == "function" && window.matchMedia(Ol).matches;
}
function Jp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [w, N] = T(!1), [v, y] = T(!1), [E, O] = T([]), [F, B] = T(""), [C, D] = T(!0), [P, ne] = T("account"), [J, j] = T(""), [z, M] = T(""), [_, L] = T(!1), [Y, Q] = T(!1), [oe, H] = T(""), [k, le] = T(Gs), A = $(k);
  A.current = k;
  const [X, ue] = T({}), me = $(X);
  me.current = X;
  const K = $(t);
  K.current = t;
  const ye = $(s);
  ye.current = s;
  const Ae = $(!1), ke = $(!0);
  Z(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [Ne, Je] = T(!k);
  Ne !== !k && (Je(!k), k || ue({}));
  const [pe, ot] = T(xp), { sort: Ze, direction: Mt } = pe, Jt = (b) => {
    const q = { ...pe, ...b };
    ot(q), Pp(q);
  }, Ht = $(null), rt = $(null), [Be, Ge] = T(null), [et, dr] = T(!1), [wt, Kn] = T(!1), [tt, Te] = T(null), [Ke, ze] = T(null), Ft = !!tt || !!Ke, ur = $(Ft);
  ur.current = Ft;
  const cn = et || !!Ke || wt, [xt, vt] = T(0), [$n, Nn] = T(!1), [he, It] = T(null), Qt = $(null), ln = $(null), qn = $(null), [Ve, $t] = T(
    null
  ), fe = t.find((b) => b.id === k) ?? null, U = qe(
    () => (Ve == null ? void 0 : Ve.id) === k && fe ? { ...fe, view: {
      ...fe.view,
      filter: Ve.view.filter,
      objectFilter: Ve.view.objectFilter,
      searchMode: Ve.view.searchMode,
      startFrom: Ve.view.startFrom
    } } : fe,
    [Ve, k, fe]
  ), xe = U ? De(U) : "video", Nt = mi(xe), Sn = U ? Ce(U) : !1, se = xe === "video" ? U : null, Pt = !!(U != null && U.actions.some(or)), Gt = Sn && Pt, zn = (!!se || xe === "audio" || Sn) && Pt, [kn, En] = T(null), dn = (kn == null ? void 0 : kn.id) === (U == null ? void 0 : U.id) ? kn == null ? void 0 : kn.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", je = Sn || xe === "audio" || xe === "video" && dn === "single", [He, ut] = T(0), Rt = $(-1), Vn = $(!1), Rn = $(je);
  Rn.current = je, Z(() => {
    const b = () => {
      const q = Rn.current;
      if (!q && Fn.current) {
        Vn.current = !0;
        return;
      }
      Rt.current = -1, kt(), q || ut((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const nn = Nt === "audio" ? h : d, Jn = xe === "tag" ? "Tag" : Nt === "audio" ? "Audio" : "Video", I = xe === "tag" ? w : nn, G = $(
    null
  ), ie = yp(se), [re, de] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Re, Ie] = T({
    page: 1,
    perPage: 40
  }), [$e, Lt] = T({ items: [], totalCount: 0 }), [be, ft] = T(k);
  be !== k && (ft(k), Lt({ items: [], totalCount: 0 }), Q(!1));
  const [Se, On] = T(!1), [Oe, fr] = T(""), [Wt, ia] = T(!1), [Kt, sa] = T(!1), [Dt, rn] = T(() => /* @__PURE__ */ new Set()), pr = $(Dt);
  pr.current = Dt;
  const An = $(/* @__PURE__ */ new Map()), hr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [gt, qt] = T(null), Qe = $(gt);
  Qe.current = gt;
  const [it, pt] = T(!1), St = $(it);
  St.current = it;
  const Hn = $(null), [Mn, zt] = T(!1), [un, mr] = T("grid"), [gr, xr] = T(jo), [Ee, Pr] = T(!1), [Cn, Lr] = T(!1), Fn = $(!1), [wo, ca] = T(""), [br, We] = T(""), [Dr, fn] = T(""), [Pe, _r] = T(null), [jr, ht] = T(""), [Ur, an] = T(!1), [Br, la] = T({}), yr = $(/* @__PURE__ */ new Map()), pn = $(null), Qn = $(null), Wn = !!U, xa = ci(zp, Vp, () => !1) && Wn, [Pa, da] = T({ top: 0, bottom: 0 });
  Tt(() => {
    if (!Wn) return;
    const b = () => {
      const R = Qn.current;
      if (!R) return;
      const V = Math.round(R.getBoundingClientRect().top + window.scrollY), te = R.closest("main"), ae = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      da(
        (W) => W.top === V && W.bottom === ae ? W : { top: V, bottom: ae }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [Wn]);
  const [vo, La] = T(0), wr = $(null), No = wn((b) => {
    var R;
    if ((R = wr.current) == null || R.disconnect(), wr.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => La(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), wr.current = q;
  }, []), hn = $(0), xn = $(0), Yn = $(null), Xn = $(null), vr = Ac(
    U && !je ? he ? [...U.actions, ...he.draft.actions] : U.actions : Ks
  ), mn = qe(
    () => he && U && fe ? Up(he.draft, U, re, fe) : null,
    [he, U, re, fe]
  ), Pn = qe(
    () => U && fe ? Cl(
      { ...fe, view: { ...U.view, filter: { ...re, page: 1 } } },
      fe
    ) : null,
    [U, fe, re]
  ), Ln = qe(
    () => fe ? ea($r(fe)) : "",
    [fe]
  ), Zn = qe(
    () => Pn != null && ea($r(Pn)) !== Ln,
    [Pn, Ln]
  ), qo = qe(
    () => mn != null && ea($r(mn)) !== Ln,
    [mn, Ln]
  );
  Z(() => {
    if (!br) return;
    const b = window.setTimeout(() => We(""), 4e3);
    return () => window.clearTimeout(b);
  }, [br]), Z(() => {
    if (!Be || Be.alert) return;
    const b = window.setTimeout(() => Ge(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Be]), Z(() => {
    const b = se ? Pi(se.view.objectFilter) : [];
    if (la({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (V) => {
        var te;
        try {
          const ae = await ve(`/api/tags/${V}`, {
            signal: q.signal
          });
          return (te = ae.name) != null && te.trim() ? [String(V), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((V) => {
      R && la(
        Object.fromEntries(V.filter((te) => te !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.view.objectFilter]);
  const So = qe(
    () => se ? Li(
      se.view.objectFilter,
      Br
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [Br, U, se]
  ), Gr = wn(async () => {
    c(!0), f("");
    try {
      const b = await jd();
      n(b.reviews), i(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), y(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), ne(b.storage ?? "account"), j(b.storageNotice ?? ""), k && !b.reviews.some((q) => q.id === k) && (le(""), Uo(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [k]);
  Z(() => {
    if (!v) {
      O([]), B("");
      return;
    }
    const b = new AbortController();
    return B(""), Zd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), Z(() => {
    Gr();
  }, []), Z(() => {
    if (k || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof me.current[q.id] == "number") continue;
      (Ce(q) ? Di(q, b.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : Yr(bo(q, V), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : De(q) === "tag" ? $o(
        q,
        Bt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Yr(
        q,
        Bt({ ...q.view.filter, page: 1, perPage: 1 }),
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
  }, [k, t]), Tt(() => {
    var R, V;
    const b = rt.current;
    if (k || s || !b) return;
    rt.current = null, (V = (b === "heading" ? null : [...((R = Qn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? Ht.current) == null || V.focus();
  }, [k, s, Ke, t]);
  const Kr = $(0), zr = wn(async () => {
    const b = ++Kr.current;
    _r(null), ht("");
    try {
      const q = await (Gt ? qc(Nt) : Nc(Nt));
      b === Kr.current && _r(q);
    } catch (q) {
      if (b !== Kr.current) return;
      _r(null), ht(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Gt, Nt]);
  Z(() => {
    zr();
  }, [zr]);
  const Tn = wn(
    async (b, q, R = !1, V = !1, te = () => !0) => {
      var Fe, Xe;
      const ae = ++hn.current;
      (Fe = Yn.current) == null || Fe.abort();
      const W = new AbortController();
      Yn.current = W, q = Bt(q);
      const Ue = Number(q.page);
      R && (q = { ...q, page: 1 }), de(q), sa(R), On(!0), fr("");
      try {
        const lt = (mt) => De(b) === "tag" ? $o(
          b,
          mt,
          W.signal
        ) : Yr(
          b,
          mt,
          W.signal
        );
        let dt = await lt(q);
        const Ot = Math.max(
          1,
          Math.ceil(dt.totalCount / Number(q.perPage))
        ), Le = R ? Ot : Math.min(Ue, Ot);
        return Number(q.page) !== Le && (q = { ...q, page: Le }, dt = await lt(q)), ae === hn.current && te(dt) && (((Xe = Xn.current) == null ? void 0 : Xe.page) !== Le && (Xn.current = {
          page: Le,
          ids: new Set(dt.items.map((mt) => mt.id))
        }), Lt(dt), V && x(
          () => new Set(dt.items.map((mt) => mt.id))
        ), de(q), Ie(q)), dt;
      } catch (lt) {
        throw ae === hn.current && fr(
          lt instanceof Error ? lt.message : "Could not load the review queue."
        ), lt;
      } finally {
        ae === hn.current && On(!1);
      }
    },
    []
  );
  Z(() => {
    var q;
    if (xn.current += 1, Rt.current = -1, hn.current += 1, (q = Yn.current) == null || q.abort(), It(null), Qt.current = null, Q(!1), H(""), M(""), L(!1), rn(/* @__PURE__ */ new Set()), An.current.clear(), qt(null), pt(!1), Pr(!1), Fn.current = !1, ca(""), We(""), fn(""), Lt({ items: [], totalCount: 0 }), Xn.current = null, ia(!1), !U || je) {
      On(!1), $t(null);
      return;
    }
    let b = !0;
    return On(!0), (async () => {
      let R = fe ?? U;
      $t(null);
      let V = null;
      const te = new URLSearchParams(window.location.search);
      if (De(U) === "video" && yo.some((Fe) => te.has(Fe)))
        try {
          const Fe = R;
          V = si(Fe, te);
          const Xe = In(Fe, V.query);
          (V.query.startFrom !== (Fe.view.startFrom ?? "end") || !sr(
            JSON.parse(nr(Xe)),
            JSON.parse(nr(In(Fe, Or(Fe))))
          )) && (R = Xe, $t(R));
        } catch (Fe) {
          ia(!0), fr(Fe instanceof Error ? Fe.message : "Could not read review URL."), On(!1);
          return;
        }
      let ae = null;
      try {
        ae = await Vd(o, U.id);
      } catch (Fe) {
        b && (L(!0), M(
          Fe instanceof Error ? Fe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const W = (ae == null ? void 0 : ae.signature) === nr(R) ? ae : null, Ue = V ? V.query.filter : W ? Bt(W.filter) : Bp(R.view.filter);
      de(Ue), mr(
        W ? Bs(W.displayMode, De(U)) : Us(U)
      ), xr(
        W ? W.cardSize ?? jo : jo
      );
      try {
        const Fe = await Tn(
          R,
          Ue,
          V ? V.startAtEnd : !W && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const Xe = ns(
          Fe.items.map((lt) => lt.id),
          (W == null ? void 0 : W.focusedId) ?? null,
          (W == null ? void 0 : W.index) ?? 0
        );
        qt(Xe), S(Xe);
      } catch {
      }
      b && (Rt.current = He, Q(!0), H(`${U.id}:${He}`));
    })(), () => {
      var R;
      b = !1, xn.current++, hn.current++, (R = Yn.current) == null || R.abort();
    };
  }, [U == null ? void 0 : U.id, je, He]), Z(() => {
    if (!(!xt || je || !U)) {
      if (Wt) {
        vt(0);
        return;
      }
      Ee || he || Cn || oe !== `${U.id}:${He}` || (vt(0), Co());
    }
  }, [
    xt,
    je,
    U == null ? void 0 : U.id,
    oe,
    Ee,
    Cn,
    He,
    Wt
  ]), Z(() => {
    !se || je || !Y || Se || Oe || Ee || Vn.current || Rt.current !== He || Na(se.id, {
      filter: re,
      objectFilter: se.view.objectFilter,
      searchMode: se.view.searchMode,
      startFrom: se.view.startFrom ?? "end"
    });
  }, [se, je, Y, Se, Oe, re, Ee, He]);
  const Me = qe(
    () => $e.items.map((b) => b.id),
    [$e.items]
  );
  Z(() => {
    if (!Y || !U || !o || Se || Oe || Ee || (Ve == null ? void 0 : Ve.id) === U.id || _ || Rt.current !== He)
      return;
    const b = {
      version: 1,
      signature: nr(U),
      filter: re,
      focusedId: gt,
      index: Math.max(0, Me.indexOf(gt ?? -1)),
      displayMode: un,
      cardSize: gr,
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
      Jd(o, U.id, b).catch((V) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (V instanceof Error ? V.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    Y,
    o,
    U,
    Se,
    Oe,
    Ee,
    re,
    gt,
    Me,
    un,
    gr,
    Ve,
    z,
    _,
    He
  ]);
  const Da = $e.items.find((b) => b.id === gt) ?? null, ua = xe === "video" ? Da : null;
  it && ua && (Hn.current = ua);
  const gn = ua ?? (it ? Hn.current : null), _a = os(Dt, gt), m = Me.length > 0 && Me.every((b) => Dt.has(b)), S = wn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var V;
      if (ur.current || Fd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = yr.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Z(() => {
    Y && !St.current && S(Qe.current);
  }, [Y, S]), Z(() => {
    Se || !Me.length || (Qe.current == null || !Me.includes(Qe.current)) && (qt(Me[0]), St.current || S(Me[0]));
  }, [S, Me, Se]);
  const x = wn(
    (b) => {
      rn((q) => {
        const R = b(q);
        for (const V of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(V) !== R.has(V) && An.current.set(
            V,
            (An.current.get(V) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), ee = wn(
    (b) => {
      if (!Me.length) return;
      const q = Math.max(
        0,
        Me.indexOf(Qe.current ?? Me[0])
      ), R = Me[Math.max(0, Math.min(Me.length - 1, q + b))];
      qt(R), St.current || S(R);
    },
    [S, Me]
  ), ce = wn(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", V = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = V != null && (!v || !E.some((nt) => nt.id === V)), ae = "effect" in b && R && !v, W = os(
        pr.current,
        Qe.current
      );
      if (!U || Fn.current || Se || Oe) return;
      const Ue = R && !I ? `${Jn} write permission is required to apply ${b.label}.` : ae || te ? `${b.label} needs a tag group that is unavailable.` : or(b) && (Pe == null ? void 0 : Pe.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : W.length ? "" : `Select or focus a ${xe} before applying ${b.label}.`;
      if (Ue) {
        fn(Ue);
        return;
      }
      const Fe = ++xn.current, Xe = U.id, lt = [...Me], dt = $e, Ot = Qe.current, Le = new Set(pr.current), mt = new Map(
        W.map((nt) => [nt, An.current.get(nt) ?? 0])
      ), kr = () => Fe === xn.current && U.id === Xe;
      Fn.current = !0, Pr(!0), ca(
        pr.current.size ? `${W.length} selected ${xe}s` : `the focused ${xe}`
      ), We(""), fn("");
      const Qi = dt.items.filter(
        (nt) => !W.includes(nt.id)
      ), Gl = Qi.map((nt) => nt.id), Wi = is(
        lt,
        Gl,
        Ot,
        W.includes(Ot ?? -1)
      );
      q || (Lt({
        items: Qi,
        totalCount: dt.totalCount
      }), rn((nt) => {
        const Yt = new Set(nt);
        for (const Xt of W) Yt.delete(Xt);
        return Yt;
      }), qt(Wi), St.current || S(Wi));
      let To = !1;
      try {
        if ("effect" in b ? await cu(b, W) : await kc(Nt, b, W), To = !0, !kr()) return;
        q || rn((nt) => {
          const Yt = new Set(nt);
          for (const Xt of W)
            (An.current.get(Xt) ?? 0) === mt.get(Xt) && Yt.delete(Xt);
          return Yt;
        }), We(
          `${b.label}: ${W.length} ${xe}${W.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (nt) {
        if (!kr()) return;
        Lt(dt), rn((Yt) => {
          const Xt = new Set(Yt);
          for (const Vr of W)
            Le.has(Vr) && (An.current.get(Vr) ?? 0) === mt.get(Vr) && Xt.add(Vr);
          return Xt;
        }), qt(Ot), St.current || S(Ot), fn(
          nt instanceof Error ? nt.message : "Action failed."
        );
      }
      try {
        if (!kr()) return;
        if (q) {
          const Et = xe === "tag" ? await $o(U, re) : await Yr(U, re), yn = new Map(
            Et.items.map((Ut) => [Ut.id, Ut])
          );
          if (xe !== "tag" && await Promise.all(
            W.filter((Ut) => !yn.has(Ut)).map(async (Ut) => {
              const ga = await ao(Nt, Ut).catch(() => null);
              ga && yn.set(Ut, ga);
            })
          ), !kr()) return;
          const Jr = new Set(W), Zt = "effect" in b ? b.effect : null, en = (Zt == null ? void 0 : Zt.mode) === "SET_TAG_GROUP" ? E.find((Ut) => Ut.id === Zt.tagGroupId) : void 0, Io = (Ut) => Zt && Zt.mode !== "SKIP" && Jr.has(Ut.id) ? {
            ...Ut,
            tagGroupId: (en == null ? void 0 : en.id) ?? null,
            tagGroupName: (en == null ? void 0 : en.name) ?? null,
            tagGroupColor: (en == null ? void 0 : en.color) ?? null
          } : Ut;
          Lt((Ut) => ({
            items: Ut.items.map((ga) => yn.get(ga.id) ?? Io(ga)),
            totalCount: Et.totalCount
          }));
          return;
        }
        const nt = new Set(W), Yt = hr && lt.length > 0 && lt.every((Et) => nt.has(Et)), Xt = Xn.current, Vr = (U.view.startFrom ?? "end") !== "beginning", Yi = (Et) => {
          const yn = Et.items.map((Zt) => Zt.id), Jr = (Xt == null ? void 0 : Xt.page) === Number(re.page) && yn.some((Zt) => Xt.ids.has(Zt));
          return Et.totalCount > 0 && Number(re.page) > 1 && (!yn.length || Vr && !Jr);
        }, Xi = await Tn(U, re, !1, Yt, (Et) => !Yi(Et));
        if (!kr()) return;
        let ma = Xi.items.map((Et) => Et.id);
        if (Yi(Xi)) {
          const Et = Math.max(1, Number(re.page) - 1), yn = { ...re, page: Et };
          de(yn), ma = (await Tn(
            U,
            yn,
            !1,
            Yt
          )).items.map((en) => en.id), rn(
            (en) => new Set([...en].filter((Io) => ma.includes(Io)))
          );
          const Zt = ma.at(-1) ?? null;
          qt(Zt), St.current || S(Zt);
        } else {
          rn(
            (yn) => new Set([...yn].filter((Jr) => ma.includes(Jr)))
          );
          const Et = is(
            lt,
            ma,
            Ot,
            To && W.includes(Ot ?? -1)
          );
          qt(Et), St.current && Et == null && pt(!1), St.current || S(Et);
        }
      } catch (nt) {
        kr() && fn(
          (Yt) => `${Yt ? `${Yt} ` : ""}${To ? "The action completed, but " : ""}the queue could not be refreshed. ${nt instanceof Error ? nt.message : "Refresh failed."}`
        );
      } finally {
        kr() && (Fn.current = !1, Pr(!1), ca(""), Vn.current && (Vn.current = !1, kt(), ut((nt) => nt + 1)));
      }
    },
    [
      I,
      v,
      E,
      xe,
      Pe,
      Tn,
      re,
      S,
      Me,
      $e,
      Se,
      Oe,
      U
    ]
  );
  function we() {
    var R;
    if (un === "list") return 1;
    const b = (R = pn.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Ye = $(() => {
  });
  Ye.current = (b) => {
    var ae;
    if (je || b.defaultPrevented || b.repeat || sn(b) || b.ctrlKey || b.altKey || b.metaKey || Ft) return;
    const q = b.target, R = q instanceof Node && ((ae = Qn.current) == null ? void 0 : ae.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!R && !V) return;
    if (Mn) {
      b.key === "Escape" && (Qr(b), zt(!1));
      return;
    }
    if (it && b.key === "Escape") {
      Qr(b), pt(!1), S(Qe.current);
      return;
    }
    if (!Md(q)) return;
    const te = Od(q);
    if (b.key === "Escape") {
      Qr(b), x(() => /* @__PURE__ */ new Set()), q instanceof HTMLElement && q.closest(".dq-action-bar") && S(Qe.current, !1);
      return;
    }
    if (!it && b.key === " " && te) {
      Qr(b), gt != null && x((W) => Qa(W, gt));
      return;
    }
    if (!(Ee || Se) && !it && b.key === "Enter" && gt != null && te) {
      if (xe !== "tag" && he) return;
      Qr(b), xe === "tag" ? window.open(`/tag/${gt}`, "_blank", "noopener,noreferrer") : pt(!0);
      return;
    }
  }, Z(() => {
    const b = (q) => Ye.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const _t = $(
    () => {
    }
  );
  _t.current = (b) => {
    var ae;
    if (je || Ft || it || Mn || Ee || Se || !Me.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((ae = Qn.current) == null ? void 0 : ae.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!R && !V || !b.key.startsWith("Arrow") || !xd(q)) return;
    const te = Pd(b.key, we());
    te && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), ee(te));
  }, Z(() => {
    const b = (q) => _t.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), Z(() => {
    const b = (q) => {
      var V;
      const R = q.target;
      !(R instanceof HTMLInputElement) || R.type !== "range" || !((V = Qn.current) != null && V.contains(R)) || Rn.current || R.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (R.blur(), S(Qe.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [S]);
  const st = (he == null ? void 0 : he.saving) === !0 || Cn, bt = Ee || Se && !Y || st, Nr = Ti();
  Ci({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !je && !Ft && !he && !it && !Mn && !Oe && ($e.items.length > 0 || Se || Ee),
    actions: (U == null ? void 0 : U.actions) ?? Ks,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && ce(R, q);
    },
    onFind: () => zt(!0),
    onSelectAll: () => x((b) => Rd(b, Me))
  }), Z(() => zt(!1), [je, it, U == null ? void 0 : U.id]);
  function yt(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, V = R != null && !E.some((te) => te.id === R);
    return Ee || Se || !!Oe || q && !I || "effect" in b && q && (!v || V) || or(b) && (Pe == null ? void 0 : Pe.kind) !== "ready" || !_a.length;
  }
  function jt(b) {
    En(null), vt(0), Ge(null), le(b), Uo(b, !!b && !U);
  }
  function ct() {
    Ae.current || (El() ? (Ae.current = !0, window.history.back()) : jt(""));
  }
  function kt() {
    const b = Ae.current;
    Ae.current = !1;
    let q = Gs();
    q && !ye.current && !K.current.some((V) => V.id === q) && (q = "", Uo(""));
    const R = A.current;
    q !== R && (vt(0), b || Ge(null), !q && R && (rt.current ?? (rt.current = { reviewId: R }))), le(q);
  }
  function bn() {
    rt.current = "heading", Ge(null), ct();
  }
  function qr(b) {
    b !== k && jt(b), vt((q) => q + 1);
  }
  function fa() {
    Ge(null), Te({
      review: $l("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Sr(b) {
    if (cn || !C) return;
    Ge(null);
    const q = crypto.randomUUID();
    let R;
    const V = k;
    Kn(!0);
    try {
      if (!await ha((ae) => (R = as(
        ae.find((W) => W.id === b.id) ?? b,
        ae,
        q
      ), [...ae, R]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      A.current !== V ? Ge({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : qr(R.id);
    } catch (te) {
      Ge({
        text: `“${b.name}” was not duplicated. ${Ua(te)}`,
        alert: !0
      });
    } finally {
      Kn(!1);
    }
  }
  async function pa() {
    if (!tt || tt.saving) return;
    const b = { ...tt.review, name: tt.review.name.trim() }, q = Ea(b);
    if (q) {
      Te({ ...tt, error: q });
      return;
    }
    Te({ ...tt, saving: !0, error: "" });
    try {
      if (!await ha((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Te(null), qr(b.id);
    } catch (R) {
      Te(
        (V) => V && {
          ...V,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function Vt() {
    if (!Ke || Ke.pending) return;
    const b = Ke.review, q = Il(t, X, Ze, Mt).map((te) => te.id), R = q.filter((te) => te !== b.id), V = R[Math.min(q.indexOf(b.id), R.length - 1)];
    ze({ review: b, pending: !0 });
    try {
      if (!await ha((te) => te.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      rt.current = b.id !== k && V ? { reviewId: V } : "heading", Ge({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Ge({ text: `“${b.name}” was not deleted. ${Ua(te)}`, alert: !0 });
    } finally {
      ze(null);
    }
  }
  async function ja(b) {
    if (!(cn || !C)) {
      Ge(null), dr(!0);
      try {
        const q = await vf(b);
        let R = 0, V = 0;
        if (q.length && !await ha((ae) => {
          const W = [...ae];
          R = V = 0;
          for (const Ue of q) {
            const Fe = W.find((Xe) => Xe.id === Ue.id);
            if (!Fe) W.push(Ue);
            else if (Wa(Fe, !0) !== Wa(Ue, !0) && // Imported before, its copy is listed already under its own id and name.
            !W.some(
              (Xe) => Xe.id !== Ue.id && Wa(Xe) === Wa(Ue)
            ))
              W.push(as(Ue, W, crypto.randomUUID())), V++;
            else continue;
            R++;
          }
          return R ? W : ae;
        }))
          throw new Error("Could not save reviews.");
        const te = q.length - R;
        Ge({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}` + (V ? ` (${V === 1 ? "1 as a copy" : `${V} as copies`} beside a listed version that differs)` : "") + "." + (te === 1 ? " 1 review already in the list stays as it is." : te ? ` ${te} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Ge({ alert: !0, text: `Could not import “${b.name}”. ${Ua(q)}` });
      } finally {
        dr(!1);
      }
    }
  }
  function Ua(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function Ki(b) {
    const q = !C || cn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(tc, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void Sr(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(sc, { "aria-hidden": "true" }),
        onSelect: () => Oi(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(lo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ge(null), ze({ review: b, pending: !1 });
        }
      }
    ];
  }
  function zi(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(ta, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || wt
      },
      ...Ki(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a($a, { "aria-hidden": "true" }),
        separated: !0,
        disabled: wt,
        onSelect: bn
      }
    ];
  }
  async function ha(b) {
    if (!o) return !1;
    let q = [];
    const R = await Kd(o, (W) => {
      q = W;
      const Ue = b(W);
      return Ue === W ? W : Ue.map(Wp);
    });
    if (n(R), !ke.current) return !0;
    const V = A.current;
    V && !R.some((W) => W.id === V) && ct();
    const te = q.find((W) => W.id === V), ae = R.find((W) => W.id === V);
    return ae && te && ((ae.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && En(null), ae.view.displayMode !== te.view.displayMode && mr(Us(ae))), !0;
  }
  function ko(b) {
    return ha((q) => Qp(q, b));
  }
  function Ml(b) {
    return ko(b).catch((q) => {
      throw A.current !== b.id && Eo(b, q), q;
    });
  }
  function Eo(b, q) {
    var V;
    if (!ke.current) return;
    const R = ((V = K.current.find((te) => te.id === b.id)) == null ? void 0 : V.name) ?? b.name;
    Ge({ text: `“${R}” was not saved. ${Ua(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(zs, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(ge, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void th().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Vs,
        {
          message: l,
          onRetry: () => void Gr()
        }
      )
    ] });
  const Ao = /* @__PURE__ */ u(ge, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    zn && (Pe == null ? void 0 : Pe.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Pe.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Ur,
          onClick: () => {
            an(!0), ht(""), (Gt ? au(Nt) : ru(Nt)).then(zr).catch(
              (b) => ht(
                `Could not create the ${Gt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => an(!1));
          },
          children: Ur ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    zn && ((Pe == null ? void 0 : Pe.kind) === "incompatible" || jr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, {}),
      jr || (Pe == null ? void 0 : Pe.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Ur,
          onClick: () => {
            an(!0), zr().finally(
              () => an(!1)
            );
          },
          children: Ur ? "Checking…" : "Check again"
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
            M(""), L(!1);
          },
          children: _ ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Be && (Be.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
      Be.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Be.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Qn,
      className: `data-quality-page${Wn ? " dq-page-fit" : ""}`,
      style: Wn ? {
        "--dq-fit-top": `${Pa.top}px`,
        "--dq-fit-bottom": `${Pa.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Be && !Be.alert ? Be.text : "" }),
        U && je ? /* @__PURE__ */ a(
          Mp,
          {
            review: fe ?? U,
            canWrite: Sn ? w : nn,
            canAssess: (Pe == null ? void 0 : Pe.kind) === "ready" && nn,
            onBusy: Pr,
            editRequest: xt,
            onEditRequestHandled: () => vt(0),
            onSaveDefaults: C ? Ml : void 0,
            pageControls: {
              onBack: bn,
              moreItems: (b) => zi(fe ?? U, b),
              onGrid: se ? () => En({ id: se.id, mode: "multiple" }) : void 0,
              notices: Ao,
              busy: wt
            },
            stayOnTap: $n,
            onStayOnTapChange: Nn
          },
          U.id
        ) : U ? Ul(U) : /* @__PURE__ */ a(
          Dp,
          {
            reviews: t,
            counts: X,
            sort: Ze,
            direction: Mt,
            onSortChange: (b) => Jt({ sort: b }),
            onDirectionChange: (b) => Jt({ direction: b }),
            storage: jp[P],
            canConfigure: C,
            busy: cn,
            headingRef: Ht,
            notices: Ao,
            onOpen: jt,
            onNew: () => fa(),
            onImport: (b) => void ja(b),
            onExportAll: () => tl(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(ta, { "aria-hidden": "true" }),
                disabled: !C || cn,
                onSelect: () => qr(b.id)
              },
              ...Ki(b)
            ]
          }
        ),
        it && gn && se && /* @__PURE__ */ a(
          eh,
          {
            video: gn,
            review: se,
            details: wp(gn, se, ie.ids),
            selectedCount: Dt.size,
            pending: Ee,
            refreshing: Se || !!Oe,
            error: Dr,
            canWrite: d,
            assessmentReady: (Pe == null ? void 0 : Pe.kind) === "ready",
            trees: vr,
            selected: Dt.has(gn.id),
            hasPrevious: Me.indexOf(gn.id) > 0,
            hasNext: Me.indexOf(gn.id) >= 0 && Me.indexOf(gn.id) < Me.length - 1,
            onToggleSelected: () => x((b) => Qa(b, gn.id)),
            onPrevious: () => ee(-1),
            onNext: () => ee(1),
            onClose: () => {
              pt(!1), S(Qe.current);
            },
            onAction: ce,
            findOpen: Mn,
            onFindOpenChange: zt
          }
        ),
        Mn && U && !je && !it && /* @__PURE__ */ a(
          $i,
          {
            actions: U.actions,
            tagGroups: E,
            trees: vr,
            isDisabled: yt,
            onApply: (b, q) => {
              zt(!1), ce(b, q);
            },
            onClose: () => zt(!1)
          }
        ),
        tt && /* @__PURE__ */ a(
          _p,
          {
            draft: tt,
            onChange: (b) => Te((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void pa(),
            onCancel: () => Te(null)
          }
        ),
        /* @__PURE__ */ a(
          td,
          {
            open: !!Ke,
            title: "Delete review?",
            message: Ke ? `“${Ke.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ke == null ? void 0 : Ke.pending) ?? !1,
            onConfirm: () => void Vt(),
            onCancel: () => ze((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function Ba(b, q, R = !1, V = !0) {
    const te = Qe.current, ae = Math.max(0, Me.indexOf(te ?? -1));
    try {
      const W = Tn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), Ue = hn.current, Fe = await W;
      if (Ue !== hn.current) return;
      const Xe = Fe.items.map((dt) => dt.id);
      rn(
        (dt) => new Set([...dt].filter((Ot) => Xe.includes(Ot)))
      );
      const lt = ns(Xe, te, ae);
      qt(lt), V && !St.current && S(lt, !1);
    } catch {
    }
  }
  function Fl(b) {
    const q = G.current;
    if (G.current = null, bt || !U || !fe) return;
    const R = q ?? U.view.objectFilter, V = sr(
      R,
      fe.view.objectFilter
    ) ? fe.view.objectFilter : R, te = Bt({ ...b, page: 1 }), ae = {
      ...U,
      view: {
        ...U.view,
        filter: te,
        objectFilter: V
      }
    }, W = !js(ae, fe), Ue = W ? ae : fe;
    $t(W ? ae : null), We(W ? "" : "Review queue defaults restored.");
    const { page: Fe, ...Xe } = Bt(b), { page: lt, ...dt } = Bt(re), Ot = !q && JSON.stringify(Xe) === JSON.stringify(dt);
    Ba(Ue, te, Ot || Ue.view.startFrom !== "beginning");
  }
  function xl() {
    if (Ee || Se || st || !fe) return;
    G.current = null;
    const b = Bt({
      ...fe.view.filter,
      page: 1
    });
    $t(null), We("Review queue defaults restored."), Ba(
      fe,
      b,
      fe.view.startFrom !== "beginning",
      !1
    );
  }
  function Pl() {
    if (Ee || Se || Oe || st || !U || !Pn || !C)
      return;
    const b = U, q = Pn;
    Lr(!0), ko(q).then((R) => {
      !R || A.current !== q.id || ($t(_s(q, b)), We("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? Eo(q, R) : fn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => Lr(!1));
  }
  function Co() {
    if (!U || !fe || Fn.current || he || Cn) return;
    ln.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Qt.current = {
      temporaryReview: Ve,
      filter: re,
      loadedFilter: Re,
      queue: $e,
      queueError: Oe,
      retryFromEnd: Kt,
      selectedIds: new Set(Dt),
      focusedId: gt,
      pageCursor: Xn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...fe,
      view: { ...fe.view, startFrom: U.view.startFrom ?? "end" }
    });
    zt(!1), pt(!1), We(""), fn(""), It({ draft: b, saving: !1, error: "" });
  }
  function Vi() {
    It(null), Qt.current = null;
    const b = ln.current;
    ln.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : S(Qe.current, !1);
    });
  }
  function Ll() {
    var q;
    if (!he || he.saving) return;
    const b = Qt.current;
    b && (hn.current += 1, (q = Yn.current) == null || q.abort(), G.current = null, On(!1), $t(b.temporaryReview), de(b.filter), Ie(b.loadedFilter), Lt(b.queue), fr(b.queueError), sa(b.retryFromEnd), x(() => b.selectedIds), qt(b.focusedId), Xn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Vi();
  }
  async function Dl() {
    if (!he || he.saving || !mn || !U) return;
    const b = U, q = { ...mn, name: mn.name.trim() }, R = Ea(q);
    if (R) {
      It((V) => V && { ...V, error: R });
      return;
    }
    It((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await ko(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      $t(_s(q, b)), De(q) === "video" && Na(q.id, {
        filter: re,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), We("Review saved."), Vi();
    } catch (V) {
      if (A.current !== q.id) {
        Eo(q, V);
        return;
      }
      It(
        (te) => te && {
          ...te,
          saving: !1,
          error: hc(V)
        }
      );
    }
  }
  function Ji() {
    U && Tn(U, re, Kt, hr).catch(() => {
    });
  }
  function _l() {
    rn(/* @__PURE__ */ new Set()), An.current.clear(), qt(null);
  }
  function jl(b) {
    !U || Ee || st || b === Number(re.page) || Hp(
      { ...re, page: b },
      U,
      (q, R) => Tn(q, R, !1, hr),
      _l
    );
  }
  function Hi(b) {
    if (!se || !fe || Ee || Se || st) return;
    const q = kl(se, b, fe.view.objectFilter), R = !js(q, fe);
    $t(R ? q : null), R ? Ba(q, { ...re, page: 1 }) : Ba(
      fe,
      { ...re, page: 1 },
      fe.view.startFrom !== "beginning"
    );
  }
  function Ul(b) {
    var Fe, Xe, lt, dt, Ot;
    const q = xe === "tag", R = q ? "tag" : "video", V = Math.max(1, Number(re.perPage) || 40), te = Math.max(1, Math.ceil($e.totalCount / V)), ae = Math.min(Math.max(1, Number(re.page) || 1), te), W = [
      I ? "" : `${Jn} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), Ue = !!Dr && !it;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            al,
            {
              name: b.name,
              description: b.description,
              entityType: xe,
              onBack: bn,
              backDisabled: Ee || !!he || wt,
              onEdit: he ? () => {
                var Le;
                return (Le = qn.current) == null ? void 0 : Le.focus();
              } : Co,
              editDisabled: !he && (Ee || Se || Wt || Cn || wt || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: bt, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  qa,
                  {
                    filter: Oe ? Re : re,
                    onFilterChange: Fl,
                    totalCount: $e.totalCount,
                    sortOptions: q ? rd : Ws,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: un,
                    zoomLevel: (gr - 225) / 50,
                    onZoomChange: (Le) => xr(Math.round(225 + Le * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? nd : co,
                    customFieldEntityType: xe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: So,
                    onObjectFilterChange: (Le) => {
                      bt || (G.current = xe === "video" ? sl(
                        Le,
                        Br,
                        b.view.objectFilter
                      ) : Le);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(ol, { page: ae, pages: te, onPage: jl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(ge, { children: [
                se && /* @__PURE__ */ a(
                  il,
                  {
                    mode: "multiple",
                    disabled: Ee || Se || Ft || !!he || Cn || wt,
                    onChange: () => En({ id: se.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Mf,
                  {
                    options: q ? Kp : Gp,
                    value: un,
                    onChange: (Le) => mr(Bs(Le, xe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Mi,
                {
                  disabled: Ee || !!he,
                  items: zi(fe ?? b, {
                    onSelect: Co,
                    disabled: Se || Wt || Cn || !C
                  })
                }
              ),
              queueDiffers: Y ? (Ve == null ? void 0 : Ve.id) === k : void 0,
              queueChange: !he && (Ve == null ? void 0 : Ve.id) === k ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Zn ? Pl : void 0,
                saveDisabled: Ee || Se || !!Oe || st || !C,
                onReset: xl,
                resetDisabled: Ee || Se || st
              } : void 0,
              chipsAfter: (Xe = (Fe = se == null ? void 0 : se.presentation) == null ? void 0 : Fe.binParents) != null && Xe.length || (dt = (lt = se == null ? void 0 : se.presentation) == null ? void 0 : lt.filterBins) != null && dt.length ? /* @__PURE__ */ u(ge, { children: [
                !!((Ot = se.presentation.binParents) != null && Ot.length) && /* @__PURE__ */ a(
                  vp,
                  {
                    videos: $e.items,
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    trees: ie.ids,
                    disabled: Ee || Se || st,
                    onToggle: Hi
                  }
                ),
                /* @__PURE__ */ a(
                  Np,
                  {
                    review: se,
                    savedObjectFilter: (fe ?? se).view.objectFilter,
                    queueFilter: re,
                    queueCount: Se || Oe ? null : $e.totalCount,
                    disabled: Ee || Se || st,
                    countsPaused: Ee || Se || st || !Y,
                    onToggle: Hi
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          Ao,
          se && ie.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: ie.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && mn && /* @__PURE__ */ a(
              rl,
              {
                drawerRef: qn,
                draft: mn,
                onChange: (Le) => It((mt) => mt && { ...mt, draft: Le }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Le) => It(
                  (mt) => mt && {
                    ...mt,
                    draft: { ...mt.draft, view: { ...mt.draft.view, startFrom: Le } }
                  }
                ),
                tagGroups: E,
                trees: vr,
                saving: he.saving,
                saveDisabled: Se || !!Oe,
                error: he.error,
                dirty: qo,
                criteriaChanged: Zn,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Oe && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Oe,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Ji, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Dl(),
                onCancel: Ll
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${vo}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !$e.items.length && /* @__PURE__ */ a(zs, { label: "Loading review queue…" }),
                    Oe && !Se && /* @__PURE__ */ a(
                      Vs,
                      {
                        message: Oe,
                        retryLabel: Wt ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Wt && fe && De(fe) === "video") {
                            const Le = Or(fe);
                            Na(fe.id, { ...Le, filter: { ...Le.filter, page: void 0 } }), ut((mt) => mt + 1);
                            return;
                          }
                          Ji();
                        }
                      }
                    ),
                    !Ee && !Se && !Oe && !$e.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(uo, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!$e.items.length && /* @__PURE__ */ a("div", { ref: pn, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: un === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${gr}px` },
                        children: $e.items.map(Bl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: No, children: /* @__PURE__ */ a(
                    Jc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: E,
                      trees: vr,
                      isDisabled: yt,
                      paused: !!he,
                      busy: Ee || Se,
                      onApply: (Le) => void ce(Le),
                      onFind: () => zt(!0),
                      status: Ee ? `Applying action to ${wo}…` : "",
                      summary: /* @__PURE__ */ u(ge, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Dt.size ? `${Dt.size} selected` : gt == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !Me.length || m,
                            onClick: () => x((Le) => /* @__PURE__ */ new Set([...Le, ...Me])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Ct, { binding: Nr.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Dt.size,
                            onClick: () => x(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Ct, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: W.length ? W.join(" ") : void 0,
                      keyHints: q ? he ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: Ue || br ? /* @__PURE__ */ u(ge, { children: [
                        Ue && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                          Dr
                        ] }),
                        br && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: br })
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
  function Bl(b) {
    var R, V, te;
    if (xe === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Yp,
        {
          tag: ae,
          displayMode: un === "list" ? "list" : "grid",
          focused: ae.id === gt,
          selected: Dt.has(ae.id),
          setRef: (W) => {
            W ? yr.current.set(ae.id, W) : yr.current.delete(ae.id);
          },
          onFocus: () => qt(ae.id),
          onToggle: () => {
            x((W) => Qa(W, ae.id)), S(ae.id, !1);
          },
          onOpen: () => window.open(`/tag/${ae.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ae.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Xp,
      {
        video: ql(q, se, ie.ids),
        showTagBins: ((V = (R = se == null ? void 0 : se.presentation) == null ? void 0 : R.annotations) == null ? void 0 : V.includes("tags")) && !!((te = se.presentation.annotationParents) != null && te.length),
        displayMode: un,
        cardsScroll: xa,
        focused: q.id === gt,
        selected: Dt.has(q.id),
        setRef: (ae) => {
          ae ? yr.current.set(q.id, ae) : yr.current.delete(q.id);
        },
        onFocus: () => qt(q.id),
        onToggle: () => x((ae) => Qa(ae, q.id)),
        onPreview: () => {
          he || (qt(q.id), pt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Hp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Qa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Qp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Wp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Wa(e, t = !1) {
  const { id: n, name: r, ...o } = e;
  return JSON.stringify(
    t ? { ...o, id: n, name: r } : o,
    (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([c], [l]) => c < l ? -1 : c > l ? 1 : 0)) : s
  );
}
function Yp({
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
  const f = $(null), d = wn(
    (p) => {
      f.current = p, o(p);
    },
    [o]
  );
  return Tt(() => {
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
        ad,
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
function Xp({
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
  const p = Rl(e), h = $(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, w = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return Tt(() => {
    const E = h.current;
    if (!E) return;
    const O = E.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = E.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    F && (F.id = B), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", B), O.classList.add("dq-card-link"));
    const C = E.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
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
      "aria-current": o ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (E) => {
        c(), E.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${w ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          od,
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
          (v = e.tags) == null ? void 0 : v.map((E) => /* @__PURE__ */ a("span", { children: E.name }, E.id)),
          !((y = e.tags) != null && y.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Zp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Zp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [o, i] = T(!1), [s, c] = T(!1), [l, f] = T(!1);
  return Z(() => {
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
  }, [e.id, e.files.length, t]), Z(() => {
    if (!o) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return ve(tu(e.id), {
      signal: d.signal
    }).then((p) => {
      d.signal.aborted || f(p.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [o, e.id]), Z(() => {
    const d = r.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [l, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: l && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: eu(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function eh({
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
  findOpen: E,
  onFindOpenChange: O
}) {
  const F = $(null), B = Fa(), C = $(null), D = $(null), P = e.files[0], ne = Rl(e), J = (L) => o || i || "steps" in L && L.steps.length > 0 && !c || or(L) && !l;
  Ci({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (L, Y) => {
      const Q = t.actions[L];
      Q && y(Q, Y);
    },
    onFind: () => O(!0)
  }), Z(() => {
    var Y;
    const L = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = F.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = L;
    };
  }, []);
  function j(L) {
    var oe, H, k;
    if (L.key !== "Tab") return;
    const Y = [
      ...((oe = F.current) == null ? void 0 : oe.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((le) => le.offsetParent !== null);
    if (!Y.length) {
      L.preventDefault(), (H = F.current) == null || H.focus();
      return;
    }
    const Q = Y.indexOf(
      document.activeElement
    );
    L.shiftKey && Q <= 0 ? (L.preventDefault(), (k = Y.at(-1)) == null || k.focus()) : !L.shiftKey && Q === Y.length - 1 && (L.preventDefault(), Y[0].focus());
  }
  function z(L) {
    if (E || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = L.key === "ArrowLeft" || L.key === "ArrowRight";
    if (L.altKey && !Y) return;
    const Q = C.current, oe = L.currentTarget.querySelector("video");
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
        const k = [P == null ? void 0 : P.duration, oe == null ? void 0 : oe.duration].find(
          (ue) => ue != null && Number.isFinite(ue) && ue > 0
        ) ?? 0, le = e.parentVideoId != null, A = le ? e.clipStartSec ?? 0 : 0, X = (le ? e.clipEndSec ?? k : k) - A;
        Number.isFinite(X) && X > 0 && Number.isFinite(H.time) && Q.seekBy(A + X * Number(L.key) / 10 - H.time);
      }
    } else if (L.key === "ArrowUp" || L.key === "ArrowDown")
      !L.repeat && !o && !i && (L.key === "ArrowUp" && p && w(), L.key === "ArrowDown" && h && N());
    else return;
    Qr(L);
  }
  function M(L) {
    const Y = F.current, Q = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !Y || !Q || !Y.contains(Q) || Q.closest(".dq-player, .dq-find-action") || L.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  Z(() => {
    if (E) return;
    let L = 0;
    const Y = requestAnimationFrame(() => {
      L = requestAnimationFrame(() => {
        var oe;
        const Q = document.activeElement;
        (oe = F.current) != null && oe.isConnected && (!Q || Q === document.body || Q === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(L);
    };
  }, [E, o, i, h, p, e.id, B]);
  const _ = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
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
                onClick: w,
                children: [
                  /* @__PURE__ */ a($a, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(Ct, { binding: "↑", hidden: !0 })
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
                  !B && /* @__PURE__ */ a(Ct, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(oc, { "aria-hidden": "true" })
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(ra, {}) }),
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
                children: /* @__PURE__ */ a(ic, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(Ia, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ a(
            Ys,
            {
              autostart: !0,
              streamUrl: zo("video", e.id),
              posterUrl: cs(e),
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
          ) : /* @__PURE__ */ a("img", { src: cs(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Jc,
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
        E && /* @__PURE__ */ a(
          $i,
          {
            actions: t.actions,
            trees: f,
            isDisabled: J,
            onApply: (L, Y) => {
              O(!1), y(L, Y);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function th() {
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
function zs({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(bd, { className: "dq-spin" }),
    e
  ] });
}
function Vs({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Dn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const lh = { components: { DataQualityPage: Jp } };
export {
  Jp as DataQualityPage,
  lh as default,
  sr as objectFiltersEqual
};
