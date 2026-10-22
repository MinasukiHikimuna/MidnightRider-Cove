var Nd = Object.defineProperty;
var qd = (e, t, n) => t in e ? Nd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var vs = (e, t, n) => qd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, jsx as a, Fragment as de } from "react/jsx-runtime";
import { useState as C, useEffect as Y, useMemo as ye, useId as ut, useRef as $, useLayoutEffect as Dt, useCallback as _n, useSyncExternalStore as Ti, createContext as Sd, useContext as kd, Fragment as $i } from "react";
import { useKeySequence as Ed, EntityReferenceMultiSelector as kr, SortableList as bc, TagBadge as Ad, EntityReferenceSelector as Ns, EntityDetailTabs as Cd, FilterDialog as yc, VIDEO_CRITERIA as Io, DetailListToolbar as xa, PERFORMER_CRITERIA as Ri, AUDIO_CRITERIA as wc, NarrativeText as Id, AUDIO_SORT_OPTIONS as Td, VIDEO_SORT_OPTIONS as vc, AudioPlayer as $d, VideoPlayer as Nc, formatDuration as qc, getResolutionLabel as Rd, ConfirmDialog as Od, TAG_CRITERIA as Md, TAG_SORT_OPTIONS as Fd, TagTile as xd, VideoCard as Pd } from "@cove/runtime/components";
import { Undo2 as Ua, X as ma, Search as Ka, Flag as or, Check as ga, Pencil as pa, Ban as yo, ChevronDown as Oi, Plus as Ba, Pin as Sc, GripVertical as kc, AlertTriangle as rr, Copy as Ec, Trash2 as To, Mic as Ld, Users as Ac, Tag as Cc, Headphones as Ic, Film as $o, ChevronLeft as Ga, MoreHorizontal as Dd, RectangleHorizontal as _d, LayoutGrid as Mi, ChevronRight as Tc, Save as jd, RotateCcw as Ud, Layers as qs, RefreshCw as Kd, ExternalLink as $c, SkipForward as Bd, Upload as Gd, Download as Rc, ArrowUp as zd, ArrowDown as Vd, Loader2 as Jd, List as Hd, Grid3X3 as Qd } from "@cove/runtime/lucide-react";
import { extensionFetch as Wd } from "@cove/runtime/api";
import { createPortal as Yd } from "react-dom";
const Fi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, xi = Object.keys(
  Fi
);
function Pa(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ro(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Oc(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Xd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const wo = { min: 115, max: 625 }, Zd = (e) => Math.min(wo.max, Math.max(wo.min, e)), Mc = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function $e(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Pi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ue(e) {
  return Pi(Ge(e));
}
function eu(e) {
  return Ge(e) === "video";
}
function Ge(e) {
  return e.entityType ?? "video";
}
const Nr = [
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
], Oo = [
  Nr.slice(0, 11),
  Nr.slice(11, 22),
  Nr.slice(22)
];
function Fa(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function La(e) {
  return Fa(e) ?? e.toLocaleUpperCase();
}
const qr = "none";
function Kr(e) {
  return typeof e == "string" && Nr.includes(e);
}
function Li(e) {
  const t = e.shortcut;
  return Kr(t) || t === qr ? t : "auto";
}
function Fc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = Li(s);
    if (l !== qr) {
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
  const i = Nr.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function tu(e, t, n) {
  const { keys: r, actionOn: o } = Fc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Kr(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Kr));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Kr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Da(e) {
  var n;
  return $e(e) && !Pc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !eu(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ge(e) !== "tag" && e.actions.some(
    (r) => Di(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => ir(r, Ge(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const nu = {
  video: 1e3,
  audio: 250
};
function Qt(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(nu[t], n(e.perPage, 40))
    )
  };
}
function Ss(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function vr(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    $e(e) ? [e.entityType, ...r, e.occurrence] : Ge(e) === "video" ? r : [Ge(e), ...r]
  );
}
function ir(e, t) {
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
  ) && !Di(e) : !1;
}
function ru(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function ar(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Ar(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function xc(e) {
  return "steps" in e && e.steps.length > 0;
}
function Sr(e) {
  return "steps" in e ? e.steps.some((t) => ar(t.mode)) : !1;
}
function Di(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (ar(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function za(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Mc.includes(n.entityType)) && (!ru(n.entityType) || Pc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && au(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && ir(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && ir(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Da(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function au(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= wo.min && n.cardSize <= wo.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function ks(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function ou(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function Es(e, t, n) {
  return { ...structuredClone(e), id: n, name: ou(e.name, t) };
}
function Pc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && xi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || iu(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function iu(e) {
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
function As(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Cs(e, t, n, r) {
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
function su(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function cu(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function An(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function lu(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function du(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function uu(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function fu(e, t) {
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
const Lc = "ext:com.midnightrider.data-quality:configuration", hu = "ext:cove-data-quality:video-reviews", si = "ext:com.midnightrider.data-quality:progress";
class vo extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    vs(this, "remote");
    this.remote = r;
  }
}
function Dc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof vo ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Va = /* @__PURE__ */ new Map(), oo = /* @__PURE__ */ new Map(), _r = (e, t) => e.includes("*") || e.includes(t), No = (e) => he(`/api/savedfilters?mode=${encodeURIComponent(e)}`), pu = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ci(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function oa(e) {
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
    reviews: za(JSON.stringify(t.reviews)),
    deletedIds: ci(t.deletedIds),
    importedIds: ci(t.importedIds)
  };
}
function mu(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = za(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    ci(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function _c(e) {
  const t = await he("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function _i(e, t) {
  const n = (oo.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return oo.set(e, n), n.finally(() => {
    oo.get(e) === n && oo.delete(e);
  }).catch(() => {
  }), n;
}
let Ra = null;
function gu() {
  if (Ra) return Ra;
  const e = bu();
  return Ra = e, e.finally(() => {
    Ra === e && (Ra = null);
  }).catch(() => {
  }), e;
}
async function bu() {
  const e = await he("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return _i(t, () => yu(e, t));
}
async function yu(e, t) {
  var h;
  const n = String(e.user.id), r = _r(e.permissions, "savedfilters.read"), o = r && _r(e.permissions, "savedfilters.write"), i = r ? (await No(Lc)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
  if (i.length > 1) {
    const m = (y) => {
      const { revision: N, ...v } = oa(y.uiOptions);
      return JSON.stringify(v);
    };
    if (i.some((y) => m(y) !== m(i[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const y of i.slice(1))
        await he(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    i.splice(1);
  }
  let s = i.length ? oa(i[0].uiOptions) : pu();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = oa(l));
  let d = !i.length;
  if (i.length && f && l) {
    const m = oa(l);
    if (m.reviews.some((N) => {
      const v = s.reviews.find((w) => w.id === N.id);
      return v && JSON.stringify(v) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...m.deletedIds])
    ];
    s = {
      ...s,
      reviews: ks(s.reviews, m.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...m.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const m = JSON.stringify(s), y = mu(n);
    if (i.length && y.reviews.some((q) => {
      const P = s.reviews.find((L) => L.id === q.id);
      return P && JSON.stringify(P) !== JSON.stringify(q);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await No(hu)).flatMap(
      (q) => za(q.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (q) => !y.reviews.some((P) => P.id === q)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: ks(
        y.reviews,
        s.reviews,
        N.filter(
          (q) => !y.known.includes(q.id) && !s.importedIds.includes(q.id)
        )
      ).filter((q) => !w.has(q.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...N.map((q) => q.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== m);
  }
  const p = {
    userId: n,
    recordId: (h = i[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: o,
    durable: o
  };
  if (Va.set(t, p), d && o) {
    const m = s;
    i.length && (p.config = oa(i[0].uiOptions)), await jc(t, m), s = p.config;
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
    canWrite: _r(e.permissions, "videos.write"),
    canWriteVideos: _r(e.permissions, "videos.write"),
    canWriteAudios: _r(e.permissions, "audios.write"),
    canWriteTags: _r(e.permissions, "tags.write"),
    canReadTagGroups: _r(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function jc(e, t) {
  const n = Va.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await _c(n), n.recordId != null) {
      const i = await he(
        `/api/savedfilters/${n.recordId}`
      ), s = oa(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new vo(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const o = await he(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Lc,
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
const sa = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), wu = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => sa(e, n) !== sa(t, n)
);
function vu(e, t) {
  return _i(e, async () => {
    const n = Va.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config;
    try {
      return await Nu(n, e, t);
    } catch (o) {
      throw n.config = r, o;
    }
  });
}
async function Nu(e, t, n) {
  var r;
  for (let o = 1; ; o++) {
    const i = e.config.reviews, s = n(i);
    if (s === i) return i;
    za(JSON.stringify(s));
    const c = i.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
    try {
      return await jc(t, {
        ...e.config,
        reviews: s,
        deletedIds: [
          .../* @__PURE__ */ new Set([...e.config.deletedIds, ...c])
        ].filter((l) => !s.some((f) => f.id === l))
      }), s;
    } catch (l) {
      const f = l instanceof vo ? l.remote : void 0;
      if (!f || o >= 3) throw l;
      const d = wu(i, s).find(
        (p) => sa(i, p) !== sa(f.reviews, p) && sa(f.reviews, p) !== sa(s, p)
      );
      if (d !== void 0) {
        const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
        throw new vo(
          f.reviews.some((h) => h.id === d) ? `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.` : `“${p ?? "This review"}” was deleted in another browser. Reload the page to see the reviews as they are now.`
        );
      }
      e.config = f;
    }
  }
}
function Is(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && !Number.isFinite(t.cardSize) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t.cardSize === null ? t : { ...t, cardSize: Zd(t.cardSize) };
}
async function qu(e, t) {
  const n = Va.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? Is(r) : null;
  if (!n.readable) return o;
  const i = (await No(si)).find(
    (c) => c.name === t
  ), s = i ? Is(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function Su(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return _i(r, async () => {
    const o = Va.get(e);
    if (!(o != null && o.writable)) return;
    await _c(o);
    const i = (await No(si)).find(
      (s) => s.name === t
    );
    await he(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: si,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Wn(e) {
  return e === "audio" ? "audios" : "videos";
}
const ku = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function ji(e, t) {
  var n, r;
  return e.title || ((r = (n = e.files) == null ? void 0 : n[0]) == null ? void 0 : r.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Yn(e) {
  return ku[e];
}
const qo = "confirmed_absent_tags", Ui = "Confirmed absent tags", Mo = "confirmed_absent_occurrence_tags", Uc = {
  key: qo,
  label: Ui,
  type: "tag",
  subject: "tag assessments"
}, Ki = {
  key: Mo,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Eu = {
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
function sr(e) {
  return Array.isArray(e) ? e.map(sr) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Eu[n] ?? n : t === "key" && typeof n == "string" && [
        qo,
        Mo
      ].includes(n.toLowerCase()) ? n.toLowerCase() : sr(n)
    ])
  ) : e;
}
async function Kc(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Wd(e, { ...t, headers: r });
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
async function he(e, t = {}) {
  return await Kc(e, t, "fail");
}
function Au(e, t = {}) {
  return Kc(e, t, "null");
}
const Cu = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Iu = 0;
function So(e, t) {
  return he(
    `/api/${Wn(e)}/${t}?dqRead=${Cu}-${++Iu}`,
    { cache: "no-store" }
  );
}
function Bc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    sr({
      findFilter: Qt(t, Ue(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function ca(e, t, n) {
  return he(
    `/api/${Wn(Ue(e))}/find`,
    { method: "POST", signal: n, body: Bc(e, t) }
  );
}
async function Bi(e, t, n) {
  return (await he(
    `/api/${Wn(Ue(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Bc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Jo(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, he("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      sr({
        findFilter: Qt(t),
        objectFilter: r
      })
    )
  });
}
function Tu(e) {
  return he("/api/taggroups", { signal: e });
}
function li(e, t, n = 1280) {
  return `/api/${Wn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function di(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Ts(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function $u(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ru(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function Fo(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await he(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await he("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          sr({
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
async function Ja(e, t) {
  const n = Ar(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Fo(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function Ou(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Gi(e, t) {
  const r = (await he("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Ou(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Yn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function Gc(e, t) {
  const n = await Gi(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await he(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await he("/api/custom-fields", {
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
function zc(e = "video") {
  return Gi(Uc, e);
}
async function Vc(e) {
  let t;
  try {
    t = await zc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ui} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
function Mu(e = "video") {
  return Gc(Uc, e);
}
function Jc(e = "video") {
  return Gi(Ki, e);
}
function Fu(e = "video") {
  return Gc(Ki, e);
}
function ko(e) {
  return [...new Set(e)];
}
function Hc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === Mo
  ), o = r === void 0 ? [] : n[r];
  return ko(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function Qc(e) {
  let t;
  try {
    t = await Jc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Ki.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Wc(e, t, n, r, o, i) {
  await he(`/api/${Wn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: ko(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function xu(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${Ui} custom field is not available.`
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
async function ui(e, t, n) {
  if (!ir(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Yn(e).many} and configure a valid action first.`
    );
  const r = Sr(t) ? await Vc(e) : null, o = ko(n), i = (await Ja(t)).map((l) => ({
    mode: l.mode,
    tagIds: ko(l.tagIds)
  })), c = [
    ...i.filter((l) => !ar(l.mode)),
    ...i.filter((l) => ar(l.mode))
  ].map(
    (l) => xu(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await he(`/api/${Wn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[l])
      });
    } catch (f) {
      throw new Error(
        // A failed first step says only why: Cove applies a step whole or not at all, but an answer
        // lost on its way back may follow a step that was saved.
        `${l ? `${l} of ${c.length} steps were saved before step ${l + 1} failed. ` : ""}${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Pu(e, t) {
  if (!ir(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await he("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Lu = 600 * 1e3, zi = /* @__PURE__ */ new Map(), Yc = /* @__PURE__ */ new Map(), wr = /* @__PURE__ */ new Map();
function Xc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Yc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Zc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Yc.set(e.tagGroupId, e.tagGroupSortOrder), zi.set(e.id, { tag: e, at: Date.now() });
}
function el(e) {
  const t = zi.get(e);
  if (!(!t || Date.now() - t.at > Lu))
    return Xc(t.tag);
}
function tl(e) {
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
function fi(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Zc(tl({ ...n, name: r }));
  }
}
function Du(e) {
  const t = wr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: he(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var d, p;
        const i = ((d = o == null ? void 0 : o.name) == null ? void 0 : d.trim()) || null;
        if (wr.get(e) === r && wr.delete(e), !i) return null;
        const s = tl({ ...o, id: e, name: i }), c = (p = zi.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Zc(f), Xc(f);
      },
      () => (wr.get(e) === r && wr.delete(e), null)
    )
  };
  return wr.set(e, r), r;
}
function $s() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Ho(e) {
  const t = {};
  for (const n of e) {
    const r = el(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function _u(e, t) {
  if (t != null && t.aborted) return Promise.reject($s());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = el(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = Du(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && wr.get(f) === d && (wr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), i($s()));
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
function nl(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ha(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = C(() => ({
    key: t,
    tags: Ho(Qo(t))
  }));
  return Y(() => {
    const o = Qo(t), i = Ho(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return _u(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Ho(Qo(t));
}
function Jr(e) {
  const t = Ha(e);
  return ye(() => nl(t), [t]);
}
function Qo(e) {
  return e ? e.split(",").map(Number) : [];
}
async function ju(e, t, n) {
  if (!ir(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Ue(e), o = n.steps.some((c) => ar(c.mode)) ? await Qc(r) : "", i = await Ja(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !ar(l.mode)),
    ...i.filter((l) => ar(l.mode))
  ]) {
    const l = (f) => Wc(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await ol(
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
async function Vi(e, t) {
  const n = e.occurrence;
  if (Ro(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await he("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        sr({
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
function rl(e) {
  return Pa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function xo(e, t) {
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
  }, s = rl(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Ue(e),
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
                      key: Mo,
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
async function Ji(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Fo([n], t))
  );
}
function al(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Uu(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function Ku(e, t, n, r, o) {
  if (!rl(e)) return !1;
  const i = Hc(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((l) => r.includes(l))
  );
}
async function Hi(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || al(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = Ue(e), i = await ca(
    xo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await Ji(c, r) : [], f = new Array(i.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; d < i.items.length; ) {
        const p = d++, h = i.items[p], m = await he(
          `/api/tagapplications?hostType=${o}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = m.filter(
            (w) => w.hostType === o && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return Uu(e.occurrence, v, l) && !Ku(c, h, y.id, v, l) ? [
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
async function ol(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = Ue(e), i = await So(o, t.media.id);
  if (!i.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await he(s)).filter(
    (f) => f.hostType === o && f.hostId === i.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await he("/api/tagapplications", {
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
      r.has(f.tag.id) && !l.has(f.tag.id) && await he(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await he(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function cr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Bu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Wt(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? Hc(
      await So(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await he(Bu(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return fi(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await So(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  fi(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === qo
  ) ?? qo, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
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
async function Qi(e, t, n) {
  if (t.occurrence && $e(e))
    await ol(
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
      o.length && await he(
        `/api/${Wn(Ue(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Gu(e, t, n) {
  t.occurrence && $e(e) ? await ju(e, t.occurrence, n) : await ui(Ue(e), n, [t.media.id]);
}
function hi(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: cr(o(t.ids), o(n.ids)),
    absence: cr(o(t.absent), o(n.absent))
  };
}
function il(e, t) {
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
const sl = 50, zu = 15e5;
let Eo = "";
const pi = /* @__PURE__ */ new Set();
function Vu(e) {
  Eo !== e && (Eo = e, cl());
}
const Wi = () => Eo ? `${Eo}:history` : "";
function cl() {
  pi.forEach((e) => e());
}
function Ju(e) {
  pi.add(e);
  const t = (n) => {
    n.key === Wi() && e();
  };
  return window.addEventListener("storage", t), () => {
    pi.delete(e), window.removeEventListener("storage", t);
  };
}
const Rs = (e) => Array.isArray(e) && e.every((t) => Number.isSafeInteger(t)), Os = (e) => typeof e == "object" && e !== null && Rs(e.added) && Rs(e.removed);
function Hu(e) {
  var n;
  const t = e;
  return typeof e == "object" && e !== null && Number.isSafeInteger(t.mediaId) && Os(t.tags) && Os(t.absence) && (t.performer === void 0 || Number.isSafeInteger((n = t.performer) == null ? void 0 : n.id));
}
function Qu(e) {
  const t = e;
  return typeof e == "object" && e !== null && typeof t.id == "string" && typeof t.at == "number" && (t.kind === "video" || t.kind === "audio") && Array.isArray(t.items) && t.items.every(Hu);
}
function ua() {
  const e = Wi();
  if (!e) return [];
  try {
    const t = JSON.parse(localStorage.getItem(e) ?? "[]");
    return Array.isArray(t) ? t.filter(Qu).map((n) => ({
      ...n,
      label: String(n.label ?? ""),
      reviewName: String(n.reviewName ?? ""),
      reviewId: typeof n.reviewId == "string" ? n.reviewId : void 0,
      items: n.items.map((r) => ({
        ...r,
        title: String(r.title ?? ""),
        names: typeof r.names == "object" && r.names ? r.names : {}
      }))
    })) : [];
  } catch {
    return [];
  }
}
function _a(e, t) {
  const n = Wi();
  if (!n) return !1;
  let r = [...e];
  const o = /* @__PURE__ */ new Map();
  let i = 2;
  const s = () => {
    let l = r.length - 1;
    for (; l >= 0 && r[l].id === t; ) l--;
    return l < 0 ? !1 : (i -= o.get(r[l]) ?? 0, r.splice(l, 1), !0);
  };
  for (; r.length > sl; ) s();
  for (const l of r)
    o.set(l, JSON.stringify(l).length + 1), i += o.get(l);
  const c = () => {
    for (; i > zu; ) if (!s()) return !1;
    return !0;
  };
  for (; c(); )
    try {
      return localStorage.setItem(n, JSON.stringify(r)), cl(), !0;
    } catch {
      if (!s()) break;
    }
  return t !== void 0 && _a(e.filter((l) => l.id !== t)), !1;
}
function Yi(e) {
  try {
    const t = e.items.filter((r) => r.undone || mo(r)), n = ua().filter((r) => r.id !== e.id);
    return t.some((r) => !r.undone) ? _a([{ ...e, items: t }, ...n].sort((r, o) => o.at - r.at), e.id) : (_a(n), !0);
  } catch {
    return !1;
  }
}
function Wu() {
  _a([]);
}
const mo = (e) => [e.tags, e.absence].some(
  (t) => t.added.length > 0 || t.removed.length > 0
);
function Xi(e, t, n, r, o) {
  var d, p, h, m;
  const i = (y) => o ? y.filter((N) => o.includes(N)) : y, s = cr(i(n.ids), i(r.ids)), c = cr(i(n.absent), i(r.absent)), l = {};
  for (const y of [n, r])
    (d = y.tags) == null || d.forEach((N) => l[N.id] = N.name), (p = y.applications) == null || p.forEach((N) => l[N.tag.id] = N.tag.name), !y.tags && !y.applications && y.ids.forEach((N, v) => {
      y.names[v] && (l[N] = y.names[v]);
    });
  const f = (h = e.occurrence) == null ? void 0 : h.performer;
  return {
    mediaId: e.media.id,
    title: t,
    performer: f && { id: f.id, name: f.name },
    tags: s,
    absence: c,
    applications: (m = r.applications) == null ? void 0 : m.filter((y) => s.added.includes(y.tag.id)).map((y) => ({ id: y.id, tagId: y.tag.id })),
    names: Object.fromEntries(
      [...s.added, ...s.removed, ...c.added, ...c.removed].filter((y) => l[y]).map((y) => [y, l[y]])
    )
  };
}
function ll(e) {
  const t = { id: e.mediaId };
  return {
    key: e.performer ? `${e.mediaId}:${e.performer.id}` : String(e.mediaId),
    media: t,
    occurrence: e.performer && {
      key: `${e.mediaId}:${e.performer.id}`,
      media: t,
      performer: e.performer,
      applications: []
    }
  };
}
function Yu(e) {
  var n;
  const t = {
    ids: e.tags.added,
    names: [],
    absent: e.absence.added,
    applications: (n = e.applications) == null ? void 0 : n.map((r) => ({
      id: r.id,
      hostType: "",
      hostId: e.mediaId,
      tag: { id: r.tagId, name: e.names[r.tagId] ?? "" }
    }))
  };
  return {
    item: ll(e),
    before: { ids: e.tags.removed, names: [], absent: e.absence.removed },
    after: t,
    tags: e.tags,
    absence: e.absence
  };
}
function Wo(e, t) {
  return {
    ...e,
    tags: {
      added: e.tags.added.filter((n) => t.ids.includes(n)),
      removed: e.tags.removed.filter((n) => !t.ids.includes(n))
    },
    absence: {
      added: e.absence.added.filter((n) => t.absent.includes(n)),
      removed: e.absence.removed.filter((n) => !t.absent.includes(n))
    }
  };
}
async function Xu(e, t) {
  var p;
  const n = ll(t), r = t.absence.added.length + t.absence.removed.length > 0, o = await Wt(e, n, r), i = Wo(t, o);
  if (!mo(i)) return { ...t, undone: !0, error: void 0 };
  il(Yu(i), o);
  const s = (p = i.performer) == null ? void 0 : p.id, c = r ? s === void 0 ? await Vc(e) : await Qc(e) : "", l = async (h, m) => {
    h.length && (s !== void 0 ? await Wc(c, e, i.mediaId, s, h, m) : await he(`/api/${Wn(e)}/bulk`, {
      method: "POST",
      body: JSON.stringify({
        ids: [i.mediaId],
        customFields: { [c]: h },
        customFieldMode: m
      })
    }));
  };
  try {
    if (await l(i.absence.added, "REMOVE"), s !== void 0) {
      for (const h of o.applications ?? [])
        i.tags.added.includes(h.tag.id) && await he(`/api/tagapplications/${h.id}`, { method: "DELETE" });
      for (const h of i.tags.removed)
        await he("/api/tagapplications", {
          method: "POST",
          body: JSON.stringify({
            hostType: e,
            hostId: i.mediaId,
            contextType: "performer",
            contextId: s,
            tagId: h,
            sourceKey: "user"
          })
        });
    } else
      for (const [h, m] of [
        ["REMOVE", i.tags.added],
        ["ADD", i.tags.removed]
      ])
        m.length && await he(`/api/${Wn(e)}/bulk`, {
          method: "POST",
          body: JSON.stringify({ ids: [i.mediaId], tagMode: h, tagIds: m })
        });
    await l(i.absence.removed, "ADD");
  } catch (h) {
    const m = await Wt(e, n, r).catch(() => null), y = m ? Wo(i, m) : i;
    if (!mo(y)) return { ...t, undone: !0, error: void 0 };
    throw Object.assign(new Error(dl(h)), { left: y });
  }
  const f = await Wt(e, n, r), d = Wo(i, f);
  if (mo(d))
    throw Object.assign(new Error("Undo did not restore every affected tag."), { left: d });
  return { ...t, undone: !0, error: void 0 };
}
const dl = (e) => e instanceof Error ? e.message : "Request failed.";
async function Zu(e, t = () => {
}) {
  const n = ua().find((d) => d.id === e);
  if (!n) throw new Error("This change is no longer in the history.");
  const r = [...n.items], o = r.flatMap((d, p) => d.undone ? [] : [p]);
  let i = 0, s = 0, c = 0, l = Date.now();
  const f = () => {
    l = Date.now();
    const d = ua(), p = d.findIndex((h) => h.id === e);
    p >= 0 && (d[p] = { ...d[p], items: r }, _a(d));
  };
  return await Promise.all(
    Array.from({ length: Math.min(4, o.length) }, async () => {
      for (; i < o.length; ) {
        const d = o[i++];
        try {
          r[d] = await Xu(n.kind, r[d]);
        } catch (p) {
          c++;
          const h = p.left ?? r[d];
          r[d] = { ...h, undone: !1, error: dl(p) };
        }
        Date.now() - l > 1e3 && f(), t(++s, o.length);
      }
    })
  ), f(), { undone: s - c, failed: c };
}
async function ef(e, t) {
  const n = new Array(e.length);
  let r = 0;
  return await Promise.all(
    Array.from({ length: Math.min(6, e.length) }, async () => {
      for (; r < e.length; ) {
        const o = r++;
        n[o] = await t(e[o]);
      }
    })
  ), n;
}
const Yo = (e) => e.performer ? `${e.mediaId}:${e.performer.id}` : String(e.mediaId), Zi = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
function Ms(e) {
  const t = e.items.length, n = e.items.some((i) => i.performer), { one: r, many: o } = Yn(e.kind);
  return `${t.toLocaleString()} ${n ? t === 1 ? "occurrence" : "occurrences" : t === 1 ? r : o}`;
}
function tf({
  item: e,
  names: t
}) {
  const n = (o) => e.names[o] ?? t[o] ?? `Tag ${o}`, r = [
    ...e.tags.added.map((o) => ({ id: o, text: `+ ${n(o)}`, kind: "added" })),
    ...e.tags.removed.map((o) => ({ id: o, text: `− ${n(o)}`, kind: "removed" })),
    ...e.absence.added.map((o) => ({ id: o, text: `Absent: ${n(o)}`, kind: "absent" })),
    ...e.absence.removed.map((o) => ({
      id: o,
      text: `No longer absent: ${n(o)}`,
      kind: "present"
    }))
  ];
  return /* @__PURE__ */ a("span", { className: "dq-history-parts", children: r.map((o) => /* @__PURE__ */ a("span", { className: `dq-history-part ${o.kind}`, children: o.text }, `${o.kind}-${o.id}`)) });
}
function nf({
  record: e,
  busy: t,
  progress: n,
  onUndo: r
}) {
  const o = ye(
    () => [
      ...new Set(
        e.items.flatMap((p) => [
          ...p.tags.added,
          ...p.tags.removed,
          ...p.absence.added,
          ...p.absence.removed
        ])
      )
    ].filter((p) => e.items.every((h) => !h.names[p])),
    [e]
  ), i = Jr(o), s = e.items.filter((p) => p.undone).length, c = e.items.filter((p) => !p.undone && p.error).length, l = e.items.length - s, [f, d] = C(e.items.length === 1);
  return Y(() => {
    c && d(!0);
  }, [c > 0]), /* @__PURE__ */ u("section", { className: "dq-history-record", "aria-label": e.label, children: [
    /* @__PURE__ */ u("div", { className: "dq-history-head", children: [
      /* @__PURE__ */ u("div", { className: "dq-history-title", children: [
        /* @__PURE__ */ a("strong", { children: e.label }),
        /* @__PURE__ */ u("span", { className: "dq-history-meta", children: [
          e.reviewName,
          " · ",
          new Date(e.at).toLocaleString(),
          " · ",
          Ms(e)
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-history-status", role: "status", children: n ? `Undoing… ${n.done.toLocaleString()} of ${n.total.toLocaleString()}` : l ? c ? `${c.toLocaleString()} could not be undone. Inspect them below, then undo again.` : s ? `${s.toLocaleString()} undone, ${l.toLocaleString()} still applied` : "" : "Undone" })
      ] }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-button",
          disabled: t || !l,
          onClick: r,
          children: [
            /* @__PURE__ */ a(Ua, { "aria-hidden": "true" }),
            "Undo"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ u(
      "details",
      {
        className: "dq-history-items",
        open: f,
        onToggle: (p) => d(p.currentTarget.open),
        children: [
          /* @__PURE__ */ a("summary", { children: e.items.length === 1 ? "Show the change" : `Show all ${Ms(e)}` }),
          f && /* @__PURE__ */ a("ul", { children: e.items.map((p) => {
            var h;
            return /* @__PURE__ */ u(
              "li",
              {
                className: p.undone ? "undone" : void 0,
                children: [
                  /* @__PURE__ */ u("a", { href: `/${e.kind}/${p.mediaId}`, target: "_blank", rel: "noreferrer", children: [
                    p.performer ? `${p.performer.name} — ` : "",
                    p.title
                  ] }),
                  /* @__PURE__ */ a(tf, { item: p, names: i }),
                  p.undone && /* @__PURE__ */ a("span", { className: "dq-history-undone", children: "Undone" }),
                  !p.undone && p.error && /* @__PURE__ */ a("span", { className: "dq-history-error", children: p.error })
                ]
              },
              `${p.mediaId}:${((h = p.performer) == null ? void 0 : h.id) ?? ""}`
            );
          }) })
        ]
      }
    )
  ] });
}
function rf({
  onClose: e,
  onUndone: t
}) {
  const n = ut(), r = $(null), o = $(null), [i, s] = C(ua), [c, l] = C(null), [f, d] = C(), [p, h] = C(""), [m, y] = C(!1), N = $(null), v = $(null);
  Y(() => Ju(() => s(ua())), []), Y(() => {
    var M, k;
    const L = document.activeElement;
    return (M = r.current) == null || M.showModal(), (k = o.current) == null || k.focus(), () => {
      L != null && L.isConnected && L.focus();
    };
  }, []);
  const w = $(!1);
  Y(() => {
    var L, M, k;
    m ? (L = v.current) == null || L.focus() : w.current && ((k = ((M = N.current) == null ? void 0 : M.disabled) === !1 ? N.current : o.current) == null || k.focus()), w.current = m;
  }, [m]);
  const q = c !== null;
  async function P(L) {
    const M = new Set(L.items.filter((k) => !k.undone).map(Yo));
    l(L.id), y(!1), h(""), d({ done: 0, total: L.items.filter((k) => !k.undone).length });
    try {
      await Zu(L.id, (k, x) => d({ done: k, total: x }));
    } catch (k) {
      h(k instanceof Error ? k.message : String(k));
    } finally {
      l(null), d(void 0);
      const k = ua().find((x) => x.id === L.id) ?? L;
      t(
        k,
        k.items.filter((x) => x.undone && M.has(Yo(x))).map(Yo)
      ), requestAnimationFrame(() => {
        var x, D;
        (x = r.current) != null && x.contains(document.activeElement) || (D = o.current) == null || D.focus();
      });
    }
  }
  return /* @__PURE__ */ u(
    "dialog",
    {
      ref: r,
      className: "dq-batch-dialog dq-history-dialog",
      "aria-labelledby": `${n}-title`,
      "aria-modal": "true",
      onCancel: (L) => {
        L.preventDefault(), q || e();
      },
      onClose: () => {
        var L;
        q ? (L = r.current) == null || L.showModal() : e();
      },
      children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
          /* @__PURE__ */ a(Ua, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("h2", { id: `${n}-title`, children: "Recent changes" }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-batch-close",
              "aria-label": "Close dialog",
              disabled: q,
              onClick: e,
              children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-batch-body", ref: o, tabIndex: -1, role: "group", "aria-label": "Recorded changes", children: [
          /* @__PURE__ */ u("p", { className: "dq-history-intro", children: [
            "What Data Quality changed from this browser, newest first; the last",
            " ",
            sl,
            " changes are kept. Undo restores only the tags a change touched, where they are still as it left them, and keeps later edits."
          ] }),
          p && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: p }),
          i.length ? i.map((L) => /* @__PURE__ */ a(
            nf,
            {
              record: L,
              busy: q,
              progress: c === L.id ? f : void 0,
              onUndo: () => void P(L)
            },
            L.id
          )) : /* @__PURE__ */ a("p", { className: "dq-history-empty", children: "No changes recorded yet." })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
          m ? /* @__PURE__ */ u(de, { children: [
            /* @__PURE__ */ a("span", { children: "Forget every recorded change? Nothing is undone." }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button dq-button-danger",
                disabled: q,
                onClick: () => {
                  Wu(), y(!1);
                },
                children: "Clear history"
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: v,
                type: "button",
                className: "dq-button",
                onClick: () => y(!1),
                children: "Keep it"
              }
            )
          ] }) : /* @__PURE__ */ a(
            "button",
            {
              ref: N,
              type: "button",
              className: "dq-button",
              disabled: q || !i.length,
              onClick: () => y(!0),
              children: "Clear history…"
            }
          ),
          /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: q, onClick: e, children: "Close" })
        ] })
      ]
    }
  );
}
const io = (e) => e >= "0" && e <= "9";
function Fs(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function xs(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (io(e[n]) && io(t[r])) {
      const c = n, l = r;
      for (; n < e.length && io(e[n]); ) n++;
      for (; r < t.length && io(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(l, r).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const i = Fs(e[n]), s = Fs(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function ul(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || xs(e.tagGroupName, t.tagGroupName) || xs(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Br(e) {
  return [...e].sort(ul);
}
const mi = /* @__PURE__ */ new Map();
function af(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function es(e, t, n) {
  const r = Ar(e), o = [], i = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      i.push(h);
      continue;
    }
    const m = h.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || o.push(y), N ?? [y];
    });
    i.push({ mode: "REMOVE", tagIds: m.filter((y) => !r.has(y)) });
  }
  const s = [
    ...i.filter((h) => !ar(h.mode)),
    ...i.filter((h) => ar(h.mode))
  ], c = new Set(t.ids), l = new Set(t.absent);
  for (const h of s)
    for (const m of h.tagIds)
      switch (h.mode) {
        case "ADD":
          c.add(m);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(m);
          break;
        case "MARK_PRESENT":
          c.add(m), l.delete(m);
          break;
        case "MARK_ABSENT":
          c.delete(m), l.add(m);
          break;
        case "CLEAR_ABSENCE":
          l.delete(m);
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
function of(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Br(t);
}
function fl(e) {
  return hl(af(e));
}
function hl(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = C(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return Y(() => (i.current = !0, () => {
    i.current = !1;
  }), []), Y(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), Fo([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Pt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function zr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = Pt(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Ps(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Pt(t.group) !== "");
}
function pl(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function ml(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function gl(e) {
  return Ar(e).size > 0 || ml(e).size > 0;
}
function sf(e) {
  return zr(e).filter(
    (t) => !t.actions.some((n) => gl(e[n]))
  );
}
function gi(e, t) {
  const n = pl(t), r = new Set(t.absent);
  return zr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...Ar(e[c])], f = [...ml(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function bi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function cf(e, t, n) {
  const r = { ids: [...pl(t)], absent: t.absent }, o = es(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const la = "review";
function lf(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function df(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function jr(e, t) {
  const n = new Set(lf(e));
  return t.filter((r) => n.has(r.id));
}
function Ls(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of jr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(la, () => ({
        key: la,
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
    ...i.filter((s) => s.key === la),
    ...i.filter((s) => s.key !== la)
  ];
}
function yi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function ts(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => yi(s.key, s.members, o) && !(c > i && yi(o.key, o.members, s))
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
function uf(e, t) {
  return t.filter(
    (n) => n.key === e.key || yi(n.key, n.tagIds ?? [], e)
  );
}
function bl(...e) {
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
    ...n.filter((r) => r.key === la),
    ...n.filter((r) => r.key !== la)
  ];
}
function ff(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function yl(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = ff(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function hf(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => yl(o, r, n))
  );
}
function pf(e, t, n) {
  return t.filter((r) => r.tagIds !== null && yl(e, r, n));
}
function mf(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function ns(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [mf(e.mixed)] : []
  ];
}
function gf(e) {
  const t = ns(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function bf(e, t, n) {
  const r = jr(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const wi = "-", Ds = "Ctrl+a", yf = "Ctrl/⌘A", wf = ["f", "g", "k", "n", "m", ",", "."], Xo = "Shift+", wl = {
  ",": [";", "<"],
  ".": [":", ">"]
}, vf = new Set(Object.values(wl).flat()), _s = { Comma: ",", Period: "." };
function Nf(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(_s, t.code) ? _s[t.code] : void 0;
}
function ba(e) {
  return ye(() => Fc(e), [e]);
}
function rs({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = ba(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  Dt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = Nr.filter(
    (h) => s.actionOn.has(h) || wf.includes(h)
  ).join(" "), p = ye(() => {
    const h = (N, v) => {
      var q, P;
      const w = c.current;
      if (N === Ds) (q = w.onSelectAll) == null || q.call(w);
      else if (N === wi) (P = w.onFind) == null || P.call(w);
      else {
        const L = vf.has(N), M = L || N.startsWith(Xo), k = L ? Nf(v) : M ? N.slice(Xo.length) : N, x = k === void 0 ? void 0 : w.keyMap.actionOn.get(k);
        x !== void 0 && w.onAction(x, M);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Ds, "local")), l && y.push(m(wi));
    for (const N of d ? d.split(" ") : []) {
      const v = wl[N];
      y.push(m(N), ...(v ?? [`${Xo}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, d, l, f]);
  Ed(p, t);
}
const qf = {
  find: wi,
  selectAll: yf
};
function as() {
  return qf;
}
const Sf = "(max-width: 760px)";
function vl(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = _n(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Ti(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Qa() {
  return vl(Sf);
}
function kf(e, t, n = !1) {
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
function Hr(e, t, n = [], r) {
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
  const o = Ar(e), i = (s) => o.has(s) || [...o].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => kf(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function Po(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function os({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = Qa(), [f, d] = C(""), [p, h] = C(0), m = $(null), y = $(null), N = $(null), v = $(null), w = $(null), q = $(/* @__PURE__ */ new Set()), P = ut(), L = Jr(ye(() => Po(e), [e])), M = ba(e), k = ye(() => {
    const U = f.trim().toLocaleLowerCase(), ce = (T) => T ? Nr.indexOf(T) : Nr.length;
    return e.map((T, z) => ({ action: T, index: z, key: M.keys[z] })).sort((T, z) => ce(T.key) - ce(z.key)).filter((T) => !U || T.action.label.toLocaleLowerCase().includes(U));
  }, [e, M, f]), x = k.length ? Math.min(p, k.length - 1) : -1, D = (U) => `${P}-option-${U}`;
  Dt(() => {
    var U, ce, T;
    return v.current = document.activeElement, w.current = ((ce = (U = N.current) == null ? void 0 : U.parentElement) == null ? void 0 : ce.closest('[role="dialog"]')) ?? null, (T = m.current) == null || T.focus({ preventScroll: !0 }), () => {
      var I;
      const z = v.current;
      z instanceof HTMLElement && z.isConnected && z.focus({ preventScroll: !0 }), document.activeElement !== z && ((I = w.current) != null && I.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), Y(() => {
    var U, ce, T;
    x < 0 || (T = (ce = (U = y.current) == null ? void 0 : U.querySelector(`[id="${D(k[x].index)}"]`)) == null ? void 0 : ce.scrollIntoView) == null || T.call(ce, { block: "nearest" });
  }, [x, k]);
  function ie(U, ce) {
    !U || r != null && r(U.action) || s(U.action, o && ce);
  }
  function W(U) {
    var T;
    U.stopPropagation();
    const ce = U.code || U.key;
    if (U.repeat || q.current.add(ce), !An(U)) {
      if (U.repeat && !q.current.has(ce)) {
        U.preventDefault();
        return;
      }
      if (U.key === "Escape")
        U.preventDefault(), U.repeat || c();
      else if (U.key === "Enter")
        U.preventDefault(), U.repeat || ie(k[x], U.shiftKey);
      else if (U.key === "ArrowDown" || U.key === "ArrowUp") {
        if (U.preventDefault(), !k.length) return;
        const z = U.key === "ArrowDown" ? 1 : -1;
        h((x + z + k.length) % k.length);
      } else U.key === "Tab" && (U.preventDefault(), (T = m.current) == null || T.focus());
    }
  }
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${l ? " dq-find-mobile" : ""}`,
        onKeyDown: W,
        onMouseDown: (U) => {
          U.target !== m.current && U.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: m,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${P}-list`,
                "aria-activedescendant": x >= 0 ? D(k[x].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (U) => {
                  d(U.target.value), h(0);
                }
              }
            ),
            !l && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          k.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${P}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: k.map((U, ce) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: D(U.index),
                  tabIndex: -1,
                  "aria-selected": ce === x,
                  disabled: (r == null ? void 0 : r(U.action)) ?? !1,
                  onClick: (T) => ie(U, T.shiftKey || i && xc(U.action)),
                  children: [
                    l ? null : U.key ? /* @__PURE__ */ u(de, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": Fa(U.key) ? !0 : void 0, children: U.key }),
                      Fa(U.key) && /* @__PURE__ */ u(de, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: Fa(U.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: U.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Hr(U.action, L, t, n).map(
                      (T, z) => /* @__PURE__ */ a("span", { "data-effect-tone": T.tone, children: T.text }, z)
                    ) })
                  ]
                }
              ) }, U.action.id))
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
function Nl() {
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
function is(e) {
  return Ti(e.subscribe, e.get, e.get);
}
function ql(e, t) {
  const n = $(t);
  Dt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Sl(e, t) {
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
const Ef = [], vi = Oo.map(
  (e, t) => ({ indent: t, keys: e })
), js = vi.length - 1;
function Lt({ binding: e, hidden: t }) {
  const n = t ? void 0 : Fa(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(de, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function so(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kl(e) {
  return Oo.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function El({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(de, { children: r.map((o, i) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === r.length - 1 && n
  ] }, i)) });
}
function Al({
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
          /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
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
function Af({
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
                /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(de, { children: [
                /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(de, { children: [
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
function Cf({ checked: e, onChange: t }) {
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
function If({
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
  attention: p = Ef,
  stayOnTap: h = !1,
  onStayOnTapChange: m
}) {
  const y = as(), N = ba(e), v = Qa();
  ql(i, v);
  const w = ut(), q = Jr(
    ye(() => e.flatMap((j) => j.steps.flatMap((R) => R.tagIds)), [e])
  ), P = vi.filter((j) => j.keys.some((R) => N.actionOn.has(R))), L = P.includes(vi[js]), M = e.length - N.actionOn.size, k = ye(
    () => d && !f ? zr(e) : [],
    [d, f, e]
  ), x = ye(
    () => k.length && r ? gi(e, r) : null,
    [k, e, r]
  ), D = new Map(
    bi(x ?? []).flatMap(
      (j) => j.actions.filter((R) => gl(e[R])).map((R) => [R, j.name])
    )
  ), ie = ye(
    () => e.map((j) => f ? [] : pf(j, p, o)),
    [e, p, o, f]
  ), W = (j) => j.map(gf).join("; "), U = ie.map(W), ce = k.length > 0 && /* @__PURE__ */ a(
    Af,
    {
      groups: k,
      statuses: x,
      actions: e,
      attentionOf: (j) => W([
        ...new Map(
          j.actions.flatMap((R) => ie[R]).map((R) => [R.key, R])
        ).values()
      ])
    }
  ), T = (j) => {
    const R = Hr(e[j], q, [], o).map((se) => se.text).join(", "), A = D.get(j), H = U[j];
    return [
      R,
      A === void 0 ? "" : `${A}: not answered yet`,
      H ? `Needs attention: ${H}` : ""
    ].filter(Boolean).join(". ");
  }, z = (j) => U[j] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${U[j]}`,
        children: /* @__PURE__ */ a(or, {})
      }
    )
  ) : null, I = (j) => ({
    onMouseEnter: () => i.set(j),
    onMouseLeave: () => i.clear(j),
    onFocus: () => i.set(j),
    onBlur: () => i.clear(j)
  }), ee = (j) => {
    const R = N.actionOn.get(j), A = R === void 0 ? void 0 : e[R];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(Lt, { binding: j, hidden: !0 })
        },
        j
      );
    const H = t(A), se = `${w}-effect-${j}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : I(A), children: [
      /* @__PURE__ */ a("span", { id: se, className: "dq-sr-only", children: T(R) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": j,
          "aria-describedby": se,
          "data-group-open": D.has(R) || void 0,
          "data-attention": U[R] ? !0 : void 0,
          disabled: H,
          onClick: (pe) => s(A, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(Lt, { binding: j }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            so(A) && " ",
            so(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", title: "Marks absent", children: [
              /* @__PURE__ */ a(yo, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-pad-marker-text", children: "absent" })
            ] }),
            z(R)
          ]
        }
      )
    ] }, j);
  }, Z = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(pa, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const j = kl(N), R = (A) => {
      const H = e[A], se = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: H.label,
          "aria-keyshortcuts": se,
          "aria-describedby": `${w}-effect-${se}`,
          "data-group-open": D.has(A) || void 0,
          "data-attention": U[A] ? !0 : void 0,
          disabled: t(H),
          onClick: (pe) => {
            i.clear(H), s(H, pe.shiftKey || h && xc(H));
          },
          ...f ? {} : Sl(i, H),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: H.label }),
            so(H) && " ",
            so(H) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(yo, { "aria-hidden": "true" }),
              "absent"
            ] }),
            z(A)
          ]
        },
        se
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
            f ? Z : /* @__PURE__ */ a(
              Us,
              {
                actions: e,
                keyMap: N,
                names: q,
                tags: r,
                trees: o,
                preview: i,
                findKey: y.find,
                mobile: !0
              }
            ),
            m && /* @__PURE__ */ a(Cf, { checked: h, onChange: m })
          ] }),
          ce,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            El,
            {
              groups: j,
              renderAction: R,
              find: /* @__PURE__ */ a(
                Al,
                {
                  extra: M,
                  findKey: y.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: j.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: T(A) }, A)) })
        ]
      }
    );
  }
  const me = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), J = !L && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": M ? `Find action, ${M} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(Lt, { binding: y.find }),
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
        /* @__PURE__ */ u("div", { className: `dq-pad-header${ce ? " dq-pad-header-groups" : ""}`, children: [
          f ? Z : /* @__PURE__ */ a(
            Us,
            {
              actions: e,
              keyMap: N,
              names: q,
              tags: r,
              trees: o,
              preview: i,
              findKey: y.find
            }
          ),
          ce ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              ce,
              me,
              J
            ] })
          ) : /* @__PURE__ */ u(de, { children: [
            !f && me,
            J
          ] })
        ] }),
        P.map((j) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": j.indent, children: [
          j.keys.map(ee),
          j.indent === js && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": M ? `Find action, ${M} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(Lt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
                  M ? `${M} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, j.indent))
      ]
    }
  );
}
function Us({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const l = is(i), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && m < e.length && /* @__PURE__ */ u(de, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(Lt, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? es(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(Lt, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Hr(l, n, [], o).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Cl({
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
  paused: m = !1
}) {
  const y = as(), N = ba(e), v = Qa(), w = ut(), q = Jr(ye(() => Po(e), [e])), [P] = C(() => Nl());
  ql(P, v);
  const L = $(null), M = Tf(L, e, !v), k = kl(N);
  !k.length && e.length && k.push([]);
  const x = k.flat(), D = e.length - x.length, ie = (T) => Hr(T, q, t, n).map((z) => z.text).join(", "), W = (T) => ({
    onMouseEnter: () => P.set(T),
    onMouseLeave: () => P.clear(T),
    onFocus: () => P.set(T),
    onBlur: (z) => {
      z.currentTarget.contains(z.relatedTarget) || P.clear(T);
    }
  }), U = l ?? (v ? void 0 : f), ce = (T) => {
    const z = e[T];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: z.label,
        "aria-keyshortcuts": N.keys[T] || void 0,
        "aria-describedby": `${w}-effect-${T}`,
        disabled: m || r(z),
        onClick: () => {
          P.clear(z), i(z);
        },
        ...m ? {} : Sl(P, z),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: z.label })
      },
      z.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: L,
      className: `dq-action-bar${v ? " dq-bar-mobile" : M ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
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
                El,
                {
                  groups: k,
                  renderAction: ce,
                  find: /* @__PURE__ */ a(
                    Al,
                    {
                      extra: D,
                      findKey: y.find,
                      disabled: m,
                      onFind: s
                    }
                  )
                }
              ),
              !v && k.map((T, z) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                T.map((I) => {
                  const ee = e[I], Z = N.keys[I];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: ee.label,
                      "aria-keyshortcuts": Z || void 0,
                      "aria-describedby": `${w}-effect-${I}`,
                      disabled: m || r(ee),
                      onClick: () => i(ee),
                      ...m ? {} : W(ee),
                      children: [
                        Z && /* @__PURE__ */ a(Lt, { binding: Z }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: ee.label })
                      ]
                    },
                    ee.id
                  );
                }),
                z === k.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": D > 0 ? `Find action, ${D} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: m,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(Lt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: D > 0 ? `${D} more` : "Find action" })
                    ]
                  }
                )
              ] }, z)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        U && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: U }),
        m ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(pa, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          $f,
          {
            actions: e,
            keyMap: N,
            preview: P,
            names: q,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ a("div", { hidden: !0, children: x.map((T) => /* @__PURE__ */ a("span", { id: `${w}-effect-${T}`, children: ie(e[T]) }, e[T].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Tf(e, t, n) {
  const [r, o] = C(!1);
  return Dt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (x) => [...x.children].map((D) => D.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), q = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, P = (x) => y.map((D) => {
        let ie = 1, W = 0;
        for (const U of D)
          W > 0 && W + v + U > x ? (ie += 1, W = U) : W += (W > 0 ? v : 0) + U;
        return ie;
      }), L = (x) => Math.max(1, x.reduce((D, ie) => D + ie, 0)), M = P(m), k = L(P(m - q));
      o(
        1 + L(M) < k || 1 + L(M) === k && M.every((x) => x === 1)
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
function $f({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = is(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(Lt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Hr(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const Ks = 1e3;
async function Rf(e, t, n) {
  const r = await he(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await he(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          sr({
            findFilter: {
              page: l,
              perPage: Ks,
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
    if (l * Ks >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = Ue(e), c = $e(e) ? await Mf(
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
function Of(e) {
  return JSON.stringify(
    sr({
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
async function Mf(e, t, n) {
  const r = new Array(t.length).fill(0), o = new AbortController(), i = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && i(), n == null || n.addEventListener("abort", i, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !o.signal.aborted; ) {
            const c = s++;
            r[c] = (await he(
              `/api/${Wn(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Of(t[c])
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
function Ff(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function xf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Pf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of Ar(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Lf(e, t, n) {
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
function Df(e, t) {
  var r;
  const n = Pt(e);
  return ((r = zr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const _f = (e) => e instanceof Error ? e.message : "Request failed.";
function jf({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = C([]), [c, l] = C({}), [f, d] = C({}), [p, h] = C({}), m = $(/* @__PURE__ */ new Map());
  Y(
    () => () => {
      for (const T of m.current.values()) T.abort();
    },
    []
  );
  const y = Yn(Ue(t)), N = $e(t), v = N ? "performer" : y.one;
  function w(T) {
    var I;
    (I = m.current.get(T)) == null || I.abort();
    const z = new AbortController();
    m.current.set(T, z), l((ee) => ({ ...ee, [T]: { status: "loading" } })), Rf(t, T, z.signal).then(
      (ee) => {
        z.signal.aborted || l((Z) => ({
          ...Z,
          [T]: { status: "ready", group: ee }
        }));
      },
      (ee) => {
        z.signal.aborted || l((Z) => ({
          ...Z,
          [T]: { status: "failed", message: _f(ee) }
        }));
      }
    );
  }
  function q(T) {
    var me;
    const z = i.filter((J) => !T.includes(J));
    for (const J of z)
      (me = m.current.get(J)) == null || me.abort(), m.current.delete(J);
    const I = (J) => {
      const j = c[J];
      return (j == null ? void 0 : j.status) === "ready" ? j.group.children.map((R) => R.id) : [];
    }, ee = new Set(T.flatMap(I)), Z = z.flatMap(I).filter((J) => !ee.has(J));
    d(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([j]) => !Z.includes(Number(j)))
      )
    ), h(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([j]) => T.includes(Number(j)))
      )
    ), l(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([j]) => T.includes(Number(j)))
      )
    ), s(T);
    for (const J of T) i.includes(J) || w(J);
  }
  const P = i.flatMap((T) => {
    const z = c[T];
    return (z == null ? void 0 : z.status) === "ready" ? [z.group] : [];
  }), L = P.length === i.length, M = i.some(
    (T) => {
      var z;
      return (((z = c[T]) == null ? void 0 : z.status) ?? "loading") === "loading";
    }
  ), k = new Map(
    Ff(P).map((T) => [T.parent.id, T])
  ), x = xf(P), D = new Map(P.map((T) => [T.parent.id, T.parent.name])), ie = Pf(t.actions), W = (T) => f[T] ?? !ie.has(T), U = L ? [...k.values()].flatMap((T) => {
    const z = Df(T.parent.name, t.actions);
    return T.children.filter((I) => W(I.id)).map((I) => ({ child: I, answerGroup: z }));
  }) : [], ce = (T, z) => d((I) => ({
    ...I,
    ...Object.fromEntries(T.children.map((ee) => [ee.id, z]))
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
      kr,
      {
        entityType: "tag",
        values: i,
        onChange: q,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((T) => {
      const z = c[T];
      if (!z || z.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, T);
      if (z.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            z.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(T),
              children: "Retry"
            }
          )
        ] }, T);
      const I = k.get(T);
      if (!I) return null;
      const ee = I.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: ee }),
        z.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[T] ?? !1,
                disabled: n,
                onChange: (Z) => h((me) => ({
                  ...me,
                  [T]: Z.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            ee,
            " tree"
          ] }),
          I.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(de, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${ee}`,
                  onClick: () => ce(I, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${ee}`,
                  onClick: () => ce(I, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: I.children.map((Z) => {
              const me = ie.get(Z.id) ?? [], J = (x.get(Z.id) ?? []).filter((j) => j !== T).map((j) => `“${D.get(j)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: W(Z.id),
                    disabled: n,
                    onChange: (j) => d((R) => ({
                      ...R,
                      [Z.id]: j.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  Z.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    Z.uses.toLocaleString(),
                    " ",
                    Z.uses === 1 ? y.one : y.many
                  ] }),
                  J.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    J.join(", ")
                  ] }),
                  me.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    me[0].label || "New action",
                    "”",
                    me.length > 1 ? ` and ${me.length - 1} more` : ""
                  ] })
                ] })
              ] }, Z.id);
            }) })
          ] })
        ] })
      ] }, T);
    }),
    /* @__PURE__ */ u("div", { className: "dq-row", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !U.length,
          onClick: () => r(
            U.map(
              ({ child: T, answerGroup: z }) => Lf(
                T,
                (x.get(T.id) ?? []).filter(
                  (I) => p[I]
                ),
                z
              )
            )
          ),
          children: U.length ? `Add ${U.length} action${U.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: M ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Uf(e, t, n, r) {
  const o = Pt(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: Pt(c) === o });
    return i;
  }
  const s = Pt(r);
  for (const c of t)
    Pt(c).includes(s) && i.push({ kind: "group", name: c, selected: Pt(c) === o });
  return s && !t.some((c) => Pt(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Kf(e) {
  return e.kind === "group" ? `group:${Pt(e.name)}` : e.kind;
}
function Bf(e) {
  const { group: t, ...n } = e;
  return n;
}
const Gf = /* @__PURE__ */ new Set([
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
]), zf = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), co = 4, Bs = 240;
function Vf(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Jf(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Hf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = ut(), s = ut(), c = ut(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), m = $([]), y = $(!1), N = $(!1), [v, w] = C(!1), [q, P] = C(null), [L, M] = C(null), [k, x] = C(!1), D = e.group ?? "", ie = ye(
    () => Uf(t, n, D, q),
    [t, n, D, q]
  ), W = ie.map(Kf), U = L === null ? -1 : W.indexOf(L), ce = (A) => `${s}-option-${A}`, T = (A) => o(A ? { ...e, group: A } : Bf(e)), z = () => {
    var H;
    const A = ((H = d.current) == null ? void 0 : H.value) ?? D;
    A.trim() !== A && T(A.trim());
  };
  function I(A) {
    P(null), M(A), w(!0);
  }
  const ee = (A) => {
    var H, se;
    return A instanceof Node && (((H = l.current) == null ? void 0 : H.contains(A)) || ((se = p.current) == null ? void 0 : se.contains(A))) === !0;
  };
  function Z() {
    var A, H;
    (A = p.current) != null && A.contains(document.activeElement) && ((H = h.current) == null || H.focus({ preventScroll: !0 })), w(!1), P(null), M(null), x(!1);
  }
  function me(A) {
    A.kind === "group" && A.selected && q === null || T(A.kind === "none" ? "" : A.name), Z();
  }
  function J() {
    const A = f.current, H = p.current;
    if (!A || !H) return;
    const se = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Fe = (pe ? pe.offsetTop + pe.height : window.innerHeight) - se.bottom - co, ge = se.top - G - co, mt = Math.min(H.scrollHeight, Bs), Se = Fe < mt && ge > Fe;
    H.style.left = `${se.left}px`, H.style.width = `${se.width}px`, H.style.top = `${Se ? se.top - co : se.bottom + co}px`, H.style.transform = Se ? "translateY(-100%)" : "", H.style.maxHeight = `${Math.max(0, Math.min(Bs, Se ? ge : Fe))}px`, Jf(A, H, se, m.current) || Z();
  }
  Dt(() => {
    var A;
    v && (f.current && (m.current = Vf(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), x(!0)), N.current = !1);
  }, [v]), Dt(() => {
    v && J();
  }), Y(() => {
    if (!v) return;
    const A = () => J(), H = (G) => {
      ee(G.target) || Z();
    }, se = [...m.current, window], pe = window.visualViewport;
    for (const G of se) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), pe == null || pe.addEventListener("resize", A), pe == null || pe.addEventListener("scroll", A), document.addEventListener("pointerdown", H), () => {
      for (const G of se) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), pe == null || pe.removeEventListener("resize", A), pe == null || pe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", H);
    };
  }, [v]), Y(() => {
    var A, H, se;
    U >= 0 && ((se = (H = (A = p.current) == null ? void 0 : A.children[U]) == null ? void 0 : H.scrollIntoView) == null || se.call(H, { block: "nearest" }));
  }, [U]);
  function j(A) {
    if (An(A)) return;
    const H = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (H && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), I(A.altKey ? null : Pt(D) ? `group:${Pt(D)}` : "none");
      return;
    }
    if (v)
      if (H) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && Z();
          return;
        }
        const se = A.key === "ArrowDown" ? 1 : -1, pe = q !== null && Pt(q) && W.length > 1 ? 1 : 0, G = U < 0 ? se > 0 ? pe : W.length - 1 : (U + se + W.length) % W.length;
        M(W[G]);
      } else A.key === "Enter" && (A.preventDefault(), U >= 0 ? me(ie[U]) : (z(), Z()));
  }
  function R(A) {
    var se;
    if (A.key === "Tab") {
      Z(), A.shiftKey && ((se = d.current) == null || se.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || An(A) && !zf.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = d.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Gf.has(A.key) && !An(A) && x(!1), j(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || An(A) || (A.preventDefault(), A.stopPropagation(), Z());
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
                "aria-activedescendant": v && U >= 0 ? ce(U) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: D,
                onChange: (A) => {
                  T(A.target.value), P(A.target.value), M(null), w(!0);
                },
                onClick: () => {
                  v || I(null);
                },
                onKeyDown: j,
                onBlur: () => {
                  Z(), z();
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
                  var se;
                  const A = y.current;
                  y.current = !1;
                  const H = document.activeElement === d.current;
                  v ? Z() : (N.current = A && !H, I(null)), (!A || H) && ((se = d.current) == null || se.focus());
                },
                children: /* @__PURE__ */ a(Oi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item. When a chosen performer's items answer a group in two different ways, their Existing answers mark the group Mixed." : "A group is one question with one answer per item." }),
        v && Yd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: p,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": U >= 0 ? ce(U) : void 0,
              "data-tap-focus": k || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: R,
              onBlur: (A) => {
                ee(A.relatedTarget) || Z();
              },
              children: ie.map((A, H) => /* @__PURE__ */ u(
                "li",
                {
                  id: ce(H),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": H === U || void 0,
                  onMouseMove: () => {
                    H !== U && M(W[H]);
                  },
                  onClick: () => me(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(ga, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                W[H]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const yr = [
  ...Oo,
  ["auto", qr]
];
function Il(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Li(e[n]);
}
function Qf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = C(!1), c = $(null), l = n.keys[t], f = Il(e, n, t), d = Kr(f), p = n.duplicatePins.has(t) ? ` (${La(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${La(l)}, ${d ? "pinned" : "Auto"}${p}` : f === qr ? "no key, Find action only" : `no key: Auto found no free key${p}`, m = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(de, { children: [
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
          l ? /* @__PURE__ */ a(Lt, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(Sc, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      Wf,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          o(y), m();
        },
        onClose: m
      }
    )
  ] });
}
function Wf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], l = Il(e, n, t), [f, d] = C(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Dt(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Kr(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function m(N) {
    var k, x, D;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), i();
      return;
    }
    if (N.key === "Tab") {
      const ie = [...((k = s.current) == null ? void 0 : k.querySelectorAll("button[tabindex='0']")) ?? []], W = ie.indexOf(document.activeElement);
      N.preventDefault(), (x = ie[(W + (N.shiftKey ? -1 : 1) + ie.length) % ie.length]) == null || x.focus();
      return;
    }
    const v = (D = N.target.dataset) == null ? void 0 : D.choice, w = v ? yr.findIndex((ie) => ie.includes(v)) : -1;
    if (!v || w < 0) return;
    const q = yr[w].indexOf(v), P = (ie) => ie == null ? void 0 : ie[Math.min(q, ie.length - 1)], L = {
      ArrowLeft: yr[w][q - 1],
      ArrowRight: yr[w][q + 1],
      ArrowUp: P(yr[w - 1]),
      ArrowDown: P(yr[w + 1]),
      Home: yr[w][0],
      End: yr[w].at(-1)
    };
    if (!Object.hasOwn(L, N.key)) return;
    N.preventDefault();
    const M = L[N.key];
    M && h(M);
  }
  const y = (N) => {
    const v = Kr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: Li(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(de, { children: [
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
        onKeyDown: m,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ u("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Oo.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const q = y(w), P = q ? `${q.own ? "this action" : q.label}, ${q.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${q ? "" : " dq-key-choice-free"}${q != null && q.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${La(w)}: ${P}`,
                "aria-pressed": !!(q != null && q.own && q.pinned),
                title: q ? `${q.label} (${q.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => o(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Lt, { binding: w }),
                    (q == null ? void 0 : q.pinned) && /* @__PURE__ */ a(Sc, { "aria-hidden": "true" })
                  ] }),
                  q && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: q.label })
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
                "data-choice": qr,
                tabIndex: 0,
                "aria-pressed": l === qr,
                onClick: () => o(qr),
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
const Yf = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Xf(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Zf(e, t) {
  if (ir(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Di(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Tl(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function eh(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function th({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const l = Ge(e), f = l !== "tag", d = e.actions, p = ba(d), h = Jr(ye(() => Po(d), [d])), m = ye(
    () => f ? zr(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === i), N = ye(
    () => f && y >= 0 ? zr(
      d.filter((G, we) => we !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ye(
    () => new Set(
      v ? sf(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [q, P] = C(""), [L, M] = C(!1), [k, x] = C(
    null
  ), D = ut(), ie = `${D}-from-tags`, W = $(null), U = $(null), ce = $(null), T = $(null), z = $(/* @__PURE__ */ new WeakMap()), I = (G) => {
    let we = z.current.get(G);
    return we || (we = crypto.randomUUID(), z.current.set(G, we)), we;
  }, ee = q.trim().toLocaleLowerCase(), Z = ee ? d.filter((G) => G.label.toLocaleLowerCase().includes(ee)) : d, me = (G) => t({ ...e, actions: G }), J = (G, we) => me(d.map((Fe, ge) => ge === G ? we : Fe));
  function j(G) {
    var we;
    return [...((we = ce.current) == null ? void 0 : we.querySelectorAll("[data-action-id]")) ?? []].find(
      (Fe) => Fe.dataset.actionId === G
    );
  }
  function R(G, we) {
    const Fe = j(G), ge = Fe == null ? void 0 : Fe.querySelector(
      we === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ge == null || ge.focus(), !!ge;
  }
  Dt(() => {
    var we;
    const G = T.current;
    G && (T.current = null, (G === "add" || !R(G.id, G.part)) && ((we = U.current) == null || we.focus()));
  }), Y(() => {
    !c || !i || (Z.some((G) => G.id === i) ? R(i, "label") : (P(""), T.current = { id: i, part: "label" }));
  }, [c]);
  function A() {
    const G = eh(l);
    P(""), me([...d, G]), s(G.id), T.current = { id: G.id, part: "label" };
  }
  function H(G) {
    const we = d[G], { shortcut: Fe, ...ge } = structuredClone(we), mt = {
      ...ge,
      ...Fe === qr ? { shortcut: Fe } : {},
      id: crypto.randomUUID(),
      label: `${we.label} copy`
    };
    me([...d.slice(0, G + 1), mt, ...d.slice(G + 1)]), s(mt.id), T.current = { id: mt.id, part: "label" };
  }
  function se(G) {
    const we = d[G], Fe = Z.indexOf(we), ge = Z[Fe + 1] ?? Z[Fe - 1];
    me(d.filter((mt, Se) => Se !== G)), i === we.id && s(null), T.current = ge ? { id: ge.id, part: "toggle" } : "add";
  }
  function pe() {
    M(!1), requestAnimationFrame(() => {
      var G;
      return (G = W.current) == null ? void 0 : G.focus();
    });
  }
  return /* @__PURE__ */ u("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ u("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ u("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ u(
          "button",
          {
            ref: U,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: W,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": L,
            "aria-controls": L ? ie : void 0,
            onClick: () => {
              x(null), M(!L);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: q,
              onChange: (G) => P(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && q && !An(G) && (G.preventDefault(), G.stopPropagation(), P(""));
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
              "aria-describedby": `${D}-groups-note`,
              onChange: (G) => t({
                ...e,
                stayUntilGroupsAnswered: G.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${D}-groups-note`, children: v && !m.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (k == null ? void 0 : k.actions) === d ? `Added ${k.count} action${k.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && L && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || An(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          jf,
          {
            id: ie,
            review: e,
            disabled: o,
            onAdd: (G) => {
              const we = [...d, ...G];
              me(we), x({ actions: we, count: G.length }), pe();
            },
            onCancel: pe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: ce, children: Z.length > 0 && /* @__PURE__ */ a(
      bc,
      {
        items: Z,
        getKey: (G) => G.id,
        disabled: o || !!ee,
        className: "dq-action-list",
        onReorder: (G) => me(G),
        renderItem: (G, { dragHandleProps: we, isOver: Fe }) => {
          const ge = d.indexOf(G), mt = i === G.id;
          return /* @__PURE__ */ a(
            nh,
            {
              action: G,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Qf,
                {
                  actions: d,
                  index: ge,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (Se) => me(tu(d, ge, Se))
                }
              ),
              takenPin: p.duplicatePins.has(ge) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(Pt(G.group)),
              effect: Hr(G, h, n, r),
              open: mt,
              detailId: `${D}-detail-${G.id}`,
              dragHandleProps: we,
              isOver: Fe,
              reorderDisabled: o || !!ee,
              onToggle: () => s(mt ? null : G.id),
              onDuplicate: () => H(ge),
              onDelete: () => se(ge),
              children: "steps" in G ? /* @__PURE__ */ a(
                rh,
                {
                  action: G,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: $e(e),
                  saving: o,
                  stepKey: I,
                  rememberStepKey: (Se, ze) => z.current.set(Se, I(ze)),
                  onChange: (Se) => J(ge, Se)
                }
              ) : /* @__PURE__ */ a(
                oh,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Se) => J(ge, Se)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !Z.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      q.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function nh({
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
  onDelete: m,
  children: y
}) {
  const N = e.label.trim() || "New action", v = Zf(e, t), w = "steps" in e && Pt(e.group) ? e.group.trim() : "";
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
              style: Tl(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(kc, { "aria-hidden": "true" })
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
                title: i.map((q) => q.text).join(" "),
                children: i.map((q, P) => /* @__PURE__ */ a("span", { "data-effect-tone": q.tone, children: q.text }, P))
              }
            ),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", title: v, children: [
              /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: v })
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${La(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${La(r)} is pinned twice` })
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(Ec, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${N}`,
              title: "Delete",
              onClick: m,
              children: /* @__PURE__ */ a(To, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(Oi, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function $l({
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
function rh({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: o,
  stepKey: i,
  rememberStepKey: s,
  onChange: c
}) {
  const l = ut(), f = $(null), d = $(null);
  Dt(() => {
    var m, y;
    const h = d.current;
    h != null && (d.current = null, (y = (m = f.current) == null ? void 0 : m.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a($l, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Hf,
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
          bc,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: m, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              ah,
              {
                step: h,
                index: m,
                dragHandleProps: y,
                isOver: N,
                saving: o,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((w, q) => q === m ? v : w));
                },
                onRemove: () => p(e.steps.filter((v, w) => w !== m))
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
              /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function ah({
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
      "data-step-tone": Xf(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Tl(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(kc, { "aria-hidden": "true" }),
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
            children: Yf.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          kr,
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
            children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function oh({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a($l, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const Rl = Sd(!1);
function ih({ children: e }) {
  return /* @__PURE__ */ a(Rl.Provider, { value: !0, children: e });
}
function mn({ tag: e, name: t }) {
  const n = kd(Rl), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Ad, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function sh({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Yn(Ue(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      kr,
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
function ch({
  review: e,
  onChange: t
}) {
  const n = Yn(Ue(e)).many, r = e.occurrence, o = Oc(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ha([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: Xd(r, d) }), f = (d, p) => l(
    o.map(
      (h, m) => m !== d ? h : p === void 0 ? { tagId: h.tagId } : { tagId: h.tagId, categoryTagId: p }
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
      const h = c(d.tagId), m = o.filter(
        (v, w) => w !== p && v.tagId === d.tagId
      ), y = (v) => m.some((w) => w.categoryTagId === v), N = `${d.tagId}#${o.slice(0, p).filter((v) => v.tagId === d.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(mn, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Ns,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (v) => f(p, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${h}`,
              excludeIds: m.flatMap(
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
            children: /* @__PURE__ */ a(To, { "aria-hidden": "true" })
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
      Ns,
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
const Ol = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Ml = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, lh = {
  video: $o,
  audio: Ic,
  tag: Cc,
  performerOccurrence: Ac,
  audioPerformerOccurrence: Ld
};
function Fl({ entityType: e }) {
  const t = lh[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Ol[e] });
}
const dh = 2e6;
function xl(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function uh(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ss(e) {
  xl([e], uh(e));
}
async function fh(e) {
  if (e.size > dh) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return za(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function fa(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function Pl({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: o,
  autoFocus: i = !1
}) {
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Ge(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: Mc.map((s) => /* @__PURE__ */ a("option", { value: s, children: Ml[s] }, s))
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
function hh(e, t) {
  const n = Ge(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function ph({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), o = ut(), i = ut();
  return Y(() => {
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
function Ll({
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
  onCancel: m,
  drawerRef: y
}) {
  const [N, v] = C("Review"), [w] = C(
    () => $e(e) && e.occurrence.tagIds.length > 0
  ), [q, P] = C(""), [L, M] = C(null), [k, x] = C(0), [D, ie] = C(!1), W = $(null), U = $(null), ce = $(null), T = hh(e, w), z = Ge(e), I = ye(() => fa(e), [e]);
  Y(() => P(""), [I]), Y(() => {
    var R, A;
    if (D) return;
    const J = W.current;
    if (W.current = null, !J) return;
    (A = J.isConnected && !!((R = ce.current) != null && R.contains(J)) && !(J instanceof HTMLButtonElement && J.disabled) ? J : ce.current) == null || A.focus({ preventScroll: !0 });
  }, [D]);
  function ee() {
    if (!(s || D)) {
      if (!f) {
        m();
        return;
      }
      W.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ie(!0);
    }
  }
  function Z() {
    const J = { ...e, name: e.name.trim() }, j = Da(J);
    if (!j) {
      P(""), h();
      return;
    }
    if (P(j), !J.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = U.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const R = e.actions.find(
      (A) => !ir(A, z)
    );
    R && (v("Actions"), M(R.id), x((A) => A + 1));
  }
  const me = q || l;
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (J) => {
          ce.current = J, y && (y.current = J);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (J) => {
          J.key !== "Escape" || J.defaultPrevented || s || An(J) || (J.preventDefault(), J.stopPropagation(), ee());
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
                onClick: ee,
                children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Cd,
            {
              tabs: T.map((J) => ({
                key: J,
                label: J,
                count: J === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (J) => v(J)
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
                    Pl,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: U,
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
                        onChange: (J) => r(J.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  $e(e) && /* @__PURE__ */ a(ch, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => ss(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            T.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(mh, { review: e, onChange: t })
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
                  th,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: L,
                    onExpand: M,
                    reveal: k
                  }
                )
              }
            ),
            w && $e(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(sh, { review: e, onChange: t })
              }
            )
          ] }) }),
          (me || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            me && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
              me
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: ee, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || Z();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    D && /* @__PURE__ */ a(
      ph,
      {
        onKeepEditing: () => ie(!1),
        onDiscard: () => {
          W.current = null, ie(!1), m();
        }
      }
    )
  ] });
}
function mh({
  review: e,
  onChange: t
}) {
  const n = ut(), r = e.view, o = (d) => t({ ...e, view: { ...r, ...d } }), i = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (Ge(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        Gs,
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
  return /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          zs,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(bh, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          zs,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(yh, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        Gs,
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
                annotations: h.target.checked ? [...l, d] : l.filter((m) => m !== d)
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
            kr,
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
        kr,
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
      gh,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function gh({
  bins: e,
  onChange: t
}) {
  const n = ut(), [r, o] = C(null), i = e.find((c) => c.key === r), s = (c, l) => t(
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
            children: /* @__PURE__ */ a(To, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || An(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          yc,
          {
            open: !0,
            onClose: () => o(null),
            criteria: Io,
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
function Gs({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const o = ut();
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
function zs({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: o,
  onChoose: i
}) {
  const s = ut(), c = ut();
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
function bh() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function yh() {
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
const Ni = "The queue differs from the saved review.";
function Dl({
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
  chipsStart: m,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = $(null);
  Sh(v);
  const w = kh(v), [q, P] = C({ differs: h, text: "" });
  return q.differs !== h && P({
    differs: h,
    text: h ? q.differs === !1 ? Ni : q.text : ""
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
          children: /* @__PURE__ */ a(Ga, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Ol[n], children: /* @__PURE__ */ a(Fl, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(pa, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(wh, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    m,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: q.text })
  ] });
}
function wh({
  change: e,
  onPress: t
}) {
  const n = ut(), r = ut(), o = `${Ni} Save these filters to the review.`, i = e.onSave ? `${Ni} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(de, { children: [
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
          /* @__PURE__ */ a(jd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Ud, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const vh = ["queue", "summary", "name", "layout", "range"], Nh = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, qh = "(min-width: 1400px)";
function go(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function Vs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = vh.filter(
    (i) => e.querySelector(Nh[i])
  );
  for (let i = 1; i <= o.length && !go(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !go(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return go(e) ? !0 : (r(), !1);
}
function Sh(e) {
  const t = vl(qh), [n, r] = C(0), o = $(!1);
  Dt(() => {
    e.current && (o.current = !Vs(e.current, t));
  }, [e, t, n]), Dt(() => {
    const i = e.current;
    i && t && !o.current && !go(i) && (o.current = !Vs(i, t));
  }), Y(() => {
    const i = e.current;
    if (!i || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(i);
    for (const c of i.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function kh(e) {
  const t = $(!1);
  return Y(() => {
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
function _l({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, o] = C(!1), [i, s] = C(""), c = $(null), l = $(null);
  Y(() => {
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
        children: /* @__PURE__ */ a(Ga, { "aria-hidden": "true" })
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
          An(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(Tc, { "aria-hidden": "true" })
      }
    )
  ] });
}
function jl({
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
          /* @__PURE__ */ a(_d, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Mi, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Eh({
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
function cs({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = C(!1), [i, s] = C(!1), c = $(null), l = $(null), f = ut();
  Dt(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), m = l.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < m && h.top > y);
  }, [r]), Y(() => {
    var h, m;
    r && ((m = (h = l.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus({ preventScroll: !0 }));
  }, [r]), Y(() => {
    t && o(!1);
  }, [t]);
  const d = (h = !0) => {
    var m;
    o(!1), h && ((m = c.current) == null || m.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const m = [
      ...((N = l.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = m.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), d();
    else if (h.key === "Tab")
      d(!1);
    else if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), !m.length) return;
      const w = h.key === "ArrowDown" ? 1 : -1;
      m[(y + w + m.length) % m.length].focus();
    } else (h.key === "Home" || h.key === "End") && (h.preventDefault(), (v = m.at(h.key === "Home" ? 0 : -1)) == null || v.focus());
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
        children: /* @__PURE__ */ a(Dd, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: l,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u($i, { children: [
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
function Ao(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function ls(e) {
  return String(e.type).toLowerCase() === "tag";
}
function ds(e) {
  return !!String(e ?? "").trim();
}
function us(e) {
  return [
    ...new Set(
      Ao(e.customFieldCriteria).filter(ls).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !ds(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function fs(e, t) {
  const n = Ao(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!ls(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !ds(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function Ul(e, t, n) {
  const r = Ao(e.customFieldCriteria);
  if (!r.length) return e;
  const o = Ao(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!ls(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(l[p] ?? "")];
      m && l[h] === m && !ds(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
class Kl extends Error {
}
const qi = (e) => e instanceof Error ? e.message : "Request failed.", Js = (e) => [...e].sort((t, n) => t - n), ja = (e, t) => JSON.stringify(Js(e)) === JSON.stringify(Js(t)), Si = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Co(e, t, n, r) {
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
    const p = d.filter((m) => i.has(m) && !o.has(m)), h = d.filter(
      (m) => i.has(m) && o.has(m) && !c.has(m)
    );
    !p.length || !h.length || (r ? (h.forEach((m) => i.delete(m)), f.push(...h)) : (p.forEach((m) => i.delete(m)), l.push({ tagIds: p, existing: h })));
  }
  return { desired: [...i], conflict: s, skipped: !1, kept: l, replaced: f };
}
function Ah(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ch(e, t, n, r) {
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
      l = (await he(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new Kl(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Ih(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !ir(h, e.entityType) || !h.steps.length || h.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = Pa(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Ji(o.occurrence, n) : [];
  await Ch(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await Ja(h, n)
    }))
  ), l = structuredClone(Ah(c));
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
  const d = await Vi(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const m = await Hi(o, d, h, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Co(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ja(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(p.size), h * 250 >= m.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    id: Zi(),
    review: o,
    actions: i,
    action: l,
    categories: s,
    touched: f,
    entries: [...p.values()]
  };
}
function Th(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!ja(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ja(o(e), o(t));
}
async function Bl(e, t, n, r) {
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
function Gl(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function zl(e) {
  return e.entries.filter((t) => t.operation);
}
async function $h(e, t, n, r, o = !1) {
  await Bl(
    Gl(e, o),
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
        if (s = await Wt(Ue(e.review), i.item, !1), !Th(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = qi(h);
        return;
      }
      const c = Co(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = cr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Qi(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await Wt(Ue(e.review), i.item, !1);
        p = !0, i.expected = h;
        const m = hi(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = Si(m) ? m : void 0, d) throw d;
        if (!ja(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = qi(h), !p)
          try {
            const m = await Wt(Ue(e.review), i.item, !1);
            i.expected = m;
            const y = hi(
              i.item,
              i.before,
              m,
              e.touched
            );
            i.operation = Si(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Rh(e, t, n) {
  await Bl(
    zl(e),
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
        const c = await Wt(Ue(e.review), r.item, !1);
        il(o, c), s = !0, await Qi(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await Wt(Ue(e.review), r.item, !1);
        if (!ja(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${qi(c)}`, r.status = "failed", s)
          try {
            const l = await Wt(Ue(e.review), r.item, !1), f = hi(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = Si(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
function Hs(e) {
  return Yi({
    id: e.id,
    at: e.recordedAt ?? (e.recordedAt = Date.now()),
    label: `Batch: ${e.actions.map((t) => t.label).join(", ")}`,
    reviewName: e.review.name,
    reviewId: e.review.id,
    kind: Ue(e.review),
    items: e.entries.flatMap(
      (t) => t.operation ? [
        Xi(
          t.item,
          ji(t.item.media, Ue(e.review)),
          t.operation.before,
          t.operation.after,
          [...t.operation.tags.added, ...t.operation.tags.removed]
        )
      ] : []
    )
  });
}
const Vl = (e, t) => t.count - e.count || ul(e, t);
async function Oh(e, t, n) {
  const r = Ue(e), o = e.occurrence, [i, s] = await Promise.all([
    he(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ji(o, n)
  ]), c = i.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  fi(c.map((y) => y.tag));
  const l = await Promise.all(
    s.map(async (y, N) => {
      const v = o.conditionTagIds[N];
      return (await he(`/api/tags/${v}`, { signal: n })).name;
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
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Vl);
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
  const m = /* @__PURE__ */ new Set([...f, ...d]);
  return {
    answered: new Set(
      c.filter((y) => m.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: h
  };
}
function Mh(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...o].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...Ar(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function hs(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const o = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Vl), i = (m) => m.members ?? m.tags.map((y) => y.id), s = zr(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...Ar(t[N])]))
    ];
    return y.length ? [{ ...m, answers: y, tags: o(y) }] : [];
  }), c = (m) => m.tags.length > 1 ? [m] : [], l = e.groups.filter((m) => m.id !== null).map((m) => {
    const y = `tag:${m.id}`, N = i(m), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: m.name,
      members: N,
      tags: m.tags,
      mixed: Mh(m.id, N, t, n) ? c({ key: y, name: m.name, members: N, tags: m.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((q) => v.has(q))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), f = l.map((m) => new Set(m.members)), d = /* @__PURE__ */ new Set();
  for (const m of s) {
    if (f.some((N) => m.answers.every((v) => N.has(v)))) continue;
    m.answers.forEach((N) => d.add(N));
    const y = `group:${m.key}`;
    l.push({
      key: y,
      kind: "group",
      name: m.name,
      members: m.answers,
      tags: m.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: m.name, members: m.answers, tags: m.tags })
    });
  }
  const p = e.groups.find((m) => m.id === null), h = (p == null ? void 0 : p.tags.filter((m) => !d.has(m.id))) ?? [];
  return p && h.length && l.push({
    key: "other",
    kind: "other",
    name: l.length ? "Other review tags" : "Review tags",
    members: i(p).filter((m) => !d.has(m)),
    tags: h,
    mixed: []
  }), l;
}
const Zo = { summary: null, error: "" };
function Jl(e, t, n = 0) {
  const r = e == null ? void 0 : e.occurrence, o = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    r == null ? void 0 : r.condition,
    r == null ? void 0 : r.conditionTagIds,
    r == null ? void 0 : r.includeSubtags,
    r == null ? void 0 : r.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [i, s] = C({
    key: o,
    value: Zo
  });
  return Y(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Zo }), e === null || t === null) return;
    const c = new AbortController();
    return Oh(e, t, c.signal).then((l) => {
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
  }, [o, n]), i.key === o ? i.value : Zo;
}
function Fh(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = uf(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => o.add(h.name));
  }
  const i = Pt(e.name), s = [...r].filter((f) => Pt(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function xh(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function ki({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = mi,
  flags: i = [],
  className: s = ""
}) {
  const c = Yn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? hs(e, r, o) : [], d = ts(f), p = (h) => [
    ...new Set(
      i.filter((m) => {
        var y;
        return (y = m.tagIds) == null ? void 0 : y.some((N) => h.includes(N));
      }).flatMap((m) => m.flags)
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
          const m = h.kind === "other" ? [] : p(h.members), y = Fh(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: xh(h, y),
                  children: [
                    /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ u("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      N,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
                    ] }) : N
                  ]
                }
              ),
              m.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${m.join(", ")}`,
                  children: [
                    /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(mn, { tag: v }),
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
function da({
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
const Qs = 5;
function Ph(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await he(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const Ws = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Ei = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Ys = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Lh = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, ei = 250;
function Ma(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Dh({ step: e }) {
  const t = Ei.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ei.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(ga, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Xs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u($i, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function Oa({
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
        n && /* @__PURE__ */ u(de, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Zs({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Br(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(mn, { tag: o })
    ] }) }, `added-${o.id}`)),
    Br(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(mn, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function ec({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > ei && /* @__PURE__ */ u("span", { children: [
        "First ",
        ei.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, ei).map((i) => {
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
                Ma(i, n)
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
function tc(e) {
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
function _h({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i
}) {
  const [s, c] = C(!1), [l, f] = C("answers"), [d, p] = C(null), [h, m] = C({}), [y, N] = C([]), [v, w] = C(!1), [q, P] = C(!1), [L, M] = C(""), [k, x] = C(!1), [D, ie] = C(""), [W, U] = C(null), [ce, T] = C(!0), [z, I] = C(null), [ee, Z] = C([]), [me, J] = C(0), j = $(null), R = $(null), A = $(null), H = $(!1), se = $(!1), pe = $(null), G = $(!1), we = $(!1), Fe = $({ onClose: i });
  Fe.current = { onClose: i };
  const ge = ut(), mt = l === "run", Se = (W == null ? void 0 : W.kind) === "undo", ze = mt && d ? d.review : e, at = ba(ze.actions), Ie = ze.occurrence, Re = Ue(ze), Yt = Yn(Re), Cn = Yt.queue, gt = mt && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((O) => O.steps.length && !Sr(O))
  ), qt = gt.filter((O) => y.includes(O.id)), Ke = Ie.targetMode === "selected" && Ie.performerIds.length === 1, gn = Jl(
    ze,
    s && Ke ? Ie.performerIds[0] : null,
    me
  ), bn = us(ze.view.objectFilter), bt = Ha(
    s ? [...Po(gt), ...Ie.conditionTagIds, ...bn] : []
  ), Un = ye(() => nl(bt), [bt]), Te = (O) => h[O] ?? bt[O] ?? { id: O, name: `Tag ${O}` }, an = JSON.stringify(
    Object.fromEntries(
      bn.flatMap((O) => {
        var oe;
        const B = (oe = bt[O]) == null ? void 0 : oe.name;
        return B ? [[String(O), B]] : [];
      })
    )
  ), Tt = ye(
    () => fs(ze.view.objectFilter, JSON.parse(an)),
    [ze.view.objectFilter, an]
  );
  Y(() => {
    var O, B, oe;
    s && ((O = j.current) == null || O.showModal(), (oe = (B = j.current) == null ? void 0 : B.querySelector(".dq-batch-answer input")) == null || oe.focus());
  }, [s]), Y(() => {
    if (!s) return;
    const O = requestAnimationFrame(() => {
      var Ae;
      const B = j.current, oe = document.activeElement;
      if (!B || oe && oe !== document.body && B.contains(oe)) return;
      (Ae = (l === "answers" ? B.querySelector(".dq-batch-answer input:checked") ?? B.querySelector(".dq-batch-answer input") : B.querySelector("[data-batch-focus]")) ?? R.current) == null || Ae.focus();
    });
    return () => cancelAnimationFrame(O);
  }, [s, l, q, d]), Y(() => {
    if (s || t || !H.current) return;
    const O = requestAnimationFrame(() => {
      const B = A.current;
      if (!H.current || !B || B.disabled) return;
      H.current = !1;
      const oe = document.activeElement;
      (!oe || oe === document.body) && B.focus();
    });
    return () => cancelAnimationFrame(O);
  }, [s, t]), Y(() => {
    if (!s || Ie.targetMode !== "selected") return;
    const O = new AbortController();
    return Z([]), Ph(Ie.performerIds.slice(0, Qs), O.signal).then((B) => {
      O.signal.aborted || Z(B);
    }).catch(() => {
    }), () => O.abort();
  }, [s, Ie.targetMode, JSON.stringify(Ie.performerIds)]), Y(
    () => () => {
      var O;
      se.current = !0, (O = pe.current) == null || O.abort();
    },
    []
  ), Y(() => {
    if (!q) return;
    const O = (B) => {
      B.preventDefault(), B.returnValue = "";
    };
    return window.addEventListener("beforeunload", O), () => window.removeEventListener("beforeunload", O);
  }, [q]);
  function In() {
    f("answers"), T(!0), p(null), m({}), U(null), w(!1), N([]), ie(""), M(""), x(!1), I(null);
  }
  function ct() {
    we.current || (c(!1), Fe.current.onClose(G.current), G.current = !1, In(), H.current = !0);
  }
  function Me(O, B) {
    N(
      (oe) => B ? [...oe, O] : oe.filter((Ee) => Ee !== O)
    ), p(null), m({}), ie(""), M(""), x(!1), I(null);
  }
  function on() {
    f("answers"), I(null), ie("");
  }
  function lt() {
    f("preview"), d || ln();
  }
  function sn() {
    var O;
    se.current = !0, (O = pe.current) == null || O.abort(), ie("Stopping after in-flight operations settle…");
  }
  function _t(O) {
    I(
      (B) => (B == null ? void 0 : B.group) === O.group && B.reason === O.reason ? null : O
    );
  }
  const cn = (O, B) => (z == null ? void 0 : z.group) === O && z.reason === B;
  async function ln() {
    if (!qt.length || we.current) return;
    we.current = !0, P(!0), M(""), x(!1), ie("Loading all matching occurrences…"), p(null), m({}), I(null);
    const O = new AbortController();
    pe.current = O;
    try {
      const B = await Ih(
        e,
        qt,
        O.signal,
        (Ee) => ie(`Loaded ${Ee.toLocaleString()} matching occurrences…`)
      );
      O.signal.throwIfAborted();
      const oe = {};
      for (const Ee of B.entries)
        for (const Ae of Ee.before.applications ?? [])
          oe[Ae.tag.id] = Ae.tag;
      m(oe), p(B), ie("Preview ready. No tags have been changed.");
    } catch (B) {
      M(
        O.signal.aborted ? "Preview cancelled. No tags were changed." : B instanceof Error ? B.message : String(B)
      ), x(!O.signal.aborted && B instanceof Kl), ie("");
    } finally {
      we.current = !1, P(!1), pe.current = null;
    }
  }
  async function yn(O) {
    if (!d || we.current) return;
    const B = (O === "undo" ? zl(d) : Gl(d, O === "retry")).length;
    we.current = !0, se.current = !1, G.current = !0, P(!0), f("run"), M(""), U({ kind: O, total: B, done: 0, stopped: !1 }), ie(
      O === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    let oe = Date.now(), Ee = !0;
    const Ae = () => {
      U((Q) => Q && { ...Q, done: Q.done + 1 }), Ee && Date.now() - oe > 3e3 && (Ee = Hs(d), oe = Date.now());
    };
    let Le = !1;
    try {
      O === "undo" ? await Rh(d, () => se.current, Ae) : await $h(d, v, () => se.current, Ae, O === "retry");
      const { counts: Q } = tc(d.entries), et = Q.skipped + Q.failed;
      ie(
        se.current ? "Stopped after in-flight operations settled. Completed changes are retained." : O === "undo" ? `Batch undo finished.${Q.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${Q.changed.toLocaleString()} changed`,
          Q.unchanged && `${Q.unchanged.toLocaleString()} unchanged`,
          Q.skipped && `${Q.skipped.toLocaleString()} skipped`,
          Q.failed && `${Q.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${et ? " Inspect them below." : ""}`
      );
    } catch (Q) {
      Le = !0, ie(""), M(Q instanceof Error ? Q.message : String(Q));
    } finally {
      T(Hs(d)), we.current = !1;
      const Q = se.current || Le;
      U((et) => et && { ...et, stopped: Q }), P(!1), J((et) => et + 1);
    }
  }
  const ot = (d == null ? void 0 : d.entries) ?? [], lr = ye(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((O) => [
        O.item.key,
        Co(O.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Kn = (O) => lr.get(O.item.key), be = (O) => cr(O.before.ids, Kn(O).desired), Gt = (O) => {
    const B = be(O);
    return O.status === "pending" && (B.added.length > 0 || B.removed.length > 0);
  }, Bn = (O) => O.conflict || Kn(O).kept.length > 0 || Kn(O).replaced.length > 0, dn = ye(() => {
    const O = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: O.filter(Gt).length,
      correct: O.filter((B) => B.status === "unchanged").length,
      different: O.filter(Bn).length,
      hosts: new Set(O.map((B) => B.item.media.id)).size,
      added: [...new Set(O.flatMap((B) => be(B).added))],
      removed: [...new Set(O.flatMap((B) => be(B).removed))]
    };
  }, [lr]), Tn = ye(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((O) => O.item.media.date).sort((O, B) => O.item.media.date.localeCompare(B.item.media.date)),
    [d]
  ), Ve = mt ? tc(ot) : null, Xt = (O) => at.keys[ze.actions.findIndex((B) => B.id === O)] ?? "", ue = (O) => Hr(O, Un, [], r), K = Pa(Ie.condition) && Ie.includeSubtags !== !1 && Ie.conditionTagIds.length > 0, Ne = Tn[0], xe = Tn.length > 1 ? Tn[Tn.length - 1] : void 0, $n = (O) => `/${Re}/${O.item.media.id}`, le = Ke ? ee[0] : void 0, Xn = ye(
    () => n ? bl(
      n,
      gn.summary ? ts(
        hs(gn.summary, ze.actions, r ?? mi)
      ) : []
    ) : [],
    [n, gn.summary, ze.actions, r]
  ), wn = hf(qt, Xn, r ?? mi), Cr = n ?? [], Rn = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: Gt },
    correct: { title: "Occurrences already correct", test: (O) => O.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Bn }
  };
  function jt() {
    const O = Lh[Ie.condition], B = !!O && Ie.conditionTagIds.length > 0, oe = Ie.performerIds.slice(0, Qs), Ee = String(ze.view.filter.q ?? "").trim(), Ae = Ie.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ro(Ie) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : Ie.targetMode === "selected" ? /* @__PURE__ */ u(de, { children: [
        oe.map((Le, Q) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(da, { performer: { id: Le, name: ee[Q] ?? "" } }),
          ee[Q] ?? "…"
        ] }, Le)),
        Ie.performerIds.length > oe.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (Ie.performerIds.length - oe.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(de, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              xa,
              {
                filter: {},
                objectFilter: Ie.performerFilter,
                criteriaDefinitions: Ri,
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
        B ? O : Fi[Ie.condition],
        B && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Br(Ie.conditionTagIds.map(Te)).map((Le) => /* @__PURE__ */ a(mn, { tag: Le }, Le.id)) })
      ] }),
      B && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: Ie.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Pa(Ie.condition) && Ie.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: Ae, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          Ae
        ] })
      ] }),
      Ee && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ee,
        "”"
      ] }),
      Object.keys(ze.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Cn} filters`,
          children: /* @__PURE__ */ a(
            xa,
            {
              filter: ze.view.filter,
              objectFilter: Tt,
              criteriaDefinitions: Re === "audio" ? wc : Io,
              customFieldEntityType: Re,
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
  function un(O, B, oe = !0) {
    if (!O.length) return null;
    const Ee = /* @__PURE__ */ a("strong", { children: le || "This performer" }), Ae = oe ? `Check the earliest and latest ${Yt.many} before applying, or narrow the batch with a date filter.` : "", Le = O.every((Q) => Q.tagIds === null && !Q.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Le ? /* @__PURE__ */ u("p", { children: [
          Ee,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: O.flatMap((Q) => Q.flags).join(", ") }),
          ".",
          " ",
          Ae
        ] }) : /* @__PURE__ */ u(de, { children: [
          /* @__PURE__ */ u("p", { children: [
            Ee,
            " needs attention where the chosen answers apply.",
            Ae && ` ${Ae}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: O.map((Q) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Q.tagIds === null ? "Whole review" : Q.name }),
            ":",
            " ",
            ns(Q).join("; ")
          ] }, Q.key)) })
        ] }),
        B && Ne && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: $n(Ne), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            Ma(Ne, Re),
            " · ",
            Ne.item.media.date
          ] }),
          xe && /* @__PURE__ */ u("a", { href: $n(xe), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            Ma(xe, Re),
            " · ",
            xe.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Pe() {
    const O = wn.filter((oe) => oe.tagIds === null), B = wn.filter((oe) => oe.tagIds !== null);
    return /* @__PURE__ */ u(de, { children: [
      jt(),
      un(O, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${Ke ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: gt.map((oe, Ee) => {
            const Ae = Xt(oe.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(oe.id),
                  "aria-labelledby": `${ge}-answer-${Ee}`,
                  "aria-describedby": `${ge}-effect-${Ee}`,
                  onChange: (Le) => Me(oe.id, Le.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: Ae && /* @__PURE__ */ a(Lt, { binding: Ae, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ge}-answer-${Ee}`,
                    className: "dq-batch-answer-label",
                    title: oe.label,
                    children: oe.label
                  }
                ),
                /* @__PURE__ */ a(Xs, { id: `${ge}-effect-${Ee}`, parts: ue(oe) })
              ] })
            ] }, oe.id);
          }) })
        ] }),
        Ke && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: un(B, !1, O.length === 0) }),
          /* @__PURE__ */ a(
            ki,
            {
              ...gn,
              mediaKind: Re,
              actions: ze.actions,
              trees: r,
              flags: Cr,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function it(O) {
    const B = dn, oe = z && Ws.has(z.group) ? z.group : null, Ee = oe ? ot.filter(Rn[oe].test) : [], Ae = (Le) => {
      const Q = Kn(Le), et = Q.skipped ? cr(
        Le.before.ids,
        Co(Le.before.ids, O.action, O.categories, !0).desired
      ) : be(Le), fn = !et.added.length && !et.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Q.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        fn ? !Q.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(Zs, { added: et.added, removed: et.removed, tag: Te }),
        Q.kept.map((qe, We) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Br(qe.existing.map(Te)).map((De) => /* @__PURE__ */ a(mn, { tag: De }, De.id)),
          " ",
          "instead of",
          " ",
          Br(qe.tagIds.map(Te)).map((De) => /* @__PURE__ */ a(mn, { tag: De }, De.id))
        ] }, We))
      ] });
    };
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            Oa,
            {
              value: ot.length,
              label: ot.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${B.hosts.toLocaleString()} ${B.hosts === 1 ? Cn : `${Cn}s`}`,
              pressed: cn("matching"),
              onToggle: () => _t({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            Oa,
            {
              value: B.willChange,
              label: "will change",
              tone: "add",
              pressed: cn("change"),
              onToggle: () => _t({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            Oa,
            {
              value: B.correct,
              label: "already correct, no write",
              pressed: cn("correct"),
              onToggle: () => _t({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            Oa,
            {
              value: B.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: cn("different"),
              onToggle: () => _t({ group: "different" })
            }
          )
        ] }),
        Ee.length > 0 ? /* @__PURE__ */ a(
          ec,
          {
            title: Rn[oe].title,
            entries: Ee,
            mediaKind: Re,
            resultHeading: "Planned change",
            describe: Ae
          }
        ) : ot.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        ot.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: Ne ? `Dates ${Ne.item.media.date}${xe ? ` to ${xe.item.media.date}` : ""}` : "No dates" }),
          Ne && /* @__PURE__ */ a(
            "a",
            {
              href: $n(Ne),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Yt.one}, ${Ne.item.media.date}`,
              title: Ma(Ne, Re),
              children: "Open earliest"
            }
          ),
          xe && /* @__PURE__ */ a(
            "a",
            {
              href: $n(xe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Yt.one}, ${xe.item.media.date}`,
              title: Ma(xe, Re),
              children: "Open latest"
            }
          ),
          Tn.length < ot.length && /* @__PURE__ */ u("span", { children: [
            (ot.length - Tn.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (B.added.length > 0 || B.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            Zs,
            {
              added: B.added,
              removed: B.removed,
              tag: Te,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      B.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${ge}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ u(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ge}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !v, onClick: () => w(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": v, onClick: () => w(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ u("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          K ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Zt() {
    return /* @__PURE__ */ u(de, { children: [
      jt(),
      un(wn, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${Ke ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ge}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ge}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: q, onClick: on, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: qt.map((O) => {
            const B = Xt(O.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                B && /* @__PURE__ */ a(Lt, { binding: B, hidden: !0 }),
                O.label
              ] }),
              /* @__PURE__ */ a(Xs, { parts: ue(O) })
            ] }, O.id);
          }) })
        ] }),
        Ke && /* @__PURE__ */ a(
          ki,
          {
            ...gn,
            mediaKind: Re,
            actions: ze.actions,
            trees: r,
            flags: Cr,
            className: "dq-batch-card"
          }
        )
      ] }),
      q ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && it(d)
    ] });
  }
  function Zn(O) {
    const B = W ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, oe = B.kind === "apply" ? ot.length - O.counts.pending : B.done, Ee = B.kind === "apply" ? ot.length : B.total, Ae = q ? B.kind === "undo" ? "Undoing batch…" : B.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : B.kind === "undo" ? B.stopped ? "Undo stopped" : "Undo finished" : B.stopped ? "Stopped" : "Finished", Le = Ee ? Math.round(oe / Ee * 100) : 100, Q = z && !Ws.has(z.group) ? z.group : null, et = (qe) => Ys.find((We) => We.status === qe).label, fn = Q ? ot.filter(
      (qe) => qe.status === Q && (!z.reason || qe.error === z.reason)
    ) : [];
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: Ae }),
          /* @__PURE__ */ u("span", { children: [
            oe.toLocaleString(),
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
            "aria-valuenow": oe,
            children: /* @__PURE__ */ a("span", { style: { width: `${Le}%` } })
          }
        ),
        !q && B.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (B.total - O.recorded).toLocaleString(),
          " of",
          " ",
          B.total.toLocaleString(),
          " ",
          B.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: Ys.map((qe) => /* @__PURE__ */ a(
          Oa,
          {
            value: O.counts[qe.status],
            label: B.kind === "undo" && qe.status === "unchanged" ? "As before" : qe.label,
            tone: qe.tone,
            pressed: cn(qe.status),
            onToggle: () => _t({ group: qe.status })
          },
          qe.status
        )) }),
        O.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: O.reasons.map((qe) => {
          const We = cn(qe.status, qe.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              qe.count.toLocaleString(),
              " ",
              qe.status,
              ": ",
              qe.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": We,
                onClick: () => _t({ group: qe.status, reason: qe.error }),
                children: We ? "Hide them" : "Show them"
              }
            )
          ] }, `${qe.status}-${qe.error}`);
        }) }),
        fn.length > 0 ? /* @__PURE__ */ a(
          ec,
          {
            title: z.reason ? `${et(Q)}: ${z.reason}` : `${et(Q)} occurrences`,
            entries: fn,
            mediaKind: Re,
            resultHeading: "Result",
            describe: (qe) => qe.error ?? et(qe.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      O.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: q,
            onClick: () => void yn("undo"),
            children: [
              /* @__PURE__ */ a(Ua, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          Se ? B.stopped || q ? `${O.recorded.toLocaleString()} ${O.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${O.recorded.toLocaleString()} ${O.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${O.recorded === 1 ? "this change" : `these ${O.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          ce ? "After you close this dialog or start a new batch, undo it from Recent changes." : "Recent changes could not keep this batch in this browser's storage (a very large batch does not fit), so its undo lasts only until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Gn() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !qt.length,
        onClick: lt,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? q ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: sn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !dn.willChange,
        onClick: () => void yn("apply"),
        children: [
          "Apply to ",
          dn.willChange.toLocaleString(),
          " ",
          dn.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: on, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void ln(),
        children: "Preview again"
      },
      "again"
    ) : q ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: sn, children: Se ? "Cancel undo" : "Cancel run" }, "cancel-run") : Se || !Ve ? null : /* @__PURE__ */ u($i, { children: [
      Ve.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void yn("retry"), children: "Retry failed" }),
      Ve.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void yn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(ih, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: A,
        title: gt.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !gt.length,
        onClick: () => {
          In(), o(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(qs, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: j,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ge}-title`,
        "aria-modal": "true",
        onCancel: (O) => {
          O.preventDefault(), ct();
        },
        onClose: () => {
          var O;
          we.current ? (O = j.current) == null || O.showModal() : ct();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(qs, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ge}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: q,
                onClick: ct,
                children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Dh, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: R,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Ei.find((O) => O.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  D && /* @__PURE__ */ a("p", { role: "status", children: D }),
                  L && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: L })
                ] }),
                l === "answers" ? Pe() : l === "preview" ? Zt() : Zn(Ve)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: q, onClick: on, children: [
              /* @__PURE__ */ a(Ga, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: q, onClick: In, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: q, onClick: ct, children: "Close" }),
            Gn()
          ] })
        ]
      }
    )
  ] });
}
const Hl = "data-quality.description-collapsed.v1";
function jh() {
  try {
    return localStorage.getItem(Hl) === "true";
  } catch {
    return !1;
  }
}
function Uh({
  details: e,
  label: t
}) {
  const [n, r] = C(jh), o = _n(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(Hl, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Id, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Kh = (e) => "";
function Bh({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = Kh,
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
          children: /* @__PURE__ */ a(Kd, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: d.map((m) => {
      const y = `${m.count.toLocaleString()} matching ${m.count === 1 ? i.one : i.many}`, N = s(m.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === m.id ? "true" : void 0,
          disabled: o,
          onClick: () => c(m.id),
          children: [
            /* @__PURE__ */ a(da, { performer: m }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m.name }),
            N && /* @__PURE__ */ a(or, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
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
const Gh = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], zh = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Vh(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function lo(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Jh(e, t) {
  const n = Ro(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${lo(r, "or")}`,
    includesAll: `has ${lo(r, "and")}`,
    excludes: `has none of ${lo(r, "or")}`,
    excludesAll: `missing ${lo(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function Hh({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = C(!1), [c, l] = C(null), f = $(null), d = $(null), p = ut(), h = Jr(e.conditionTagIds), m = Jh(e, h);
  Dt(() => {
    const w = f.current;
    if (!i || !w) return;
    const q = () => l(Vh(w));
    q(), window.addEventListener("resize", q);
    const P = typeof ResizeObserver > "u" ? null : new ResizeObserver(q), L = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const M of L) M && (P == null || P.observe(M));
    return () => {
      window.removeEventListener("resize", q), P == null || P.disconnect();
    };
  }, [i]), Y(() => {
    var q, P;
    if (!i) return;
    const w = (q = d.current) == null ? void 0 : q.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (P = d.current) == null || P.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || An(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const P = [...d.current.querySelectorAll(zh)].filter((x) => x.closest('[role="dialog"]') === d.current).sort(
          (x, D) => x.compareDocumentPosition(D) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!P.length) return;
        const L = P[0], M = P[P.length - 1], k = document.activeElement;
        w.shiftKey && (k === L || k === d.current) ? (w.preventDefault(), M.focus()) : !w.shiftKey && k === M && (w.preventDefault(), L.focus());
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
        title: m,
        onClick: () => i ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Ac, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: m }),
          /* @__PURE__ */ a(Oi, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ u(de, { children: [
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Gh.map(({ mode: w, label: q }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: q
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                kr,
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
                  xa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ri,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(pa, { "aria-hidden": "true" }),
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
                  children: xi.map((w) => /* @__PURE__ */ a("option", { value: w, children: Fi[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(de, { children: [
                /* @__PURE__ */ a(
                  kr,
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
                  Pa(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function bo(e) {
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
function Qh(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Ue(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wh(e, t) {
  const n = Ue(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Au(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await he(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            sr({
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
const Yh = 3e3, nc = 250;
async function Xh(e, t, n, r) {
  const o = xo(e, t);
  if (await Bi(o, o.view.filter, n) > Yh) return null;
  const { sorts: i, seed: s, ...c } = e.view.filter, l = {
    ...e,
    view: {
      ...e.view,
      // Cove breaks ties in creation time by id, so pages neither overlap nor shift under a write.
      filter: { ...c, perPage: nc, sort: "created_at", direction: "asc" }
    }
  }, f = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    n.throwIfAborted();
    const p = await Hi(l, t, d, n);
    for (const h of p.items)
      f.set(h.performer.id, (f.get(h.performer.id) ?? 0) + 1);
    if (r(f), d * nc >= p.totalCount) return f;
  }
}
function Ql(e, t, n) {
  const r = xo(e, [t]);
  return Bi(r, r.view.filter, n);
}
function Wl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Ai(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function Zh(e, t, n, r, o = {}) {
  const i = bo(e), s = Qh(e), c = al(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Wh(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = l;
  if (l.cursor === 0 && !l.ranked.length && f.length > 1) {
    const y = new Map(f.map((w) => [w.id, w])), N = (w) => [...w].flatMap(([q, P]) => {
      const L = y.get(q);
      return L && P > 0 ? [{ ...L, count: P }] : [];
    }).sort((q, P) => P.count - q.count || q.name.localeCompare(P.name)), v = await Xh(
      e,
      Ro(e.occurrence) ? null : f.map((w) => w.id),
      r,
      (w) => {
        var q;
        return (q = o.onProgress) == null ? void 0 : q.call(o, { ...l, ranked: N(w), limit: n, complete: !1, partial: !0 });
      }
    ).catch(() => (r.throwIfAborted(), null));
    if (v)
      return { ...l, cursor: f.length, ranked: N(v), limit: n, complete: !0 };
  }
  const d = [...l.ranked];
  let p = l.cursor, h = !1;
  const m = (y) => ({
    ...l,
    cursor: p,
    ranked: [...d],
    limit: n,
    complete: !y && Ai(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !Ai(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await Ql(e, N.id, r);
          v > 0 && Wl(d, { ...N, count: v }), (y = o.onProgress) == null || y.call(o, m(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), m(!1);
}
function ep(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && Wl(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: Ai(e.candidates, e.cursor, o, e.limit)
  };
}
const Ci = /* @__PURE__ */ new Map();
function tp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Yl(e, t) {
  const n = tp(t);
  return Ci.set(e, n), n;
}
function np(e) {
  const [t, n] = C(null);
  if (Y(() => {
    if (e === null || Ci.has(e)) return;
    const r = new AbortController();
    return he(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = Yl(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Ci.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var ti = { exports: {} }, rc;
function rp() {
  return rc || (rc = 1, (function(e) {
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
            var m = f.charCodeAt(p);
            d[p * 2] = m >>> 8, d[p * 2 + 1] = m % 256;
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
          return f.forEach(function(m) {
            h.push(n(m));
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
          var p, h, m = {}, y = {}, N = "", v = "", w = "", q = 2, P = 3, L = 2, M = [], k = 0, x = 0, D;
          for (D = 0; D < l.length; D += 1)
            if (N = l.charAt(D), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = P++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < L; p++)
                    k = k << 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < L; p++)
                    k = k << 1 | h, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
                }
                q--, q == 0 && (q = Math.pow(2, L), L++), delete y[w];
              } else
                for (h = m[w], p = 0; p < L; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              q--, q == 0 && (q = Math.pow(2, L), L++), m[v] = P++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < L; p++)
                  k = k << 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < L; p++)
                  k = k << 1 | h, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              }
              q--, q == 0 && (q = Math.pow(2, L), L++), delete y[w];
            } else
              for (h = m[w], p = 0; p < L; p++)
                k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
            q--, q == 0 && (q = Math.pow(2, L), L++);
          }
          for (h = 2, p = 0; p < L; p++)
            k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
          for (; ; )
            if (k = k << 1, x == f - 1) {
              M.push(d(k));
              break;
            } else x++;
          return M.join("");
        },
        decompress: function(l) {
          return l == null ? "" : l == "" ? null : c._decompress(l.length, 32768, function(f) {
            return l.charCodeAt(f);
          });
        },
        _decompress: function(l, f, d) {
          var p = [], h = 4, m = 4, y = 3, N = "", v = [], w, q, P, L, M, k, x, D = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (P = 0, M = Math.pow(2, 2), k = 1; k != M; )
            L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
          switch (P) {
            case 0:
              for (P = 0, M = Math.pow(2, 8), k = 1; k != M; )
                L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
              x = n(P);
              break;
            case 1:
              for (P = 0, M = Math.pow(2, 16), k = 1; k != M; )
                L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
              x = n(P);
              break;
            case 2:
              return "";
          }
          for (p[3] = x, q = x, v.push(x); ; ) {
            if (D.index > l)
              return "";
            for (P = 0, M = Math.pow(2, y), k = 1; k != M; )
              L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
            switch (x = P) {
              case 0:
                for (P = 0, M = Math.pow(2, 8), k = 1; k != M; )
                  L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
                p[m++] = n(P), x = m - 1, h--;
                break;
              case 1:
                for (P = 0, M = Math.pow(2, 16), k = 1; k != M; )
                  L = D.val & D.position, D.position >>= 1, D.position == 0 && (D.position = f, D.val = d(D.index++)), P |= (L > 0 ? 1 : 0) * k, k <<= 1;
                p[m++] = n(P), x = m - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), p[x])
              N = p[x];
            else if (x === m)
              N = q + q.charAt(0);
            else
              return null;
            v.push(N), p[m++] = q + N.charAt(0), h--, q = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(ti)), ti.exports;
}
var Xl = rp();
function Er(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => Er(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && Er(n[s], r[s])
  );
}
function ap(e) {
  var c, l, f;
  const [t, n] = C({}), [r, o] = C(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return Y(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await Fo([p])]
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
function Zl(e, t, n) {
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
function op(e, t, n) {
  var s;
  const r = Zl(e, t, n), o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [];
  return {
    performers: i.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: i.includes("tags") && ((s = o == null ? void 0 : o.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function ip({
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
  ), l = s.every((v) => r[v]), f = Qr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!l || c.has(v))
  ), d = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (c.has(w.id)) {
        const q = d.get(w.id) ?? { name: w.name, count: 0 };
        q.count++, d.set(w.id, q);
      }
  const p = f.filter((v) => !d.has(v)), h = Jr(p);
  for (const v of p)
    d.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const m = [...d].sort((v, w) => v[1].name.localeCompare(w[1].name));
  return /* @__PURE__ */ u("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    m.map(([v, w]) => {
      const q = f.includes(v);
      return /* @__PURE__ */ u(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": q,
          title: q ? `Show every video again, not only ${w.name}` : `Show only videos tagged ${w.name}`,
          disabled: o,
          onClick: () => i(v),
          children: [
            q && /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
            w.name,
            " ",
            /* @__PURE__ */ a("span", { className: "dq-bin-count", children: w.count })
          ]
        },
        v
      );
    }),
    !m.length && /* @__PURE__ */ a("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function sp({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: o,
  countsPaused: i,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Qr(e.view.objectFilter, t, c).bins, f = cp(e, t, n, i);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const m of c) {
    const y = ((h = m.group) == null ? void 0 : h.trim()) ?? "";
    d.set(y, [...d.get(y) ?? [], m]);
  }
  return /* @__PURE__ */ a(de, { children: [...d].map(([m, y]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": m ? `${m} bins` : "Filter bins",
      children: [
        m && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: m }),
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
                v && /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
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
    m
  )) });
}
function cp(e, t, n, r) {
  var d;
  const [o, i] = C({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = $(null);
  return Y(() => {
    var y, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), m = Qr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (p++, Bi(td(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || i((q) => ({ ...q, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [l, r]), o;
}
function Ur(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function lp(e) {
  if (!Ur(e) || Object.keys(e).length !== 1 || !Ur(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Ur(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function ed(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function dp(e, t) {
  const n = t.find(
    (r) => Er(e, ed(r.filter))
  );
  return n ? n.key : lp(e);
}
function Qr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && Er(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Ur(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = dp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, m] of c.slice(0, -1).entries())
      !Ur(m) || Object.keys(m).length !== 1 ? p = !1 : h === 0 && Ur(m.filter) && Object.keys(m.filter).length ? f = m.filter : !d && Ur(m.group) ? d = m.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function td(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = Qr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((m) => m.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (i.includes(t) ? i.filter((d) => d !== t) : [...i.filter((d) => !c || s(d) !== c), t]).reduce(up, { ...e, view: { ...e.view, objectFilter: o } });
}
function up(e, t) {
  var i, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (i = e.presentation) == null ? void 0 : i.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = ed(c.filter);
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
const Lo = [
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
], fp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Vr(e) {
  const t = $e(e) ? e.occurrence : void 0;
  return {
    filter: Qt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Ue(e)),
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
function ac(e) {
  return Xl.compressToEncodedURIComponent(JSON.stringify(e));
}
function oc(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : Xl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function Ii(e, t) {
  let n;
  if ($e(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Lo.some((c) => c !== "performer" && t.has(c))) {
    const c = Vr(e);
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
  if ($e(e) && (i = {
    ...fp,
    ...oc(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !xi.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Qt(o, Ue(e)),
      objectFilter: oc(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const ic = { dataQualityOpenedFromList: !0 };
function nd() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function rd(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...ic }, "", e) : window.history.replaceState(nd() ? { ...ic } : null, "", e);
}
function ha(e, t) {
  const n = new URLSearchParams(window.location.search);
  Lo.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", ac(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", ac(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), rd(`${window.location.pathname}?${n}${window.location.hash}`);
}
function jn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return $e(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Gr(e) {
  const t = e;
  return jn(t, Vr(t));
}
function sc(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !Er(
    JSON.parse(vr(jn(e, t))),
    JSON.parse(vr(jn(e, Vr(e))))
  );
}
function ps(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Ge(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function ad(e, t) {
  if (Ge(e) !== "video") return e;
  const { base: n, bins: r } = Qr(
    e.view.objectFilter,
    t.view.objectFilter,
    ps(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function uo(e, t) {
  if (Ge(e) !== "video") return t;
  const { base: n, bins: r } = Qr(
    t.objectFilter,
    e.view.objectFilter,
    ps(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function ni(e, t) {
  return !t || !$e(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function fo(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const pn = (e) => e instanceof Error ? e.message : "Request failed.", hp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, ri = 50, pp = [], cc = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function mp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Rd(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? qc(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function gp({ media: e, kind: t }) {
  const [n, r] = C(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ic, {}) : /* @__PURE__ */ a($o, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: li(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function bp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: o,
  actionTagIds: i,
  label: s
}) {
  const c = !!n && !r, l = is(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ha(
    ye(() => [...i, ...d ?? []], [i, d])
  ), h = (W) => p[W] ?? { id: W, name: p[W] === void 0 ? "…" : "Unavailable tag" }, m = (W) => Br(W.map(h)), y = f && e ? es(f, e, o) : null, N = e ? of(e) : [], v = new Set(N.map((W) => W.id)), w = new Set(y == null ? void 0 : y.removed), q = new Set(y == null ? void 0 : y.markedAbsent), P = new Set(y == null ? void 0 : y.absenceCleared), L = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(yo, { "aria-hidden": "true" }),
    "absent"
  ] }), M = m((y == null ? void 0 : y.added) ?? []), k = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((W) => !v.has(W))), x = n ? "h3" : "h4", D = !!(e != null && e.absent.length) && /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a(x, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((W) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${P.has(W.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(yo, { "aria-hidden": "true" }),
          P.has(W.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(mn, { tag: W })
          ] }) : /* @__PURE__ */ a(mn, { tag: W })
        ]
      },
      W.id
    )) })
  ] }), ie = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(de, { children: [
      N.length || M.length || k.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (W) => w.has(W.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(mn, { tag: W })
            ] }),
            q.has(W.id) && L
          ] }, W.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(mn, { tag: W }) }, W.id)
        ),
        M.map((W) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(mn, { tag: W })
        ] }) }, `added-${W.id}`)),
        k.map((W) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(mn, { tag: W }) }),
          L
        ] }, `absent-${W.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && D
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(de, { children: [
    !c && ie,
    n,
    n && D && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: D })
  ] });
}
function yp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    ns(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function wp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: i = 0,
  onEditRequestHandled: s,
  undoRevision: c = 0,
  undoneKeys: l = [],
  pageControls: f,
  stayOnTap: d,
  onStayOnTapChange: p
}) {
  var He;
  const h = Ue(e), m = Yn(h), y = (g) => ji(g, h), N = (g) => `${g.occurrence ? `${g.occurrence.performer.name} — ` : ""}${y(g.media)}`, v = $(null), w = $("");
  if (!v.current)
    try {
      v.current = Ii(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (g) {
      w.current = pn(g), v.current = { query: Vr(e), startAtEnd: !1 };
    }
  const [q, P] = C(null), [L, M] = C(""), k = $(null), x = $(null), D = $(null), ie = $(null), [W, U] = C(!!w.current), ce = $(0), [T, z] = C(v.current.query), I = $(T);
  I.current = T;
  const [ee, Z] = C(0), me = $(v.current.startAtEnd), [J, j] = C([]), [R, A] = C(null), H = $(null), [se, pe] = C(null), [G, we] = C(0), Fe = ye(() => {
    var te;
    if (!R) return null;
    const g = J.findIndex((ne) => ne.key === R.key), E = ((te = H.current) == null ? void 0 : te.key) === R.key ? H.current : null;
    return (g >= 0 ? J.slice(g + 1) : E ? J.filter((ne) => !E.before.includes(ne.key)) : []).find((ne) => ne.media.id !== R.media.id) ?? null;
  }, [R, J]), [ge, mt] = C(0), [Se, ze] = C(!1), [at, Ie] = C(!1), Re = $(!1), Yt = $(0), Cn = $(null);
  function gt() {
    var g;
    Yt.current++, (g = Cn.current) == null || g.abort(), Cn.current = null;
  }
  function qt() {
    const g = new AbortController();
    return Cn.current = g, g.signal;
  }
  const Ke = $(!1), gn = $(null), bn = $(!0), bt = $(null);
  Y(() => (bn.current = !0, () => {
    var g;
    bn.current = !1, (g = Cn.current) == null || g.abort();
  }), []);
  const [Un, Te] = C(w.current), [an, Tt] = C(""), [In, ct] = C(""), [Me, on] = C(null), [lt, sn] = C(!1), [_t, cn] = C([]), ln = $([]), yn = $(null), ot = $(null), lr = $(null);
  Y(() => {
    var g, E;
    lt && ((E = (g = lr.current) == null ? void 0 : g.querySelector("input")) == null || E.focus());
  }, [lt]);
  const Kn = $(null);
  Y(() => {
    if (at) return;
    const g = Kn.current;
    Kn.current = null;
    const E = document.activeElement;
    g != null && g.isConnected && (!E || E === document.body) && g.focus();
  }, [at]);
  const [be, Gt] = C(!1), [Bn, dn] = C(!1), Tn = Qa(), [Ve, Xt] = C(!1), ue = d ?? Ve, K = p ?? Xt;
  Y(() => {
    if (Se || be || !ot.current) return;
    const g = requestAnimationFrame(() => {
      if (document.querySelector(cc)) return;
      const E = ot.current;
      ot.current = null;
      const _ = document.activeElement;
      _ && _ !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(g);
  }, [Se, be, ee]);
  const [Ne, xe] = C([]), [$n, le] = C({}), Xn = $(null), [wn, Cr] = C({});
  Y(() => {
    let g = !0;
    return Promise.all(
      us(T.objectFilter).map(
        async (E) => [
          String(E),
          (await he(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      g && Cr(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [T.objectFilter]);
  const Rn = ye(
    () => fs(T.objectFilter, wn),
    [wn, T.objectFilter]
  ), jt = $(0), un = $(e);
  un.current = e;
  const Pe = q ?? e, it = ye(
    () => jn(Pe, T),
    [Pe, T]
  ), Zt = ye(
    () => ni(it, T.performerFocus),
    [it, T.performerFocus]
  ), Zn = $(Zt);
  Zn.current = Zt;
  const Gn = $(it);
  Gn.current = it;
  const [O, B] = C("items"), [oe, Ee] = C(null), Ae = $(null), Le = $("");
  function Q(g) {
    const E = typeof g == "function" ? g(Ae.current) : g;
    Ae.current = E, Ee(E);
  }
  const [et, fn] = C(!1), [qe, We] = C(null), De = $(null), vn = $e(it) ? bo(it) : "", [Do, ke] = C(0), [zt, tt] = C(null);
  Y(() => () => {
    var g;
    return (g = De.current) == null ? void 0 : g.controller.abort();
  }, []), Y(() => {
    const g = De.current;
    !g || g.signature === vn || (g.controller.abort(), De.current = null, fn(!1));
  }, [vn]), Y(() => {
    var _;
    const g = Ae.current;
    if (O !== "performers" || !vn || ((_ = De.current) == null ? void 0 : _.signature) === vn || Le.current === vn || (g == null ? void 0 : g.signature) === vn && g.complete)
      return;
    const E = (g == null ? void 0 : g.signature) === vn ? g : null;
    Rr(g, (E == null ? void 0 : E.limit) ?? ri);
  }, [O, vn, oe, qe, et]);
  const On = T.performerFocus;
  Y(() => {
    if (!On) {
      tt(null);
      return;
    }
    let g = !0;
    return he(`/api/performers/${On}`).then((E) => {
      const _ = Yl(On, E.tags);
      g && tt({ id: On, name: E.name, tags: _ });
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [On]);
  const er = JSON.stringify(
    $e(it) ? Oc(it.occurrence) : []
  ), en = ye(() => JSON.parse(er), [er]), ya = ye(() => df(en), [en]), wa = hl(ya), Vt = Ha(ya), Nn = (g) => {
    var E;
    return ((E = Vt[g]) == null ? void 0 : E.name) ?? (Vt[g] === null ? "Unavailable tag" : "…");
  }, Ir = (g) => ({
    name: Nn(g),
    tagIds: wa.get(g) ?? [g],
    resolved: wa.has(g)
  }), Mn = Jl(
    $e(it) ? it : null,
    On ?? null,
    Do
  ), Wr = sc(e, T), $t = sc(e, uo(e, T)), Ye = at || Se || lt, yt = Number(T.filter.page);
  function Xe(g, E = !1) {
    Re.current || (gt(), Tt(""), w.current = "", me.current = E, I.current = g, z(g), mt(0), ze(!0), E || ha(e.id, g), Z((_) => _ + 1));
  }
  function tn() {
    if (Re.current = !1, Ie(!1), bn.current && bt.current) {
      const g = bt.current;
      bt.current = null, Xe(g.query, g.startAtEnd);
    }
  }
  Y(() => {
    const g = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = Ii(
            un.current,
            new URLSearchParams(window.location.search)
          );
          Re.current ? bt.current = E : Xe(E.query, E.startAtEnd);
        } catch (E) {
          Te(pn(E));
        }
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, [e.id]), Y(() => (r(at || Se || lt || !!q), () => r(!1)), [at, Se, lt, !!q, r]);
  async function Rt(g, E, _) {
    if ($e(g)) {
      const ne = await Hi(
        g,
        Xn.current,
        E,
        _
      );
      return {
        items: ne.items.map((fe) => ({
          key: fe.key,
          media: fe.media,
          occurrence: fe
        })),
        totalCount: ne.totalCount
      };
    }
    const te = await ca(
      g,
      { ...g.view.filter, page: E },
      _
    );
    return {
      items: te.items.map((ne) => ({ key: String(ne.id), media: ne })),
      totalCount: te.totalCount
    };
  }
  function dr(g, E, _, te = !1, ne = !1) {
    if (!bn.current || bt.current) return;
    U(!0), j(
      ne ? g.items : fo(g.items, I.current.startFrom === "end")
    ), mt(g.totalCount), Fn(_, te);
    const fe = {
      ...I.current,
      filter: { ...I.current.filter, page: E }
    };
    I.current = fe, z(fe), ha(e.id, fe);
  }
  function Fn(g, E = !1) {
    gt(), (g == null ? void 0 : g.key) !== (R == null ? void 0 : R.key) && (H.current = null), (g == null ? void 0 : g.media.id) !== (R == null ? void 0 : R.media.id) && pe(E && g ? g.media.id : null), A(g);
  }
  Y(() => {
    if (w.current) return;
    const g = new AbortController();
    ie.current = g;
    const E = ++jt.current;
    return ze(!0), Te(""), ct(""), H.current = null, pe(null), A(null), j([]), sn(!1), (async () => {
      const _ = ni(
        jn(un.current, I.current),
        I.current.performerFocus
      );
      Xn.current = $e(_) ? await Vi(_, g.signal) : null;
      let te = Number(_.view.filter.page), ne = await Rt(_, te, g.signal);
      const fe = Math.max(
        1,
        Math.ceil(ne.totalCount / Number(_.view.filter.perPage))
      );
      (me.current || te > fe) && (te = fe, ne = await Rt(_, te, g.signal)), me.current = !1;
      const ve = _.view.startFrom === "end" ? -1 : 1;
      for (; $e(_) && !ne.items.length && te + ve >= 1 && te + ve <= fe && !g.signal.aborted; )
        te += ve, ne = await Rt(_, te, g.signal);
      if (E !== jt.current || g.signal.aborted) return;
      const nt = fo(ne.items, _.view.startFrom === "end");
      dr(ne, te, nt[0] ?? null);
    })().catch((_) => {
      !g.signal.aborted && E === jt.current && Te(pn(_));
    }).finally(() => {
      !g.signal.aborted && E === jt.current && (U(!0), ze(!1));
    }), () => {
      g.abort(), jt.current++;
    };
  }, [ee, e.id]);
  const qn = $(null), Sn = $(0), Yr = $(c);
  Y(() => {
    const g = Yr.current !== c && (R == null ? void 0 : R.key) === qn.current;
    Yr.current = c;
    const E = (Me == null ? void 0 : Me.ids) ?? [];
    if ((R == null ? void 0 : R.key) !== qn.current && on(null), qn.current = (R == null ? void 0 : R.key) ?? null, !R) return;
    let _ = !0;
    const te = Sn.current;
    return Wt(h, R).then((ne) => {
      if (!_ || te !== Sn.current) return;
      on(ne);
      const fe = $e(e) ? e.occurrence.tagIds : [];
      if (!g)
        xe(ne.ids.filter((ve) => fe.includes(ve)));
      else {
        const ve = cr(E, ne.ids);
        xe((nt) => [
          ...nt.filter((Ot) => !ve.removed.includes(Ot)),
          ...ve.added.filter((Ot) => fe.includes(Ot) && !nt.includes(Ot))
        ]);
      }
    }).catch((ne) => {
      _ && Te(`Could not load current tags. ${pn(ne)}`);
    }), () => {
      _ = !1;
    };
  }, [R, c]);
  const Tr = $(c);
  Y(() => {
    Tr.current !== c && (Tr.current = c, ke((g) => g + 1), !Re.current && !Se && !lt && !q && Wa(l));
  }, [c]);
  async function Wa(g) {
    if (w.current) return;
    gt();
    const E = Yt.current, _ = qt(), te = jt.current, ne = () => Yt.current !== E || jt.current !== te, fe = R == null ? void 0 : R.key, ve = $e(e) && !e.actions.length ? e.occurrence.tagIds : [], nt = ((Me == null ? void 0 : Me.ids) ?? []).filter((Ce) => ve.includes(Ce)), Ot = ve.length > 0 && (Ne.length !== nt.length || Ne.some((Ce) => !nt.includes(Ce))), kt = ni(
      jn(un.current, I.current),
      I.current.performerFocus
    ), rn = (Ce) => fo(Ce.items, I.current.startFrom === "end"), Et = Number(I.current.filter.page), ft = (Ce, Jt) => {
      if (j(rn(Ce)), mt(Ce.totalCount), Jt === Et) return;
      const wt = { ...I.current, filter: { ...I.current.filter, page: Jt } };
      I.current = wt, z(wt), ha(e.id, wt);
    };
    try {
      const Ce = await Rt(kt, Et, _);
      if (ne()) return;
      const Jt = Math.max(1, Math.ceil(Ce.totalCount / Number(I.current.filter.perPage)));
      for (const wt of [Et, Et - 1, Et + 1]) {
        if (wt < 1 || wt > Jt || !g.length) continue;
        const Hn = wt === Et ? Ce : await Rt(kt, wt, _);
        if (ne()) return;
        const Qe = rn(Hn).find((At) => g.includes(At.key));
        if (!Qe) continue;
        const ht = N(Qe);
        if (Qe.key === fe) ft(Hn, wt);
        else if (fe && Ot) {
          ft(Ce, Et), ct(`Undone: ${ht} is back in the queue. Staying here to keep your unsaved choices.`);
          return;
        } else dr(Hn, wt, Qe);
        ct(`Undone: ${ht} is back in the queue.`);
        return;
      }
      if (!Ce.items.length) return;
      fe ? ft(Ce, Et) : dr(Ce, Et, rn(Ce)[0]);
    } catch (Ce) {
      ne() || Te(`Undone, but the queue could not be read again. ${pn(Ce)}`);
    }
  }
  Y(() => {
    if (!$e(e) || e.actions.length)
      return;
    let g = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (E) => [
          E,
          (await he(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      g && le(Object.fromEntries(E));
    }).catch((E) => {
      g && Te(pn(E));
    }), () => {
      g = !1;
    };
  }, [e]);
  function Oe(g, E = H.current) {
    const _ = J.findIndex((kt) => kt.key === g.key), te = T.startFrom === "end" ? -1 : 1, ne = (E == null ? void 0 : E.key) === g.key, fe = ne ? E : { key: g.key, page: yt, before: J.slice(0, _ + 1).map((kt) => kt.key), after: J.slice(_ + 1).map((kt) => kt.key) }, ve = new Set(fe.after), nt = new Set(fe.before), Ot = J.find((kt) => ve.has(kt.key) || (te === 1 || yt < fe.page) && ne && !nt.has(kt.key));
    return { direction: te, cursor: fe, remainingKeys: ve, visitedKeys: nt, nextLoaded: Ot };
  }
  async function ur(g = !1, E = !1, _ = !1, te = () => !0, ne = H.current, fe) {
    if (!R) return;
    const { direction: ve, cursor: nt, remainingKeys: Ot, visitedKeys: kt, nextLoaded: rn } = Oe(R, ne);
    if (!g && rn) {
      Fn(rn, _);
      return;
    }
    const Et = g ? kt : new Set(J.map((Ce) => Ce.key));
    let ft = ve === -1 && !g ? Math.max(1, yt - 1) : yt;
    for (; bn.current && !bt.current; ) {
      let Ce = await Rt(Zt, ft, fe);
      const Jt = Math.max(
        1,
        Math.ceil(Ce.totalCount / Number(T.filter.perPage))
      );
      ft > Jt && (ft = Jt, Ce = await Rt(Zt, ft, fe));
      const wt = fo(Ce.items, ve === -1), Hn = new Map(wt.map((Ct) => [Ct.key, Ct])), Qe = g ? nt.after.flatMap((Ct) => {
        const Lr = Hn.get(Ct);
        return Lr ? [Lr] : [];
      }) : [], ht = new Set(Qe.map((Ct) => Ct.key)), At = g ? {
        ...Ce,
        items: [
          ...Qe,
          ...wt.filter(
            (Ct) => Ct.key !== R.key && !ht.has(Ct.key)
          )
        ]
      } : { ...Ce, items: wt };
      if (!te()) return;
      if (E) {
        H.current = nt, dr(At, ft, R, !1, !0);
        return;
      }
      const tr = ve === -1 && yt === 1 && !g ? void 0 : At.items.find(
        (Ct) => !Et.has(Ct.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(g && ve === -1 && ft === nt.page) || Ot.has(Ct.key))
      );
      if (tr || (ve === -1 ? ft <= 1 : ft >= Jt)) {
        dr(
          At,
          ft,
          tr ?? null,
          _,
          !0
        ), tr || ct(
          Ce.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      ft += ve;
    }
  }
  async function Mt(g, E = !1, _ = !1, te = !1) {
    var Hn;
    if (Ke.current && g && R && !_ && !te && !q && !lt) {
      gn.current = { action: g, stay: E, key: R.key };
      return;
    }
    if (q || !R || Re.current || Se || lt && !_)
      return;
    const ne = _ || te || !!(g != null && g.steps.length);
    if (ne && (!t || !Me) || g && Sr(g) && !n) return;
    const fe = !E && !_ && !te && ne && g !== void 0 && Me !== null && Ps(e) && bi(gi(e.actions, cf(g, Me, nn))).length > 0, ve = _ && ((Hn = lr.current) != null && Hn.contains(document.activeElement)) ? document.activeElement : null;
    Re.current = !0, Ie(!0), Te(""), ct(""), Ke.current = !0, ne && (gt(), Sn.current++);
    const nt = H.current, Ot = ne && !E && !fe ? Oe(R).nextLoaded ?? null : null;
    Ot && (j(
      (Qe) => Qe.filter((ht) => ht.key !== R.key)
    ), Fn(Ot, !0));
    let kt = !1, rn = !1, Et = [], ft = null, Ce = [];
    const Jt = (Qe) => Yi({
      id: Zi(),
      at: Date.now(),
      label: (g == null ? void 0 : g.label) ?? (te ? "Saved choices" : "Edited tags"),
      reviewName: e.name,
      reviewId: e.id,
      kind: h,
      items: [Xi(R, y(R.media), ft, Qe, Ce)]
    });
    let wt = "";
    try {
      if (ne) {
        const Qe = await Wt(h, R);
        if (ft = Qe, g)
          Ce = (await Ja(g)).flatMap((At) => At.tagIds), await Gu(Zt, R, g);
        else {
          const At = te && $e(e) ? e.occurrence.tagIds.filter((Lr) => Qe.ids.includes(Lr)) : ln.current, Ct = cr(At, te ? Ne : _t);
          Ce = [...Ct.added, ...Ct.removed], await Qi(Zt, R, Ct);
        }
        const ht = await Wt(h, R);
        Jt(ht) || (wt = " Recent changes could not record it, so it cannot be undone there."), Ot || on(ht), rn = !0, sn(!1), fe && (Et = bi(gi(e.actions, ht))), ct(
          Et.length ? `Tags saved. Staying until answered: ${Et.map((At) => At.name).join(", ")}.${wt}` : `Tags saved.${wt}`
        ), R.occurrence && (Or(R.occurrence.performer.id), ke((At) => At + 1));
      }
      if (!bn.current || bt.current) return;
      if (ne)
        if (Ot) {
          const Qe = Yt.current, ht = qt();
          kt = !0, Ke.current = !1, tn(), ur(!0, !1, !0, () => Yt.current === Qe && !Re.current, nt, ht).catch((At) => {
            Yt.current === Qe && Te(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${pn(At)}`);
          });
        } else Et.length || await ur(!0, E, !E);
      else E || await ur();
      E && _ && requestAnimationFrame(() => {
        var Qe;
        return (Qe = yn.current) == null ? void 0 : Qe.focus();
      });
    } catch (Qe) {
      if (Te(
        rn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${pn(Qe)}` : ne ? `Saving stopped. ${hp(pn(Qe))}${_ || te ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${pn(Qe)}`
      ), ne && !rn) {
        Kn.current = ve, Ot && (j(J), pe(null), we((ht) => ht + 1), A(R), H.current = nt);
        try {
          const ht = await Wt(h, R);
          ft && !Jt(ht) && Te(
            (At) => `${At} Recent changes could not record what was saved, so it cannot be undone there.`
          ), on(ht);
        } catch {
          on(null), Te(
            (ht) => `${ht} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      kt || (Ke.current = !1, tn());
    }
  }
  Y(() => {
    const g = gn.current;
    if (!(!g || at || Re.current)) {
      if ((R == null ? void 0 : R.key) !== g.key || Un) {
        gn.current = null;
        return;
      }
      Me && (gn.current = null, Mt(g.action, g.stay));
    }
  }, [at, Me, R, Un]);
  const Ya = !lt && !q && !be && !Bn && (R != null || Se || at);
  rs({
    surface: "local",
    enabled: Ya,
    actions: e.actions,
    onAction: (g, E) => {
      const _ = e.actions[g];
      _ && Mt(_, E);
    },
    onFind: () => dn(!0)
  });
  const zn = (g) => at || Se || !Me || !!q || !t && g.steps.length > 0 || !n && Sr(g);
  function va() {
    !o || q || Re.current || lt || (D.current = document.activeElement, x.current = {
      error: Un,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: J,
      current: R,
      total: ge,
      targets: Xn.current,
      stayedCursor: H.current
    }, gt(), P(structuredClone(e)), M(""), ct(""), Te(""));
  }
  Y(() => {
    if (!i) {
      ce.current = 0;
      return;
    }
    i !== ce.current && W && !Se && (ce.current = i, va(), s == null || s());
  }, [i, Se, W]);
  function Xr() {
    P(null), M(""), requestAnimationFrame(() => {
      const g = D.current;
      g != null && g.isConnected && g !== document.body && g.focus();
    });
  }
  function $r() {
    var E;
    const g = x.current;
    !g || at || ((E = ie.current) == null || E.abort(), jt.current++, I.current = g.query, z(g.query), j(g.items), A(g.current), mt(g.total), Xn.current = g.targets, H.current = g.stayedCursor, ze(!1), Te(g.error), ct(""), window.history.replaceState(window.history.state, "", g.url), Xr());
  }
  async function xn() {
    if (!q || !o || Re.current) return;
    const g = jn(
      { ...q, name: q.name.trim() },
      uo(un.current, I.current)
    ), E = Da(g);
    if (E) {
      M(E);
      return;
    }
    Re.current = !0, Ie(!0), M("");
    try {
      if (await o(g) === !1) throw new Error("Could not save review.");
      Xr(), ct("Review saved.");
    } catch (_) {
      M(Dc(_));
    } finally {
      tn();
    }
  }
  async function Na() {
    if (!o || Re.current) return;
    const g = uo(un.current, I.current), E = jn(un.current, {
      ...g,
      filter: { ...g.filter, page: 1 }
    });
    Re.current = !0, Ie(!0), Te(""), Tt("");
    try {
      if (await o(E) === !1) throw new Error("Could not save review.");
      ct("Queue saved to this review.");
    } catch (_) {
      Tt("Could not save queue. " + pn(_));
    } finally {
      tn();
    }
  }
  const dt = T.performerScope, Je = (g) => {
    const { performerFocus: E, ..._ } = I.current, te = E && !("targetMode" in g || "performerIds" in g || "performerFilter" in g);
    Xe(
      {
        ..._,
        ...te ? { performerFocus: E } : {},
        filter: { ..._.filter, page: 1 },
        performerScope: { ...dt, ...g }
      },
      _.startFrom === "end"
    );
  };
  async function Rr(g, E) {
    var ne;
    const _ = Gn.current;
    if (!$e(_)) return;
    (ne = De.current) == null || ne.controller.abort();
    const te = {
      signature: bo(_),
      controller: new AbortController()
    };
    De.current = te, Le.current = "", fn(!0), We(null);
    try {
      const fe = await Zh(_, g, E, te.controller.signal, {
        onProgress: (ve) => {
          De.current === te && Q(ve);
        }
      });
      De.current === te && Q(fe);
    } catch (fe) {
      De.current === te && !te.controller.signal.aborted && (Le.current = te.signature, We({ signature: te.signature, message: pn(fe) }));
    } finally {
      De.current === te && (De.current = null, fn(!1));
    }
  }
  function Zr() {
    var g;
    (g = De.current) == null || g.controller.abort(), De.current = null, fn(!1), Q((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function Or(g) {
    var te;
    const E = Gn.current;
    if (!$e(E)) return;
    if (De.current) {
      Zr();
      return;
    }
    const _ = bo(E);
    if (!(((te = Ae.current) == null ? void 0 : te.signature) !== _ || Ae.current.partial))
      try {
        const ne = await Ql(E, g);
        if (De.current) {
          Zr();
          return;
        }
        Q(
          (fe) => (fe == null ? void 0 : fe.signature) === _ ? ep(fe, g, ne) : fe
        );
      } catch {
        Q(
          (ne) => (ne == null ? void 0 : ne.signature) === _ ? { ...ne, partial: !0, complete: !1 } : ne
        );
      }
  }
  const fr = T.performerFocus ? oe == null ? void 0 : oe.candidates.find((g) => g.id === T.performerFocus) : void 0, St = zt && zt.id === T.performerFocus ? { ...zt, flags: jr(en, zt.tags) } : fr ? { ...fr, flags: jr(en, fr.tags) } : null, qa = (g) => {
    if ((zt == null ? void 0 : zt.id) === g)
      return jr(en, zt.tags);
    const E = oe == null ? void 0 : oe.candidates.find((_) => _.id === g);
    return E ? jr(en, E.tags) : void 0;
  }, Vn = ((He = R == null ? void 0 : R.occurrence) == null ? void 0 : He.performer.id) ?? null, hr = Vn === null ? void 0 : qa(Vn), Sa = np(
    en.length > 0 && Vn !== null && Vn !== T.performerFocus && hr === void 0 ? Vn : null
  ), pr = hr ?? (Sa ? jr(en, Sa) : []), nn = fl(Pe.actions), _o = Mn.summary && T.performerFocus ? ts(hs(Mn.summary, Pe.actions, nn)) : [], ka = Ls(en, (St == null ? void 0 : St.flags) ?? [], Ir), Xa = bl(
    Ls(en, pr, Ir),
    Vn !== null && Vn === T.performerFocus ? _o : []
  ), jo = JSON.stringify(Xa), Ea = ye(() => Xa, [jo]), Aa = JSON.stringify(ka), Za = ye(() => ka, [Aa]), hn = (g) => bf(en, g, Nn);
  function ea(g) {
    if (Re.current) return;
    const E = {
      ...I.current,
      performerFocus: g,
      filter: { ...I.current.filter, page: 1 }
    };
    Xe(E, E.startFrom === "end"), B("items");
  }
  function Mr() {
    const { performerFocus: g, ...E } = I.current;
    Xe(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const Pn = $(null);
  Pn.current ?? (Pn.current = Nl());
  const Fr = Pn.current, Jn = ye(
    () => Pe.actions.flatMap((g) => g.steps.flatMap((E) => E.tagIds)),
    [Pe.actions]
  ), mr = $(null);
  Y(() => {
    var ve;
    const g = mr.current, E = g == null ? void 0 : g.querySelector('[aria-current="true"]');
    if (!g || !E) return;
    const _ = g.getBoundingClientRect(), te = E.getBoundingClientRect(), ne = (ve = E.nextElementSibling) == null ? void 0 : ve.getBoundingClientRect(), fe = ne && ne.bottom - te.top <= _.height ? Math.max(ne.bottom, te.bottom) : te.bottom;
    te.top < _.top ? g.scrollTop -= _.top - te.top : fe > _.bottom && (g.scrollTop += fe - _.bottom);
  }, [R == null ? void 0 : R.key, O]);
  const xr = $(null), ta = $(null);
  Y(() => {
    var _, te;
    const g = ta.current;
    if (!g) return;
    ta.current = null;
    const E = [...((_ = xr.current) == null ? void 0 : _.querySelectorAll(".dq-partner")) ?? []];
    (te = E.find((ne) => ne.dataset.partnerKey === g) ?? E[0]) == null || te.focus();
  }, [R == null ? void 0 : R.key]);
  const na = at || Se || lt || !!q, Pr = ye(
    () => q ? jn(q, uo(e, T)) : null,
    [q, e, T]
  ), eo = ye(
    () => Pr != null && fa(Gr(Pr)) !== fa(Gr(e)),
    [Pr, e]
  );
  function Ca() {
    R ? Wt(h, R).then(on).catch((g) => Te(pn(g))) : Xe(I.current);
  }
  const gr = Un ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Un,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: at, onClick: Ca, children: R ? "Reload tags" : "Retry queue" })
  ] }) : null, Ln = at || Se || R != null && !Me, je = Math.max(1, Number(T.filter.perPage) || 1), to = $(1);
  Se || (to.current = Math.max(1, Math.ceil(ge / je)));
  const ra = to.current, Dn = dt && R ? J.filter(
    (g) => g.media.id === R.media.id && g.key !== R.key
  ) : [], Uo = (g) => {
    var E;
    return g.title || ((E = g.files[0]) == null ? void 0 : E.basename) || `${h === "audio" ? "Audio" : "Video"} ${g.id}`;
  }, no = R ? mp(R.media, h) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${h === "audio" ? " dq-audio" : ""}`,
      "aria-label": dt ? h === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : h === "audio" ? "Audio review" : "Video review",
      onClickCapture: (g) => {
        var te;
        const E = g.target instanceof Element ? g.target.closest("button") : null, _ = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((te = E == null ? void 0 : E.textContent) == null ? void 0 : te.trim()) ?? "";
        E && !E.closest(cc) && /^(Filters|Edit filter:|Edit criteria)/.test(_) && (ot.current = E);
      },
      children: [
        /* @__PURE__ */ a(
          Dl,
          {
            name: e.name,
            description: e.description,
            entityType: Ge(e),
            onBack: f == null ? void 0 : f.onBack,
            backDisabled: na || !!(f != null && f.busy),
            onEdit: q ? () => {
              var g;
              return (g = k.current) == null ? void 0 : g.focus();
            } : va,
            editDisabled: !q && (na || !o || !!(f != null && f.busy)),
            editing: !!q,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: at || lt, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: h === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  xa,
                  {
                    filter: T.filter,
                    objectFilter: Rn,
                    criteriaDefinitions: h === "audio" ? wc : Io,
                    customFieldEntityType: h,
                    supportsFilterExpressions: !0,
                    totalCount: ge,
                    sortOptions: h === "audio" ? Td : vc,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      _l,
                      {
                        page: Math.min(Math.max(1, yt || 1), ra),
                        pages: ra,
                        onPage: (g) => Xe({
                          ...I.current,
                          filter: Qt(
                            { ...I.current.filter, page: g },
                            h
                          )
                        })
                      }
                    ),
                    onFilterChange: (g) => {
                      (g.sort !== I.current.filter.sort || g.direction !== I.current.filter.direction) && (g = { ...g, sorts: void 0 }), Xe(
                        {
                          ...I.current,
                          filter: Qt(g, h)
                        },
                        I.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (g) => {
                      Xe(
                        {
                          ...I.current,
                          objectFilter: Ul(
                            g,
                            wn,
                            I.current.objectFilter
                          ),
                          filter: { ...I.current.filter, page: 1 }
                        },
                        I.current.startFrom === "end"
                      );
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(de, { children: [
              dt && /* @__PURE__ */ a(
                Hh,
                {
                  scope: dt,
                  disabled: at || lt,
                  editing: !!q,
                  onChange: Je,
                  onEditCriteria: () => Gt(!0)
                }
              ),
              (f == null ? void 0 : f.onGrid) && /* @__PURE__ */ a(
                jl,
                {
                  mode: "single",
                  disabled: na || !!f.busy,
                  onChange: () => {
                    var g;
                    return (g = f.onGrid) == null ? void 0 : g.call(f);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(de, { children: [
              $e(Zt) && t && /* @__PURE__ */ a(
                _h,
                {
                  review: Zt,
                  disabled: Ye || !!q,
                  performerAttention: T.performerFocus ? Za : void 0,
                  trees: nn,
                  onOpen: () => {
                    Re.current = !0, Ie(!0);
                  },
                  onClose: (g) => {
                    if (g) {
                      const E = I.current.performerFocus;
                      E ? Or(E) : Zr(), ke((_) => _ + 1), tn(), w.current || ze(!0), Z((_) => _ + 1);
                    } else tn();
                  }
                }
              ),
              (f == null ? void 0 : f.moreItems) && /* @__PURE__ */ a(
                cs,
                {
                  disabled: na,
                  items: f.moreItems({
                    onSelect: va,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: T.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                da,
                {
                  performer: {
                    id: T.performerFocus,
                    name: (St == null ? void 0 : St.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (St == null ? void 0 : St.name) ?? `performer ${T.performerFocus}` })
              ] }),
              St != null && St.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: hn(St.flags), children: [
                /* @__PURE__ */ a(or, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: hn(St.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Ye,
                  onClick: Mr,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Wr,
            queueChange: !q && Wr ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: $t ? () => void Na() : void 0,
              saveDisabled: Ye || !o,
              onReset: () => {
                const g = Vr(e);
                Xe(g, g.startFrom === "end");
              },
              resetDisabled: Ye
            } : void 0,
            chipsEnd: q ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        f == null ? void 0 : f.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          q && Pr && /* @__PURE__ */ a(
            Ll,
            {
              drawerRef: k,
              draft: Pr,
              onChange: (g) => P(g),
              direction: T.startFrom,
              onDirectionChange: (g) => Xe({ ...I.current, startFrom: g }),
              tagGroups: pp,
              trees: nn,
              saving: at,
              saveDisabled: Se,
              error: L,
              dirty: eo,
              criteriaChanged: $t,
              notices: gr && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: gr }),
              onSave: () => void xn(),
              onCancel: $r
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              R ? /* @__PURE__ */ u(de, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${h}/${R.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: Uo(R.media) }),
                        /* @__PURE__ */ a($c, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  no && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: no })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [R, Fe].filter(Boolean).map((g) => {
                    var te, ne, fe, ve, nt;
                    const E = g, _ = E.key === R.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: _ ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": _ ? void 0 : !0,
                        inert: _ ? void 0 : !0,
                        children: h === "audio" ? /* @__PURE__ */ a(
                          $d,
                          {
                            streamUrl: di("audio", E.media.id),
                            format: ((te = E.media.files[0]) == null ? void 0 : te.format) ?? "",
                            title: y(E.media),
                            coverUrl: _ ? li("audio", E.media) : void 0,
                            duration: ((ne = E.media.files[0]) == null ? void 0 : ne.duration) ?? 0,
                            autostart: _ && se === E.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Nc,
                          {
                            videoId: E.media.id,
                            streamUrl: di("video", E.media.id),
                            posterUrl: _ ? li("video", E.media) : void 0,
                            duration: ((fe = E.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            format: (ve = E.media.files[0]) == null ? void 0 : ve.format,
                            audioCodec: (nt = E.media.files[0]) == null ? void 0 : nt.audioCodec,
                            extensionSurface: _ ? "quick-view" : void 0,
                            autostart: _ && se === E.media.id,
                            keyboardShortcutsEnabled: _,
                            showAbLoop: _,
                            clip: E.media.parentVideoId != null ? {
                              start: E.media.clipStartSec ?? 0,
                              end: E.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${E.media.id}:${G}`
                    );
                  }) }),
                  h === "audio" && /* @__PURE__ */ a(
                    Uh,
                    {
                      details: R.media.details,
                      label: m.one
                    },
                    R.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Se ? "Loading review…" : ge ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              Pe.actions.length > 0 ? /* @__PURE__ */ a(
                If,
                {
                  actions: Pe.actions,
                  isDisabled: (g) => lt || zn(g),
                  busy: Ln,
                  tags: Me,
                  trees: nn,
                  preview: Fr,
                  onApply: (g, E) => void Mt(g, E),
                  onFind: () => dn(!0),
                  findDisabled: lt || !!q,
                  paused: !!q,
                  waitForGroups: Ps(Pe),
                  attention: Ea,
                  stayOnTap: ue,
                  onStayOnTapChange: K
                }
              ) : $e(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || at || lt || !Me || !!q || !R,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((g) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Ne.includes(g),
                          onChange: (E) => xe(
                            e.occurrence.multiple ? E.target.checked ? [...Ne, g] : Ne.filter((_) => _ !== g) : [g]
                          )
                        }
                      ),
                      $n[g] ?? "Loading tag…"
                    ] }, g)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => xe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Mt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Mt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: xr, children: [
                R && /* @__PURE__ */ u(de, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: R.occurrence ? R.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      R.occurrence && /* @__PURE__ */ a(da, { performer: R.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: R.occurrence ? R.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: dt ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    Ea.length > 0 && /* @__PURE__ */ a(yp, { entries: Ea })
                  ] }),
                  Dn.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Dn.map((g) => {
                          var E, _, te;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = g.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (_ = g.occurrence) == null ? void 0 : _.performer.name,
                              "data-partner-key": g.key,
                              disabled: Ye,
                              onClick: () => {
                                ta.current = R.key, Fn(g), Te("");
                              },
                              children: [
                                g.occurrence && /* @__PURE__ */ a(da, { performer: g.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (te = g.occurrence) == null ? void 0 : te.performer.name })
                              ]
                            },
                            g.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    bp,
                    {
                      tags: Me,
                      preview: Fr,
                      trees: nn,
                      actionTagIds: Jn,
                      label: `Current ${dt ? "occurrence" : m.one} tags`,
                      tagsChangedSinceEditing: lt && !at && (!Me || Me.ids.length !== ln.current.length || Me.ids.some((g) => !ln.current.includes(g))),
                      editor: lt && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: lr,
                          disabled: at,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              dt ? "occurrence" : m.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              kr,
                              {
                                entityType: "tag",
                                values: _t,
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
                                  disabled: !Me,
                                  onClick: () => void Mt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Me,
                                  onClick: () => void Mt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    sn(!1), requestAnimationFrame(() => {
                                      var g;
                                      return (g = yn.current) == null ? void 0 : g.focus();
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
                $e(it) && T.performerFocus && /* @__PURE__ */ a(
                  ki,
                  {
                    ...Mn,
                    mediaKind: h,
                    actions: Pe.actions,
                    trees: nn,
                    flags: Za
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !q && gr,
                  !q && an && /* @__PURE__ */ a("p", { role: "alert", children: an }),
                  In && /* @__PURE__ */ a("p", { role: "status", children: In })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                R && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Ln || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: yn,
                      className: "dq-button",
                      disabled: Ye || !!q || !t || !Me,
                      onClick: () => {
                        gt(), ln.current = [...Me.ids], cn([...Me.ids]), sn(!0), ct("");
                      },
                      children: [
                        /* @__PURE__ */ a(Cc, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: Ye || !!q,
                      onClick: () => void Mt(),
                      children: [
                        /* @__PURE__ */ a(Bd, { "aria-hidden": "true" }),
                        "Skip",
                        dt ? " performer" : ` ${m.one}`
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
                        "aria-pressed": O === "items",
                        onClick: () => B("items"),
                        children: h === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": O === "performers",
                        onClick: () => B("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              dt && O === "performers" ? /* @__PURE__ */ a(
                Bh,
                {
                  ranking: (oe == null ? void 0 : oe.signature) === vn ? oe : null,
                  busy: et,
                  error: (qe == null ? void 0 : qe.signature) === vn ? qe.message : "",
                  focus: T.performerFocus,
                  disabled: Ye,
                  labels: m,
                  flagLabel: hn,
                  onFocus: ea,
                  onMore: () => {
                    const g = Ae.current;
                    g && Rr(g, g.limit + ri);
                  },
                  onRefresh: () => {
                    Q(null), Rr(null, ri);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: mr, children: J.map((g) => {
                var _;
                const E = (R == null ? void 0 : R.key) === g.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: N(g),
                    "aria-label": N(g),
                    "aria-current": E ? "true" : void 0,
                    disabled: Ye,
                    onClick: () => {
                      Fn(g), Te(""), ct("");
                    },
                    children: [
                      /* @__PURE__ */ a(gp, { media: g.media, kind: h }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: y(g.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          g.occurrence && /* @__PURE__ */ u(de, { children: [
                            /* @__PURE__ */ a(da, { performer: g.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: g.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            g.media.date,
                            g.occurrence ? "" : (_ = g.media.files[0]) != null && _.duration ? qc(g.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  g.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        dt && /* @__PURE__ */ a(
          yc,
          {
            open: be,
            onClose: () => Gt(!1),
            criteria: Ri,
            activeFilter: dt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (g) => {
              Gt(!1), Je({ performerFilter: g });
            }
          }
        ),
        Bn && /* @__PURE__ */ a(
          os,
          {
            actions: e.actions,
            trees: nn,
            isDisabled: (g) => zn(g),
            tapStays: Tn && ue,
            onApply: (g, E) => {
              dn(!1), Mt(g, E);
            },
            onClose: () => dn(!1)
          }
        )
      ]
    }
  );
}
const od = "data-quality.reviews-sort.v1", vp = { sort: "name", direction: "asc" };
function Np() {
  try {
    const e = JSON.parse(localStorage.getItem(od) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return vp;
}
function qp(e) {
  try {
    localStorage.setItem(
      od,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function id(e, t, n, r) {
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
function ai(e, t) {
  const n = Ge(e), r = Yn(Pi(n)), o = n === "tag" ? "tag" : $e(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function Sp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      ai(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      ai(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(de, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      ai(e, t)
    ] })
  ] });
}
function kp({
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
  onImport: m,
  onExportAll: y,
  onHistory: N,
  rowMenuItems: v
}) {
  const w = $(null), q = ye(
    () => id(e, t, n, r),
    [e, t, n, r]
  ), P = e.every((M) => t[M.id] !== void 0), L = r === "asc" ? "ascending" : "descending";
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
              var M;
              return (M = w.current) == null ? void 0 : M.click();
            },
            children: [
              /* @__PURE__ */ a(Gd, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            ref: w,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (M) => {
              var x;
              const k = (x = M.target.files) == null ? void 0 : x[0];
              M.target.value = "", k && m(k);
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
              /* @__PURE__ */ a(Rc, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        N && /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "See and undo what Data Quality changed from this browser",
            onClick: N,
            children: [
              /* @__PURE__ */ a(Ua, { "aria-hidden": "true" }),
              "Recent changes"
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
              /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: P ? e.some((M) => t[M.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (M) => o(M.target.value),
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
              "aria-label": `Sort direction: ${L}`,
              title: `Sort direction: ${L}`,
              onClick: () => i(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(zd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(Vd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? L : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? L : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: q.map((M) => {
          const k = Ge(M);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(M.id)}`,
                "data-review-id": M.id,
                onClick: (x) => {
                  x.button !== 0 || x.metaKey || x.ctrlKey || x.shiftKey || x.altKey || (x.preventDefault(), p(M.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Fl, { entityType: k }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: M.name }),
                    M.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: M.description, children: M.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Ml[k] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Sp, { review: M, count: t[M.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(cs, { label: `Actions for ${M.name}`, items: v(M) }) })
          ] }, M.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a($o, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function sd(e, { id: t, name: n, description: r }) {
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
function Ep({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), l = $(null), f = $(i);
  f.current = i;
  const d = $(null), p = ut();
  Y(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = l.current) == null || y.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(i);
  Y(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!o.name.trim() || h.current && !i && N) && ((w = l.current) == null || w.focus()), h.current = i;
  }, [s, i]);
  const m = () => {
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
        y.preventDefault(), m();
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
                  onClick: m,
                  children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Pl,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Ge(o) && t(sd(y, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => ss(o), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: i, onClick: m, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": i || void 0, children: i ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Ap = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Cp(e, t, n, r) {
  return ad(
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
function lc(e, t) {
  return Ge(t) === "video" && Qr(t.view.objectFilter, e.view.objectFilter, ps(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function dc(e, t) {
  return Er(
    JSON.parse(vr(Gr(e))),
    JSON.parse(vr(Gr(t)))
  );
}
const oi = 180;
function uc(e) {
  return Ge(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function fc(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function hc() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ii(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Lo.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  rd(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ip(e) {
  return Qt({ ...e, page: 1 });
}
function cd(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ia(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Tp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Mi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(Qd, { "aria-hidden": "true" }) }
], $p = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Mi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(Hd, { "aria-hidden": "true" }) }
], pc = [], ld = "(min-width: 900px)";
function Rp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ld);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Op() {
  return typeof window.matchMedia == "function" && window.matchMedia(ld).matches;
}
function Mp({
  onNavigate: e
}) {
  const [t, n] = C([]), [r] = C(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = C(""), [s, c] = C(!0), [l, f] = C(""), [d, p] = C(!1), [h, m] = C(!1), [y, N] = C(!1), [v, w] = C(!1), [q, P] = C([]), [L, M] = C(""), [k, x] = C(!0), [D, ie] = C("account"), [W, U] = C(""), [ce, T] = C(""), [z, I] = C(!1), [ee, Z] = C(!1), [me, J] = C(""), [j, R] = C(hc), A = $(j);
  A.current = j;
  const [H, se] = C({}), pe = $(H);
  pe.current = H;
  const G = $(t);
  G.current = t;
  const we = $(s);
  we.current = s;
  const Fe = $(!1), ge = $(!0);
  Y(() => (ge.current = !0, () => {
    ge.current = !1;
  }), []);
  const [mt, Se] = C(!j);
  mt !== !j && (Se(!j), j || se({}));
  const [ze, at] = C(Np), { sort: Ie, direction: Re } = ze, Yt = (b) => {
    const S = { ...ze, ...b };
    at(S), qp(S);
  }, Cn = $(null), gt = $(null), [qt, Ke] = C(null), [gn, bn] = C(!1), [bt, Un] = C(!1), [Te, an] = C(null), [Tt, In] = C(null), [ct, Me] = C(!1), [on, lt] = C({
    revision: 0,
    keys: []
  }), sn = $(null), _t = !!Te || !!Tt || ct, cn = $(_t);
  cn.current = _t;
  const ln = gn || !!Tt || bt, [yn, ot] = C(0), [lr, Kn] = C(!1), [be, Gt] = C(null), Bn = $(null), dn = $(null), Tn = $(null), [Ve, Xt] = C(
    null
  ), ue = t.find((b) => b.id === j) ?? null, K = ye(
    () => (Ve == null ? void 0 : Ve.id) === j && ue ? { ...ue, view: {
      ...ue.view,
      filter: Ve.view.filter,
      objectFilter: Ve.view.objectFilter,
      searchMode: Ve.view.searchMode,
      startFrom: Ve.view.startFrom
    } } : ue,
    [Ve, j, ue]
  ), Ne = K ? Ge(K) : "video", xe = Pi(Ne), $n = K ? $e(K) : !1, le = Ne === "video" ? K : null, Xn = !!(K != null && K.actions.some(Sr)), wn = $n && Xn, Cr = (!!le || Ne === "audio" || $n) && Xn, [Rn, jt] = C(null), un = (Rn == null ? void 0 : Rn.id) === (K == null ? void 0 : K.id) ? Rn == null ? void 0 : Rn.mode : (K == null ? void 0 : K.view.reviewMode) ?? "single", Pe = $n || Ne === "audio" || Ne === "video" && un === "single", [it, Zt] = C(0), Zn = $(-1), Gn = $(!1), O = $(Pe);
  O.current = Pe, Y(() => {
    const b = () => {
      const S = O.current;
      if (!S && zn.current) {
        Gn.current = !0;
        return;
      }
      Zn.current = -1, ft(), S || Zt((F) => F + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const B = xe === "audio" ? h : d, oe = Ne === "tag" ? "Tag" : xe === "audio" ? "Audio" : "Video", Ee = Ne === "tag" ? y : B, Ae = $(
    null
  ), Le = ap(le), [Q, et] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [fn, qe] = C({
    page: 1,
    perPage: 40
  }), [We, De] = C({ items: [], totalCount: 0 }), [vn, Do] = C(j);
  vn !== j && (Do(j), De({ items: [], totalCount: 0 }), Z(!1));
  const [ke, zt] = C(!1), [tt, On] = C(""), [er, en] = C(!1), [ya, wa] = C(!1), [Vt, Nn] = C(() => /* @__PURE__ */ new Set()), Ir = $(Vt);
  Ir.current = Vt;
  const Mn = $(/* @__PURE__ */ new Map()), Wr = (K == null ? void 0 : K.view.selectAllOnLoad) === !0, [$t, Ye] = C(null), yt = $($t);
  yt.current = $t;
  const [Xe, tn] = C(!1), Rt = $(Xe);
  Rt.current = Xe;
  const dr = $(null), [Fn, qn] = C(!1), [Sn, Yr] = C("grid"), [Tr, Wa] = C(oi), [Oe, ur] = C(!1), [Mt, Ya] = C(!1), zn = $(!1), [va, Xr] = C(""), [$r, xn] = C(""), [Na, dt] = C(""), [Je, Rr] = C(null), [Zr, Or] = C(""), [fr, St] = C(!1), [qa, Vn] = C({}), hr = $(/* @__PURE__ */ new Map()), Sa = $(null), pr = $(null), nn = !!K, _o = Ti(Rp, Op, () => !1) && nn, [ka, Xa] = C({ top: 0, bottom: 0 });
  Dt(() => {
    if (!nn) return;
    const b = () => {
      const F = pr.current;
      if (!F) return;
      const V = Math.round(F.getBoundingClientRect().top + window.scrollY), re = F.closest("main"), ae = re ? Math.round(parseFloat(getComputedStyle(re).paddingBottom) || 0) : 0;
      Xa(
        (X) => X.top === V && X.bottom === ae ? X : { top: V, bottom: ae }
      );
    };
    b();
    const S = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return S == null || S.observe(document.body), window.addEventListener("resize", b), () => {
      S == null || S.disconnect(), window.removeEventListener("resize", b);
    };
  }, [nn]);
  const [jo, Ea] = C(0), Aa = $(null), Za = _n((b) => {
    var F;
    if ((F = Aa.current) == null || F.disconnect(), Aa.current = null, !b || typeof ResizeObserver > "u") return;
    const S = new ResizeObserver(
      () => Ea(Math.round(b.getBoundingClientRect().height))
    );
    S.observe(b), Aa.current = S;
  }, []), hn = $(0), ea = $(0), Mr = $(null), Pn = $(null), Fr = fl(
    K && !Pe ? be ? [...K.actions, ...be.draft.actions] : K.actions : pc
  ), Jn = ye(
    () => be && K && ue ? Cp(be.draft, K, Q, ue) : null,
    [be, K, Q, ue]
  ), mr = ye(
    () => K && ue ? ad(
      { ...ue, view: { ...K.view, filter: { ...Q, page: 1 } } },
      ue
    ) : null,
    [K, ue, Q]
  ), xr = ye(
    () => ue ? fa(Gr(ue)) : "",
    [ue]
  ), ta = ye(
    () => mr != null && fa(Gr(mr)) !== xr,
    [mr, xr]
  ), na = ye(
    () => Jn != null && fa(Gr(Jn)) !== xr,
    [Jn, xr]
  );
  Y(() => {
    if (!$r) return;
    const b = window.setTimeout(() => xn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [$r]), Y(() => {
    if (!qt || qt.alert) return;
    const b = window.setTimeout(() => Ke(null), 6e3);
    return () => window.clearTimeout(b);
  }, [qt]), Y(() => {
    const b = le ? us(le.view.objectFilter) : [];
    if (Vn({}), !b.length) return;
    const S = new AbortController();
    let F = !0;
    return Promise.all(
      b.map(async (V) => {
        var re;
        try {
          const ae = await he(`/api/tags/${V}`, {
            signal: S.signal
          });
          return (re = ae.name) != null && re.trim() ? [String(V), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((V) => {
      F && Vn(
        Object.fromEntries(V.filter((re) => re !== null))
      );
    }), () => {
      F = !1, S.abort();
    };
  }, [le == null ? void 0 : le.id, le == null ? void 0 : le.view.objectFilter]);
  const Pr = ye(
    () => le ? fs(
      le.view.objectFilter,
      qa
    ) : (K == null ? void 0 : K.view.objectFilter) ?? {},
    [qa, K, le]
  ), eo = _n(async () => {
    c(!0), f("");
    try {
      const b = await gu();
      n(b.reviews), i(b.storageKey), Vu(b.storageKey), p(b.canWriteVideos ?? b.canWrite), m(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), x(b.canConfigure ?? !0), ie(b.storage ?? "account"), U(b.storageNotice ?? ""), j && !b.reviews.some((S) => S.id === j) && (R(""), ii(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [j]);
  Y(() => {
    if (!v) {
      P([]), M("");
      return;
    }
    const b = new AbortController();
    return M(""), Tu(b.signal).then(P).catch((S) => {
      b.signal.aborted || M(
        S instanceof Error ? S.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), Y(() => {
    eo();
  }, []), Y(() => {
    if (j || t.length === 0) return;
    const b = new AbortController();
    for (const S of t) {
      if (typeof pe.current[S.id] == "number") continue;
      ($e(S) ? Vi(S, b.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : ca(xo(S, V), { ...S.view.filter, page: 1, perPage: 1 }, b.signal)) : Ge(S) === "tag" ? Jo(
        S,
        Qt({ ...S.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : ca(
        S,
        Qt({ ...S.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((V) => {
        b.signal.aborted || se((re) => ({
          ...re,
          [S.id]: V.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || se((V) => ({ ...V, [S.id]: null }));
      });
    }
    return () => b.abort();
  }, [j, t]), Dt(() => {
    var F, V;
    const b = gt.current;
    if (j || s || !b) return;
    gt.current = null, (V = (b === "heading" ? null : [...((F = pr.current) == null ? void 0 : F.querySelectorAll("[data-review-id]")) ?? []].find(
      (re) => re.dataset.reviewId === b.reviewId
    )) ?? Cn.current) == null || V.focus();
  }, [j, s, Tt, t]);
  const Ca = $(0), gr = _n(async () => {
    const b = ++Ca.current;
    Rr(null), Or("");
    try {
      const S = await (wn ? Jc(xe) : zc(xe));
      b === Ca.current && Rr(S);
    } catch (S) {
      if (b !== Ca.current) return;
      Rr(null), Or(
        "Tag assessment setup could not be checked. " + (S instanceof Error ? S.message : "Request failed.")
      );
    }
  }, [wn, xe]);
  Y(() => {
    gr();
  }, [gr]);
  const Ln = _n(
    async (b, S, F = !1, V = !1, re = () => !0) => {
      var _e, st;
      const ae = ++hn.current;
      (_e = Mr.current) == null || _e.abort();
      const X = new AbortController();
      Mr.current = X, S = Qt(S);
      const Ze = Number(S.page);
      F && (S = { ...S, page: 1 }), et(S), wa(F), zt(!0), On("");
      try {
        const vt = (It) => Ge(b) === "tag" ? Jo(
          b,
          It,
          X.signal
        ) : ca(
          b,
          It,
          X.signal
        );
        let pt = await vt(S);
        const Ft = Math.max(
          1,
          Math.ceil(pt.totalCount / Number(S.perPage))
        ), Be = F ? Ft : Math.min(Ze, Ft);
        return Number(S.page) !== Be && (S = { ...S, page: Be }, pt = await vt(S)), ae === hn.current && re(pt) && (((st = Pn.current) == null ? void 0 : st.page) !== Be && (Pn.current = {
          page: Be,
          ids: new Set(pt.items.map((It) => It.id))
        }), De(pt), V && g(
          () => new Set(pt.items.map((It) => It.id))
        ), et(S), qe(S)), pt;
      } catch (vt) {
        throw ae === hn.current && On(
          vt instanceof Error ? vt.message : "Could not load the review queue."
        ), vt;
      } finally {
        ae === hn.current && zt(!1);
      }
    },
    []
  );
  Y(() => {
    var S;
    if (ea.current += 1, Zn.current = -1, hn.current += 1, (S = Mr.current) == null || S.abort(), Gt(null), Bn.current = null, Z(!1), J(""), T(""), I(!1), Nn(/* @__PURE__ */ new Set()), Mn.current.clear(), Ye(null), tn(!1), ur(!1), zn.current = !1, Xr(""), xn(""), dt(""), De({ items: [], totalCount: 0 }), Pn.current = null, en(!1), !K || Pe) {
      zt(!1), Xt(null);
      return;
    }
    let b = !0;
    return zt(!0), (async () => {
      let F = ue ?? K;
      Xt(null);
      let V = null;
      const re = new URLSearchParams(window.location.search);
      if (Ge(K) === "video" && Lo.some((_e) => re.has(_e)))
        try {
          const _e = F;
          V = Ii(_e, re);
          const st = jn(_e, V.query);
          (V.query.startFrom !== (_e.view.startFrom ?? "end") || !Er(
            JSON.parse(vr(st)),
            JSON.parse(vr(jn(_e, Vr(_e))))
          )) && (F = st, Xt(F));
        } catch (_e) {
          en(!0), On(_e instanceof Error ? _e.message : "Could not read review URL."), zt(!1);
          return;
        }
      let ae = null;
      try {
        ae = await qu(o, K.id);
      } catch (_e) {
        b && (I(!0), T(
          _e instanceof Error ? _e.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const X = (ae == null ? void 0 : ae.signature) === vr(F) ? ae : null, Ze = V ? V.query.filter : X ? Qt(X.filter) : Ip(F.view.filter);
      et(Ze), Yr(
        X ? fc(X.displayMode, Ge(K)) : uc(K)
      ), Wa(
        X ? X.cardSize ?? oi : oi
      );
      try {
        const _e = await Ln(
          F,
          Ze,
          V ? V.startAtEnd : !X && F.view.startFrom !== "beginning",
          F.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const st = Ss(
          _e.items.map((vt) => vt.id),
          (X == null ? void 0 : X.focusedId) ?? null,
          (X == null ? void 0 : X.index) ?? 0
        );
        Ye(st), He(st);
      } catch {
      }
      b && (Zn.current = it, Z(!0), J(`${K.id}:${it}`));
    })(), () => {
      var F;
      b = !1, ea.current++, hn.current++, (F = Mr.current) == null || F.abort();
    };
  }, [K == null ? void 0 : K.id, Pe, it]), Y(() => {
    if (!(!yn || Pe || !K)) {
      if (er) {
        ot(0);
        return;
      }
      Oe || be || Mt || me !== `${K.id}:${it}` || (ot(0), zo());
    }
  }, [
    yn,
    Pe,
    K == null ? void 0 : K.id,
    me,
    Oe,
    Mt,
    it,
    er
  ]), Y(() => {
    !le || Pe || !ee || ke || tt || Oe || Gn.current || Zn.current !== it || ha(le.id, {
      filter: Q,
      objectFilter: le.view.objectFilter,
      searchMode: le.view.searchMode,
      startFrom: le.view.startFrom ?? "end"
    });
  }, [le, Pe, ee, ke, tt, Q, Oe, it]);
  const je = ye(
    () => We.items.map((b) => b.id),
    [We.items]
  );
  Y(() => {
    if (!ee || !K || !o || ke || tt || Oe || (Ve == null ? void 0 : Ve.id) === K.id || z || Zn.current !== it)
      return;
    const b = {
      version: 1,
      signature: vr(K),
      filter: Q,
      focusedId: $t,
      index: Math.max(0, je.indexOf($t ?? -1)),
      displayMode: Sn,
      cardSize: Tr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + K.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (ce) return;
    let S = !0;
    const F = window.setTimeout(() => {
      Su(o, K.id, b).catch((V) => {
        S && T(
          "Progress is kept in this browser, but account sync failed. " + (V instanceof Error ? V.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      S = !1, window.clearTimeout(F);
    };
  }, [
    ee,
    o,
    K,
    ke,
    tt,
    Oe,
    Q,
    $t,
    je,
    Sn,
    Tr,
    Ve,
    ce,
    z,
    it
  ]);
  const to = We.items.find((b) => b.id === $t) ?? null, ra = Ne === "video" ? to : null;
  Xe && ra && (dr.current = ra);
  const Dn = ra ?? (Xe ? dr.current : null), Uo = As(Vt, $t), no = je.length > 0 && je.every((b) => Vt.has(b)), He = _n((b, S = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var V;
      if (cn.current || du(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const F = hr.current.get(b);
      F == null || F.focus({ preventScroll: !0 }), S && (F == null || F.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Y(() => {
    ee && !Rt.current && He(yt.current);
  }, [ee, He]), Y(() => {
    ct || sn.current == null || (He(sn.current), sn.current = null);
  }, [ct, He]), Y(() => {
    ke || !je.length || (yt.current == null || !je.includes(yt.current)) && (Ye(je[0]), Rt.current || He(je[0]));
  }, [He, je, ke]);
  const g = _n(
    (b) => {
      Nn((S) => {
        const F = b(S);
        for (const V of /* @__PURE__ */ new Set([...S, ...F]))
          S.has(V) !== F.has(V) && Mn.current.set(
            V,
            (Mn.current.get(V) ?? 0) + 1
          );
        return F;
      });
    },
    []
  ), E = _n(
    (b) => {
      if (!je.length) return;
      const S = Math.max(
        0,
        je.indexOf(yt.current ?? je[0])
      ), F = je[Math.max(0, Math.min(je.length - 1, S + b))];
      Ye(F), Rt.current || He(F);
    },
    [He, je]
  ), _ = _n(
    async (b, S = !1) => {
      const F = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", V = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, re = V != null && (!v || !q.some((rt) => rt.id === V)), ae = "effect" in b && F && !v, X = As(
        Ir.current,
        yt.current
      );
      if (!K || zn.current || ke || tt) return;
      const Ze = F && !Ee ? `${oe} write permission is required to apply ${b.label}.` : ae || re ? `${b.label} needs a tag group that is unavailable.` : Sr(b) && (Je == null ? void 0 : Je.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : X.length ? "" : `Select or focus a ${Ne} before applying ${b.label}.`;
      if (Ze) {
        dt(Ze);
        return;
      }
      const _e = ++ea.current, st = K.id, vt = [...je], pt = We, Ft = yt.current, Be = new Set(Ir.current), It = new Map(
        X.map((rt) => [rt, Mn.current.get(rt) ?? 0])
      ), Dr = () => _e === ea.current && K.id === st;
      zn.current = !0, ur(!0), Xr(
        Ir.current.size ? `${X.length} selected ${Ne}s` : `the focused ${Ne}`
      ), xn(""), dt("");
      const ys = pt.items.filter(
        (rt) => !X.includes(rt.id)
      ), vd = ys.map((rt) => rt.id), ws = Cs(
        vt,
        vd,
        Ft,
        X.includes(Ft ?? -1)
      );
      S || (De({
        items: ys,
        totalCount: pt.totalCount
      }), Nn((rt) => {
        const xt = new Set(rt);
        for (const Ut of X) xt.delete(Ut);
        return xt;
      }), Ye(ws), Rt.current || He(ws));
      let Vo = !1, ao = "";
      try {
        if ("effect" in b)
          await Pu(b, X);
        else if (!F)
          await ui(xe, b, X);
        else {
          const rt = (await Ja(b)).flatMap((kn) => kn.tagIds), xt = X.map((kn) => ({
            key: String(kn),
            media: pt.items.find((Qn) => Qn.id === kn) ?? {
              id: kn
            }
          })), Ut = () => ef(xt, (kn) => Wt(xe, kn).catch(() => null)), br = await Ut();
          let Ta = !1;
          try {
            await ui(xe, b, X), Ta = !0;
          } finally {
            const kn = await Ut(), Qn = xt.flatMap((nr, Kt) => {
              const Bt = br[Kt], aa = kn[Kt];
              return Bt && aa ? [Xi(nr, ji(nr.media, xe), Bt, aa, rt)] : [];
            }), Nt = xt.length - Qn.length;
            ao = Yi({
              id: Zi(),
              at: Date.now(),
              label: b.label,
              reviewName: K.name,
              reviewId: K.id,
              kind: xe,
              items: Qn
            }) ? Nt && Ta ? ` Recent changes could not read ${Nt} of them, so their change cannot be undone there.` : "" : " Recent changes could not record it, so it cannot be undone there.";
          }
        }
        if (Vo = !0, !Dr()) return;
        S || Nn((rt) => {
          const xt = new Set(rt);
          for (const Ut of X)
            (Mn.current.get(Ut) ?? 0) === It.get(Ut) && xt.delete(Ut);
          return xt;
        }), xn(
          `${b.label}: ${X.length} ${Ne}${X.length === 1 ? "" : "s"} ${F ? "updated" : "skipped"}${S ? ", kept in place" : ""}.`
        ), ao && dt(`${b.label} was applied.${ao}`);
      } catch (rt) {
        if (!Dr()) return;
        De(pt), Nn((xt) => {
          const Ut = new Set(xt);
          for (const br of X)
            Be.has(br) && (Mn.current.get(br) ?? 0) === It.get(br) && Ut.add(br);
          return Ut;
        }), Ye(Ft), Rt.current || He(Ft), dt(
          `${b.label}: ${rt instanceof Error ? rt.message : "Action failed."}${ao}`
        );
      }
      try {
        if (!Dr()) return;
        if (S) {
          const Nt = Ne === "tag" ? await Jo(K, Q) : await ca(K, Q), En = new Map(
            Nt.items.map((Ht) => [Ht.id, Ht])
          );
          if (Ne !== "tag" && await Promise.all(
            X.filter((Ht) => !En.has(Ht)).map(async (Ht) => {
              const $a = await So(xe, Ht).catch(() => null);
              $a && En.set(Ht, $a);
            })
          ), !Dr()) return;
          const nr = new Set(X), Kt = "effect" in b ? b.effect : null, Bt = (Kt == null ? void 0 : Kt.mode) === "SET_TAG_GROUP" ? q.find((Ht) => Ht.id === Kt.tagGroupId) : void 0, aa = (Ht) => Kt && Kt.mode !== "SKIP" && nr.has(Ht.id) ? {
            ...Ht,
            tagGroupId: (Bt == null ? void 0 : Bt.id) ?? null,
            tagGroupName: (Bt == null ? void 0 : Bt.name) ?? null,
            tagGroupColor: (Bt == null ? void 0 : Bt.color) ?? null
          } : Ht;
          De((Ht) => ({
            items: Ht.items.map(($a) => En.get($a.id) ?? aa($a)),
            totalCount: Nt.totalCount
          }));
          return;
        }
        const rt = new Set(X), xt = Wr && vt.length > 0 && vt.every((Nt) => rt.has(Nt)), Ut = Pn.current, br = (K.view.startFrom ?? "end") !== "beginning", Ta = (Nt) => {
          const En = Nt.items.map((Kt) => Kt.id), nr = (Ut == null ? void 0 : Ut.page) === Number(Q.page) && En.some((Kt) => Ut.ids.has(Kt));
          return Nt.totalCount > 0 && Number(Q.page) > 1 && (!En.length || br && !nr);
        }, kn = await Ln(K, Q, !1, xt, (Nt) => !Ta(Nt));
        if (!Dr()) return;
        let Qn = kn.items.map((Nt) => Nt.id);
        if (Ta(kn)) {
          const Nt = Math.max(1, Number(Q.page) - 1), En = { ...Q, page: Nt };
          et(En), Qn = (await Ln(
            K,
            En,
            !1,
            xt
          )).items.map((Bt) => Bt.id), Nn(
            (Bt) => new Set([...Bt].filter((aa) => Qn.includes(aa)))
          );
          const Kt = Qn.at(-1) ?? null;
          Ye(Kt), Rt.current || He(Kt);
        } else {
          Nn(
            (En) => new Set([...En].filter((nr) => Qn.includes(nr)))
          );
          const Nt = Cs(
            vt,
            Qn,
            Ft,
            Vo && X.includes(Ft ?? -1)
          );
          Ye(Nt), Rt.current && Nt == null && tn(!1), Rt.current || He(Nt);
        }
      } catch (rt) {
        Dr() && dt(
          (xt) => `${xt ? `${xt} ` : ""}${Vo ? "The action completed, but " : ""}the queue could not be refreshed. ${rt instanceof Error ? rt.message : "Refresh failed."}`
        );
      } finally {
        Dr() && (zn.current = !1, ur(!1), Xr(""), Gn.current && (Gn.current = !1, ft(), Zt((rt) => rt + 1)));
      }
    },
    [
      Ee,
      v,
      q,
      Ne,
      Je,
      Ln,
      Q,
      He,
      je,
      We,
      ke,
      tt,
      K
    ]
  );
  function te() {
    var F;
    if (Sn === "list") return 1;
    const b = (F = Sa.current) == null ? void 0 : F.firstElementChild, S = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, S.split(" ").filter(Boolean).length);
  }
  const ne = $(() => {
  });
  ne.current = (b) => {
    var ae;
    if (Pe || b.defaultPrevented || b.repeat || An(b) || b.ctrlKey || b.altKey || b.metaKey || _t) return;
    const S = b.target, F = S instanceof Node && ((ae = pr.current) == null ? void 0 : ae.contains(S)) === !0, V = S === document.body || S === document.documentElement;
    if (!F && !V) return;
    if (Fn) {
      b.key === "Escape" && (ia(b), qn(!1));
      return;
    }
    if (Xe && b.key === "Escape") {
      ia(b), tn(!1), He(yt.current);
      return;
    }
    if (!lu(S)) return;
    const re = cu(S);
    if (b.key === "Escape") {
      ia(b), g(() => /* @__PURE__ */ new Set()), S instanceof HTMLElement && S.closest(".dq-action-bar") && He(yt.current, !1);
      return;
    }
    if (!Xe && b.key === " " && re) {
      ia(b), $t != null && g((X) => ho(X, $t));
      return;
    }
    if (!(Oe || ke) && !Xe && b.key === "Enter" && $t != null && re) {
      if (Ne !== "tag" && be) return;
      ia(b), Ne === "tag" ? window.open(`/tag/${$t}`, "_blank", "noopener,noreferrer") : tn(!0);
      return;
    }
  }, Y(() => {
    const b = (S) => ne.current(S);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const fe = $(
    () => {
    }
  );
  fe.current = (b) => {
    var ae;
    if (Pe || _t || Xe || Fn || Oe || ke || !je.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const S = b.target, F = S instanceof Node && ((ae = pr.current) == null ? void 0 : ae.contains(S)) === !0, V = S === document.body || S === document.documentElement;
    if (!F && !V || !b.key.startsWith("Arrow") || !uu(S)) return;
    const re = fu(b.key, te());
    re && (b.preventDefault(), F ? b.stopImmediatePropagation() : b.stopPropagation(), E(re));
  }, Y(() => {
    const b = (S) => fe.current(S);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), Y(() => {
    const b = () => {
      var F;
      const S = document.activeElement;
      !(S instanceof HTMLInputElement) || S.type !== "range" || !((F = pr.current) != null && F.contains(S)) || O.current || S.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (S.blur(), He(yt.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [He]);
  const ve = (be == null ? void 0 : be.saving) === !0 || Mt, nt = Oe || ke && !ee || ve, Ot = as();
  rs({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!K && !Pe && !_t && !be && !Xe && !Fn && !tt && (We.items.length > 0 || ke || Oe),
    actions: (K == null ? void 0 : K.actions) ?? pc,
    onAction: (b, S) => {
      const F = K == null ? void 0 : K.actions[b];
      F && _(F, S);
    },
    onFind: () => qn(!0),
    onSelectAll: () => g((b) => su(b, je))
  }), Y(() => qn(!1), [Pe, Xe, K == null ? void 0 : K.id]);
  function kt(b) {
    const S = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", F = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, V = F != null && !q.some((re) => re.id === F);
    return Oe || ke || !!tt || S && !Ee || "effect" in b && S && (!v || V) || Sr(b) && (Je == null ? void 0 : Je.kind) !== "ready" || !Uo.length;
  }
  function rn(b) {
    jt(null), ot(0), Ke(null), R(b), ii(b, !!b && !K);
  }
  function Et() {
    Fe.current || (nd() ? (Fe.current = !0, window.history.back()) : rn(""));
  }
  function ft() {
    const b = Fe.current;
    Fe.current = !1;
    let S = hc();
    S && !we.current && !G.current.some((V) => V.id === S) && (S = "", ii(""));
    const F = A.current;
    S !== F && (ot(0), b || Ke(null), !S && F && (gt.current ?? (gt.current = { reviewId: F }))), R(S);
  }
  function Ce() {
    gt.current = "heading", Ke(null), Et();
  }
  function Jt(b) {
    b !== j && rn(b), ot((S) => S + 1);
  }
  function wt() {
    Ke(null), an({
      review: sd("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Hn(b) {
    if (ln || !k) return;
    Ke(null);
    const S = crypto.randomUUID();
    let F;
    const V = j;
    Un(!0);
    try {
      if (!await Ia((ae) => (F = Es(
        ae.find((X) => X.id === b.id) ?? b,
        ae,
        S
      ), [...ae, F]))) throw new Error("Could not save reviews.");
      if (!ge.current) return;
      A.current !== V ? Ke({ text: `Saved the copy “${F.name}”.`, alert: !1 }) : Jt(F.id);
    } catch (re) {
      Ke({
        text: `“${b.name}” was not duplicated. ${tr(re)}`,
        alert: !0
      });
    } finally {
      Un(!1);
    }
  }
  async function Qe() {
    if (!Te || Te.saving) return;
    const b = { ...Te.review, name: Te.review.name.trim() }, S = Da(b);
    if (S) {
      an({ ...Te, error: S });
      return;
    }
    an({ ...Te, saving: !0, error: "" });
    try {
      if (!await Ia((F) => [...F, b]))
        throw new Error("Could not save reviews.");
      if (!ge.current) return;
      an(null), Jt(b.id);
    } catch (F) {
      an(
        (V) => V && {
          ...V,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (F instanceof Error ? F.message : "Retry saving.")
        }
      );
    }
  }
  async function ht() {
    if (!Tt || Tt.pending) return;
    const b = Tt.review, S = id(t, H, Ie, Re).map((re) => re.id), F = S.filter((re) => re !== b.id), V = F[Math.min(S.indexOf(b.id), F.length - 1)];
    In({ review: b, pending: !0 });
    try {
      if (!await Ia((re) => re.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      gt.current = b.id !== j && V ? { reviewId: V } : "heading", Ke({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (re) {
      Ke({ text: `“${b.name}” was not deleted. ${tr(re)}`, alert: !0 });
    } finally {
      In(null);
    }
  }
  async function At(b) {
    if (!(ln || !k)) {
      Ke(null), bn(!0);
      try {
        const S = await fh(b);
        let F = 0, V = 0;
        if (S.length && !await Ia((ae) => {
          const X = [...ae];
          F = V = 0;
          for (const Ze of S) {
            const _e = X.find((st) => st.id === Ze.id);
            if (!_e) X.push(Ze);
            else if (po(_e, !0) !== po(Ze, !0) && // Imported before, its copy is listed already under its own id and name.
            !X.some(
              (st) => st.id !== Ze.id && po(st) === po(Ze)
            ))
              X.push(Es(Ze, X, crypto.randomUUID())), V++;
            else continue;
            F++;
          }
          return F ? X : ae;
        }))
          throw new Error("Could not save reviews.");
        const re = S.length - F;
        Ke({
          alert: !1,
          text: S.length ? F ? `Imported ${F === 1 ? "1 review" : `${F} reviews`}` + (V ? ` (${V === 1 ? "1 as a copy" : `${V} as copies`} beside a listed version that differs)` : "") + "." + (re === 1 ? " 1 review already in the list stays as it is." : re ? ` ${re} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (S) {
        Ke({ alert: !0, text: `Could not import “${b.name}”. ${tr(S)}` });
      } finally {
        bn(!1);
      }
    }
  }
  function tr(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function Ct(b) {
    const S = !k || ln;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ec, { "aria-hidden": "true" }),
        disabled: S,
        onSelect: () => void Hn(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Rc, { "aria-hidden": "true" }),
        onSelect: () => ss(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(To, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: S,
        onSelect: () => {
          Ke(null), In({ review: b, pending: !1 });
        }
      }
    ];
  }
  function Lr(b, S) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(pa, { "aria-hidden": "true" }),
        ...S,
        disabled: S.disabled || bt
      },
      ...Ct(b),
      {
        label: "Recent changes…",
        icon: /* @__PURE__ */ a(Ua, { "aria-hidden": "true" }),
        separated: !0,
        onSelect: () => Me(!0)
      },
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Ga, { "aria-hidden": "true" }),
        separated: !0,
        disabled: bt,
        onSelect: Ce
      }
    ];
  }
  async function Ia(b) {
    if (!o) return !1;
    let S = [];
    const F = await vu(o, (X) => {
      S = X;
      const Ze = b(X);
      return Ze === X ? X : Ze.map(Pp);
    });
    if (n(F), !ge.current) return !0;
    const V = A.current;
    V && !F.some((X) => X.id === V) && Et();
    const re = S.find((X) => X.id === V), ae = F.find((X) => X.id === V);
    return ae && re && ((ae.view.reviewMode ?? "single") !== (re.view.reviewMode ?? "single") && jt(null), ae.view.displayMode !== re.view.displayMode && Yr(uc(ae))), !0;
  }
  function Ko(b) {
    return Ia((S) => xp(S, b));
  }
  function dd(b) {
    return Ko(b).catch((S) => {
      throw A.current !== b.id && Bo(b, S), S;
    });
  }
  function Bo(b, S) {
    var V;
    if (!ge.current) return;
    const F = ((V = G.current.find((re) => re.id === b.id)) == null ? void 0 : V.name) ?? b.name;
    Ke({ text: `“${F}” was not saved. ${tr(S)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(mc, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(de, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Up().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        gc,
        {
          message: l,
          onRetry: () => void eo()
        }
      )
    ] });
  const Go = /* @__PURE__ */ u(de, { children: [
    W && /* @__PURE__ */ a("p", { className: "dq-status", children: W }),
    Cr && (Je == null ? void 0 : Je.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Je.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: fr,
          onClick: () => {
            St(!0), Or(""), (wn ? Fu(xe) : Mu(xe)).then(gr).catch(
              (b) => Or(
                `Could not create the ${wn ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => St(!1));
          },
          children: fr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    Cr && ((Je == null ? void 0 : Je.kind) === "incompatible" || Zr) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(rr, {}),
      Zr || (Je == null ? void 0 : Je.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: fr,
          onClick: () => {
            St(!0), gr().finally(
              () => St(!1)
            );
          },
          children: fr ? "Checking…" : "Check again"
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
            const b = localStorage.getItem("page-videos") ?? "[]", S = URL.createObjectURL(
              new Blob([b], { type: "application/json" })
            ), F = document.createElement("a");
            F.href = S, F.download = "data-quality-unassigned-legacy-reviews.json", F.click(), URL.revokeObjectURL(S);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    ce && /* @__PURE__ */ u("p", { role: "alert", children: [
      ce,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            T(""), I(!1);
          },
          children: z ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    qt && (qt.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
      qt.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: qt.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: pr,
      className: `data-quality-page${nn ? " dq-page-fit" : ""}`,
      style: nn ? {
        "--dq-fit-top": `${ka.top}px`,
        "--dq-fit-bottom": `${ka.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: qt && !qt.alert ? qt.text : "" }),
        K && Pe ? /* @__PURE__ */ a(
          wp,
          {
            review: ue ?? K,
            canWrite: $n ? y : B,
            canAssess: (Je == null ? void 0 : Je.kind) === "ready" && B,
            onBusy: ur,
            editRequest: yn,
            onEditRequestHandled: () => ot(0),
            undoRevision: on.revision,
            undoneKeys: on.keys,
            onSaveDefaults: k ? dd : void 0,
            pageControls: {
              onBack: Ce,
              moreItems: (b) => Lr(ue ?? K, b),
              onGrid: le ? () => jt({ id: le.id, mode: "multiple" }) : void 0,
              notices: Go,
              busy: bt
            },
            stayOnTap: lr,
            onStayOnTapChange: Kn
          },
          K.id
        ) : K ? yd(K) : /* @__PURE__ */ a(
          kp,
          {
            reviews: t,
            counts: H,
            sort: Ie,
            direction: Re,
            onSortChange: (b) => Yt({ sort: b }),
            onDirectionChange: (b) => Yt({ direction: b }),
            storage: Ap[D],
            canConfigure: k,
            busy: ln,
            headingRef: Cn,
            notices: Go,
            onOpen: rn,
            onNew: () => wt(),
            onImport: (b) => void At(b),
            onExportAll: () => xl(t, "data-quality-reviews.json"),
            onHistory: () => Me(!0),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(pa, { "aria-hidden": "true" }),
                disabled: !k || ln,
                onSelect: () => Jt(b.id)
              },
              ...Ct(b)
            ]
          }
        ),
        Xe && Dn && le && /* @__PURE__ */ a(
          jp,
          {
            video: Dn,
            review: le,
            details: op(Dn, le, Le.ids),
            selectedCount: Vt.size,
            pending: Oe,
            refreshing: ke || !!tt,
            error: Na,
            canWrite: d,
            assessmentReady: (Je == null ? void 0 : Je.kind) === "ready",
            trees: Fr,
            selected: Vt.has(Dn.id),
            hasPrevious: je.indexOf(Dn.id) > 0,
            hasNext: je.indexOf(Dn.id) >= 0 && je.indexOf(Dn.id) < je.length - 1,
            onToggleSelected: () => g((b) => ho(b, Dn.id)),
            onPrevious: () => E(-1),
            onNext: () => E(1),
            onClose: () => {
              tn(!1), He(yt.current);
            },
            onAction: _,
            findOpen: Fn,
            onFindOpenChange: qn
          }
        ),
        Fn && K && !Pe && !Xe && /* @__PURE__ */ a(
          os,
          {
            actions: K.actions,
            tagGroups: q,
            trees: Fr,
            isDisabled: kt,
            onApply: (b, S) => {
              qn(!1), _(b, S);
            },
            onClose: () => qn(!1)
          }
        ),
        ct && /* @__PURE__ */ a(
          rf,
          {
            onClose: () => Me(!1),
            onUndone: (b, S) => {
              const F = K && b.reviewId === K.id ? S : [];
              lt((V) => ({ revision: V.revision + 1, keys: F })), sn.current = null, K && !Pe && !zn.current && Ln(K, Q).then((V) => {
                const re = V.items.find((ae) => F.includes(String(ae.id)));
                re && (Ye(re.id), cn.current ? sn.current = re.id : He(re.id));
              }).catch(() => {
              });
            }
          }
        ),
        Te && /* @__PURE__ */ a(
          Ep,
          {
            draft: Te,
            onChange: (b) => an((S) => S && { ...S, review: b, error: "" }),
            onCreate: () => void Qe(),
            onCancel: () => an(null)
          }
        ),
        /* @__PURE__ */ a(
          Od,
          {
            open: !!Tt,
            title: "Delete review?",
            message: Tt ? `“${Tt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (Tt == null ? void 0 : Tt.pending) ?? !1,
            onConfirm: () => void ht(),
            onCancel: () => In((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function ro(b, S, F = !1, V = !0) {
    const re = yt.current, ae = Math.max(0, je.indexOf(re ?? -1));
    try {
      const X = Ln(
        b,
        S,
        F,
        b.view.selectAllOnLoad === !0
      ), Ze = hn.current, _e = await X;
      if (Ze !== hn.current) return;
      const st = _e.items.map((pt) => pt.id);
      Nn(
        (pt) => new Set([...pt].filter((Ft) => st.includes(Ft)))
      );
      const vt = Ss(st, re, ae);
      Ye(vt), V && !Rt.current && He(vt, !1);
    } catch {
    }
  }
  function ud(b) {
    const S = Ae.current;
    if (Ae.current = null, nt || !K || !ue) return;
    const F = S ?? K.view.objectFilter, V = Er(
      F,
      ue.view.objectFilter
    ) ? ue.view.objectFilter : F, re = Qt({ ...b, page: 1 }), ae = {
      ...K,
      view: {
        ...K.view,
        filter: re,
        objectFilter: V
      }
    }, X = !dc(ae, ue), Ze = X ? ae : ue;
    Xt(X ? ae : null);
    const { page: _e, ...st } = Qt(b), { page: vt, ...pt } = Qt(tt ? fn : Q), Ft = !S && JSON.stringify(st) === JSON.stringify(pt);
    xn(X || Ft ? "" : "Review queue defaults restored."), ro(Ze, re, Ft || Ze.view.startFrom !== "beginning");
  }
  function fd() {
    if (Oe || ke || ve || !ue) return;
    Ae.current = null;
    const b = Qt({
      ...ue.view.filter,
      page: 1
    });
    Xt(null), xn("Review queue defaults restored."), ro(
      ue,
      b,
      ue.view.startFrom !== "beginning",
      !1
    );
  }
  function hd() {
    if (Oe || ke || tt || ve || !K || !mr || !k)
      return;
    const b = K, S = mr;
    Ya(!0), Ko(S).then((F) => {
      !F || A.current !== S.id || (Xt(lc(S, b)), xn("Queue saved to this review."));
    }).catch((F) => {
      A.current !== S.id ? Bo(S, F) : dt(F instanceof Error ? F.message : "Could not save queue.");
    }).finally(() => Ya(!1));
  }
  function zo() {
    if (!K || !ue || zn.current || be || Mt) return;
    dn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Bn.current = {
      temporaryReview: Ve,
      filter: Q,
      loadedFilter: fn,
      queue: We,
      queueError: tt,
      retryFromEnd: ya,
      selectedIds: new Set(Vt),
      focusedId: $t,
      pageCursor: Pn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...ue,
      view: { ...ue.view, startFrom: K.view.startFrom ?? "end" }
    });
    qn(!1), tn(!1), xn(""), dt(""), Gt({ draft: b, saving: !1, error: "" });
  }
  function ms() {
    Gt(null), Bn.current = null;
    const b = dn.current;
    dn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : He(yt.current, !1);
    });
  }
  function pd() {
    var S;
    if (!be || be.saving) return;
    const b = Bn.current;
    b && (hn.current += 1, (S = Mr.current) == null || S.abort(), Ae.current = null, zt(!1), Xt(b.temporaryReview), et(b.filter), qe(b.loadedFilter), De(b.queue), On(b.queueError), wa(b.retryFromEnd), g(() => b.selectedIds), Ye(b.focusedId), Pn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), ms();
  }
  async function md() {
    if (!be || be.saving || !Jn || !K) return;
    const b = K, S = { ...Jn, name: Jn.name.trim() }, F = Da(S);
    if (F) {
      Gt((V) => V && { ...V, error: F });
      return;
    }
    Gt((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await Ko(S)) throw new Error("Could not save reviews.");
      if (!ge.current || A.current !== S.id) return;
      Xt(lc(S, b)), Ge(S) === "video" && ha(S.id, {
        filter: Q,
        objectFilter: b.view.objectFilter,
        searchMode: S.view.searchMode,
        startFrom: S.view.startFrom ?? "end"
      }), xn("Review saved."), ms();
    } catch (V) {
      if (A.current !== S.id) {
        Bo(S, V);
        return;
      }
      Gt(
        (re) => re && {
          ...re,
          saving: !1,
          error: Dc(V)
        }
      );
    }
  }
  function gs() {
    K && Ln(K, Q, ya, Wr).catch(() => {
    });
  }
  function gd() {
    Nn(/* @__PURE__ */ new Set()), Mn.current.clear(), Ye(null);
  }
  function bd(b) {
    !K || Oe || ve || b === Number(Q.page) || Fp(
      { ...Q, page: b },
      K,
      (S, F) => Ln(S, F, !1, Wr),
      gd
    );
  }
  function bs(b) {
    if (!le || !ue || Oe || ke || ve) return;
    const S = td(le, b, ue.view.objectFilter), F = !dc(S, ue);
    Xt(F ? S : null), F ? ro(S, { ...Q, page: 1 }) : ro(
      ue,
      { ...Q, page: 1 },
      ue.view.startFrom !== "beginning"
    );
  }
  function yd(b) {
    var _e, st, vt, pt, Ft;
    const S = Ne === "tag", F = S ? "tag" : "video", V = Math.max(1, Number(Q.perPage) || 40), re = Math.max(1, Math.ceil(We.totalCount / V)), ae = Math.min(Math.max(1, Number(Q.page) || 1), re), X = [
      Ee ? "" : `${oe} write permission is required to apply actions.`,
      S && L ? `Tag groups are unavailable. ${L}` : ""
    ].filter(Boolean), Ze = !!Na && !Xe;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": S ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Dl,
            {
              name: b.name,
              description: b.description,
              entityType: Ne,
              onBack: Ce,
              backDisabled: Oe || !!be || bt,
              onEdit: be ? () => {
                var Be;
                return (Be = Tn.current) == null ? void 0 : Be.focus();
              } : zo,
              editDisabled: !be && (Oe || ke || er || Mt || bt || !k),
              editing: !!be,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: nt, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: S ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  xa,
                  {
                    filter: tt ? fn : Q,
                    onFilterChange: ud,
                    totalCount: We.totalCount,
                    sortOptions: S ? Fd : vc,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Sn,
                    zoomLevel: (Tr - 225) / 50,
                    onZoomChange: (Be) => Wa(Math.round(225 + Be * 50)),
                    cardSizeEntityType: S ? "tags" : "videos",
                    criteriaDefinitions: S ? Md : Io,
                    customFieldEntityType: Ne === "video" ? "video" : void 0,
                    supportsFilterExpressions: !S,
                    objectFilter: Pr,
                    onObjectFilterChange: (Be) => {
                      nt || (Ae.current = Ne === "video" ? Ul(
                        Be,
                        qa,
                        b.view.objectFilter
                      ) : Be);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_l, { page: ae, pages: re, onPage: bd })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(de, { children: [
                le && /* @__PURE__ */ a(
                  jl,
                  {
                    mode: "multiple",
                    disabled: Oe || ke || _t || !!be || Mt || bt,
                    onChange: () => jt({ id: le.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Eh,
                  {
                    options: S ? $p : Tp,
                    value: Sn,
                    onChange: (Be) => Yr(fc(Be, Ne))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                cs,
                {
                  disabled: Oe || !!be,
                  items: Lr(ue ?? b, {
                    onSelect: zo,
                    disabled: ke || er || Mt || !k
                  })
                }
              ),
              queueDiffers: ee ? (Ve == null ? void 0 : Ve.id) === j : void 0,
              queueChange: !be && (Ve == null ? void 0 : Ve.id) === j ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: ta ? hd : void 0,
                saveDisabled: Oe || ke || !!tt || ve || !k,
                onReset: fd,
                resetDisabled: Oe || ke || ve
              } : void 0,
              chipsAfter: (st = (_e = le == null ? void 0 : le.presentation) == null ? void 0 : _e.binParents) != null && st.length || (pt = (vt = le == null ? void 0 : le.presentation) == null ? void 0 : vt.filterBins) != null && pt.length ? /* @__PURE__ */ u(de, { children: [
                !!((Ft = le.presentation.binParents) != null && Ft.length) && /* @__PURE__ */ a(
                  ip,
                  {
                    videos: We.items,
                    review: le,
                    savedObjectFilter: (ue ?? le).view.objectFilter,
                    trees: Le.ids,
                    disabled: Oe || ke || ve,
                    onToggle: bs
                  }
                ),
                /* @__PURE__ */ a(
                  sp,
                  {
                    review: le,
                    savedObjectFilter: (ue ?? le).view.objectFilter,
                    queueFilter: Q,
                    queueCount: ke || tt ? null : We.totalCount,
                    disabled: Oe || ke || ve,
                    countsPaused: Oe || ke || ve || !ee,
                    onToggle: bs
                  }
                )
              ] }) : void 0,
              chipsEnd: be ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          Go,
          le && Le.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: Le.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            be && Jn && /* @__PURE__ */ a(
              Ll,
              {
                drawerRef: Tn,
                draft: Jn,
                onChange: (Be) => Gt((It) => It && { ...It, draft: Be }),
                direction: be.draft.view.startFrom ?? "end",
                onDirectionChange: (Be) => Gt(
                  (It) => It && {
                    ...It,
                    draft: { ...It.draft, view: { ...It.draft.view, startFrom: Be } }
                  }
                ),
                tagGroups: q,
                trees: Fr,
                saving: be.saving,
                saveDisabled: ke || !!tt,
                error: be.error,
                dirty: na,
                criteriaChanged: ta,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  tt && !ke ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      tt,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: gs, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void md(),
                onCancel: pd
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${jo}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ke && !We.items.length && /* @__PURE__ */ a(mc, { label: "Loading review queue…" }),
                    tt && !ke && /* @__PURE__ */ a(
                      gc,
                      {
                        message: tt,
                        retryLabel: er ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (er && ue && Ge(ue) === "video") {
                            const Be = Vr(ue);
                            ha(ue.id, { ...Be, filter: { ...Be.filter, page: void 0 } }), Zt((It) => It + 1);
                            return;
                          }
                          gs();
                        }
                      }
                    ),
                    !Oe && !ke && !tt && !We.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a($o, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        F,
                        "s match this review."
                      ] })
                    ] }),
                    !!We.items.length && /* @__PURE__ */ a("div", { ref: Sa, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: Sn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Tr}px` },
                        children: We.items.map(wd)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Za, children: /* @__PURE__ */ a(
                    Cl,
                    {
                      actions: be ? be.draft.actions : b.actions,
                      tagGroups: q,
                      trees: Fr,
                      isDisabled: kt,
                      paused: !!be,
                      busy: Oe || ke,
                      onApply: (Be) => void _(Be),
                      onFind: () => qn(!0),
                      status: Oe ? `Applying action to ${va}…` : "",
                      summary: /* @__PURE__ */ u(de, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Vt.size ? `${Vt.size} selected` : $t == null ? "Nothing to apply to" : `Applies to the focused ${F}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !je.length || no,
                            onClick: () => g((Be) => /* @__PURE__ */ new Set([...Be, ...je])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Lt, { binding: Ot.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Vt.size,
                            onClick: () => g(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Lt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: X.length ? X.join(" ") : void 0,
                      keyHints: S ? be ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : be ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: Ze || $r ? /* @__PURE__ */ u(de, { children: [
                        Ze && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(rr, { "aria-hidden": "true" }),
                          Na
                        ] }),
                        $r && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: $r })
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
  function wd(b) {
    var F, V, re;
    if (Ne === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Lp,
        {
          tag: ae,
          displayMode: Sn === "list" ? "list" : "grid",
          focused: ae.id === $t,
          selected: Vt.has(ae.id),
          setRef: (X) => {
            X ? hr.current.set(ae.id, X) : hr.current.delete(ae.id);
          },
          onFocus: () => Ye(ae.id),
          onToggle: () => {
            g((X) => ho(X, ae.id)), He(ae.id, !1);
          },
          onOpen: () => window.open(`/tag/${ae.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ae.id
      );
    }
    const S = b;
    return /* @__PURE__ */ a(
      Dp,
      {
        video: Zl(S, le, Le.ids),
        showTagBins: ((V = (F = le == null ? void 0 : le.presentation) == null ? void 0 : F.annotations) == null ? void 0 : V.includes("tags")) && !!((re = le.presentation.annotationParents) != null && re.length),
        displayMode: Sn,
        cardsScroll: _o,
        focused: S.id === $t,
        selected: Vt.has(S.id),
        setRef: (ae) => {
          ae ? hr.current.set(S.id, ae) : hr.current.delete(S.id);
        },
        onFocus: () => Ye(S.id),
        onToggle: () => g((ae) => ho(ae, S.id)),
        onPreview: () => {
          be || (Ye(S.id), tn(!0));
        },
        onNavigate: e
      },
      S.id
    );
  }
}
function Fp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function ho(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function xp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Pp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function po(e, t = !1) {
  const { id: n, name: r, ...o } = e;
  return JSON.stringify(
    t ? { ...o, id: n, name: r } : o,
    (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([c], [l]) => c < l ? -1 : c > l ? 1 : 0)) : s
  );
}
function Lp({
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
  const f = $(null), d = _n(
    (p) => {
      f.current = p, o(p);
    },
    [o]
  );
  return Dt(() => {
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
        xd,
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
function Dp({
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
  const p = cd(e), h = $(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(m.date || m.studioName), N = !!(m.performers.length || m.tags.length);
  return Dt(() => {
    const q = h.current;
    if (!q) return;
    const P = q.querySelector(
      `a[href="/video/${e.id}"]`
    ), L = q.querySelector(".card-title"), M = `dq-card-title-${e.id}`;
    L && (L.id = M), P && (P.target = "_blank", P.rel = "noreferrer", P.removeAttribute("aria-label"), P.setAttribute("aria-labelledby", M), P.classList.add("dq-card-link"));
    const k = q.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    k && k.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const x = q.querySelector(
      'button[title="Quick View"]'
    );
    x && x.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (q) => {
        h.current = q, s(q);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${p}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (q) => {
        c(), q.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          Pd,
          {
            video: m,
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
          (v = e.tags) == null ? void 0 : v.map((q) => /* @__PURE__ */ a("span", { children: q.name }, q.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(_p, { video: e, cardsScroll: r })
      ]
    }
  );
}
function _p({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [o, i] = C(!1), [s, c] = C(!1), [l, f] = C(!1);
  return Y(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), c(!0);
      return;
    }
    const p = t ? d.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => i(y.isIntersecting),
      { root: p, rootMargin: "320px 0px", threshold: 0 }
    ), m = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: p, threshold: [0, 0.6, 1] }
    );
    return h.observe(d), m.observe(d), () => {
      h.disconnect(), m.disconnect();
    };
  }, [e.id, e.files.length, t]), Y(() => {
    if (!o) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return he(Ru(e.id), {
      signal: d.signal
    }).then((p) => {
      d.signal.aborted || f(p.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [o, e.id]), Y(() => {
    const d = r.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [l, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: l && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: $u(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function jp({
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
  onToggleSelected: m,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: q,
  onFindOpenChange: P
}) {
  const L = $(null), M = Qa(), k = $(null), x = $(null), D = e.files[0], ie = cd(e), W = (I) => o || i || "steps" in I && I.steps.length > 0 && !c || Sr(I) && !l;
  rs({
    surface: "overlay",
    enabled: !q,
    actions: t.actions,
    onAction: (I, ee) => {
      const Z = t.actions[I];
      Z && w(Z, ee);
    },
    onFind: () => P(!0)
  }), Y(() => {
    var ee;
    const I = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (ee = L.current) == null || ee.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = I;
    };
  }, []);
  function U(I) {
    var me, J, j;
    if (I.key !== "Tab") return;
    const ee = [
      ...((me = L.current) == null ? void 0 : me.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((R) => R.offsetParent !== null);
    if (!ee.length) {
      I.preventDefault(), (J = L.current) == null || J.focus();
      return;
    }
    const Z = ee.indexOf(
      document.activeElement
    );
    I.shiftKey && Z <= 0 ? (I.preventDefault(), (j = ee.at(-1)) == null || j.focus()) : !I.shiftKey && Z === ee.length - 1 && (I.preventDefault(), ee[0].focus());
  }
  function ce(I) {
    if (q || I.defaultPrevented || I.ctrlKey || I.metaKey || I.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const ee = I.key === "ArrowLeft" || I.key === "ArrowRight";
    if (I.altKey && !ee) return;
    const Z = k.current, me = I.currentTarget.querySelector("video");
    if (I.key === "Enter" || I.key === "Escape")
      I.repeat || v();
    else if (I.key === " " && Z)
      I.repeat || Z.toggle();
    else if (ee && Z)
      Z.seekBy(
        (I.key === "ArrowLeft" ? -1 : 1) * (I.shiftKey ? 5 : I.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(I.key) && Z) {
      const J = x.current;
      if (!I.repeat && (J == null ? void 0 : J.videoId) === e.id) {
        const j = [D == null ? void 0 : D.duration, me == null ? void 0 : me.duration].find(
          (se) => se != null && Number.isFinite(se) && se > 0
        ) ?? 0, R = e.parentVideoId != null, A = R ? e.clipStartSec ?? 0 : 0, H = (R ? e.clipEndSec ?? j : j) - A;
        Number.isFinite(H) && H > 0 && Number.isFinite(J.time) && Z.seekBy(A + H * Number(I.key) / 10 - J.time);
      }
    } else if (I.key === "ArrowUp" || I.key === "ArrowDown")
      !I.repeat && !o && !i && (I.key === "ArrowUp" && p && y(), I.key === "ArrowDown" && h && N());
    else return;
    ia(I);
  }
  function T(I) {
    const ee = L.current, Z = I.target instanceof Element ? I.target.closest("button, a[href]") : null;
    !ee || !Z || !ee.contains(Z) || Z.closest(".dq-player, .dq-find-action") || I.detail === 0 || ee.focus({ preventScroll: !0 });
  }
  Y(() => {
    if (q) return;
    let I = 0;
    const ee = requestAnimationFrame(() => {
      I = requestAnimationFrame(() => {
        var me;
        const Z = document.activeElement;
        (me = L.current) != null && me.isConnected && (!Z || Z === document.body || Z === document.documentElement) && L.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(ee), cancelAnimationFrame(I);
    };
  }, [q, o, i, h, p, e.id, M]);
  const z = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: L,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ie}`,
      className: `dq-preview${M ? " dq-preview-mobile" : ""}`,
      onKeyDown: U,
      onKeyDownCapture: ce,
      onMouseDown: (I) => {
        I.target === I.currentTarget && v();
      },
      onClick: T,
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
                  /* @__PURE__ */ a(Ga, { "aria-hidden": "true" }),
                  !M && /* @__PURE__ */ a(Lt, { binding: "↑", hidden: !0 })
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
                  !M && /* @__PURE__ */ a(Lt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Tc, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ie }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((I) => /* @__PURE__ */ a("li", { children: I.name }, I.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Actions apply to ",
                z
              ] })
            ] }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": d,
                disabled: i,
                onClick: m,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(ga, {}) }),
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
                "aria-label": `Open ${ie} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a($c, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(ma, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: D ? /* @__PURE__ */ a(
            Nc,
            {
              autostart: !0,
              streamUrl: di("video", e.id),
              posterUrl: Ts(e),
              format: D.format,
              audioCodec: D.audioCodec,
              duration: D.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (I) => {
                x.current = { videoId: e.id, time: I };
              },
              onPlaybackControlRegister: (I) => (k.current = I, () => {
                k.current === I && (k.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: Ts(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !M && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Cl,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: W,
              busy: o || i,
              onApply: (I) => void w(I),
              onFind: () => P(!0),
              status: o ? `Applying action to ${z}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        q && /* @__PURE__ */ a(
          os,
          {
            actions: t.actions,
            trees: f,
            isDisabled: W,
            onApply: (I, ee) => {
              P(!1), w(I, ee);
            },
            onClose: () => P(!1)
          }
        )
      ]
    }
  );
}
async function Up() {
  const e = await he("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function mc({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(Jd, { className: "dq-spin" }),
    e
  ] });
}
function gc({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(rr, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Qp = { components: { DataQualityPage: Mp } };
export {
  Mp as DataQualityPage,
  Qp as default,
  Er as objectFiltersEqual
};
