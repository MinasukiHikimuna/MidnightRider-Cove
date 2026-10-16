var Ll = Object.defineProperty;
var Dl = (e, t, n) => t in e ? Ll(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ko = (e, t, n) => Dl(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, Fragment as me, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as ee, useLayoutEffect as Ct, useMemo as Ne, useCallback as En, useSyncExternalStore as Zi, useId as at, createContext as _l, useContext as jl, Fragment as eo } from "react";
import { useKeySequence as Ul, EntityReferenceMultiSelector as ar, SortableList as xs, TagBadge as Bl, EntityReferenceSelector as Go, EntityDetailTabs as Kl, FilterDialog as Ps, VIDEO_CRITERIA as ni, DetailListToolbar as ga, PERFORMER_CRITERIA as to, AUDIO_CRITERIA as Ls, NarrativeText as Gl, AUDIO_SORT_OPTIONS as Vl, VIDEO_SORT_OPTIONS as Ds, AudioPlayer as zl, VideoPlayer as _s, formatDuration as js, getResolutionLabel as Jl, ConfirmDialog as Hl, TAG_CRITERIA as Ql, TAG_SORT_OPTIONS as Wl, TagTile as Yl, VideoCard as Xl } from "@cove/runtime/components";
import { Search as Na, Flag as jn, Check as ea, Pencil as Xr, Ban as Ja, ChevronDown as no, Plus as qa, Pin as Us, GripVertical as Bs, AlertTriangle as Dn, Copy as Ks, Trash2 as ri, X as Sa, Mic as Zl, Users as Gs, Tag as Vs, Headphones as zs, Film as ai, ChevronLeft as ka, MoreHorizontal as ed, RectangleHorizontal as td, LayoutGrid as ro, ChevronRight as Js, Save as nd, RotateCcw as rd, Layers as Vo, Undo2 as ad, RefreshCw as id, ExternalLink as Hs, SkipForward as od, Upload as sd, Download as Qs, ArrowUp as cd, ArrowDown as ld, Loader2 as dd, List as ud, Grid3X3 as fd } from "@cove/runtime/lucide-react";
import { extensionFetch as pd } from "@cove/runtime/api";
import { createPortal as hd } from "react-dom";
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
function md(e, t) {
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
function Te(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function so(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Le(e) {
  return so(Pe(e));
}
function gd(e) {
  return Pe(e) === "video";
}
function Pe(e) {
  return e.entityType ?? "video";
}
const tr = [
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
], ii = [
  tr.slice(0, 11),
  tr.slice(11, 22),
  tr.slice(22)
];
function ha(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ya(e) {
  return ha(e) ?? e.toLocaleUpperCase();
}
const nr = "none";
function Er(e) {
  return typeof e == "string" && tr.includes(e);
}
function co(e) {
  const t = e.shortcut;
  return Er(t) || t === nr ? t : "auto";
}
function Xs(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const l = co(s);
    if (l !== nr) {
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
  const o = tr.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const l = o[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function bd(e, t, n) {
  const { keys: r, actionOn: i } = Xs(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Er(n)) {
    const c = i.get(n), l = r[t];
    c !== void 0 && c !== t && o.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...o.values()].filter(Er));
  return e.map((c, l) => {
    const f = o.has(l) ? o.get(l) : Er(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function wa(e) {
  var n;
  return Te(e) && !ec(e.occurrence) ? "Complete the optional occurrence condition before saving." : !gd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Pe(e) !== "tag" && e.actions.some(
    (r) => lo(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Un(r, Pe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const yd = {
  video: 1e3,
  audio: 250
};
function Jt(e, t = "video") {
  const n = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(yd[t], n(e.perPage, 40))
    )
  };
}
function zo(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function er(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Te(e) ? [e.entityType, ...r, e.occurrence] : Pe(e) === "video" ? r : [Pe(e), ...r]
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
    ].includes(r.mode) && r.tagIds.length > 0 && r.tagIds.every((i) => Number.isSafeInteger(i) && i > 0)
  ) && !lo(e) : !1;
}
function wd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function _n(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function or(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Zs(e) {
  return "steps" in e && e.steps.length > 0;
}
function rr(e) {
  return "steps" in e ? e.steps.some((t) => _n(t.mode)) : !1;
}
function lo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (_n(n.mode))
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
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Ys.includes(n.entityType)) && (!wd(n.entityType) || ec(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && vd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Un(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Un(r, "video"))
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
function vd(e, t) {
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
function Nd(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function Ho(e, t, n) {
  return { ...structuredClone(e), id: n, name: Nd(e.name, t) };
}
function ec(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && io.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || qd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function qd(e) {
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
function Sd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    r ? n.delete(i) : n.add(i);
  return n;
}
function kd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function on(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function Ed(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Ad(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function Cd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Td(e, t) {
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
const tc = "ext:com.midnightrider.data-quality:configuration", Id = "ext:cove-data-quality:video-reviews", Mi = "ext:com.midnightrider.data-quality:progress";
class Ha extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    Ko(this, "remote");
    this.remote = r;
  }
}
function nc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof Ha ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Aa = /* @__PURE__ */ new Map(), Da = /* @__PURE__ */ new Map(), qr = (e, t) => e.includes("*") || e.includes(t), Qa = (e) => ye(`/api/savedfilters?mode=${encodeURIComponent(e)}`), $d = () => ({
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
    reviews: Ea(JSON.stringify(t.reviews)),
    deletedIds: Fi(t.deletedIds),
    importedIds: Fi(t.importedIds)
  };
}
function Rd(e) {
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
  const t = await ye("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function uo(e, t) {
  const n = (Da.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Da.set(e, n), n.finally(() => {
    Da.get(e) === n && Da.delete(e);
  }).catch(() => {
  }), n;
}
let ua = null;
function Od() {
  if (ua) return ua;
  const e = Md();
  return ua = e, e.finally(() => {
    ua === e && (ua = null);
  }).catch(() => {
  }), e;
}
async function Md() {
  const e = await ye("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return uo(t, () => Fd(e, t));
}
async function Fd(e, t) {
  var h;
  const n = String(e.user.id), r = qr(e.permissions, "savedfilters.read"), i = r && qr(e.permissions, "savedfilters.write"), o = r ? (await Qa(tc)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
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
        await ye(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? zr(o[0].uiOptions) : $d();
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
    const g = JSON.stringify(s), y = Rd(n);
    if (o.length && y.reviews.some((E) => {
      const O = s.reviews.find((F) => F.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Qa(Id)).flatMap(
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
    o.length && (p.config = zr(o[0].uiOptions)), await ac(t, g), s = p.config;
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
    canWrite: qr(e.permissions, "videos.write"),
    canWriteVideos: qr(e.permissions, "videos.write"),
    canWriteAudios: qr(e.permissions, "audios.write"),
    canWriteTags: qr(e.permissions, "tags.write"),
    canReadTagGroups: qr(e.permissions, "taggroups.read"),
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
      const o = await ye(
        `/api/savedfilters/${n.recordId}`
      ), s = zr(o.uiOptions);
      if (s.revision !== n.config.revision)
        throw new Ha(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const i = await ye(
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
const Wa = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), xd = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => Wa(e, n) !== Wa(t, n)
);
function Pd(e, t) {
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
        const f = l instanceof Ha ? l.remote : void 0;
        if (!f || i >= 3) throw l;
        const d = xd(o, s).find(
          (p) => Wa(o, p) !== Wa(f.reviews, p)
        );
        if (d !== void 0) {
          const p = (r = s.find((h) => h.id === d) ?? o.find((h) => h.id === d)) == null ? void 0 : r.name;
          throw new Ha(
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
async function Ld(e, t) {
  const n = Aa.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Yo(r) : null;
  if (!n.readable) return i;
  const o = (await Qa(Mi)).find(
    (c) => c.name === t
  ), s = o ? Yo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Dd(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return uo(r, async () => {
    const i = Aa.get(e);
    if (!(i != null && i.writable)) return;
    await rc(i);
    const o = (await Qa(Mi)).find(
      (s) => s.name === t
    );
    await ye(
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
function sr(e) {
  return e === "audio" ? "audios" : "videos";
}
const _d = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Kn(e) {
  return _d[e];
}
const Ya = "confirmed_absent_tags", fo = "Confirmed absent tags", oi = "confirmed_absent_occurrence_tags", ic = {
  key: Ya,
  label: fo,
  type: "tag",
  subject: "tag assessments"
}, po = {
  key: oi,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, jd = {
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
      t === "modifier" && typeof n == "string" ? jd[n] ?? n : t === "key" && typeof n == "string" && [
        Ya,
        oi
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Bn(n)
    ])
  ) : e;
}
async function oc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await pd(e, { ...t, headers: r });
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
async function ye(e, t = {}) {
  return await oc(e, t, "fail");
}
function Ud(e, t = {}) {
  return oc(e, t, "null");
}
const Bd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Kd = 0;
function Xa(e, t) {
  return ye(
    `/api/${sr(e)}/${t}?dqRead=${Bd}-${++Kd}`,
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
    Bn({
      findFilter: Jt(t, Le(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function Hr(e, t, n) {
  return ye(
    `/api/${sr(Le(e))}/find`,
    { method: "POST", signal: n, body: sc(e, t) }
  );
}
async function cc(e, t, n) {
  return (await ye(
    `/api/${sr(Le(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: sc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Ni(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, ye("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Bn({
        findFilter: Jt(t),
        objectFilter: r
      })
    )
  });
}
function Gd(e) {
  return ye("/api/taggroups", { signal: e });
}
function xi(e, t, n = 1280) {
  return `/api/${sr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Pi(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Xo(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Vd(e) {
  return `/api/stream/video/${e}/preview`;
}
function zd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function si(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ye(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await ye("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Bn({
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
  const n = or(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await si(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Jd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function mo(e, t) {
  const r = (await ye("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Jd(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Kn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function lc(e, t) {
  const n = await mo(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await ye(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await ye("/api/custom-fields", {
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
function Hd(e = "video") {
  return lc(ic, e);
}
function uc(e = "video") {
  return mo(po, e);
}
function Qd(e = "video") {
  return lc(po, e);
}
function Za(e) {
  return [...new Set(e)];
}
function fc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === oi
  ), i = r === void 0 ? [] : n[r];
  return Za(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Wd(e) {
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
async function Yd(e, t, n, r, i, o) {
  await ye(`/api/${sr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Za(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function Xd(e, t, n) {
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
  if (!Un(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Kn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (rr(t)) {
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
  const i = Za(n), o = (await ho(t)).map((l) => ({
    mode: l.mode,
    tagIds: Za(l.tagIds)
  })), c = [
    ...o.filter((l) => !_n(l.mode)),
    ...o.filter((l) => _n(l.mode))
  ].map(
    (l) => Xd(l, i, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await ye(`/api/${sr(e)}/bulk`, {
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
async function Zd(e, t) {
  if (!Un(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ye("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const _a = (e) => e >= "0" && e <= "9";
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
    if (_a(e[n]) && _a(t[r])) {
      const c = n, l = r;
      for (; n < e.length && _a(e[n]); ) n++;
      for (; r < t.length && _a(t[r]); ) r++;
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
function Ar(e) {
  return [...e].sort(hc);
}
const Li = /* @__PURE__ */ new Map();
function eu(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function go(e, t, n) {
  const r = or(e), i = [], o = [];
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
    ...o.filter((h) => !_n(h.mode)),
    ...o.filter((h) => _n(h.mode))
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
function tu(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Ar(t);
}
function mc(e) {
  return gc(eu(e));
}
function gc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return ee(() => (o.current = !0, () => {
    o.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), si([c]).then(
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
function Tr(e) {
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
  return or(e).size > 0 || yc(e).size > 0;
}
function nu(e) {
  return Tr(e).filter(
    (t) => !t.actions.some((n) => wc(e[n]))
  );
}
function Di(e, t) {
  const n = bc(t), r = new Set(t.absent);
  return Tr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const l = [...or(e[c])], f = [...yc(e[c])], d = [
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
function ru(e, t, n) {
  const r = { ids: [...bc(t)], absent: t.absent }, i = go(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const Qr = "review";
function au(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function iu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Sr(e, t) {
  const n = new Set(au(e));
  return t.filter((r) => n.has(r.id));
}
function ns(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Sr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? i(Qr, () => ({
        key: Qr,
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
    ...o.filter((s) => s.key === Qr),
    ...o.filter((s) => s.key !== Qr)
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
function ou(e, t) {
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
    ...n.filter((r) => r.key === Qr),
    ...n.filter((r) => r.key !== Qr)
  ];
}
function su(e, t) {
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
  const r = su(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function cu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => Nc(i, r, n))
  );
}
function lu(e, t, n) {
  return t.filter((r) => r.tagIds !== null && Nc(e, r, n));
}
function du(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function yo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [du(e.mixed)] : []
  ];
}
function uu(e) {
  const t = yo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function fu(e, t, n) {
  const r = Sr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Ui = "-", rs = "Ctrl+a", pu = "Ctrl/⌘A", hu = ["f", "g", "k", "n", "m", ",", "."], qi = "Shift+", qc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, mu = new Set(Object.values(qc).flat()), as = { Comma: ",", Period: "." };
function gu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(as, t.code) ? as[t.code] : void 0;
}
function ta(e) {
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
  const s = ta(n), c = $({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  Ct(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const l = !!i && n.length > 0, f = e === "local" && !!o, d = tr.filter(
    (h) => s.actionOn.has(h) || hu.includes(h)
  ).join(" "), p = Ne(() => {
    const h = (N, v) => {
      var E, O;
      const w = c.current;
      if (N === rs) (E = w.onSelectAll) == null || E.call(w);
      else if (N === Ui) (O = w.onFind) == null || O.call(w);
      else {
        const F = mu.has(N), B = F || N.startsWith(qi), C = F ? gu(v) : B ? N.slice(qi.length) : N, D = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
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
  Ul(p, t);
}
const bu = {
  find: Ui,
  selectAll: pu
};
function vo() {
  return bu;
}
const yu = 600 * 1e3, No = /* @__PURE__ */ new Map(), Sc = /* @__PURE__ */ new Map(), Zn = /* @__PURE__ */ new Map();
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
  if (!(!t || Date.now() - t.at > yu))
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
function wu(e) {
  const t = Zn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ye(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var d, p;
        const o = ((d = i == null ? void 0 : i.name) == null ? void 0 : d.trim()) || null;
        if (Zn.get(e) === r && Zn.delete(e), !o) return null;
        const s = Cc({ ...i, id: e, name: o }), c = (p = No.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Ec(f), kc(f);
      },
      () => (Zn.get(e) === r && Zn.delete(e), null)
    )
  };
  return Zn.set(e, r), r;
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
function vu(e, t) {
  if (t != null && t.aborted) return Promise.reject(is());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = Ac(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = wu(i);
      s.waiters += 1, r.push({ id: i, entry: s });
    }
  }
  return r.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && Zn.get(f) === d && (Zn.delete(f), d.controller.abort());
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
    return vu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Si(ki(t));
}
function na(e) {
  const t = Ca(e);
  return Ne(() => Tc(t), [t]);
}
function ki(e) {
  return e ? e.split(",").map(Number) : [];
}
const Nu = "(max-width: 760px)";
function Ic(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = En(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Zi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ta() {
  return Ic(Nu);
}
function qu(e, t, n = !1) {
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
function $r(e, t, n = [], r) {
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
  const i = or(e), o = (s) => i.has(s) || [...i].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => qu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function ci(e) {
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
  const l = Ta(), [f, d] = T(""), [p, h] = T(0), g = $(null), y = $(null), N = $(null), v = $(null), w = $(null), E = $(/* @__PURE__ */ new Set()), O = at(), F = na(Ne(() => ci(e), [e])), B = ta(e), C = Ne(() => {
    const j = f.trim().toLocaleLowerCase(), V = (M) => M ? tr.indexOf(M) : tr.length;
    return e.map((M, _) => ({ action: M, index: _, key: B.keys[_] })).sort((M, _) => V(M.key) - V(_.key)).filter((M) => !j || M.action.label.toLocaleLowerCase().includes(j));
  }, [e, B, f]), D = C.length ? Math.min(p, C.length - 1) : -1, x = (j) => `${O}-option-${j}`;
  Ct(() => {
    var j, V, M;
    return v.current = document.activeElement, w.current = ((V = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const _ = v.current;
      _ instanceof HTMLElement && _.isConnected && _.focus({ preventScroll: !0 }), document.activeElement !== _ && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var j, V, M;
    D < 0 || (M = (V = (j = y.current) == null ? void 0 : j.querySelector(`[id="${x(C[D].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [D, C]);
  function re(j, V) {
    !j || r != null && r(j.action) || s(j.action, i && V);
  }
  function H(j) {
    var M;
    j.stopPropagation();
    const V = j.code || j.key;
    if (j.repeat || E.current.add(V), !on(j)) {
      if (j.repeat && !E.current.has(V)) {
        j.preventDefault();
        return;
      }
      if (j.key === "Escape")
        j.preventDefault(), j.repeat || c();
      else if (j.key === "Enter")
        j.preventDefault(), j.repeat || re(C[D], j.shiftKey);
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
        onKeyDown: H,
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
                "aria-activedescendant": D >= 0 ? x(C[D].index) : void 0,
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
                  id: x(j.index),
                  tabIndex: -1,
                  "aria-selected": V === D,
                  disabled: (r == null ? void 0 : r(j.action)) ?? !1,
                  onClick: (M) => re(j, M.shiftKey || o && Zs(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(me, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ha(j.key) ? !0 : void 0, children: j.key }),
                      ha(j.key) && /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ha(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: $r(j.action, F, t, n).map(
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
  Ct(() => {
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
const Su = [], Ki = ii.map(
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
function ja(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Mc(e) {
  return ii.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
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
function ku({
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
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ a(ea, { "aria-hidden": "true" }),
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
function Eu({ checked: e, onChange: t }) {
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
function Au({
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
  attention: p = Su,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = vo(), N = ta(e), v = Ta();
  Rc(o, v);
  const w = at(), E = na(
    Ne(() => e.flatMap((k) => k.steps.flatMap((se) => se.tagIds)), [e])
  ), O = Ki.filter((k) => k.keys.some((se) => N.actionOn.has(se))), F = O.includes(Ki[os]), B = e.length - N.actionOn.size, C = Ne(
    () => d && !f ? Tr(e) : [],
    [d, f, e]
  ), D = Ne(
    () => C.length && r ? Di(e, r) : null,
    [C, e, r]
  ), x = new Map(
    _i(D ?? []).flatMap(
      (k) => k.actions.filter((se) => wc(e[se])).map((se) => [se, k.name])
    )
  ), re = Ne(
    () => e.map((k) => f ? [] : lu(k, p, i)),
    [e, p, i, f]
  ), H = (k) => k.map(uu).join("; "), j = re.map(H), V = C.length > 0 && /* @__PURE__ */ a(
    ku,
    {
      groups: C,
      statuses: D,
      actions: e,
      attentionOf: (k) => H([
        ...new Map(
          k.actions.flatMap((se) => re[se]).map((se) => [se.key, se])
        ).values()
      ])
    }
  ), M = (k) => {
    const se = $r(e[k], E, [], i).map((le) => le.text).join(", "), A = x.get(k), X = j[k];
    return [
      se,
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
  ) : null, P = (k) => ({
    onMouseEnter: () => o.set(k),
    onMouseLeave: () => o.clear(k),
    onFocus: () => o.set(k),
    onBlur: () => o.clear(k)
  }), Y = (k) => {
    const se = N.actionOn.get(k), A = se === void 0 ? void 0 : e[se];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(St, { binding: k, hidden: !0 })
        },
        k
      );
    const X = t(A), le = `${w}-effect-${k}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : P(A), children: [
      /* @__PURE__ */ a("span", { id: le, className: "dq-sr-only", children: M(se) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": k,
          "aria-describedby": le,
          "data-group-open": x.has(se) || void 0,
          "data-attention": j[se] ? !0 : void 0,
          disabled: X,
          onClick: (pe) => s(A, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(St, { binding: k }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            ja(A) && " ",
            ja(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ja, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(se)
          ]
        }
      )
    ] }, k);
  }, W = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const k = Mc(N), se = (A) => {
      const X = e[A], le = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": le,
          "aria-describedby": `${w}-effect-${le}`,
          "data-group-open": x.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(X),
          onClick: (pe) => {
            o.clear(X), s(X, pe.shiftKey || h && Zs(X));
          },
          ...f ? {} : Oc(o, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            ja(X) && " ",
            ja(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ja, { "aria-hidden": "true" }),
              "absent"
            ] }),
            _(A)
          ]
        },
        le
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
            f ? W : /* @__PURE__ */ a(
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
            g && /* @__PURE__ */ a(Eu, { checked: h, onChange: g })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Fc,
            {
              groups: k,
              renderAction: se,
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
          /* @__PURE__ */ a("div", { hidden: !0, children: k.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: M(A) }, A)) })
        ]
      }
    );
  }
  const ie = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), Q = !F && /* @__PURE__ */ u(
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
          f ? W : /* @__PURE__ */ a(
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
              ie,
              Q
            ] })
          ) : /* @__PURE__ */ u(me, { children: [
            !f && ie,
            Q
          ] })
        ] }),
        O.map((k) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": k.indent, children: [
          k.keys.map(Y),
          k.indent === os && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
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
        ] }, k.indent))
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
    $r(l, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
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
  const y = vo(), N = ta(e), v = Ta(), w = at(), E = na(Ne(() => ci(e), [e])), [O] = T(() => $c());
  Rc(O, v);
  const F = $(null), B = Cu(F, e, !v), C = Mc(N);
  !C.length && e.length && C.push([]);
  const D = C.flat(), x = e.length - D.length, re = (M) => $r(M, E, t, n).map((_) => _.text).join(", "), H = (M) => ({
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
      ref: F,
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
                      extra: x,
                      findKey: y.find,
                      disabled: g,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((M, _) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                M.map((P) => {
                  const Y = e[P], W = N.keys[P];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": W || void 0,
                      "aria-describedby": `${w}-effect-${P}`,
                      disabled: g || r(Y),
                      onClick: () => o(Y),
                      ...g ? {} : H(Y),
                      children: [
                        W && /* @__PURE__ */ a(St, { binding: W }),
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
                    "aria-label": x > 0 ? `Find action, ${x} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(St, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: x > 0 ? `${x} more` : "Find action" })
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
          /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Tu,
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
        /* @__PURE__ */ a("div", { hidden: !0, children: D.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: re(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Cu(e, t, n) {
  const [r, i] = T(!1);
  return Ct(() => {
    var d;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(o), h = parseFloat(p.columnGap) || 0, g = o.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (D) => [...D.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (D) => y.map((x) => {
        let re = 1, H = 0;
        for (const j of x)
          H > 0 && H + v + j > D ? (re += 1, H = j) : H += (H > 0 ? v : 0) + j;
        return re;
      }), F = (D) => Math.max(1, D.reduce((x, re) => x + re, 0)), B = O(g), C = F(O(g - E));
      i(
        1 + F(B) < C || 1 + F(B) === C && B.every((D) => D === 1)
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
function Tu({
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
    $r(c, r, i, o).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const cs = 1e3;
async function Iu(e, t, n) {
  const r = await ye(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await ye(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Bn({
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
  const o = [...i.values()], s = Le(e), c = Te(e) ? await Ru(
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
function $u(e) {
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
async function Ru(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            r[c] = (await ye(
              `/api/${sr(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: $u(t[c])
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
function Ou(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Mu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Fu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of or(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function xu(e, t, n) {
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
function Pu(e, t) {
  var r;
  const n = qt(e);
  return ((r = Tr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Lu = (e) => e instanceof Error ? e.message : "Request failed.";
function Du({
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
  const y = Kn(Le(t)), N = Te(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = g.current.get(M)) == null || P.abort();
    const _ = new AbortController();
    g.current.set(M, _), l((Y) => ({ ...Y, [M]: { status: "loading" } })), Iu(t, M, _.signal).then(
      (Y) => {
        _.signal.aborted || l((W) => ({
          ...W,
          [M]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        _.signal.aborted || l((W) => ({
          ...W,
          [M]: { status: "failed", message: Lu(Y) }
        }));
      }
    );
  }
  function E(M) {
    var ie;
    const _ = o.filter((Q) => !M.includes(Q));
    for (const Q of _)
      (ie = g.current.get(Q)) == null || ie.abort(), g.current.delete(Q);
    const P = (Q) => {
      const k = c[Q];
      return (k == null ? void 0 : k.status) === "ready" ? k.group.children.map((se) => se.id) : [];
    }, Y = new Set(M.flatMap(P)), W = _.flatMap(P).filter((Q) => !Y.has(Q));
    d(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => !W.includes(Number(k)))
      )
    ), h(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => M.includes(Number(k)))
      )
    ), l(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => M.includes(Number(k)))
      )
    ), s(M);
    for (const Q of M) o.includes(Q) || w(Q);
  }
  const O = o.flatMap((M) => {
    const _ = c[M];
    return (_ == null ? void 0 : _.status) === "ready" ? [_.group] : [];
  }), F = O.length === o.length, B = o.some(
    (M) => {
      var _;
      return (((_ = c[M]) == null ? void 0 : _.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Ou(O).map((M) => [M.parent.id, M])
  ), D = Mu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), re = Fu(t.actions), H = (M) => f[M] ?? !re.has(M), j = F ? [...C.values()].flatMap((M) => {
    const _ = Pu(M.parent.name, t.actions);
    return M.children.filter((P) => H(P.id)).map((P) => ({ child: P, answerGroup: _ }));
  }) : [], V = (M, _) => d((P) => ({
    ...P,
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
      ar,
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
      const P = C.get(M);
      if (!P) return null;
      const Y = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
        _.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[M] ?? !1,
                disabled: n,
                onChange: (W) => h((ie) => ({
                  ...ie,
                  [M]: W.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            Y,
            " tree"
          ] }),
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(me, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Y}`,
                  onClick: () => V(P, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Y}`,
                  onClick: () => V(P, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: P.children.map((W) => {
              const ie = re.get(W.id) ?? [], Q = (D.get(W.id) ?? []).filter((k) => k !== M).map((k) => `“${x.get(k)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: H(W.id),
                    disabled: n,
                    onChange: (k) => d((se) => ({
                      ...se,
                      [W.id]: k.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  W.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    W.uses.toLocaleString(),
                    " ",
                    W.uses === 1 ? y.one : y.many
                  ] }),
                  Q.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    Q.join(", ")
                  ] }),
                  ie.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    ie[0].label || "New action",
                    "”",
                    ie.length > 1 ? ` and ${ie.length - 1} more` : ""
                  ] })
                ] })
              ] }, W.id);
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
              ({ child: M, answerGroup: _ }) => xu(
                M,
                (D.get(M.id) ?? []).filter(
                  (P) => p[P]
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
function _u(e, t, n, r) {
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
function ju(e) {
  return e.kind === "group" ? `group:${qt(e.name)}` : e.kind;
}
function Uu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Bu = /* @__PURE__ */ new Set([
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
]), Ku = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ua = 4, ls = 240;
function Gu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Vu(e, t, n, r) {
  for (const o of r) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function zu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = at(), s = at(), c = at(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), g = $([]), y = $(!1), N = $(!1), [v, w] = T(!1), [E, O] = T(null), [F, B] = T(null), [C, D] = T(!1), x = e.group ?? "", re = Ne(
    () => _u(t, n, x, E),
    [t, n, x, E]
  ), H = re.map(ju), j = F === null ? -1 : H.indexOf(F), V = (A) => `${s}-option-${A}`, M = (A) => i(A ? { ...e, group: A } : Uu(e)), _ = () => {
    var X;
    const A = ((X = d.current) == null ? void 0 : X.value) ?? x;
    A.trim() !== A && M(A.trim());
  };
  function P(A) {
    O(null), B(A), w(!0);
  }
  const Y = (A) => {
    var X, le;
    return A instanceof Node && (((X = l.current) == null ? void 0 : X.contains(A)) || ((le = p.current) == null ? void 0 : le.contains(A))) === !0;
  };
  function W() {
    var A, X;
    (A = p.current) != null && A.contains(document.activeElement) && ((X = h.current) == null || X.focus({ preventScroll: !0 })), w(!1), O(null), B(null), D(!1);
  }
  function ie(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), W();
  }
  function Q() {
    const A = f.current, X = p.current;
    if (!A || !X) return;
    const le = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Ce = (pe ? pe.offsetTop + pe.height : window.innerHeight) - le.bottom - Ua, ke = le.top - G - Ua, we = Math.min(X.scrollHeight, ls), Ve = Ce < we && ke > Ce;
    X.style.left = `${le.left}px`, X.style.width = `${le.width}px`, X.style.top = `${Ve ? le.top - Ua : le.bottom + Ua}px`, X.style.transform = Ve ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(ls, Ve ? ke : Ce))}px`, Vu(A, X, le, g.current) || W();
  }
  Ct(() => {
    var A;
    v && (f.current && (g.current = Gu(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), D(!0)), N.current = !1);
  }, [v]), Ct(() => {
    v && Q();
  }), ee(() => {
    if (!v) return;
    const A = () => Q(), X = (G) => {
      Y(G.target) || W();
    }, le = [...g.current, window], pe = window.visualViewport;
    for (const G of le) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), pe == null || pe.addEventListener("resize", A), pe == null || pe.addEventListener("scroll", A), document.addEventListener("pointerdown", X), () => {
      for (const G of le) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), pe == null || pe.removeEventListener("resize", A), pe == null || pe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", X);
    };
  }, [v]), ee(() => {
    var A, X, le;
    j >= 0 && ((le = (X = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : X.scrollIntoView) == null || le.call(X, { block: "nearest" }));
  }, [j]);
  function k(A) {
    if (on(A)) return;
    const X = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (X && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), P(A.altKey ? null : qt(x) ? `group:${qt(x)}` : "none");
      return;
    }
    if (v)
      if (X) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && W();
          return;
        }
        const le = A.key === "ArrowDown" ? 1 : -1, pe = E !== null && qt(E) && H.length > 1 ? 1 : 0, G = j < 0 ? le > 0 ? pe : H.length - 1 : (j + le + H.length) % H.length;
        B(H[G]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? ie(re[j]) : (_(), W()));
  }
  function se(A) {
    var le;
    if (A.key === "Tab") {
      W(), A.shiftKey && ((le = d.current) == null || le.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || on(A) && !Ku.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = d.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Bu.has(A.key) && !on(A) && D(!1), k(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || on(A) || (A.preventDefault(), A.stopPropagation(), W());
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
                value: x,
                onChange: (A) => {
                  M(A.target.value), O(A.target.value), B(null), w(!0);
                },
                onClick: () => {
                  v || P(null);
                },
                onKeyDown: k,
                onBlur: () => {
                  W(), _();
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
                  var le;
                  const A = y.current;
                  y.current = !1;
                  const X = document.activeElement === d.current;
                  v ? W() : (N.current = A && !X, P(null)), (!A || X) && ((le = d.current) == null || le.focus());
                },
                children: /* @__PURE__ */ a(no, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && hd(
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
              onKeyDown: se,
              onBlur: (A) => {
                Y(A.relatedTarget) || W();
              },
              children: re.map((A, X) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(X),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": X === j || void 0,
                  onMouseMove: () => {
                    X !== j && B(H[X]);
                  },
                  onClick: () => ie(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(qa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(ea, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                H[X]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Xn = [
  ...ii,
  ["auto", nr]
];
function Lc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : co(e[n]);
}
function Ju({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = $(null), l = n.keys[t], f = Lc(e, n, t), d = Er(f), p = n.duplicatePins.has(t) ? ` (${ya(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${ya(l)}, ${d ? "pinned" : "Auto"}${p}` : f === nr ? "no key, Find action only" : `no key: Auto found no free key${p}`, g = () => {
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
      Hu,
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
function Hu({
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
  Ct(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Er(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function g(N) {
    var C, D, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const re = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], H = re.indexOf(document.activeElement);
      N.preventDefault(), (D = re[(H + (N.shiftKey ? -1 : 1) + re.length) % re.length]) == null || D.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? Xn.findIndex((re) => re.includes(v)) : -1;
    if (!v || w < 0) return;
    const E = Xn[w].indexOf(v), O = (re) => re == null ? void 0 : re[Math.min(E, re.length - 1)], F = {
      ArrowLeft: Xn[w][E - 1],
      ArrowRight: Xn[w][E + 1],
      ArrowUp: O(Xn[w - 1]),
      ArrowDown: O(Xn[w + 1]),
      Home: Xn[w][0],
      End: Xn[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const B = F[N.key];
    B && h(B);
  }
  const y = (N) => {
    const v = Er(N) ? n.actionOn.get(N) : void 0;
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ii.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
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
                "data-choice": nr,
                tabIndex: 0,
                "aria-pressed": l === nr,
                onClick: () => i(nr),
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
const Qu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Wu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Yu(e, t) {
  if (Un(e, t)) return "";
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
function Xu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Zu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const l = Pe(e), f = l !== "tag", d = e.actions, p = ta(d), h = na(Ne(() => ci(d), [d])), g = Ne(
    () => f ? Tr(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === o), N = Ne(
    () => f && y >= 0 ? Tr(
      d.filter((G, be) => be !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = Ne(
    () => new Set(
      v ? nu(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [E, O] = T(""), [F, B] = T(!1), [C, D] = T(
    null
  ), x = at(), re = `${x}-from-tags`, H = $(null), j = $(null), V = $(null), M = $(null), _ = $(/* @__PURE__ */ new WeakMap()), P = (G) => {
    let be = _.current.get(G);
    return be || (be = crypto.randomUUID(), _.current.set(G, be)), be;
  }, Y = E.trim().toLocaleLowerCase(), W = Y ? d.filter((G) => G.label.toLocaleLowerCase().includes(Y)) : d, ie = (G) => t({ ...e, actions: G }), Q = (G, be) => ie(d.map((Ce, ke) => ke === G ? be : Ce));
  function k(G) {
    var be;
    return [...((be = V.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ce) => Ce.dataset.actionId === G
    );
  }
  function se(G, be) {
    const Ce = k(G), ke = Ce == null ? void 0 : Ce.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  Ct(() => {
    var be;
    const G = M.current;
    G && (M.current = null, (G === "add" || !se(G.id, G.part)) && ((be = j.current) == null || be.focus()));
  }), ee(() => {
    !c || !o || (W.some((G) => G.id === o) ? se(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const G = Xu(l);
    O(""), ie([...d, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function X(G) {
    const be = d[G], { shortcut: Ce, ...ke } = structuredClone(be), we = {
      ...ke,
      ...Ce === nr ? { shortcut: Ce } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    ie([...d.slice(0, G + 1), we, ...d.slice(G + 1)]), s(we.id), M.current = { id: we.id, part: "label" };
  }
  function le(G) {
    const be = d[G], Ce = W.indexOf(be), ke = W[Ce + 1] ?? W[Ce - 1];
    ie(d.filter((we, Ve) => Ve !== G)), o === be.id && s(null), M.current = ke ? { id: ke.id, part: "toggle" } : "add";
  }
  function pe() {
    B(!1), requestAnimationFrame(() => {
      var G;
      return (G = H.current) == null ? void 0 : G.focus();
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
            ref: H,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": F,
            "aria-controls": F ? re : void 0,
            onClick: () => {
              D(null), B(!F);
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
                G.key === "Escape" && E && !on(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
              "aria-describedby": `${x}-groups-note`,
              onChange: (G) => t({
                ...e,
                stayUntilGroupsAnswered: G.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${x}-groups-note`, children: v && !g.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === d ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && F && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || on(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          Du,
          {
            id: re,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const be = [...d, ...G];
              ie(be), D({ actions: be, count: G.length }), pe();
            },
            onCancel: pe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: W.length > 0 && /* @__PURE__ */ a(
      xs,
      {
        items: W,
        getKey: (G) => G.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (G) => ie(G),
        renderItem: (G, { dragHandleProps: be, isOver: Ce }) => {
          const ke = d.indexOf(G), we = o === G.id;
          return /* @__PURE__ */ a(
            ef,
            {
              action: G,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Ju,
                {
                  actions: d,
                  index: ke,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (Ve) => ie(bd(d, ke, Ve))
                }
              ),
              takenPin: p.duplicatePins.has(ke) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(qt(G.group)),
              effect: $r(G, h, n, r),
              open: we,
              detailId: `${x}-detail-${G.id}`,
              dragHandleProps: be,
              isOver: Ce,
              reorderDisabled: i || !!Y,
              onToggle: () => s(we ? null : G.id),
              onDuplicate: () => X(ke),
              onDelete: () => le(ke),
              children: "steps" in G ? /* @__PURE__ */ a(
                tf,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: Te(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Ve, ue) => _.current.set(Ve, P(ue)),
                  onChange: (Ve) => Q(ke, Ve)
                }
              ) : /* @__PURE__ */ a(
                rf,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Ve) => Q(ke, Ve)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !W.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function ef({
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
  const N = e.label.trim() || "New action", v = Yu(e, t), w = "steps" in e && qt(e.group) ? e.group.trim() : "";
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
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ya(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
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
                  /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(ri, { "aria-hidden": "true" })
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
function tf({
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
  Ct(() => {
    var g, y;
    const h = d.current;
    h != null && (d.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(_c, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      zu,
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
              nf,
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
function nf({
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
      "data-step-tone": Wu(e.mode),
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
            children: Qu.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          ar,
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
function rf({
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
const jc = _l(!1);
function af({ children: e }) {
  return /* @__PURE__ */ a(jc.Provider, { value: !0, children: e });
}
function Ht({ tag: e, name: t }) {
  const n = jl(jc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Bl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function of({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Kn(Le(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      ar,
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
function sf({
  review: e,
  onChange: t
}) {
  const n = Kn(Le(e)).many, r = e.occurrence, i = Ws(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ca([
    ...i.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...o
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: md(r, d) }), f = (d, p) => l(
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
          /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Ht, { tag: s[d.tagId], name: h })
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
            children: /* @__PURE__ */ a(ri, { "aria-hidden": "true" })
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
}, cf = {
  video: ai,
  audio: zs,
  tag: Vs,
  performerOccurrence: Gs,
  audioPerformerOccurrence: Zl
};
function Kc({ entityType: e }) {
  const t = cf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Uc[e] });
}
const lf = 2e6;
function Gc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function df(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ko(e) {
  Gc([e], df(e));
}
async function uf(e) {
  if (e.size > lf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ea(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Yr(e) {
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
          value: Pe(e),
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
function ff(e, t) {
  const n = Pe(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function pf({
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
    () => Te(e) && e.occurrence.tagIds.length > 0
  ), [E, O] = T(""), [F, B] = T(null), [C, D] = T(0), [x, re] = T(!1), H = $(null), j = $(null), V = $(null), M = ff(e, w), _ = Pe(e), P = Ne(() => Yr(e), [e]);
  ee(() => O(""), [P]), ee(() => {
    var se, A;
    if (x) return;
    const Q = H.current;
    if (H.current = null, !Q) return;
    (A = Q.isConnected && !!((se = V.current) != null && se.contains(Q)) && !(Q instanceof HTMLButtonElement && Q.disabled) ? Q : V.current) == null || A.focus({ preventScroll: !0 });
  }, [x]);
  function Y() {
    if (!(s || x)) {
      if (!f) {
        g();
        return;
      }
      H.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, re(!0);
    }
  }
  function W() {
    const Q = { ...e, name: e.name.trim() }, k = wa(Q);
    if (!k) {
      O(""), h();
      return;
    }
    if (O(k), !Q.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = j.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const se = e.actions.find(
      (A) => !Un(A, _)
    );
    se && (v("Actions"), B(se.id), D((A) => A + 1));
  }
  const ie = E || l;
  return /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (Q) => {
          V.current = Q, y && (y.current = Q);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (Q) => {
          Q.key !== "Escape" || Q.defaultPrevented || s || on(Q) || (Q.preventDefault(), Q.stopPropagation(), Y());
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
                children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Kl,
            {
              tabs: M.map((Q) => ({
                key: Q,
                label: Q,
                count: Q === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (Q) => v(Q)
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
                        onChange: (Q) => r(Q.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Te(e) && /* @__PURE__ */ a(sf, { review: e, onChange: t }),
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
                children: /* @__PURE__ */ a(hf, { review: e, onChange: t })
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
                  Zu,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: s,
                    expandedId: F,
                    onExpand: B,
                    reveal: C
                  }
                )
              }
            ),
            w && Te(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(of, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ie || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            ie && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
              ie
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
                  s || W();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    x && /* @__PURE__ */ a(
      pf,
      {
        onKeepEditing: () => re(!1),
        onDiscard: () => {
          H.current = null, re(!1), g();
        }
      }
    )
  ] });
}
function hf({
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
  if (Pe(e) === "tag")
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
            picture: /* @__PURE__ */ a(gf, {}),
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
            picture: /* @__PURE__ */ a(bf, {}),
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
            ar,
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
        ar,
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
      mf,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function mf({
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
            children: /* @__PURE__ */ a(ri, { "aria-hidden": "true" })
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
          c.key !== "Escape" || on(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Ps,
          {
            open: !0,
            onClose: () => i(null),
            criteria: ni,
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
function gf() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function bf() {
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
  qf(v);
  const w = Sf(v), [E, O] = T({ differs: h, text: "" });
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
          children: /* @__PURE__ */ a(Xr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(yf, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: E.text })
  ] });
}
function yf({
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
          /* @__PURE__ */ a(nd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(rd, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const wf = ["queue", "summary", "name", "layout", "range"], vf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, Nf = "(min-width: 1400px)";
function Va(e) {
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
  const i = wf.filter(
    (o) => e.querySelector(vf[o])
  );
  for (let o = 1; o <= i.length && !Va(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Va(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Va(e) ? !0 : (r(), !1);
}
function qf(e) {
  const t = Ic(Nf), [n, r] = T(0), i = $(!1);
  Ct(() => {
    e.current && (i.current = !fs(e.current, t));
  }, [e, t, n]), Ct(() => {
    const o = e.current;
    o && t && !i.current && !Va(o) && (i.current = !fs(o, t));
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
function Sf(e) {
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
          on(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
          /* @__PURE__ */ a(td, { "aria-hidden": "true" }),
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
function kf({
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
        children: /* @__PURE__ */ a(ed, { "aria-hidden": "true" })
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
function ei(e) {
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
      ei(e.customFieldCriteria).filter(Ao).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !Co(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function Io(e, t) {
  const n = ei(e.customFieldCriteria);
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
  const r = ei(e.customFieldCriteria);
  if (!r.length) return e;
  const i = ei(n.customFieldCriteria), o = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
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
async function Ef(e, t, n) {
  if (!Un(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Le(e), i = n.steps.some((c) => _n(c.mode)) ? await Wd(r) : "", o = await ho(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((l) => !_n(l.mode)),
    ...o.filter((l) => _n(l.mode))
  ]) {
    const l = (f) => Yd(
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
    const c = await ye("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Bn({
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
    entityType: Le(e),
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
                      key: oi,
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
    e.conditionTagIds.map((n) => si([n], t))
  );
}
function Xc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Af(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function Cf(e, t, n, r, i) {
  if (!Yc(e)) return !1;
  const o = fc(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((l) => r.includes(l))
  );
}
async function Zc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || Xc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Le(e), o = await Hr(
    Ro(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = o.items.length ? await Oo(c, r) : [], f = new Array(o.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; d < o.items.length; ) {
        const p = d++, h = o.items[p], g = await ye(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return Af(e.occurrence, v, l) && !Cf(c, h, y.id, v, l) ? [
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
  const i = Le(e), o = await Xa(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ye(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await ye("/api/tagapplications", {
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
      r.has(f.tag.id) && !l.has(f.tag.id) && await ye(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ye(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Zr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Tf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function yn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? fc(
      await Xa(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ye(Tf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Bi(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await Xa(e, t.media.id), i = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  Bi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === Ya
  ) ?? Ya, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
  if (t.occurrence && Te(e))
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
      i.length && await ye(
        `/api/${sr(Le(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function If(e, t, n) {
  t.occurrence && Te(e) ? await Ef(e, t.occurrence, n) : await pc(Le(e), n, [t.media.id]);
}
function Vi(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Zr(i(t.ids), i(n.ids)),
    absence: Zr(i(t.absent), i(n.absent))
  };
}
function $f(e, t) {
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
function ti(e, t, n, r) {
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
function Rf(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Of(e, t, n, r) {
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
      l = (await ye(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new tl(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Mf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Un(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ba(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Oo(i.occurrence, n) : [];
  await Of(i, o, s, n);
  const c = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await ho(h, n)
    }))
  ), l = structuredClone(Rf(c));
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
      }, v = ti(N.ids, l, s, !0);
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
function Ff(e, t, n) {
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
async function xf(e, t, n, r, i = !1) {
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
        if (s = await yn(Le(e.review), o.item, !1), !Ff(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = zi(h);
        return;
      }
      const c = ti(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Zr(s.ids, l);
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
        const h = await yn(Le(e.review), o.item, !1);
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
            const g = await yn(Le(e.review), o.item, !1);
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
async function Pf(e, t, n) {
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
        const c = await yn(Le(e.review), r.item, !1);
        $f(i, c), s = !0, await Mo(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const l = await yn(Le(e.review), r.item, !1);
        if (!va(
          l.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${zi(c)}`, r.status = "failed", s)
          try {
            const l = await yn(Le(e.review), r.item, !1), f = Vi(
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
async function Lf(e, t, n) {
  const r = Le(e), i = e.occurrence, [o, s] = await Promise.all([
    ye(
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
      return (await ye(`/api/tags/${v}`, { signal: n })).name;
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
function Df(e, t, n, r) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...i].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...or(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function Fo(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(il), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Tr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...or(t[N])]))
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
      mixed: Df(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
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
    return Lf(e, t, c.signal).then((l) => {
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
function _f(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = ou(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => i.add(h.name));
  }
  const o = qt(e.name), s = [...r].filter((f) => qt(f) !== o), c = s.length < r.size, l = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: l };
}
function jf(e, { names: t, here: n, note: r }) {
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
  const c = Kn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? Fo(e, r, i) : [], d = bo(f), p = (h) => [
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
          const g = h.kind === "other" ? [] : p(h.members), y = _f(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: jf(h, y),
                  children: [
                    /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Ht, { tag: v }),
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
function Wr({
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
function Uf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await ye(`/api/performers/${n}`, { signal: t })).name;
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
], Bf = {
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
function Kf({ step: e }) {
  const t = Qi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Qi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(ea, {}) : r + 1 }),
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
    Ar(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Ht, { tag: i })
    ] }) }, `added-${i.id}`)),
    Ar(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(Ht, { tag: i })
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
function Gf(e) {
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
function Vf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [E, O] = T(!1), [F, B] = T(""), [C, D] = T(!1), [x, re] = T(""), [H, j] = T(null), [V, M] = T(null), [_, P] = T([]), [Y, W] = T(0), ie = $(null), Q = $(null), k = $(null), se = $(!1), A = $(!1), X = $(null), le = $(!1), pe = $(!1), G = $({ onClose: o });
  G.current = { onClose: o };
  const be = at(), Ce = l === "run", ke = (H == null ? void 0 : H.kind) === "undo", we = Ce && d ? d.review : e, Ve = ta(we.actions), ue = we.occurrence, it = Le(we), Qe = Kn(it), Ft = Qe.queue, Qt = Ce && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !rr(I))
  ), Bt = Qt.filter((I) => y.includes(I.id)), tt = ue.targetMode === "selected" && ue.performerIds.length === 1, _e = ol(
    we,
    s && tt ? ue.performerIds[0] : null,
    Y
  ), je = To(we.view.objectFilter), We = Ca(
    s ? [...ci(Qt), ...ue.conditionTagIds, ...je] : []
  ), cr = Ne(() => Tc(We), [We]), gt = (I) => h[I] ?? We[I] ?? { id: I, name: `Tag ${I}` }, Gn = JSON.stringify(
    Object.fromEntries(
      je.flatMap((I) => {
        var J;
        const K = (J = We[I]) == null ? void 0 : J.name;
        return K ? [[String(I), K]] : [];
      })
    )
  ), nt = Ne(
    () => Io(we.view.objectFilter, JSON.parse(Gn)),
    [we.view.objectFilter, Gn]
  );
  ee(() => {
    var I, K, J;
    s && ((I = ie.current) == null || I.showModal(), (J = (K = ie.current) == null ? void 0 : K.querySelector(".dq-batch-answer input")) == null || J.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var Se;
      const K = ie.current, J = document.activeElement;
      if (!K || J && J !== document.body && K.contains(J)) return;
      (Se = (l === "answers" ? K.querySelector(".dq-batch-answer input:checked") ?? K.querySelector(".dq-batch-answer input") : K.querySelector("[data-batch-focus]")) ?? Q.current) == null || Se.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, l, E, d]), ee(() => {
    if (s || t || !se.current) return;
    const I = requestAnimationFrame(() => {
      const K = k.current;
      if (!se.current || !K || K.disabled) return;
      se.current = !1;
      const J = document.activeElement;
      (!J || J === document.body) && K.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || ue.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), Uf(ue.performerIds.slice(0, hs), I.signal).then((K) => {
      I.signal.aborted || P(K);
    }).catch(() => {
    }), () => I.abort();
  }, [s, ue.targetMode, JSON.stringify(ue.performerIds)]), ee(
    () => () => {
      var I;
      A.current = !0, (I = X.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!E) return;
    const I = (K) => {
      K.preventDefault(), K.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Ie() {
    f("answers"), p(null), g({}), j(null), w(!1), N([]), re(""), B(""), D(!1), M(null);
  }
  function Ue() {
    pe.current || (c(!1), G.current.onClose(le.current), le.current = !1, Ie(), se.current = !0);
  }
  function Be(I, K) {
    N(
      (J) => K ? [...J, I] : J.filter((Ee) => Ee !== I)
    ), p(null), g({}), re(""), B(""), D(!1), M(null);
  }
  function Tt() {
    f("answers"), M(null), re("");
  }
  function lr() {
    f("preview"), d || Cn();
  }
  function sn() {
    var I;
    A.current = !0, (I = X.current) == null || I.abort(), re("Stopping after in-flight operations settle…");
  }
  function It(I) {
    M(
      (K) => (K == null ? void 0 : K.group) === I.group && K.reason === I.reason ? null : I
    );
  }
  const bt = (I, K) => (V == null ? void 0 : V.group) === I && V.reason === K;
  async function Cn() {
    if (!Bt.length || pe.current) return;
    pe.current = !0, O(!0), B(""), D(!1), re("Loading all matching occurrences…"), p(null), g({}), M(null);
    const I = new AbortController();
    X.current = I;
    try {
      const K = await Mf(
        e,
        Bt,
        I.signal,
        (Ee) => re(`Loaded ${Ee.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const J = {};
      for (const Ee of K.entries)
        for (const Se of Ee.before.applications ?? [])
          J[Se.tag.id] = Se.tag;
      g(J), p(K), re("Preview ready. No tags have been changed.");
    } catch (K) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : K instanceof Error ? K.message : String(K)
      ), D(!I.signal.aborted && K instanceof tl), re("");
    } finally {
      pe.current = !1, O(!1), X.current = null;
    }
  }
  async function wn(I) {
    if (!d || pe.current) return;
    const K = (I === "undo" ? al(d) : rl(d, I === "retry")).length;
    pe.current = !0, A.current = !1, le.current = !0, O(!0), f("run"), B(""), j({ kind: I, total: K, done: 0, stopped: !1 }), re(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const J = () => j((Se) => Se && { ...Se, done: Se.done + 1 });
    let Ee = !1;
    try {
      I === "undo" ? await Pf(d, () => A.current, J) : await xf(d, v, () => A.current, J, I === "retry"), re(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (Se) {
      Ee = !0, re(""), B(Se instanceof Error ? Se.message : String(Se));
    } finally {
      pe.current = !1;
      const Se = A.current || Ee;
      j((Fe) => Fe && { ...Fe, stopped: Se }), O(!1), W((Fe) => Fe + 1);
    }
  }
  const he = (d == null ? void 0 : d.entries) ?? [], kt = Ne(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((I) => [
        I.item.key,
        ti(I.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Kt = (I) => kt.get(I.item.key), cn = (I) => Zr(I.before.ids, Kt(I).desired), vn = (I) => {
    const K = cn(I);
    return I.status === "pending" && (K.added.length > 0 || K.removed.length > 0);
  }, Ke = (I) => I.conflict || Kt(I).kept.length > 0 || Kt(I).replaced.length > 0, Et = Ne(() => {
    const I = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: I.filter(vn).length,
      correct: I.filter((K) => K.status === "unchanged").length,
      different: I.filter(Ke).length,
      hosts: new Set(I.map((K) => K.item.media.id)).size,
      added: [...new Set(I.flatMap((K) => cn(K).added))],
      removed: [...new Set(I.flatMap((K) => cn(K).removed))]
    };
  }, [kt]), de = Ne(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((I) => I.item.media.date).sort((I, K) => I.item.media.date.localeCompare(K.item.media.date)),
    [d]
  ), U = Ce ? Gf(he) : null, Oe = (I) => Ve.keys[we.actions.findIndex((K) => K.id === I)] ?? "", yt = (I) => $r(I, cr, [], r), Tn = ba(ue.condition) && ue.includeSubtags !== !1 && ue.conditionTagIds.length > 0, oe = de[0], pt = de.length > 1 ? de[de.length - 1] : void 0, Wt = (I) => `/${it}/${I.item.media.id}`, Yt = tt ? _[0] : void 0, Vn = Ne(
    () => n ? vc(
      n,
      _e.summary ? bo(
        Fo(_e.summary, we.actions, r ?? Li)
      ) : []
    ) : [],
    [n, _e.summary, we.actions, r]
  ), dr = cu(Bt, Vn, r ?? Li), De = n ?? [], lt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: vn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Ke }
  };
  function wt() {
    const I = Bf[ue.condition], K = !!I && ue.conditionTagIds.length > 0, J = ue.performerIds.slice(0, hs), Ee = String(we.view.filter.q ?? "").trim(), Se = ue.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      oo(ue) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : ue.targetMode === "selected" ? /* @__PURE__ */ u(me, { children: [
        J.map((Fe, ve) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Wr, { performer: { id: Fe, name: _[ve] ?? "" } }),
          _[ve] ?? "…"
        ] }, Fe)),
        ue.performerIds.length > J.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (ue.performerIds.length - J.length).toLocaleString(),
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
                objectFilter: ue.performerFilter,
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
        K ? I : ao[ue.condition],
        K && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Ar(ue.conditionTagIds.map(gt)).map((Fe) => /* @__PURE__ */ a(Ht, { tag: Fe }, Fe.id)) })
      ] }),
      K && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: ue.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ba(ue.condition) && ue.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: Se, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          Se
        ] })
      ] }),
      Ee && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ee,
        "”"
      ] }),
      Object.keys(we.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Ft} filters`,
          children: /* @__PURE__ */ a(
            ga,
            {
              filter: we.view.filter,
              objectFilter: nt,
              criteriaDefinitions: it === "audio" ? Ls : ni,
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
  function rt(I, K, J = !0) {
    if (!I.length) return null;
    const Ee = /* @__PURE__ */ a("strong", { children: Yt || "This performer" }), Se = J ? `Check the earliest and latest ${Qe.many} before applying, or narrow the batch with a date filter.` : "", Fe = I.every((ve) => ve.tagIds === null && !ve.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Fe ? /* @__PURE__ */ u("p", { children: [
          Ee,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((ve) => ve.flags).join(", ") }),
          ".",
          " ",
          Se
        ] }) : /* @__PURE__ */ u(me, { children: [
          /* @__PURE__ */ u("p", { children: [
            Ee,
            " needs attention where the chosen answers apply.",
            Se && ` ${Se}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((ve) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: ve.tagIds === null ? "Whole review" : ve.name }),
            ":",
            " ",
            yo(ve).join("; ")
          ] }, ve.key)) })
        ] }),
        K && oe && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: Wt(oe), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            pa(oe, it),
            " · ",
            oe.item.media.date
          ] }),
          pt && /* @__PURE__ */ u("a", { href: Wt(pt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            pa(pt, it),
            " · ",
            pt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function $t() {
    const I = dr.filter((J) => J.tagIds === null), K = dr.filter((J) => J.tagIds !== null);
    return /* @__PURE__ */ u(me, { children: [
      wt(),
      rt(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${tt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Qt.map((J, Ee) => {
            const Se = Oe(J.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(J.id),
                  "aria-labelledby": `${be}-answer-${Ee}`,
                  "aria-describedby": `${be}-effect-${Ee}`,
                  onChange: (Fe) => Be(J.id, Fe.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: Se && /* @__PURE__ */ a(St, { binding: Se, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${be}-answer-${Ee}`,
                    className: "dq-batch-answer-label",
                    title: J.label,
                    children: J.label
                  }
                ),
                /* @__PURE__ */ a(bs, { id: `${be}-effect-${Ee}`, parts: yt(J) })
              ] })
            ] }, J.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: rt(K, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Hi,
            {
              ..._e,
              mediaKind: it,
              actions: we.actions,
              trees: r,
              flags: De,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Or(I) {
    const K = Et, J = V && ms.has(V.group) ? V.group : null, Ee = J ? he.filter(lt[J].test) : [], Se = (Fe) => {
      const ve = Kt(Fe), Ye = ve.skipped ? Zr(
        Fe.before.ids,
        ti(Fe.before.ids, I.action, I.categories, !0).desired
      ) : cn(Fe), $n = !Ye.added.length && !Ye.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        ve.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        $n ? !ve.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ys, { added: Ye.added, removed: Ye.removed, tag: gt }),
        ve.kept.map((ge, fe) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Ar(ge.existing.map(gt)).map((xt) => /* @__PURE__ */ a(Ht, { tag: xt }, xt.id)),
          " ",
          "instead of",
          " ",
          Ar(ge.tagIds.map(gt)).map((xt) => /* @__PURE__ */ a(Ht, { tag: xt }, xt.id))
        ] }, fe))
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
              detail: `in ${K.hosts.toLocaleString()} ${K.hosts === 1 ? Ft : `${Ft}s`}`,
              pressed: bt("matching"),
              onToggle: () => It({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.willChange,
              label: "will change",
              tone: "add",
              pressed: bt("change"),
              onToggle: () => It({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.correct,
              label: "already correct, no write",
              pressed: bt("correct"),
              onToggle: () => It({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            fa,
            {
              value: K.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: bt("different"),
              onToggle: () => It({ group: "different" })
            }
          )
        ] }),
        Ee.length > 0 ? /* @__PURE__ */ a(
          ws,
          {
            title: lt[J].title,
            entries: Ee,
            mediaKind: it,
            resultHeading: "Planned change",
            describe: Se
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: oe ? `Dates ${oe.item.media.date}${pt ? ` to ${pt.item.media.date}` : ""}` : "No dates" }),
          oe && /* @__PURE__ */ a(
            "a",
            {
              href: Wt(oe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Qe.one}, ${oe.item.media.date}`,
              title: pa(oe, it),
              children: "Open earliest"
            }
          ),
          pt && /* @__PURE__ */ a(
            "a",
            {
              href: Wt(pt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Qe.one}, ${pt.item.media.date}`,
              title: pa(pt, it),
              children: "Open latest"
            }
          ),
          de.length < he.length && /* @__PURE__ */ u("span", { children: [
            (he.length - de.length).toLocaleString(),
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
              tag: gt,
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
          Tn ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function In() {
    return /* @__PURE__ */ u(me, { children: [
      wt(),
      rt(dr, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${tt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${be}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${be}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: Tt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Bt.map((I) => {
            const K = Oe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                K && /* @__PURE__ */ a(St, { binding: K, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(bs, { parts: yt(I) })
            ] }, I.id);
          }) })
        ] }),
        tt && /* @__PURE__ */ a(
          Hi,
          {
            ..._e,
            mediaKind: it,
            actions: we.actions,
            trees: r,
            flags: De,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Or(d)
    ] });
  }
  function ln(I) {
    const K = H ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, J = K.kind === "apply" ? he.length - I.counts.pending : K.done, Ee = K.kind === "apply" ? he.length : K.total, Se = E ? K.kind === "undo" ? "Undoing batch…" : K.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : K.kind === "undo" ? K.stopped ? "Undo stopped" : "Undo finished" : K.stopped ? "Stopped" : "Finished", Fe = Ee ? Math.round(J / Ee * 100) : 100, ve = V && !ms.has(V.group) ? V.group : null, Ye = (ge) => gs.find((fe) => fe.status === ge).label, $n = ve ? he.filter(
      (ge) => ge.status === ve && (!V.reason || ge.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: Se }),
          /* @__PURE__ */ u("span", { children: [
            J.toLocaleString(),
            " of ",
            Ee.toLocaleString(),
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
            "aria-valuemax": Ee,
            "aria-valuenow": J,
            children: /* @__PURE__ */ a("span", { style: { width: `${Fe}%` } })
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
            pressed: bt(ge.status),
            onToggle: () => It({ group: ge.status })
          },
          ge.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((ge) => {
          const fe = bt(ge.status, ge.error);
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
                "aria-expanded": fe,
                onClick: () => It({ group: ge.status, reason: ge.error }),
                children: fe ? "Hide them" : "Show them"
              }
            )
          ] }, `${ge.status}-${ge.error}`);
        }) }),
        $n.length > 0 ? /* @__PURE__ */ a(
          ws,
          {
            title: V.reason ? `${Ye(ve)}: ${V.reason}` : `${Ye(ve)} occurrences`,
            entries: $n,
            mediaKind: it,
            resultHeading: "Result",
            describe: (ge) => ge.error ?? Ye(ge.status)
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
            onClick: () => void wn("undo"),
            children: [
              /* @__PURE__ */ a(ad, { "aria-hidden": "true" }),
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
  function Nn() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Bt.length,
        onClick: lr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: sn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Et.willChange,
        onClick: () => void wn("apply"),
        children: [
          "Apply to ",
          Et.willChange.toLocaleString(),
          " ",
          Et.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Tt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Cn(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: sn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !U ? null : /* @__PURE__ */ u(eo, { children: [
      U.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void wn("retry"), children: "Retry failed" }),
      U.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void wn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(af, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: k,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Qt.length,
        onClick: () => {
          Ie(), i(), c(!0);
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
        ref: ie,
        className: "dq-batch-dialog",
        "aria-labelledby": `${be}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), Ue();
        },
        onClose: () => {
          var I;
          pe.current ? (I = ie.current) == null || I.showModal() : Ue();
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
                onClick: Ue,
                children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Kf, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: Q,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Qi.find((I) => I.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  x && /* @__PURE__ */ a("p", { role: "status", children: x }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                l === "answers" ? $t() : l === "preview" ? In() : ln(U)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: Tt, children: [
              /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ie, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Ue, children: "Close" }),
            Nn()
          ] })
        ]
      }
    )
  ] });
}
const sl = "data-quality.description-collapsed.v1";
function zf() {
  try {
    return localStorage.getItem(sl) === "true";
  } catch {
    return !1;
  }
}
function Jf({
  details: e,
  label: t
}) {
  const [n, r] = T(zf), i = En(() => {
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Gl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Hf = (e) => "";
function Qf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: s = Hf,
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
          children: /* @__PURE__ */ a(id, { "aria-hidden": "true" })
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
            /* @__PURE__ */ a(Wr, { performer: g }),
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
        disabled: i,
        onClick: l,
        children: "Show more performers"
      }
    )
  ] });
}
const Wf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Yf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Xf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Ba(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Zf(e, t) {
  const n = oo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ba(r, "or")}`,
    includesAll: `has ${Ba(r, "and")}`,
    excludes: `has none of ${Ba(r, "or")}`,
    excludesAll: `missing ${Ba(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function ep({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, l] = T(null), f = $(null), d = $(null), p = at(), h = na(e.conditionTagIds), g = Zf(e, h);
  Ct(() => {
    const w = f.current;
    if (!o || !w) return;
    const E = () => l(Xf(w));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of F) B && (O == null || O.observe(B));
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
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || on(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const O = [...d.current.querySelectorAll(Yf)].filter((D) => D.closest('[role="dialog"]') === d.current).sort(
          (D, x) => D.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const F = O[0], B = O[O.length - 1], C = document.activeElement;
        w.shiftKey && (C === F || C === d.current) ? (w.preventDefault(), B.focus()) : !w.shiftKey && C === B && (w.preventDefault(), F.focus());
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Wf.map(({ mode: w, label: E }) => /* @__PURE__ */ a(
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
                ar,
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
                  /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
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
                  ar,
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
function za(e) {
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
function tp(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Le(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function np(e, t) {
  const n = Le(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await Ud(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await ye(
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
async function rp(e, t, n, r, i = {}) {
  const o = za(e), s = tp(e), c = Xc(e.occurrence), l = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await np(e, r),
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
function ap(e, t, n) {
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
function ip(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function dl(e, t) {
  const n = ip(t);
  return Yi.set(e, n), n;
}
function op(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || Yi.has(e)) return;
    const r = new AbortController();
    return ye(`/api/performers/${e}`, { signal: r.signal }).then(
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
function sp() {
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
          var p, h, g = {}, y = {}, N = "", v = "", w = "", E = 2, O = 3, F = 2, B = [], C = 0, D = 0, x;
          for (x = 0; x < l.length; x += 1)
            if (N = l.charAt(x), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < F; p++)
                    C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < F; p++)
                    C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
                }
                E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
              } else
                for (h = g[w], p = 0; p < F; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              E--, E == 0 && (E = Math.pow(2, F), F++), g[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < F; p++)
                  C = C << 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < F; p++)
                  C = C << 1 | h, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  C = C << 1 | h & 1, D == f - 1 ? (D = 0, B.push(d(C)), C = 0) : D++, h = h >> 1;
              }
              E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
            } else
              for (h = g[w], p = 0; p < F; p++)
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
          var p = [], h = 4, g = 4, y = 3, N = "", v = [], w, E, O, F, B, C, D, x = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (O = 0, B = Math.pow(2, 2), C = 1; C != B; )
            F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 1:
              for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              D = n(O);
              break;
            case 2:
              return "";
          }
          for (p[3] = D, E = D, v.push(D); ; ) {
            if (x.index > l)
              return "";
            for (O = 0, B = Math.pow(2, y), C = 1; C != B; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (D = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                p[g++] = n(O), D = g - 1, h--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = d(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
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
var ul = sp();
function ir(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => ir(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && ir(n[s], r[s])
  );
}
function cp(e) {
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
        async (p) => [p, await si([p])]
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
function lp(e, t, n) {
  var s;
  const r = fl(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: o.includes("tags") && ((s = i == null ? void 0 : i.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function dp({
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
  ), l = s.every((v) => r[v]), f = Rr(
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
  const p = f.filter((v) => !d.has(v)), h = na(p);
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
            E && /* @__PURE__ */ a(ea, { "aria-hidden": "true" }),
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
function up({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Rr(e.view.objectFilter, t, c).bins, f = fp(e, t, n, o);
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
                v && /* @__PURE__ */ a(ea, { "aria-hidden": "true" }),
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
function fp(e, t, n, r) {
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
    const h = new AbortController(), g = Rr(
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
function kr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function pp(e) {
  if (!kr(e) || Object.keys(e).length !== 1 || !kr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !kr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function pl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function hp(e, t) {
  const n = t.find(
    (r) => ir(e, pl(r.filter))
  );
  return n ? n.key : pp(e);
}
function Rr(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && ir(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!kr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = hp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !kr(g) || Object.keys(g).length !== 1 ? p = !1 : h === 0 && kr(g.filter) && Object.keys(g.filter).length ? f = g.filter : !d && kr(g.group) ? d = g.group : p = !1;
    if (!p) break;
    i.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: i };
}
function hl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Rr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((g) => g.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (o.includes(t) ? o.filter((d) => d !== t) : [...o.filter((d) => !c || s(d) !== c), t]).reduce(mp, { ...e, view: { ...e.view, objectFilter: i } });
}
function mp(e, t) {
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
const li = [
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
], gp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Ir(e) {
  const t = Te(e) ? e.occurrence : void 0;
  return {
    filter: Jt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Le(e)),
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
  if (Te(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!li.some((c) => c !== "performer" && t.has(c))) {
    const c = Ir(e);
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
  if (Te(e) && (o = {
    ...gp,
    ...qs(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !io.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Jt(i, Le(e)),
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
  li.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", Ns(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", Ns(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), gl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function An(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Te(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Cr(e) {
  const t = e;
  return An(t, Ir(t));
}
function ks(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !ir(
    JSON.parse(er(An(e, t))),
    JSON.parse(er(An(e, Ir(e))))
  );
}
function xo(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Pe(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function bl(e, t) {
  if (Pe(e) !== "video") return e;
  const { base: n, bins: r } = Rr(
    e.view.objectFilter,
    t.view.objectFilter,
    xo(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ka(e, t) {
  if (Pe(e) !== "video") return t;
  const { base: n, bins: r } = Rr(
    t.objectFilter,
    e.view.objectFilter,
    xo(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function Es(e, t) {
  return !t || !Te(e) ? e : {
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
const an = (e) => e instanceof Error ? e.message : "Request failed.", bp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Ii = 50, yp = [], As = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function wp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Jl(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? js(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function vp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(zs, {}) : /* @__PURE__ */ a(ai, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: xi(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function Np({
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
  ), h = (H) => p[H] ?? { id: H, name: p[H] === void 0 ? "…" : "Unavailable tag" }, g = (H) => Ar(H.map(h)), y = f && e ? go(f, e, i) : null, N = e ? tu(e) : [], v = new Set(N.map((H) => H.id)), w = new Set(y == null ? void 0 : y.removed), E = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Ja, { "aria-hidden": "true" }),
    "absent"
  ] }), B = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((H) => !v.has(H))), D = n ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(me, { children: [
    /* @__PURE__ */ a(D, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((H) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(H.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Ja, { "aria-hidden": "true" }),
          O.has(H.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(Ht, { tag: H })
          ] }) : /* @__PURE__ */ a(Ht, { tag: H })
        ]
      },
      H.id
    )) })
  ] }), re = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(me, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (H) => w.has(H.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(Ht, { tag: H })
            ] }),
            E.has(H.id) && F
          ] }, H.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Ht, { tag: H }) }, H.id)
        ),
        B.map((H) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Ht, { tag: H })
        ] }) }, `added-${H.id}`)),
        C.map((H) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Ht, { tag: H }) }),
          F
        ] }, `absent-${H.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(me, { children: [
    !c && re,
    n,
    n && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function qp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    yo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function Sp({
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
  var Ma;
  const d = Le(e), p = Kn(d), h = d === "audio" ? "Audio" : "Scene", g = (m) => {
    var S;
    return m.title || ((S = m.files[0]) == null ? void 0 : S.basename) || h;
  }, y = (m) => `${m.occurrence ? `${m.occurrence.performer.name} — ` : ""}${g(m.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = Xi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (m) {
      v.current = an(m), N.current = { query: Ir(e), startAtEnd: !1 };
    }
  const [w, E] = T(null), [O, F] = T(""), B = $(null), C = $(null), D = $(null), x = $(null), [re, H] = T(!!v.current), j = $(0), [V, M] = T(N.current.query), _ = $(V);
  _.current = V;
  const [P, Y] = T(0), W = $(N.current.startAtEnd), [ie, Q] = T([]), [k, se] = T(null), A = $(null), [X, le] = T(null), [pe, G] = T(0), be = Ne(() => {
    var te;
    if (!k) return null;
    const m = ie.findIndex((ce) => ce.key === k.key), S = ((te = A.current) == null ? void 0 : te.key) === k.key ? A.current : null;
    return (m >= 0 ? ie.slice(m + 1) : S ? ie.filter((ce) => !S.before.includes(ce.key)) : []).find((ce) => ce.media.id !== k.media.id) ?? null;
  }, [k, ie]), [Ce, ke] = T(0), [we, Ve] = T(!1), [ue, it] = T(!1), Qe = $(!1), Ft = $(0), Qt = $(!1), Bt = $(null), tt = $(!0), _e = $(null);
  ee(() => (tt.current = !0, () => {
    tt.current = !1;
  }), []);
  const [je, We] = T(v.current), [cr, gt] = T(""), [Gn, nt] = T(""), [Ie, Ue] = T(null), [Be, Tt] = T(!1), [lr, sn] = T([]), It = $([]), bt = $(null), Cn = $(null), wn = $(null);
  ee(() => {
    var m, S;
    Be && ((S = (m = wn.current) == null ? void 0 : m.querySelector("input")) == null || S.focus());
  }, [Be]);
  const he = $(null);
  ee(() => {
    if (ue) return;
    const m = he.current;
    he.current = null;
    const S = document.activeElement;
    m != null && m.isConnected && (!S || S === document.body) && m.focus();
  }, [ue]);
  const [kt, Kt] = T(!1), [cn, vn] = T(!1), Ke = Ta(), [Et, de] = T(!1), U = l ?? Et, Oe = f ?? de;
  ee(() => {
    if (we || kt || !Cn.current) return;
    const m = requestAnimationFrame(() => {
      if (document.querySelector(As)) return;
      const S = Cn.current;
      Cn.current = null;
      const L = document.activeElement;
      L && L !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(m);
  }, [we, kt, P]);
  const [yt, Tn] = T([]), [oe, pt] = T({}), Wt = $(null), [Yt, Vn] = T({});
  ee(() => {
    let m = !0;
    return Promise.all(
      To(V.objectFilter).map(
        async (S) => [
          String(S),
          (await ye(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      m && Vn(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [V.objectFilter]);
  const dr = Ne(
    () => Io(V.objectFilter, Yt),
    [Yt, V.objectFilter]
  ), De = $(0), lt = $(e);
  lt.current = e;
  const wt = w ?? e, rt = Ne(
    () => An(wt, V),
    [wt, V]
  ), $t = Ne(
    () => Es(rt, V.performerFocus),
    [rt, V.performerFocus]
  ), Or = $($t);
  Or.current = $t;
  const In = $(rt);
  In.current = rt;
  const [ln, Nn] = T("items"), [I, K] = T(null), J = $(null), Ee = $("");
  function Se(m) {
    const S = typeof m == "function" ? m(J.current) : m;
    J.current = S, K(S);
  }
  const [Fe, ve] = T(!1), [Ye, $n] = T(null), ge = $(null), fe = Te(rt) ? za(rt) : "", [xt, ze] = T(0), [Gt, Rn] = T(null);
  ee(() => () => {
    var m;
    return (m = ge.current) == null ? void 0 : m.controller.abort();
  }, []), ee(() => {
    const m = ge.current;
    !m || m.signature === fe || (m.controller.abort(), ge.current = null, ve(!1));
  }, [fe]), ee(() => {
    var L;
    const m = J.current;
    if (ln !== "performers" || !fe || ((L = ge.current) == null ? void 0 : L.signature) === fe || Ee.current === fe || (m == null ? void 0 : m.signature) === fe && m.complete)
      return;
    const S = (m == null ? void 0 : m.signature) === fe ? m : null;
    un(m, (S == null ? void 0 : S.limit) ?? Ii);
  }, [ln, fe, I, Ye, Fe]);
  const On = V.performerFocus;
  ee(() => {
    if (!On) {
      Rn(null);
      return;
    }
    let m = !0;
    return ye(`/api/performers/${On}`).then((S) => {
      const L = dl(On, S.tags);
      m && Rn({ id: On, name: S.name, tags: L });
    }).catch(() => {
    }), () => {
      m = !1;
    };
  }, [On]);
  const ra = JSON.stringify(
    Te(rt) ? Ws(rt.occurrence) : []
  ), Pt = Ne(() => JSON.parse(ra), [ra]), Rt = Ne(() => iu(Pt), [Pt]), Xt = gc(Rt), ur = Ca(Rt), qn = (m) => {
    var S;
    return ((S = ur[m]) == null ? void 0 : S.name) ?? (ur[m] === null ? "Unavailable tag" : "…");
  }, Mr = (m) => ({
    name: qn(m),
    tagIds: Xt.get(m) ?? [m],
    resolved: Xt.has(m)
  }), dt = ol(
    Te(rt) ? rt : null,
    On ?? null,
    xt
  ), vt = ks(e, V), Lt = ks(e, Ka(e, V)), Je = ue || we || Be, Dt = Number(V.filter.page);
  function Xe(m, S = !1) {
    Qe.current || (Ft.current++, gt(""), v.current = "", W.current = S, _.current = m, M(m), ke(0), Ve(!0), S || ma(e.id, m), Y((L) => L + 1));
  }
  function Mn() {
    if (Qe.current = !1, it(!1), tt.current && _e.current) {
      const m = _e.current;
      _e.current = null, Xe(m.query, m.startAtEnd);
    }
  }
  ee(() => {
    const m = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = Xi(
            lt.current,
            new URLSearchParams(window.location.search)
          );
          Qe.current ? _e.current = S : Xe(S.query, S.startAtEnd);
        } catch (S) {
          We(an(S));
        }
    };
    return window.addEventListener("popstate", m), () => window.removeEventListener("popstate", m);
  }, [e.id]), ee(() => (r(ue || we || Be || !!w), () => r(!1)), [ue, we, Be, !!w, r]);
  async function dn(m, S, L) {
    if (Te(m)) {
      const ce = await Zc(
        m,
        Wt.current,
        S,
        L
      );
      return {
        items: ce.items.map((qe) => ({
          key: qe.key,
          media: qe.media,
          occurrence: qe
        })),
        totalCount: ce.totalCount
      };
    }
    const te = await Hr(
      m,
      { ...m.view.filter, page: S },
      L
    );
    return {
      items: te.items.map((ce) => ({ key: String(ce.id), media: ce })),
      totalCount: te.totalCount
    };
  }
  function Zt(m, S, L, te = !1, ce = !1) {
    if (!tt.current || _e.current) return;
    H(!0), Q(
      ce ? m.items : Ti(m.items, _.current.startFrom === "end")
    ), ke(m.totalCount), _t(L, te);
    const qe = {
      ..._.current,
      filter: { ..._.current.filter, page: S }
    };
    _.current = qe, M(qe), ma(e.id, qe);
  }
  function _t(m, S = !1) {
    Ft.current++, (m == null ? void 0 : m.key) !== (k == null ? void 0 : k.key) && (A.current = null), (m == null ? void 0 : m.media.id) !== (k == null ? void 0 : k.media.id) && le(S && m ? m.media.id : null), se(m);
  }
  ee(() => {
    if (v.current) return;
    const m = new AbortController();
    x.current = m;
    const S = ++De.current;
    return Ve(!0), We(""), nt(""), A.current = null, le(null), se(null), Q([]), Tt(!1), (async () => {
      const L = Es(
        An(lt.current, _.current),
        _.current.performerFocus
      );
      Wt.current = Te(L) ? await $o(L, m.signal) : null;
      let te = Number(L.view.filter.page), ce = await dn(L, te, m.signal);
      const qe = Math.max(
        1,
        Math.ceil(ce.totalCount / Number(L.view.filter.perPage))
      );
      (W.current || te > qe) && (te = qe, ce = await dn(L, te, m.signal)), W.current = !1;
      const ot = L.view.startFrom === "end" ? -1 : 1;
      for (; Te(L) && !ce.items.length && te + ot >= 1 && te + ot <= qe && !m.signal.aborted; )
        te += ot, ce = await dn(L, te, m.signal);
      if (S !== De.current || m.signal.aborted) return;
      const Ot = Ti(ce.items, L.view.startFrom === "end");
      Zt(ce, te, Ot[0] ?? null);
    })().catch((L) => {
      !m.signal.aborted && S === De.current && We(an(L));
    }).finally(() => {
      !m.signal.aborted && S === De.current && (H(!0), Ve(!1));
    }), () => {
      m.abort(), De.current++;
    };
  }, [P, e.id]);
  const Fr = $(null);
  ee(() => {
    if ((k == null ? void 0 : k.key) !== Fr.current && Ue(null), Fr.current = (k == null ? void 0 : k.key) ?? null, !k) return;
    let m = !0;
    return yn(d, k).then((S) => {
      m && (Ue(S), Tn(
        Te(e) ? S.ids.filter((L) => e.occurrence.tagIds.includes(L)) : []
      ));
    }).catch((S) => {
      m && We(`Could not load current tags. ${an(S)}`);
    }), () => {
      m = !1;
    };
  }, [k]), ee(() => {
    if (!Te(e) || e.actions.length)
      return;
    let m = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await ye(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      m && pt(Object.fromEntries(S));
    }).catch((S) => {
      m && We(an(S));
    }), () => {
      m = !1;
    };
  }, [e]);
  function fr(m, S = A.current) {
    const L = ie.findIndex((ht) => ht.key === m.key), te = V.startFrom === "end" ? -1 : 1, ce = (S == null ? void 0 : S.key) === m.key, qe = ce ? S : { key: m.key, page: Dt, before: ie.slice(0, L + 1).map((ht) => ht.key), after: ie.slice(L + 1).map((ht) => ht.key) }, ot = new Set(qe.after), Ot = new Set(qe.before), st = ie.find((ht) => ot.has(ht.key) || (te === 1 || Dt < qe.page) && ce && !Ot.has(ht.key));
    return { direction: te, cursor: qe, remainingKeys: ot, visitedKeys: Ot, nextLoaded: st };
  }
  async function xr(m = !1, S = !1, L = !1, te = () => !0, ce = A.current) {
    if (!k) return;
    const { direction: qe, cursor: ot, remainingKeys: Ot, visitedKeys: st, nextLoaded: ht } = fr(k, ce);
    if (!m && ht) {
      _t(ht, L);
      return;
    }
    const yr = m ? st : new Set(ie.map((Mt) => Mt.key));
    let mt = qe === -1 && !m ? Math.max(1, Dt - 1) : Dt;
    for (; tt.current && !_e.current; ) {
      let Mt = await dn($t, mt);
      const ct = Math.max(
        1,
        Math.ceil(Mt.totalCount / Number(V.filter.perPage))
      );
      mt > ct && (mt = ct, Mt = await dn($t, mt));
      const Nt = Ti(Mt.items, qe === -1), gn = new Map(Nt.map((jt) => [jt.key, jt])), wr = m ? ot.after.flatMap((jt) => {
        const Fa = gn.get(jt);
        return Fa ? [Fa] : [];
      }) : [], ca = new Set(wr.map((jt) => jt.key)), vr = m ? {
        ...Mt,
        items: [
          ...wr,
          ...Nt.filter(
            (jt) => jt.key !== k.key && !ca.has(jt.key)
          )
        ]
      } : { ...Mt, items: Nt };
      if (!te()) return;
      if (S) {
        A.current = ot, Zt(vr, mt, k, !1, !0);
        return;
      }
      const la = qe === -1 && Dt === 1 && !m ? void 0 : vr.items.find(
        (jt) => !yr.has(jt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(m && qe === -1 && mt === ot.page) || Ot.has(jt.key))
      );
      if (la || (qe === -1 ? mt <= 1 : mt >= ct)) {
        Zt(
          vr,
          mt,
          la ?? null,
          L,
          !0
        ), la || nt(
          Mt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      mt += qe;
    }
  }
  async function Ae(m, S = !1, L = !1, te = !1) {
    var Mt;
    if (Qt.current && m && k && !L && !te && !w && !Be) {
      Bt.current = { action: m, stay: S, key: k.key };
      return;
    }
    if (w || !k || Qe.current || we || Be && !L)
      return;
    const ce = L || te || !!(m != null && m.steps.length);
    if (ce && (!t || !Ie) || m && rr(m) && !n) return;
    const qe = !S && !L && !te && ce && m !== void 0 && Ie !== null && ts(e) && _i(Di(e.actions, ru(m, Ie, fn))).length > 0, ot = L && ((Mt = wn.current) != null && Mt.contains(document.activeElement)) ? document.activeElement : null;
    Qe.current = !0, it(!0), We(""), nt(""), Qt.current = !0;
    const Ot = A.current, st = ce && !S && !qe ? fr(k).nextLoaded ?? null : null;
    st && (Q(
      (ct) => ct.filter((Nt) => Nt.key !== k.key)
    ), _t(st, !0));
    let ht = !1, yr = !1, mt = [];
    try {
      if (ce) {
        const ct = await yn(d, k);
        if (m)
          await If($t, k, m);
        else {
          const gn = te && Te(e) ? e.occurrence.tagIds.filter((vr) => ct.ids.includes(vr)) : It.current, ca = Zr(gn, te ? yt : lr);
          await Mo($t, k, ca);
        }
        const Nt = await yn(d, k);
        st || Ue(Nt), yr = !0, Tt(!1), qe && (mt = _i(Di(e.actions, Nt))), nt(
          mt.length ? `Tags saved. Staying until answered: ${mt.map((gn) => gn.name).join(", ")}.` : "Tags saved."
        ), k.occurrence && (_r(k.occurrence.performer.id), ze((gn) => gn + 1));
      }
      if (!tt.current || _e.current) return;
      if (ce)
        if (st) {
          const ct = Ft.current;
          ht = !0, Qt.current = !1, Mn(), xr(!0, !1, !0, () => Ft.current === ct && !Qe.current, Ot).catch((Nt) => {
            Ft.current === ct && We(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${an(Nt)}`);
          });
        } else mt.length || await xr(!0, S, !S);
      else S || await xr();
      S && L && requestAnimationFrame(() => {
        var ct;
        return (ct = bt.current) == null ? void 0 : ct.focus();
      });
    } catch (ct) {
      if (We(
        yr ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${an(ct)}` : ce ? `Saving stopped. ${bp(an(ct))}${L || te ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${an(ct)}`
      ), ce && !yr) {
        he.current = ot, st && (Q(ie), le(null), G((Nt) => Nt + 1), se(k), A.current = Ot);
        try {
          Ue(await yn(d, k));
        } catch {
          Ue(null), We(
            (Nt) => `${Nt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      ht || (Qt.current = !1, Mn());
    }
  }
  ee(() => {
    const m = Bt.current;
    if (!(!m || ue || Qe.current)) {
      if ((k == null ? void 0 : k.key) !== m.key || je) {
        Bt.current = null;
        return;
      }
      Ie && (Bt.current = null, Ae(m.action, m.stay));
    }
  }, [ue, Ie, k, je]);
  const Pr = !Be && !w && !kt && !cn && (k != null || we || ue);
  wo({
    surface: "local",
    enabled: Pr,
    actions: e.actions,
    onAction: (m, S) => {
      const L = e.actions[m];
      L && Ae(L, S);
    },
    onFind: () => vn(!0)
  });
  const Sn = (m) => ue || we || !Ie || !!w || !t && m.steps.length > 0 || !n && rr(m);
  function Lr() {
    !i || w || Qe.current || Be || (D.current = document.activeElement, C.current = {
      error: je,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(_.current),
      items: ie,
      current: k,
      total: Ce,
      targets: Wt.current,
      stayedCursor: A.current
    }, Ft.current++, E(structuredClone(e)), F(""), nt(""), We(""));
  }
  ee(() => {
    if (!o) {
      j.current = 0;
      return;
    }
    o !== j.current && re && !we && (j.current = o, Lr(), s == null || s());
  }, [o, we, re]);
  function Fn() {
    E(null), F(""), requestAnimationFrame(() => {
      const m = D.current;
      m != null && m.isConnected && m !== document.body && m.focus();
    });
  }
  function di() {
    var S;
    const m = C.current;
    !m || ue || ((S = x.current) == null || S.abort(), De.current++, _.current = m.query, M(m.query), Q(m.items), se(m.current), ke(m.total), Wt.current = m.targets, A.current = m.stayedCursor, Ve(!1), We(m.error), nt(""), window.history.replaceState(window.history.state, "", m.url), Fn());
  }
  async function aa() {
    if (!w || !i || Qe.current) return;
    const m = An(
      { ...w, name: w.name.trim() },
      Ka(lt.current, _.current)
    ), S = wa(m);
    if (S) {
      F(S);
      return;
    }
    Qe.current = !0, it(!0), F("");
    try {
      if (await i(m) === !1) throw new Error("Could not save review.");
      Fn(), nt("Review saved.");
    } catch (L) {
      F(nc(L));
    } finally {
      Mn();
    }
  }
  async function pr() {
    if (!i || Qe.current) return;
    const m = Ka(lt.current, _.current), S = An(lt.current, {
      ...m,
      filter: { ...m.filter, page: 1 }
    });
    Qe.current = !0, it(!0), We(""), gt("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      nt("Queue saved to this review.");
    } catch (L) {
      gt("Could not save queue. " + an(L));
    } finally {
      Mn();
    }
  }
  const He = V.performerScope, Dr = (m) => {
    const { performerFocus: S, ...L } = _.current, te = S && !("targetMode" in m || "performerIds" in m || "performerFilter" in m);
    Xe(
      {
        ...L,
        ...te ? { performerFocus: S } : {},
        filter: { ...L.filter, page: 1 },
        performerScope: { ...He, ...m }
      },
      L.startFrom === "end"
    );
  };
  async function un(m, S) {
    var ce;
    const L = In.current;
    if (!Te(L)) return;
    (ce = ge.current) == null || ce.controller.abort();
    const te = {
      signature: za(L),
      controller: new AbortController()
    };
    ge.current = te, Ee.current = "", ve(!0), $n(null);
    try {
      const qe = await rp(L, m, S, te.controller.signal, {
        onProgress: (ot) => {
          ge.current === te && Se(ot);
        }
      });
      ge.current === te && Se(qe);
    } catch (qe) {
      ge.current === te && !te.controller.signal.aborted && (Ee.current = te.signature, $n({ signature: te.signature, message: an(qe) }));
    } finally {
      ge.current === te && (ge.current = null, ve(!1));
    }
  }
  function xe() {
    var m;
    (m = ge.current) == null || m.controller.abort(), ge.current = null, ve(!1), Se((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function _r(m) {
    var te;
    const S = In.current;
    if (!Te(S)) return;
    if (ge.current) {
      xe();
      return;
    }
    const L = za(S);
    if (!(((te = J.current) == null ? void 0 : te.signature) !== L || J.current.partial))
      try {
        const ce = await cl(S, m);
        if (ge.current) {
          xe();
          return;
        }
        Se(
          (qe) => (qe == null ? void 0 : qe.signature) === L ? ap(qe, m, ce) : qe
        );
      } catch {
        Se(
          (ce) => (ce == null ? void 0 : ce.signature) === L ? { ...ce, partial: !0, complete: !1 } : ce
        );
      }
  }
  const jr = V.performerFocus ? I == null ? void 0 : I.candidates.find((m) => m.id === V.performerFocus) : void 0, ut = Gt && Gt.id === V.performerFocus ? { ...Gt, flags: Sr(Pt, Gt.tags) } : jr ? { ...jr, flags: Sr(Pt, jr.tags) } : null, Ur = (m) => {
    if ((Gt == null ? void 0 : Gt.id) === m)
      return Sr(Pt, Gt.tags);
    const S = I == null ? void 0 : I.candidates.find((L) => L.id === m);
    return S ? Sr(Pt, S.tags) : void 0;
  }, en = ((Ma = k == null ? void 0 : k.occurrence) == null ? void 0 : Ma.performer.id) ?? null, Br = en === null ? void 0 : Ur(en), ia = op(
    Pt.length > 0 && en !== null && en !== V.performerFocus && Br === void 0 ? en : null
  ), hr = Br ?? (ia ? Sr(Pt, ia) : []), fn = mc(wt.actions), mr = dt.summary && V.performerFocus ? bo(Fo(dt.summary, wt.actions, fn)) : [], zn = ns(Pt, (ut == null ? void 0 : ut.flags) ?? [], Mr), Ia = vc(
    ns(Pt, hr, Mr),
    en !== null && en === V.performerFocus ? mr : []
  ), $a = JSON.stringify(Ia), oa = Ne(() => Ia, [$a]), ui = JSON.stringify(zn), Ra = Ne(() => zn, [ui]), gr = (m) => fu(Pt, m, qn);
  function fi(m) {
    if (Qe.current) return;
    const S = {
      ..._.current,
      performerFocus: m,
      filter: { ..._.current.filter, page: 1 }
    };
    Xe(S, S.startFrom === "end"), Nn("items");
  }
  function pn() {
    const { performerFocus: m, ...S } = _.current;
    Xe(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const xn = $(null);
  xn.current ?? (xn.current = $c());
  const Jn = xn.current, Hn = Ne(
    () => wt.actions.flatMap((m) => m.steps.flatMap((S) => S.tagIds)),
    [wt.actions]
  ), br = $(null);
  ee(() => {
    const m = br.current, S = m == null ? void 0 : m.querySelector('[aria-current="true"]');
    if (!m || !S) return;
    const L = m.getBoundingClientRect(), te = S.getBoundingClientRect();
    te.top < L.top ? m.scrollTop -= L.top - te.top : te.bottom > L.bottom && (m.scrollTop += te.bottom - L.bottom);
  }, [k == null ? void 0 : k.key, ln]);
  const hn = $(null), Pn = $(null);
  ee(() => {
    var L, te;
    const m = Pn.current;
    if (!m) return;
    Pn.current = null;
    const S = [...((L = hn.current) == null ? void 0 : L.querySelectorAll(".dq-partner")) ?? []];
    (te = S.find((ce) => ce.dataset.partnerKey === m) ?? S[0]) == null || te.focus();
  }, [k == null ? void 0 : k.key]);
  const Ln = ue || we || Be || !!w, Qn = Ne(
    () => w ? An(w, Ka(e, V)) : null,
    [w, e, V]
  ), pi = Ne(
    () => Qn != null && Yr(Cr(Qn)) !== Yr(Cr(e)),
    [Qn, e]
  );
  function hi() {
    k ? yn(d, k).then(Ue).catch((m) => We(an(m))) : Xe(_.current);
  }
  const Kr = je ? /* @__PURE__ */ u("p", { role: "alert", children: [
    je,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: ue, onClick: hi, children: k ? "Reload tags" : "Retry queue" })
  ] }) : null, Gr = ue || we || k != null && !Ie, Vr = Math.max(1, Number(V.filter.perPage) || 1), kn = $(1);
  we || (kn.current = Math.max(1, Math.ceil(Ce / Vr)));
  const $e = kn.current, Oa = He && k ? ie.filter(
    (m) => m.media.id === k.media.id && m.key !== k.key
  ) : [], sa = (m) => {
    var S;
    return m.title || ((S = m.files[0]) == null ? void 0 : S.basename) || `${d === "audio" ? "Audio" : "Video"} ${m.id}`;
  }, mn = k ? wp(k.media, d) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": He ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (m) => {
        var te;
        const S = m.target instanceof Element ? m.target.closest("button") : null, L = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((te = S == null ? void 0 : S.textContent) == null ? void 0 : te.trim()) ?? "";
        S && !S.closest(As) && /^(Filters|Edit filter:|Edit criteria)/.test(L) && (Cn.current = S);
      },
      children: [
        /* @__PURE__ */ a(
          Jc,
          {
            name: e.name,
            description: e.description,
            entityType: Pe(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Ln || !!(c != null && c.busy),
            onEdit: w ? () => {
              var m;
              return (m = B.current) == null ? void 0 : m.focus();
            } : Lr,
            editDisabled: !w && (Ln || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: ue || Be, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  ga,
                  {
                    filter: V.filter,
                    objectFilter: dr,
                    criteriaDefinitions: d === "audio" ? Ls : ni,
                    customFieldEntityType: d,
                    supportsFilterExpressions: !0,
                    totalCount: Ce,
                    sortOptions: d === "audio" ? Vl : Ds,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Hc,
                      {
                        page: Math.min(Math.max(1, Dt || 1), $e),
                        pages: $e,
                        onPage: (m) => Xe({
                          ..._.current,
                          filter: Jt(
                            { ..._.current.filter, page: m },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (m) => {
                      (m.sort !== _.current.filter.sort || m.direction !== _.current.filter.direction) && (m = { ...m, sorts: void 0 }), Xe(
                        {
                          ..._.current,
                          filter: Jt(m, d)
                        },
                        _.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (m) => {
                      Xe(
                        {
                          ..._.current,
                          objectFilter: Wc(
                            m,
                            Yt,
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
              He && /* @__PURE__ */ a(
                ep,
                {
                  scope: He,
                  disabled: ue || Be,
                  editing: !!w,
                  onChange: Dr,
                  onEditCriteria: () => Kt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Qc,
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
            trailingEnd: /* @__PURE__ */ u(me, { children: [
              Te($t) && t && /* @__PURE__ */ a(
                Vf,
                {
                  review: $t,
                  disabled: Je || !!w,
                  performerAttention: V.performerFocus ? Ra : void 0,
                  trees: fn,
                  onOpen: () => {
                    Qe.current = !0, it(!0);
                  },
                  onClose: (m) => {
                    if (m) {
                      const S = _.current.performerFocus;
                      S ? _r(S) : xe(), ze((L) => L + 1), Mn(), v.current || Ve(!0), Y((L) => L + 1);
                    } else Mn();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                Eo,
                {
                  disabled: Ln,
                  items: c.moreItems({
                    onSelect: Lr,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Wr,
                {
                  performer: {
                    id: V.performerFocus,
                    name: (ut == null ? void 0 : ut.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (ut == null ? void 0 : ut.name) ?? `performer ${V.performerFocus}` })
              ] }),
              ut != null && ut.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: gr(ut.flags), children: [
                /* @__PURE__ */ a(jn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: gr(ut.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Je,
                  onClick: pn,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: vt,
            queueChange: !w && vt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Lt ? () => void pr() : void 0,
              saveDisabled: Je || !i,
              onReset: () => {
                const m = Ir(e);
                Xe(m, m.startFrom === "end");
              },
              resetDisabled: Je
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && Qn && /* @__PURE__ */ a(
            zc,
            {
              drawerRef: B,
              draft: Qn,
              onChange: (m) => E(m),
              direction: V.startFrom,
              onDirectionChange: (m) => Xe({ ..._.current, startFrom: m }),
              tagGroups: yp,
              trees: fn,
              saving: ue,
              saveDisabled: we,
              error: O,
              dirty: pi,
              criteriaChanged: Lt,
              notices: Kr && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: Kr }),
              onSave: () => void aa(),
              onCancel: di
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              k ? /* @__PURE__ */ u(me, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${d}/${k.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${p.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: sa(k.media) }),
                        /* @__PURE__ */ a(Hs, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  mn && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: mn })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [k, be].filter(Boolean).map((m) => {
                    var te, ce, qe, ot, Ot;
                    const S = m, L = S.key === k.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: L ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": L ? void 0 : !0,
                        inert: L ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ a(
                          zl,
                          {
                            streamUrl: Pi("audio", S.media.id),
                            format: ((te = S.media.files[0]) == null ? void 0 : te.format) ?? "",
                            title: g(S.media),
                            coverUrl: L ? xi("audio", S.media) : void 0,
                            duration: ((ce = S.media.files[0]) == null ? void 0 : ce.duration) ?? 0,
                            autostart: L && X === S.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          _s,
                          {
                            videoId: S.media.id,
                            streamUrl: Pi("video", S.media.id),
                            posterUrl: L ? xi("video", S.media) : void 0,
                            duration: ((qe = S.media.files[0]) == null ? void 0 : qe.duration) ?? 0,
                            format: (ot = S.media.files[0]) == null ? void 0 : ot.format,
                            audioCodec: (Ot = S.media.files[0]) == null ? void 0 : Ot.audioCodec,
                            extensionSurface: L ? "quick-view" : void 0,
                            autostart: L && X === S.media.id,
                            keyboardShortcutsEnabled: L,
                            showAbLoop: L,
                            clip: S.media.parentVideoId != null ? {
                              start: S.media.clipStartSec ?? 0,
                              end: S.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${S.media.id}:${pe}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ a(
                    Jf,
                    {
                      details: k.media.details,
                      label: p.one
                    },
                    k.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: we ? "Loading review…" : Ce ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              wt.actions.length > 0 ? /* @__PURE__ */ a(
                Au,
                {
                  actions: wt.actions,
                  isDisabled: (m) => Be || Sn(m),
                  busy: Gr,
                  tags: Ie,
                  trees: fn,
                  preview: Jn,
                  onApply: (m, S) => void Ae(m, S),
                  onFind: () => vn(!0),
                  findDisabled: Be || !!w,
                  paused: !!w,
                  waitForGroups: ts(wt),
                  attention: oa,
                  stayOnTap: U,
                  onStayOnTapChange: Oe
                }
              ) : Te(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || ue || Be || !Ie || !!w || !k,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((m) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: yt.includes(m),
                          onChange: (S) => Tn(
                            e.occurrence.multiple ? S.target.checked ? [...yt, m] : yt.filter((L) => L !== m) : [m]
                          )
                        }
                      ),
                      oe[m] ?? "Loading tag…"
                    ] }, m)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Tn([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Ae(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Ae(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: hn, children: [
                k && /* @__PURE__ */ u(me, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: k.occurrence ? k.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      k.occurrence && /* @__PURE__ */ a(Wr, { performer: k.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: k.occurrence ? k.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: He ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    oa.length > 0 && /* @__PURE__ */ a(qp, { entries: oa })
                  ] }),
                  Oa.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${p.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          p.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Oa.map((m) => {
                          var S, L, te;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = m.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (L = m.occurrence) == null ? void 0 : L.performer.name,
                              "data-partner-key": m.key,
                              disabled: Je,
                              onClick: () => {
                                Pn.current = k.key, _t(m), We("");
                              },
                              children: [
                                m.occurrence && /* @__PURE__ */ a(Wr, { performer: m.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (te = m.occurrence) == null ? void 0 : te.performer.name })
                              ]
                            },
                            m.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    Np,
                    {
                      tags: Ie,
                      preview: Jn,
                      trees: fn,
                      actionTagIds: Hn,
                      label: `Current ${He ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: Be && !ue && (!Ie || Ie.ids.length !== It.current.length || Ie.ids.some((m) => !It.current.includes(m))),
                      editor: Be && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: wn,
                          disabled: ue,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              He ? "occurrence" : p.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              ar,
                              {
                                entityType: "tag",
                                values: lr,
                                onChange: sn,
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
                                  disabled: !Ie,
                                  onClick: () => void Ae(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ie,
                                  onClick: () => void Ae(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Tt(!1), requestAnimationFrame(() => {
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
                Te(rt) && V.performerFocus && /* @__PURE__ */ a(
                  Hi,
                  {
                    ...dt,
                    mediaKind: d,
                    actions: wt.actions,
                    trees: fn,
                    flags: Ra
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Kr,
                  !w && cr && /* @__PURE__ */ a("p", { role: "alert", children: cr }),
                  Gn && /* @__PURE__ */ a("p", { role: "status", children: Gn })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                k && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Gr || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: bt,
                      className: "dq-button",
                      disabled: Je || !!w || !t || !Ie,
                      onClick: () => {
                        Ft.current++, It.current = [...Ie.ids], sn([...Ie.ids]), Tt(!0);
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
                      disabled: Je || !!w,
                      onClick: () => void Ae(),
                      children: [
                        /* @__PURE__ */ a(od, { "aria-hidden": "true" }),
                        "Skip",
                        He ? " performer" : ` ${p.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              He && /* @__PURE__ */ u(
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
                        "aria-pressed": ln === "items",
                        onClick: () => Nn("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": ln === "performers",
                        onClick: () => Nn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              He && ln === "performers" ? /* @__PURE__ */ a(
                Qf,
                {
                  ranking: (I == null ? void 0 : I.signature) === fe ? I : null,
                  busy: Fe,
                  error: (Ye == null ? void 0 : Ye.signature) === fe ? Ye.message : "",
                  focus: V.performerFocus,
                  disabled: Je,
                  labels: p,
                  flagLabel: gr,
                  onFocus: fi,
                  onMore: () => {
                    const m = J.current;
                    m && un(m, m.limit + Ii);
                  },
                  onRefresh: () => {
                    Se(null), un(null, Ii);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: br, children: ie.map((m) => {
                var L;
                const S = (k == null ? void 0 : k.key) === m.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(m),
                    "aria-label": y(m),
                    "aria-current": S ? "true" : void 0,
                    disabled: Je,
                    onClick: () => {
                      _t(m), We(""), nt("");
                    },
                    children: [
                      /* @__PURE__ */ a(vp, { media: m.media, kind: d }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(m.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          m.occurrence && /* @__PURE__ */ u(me, { children: [
                            /* @__PURE__ */ a(Wr, { performer: m.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: m.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            m.media.date,
                            m.occurrence ? "" : (L = m.media.files[0]) != null && L.duration ? js(m.media.files[0].duration) : ""
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
        He && /* @__PURE__ */ a(
          Ps,
          {
            open: kt,
            onClose: () => Kt(!1),
            criteria: to,
            activeFilter: He.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (m) => {
              Kt(!1), Dr({ performerFilter: m });
            }
          }
        ),
        cn && /* @__PURE__ */ a(
          qo,
          {
            actions: e.actions,
            trees: fn,
            isDisabled: (m) => Sn(m),
            tapStays: Ke && U,
            onApply: (m, S) => {
              vn(!1), Ae(m, S);
            },
            onClose: () => vn(!1)
          }
        )
      ]
    }
  );
}
const yl = "data-quality.reviews-sort.v1", kp = { sort: "name", direction: "asc" };
function Ep() {
  try {
    const e = JSON.parse(localStorage.getItem(yl) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return kp;
}
function Ap(e) {
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
  const n = Pe(e), r = Kn(so(n)), i = n === "tag" ? "tag" : Te(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function Cp({ review: e, count: t }) {
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
function Tp({
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
              /* @__PURE__ */ a(sd, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: E ? e.some((F) => t[F.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (F) => i(F.target.value),
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
              children: r === "asc" ? /* @__PURE__ */ a(cd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(ld, { "aria-hidden": "true" })
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
        /* @__PURE__ */ a("tbody", { children: w.map((F) => {
          const B = Pe(F);
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
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Kc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Bc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Cp, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(Eo, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(ai, { "aria-hidden": "true" }),
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
function Ip({
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
                      y !== Pe(i) && t(vl(y, i));
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
const $p = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Rp(e, t, n, r) {
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
  return Pe(t) === "video" && Rr(t.view.objectFilter, e.view.objectFilter, xo(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function Ts(e, t) {
  return ir(
    JSON.parse(er(Cr(e))),
    JSON.parse(er(Cr(t)))
  );
}
const Ri = 180;
function Is(e) {
  return Pe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function $s(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function Rs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Oi(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  li.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  gl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Op(e) {
  return Jt({ ...e, page: 1 });
}
function Nl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Jr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Mp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(ro, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(fd, { "aria-hidden": "true" }) }
], Fp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(ro, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(ud, { "aria-hidden": "true" }) }
], Os = [], ql = "(min-width: 900px)";
function xp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ql);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Pp() {
  return typeof window.matchMedia == "function" && window.matchMedia(ql).matches;
}
function Lp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [E, O] = T([]), [F, B] = T(""), [C, D] = T(!0), [x, re] = T("account"), [H, j] = T(""), [V, M] = T(""), [_, P] = T(!1), [Y, W] = T(!1), [ie, Q] = T(""), [k, se] = T(Rs), A = $(k);
  A.current = k;
  const [X, le] = T({}), pe = $(X);
  pe.current = X;
  const G = $(t);
  G.current = t;
  const be = $(s);
  be.current = s;
  const Ce = $(!1), ke = $(!0);
  ee(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [we, Ve] = T(!k);
  we !== !k && (Ve(!k), k || le({}));
  const [ue, it] = T(Ep), { sort: Qe, direction: Ft } = ue, Qt = (b) => {
    const q = { ...ue, ...b };
    it(q), Ap(q);
  }, Bt = $(null), tt = $(null), [_e, je] = T(null), [We, cr] = T(!1), [gt, Gn] = T(!1), [nt, Ie] = T(null), [Ue, Be] = T(null), Tt = !!nt || !!Ue, lr = $(Tt);
  lr.current = Tt;
  const sn = We || !!Ue || gt, [It, bt] = T(0), [Cn, wn] = T(!1), [he, kt] = T(null), Kt = $(null), cn = $(null), vn = $(null), [Ke, Et] = T(
    null
  ), de = t.find((b) => b.id === k) ?? null, U = Ne(
    () => (Ke == null ? void 0 : Ke.id) === k && de ? { ...de, view: {
      ...de.view,
      filter: Ke.view.filter,
      objectFilter: Ke.view.objectFilter,
      searchMode: Ke.view.searchMode,
      startFrom: Ke.view.startFrom
    } } : de,
    [Ke, k, de]
  ), Oe = U ? Pe(U) : "video", yt = so(Oe), Tn = U ? Te(U) : !1, oe = Oe === "video" ? U : null, pt = Tn && !!(U != null && U.actions.some(rr)), Wt = !!oe || Oe === "audio" || pt, [Yt, Vn] = T(null), dr = (Yt == null ? void 0 : Yt.id) === (U == null ? void 0 : U.id) ? Yt == null ? void 0 : Yt.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", De = Tn || Oe === "audio" || Oe === "video" && dr === "single", [lt, wt] = T(0), rt = $(-1), $t = $(!1), Or = $(De);
  Or.current = De, ee(() => {
    const b = () => {
      const q = Or.current;
      if (!q && Fn.current) {
        $t.current = !0;
        return;
      }
      rt.current = -1, Nt(), q || wt((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const In = yt === "audio" ? h : d, ln = Oe === "tag" ? "Tag" : yt === "audio" ? "Audio" : "Video", Nn = Oe === "tag" ? y : In, I = $(
    null
  ), K = cp(oe), [J, Ee] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Se, Fe] = T({
    page: 1,
    perPage: 40
  }), [ve, Ye] = T({ items: [], totalCount: 0 }), [$n, ge] = T(k);
  $n !== k && (ge(k), Ye({ items: [], totalCount: 0 }), W(!1));
  const [fe, xt] = T(!1), [ze, Gt] = T(""), [Rn, On] = T(!1), [ra, Pt] = T(!1), [Rt, Xt] = T(() => /* @__PURE__ */ new Set()), ur = $(Rt);
  ur.current = Rt;
  const qn = $(/* @__PURE__ */ new Map()), Mr = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [dt, vt] = T(null), Lt = $(dt);
  Lt.current = dt;
  const [Je, Dt] = T(!1), Xe = $(Je);
  Xe.current = Je;
  const Mn = $(null), [dn, Zt] = T(!1), [_t, Fr] = T("grid"), [fr, xr] = T(Ri), [Ae, Pr] = T(!1), [Sn, Lr] = T(!1), Fn = $(!1), [di, aa] = T(""), [pr, He] = T(""), [Dr, un] = T(""), [xe, _r] = T(null), [jr, ut] = T(""), [Ur, en] = T(!1), [Br, ia] = T({}), hr = $(/* @__PURE__ */ new Map()), fn = $(null), mr = $(null), zn = !!U, Ia = Zi(xp, Pp, () => !1) && zn, [$a, oa] = T({ top: 0, bottom: 0 });
  Ct(() => {
    if (!zn) return;
    const b = () => {
      const R = mr.current;
      if (!R) return;
      const z = Math.round(R.getBoundingClientRect().top + window.scrollY), ne = R.closest("main"), ae = ne ? Math.round(parseFloat(getComputedStyle(ne).paddingBottom) || 0) : 0;
      oa(
        (Z) => Z.top === z && Z.bottom === ae ? Z : { top: z, bottom: ae }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [zn]);
  const [ui, Ra] = T(0), gr = $(null), fi = En((b) => {
    var R;
    if ((R = gr.current) == null || R.disconnect(), gr.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => Ra(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), gr.current = q;
  }, []), pn = $(0), xn = $(0), Jn = $(null), Hn = $(null), br = mc(
    U && !De ? he ? [...U.actions, ...he.draft.actions] : U.actions : Os
  ), hn = Ne(
    () => he && U && de ? Rp(he.draft, U, J, de) : null,
    [he, U, J, de]
  ), Pn = Ne(
    () => U && de ? bl(
      { ...de, view: { ...U.view, filter: { ...J, page: 1 } } },
      de
    ) : null,
    [U, de, J]
  ), Ln = Ne(
    () => de ? Yr(Cr(de)) : "",
    [de]
  ), Qn = Ne(
    () => Pn != null && Yr(Cr(Pn)) !== Ln,
    [Pn, Ln]
  ), pi = Ne(
    () => hn != null && Yr(Cr(hn)) !== Ln,
    [hn, Ln]
  );
  ee(() => {
    if (!pr) return;
    const b = window.setTimeout(() => He(""), 4e3);
    return () => window.clearTimeout(b);
  }, [pr]), ee(() => {
    if (!_e || _e.alert) return;
    const b = window.setTimeout(() => je(null), 6e3);
    return () => window.clearTimeout(b);
  }, [_e]), ee(() => {
    const b = oe ? To(oe.view.objectFilter) : [];
    if (ia({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (z) => {
        var ne;
        try {
          const ae = await ye(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (ne = ae.name) != null && ne.trim() ? [String(z), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      R && ia(
        Object.fromEntries(z.filter((ne) => ne !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [oe == null ? void 0 : oe.id, oe == null ? void 0 : oe.view.objectFilter]);
  const hi = Ne(
    () => oe ? Io(
      oe.view.objectFilter,
      Br
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [Br, U, oe]
  ), Kr = En(async () => {
    c(!0), f("");
    try {
      const b = await Od();
      n(b.reviews), o(b.storageKey), p(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), D(b.canConfigure ?? !0), re(b.storage ?? "account"), j(b.storageNotice ?? ""), k && !b.reviews.some((q) => q.id === k) && (se(""), Oi(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [k]);
  ee(() => {
    if (!v) {
      O([]), B("");
      return;
    }
    const b = new AbortController();
    return B(""), Gd(b.signal).then(O).catch((q) => {
      b.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), ee(() => {
    Kr();
  }, []), ee(() => {
    if (k || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof pe.current[q.id] == "number") continue;
      (Te(q) ? $o(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : Hr(Ro(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : Pe(q) === "tag" ? Ni(
        q,
        Jt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : Hr(
        q,
        Jt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || le((ne) => ({
          ...ne,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || le((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [k, t]), Ct(() => {
    var R, z;
    const b = tt.current;
    if (k || s || !b) return;
    tt.current = null, (z = (b === "heading" ? null : [...((R = mr.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (ne) => ne.dataset.reviewId === b.reviewId
    )) ?? Bt.current) == null || z.focus();
  }, [k, s, Ue, t]);
  const Gr = $(0), Vr = En(async () => {
    const b = ++Gr.current;
    _r(null), ut("");
    try {
      const q = await (pt ? uc(yt) : dc(yt));
      b === Gr.current && _r(q);
    } catch (q) {
      if (b !== Gr.current) return;
      _r(null), ut(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [pt, yt]);
  ee(() => {
    Vr();
  }, [Vr]);
  const kn = En(
    async (b, q, R = !1, z = !1) => {
      var Ge, Me;
      const ne = ++pn.current;
      (Ge = Jn.current) == null || Ge.abort();
      const ae = new AbortController();
      Jn.current = ae, q = Jt(q);
      const Z = Number(q.page);
      R && (q = { ...q, page: 1 }), Ee(q), Pt(R), xt(!0), Gt("");
      try {
        const Ze = (Re) => Pe(b) === "tag" ? Ni(
          b,
          Re,
          ae.signal
        ) : Hr(
          b,
          Re,
          ae.signal
        );
        let ft = await Ze(q);
        const Vt = Math.max(
          1,
          Math.ceil(ft.totalCount / Number(q.perPage))
        ), At = R ? Vt : Math.min(Z, Vt);
        return Number(q.page) !== At && (q = { ...q, page: At }, ft = await Ze(q)), ne === pn.current && (((Me = Hn.current) == null ? void 0 : Me.page) !== At && (Hn.current = {
          page: At,
          ids: new Set(ft.items.map((Re) => Re.id))
        }), Ye(ft), z && L(
          () => new Set(ft.items.map((Re) => Re.id))
        ), Ee(q), Fe(q)), ft;
      } catch (Ze) {
        throw ne === pn.current && Gt(
          Ze instanceof Error ? Ze.message : "Could not load the review queue."
        ), Ze;
      } finally {
        ne === pn.current && xt(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (xn.current += 1, rt.current = -1, pn.current += 1, (q = Jn.current) == null || q.abort(), kt(null), Kt.current = null, W(!1), Q(""), M(""), P(!1), Xt(/* @__PURE__ */ new Set()), qn.current.clear(), vt(null), Dt(!1), Pr(!1), Fn.current = !1, aa(""), He(""), un(""), Ye({ items: [], totalCount: 0 }), Hn.current = null, On(!1), !U || De) {
      xt(!1), Et(null);
      return;
    }
    let b = !0;
    return xt(!0), (async () => {
      let R = de ?? U;
      Et(null);
      let z = null;
      const ne = new URLSearchParams(window.location.search);
      if (Pe(U) === "video" && li.some((Me) => ne.has(Me)))
        try {
          const Me = R;
          z = Xi(Me, ne);
          const Ze = An(Me, z.query);
          (z.query.startFrom !== (Me.view.startFrom ?? "end") || !ir(
            JSON.parse(er(Ze)),
            JSON.parse(er(An(Me, Ir(Me))))
          )) && (R = Ze, Et(R));
        } catch (Me) {
          On(!0), Gt(Me instanceof Error ? Me.message : "Could not read review URL."), xt(!1);
          return;
        }
      let ae = null;
      try {
        ae = await Ld(i, U.id);
      } catch (Me) {
        b && (P(!0), M(
          Me instanceof Error ? Me.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Z = (ae == null ? void 0 : ae.signature) === er(R) ? ae : null, Ge = z ? z.query.filter : Z ? Jt(Z.filter) : Op(R.view.filter);
      Ee(Ge), Fr(
        Z ? $s(Z.displayMode, Pe(U)) : Is(U)
      ), xr(
        Z ? Z.cardSize ?? Ri : Ri
      );
      try {
        const Me = await kn(
          R,
          Ge,
          z ? z.startAtEnd : !Z && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const Ze = zo(
          Me.items.map((ft) => ft.id),
          (Z == null ? void 0 : Z.focusedId) ?? null,
          (Z == null ? void 0 : Z.index) ?? 0
        );
        vt(Ze), S(Ze);
      } catch {
      }
      b && (rt.current = lt, W(!0), Q(`${U.id}:${lt}`));
    })(), () => {
      var R;
      b = !1, xn.current++, pn.current++, (R = Jn.current) == null || R.abort();
    };
  }, [U == null ? void 0 : U.id, De, lt]), ee(() => {
    if (!(!It || De || !U)) {
      if (Rn) {
        bt(0);
        return;
      }
      Ae || he || Sn || ie !== `${U.id}:${lt}` || (bt(0), yi());
    }
  }, [
    It,
    De,
    U == null ? void 0 : U.id,
    ie,
    Ae,
    Sn,
    lt,
    Rn
  ]), ee(() => {
    !oe || De || !Y || fe || ze || Ae || $t.current || rt.current !== lt || ma(oe.id, {
      filter: J,
      objectFilter: oe.view.objectFilter,
      searchMode: oe.view.searchMode,
      startFrom: oe.view.startFrom ?? "end"
    });
  }, [oe, De, Y, fe, ze, J, Ae, lt]);
  const $e = Ne(
    () => ve.items.map((b) => b.id),
    [ve.items]
  );
  ee(() => {
    if (!Y || !U || !i || fe || ze || Ae || (Ke == null ? void 0 : Ke.id) === U.id || _ || rt.current !== lt)
      return;
    const b = {
      version: 1,
      signature: er(U),
      filter: J,
      focusedId: dt,
      index: Math.max(0, $e.indexOf(dt ?? -1)),
      displayMode: _t,
      cardSize: fr,
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
      Dd(i, U.id, b).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
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
    fe,
    ze,
    Ae,
    J,
    dt,
    $e,
    _t,
    fr,
    Ke,
    V,
    _,
    lt
  ]);
  const Oa = ve.items.find((b) => b.id === dt) ?? null, sa = Oe === "video" ? Oa : null;
  Je && sa && (Mn.current = sa);
  const mn = sa ?? (Je ? Mn.current : null), Ma = Qo(Rt, dt), m = $e.length > 0 && $e.every((b) => Rt.has(b)), S = En((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (lr.current || Ad(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = hr.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    Y && !Xe.current && S(Lt.current);
  }, [Y, S]), ee(() => {
    fe || !$e.length || (Lt.current == null || !$e.includes(Lt.current)) && (vt($e[0]), Xe.current || S($e[0]));
  }, [S, $e, fe]);
  const L = En(
    (b) => {
      Xt((q) => {
        const R = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(z) !== R.has(z) && qn.current.set(
            z,
            (qn.current.get(z) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), te = En(
    (b) => {
      if (!$e.length) return;
      const q = Math.max(
        0,
        $e.indexOf(Lt.current ?? $e[0])
      ), R = $e[Math.max(0, Math.min($e.length - 1, q + b))];
      vt(R), Xe.current || S(R);
    },
    [S, $e]
  ), ce = En(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, ne = z != null && (!v || !E.some((et) => et.id === z)), ae = "effect" in b && R && !v, Z = Qo(
        ur.current,
        Lt.current
      );
      if (!U || Fn.current || fe || ze) return;
      const Ge = R && !Nn ? `${ln} write permission is required to apply ${b.label}.` : ae || ne ? `${b.label} needs a tag group that is unavailable.` : rr(b) && (xe == null ? void 0 : xe.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Z.length ? "" : `Select or focus a ${Oe} before applying ${b.label}.`;
      if (Ge) {
        un(Ge);
        return;
      }
      const Me = ++xn.current, Ze = U.id, ft = [...$e], Vt = ve, At = Lt.current, Re = new Set(ur.current), tn = new Map(
        Z.map((et) => [et, qn.current.get(et) ?? 0])
      ), Nr = () => Me === xn.current && U.id === Ze;
      Fn.current = !0, Pr(!0), aa(
        ur.current.size ? `${Z.length} selected ${Oe}s` : `the focused ${Oe}`
      ), He(""), un("");
      const Uo = Vt.items.filter(
        (et) => !Z.includes(et.id)
      ), Ml = Uo.map((et) => et.id), Bo = Wo(
        ft,
        Ml,
        At,
        Z.includes(At ?? -1)
      );
      q || (Ye({
        items: Uo,
        totalCount: Vt.totalCount
      }), Xt((et) => {
        const zt = new Set(et);
        for (const bn of Z) zt.delete(bn);
        return zt;
      }), vt(Bo), Xe.current || S(Bo));
      let wi = !1;
      try {
        if ("effect" in b ? await Zd(b, Z) : await pc(yt, b, Z), wi = !0, !Nr()) return;
        q || Xt((et) => {
          const zt = new Set(et);
          for (const bn of Z)
            (qn.current.get(bn) ?? 0) === tn.get(bn) && zt.delete(bn);
          return zt;
        }), He(
          `${b.label}: ${Z.length} ${Oe}${Z.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (et) {
        if (!Nr()) return;
        Ye(Vt), Xt((zt) => {
          const bn = new Set(zt);
          for (const nn of Z)
            Re.has(nn) && (qn.current.get(nn) ?? 0) === tn.get(nn) && bn.add(nn);
          return bn;
        }), vt(At), Xe.current || S(At), un(
          et instanceof Error ? et.message : "Action failed."
        );
      }
      try {
        if (!Nr()) return;
        if (q) {
          const Ut = Oe === "tag" ? await Ni(U, J) : await Hr(U, J), Wn = new Map(
            Ut.items.map((rn) => [rn.id, rn])
          );
          if (Oe !== "tag" && await Promise.all(
            Z.filter((rn) => !Wn.has(rn)).map(async (rn) => {
              const Yn = await Xa(yt, rn).catch(() => null);
              Yn && Wn.set(rn, Yn);
            })
          ), !Nr()) return;
          Ye((rn) => ({
            items: rn.items.map((Yn) => Wn.get(Yn.id) ?? Yn),
            totalCount: Ut.totalCount
          }));
          return;
        }
        const et = new Set(Z), zt = Mr && ft.length > 0 && ft.every((Ut) => et.has(Ut)), bn = await kn(U, J, !1, zt);
        if (!Nr()) return;
        let nn = bn.items.map((Ut) => Ut.id);
        const La = Hn.current, Fl = (La == null ? void 0 : La.page) === Number(J.page) && nn.some((Ut) => La.ids.has(Ut)), xl = (U.view.startFrom ?? "end") !== "beginning";
        if (bn.totalCount > 0 && Number(J.page) > 1 && (!nn.length || xl && !Fl)) {
          const Ut = Math.max(1, Number(J.page) - 1), Wn = { ...J, page: Ut };
          Ee(Wn), nn = (await kn(
            U,
            Wn,
            !1,
            zt
          )).items.map((vi) => vi.id), Xt(
            (vi) => new Set([...vi].filter((Pl) => nn.includes(Pl)))
          );
          const Yn = nn.at(-1) ?? null;
          vt(Yn), Xe.current || S(Yn);
        } else {
          Xt(
            (Wn) => new Set([...Wn].filter((rn) => nn.includes(rn)))
          );
          const Ut = Wo(
            ft,
            nn,
            At,
            wi && Z.includes(At ?? -1)
          );
          vt(Ut), Xe.current && Ut == null && Dt(!1), Xe.current || S(Ut);
        }
      } catch (et) {
        Nr() && un(
          (zt) => `${zt ? `${zt} ` : ""}${wi ? "The action completed, but " : ""}the queue could not be refreshed. ${et instanceof Error ? et.message : "Refresh failed."}`
        );
      } finally {
        Nr() && (Fn.current = !1, Pr(!1), aa(""), $t.current && ($t.current = !1, Nt(), wt((et) => et + 1)));
      }
    },
    [
      Nn,
      v,
      E,
      Oe,
      xe,
      kn,
      J,
      S,
      $e,
      ve,
      fe,
      ze,
      U
    ]
  );
  function qe() {
    var R;
    if (_t === "list") return 1;
    const b = (R = fn.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const ot = $(() => {
  });
  ot.current = (b) => {
    var ae;
    if (De || b.defaultPrevented || b.repeat || on(b) || b.ctrlKey || b.altKey || b.metaKey || Tt) return;
    const q = b.target, R = q instanceof Node && ((ae = mr.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z) return;
    if (dn) {
      b.key === "Escape" && (Jr(b), Zt(!1));
      return;
    }
    if (Je && b.key === "Escape") {
      Jr(b), Dt(!1), S(Lt.current);
      return;
    }
    if (!Ed(q)) return;
    const ne = kd(q);
    if (b.key === "Escape") {
      Jr(b), L(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!Je && b.key === " " && ne) {
      Jr(b), dt != null && L((Z) => Ga(Z, dt));
      return;
    }
    if (!(Ae || fe) && !Je && b.key === "Enter" && dt != null && ne) {
      if (Oe !== "tag" && he) return;
      Jr(b), Oe === "tag" ? window.open(`/tag/${dt}`, "_blank", "noopener,noreferrer") : Dt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => ot.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Ot = $(
    () => {
    }
  );
  Ot.current = (b) => {
    var ae;
    if (De || Tt || Je || dn || Ae || fe || !$e.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((ae = mr.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z || !b.key.startsWith("Arrow") || !Cd(q)) return;
    const ne = Td(b.key, qe());
    ne && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), te(ne));
  }, ee(() => {
    const b = (q) => Ot.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const st = (he == null ? void 0 : he.saving) === !0 || Sn, ht = Ae || fe && !Y || st, yr = vo();
  wo({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !De && !Tt && !he && !Je && !dn && !ze && (ve.items.length > 0 || fe || Ae),
    actions: (U == null ? void 0 : U.actions) ?? Os,
    onAction: (b, q) => {
      const R = U == null ? void 0 : U.actions[b];
      R && ce(R, q);
    },
    onFind: () => Zt(!0),
    onSelectAll: () => L((b) => Sd(b, $e))
  }), ee(() => Zt(!1), [De, Je, U == null ? void 0 : U.id]);
  function mt(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = R != null && !E.some((ne) => ne.id === R);
    return Ae || fe || !!ze || q && !Nn || "effect" in b && q && (!v || z) || rr(b) && (xe == null ? void 0 : xe.kind) !== "ready" || !Ma.length;
  }
  function Mt(b) {
    Vn(null), bt(0), je(null), se(b), Oi(b, !!b && !U);
  }
  function ct() {
    Ce.current || (ml() ? (Ce.current = !0, window.history.back()) : Mt(""));
  }
  function Nt() {
    const b = Ce.current;
    Ce.current = !1;
    let q = Rs();
    q && !be.current && !G.current.some((z) => z.id === q) && (q = "", Oi(""));
    const R = A.current;
    q !== R && (bt(0), b || je(null), !q && R && (tt.current ?? (tt.current = { reviewId: R }))), se(q);
  }
  function gn() {
    tt.current = "heading", je(null), ct();
  }
  function wr(b) {
    b !== k && Mt(b), bt((q) => q + 1);
  }
  function ca() {
    je(null), Ie({
      review: vl("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function vr(b) {
    if (sn || !C) return;
    je(null);
    const q = crypto.randomUUID();
    let R;
    const z = k;
    Gn(!0);
    try {
      if (!await da((ae) => (R = Ho(
        ae.find((Z) => Z.id === b.id) ?? b,
        ae,
        q
      ), [...ae, R]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      A.current !== z ? je({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : wr(R.id);
    } catch (ne) {
      je({
        text: `“${b.name}” was not duplicated. ${xa(ne)}`,
        alert: !0
      });
    } finally {
      Gn(!1);
    }
  }
  async function la() {
    if (!nt || nt.saving) return;
    const b = { ...nt.review, name: nt.review.name.trim() }, q = wa(b);
    if (q) {
      Ie({ ...nt, error: q });
      return;
    }
    Ie({ ...nt, saving: !0, error: "" });
    try {
      if (!await da((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Ie(null), wr(b.id);
    } catch (R) {
      Ie(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function jt() {
    if (!Ue || Ue.pending) return;
    const b = Ue.review, q = wl(t, X, Qe, Ft).map((ne) => ne.id), R = q.filter((ne) => ne !== b.id), z = R[Math.min(q.indexOf(b.id), R.length - 1)];
    Be({ review: b, pending: !0 });
    try {
      if (!await da((ne) => ne.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      tt.current = b.id !== k && z ? { reviewId: z } : "heading", je({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (ne) {
      je({ text: `“${b.name}” was not deleted. ${xa(ne)}`, alert: !0 });
    } finally {
      Be(null);
    }
  }
  async function Fa(b) {
    if (!(sn || !C)) {
      je(null), cr(!0);
      try {
        const q = await uf(b);
        let R = 0, z = 0;
        if (q.length && !await da((ae) => {
          const Z = [...ae];
          R = z = 0;
          for (const Ge of q) {
            const Me = Z.find((Ze) => Ze.id === Ge.id);
            if (!Me) Z.push(Ge);
            else if (JSON.stringify(Me) !== JSON.stringify(Ge))
              Z.push(Ho(Ge, Z, crypto.randomUUID())), z++;
            else continue;
            R++;
          }
          return R ? Z : ae;
        }))
          throw new Error("Could not save reviews.");
        const ne = q.length - R;
        je({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}` + (z ? ` (${z === 1 ? "1 as a copy" : `${z} as copies`} beside a listed version that differs)` : "") + "." + (ne === 1 ? " 1 review already in the list stays as it is." : ne ? ` ${ne} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        je({ alert: !0, text: `Could not import “${b.name}”. ${xa(q)}` });
      } finally {
        cr(!1);
      }
    }
  }
  function xa(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function Po(b) {
    const q = !C || sn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ks, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void vr(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Qs, { "aria-hidden": "true" }),
        onSelect: () => ko(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(ri, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          je(null), Be({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Lo(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || gt
      },
      ...Po(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ka, { "aria-hidden": "true" }),
        separated: !0,
        disabled: gt,
        onSelect: gn
      }
    ];
  }
  async function da(b) {
    if (!i) return !1;
    let q = [];
    const R = await Pd(i, (Z) => {
      q = Z;
      const Ge = b(Z);
      return Ge === Z ? Z : Ge.map(jp);
    });
    if (n(R), !ke.current) return !0;
    const z = A.current;
    z && !R.some((Z) => Z.id === z) && ct();
    const ne = q.find((Z) => Z.id === z), ae = R.find((Z) => Z.id === z);
    return ae && ne && ((ae.view.reviewMode ?? "single") !== (ne.view.reviewMode ?? "single") && Vn(null), ae.view.displayMode !== ne.view.displayMode && Fr(Is(ae))), !0;
  }
  function mi(b) {
    return da((q) => _p(q, b));
  }
  function Sl(b) {
    return mi(b).catch((q) => {
      throw A.current !== b.id && gi(b, q), q;
    });
  }
  function gi(b, q) {
    var z;
    if (!ke.current) return;
    const R = ((z = G.current.find((ne) => ne.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    je({ text: `“${R}” was not saved. ${xa(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(Ms, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(me, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Vp().catch(
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
          onRetry: () => void Kr()
        }
      )
    ] });
  const bi = /* @__PURE__ */ u(me, { children: [
    H && /* @__PURE__ */ a("p", { className: "dq-status", children: H }),
    Wt && (xe == null ? void 0 : xe.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      xe.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Ur,
          onClick: () => {
            en(!0), ut(""), (pt ? Qd(yt) : Hd(yt)).then(Vr).catch(
              (b) => ut(
                `Could not create the ${pt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => en(!1));
          },
          children: Ur ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Wt && ((xe == null ? void 0 : xe.kind) === "incompatible" || jr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, {}),
      jr || (xe == null ? void 0 : xe.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Ur,
          onClick: () => {
            en(!0), Vr().finally(
              () => en(!1)
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
    V && /* @__PURE__ */ u("p", { role: "alert", children: [
      V,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            M(""), P(!1);
          },
          children: _ ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    _e && (_e.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
      _e.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: _e.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: mr,
      className: `data-quality-page${zn ? " dq-page-fit" : ""}`,
      style: zn ? {
        "--dq-fit-top": `${$a.top}px`,
        "--dq-fit-bottom": `${$a.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: _e && !_e.alert ? _e.text : "" }),
        U && De ? /* @__PURE__ */ a(
          Sp,
          {
            review: de ?? U,
            canWrite: Tn ? y : In,
            canAssess: (xe == null ? void 0 : xe.kind) === "ready" && In,
            onBusy: Pr,
            editRequest: It,
            onEditRequestHandled: () => bt(0),
            onSaveDefaults: C ? Sl : void 0,
            pageControls: {
              onBack: gn,
              moreItems: (b) => Lo(de ?? U, b),
              onGrid: oe ? () => Vn({ id: oe.id, mode: "multiple" }) : void 0,
              notices: bi,
              busy: gt
            },
            stayOnTap: Cn,
            onStayOnTapChange: wn
          },
          U.id
        ) : U ? Rl(U) : /* @__PURE__ */ a(
          Tp,
          {
            reviews: t,
            counts: X,
            sort: Qe,
            direction: Ft,
            onSortChange: (b) => Qt({ sort: b }),
            onDirectionChange: (b) => Qt({ direction: b }),
            storage: $p[x],
            canConfigure: C,
            busy: sn,
            headingRef: Bt,
            notices: bi,
            onOpen: Mt,
            onNew: () => ca(),
            onImport: (b) => void Fa(b),
            onExportAll: () => Gc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Xr, { "aria-hidden": "true" }),
                disabled: !C || sn,
                onSelect: () => wr(b.id)
              },
              ...Po(b)
            ]
          }
        ),
        Je && mn && oe && /* @__PURE__ */ a(
          Gp,
          {
            video: mn,
            review: oe,
            details: lp(mn, oe, K.ids),
            selectedCount: Rt.size,
            pending: Ae,
            refreshing: fe || !!ze,
            error: Dr,
            canWrite: d,
            assessmentReady: (xe == null ? void 0 : xe.kind) === "ready",
            trees: br,
            selected: Rt.has(mn.id),
            hasPrevious: $e.indexOf(mn.id) > 0,
            hasNext: $e.indexOf(mn.id) >= 0 && $e.indexOf(mn.id) < $e.length - 1,
            onToggleSelected: () => L((b) => Ga(b, mn.id)),
            onPrevious: () => te(-1),
            onNext: () => te(1),
            onClose: () => {
              Dt(!1), S(Lt.current);
            },
            onAction: ce,
            findOpen: dn,
            onFindOpenChange: Zt
          }
        ),
        dn && U && !De && !Je && /* @__PURE__ */ a(
          qo,
          {
            actions: U.actions,
            tagGroups: E,
            trees: br,
            isDisabled: mt,
            onApply: (b, q) => {
              Zt(!1), ce(b, q);
            },
            onClose: () => Zt(!1)
          }
        ),
        nt && /* @__PURE__ */ a(
          Ip,
          {
            draft: nt,
            onChange: (b) => Ie((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void la(),
            onCancel: () => Ie(null)
          }
        ),
        /* @__PURE__ */ a(
          Hl,
          {
            open: !!Ue,
            title: "Delete review?",
            message: Ue ? `“${Ue.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Ue == null ? void 0 : Ue.pending) ?? !1,
            onConfirm: () => void jt(),
            onCancel: () => Be((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function Pa(b, q, R = !1, z = !0) {
    const ne = Lt.current, ae = Math.max(0, $e.indexOf(ne ?? -1));
    try {
      const Z = kn(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), Ge = pn.current, Me = await Z;
      if (Ge !== pn.current) return;
      const Ze = Me.items.map((Vt) => Vt.id);
      Xt(
        (Vt) => new Set([...Vt].filter((At) => Ze.includes(At)))
      );
      const ft = zo(Ze, ne, ae);
      vt(ft), z && !Xe.current && S(ft, !1);
    } catch {
    }
  }
  function kl(b) {
    const q = I.current;
    if (I.current = null, ht || !U || !de) return;
    const R = q ?? U.view.objectFilter, z = ir(
      R,
      de.view.objectFilter
    ) ? de.view.objectFilter : R, ne = Jt({ ...b, page: 1 }), ae = {
      ...U,
      view: {
        ...U.view,
        filter: ne,
        objectFilter: z
      }
    }, Z = !Ts(ae, de), Ge = Z ? ae : de;
    Et(Z ? ae : null), He(Z ? "" : "Review queue defaults restored."), Pa(Ge, ne, Ge.view.startFrom !== "beginning");
  }
  function El() {
    if (Ae || fe || st || !de) return;
    I.current = null;
    const b = Jt({
      ...de.view.filter,
      page: 1
    });
    Et(null), He("Review queue defaults restored."), Pa(
      de,
      b,
      de.view.startFrom !== "beginning",
      !1
    );
  }
  function Al() {
    if (Ae || fe || ze || st || !U || !Pn || !C)
      return;
    const b = U, q = Pn;
    Lr(!0), mi(q).then((R) => {
      !R || A.current !== q.id || (Et(Cs(q, b)), He("Queue saved to this review."));
    }).catch((R) => {
      A.current !== q.id ? gi(q, R) : un(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => Lr(!1));
  }
  function yi() {
    if (!U || !de || Fn.current || he || Sn) return;
    cn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Kt.current = {
      temporaryReview: Ke,
      filter: J,
      loadedFilter: Se,
      queue: ve,
      queueError: ze,
      retryFromEnd: ra,
      selectedIds: new Set(Rt),
      focusedId: dt,
      pageCursor: Hn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...de,
      view: { ...de.view, startFrom: U.view.startFrom ?? "end" }
    });
    Zt(!1), Dt(!1), He(""), un(""), kt({ draft: b, saving: !1, error: "" });
  }
  function Do() {
    kt(null), Kt.current = null;
    const b = cn.current;
    cn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : S(Lt.current, !1);
    });
  }
  function Cl() {
    var q;
    if (!he || he.saving) return;
    const b = Kt.current;
    b && (pn.current += 1, (q = Jn.current) == null || q.abort(), I.current = null, xt(!1), Et(b.temporaryReview), Ee(b.filter), Fe(b.loadedFilter), Ye(b.queue), Gt(b.queueError), Pt(b.retryFromEnd), L(() => b.selectedIds), vt(b.focusedId), Hn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Do();
  }
  async function Tl() {
    if (!he || he.saving || !hn || !U) return;
    const b = U, q = { ...hn, name: hn.name.trim() }, R = wa(q);
    if (R) {
      kt((z) => z && { ...z, error: R });
      return;
    }
    kt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await mi(q)) throw new Error("Could not save reviews.");
      if (!ke.current || A.current !== q.id) return;
      Et(Cs(q, b)), Pe(q) === "video" && ma(q.id, {
        filter: J,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), He("Review saved."), Do();
    } catch (z) {
      if (A.current !== q.id) {
        gi(q, z);
        return;
      }
      kt(
        (ne) => ne && {
          ...ne,
          saving: !1,
          error: nc(z)
        }
      );
    }
  }
  function _o() {
    U && kn(U, J, ra, Mr).catch(() => {
    });
  }
  function Il() {
    Xt(/* @__PURE__ */ new Set()), qn.current.clear(), vt(null);
  }
  function $l(b) {
    !U || Ae || st || b === Number(J.page) || Dp(
      { ...J, page: b },
      U,
      (q, R) => kn(q, R, !1, Mr),
      Il
    );
  }
  function jo(b) {
    if (!oe || !de || Ae || fe || st) return;
    const q = hl(oe, b, de.view.objectFilter), R = !Ts(q, de);
    Et(R ? q : null), R ? Pa(q, { ...J, page: 1 }) : Pa(
      de,
      { ...J, page: 1 },
      de.view.startFrom !== "beginning"
    );
  }
  function Rl(b) {
    var Me, Ze, ft, Vt, At;
    const q = Oe === "tag", R = q ? "tag" : "video", z = Math.max(1, Number(J.perPage) || 40), ne = Math.max(1, Math.ceil(ve.totalCount / z)), ae = Math.min(Math.max(1, Number(J.page) || 1), ne), Z = [
      Nn ? "" : `${ln} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), Ge = !!Dr && !Je;
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
              entityType: Oe,
              onBack: gn,
              backDisabled: Ae || !!he || gt,
              onEdit: he ? () => {
                var Re;
                return (Re = vn.current) == null ? void 0 : Re.focus();
              } : yi,
              editDisabled: !he && (Ae || fe || Rn || Sn || gt || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: ht, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  ga,
                  {
                    filter: ze ? Se : J,
                    onFilterChange: kl,
                    totalCount: ve.totalCount,
                    sortOptions: q ? Wl : Ds,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: _t,
                    zoomLevel: (fr - 225) / 50,
                    onZoomChange: (Re) => xr(Math.round(225 + Re * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Ql : ni,
                    customFieldEntityType: Oe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: hi,
                    onObjectFilterChange: (Re) => {
                      ht || (I.current = Oe === "video" ? Wc(
                        Re,
                        Br,
                        b.view.objectFilter
                      ) : Re);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Hc, { page: ae, pages: ne, onPage: $l })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(me, { children: [
                oe && /* @__PURE__ */ a(
                  Qc,
                  {
                    mode: "multiple",
                    disabled: Ae || fe || Tt || !!he || Sn || gt,
                    onChange: () => Vn({ id: oe.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  kf,
                  {
                    options: q ? Fp : Mp,
                    value: _t,
                    onChange: (Re) => Fr($s(Re, Oe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                Eo,
                {
                  disabled: Ae || !!he,
                  items: Lo(de ?? b, {
                    onSelect: yi,
                    disabled: fe || Rn || Sn || !C
                  })
                }
              ),
              queueDiffers: Y ? (Ke == null ? void 0 : Ke.id) === k : void 0,
              queueChange: !he && (Ke == null ? void 0 : Ke.id) === k ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Qn ? Al : void 0,
                saveDisabled: Ae || fe || !!ze || st || !C,
                onReset: El,
                resetDisabled: Ae || fe || st
              } : void 0,
              chipsAfter: (Ze = (Me = oe == null ? void 0 : oe.presentation) == null ? void 0 : Me.binParents) != null && Ze.length || (Vt = (ft = oe == null ? void 0 : oe.presentation) == null ? void 0 : ft.filterBins) != null && Vt.length ? /* @__PURE__ */ u(me, { children: [
                !!((At = oe.presentation.binParents) != null && At.length) && /* @__PURE__ */ a(
                  dp,
                  {
                    videos: ve.items,
                    review: oe,
                    savedObjectFilter: (de ?? oe).view.objectFilter,
                    trees: K.ids,
                    disabled: Ae || fe || st,
                    onToggle: jo
                  }
                ),
                /* @__PURE__ */ a(
                  up,
                  {
                    review: oe,
                    savedObjectFilter: (de ?? oe).view.objectFilter,
                    queueFilter: J,
                    queueCount: fe || ze ? null : ve.totalCount,
                    disabled: Ae || fe || st,
                    countsPaused: Ae || fe || st || !Y,
                    onToggle: jo
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          bi,
          oe && K.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: K.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && hn && /* @__PURE__ */ a(
              zc,
              {
                drawerRef: vn,
                draft: hn,
                onChange: (Re) => kt((tn) => tn && { ...tn, draft: Re }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Re) => kt(
                  (tn) => tn && {
                    ...tn,
                    draft: { ...tn.draft, view: { ...tn.draft.view, startFrom: Re } }
                  }
                ),
                tagGroups: E,
                trees: br,
                saving: he.saving,
                saveDisabled: fe || !!ze,
                error: he.error,
                dirty: pi,
                criteriaChanged: Qn,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  ze && !fe ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      ze,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: _o, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void Tl(),
                onCancel: Cl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${ui}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    fe && !ve.items.length && /* @__PURE__ */ a(Ms, { label: "Loading review queue…" }),
                    ze && !fe && /* @__PURE__ */ a(
                      Fs,
                      {
                        message: ze,
                        retryLabel: Rn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Rn && de && Pe(de) === "video") {
                            const Re = Ir(de);
                            ma(de.id, { ...Re, filter: { ...Re.filter, page: void 0 } }), wt((tn) => tn + 1);
                            return;
                          }
                          _o();
                        }
                      }
                    ),
                    !Ae && !fe && !ze && !ve.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ai, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!ve.items.length && /* @__PURE__ */ a("div", { ref: fn, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: _t === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${fr}px` },
                        children: ve.items.map(Ol)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: fi, children: /* @__PURE__ */ a(
                    Pc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: E,
                      trees: br,
                      isDisabled: mt,
                      paused: !!he,
                      busy: Ae || fe,
                      onApply: (Re) => void ce(Re),
                      onFind: () => Zt(!0),
                      status: Ae ? `Applying action to ${di}…` : "",
                      summary: /* @__PURE__ */ u(me, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Rt.size ? `${Rt.size} selected` : dt == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !$e.length || m,
                            onClick: () => L((Re) => /* @__PURE__ */ new Set([...Re, ...$e])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(St, { binding: yr.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Rt.size,
                            onClick: () => L(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(St, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: Z.length ? Z.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: Ge || pr ? /* @__PURE__ */ u(me, { children: [
                        Ge && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                          Dr
                        ] }),
                        pr && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: pr })
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
  function Ol(b) {
    var R, z, ne;
    if (Oe === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Up,
        {
          tag: ae,
          displayMode: _t === "list" ? "list" : "grid",
          focused: ae.id === dt,
          selected: Rt.has(ae.id),
          setRef: (Z) => {
            Z ? hr.current.set(ae.id, Z) : hr.current.delete(ae.id);
          },
          onFocus: () => vt(ae.id),
          onToggle: () => {
            L((Z) => Ga(Z, ae.id)), S(ae.id, !1);
          },
          onOpen: () => window.open(`/tag/${ae.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ae.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Bp,
      {
        video: fl(q, oe, K.ids),
        showTagBins: ((z = (R = oe == null ? void 0 : oe.presentation) == null ? void 0 : R.annotations) == null ? void 0 : z.includes("tags")) && !!((ne = oe.presentation.annotationParents) != null && ne.length),
        displayMode: _t,
        cardsScroll: Ia,
        focused: q.id === dt,
        selected: Rt.has(q.id),
        setRef: (ae) => {
          ae ? hr.current.set(q.id, ae) : hr.current.delete(q.id);
        },
        onFocus: () => vt(q.id),
        onToggle: () => L((ae) => Ga(ae, q.id)),
        onPreview: () => {
          he || (vt(q.id), Dt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Dp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Ga(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function _p(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function jp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Up({
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
        Yl,
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
function Bp({
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
  return Ct(() => {
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
          Xl,
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
        n === "wall" && /* @__PURE__ */ a(Kp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Kp({ video: e, cardsScroll: t }) {
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
    return ye(zd(e.id), {
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
      src: Vd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Gp({
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
  const F = $(null), B = Ta(), C = $(null), D = $(null), x = e.files[0], re = Nl(e), H = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || rr(P) && !l;
  wo({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (P, Y) => {
      const W = t.actions[P];
      W && w(W, Y);
    },
    onFind: () => O(!0)
  }), ee(() => {
    var Y;
    const P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = F.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P;
    };
  }, []);
  function j(P) {
    var ie, Q, k;
    if (P.key !== "Tab") return;
    const Y = [
      ...((ie = F.current) == null ? void 0 : ie.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((se) => se.offsetParent !== null);
    if (!Y.length) {
      P.preventDefault(), (Q = F.current) == null || Q.focus();
      return;
    }
    const W = Y.indexOf(
      document.activeElement
    );
    P.shiftKey && W <= 0 ? (P.preventDefault(), (k = Y.at(-1)) == null || k.focus()) : !P.shiftKey && W === Y.length - 1 && (P.preventDefault(), Y[0].focus());
  }
  function V(P) {
    if (E || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = P.key === "ArrowLeft" || P.key === "ArrowRight";
    if (P.altKey && !Y) return;
    const W = C.current, ie = P.currentTarget.querySelector("video");
    if (P.key === "Enter" || P.key === "Escape")
      P.repeat || v();
    else if (P.key === " " && W)
      P.repeat || W.toggle();
    else if (Y && W)
      W.seekBy(
        (P.key === "ArrowLeft" ? -1 : 1) * (P.shiftKey ? 5 : P.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(P.key) && W) {
      const Q = D.current;
      if (!P.repeat && (Q == null ? void 0 : Q.videoId) === e.id) {
        const k = [x == null ? void 0 : x.duration, ie == null ? void 0 : ie.duration].find(
          (le) => le != null && Number.isFinite(le) && le > 0
        ) ?? 0, se = e.parentVideoId != null, A = se ? e.clipStartSec ?? 0 : 0, X = (se ? e.clipEndSec ?? k : k) - A;
        Number.isFinite(X) && X > 0 && Number.isFinite(Q.time) && W.seekBy(A + X * Number(P.key) / 10 - Q.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && p && y(), P.key === "ArrowDown" && h && N());
    else return;
    Jr(P);
  }
  function M(P) {
    const Y = F.current, W = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !Y || !W || !Y.contains(W) || W.closest(".dq-player, .dq-find-action") || P.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (E) return;
    let P = 0;
    const Y = requestAnimationFrame(() => {
      P = requestAnimationFrame(() => {
        var ie;
        const W = document.activeElement;
        (ie = F.current) != null && ie.isConnected && (!W || W === document.body || W === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(P);
    };
  }, [E, i, o, h, p, e.id, B]);
  const _ = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
      className: `dq-preview${B ? " dq-preview-mobile" : ""}`,
      onKeyDown: j,
      onKeyDownCapture: V,
      onMouseDown: (P) => {
        P.target === P.currentTarget && v();
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
              /* @__PURE__ */ a("h2", { children: re }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((P) => /* @__PURE__ */ a("li", { children: P.name }, P.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(ea, {}) }),
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
                "aria-label": `Open ${re} in a new tab`,
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
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: x ? /* @__PURE__ */ a(
            _s,
            {
              autostart: !0,
              streamUrl: Pi("video", e.id),
              posterUrl: Xo(e),
              format: x.format,
              audioCodec: x.audioCodec,
              duration: x.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (P) => {
                D.current = { videoId: e.id, time: P };
              },
              onPlaybackControlRegister: (P) => (C.current = P, () => {
                C.current === P && (C.current = null);
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
              isDisabled: H,
              busy: i || o,
              onApply: (P) => void w(P),
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
            isDisabled: H,
            onApply: (P, Y) => {
              O(!1), w(P, Y);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function Vp() {
  const e = await ye("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
    /* @__PURE__ */ a(dd, { className: "dq-spin" }),
    e
  ] });
}
function Fs({
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
const Zp = { components: { DataQualityPage: Lp } };
export {
  Lp as DataQualityPage,
  Zp as default,
  ir as objectFiltersEqual
};
