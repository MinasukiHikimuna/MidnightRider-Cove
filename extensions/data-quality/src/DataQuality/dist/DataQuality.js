var Nd = Object.defineProperty;
var qd = (e, t, n) => t in e ? Nd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var vs = (e, t, n) => qd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, jsx as a, Fragment as fe } from "react/jsx-runtime";
import { useState as C, useEffect as X, useMemo as ye, useId as lt, useRef as $, useLayoutEffect as jt, useCallback as xn, useSyncExternalStore as Ci, createContext as Sd, useContext as kd, Fragment as Ii } from "react";
import { useKeySequence as Ed, EntityReferenceMultiSelector as Nr, SortableList as bc, TagBadge as Ad, EntityReferenceSelector as Ns, EntityDetailTabs as Cd, FilterDialog as yc, VIDEO_CRITERIA as So, DetailListToolbar as Oa, PERFORMER_CRITERIA as Ti, AUDIO_CRITERIA as wc, NarrativeText as Id, AUDIO_SORT_OPTIONS as Td, VIDEO_SORT_OPTIONS as vc, AudioPlayer as $d, VideoPlayer as Nc, formatDuration as qc, getResolutionLabel as Od, ConfirmDialog as Rd, TAG_CRITERIA as Md, TAG_SORT_OPTIONS as Fd, TagTile as xd, VideoCard as Pd } from "@cove/runtime/components";
import { Undo2 as La, X as ua, Search as Da, Flag as ar, Check as fa, Pencil as da, Ban as ho, ChevronDown as $i, Plus as _a, Pin as Sc, GripVertical as kc, AlertTriangle as nr, Copy as Ec, Trash2 as ko, Mic as Ld, Users as Ac, Tag as Cc, Headphones as Ic, Film as Eo, ChevronLeft as ja, MoreHorizontal as Dd, RectangleHorizontal as _d, LayoutGrid as Oi, ChevronRight as Tc, Save as jd, RotateCcw as Ud, Layers as qs, RefreshCw as Kd, ExternalLink as $c, SkipForward as Bd, Upload as Gd, Download as Oc, ArrowUp as zd, ArrowDown as Vd, Loader2 as Jd, List as Hd, Grid3X3 as Qd } from "@cove/runtime/lucide-react";
import { extensionFetch as Wd } from "@cove/runtime/api";
import { createPortal as Yd } from "react-dom";
const Ri = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Mi = Object.keys(
  Ri
);
function Ra(e) {
  return e === "excludes" || e === "excludesAll";
}
function Ao(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Rc(e) {
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
const po = { min: 115, max: 625 }, Zd = (e) => Math.min(po.max, Math.max(po.min, e)), Mc = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Te(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Fi(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ke(e) {
  return Fi(ze(e));
}
function eu(e) {
  return ze(e) === "video";
}
function ze(e) {
  return e.entityType ?? "video";
}
const yr = [
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
], Co = [
  yr.slice(0, 11),
  yr.slice(11, 22),
  yr.slice(22)
];
function $a(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function Ma(e) {
  return $a(e) ?? e.toLocaleUpperCase();
}
const wr = "none";
function Dr(e) {
  return typeof e == "string" && yr.includes(e);
}
function xi(e) {
  const t = e.shortcut;
  return Dr(t) || t === wr ? t : "auto";
}
function Fc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = xi(s);
    if (l !== wr) {
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
  const i = yr.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function tu(e, t, n) {
  const { keys: r, actionOn: o } = Fc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Dr(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Dr));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Dr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function Fa(e) {
  var n;
  return Te(e) && !Pc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !eu(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : ze(e) !== "tag" && e.actions.some(
    (r) => Pi(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => or(r, ze(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const nu = {
  video: 1e3,
  audio: 250
};
function Zt(e, t = "video") {
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
function br(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Te(e) ? [e.entityType, ...r, e.occurrence] : ze(e) === "video" ? r : [ze(e), ...r]
  );
}
function or(e, t) {
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
  ) && !Pi(e) : !1;
}
function ru(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function rr(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Sr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function xc(e) {
  return "steps" in e && e.steps.length > 0;
}
function vr(e) {
  return "steps" in e ? e.steps.some((t) => rr(t.mode)) : !1;
}
function Pi(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (rr(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Ua(e) {
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
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && or(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && or(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => Fa(n)))
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
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= po.min && n.cardSize <= po.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
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
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Mi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || iu(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
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
function In(e) {
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
const Lc = "ext:com.midnightrider.data-quality:configuration", hu = "ext:cove-data-quality:video-reviews", oi = "ext:com.midnightrider.data-quality:progress";
class mo extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    vs(this, "remote");
    this.remote = r;
  }
}
function Dc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof mo ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const Ka = /* @__PURE__ */ new Map(), eo = /* @__PURE__ */ new Map(), xr = (e, t) => e.includes("*") || e.includes(t), go = (e) => he(`/api/savedfilters?mode=${encodeURIComponent(e)}`), pu = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ii(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function ta(e) {
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
    reviews: Ua(JSON.stringify(t.reviews)),
    deletedIds: ii(t.deletedIds),
    importedIds: ii(t.importedIds)
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
      const s = Ua(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    ii(
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
function Li(e, t) {
  const n = (eo.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return eo.set(e, n), n.finally(() => {
    eo.get(e) === n && eo.delete(e);
  }).catch(() => {
  }), n;
}
let Ca = null;
function gu() {
  if (Ca) return Ca;
  const e = bu();
  return Ca = e, e.finally(() => {
    Ca === e && (Ca = null);
  }).catch(() => {
  }), e;
}
async function bu() {
  const e = await he("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Li(t, () => yu(e, t));
}
async function yu(e, t) {
  var h;
  const n = String(e.user.id), r = xr(e.permissions, "savedfilters.read"), o = r && xr(e.permissions, "savedfilters.write"), i = r ? (await go(Lc)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
  if (i.length > 1) {
    const m = (y) => {
      const { revision: N, ...v } = ta(y.uiOptions);
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
  let s = i.length ? ta(i[0].uiOptions) : pu();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = ta(l));
  let d = !i.length;
  if (i.length && f && l) {
    const m = ta(l);
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
      const L = s.reviews.find((D) => D.id === q.id);
      return L && JSON.stringify(L) !== JSON.stringify(q);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await go(hu)).flatMap(
      (q) => Ua(q.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (q) => !y.reviews.some((L) => L.id === q)
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
  if (Ka.set(t, p), d && o) {
    const m = s;
    i.length && (p.config = ta(i[0].uiOptions)), await jc(t, m), s = p.config;
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
    canWrite: xr(e.permissions, "videos.write"),
    canWriteVideos: xr(e.permissions, "videos.write"),
    canWriteAudios: xr(e.permissions, "audios.write"),
    canWriteTags: xr(e.permissions, "tags.write"),
    canReadTagGroups: xr(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function jc(e, t) {
  const n = Ka.get(e);
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
      ), s = ta(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new mo(
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
const ra = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), wu = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => ra(e, n) !== ra(t, n)
);
function vu(e, t) {
  return Li(e, async () => {
    const n = Ka.get(e);
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
    Ua(JSON.stringify(s));
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
      const f = l instanceof mo ? l.remote : void 0;
      if (!f || o >= 3) throw l;
      const d = wu(i, s).find(
        (p) => ra(i, p) !== ra(f.reviews, p) && ra(f.reviews, p) !== ra(s, p)
      );
      if (d !== void 0) {
        const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
        throw new mo(
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
  const n = Ka.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? Is(r) : null;
  if (!n.readable) return o;
  const i = (await go(oi)).find(
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
  return Li(r, async () => {
    const o = Ka.get(e);
    if (!(o != null && o.writable)) return;
    await _c(o);
    const i = (await go(oi)).find(
      (s) => s.name === t
    );
    await he(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: oi,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function zn(e) {
  return e === "audio" ? "audios" : "videos";
}
const ku = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Di(e, t) {
  var n, r;
  return e.title || ((r = (n = e.files) == null ? void 0 : n[0]) == null ? void 0 : r.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Vn(e) {
  return ku[e];
}
const bo = "confirmed_absent_tags", _i = "Confirmed absent tags", Io = "confirmed_absent_occurrence_tags", Uc = {
  key: bo,
  label: _i,
  type: "tag",
  subject: "tag assessments"
}, ji = {
  key: Io,
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
function ir(e) {
  return Array.isArray(e) ? e.map(ir) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Eu[n] ?? n : t === "key" && typeof n == "string" && [
        bo,
        Io
      ].includes(n.toLowerCase()) ? n.toLowerCase() : ir(n)
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
function yo(e, t) {
  return he(
    `/api/${zn(e)}/${t}?dqRead=${Cu}-${++Iu}`,
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
    ir({
      findFilter: Zt(t, Ke(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function aa(e, t, n) {
  return he(
    `/api/${zn(Ke(e))}/find`,
    { method: "POST", signal: n, body: Bc(e, t) }
  );
}
async function Ui(e, t, n) {
  return (await he(
    `/api/${zn(Ke(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Bc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function zo(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, he("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      ir({
        findFilter: Zt(t),
        objectFilter: r
      })
    )
  });
}
function Tu(e) {
  return he("/api/taggroups", { signal: e });
}
function si(e, t, n = 1280) {
  return `/api/${zn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ci(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Ts(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function $u(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ou(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function To(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await he(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await he("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          ir({
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
async function Ba(e, t) {
  const n = Sr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await To(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function Ru(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Ki(e, t) {
  const r = (await he("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Ru(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Vn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function Gc(e, t) {
  const n = await Ki(e, t);
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
  return Ki(Uc, e);
}
async function Vc(e) {
  let t;
  try {
    t = await zc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${_i} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
function Mu(e = "video") {
  return Gc(Uc, e);
}
function Jc(e = "video") {
  return Ki(ji, e);
}
function Fu(e = "video") {
  return Gc(ji, e);
}
function wo(e) {
  return [...new Set(e)];
}
function Hc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === Io
  ), o = r === void 0 ? [] : n[r];
  return wo(
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
      `Could not verify the ${ji.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Wc(e, t, n, r, o, i) {
  await he(`/api/${zn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: wo(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function xu(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${_i} custom field is not available.`
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
async function li(e, t, n) {
  if (!or(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Vn(e).many} and configure a valid action first.`
    );
  const r = vr(t) ? await Vc(e) : null, o = wo(n), i = (await Ba(t)).map((l) => ({
    mode: l.mode,
    tagIds: wo(l.tagIds)
  })), c = [
    ...i.filter((l) => !rr(l.mode)),
    ...i.filter((l) => rr(l.mode))
  ].map(
    (l) => xu(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await he(`/api/${zn(e)}/bulk`, {
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
  if (!or(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await he("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Lu = 600 * 1e3, Bi = /* @__PURE__ */ new Map(), Yc = /* @__PURE__ */ new Map(), gr = /* @__PURE__ */ new Map();
function Xc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Yc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Zc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Yc.set(e.tagGroupId, e.tagGroupSortOrder), Bi.set(e.id, { tag: e, at: Date.now() });
}
function el(e) {
  const t = Bi.get(e);
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
function di(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Zc(tl({ ...n, name: r }));
  }
}
function Du(e) {
  const t = gr.get(e);
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
        if (gr.get(e) === r && gr.delete(e), !i) return null;
        const s = tl({ ...o, id: e, name: i }), c = (p = Bi.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Zc(f), Xc(f);
      },
      () => (gr.get(e) === r && gr.delete(e), null)
    )
  };
  return gr.set(e, r), r;
}
function $s() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Vo(e) {
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
        d.waiters -= 1, d.waiters === 0 && gr.get(f) === d && (gr.delete(f), d.controller.abort());
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
function Ga(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = C(() => ({
    key: t,
    tags: Vo(Jo(t))
  }));
  return X(() => {
    const o = Jo(t), i = Vo(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return _u(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Vo(Jo(t));
}
function Br(e) {
  const t = Ga(e);
  return ye(() => nl(t), [t]);
}
function Jo(e) {
  return e ? e.split(",").map(Number) : [];
}
async function ju(e, t, n) {
  if (!or(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Ke(e), o = n.steps.some((c) => rr(c.mode)) ? await Qc(r) : "", i = await Ba(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !rr(l.mode)),
    ...i.filter((l) => rr(l.mode))
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
async function Gi(e, t) {
  const n = e.occurrence;
  if (Ao(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await he("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        ir({
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
  return Ra(e.condition) && e.hideConfirmedAbsent !== !1;
}
function $o(e, t) {
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
    entityType: Ke(e),
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
                      key: Io,
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
async function zi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => To([n], t))
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
async function Vi(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || al(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = Ke(e), i = await aa(
    $o(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await zi(c, r) : [], f = new Array(i.items.length);
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
  const o = Ke(e), i = await yo(o, t.media.id);
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
function sr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Bu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function en(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? Hc(
      await yo(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await he(Bu(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return di(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await yo(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  di(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === bo
  ) ?? bo, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
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
async function Ji(e, t, n) {
  if (t.occurrence && Te(e))
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
        `/api/${zn(Ke(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Gu(e, t, n) {
  t.occurrence && Te(e) ? await ju(e, t.occurrence, n) : await li(Ke(e), n, [t.media.id]);
}
function ui(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: sr(o(t.ids), o(n.ids)),
    absence: sr(o(t.absent), o(n.absent))
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
let vo = "";
const fi = /* @__PURE__ */ new Set();
function Vu(e) {
  vo !== e && (vo = e, cl());
}
const Hi = () => vo ? `${vo}:history` : "";
function cl() {
  fi.forEach((e) => e());
}
function Ju(e) {
  fi.add(e);
  const t = (n) => {
    n.key === Hi() && e();
  };
  return window.addEventListener("storage", t), () => {
    fi.delete(e), window.removeEventListener("storage", t);
  };
}
const Os = (e) => Array.isArray(e) && e.every((t) => Number.isSafeInteger(t)), Rs = (e) => typeof e == "object" && e !== null && Os(e.added) && Os(e.removed);
function Hu(e) {
  var n;
  const t = e;
  return typeof e == "object" && e !== null && Number.isSafeInteger(t.mediaId) && Rs(t.tags) && Rs(t.absence) && (t.performer === void 0 || Number.isSafeInteger((n = t.performer) == null ? void 0 : n.id));
}
function Qu(e) {
  const t = e;
  return typeof e == "object" && e !== null && typeof t.id == "string" && typeof t.at == "number" && (t.kind === "video" || t.kind === "audio") && Array.isArray(t.items) && t.items.every(Hu);
}
function sa() {
  const e = Hi();
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
function xa(e, t) {
  const n = Hi();
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
  return t !== void 0 && xa(e.filter((l) => l.id !== t)), !1;
}
function Qi(e) {
  try {
    const t = e.items.filter((r) => r.undone || lo(r)), n = sa().filter((r) => r.id !== e.id);
    return t.some((r) => !r.undone) ? xa([{ ...e, items: t }, ...n].sort((r, o) => o.at - r.at), e.id) : (xa(n), !0);
  } catch {
    return !1;
  }
}
function Wu() {
  xa([]);
}
const lo = (e) => [e.tags, e.absence].some(
  (t) => t.added.length > 0 || t.removed.length > 0
);
function Wi(e, t, n, r, o) {
  var d, p, h, m;
  const i = (y) => o ? y.filter((N) => o.includes(N)) : y, s = sr(i(n.ids), i(r.ids)), c = sr(i(n.absent), i(r.absent)), l = {};
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
function Ho(e, t) {
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
  const n = ll(t), r = t.absence.added.length + t.absence.removed.length > 0, o = await en(e, n, r), i = Ho(t, o);
  if (!lo(i)) return { ...t, undone: !0, error: void 0 };
  il(Yu(i), o);
  const s = (p = i.performer) == null ? void 0 : p.id, c = r ? s === void 0 ? await Vc(e) : await Qc(e) : "", l = async (h, m) => {
    h.length && (s !== void 0 ? await Wc(c, e, i.mediaId, s, h, m) : await he(`/api/${zn(e)}/bulk`, {
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
        m.length && await he(`/api/${zn(e)}/bulk`, {
          method: "POST",
          body: JSON.stringify({ ids: [i.mediaId], tagMode: h, tagIds: m })
        });
    await l(i.absence.removed, "ADD");
  } catch (h) {
    const m = await en(e, n, r).catch(() => null), y = m ? Ho(i, m) : i;
    if (!lo(y)) return { ...t, undone: !0, error: void 0 };
    throw Object.assign(new Error(dl(h)), { left: y });
  }
  const f = await en(e, n, r), d = Ho(i, f);
  if (lo(d))
    throw Object.assign(new Error("Undo did not restore every affected tag."), { left: d });
  return { ...t, undone: !0, error: void 0 };
}
const dl = (e) => e instanceof Error ? e.message : "Request failed.";
async function Zu(e, t = () => {
}) {
  const n = sa().find((d) => d.id === e);
  if (!n) throw new Error("This change is no longer in the history.");
  const r = [...n.items], o = r.flatMap((d, p) => d.undone ? [] : [p]);
  let i = 0, s = 0, c = 0, l = Date.now();
  const f = () => {
    l = Date.now();
    const d = sa(), p = d.findIndex((h) => h.id === e);
    p >= 0 && (d[p] = { ...d[p], items: r }, xa(d));
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
const Qo = (e) => e.performer ? `${e.mediaId}:${e.performer.id}` : String(e.mediaId), Yi = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
function Ms(e) {
  const t = e.items.length, n = e.items.some((i) => i.performer), { one: r, many: o } = Vn(e.kind);
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
  ), i = Br(o), s = e.items.filter((p) => p.undone).length, c = e.items.filter((p) => !p.undone && p.error).length, l = e.items.length - s, [f, d] = C(e.items.length === 1);
  return X(() => {
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
            /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
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
  const n = lt(), r = $(null), o = $(null), [i, s] = C(sa), [c, l] = C(null), [f, d] = C(), [p, h] = C(""), [m, y] = C(!1), N = $(null), v = $(null);
  X(() => Ju(() => s(sa())), []), X(() => {
    var M, k;
    const D = document.activeElement;
    return (M = r.current) == null || M.showModal(), (k = o.current) == null || k.focus(), () => {
      D != null && D.isConnected && D.focus();
    };
  }, []);
  const w = $(!1);
  X(() => {
    var D, M, k;
    m ? (D = v.current) == null || D.focus() : w.current && ((k = ((M = N.current) == null ? void 0 : M.disabled) === !1 ? N.current : o.current) == null || k.focus()), w.current = m;
  }, [m]);
  const q = c !== null;
  async function L(D) {
    const M = new Set(D.items.filter((k) => !k.undone).map(Qo));
    l(D.id), y(!1), h(""), d({ done: 0, total: D.items.filter((k) => !k.undone).length });
    try {
      await Zu(D.id, (k, x) => d({ done: k, total: x }));
    } catch (k) {
      h(k instanceof Error ? k.message : String(k));
    } finally {
      l(null), d(void 0);
      const k = sa().find((x) => x.id === D.id) ?? D;
      t(
        k,
        k.items.filter((x) => x.undone && M.has(Qo(x))).map(Qo)
      ), requestAnimationFrame(() => {
        var x, _;
        (x = r.current) != null && x.contains(document.activeElement) || (_ = o.current) == null || _.focus();
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
      onCancel: (D) => {
        D.preventDefault(), q || e();
      },
      onClose: () => {
        var D;
        q ? (D = r.current) == null || D.showModal() : e();
      },
      children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
          /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("h2", { id: `${n}-title`, children: "Recent changes" }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-batch-close",
              "aria-label": "Close dialog",
              disabled: q,
              onClick: e,
              children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
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
          i.length ? i.map((D) => /* @__PURE__ */ a(
            nf,
            {
              record: D,
              busy: q,
              progress: c === D.id ? f : void 0,
              onUndo: () => void L(D)
            },
            D.id
          )) : /* @__PURE__ */ a("p", { className: "dq-history-empty", children: "No changes recorded yet." })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
          m ? /* @__PURE__ */ u(fe, { children: [
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
const to = (e) => e >= "0" && e <= "9";
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
    if (to(e[n]) && to(t[r])) {
      const c = n, l = r;
      for (; n < e.length && to(e[n]); ) n++;
      for (; r < t.length && to(t[r]); ) r++;
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
function _r(e) {
  return [...e].sort(ul);
}
const hi = /* @__PURE__ */ new Map();
function af(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function Xi(e, t, n) {
  const r = Sr(e), o = [], i = [];
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
    ...i.filter((h) => !rr(h.mode)),
    ...i.filter((h) => rr(h.mode))
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
  return _r(t);
}
function fl(e) {
  return hl(af(e));
}
function hl(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = C(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return X(() => (i.current = !0, () => {
    i.current = !1;
  }), []), X(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), To([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Dt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Ur(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = Dt(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Ps(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Dt(t.group) !== "");
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
  return Sr(e).size > 0 || ml(e).size > 0;
}
function sf(e) {
  return Ur(e).filter(
    (t) => !t.actions.some((n) => gl(e[n]))
  );
}
function pi(e, t) {
  const n = pl(t), r = new Set(t.absent);
  return Ur(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...Sr(e[c])], f = [...ml(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function mi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function cf(e, t, n) {
  const r = { ids: [...pl(t)], absent: t.absent }, o = Xi(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const oa = "review";
function lf(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function df(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function Pr(e, t) {
  const n = new Set(lf(e));
  return t.filter((r) => n.has(r.id));
}
function Ls(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of Pr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(oa, () => ({
        key: oa,
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
    ...i.filter((s) => s.key === oa),
    ...i.filter((s) => s.key !== oa)
  ];
}
function gi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function Zi(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => gi(s.key, s.members, o) && !(c > i && gi(o.key, o.members, s))
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
    (n) => n.key === e.key || gi(n.key, n.tagIds ?? [], e)
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
    ...n.filter((r) => r.key === oa),
    ...n.filter((r) => r.key !== oa)
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
function es(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [mf(e.mixed)] : []
  ];
}
function gf(e) {
  const t = es(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function bf(e, t, n) {
  const r = Pr(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const bi = "-", Ds = "Ctrl+a", yf = "Ctrl/⌘A", wf = ["f", "g", "k", "n", "m", ",", "."], Wo = "Shift+", wl = {
  ",": [";", "<"],
  ".": [":", ">"]
}, vf = new Set(Object.values(wl).flat()), _s = { Comma: ",", Period: "." };
function Nf(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(_s, t.code) ? _s[t.code] : void 0;
}
function ha(e) {
  return ye(() => Fc(e), [e]);
}
function ts({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = ha(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  jt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = yr.filter(
    (h) => s.actionOn.has(h) || wf.includes(h)
  ).join(" "), p = ye(() => {
    const h = (N, v) => {
      var q, L;
      const w = c.current;
      if (N === Ds) (q = w.onSelectAll) == null || q.call(w);
      else if (N === bi) (L = w.onFind) == null || L.call(w);
      else {
        const D = vf.has(N), M = D || N.startsWith(Wo), k = D ? Nf(v) : M ? N.slice(Wo.length) : N, x = k === void 0 ? void 0 : w.keyMap.actionOn.get(k);
        x !== void 0 && w.onAction(x, M);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Ds, "local")), l && y.push(m(bi));
    for (const N of d ? d.split(" ") : []) {
      const v = wl[N];
      y.push(m(N), ...(v ?? [`${Wo}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, d, l, f]);
  Ed(p, t);
}
const qf = {
  find: bi,
  selectAll: yf
};
function ns() {
  return qf;
}
const Sf = "(max-width: 760px)";
function vl(e) {
  const [t] = C(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = xn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Ci(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function za() {
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
function Gr(e, t, n = [], r) {
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
  const o = Sr(e), i = (s) => o.has(s) || [...o].some((c) => {
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
function Oo(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function rs({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = za(), [f, d] = C(""), [p, h] = C(0), m = $(null), y = $(null), N = $(null), v = $(null), w = $(null), q = $(/* @__PURE__ */ new Set()), L = lt(), D = Br(ye(() => Oo(e), [e])), M = ha(e), k = ye(() => {
    const U = f.trim().toLocaleLowerCase(), le = (T) => T ? yr.indexOf(T) : yr.length;
    return e.map((T, z) => ({ action: T, index: z, key: M.keys[z] })).sort((T, z) => le(T.key) - le(z.key)).filter((T) => !U || T.action.label.toLocaleLowerCase().includes(U));
  }, [e, M, f]), x = k.length ? Math.min(p, k.length - 1) : -1, _ = (U) => `${L}-option-${U}`;
  jt(() => {
    var U, le, T;
    return v.current = document.activeElement, w.current = ((le = (U = N.current) == null ? void 0 : U.parentElement) == null ? void 0 : le.closest('[role="dialog"]')) ?? null, (T = m.current) == null || T.focus({ preventScroll: !0 }), () => {
      var I;
      const z = v.current;
      z instanceof HTMLElement && z.isConnected && z.focus({ preventScroll: !0 }), document.activeElement !== z && ((I = w.current) != null && I.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), X(() => {
    var U, le, T;
    x < 0 || (T = (le = (U = y.current) == null ? void 0 : U.querySelector(`[id="${_(k[x].index)}"]`)) == null ? void 0 : le.scrollIntoView) == null || T.call(le, { block: "nearest" });
  }, [x, k]);
  function oe(U, le) {
    !U || r != null && r(U.action) || s(U.action, o && le);
  }
  function Y(U) {
    var T;
    U.stopPropagation();
    const le = U.code || U.key;
    if (U.repeat || q.current.add(le), !In(U)) {
      if (U.repeat && !q.current.has(le)) {
        U.preventDefault();
        return;
      }
      if (U.key === "Escape")
        U.preventDefault(), U.repeat || c();
      else if (U.key === "Enter")
        U.preventDefault(), U.repeat || oe(k[x], U.shiftKey);
      else if (U.key === "ArrowDown" || U.key === "ArrowUp") {
        if (U.preventDefault(), !k.length) return;
        const z = U.key === "ArrowDown" ? 1 : -1;
        h((x + z + k.length) % k.length);
      } else U.key === "Tab" && (U.preventDefault(), (T = m.current) == null || T.focus());
    }
  }
  return /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${l ? " dq-find-mobile" : ""}`,
        onKeyDown: Y,
        onMouseDown: (U) => {
          U.target !== m.current && U.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(Da, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: m,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${L}-list`,
                "aria-activedescendant": x >= 0 ? _(k[x].index) : void 0,
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
              id: `${L}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: k.map((U, le) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: _(U.index),
                  tabIndex: -1,
                  "aria-selected": le === x,
                  disabled: (r == null ? void 0 : r(U.action)) ?? !1,
                  onClick: (T) => oe(U, T.shiftKey || i && xc(U.action)),
                  children: [
                    l ? null : U.key ? /* @__PURE__ */ u(fe, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": $a(U.key) ? !0 : void 0, children: U.key }),
                      $a(U.key) && /* @__PURE__ */ u(fe, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: $a(U.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: U.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Gr(U.action, D, t, n).map(
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
function as(e) {
  return Ci(e.subscribe, e.get, e.get);
}
function ql(e, t) {
  const n = $(t);
  jt(() => {
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
const Ef = [], yi = Co.map(
  (e, t) => ({ indent: t, keys: e })
), js = yi.length - 1;
function _t({ binding: e, hidden: t }) {
  const n = t ? void 0 : $a(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(fe, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function no(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kl(e) {
  return Co.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function El({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(fe, { children: r.map((o, i) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
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
          /* @__PURE__ */ a(Da, { "aria-hidden": "true" }),
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
                /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(fe, { children: [
                /* @__PURE__ */ a(fa, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(fe, { children: [
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
  const y = ns(), N = ha(e), v = za();
  ql(i, v);
  const w = lt(), q = Br(
    ye(() => e.flatMap((j) => j.steps.flatMap((O) => O.tagIds)), [e])
  ), L = yi.filter((j) => j.keys.some((O) => N.actionOn.has(O))), D = L.includes(yi[js]), M = e.length - N.actionOn.size, k = ye(
    () => d && !f ? Ur(e) : [],
    [d, f, e]
  ), x = ye(
    () => k.length && r ? pi(e, r) : null,
    [k, e, r]
  ), _ = new Map(
    mi(x ?? []).flatMap(
      (j) => j.actions.filter((O) => gl(e[O])).map((O) => [O, j.name])
    )
  ), oe = ye(
    () => e.map((j) => f ? [] : pf(j, p, o)),
    [e, p, o, f]
  ), Y = (j) => j.map(gf).join("; "), U = oe.map(Y), le = k.length > 0 && /* @__PURE__ */ a(
    Af,
    {
      groups: k,
      statuses: x,
      actions: e,
      attentionOf: (j) => Y([
        ...new Map(
          j.actions.flatMap((O) => oe[O]).map((O) => [O.key, O])
        ).values()
      ])
    }
  ), T = (j) => {
    const O = Gr(e[j], q, [], o).map((ie) => ie.text).join(", "), A = _.get(j), H = U[j];
    return [
      O,
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
        children: /* @__PURE__ */ a(ar, {})
      }
    )
  ) : null, I = (j) => ({
    onMouseEnter: () => i.set(j),
    onMouseLeave: () => i.clear(j),
    onFocus: () => i.set(j),
    onBlur: () => i.clear(j)
  }), te = (j) => {
    const O = N.actionOn.get(j), A = O === void 0 ? void 0 : e[O];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(_t, { binding: j, hidden: !0 })
        },
        j
      );
    const H = t(A), ie = `${w}-effect-${j}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : I(A), children: [
      /* @__PURE__ */ a("span", { id: ie, className: "dq-sr-only", children: T(O) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": j,
          "aria-describedby": ie,
          "data-group-open": _.has(O) || void 0,
          "data-attention": U[O] ? !0 : void 0,
          disabled: H,
          onClick: (pe) => s(A, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(_t, { binding: j }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            no(A) && " ",
            no(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", title: "Marks absent", children: [
              /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-pad-marker-text", children: "absent" })
            ] }),
            z(O)
          ]
        }
      )
    ] }, j);
  }, ee = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const j = kl(N), O = (A) => {
      const H = e[A], ie = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: H.label,
          "aria-keyshortcuts": ie,
          "aria-describedby": `${w}-effect-${ie}`,
          "data-group-open": _.has(A) || void 0,
          "data-attention": U[A] ? !0 : void 0,
          disabled: t(H),
          onClick: (pe) => {
            i.clear(H), s(H, pe.shiftKey || h && xc(H));
          },
          ...f ? {} : Sl(i, H),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: H.label }),
            no(H) && " ",
            no(H) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
              "absent"
            ] }),
            z(A)
          ]
        },
        ie
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
            f ? ee : /* @__PURE__ */ a(
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
          le,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            El,
            {
              groups: j,
              renderAction: O,
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
  ] }), J = !D && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": M ? `Find action, ${M} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(_t, { binding: y.find }),
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
        /* @__PURE__ */ u("div", { className: `dq-pad-header${le ? " dq-pad-header-groups" : ""}`, children: [
          f ? ee : /* @__PURE__ */ a(
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
          le ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              le,
              me,
              J
            ] })
          ) : /* @__PURE__ */ u(fe, { children: [
            !f && me,
            J
          ] })
        ] }),
        L.map((j) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": j.indent, children: [
          j.keys.map(te),
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
                /* @__PURE__ */ a(_t, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(Da, { "aria-hidden": "true" }),
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
  const l = as(i), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && m < e.length && /* @__PURE__ */ u(fe, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(_t, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? Xi(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(_t, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Gr(l, n, [], o).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
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
  const y = ns(), N = ha(e), v = za(), w = lt(), q = Br(ye(() => Oo(e), [e])), [L] = C(() => Nl());
  ql(L, v);
  const D = $(null), M = Tf(D, e, !v), k = kl(N);
  !k.length && e.length && k.push([]);
  const x = k.flat(), _ = e.length - x.length, oe = (T) => Gr(T, q, t, n).map((z) => z.text).join(", "), Y = (T) => ({
    onMouseEnter: () => L.set(T),
    onMouseLeave: () => L.clear(T),
    onFocus: () => L.set(T),
    onBlur: (z) => {
      z.currentTarget.contains(z.relatedTarget) || L.clear(T);
    }
  }), U = l ?? (v ? void 0 : f), le = (T) => {
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
          L.clear(z), i(z);
        },
        ...m ? {} : Sl(L, z),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: z.label })
      },
      z.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: D,
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
                  renderAction: le,
                  find: /* @__PURE__ */ a(
                    Al,
                    {
                      extra: _,
                      findKey: y.find,
                      disabled: m,
                      onFind: s
                    }
                  )
                }
              ),
              !v && k.map((T, z) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                T.map((I) => {
                  const te = e[I], ee = N.keys[I];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: te.label,
                      "aria-keyshortcuts": ee || void 0,
                      "aria-describedby": `${w}-effect-${I}`,
                      disabled: m || r(te),
                      onClick: () => i(te),
                      ...m ? {} : Y(te),
                      children: [
                        ee && /* @__PURE__ */ a(_t, { binding: ee }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: te.label })
                      ]
                    },
                    te.id
                  );
                }),
                z === k.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": _ > 0 ? `Find action, ${_} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: m,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(_t, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(Da, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: _ > 0 ? `${_} more` : "Find action" })
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
          /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          $f,
          {
            actions: e,
            keyMap: N,
            preview: L,
            names: q,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ a("div", { hidden: !0, children: x.map((T) => /* @__PURE__ */ a("span", { id: `${w}-effect-${T}`, children: oe(e[T]) }, e[T].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Tf(e, t, n) {
  const [r, o] = C(!1);
  return jt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (x) => [...x.children].map((_) => _.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), q = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, L = (x) => y.map((_) => {
        let oe = 1, Y = 0;
        for (const U of _)
          Y > 0 && Y + v + U > x ? (oe += 1, Y = U) : Y += (Y > 0 ? v : 0) + U;
        return oe;
      }), D = (x) => Math.max(1, x.reduce((_, oe) => _ + oe, 0)), M = L(m), k = D(L(m - q));
      o(
        1 + D(M) < k || 1 + D(M) === k && M.every((x) => x === 1)
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
  const c = as(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(_t, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Gr(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const Ks = 1e3;
async function Of(e, t, n) {
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
          ir({
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
  const i = [...o.values()], s = Ke(e), c = Te(e) ? await Mf(
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
function Rf(e) {
  return JSON.stringify(
    ir({
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
              `/api/${zn(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: Rf(t[c])
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
    for (const r of Sr(n))
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
  const n = Dt(e);
  return ((r = Ur(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
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
  X(
    () => () => {
      for (const T of m.current.values()) T.abort();
    },
    []
  );
  const y = Vn(Ke(t)), N = Te(t), v = N ? "performer" : y.one;
  function w(T) {
    var I;
    (I = m.current.get(T)) == null || I.abort();
    const z = new AbortController();
    m.current.set(T, z), l((te) => ({ ...te, [T]: { status: "loading" } })), Of(t, T, z.signal).then(
      (te) => {
        z.signal.aborted || l((ee) => ({
          ...ee,
          [T]: { status: "ready", group: te }
        }));
      },
      (te) => {
        z.signal.aborted || l((ee) => ({
          ...ee,
          [T]: { status: "failed", message: _f(te) }
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
      return (j == null ? void 0 : j.status) === "ready" ? j.group.children.map((O) => O.id) : [];
    }, te = new Set(T.flatMap(I)), ee = z.flatMap(I).filter((J) => !te.has(J));
    d(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([j]) => !ee.includes(Number(j)))
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
  const L = i.flatMap((T) => {
    const z = c[T];
    return (z == null ? void 0 : z.status) === "ready" ? [z.group] : [];
  }), D = L.length === i.length, M = i.some(
    (T) => {
      var z;
      return (((z = c[T]) == null ? void 0 : z.status) ?? "loading") === "loading";
    }
  ), k = new Map(
    Ff(L).map((T) => [T.parent.id, T])
  ), x = xf(L), _ = new Map(L.map((T) => [T.parent.id, T.parent.name])), oe = Pf(t.actions), Y = (T) => f[T] ?? !oe.has(T), U = D ? [...k.values()].flatMap((T) => {
    const z = Df(T.parent.name, t.actions);
    return T.children.filter((I) => Y(I.id)).map((I) => ({ child: I, answerGroup: z }));
  }) : [], le = (T, z) => d((I) => ({
    ...I,
    ...Object.fromEntries(T.children.map((te) => [te.id, z]))
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
      Nr,
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
      const te = I.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: te }),
        z.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(fe, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[T] ?? !1,
                disabled: n,
                onChange: (ee) => h((me) => ({
                  ...me,
                  [T]: ee.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            te,
            " tree"
          ] }),
          I.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(fe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${te}`,
                  onClick: () => le(I, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${te}`,
                  onClick: () => le(I, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: I.children.map((ee) => {
              const me = oe.get(ee.id) ?? [], J = (x.get(ee.id) ?? []).filter((j) => j !== T).map((j) => `“${_.get(j)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: Y(ee.id),
                    disabled: n,
                    onChange: (j) => d((O) => ({
                      ...O,
                      [ee.id]: j.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  ee.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    ee.uses.toLocaleString(),
                    " ",
                    ee.uses === 1 ? y.one : y.many
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
              ] }, ee.id);
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
  const o = Dt(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: Dt(c) === o });
    return i;
  }
  const s = Dt(r);
  for (const c of t)
    Dt(c).includes(s) && i.push({ kind: "group", name: c, selected: Dt(c) === o });
  return s && !t.some((c) => Dt(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Kf(e) {
  return e.kind === "group" ? `group:${Dt(e.name)}` : e.kind;
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
]), zf = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), ro = 4, Bs = 240;
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
  const i = lt(), s = lt(), c = lt(), l = $(null), f = $(null), d = $(null), p = $(null), h = $(null), m = $([]), y = $(!1), N = $(!1), [v, w] = C(!1), [q, L] = C(null), [D, M] = C(null), [k, x] = C(!1), _ = e.group ?? "", oe = ye(
    () => Uf(t, n, _, q),
    [t, n, _, q]
  ), Y = oe.map(Kf), U = D === null ? -1 : Y.indexOf(D), le = (A) => `${s}-option-${A}`, T = (A) => o(A ? { ...e, group: A } : Bf(e)), z = () => {
    var H;
    const A = ((H = d.current) == null ? void 0 : H.value) ?? _;
    A.trim() !== A && T(A.trim());
  };
  function I(A) {
    L(null), M(A), w(!0);
  }
  const te = (A) => {
    var H, ie;
    return A instanceof Node && (((H = l.current) == null ? void 0 : H.contains(A)) || ((ie = p.current) == null ? void 0 : ie.contains(A))) === !0;
  };
  function ee() {
    var A, H;
    (A = p.current) != null && A.contains(document.activeElement) && ((H = h.current) == null || H.focus({ preventScroll: !0 })), w(!1), L(null), M(null), x(!1);
  }
  function me(A) {
    A.kind === "group" && A.selected && q === null || T(A.kind === "none" ? "" : A.name), ee();
  }
  function J() {
    const A = f.current, H = p.current;
    if (!A || !H) return;
    const ie = A.getBoundingClientRect(), pe = window.visualViewport, G = (pe == null ? void 0 : pe.offsetTop) ?? 0, Pe = (pe ? pe.offsetTop + pe.height : window.innerHeight) - ie.bottom - ro, ge = ie.top - G - ro, ht = Math.min(H.scrollHeight, Bs), ke = Pe < ht && ge > Pe;
    H.style.left = `${ie.left}px`, H.style.width = `${ie.width}px`, H.style.top = `${ke ? ie.top - ro : ie.bottom + ro}px`, H.style.transform = ke ? "translateY(-100%)" : "", H.style.maxHeight = `${Math.max(0, Math.min(Bs, ke ? ge : Pe))}px`, Jf(A, H, ie, m.current) || ee();
  }
  jt(() => {
    var A;
    v && (f.current && (m.current = Vf(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), x(!0)), N.current = !1);
  }, [v]), jt(() => {
    v && J();
  }), X(() => {
    if (!v) return;
    const A = () => J(), H = (G) => {
      te(G.target) || ee();
    }, ie = [...m.current, window], pe = window.visualViewport;
    for (const G of ie) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), pe == null || pe.addEventListener("resize", A), pe == null || pe.addEventListener("scroll", A), document.addEventListener("pointerdown", H), () => {
      for (const G of ie) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), pe == null || pe.removeEventListener("resize", A), pe == null || pe.removeEventListener("scroll", A), document.removeEventListener("pointerdown", H);
    };
  }, [v]), X(() => {
    var A, H, ie;
    U >= 0 && ((ie = (H = (A = p.current) == null ? void 0 : A.children[U]) == null ? void 0 : H.scrollIntoView) == null || ie.call(H, { block: "nearest" }));
  }, [U]);
  function j(A) {
    if (In(A)) return;
    const H = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (H && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), I(A.altKey ? null : Dt(_) ? `group:${Dt(_)}` : "none");
      return;
    }
    if (v)
      if (H) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && ee();
          return;
        }
        const ie = A.key === "ArrowDown" ? 1 : -1, pe = q !== null && Dt(q) && Y.length > 1 ? 1 : 0, G = U < 0 ? ie > 0 ? pe : Y.length - 1 : (U + ie + Y.length) % Y.length;
        M(Y[G]);
      } else A.key === "Enter" && (A.preventDefault(), U >= 0 ? me(oe[U]) : (z(), ee()));
  }
  function O(A) {
    var ie;
    if (A.key === "Tab") {
      ee(), A.shiftKey && ((ie = d.current) == null || ie.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || In(A) && !zf.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const pe = d.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Gf.has(A.key) && !In(A) && x(!1), j(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || In(A) || (A.preventDefault(), A.stopPropagation(), ee());
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
                "aria-activedescendant": v && U >= 0 ? le(U) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: _,
                onChange: (A) => {
                  T(A.target.value), L(A.target.value), M(null), w(!0);
                },
                onClick: () => {
                  v || I(null);
                },
                onKeyDown: j,
                onBlur: () => {
                  ee(), z();
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
                  var ie;
                  const A = y.current;
                  y.current = !1;
                  const H = document.activeElement === d.current;
                  v ? ee() : (N.current = A && !H, I(null)), (!A || H) && ((ie = d.current) == null || ie.focus());
                },
                children: /* @__PURE__ */ a($i, { "aria-hidden": "true" })
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
              "aria-activedescendant": U >= 0 ? le(U) : void 0,
              "data-tap-focus": k || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: O,
              onBlur: (A) => {
                te(A.relatedTarget) || ee();
              },
              children: oe.map((A, H) => /* @__PURE__ */ u(
                "li",
                {
                  id: le(H),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": H === U || void 0,
                  onMouseMove: () => {
                    H !== U && M(Y[H]);
                  },
                  onClick: () => me(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(fa, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                Y[H]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const mr = [
  ...Co,
  ["auto", wr]
];
function Il(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : xi(e[n]);
}
function Qf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = C(!1), c = $(null), l = n.keys[t], f = Il(e, n, t), d = Dr(f), p = n.duplicatePins.has(t) ? ` (${Ma(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${Ma(l)}, ${d ? "pinned" : "Auto"}${p}` : f === wr ? "no key, Find action only" : `no key: Auto found no free key${p}`, m = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(fe, { children: [
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
          l ? /* @__PURE__ */ a(_t, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
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
  jt(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Dr(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function m(N) {
    var k, x, _;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), i();
      return;
    }
    if (N.key === "Tab") {
      const oe = [...((k = s.current) == null ? void 0 : k.querySelectorAll("button[tabindex='0']")) ?? []], Y = oe.indexOf(document.activeElement);
      N.preventDefault(), (x = oe[(Y + (N.shiftKey ? -1 : 1) + oe.length) % oe.length]) == null || x.focus();
      return;
    }
    const v = (_ = N.target.dataset) == null ? void 0 : _.choice, w = v ? mr.findIndex((oe) => oe.includes(v)) : -1;
    if (!v || w < 0) return;
    const q = mr[w].indexOf(v), L = (oe) => oe == null ? void 0 : oe[Math.min(q, oe.length - 1)], D = {
      ArrowLeft: mr[w][q - 1],
      ArrowRight: mr[w][q + 1],
      ArrowUp: L(mr[w - 1]),
      ArrowDown: L(mr[w + 1]),
      Home: mr[w][0],
      End: mr[w].at(-1)
    };
    if (!Object.hasOwn(D, N.key)) return;
    N.preventDefault();
    const M = D[N.key];
    M && h(M);
  }
  const y = (N) => {
    const v = Dr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: xi(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(fe, { children: [
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Co.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const q = y(w), L = q ? `${q.own ? "this action" : q.label}, ${q.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${q ? "" : " dq-key-choice-free"}${q != null && q.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${Ma(w)}: ${L}`,
                "aria-pressed": !!(q != null && q.own && q.pinned),
                title: q ? `${q.label} (${q.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => o(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(_t, { binding: w }),
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
                "data-choice": wr,
                tabIndex: 0,
                "aria-pressed": l === wr,
                onClick: () => o(wr),
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
  if (or(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Pi(e)) return "Contradictory assessments";
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
  const l = ze(e), f = l !== "tag", d = e.actions, p = ha(d), h = Br(ye(() => Oo(d), [d])), m = ye(
    () => f ? Ur(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === i), N = ye(
    () => f && y >= 0 ? Ur(
      d.filter((G, we) => we !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ye(
    () => new Set(
      v ? sf(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [q, L] = C(""), [D, M] = C(!1), [k, x] = C(
    null
  ), _ = lt(), oe = `${_}-from-tags`, Y = $(null), U = $(null), le = $(null), T = $(null), z = $(/* @__PURE__ */ new WeakMap()), I = (G) => {
    let we = z.current.get(G);
    return we || (we = crypto.randomUUID(), z.current.set(G, we)), we;
  }, te = q.trim().toLocaleLowerCase(), ee = te ? d.filter((G) => G.label.toLocaleLowerCase().includes(te)) : d, me = (G) => t({ ...e, actions: G }), J = (G, we) => me(d.map((Pe, ge) => ge === G ? we : Pe));
  function j(G) {
    var we;
    return [...((we = le.current) == null ? void 0 : we.querySelectorAll("[data-action-id]")) ?? []].find(
      (Pe) => Pe.dataset.actionId === G
    );
  }
  function O(G, we) {
    const Pe = j(G), ge = Pe == null ? void 0 : Pe.querySelector(
      we === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ge == null || ge.focus(), !!ge;
  }
  jt(() => {
    var we;
    const G = T.current;
    G && (T.current = null, (G === "add" || !O(G.id, G.part)) && ((we = U.current) == null || we.focus()));
  }), X(() => {
    !c || !i || (ee.some((G) => G.id === i) ? O(i, "label") : (L(""), T.current = { id: i, part: "label" }));
  }, [c]);
  function A() {
    const G = eh(l);
    L(""), me([...d, G]), s(G.id), T.current = { id: G.id, part: "label" };
  }
  function H(G) {
    const we = d[G], { shortcut: Pe, ...ge } = structuredClone(we), ht = {
      ...ge,
      ...Pe === wr ? { shortcut: Pe } : {},
      id: crypto.randomUUID(),
      label: `${we.label} copy`
    };
    me([...d.slice(0, G + 1), ht, ...d.slice(G + 1)]), s(ht.id), T.current = { id: ht.id, part: "label" };
  }
  function ie(G) {
    const we = d[G], Pe = ee.indexOf(we), ge = ee[Pe + 1] ?? ee[Pe - 1];
    me(d.filter((ht, ke) => ke !== G)), i === we.id && s(null), T.current = ge ? { id: ge.id, part: "toggle" } : "add";
  }
  function pe() {
    M(!1), requestAnimationFrame(() => {
      var G;
      return (G = Y.current) == null ? void 0 : G.focus();
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
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: Y,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": D,
            "aria-controls": D ? oe : void 0,
            onClick: () => {
              x(null), M(!D);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(Da, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: q,
              onChange: (G) => L(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && q && !In(G) && (G.preventDefault(), G.stopPropagation(), L(""));
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
              "aria-describedby": `${_}-groups-note`,
              onChange: (G) => t({
                ...e,
                stayUntilGroupsAnswered: G.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${_}-groups-note`, children: v && !m.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (k == null ? void 0 : k.actions) === d ? `Added ${k.count} action${k.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && D && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || In(G) || (G.preventDefault(), G.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          jf,
          {
            id: oe,
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
    /* @__PURE__ */ a("div", { ref: le, children: ee.length > 0 && /* @__PURE__ */ a(
      bc,
      {
        items: ee,
        getKey: (G) => G.id,
        disabled: o || !!te,
        className: "dq-action-list",
        onReorder: (G) => me(G),
        renderItem: (G, { dragHandleProps: we, isOver: Pe }) => {
          const ge = d.indexOf(G), ht = i === G.id;
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
                  onChoose: (ke) => me(tu(d, ge, ke))
                }
              ),
              takenPin: p.duplicatePins.has(ge) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(Dt(G.group)),
              effect: Gr(G, h, n, r),
              open: ht,
              detailId: `${_}-detail-${G.id}`,
              dragHandleProps: we,
              isOver: Pe,
              reorderDisabled: o || !!te,
              onToggle: () => s(ht ? null : G.id),
              onDuplicate: () => H(ge),
              onDelete: () => ie(ge),
              children: "steps" in G ? /* @__PURE__ */ a(
                rh,
                {
                  action: G,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: Te(e),
                  saving: o,
                  stepKey: I,
                  rememberStepKey: (ke, Ve) => z.current.set(ke, I(Ve)),
                  onChange: (ke) => J(ge, ke)
                }
              ) : /* @__PURE__ */ a(
                oh,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (ke) => J(ge, ke)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !ee.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
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
  const N = e.label.trim() || "New action", v = Zf(e, t), w = "steps" in e && Dt(e.group) ? e.group.trim() : "";
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
                children: i.map((q, L) => /* @__PURE__ */ a("span", { "data-effect-tone": q.tone, children: q.text }, L))
              }
            ),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", title: v, children: [
              /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: v })
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${Ma(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${Ma(r)} is pinned twice` })
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(ko, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a($i, { "aria-hidden": "true" })
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
  const l = lt(), f = $(null), d = $(null);
  jt(() => {
    var m, y;
    const h = d.current;
    h != null && (d.current = null, (y = (m = f.current) == null ? void 0 : m.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(fe, { children: [
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
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
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
          Nr,
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
            children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
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
  return /* @__PURE__ */ u(fe, { children: [
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
const Ol = Sd(!1);
function ih({ children: e }) {
  return /* @__PURE__ */ a(Ol.Provider, { value: !0, children: e });
}
function pn({ tag: e, name: t }) {
  const n = kd(Ol), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Ad, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function sh({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Vn(Ke(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      Nr,
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
  const n = Vn(Ke(e)).many, r = e.occurrence, o = Rc(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ga([
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
          /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(pn, { tag: s[d.tagId], name: h })
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
            children: /* @__PURE__ */ a(ko, { "aria-hidden": "true" })
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
const Rl = {
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
  video: Eo,
  audio: Ic,
  tag: Cc,
  performerOccurrence: Ac,
  audioPerformerOccurrence: Ld
};
function Fl({ entityType: e }) {
  const t = lh[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Rl[e] });
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
function os(e) {
  xl([e], uh(e));
}
async function fh(e) {
  if (e.size > dh) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Ua(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function ca(e) {
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
  return /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: ze(e),
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
  const n = ze(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function ph({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), o = lt(), i = lt();
  return X(() => {
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
    () => Te(e) && e.occurrence.tagIds.length > 0
  ), [q, L] = C(""), [D, M] = C(null), [k, x] = C(0), [_, oe] = C(!1), Y = $(null), U = $(null), le = $(null), T = hh(e, w), z = ze(e), I = ye(() => ca(e), [e]);
  X(() => L(""), [I]), X(() => {
    var O, A;
    if (_) return;
    const J = Y.current;
    if (Y.current = null, !J) return;
    (A = J.isConnected && !!((O = le.current) != null && O.contains(J)) && !(J instanceof HTMLButtonElement && J.disabled) ? J : le.current) == null || A.focus({ preventScroll: !0 });
  }, [_]);
  function te() {
    if (!(s || _)) {
      if (!f) {
        m();
        return;
      }
      Y.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, oe(!0);
    }
  }
  function ee() {
    const J = { ...e, name: e.name.trim() }, j = Fa(J);
    if (!j) {
      L(""), h();
      return;
    }
    if (L(j), !J.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = U.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const O = e.actions.find(
      (A) => !or(A, z)
    );
    O && (v("Actions"), M(O.id), x((A) => A + 1));
  }
  const me = q || l;
  return /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (J) => {
          le.current = J, y && (y.current = J);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (J) => {
          J.key !== "Escape" || J.defaultPrevented || s || In(J) || (J.preventDefault(), J.stopPropagation(), te());
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
                onClick: te,
                children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
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
                  Te(e) && /* @__PURE__ */ a(ch, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => os(e),
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
                    expandedId: D,
                    onExpand: M,
                    reveal: k
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
                children: /* @__PURE__ */ a(sh, { review: e, onChange: t })
              }
            )
          ] }) }),
          (me || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            me && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
              me
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: te, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": s || void 0,
                "aria-disabled": s || void 0,
                disabled: !s && c,
                onClick: () => {
                  s || ee();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    _ && /* @__PURE__ */ a(
      ph,
      {
        onKeepEditing: () => oe(!1),
        onDiscard: () => {
          Y.current = null, oe(!1), m();
        }
      }
    )
  ] });
}
function mh({
  review: e,
  onChange: t
}) {
  const n = lt(), r = e.view, o = (d) => t({ ...e, view: { ...r, ...d } }), i = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (ze(e) === "tag")
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
  return /* @__PURE__ */ u(fe, { children: [
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
            Nr,
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
        Nr,
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
  const n = lt(), [r, o] = C(null), i = e.find((c) => c.key === r), s = (c, l) => t(
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
            children: /* @__PURE__ */ a(ko, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || In(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          yc,
          {
            open: !0,
            onClose: () => o(null),
            criteria: So,
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
  const o = lt();
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
  const s = lt(), c = lt();
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
const wi = "The queue differs from the saved review.";
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
  const w = kh(v), [q, L] = C({ differs: h, text: "" });
  return q.differs !== h && L({
    differs: h,
    text: h ? q.differs === !1 ? wi : q.text : ""
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
          children: /* @__PURE__ */ a(ja, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Rl[n], children: /* @__PURE__ */ a(Fl, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(da, { "aria-hidden": "true" })
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
  const n = lt(), r = lt(), o = `${wi} Save these filters to the review.`, i = e.onSave ? `${wi} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(fe, { children: [
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
function uo(e) {
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
  for (let i = 1; i <= o.length && !uo(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !uo(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return uo(e) ? !0 : (r(), !1);
}
function Sh(e) {
  const t = vl(qh), [n, r] = C(0), o = $(!1);
  jt(() => {
    e.current && (o.current = !Vs(e.current, t));
  }, [e, t, n]), jt(() => {
    const i = e.current;
    i && t && !o.current && !uo(i) && (o.current = !Vs(i, t));
  }), X(() => {
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
  return X(() => {
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
  X(() => {
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
        children: /* @__PURE__ */ a(ja, { "aria-hidden": "true" })
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
          In(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
          /* @__PURE__ */ a(Oi, { "aria-hidden": "true" }),
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
function is({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = C(!1), [i, s] = C(!1), c = $(null), l = $(null), f = lt();
  jt(() => {
    if (!r || !l.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), m = l.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < m && h.top > y);
  }, [r]), X(() => {
    var h, m;
    r && ((m = (h = l.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus({ preventScroll: !0 }));
  }, [r]), X(() => {
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
    r && /* @__PURE__ */ u(fe, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: l,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(Ii, { children: [
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
function No(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function ss(e) {
  return String(e.type).toLowerCase() === "tag";
}
function cs(e) {
  return !!String(e ?? "").trim();
}
function ls(e) {
  return [
    ...new Set(
      No(e.customFieldCriteria).filter(ss).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !cs(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function ds(e, t) {
  const n = No(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!ss(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !cs(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function Ul(e, t, n) {
  const r = No(e.customFieldCriteria);
  if (!r.length) return e;
  const o = No(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!ss(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(l[p] ?? "")];
      m && l[h] === m && !cs(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
class Kl extends Error {
}
const vi = (e) => e instanceof Error ? e.message : "Request failed.", Js = (e) => [...e].sort((t, n) => t - n), Pa = (e, t) => JSON.stringify(Js(e)) === JSON.stringify(Js(t)), Ni = (e) => !!(e.tags.added.length || e.tags.removed.length);
function qo(e, t, n, r) {
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
    (h) => !or(h, e.entityType) || !h.steps.length || h.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = Ra(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await zi(o.occurrence, n) : [];
  await Ch(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await Ba(h, n)
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
  const d = await Gi(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const m = await Vi(o, d, h, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = qo(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: Pa(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(p.size), h * 250 >= m.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    id: Yi(),
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
  if (!Pa(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Pa(o(e), o(t));
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
        if (s = await en(Ke(e.review), i.item, !1), !Th(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = vi(h);
        return;
      }
      const c = qo(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = sr(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Ji(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await en(Ke(e.review), i.item, !1);
        p = !0, i.expected = h;
        const m = ui(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = Ni(m) ? m : void 0, d) throw d;
        if (!Pa(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = vi(h), !p)
          try {
            const m = await en(Ke(e.review), i.item, !1);
            i.expected = m;
            const y = ui(
              i.item,
              i.before,
              m,
              e.touched
            );
            i.operation = Ni(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Oh(e, t, n) {
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
        const c = await en(Ke(e.review), r.item, !1);
        il(o, c), s = !0, await Ji(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await en(Ke(e.review), r.item, !1);
        if (!Pa(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${vi(c)}`, r.status = "failed", s)
          try {
            const l = await en(Ke(e.review), r.item, !1), f = ui(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = Ni(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
function Hs(e) {
  return Qi({
    id: e.id,
    at: e.recordedAt ?? (e.recordedAt = Date.now()),
    label: `Batch: ${e.actions.map((t) => t.label).join(", ")}`,
    reviewName: e.review.name,
    reviewId: e.review.id,
    kind: Ke(e.review),
    items: e.entries.flatMap(
      (t) => t.operation ? [
        Wi(
          t.item,
          Di(t.item.media, Ke(e.review)),
          t.operation.before,
          t.operation.after,
          [...t.operation.tags.added, ...t.operation.tags.removed]
        )
      ] : []
    )
  });
}
const Vl = (e, t) => t.count - e.count || ul(e, t);
async function Rh(e, t, n) {
  const r = Ke(e), o = e.occurrence, [i, s] = await Promise.all([
    he(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    zi(o, n)
  ]), c = i.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  di(c.map((y) => y.tag));
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
    (s) => [...Sr(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function us(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const o = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Vl), i = (m) => m.members ?? m.tags.map((y) => y.id), s = Ur(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...Sr(t[N])]))
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
const Yo = { summary: null, error: "" };
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
    value: Yo
  });
  return X(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Yo }), e === null || t === null) return;
    const c = new AbortController();
    return Rh(e, t, c.signal).then((l) => {
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
  }, [o, n]), i.key === o ? i.value : Yo;
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
  const i = Dt(e.name), s = [...r].filter((f) => Dt(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function xh(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function qi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = hi,
  flags: i = [],
  className: s = ""
}) {
  const c = Vn(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? us(e, r, o) : [], d = Zi(f), p = (h) => [
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
                    /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(pn, { tag: v }),
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
function ia({
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
]), Si = [
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
}, Xo = 250;
function Ta(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Dh({ step: e }) {
  const t = Si.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Si.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(fa, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Xs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(Ii, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function Ia({
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
        n && /* @__PURE__ */ u(fe, { children: [
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
    _r(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(pn, { tag: o })
    ] }) }, `added-${o.id}`)),
    _r(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(pn, { tag: o })
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
      t.length > Xo && /* @__PURE__ */ u("span", { children: [
        "First ",
        Xo.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, Xo).map((i) => {
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
                Ta(i, n)
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
  const [s, c] = C(!1), [l, f] = C("answers"), [d, p] = C(null), [h, m] = C({}), [y, N] = C([]), [v, w] = C(!1), [q, L] = C(!1), [D, M] = C(""), [k, x] = C(!1), [_, oe] = C(""), [Y, U] = C(null), [le, T] = C(!0), [z, I] = C(null), [te, ee] = C([]), [me, J] = C(0), j = $(null), O = $(null), A = $(null), H = $(!1), ie = $(!1), pe = $(null), G = $(!1), we = $(!1), Pe = $({ onClose: i });
  Pe.current = { onClose: i };
  const ge = lt(), ht = l === "run", ke = (Y == null ? void 0 : Y.kind) === "undo", Ve = ht && d ? d.review : e, tt = ha(Ve.actions), Ae = Ve.occurrence, $e = Ke(Ve), Ct = Vn($e), Tn = Ct.queue, It = ht && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((R) => R.steps.length && !vr(R))
  ), nt = It.filter((R) => y.includes(R.id)), Re = Ae.targetMode === "selected" && Ae.performerIds.length === 1, sn = Jl(
    Ve,
    s && Re ? Ae.performerIds[0] : null,
    me
  ), rt = ls(Ve.view.objectFilter), Vt = Ga(
    s ? [...Oo(It), ...Ae.conditionTagIds, ...rt] : []
  ), cr = ye(() => nl(Vt), [Vt]), Tt = (R) => h[R] ?? Vt[R] ?? { id: R, name: `Tag ${R}` }, at = JSON.stringify(
    Object.fromEntries(
      rt.flatMap((R) => {
        var se;
        const B = (se = Vt[R]) == null ? void 0 : se.name;
        return B ? [[String(R), B]] : [];
      })
    )
  ), qe = ye(
    () => ds(Ve.view.objectFilter, JSON.parse(at)),
    [Ve.view.objectFilter, at]
  );
  X(() => {
    var R, B, se;
    s && ((R = j.current) == null || R.showModal(), (se = (B = j.current) == null ? void 0 : B.querySelector(".dq-batch-answer input")) == null || se.focus());
  }, [s]), X(() => {
    if (!s) return;
    const R = requestAnimationFrame(() => {
      var Oe;
      const B = j.current, se = document.activeElement;
      if (!B || se && se !== document.body && B.contains(se)) return;
      (Oe = (l === "answers" ? B.querySelector(".dq-batch-answer input:checked") ?? B.querySelector(".dq-batch-answer input") : B.querySelector("[data-batch-focus]")) ?? O.current) == null || Oe.focus();
    });
    return () => cancelAnimationFrame(R);
  }, [s, l, q, d]), X(() => {
    if (s || t || !H.current) return;
    const R = requestAnimationFrame(() => {
      const B = A.current;
      if (!H.current || !B || B.disabled) return;
      H.current = !1;
      const se = document.activeElement;
      (!se || se === document.body) && B.focus();
    });
    return () => cancelAnimationFrame(R);
  }, [s, t]), X(() => {
    if (!s || Ae.targetMode !== "selected") return;
    const R = new AbortController();
    return ee([]), Ph(Ae.performerIds.slice(0, Qs), R.signal).then((B) => {
      R.signal.aborted || ee(B);
    }).catch(() => {
    }), () => R.abort();
  }, [s, Ae.targetMode, JSON.stringify(Ae.performerIds)]), X(
    () => () => {
      var R;
      ie.current = !0, (R = pe.current) == null || R.abort();
    },
    []
  ), X(() => {
    if (!q) return;
    const R = (B) => {
      B.preventDefault(), B.returnValue = "";
    };
    return window.addEventListener("beforeunload", R), () => window.removeEventListener("beforeunload", R);
  }, [q]);
  function Jt() {
    f("answers"), T(!0), p(null), m({}), U(null), w(!1), N([]), oe(""), M(""), x(!1), I(null);
  }
  function Ue() {
    we.current || (c(!1), Pe.current.onClose(G.current), G.current = !1, Jt(), H.current = !0);
  }
  function Ln(R, B) {
    N(
      (se) => B ? [...se, R] : se.filter((Ne) => Ne !== R)
    ), p(null), m({}), oe(""), M(""), x(!1), I(null);
  }
  function Jn() {
    f("answers"), I(null), oe("");
  }
  function Vr() {
    f("preview"), d || mn();
  }
  function cn() {
    var R;
    ie.current = !0, (R = pe.current) == null || R.abort(), oe("Stopping after in-flight operations settle…");
  }
  function Ot(R) {
    I(
      (B) => (B == null ? void 0 : B.group) === R.group && B.reason === R.reason ? null : R
    );
  }
  const Ht = (R, B) => (z == null ? void 0 : z.group) === R && z.reason === B;
  async function mn() {
    if (!nt.length || we.current) return;
    we.current = !0, L(!0), M(""), x(!1), oe("Loading all matching occurrences…"), p(null), m({}), I(null);
    const R = new AbortController();
    pe.current = R;
    try {
      const B = await Ih(
        e,
        nt,
        R.signal,
        (Ne) => oe(`Loaded ${Ne.toLocaleString()} matching occurrences…`)
      );
      R.signal.throwIfAborted();
      const se = {};
      for (const Ne of B.entries)
        for (const Oe of Ne.before.applications ?? [])
          se[Oe.tag.id] = Oe.tag;
      m(se), p(B), oe("Preview ready. No tags have been changed.");
    } catch (B) {
      M(
        R.signal.aborted ? "Preview cancelled. No tags were changed." : B instanceof Error ? B.message : String(B)
      ), x(!R.signal.aborted && B instanceof Kl), oe("");
    } finally {
      we.current = !1, L(!1), pe.current = null;
    }
  }
  async function gn(R) {
    if (!d || we.current) return;
    const B = (R === "undo" ? zl(d) : Gl(d, R === "retry")).length;
    we.current = !0, ie.current = !1, G.current = !0, L(!0), f("run"), M(""), U({ kind: R, total: B, done: 0, stopped: !1 }), oe(
      R === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    let se = Date.now(), Ne = !0;
    const Oe = () => {
      U((W) => W && { ...W, done: W.done + 1 }), Ne && Date.now() - se > 3e3 && (Ne = Hs(d), se = Date.now());
    };
    let Me = !1;
    try {
      R === "undo" ? await Oh(d, () => ie.current, Oe) : await $h(d, v, () => ie.current, Oe, R === "retry");
      const { counts: W } = tc(d.entries), Ye = W.skipped + W.failed;
      oe(
        ie.current ? "Stopped after in-flight operations settled. Completed changes are retained." : R === "undo" ? `Batch undo finished.${W.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${W.changed.toLocaleString()} changed`,
          W.unchanged && `${W.unchanged.toLocaleString()} unchanged`,
          W.skipped && `${W.skipped.toLocaleString()} skipped`,
          W.failed && `${W.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${Ye ? " Inspect them below." : ""}`
      );
    } catch (W) {
      Me = !0, oe(""), M(W instanceof Error ? W.message : String(W));
    } finally {
      T(Hs(d)), we.current = !1;
      const W = ie.current || Me;
      U((Ye) => Ye && { ...Ye, stopped: W }), L(!1), J((Ye) => Ye + 1);
    }
  }
  const ot = (d == null ? void 0 : d.entries) ?? [], lr = ye(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map((R) => [
        R.item.key,
        qo(R.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), Hn = (R) => lr.get(R.item.key), be = (R) => sr(R.before.ids, Hn(R).desired), ln = (R) => {
    const B = be(R);
    return R.status === "pending" && (B.added.length > 0 || B.removed.length > 0);
  }, Qn = (R) => R.conflict || Hn(R).kept.length > 0 || Hn(R).replaced.length > 0, Dn = ye(() => {
    const R = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: R.filter(ln).length,
      correct: R.filter((B) => B.status === "unchanged").length,
      different: R.filter(Qn).length,
      hosts: new Set(R.map((B) => B.item.media.id)).size,
      added: [...new Set(R.flatMap((B) => be(B).added))],
      removed: [...new Set(R.flatMap((B) => be(B).removed))]
    };
  }, [lr]), bn = ye(
    () => ((d == null ? void 0 : d.entries) ?? []).filter((R) => R.item.media.date).sort((R, B) => R.item.media.date.localeCompare(B.item.media.date)),
    [d]
  ), Je = ht ? tc(ot) : null, Nt = (R) => tt.keys[Ve.actions.findIndex((B) => B.id === R)] ?? "", de = (R) => Gr(R, cr, [], r), K = Ra(Ae.condition) && Ae.includeSubtags !== !1 && Ae.conditionTagIds.length > 0, Ee = bn[0], Le = bn.length > 1 ? bn[bn.length - 1] : void 0, dn = (R) => `/${$e}/${R.item.media.id}`, ue = Re ? te[0] : void 0, Jr = ye(
    () => n ? bl(
      n,
      sn.summary ? Zi(
        us(sn.summary, Ve.actions, r ?? hi)
      ) : []
    ) : [],
    [n, sn.summary, Ve.actions, r]
  ), Rt = hf(nt, Jr, r ?? hi), un = n ?? [], pt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: ln },
    correct: { title: "Occurrences already correct", test: (R) => R.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Qn }
  };
  function qt() {
    const R = Lh[Ae.condition], B = !!R && Ae.conditionTagIds.length > 0, se = Ae.performerIds.slice(0, Qs), Ne = String(Ve.view.filter.q ?? "").trim(), Oe = Ae.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Ao(Ae) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : Ae.targetMode === "selected" ? /* @__PURE__ */ u(fe, { children: [
        se.map((Me, W) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(ia, { performer: { id: Me, name: te[W] ?? "" } }),
          te[W] ?? "…"
        ] }, Me)),
        Ae.performerIds.length > se.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (Ae.performerIds.length - se.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(fe, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              Oa,
              {
                filter: {},
                objectFilter: Ae.performerFilter,
                criteriaDefinitions: Ti,
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
        B ? R : Ri[Ae.condition],
        B && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: _r(Ae.conditionTagIds.map(Tt)).map((Me) => /* @__PURE__ */ a(pn, { tag: Me }, Me.id)) })
      ] }),
      B && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: Ae.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Ra(Ae.condition) && Ae.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: Oe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          Oe
        ] })
      ] }),
      Ne && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ne,
        "”"
      ] }),
      Object.keys(Ve.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Tn} filters`,
          children: /* @__PURE__ */ a(
            Oa,
            {
              filter: Ve.view.filter,
              objectFilter: qe,
              criteriaDefinitions: $e === "audio" ? wc : So,
              customFieldEntityType: $e,
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
  function tn(R, B, se = !0) {
    if (!R.length) return null;
    const Ne = /* @__PURE__ */ a("strong", { children: ue || "This performer" }), Oe = se ? `Check the earliest and latest ${Ct.many} before applying, or narrow the batch with a date filter.` : "", Me = R.every((W) => W.tagIds === null && !W.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Me ? /* @__PURE__ */ u("p", { children: [
          Ne,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: R.flatMap((W) => W.flags).join(", ") }),
          ".",
          " ",
          Oe
        ] }) : /* @__PURE__ */ u(fe, { children: [
          /* @__PURE__ */ u("p", { children: [
            Ne,
            " needs attention where the chosen answers apply.",
            Oe && ` ${Oe}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: R.map((W) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: W.tagIds === null ? "Whole review" : W.name }),
            ":",
            " ",
            es(W).join("; ")
          ] }, W.key)) })
        ] }),
        B && Ee && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: dn(Ee), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            Ta(Ee, $e),
            " · ",
            Ee.item.media.date
          ] }),
          Le && /* @__PURE__ */ u("a", { href: dn(Le), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            Ta(Le, $e),
            " · ",
            Le.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function mt() {
    const R = Rt.filter((se) => se.tagIds === null), B = Rt.filter((se) => se.tagIds !== null);
    return /* @__PURE__ */ u(fe, { children: [
      qt(),
      tn(R, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${Re ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: It.map((se, Ne) => {
            const Oe = Nt(se.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(se.id),
                  "aria-labelledby": `${ge}-answer-${Ne}`,
                  "aria-describedby": `${ge}-effect-${Ne}`,
                  onChange: (Me) => Ln(se.id, Me.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: Oe && /* @__PURE__ */ a(_t, { binding: Oe, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ge}-answer-${Ne}`,
                    className: "dq-batch-answer-label",
                    title: se.label,
                    children: se.label
                  }
                ),
                /* @__PURE__ */ a(Xs, { id: `${ge}-effect-${Ne}`, parts: de(se) })
              ] })
            ] }, se.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: tn(B, !1, R.length === 0) }),
          /* @__PURE__ */ a(
            qi,
            {
              ...sn,
              mediaKind: $e,
              actions: Ve.actions,
              trees: r,
              flags: un,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Qt(R) {
    const B = Dn, se = z && Ws.has(z.group) ? z.group : null, Ne = se ? ot.filter(pt[se].test) : [], Oe = (Me) => {
      const W = Hn(Me), Ye = W.skipped ? sr(
        Me.before.ids,
        qo(Me.before.ids, R.action, R.categories, !0).desired
      ) : be(Me), Xe = !Ye.added.length && !Ye.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        W.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Xe ? !W.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(Zs, { added: Ye.added, removed: Ye.removed, tag: Tt }),
        W.kept.map((ve, Ze) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          _r(ve.existing.map(Tt)).map((Mt) => /* @__PURE__ */ a(pn, { tag: Mt }, Mt.id)),
          " ",
          "instead of",
          " ",
          _r(ve.tagIds.map(Tt)).map((Mt) => /* @__PURE__ */ a(pn, { tag: Mt }, Mt.id))
        ] }, Ze))
      ] });
    };
    return /* @__PURE__ */ u(fe, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            Ia,
            {
              value: ot.length,
              label: ot.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${B.hosts.toLocaleString()} ${B.hosts === 1 ? Tn : `${Tn}s`}`,
              pressed: Ht("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            Ia,
            {
              value: B.willChange,
              label: "will change",
              tone: "add",
              pressed: Ht("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            Ia,
            {
              value: B.correct,
              label: "already correct, no write",
              pressed: Ht("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            Ia,
            {
              value: B.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: Ht("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        Ne.length > 0 ? /* @__PURE__ */ a(
          ec,
          {
            title: pt[se].title,
            entries: Ne,
            mediaKind: $e,
            resultHeading: "Planned change",
            describe: Oe
          }
        ) : ot.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        ot.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: Ee ? `Dates ${Ee.item.media.date}${Le ? ` to ${Le.item.media.date}` : ""}` : "No dates" }),
          Ee && /* @__PURE__ */ a(
            "a",
            {
              href: dn(Ee),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Ct.one}, ${Ee.item.media.date}`,
              title: Ta(Ee, $e),
              children: "Open earliest"
            }
          ),
          Le && /* @__PURE__ */ a(
            "a",
            {
              href: dn(Le),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Ct.one}, ${Le.item.media.date}`,
              title: Ta(Le, $e),
              children: "Open latest"
            }
          ),
          bn.length < ot.length && /* @__PURE__ */ u("span", { children: [
            (ot.length - bn.length).toLocaleString(),
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
              tag: Tt,
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
  function yn() {
    return /* @__PURE__ */ u(fe, { children: [
      qt(),
      tn(Rt, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${Re ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ge}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ge}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: q, onClick: Jn, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: nt.map((R) => {
            const B = Nt(R.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                B && /* @__PURE__ */ a(_t, { binding: B, hidden: !0 }),
                R.label
              ] }),
              /* @__PURE__ */ a(Xs, { parts: de(R) })
            ] }, R.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ a(
          qi,
          {
            ...sn,
            mediaKind: $e,
            actions: Ve.actions,
            trees: r,
            flags: un,
            className: "dq-batch-card"
          }
        )
      ] }),
      q ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && Qt(d)
    ] });
  }
  function $n(R) {
    const B = Y ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, se = B.kind === "apply" ? ot.length - R.counts.pending : B.done, Ne = B.kind === "apply" ? ot.length : B.total, Oe = q ? B.kind === "undo" ? "Undoing batch…" : B.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : B.kind === "undo" ? B.stopped ? "Undo stopped" : "Undo finished" : B.stopped ? "Stopped" : "Finished", Me = Ne ? Math.round(se / Ne * 100) : 100, W = z && !Ws.has(z.group) ? z.group : null, Ye = (ve) => Ys.find((Ze) => Ze.status === ve).label, Xe = W ? ot.filter(
      (ve) => ve.status === W && (!z.reason || ve.error === z.reason)
    ) : [];
    return /* @__PURE__ */ u(fe, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: Oe }),
          /* @__PURE__ */ u("span", { children: [
            se.toLocaleString(),
            " of ",
            Ne.toLocaleString(),
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
            "aria-valuemax": Ne,
            "aria-valuenow": se,
            children: /* @__PURE__ */ a("span", { style: { width: `${Me}%` } })
          }
        ),
        !q && B.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (B.total - R.recorded).toLocaleString(),
          " of",
          " ",
          B.total.toLocaleString(),
          " ",
          B.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: Ys.map((ve) => /* @__PURE__ */ a(
          Ia,
          {
            value: R.counts[ve.status],
            label: B.kind === "undo" && ve.status === "unchanged" ? "As before" : ve.label,
            tone: ve.tone,
            pressed: Ht(ve.status),
            onToggle: () => Ot({ group: ve.status })
          },
          ve.status
        )) }),
        R.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: R.reasons.map((ve) => {
          const Ze = Ht(ve.status, ve.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              ve.count.toLocaleString(),
              " ",
              ve.status,
              ": ",
              ve.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Ze,
                onClick: () => Ot({ group: ve.status, reason: ve.error }),
                children: Ze ? "Hide them" : "Show them"
              }
            )
          ] }, `${ve.status}-${ve.error}`);
        }) }),
        Xe.length > 0 ? /* @__PURE__ */ a(
          ec,
          {
            title: z.reason ? `${Ye(W)}: ${z.reason}` : `${Ye(W)} occurrences`,
            entries: Xe,
            mediaKind: $e,
            resultHeading: "Result",
            describe: (ve) => ve.error ?? Ye(ve.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      R.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: q,
            onClick: () => void gn("undo"),
            children: [
              /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? B.stopped || q ? `${R.recorded.toLocaleString()} ${R.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${R.recorded.toLocaleString()} ${R.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${R.recorded === 1 ? "this change" : `these ${R.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          le ? "After you close this dialog or start a new batch, undo it from Recent changes." : "Recent changes could not keep this batch in this browser's storage (a very large batch does not fit), so its undo lasts only until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function $t() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !nt.length,
        onClick: Vr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? q ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: cn, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Dn.willChange,
        onClick: () => void gn("apply"),
        children: [
          "Apply to ",
          Dn.willChange.toLocaleString(),
          " ",
          Dn.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Jn, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void mn(),
        children: "Preview again"
      },
      "again"
    ) : q ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: cn, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !Je ? null : /* @__PURE__ */ u(Ii, { children: [
      Je.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void gn("retry"), children: "Retry failed" }),
      Je.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void gn("apply"),
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
        title: It.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !It.length,
        onClick: () => {
          Jt(), o(), c(!0);
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
        onCancel: (R) => {
          R.preventDefault(), Ue();
        },
        onClose: () => {
          var R;
          we.current ? (R = j.current) == null || R.showModal() : Ue();
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
                onClick: Ue,
                children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Dh, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: O,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${Si.find((R) => R.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  _ && /* @__PURE__ */ a("p", { role: "status", children: _ }),
                  D && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: D })
                ] }),
                l === "answers" ? mt() : l === "preview" ? yn() : $n(Je)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: q, onClick: Jn, children: [
              /* @__PURE__ */ a(ja, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: q, onClick: Jt, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: q, onClick: Ue, children: "Close" }),
            $t()
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
  const [n, r] = C(jh), o = xn(() => {
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
            /* @__PURE__ */ a(ia, { performer: m }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m.name }),
            N && /* @__PURE__ */ a(ar, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
function ao(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Jh(e, t) {
  const n = Ao(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${ao(r, "or")}`,
    includesAll: `has ${ao(r, "and")}`,
    excludes: `has none of ${ao(r, "or")}`,
    excludesAll: `missing ${ao(r, "or")}`
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
  const [i, s] = C(!1), [c, l] = C(null), f = $(null), d = $(null), p = lt(), h = Br(e.conditionTagIds), m = Jh(e, h);
  jt(() => {
    const w = f.current;
    if (!i || !w) return;
    const q = () => l(Vh(w));
    q(), window.addEventListener("resize", q);
    const L = typeof ResizeObserver > "u" ? null : new ResizeObserver(q), D = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const M of D) M && (L == null || L.observe(M));
    return () => {
      window.removeEventListener("resize", q), L == null || L.disconnect();
    };
  }, [i]), X(() => {
    var q, L;
    if (!i) return;
    const w = (q = d.current) == null ? void 0 : q.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (L = d.current) == null || L.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || In(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const L = [...d.current.querySelectorAll(zh)].filter((x) => x.closest('[role="dialog"]') === d.current).sort(
          (x, _) => x.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!L.length) return;
        const D = L[0], M = L[L.length - 1], k = document.activeElement;
        w.shiftKey && (k === D || k === d.current) ? (w.preventDefault(), M.focus()) : !w.shiftKey && k === M && (w.preventDefault(), D.focus());
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
          /* @__PURE__ */ a($i, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ u(fe, { children: [
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
                Nr,
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
                  Oa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ti,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
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
                  children: Mi.map((w) => /* @__PURE__ */ a("option", { value: w, children: Ri[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(fe, { children: [
                /* @__PURE__ */ a(
                  Nr,
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
                  Ra(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function fo(e) {
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
    Ke(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wh(e, t) {
  const n = Ke(e) === "audio", r = (s) => ({
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
            ir({
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
  const o = $o(e, t);
  if (await Ui(o, o.view.filter, n) > Yh) return null;
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
    const p = await Vi(l, t, d, n);
    for (const h of p.items)
      f.set(h.performer.id, (f.get(h.performer.id) ?? 0) + 1);
    if (r(f), d * nc >= p.totalCount) return f;
  }
}
function Ql(e, t, n) {
  const r = $o(e, [t]);
  return Ui(r, r.view.filter, n);
}
function Wl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function ki(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function Zh(e, t, n, r, o = {}) {
  const i = fo(e), s = Qh(e), c = al(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
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
    const y = new Map(f.map((w) => [w.id, w])), N = (w) => [...w].flatMap(([q, L]) => {
      const D = y.get(q);
      return D && L > 0 ? [{ ...D, count: L }] : [];
    }).sort((q, L) => L.count - q.count || q.name.localeCompare(L.name)), v = await Xh(
      e,
      Ao(e.occurrence) ? null : f.map((w) => w.id),
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
    complete: !y && ki(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !ki(f, p, d, n); ) {
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
    complete: ki(e.candidates, e.cursor, o, e.limit)
  };
}
const Ei = /* @__PURE__ */ new Map();
function tp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Yl(e, t) {
  const n = tp(t);
  return Ei.set(e, n), n;
}
function np(e) {
  const [t, n] = C(null);
  if (X(() => {
    if (e === null || Ei.has(e)) return;
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
    return Ei.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Zo = { exports: {} }, rc;
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
          var p, h, m = {}, y = {}, N = "", v = "", w = "", q = 2, L = 3, D = 2, M = [], k = 0, x = 0, _;
          for (_ = 0; _ < l.length; _ += 1)
            if (N = l.charAt(_), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = L++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < D; p++)
                    k = k << 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < D; p++)
                    k = k << 1 | h, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
                }
                q--, q == 0 && (q = Math.pow(2, D), D++), delete y[w];
              } else
                for (h = m[w], p = 0; p < D; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              q--, q == 0 && (q = Math.pow(2, D), D++), m[v] = L++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < D; p++)
                  k = k << 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < D; p++)
                  k = k << 1 | h, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
              }
              q--, q == 0 && (q = Math.pow(2, D), D++), delete y[w];
            } else
              for (h = m[w], p = 0; p < D; p++)
                k = k << 1 | h & 1, x == f - 1 ? (x = 0, M.push(d(k)), k = 0) : x++, h = h >> 1;
            q--, q == 0 && (q = Math.pow(2, D), D++);
          }
          for (h = 2, p = 0; p < D; p++)
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
          var p = [], h = 4, m = 4, y = 3, N = "", v = [], w, q, L, D, M, k, x, _ = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (L = 0, M = Math.pow(2, 2), k = 1; k != M; )
            D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
          switch (L) {
            case 0:
              for (L = 0, M = Math.pow(2, 8), k = 1; k != M; )
                D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
              x = n(L);
              break;
            case 1:
              for (L = 0, M = Math.pow(2, 16), k = 1; k != M; )
                D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
              x = n(L);
              break;
            case 2:
              return "";
          }
          for (p[3] = x, q = x, v.push(x); ; ) {
            if (_.index > l)
              return "";
            for (L = 0, M = Math.pow(2, y), k = 1; k != M; )
              D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
            switch (x = L) {
              case 0:
                for (L = 0, M = Math.pow(2, 8), k = 1; k != M; )
                  D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
                p[m++] = n(L), x = m - 1, h--;
                break;
              case 1:
                for (L = 0, M = Math.pow(2, 16), k = 1; k != M; )
                  D = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), L |= (D > 0 ? 1 : 0) * k, k <<= 1;
                p[m++] = n(L), x = m - 1, h--;
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
  })(Zo)), Zo.exports;
}
var Xl = rp();
function qr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => qr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && qr(n[s], r[s])
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
  return X(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await To([p])]
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
  ), l = s.every((v) => r[v]), f = zr(
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
  const p = f.filter((v) => !d.has(v)), h = Br(p);
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
            q && /* @__PURE__ */ a(fa, { "aria-hidden": "true" }),
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
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = zr(e.view.objectFilter, t, c).bins, f = cp(e, t, n, i);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const m of c) {
    const y = ((h = m.group) == null ? void 0 : h.trim()) ?? "";
    d.set(y, [...d.get(y) ?? [], m]);
  }
  return /* @__PURE__ */ a(fe, { children: [...d].map(([m, y]) => /* @__PURE__ */ u(
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
                v && /* @__PURE__ */ a(fa, { "aria-hidden": "true" }),
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
  return X(() => {
    var y, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), m = zr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (p++, Ui(td(e, v.key, t), n, h.signal).then((w) => {
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
function Lr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function lp(e) {
  if (!Lr(e) || Object.keys(e).length !== 1 || !Lr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Lr(t.tagsCriterion)) return null;
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
    (r) => qr(e, ed(r.filter))
  );
  return n ? n.key : lp(e);
}
function zr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && qr(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Lr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = dp(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, m] of c.slice(0, -1).entries())
      !Lr(m) || Object.keys(m).length !== 1 ? p = !1 : h === 0 && Lr(m.filter) && Object.keys(m.filter).length ? f = m.filter : !d && Lr(m.group) ? d = m.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function td(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = zr(e.view.objectFilter, n, r), s = (d) => {
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
const Ro = [
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
function Kr(e) {
  const t = Te(e) ? e.occurrence : void 0;
  return {
    filter: Zt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Ke(e)),
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
function Ai(e, t) {
  let n;
  if (Te(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Ro.some((c) => c !== "performer" && t.has(c))) {
    const c = Kr(e);
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
  if (Te(e) && (i = {
    ...fp,
    ...oc(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !Mi.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Zt(o, Ke(e)),
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
function la(e, t) {
  const n = new URLSearchParams(window.location.search);
  Ro.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", ac(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", ac(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), rd(`${window.location.pathname}?${n}${window.location.hash}`);
}
function Pn(e, t) {
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
function jr(e) {
  const t = e;
  return Pn(t, Kr(t));
}
function sc(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !qr(
    JSON.parse(br(Pn(e, t))),
    JSON.parse(br(Pn(e, Kr(e))))
  );
}
function fs(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return ze(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function ad(e, t) {
  if (ze(e) !== "video") return e;
  const { base: n, bins: r } = zr(
    e.view.objectFilter,
    t.view.objectFilter,
    fs(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function oo(e, t) {
  if (ze(e) !== "video") return t;
  const { base: n, bins: r } = zr(
    t.objectFilter,
    e.view.objectFilter,
    fs(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function ei(e, t) {
  return !t || !Te(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function io(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const hn = (e) => e instanceof Error ? e.message : "Request failed.", hp = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, ti = 50, pp = [], cc = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function mp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Od(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? qc(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function gp({ media: e, kind: t }) {
  const [n, r] = C(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ic, {}) : /* @__PURE__ */ a(Eo, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: si(t, e, 160),
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
  const c = !!n && !r, l = as(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ga(
    ye(() => [...i, ...d ?? []], [i, d])
  ), h = (Y) => p[Y] ?? { id: Y, name: p[Y] === void 0 ? "…" : "Unavailable tag" }, m = (Y) => _r(Y.map(h)), y = f && e ? Xi(f, e, o) : null, N = e ? of(e) : [], v = new Set(N.map((Y) => Y.id)), w = new Set(y == null ? void 0 : y.removed), q = new Set(y == null ? void 0 : y.markedAbsent), L = new Set(y == null ? void 0 : y.absenceCleared), D = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
    "absent"
  ] }), M = m((y == null ? void 0 : y.added) ?? []), k = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((Y) => !v.has(Y))), x = n ? "h3" : "h4", _ = !!(e != null && e.absent.length) && /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ a(x, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((Y) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${L.has(Y.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
          L.has(Y.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(pn, { tag: Y })
          ] }) : /* @__PURE__ */ a(pn, { tag: Y })
        ]
      },
      Y.id
    )) })
  ] }), oe = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(fe, { children: [
      N.length || M.length || k.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (Y) => w.has(Y.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(pn, { tag: Y })
            ] }),
            q.has(Y.id) && D
          ] }, Y.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(pn, { tag: Y }) }, Y.id)
        ),
        M.map((Y) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(pn, { tag: Y })
        ] }) }, `added-${Y.id}`)),
        k.map((Y) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(pn, { tag: Y }) }),
          D
        ] }, `absent-${Y.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && _
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(fe, { children: [
    !c && oe,
    n,
    n && _ && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: _ })
  ] });
}
function yp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    es(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
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
  var Fn;
  const h = Ke(e), m = Vn(h), y = (g) => Di(g, h), N = (g) => `${g.occurrence ? `${g.occurrence.performer.name} — ` : ""}${y(g.media)}`, v = $(null), w = $("");
  if (!v.current)
    try {
      v.current = Ai(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (g) {
      w.current = hn(g), v.current = { query: Kr(e), startAtEnd: !1 };
    }
  const [q, L] = C(null), [D, M] = C(""), k = $(null), x = $(null), _ = $(null), oe = $(null), [Y, U] = C(!!w.current), le = $(0), [T, z] = C(v.current.query), I = $(T);
  I.current = T;
  const [te, ee] = C(0), me = $(v.current.startAtEnd), [J, j] = C([]), [O, A] = C(null), H = $(null), [ie, pe] = C(null), [G, we] = C(0), Pe = ye(() => {
    var Q;
    if (!O) return null;
    const g = J.findIndex((ne) => ne.key === O.key), E = ((Q = H.current) == null ? void 0 : Q.key) === O.key ? H.current : null;
    return (g >= 0 ? J.slice(g + 1) : E ? J.filter((ne) => !E.before.includes(ne.key)) : []).find((ne) => ne.media.id !== O.media.id) ?? null;
  }, [O, J]), [ge, ht] = C(0), [ke, Ve] = C(!1), [tt, Ae] = C(!1), $e = $(!1), Ct = $(0), Tn = $(!1), It = $(null), nt = $(!0), Re = $(null);
  X(() => (nt.current = !0, () => {
    nt.current = !1;
  }), []);
  const [sn, rt] = C(w.current), [Vt, cr] = C(""), [Tt, at] = C(""), [qe, Jt] = C(null), [Ue, Ln] = C(!1), [Jn, Vr] = C([]), cn = $([]), Ot = $(null), Ht = $(null), mn = $(null);
  X(() => {
    var g, E;
    Ue && ((E = (g = mn.current) == null ? void 0 : g.querySelector("input")) == null || E.focus());
  }, [Ue]);
  const gn = $(null);
  X(() => {
    if (tt) return;
    const g = gn.current;
    gn.current = null;
    const E = document.activeElement;
    g != null && g.isConnected && (!E || E === document.body) && g.focus();
  }, [tt]);
  const [ot, lr] = C(!1), [Hn, be] = C(!1), ln = za(), [Qn, Dn] = C(!1), bn = d ?? Qn, Je = p ?? Dn;
  X(() => {
    if (ke || ot || !Ht.current) return;
    const g = requestAnimationFrame(() => {
      if (document.querySelector(cc)) return;
      const E = Ht.current;
      Ht.current = null;
      const P = document.activeElement;
      P && P !== document.body || E != null && E.isConnected && !E.disabled && E.focus();
    });
    return () => cancelAnimationFrame(g);
  }, [ke, ot, te]);
  const [Nt, de] = C([]), [K, Ee] = C({}), Le = $(null), [dn, ue] = C({});
  X(() => {
    let g = !0;
    return Promise.all(
      ls(T.objectFilter).map(
        async (E) => [
          String(E),
          (await he(`/api/tags/${E}`)).name
        ]
      )
    ).then((E) => {
      g && ue(Object.fromEntries(E));
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [T.objectFilter]);
  const Jr = ye(
    () => ds(T.objectFilter, dn),
    [dn, T.objectFilter]
  ), Rt = $(0), un = $(e);
  un.current = e;
  const pt = q ?? e, qt = ye(
    () => Pn(pt, T),
    [pt, T]
  ), tn = ye(
    () => ei(qt, T.performerFocus),
    [qt, T.performerFocus]
  ), mt = $(tn);
  mt.current = tn;
  const Qt = $(qt);
  Qt.current = qt;
  const [yn, $n] = C("items"), [$t, R] = C(null), B = $(null), se = $("");
  function Ne(g) {
    const E = typeof g == "function" ? g(B.current) : g;
    B.current = E, R(E);
  }
  const [Oe, Me] = C(!1), [W, Ye] = C(null), Xe = $(null), ve = Te(qt) ? fo(qt) : "", [Ze, Mt] = C(0), [_n, Va] = C(null);
  X(() => () => {
    var g;
    return (g = Xe.current) == null ? void 0 : g.controller.abort();
  }, []), X(() => {
    const g = Xe.current;
    !g || g.signature === ve || (g.controller.abort(), Xe.current = null, Me(!1));
  }, [ve]), X(() => {
    var P;
    const g = B.current;
    if (yn !== "performers" || !ve || ((P = Xe.current) == null ? void 0 : P.signature) === ve || se.current === ve || (g == null ? void 0 : g.signature) === ve && g.complete)
      return;
    const E = (g == null ? void 0 : g.signature) === ve ? g : null;
    Cr(g, (E == null ? void 0 : E.limit) ?? ti);
  }, [yn, ve, $t, W, Oe]);
  const Se = T.performerFocus;
  X(() => {
    if (!Se) {
      Va(null);
      return;
    }
    let g = !0;
    return he(`/api/performers/${Se}`).then((E) => {
      const P = Yl(Se, E.tags);
      g && Va({ id: Se, name: E.name, tags: P });
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [Se]);
  const Wn = JSON.stringify(
    Te(qt) ? Rc(qt.occurrence) : []
  ), Ie = ye(() => JSON.parse(Wn), [Wn]), kr = ye(() => df(Ie), [Ie]), Yn = hl(kr), pa = Ga(kr), ma = (g) => {
    var E;
    return ((E = pa[g]) == null ? void 0 : E.name) ?? (pa[g] === null ? "Unavailable tag" : "…");
  }, ga = (g) => ({
    name: ma(g),
    tagIds: Yn.get(g) ?? [g],
    resolved: Yn.has(g)
  }), Ut = Jl(
    Te(qt) ? qt : null,
    Se ?? null,
    Ze
  ), wn = sc(e, T), Er = sc(e, oo(e, T)), Ft = tt || ke || Ue, jn = Number(T.filter.page);
  function Be(g, E = !1) {
    $e.current || (Ct.current++, cr(""), w.current = "", me.current = E, I.current = g, z(g), ht(0), Ve(!0), E || la(e.id, g), ee((P) => P + 1));
  }
  function st() {
    if ($e.current = !1, Ae(!1), nt.current && Re.current) {
      const g = Re.current;
      Re.current = null, Be(g.query, g.startAtEnd);
    }
  }
  X(() => {
    const g = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const E = Ai(
            un.current,
            new URLSearchParams(window.location.search)
          );
          $e.current ? Re.current = E : Be(E.query, E.startAtEnd);
        } catch (E) {
          rt(hn(E));
        }
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, [e.id]), X(() => (r(tt || ke || Ue || !!q), () => r(!1)), [tt, ke, Ue, !!q, r]);
  async function dt(g, E, P) {
    if (Te(g)) {
      const ne = await Vi(
        g,
        Le.current,
        E,
        P
      );
      return {
        items: ne.items.map((ce) => ({
          key: ce.key,
          media: ce.media,
          occurrence: ce
        })),
        totalCount: ne.totalCount
      };
    }
    const Q = await aa(
      g,
      { ...g.view.filter, page: E },
      P
    );
    return {
      items: Q.items.map((ne) => ({ key: String(ne.id), media: ne })),
      totalCount: Q.totalCount
    };
  }
  function St(g, E, P, Q = !1, ne = !1) {
    if (!nt.current || Re.current) return;
    U(!0), j(
      ne ? g.items : io(g.items, I.current.startFrom === "end")
    ), ht(g.totalCount), fn(P, Q);
    const ce = {
      ...I.current,
      filter: { ...I.current.filter, page: E }
    };
    I.current = ce, z(ce), la(e.id, ce);
  }
  function fn(g, E = !1) {
    Ct.current++, (g == null ? void 0 : g.key) !== (O == null ? void 0 : O.key) && (H.current = null), (g == null ? void 0 : g.media.id) !== (O == null ? void 0 : O.media.id) && pe(E && g ? g.media.id : null), A(g);
  }
  X(() => {
    if (w.current) return;
    const g = new AbortController();
    oe.current = g;
    const E = ++Rt.current;
    return Ve(!0), rt(""), at(""), H.current = null, pe(null), A(null), j([]), Ln(!1), (async () => {
      const P = ei(
        Pn(un.current, I.current),
        I.current.performerFocus
      );
      Le.current = Te(P) ? await Gi(P, g.signal) : null;
      let Q = Number(P.view.filter.page), ne = await dt(P, Q, g.signal);
      const ce = Math.max(
        1,
        Math.ceil(ne.totalCount / Number(P.view.filter.perPage))
      );
      (me.current || Q > ce) && (Q = ce, ne = await dt(P, Q, g.signal)), me.current = !1;
      const xe = P.view.startFrom === "end" ? -1 : 1;
      for (; Te(P) && !ne.items.length && Q + xe >= 1 && Q + xe <= ce && !g.signal.aborted; )
        Q += xe, ne = await dt(P, Q, g.signal);
      if (E !== Rt.current || g.signal.aborted) return;
      const gt = io(ne.items, P.view.startFrom === "end");
      St(ne, Q, gt[0] ?? null);
    })().catch((P) => {
      !g.signal.aborted && E === Rt.current && rt(hn(P));
    }).finally(() => {
      !g.signal.aborted && E === Rt.current && (U(!0), Ve(!1));
    }), () => {
      g.abort(), Rt.current++;
    };
  }, [te, e.id]);
  const nn = $(null), Hr = $(0), dr = $(c);
  X(() => {
    const g = dr.current !== c && (O == null ? void 0 : O.key) === nn.current;
    dr.current = c;
    const E = (qe == null ? void 0 : qe.ids) ?? [];
    if ((O == null ? void 0 : O.key) !== nn.current && Jt(null), nn.current = (O == null ? void 0 : O.key) ?? null, !O) return;
    let P = !0;
    const Q = Hr.current;
    return en(h, O).then((ne) => {
      if (!P || Q !== Hr.current) return;
      Jt(ne);
      const ce = Te(e) ? e.occurrence.tagIds : [];
      if (!g)
        de(ne.ids.filter((xe) => ce.includes(xe)));
      else {
        const xe = sr(E, ne.ids);
        de((gt) => [
          ...gt.filter((bt) => !xe.removed.includes(bt)),
          ...xe.added.filter((bt) => ce.includes(bt) && !gt.includes(bt))
        ]);
      }
    }).catch((ne) => {
      P && rt(`Could not load current tags. ${hn(ne)}`);
    }), () => {
      P = !1;
    };
  }, [O, c]);
  const On = $(c);
  X(() => {
    On.current !== c && (On.current = c, Mt((g) => g + 1), !$e.current && !ke && !Ue && !q && Un(l));
  }, [c]);
  async function Un(g) {
    if (w.current) return;
    const E = ++Ct.current, P = Rt.current, Q = () => Ct.current !== E || Rt.current !== P, ne = O == null ? void 0 : O.key, ce = Te(e) && !e.actions.length ? e.occurrence.tagIds : [], xe = ((qe == null ? void 0 : qe.ids) ?? []).filter((Ce) => ce.includes(Ce)), gt = ce.length > 0 && (Nt.length !== xe.length || Nt.some((Ce) => !xe.includes(Ce))), bt = ei(
      Pn(un.current, I.current),
      I.current.performerFocus
    ), _e = (Ce) => io(Ce.items, I.current.startFrom === "end"), Et = Number(I.current.filter.page), ut = (Ce, Kt) => {
      if (j(_e(Ce)), ht(Ce.totalCount), Kt === Et) return;
      const yt = { ...I.current, filter: { ...I.current.filter, page: Kt } };
      I.current = yt, z(yt), la(e.id, yt);
    };
    try {
      const Ce = await dt(bt, Et);
      if (Q()) return;
      const Kt = Math.max(1, Math.ceil(Ce.totalCount / Number(I.current.filter.perPage)));
      for (const yt of [Et, Et - 1, Et + 1]) {
        if (yt < 1 || yt > Kt || !g.length) continue;
        const En = yt === Et ? Ce : await dt(bt, yt);
        if (Q()) return;
        const on = _e(En).find((ct) => g.includes(ct.key));
        if (!on) continue;
        const Qe = N(on);
        if (on.key === ne) ut(En, yt);
        else if (ne && gt) {
          ut(Ce, Et), at(`Undone: ${Qe} is back in the queue. Staying here to keep your unsaved choices.`);
          return;
        } else St(En, yt, on);
        at(`Undone: ${Qe} is back in the queue.`);
        return;
      }
      if (!Ce.items.length) return;
      ne ? ut(Ce, Et) : St(Ce, Et, _e(Ce)[0]);
    } catch (Ce) {
      Q() || rt(`Undone, but the queue could not be read again. ${hn(Ce)}`);
    }
  }
  X(() => {
    if (!Te(e) || e.actions.length)
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
      g && Ee(Object.fromEntries(E));
    }).catch((E) => {
      g && rt(hn(E));
    }), () => {
      g = !1;
    };
  }, [e]);
  function Qr(g, E = H.current) {
    const P = J.findIndex((_e) => _e.key === g.key), Q = T.startFrom === "end" ? -1 : 1, ne = (E == null ? void 0 : E.key) === g.key, ce = ne ? E : { key: g.key, page: jn, before: J.slice(0, P + 1).map((_e) => _e.key), after: J.slice(P + 1).map((_e) => _e.key) }, xe = new Set(ce.after), gt = new Set(ce.before), bt = J.find((_e) => xe.has(_e.key) || (Q === 1 || jn < ce.page) && ne && !gt.has(_e.key));
    return { direction: Q, cursor: ce, remainingKeys: xe, visitedKeys: gt, nextLoaded: bt };
  }
  async function ur(g = !1, E = !1, P = !1, Q = () => !0, ne = H.current) {
    if (!O) return;
    const { direction: ce, cursor: xe, remainingKeys: gt, visitedKeys: bt, nextLoaded: _e } = Qr(O, ne);
    if (!g && _e) {
      fn(_e, P);
      return;
    }
    const Et = g ? bt : new Set(J.map((Ce) => Ce.key));
    let ut = ce === -1 && !g ? Math.max(1, jn - 1) : jn;
    for (; nt.current && !Re.current; ) {
      let Ce = await dt(tn, ut);
      const Kt = Math.max(
        1,
        Math.ceil(Ce.totalCount / Number(T.filter.perPage))
      );
      ut > Kt && (ut = Kt, Ce = await dt(tn, ut));
      const yt = io(Ce.items, ce === -1), En = new Map(yt.map((Yt) => [Yt.key, Yt])), on = g ? xe.after.flatMap((Yt) => {
        const hr = En.get(Yt);
        return hr ? [hr] : [];
      }) : [], Qe = new Set(on.map((Yt) => Yt.key)), ct = g ? {
        ...Ce,
        items: [
          ...on,
          ...yt.filter(
            (Yt) => Yt.key !== O.key && !Qe.has(Yt.key)
          )
        ]
      } : { ...Ce, items: yt };
      if (!Q()) return;
      if (E) {
        H.current = xe, St(ct, ut, O, !1, !0);
        return;
      }
      const Wt = ce === -1 && jn === 1 && !g ? void 0 : ct.items.find(
        (Yt) => !Et.has(Yt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(g && ce === -1 && ut === xe.page) || gt.has(Yt.key))
      );
      if (Wt || (ce === -1 ? ut <= 1 : ut >= Kt)) {
        St(
          ct,
          ut,
          Wt ?? null,
          P,
          !0
        ), Wt || at(
          Ce.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      ut += ce;
    }
  }
  async function vn(g, E = !1, P = !1, Q = !1) {
    var on;
    if (Tn.current && g && O && !P && !Q && !q && !Ue) {
      It.current = { action: g, stay: E, key: O.key };
      return;
    }
    if (q || !O || $e.current || ke || Ue && !P)
      return;
    const ne = P || Q || !!(g != null && g.steps.length);
    if (ne && (!t || !qe) || g && vr(g) && !n) return;
    const ce = !E && !P && !Q && ne && g !== void 0 && qe !== null && Ps(e) && mi(pi(e.actions, cf(g, qe, rn))).length > 0, xe = P && ((on = mn.current) != null && on.contains(document.activeElement)) ? document.activeElement : null;
    $e.current = !0, Ae(!0), rt(""), at(""), Tn.current = !0, ne && (Ct.current++, Hr.current++);
    const gt = H.current, bt = ne && !E && !ce ? Qr(O).nextLoaded ?? null : null;
    bt && (j(
      (Qe) => Qe.filter((ct) => ct.key !== O.key)
    ), fn(bt, !0));
    let _e = !1, Et = !1, ut = [], Ce = null, Kt = [];
    const yt = (Qe) => Qi({
      id: Yi(),
      at: Date.now(),
      label: (g == null ? void 0 : g.label) ?? (Q ? "Saved choices" : "Edited tags"),
      reviewName: e.name,
      reviewId: e.id,
      kind: h,
      items: [Wi(O, y(O.media), Ce, Qe, Kt)]
    });
    let En = "";
    try {
      if (ne) {
        const Qe = await en(h, O);
        if (Ce = Qe, g)
          Kt = (await Ba(g)).flatMap((Wt) => Wt.tagIds), await Gu(tn, O, g);
        else {
          const Wt = Q && Te(e) ? e.occurrence.tagIds.filter((_o) => Qe.ids.includes(_o)) : cn.current, hr = sr(Wt, Q ? Nt : Jn);
          Kt = [...hr.added, ...hr.removed], await Ji(tn, O, hr);
        }
        const ct = await en(h, O);
        yt(ct) || (En = " Recent changes could not record it, so it cannot be undone there."), bt || Jt(ct), Et = !0, Ln(!1), ce && (ut = mi(pi(e.actions, ct))), at(
          ut.length ? `Tags saved. Staying until answered: ${ut.map((Wt) => Wt.name).join(", ")}.${En}` : `Tags saved.${En}`
        ), O.occurrence && (He(O.occurrence.performer.id), Mt((Wt) => Wt + 1));
      }
      if (!nt.current || Re.current) return;
      if (ne)
        if (bt) {
          const Qe = Ct.current;
          _e = !0, Tn.current = !1, st(), ur(!0, !1, !0, () => Ct.current === Qe && !$e.current, gt).catch((ct) => {
            Ct.current === Qe && rt(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${hn(ct)}`);
          });
        } else ut.length || await ur(!0, E, !E);
      else E || await ur();
      E && P && requestAnimationFrame(() => {
        var Qe;
        return (Qe = Ot.current) == null ? void 0 : Qe.focus();
      });
    } catch (Qe) {
      if (rt(
        Et ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${hn(Qe)}` : ne ? `Saving stopped. ${hp(hn(Qe))}${P || Q ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${hn(Qe)}`
      ), ne && !Et) {
        gn.current = xe, bt && (j(J), pe(null), we((ct) => ct + 1), A(O), H.current = gt);
        try {
          const ct = await en(h, O);
          Ce && !yt(ct) && rt(
            (Wt) => `${Wt} Recent changes could not record what was saved, so it cannot be undone there.`
          ), Jt(ct);
        } catch {
          Jt(null), rt(
            (ct) => `${ct} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      _e || (Tn.current = !1, st());
    }
  }
  X(() => {
    const g = It.current;
    if (!(!g || tt || $e.current)) {
      if ((O == null ? void 0 : O.key) !== g.key || sn) {
        It.current = null;
        return;
      }
      qe && (It.current = null, vn(g.action, g.stay));
    }
  }, [tt, qe, O, sn]);
  const Fe = !Ue && !q && !ot && !Hn && (O != null || ke || tt);
  ts({
    surface: "local",
    enabled: Fe,
    actions: e.actions,
    onAction: (g, E) => {
      const P = e.actions[g];
      P && vn(P, E);
    },
    onFind: () => be(!0)
  });
  const Ar = (g) => tt || ke || !qe || !!q || !t && g.steps.length > 0 || !n && vr(g);
  function Rn() {
    !o || q || $e.current || Ue || (_.current = document.activeElement, x.current = {
      error: sn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: J,
      current: O,
      total: ge,
      targets: Le.current,
      stayedCursor: H.current
    }, Ct.current++, L(structuredClone(e)), M(""), at(""), rt(""));
  }
  X(() => {
    if (!i) {
      le.current = 0;
      return;
    }
    i !== le.current && Y && !ke && (le.current = i, Rn(), s == null || s());
  }, [i, ke, Y]);
  function ba() {
    L(null), M(""), requestAnimationFrame(() => {
      const g = _.current;
      g != null && g.isConnected && g !== document.body && g.focus();
    });
  }
  function Xn() {
    var E;
    const g = x.current;
    !g || tt || ((E = oe.current) == null || E.abort(), Rt.current++, I.current = g.query, z(g.query), j(g.items), A(g.current), ht(g.total), Le.current = g.targets, H.current = g.stayedCursor, Ve(!1), rt(g.error), at(""), window.history.replaceState(window.history.state, "", g.url), ba());
  }
  async function Mo() {
    if (!q || !o || $e.current) return;
    const g = Pn(
      { ...q, name: q.name.trim() },
      oo(un.current, I.current)
    ), E = Fa(g);
    if (E) {
      M(E);
      return;
    }
    $e.current = !0, Ae(!0), M("");
    try {
      if (await o(g) === !1) throw new Error("Could not save review.");
      ba(), at("Review saved.");
    } catch (P) {
      M(Dc(P));
    } finally {
      st();
    }
  }
  async function ya() {
    if (!o || $e.current) return;
    const g = oo(un.current, I.current), E = Pn(un.current, {
      ...g,
      filter: { ...g.filter, page: 1 }
    });
    $e.current = !0, Ae(!0), rt(""), cr("");
    try {
      if (await o(E) === !1) throw new Error("Could not save review.");
      at("Queue saved to this review.");
    } catch (P) {
      cr("Could not save queue. " + hn(P));
    } finally {
      st();
    }
  }
  const kt = T.performerScope, Nn = (g) => {
    const { performerFocus: E, ...P } = I.current, Q = E && !("targetMode" in g || "performerIds" in g || "performerFilter" in g);
    Be(
      {
        ...P,
        ...Q ? { performerFocus: E } : {},
        filter: { ...P.filter, page: 1 },
        performerScope: { ...kt, ...g }
      },
      P.startFrom === "end"
    );
  };
  async function Cr(g, E) {
    var ne;
    const P = Qt.current;
    if (!Te(P)) return;
    (ne = Xe.current) == null || ne.controller.abort();
    const Q = {
      signature: fo(P),
      controller: new AbortController()
    };
    Xe.current = Q, se.current = "", Me(!0), Ye(null);
    try {
      const ce = await Zh(P, g, E, Q.controller.signal, {
        onProgress: (xe) => {
          Xe.current === Q && Ne(xe);
        }
      });
      Xe.current === Q && Ne(ce);
    } catch (ce) {
      Xe.current === Q && !Q.controller.signal.aborted && (se.current = Q.signature, Ye({ signature: Q.signature, message: hn(ce) }));
    } finally {
      Xe.current === Q && (Xe.current = null, Me(!1));
    }
  }
  function qn() {
    var g;
    (g = Xe.current) == null || g.controller.abort(), Xe.current = null, Me(!1), Ne((E) => E && { ...E, partial: !0, complete: !1 });
  }
  async function He(g) {
    var Q;
    const E = Qt.current;
    if (!Te(E)) return;
    if (Xe.current) {
      qn();
      return;
    }
    const P = fo(E);
    if (!(((Q = B.current) == null ? void 0 : Q.signature) !== P || B.current.partial))
      try {
        const ne = await Ql(E, g);
        if (Xe.current) {
          qn();
          return;
        }
        Ne(
          (ce) => (ce == null ? void 0 : ce.signature) === P ? ep(ce, g, ne) : ce
        );
      } catch {
        Ne(
          (ne) => (ne == null ? void 0 : ne.signature) === P ? { ...ne, partial: !0, complete: !1 } : ne
        );
      }
  }
  const Ir = T.performerFocus ? $t == null ? void 0 : $t.candidates.find((g) => g.id === T.performerFocus) : void 0, xt = _n && _n.id === T.performerFocus ? { ..._n, flags: Pr(Ie, _n.tags) } : Ir ? { ...Ir, flags: Pr(Ie, Ir.tags) } : null, Wr = (g) => {
    if ((_n == null ? void 0 : _n.id) === g)
      return Pr(Ie, _n.tags);
    const E = $t == null ? void 0 : $t.candidates.find((P) => P.id === g);
    return E ? Pr(Ie, E.tags) : void 0;
  }, Sn = ((Fn = O == null ? void 0 : O.occurrence) == null ? void 0 : Fn.performer.id) ?? null, Tr = Sn === null ? void 0 : Wr(Sn), Yr = np(
    Ie.length > 0 && Sn !== null && Sn !== T.performerFocus && Tr === void 0 ? Sn : null
  ), Ja = Tr ?? (Yr ? Pr(Ie, Yr) : []), rn = fl(pt.actions), Ha = Ut.summary && T.performerFocus ? Zi(us(Ut.summary, pt.actions, rn)) : [], Zn = Ls(Ie, (xt == null ? void 0 : xt.flags) ?? [], ga), fr = bl(
    Ls(Ie, Ja, ga),
    Sn !== null && Sn === T.performerFocus ? Ha : []
  ), Fo = JSON.stringify(fr), Xr = ye(() => fr, [Fo]), xo = JSON.stringify(Zn), Qa = ye(() => Zn, [xo]), wa = (g) => bf(Ie, g, ma);
  function va(g) {
    if ($e.current) return;
    const E = {
      ...I.current,
      performerFocus: g,
      filter: { ...I.current.filter, page: 1 }
    };
    Be(E, E.startFrom === "end"), $n("items");
  }
  function Po() {
    const { performerFocus: g, ...E } = I.current;
    Be(
      { ...E, filter: { ...E.filter, page: 1 } },
      E.startFrom === "end"
    );
  }
  const an = $(null);
  an.current ?? (an.current = Nl());
  const $r = an.current, Or = ye(
    () => pt.actions.flatMap((g) => g.steps.flatMap((E) => E.tagIds)),
    [pt.actions]
  ), er = $(null);
  X(() => {
    var xe;
    const g = er.current, E = g == null ? void 0 : g.querySelector('[aria-current="true"]');
    if (!g || !E) return;
    const P = g.getBoundingClientRect(), Q = E.getBoundingClientRect(), ne = (xe = E.nextElementSibling) == null ? void 0 : xe.getBoundingClientRect(), ce = ne && ne.bottom - Q.top <= P.height ? Math.max(ne.bottom, Q.bottom) : Q.bottom;
    Q.top < P.top ? g.scrollTop -= P.top - Q.top : ce > P.bottom && (g.scrollTop += ce - P.bottom);
  }, [O == null ? void 0 : O.key, yn]);
  const Rr = $(null), kn = $(null);
  X(() => {
    var P, Q;
    const g = kn.current;
    if (!g) return;
    kn.current = null;
    const E = [...((P = Rr.current) == null ? void 0 : P.querySelectorAll(".dq-partner")) ?? []];
    (Q = E.find((ne) => ne.dataset.partnerKey === g) ?? E[0]) == null || Q.focus();
  }, [O == null ? void 0 : O.key]);
  const Kn = tt || ke || Ue || !!q, Bn = ye(
    () => q ? Pn(q, oo(e, T)) : null,
    [q, e, T]
  ), Wa = ye(
    () => Bn != null && ca(jr(Bn)) !== ca(jr(e)),
    [Bn, e]
  );
  function Lo() {
    O ? en(h, O).then(Jt).catch((g) => rt(hn(g))) : Be(I.current);
  }
  const Na = sn ? /* @__PURE__ */ u("p", { role: "alert", children: [
    sn,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: tt, onClick: Lo, children: O ? "Reload tags" : "Retry queue" })
  ] }) : null, qa = tt || ke || O != null && !qe, Sa = Math.max(1, Number(T.filter.perPage) || 1), Mr = $(1);
  ke || (Mr.current = Math.max(1, Math.ceil(ge / Sa)));
  const Mn = Mr.current, De = kt && O ? J.filter(
    (g) => g.media.id === O.media.id && g.key !== O.key
  ) : [], Do = (g) => {
    var E;
    return g.title || ((E = g.files[0]) == null ? void 0 : E.basename) || `${h === "audio" ? "Audio" : "Video"} ${g.id}`;
  }, Zr = O ? mp(O.media, h) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${h === "audio" ? " dq-audio" : ""}`,
      "aria-label": kt ? h === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : h === "audio" ? "Audio review" : "Video review",
      onClickCapture: (g) => {
        var Q;
        const E = g.target instanceof Element ? g.target.closest("button") : null, P = (E == null ? void 0 : E.getAttribute("aria-label")) ?? ((Q = E == null ? void 0 : E.textContent) == null ? void 0 : Q.trim()) ?? "";
        E && !E.closest(cc) && /^(Filters|Edit filter:|Edit criteria)/.test(P) && (Ht.current = E);
      },
      children: [
        /* @__PURE__ */ a(
          Dl,
          {
            name: e.name,
            description: e.description,
            entityType: ze(e),
            onBack: f == null ? void 0 : f.onBack,
            backDisabled: Kn || !!(f != null && f.busy),
            onEdit: q ? () => {
              var g;
              return (g = k.current) == null ? void 0 : g.focus();
            } : Rn,
            editDisabled: !q && (Kn || !o || !!(f != null && f.busy)),
            editing: !!q,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: tt || Ue, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: h === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  Oa,
                  {
                    filter: T.filter,
                    objectFilter: Jr,
                    criteriaDefinitions: h === "audio" ? wc : So,
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
                        page: Math.min(Math.max(1, jn || 1), Mn),
                        pages: Mn,
                        onPage: (g) => Be({
                          ...I.current,
                          filter: Zt(
                            { ...I.current.filter, page: g },
                            h
                          )
                        })
                      }
                    ),
                    onFilterChange: (g) => {
                      (g.sort !== I.current.filter.sort || g.direction !== I.current.filter.direction) && (g = { ...g, sorts: void 0 }), Be(
                        {
                          ...I.current,
                          filter: Zt(g, h)
                        },
                        I.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (g) => {
                      Be(
                        {
                          ...I.current,
                          objectFilter: Ul(
                            g,
                            dn,
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
            trailing: /* @__PURE__ */ u(fe, { children: [
              kt && /* @__PURE__ */ a(
                Hh,
                {
                  scope: kt,
                  disabled: tt || Ue,
                  editing: !!q,
                  onChange: Nn,
                  onEditCriteria: () => lr(!0)
                }
              ),
              (f == null ? void 0 : f.onGrid) && /* @__PURE__ */ a(
                jl,
                {
                  mode: "single",
                  disabled: Kn || !!f.busy,
                  onChange: () => {
                    var g;
                    return (g = f.onGrid) == null ? void 0 : g.call(f);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(fe, { children: [
              Te(tn) && t && /* @__PURE__ */ a(
                _h,
                {
                  review: tn,
                  disabled: Ft || !!q,
                  performerAttention: T.performerFocus ? Qa : void 0,
                  trees: rn,
                  onOpen: () => {
                    $e.current = !0, Ae(!0);
                  },
                  onClose: (g) => {
                    if (g) {
                      const E = I.current.performerFocus;
                      E ? He(E) : qn(), Mt((P) => P + 1), st(), w.current || Ve(!0), ee((P) => P + 1);
                    } else st();
                  }
                }
              ),
              (f == null ? void 0 : f.moreItems) && /* @__PURE__ */ a(
                is,
                {
                  disabled: Kn,
                  items: f.moreItems({
                    onSelect: Rn,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: T.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                ia,
                {
                  performer: {
                    id: T.performerFocus,
                    name: (xt == null ? void 0 : xt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (xt == null ? void 0 : xt.name) ?? `performer ${T.performerFocus}` })
              ] }),
              xt != null && xt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: wa(xt.flags), children: [
                /* @__PURE__ */ a(ar, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: wa(xt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: Ft,
                  onClick: Po,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: wn,
            queueChange: !q && wn ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Er ? () => void ya() : void 0,
              saveDisabled: Ft || !o,
              onReset: () => {
                const g = Kr(e);
                Be(g, g.startFrom === "end");
              },
              resetDisabled: Ft
            } : void 0,
            chipsEnd: q ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        f == null ? void 0 : f.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          q && Bn && /* @__PURE__ */ a(
            Ll,
            {
              drawerRef: k,
              draft: Bn,
              onChange: (g) => L(g),
              direction: T.startFrom,
              onDirectionChange: (g) => Be({ ...I.current, startFrom: g }),
              tagGroups: pp,
              trees: rn,
              saving: tt,
              saveDisabled: ke,
              error: D,
              dirty: Wa,
              criteriaChanged: Er,
              notices: Na && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: Na }),
              onSave: () => void Mo(),
              onCancel: Xn
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              O ? /* @__PURE__ */ u(fe, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${h}/${O.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: Do(O.media) }),
                        /* @__PURE__ */ a($c, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Zr && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Zr })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [O, Pe].filter(Boolean).map((g) => {
                    var Q, ne, ce, xe, gt;
                    const E = g, P = E.key === O.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: P ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": P ? void 0 : !0,
                        inert: P ? void 0 : !0,
                        children: h === "audio" ? /* @__PURE__ */ a(
                          $d,
                          {
                            streamUrl: ci("audio", E.media.id),
                            format: ((Q = E.media.files[0]) == null ? void 0 : Q.format) ?? "",
                            title: y(E.media),
                            coverUrl: P ? si("audio", E.media) : void 0,
                            duration: ((ne = E.media.files[0]) == null ? void 0 : ne.duration) ?? 0,
                            autostart: P && ie === E.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Nc,
                          {
                            videoId: E.media.id,
                            streamUrl: ci("video", E.media.id),
                            posterUrl: P ? si("video", E.media) : void 0,
                            duration: ((ce = E.media.files[0]) == null ? void 0 : ce.duration) ?? 0,
                            format: (xe = E.media.files[0]) == null ? void 0 : xe.format,
                            audioCodec: (gt = E.media.files[0]) == null ? void 0 : gt.audioCodec,
                            extensionSurface: P ? "quick-view" : void 0,
                            autostart: P && ie === E.media.id,
                            keyboardShortcutsEnabled: P,
                            showAbLoop: P,
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
                      details: O.media.details,
                      label: m.one
                    },
                    O.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: ke ? "Loading review…" : ge ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              pt.actions.length > 0 ? /* @__PURE__ */ a(
                If,
                {
                  actions: pt.actions,
                  isDisabled: (g) => Ue || Ar(g),
                  busy: qa,
                  tags: qe,
                  trees: rn,
                  preview: $r,
                  onApply: (g, E) => void vn(g, E),
                  onFind: () => be(!0),
                  findDisabled: Ue || !!q,
                  paused: !!q,
                  waitForGroups: Ps(pt),
                  attention: Xr,
                  stayOnTap: bn,
                  onStayOnTapChange: Je
                }
              ) : Te(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || tt || Ue || !qe || !!q || !O,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((g) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Nt.includes(g),
                          onChange: (E) => de(
                            e.occurrence.multiple ? E.target.checked ? [...Nt, g] : Nt.filter((P) => P !== g) : [g]
                          )
                        }
                      ),
                      K[g] ?? "Loading tag…"
                    ] }, g)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => de([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void vn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void vn(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Rr, children: [
                O && /* @__PURE__ */ u(fe, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: O.occurrence ? O.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      O.occurrence && /* @__PURE__ */ a(ia, { performer: O.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: O.occurrence ? O.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: kt ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    Xr.length > 0 && /* @__PURE__ */ a(yp, { entries: Xr })
                  ] }),
                  De.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: De.map((g) => {
                          var E, P, Q;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (E = g.occurrence) == null ? void 0 : E.performer.name,
                              "aria-label": (P = g.occurrence) == null ? void 0 : P.performer.name,
                              "data-partner-key": g.key,
                              disabled: Ft,
                              onClick: () => {
                                kn.current = O.key, fn(g), rt("");
                              },
                              children: [
                                g.occurrence && /* @__PURE__ */ a(ia, { performer: g.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (Q = g.occurrence) == null ? void 0 : Q.performer.name })
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
                      tags: qe,
                      preview: $r,
                      trees: rn,
                      actionTagIds: Or,
                      label: `Current ${kt ? "occurrence" : m.one} tags`,
                      tagsChangedSinceEditing: Ue && !tt && (!qe || qe.ids.length !== cn.current.length || qe.ids.some((g) => !cn.current.includes(g))),
                      editor: Ue && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: mn,
                          disabled: tt,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              kt ? "occurrence" : m.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              Nr,
                              {
                                entityType: "tag",
                                values: Jn,
                                onChange: Vr,
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
                                  disabled: !qe,
                                  onClick: () => void vn(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !qe,
                                  onClick: () => void vn(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    Ln(!1), requestAnimationFrame(() => {
                                      var g;
                                      return (g = Ot.current) == null ? void 0 : g.focus();
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
                Te(qt) && T.performerFocus && /* @__PURE__ */ a(
                  qi,
                  {
                    ...Ut,
                    mediaKind: h,
                    actions: pt.actions,
                    trees: rn,
                    flags: Qa
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !q && Na,
                  !q && Vt && /* @__PURE__ */ a("p", { role: "alert", children: Vt }),
                  Tt && /* @__PURE__ */ a("p", { role: "status", children: Tt })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                O && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": qa || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: Ot,
                      className: "dq-button",
                      disabled: Ft || !!q || !t || !qe,
                      onClick: () => {
                        Ct.current++, cn.current = [...qe.ids], Vr([...qe.ids]), Ln(!0), at("");
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
                      disabled: Ft || !!q,
                      onClick: () => void vn(),
                      children: [
                        /* @__PURE__ */ a(Bd, { "aria-hidden": "true" }),
                        "Skip",
                        kt ? " performer" : ` ${m.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              kt && /* @__PURE__ */ u(
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
                        "aria-pressed": yn === "items",
                        onClick: () => $n("items"),
                        children: h === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": yn === "performers",
                        onClick: () => $n("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              kt && yn === "performers" ? /* @__PURE__ */ a(
                Bh,
                {
                  ranking: ($t == null ? void 0 : $t.signature) === ve ? $t : null,
                  busy: Oe,
                  error: (W == null ? void 0 : W.signature) === ve ? W.message : "",
                  focus: T.performerFocus,
                  disabled: Ft,
                  labels: m,
                  flagLabel: wa,
                  onFocus: va,
                  onMore: () => {
                    const g = B.current;
                    g && Cr(g, g.limit + ti);
                  },
                  onRefresh: () => {
                    Ne(null), Cr(null, ti);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: er, children: J.map((g) => {
                var P;
                const E = (O == null ? void 0 : O.key) === g.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: N(g),
                    "aria-label": N(g),
                    "aria-current": E ? "true" : void 0,
                    disabled: Ft,
                    onClick: () => {
                      fn(g), rt(""), at("");
                    },
                    children: [
                      /* @__PURE__ */ a(gp, { media: g.media, kind: h }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: y(g.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          g.occurrence && /* @__PURE__ */ u(fe, { children: [
                            /* @__PURE__ */ a(ia, { performer: g.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: g.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            g.media.date,
                            g.occurrence ? "" : (P = g.media.files[0]) != null && P.duration ? qc(g.media.files[0].duration) : ""
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
        kt && /* @__PURE__ */ a(
          yc,
          {
            open: ot,
            onClose: () => lr(!1),
            criteria: Ti,
            activeFilter: kt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (g) => {
              lr(!1), Nn({ performerFilter: g });
            }
          }
        ),
        Hn && /* @__PURE__ */ a(
          rs,
          {
            actions: e.actions,
            trees: rn,
            isDisabled: (g) => Ar(g),
            tapStays: ln && bn,
            onApply: (g, E) => {
              be(!1), vn(g, E);
            },
            onClose: () => be(!1)
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
function ni(e, t) {
  const n = ze(e), r = Vn(Fi(n)), o = n === "tag" ? "tag" : Te(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function Sp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      ni(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      ni(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(fe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      ni(e, t)
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
  ), L = e.every((M) => t[M.id] !== void 0), D = r === "asc" ? "ascending" : "descending";
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
              /* @__PURE__ */ a(Oc, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: L ? e.some((M) => t[M.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              "aria-label": `Sort direction: ${D}`,
              title: `Sort direction: ${D}`,
              onClick: () => i(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(zd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(Vd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? D : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? D : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: q.map((M) => {
          const k = ze(M);
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
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(is, { label: `Actions for ${M.name}`, items: v(M) }) })
          ] }, M.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(Eo, { "aria-hidden": "true" }),
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
  const d = $(null), p = lt();
  X(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = l.current) == null || y.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(i);
  X(() => {
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
                  children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
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
                      y !== ze(o) && t(sd(y, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => os(o), children: "Export draft" }),
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
  return ze(t) === "video" && zr(t.view.objectFilter, e.view.objectFilter, fs(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function dc(e, t) {
  return qr(
    JSON.parse(br(jr(e))),
    JSON.parse(br(jr(t)))
  );
}
const ri = 180;
function uc(e) {
  return ze(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function fc(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function hc() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ai(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Ro.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  rd(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ip(e) {
  return Zt({ ...e, page: 1 });
}
function cd(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function na(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Tp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Oi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(Qd, { "aria-hidden": "true" }) }
], $p = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Oi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(Hd, { "aria-hidden": "true" }) }
], pc = [], ld = "(min-width: 900px)";
function Op(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(ld);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Rp() {
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
  }), [o, i] = C(""), [s, c] = C(!0), [l, f] = C(""), [d, p] = C(!1), [h, m] = C(!1), [y, N] = C(!1), [v, w] = C(!1), [q, L] = C([]), [D, M] = C(""), [k, x] = C(!0), [_, oe] = C("account"), [Y, U] = C(""), [le, T] = C(""), [z, I] = C(!1), [te, ee] = C(!1), [me, J] = C(""), [j, O] = C(hc), A = $(j);
  A.current = j;
  const [H, ie] = C({}), pe = $(H);
  pe.current = H;
  const G = $(t);
  G.current = t;
  const we = $(s);
  we.current = s;
  const Pe = $(!1), ge = $(!0);
  X(() => (ge.current = !0, () => {
    ge.current = !1;
  }), []);
  const [ht, ke] = C(!j);
  ht !== !j && (ke(!j), j || ie({}));
  const [Ve, tt] = C(Np), { sort: Ae, direction: $e } = Ve, Ct = (b) => {
    const S = { ...Ve, ...b };
    tt(S), qp(S);
  }, Tn = $(null), It = $(null), [nt, Re] = C(null), [sn, rt] = C(!1), [Vt, cr] = C(!1), [Tt, at] = C(null), [qe, Jt] = C(null), [Ue, Ln] = C(!1), [Jn, Vr] = C({
    revision: 0,
    keys: []
  }), cn = $(null), Ot = !!Tt || !!qe || Ue, Ht = $(Ot);
  Ht.current = Ot;
  const mn = sn || !!qe || Vt, [gn, ot] = C(0), [lr, Hn] = C(!1), [be, ln] = C(null), Qn = $(null), Dn = $(null), bn = $(null), [Je, Nt] = C(
    null
  ), de = t.find((b) => b.id === j) ?? null, K = ye(
    () => (Je == null ? void 0 : Je.id) === j && de ? { ...de, view: {
      ...de.view,
      filter: Je.view.filter,
      objectFilter: Je.view.objectFilter,
      searchMode: Je.view.searchMode,
      startFrom: Je.view.startFrom
    } } : de,
    [Je, j, de]
  ), Ee = K ? ze(K) : "video", Le = Fi(Ee), dn = K ? Te(K) : !1, ue = Ee === "video" ? K : null, Jr = !!(K != null && K.actions.some(vr)), Rt = dn && Jr, un = (!!ue || Ee === "audio" || dn) && Jr, [pt, qt] = C(null), tn = (pt == null ? void 0 : pt.id) === (K == null ? void 0 : K.id) ? pt == null ? void 0 : pt.mode : (K == null ? void 0 : K.view.reviewMode) ?? "single", mt = dn || Ee === "audio" || Ee === "video" && tn === "single", [Qt, yn] = C(0), $n = $(-1), $t = $(!1), R = $(mt);
  R.current = mt, X(() => {
    const b = () => {
      const S = R.current;
      if (!S && Xn.current) {
        $t.current = !0;
        return;
      }
      $n.current = -1, En(), S || yn((F) => F + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const B = Le === "audio" ? h : d, se = Ee === "tag" ? "Tag" : Le === "audio" ? "Audio" : "Video", Ne = Ee === "tag" ? y : B, Oe = $(
    null
  ), Me = ap(ue), [W, Ye] = C({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Xe, ve] = C({
    page: 1,
    perPage: 40
  }), [Ze, Mt] = C({ items: [], totalCount: 0 }), [_n, Va] = C(j);
  _n !== j && (Va(j), Mt({ items: [], totalCount: 0 }), ee(!1));
  const [Se, Wn] = C(!1), [Ie, kr] = C(""), [Yn, pa] = C(!1), [ma, ga] = C(!1), [Ut, wn] = C(() => /* @__PURE__ */ new Set()), Er = $(Ut);
  Er.current = Ut;
  const Ft = $(/* @__PURE__ */ new Map()), jn = (K == null ? void 0 : K.view.selectAllOnLoad) === !0, [Be, st] = C(null), dt = $(Be);
  dt.current = Be;
  const [St, fn] = C(!1), nn = $(St);
  nn.current = St;
  const Hr = $(null), [dr, On] = C(!1), [Un, Qr] = C("grid"), [ur, vn] = C(ri), [Fe, Ar] = C(!1), [Rn, ba] = C(!1), Xn = $(!1), [Mo, ya] = C(""), [kt, Nn] = C(""), [Cr, qn] = C(""), [He, Ir] = C(null), [xt, Wr] = C(""), [Sn, Tr] = C(!1), [Yr, Ja] = C({}), rn = $(/* @__PURE__ */ new Map()), Ha = $(null), Zn = $(null), fr = !!K, Fo = Ci(Op, Rp, () => !1) && fr, [Xr, xo] = C({ top: 0, bottom: 0 });
  jt(() => {
    if (!fr) return;
    const b = () => {
      const F = Zn.current;
      if (!F) return;
      const V = Math.round(F.getBoundingClientRect().top + window.scrollY), re = F.closest("main"), ae = re ? Math.round(parseFloat(getComputedStyle(re).paddingBottom) || 0) : 0;
      xo(
        (Z) => Z.top === V && Z.bottom === ae ? Z : { top: V, bottom: ae }
      );
    };
    b();
    const S = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return S == null || S.observe(document.body), window.addEventListener("resize", b), () => {
      S == null || S.disconnect(), window.removeEventListener("resize", b);
    };
  }, [fr]);
  const [Qa, wa] = C(0), va = $(null), Po = xn((b) => {
    var F;
    if ((F = va.current) == null || F.disconnect(), va.current = null, !b || typeof ResizeObserver > "u") return;
    const S = new ResizeObserver(
      () => wa(Math.round(b.getBoundingClientRect().height))
    );
    S.observe(b), va.current = S;
  }, []), an = $(0), $r = $(0), Or = $(null), er = $(null), Rr = fl(
    K && !mt ? be ? [...K.actions, ...be.draft.actions] : K.actions : pc
  ), kn = ye(
    () => be && K && de ? Cp(be.draft, K, W, de) : null,
    [be, K, W, de]
  ), Kn = ye(
    () => K && de ? ad(
      { ...de, view: { ...K.view, filter: { ...W, page: 1 } } },
      de
    ) : null,
    [K, de, W]
  ), Bn = ye(
    () => de ? ca(jr(de)) : "",
    [de]
  ), Wa = ye(
    () => Kn != null && ca(jr(Kn)) !== Bn,
    [Kn, Bn]
  ), Lo = ye(
    () => kn != null && ca(jr(kn)) !== Bn,
    [kn, Bn]
  );
  X(() => {
    if (!kt) return;
    const b = window.setTimeout(() => Nn(""), 4e3);
    return () => window.clearTimeout(b);
  }, [kt]), X(() => {
    if (!nt || nt.alert) return;
    const b = window.setTimeout(() => Re(null), 6e3);
    return () => window.clearTimeout(b);
  }, [nt]), X(() => {
    const b = ue ? ls(ue.view.objectFilter) : [];
    if (Ja({}), !b.length) return;
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
      F && Ja(
        Object.fromEntries(V.filter((re) => re !== null))
      );
    }), () => {
      F = !1, S.abort();
    };
  }, [ue == null ? void 0 : ue.id, ue == null ? void 0 : ue.view.objectFilter]);
  const Na = ye(
    () => ue ? ds(
      ue.view.objectFilter,
      Yr
    ) : (K == null ? void 0 : K.view.objectFilter) ?? {},
    [Yr, K, ue]
  ), qa = xn(async () => {
    c(!0), f("");
    try {
      const b = await gu();
      n(b.reviews), i(b.storageKey), Vu(b.storageKey), p(b.canWriteVideos ?? b.canWrite), m(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), x(b.canConfigure ?? !0), oe(b.storage ?? "account"), U(b.storageNotice ?? ""), j && !b.reviews.some((S) => S.id === j) && (O(""), ai(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [j]);
  X(() => {
    if (!v) {
      L([]), M("");
      return;
    }
    const b = new AbortController();
    return M(""), Tu(b.signal).then(L).catch((S) => {
      b.signal.aborted || M(
        S instanceof Error ? S.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), X(() => {
    qa();
  }, []), X(() => {
    if (j || t.length === 0) return;
    const b = new AbortController();
    for (const S of t) {
      if (typeof pe.current[S.id] == "number") continue;
      (Te(S) ? Gi(S, b.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : aa($o(S, V), { ...S.view.filter, page: 1, perPage: 1 }, b.signal)) : ze(S) === "tag" ? zo(
        S,
        Zt({ ...S.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : aa(
        S,
        Zt({ ...S.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((V) => {
        b.signal.aborted || ie((re) => ({
          ...re,
          [S.id]: V.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || ie((V) => ({ ...V, [S.id]: null }));
      });
    }
    return () => b.abort();
  }, [j, t]), jt(() => {
    var F, V;
    const b = It.current;
    if (j || s || !b) return;
    It.current = null, (V = (b === "heading" ? null : [...((F = Zn.current) == null ? void 0 : F.querySelectorAll("[data-review-id]")) ?? []].find(
      (re) => re.dataset.reviewId === b.reviewId
    )) ?? Tn.current) == null || V.focus();
  }, [j, s, qe, t]);
  const Sa = $(0), Mr = xn(async () => {
    const b = ++Sa.current;
    Ir(null), Wr("");
    try {
      const S = await (Rt ? Jc(Le) : zc(Le));
      b === Sa.current && Ir(S);
    } catch (S) {
      if (b !== Sa.current) return;
      Ir(null), Wr(
        "Tag assessment setup could not be checked. " + (S instanceof Error ? S.message : "Request failed.")
      );
    }
  }, [Rt, Le]);
  X(() => {
    Mr();
  }, [Mr]);
  const Mn = xn(
    async (b, S, F = !1, V = !1, re = () => !0) => {
      var je, it;
      const ae = ++an.current;
      (je = Or.current) == null || je.abort();
      const Z = new AbortController();
      Or.current = Z, S = Zt(S);
      const We = Number(S.page);
      F && (S = { ...S, page: 1 }), Ye(S), ga(F), Wn(!0), kr("");
      try {
        const wt = (At) => ze(b) === "tag" ? zo(
          b,
          At,
          Z.signal
        ) : aa(
          b,
          At,
          Z.signal
        );
        let ft = await wt(S);
        const Pt = Math.max(
          1,
          Math.ceil(ft.totalCount / Number(S.perPage))
        ), Ge = F ? Pt : Math.min(We, Pt);
        return Number(S.page) !== Ge && (S = { ...S, page: Ge }, ft = await wt(S)), ae === an.current && re(ft) && (((it = er.current) == null ? void 0 : it.page) !== Ge && (er.current = {
          page: Ge,
          ids: new Set(ft.items.map((At) => At.id))
        }), Mt(ft), V && Q(
          () => new Set(ft.items.map((At) => At.id))
        ), Ye(S), ve(S)), ft;
      } catch (wt) {
        throw ae === an.current && kr(
          wt instanceof Error ? wt.message : "Could not load the review queue."
        ), wt;
      } finally {
        ae === an.current && Wn(!1);
      }
    },
    []
  );
  X(() => {
    var S;
    if ($r.current += 1, $n.current = -1, an.current += 1, (S = Or.current) == null || S.abort(), ln(null), Qn.current = null, ee(!1), J(""), T(""), I(!1), wn(/* @__PURE__ */ new Set()), Ft.current.clear(), st(null), fn(!1), Ar(!1), Xn.current = !1, ya(""), Nn(""), qn(""), Mt({ items: [], totalCount: 0 }), er.current = null, pa(!1), !K || mt) {
      Wn(!1), Nt(null);
      return;
    }
    let b = !0;
    return Wn(!0), (async () => {
      let F = de ?? K;
      Nt(null);
      let V = null;
      const re = new URLSearchParams(window.location.search);
      if (ze(K) === "video" && Ro.some((je) => re.has(je)))
        try {
          const je = F;
          V = Ai(je, re);
          const it = Pn(je, V.query);
          (V.query.startFrom !== (je.view.startFrom ?? "end") || !qr(
            JSON.parse(br(it)),
            JSON.parse(br(Pn(je, Kr(je))))
          )) && (F = it, Nt(F));
        } catch (je) {
          pa(!0), kr(je instanceof Error ? je.message : "Could not read review URL."), Wn(!1);
          return;
        }
      let ae = null;
      try {
        ae = await qu(o, K.id);
      } catch (je) {
        b && (I(!0), T(
          je instanceof Error ? je.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Z = (ae == null ? void 0 : ae.signature) === br(F) ? ae : null, We = V ? V.query.filter : Z ? Zt(Z.filter) : Ip(F.view.filter);
      Ye(We), Qr(
        Z ? fc(Z.displayMode, ze(K)) : uc(K)
      ), vn(
        Z ? Z.cardSize ?? ri : ri
      );
      try {
        const je = await Mn(
          F,
          We,
          V ? V.startAtEnd : !Z && F.view.startFrom !== "beginning",
          F.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const it = Ss(
          je.items.map((wt) => wt.id),
          (Z == null ? void 0 : Z.focusedId) ?? null,
          (Z == null ? void 0 : Z.index) ?? 0
        );
        st(it), P(it);
      } catch {
      }
      b && ($n.current = Qt, ee(!0), J(`${K.id}:${Qt}`));
    })(), () => {
      var F;
      b = !1, $r.current++, an.current++, (F = Or.current) == null || F.abort();
    };
  }, [K == null ? void 0 : K.id, mt, Qt]), X(() => {
    if (!(!gn || mt || !K)) {
      if (Yn) {
        ot(0);
        return;
      }
      Fe || be || Rn || me !== `${K.id}:${Qt}` || (ot(0), Bo());
    }
  }, [
    gn,
    mt,
    K == null ? void 0 : K.id,
    me,
    Fe,
    Rn,
    Qt,
    Yn
  ]), X(() => {
    !ue || mt || !te || Se || Ie || Fe || $t.current || $n.current !== Qt || la(ue.id, {
      filter: W,
      objectFilter: ue.view.objectFilter,
      searchMode: ue.view.searchMode,
      startFrom: ue.view.startFrom ?? "end"
    });
  }, [ue, mt, te, Se, Ie, W, Fe, Qt]);
  const De = ye(
    () => Ze.items.map((b) => b.id),
    [Ze.items]
  );
  X(() => {
    if (!te || !K || !o || Se || Ie || Fe || (Je == null ? void 0 : Je.id) === K.id || z || $n.current !== Qt)
      return;
    const b = {
      version: 1,
      signature: br(K),
      filter: W,
      focusedId: Be,
      index: Math.max(0, De.indexOf(Be ?? -1)),
      displayMode: Un,
      cardSize: ur,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + K.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (le) return;
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
    te,
    o,
    K,
    Se,
    Ie,
    Fe,
    W,
    Be,
    De,
    Un,
    ur,
    Je,
    le,
    z,
    Qt
  ]);
  const Do = Ze.items.find((b) => b.id === Be) ?? null, Zr = Ee === "video" ? Do : null;
  St && Zr && (Hr.current = Zr);
  const Fn = Zr ?? (St ? Hr.current : null), g = As(Ut, Be), E = De.length > 0 && De.every((b) => Ut.has(b)), P = xn((b, S = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var V;
      if (Ht.current || du(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const F = rn.current.get(b);
      F == null || F.focus({ preventScroll: !0 }), S && (F == null || F.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  X(() => {
    te && !nn.current && P(dt.current);
  }, [te, P]), X(() => {
    Ue || cn.current == null || (P(cn.current), cn.current = null);
  }, [Ue, P]), X(() => {
    Se || !De.length || (dt.current == null || !De.includes(dt.current)) && (st(De[0]), nn.current || P(De[0]));
  }, [P, De, Se]);
  const Q = xn(
    (b) => {
      wn((S) => {
        const F = b(S);
        for (const V of /* @__PURE__ */ new Set([...S, ...F]))
          S.has(V) !== F.has(V) && Ft.current.set(
            V,
            (Ft.current.get(V) ?? 0) + 1
          );
        return F;
      });
    },
    []
  ), ne = xn(
    (b) => {
      if (!De.length) return;
      const S = Math.max(
        0,
        De.indexOf(dt.current ?? De[0])
      ), F = De[Math.max(0, Math.min(De.length - 1, S + b))];
      st(F), nn.current || P(F);
    },
    [P, De]
  ), ce = xn(
    async (b, S = !1) => {
      const F = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", V = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, re = V != null && (!v || !q.some((et) => et.id === V)), ae = "effect" in b && F && !v, Z = As(
        Er.current,
        dt.current
      );
      if (!K || Xn.current || Se || Ie) return;
      const We = F && !Ne ? `${se} write permission is required to apply ${b.label}.` : ae || re ? `${b.label} needs a tag group that is unavailable.` : vr(b) && (He == null ? void 0 : He.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Z.length ? "" : `Select or focus a ${Ee} before applying ${b.label}.`;
      if (We) {
        qn(We);
        return;
      }
      const je = ++$r.current, it = K.id, wt = [...De], ft = Ze, Pt = dt.current, Ge = new Set(Er.current), At = new Map(
        Z.map((et) => [et, Ft.current.get(et) ?? 0])
      ), Fr = () => je === $r.current && K.id === it;
      Xn.current = !0, Ar(!0), ya(
        Er.current.size ? `${Z.length} selected ${Ee}s` : `the focused ${Ee}`
      ), Nn(""), qn("");
      const ys = ft.items.filter(
        (et) => !Z.includes(et.id)
      ), vd = ys.map((et) => et.id), ws = Cs(
        wt,
        vd,
        Pt,
        Z.includes(Pt ?? -1)
      );
      S || (Mt({
        items: ys,
        totalCount: ft.totalCount
      }), wn((et) => {
        const Lt = new Set(et);
        for (const Bt of Z) Lt.delete(Bt);
        return Lt;
      }), st(ws), nn.current || P(ws));
      let Go = !1, Za = "";
      try {
        if ("effect" in b)
          await Pu(b, Z);
        else if (!F)
          await li(Le, b, Z);
        else {
          const et = (await Ba(b)).flatMap((An) => An.tagIds), Lt = Z.map((An) => ({
            key: String(An),
            media: ft.items.find((Gn) => Gn.id === An) ?? {
              id: An
            }
          })), Bt = () => ef(Lt, (An) => en(Le, An).catch(() => null)), pr = await Bt();
          let Ea = !1;
          try {
            await li(Le, b, Z), Ea = !0;
          } finally {
            const An = await Bt(), Gn = Lt.flatMap((tr, Gt) => {
              const zt = pr[Gt], ea = An[Gt];
              return zt && ea ? [Wi(tr, Di(tr.media, Le), zt, ea, et)] : [];
            }), vt = Lt.length - Gn.length;
            Za = Qi({
              id: Yi(),
              at: Date.now(),
              label: b.label,
              reviewName: K.name,
              reviewId: K.id,
              kind: Le,
              items: Gn
            }) ? vt && Ea ? ` Recent changes could not read ${vt} of them, so their change cannot be undone there.` : "" : " Recent changes could not record it, so it cannot be undone there.";
          }
        }
        if (Go = !0, !Fr()) return;
        S || wn((et) => {
          const Lt = new Set(et);
          for (const Bt of Z)
            (Ft.current.get(Bt) ?? 0) === At.get(Bt) && Lt.delete(Bt);
          return Lt;
        }), Nn(
          `${b.label}: ${Z.length} ${Ee}${Z.length === 1 ? "" : "s"} ${F ? "updated" : "skipped"}${S ? ", kept in place" : ""}.`
        ), Za && qn(`${b.label} was applied.${Za}`);
      } catch (et) {
        if (!Fr()) return;
        Mt(ft), wn((Lt) => {
          const Bt = new Set(Lt);
          for (const pr of Z)
            Ge.has(pr) && (Ft.current.get(pr) ?? 0) === At.get(pr) && Bt.add(pr);
          return Bt;
        }), st(Pt), nn.current || P(Pt), qn(
          `${b.label}: ${et instanceof Error ? et.message : "Action failed."}${Za}`
        );
      }
      try {
        if (!Fr()) return;
        if (S) {
          const vt = Ee === "tag" ? await zo(K, W) : await aa(K, W), Cn = new Map(
            vt.items.map((Xt) => [Xt.id, Xt])
          );
          if (Ee !== "tag" && await Promise.all(
            Z.filter((Xt) => !Cn.has(Xt)).map(async (Xt) => {
              const Aa = await yo(Le, Xt).catch(() => null);
              Aa && Cn.set(Xt, Aa);
            })
          ), !Fr()) return;
          const tr = new Set(Z), Gt = "effect" in b ? b.effect : null, zt = (Gt == null ? void 0 : Gt.mode) === "SET_TAG_GROUP" ? q.find((Xt) => Xt.id === Gt.tagGroupId) : void 0, ea = (Xt) => Gt && Gt.mode !== "SKIP" && tr.has(Xt.id) ? {
            ...Xt,
            tagGroupId: (zt == null ? void 0 : zt.id) ?? null,
            tagGroupName: (zt == null ? void 0 : zt.name) ?? null,
            tagGroupColor: (zt == null ? void 0 : zt.color) ?? null
          } : Xt;
          Mt((Xt) => ({
            items: Xt.items.map((Aa) => Cn.get(Aa.id) ?? ea(Aa)),
            totalCount: vt.totalCount
          }));
          return;
        }
        const et = new Set(Z), Lt = jn && wt.length > 0 && wt.every((vt) => et.has(vt)), Bt = er.current, pr = (K.view.startFrom ?? "end") !== "beginning", Ea = (vt) => {
          const Cn = vt.items.map((Gt) => Gt.id), tr = (Bt == null ? void 0 : Bt.page) === Number(W.page) && Cn.some((Gt) => Bt.ids.has(Gt));
          return vt.totalCount > 0 && Number(W.page) > 1 && (!Cn.length || pr && !tr);
        }, An = await Mn(K, W, !1, Lt, (vt) => !Ea(vt));
        if (!Fr()) return;
        let Gn = An.items.map((vt) => vt.id);
        if (Ea(An)) {
          const vt = Math.max(1, Number(W.page) - 1), Cn = { ...W, page: vt };
          Ye(Cn), Gn = (await Mn(
            K,
            Cn,
            !1,
            Lt
          )).items.map((zt) => zt.id), wn(
            (zt) => new Set([...zt].filter((ea) => Gn.includes(ea)))
          );
          const Gt = Gn.at(-1) ?? null;
          st(Gt), nn.current || P(Gt);
        } else {
          wn(
            (Cn) => new Set([...Cn].filter((tr) => Gn.includes(tr)))
          );
          const vt = Cs(
            wt,
            Gn,
            Pt,
            Go && Z.includes(Pt ?? -1)
          );
          st(vt), nn.current && vt == null && fn(!1), nn.current || P(vt);
        }
      } catch (et) {
        Fr() && qn(
          (Lt) => `${Lt ? `${Lt} ` : ""}${Go ? "The action completed, but " : ""}the queue could not be refreshed. ${et instanceof Error ? et.message : "Refresh failed."}`
        );
      } finally {
        Fr() && (Xn.current = !1, Ar(!1), ya(""), $t.current && ($t.current = !1, En(), yn((et) => et + 1)));
      }
    },
    [
      Ne,
      v,
      q,
      Ee,
      He,
      Mn,
      W,
      P,
      De,
      Ze,
      Se,
      Ie,
      K
    ]
  );
  function xe() {
    var F;
    if (Un === "list") return 1;
    const b = (F = Ha.current) == null ? void 0 : F.firstElementChild, S = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, S.split(" ").filter(Boolean).length);
  }
  const gt = $(() => {
  });
  gt.current = (b) => {
    var ae;
    if (mt || b.defaultPrevented || b.repeat || In(b) || b.ctrlKey || b.altKey || b.metaKey || Ot) return;
    const S = b.target, F = S instanceof Node && ((ae = Zn.current) == null ? void 0 : ae.contains(S)) === !0, V = S === document.body || S === document.documentElement;
    if (!F && !V) return;
    if (dr) {
      b.key === "Escape" && (na(b), On(!1));
      return;
    }
    if (St && b.key === "Escape") {
      na(b), fn(!1), P(dt.current);
      return;
    }
    if (!lu(S)) return;
    const re = cu(S);
    if (b.key === "Escape") {
      na(b), Q(() => /* @__PURE__ */ new Set()), S instanceof HTMLElement && S.closest(".dq-action-bar") && P(dt.current, !1);
      return;
    }
    if (!St && b.key === " " && re) {
      na(b), Be != null && Q((Z) => so(Z, Be));
      return;
    }
    if (!(Fe || Se) && !St && b.key === "Enter" && Be != null && re) {
      if (Ee !== "tag" && be) return;
      na(b), Ee === "tag" ? window.open(`/tag/${Be}`, "_blank", "noopener,noreferrer") : fn(!0);
      return;
    }
  }, X(() => {
    const b = (S) => gt.current(S);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const bt = $(
    () => {
    }
  );
  bt.current = (b) => {
    var ae;
    if (mt || Ot || St || dr || Fe || Se || !De.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const S = b.target, F = S instanceof Node && ((ae = Zn.current) == null ? void 0 : ae.contains(S)) === !0, V = S === document.body || S === document.documentElement;
    if (!F && !V || !b.key.startsWith("Arrow") || !uu(S)) return;
    const re = fu(b.key, xe());
    re && (b.preventDefault(), F ? b.stopImmediatePropagation() : b.stopPropagation(), ne(re));
  }, X(() => {
    const b = (S) => bt.current(S);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), X(() => {
    const b = () => {
      var F;
      const S = document.activeElement;
      !(S instanceof HTMLInputElement) || S.type !== "range" || !((F = Zn.current) != null && F.contains(S)) || R.current || S.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (S.blur(), P(dt.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [P]);
  const _e = (be == null ? void 0 : be.saving) === !0 || Rn, Et = Fe || Se && !te || _e, ut = ns();
  ts({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!K && !mt && !Ot && !be && !St && !dr && !Ie && (Ze.items.length > 0 || Se || Fe),
    actions: (K == null ? void 0 : K.actions) ?? pc,
    onAction: (b, S) => {
      const F = K == null ? void 0 : K.actions[b];
      F && ce(F, S);
    },
    onFind: () => On(!0),
    onSelectAll: () => Q((b) => su(b, De))
  }), X(() => On(!1), [mt, St, K == null ? void 0 : K.id]);
  function Ce(b) {
    const S = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", F = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, V = F != null && !q.some((re) => re.id === F);
    return Fe || Se || !!Ie || S && !Ne || "effect" in b && S && (!v || V) || vr(b) && (He == null ? void 0 : He.kind) !== "ready" || !g.length;
  }
  function Kt(b) {
    qt(null), ot(0), Re(null), O(b), ai(b, !!b && !K);
  }
  function yt() {
    Pe.current || (nd() ? (Pe.current = !0, window.history.back()) : Kt(""));
  }
  function En() {
    const b = Pe.current;
    Pe.current = !1;
    let S = hc();
    S && !we.current && !G.current.some((V) => V.id === S) && (S = "", ai(""));
    const F = A.current;
    S !== F && (ot(0), b || Re(null), !S && F && (It.current ?? (It.current = { reviewId: F }))), O(S);
  }
  function on() {
    It.current = "heading", Re(null), yt();
  }
  function Qe(b) {
    b !== j && Kt(b), ot((S) => S + 1);
  }
  function ct() {
    Re(null), at({
      review: sd("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Wt(b) {
    if (mn || !k) return;
    Re(null);
    const S = crypto.randomUUID();
    let F;
    const V = j;
    cr(!0);
    try {
      if (!await ka((ae) => (F = Es(
        ae.find((Z) => Z.id === b.id) ?? b,
        ae,
        S
      ), [...ae, F]))) throw new Error("Could not save reviews.");
      if (!ge.current) return;
      A.current !== V ? Re({ text: `Saved the copy “${F.name}”.`, alert: !1 }) : Qe(F.id);
    } catch (re) {
      Re({
        text: `“${b.name}” was not duplicated. ${Ya(re)}`,
        alert: !0
      });
    } finally {
      cr(!1);
    }
  }
  async function Yt() {
    if (!Tt || Tt.saving) return;
    const b = { ...Tt.review, name: Tt.review.name.trim() }, S = Fa(b);
    if (S) {
      at({ ...Tt, error: S });
      return;
    }
    at({ ...Tt, saving: !0, error: "" });
    try {
      if (!await ka((F) => [...F, b]))
        throw new Error("Could not save reviews.");
      if (!ge.current) return;
      at(null), Qe(b.id);
    } catch (F) {
      at(
        (V) => V && {
          ...V,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (F instanceof Error ? F.message : "Retry saving.")
        }
      );
    }
  }
  async function hr() {
    if (!qe || qe.pending) return;
    const b = qe.review, S = id(t, H, Ae, $e).map((re) => re.id), F = S.filter((re) => re !== b.id), V = F[Math.min(S.indexOf(b.id), F.length - 1)];
    Jt({ review: b, pending: !0 });
    try {
      if (!await ka((re) => re.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      It.current = b.id !== j && V ? { reviewId: V } : "heading", Re({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (re) {
      Re({ text: `“${b.name}” was not deleted. ${Ya(re)}`, alert: !0 });
    } finally {
      Jt(null);
    }
  }
  async function _o(b) {
    if (!(mn || !k)) {
      Re(null), rt(!0);
      try {
        const S = await fh(b);
        let F = 0, V = 0;
        if (S.length && !await ka((ae) => {
          const Z = [...ae];
          F = V = 0;
          for (const We of S) {
            const je = Z.find((it) => it.id === We.id);
            if (!je) Z.push(We);
            else if (co(je, !0) !== co(We, !0) && // Imported before, its copy is listed already under its own id and name.
            !Z.some(
              (it) => it.id !== We.id && co(it) === co(We)
            ))
              Z.push(Es(We, Z, crypto.randomUUID())), V++;
            else continue;
            F++;
          }
          return F ? Z : ae;
        }))
          throw new Error("Could not save reviews.");
        const re = S.length - F;
        Re({
          alert: !1,
          text: S.length ? F ? `Imported ${F === 1 ? "1 review" : `${F} reviews`}` + (V ? ` (${V === 1 ? "1 as a copy" : `${V} as copies`} beside a listed version that differs)` : "") + "." + (re === 1 ? " 1 review already in the list stays as it is." : re ? ` ${re} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (S) {
        Re({ alert: !0, text: `Could not import “${b.name}”. ${Ya(S)}` });
      } finally {
        rt(!1);
      }
    }
  }
  function Ya(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function hs(b) {
    const S = !k || mn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Ec, { "aria-hidden": "true" }),
        disabled: S,
        onSelect: () => void Wt(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Oc, { "aria-hidden": "true" }),
        onSelect: () => os(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(ko, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: S,
        onSelect: () => {
          Re(null), Jt({ review: b, pending: !1 });
        }
      }
    ];
  }
  function ps(b, S) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
        ...S,
        disabled: S.disabled || Vt
      },
      ...hs(b),
      {
        label: "Recent changes…",
        icon: /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
        separated: !0,
        onSelect: () => Ln(!0)
      },
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ja, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Vt,
        onSelect: on
      }
    ];
  }
  async function ka(b) {
    if (!o) return !1;
    let S = [];
    const F = await vu(o, (Z) => {
      S = Z;
      const We = b(Z);
      return We === Z ? Z : We.map(Pp);
    });
    if (n(F), !ge.current) return !0;
    const V = A.current;
    V && !F.some((Z) => Z.id === V) && yt();
    const re = S.find((Z) => Z.id === V), ae = F.find((Z) => Z.id === V);
    return ae && re && ((ae.view.reviewMode ?? "single") !== (re.view.reviewMode ?? "single") && qt(null), ae.view.displayMode !== re.view.displayMode && Qr(uc(ae))), !0;
  }
  function jo(b) {
    return ka((S) => xp(S, b));
  }
  function dd(b) {
    return jo(b).catch((S) => {
      throw A.current !== b.id && Uo(b, S), S;
    });
  }
  function Uo(b, S) {
    var V;
    if (!ge.current) return;
    const F = ((V = G.current.find((re) => re.id === b.id)) == null ? void 0 : V.name) ?? b.name;
    Re({ text: `“${F}” was not saved. ${Ya(S)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(mc, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(fe, { children: [
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
          onRetry: () => void qa()
        }
      )
    ] });
  const Ko = /* @__PURE__ */ u(fe, { children: [
    Y && /* @__PURE__ */ a("p", { className: "dq-status", children: Y }),
    un && (He == null ? void 0 : He.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      He.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Sn,
          onClick: () => {
            Tr(!0), Wr(""), (Rt ? Fu(Le) : Mu(Le)).then(Mr).catch(
              (b) => Wr(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => Tr(!1));
          },
          children: Sn ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    un && ((He == null ? void 0 : He.kind) === "incompatible" || xt) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(nr, {}),
      xt || (He == null ? void 0 : He.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Sn,
          onClick: () => {
            Tr(!0), Mr().finally(
              () => Tr(!1)
            );
          },
          children: Sn ? "Checking…" : "Check again"
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
    le && /* @__PURE__ */ u("p", { role: "alert", children: [
      le,
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
    nt && (nt.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
      nt.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: nt.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Zn,
      className: `data-quality-page${fr ? " dq-page-fit" : ""}`,
      style: fr ? {
        "--dq-fit-top": `${Xr.top}px`,
        "--dq-fit-bottom": `${Xr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: nt && !nt.alert ? nt.text : "" }),
        K && mt ? /* @__PURE__ */ a(
          wp,
          {
            review: de ?? K,
            canWrite: dn ? y : B,
            canAssess: (He == null ? void 0 : He.kind) === "ready" && B,
            onBusy: Ar,
            editRequest: gn,
            onEditRequestHandled: () => ot(0),
            undoRevision: Jn.revision,
            undoneKeys: Jn.keys,
            onSaveDefaults: k ? dd : void 0,
            pageControls: {
              onBack: on,
              moreItems: (b) => ps(de ?? K, b),
              onGrid: ue ? () => qt({ id: ue.id, mode: "multiple" }) : void 0,
              notices: Ko,
              busy: Vt
            },
            stayOnTap: lr,
            onStayOnTapChange: Hn
          },
          K.id
        ) : K ? yd(K) : /* @__PURE__ */ a(
          kp,
          {
            reviews: t,
            counts: H,
            sort: Ae,
            direction: $e,
            onSortChange: (b) => Ct({ sort: b }),
            onDirectionChange: (b) => Ct({ direction: b }),
            storage: Ap[_],
            canConfigure: k,
            busy: mn,
            headingRef: Tn,
            notices: Ko,
            onOpen: Kt,
            onNew: () => ct(),
            onImport: (b) => void _o(b),
            onExportAll: () => xl(t, "data-quality-reviews.json"),
            onHistory: () => Ln(!0),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
                disabled: !k || mn,
                onSelect: () => Qe(b.id)
              },
              ...hs(b)
            ]
          }
        ),
        St && Fn && ue && /* @__PURE__ */ a(
          jp,
          {
            video: Fn,
            review: ue,
            details: op(Fn, ue, Me.ids),
            selectedCount: Ut.size,
            pending: Fe,
            refreshing: Se || !!Ie,
            error: Cr,
            canWrite: d,
            assessmentReady: (He == null ? void 0 : He.kind) === "ready",
            trees: Rr,
            selected: Ut.has(Fn.id),
            hasPrevious: De.indexOf(Fn.id) > 0,
            hasNext: De.indexOf(Fn.id) >= 0 && De.indexOf(Fn.id) < De.length - 1,
            onToggleSelected: () => Q((b) => so(b, Fn.id)),
            onPrevious: () => ne(-1),
            onNext: () => ne(1),
            onClose: () => {
              fn(!1), P(dt.current);
            },
            onAction: ce,
            findOpen: dr,
            onFindOpenChange: On
          }
        ),
        dr && K && !mt && !St && /* @__PURE__ */ a(
          rs,
          {
            actions: K.actions,
            tagGroups: q,
            trees: Rr,
            isDisabled: Ce,
            onApply: (b, S) => {
              On(!1), ce(b, S);
            },
            onClose: () => On(!1)
          }
        ),
        Ue && /* @__PURE__ */ a(
          rf,
          {
            onClose: () => Ln(!1),
            onUndone: (b, S) => {
              const F = K && b.reviewId === K.id ? S : [];
              Vr((V) => ({ revision: V.revision + 1, keys: F })), cn.current = null, K && !mt && !Xn.current && Mn(K, W).then((V) => {
                const re = V.items.find((ae) => F.includes(String(ae.id)));
                re && (st(re.id), Ht.current ? cn.current = re.id : P(re.id));
              }).catch(() => {
              });
            }
          }
        ),
        Tt && /* @__PURE__ */ a(
          Ep,
          {
            draft: Tt,
            onChange: (b) => at((S) => S && { ...S, review: b, error: "" }),
            onCreate: () => void Yt(),
            onCancel: () => at(null)
          }
        ),
        /* @__PURE__ */ a(
          Rd,
          {
            open: !!qe,
            title: "Delete review?",
            message: qe ? `“${qe.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (qe == null ? void 0 : qe.pending) ?? !1,
            onConfirm: () => void hr(),
            onCancel: () => Jt((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function Xa(b, S, F = !1, V = !0) {
    const re = dt.current, ae = Math.max(0, De.indexOf(re ?? -1));
    try {
      const Z = Mn(
        b,
        S,
        F,
        b.view.selectAllOnLoad === !0
      ), We = an.current, je = await Z;
      if (We !== an.current) return;
      const it = je.items.map((ft) => ft.id);
      wn(
        (ft) => new Set([...ft].filter((Pt) => it.includes(Pt)))
      );
      const wt = Ss(it, re, ae);
      st(wt), V && !nn.current && P(wt, !1);
    } catch {
    }
  }
  function ud(b) {
    const S = Oe.current;
    if (Oe.current = null, Et || !K || !de) return;
    const F = S ?? K.view.objectFilter, V = qr(
      F,
      de.view.objectFilter
    ) ? de.view.objectFilter : F, re = Zt({ ...b, page: 1 }), ae = {
      ...K,
      view: {
        ...K.view,
        filter: re,
        objectFilter: V
      }
    }, Z = !dc(ae, de), We = Z ? ae : de;
    Nt(Z ? ae : null);
    const { page: je, ...it } = Zt(b), { page: wt, ...ft } = Zt(Ie ? Xe : W), Pt = !S && JSON.stringify(it) === JSON.stringify(ft);
    Nn(Z || Pt ? "" : "Review queue defaults restored."), Xa(We, re, Pt || We.view.startFrom !== "beginning");
  }
  function fd() {
    if (Fe || Se || _e || !de) return;
    Oe.current = null;
    const b = Zt({
      ...de.view.filter,
      page: 1
    });
    Nt(null), Nn("Review queue defaults restored."), Xa(
      de,
      b,
      de.view.startFrom !== "beginning",
      !1
    );
  }
  function hd() {
    if (Fe || Se || Ie || _e || !K || !Kn || !k)
      return;
    const b = K, S = Kn;
    ba(!0), jo(S).then((F) => {
      !F || A.current !== S.id || (Nt(lc(S, b)), Nn("Queue saved to this review."));
    }).catch((F) => {
      A.current !== S.id ? Uo(S, F) : qn(F instanceof Error ? F.message : "Could not save queue.");
    }).finally(() => ba(!1));
  }
  function Bo() {
    if (!K || !de || Xn.current || be || Rn) return;
    Dn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Qn.current = {
      temporaryReview: Je,
      filter: W,
      loadedFilter: Xe,
      queue: Ze,
      queueError: Ie,
      retryFromEnd: ma,
      selectedIds: new Set(Ut),
      focusedId: Be,
      pageCursor: er.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...de,
      view: { ...de.view, startFrom: K.view.startFrom ?? "end" }
    });
    On(!1), fn(!1), Nn(""), qn(""), ln({ draft: b, saving: !1, error: "" });
  }
  function ms() {
    ln(null), Qn.current = null;
    const b = Dn.current;
    Dn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : P(dt.current, !1);
    });
  }
  function pd() {
    var S;
    if (!be || be.saving) return;
    const b = Qn.current;
    b && (an.current += 1, (S = Or.current) == null || S.abort(), Oe.current = null, Wn(!1), Nt(b.temporaryReview), Ye(b.filter), ve(b.loadedFilter), Mt(b.queue), kr(b.queueError), ga(b.retryFromEnd), Q(() => b.selectedIds), st(b.focusedId), er.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), ms();
  }
  async function md() {
    if (!be || be.saving || !kn || !K) return;
    const b = K, S = { ...kn, name: kn.name.trim() }, F = Fa(S);
    if (F) {
      ln((V) => V && { ...V, error: F });
      return;
    }
    ln((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await jo(S)) throw new Error("Could not save reviews.");
      if (!ge.current || A.current !== S.id) return;
      Nt(lc(S, b)), ze(S) === "video" && la(S.id, {
        filter: W,
        objectFilter: b.view.objectFilter,
        searchMode: S.view.searchMode,
        startFrom: S.view.startFrom ?? "end"
      }), Nn("Review saved."), ms();
    } catch (V) {
      if (A.current !== S.id) {
        Uo(S, V);
        return;
      }
      ln(
        (re) => re && {
          ...re,
          saving: !1,
          error: Dc(V)
        }
      );
    }
  }
  function gs() {
    K && Mn(K, W, ma, jn).catch(() => {
    });
  }
  function gd() {
    wn(/* @__PURE__ */ new Set()), Ft.current.clear(), st(null);
  }
  function bd(b) {
    !K || Fe || _e || b === Number(W.page) || Fp(
      { ...W, page: b },
      K,
      (S, F) => Mn(S, F, !1, jn),
      gd
    );
  }
  function bs(b) {
    if (!ue || !de || Fe || Se || _e) return;
    const S = td(ue, b, de.view.objectFilter), F = !dc(S, de);
    Nt(F ? S : null), F ? Xa(S, { ...W, page: 1 }) : Xa(
      de,
      { ...W, page: 1 },
      de.view.startFrom !== "beginning"
    );
  }
  function yd(b) {
    var je, it, wt, ft, Pt;
    const S = Ee === "tag", F = S ? "tag" : "video", V = Math.max(1, Number(W.perPage) || 40), re = Math.max(1, Math.ceil(Ze.totalCount / V)), ae = Math.min(Math.max(1, Number(W.page) || 1), re), Z = [
      Ne ? "" : `${se} write permission is required to apply actions.`,
      S && D ? `Tag groups are unavailable. ${D}` : ""
    ].filter(Boolean), We = !!Cr && !St;
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
              entityType: Ee,
              onBack: on,
              backDisabled: Fe || !!be || Vt,
              onEdit: be ? () => {
                var Ge;
                return (Ge = bn.current) == null ? void 0 : Ge.focus();
              } : Bo,
              editDisabled: !be && (Fe || Se || Yn || Rn || Vt || !k),
              editing: !!be,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Et, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: S ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  Oa,
                  {
                    filter: Ie ? Xe : W,
                    onFilterChange: ud,
                    totalCount: Ze.totalCount,
                    sortOptions: S ? Fd : vc,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Un,
                    zoomLevel: (ur - 225) / 50,
                    onZoomChange: (Ge) => vn(Math.round(225 + Ge * 50)),
                    cardSizeEntityType: S ? "tags" : "videos",
                    criteriaDefinitions: S ? Md : So,
                    customFieldEntityType: Ee === "video" ? "video" : void 0,
                    supportsFilterExpressions: !S,
                    objectFilter: Na,
                    onObjectFilterChange: (Ge) => {
                      Et || (Oe.current = Ee === "video" ? Ul(
                        Ge,
                        Yr,
                        b.view.objectFilter
                      ) : Ge);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_l, { page: ae, pages: re, onPage: bd })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(fe, { children: [
                ue && /* @__PURE__ */ a(
                  jl,
                  {
                    mode: "multiple",
                    disabled: Fe || Se || Ot || !!be || Rn || Vt,
                    onChange: () => qt({ id: ue.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Eh,
                  {
                    options: S ? $p : Tp,
                    value: Un,
                    onChange: (Ge) => Qr(fc(Ge, Ee))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                is,
                {
                  disabled: Fe || !!be,
                  items: ps(de ?? b, {
                    onSelect: Bo,
                    disabled: Se || Yn || Rn || !k
                  })
                }
              ),
              queueDiffers: te ? (Je == null ? void 0 : Je.id) === j : void 0,
              queueChange: !be && (Je == null ? void 0 : Je.id) === j ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Wa ? hd : void 0,
                saveDisabled: Fe || Se || !!Ie || _e || !k,
                onReset: fd,
                resetDisabled: Fe || Se || _e
              } : void 0,
              chipsAfter: (it = (je = ue == null ? void 0 : ue.presentation) == null ? void 0 : je.binParents) != null && it.length || (ft = (wt = ue == null ? void 0 : ue.presentation) == null ? void 0 : wt.filterBins) != null && ft.length ? /* @__PURE__ */ u(fe, { children: [
                !!((Pt = ue.presentation.binParents) != null && Pt.length) && /* @__PURE__ */ a(
                  ip,
                  {
                    videos: Ze.items,
                    review: ue,
                    savedObjectFilter: (de ?? ue).view.objectFilter,
                    trees: Me.ids,
                    disabled: Fe || Se || _e,
                    onToggle: bs
                  }
                ),
                /* @__PURE__ */ a(
                  sp,
                  {
                    review: ue,
                    savedObjectFilter: (de ?? ue).view.objectFilter,
                    queueFilter: W,
                    queueCount: Se || Ie ? null : Ze.totalCount,
                    disabled: Fe || Se || _e,
                    countsPaused: Fe || Se || _e || !te,
                    onToggle: bs
                  }
                )
              ] }) : void 0,
              chipsEnd: be ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          Ko,
          ue && Me.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: Me.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            be && kn && /* @__PURE__ */ a(
              Ll,
              {
                drawerRef: bn,
                draft: kn,
                onChange: (Ge) => ln((At) => At && { ...At, draft: Ge }),
                direction: be.draft.view.startFrom ?? "end",
                onDirectionChange: (Ge) => ln(
                  (At) => At && {
                    ...At,
                    draft: { ...At.draft, view: { ...At.draft.view, startFrom: Ge } }
                  }
                ),
                tagGroups: q,
                trees: Rr,
                saving: be.saving,
                saveDisabled: Se || !!Ie,
                error: be.error,
                dirty: Lo,
                criteriaChanged: Wa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Ie && !Se ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Ie,
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
                style: { "--dq-dock-height": `${Qa}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Se && !Ze.items.length && /* @__PURE__ */ a(mc, { label: "Loading review queue…" }),
                    Ie && !Se && /* @__PURE__ */ a(
                      gc,
                      {
                        message: Ie,
                        retryLabel: Yn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Yn && de && ze(de) === "video") {
                            const Ge = Kr(de);
                            la(de.id, { ...Ge, filter: { ...Ge.filter, page: void 0 } }), yn((At) => At + 1);
                            return;
                          }
                          gs();
                        }
                      }
                    ),
                    !Fe && !Se && !Ie && !Ze.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(Eo, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        F,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ze.items.length && /* @__PURE__ */ a("div", { ref: Ha, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: Un === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${ur}px` },
                        children: Ze.items.map(wd)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Po, children: /* @__PURE__ */ a(
                    Cl,
                    {
                      actions: be ? be.draft.actions : b.actions,
                      tagGroups: q,
                      trees: Rr,
                      isDisabled: Ce,
                      paused: !!be,
                      busy: Fe || Se,
                      onApply: (Ge) => void ce(Ge),
                      onFind: () => On(!0),
                      status: Fe ? `Applying action to ${Mo}…` : "",
                      summary: /* @__PURE__ */ u(fe, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Ut.size ? `${Ut.size} selected` : Be == null ? "Nothing to apply to" : `Applies to the focused ${F}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !De.length || E,
                            onClick: () => Q((Ge) => /* @__PURE__ */ new Set([...Ge, ...De])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(_t, { binding: ut.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Ut.size,
                            onClick: () => Q(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(_t, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: Z.length ? Z.join(" ") : void 0,
                      keyHints: S ? be ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : be ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: We || kt ? /* @__PURE__ */ u(fe, { children: [
                        We && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(nr, { "aria-hidden": "true" }),
                          Cr
                        ] }),
                        kt && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: kt })
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
    if (Ee === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Lp,
        {
          tag: ae,
          displayMode: Un === "list" ? "list" : "grid",
          focused: ae.id === Be,
          selected: Ut.has(ae.id),
          setRef: (Z) => {
            Z ? rn.current.set(ae.id, Z) : rn.current.delete(ae.id);
          },
          onFocus: () => st(ae.id),
          onToggle: () => {
            Q((Z) => so(Z, ae.id)), P(ae.id, !1);
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
        video: Zl(S, ue, Me.ids),
        showTagBins: ((V = (F = ue == null ? void 0 : ue.presentation) == null ? void 0 : F.annotations) == null ? void 0 : V.includes("tags")) && !!((re = ue.presentation.annotationParents) != null && re.length),
        displayMode: Un,
        cardsScroll: Fo,
        focused: S.id === Be,
        selected: Ut.has(S.id),
        setRef: (ae) => {
          ae ? rn.current.set(S.id, ae) : rn.current.delete(S.id);
        },
        onFocus: () => st(S.id),
        onToggle: () => Q((ae) => so(ae, S.id)),
        onPreview: () => {
          be || (st(S.id), fn(!0));
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
function so(e, t) {
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
function co(e, t = !1) {
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
  const f = $(null), d = xn(
    (p) => {
      f.current = p, o(p);
    },
    [o]
  );
  return jt(() => {
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
  return jt(() => {
    const q = h.current;
    if (!q) return;
    const L = q.querySelector(
      `a[href="/video/${e.id}"]`
    ), D = q.querySelector(".card-title"), M = `dq-card-title-${e.id}`;
    D && (D.id = M), L && (L.target = "_blank", L.rel = "noreferrer", L.removeAttribute("aria-label"), L.setAttribute("aria-labelledby", M), L.classList.add("dq-card-link"));
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
  return X(() => {
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
  }, [e.id, e.files.length, t]), X(() => {
    if (!o) {
      f(!1);
      return;
    }
    const d = new AbortController();
    return he(Ou(e.id), {
      signal: d.signal
    }).then((p) => {
      d.signal.aborted || f(p.available === !0);
    }).catch(() => {
      d.signal.aborted || f(!1);
    }), () => d.abort();
  }, [o, e.id]), X(() => {
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
  onFindOpenChange: L
}) {
  const D = $(null), M = za(), k = $(null), x = $(null), _ = e.files[0], oe = cd(e), Y = (I) => o || i || "steps" in I && I.steps.length > 0 && !c || vr(I) && !l;
  ts({
    surface: "overlay",
    enabled: !q,
    actions: t.actions,
    onAction: (I, te) => {
      const ee = t.actions[I];
      ee && w(ee, te);
    },
    onFind: () => L(!0)
  }), X(() => {
    var te;
    const I = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (te = D.current) == null || te.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = I;
    };
  }, []);
  function U(I) {
    var me, J, j;
    if (I.key !== "Tab") return;
    const te = [
      ...((me = D.current) == null ? void 0 : me.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((O) => O.offsetParent !== null);
    if (!te.length) {
      I.preventDefault(), (J = D.current) == null || J.focus();
      return;
    }
    const ee = te.indexOf(
      document.activeElement
    );
    I.shiftKey && ee <= 0 ? (I.preventDefault(), (j = te.at(-1)) == null || j.focus()) : !I.shiftKey && ee === te.length - 1 && (I.preventDefault(), te[0].focus());
  }
  function le(I) {
    if (q || I.defaultPrevented || I.ctrlKey || I.metaKey || I.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const te = I.key === "ArrowLeft" || I.key === "ArrowRight";
    if (I.altKey && !te) return;
    const ee = k.current, me = I.currentTarget.querySelector("video");
    if (I.key === "Enter" || I.key === "Escape")
      I.repeat || v();
    else if (I.key === " " && ee)
      I.repeat || ee.toggle();
    else if (te && ee)
      ee.seekBy(
        (I.key === "ArrowLeft" ? -1 : 1) * (I.shiftKey ? 5 : I.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(I.key) && ee) {
      const J = x.current;
      if (!I.repeat && (J == null ? void 0 : J.videoId) === e.id) {
        const j = [_ == null ? void 0 : _.duration, me == null ? void 0 : me.duration].find(
          (ie) => ie != null && Number.isFinite(ie) && ie > 0
        ) ?? 0, O = e.parentVideoId != null, A = O ? e.clipStartSec ?? 0 : 0, H = (O ? e.clipEndSec ?? j : j) - A;
        Number.isFinite(H) && H > 0 && Number.isFinite(J.time) && ee.seekBy(A + H * Number(I.key) / 10 - J.time);
      }
    } else if (I.key === "ArrowUp" || I.key === "ArrowDown")
      !I.repeat && !o && !i && (I.key === "ArrowUp" && p && y(), I.key === "ArrowDown" && h && N());
    else return;
    na(I);
  }
  function T(I) {
    const te = D.current, ee = I.target instanceof Element ? I.target.closest("button, a[href]") : null;
    !te || !ee || !te.contains(ee) || ee.closest(".dq-player, .dq-find-action") || I.detail === 0 || te.focus({ preventScroll: !0 });
  }
  X(() => {
    if (q) return;
    let I = 0;
    const te = requestAnimationFrame(() => {
      I = requestAnimationFrame(() => {
        var me;
        const ee = document.activeElement;
        (me = D.current) != null && me.isConnected && (!ee || ee === document.body || ee === document.documentElement) && D.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(te), cancelAnimationFrame(I);
    };
  }, [q, o, i, h, p, e.id, M]);
  const z = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: D,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${oe}`,
      className: `dq-preview${M ? " dq-preview-mobile" : ""}`,
      onKeyDown: U,
      onKeyDownCapture: le,
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
                  /* @__PURE__ */ a(ja, { "aria-hidden": "true" }),
                  !M && /* @__PURE__ */ a(_t, { binding: "↑", hidden: !0 })
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
                  !M && /* @__PURE__ */ a(_t, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Tc, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: oe }),
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(fa, {}) }),
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
                "aria-label": `Open ${oe} in a new tab`,
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
                children: /* @__PURE__ */ a(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: _ ? /* @__PURE__ */ a(
            Nc,
            {
              autostart: !0,
              streamUrl: ci("video", e.id),
              posterUrl: Ts(e),
              format: _.format,
              audioCodec: _.audioCodec,
              duration: _.duration ?? 0,
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
              isDisabled: Y,
              busy: o || i,
              onApply: (I) => void w(I),
              onFind: () => L(!0),
              status: o ? `Applying action to ${z}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        q && /* @__PURE__ */ a(
          rs,
          {
            actions: t.actions,
            trees: f,
            isDisabled: Y,
            onApply: (I, te) => {
              L(!1), w(I, te);
            },
            onClose: () => L(!1)
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
    /* @__PURE__ */ a(nr, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Qp = { components: { DataQualityPage: Mp } };
export {
  Mp as DataQualityPage,
  Qp as default,
  qr as objectFiltersEqual
};
