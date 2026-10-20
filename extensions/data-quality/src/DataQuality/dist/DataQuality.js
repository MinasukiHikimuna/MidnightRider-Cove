var wd = Object.defineProperty;
var vd = (e, t, n) => t in e ? wd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var gs = (e, t, n) => vd(e, typeof t != "symbol" ? t + "" : t, n);
import { jsxs as u, jsx as a, Fragment as he } from "react/jsx-runtime";
import { useState as T, useEffect as X, useMemo as ve, useId as at, useRef as I, useLayoutEffect as Mt, useCallback as Cn, useSyncExternalStore as Si, createContext as Nd, useContext as qd, Fragment as ki } from "react";
import { useKeySequence as Sd, EntityReferenceMultiSelector as yr, SortableList as hc, TagBadge as kd, EntityReferenceSelector as bs, EntityDetailTabs as Ed, FilterDialog as mc, VIDEO_CRITERIA as ko, DetailListToolbar as Ca, PERFORMER_CRITERIA as Ei, AUDIO_CRITERIA as gc, NarrativeText as Ad, AUDIO_SORT_OPTIONS as Cd, VIDEO_SORT_OPTIONS as bc, AudioPlayer as Td, VideoPlayer as yc, formatDuration as wc, getResolutionLabel as Id, ConfirmDialog as $d, TAG_CRITERIA as Od, TAG_SORT_OPTIONS as Rd, TagTile as Md, VideoCard as Fd } from "@cove/runtime/components";
import { Undo2 as Fa, X as sa, Search as xa, Flag as Hn, Check as ca, Pencil as ia, Ban as ho, ChevronDown as Ai, Plus as Pa, Pin as vc, GripVertical as Nc, AlertTriangle as Vn, Copy as qc, Trash2 as Eo, Mic as xd, Users as Sc, Tag as kc, Headphones as Ec, Film as Ao, ChevronLeft as La, MoreHorizontal as Pd, RectangleHorizontal as Ld, LayoutGrid as Ci, ChevronRight as Ac, Save as Dd, RotateCcw as _d, Layers as ys, RefreshCw as jd, ExternalLink as Cc, SkipForward as Ud, Upload as Kd, Download as Tc, ArrowUp as Bd, ArrowDown as Gd, Loader2 as zd, List as Vd, Grid3X3 as Jd } from "@cove/runtime/lucide-react";
import { extensionFetch as Hd } from "@cove/runtime/api";
import { createPortal as Qd } from "react-dom";
const Ti = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Ii = Object.keys(
  Ti
);
function Ta(e) {
  return e === "excludes" || e === "excludesAll";
}
function Co(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Ic(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Wd(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const mo = { min: 115, max: 625 }, Yd = (e) => Math.min(mo.max, Math.max(mo.min, e)), $c = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Oe(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function $i(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function je(e) {
  return $i(ze(e));
}
function Xd(e) {
  return ze(e) === "video";
}
function ze(e) {
  return e.entityType ?? "video";
}
const mr = [
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
], To = [
  mr.slice(0, 11),
  mr.slice(11, 22),
  mr.slice(22)
];
function Ea(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function Ia(e) {
  return Ea(e) ?? e.toLocaleUpperCase();
}
const gr = "none";
function Lr(e) {
  return typeof e == "string" && mr.includes(e);
}
function Oi(e) {
  const t = e.shortcut;
  return Lr(t) || t === gr ? t : "auto";
}
function Oc(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const l = Oi(s);
    if (l !== gr) {
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
  const i = mr.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const l = i[c];
    l !== void 0 && (t[s] = l, n.set(l, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function Zd(e, t, n) {
  const { keys: r, actionOn: o } = Oc(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (Lr(n)) {
    const c = o.get(n), l = r[t];
    c !== void 0 && c !== t && i.set(c, l && e[t].shortcut === l ? l : void 0);
  }
  const s = new Set([...i.values()].filter(Lr));
  return e.map((c, l) => {
    const f = i.has(l) ? i.get(l) : Lr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: d, ...p } = c;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function $a(e) {
  var n;
  return Oe(e) && !Mc(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Xd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : ze(e) !== "tag" && e.actions.some(
    (r) => Ri(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : e.name.trim() ? e.actions.every((r) => Qn(r, ze(e))) ? new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "" : "Give every action a label and say what it does before saving." : "Name the review before saving.";
}
const eu = {
  video: 1e3,
  audio: 250
};
function Ht(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(eu[t], n(e.perPage, 40))
    )
  };
}
function ws(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function hr(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Oe(e) ? [e.entityType, ...r, e.occurrence] : ze(e) === "video" ? r : [ze(e), ...r]
  );
}
function Qn(e, t) {
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
  ) && !Ri(e) : !1;
}
function tu(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Jn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function vr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Rc(e) {
  return "steps" in e && e.steps.length > 0;
}
function br(e) {
  return "steps" in e ? e.steps.some((t) => Jn(t.mode)) : !1;
}
function Ri(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Jn(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function Da(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || $c.includes(n.entityType)) && (!tu(n.entityType) || Mc(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && nu(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Qn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Qn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => $a(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function nu(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= mo.min && n.cardSize <= mo.max) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0 && n.filterBins === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && (n.filterBins === void 0 || Array.isArray(n.filterBins) && n.filterBins.every(
    (r) => !!r && typeof r == "object" && typeof r.key == "string" && !!r.key && typeof r.label == "string" && (r.group === void 0 || typeof r.group == "string") && !!r.filter && typeof r.filter == "object" && !Array.isArray(r.filter)
  ) && new Set(n.filterBins.map((r) => r.key)).size === n.filterBins.length);
}
function vs(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function ru(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const l = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(l))) return l;
  }
}
function Ns(e, t, n) {
  return { ...structuredClone(e), id: n, name: ru(e.name, t) };
}
function Mc(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Ii.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || au(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function au(e) {
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
function qs(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Ss(e, t, n, r) {
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
function ou(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function iu(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function yn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function su(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function cu(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function lu(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function du(e, t) {
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
const Fc = "ext:com.midnightrider.data-quality:configuration", uu = "ext:cove-data-quality:video-reviews", ti = "ext:com.midnightrider.data-quality:progress";
class go extends Error {
  constructor(n, r) {
    super(n);
    /** The configuration as the other browser left it, when it was read. */
    gs(this, "remote");
    this.remote = r;
  }
}
function xc(e) {
  return `Could not save review. Your edits are still open. ${e instanceof Error ? e.message : "Retry saving."}` + (e instanceof go ? " Export draft keeps your version: import it after reloading to add it as a copy." : "");
}
const _a = /* @__PURE__ */ new Map(), no = /* @__PURE__ */ new Map(), Fr = (e, t) => e.includes("*") || e.includes(t), bo = (e) => me(`/api/savedfilters?mode=${encodeURIComponent(e)}`), fu = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function ni(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Zr(e) {
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
    reviews: Da(JSON.stringify(t.reviews)),
    deletedIds: ni(t.deletedIds),
    importedIds: ni(t.importedIds)
  };
}
function pu(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = Da(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    ni(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function Pc(e) {
  const t = await me("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Mi(e, t) {
  const n = (no.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return no.set(e, n), n.finally(() => {
    no.get(e) === n && no.delete(e);
  }).catch(() => {
  }), n;
}
let qa = null;
function hu() {
  if (qa) return qa;
  const e = mu();
  return qa = e, e.finally(() => {
    qa === e && (qa = null);
  }).catch(() => {
  }), e;
}
async function mu() {
  const e = await me("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Mi(t, () => gu(e, t));
}
async function gu(e, t) {
  var h;
  const n = String(e.user.id), r = Fr(e.permissions, "savedfilters.read"), o = r && Fr(e.permissions, "savedfilters.write"), i = r ? (await bo(Fc)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
  if (i.length > 1) {
    const m = (y) => {
      const { revision: N, ...v } = Zr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (i.some((y) => m(y) !== m(i[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const y of i.slice(1))
        await me(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    i.splice(1);
  }
  let s = i.length ? Zr(i[0].uiOptions) : fu();
  const c = localStorage.getItem(`${t}:migrated`) === "true", l = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && l && (s = Zr(l));
  let d = !i.length;
  if (i.length && f && l) {
    const m = Zr(l);
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
      reviews: vs(s.reviews, m.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...m.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const m = JSON.stringify(s), y = pu(n);
    if (i.length && y.reviews.some((k) => {
      const M = s.reviews.find((x) => x.id === k.id);
      return M && JSON.stringify(M) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await bo(uu)).flatMap(
      (k) => Da(k.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (k) => !y.reviews.some((M) => M.id === k)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: vs(
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
  if (_a.set(t, p), d && o) {
    const m = s;
    i.length && (p.config = Zr(i[0].uiOptions)), await Lc(t, m), s = p.config;
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
    canWrite: Fr(e.permissions, "videos.write"),
    canWriteVideos: Fr(e.permissions, "videos.write"),
    canWriteAudios: Fr(e.permissions, "audios.write"),
    canWriteTags: Fr(e.permissions, "tags.write"),
    canReadTagGroups: Fr(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Lc(e, t) {
  const n = _a.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Pc(n), n.recordId != null) {
      const i = await me(
        `/api/savedfilters/${n.recordId}`
      ), s = Zr(i.uiOptions);
      if (s.revision !== n.config.revision)
        throw new go(
          "Reviews changed in another browser. Reload the page to get them, then try again.",
          s
        );
    }
    const o = await me(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Fc,
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
const ta = (e, t) => JSON.stringify(e.find((n) => n.id === t) ?? ""), bu = (e, t) => [...new Set([...e, ...t].map((n) => n.id))].filter(
  (n) => ta(e, n) !== ta(t, n)
);
function yu(e, t) {
  return Mi(e, async () => {
    const n = _a.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config;
    try {
      return await wu(n, e, t);
    } catch (o) {
      throw n.config = r, o;
    }
  });
}
async function wu(e, t, n) {
  var r;
  for (let o = 1; ; o++) {
    const i = e.config.reviews, s = n(i);
    if (s === i) return i;
    Da(JSON.stringify(s));
    const c = i.filter((l) => !s.some((f) => f.id === l.id)).map((l) => l.id);
    try {
      return await Lc(t, {
        ...e.config,
        reviews: s,
        deletedIds: [
          .../* @__PURE__ */ new Set([...e.config.deletedIds, ...c])
        ].filter((l) => !s.some((f) => f.id === l))
      }), s;
    } catch (l) {
      const f = l instanceof go ? l.remote : void 0;
      if (!f || o >= 3) throw l;
      const d = bu(i, s).find(
        (p) => ta(i, p) !== ta(f.reviews, p) && ta(f.reviews, p) !== ta(s, p)
      );
      if (d !== void 0) {
        const p = (r = s.find((h) => h.id === d) ?? i.find((h) => h.id === d)) == null ? void 0 : r.name;
        throw new go(
          f.reviews.some((h) => h.id === d) ? `“${p ?? "This review"}” was also changed in another browser. Reload the page to get that version.` : `“${p ?? "This review"}” was deleted in another browser. Reload the page to see the reviews as they are now.`
        );
      }
      e.config = f;
    }
  }
}
function ks(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && !Number.isFinite(t.cardSize) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t.cardSize === null ? t : { ...t, cardSize: Yd(t.cardSize) };
}
async function vu(e, t) {
  const n = _a.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? ks(r) : null;
  if (!n.readable) return o;
  const i = (await bo(ti)).find(
    (c) => c.name === t
  ), s = i ? ks(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function Nu(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return Mi(r, async () => {
    const o = _a.get(e);
    if (!(o != null && o.writable)) return;
    await Pc(o);
    const i = (await bo(ti)).find(
      (s) => s.name === t
    );
    await me(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: ti,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Pn(e) {
  return e === "audio" ? "audios" : "videos";
}
const qu = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Fi(e, t) {
  var n, r;
  return e.title || ((r = (n = e.files) == null ? void 0 : n[0]) == null ? void 0 : r.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Ln(e) {
  return qu[e];
}
const yo = "confirmed_absent_tags", xi = "Confirmed absent tags", Io = "confirmed_absent_occurrence_tags", Dc = {
  key: yo,
  label: xi,
  type: "tag",
  subject: "tag assessments"
}, Pi = {
  key: Io,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Su = {
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
function Wn(e) {
  return Array.isArray(e) ? e.map(Wn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Su[n] ?? n : t === "key" && typeof n == "string" && [
        yo,
        Io
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Wn(n)
    ])
  ) : e;
}
async function _c(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Hd(e, { ...t, headers: r });
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
async function me(e, t = {}) {
  return await _c(e, t, "fail");
}
function ku(e, t = {}) {
  return _c(e, t, "null");
}
const Eu = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Au = 0;
function wo(e, t) {
  return me(
    `/api/${Pn(e)}/${t}?dqRead=${Eu}-${++Au}`,
    { cache: "no-store" }
  );
}
function jc(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Wn({
      findFilter: Ht(t, je(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function na(e, t, n) {
  return me(
    `/api/${Pn(je(e))}/find`,
    { method: "POST", signal: n, body: jc(e, t) }
  );
}
async function Li(e, t, n) {
  return (await me(
    `/api/${Pn(je(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: jc(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Ko(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, me("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Wn({
        findFilter: Ht(t),
        objectFilter: r
      })
    )
  });
}
function Cu(e) {
  return me("/api/taggroups", { signal: e });
}
function ri(e, t, n = 1280) {
  return `/api/${Pn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ai(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Es(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Tu(e) {
  return `/api/stream/video/${e}/preview`;
}
function Iu(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function $o(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await me(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await me("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Wn({
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
async function ja(e, t) {
  const n = vr(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await $o(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function $u(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function Di(e, t) {
  const r = (await me("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = $u(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Ln(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function Uc(e, t) {
  const n = await Di(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await me(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await me("/api/custom-fields", {
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
function Kc(e = "video") {
  return Di(Dc, e);
}
async function Bc(e) {
  let t;
  try {
    t = await Kc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${xi} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
function Ou(e = "video") {
  return Uc(Dc, e);
}
function Gc(e = "video") {
  return Di(Pi, e);
}
function Ru(e = "video") {
  return Uc(Pi, e);
}
function vo(e) {
  return [...new Set(e)];
}
function zc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === Io
  ), o = r === void 0 ? [] : n[r];
  return vo(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function Vc(e) {
  let t;
  try {
    t = await Gc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${Pi.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Jc(e, t, n, r, o, i) {
  await me(`/api/${Pn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: vo(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function Mu(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${xi} custom field is not available.`
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
async function oi(e, t, n) {
  if (!Qn(t) || n.length === 0 || n.some((l) => !Number.isSafeInteger(l) || l <= 0))
    throw new Error(
      `Choose ${Ln(e).many} and configure a valid action first.`
    );
  const r = br(t) ? await Bc(e) : null, o = vo(n), i = (await ja(t)).map((l) => ({
    mode: l.mode,
    tagIds: vo(l.tagIds)
  })), c = [
    ...i.filter((l) => !Jn(l.mode)),
    ...i.filter((l) => Jn(l.mode))
  ].map(
    (l) => Mu(l, o, r)
  );
  for (let l = 0; l < c.length; l++)
    try {
      await me(`/api/${Pn(e)}/bulk`, {
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
async function Fu(e, t) {
  if (!Qn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await me("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const xu = 600 * 1e3, _i = /* @__PURE__ */ new Map(), Hc = /* @__PURE__ */ new Map(), pr = /* @__PURE__ */ new Map();
function Qc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = Hc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function Wc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && Hc.set(e.tagGroupId, e.tagGroupSortOrder), _i.set(e.id, { tag: e, at: Date.now() });
}
function Yc(e) {
  const t = _i.get(e);
  if (!(!t || Date.now() - t.at > xu))
    return Qc(t.tag);
}
function Xc(e) {
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
function ii(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && Wc(Xc({ ...n, name: r }));
  }
}
function Pu(e) {
  const t = pr.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: me(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var d, p;
        const i = ((d = o == null ? void 0 : o.name) == null ? void 0 : d.trim()) || null;
        if (pr.get(e) === r && pr.delete(e), !i) return null;
        const s = Xc({ ...o, id: e, name: i }), c = (p = _i.get(e)) == null ? void 0 : p.tag, l = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (l ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return Wc(f), Qc(f);
      },
      () => (pr.get(e) === r && pr.delete(e), null)
    )
  };
  return pr.set(e, r), r;
}
function As() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function Bo(e) {
  const t = {};
  for (const n of e) {
    const r = Yc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function Lu(e, t) {
  if (t != null && t.aborted) return Promise.reject(As());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = Yc(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = Pu(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: d } of r)
        d.waiters -= 1, d.waiters === 0 && pr.get(f) === d && (pr.delete(f), d.controller.abort());
    }, l = () => {
      s || (s = !0, c(), i(As()));
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
function Zc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Ua(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = T(() => ({
    key: t,
    tags: Bo(Go(t))
  }));
  return X(() => {
    const o = Go(t), i = Bo(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return Lu(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : Bo(Go(t));
}
function Kr(e) {
  const t = Ua(e);
  return ve(() => Zc(t), [t]);
}
function Go(e) {
  return e ? e.split(",").map(Number) : [];
}
async function Du(e, t, n) {
  if (!Qn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = je(e), o = n.steps.some((c) => Jn(c.mode)) ? await Vc(r) : "", i = await ja(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((l) => !Jn(l.mode)),
    ...i.filter((l) => Jn(l.mode))
  ]) {
    const l = (f) => Jc(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await l("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await nl(
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
async function ji(e, t) {
  const n = e.occurrence;
  if (Co(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await me("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Wn({
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
  return Ta(e.condition) && e.hideConfirmedAbsent !== !1;
}
function Oo(e, t) {
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
    entityType: je(e),
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
async function Ui(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => $o([n], t))
  );
}
function tl(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function _u(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function ju(e, t, n, r, o) {
  if (!el(e)) return !1;
  const i = zc(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((l) => r.includes(l))
  );
}
async function Ki(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || tl(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = je(e), i = await na(
    Oo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, l = i.items.length ? await Ui(c, r) : [], f = new Array(i.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; d < i.items.length; ) {
        const p = d++, h = i.items[p], m = await me(
          `/api/tagapplications?hostType=${o}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = m.filter(
            (w) => w.hostType === o && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return _u(e.occurrence, v, l) && !ju(c, h, y.id, v, l) ? [
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
async function nl(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = je(e), i = await wo(o, t.media.id);
  if (!i.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await me(s)).filter(
    (f) => f.hostType === o && f.hostId === i.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), l = new Set(n);
  try {
    for (const f of l)
      c.some((d) => d.tag.id === f) || await me("/api/tagapplications", {
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
      r.has(f.tag.id) && !l.has(f.tag.id) && await me(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await me(s);
  } catch (f) {
    throw new Error(
      `Some tag changes may have been saved. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Yn(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Uu(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function Qt(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const l = n ? zc(
      await wo(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await me(Uu(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return ii(f.map((d) => d.tag)), {
      ids: [...new Set(f.map((d) => d.tag.id))],
      names: [...new Set(f.map((d) => d.tag.name))],
      absent: l,
      applications: f
    };
  }
  const r = await wo(e, t.media.id), o = (r.tags ?? []).filter(
    (l) => l.canRemove !== !1 || l.isDerived !== !0
  );
  ii(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (l) => l.toLowerCase() === yo
  ) ?? yo, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
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
async function Bi(e, t, n) {
  if (t.occurrence && Oe(e))
    await nl(
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
      o.length && await me(
        `/api/${Pn(je(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function Ku(e, t, n) {
  t.occurrence && Oe(e) ? await Du(e, t.occurrence, n) : await oi(je(e), n, [t.media.id]);
}
function si(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Yn(o(t.ids), o(n.ids)),
    absence: Yn(o(t.absent), o(n.absent))
  };
}
function rl(e, t) {
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
const al = 50, Bu = 15e5;
let No = "";
const ci = /* @__PURE__ */ new Set();
function Gu(e) {
  No !== e && (No = e, ol());
}
const Gi = () => No ? `${No}:history` : "";
function ol() {
  ci.forEach((e) => e());
}
function zu(e) {
  ci.add(e);
  const t = (n) => {
    n.key === Gi() && e();
  };
  return window.addEventListener("storage", t), () => {
    ci.delete(e), window.removeEventListener("storage", t);
  };
}
const Cs = (e) => Array.isArray(e) && e.every((t) => Number.isSafeInteger(t)), Ts = (e) => typeof e == "object" && e !== null && Cs(e.added) && Cs(e.removed);
function Vu(e) {
  var n;
  const t = e;
  return typeof e == "object" && e !== null && Number.isSafeInteger(t.mediaId) && Ts(t.tags) && Ts(t.absence) && (t.performer === void 0 || Number.isSafeInteger((n = t.performer) == null ? void 0 : n.id));
}
function Ju(e) {
  const t = e;
  return typeof e == "object" && e !== null && typeof t.id == "string" && typeof t.at == "number" && (t.kind === "video" || t.kind === "audio") && Array.isArray(t.items) && t.items.every(Vu);
}
function Oa() {
  const e = Gi();
  if (!e) return [];
  try {
    const t = JSON.parse(localStorage.getItem(e) ?? "[]");
    return Array.isArray(t) ? t.filter(Ju).map((n) => ({
      ...n,
      label: String(n.label ?? ""),
      reviewName: String(n.reviewName ?? ""),
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
function Ra(e, t) {
  const n = Gi();
  if (!n) return !1;
  let r = [...e];
  const o = /* @__PURE__ */ new Map();
  let i = 2;
  const s = () => {
    let l = r.length - 1;
    for (; l >= 0 && r[l].id === t; ) l--;
    return l < 0 ? !1 : (i -= o.get(r[l]) ?? 0, r.splice(l, 1), !0);
  };
  for (; r.length > al; ) s();
  for (const l of r)
    o.set(l, JSON.stringify(l).length + 1), i += o.get(l);
  const c = () => {
    for (; i > Bu; ) if (!s()) return !1;
    return !0;
  };
  for (; c(); )
    try {
      return localStorage.setItem(n, JSON.stringify(r)), ol(), !0;
    } catch {
      if (!s()) break;
    }
  return t !== void 0 && Ra(e.filter((l) => l.id !== t)), !1;
}
function zi(e) {
  try {
    const t = e.items.filter((r) => r.undone || uo(r)), n = Oa().filter((r) => r.id !== e.id);
    return t.some((r) => !r.undone) ? Ra([{ ...e, items: t }, ...n].sort((r, o) => o.at - r.at), e.id) : (Ra(n), !0);
  } catch {
    return !1;
  }
}
function Hu() {
  Ra([]);
}
const uo = (e) => [e.tags, e.absence].some(
  (t) => t.added.length > 0 || t.removed.length > 0
);
function Vi(e, t, n, r, o) {
  var d, p, h, m;
  const i = (y) => o ? y.filter((N) => o.includes(N)) : y, s = Yn(i(n.ids), i(r.ids)), c = Yn(i(n.absent), i(r.absent)), l = {};
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
function il(e) {
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
function Qu(e) {
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
    item: il(e),
    before: { ids: e.tags.removed, names: [], absent: e.absence.removed },
    after: t,
    tags: e.tags,
    absence: e.absence
  };
}
function zo(e, t) {
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
async function Wu(e, t) {
  var p;
  const n = il(t), r = t.absence.added.length + t.absence.removed.length > 0, o = await Qt(e, n, r), i = zo(t, o);
  if (!uo(i)) return { ...t, undone: !0, error: void 0 };
  rl(Qu(i), o);
  const s = (p = i.performer) == null ? void 0 : p.id, c = r ? s === void 0 ? await Bc(e) : await Vc(e) : "", l = async (h, m) => {
    h.length && (s !== void 0 ? await Jc(c, e, i.mediaId, s, h, m) : await me(`/api/${Pn(e)}/bulk`, {
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
        i.tags.added.includes(h.tag.id) && await me(`/api/tagapplications/${h.id}`, { method: "DELETE" });
      for (const h of i.tags.removed)
        await me("/api/tagapplications", {
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
        m.length && await me(`/api/${Pn(e)}/bulk`, {
          method: "POST",
          body: JSON.stringify({ ids: [i.mediaId], tagMode: h, tagIds: m })
        });
    await l(i.absence.removed, "ADD");
  } catch (h) {
    const m = await Qt(e, n, r).catch(() => null), y = m ? zo(i, m) : i;
    if (!uo(y)) return { ...t, undone: !0, error: void 0 };
    throw Object.assign(new Error(sl(h)), { left: y });
  }
  const f = await Qt(e, n, r), d = zo(i, f);
  if (uo(d))
    throw Object.assign(new Error("Undo did not restore every affected tag."), { left: d });
  return { ...t, undone: !0, error: void 0 };
}
const sl = (e) => e instanceof Error ? e.message : "Request failed.";
async function Yu(e, t = () => {
}) {
  const n = Oa().find((d) => d.id === e);
  if (!n) throw new Error("This change is no longer in the history.");
  const r = [...n.items], o = r.flatMap((d, p) => d.undone ? [] : [p]);
  let i = 0, s = 0, c = 0, l = Date.now();
  const f = () => {
    l = Date.now();
    const d = Oa(), p = d.findIndex((h) => h.id === e);
    p >= 0 && (d[p] = { ...d[p], items: r }, Ra(d));
  };
  return await Promise.all(
    Array.from({ length: Math.min(4, o.length) }, async () => {
      for (; i < o.length; ) {
        const d = o[i++];
        try {
          r[d] = await Wu(n.kind, r[d]);
        } catch (p) {
          c++;
          const h = p.left ?? r[d];
          r[d] = { ...h, undone: !1, error: sl(p) };
        }
        Date.now() - l > 1e3 && f(), t(++s, o.length);
      }
    })
  ), f(), { undone: s - c, failed: c };
}
async function Xu(e, t) {
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
const Ji = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
function Is(e) {
  const t = e.items.length, n = e.items.some((i) => i.performer), { one: r, many: o } = Ln(e.kind);
  return `${t.toLocaleString()} ${n ? t === 1 ? "occurrence" : "occurrences" : t === 1 ? r : o}`;
}
function Zu({
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
function ef({
  record: e,
  busy: t,
  progress: n,
  onUndo: r
}) {
  const o = ve(
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
  ), i = Kr(o), s = e.items.filter((p) => p.undone).length, c = e.items.filter((p) => !p.undone && p.error).length, l = e.items.length - s, [f, d] = T(e.items.length === 1);
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
          Is(e)
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
            /* @__PURE__ */ a(Fa, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a("summary", { children: e.items.length === 1 ? "Show the change" : `Show all ${Is(e)}` }),
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
                  /* @__PURE__ */ a(Zu, { item: p, names: i }),
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
function tf({
  onClose: e,
  onUndone: t
}) {
  const n = at(), r = I(null), o = I(null), [i, s] = T(Oa), [c, l] = T(null), [f, d] = T(), [p, h] = T(""), [m, y] = T(!1), N = I(null), v = I(null);
  X(() => zu(() => s(Oa())), []), X(() => {
    var O, E;
    const x = document.activeElement;
    return (O = r.current) == null || O.showModal(), (E = o.current) == null || E.focus(), () => {
      x != null && x.isConnected && x.focus();
    };
  }, []);
  const w = I(!1);
  X(() => {
    var x, O, E;
    m ? (x = v.current) == null || x.focus() : w.current && ((E = ((O = N.current) == null ? void 0 : O.disabled) === !1 ? N.current : o.current) == null || E.focus()), w.current = m;
  }, [m]);
  const k = c !== null;
  async function M(x) {
    l(x.id), y(!1), h(""), d({ done: 0, total: x.items.filter((O) => !O.undone).length });
    try {
      await Yu(x.id, (O, E) => d({ done: O, total: E }));
    } catch (O) {
      h(O instanceof Error ? O.message : String(O));
    } finally {
      l(null), d(void 0), t(), requestAnimationFrame(() => {
        var O, E;
        (O = r.current) != null && O.contains(document.activeElement) || (E = o.current) == null || E.focus();
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
      onCancel: (x) => {
        x.preventDefault(), k || e();
      },
      onClose: () => {
        var x;
        k ? (x = r.current) == null || x.showModal() : e();
      },
      children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
          /* @__PURE__ */ a(Fa, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("h2", { id: `${n}-title`, children: "Recent changes" }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-batch-close",
              "aria-label": "Close dialog",
              disabled: k,
              onClick: e,
              children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
            }
          )
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-batch-body", ref: o, tabIndex: -1, role: "group", "aria-label": "Recorded changes", children: [
          /* @__PURE__ */ u("p", { className: "dq-history-intro", children: [
            "What Data Quality changed from this browser, newest first; the last",
            " ",
            al,
            " changes are kept. Undo restores only the tags a change touched, where they are still as it left them, and keeps later edits."
          ] }),
          p && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: p }),
          i.length ? i.map((x) => /* @__PURE__ */ a(
            ef,
            {
              record: x,
              busy: k,
              progress: c === x.id ? f : void 0,
              onUndo: () => void M(x)
            },
            x.id
          )) : /* @__PURE__ */ a("p", { className: "dq-history-empty", children: "No changes recorded yet." })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
          m ? /* @__PURE__ */ u(he, { children: [
            /* @__PURE__ */ a("span", { children: "Forget every recorded change? Nothing is undone." }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button dq-button-danger",
                disabled: k,
                onClick: () => {
                  Hu(), y(!1);
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
              disabled: k || !i.length,
              onClick: () => y(!0),
              children: "Clear history…"
            }
          ),
          /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: e, children: "Close" })
        ] })
      ]
    }
  );
}
const ro = (e) => e >= "0" && e <= "9";
function $s(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Os(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (ro(e[n]) && ro(t[r])) {
      const c = n, l = r;
      for (; n < e.length && ro(e[n]); ) n++;
      for (; r < t.length && ro(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), d = t.slice(l, r).replace(/^0+/, "");
      if (f.length !== d.length) return f.length < d.length ? -1 : 1;
      if (f !== d) return f < d ? -1 : 1;
      continue;
    }
    const i = $s(e[n]), s = $s(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function cl(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Os(e.tagGroupName, t.tagGroupName) || Os(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Dr(e) {
  return [...e].sort(cl);
}
const li = /* @__PURE__ */ new Map();
function nf(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function Hi(e, t, n) {
  const r = vr(e), o = [], i = [];
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
    ...i.filter((h) => !Jn(h.mode)),
    ...i.filter((h) => Jn(h.mode))
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
function rf(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return Dr(t);
}
function ll(e) {
  return dl(nf(e));
}
function dl(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), o = I(/* @__PURE__ */ new Set()), i = I(!0);
  return X(() => (i.current = !0, () => {
    i.current = !1;
  }), []), X(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), $o([c]).then(
        (l) => {
          i.current && r((f) => new Map(f).set(c, l));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Ot(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function jr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = Ot(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Rs(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Ot(t.group) !== "");
}
function ul(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function fl(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function pl(e) {
  return vr(e).size > 0 || fl(e).size > 0;
}
function af(e) {
  return jr(e).filter(
    (t) => !t.actions.some((n) => pl(e[n]))
  );
}
function di(e, t) {
  const n = ul(t), r = new Set(t.absent);
  return jr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const l = [...vr(e[c])], f = [...fl(e[c])], d = [
        ...l.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function ui(e) {
  return e.filter((t) => t.answers.length === 0);
}
function of(e, t, n) {
  const r = { ids: [...ul(t)], absent: t.absent }, o = Hi(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const ra = "review";
function sf(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function cf(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function xr(e, t) {
  const n = new Set(sf(e));
  return t.filter((r) => n.has(r.id));
}
function Ms(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const l = r.get(s) ?? c();
    return r.set(s, l), l;
  };
  for (const s of xr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const l = c.categoryTagId === void 0 ? o(ra, () => ({
        key: ra,
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
    ...i.filter((s) => s.key === ra),
    ...i.filter((s) => s.key !== ra)
  ];
}
function fi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function Qi(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => fi(s.key, s.members, o) && !(c > i && fi(o.key, o.members, s))
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
function lf(e, t) {
  return t.filter(
    (n) => n.key === e.key || fi(n.key, n.tagIds ?? [], e)
  );
}
function hl(...e) {
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
    ...n.filter((r) => r.key === ra),
    ...n.filter((r) => r.key !== ra)
  ];
}
function df(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function ml(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = df(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function uf(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => ml(o, r, n))
  );
}
function ff(e, t, n) {
  return t.filter((r) => r.tagIds !== null && ml(e, r, n));
}
function pf(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function Wi(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [pf(e.mixed)] : []
  ];
}
function hf(e) {
  const t = Wi(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function mf(e, t, n) {
  const r = xr(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const pi = "-", Fs = "Ctrl+a", gf = "Ctrl/⌘A", bf = ["f", "g", "k", "n", "m", ",", "."], Vo = "Shift+", gl = {
  ",": [";", "<"],
  ".": [":", ">"]
}, yf = new Set(Object.values(gl).flat()), xs = { Comma: ",", Period: "." };
function wf(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(xs, t.code) ? xs[t.code] : void 0;
}
function la(e) {
  return ve(() => Oc(e), [e]);
}
function Yi({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = la(n), c = I({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  Mt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const l = !!o && n.length > 0, f = e === "local" && !!i, d = mr.filter(
    (h) => s.actionOn.has(h) || bf.includes(h)
  ).join(" "), p = ve(() => {
    const h = (N, v) => {
      var k, M;
      const w = c.current;
      if (N === Fs) (k = w.onSelectAll) == null || k.call(w);
      else if (N === pi) (M = w.onFind) == null || M.call(w);
      else {
        const x = yf.has(N), O = x || N.startsWith(Vo), E = x ? wf(v) : O ? N.slice(Vo.length) : N, P = E === void 0 ? void 0 : w.keyMap.actionOn.get(E);
        P !== void 0 && w.onAction(P, O);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Fs, "local")), l && y.push(m(pi));
    for (const N of d ? d.split(" ") : []) {
      const v = gl[N];
      y.push(m(N), ...(v ?? [`${Vo}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, d, l, f]);
  Sd(p, t);
}
const vf = {
  find: pi,
  selectAll: gf
};
function Xi() {
  return vf;
}
const Nf = "(max-width: 760px)";
function bl(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Cn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Si(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ka() {
  return bl(Nf);
}
function qf(e, t, n = !1) {
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
function Br(e, t, n = [], r) {
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
  const o = vr(e), i = (s) => o.has(s) || [...o].some((c) => {
    var l;
    return (l = r == null ? void 0 : r.get(s)) == null ? void 0 : l.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => qf(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function Ro(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function Zi({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const l = Ka(), [f, d] = T(""), [p, h] = T(0), m = I(null), y = I(null), N = I(null), v = I(null), w = I(null), k = I(/* @__PURE__ */ new Set()), M = at(), x = Kr(ve(() => Ro(e), [e])), O = la(e), E = ve(() => {
    const j = f.trim().toLocaleLowerCase(), J = (L) => L ? mr.indexOf(L) : mr.length;
    return e.map((L, F) => ({ action: L, index: F, key: O.keys[F] })).sort((L, F) => J(L.key) - J(F.key)).filter((L) => !j || L.action.label.toLocaleLowerCase().includes(j));
  }, [e, O, f]), P = E.length ? Math.min(p, E.length - 1) : -1, _ = (j) => `${M}-option-${j}`;
  Mt(() => {
    var j, J, L;
    return v.current = document.activeElement, w.current = ((J = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : J.closest('[role="dialog"]')) ?? null, (L = m.current) == null || L.focus({ preventScroll: !0 }), () => {
      var D;
      const F = v.current;
      F instanceof HTMLElement && F.isConnected && F.focus({ preventScroll: !0 }), document.activeElement !== F && ((D = w.current) != null && D.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), X(() => {
    var j, J, L;
    P < 0 || (L = (J = (j = y.current) == null ? void 0 : j.querySelector(`[id="${_(E[P].index)}"]`)) == null ? void 0 : J.scrollIntoView) == null || L.call(J, { block: "nearest" });
  }, [P, E]);
  function re(j, J) {
    !j || r != null && r(j.action) || s(j.action, o && J);
  }
  function H(j) {
    var L;
    j.stopPropagation();
    const J = j.code || j.key;
    if (j.repeat || k.current.add(J), !yn(j)) {
      if (j.repeat && !k.current.has(J)) {
        j.preventDefault();
        return;
      }
      if (j.key === "Escape")
        j.preventDefault(), j.repeat || c();
      else if (j.key === "Enter")
        j.preventDefault(), j.repeat || re(E[P], j.shiftKey);
      else if (j.key === "ArrowDown" || j.key === "ArrowUp") {
        if (j.preventDefault(), !E.length) return;
        const F = j.key === "ArrowDown" ? 1 : -1;
        h((P + F + E.length) % E.length);
      } else j.key === "Tab" && (j.preventDefault(), (L = m.current) == null || L.focus());
    }
  }
  return /* @__PURE__ */ u(he, { children: [
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
          j.target !== m.current && j.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(xa, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: m,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${M}-list`,
                "aria-activedescendant": P >= 0 ? _(E[P].index) : void 0,
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
          E.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${M}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: E.map((j, J) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: _(j.index),
                  tabIndex: -1,
                  "aria-selected": J === P,
                  disabled: (r == null ? void 0 : r(j.action)) ?? !1,
                  onClick: (L) => re(j, L.shiftKey || i && Rc(j.action)),
                  children: [
                    l ? null : j.key ? /* @__PURE__ */ u(he, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": Ea(j.key) ? !0 : void 0, children: j.key }),
                      Ea(j.key) && /* @__PURE__ */ u(he, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: Ea(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Br(j.action, x, t, n).map(
                      (L, F) => /* @__PURE__ */ a("span", { "data-effect-tone": L.tone, children: L.text }, F)
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
function yl() {
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
function es(e) {
  return Si(e.subscribe, e.get, e.get);
}
function wl(e, t) {
  const n = I(t);
  Mt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function vl(e, t) {
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
const Sf = [], hi = To.map(
  (e, t) => ({ indent: t, keys: e })
), Ps = hi.length - 1;
function Rt({ binding: e, hidden: t }) {
  const n = t ? void 0 : Ea(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(he, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function ao(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function Nl(e) {
  return To.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function ql({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(he, { children: r.map((o, i) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === r.length - 1 && n
  ] }, i)) });
}
function Sl({
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
          /* @__PURE__ */ a(xa, { "aria-hidden": "true" }),
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
function kf({
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
                /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  l
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ a(ca, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(he, { children: [
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
function Ef({ checked: e, onChange: t }) {
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
function Af({
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
  attention: p = Sf,
  stayOnTap: h = !1,
  onStayOnTapChange: m
}) {
  const y = Xi(), N = la(e), v = Ka();
  wl(i, v);
  const w = at(), k = Kr(
    ve(() => e.flatMap((S) => S.steps.flatMap((ce) => ce.tagIds)), [e])
  ), M = hi.filter((S) => S.keys.some((ce) => N.actionOn.has(ce))), x = M.includes(hi[Ps]), O = e.length - N.actionOn.size, E = ve(
    () => d && !f ? jr(e) : [],
    [d, f, e]
  ), P = ve(
    () => E.length && r ? di(e, r) : null,
    [E, e, r]
  ), _ = new Map(
    ui(P ?? []).flatMap(
      (S) => S.actions.filter((ce) => pl(e[ce])).map((ce) => [ce, S.name])
    )
  ), re = ve(
    () => e.map((S) => f ? [] : ff(S, p, o)),
    [e, p, o, f]
  ), H = (S) => S.map(hf).join("; "), j = re.map(H), J = E.length > 0 && /* @__PURE__ */ a(
    kf,
    {
      groups: E,
      statuses: P,
      actions: e,
      attentionOf: (S) => H([
        ...new Map(
          S.actions.flatMap((ce) => re[ce]).map((ce) => [ce.key, ce])
        ).values()
      ])
    }
  ), L = (S) => {
    const ce = Br(e[S], k, [], o).map((se) => se.text).join(", "), C = _.get(S), ee = j[S];
    return [
      ce,
      C === void 0 ? "" : `${C}: not answered yet`,
      ee ? `Needs attention: ${ee}` : ""
    ].filter(Boolean).join(". ");
  }, F = (S) => j[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${j[S]}`,
        children: /* @__PURE__ */ a(Hn, {})
      }
    )
  ) : null, D = (S) => ({
    onMouseEnter: () => i.set(S),
    onMouseLeave: () => i.clear(S),
    onFocus: () => i.set(S),
    onBlur: () => i.clear(S)
  }), Z = (S) => {
    const ce = N.actionOn.get(S), C = ce === void 0 ? void 0 : e[ce];
    if (!C)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(Rt, { binding: S, hidden: !0 })
        },
        S
      );
    const ee = t(C), se = `${w}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : D(C), children: [
      /* @__PURE__ */ a("span", { id: se, className: "dq-sr-only", children: L(ce) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: C.label,
          "aria-keyshortcuts": S,
          "aria-describedby": se,
          "data-group-open": _.has(ce) || void 0,
          "data-attention": j[ce] ? !0 : void 0,
          disabled: ee,
          onClick: (be) => s(C, be.shiftKey),
          children: [
            /* @__PURE__ */ a(Rt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: C.label }),
            ao(C) && " ",
            ao(C) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", title: "Marks absent", children: [
              /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-pad-marker-text", children: "absent" })
            ] }),
            F(ce)
          ]
        }
      )
    ] }, S);
  }, Q = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(ia, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = Nl(N), ce = (C) => {
      const ee = e[C], se = N.keys[C];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: ee.label,
          "aria-keyshortcuts": se,
          "aria-describedby": `${w}-effect-${se}`,
          "data-group-open": _.has(C) || void 0,
          "data-attention": j[C] ? !0 : void 0,
          disabled: t(ee),
          onClick: (be) => {
            i.clear(ee), s(ee, be.shiftKey || h && Rc(ee));
          },
          ...f ? {} : vl(i, ee),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: ee.label }),
            ao(ee) && " ",
            ao(ee) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
              "absent"
            ] }),
            F(C)
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
            f ? Q : /* @__PURE__ */ a(
              Ls,
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
            m && /* @__PURE__ */ a(Ef, { checked: h, onChange: m })
          ] }),
          J,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            ql,
            {
              groups: S,
              renderAction: ce,
              find: /* @__PURE__ */ a(
                Sl,
                {
                  extra: O,
                  findKey: y.find,
                  disabled: l,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((C) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[C]}`, children: L(C) }, C)) })
        ]
      }
    );
  }
  const ie = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), W = !x && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": O ? `Find action, ${O} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: l,
      onClick: c,
      children: [
        /* @__PURE__ */ a(Rt, { binding: y.find }),
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
        /* @__PURE__ */ u("div", { className: `dq-pad-header${J ? " dq-pad-header-groups" : ""}`, children: [
          f ? Q : /* @__PURE__ */ a(
            Ls,
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
          J ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              J,
              ie,
              W
            ] })
          ) : /* @__PURE__ */ u(he, { children: [
            !f && ie,
            W
          ] })
        ] }),
        M.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(Z),
          S.indent === Ps && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": O ? `Find action, ${O} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: l,
              onClick: c,
              children: [
                /* @__PURE__ */ a(Rt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(xa, { "aria-hidden": "true" }),
                  O ? `${O} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, S.indent))
      ]
    }
  );
}
function Ls({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const l = es(i), f = l ? e.indexOf(l) : -1;
  if (!l || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && m < e.length && /* @__PURE__ */ u(he, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(Rt, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[f], p = r && l.steps.length ? Hi(l, r, o) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ a(Rt, { binding: d }),
    /* @__PURE__ */ a("strong", { children: l.label }),
    Br(l, n, [], o).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function kl({
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
  const y = Xi(), N = la(e), v = Ka(), w = at(), k = Kr(ve(() => Ro(e), [e])), [M] = T(() => yl());
  wl(M, v);
  const x = I(null), O = Cf(x, e, !v), E = Nl(N);
  !E.length && e.length && E.push([]);
  const P = E.flat(), _ = e.length - P.length, re = (L) => Br(L, k, t, n).map((F) => F.text).join(", "), H = (L) => ({
    onMouseEnter: () => M.set(L),
    onMouseLeave: () => M.clear(L),
    onFocus: () => M.set(L),
    onBlur: (F) => {
      F.currentTarget.contains(F.relatedTarget) || M.clear(L);
    }
  }), j = l ?? (v ? void 0 : f), J = (L) => {
    const F = e[L];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: F.label,
        "aria-keyshortcuts": N.keys[L] || void 0,
        "aria-describedby": `${w}-effect-${L}`,
        disabled: m || r(F),
        onClick: () => {
          M.clear(F), i(F);
        },
        ...m ? {} : vl(M, F),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: F.label })
      },
      F.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: x,
      className: `dq-action-bar${v ? " dq-bar-mobile" : O ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
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
                ql,
                {
                  groups: E,
                  renderAction: J,
                  find: /* @__PURE__ */ a(
                    Sl,
                    {
                      extra: _,
                      findKey: y.find,
                      disabled: m,
                      onFind: s
                    }
                  )
                }
              ),
              !v && E.map((L, F) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                L.map((D) => {
                  const Z = e[D], Q = N.keys[D];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Z.label,
                      "aria-keyshortcuts": Q || void 0,
                      "aria-describedby": `${w}-effect-${D}`,
                      disabled: m || r(Z),
                      onClick: () => i(Z),
                      ...m ? {} : H(Z),
                      children: [
                        Q && /* @__PURE__ */ a(Rt, { binding: Q }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: Z.label })
                      ]
                    },
                    Z.id
                  );
                }),
                F === E.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": _ > 0 ? `Find action, ${_} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: m,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(Rt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(xa, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: _ > 0 ? `${_} more` : "Find action" })
                    ]
                  }
                )
              ] }, F)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        j && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: j }),
        m ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(ia, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Tf,
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
        /* @__PURE__ */ a("div", { hidden: !0, children: P.map((L) => /* @__PURE__ */ a("span", { id: `${w}-effect-${L}`, children: re(e[L]) }, e[L].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function Cf(e, t, n) {
  const [r, o] = T(!1);
  return Mt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const p = getComputedStyle(i), h = parseFloat(p.columnGap) || 0, m = i.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (P) => [...P.children].map((_) => _.offsetWidth)
      ), N = i.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, M = (P) => y.map((_) => {
        let re = 1, H = 0;
        for (const j of _)
          H > 0 && H + v + j > P ? (re += 1, H = j) : H += (H > 0 ? v : 0) + j;
        return re;
      }), x = (P) => Math.max(1, P.reduce((_, re) => _ + re, 0)), O = M(m), E = x(M(m - k));
      o(
        1 + x(O) < E || 1 + x(O) === E && O.every((P) => P === 1)
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
function Tf({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = es(n), l = c ? e.indexOf(c) : -1;
  if (!c || l < 0) return null;
  const f = t.keys[l];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(Rt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Br(c, r, o, i).map((d, p) => /* @__PURE__ */ a("span", { "data-effect-tone": d.tone, children: d.text }, p))
  ] });
}
const Ds = 1e3;
async function If(e, t, n) {
  const r = await me(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let l = 1; ; l++) {
    const f = await me(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Wn({
            findFilter: {
              page: l,
              perPage: Ds,
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
    if (l * Ds >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = je(e), c = Oe(e) ? await Of(
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
function $f(e) {
  return JSON.stringify(
    Wn({
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
async function Of(e, t, n) {
  const r = new Array(t.length).fill(0), o = new AbortController(), i = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && i(), n == null || n.addEventListener("abort", i, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !o.signal.aborted; ) {
            const c = s++;
            r[c] = (await me(
              `/api/${Pn(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: $f(t[c])
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
function Rf(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Mf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Ff(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of vr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function xf(e, t, n) {
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
function Pf(e, t) {
  var r;
  const n = Ot(e);
  return ((r = jr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Lf = (e) => e instanceof Error ? e.message : "Request failed.";
function Df({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = T([]), [c, l] = T({}), [f, d] = T({}), [p, h] = T({}), m = I(/* @__PURE__ */ new Map());
  X(
    () => () => {
      for (const L of m.current.values()) L.abort();
    },
    []
  );
  const y = Ln(je(t)), N = Oe(t), v = N ? "performer" : y.one;
  function w(L) {
    var D;
    (D = m.current.get(L)) == null || D.abort();
    const F = new AbortController();
    m.current.set(L, F), l((Z) => ({ ...Z, [L]: { status: "loading" } })), If(t, L, F.signal).then(
      (Z) => {
        F.signal.aborted || l((Q) => ({
          ...Q,
          [L]: { status: "ready", group: Z }
        }));
      },
      (Z) => {
        F.signal.aborted || l((Q) => ({
          ...Q,
          [L]: { status: "failed", message: Lf(Z) }
        }));
      }
    );
  }
  function k(L) {
    var ie;
    const F = i.filter((W) => !L.includes(W));
    for (const W of F)
      (ie = m.current.get(W)) == null || ie.abort(), m.current.delete(W);
    const D = (W) => {
      const S = c[W];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ce) => ce.id) : [];
    }, Z = new Set(L.flatMap(D)), Q = F.flatMap(D).filter((W) => !Z.has(W));
    d(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => !Q.includes(Number(S)))
      )
    ), h(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => L.includes(Number(S)))
      )
    ), l(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => L.includes(Number(S)))
      )
    ), s(L);
    for (const W of L) i.includes(W) || w(W);
  }
  const M = i.flatMap((L) => {
    const F = c[L];
    return (F == null ? void 0 : F.status) === "ready" ? [F.group] : [];
  }), x = M.length === i.length, O = i.some(
    (L) => {
      var F;
      return (((F = c[L]) == null ? void 0 : F.status) ?? "loading") === "loading";
    }
  ), E = new Map(
    Rf(M).map((L) => [L.parent.id, L])
  ), P = Mf(M), _ = new Map(M.map((L) => [L.parent.id, L.parent.name])), re = Ff(t.actions), H = (L) => f[L] ?? !re.has(L), j = x ? [...E.values()].flatMap((L) => {
    const F = Pf(L.parent.name, t.actions);
    return L.children.filter((D) => H(D.id)).map((D) => ({ child: D, answerGroup: F }));
  }) : [], J = (L, F) => d((D) => ({
    ...D,
    ...Object.fromEntries(L.children.map((Z) => [Z.id, F]))
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
      yr,
      {
        entityType: "tag",
        values: i,
        onChange: k,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((L) => {
      const F = c[L];
      if (!F || F.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, L);
      if (F.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            F.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(L),
              children: "Retry"
            }
          )
        ] }, L);
      const D = E.get(L);
      if (!D) return null;
      const Z = D.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Z }),
        F.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(he, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[L] ?? !1,
                disabled: n,
                onChange: (Q) => h((ie) => ({
                  ...ie,
                  [L]: Q.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            Z,
            " tree"
          ] }),
          D.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(he, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Z}`,
                  onClick: () => J(D, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Z}`,
                  onClick: () => J(D, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: D.children.map((Q) => {
              const ie = re.get(Q.id) ?? [], W = (P.get(Q.id) ?? []).filter((S) => S !== L).map((S) => `“${_.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: H(Q.id),
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
                  W.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " · Also under ",
                    W.join(", ")
                  ] }),
                  ie.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    ie[0].label || "New action",
                    "”",
                    ie.length > 1 ? ` and ${ie.length - 1} more` : ""
                  ] })
                ] })
              ] }, Q.id);
            }) })
          ] })
        ] })
      ] }, L);
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
              ({ child: L, answerGroup: F }) => xf(
                L,
                (P.get(L.id) ?? []).filter(
                  (D) => p[D]
                ),
                F
              )
            )
          ),
          children: j.length ? `Add ${j.length} action${j.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: O ? "Loading child tags…" : "" })
    ] })
  ] });
}
function _f(e, t, n, r) {
  const o = Ot(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: Ot(c) === o });
    return i;
  }
  const s = Ot(r);
  for (const c of t)
    Ot(c).includes(s) && i.push({ kind: "group", name: c, selected: Ot(c) === o });
  return s && !t.some((c) => Ot(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function jf(e) {
  return e.kind === "group" ? `group:${Ot(e.name)}` : e.kind;
}
function Uf(e) {
  const { group: t, ...n } = e;
  return n;
}
const Kf = /* @__PURE__ */ new Set([
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
]), Bf = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), oo = 4, _s = 240;
function Gf(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function zf(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Vf({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), l = I(null), f = I(null), d = I(null), p = I(null), h = I(null), m = I([]), y = I(!1), N = I(!1), [v, w] = T(!1), [k, M] = T(null), [x, O] = T(null), [E, P] = T(!1), _ = e.group ?? "", re = ve(
    () => _f(t, n, _, k),
    [t, n, _, k]
  ), H = re.map(jf), j = x === null ? -1 : H.indexOf(x), J = (C) => `${s}-option-${C}`, L = (C) => o(C ? { ...e, group: C } : Uf(e)), F = () => {
    var ee;
    const C = ((ee = d.current) == null ? void 0 : ee.value) ?? _;
    C.trim() !== C && L(C.trim());
  };
  function D(C) {
    M(null), O(C), w(!0);
  }
  const Z = (C) => {
    var ee, se;
    return C instanceof Node && (((ee = l.current) == null ? void 0 : ee.contains(C)) || ((se = p.current) == null ? void 0 : se.contains(C))) === !0;
  };
  function Q() {
    var C, ee;
    (C = p.current) != null && C.contains(document.activeElement) && ((ee = h.current) == null || ee.focus({ preventScroll: !0 })), w(!1), M(null), O(null), P(!1);
  }
  function ie(C) {
    C.kind === "group" && C.selected && k === null || L(C.kind === "none" ? "" : C.name), Q();
  }
  function W() {
    const C = f.current, ee = p.current;
    if (!C || !ee) return;
    const se = C.getBoundingClientRect(), be = window.visualViewport, G = (be == null ? void 0 : be.offsetTop) ?? 0, Ie = (be ? be.offsetTop + be.height : window.innerHeight) - se.bottom - oo, ye = se.top - G - oo, Re = Math.min(ee.scrollHeight, _s), He = Ie < Re && ye > Ie;
    ee.style.left = `${se.left}px`, ee.style.width = `${se.width}px`, ee.style.top = `${He ? se.top - oo : se.bottom + oo}px`, ee.style.transform = He ? "translateY(-100%)" : "", ee.style.maxHeight = `${Math.max(0, Math.min(_s, He ? ye : Ie))}px`, zf(C, ee, se, m.current) || Q();
  }
  Mt(() => {
    var C;
    v && (f.current && (m.current = Gf(f.current)), N.current && ((C = p.current) == null || C.focus({ preventScroll: !0 }), P(!0)), N.current = !1);
  }, [v]), Mt(() => {
    v && W();
  }), X(() => {
    if (!v) return;
    const C = () => W(), ee = (G) => {
      Z(G.target) || Q();
    }, se = [...m.current, window], be = window.visualViewport;
    for (const G of se) G.addEventListener("scroll", C);
    return window.addEventListener("resize", C), be == null || be.addEventListener("resize", C), be == null || be.addEventListener("scroll", C), document.addEventListener("pointerdown", ee), () => {
      for (const G of se) G.removeEventListener("scroll", C);
      window.removeEventListener("resize", C), be == null || be.removeEventListener("resize", C), be == null || be.removeEventListener("scroll", C), document.removeEventListener("pointerdown", ee);
    };
  }, [v]), X(() => {
    var C, ee, se;
    j >= 0 && ((se = (ee = (C = p.current) == null ? void 0 : C.children[j]) == null ? void 0 : ee.scrollIntoView) == null || se.call(ee, { block: "nearest" }));
  }, [j]);
  function S(C) {
    if (yn(C)) return;
    const ee = C.key === "ArrowDown" || C.key === "ArrowUp";
    if (ee && !v) {
      if (C.altKey && C.key === "ArrowUp") return;
      C.preventDefault(), D(C.altKey ? null : Ot(_) ? `group:${Ot(_)}` : "none");
      return;
    }
    if (v)
      if (ee) {
        if (C.preventDefault(), C.altKey) {
          C.key === "ArrowUp" && Q();
          return;
        }
        const se = C.key === "ArrowDown" ? 1 : -1, be = k !== null && Ot(k) && H.length > 1 ? 1 : 0, G = j < 0 ? se > 0 ? be : H.length - 1 : (j + se + H.length) % H.length;
        O(H[G]);
      } else C.key === "Enter" && (C.preventDefault(), j >= 0 ? ie(re[j]) : (F(), Q()));
  }
  function ce(C) {
    var se;
    if (C.key === "Tab") {
      Q(), C.shiftKey && ((se = d.current) == null || se.focus());
      return;
    }
    if (C.key === "Dead" || C.key === "Process" || yn(C) && !Bf.has(C.key) || C.key === "Backspace" || C.key === "Delete" || [...C.key].length === 1 && !C.metaKey && (!C.ctrlKey || C.altKey)) {
      const be = d.current;
      be && (be.focus(), be.setSelectionRange(be.value.length, be.value.length));
      return;
    }
    !Kf.has(C.key) && !yn(C) && P(!1), S(C);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (C) => {
        !v || C.key !== "Escape" || yn(C) || (C.preventDefault(), C.stopPropagation(), Q());
      },
      children: [
        /* @__PURE__ */ u("div", { ref: l, className: "dq-action-field", children: [
          /* @__PURE__ */ a(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: i,
              onMouseDown: (C) => {
                v && C.preventDefault();
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
                "aria-activedescendant": v && j >= 0 ? J(j) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: _,
                onChange: (C) => {
                  L(C.target.value), M(C.target.value), O(null), w(!0);
                },
                onClick: () => {
                  v || D(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  Q(), F();
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
                onPointerDown: (C) => {
                  y.current = C.pointerType === "touch";
                },
                onMouseDown: (C) => C.preventDefault(),
                onClick: () => {
                  var se;
                  const C = y.current;
                  y.current = !1;
                  const ee = document.activeElement === d.current;
                  v ? Q() : (N.current = C && !ee, D(null)), (!C || ee) && ((se = d.current) == null || se.focus());
                },
                children: /* @__PURE__ */ a(Ai, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item. When a chosen performer's items answer a group in two different ways, their Existing answers mark the group Mixed." : "A group is one question with one answer per item." }),
        v && Qd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: p,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": j >= 0 ? J(j) : void 0,
              "data-tap-focus": E || void 0,
              onMouseDown: (C) => C.preventDefault(),
              onKeyDown: ce,
              onBlur: (C) => {
                Z(C.relatedTarget) || Q();
              },
              children: re.map((C, ee) => /* @__PURE__ */ u(
                "li",
                {
                  id: J(ee),
                  role: "option",
                  "aria-selected": C.selected,
                  className: "dq-combobox-option",
                  "data-kind": C.kind,
                  "data-active": ee === j || void 0,
                  onMouseMove: () => {
                    ee !== j && O(H[ee]);
                  },
                  onClick: () => ie(C),
                  children: [
                    C.kind === "new" && /* @__PURE__ */ a(Pa, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: C.kind === "none" ? "No group" : C.kind === "new" ? `New group “${C.name}”` : C.name }),
                    C.selected && /* @__PURE__ */ a(ca, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                H[ee]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const fr = [
  ...To,
  ["auto", gr]
];
function El(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Oi(e[n]);
}
function Jf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = T(!1), c = I(null), l = n.keys[t], f = El(e, n, t), d = Lr(f), p = n.duplicatePins.has(t) ? ` (${Ia(e[t].shortcut ?? "")} is pinned twice)` : "", h = l ? `${Ia(l)}, ${d ? "pinned" : "Auto"}${p}` : f === gr ? "no key, Find action only" : `no key: Auto found no free key${p}`, m = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(he, { children: [
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
          l ? /* @__PURE__ */ a(Rt, { binding: l }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ a(vc, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      Hf,
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
function Hf({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = I(null), c = n.keys[t], l = El(e, n, t), [f, d] = T(c || "q"), p = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Mt(() => {
    var N, v, w;
    (N = p(c || l)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    Lr(N) && d(N), (v = p(N)) == null || v.focus();
  }
  function m(N) {
    var E, P, _;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), i();
      return;
    }
    if (N.key === "Tab") {
      const re = [...((E = s.current) == null ? void 0 : E.querySelectorAll("button[tabindex='0']")) ?? []], H = re.indexOf(document.activeElement);
      N.preventDefault(), (P = re[(H + (N.shiftKey ? -1 : 1) + re.length) % re.length]) == null || P.focus();
      return;
    }
    const v = (_ = N.target.dataset) == null ? void 0 : _.choice, w = v ? fr.findIndex((re) => re.includes(v)) : -1;
    if (!v || w < 0) return;
    const k = fr[w].indexOf(v), M = (re) => re == null ? void 0 : re[Math.min(k, re.length - 1)], x = {
      ArrowLeft: fr[w][k - 1],
      ArrowRight: fr[w][k + 1],
      ArrowUp: M(fr[w - 1]),
      ArrowDown: M(fr[w + 1]),
      Home: fr[w][0],
      End: fr[w].at(-1)
    };
    if (!Object.hasOwn(x, N.key)) return;
    N.preventDefault();
    const O = x[N.key];
    O && h(O);
  }
  const y = (N) => {
    const v = Lr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: Oi(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(he, { children: [
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: To.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const k = y(w), M = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${Ia(w)}: ${M}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => d(w),
                onClick: () => o(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Rt, { binding: w }),
                    (k == null ? void 0 : k.pinned) && /* @__PURE__ */ a(vc, { "aria-hidden": "true" })
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
                "data-choice": gr,
                tabIndex: 0,
                "aria-pressed": l === gr,
                onClick: () => o(gr),
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
const Qf = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Wf(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Yf(e, t) {
  if (Qn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Ri(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Al(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Xf(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Zf({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const l = ze(e), f = l !== "tag", d = e.actions, p = la(d), h = Kr(ve(() => Ro(d), [d])), m = ve(
    () => f ? jr(d).map((G) => G.name) : [],
    [f, d]
  ), y = d.findIndex((G) => G.id === i), N = ve(
    () => f && y >= 0 ? jr(
      d.filter((G, qe) => qe !== y)
    ).map((G) => G.name) : [],
    [f, d, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ve(
    () => new Set(
      v ? af(d).map((G) => G.key) : []
    ),
    [v, d]
  ), [k, M] = T(""), [x, O] = T(!1), [E, P] = T(
    null
  ), _ = at(), re = `${_}-from-tags`, H = I(null), j = I(null), J = I(null), L = I(null), F = I(/* @__PURE__ */ new WeakMap()), D = (G) => {
    let qe = F.current.get(G);
    return qe || (qe = crypto.randomUUID(), F.current.set(G, qe)), qe;
  }, Z = k.trim().toLocaleLowerCase(), Q = Z ? d.filter((G) => G.label.toLocaleLowerCase().includes(Z)) : d, ie = (G) => t({ ...e, actions: G }), W = (G, qe) => ie(d.map((Ie, ye) => ye === G ? qe : Ie));
  function S(G) {
    var qe;
    return [...((qe = J.current) == null ? void 0 : qe.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ie) => Ie.dataset.actionId === G
    );
  }
  function ce(G, qe) {
    const Ie = S(G), ye = Ie == null ? void 0 : Ie.querySelector(
      qe === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ye == null || ye.focus(), !!ye;
  }
  Mt(() => {
    var qe;
    const G = L.current;
    G && (L.current = null, (G === "add" || !ce(G.id, G.part)) && ((qe = j.current) == null || qe.focus()));
  }), X(() => {
    !c || !i || (Q.some((G) => G.id === i) ? ce(i, "label") : (M(""), L.current = { id: i, part: "label" }));
  }, [c]);
  function C() {
    const G = Xf(l);
    M(""), ie([...d, G]), s(G.id), L.current = { id: G.id, part: "label" };
  }
  function ee(G) {
    const qe = d[G], { shortcut: Ie, ...ye } = structuredClone(qe), Re = {
      ...ye,
      ...Ie === gr ? { shortcut: Ie } : {},
      id: crypto.randomUUID(),
      label: `${qe.label} copy`
    };
    ie([...d.slice(0, G + 1), Re, ...d.slice(G + 1)]), s(Re.id), L.current = { id: Re.id, part: "label" };
  }
  function se(G) {
    const qe = d[G], Ie = Q.indexOf(qe), ye = Q[Ie + 1] ?? Q[Ie - 1];
    ie(d.filter((Re, He) => He !== G)), i === qe.id && s(null), L.current = ye ? { id: ye.id, part: "toggle" } : "add";
  }
  function be() {
    O(!1), requestAnimationFrame(() => {
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
            onClick: C,
            children: [
              /* @__PURE__ */ a(Pa, { "aria-hidden": "true" }),
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
            "aria-expanded": x,
            "aria-controls": x ? re : void 0,
            onClick: () => {
              P(null), O(!x);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(xa, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: k,
              onChange: (G) => M(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && k && !yn(G) && (G.preventDefault(), G.stopPropagation(), M(""));
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
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (E == null ? void 0 : E.actions) === d ? `Added ${E.count} action${E.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && x && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || yn(G) || (G.preventDefault(), G.stopPropagation(), be());
        },
        children: /* @__PURE__ */ a(
          Df,
          {
            id: re,
            review: e,
            disabled: o,
            onAdd: (G) => {
              const qe = [...d, ...G];
              ie(qe), P({ actions: qe, count: G.length }), be();
            },
            onCancel: be
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: J, children: Q.length > 0 && /* @__PURE__ */ a(
      hc,
      {
        items: Q,
        getKey: (G) => G.id,
        disabled: o || !!Z,
        className: "dq-action-list",
        onReorder: (G) => ie(G),
        renderItem: (G, { dragHandleProps: qe, isOver: Ie }) => {
          const ye = d.indexOf(G), Re = i === G.id;
          return /* @__PURE__ */ a(
            ep,
            {
              action: G,
              entityType: l,
              keyButton: /* @__PURE__ */ a(
                Jf,
                {
                  actions: d,
                  index: ye,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (He) => ie(Zd(d, ye, He))
                }
              ),
              takenPin: p.duplicatePins.has(ye) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(Ot(G.group)),
              effect: Br(G, h, n, r),
              open: Re,
              detailId: `${_}-detail-${G.id}`,
              dragHandleProps: qe,
              isOver: Ie,
              reorderDisabled: o || !!Z,
              onToggle: () => s(Re ? null : G.id),
              onDuplicate: () => ee(ye),
              onDelete: () => se(ye),
              children: "steps" in G ? /* @__PURE__ */ a(
                tp,
                {
                  action: G,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: Oe(e),
                  saving: o,
                  stepKey: D,
                  rememberStepKey: (He, Se) => F.current.set(He, D(Se)),
                  onChange: (He) => W(ye, He)
                }
              ) : /* @__PURE__ */ a(
                rp,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (He) => W(ye, He)
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
function ep({
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
  const N = e.label.trim() || "New action", v = Yf(e, t), w = "steps" in e && Ot(e.group) ? e.group.trim() : "";
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
              style: Al(l.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ a(Nc, { "aria-hidden": "true" })
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
                title: i.map((k) => k.text).join(" "),
                children: i.map((k, M) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, M))
              }
            ),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", title: v, children: [
              /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: v })
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${Ia(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
                  /* @__PURE__ */ a("span", { className: "dq-action-problem-text", children: `${Ia(r)} is pinned twice` })
                ]
              }
            ),
            o && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(qc, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(Eo, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(Ai, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Cl({
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
function tp({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: o,
  stepKey: i,
  rememberStepKey: s,
  onChange: c
}) {
  const l = at(), f = I(null), d = I(null);
  Mt(() => {
    var m, y;
    const h = d.current;
    h != null && (d.current = null, (y = (m = f.current) == null ? void 0 : m.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(Cl, { action: e, onChange: (h) => c({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Vf,
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
          hc,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: m, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              np,
              {
                step: h,
                index: m,
                dragHandleProps: y,
                isOver: N,
                saving: o,
                onChange: (v) => {
                  s(v, h), p(e.steps.map((w, k) => k === m ? v : w));
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
              /* @__PURE__ */ a(Pa, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function np({
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
      "data-step-tone": Wf(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Al(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(Nc, { "aria-hidden": "true" }),
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
            children: Qf.map(({ mode: l, label: f }) => /* @__PURE__ */ a("option", { value: l, children: f }, l))
          }
        ),
        /* @__PURE__ */ a(
          yr,
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
            children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function rp({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(Cl, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const Tl = Nd(!1);
function ap({ children: e }) {
  return /* @__PURE__ */ a(Tl.Provider, { value: !0, children: e });
}
function cn({ tag: e, name: t }) {
  const n = qd(Tl), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(kd, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function op({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Ln(je(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      yr,
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
function ip({
  review: e,
  onChange: t
}) {
  const n = Ln(je(e)).many, r = e.occurrence, o = Ic(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Ua([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var p;
    return ((p = s[d]) == null ? void 0 : p.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, l = (d) => t({ ...e, occurrence: Wd(r, d) }), f = (d, p) => l(
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
          /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(cn, { tag: s[d.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            bs,
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
            children: /* @__PURE__ */ a(Eo, { "aria-hidden": "true" })
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
      bs,
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
const Il = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, $l = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, sp = {
  video: Ao,
  audio: Ec,
  tag: kc,
  performerOccurrence: Sc,
  audioPerformerOccurrence: xd
};
function Ol({ entityType: e }) {
  const t = sp[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Il[e] });
}
const cp = 2e6;
function Rl(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function lp(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ts(e) {
  Rl([e], lp(e));
}
async function dp(e) {
  if (e.size > cp) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return Da(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function oa(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function Ml({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: o,
  autoFocus: i = !1
}) {
  return /* @__PURE__ */ u(he, { children: [
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
          children: $c.map((s) => /* @__PURE__ */ a("option", { value: s, children: $l[s] }, s))
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
function up(e, t) {
  const n = ze(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function fp({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = I(null), r = I(null), o = at(), i = at();
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
function Fl({
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
  const [N, v] = T("Review"), [w] = T(
    () => Oe(e) && e.occurrence.tagIds.length > 0
  ), [k, M] = T(""), [x, O] = T(null), [E, P] = T(0), [_, re] = T(!1), H = I(null), j = I(null), J = I(null), L = up(e, w), F = ze(e), D = ve(() => oa(e), [e]);
  X(() => M(""), [D]), X(() => {
    var ce, C;
    if (_) return;
    const W = H.current;
    if (H.current = null, !W) return;
    (C = W.isConnected && !!((ce = J.current) != null && ce.contains(W)) && !(W instanceof HTMLButtonElement && W.disabled) ? W : J.current) == null || C.focus({ preventScroll: !0 });
  }, [_]);
  function Z() {
    if (!(s || _)) {
      if (!f) {
        m();
        return;
      }
      H.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, re(!0);
    }
  }
  function Q() {
    const W = { ...e, name: e.name.trim() }, S = $a(W);
    if (!S) {
      M(""), h();
      return;
    }
    if (M(S), !W.name) {
      v("Review"), requestAnimationFrame(() => {
        var C;
        return (C = j.current) == null ? void 0 : C.focus();
      });
      return;
    }
    const ce = e.actions.find(
      (C) => !Qn(C, F)
    );
    ce && (v("Actions"), O(ce.id), P((C) => C + 1));
  }
  const ie = k || l;
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (W) => {
          J.current = W, y && (y.current = W);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (W) => {
          W.key !== "Escape" || W.defaultPrevented || s || yn(W) || (W.preventDefault(), W.stopPropagation(), Z());
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
                onClick: Z,
                children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ed,
            {
              tabs: L.map((W) => ({
                key: W,
                label: W,
                count: W === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (W) => v(W)
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
                    Ml,
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
                        onChange: (W) => r(W.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Oe(e) && /* @__PURE__ */ a(ip, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => ts(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            L.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(pp, { review: e, onChange: t })
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
                  Zf,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: x,
                    onExpand: O,
                    reveal: E
                  }
                )
              }
            ),
            w && Oe(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(op, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ie || p) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            p,
            ie && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
              ie
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: Z, children: "Cancel" }),
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
    _ && /* @__PURE__ */ a(
      fp,
      {
        onKeepEditing: () => re(!1),
        onDiscard: () => {
          H.current = null, re(!1), m();
        }
      }
    )
  ] });
}
function pp({
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
  if (ze(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        js,
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
  return /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          Us,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(mp, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          Us,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(gp, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        js,
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
            yr,
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
        yr,
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
      hp,
      {
        bins: s.filterBins ?? [],
        onChange: (d) => c({ filterBins: d.length ? d : void 0 })
      }
    )
  ] });
}
function hp({
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
            children: /* @__PURE__ */ a(Eo, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(Pa, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    i && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || yn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), o(null)));
        },
        children: /* @__PURE__ */ a(
          mc,
          {
            open: !0,
            onClose: () => o(null),
            criteria: ko,
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
function js({
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
function Us({
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
function mp() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function gp() {
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
const mi = "The queue differs from the saved review.";
function xl({
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
  const v = I(null);
  Np(v);
  const w = qp(v), [k, M] = T({ differs: h, text: "" });
  return k.differs !== h && M({
    differs: h,
    text: h ? k.differs === !1 ? mi : k.text : ""
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
          children: /* @__PURE__ */ a(La, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Il[n], children: /* @__PURE__ */ a(Ol, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(ia, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    l,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(bp, { change: p, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    m,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function bp({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), o = `${mi} Save these filters to the review.`, i = e.onSave ? `${mi} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(he, { children: [
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
          /* @__PURE__ */ a(Dd, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(_d, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const yp = ["queue", "summary", "name", "layout", "range"], wp = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, vp = "(min-width: 1400px)";
function fo(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function Ks(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = yp.filter(
    (i) => e.querySelector(wp[i])
  );
  for (let i = 1; i <= o.length && !fo(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !fo(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return fo(e) ? !0 : (r(), !1);
}
function Np(e) {
  const t = bl(vp), [n, r] = T(0), o = I(!1);
  Mt(() => {
    e.current && (o.current = !Ks(e.current, t));
  }, [e, t, n]), Mt(() => {
    const i = e.current;
    i && t && !o.current && !fo(i) && (o.current = !Ks(i, t));
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
function qp(e) {
  const t = I(!1);
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
function Pl({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, o] = T(!1), [i, s] = T(""), c = I(null), l = I(null);
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
        children: /* @__PURE__ */ a(La, { "aria-hidden": "true" })
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
          yn(p) || (p.key === "Enter" ? (p.preventDefault(), d()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a(Ac, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Ll({
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
          /* @__PURE__ */ a(Ld, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Ci, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function Sp({
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
function ns({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = T(!1), [i, s] = T(!1), c = I(null), l = I(null), f = at();
  Mt(() => {
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
        children: /* @__PURE__ */ a(Pd, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: l,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ u(ki, { children: [
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
function qo(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function rs(e) {
  return String(e.type).toLowerCase() === "tag";
}
function as(e) {
  return !!String(e ?? "").trim();
}
function os(e) {
  return [
    ...new Set(
      qo(e.customFieldCriteria).filter(rs).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !as(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function is(e, t) {
  const n = qo(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!rs(i)) return i;
    const s = { ...i };
    for (const [c, l] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !as(i[l]) && (s[l] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function Dl(e, t, n) {
  const r = qo(e.customFieldCriteria);
  if (!r.length) return e;
  const o = qo(n.customFieldCriteria), i = (l, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (l[d] ?? void 0) === (f[d] ?? void 0)
  );
  let s = !1;
  const c = r.map((l) => {
    if (!rs(l)) return l;
    const f = o.find((p) => i(p, l));
    if (!f) return l;
    const d = { ...l };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(l[p] ?? "")];
      m && l[h] === m && !as(f[h]) && (delete d[h], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
class _l extends Error {
}
const gi = (e) => e instanceof Error ? e.message : "Request failed.", Bs = (e) => [...e].sort((t, n) => t - n), Ma = (e, t) => JSON.stringify(Bs(e)) === JSON.stringify(Bs(t)), bi = (e) => !!(e.tags.added.length || e.tags.removed.length);
function So(e, t, n, r) {
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
function kp(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Ep(e, t, n, r) {
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
      l = (await me(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new _l(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${l}. Choose one of them.`
    );
  }
}
async function Ap(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !Qn(h, e.entityType) || !h.steps.length || h.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = Ta(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Ui(o.occurrence, n) : [];
  await Ep(o, i, s, n);
  const c = await Promise.all(
    i.map(async (h) => ({
      ...h,
      steps: await ja(h, n)
    }))
  ), l = structuredClone(kp(c));
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
  const d = await ji(o, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const m = await Ki(o, d, h, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = So(N.ids, l, s, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: Ma(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(p.size), h * 250 >= m.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    id: Ji(),
    review: o,
    actions: i,
    action: l,
    categories: s,
    touched: f,
    entries: [...p.values()]
  };
}
function Cp(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!Ma(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return Ma(o(e), o(t));
}
async function jl(e, t, n, r) {
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
function Ul(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Kl(e) {
  return e.entries.filter((t) => t.operation);
}
async function Tp(e, t, n, r, o = !1) {
  await jl(
    Ul(e, o),
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
        if (s = await Qt(je(e.review), i.item, !1), !Cp(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        i.status = "failed", i.error = gi(h);
        return;
      }
      const c = So(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), l = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Yn(s.ids, l);
      if (!f.added.length && !f.removed.length) {
        const h = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : h ? "skipped" : "unchanged", i.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await Bi(e.review, i.item, f);
      } catch (h) {
        d = h;
      }
      let p = !1;
      try {
        const h = await Qt(je(e.review), i.item, !1);
        p = !0, i.expected = h;
        const m = si(
          i.item,
          i.before,
          h,
          e.touched
        );
        if (i.operation = bi(m) ? m : void 0, d) throw d;
        if (!Ma(
          h.ids.filter((y) => e.touched.includes(y)),
          l.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (h) {
        if (i.status = "failed", i.error = gi(h), !p)
          try {
            const m = await Qt(je(e.review), i.item, !1);
            i.expected = m;
            const y = si(
              i.item,
              i.before,
              m,
              e.touched
            );
            i.operation = bi(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Ip(e, t, n) {
  await jl(
    Kl(e),
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
        const c = await Qt(je(e.review), r.item, !1);
        rl(o, c), s = !0, await Bi(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const l = await Qt(je(e.review), r.item, !1);
        if (!Ma(
          l.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = l, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${gi(c)}`, r.status = "failed", s)
          try {
            const l = await Qt(je(e.review), r.item, !1), f = si(
              r.item,
              r.before,
              l,
              i
            );
            r.operation = bi(f) ? f : void 0, r.expected = l;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
function Gs(e) {
  return zi({
    id: e.id,
    at: e.recordedAt ?? (e.recordedAt = Date.now()),
    label: `Batch: ${e.actions.map((t) => t.label).join(", ")}`,
    reviewName: e.review.name,
    kind: je(e.review),
    items: e.entries.flatMap(
      (t) => t.operation ? [
        Vi(
          t.item,
          Fi(t.item.media, je(e.review)),
          t.operation.before,
          t.operation.after,
          [...t.operation.tags.added, ...t.operation.tags.removed]
        )
      ] : []
    )
  });
}
const Bl = (e, t) => t.count - e.count || cl(e, t);
async function $p(e, t, n) {
  const r = je(e), o = e.occurrence, [i, s] = await Promise.all([
    me(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ui(o, n)
  ]), c = i.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  ii(c.map((y) => y.tag));
  const l = await Promise.all(
    s.map(async (y, N) => {
      const v = o.conditionTagIds[N];
      return (await me(`/api/tags/${v}`, { signal: n })).name;
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
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Bl);
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
function Op(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const l = new Set(c);
    return [...o].every((f) => l.has(f));
  };
  return n.some(
    (s) => [...vr(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function ss(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const o = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Bl), i = (m) => m.members ?? m.tags.map((y) => y.id), s = jr(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...vr(t[N])]))
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
      mixed: Op(m.id, N, t, n) ? c({ key: y, name: m.name, members: N, tags: m.tags }) : (
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
const Jo = { summary: null, error: "" };
function Gl(e, t, n = 0) {
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
    value: Jo
  });
  return X(() => {
    if (s((l) => l.key === o ? l : { key: o, value: Jo }), e === null || t === null) return;
    const c = new AbortController();
    return $p(e, t, c.signal).then((l) => {
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
  }, [o, n]), i.key === o ? i.value : Jo;
}
function Rp(e, t) {
  const n = (f) => {
    var d;
    return ((d = f.tagIds) == null ? void 0 : d.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const d = lf(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : d.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : d.forEach((h) => o.add(h.name));
  }
  const i = Ot(e.name), s = [...r].filter((f) => Ot(f) !== i), c = s.length < r.size, l = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: l };
}
function Mp(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function yi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = li,
  flags: i = [],
  className: s = ""
}) {
  const c = Ln(n), l = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? ss(e, r, o) : [], d = Qi(f), p = (h) => [
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
          const m = h.kind === "other" ? [] : p(h.members), y = Rp(h, d), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Mp(h, y),
                  children: [
                    /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(cn, { tag: v }),
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
function aa({
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
const zs = 5;
function Fp(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await me(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const Vs = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), wi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], Js = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], xp = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, Ho = 250;
function ka(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Pp({ step: e }) {
  const t = wi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: wi.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(ca, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function Hs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(ki, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function Sa({
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
        n && /* @__PURE__ */ u(he, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function Qs({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    Dr(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(cn, { tag: o })
    ] }) }, `added-${o.id}`)),
    Dr(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(cn, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function Ws({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > Ho && /* @__PURE__ */ u("span", { children: [
        "First ",
        Ho.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, Ho).map((i) => {
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
                ka(i, n)
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
function Ys(e) {
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
function Lp({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i
}) {
  const [s, c] = T(!1), [l, f] = T("answers"), [d, p] = T(null), [h, m] = T({}), [y, N] = T([]), [v, w] = T(!1), [k, M] = T(!1), [x, O] = T(""), [E, P] = T(!1), [_, re] = T(""), [H, j] = T(null), [J, L] = T(!0), [F, D] = T(null), [Z, Q] = T([]), [ie, W] = T(0), S = I(null), ce = I(null), C = I(null), ee = I(!1), se = I(!1), be = I(null), G = I(!1), qe = I(!1), Ie = I({ onClose: i });
  Ie.current = { onClose: i };
  const ye = at(), Re = l === "run", He = (H == null ? void 0 : H.kind) === "undo", Se = Re && d ? d.review : e, Dn = la(Se.actions), Ne = Se.occurrence, We = je(Se), ln = Ln(We), wn = ln.queue, ct = Re && d ? d.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter(($) => $.steps.length && !br($))
  ), Ye = ct.filter(($) => y.includes($.id)), Le = Ne.targetMode === "selected" && Ne.performerIds.length === 1, Xe = Gl(
    Se,
    s && Le ? Ne.performerIds[0] : null,
    ie
  ), Xn = os(Se.view.objectFilter), Ft = Ua(
    s ? [...Ro(ct), ...Ne.conditionTagIds, ...Xn] : []
  ), Nr = ve(() => Zc(Ft), [Ft]), Ve = ($) => h[$] ?? Ft[$] ?? { id: $, name: `Tag ${$}` }, $e = JSON.stringify(
    Object.fromEntries(
      Xn.flatMap(($) => {
        var oe;
        const B = (oe = Ft[$]) == null ? void 0 : oe.name;
        return B ? [[String($), B]] : [];
      })
    )
  ), ot = ve(
    () => is(Se.view.objectFilter, JSON.parse($e)),
    [Se.view.objectFilter, $e]
  );
  X(() => {
    var $, B, oe;
    s && (($ = S.current) == null || $.showModal(), (oe = (B = S.current) == null ? void 0 : B.querySelector(".dq-batch-answer input")) == null || oe.focus());
  }, [s]), X(() => {
    if (!s) return;
    const $ = requestAnimationFrame(() => {
      var Ce;
      const B = S.current, oe = document.activeElement;
      if (!B || oe && oe !== document.body && B.contains(oe)) return;
      (Ce = (l === "answers" ? B.querySelector(".dq-batch-answer input:checked") ?? B.querySelector(".dq-batch-answer input") : B.querySelector("[data-batch-focus]")) ?? ce.current) == null || Ce.focus();
    });
    return () => cancelAnimationFrame($);
  }, [s, l, k, d]), X(() => {
    if (s || t || !ee.current) return;
    const $ = requestAnimationFrame(() => {
      const B = C.current;
      if (!ee.current || !B || B.disabled) return;
      ee.current = !1;
      const oe = document.activeElement;
      (!oe || oe === document.body) && B.focus();
    });
    return () => cancelAnimationFrame($);
  }, [s, t]), X(() => {
    if (!s || Ne.targetMode !== "selected") return;
    const $ = new AbortController();
    return Q([]), Fp(Ne.performerIds.slice(0, zs), $.signal).then((B) => {
      $.signal.aborted || Q(B);
    }).catch(() => {
    }), () => $.abort();
  }, [s, Ne.targetMode, JSON.stringify(Ne.performerIds)]), X(
    () => () => {
      var $;
      se.current = !0, ($ = be.current) == null || $.abort();
    },
    []
  ), X(() => {
    if (!k) return;
    const $ = (B) => {
      B.preventDefault(), B.returnValue = "";
    };
    return window.addEventListener("beforeunload", $), () => window.removeEventListener("beforeunload", $);
  }, [k]);
  function Je() {
    f("answers"), L(!0), p(null), m({}), j(null), w(!1), N([]), re(""), O(""), P(!1), D(null);
  }
  function dn() {
    qe.current || (c(!1), Ie.current.onClose(G.current), G.current = !1, Je(), ee.current = !0);
  }
  function Zn($, B) {
    N(
      (oe) => B ? [...oe, $] : oe.filter((Ee) => Ee !== $)
    ), p(null), m({}), re(""), O(""), P(!1), D(null);
  }
  function er() {
    f("answers"), D(null), re("");
  }
  function tr() {
    f("preview"), d || Tn();
  }
  function en() {
    var $;
    se.current = !0, ($ = be.current) == null || $.abort(), re("Stopping after in-flight operations settle…");
  }
  function Wt($) {
    D(
      (B) => (B == null ? void 0 : B.group) === $.group && B.reason === $.reason ? null : $
    );
  }
  const xt = ($, B) => (F == null ? void 0 : F.group) === $ && F.reason === B;
  async function Tn() {
    if (!Ye.length || qe.current) return;
    qe.current = !0, M(!0), O(""), P(!1), re("Loading all matching occurrences…"), p(null), m({}), D(null);
    const $ = new AbortController();
    be.current = $;
    try {
      const B = await Ap(
        e,
        Ye,
        $.signal,
        (Ee) => re(`Loaded ${Ee.toLocaleString()} matching occurrences…`)
      );
      $.signal.throwIfAborted();
      const oe = {};
      for (const Ee of B.entries)
        for (const Ce of Ee.before.applications ?? [])
          oe[Ce.tag.id] = Ce.tag;
      m(oe), p(B), re("Preview ready. No tags have been changed.");
    } catch (B) {
      O(
        $.signal.aborted ? "Preview cancelled. No tags were changed." : B instanceof Error ? B.message : String(B)
      ), P(!$.signal.aborted && B instanceof _l), re("");
    } finally {
      qe.current = !1, M(!1), be.current = null;
    }
  }
  async function Pt($) {
    if (!d || qe.current) return;
    const B = ($ === "undo" ? Kl(d) : Ul(d, $ === "retry")).length;
    qe.current = !0, se.current = !1, G.current = !0, M(!0), f("run"), O(""), j({ kind: $, total: B, done: 0, stopped: !1 }), re(
      $ === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    let oe = Date.now(), Ee = !0;
    const Ce = () => {
      j((ue) => ue && { ...ue, done: ue.done + 1 }), Ee && Date.now() - oe > 3e3 && (Ee = Gs(d), oe = Date.now());
    };
    let le = !1;
    try {
      $ === "undo" ? await Ip(d, () => se.current, Ce) : await Tp(d, v, () => se.current, Ce, $ === "retry");
      const { counts: ue } = Ys(d.entries), Ae = ue.skipped + ue.failed;
      re(
        se.current ? "Stopped after in-flight operations settled. Completed changes are retained." : $ === "undo" ? `Batch undo finished.${ue.failed ? " Inspect the failures below." : ""}` : `Batch finished: ${[
          `${ue.changed.toLocaleString()} changed`,
          ue.unchanged && `${ue.unchanged.toLocaleString()} unchanged`,
          ue.skipped && `${ue.skipped.toLocaleString()} skipped`,
          ue.failed && `${ue.failed.toLocaleString()} failed`
        ].filter(Boolean).join(", ")}.${Ae ? " Inspect them below." : ""}`
      );
    } catch (ue) {
      le = !0, re(""), O(ue instanceof Error ? ue.message : String(ue));
    } finally {
      L(Gs(d)), qe.current = !1;
      const ue = se.current || le;
      j((Ae) => Ae && { ...Ae, stopped: ue }), M(!1), W((Ae) => Ae + 1);
    }
  }
  const qt = (d == null ? void 0 : d.entries) ?? [], qr = ve(
    () => new Map(
      ((d == null ? void 0 : d.entries) ?? []).map(($) => [
        $.item.key,
        So($.before.ids, d.action, d.categories, v)
      ])
    ),
    [d, v]
  ), we = ($) => qr.get($.item.key), Bt = ($) => Yn($.before.ids, we($).desired), _n = ($) => {
    const B = Bt($);
    return $.status === "pending" && (B.added.length > 0 || B.removed.length > 0);
  }, nr = ($) => $.conflict || we($).kept.length > 0 || we($).replaced.length > 0, In = ve(() => {
    const $ = (d == null ? void 0 : d.entries) ?? [];
    return {
      willChange: $.filter(_n).length,
      correct: $.filter((B) => B.status === "unchanged").length,
      different: $.filter(nr).length,
      hosts: new Set($.map((B) => B.item.media.id)).size,
      added: [...new Set($.flatMap((B) => Bt(B).added))],
      removed: [...new Set($.flatMap((B) => Bt(B).removed))]
    };
  }, [qr]), De = ve(
    () => ((d == null ? void 0 : d.entries) ?? []).filter(($) => $.item.media.date).sort(($, B) => $.item.media.date.localeCompare(B.item.media.date)),
    [d]
  ), ft = Re ? Ys(qt) : null, fe = ($) => Dn.keys[Se.actions.findIndex((B) => B.id === $)] ?? "", K = ($) => Br($, Nr, [], r), Ue = Ta(Ne.condition) && Ne.includeSubtags !== !1 && Ne.conditionTagIds.length > 0, xe = De[0], pt = De.length > 1 ? De[De.length - 1] : void 0, de = ($) => `/${We}/${$.item.media.id}`, zr = Le ? Z[0] : void 0, tn = ve(
    () => n ? hl(
      n,
      Xe.summary ? Qi(
        ss(Xe.summary, Se.actions, r ?? li)
      ) : []
    ) : [],
    [n, Xe.summary, Se.actions, r]
  ), nn = uf(Ye, tn, r ?? li), lt = n ?? [], ht = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: _n },
    correct: { title: "Occurrences already correct", test: ($) => $.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: nr }
  };
  function rn() {
    const $ = xp[Ne.condition], B = !!$ && Ne.conditionTagIds.length > 0, oe = Ne.performerIds.slice(0, zs), Ee = String(Se.view.filter.q ?? "").trim(), Ce = Ne.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Co(Ne) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : Ne.targetMode === "selected" ? /* @__PURE__ */ u(he, { children: [
        oe.map((le, ue) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(aa, { performer: { id: le, name: Z[ue] ?? "" } }),
          Z[ue] ?? "…"
        ] }, le)),
        Ne.performerIds.length > oe.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (Ne.performerIds.length - oe.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(he, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              Ca,
              {
                filter: {},
                objectFilter: Ne.performerFilter,
                criteriaDefinitions: Ei,
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
        B ? $ : Ti[Ne.condition],
        B && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Dr(Ne.conditionTagIds.map(Ve)).map((le) => /* @__PURE__ */ a(cn, { tag: le }, le.id)) })
      ] }),
      B && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: Ne.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      Ta(Ne.condition) && Ne.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: Ce, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          Ce
        ] })
      ] }),
      Ee && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Ee,
        "”"
      ] }),
      Object.keys(Se.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${wn} filters`,
          children: /* @__PURE__ */ a(
            Ca,
            {
              filter: Se.view.filter,
              objectFilter: ot,
              criteriaDefinitions: We === "audio" ? gc : ko,
              customFieldEntityType: We,
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
  function tt($, B, oe = !0) {
    if (!$.length) return null;
    const Ee = /* @__PURE__ */ a("strong", { children: zr || "This performer" }), Ce = oe ? `Check the earliest and latest ${ln.many} before applying, or narrow the batch with a date filter.` : "", le = $.every((ue) => ue.tagIds === null && !ue.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        le ? /* @__PURE__ */ u("p", { children: [
          Ee,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: $.flatMap((ue) => ue.flags).join(", ") }),
          ".",
          " ",
          Ce
        ] }) : /* @__PURE__ */ u(he, { children: [
          /* @__PURE__ */ u("p", { children: [
            Ee,
            " needs attention where the chosen answers apply.",
            Ce && ` ${Ce}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: $.map((ue) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: ue.tagIds === null ? "Whole review" : ue.name }),
            ":",
            " ",
            Wi(ue).join("; ")
          ] }, ue.key)) })
        ] }),
        B && xe && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: de(xe), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ka(xe, We),
            " · ",
            xe.item.media.date
          ] }),
          pt && /* @__PURE__ */ u("a", { href: de(pt), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ka(pt, We),
            " · ",
            pt.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Gt() {
    const $ = nn.filter((oe) => oe.tagIds === null), B = nn.filter((oe) => oe.tagIds !== null);
    return /* @__PURE__ */ u(he, { children: [
      rn(),
      tt($, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${Le ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: ct.map((oe, Ee) => {
            const Ce = fe(oe.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(oe.id),
                  "aria-labelledby": `${ye}-answer-${Ee}`,
                  "aria-describedby": `${ye}-effect-${Ee}`,
                  onChange: (le) => Zn(oe.id, le.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: Ce && /* @__PURE__ */ a(Rt, { binding: Ce, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ye}-answer-${Ee}`,
                    className: "dq-batch-answer-label",
                    title: oe.label,
                    children: oe.label
                  }
                ),
                /* @__PURE__ */ a(Hs, { id: `${ye}-effect-${Ee}`, parts: K(oe) })
              ] })
            ] }, oe.id);
          }) })
        ] }),
        Le && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: tt(B, !1, $.length === 0) }),
          /* @__PURE__ */ a(
            yi,
            {
              ...Xe,
              mediaKind: We,
              actions: Se.actions,
              trees: r,
              flags: lt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function un($) {
    const B = In, oe = F && Vs.has(F.group) ? F.group : null, Ee = oe ? qt.filter(ht[oe].test) : [], Ce = (le) => {
      const ue = we(le), Ae = ue.skipped ? Yn(
        le.before.ids,
        So(le.before.ids, $.action, $.categories, !0).desired
      ) : Bt(le), wt = !Ae.added.length && !Ae.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        ue.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        wt ? !ue.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(Qs, { added: Ae.added, removed: Ae.removed, tag: Ve }),
        ue.kept.map((ge, vt) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Dr(ge.existing.map(Ve)).map((Lt) => /* @__PURE__ */ a(cn, { tag: Lt }, Lt.id)),
          " ",
          "instead of",
          " ",
          Dr(ge.tagIds.map(Ve)).map((Lt) => /* @__PURE__ */ a(cn, { tag: Lt }, Lt.id))
        ] }, vt))
      ] });
    };
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            Sa,
            {
              value: qt.length,
              label: qt.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${B.hosts.toLocaleString()} ${B.hosts === 1 ? wn : `${wn}s`}`,
              pressed: xt("matching"),
              onToggle: () => Wt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            Sa,
            {
              value: B.willChange,
              label: "will change",
              tone: "add",
              pressed: xt("change"),
              onToggle: () => Wt({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            Sa,
            {
              value: B.correct,
              label: "already correct, no write",
              pressed: xt("correct"),
              onToggle: () => Wt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            Sa,
            {
              value: B.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: xt("different"),
              onToggle: () => Wt({ group: "different" })
            }
          )
        ] }),
        Ee.length > 0 ? /* @__PURE__ */ a(
          Ws,
          {
            title: ht[oe].title,
            entries: Ee,
            mediaKind: We,
            resultHeading: "Planned change",
            describe: Ce
          }
        ) : qt.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        qt.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: xe ? `Dates ${xe.item.media.date}${pt ? ` to ${pt.item.media.date}` : ""}` : "No dates" }),
          xe && /* @__PURE__ */ a(
            "a",
            {
              href: de(xe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${ln.one}, ${xe.item.media.date}`,
              title: ka(xe, We),
              children: "Open earliest"
            }
          ),
          pt && /* @__PURE__ */ a(
            "a",
            {
              href: de(pt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${ln.one}, ${pt.item.media.date}`,
              title: ka(pt, We),
              children: "Open latest"
            }
          ),
          De.length < qt.length && /* @__PURE__ */ u("span", { children: [
            (qt.length - De.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (B.added.length > 0 || B.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            Qs,
            {
              added: B.added,
              removed: B.removed,
              tag: Ve,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      B.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
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
          Ue ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function vn() {
    return /* @__PURE__ */ u(he, { children: [
      rn(),
      tt(nn, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${Le ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ye}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ye}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: er, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ye.map(($) => {
            const B = fe($.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                B && /* @__PURE__ */ a(Rt, { binding: B, hidden: !0 }),
                $.label
              ] }),
              /* @__PURE__ */ a(Hs, { parts: K($) })
            ] }, $.id);
          }) })
        ] }),
        Le && /* @__PURE__ */ a(
          yi,
          {
            ...Xe,
            mediaKind: We,
            actions: Se.actions,
            trees: r,
            flags: lt,
            className: "dq-batch-card"
          }
        )
      ] }),
      k ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : d && un(d)
    ] });
  }
  function yt($) {
    const B = H ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, oe = B.kind === "apply" ? qt.length - $.counts.pending : B.done, Ee = B.kind === "apply" ? qt.length : B.total, Ce = k ? B.kind === "undo" ? "Undoing batch…" : B.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : B.kind === "undo" ? B.stopped ? "Undo stopped" : "Undo finished" : B.stopped ? "Stopped" : "Finished", le = Ee ? Math.round(oe / Ee * 100) : 100, ue = F && !Vs.has(F.group) ? F.group : null, Ae = (ge) => Js.find((vt) => vt.status === ge).label, wt = ue ? qt.filter(
      (ge) => ge.status === ue && (!F.reason || ge.error === F.reason)
    ) : [];
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: Ce }),
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
            children: /* @__PURE__ */ a("span", { style: { width: `${le}%` } })
          }
        ),
        !k && B.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (B.total - $.recorded).toLocaleString(),
          " of",
          " ",
          B.total.toLocaleString(),
          " ",
          B.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: Js.map((ge) => /* @__PURE__ */ a(
          Sa,
          {
            value: $.counts[ge.status],
            label: B.kind === "undo" && ge.status === "unchanged" ? "As before" : ge.label,
            tone: ge.tone,
            pressed: xt(ge.status),
            onToggle: () => Wt({ group: ge.status })
          },
          ge.status
        )) }),
        $.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: $.reasons.map((ge) => {
          const vt = xt(ge.status, ge.error);
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
                "aria-expanded": vt,
                onClick: () => Wt({ group: ge.status, reason: ge.error }),
                children: vt ? "Hide them" : "Show them"
              }
            )
          ] }, `${ge.status}-${ge.error}`);
        }) }),
        wt.length > 0 ? /* @__PURE__ */ a(
          Ws,
          {
            title: F.reason ? `${Ae(ue)}: ${F.reason}` : `${Ae(ue)} occurrences`,
            entries: wt,
            mediaKind: We,
            resultHeading: "Result",
            describe: (ge) => ge.error ?? Ae(ge.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      $.recorded > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: k,
            onClick: () => void Pt("undo"),
            children: [
              /* @__PURE__ */ a(Fa, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          He ? B.stopped || k ? `${$.recorded.toLocaleString()} ${$.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${$.recorded.toLocaleString()} ${$.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${$.recorded === 1 ? "this change" : `these ${$.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          J ? "After you close this dialog or start a new batch, undo it from Recent changes." : "Recent changes could not keep this batch in this browser's storage (a very large batch does not fit), so its undo lasts only until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Sr() {
    return l === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ye.length,
        onClick: tr,
        children: "Preview all matches"
      },
      "preview"
    ) : l === "preview" ? k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: en, children: "Cancel preview" }, "cancel-preview") : d ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !In.willChange,
        onClick: () => void Pt("apply"),
        children: [
          "Apply to ",
          In.willChange.toLocaleString(),
          " ",
          In.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: er, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Tn(),
        children: "Preview again"
      },
      "again"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: en, children: He ? "Cancel undo" : "Cancel run" }, "cancel-run") : He || !ft ? null : /* @__PURE__ */ u(ki, { children: [
      ft.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void Pt("retry"), children: "Retry failed" }),
      ft.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Pt("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(ap, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: C,
        title: ct.length ? "Apply answers to all matching occurrences" : "No action here can run as a batch: a batch adds and removes tags, while marking tags present or absent is answered one occurrence at a time",
        disabled: t || !ct.length,
        onClick: () => {
          Je(), o(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(ys, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: S,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ye}-title`,
        "aria-modal": "true",
        onCancel: ($) => {
          $.preventDefault(), dn();
        },
        onClose: () => {
          var $;
          qe.current ? ($ = S.current) == null || $.showModal() : dn();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(ys, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ye}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: k,
                onClick: dn,
                children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Pp, { step: l }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: ce,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": l === "preview" ? "" : void 0,
              "aria-label": `${wi.find(($) => $.id === l).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  _ && /* @__PURE__ */ a("p", { role: "status", children: _ }),
                  x && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: x })
                ] }),
                l === "answers" ? Gt() : l === "preview" ? vn() : yt(ft)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            l === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: k, onClick: er, children: [
              /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
              "Back"
            ] }),
            l === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Je, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: dn, children: "Close" }),
            Sr()
          ] })
        ]
      }
    )
  ] });
}
const zl = "data-quality.description-collapsed.v1";
function Dp() {
  try {
    return localStorage.getItem(zl) === "true";
  } catch {
    return !1;
  }
}
function _p({
  details: e,
  label: t
}) {
  const [n, r] = T(Dp), o = Cn(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(zl, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Ad, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const jp = (e) => "";
function Up({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = jp,
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
          children: /* @__PURE__ */ a(jd, { "aria-hidden": "true" })
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
            /* @__PURE__ */ a(aa, { performer: m }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m.name }),
            N && /* @__PURE__ */ a(Hn, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
const Kp = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Bp = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Gp(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function io(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function zp(e, t) {
  const n = Co(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${io(r, "or")}`,
    includesAll: `has ${io(r, "and")}`,
    excludes: `has none of ${io(r, "or")}`,
    excludesAll: `missing ${io(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function Vp({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = T(!1), [c, l] = T(null), f = I(null), d = I(null), p = at(), h = Kr(e.conditionTagIds), m = zp(e, h);
  Mt(() => {
    const w = f.current;
    if (!i || !w) return;
    const k = () => l(Gp(w));
    k(), window.addEventListener("resize", k);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), x = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const O of x) O && (M == null || M.observe(O));
    return () => {
      window.removeEventListener("resize", k), M == null || M.disconnect();
    };
  }, [i]), X(() => {
    var k, M;
    if (!i) return;
    const w = (k = d.current) == null ? void 0 : k.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (M = d.current) == null || M.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || yn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const M = [...d.current.querySelectorAll(Bp)].filter((P) => P.closest('[role="dialog"]') === d.current).sort(
          (P, _) => P.compareDocumentPosition(_) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!M.length) return;
        const x = M[0], O = M[M.length - 1], E = document.activeElement;
        w.shiftKey && (E === x || E === d.current) ? (w.preventDefault(), O.focus()) : !w.shiftKey && E === O && (w.preventDefault(), x.focus());
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
          /* @__PURE__ */ a(Sc, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: m }),
          /* @__PURE__ */ a(Ai, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ u(he, { children: [
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Kp.map(({ mode: w, label: k }) => /* @__PURE__ */ a(
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
                yr,
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
                  Ca,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ei,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(ia, { "aria-hidden": "true" }),
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
                  children: Ii.map((w) => /* @__PURE__ */ a("option", { value: w, children: Ti[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ a(
                  yr,
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
                  Ta(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function po(e) {
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
function Jp(e) {
  const t = e.occurrence;
  return JSON.stringify([
    je(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Hp(e, t) {
  const n = je(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await ku(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let l = 1; ; l++) {
      const f = await me(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Wn({
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
const Qp = 3e3, Xs = 250;
async function Wp(e, t, n, r) {
  const o = Oo(e, t);
  if (await Li(o, o.view.filter, n) > Qp) return null;
  const { sorts: i, seed: s, ...c } = e.view.filter, l = {
    ...e,
    view: {
      ...e.view,
      // Cove breaks ties in creation time by id, so pages neither overlap nor shift under a write.
      filter: { ...c, perPage: Xs, sort: "created_at", direction: "asc" }
    }
  }, f = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    n.throwIfAborted();
    const p = await Ki(l, t, d, n);
    for (const h of p.items)
      f.set(h.performer.id, (f.get(h.performer.id) ?? 0) + 1);
    if (r(f), d * Xs >= p.totalCount) return f;
  }
}
function Vl(e, t, n) {
  const r = Oo(e, [t]);
  return Li(r, r.view.filter, n);
}
function Jl(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function vi(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function Yp(e, t, n, r, o = {}) {
  const i = po(e), s = Jp(e), c = tl(e.occurrence), l = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Hp(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = l;
  if (l.cursor === 0 && !l.ranked.length && f.length > 1) {
    const y = new Map(f.map((w) => [w.id, w])), N = (w) => [...w].flatMap(([k, M]) => {
      const x = y.get(k);
      return x && M > 0 ? [{ ...x, count: M }] : [];
    }).sort((k, M) => M.count - k.count || k.name.localeCompare(M.name)), v = await Wp(
      e,
      Co(e.occurrence) ? null : f.map((w) => w.id),
      r,
      (w) => {
        var k;
        return (k = o.onProgress) == null ? void 0 : k.call(o, { ...l, ranked: N(w), limit: n, complete: !1, partial: !0 });
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
    complete: !y && vi(f, p, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !vi(f, p, d, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await Vl(e, N.id, r);
          v > 0 && Jl(d, { ...N, count: v }), (y = o.onProgress) == null || y.call(o, m(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), m(!1);
}
function Xp(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && Jl(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: vi(e.candidates, e.cursor, o, e.limit)
  };
}
const Ni = /* @__PURE__ */ new Map();
function Zp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Hl(e, t) {
  const n = Zp(t);
  return Ni.set(e, n), n;
}
function eh(e) {
  const [t, n] = T(null);
  if (X(() => {
    if (e === null || Ni.has(e)) return;
    const r = new AbortController();
    return me(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = Hl(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Ni.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var Qo = { exports: {} }, Zs;
function th() {
  return Zs || (Zs = 1, (function(e) {
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
          var p, h, m = {}, y = {}, N = "", v = "", w = "", k = 2, M = 3, x = 2, O = [], E = 0, P = 0, _;
          for (_ = 0; _ < l.length; _ += 1)
            if (N = l.charAt(_), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = M++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < x; p++)
                    E = E << 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < x; p++)
                    E = E << 1 | h, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
                }
                k--, k == 0 && (k = Math.pow(2, x), x++), delete y[w];
              } else
                for (h = m[w], p = 0; p < x; p++)
                  E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
              k--, k == 0 && (k = Math.pow(2, x), x++), m[v] = M++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < x; p++)
                  E = E << 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < x; p++)
                  E = E << 1 | h, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
              }
              k--, k == 0 && (k = Math.pow(2, x), x++), delete y[w];
            } else
              for (h = m[w], p = 0; p < x; p++)
                E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
            k--, k == 0 && (k = Math.pow(2, x), x++);
          }
          for (h = 2, p = 0; p < x; p++)
            E = E << 1 | h & 1, P == f - 1 ? (P = 0, O.push(d(E)), E = 0) : P++, h = h >> 1;
          for (; ; )
            if (E = E << 1, P == f - 1) {
              O.push(d(E));
              break;
            } else P++;
          return O.join("");
        },
        decompress: function(l) {
          return l == null ? "" : l == "" ? null : c._decompress(l.length, 32768, function(f) {
            return l.charCodeAt(f);
          });
        },
        _decompress: function(l, f, d) {
          var p = [], h = 4, m = 4, y = 3, N = "", v = [], w, k, M, x, O, E, P, _ = { val: d(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (M = 0, O = Math.pow(2, 2), E = 1; E != O; )
            x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
          switch (M) {
            case 0:
              for (M = 0, O = Math.pow(2, 8), E = 1; E != O; )
                x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
              P = n(M);
              break;
            case 1:
              for (M = 0, O = Math.pow(2, 16), E = 1; E != O; )
                x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
              P = n(M);
              break;
            case 2:
              return "";
          }
          for (p[3] = P, k = P, v.push(P); ; ) {
            if (_.index > l)
              return "";
            for (M = 0, O = Math.pow(2, y), E = 1; E != O; )
              x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
            switch (P = M) {
              case 0:
                for (M = 0, O = Math.pow(2, 8), E = 1; E != O; )
                  x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
                p[m++] = n(M), P = m - 1, h--;
                break;
              case 1:
                for (M = 0, O = Math.pow(2, 16), E = 1; E != O; )
                  x = _.val & _.position, _.position >>= 1, _.position == 0 && (_.position = f, _.val = d(_.index++)), M |= (x > 0 ? 1 : 0) * E, E <<= 1;
                p[m++] = n(M), P = m - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), p[P])
              N = p[P];
            else if (P === m)
              N = k + k.charAt(0);
            else
              return null;
            v.push(N), p[m++] = k + N.charAt(0), h--, k = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(Qo)), Qo.exports;
}
var Ql = th();
function wr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => wr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && wr(n[s], r[s])
  );
}
function nh(e) {
  var c, l, f;
  const [t, n] = T({}), [r, o] = T(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((l = e == null ? void 0 : e.presentation) == null ? void 0 : l.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return X(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (p) => [p, await $o([p])]
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
function Wl(e, t, n) {
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
function rh(e, t, n) {
  var s;
  const r = Wl(e, t, n), o = t == null ? void 0 : t.presentation, i = (o == null ? void 0 : o.annotations) ?? [];
  return {
    performers: i.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: i.includes("tags") && ((s = o == null ? void 0 : o.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function ah({
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
  ), l = s.every((v) => r[v]), f = Gr(
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
  const p = f.filter((v) => !d.has(v)), h = Kr(p);
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
            k && /* @__PURE__ */ a(ca, { "aria-hidden": "true" }),
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
function oh({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: o,
  countsPaused: i,
  onToggle: s
}) {
  var p, h;
  const c = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], l = Gr(e.view.objectFilter, t, c).bins, f = ih(e, t, n, i);
  if (!c.length) return null;
  const d = /* @__PURE__ */ new Map();
  for (const m of c) {
    const y = ((h = m.group) == null ? void 0 : h.trim()) ?? "";
    d.set(y, [...d.get(y) ?? [], m]);
  }
  return /* @__PURE__ */ a(he, { children: [...d].map(([m, y]) => /* @__PURE__ */ u(
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
                v && /* @__PURE__ */ a(ca, { "aria-hidden": "true" }),
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
function ih(e, t, n, r) {
  var d;
  const [o, i] = T({}), { page: s, ...c } = n, l = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((d = e.presentation) == null ? void 0 : d.filterBins) ?? [],
    t,
    c
  ]), f = I(null);
  return X(() => {
    var y, N;
    if (r || f.current === l) return;
    f.current = l, i({});
    let p = 0;
    const h = new AbortController(), m = Gr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (p++, Li(Xl(e, v.key, t), n, h.signal).then((w) => {
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
function Pr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sh(e) {
  if (!Pr(e) || Object.keys(e).length !== 1 || !Pr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Pr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function Yl(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function ch(e, t) {
  const n = t.find(
    (r) => wr(e, Yl(r.filter))
  );
  return n ? n.key : sh(e);
}
function Gr(e, t, n = []) {
  let r = e;
  const o = [];
  for (; ; ) {
    if (t && wr(r, t)) {
      r = t;
      break;
    }
    const i = Object.keys(r);
    if (i.length !== 1 || i[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!Pr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, l = ch(c.at(-1), n);
    if (l == null || c.length > 3) break;
    let f = {}, d = null, p = !0;
    for (const [h, m] of c.slice(0, -1).entries())
      !Pr(m) || Object.keys(m).length !== 1 ? p = !1 : h === 0 && Pr(m.filter) && Object.keys(m.filter).length ? f = m.filter : !d && Pr(m.group) ? d = m.group : p = !1;
    if (!p) break;
    o.unshift(l), r = d ? { ...f, _filterExpression: d } : f;
  }
  return { base: r, bins: o };
}
function Xl(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: o, bins: i } = Gr(e.view.objectFilter, n, r), s = (d) => {
    var p, h;
    return ((h = (p = r.find((m) => m.key === d)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, c = s(t);
  return (i.includes(t) ? i.filter((d) => d !== t) : [...i.filter((d) => !c || s(d) !== c), t]).reduce(lh, { ...e, view: { ...e.view, objectFilter: o } });
}
function lh(e, t) {
  var i, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (i = e.presentation) == null ? void 0 : i.filterBins) == null ? void 0 : s.find((l) => l.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = Yl(c.filter);
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
const Mo = [
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
], dh = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Ur(e) {
  const t = Oe(e) ? e.occurrence : void 0;
  return {
    filter: Ht({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, je(e)),
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
function ec(e) {
  return Ql.compressToEncodedURIComponent(JSON.stringify(e));
}
function tc(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : Ql.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function qi(e, t) {
  let n;
  if (Oe(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Mo.some((c) => c !== "performer" && t.has(c))) {
    const c = Ur(e);
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
  if (Oe(e) && (i = {
    ...dh,
    ...tc(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !Ii.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Ht(o, je(e)),
      objectFilter: tc(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const nc = { dataQualityOpenedFromList: !0 };
function Zl() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function ed(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...nc }, "", e) : window.history.replaceState(Zl() ? { ...nc } : null, "", e);
}
function Aa(e, t) {
  const n = new URLSearchParams(window.location.search);
  Mo.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", ec(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", ec(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), ed(`${window.location.pathname}?${n}${window.location.hash}`);
}
function xn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Oe(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function _r(e) {
  const t = e;
  return xn(t, Ur(t));
}
function rc(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !wr(
    JSON.parse(hr(xn(e, t))),
    JSON.parse(hr(xn(e, Ur(e))))
  );
}
function cs(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return ze(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function td(e, t) {
  if (ze(e) !== "video") return e;
  const { base: n, bins: r } = Gr(
    e.view.objectFilter,
    t.view.objectFilter,
    cs(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function so(e, t) {
  if (ze(e) !== "video") return t;
  const { base: n, bins: r } = Gr(
    t.objectFilter,
    e.view.objectFilter,
    cs(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function ac(e, t) {
  return !t || !Oe(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Wo(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const bn = (e) => e instanceof Error ? e.message : "Request failed.", uh = (e) => /[.!?]$/.test(e.trim()) ? e.trim() : `${e.trim()}.`, Yo = 50, fh = [], oc = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function ph(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Id(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? wc(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function hh({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ec, {}) : /* @__PURE__ */ a(Ao, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: ri(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function mh({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: o,
  actionTagIds: i,
  label: s
}) {
  const c = !!n && !r, l = es(t), f = n ? null : l, d = e == null ? void 0 : e.absent, p = Ua(
    ve(() => [...i, ...d ?? []], [i, d])
  ), h = (H) => p[H] ?? { id: H, name: p[H] === void 0 ? "…" : "Unavailable tag" }, m = (H) => Dr(H.map(h)), y = f && e ? Hi(f, e, o) : null, N = e ? rf(e) : [], v = new Set(N.map((H) => H.id)), w = new Set(y == null ? void 0 : y.removed), k = new Set(y == null ? void 0 : y.markedAbsent), M = new Set(y == null ? void 0 : y.absenceCleared), x = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
    "absent"
  ] }), O = m((y == null ? void 0 : y.added) ?? []), E = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((H) => !v.has(H))), P = n ? "h3" : "h4", _ = !!(e != null && e.absent.length) && /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a(P, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((H) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${M.has(H.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(ho, { "aria-hidden": "true" }),
          M.has(H.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(cn, { tag: H })
          ] }) : /* @__PURE__ */ a(cn, { tag: H })
        ]
      },
      H.id
    )) })
  ] }), re = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(he, { children: [
      N.length || O.length || E.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (H) => w.has(H.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(cn, { tag: H })
            ] }),
            k.has(H.id) && x
          ] }, H.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(cn, { tag: H }) }, H.id)
        ),
        O.map((H) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(cn, { tag: H })
        ] }) }, `added-${H.id}`)),
        E.map((H) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(cn, { tag: H }) }),
          x
        ] }, `absent-${H.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      !n && _
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(he, { children: [
    !c && re,
    n,
    n && _ && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: _ })
  ] });
}
function gh({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    Wi(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function bh({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: i = 0,
  onEditRequestHandled: s,
  undoRevision: c = 0,
  pageControls: l,
  stayOnTap: f,
  onStayOnTapChange: d
}) {
  var Yr;
  const p = je(e), h = Ln(p), m = (g) => Fi(g, p), y = (g) => `${g.occurrence ? `${g.occurrence.performer.name} — ` : ""}${m(g.media)}`, N = I(null), v = I("");
  if (!N.current)
    try {
      N.current = qi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (g) {
      v.current = bn(g), N.current = { query: Ur(e), startAtEnd: !1 };
    }
  const [w, k] = T(null), [M, x] = T(""), O = I(null), E = I(null), P = I(null), _ = I(null), [re, H] = T(!!v.current), j = I(0), [J, L] = T(N.current.query), F = I(J);
  F.current = J;
  const [D, Z] = T(0), Q = I(N.current.startAtEnd), [ie, W] = T([]), [S, ce] = T(null), C = I(null), [ee, se] = T(null), [be, G] = T(0), qe = ve(() => {
    var V;
    if (!S) return null;
    const g = ie.findIndex((te) => te.key === S.key), A = ((V = C.current) == null ? void 0 : V.key) === S.key ? C.current : null;
    return (g >= 0 ? ie.slice(g + 1) : A ? ie.filter((te) => !A.before.includes(te.key)) : []).find((te) => te.media.id !== S.media.id) ?? null;
  }, [S, ie]), [Ie, ye] = T(0), [Re, He] = T(!1), [Se, Dn] = T(!1), Ne = I(!1), We = I(0), ln = I(!1), wn = I(null), ct = I(!0), Ye = I(null);
  X(() => (ct.current = !0, () => {
    ct.current = !1;
  }), []);
  const [Le, Xe] = T(v.current), [Xn, Ft] = T(""), [Nr, Ve] = T(""), [$e, ot] = T(null), [Je, dn] = T(!1), [Zn, er] = T([]), tr = I([]), en = I(null), Wt = I(null), xt = I(null);
  X(() => {
    var g, A;
    Je && ((A = (g = xt.current) == null ? void 0 : g.querySelector("input")) == null || A.focus());
  }, [Je]);
  const Tn = I(null);
  X(() => {
    if (Se) return;
    const g = Tn.current;
    Tn.current = null;
    const A = document.activeElement;
    g != null && g.isConnected && (!A || A === document.body) && g.focus();
  }, [Se]);
  const [Pt, qt] = T(!1), [qr, we] = T(!1), Bt = Ka(), [_n, nr] = T(!1), In = f ?? _n, De = d ?? nr;
  X(() => {
    if (Re || Pt || !Wt.current) return;
    const g = requestAnimationFrame(() => {
      if (document.querySelector(oc)) return;
      const A = Wt.current;
      Wt.current = null;
      const U = document.activeElement;
      U && U !== document.body || A != null && A.isConnected && !A.disabled && A.focus();
    });
    return () => cancelAnimationFrame(g);
  }, [Re, Pt, D]);
  const [ft, fe] = T([]), [K, Ue] = T({}), xe = I(null), [pt, de] = T({});
  X(() => {
    let g = !0;
    return Promise.all(
      os(J.objectFilter).map(
        async (A) => [
          String(A),
          (await me(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      g && de(Object.fromEntries(A));
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [J.objectFilter]);
  const zr = ve(
    () => is(J.objectFilter, pt),
    [pt, J.objectFilter]
  ), tn = I(0), nn = I(e);
  nn.current = e;
  const lt = w ?? e, ht = ve(
    () => xn(lt, J),
    [lt, J]
  ), rn = ve(
    () => ac(ht, J.performerFocus),
    [ht, J.performerFocus]
  ), tt = I(rn);
  tt.current = rn;
  const Gt = I(ht);
  Gt.current = ht;
  const [un, vn] = T("items"), [yt, Sr] = T(null), $ = I(null), B = I("");
  function oe(g) {
    const A = typeof g == "function" ? g($.current) : g;
    $.current = A, Sr(A);
  }
  const [Ee, Ce] = T(!1), [le, ue] = T(null), Ae = I(null), wt = Oe(ht) ? po(ht) : "", [ge, vt] = T(0), [Lt, Ba] = T(null);
  X(() => () => {
    var g;
    return (g = Ae.current) == null ? void 0 : g.controller.abort();
  }, []), X(() => {
    const g = Ae.current;
    !g || g.signature === wt || (g.controller.abort(), Ae.current = null, Ce(!1));
  }, [wt]), X(() => {
    var U;
    const g = $.current;
    if (un !== "performers" || !wt || ((U = Ae.current) == null ? void 0 : U.signature) === wt || B.current === wt || (g == null ? void 0 : g.signature) === wt && g.complete)
      return;
    const A = (g == null ? void 0 : g.signature) === wt ? g : null;
    on(g, (A == null ? void 0 : A.limit) ?? Yo);
  }, [un, wt, yt, le, Ee]);
  const ke = J.performerFocus;
  X(() => {
    if (!ke) {
      Ba(null);
      return;
    }
    let g = !0;
    return me(`/api/performers/${ke}`).then((A) => {
      const U = Hl(ke, A.tags);
      g && Ba({ id: ke, name: A.name, tags: U });
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [ke]);
  const jn = JSON.stringify(
    Oe(ht) ? Ic(ht.occurrence) : []
  ), Te = ve(() => JSON.parse(jn), [jn]), kr = ve(() => cf(Te), [Te]), Un = dl(kr), da = Ua(kr), ua = (g) => {
    var A;
    return ((A = da[g]) == null ? void 0 : A.name) ?? (da[g] === null ? "Unavailable tag" : "…");
  }, fa = (g) => ({
    name: ua(g),
    tagIds: Un.get(g) ?? [g],
    resolved: Un.has(g)
  }), Dt = Gl(
    Oe(ht) ? ht : null,
    ke ?? null,
    ge
  ), fn = rc(e, J), Er = rc(e, so(e, J)), St = Se || Re || Je, $n = Number(J.filter.page);
  function Ke(g, A = !1) {
    Ne.current || (We.current++, Ft(""), v.current = "", Q.current = A, F.current = g, L(g), ye(0), He(!0), A || Aa(e.id, g), Z((U) => U + 1));
  }
  function it() {
    if (Ne.current = !1, Dn(!1), ct.current && Ye.current) {
      const g = Ye.current;
      Ye.current = null, Ke(g.query, g.startAtEnd);
    }
  }
  X(() => {
    const g = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const A = qi(
            nn.current,
            new URLSearchParams(window.location.search)
          );
          Ne.current ? Ye.current = A : Ke(A.query, A.startAtEnd);
        } catch (A) {
          Xe(bn(A));
        }
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, [e.id]), X(() => (r(Se || Re || Je || !!w), () => r(!1)), [Se, Re, Je, !!w, r]);
  async function mt(g, A, U) {
    if (Oe(g)) {
      const te = await Ki(
        g,
        xe.current,
        A,
        U
      );
      return {
        items: te.items.map((pe) => ({
          key: pe.key,
          media: pe.media,
          occurrence: pe
        })),
        totalCount: te.totalCount
      };
    }
    const V = await na(
      g,
      { ...g.view.filter, page: A },
      U
    );
    return {
      items: V.items.map((te) => ({ key: String(te.id), media: te })),
      totalCount: V.totalCount
    };
  }
  function kt(g, A, U, V = !1, te = !1) {
    if (!ct.current || Ye.current) return;
    H(!0), W(
      te ? g.items : Wo(g.items, F.current.startFrom === "end")
    ), ye(g.totalCount), an(U, V);
    const pe = {
      ...F.current,
      filter: { ...F.current.filter, page: A }
    };
    F.current = pe, L(pe), Aa(e.id, pe);
  }
  function an(g, A = !1) {
    We.current++, (g == null ? void 0 : g.key) !== (S == null ? void 0 : S.key) && (C.current = null), (g == null ? void 0 : g.media.id) !== (S == null ? void 0 : S.media.id) && se(A && g ? g.media.id : null), ce(g);
  }
  X(() => {
    if (v.current) return;
    const g = new AbortController();
    _.current = g;
    const A = ++tn.current;
    return He(!0), Xe(""), Ve(""), C.current = null, se(null), ce(null), W([]), dn(!1), (async () => {
      const U = ac(
        xn(nn.current, F.current),
        F.current.performerFocus
      );
      xe.current = Oe(U) ? await ji(U, g.signal) : null;
      let V = Number(U.view.filter.page), te = await mt(U, V, g.signal);
      const pe = Math.max(
        1,
        Math.ceil(te.totalCount / Number(U.view.filter.perPage))
      );
      (Q.current || V > pe) && (V = pe, te = await mt(U, V, g.signal)), Q.current = !1;
      const Fe = U.view.startFrom === "end" ? -1 : 1;
      for (; Oe(U) && !te.items.length && V + Fe >= 1 && V + Fe <= pe && !g.signal.aborted; )
        V += Fe, te = await mt(U, V, g.signal);
      if (A !== tn.current || g.signal.aborted) return;
      const At = Wo(te.items, U.view.startFrom === "end");
      kt(te, V, At[0] ?? null);
    })().catch((U) => {
      !g.signal.aborted && A === tn.current && Xe(bn(U));
    }).finally(() => {
      !g.signal.aborted && A === tn.current && (H(!0), He(!1));
    }), () => {
      g.abort(), tn.current++;
    };
  }, [D, e.id]);
  const Yt = I(null), Vr = I(0), rr = I(c);
  X(() => {
    const g = rr.current !== c && (S == null ? void 0 : S.key) === Yt.current;
    rr.current = c;
    const A = ($e == null ? void 0 : $e.ids) ?? [];
    if ((S == null ? void 0 : S.key) !== Yt.current && ot(null), Yt.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let U = !0;
    const V = Vr.current;
    return Qt(p, S).then((te) => {
      if (!U || V !== Vr.current) return;
      ot(te);
      const pe = Oe(e) ? e.occurrence.tagIds : [];
      if (!g)
        fe(te.ids.filter((Fe) => pe.includes(Fe)));
      else {
        const Fe = Yn(A, te.ids);
        fe((At) => [
          ...At.filter((Ct) => !Fe.removed.includes(Ct)),
          ...Fe.added.filter((Ct) => pe.includes(Ct) && !At.includes(Ct))
        ]);
      }
    }).catch((te) => {
      U && Xe(`Could not load current tags. ${bn(te)}`);
    }), () => {
      U = !1;
    };
  }, [S, c]);
  const Nn = I(c);
  X(() => {
    Nn.current !== c && (Nn.current = c, vt((g) => g + 1));
  }, [c]), X(() => {
    if (!Oe(e) || e.actions.length)
      return;
    let g = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (A) => [
          A,
          (await me(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      g && Ue(Object.fromEntries(A));
    }).catch((A) => {
      g && Xe(bn(A));
    }), () => {
      g = !1;
    };
  }, [e]);
  function qn(g, A = C.current) {
    const U = ie.findIndex((Tt) => Tt.key === g.key), V = J.startFrom === "end" ? -1 : 1, te = (A == null ? void 0 : A.key) === g.key, pe = te ? A : { key: g.key, page: $n, before: ie.slice(0, U + 1).map((Tt) => Tt.key), after: ie.slice(U + 1).map((Tt) => Tt.key) }, Fe = new Set(pe.after), At = new Set(pe.before), Ct = ie.find((Tt) => Fe.has(Tt.key) || (V === 1 || $n < pe.page) && te && !At.has(Tt.key));
    return { direction: V, cursor: pe, remainingKeys: Fe, visitedKeys: At, nextLoaded: Ct };
  }
  async function Ar(g = !1, A = !1, U = !1, V = () => !0, te = C.current) {
    if (!S) return;
    const { direction: pe, cursor: Fe, remainingKeys: At, visitedKeys: Ct, nextLoaded: Tt } = qn(S, te);
    if (!g && Tt) {
      an(Tt, U);
      return;
    }
    const _t = g ? Ct : new Set(ie.map((Zt) => Zt.key));
    let gt = pe === -1 && !g ? Math.max(1, $n - 1) : $n;
    for (; ct.current && !Ye.current; ) {
      let Zt = await mt(rn, gt);
      const Rn = Math.max(
        1,
        Math.ceil(Zt.totalCount / Number(J.filter.perPage))
      );
      gt > Rn && (gt = Rn, Zt = await mt(rn, gt));
      const Mn = Wo(Zt.items, pe === -1), cr = new Map(Mn.map((Vt) => [Vt.key, Vt])), lr = g ? Fe.after.flatMap((Vt) => {
        const dr = cr.get(Vt);
        return dr ? [dr] : [];
      }) : [], nt = new Set(lr.map((Vt) => Vt.key)), rt = g ? {
        ...Zt,
        items: [
          ...lr,
          ...Mn.filter(
            (Vt) => Vt.key !== S.key && !nt.has(Vt.key)
          )
        ]
      } : { ...Zt, items: Mn };
      if (!V()) return;
      if (A) {
        C.current = Fe, kt(rt, gt, S, !1, !0);
        return;
      }
      const zt = pe === -1 && $n === 1 && !g ? void 0 : rt.items.find(
        (Vt) => !_t.has(Vt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(g && pe === -1 && gt === Fe.page) || At.has(Vt.key))
      );
      if (zt || (pe === -1 ? gt <= 1 : gt >= Rn)) {
        kt(
          rt,
          gt,
          zt ?? null,
          U,
          !0
        ), zt || Ve(
          Zt.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      gt += pe;
    }
  }
  async function Xt(g, A = !1, U = !1, V = !1) {
    var lr;
    if (ln.current && g && S && !U && !V && !w && !Je) {
      wn.current = { action: g, stay: A, key: S.key };
      return;
    }
    if (w || !S || Ne.current || Re || Je && !U)
      return;
    const te = U || V || !!(g != null && g.steps.length);
    if (te && (!t || !$e) || g && br(g) && !n) return;
    const pe = !A && !U && !V && te && g !== void 0 && $e !== null && Rs(e) && ui(di(e.actions, of(g, $e, kn))).length > 0, Fe = U && ((lr = xt.current) != null && lr.contains(document.activeElement)) ? document.activeElement : null;
    Ne.current = !0, Dn(!0), Xe(""), Ve(""), ln.current = !0, te && (We.current++, Vr.current++);
    const At = C.current, Ct = te && !A && !pe ? qn(S).nextLoaded ?? null : null;
    Ct && (W(
      (nt) => nt.filter((rt) => rt.key !== S.key)
    ), an(Ct, !0));
    let Tt = !1, _t = !1, gt = [], Zt = null, Rn = [];
    const Mn = (nt) => zi({
      id: Ji(),
      at: Date.now(),
      label: (g == null ? void 0 : g.label) ?? (V ? "Saved choices" : "Edited tags"),
      reviewName: e.name,
      kind: p,
      items: [Vi(S, m(S.media), Zt, nt, Rn)]
    });
    let cr = "";
    try {
      if (te) {
        const nt = await Qt(p, S);
        if (Zt = nt, g)
          Rn = (await ja(g)).flatMap((zt) => zt.tagIds), await Ku(rn, S, g);
        else {
          const zt = V && Oe(e) ? e.occurrence.tagIds.filter((Po) => nt.ids.includes(Po)) : tr.current, dr = Yn(zt, V ? ft : Zn);
          Rn = [...dr.added, ...dr.removed], await Bi(rn, S, dr);
        }
        const rt = await Qt(p, S);
        Mn(rt) || (cr = " Recent changes could not record it, so it cannot be undone there."), Ct || ot(rt), _t = !0, dn(!1), pe && (gt = ui(di(e.actions, rt))), Ve(
          gt.length ? `Tags saved. Staying until answered: ${gt.map((zt) => zt.name).join(", ")}.${cr}` : `Tags saved.${cr}`
        ), S.occurrence && (Sn(S.occurrence.performer.id), vt((zt) => zt + 1));
      }
      if (!ct.current || Ye.current) return;
      if (te)
        if (Ct) {
          const nt = We.current;
          Tt = !0, ln.current = !1, it(), Ar(!0, !1, !0, () => We.current === nt && !Ne.current, At).catch((rt) => {
            We.current === nt && Xe(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${bn(rt)}`);
          });
        } else gt.length || await Ar(!0, A, !A);
      else A || await Ar();
      A && U && requestAnimationFrame(() => {
        var nt;
        return (nt = en.current) == null ? void 0 : nt.focus();
      });
    } catch (nt) {
      if (Xe(
        _t ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${bn(nt)}` : te ? `Saving stopped. ${uh(bn(nt))}${U || V ? " Your choices are kept." : ""} Check the current tags before retrying.` : `Could not advance. ${bn(nt)}`
      ), te && !_t) {
        Tn.current = Fe, Ct && (W(ie), se(null), G((rt) => rt + 1), ce(S), C.current = At);
        try {
          const rt = await Qt(p, S);
          Zt && !Mn(rt) && Xe(
            (zt) => `${zt} Recent changes could not record what was saved, so it cannot be undone there.`
          ), ot(rt);
        } catch {
          ot(null), Xe(
            (rt) => `${rt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Tt || (ln.current = !1, it());
    }
  }
  X(() => {
    const g = wn.current;
    if (!(!g || Se || Ne.current)) {
      if ((S == null ? void 0 : S.key) !== g.key || Le) {
        wn.current = null;
        return;
      }
      $e && (wn.current = null, Xt(g.action, g.stay));
    }
  }, [Se, $e, S, Le]);
  const Ga = !Je && !w && !Pt && !qr && (S != null || Re || Se);
  Yi({
    surface: "local",
    enabled: Ga,
    actions: e.actions,
    onAction: (g, A) => {
      const U = e.actions[g];
      U && Xt(U, A);
    },
    onFind: () => we(!0)
  });
  const Me = (g) => Se || Re || !$e || !!w || !t && g.steps.length > 0 || !n && br(g);
  function ar() {
    !o || w || Ne.current || Je || (P.current = document.activeElement, E.current = {
      error: Le,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(F.current),
      items: ie,
      current: S,
      total: Ie,
      targets: xe.current,
      stayedCursor: C.current
    }, We.current++, k(structuredClone(e)), x(""), Ve(""), Xe(""));
  }
  X(() => {
    if (!i) {
      j.current = 0;
      return;
    }
    i !== j.current && re && !Re && (j.current = i, ar(), s == null || s());
  }, [i, Re, re]);
  function On() {
    k(null), x(""), requestAnimationFrame(() => {
      const g = P.current;
      g != null && g.isConnected && g !== document.body && g.focus();
    });
  }
  function za() {
    var A;
    const g = E.current;
    !g || Se || ((A = _.current) == null || A.abort(), tn.current++, F.current = g.query, L(g.query), W(g.items), ce(g.current), ye(g.total), xe.current = g.targets, C.current = g.stayedCursor, He(!1), Xe(g.error), Ve(""), window.history.replaceState(window.history.state, "", g.url), On());
  }
  async function Kn() {
    if (!w || !o || Ne.current) return;
    const g = xn(
      { ...w, name: w.name.trim() },
      so(nn.current, F.current)
    ), A = $a(g);
    if (A) {
      x(A);
      return;
    }
    Ne.current = !0, Dn(!0), x("");
    try {
      if (await o(g) === !1) throw new Error("Could not save review.");
      On(), Ve("Review saved.");
    } catch (U) {
      x(xc(U));
    } finally {
      it();
    }
  }
  async function Fo() {
    if (!o || Ne.current) return;
    const g = so(nn.current, F.current), A = xn(nn.current, {
      ...g,
      filter: { ...g.filter, page: 1 }
    });
    Ne.current = !0, Dn(!0), Xe(""), Ft("");
    try {
      if (await o(A) === !1) throw new Error("Could not save review.");
      Ve("Queue saved to this review.");
    } catch (U) {
      Ft("Could not save queue. " + bn(U));
    } finally {
      it();
    }
  }
  const Et = J.performerScope, or = (g) => {
    const { performerFocus: A, ...U } = F.current, V = A && !("targetMode" in g || "performerIds" in g || "performerFilter" in g);
    Ke(
      {
        ...U,
        ...V ? { performerFocus: A } : {},
        filter: { ...U.filter, page: 1 },
        performerScope: { ...Et, ...g }
      },
      U.startFrom === "end"
    );
  };
  async function on(g, A) {
    var te;
    const U = Gt.current;
    if (!Oe(U)) return;
    (te = Ae.current) == null || te.controller.abort();
    const V = {
      signature: po(U),
      controller: new AbortController()
    };
    Ae.current = V, B.current = "", Ce(!0), ue(null);
    try {
      const pe = await Yp(U, g, A, V.controller.signal, {
        onProgress: (Fe) => {
          Ae.current === V && oe(Fe);
        }
      });
      Ae.current === V && oe(pe);
    } catch (pe) {
      Ae.current === V && !V.controller.signal.aborted && (B.current = V.signature, ue({ signature: V.signature, message: bn(pe) }));
    } finally {
      Ae.current === V && (Ae.current = null, Ce(!1));
    }
  }
  function Cr() {
    var g;
    (g = Ae.current) == null || g.controller.abort(), Ae.current = null, Ce(!1), oe((A) => A && { ...A, partial: !0, complete: !1 });
  }
  async function Sn(g) {
    var V;
    const A = Gt.current;
    if (!Oe(A)) return;
    if (Ae.current) {
      Cr();
      return;
    }
    const U = po(A);
    if (!(((V = $.current) == null ? void 0 : V.signature) !== U || $.current.partial))
      try {
        const te = await Vl(A, g);
        if (Ae.current) {
          Cr();
          return;
        }
        oe(
          (pe) => (pe == null ? void 0 : pe.signature) === U ? Xp(pe, g, te) : pe
        );
      } catch {
        oe(
          (te) => (te == null ? void 0 : te.signature) === U ? { ...te, partial: !0, complete: !1 } : te
        );
      }
  }
  const Be = J.performerFocus ? yt == null ? void 0 : yt.candidates.find((g) => g.id === J.performerFocus) : void 0, Nt = Lt && Lt.id === J.performerFocus ? { ...Lt, flags: xr(Te, Lt.tags) } : Be ? { ...Be, flags: xr(Te, Be.tags) } : null, Va = (g) => {
    if ((Lt == null ? void 0 : Lt.id) === g)
      return xr(Te, Lt.tags);
    const A = yt == null ? void 0 : yt.candidates.find((U) => U.id === g);
    return A ? xr(Te, A.tags) : void 0;
  }, pn = ((Yr = S == null ? void 0 : S.occurrence) == null ? void 0 : Yr.performer.id) ?? null, Tr = pn === null ? void 0 : Va(pn), Ir = eh(
    Te.length > 0 && pn !== null && pn !== J.performerFocus && Tr === void 0 ? pn : null
  ), pa = Tr ?? (Ir ? xr(Te, Ir) : []), kn = ll(lt.actions), $r = Dt.summary && J.performerFocus ? Qi(ss(Dt.summary, lt.actions, kn)) : [], ha = Ms(Te, (Nt == null ? void 0 : Nt.flags) ?? [], fa), Bn = hl(
    Ms(Te, pa, fa),
    pn !== null && pn === J.performerFocus ? $r : []
  ), Or = JSON.stringify(Bn), ma = ve(() => Bn, [Or]), Ja = JSON.stringify(ha), Ha = ve(() => ha, [Ja]), ga = (g) => mf(Te, g, ua);
  function xo(g) {
    if (Ne.current) return;
    const A = {
      ...F.current,
      performerFocus: g,
      filter: { ...F.current.filter, page: 1 }
    };
    Ke(A, A.startFrom === "end"), vn("items");
  }
  function ba() {
    const { performerFocus: g, ...A } = F.current;
    Ke(
      { ...A, filter: { ...A.filter, page: 1 } },
      A.startFrom === "end"
    );
  }
  const Jr = I(null);
  Jr.current ?? (Jr.current = yl());
  const hn = Jr.current, Hr = ve(
    () => lt.actions.flatMap((g) => g.steps.flatMap((A) => A.tagIds)),
    [lt.actions]
  ), ir = I(null);
  X(() => {
    var Fe;
    const g = ir.current, A = g == null ? void 0 : g.querySelector('[aria-current="true"]');
    if (!g || !A) return;
    const U = g.getBoundingClientRect(), V = A.getBoundingClientRect(), te = (Fe = A.nextElementSibling) == null ? void 0 : Fe.getBoundingClientRect(), pe = te && te.bottom - V.top <= U.height ? Math.max(te.bottom, V.bottom) : V.bottom;
    V.top < U.top ? g.scrollTop -= U.top - V.top : pe > U.bottom && (g.scrollTop += pe - U.bottom);
  }, [S == null ? void 0 : S.key, un]);
  const Gn = I(null), sr = I(null);
  X(() => {
    var U, V;
    const g = sr.current;
    if (!g) return;
    sr.current = null;
    const A = [...((U = Gn.current) == null ? void 0 : U.querySelectorAll(".dq-partner")) ?? []];
    (V = A.find((te) => te.dataset.partnerKey === g) ?? A[0]) == null || V.focus();
  }, [S == null ? void 0 : S.key]);
  const sn = Se || Re || Je || !!w, En = ve(
    () => w ? xn(w, so(e, J)) : null,
    [w, e, J]
  ), Qr = ve(
    () => En != null && oa(_r(En)) !== oa(_r(e)),
    [En, e]
  );
  function Qa() {
    S ? Qt(p, S).then(ot).catch((g) => Xe(bn(g))) : Ke(F.current);
  }
  const ya = Le ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Le,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: Se, onClick: Qa, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, Wa = Se || Re || S != null && !$e, Ya = Math.max(1, Number(J.filter.perPage) || 1), Wr = I(1);
  Re || (Wr.current = Math.max(1, Math.ceil(Ie / Ya)));
  const Rr = Wr.current, An = Et && S ? ie.filter(
    (g) => g.media.id === S.media.id && g.key !== S.key
  ) : [], _e = (g) => {
    var A;
    return g.title || ((A = g.files[0]) == null ? void 0 : A.basename) || `${p === "audio" ? "Audio" : "Video"} ${g.id}`;
  }, Xa = S ? ph(S.media, p) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${p === "audio" ? " dq-audio" : ""}`,
      "aria-label": Et ? p === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : p === "audio" ? "Audio review" : "Video review",
      onClickCapture: (g) => {
        var V;
        const A = g.target instanceof Element ? g.target.closest("button") : null, U = (A == null ? void 0 : A.getAttribute("aria-label")) ?? ((V = A == null ? void 0 : A.textContent) == null ? void 0 : V.trim()) ?? "";
        A && !A.closest(oc) && /^(Filters|Edit filter:|Edit criteria)/.test(U) && (Wt.current = A);
      },
      children: [
        /* @__PURE__ */ a(
          xl,
          {
            name: e.name,
            description: e.description,
            entityType: ze(e),
            onBack: l == null ? void 0 : l.onBack,
            backDisabled: sn || !!(l != null && l.busy),
            onEdit: w ? () => {
              var g;
              return (g = O.current) == null ? void 0 : g.focus();
            } : ar,
            editDisabled: !w && (sn || !o || !!(l != null && l.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Se || Je, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: p === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  Ca,
                  {
                    filter: J.filter,
                    objectFilter: zr,
                    criteriaDefinitions: p === "audio" ? gc : ko,
                    customFieldEntityType: p,
                    supportsFilterExpressions: !0,
                    totalCount: Ie,
                    sortOptions: p === "audio" ? Cd : bc,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      Pl,
                      {
                        page: Math.min(Math.max(1, $n || 1), Rr),
                        pages: Rr,
                        onPage: (g) => Ke({
                          ...F.current,
                          filter: Ht(
                            { ...F.current.filter, page: g },
                            p
                          )
                        })
                      }
                    ),
                    onFilterChange: (g) => {
                      (g.sort !== F.current.filter.sort || g.direction !== F.current.filter.direction) && (g = { ...g, sorts: void 0 }), Ke(
                        {
                          ...F.current,
                          filter: Ht(g, p)
                        },
                        F.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (g) => {
                      Ke(
                        {
                          ...F.current,
                          objectFilter: Dl(
                            g,
                            pt,
                            F.current.objectFilter
                          ),
                          filter: { ...F.current.filter, page: 1 }
                        },
                        F.current.startFrom === "end"
                      );
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(he, { children: [
              Et && /* @__PURE__ */ a(
                Vp,
                {
                  scope: Et,
                  disabled: Se || Je,
                  editing: !!w,
                  onChange: or,
                  onEditCriteria: () => qt(!0)
                }
              ),
              (l == null ? void 0 : l.onGrid) && /* @__PURE__ */ a(
                Ll,
                {
                  mode: "single",
                  disabled: sn || !!l.busy,
                  onChange: () => {
                    var g;
                    return (g = l.onGrid) == null ? void 0 : g.call(l);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(he, { children: [
              Oe(rn) && t && /* @__PURE__ */ a(
                Lp,
                {
                  review: rn,
                  disabled: St || !!w,
                  performerAttention: J.performerFocus ? Ha : void 0,
                  trees: kn,
                  onOpen: () => {
                    Ne.current = !0, Dn(!0);
                  },
                  onClose: (g) => {
                    if (g) {
                      const A = F.current.performerFocus;
                      A ? Sn(A) : Cr(), vt((U) => U + 1), it(), v.current || He(!0), Z((U) => U + 1);
                    } else it();
                  }
                }
              ),
              (l == null ? void 0 : l.moreItems) && /* @__PURE__ */ a(
                ns,
                {
                  disabled: sn,
                  items: l.moreItems({
                    onSelect: ar,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: J.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                aa,
                {
                  performer: {
                    id: J.performerFocus,
                    name: (Nt == null ? void 0 : Nt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (Nt == null ? void 0 : Nt.name) ?? `performer ${J.performerFocus}` })
              ] }),
              Nt != null && Nt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: ga(Nt.flags), children: [
                /* @__PURE__ */ a(Hn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ga(Nt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: St,
                  onClick: ba,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: fn,
            queueChange: !w && fn ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Er ? () => void Fo() : void 0,
              saveDisabled: St || !o,
              onReset: () => {
                const g = Ur(e);
                Ke(g, g.startFrom === "end");
              },
              resetDisabled: St
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        l == null ? void 0 : l.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && En && /* @__PURE__ */ a(
            Fl,
            {
              drawerRef: O,
              draft: En,
              onChange: (g) => k(g),
              direction: J.startFrom,
              onDirectionChange: (g) => Ke({ ...F.current, startFrom: g }),
              tagGroups: fh,
              trees: kn,
              saving: Se,
              saveDisabled: Re,
              error: M,
              dirty: Qr,
              criteriaChanged: Er,
              notices: ya && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: ya }),
              onSave: () => void Kn(),
              onCancel: za
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(he, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${p}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: _e(S.media) }),
                        /* @__PURE__ */ a(Cc, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Xa && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Xa })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, qe].filter(Boolean).map((g) => {
                    var V, te, pe, Fe, At;
                    const A = g, U = A.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: U ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": U ? void 0 : !0,
                        inert: U ? void 0 : !0,
                        children: p === "audio" ? /* @__PURE__ */ a(
                          Td,
                          {
                            streamUrl: ai("audio", A.media.id),
                            format: ((V = A.media.files[0]) == null ? void 0 : V.format) ?? "",
                            title: m(A.media),
                            coverUrl: U ? ri("audio", A.media) : void 0,
                            duration: ((te = A.media.files[0]) == null ? void 0 : te.duration) ?? 0,
                            autostart: U && ee === A.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          yc,
                          {
                            videoId: A.media.id,
                            streamUrl: ai("video", A.media.id),
                            posterUrl: U ? ri("video", A.media) : void 0,
                            duration: ((pe = A.media.files[0]) == null ? void 0 : pe.duration) ?? 0,
                            format: (Fe = A.media.files[0]) == null ? void 0 : Fe.format,
                            audioCodec: (At = A.media.files[0]) == null ? void 0 : At.audioCodec,
                            extensionSurface: U ? "quick-view" : void 0,
                            autostart: U && ee === A.media.id,
                            keyboardShortcutsEnabled: U,
                            showAbLoop: U,
                            clip: A.media.parentVideoId != null ? {
                              start: A.media.clipStartSec ?? 0,
                              end: A.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${A.media.id}:${be}`
                    );
                  }) }),
                  p === "audio" && /* @__PURE__ */ a(
                    _p,
                    {
                      details: S.media.details,
                      label: h.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Re ? "Loading review…" : Ie ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              lt.actions.length > 0 ? /* @__PURE__ */ a(
                Af,
                {
                  actions: lt.actions,
                  isDisabled: (g) => Je || Me(g),
                  busy: Wa,
                  tags: $e,
                  trees: kn,
                  preview: hn,
                  onApply: (g, A) => void Xt(g, A),
                  onFind: () => we(!0),
                  findDisabled: Je || !!w,
                  paused: !!w,
                  waitForGroups: Rs(lt),
                  attention: ma,
                  stayOnTap: In,
                  onStayOnTapChange: De
                }
              ) : Oe(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Se || Je || !$e || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((g) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: ft.includes(g),
                          onChange: (A) => fe(
                            e.occurrence.multiple ? A.target.checked ? [...ft, g] : ft.filter((U) => U !== g) : [g]
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
                          onClick: () => fe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Xt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Xt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Gn, children: [
                S && /* @__PURE__ */ u(he, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(aa, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: Et ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    ma.length > 0 && /* @__PURE__ */ a(gh, { entries: ma })
                  ] }),
                  An.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: An.map((g) => {
                          var A, U, V;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (A = g.occurrence) == null ? void 0 : A.performer.name,
                              "aria-label": (U = g.occurrence) == null ? void 0 : U.performer.name,
                              "data-partner-key": g.key,
                              disabled: St,
                              onClick: () => {
                                sr.current = S.key, an(g), Xe("");
                              },
                              children: [
                                g.occurrence && /* @__PURE__ */ a(aa, { performer: g.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (V = g.occurrence) == null ? void 0 : V.performer.name })
                              ]
                            },
                            g.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    mh,
                    {
                      tags: $e,
                      preview: hn,
                      trees: kn,
                      actionTagIds: Hr,
                      label: `Current ${Et ? "occurrence" : h.one} tags`,
                      tagsChangedSinceEditing: Je && !Se && (!$e || $e.ids.length !== tr.current.length || $e.ids.some((g) => !tr.current.includes(g))),
                      editor: Je && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: xt,
                          disabled: Se,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              Et ? "occurrence" : h.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              yr,
                              {
                                entityType: "tag",
                                values: Zn,
                                onChange: er,
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
                                  disabled: !$e,
                                  onClick: () => void Xt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !$e,
                                  onClick: () => void Xt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    dn(!1), requestAnimationFrame(() => {
                                      var g;
                                      return (g = en.current) == null ? void 0 : g.focus();
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
                Oe(ht) && J.performerFocus && /* @__PURE__ */ a(
                  yi,
                  {
                    ...Dt,
                    mediaKind: p,
                    actions: lt.actions,
                    trees: kn,
                    flags: Ha
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && ya,
                  !w && Xn && /* @__PURE__ */ a("p", { role: "alert", children: Xn }),
                  Nr && /* @__PURE__ */ a("p", { role: "status", children: Nr })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Wa || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: en,
                      className: "dq-button",
                      disabled: St || !!w || !t || !$e,
                      onClick: () => {
                        We.current++, tr.current = [...$e.ids], er([...$e.ids]), dn(!0), Ve("");
                      },
                      children: [
                        /* @__PURE__ */ a(kc, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: St || !!w,
                      onClick: () => void Xt(),
                      children: [
                        /* @__PURE__ */ a(Ud, { "aria-hidden": "true" }),
                        "Skip",
                        Et ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Et && /* @__PURE__ */ u(
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
                        "aria-pressed": un === "items",
                        onClick: () => vn("items"),
                        children: p === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": un === "performers",
                        onClick: () => vn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Et && un === "performers" ? /* @__PURE__ */ a(
                Up,
                {
                  ranking: (yt == null ? void 0 : yt.signature) === wt ? yt : null,
                  busy: Ee,
                  error: (le == null ? void 0 : le.signature) === wt ? le.message : "",
                  focus: J.performerFocus,
                  disabled: St,
                  labels: h,
                  flagLabel: ga,
                  onFocus: xo,
                  onMore: () => {
                    const g = $.current;
                    g && on(g, g.limit + Yo);
                  },
                  onRefresh: () => {
                    oe(null), on(null, Yo);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: ir, children: ie.map((g) => {
                var U;
                const A = (S == null ? void 0 : S.key) === g.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(g),
                    "aria-label": y(g),
                    "aria-current": A ? "true" : void 0,
                    disabled: St,
                    onClick: () => {
                      an(g), Xe(""), Ve("");
                    },
                    children: [
                      /* @__PURE__ */ a(hh, { media: g.media, kind: p }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m(g.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          g.occurrence && /* @__PURE__ */ u(he, { children: [
                            /* @__PURE__ */ a(aa, { performer: g.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: g.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            g.media.date,
                            g.occurrence ? "" : (U = g.media.files[0]) != null && U.duration ? wc(g.media.files[0].duration) : ""
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
        Et && /* @__PURE__ */ a(
          mc,
          {
            open: Pt,
            onClose: () => qt(!1),
            criteria: Ei,
            activeFilter: Et.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (g) => {
              qt(!1), or({ performerFilter: g });
            }
          }
        ),
        qr && /* @__PURE__ */ a(
          Zi,
          {
            actions: e.actions,
            trees: kn,
            isDisabled: (g) => Me(g),
            tapStays: Bt && In,
            onApply: (g, A) => {
              we(!1), Xt(g, A);
            },
            onClose: () => we(!1)
          }
        )
      ]
    }
  );
}
const nd = "data-quality.reviews-sort.v1", yh = { sort: "name", direction: "asc" };
function wh() {
  try {
    const e = JSON.parse(localStorage.getItem(nd) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return yh;
}
function vh(e) {
  try {
    localStorage.setItem(
      nd,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function rd(e, t, n, r) {
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
function Xo(e, t) {
  const n = ze(e), r = Ln($i(n)), o = n === "tag" ? "tag" : Oe(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function Nh({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Xo(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Xo(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Xo(e, t)
    ] })
  ] });
}
function qh({
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
  const w = I(null), k = ve(
    () => rd(e, t, n, r),
    [e, t, n, r]
  ), M = e.every((O) => t[O.id] !== void 0), x = r === "asc" ? "ascending" : "descending";
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
              var O;
              return (O = w.current) == null ? void 0 : O.click();
            },
            children: [
              /* @__PURE__ */ a(Kd, { "aria-hidden": "true" }),
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
            onChange: (O) => {
              var P;
              const E = (P = O.target.files) == null ? void 0 : P[0];
              O.target.value = "", E && m(E);
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
              /* @__PURE__ */ a(Tc, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Fa, { "aria-hidden": "true" }),
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
              /* @__PURE__ */ a(Pa, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: M ? e.some((O) => t[O.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ u("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ u("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ u(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (O) => o(O.target.value),
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
              "aria-label": `Sort direction: ${x}`,
              title: `Sort direction: ${x}`,
              onClick: () => i(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(Bd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(Gd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ u("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? x : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? x : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: k.map((O) => {
          const E = ze(O);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(O.id)}`,
                "data-review-id": O.id,
                onClick: (P) => {
                  P.button !== 0 || P.metaKey || P.ctrlKey || P.shiftKey || P.altKey || (P.preventDefault(), p(O.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Ol, { entityType: E }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: O.name }),
                    O.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: O.description, children: O.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: $l[E] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(Nh, { review: O, count: t[O.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(ns, { label: `Actions for ${O.name}`, items: v(O) }) })
          ] }, O.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(Ao, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function ad(e, { id: t, name: n, description: r }) {
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
function Sh({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = I(null), l = I(null), f = I(i);
  f.current = i;
  const d = I(null), p = at();
  X(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = l.current) == null || y.focus(), () => {
      var N;
      (N = d.current) != null && N.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = I(i);
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
                  children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Ml,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== ze(o) && t(ad(y, o));
                    },
                    nameRef: l
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => ts(o), children: "Export draft" }),
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
const kh = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Eh(e, t, n, r) {
  return td(
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
function ic(e, t) {
  return ze(t) === "video" && Gr(t.view.objectFilter, e.view.objectFilter, cs(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function sc(e, t) {
  return wr(
    JSON.parse(hr(_r(e))),
    JSON.parse(hr(_r(t)))
  );
}
const Zo = 180;
function cc(e) {
  return ze(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function lc(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function dc() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ei(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Mo.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  ed(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ah(e) {
  return Ht({ ...e, page: 1 });
}
function od(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function ea(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ch = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Ci, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(Jd, { "aria-hidden": "true" }) }
], Th = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Ci, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(Vd, { "aria-hidden": "true" }) }
], uc = [], id = "(min-width: 900px)";
function Ih(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(id);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function $h() {
  return typeof window.matchMedia == "function" && window.matchMedia(id).matches;
}
function Oh({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = T(""), [s, c] = T(!0), [l, f] = T(""), [d, p] = T(!1), [h, m] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [k, M] = T([]), [x, O] = T(""), [E, P] = T(!0), [_, re] = T("account"), [H, j] = T(""), [J, L] = T(""), [F, D] = T(!1), [Z, Q] = T(!1), [ie, W] = T(""), [S, ce] = T(dc), C = I(S);
  C.current = S;
  const [ee, se] = T({}), be = I(ee);
  be.current = ee;
  const G = I(t);
  G.current = t;
  const qe = I(s);
  qe.current = s;
  const Ie = I(!1), ye = I(!0);
  X(() => (ye.current = !0, () => {
    ye.current = !1;
  }), []);
  const [Re, He] = T(!S);
  Re !== !S && (He(!S), S || se({}));
  const [Se, Dn] = T(wh), { sort: Ne, direction: We } = Se, ln = (b) => {
    const q = { ...Se, ...b };
    Dn(q), vh(q);
  }, wn = I(null), ct = I(null), [Ye, Le] = T(null), [Xe, Xn] = T(!1), [Ft, Nr] = T(!1), [Ve, $e] = T(null), [ot, Je] = T(null), [dn, Zn] = T(!1), [er, tr] = T(0), en = !!Ve || !!ot || dn, Wt = I(en);
  Wt.current = en;
  const xt = Xe || !!ot || Ft, [Tn, Pt] = T(0), [qt, qr] = T(!1), [we, Bt] = T(null), _n = I(null), nr = I(null), In = I(null), [De, ft] = T(
    null
  ), fe = t.find((b) => b.id === S) ?? null, K = ve(
    () => (De == null ? void 0 : De.id) === S && fe ? { ...fe, view: {
      ...fe.view,
      filter: De.view.filter,
      objectFilter: De.view.objectFilter,
      searchMode: De.view.searchMode,
      startFrom: De.view.startFrom
    } } : fe,
    [De, S, fe]
  ), Ue = K ? ze(K) : "video", xe = $i(Ue), pt = K ? Oe(K) : !1, de = Ue === "video" ? K : null, zr = !!(K != null && K.actions.some(br)), tn = pt && zr, nn = (!!de || Ue === "audio" || pt) && zr, [lt, ht] = T(null), rn = (lt == null ? void 0 : lt.id) === (K == null ? void 0 : K.id) ? lt == null ? void 0 : lt.mode : (K == null ? void 0 : K.view.reviewMode) ?? "single", tt = pt || Ue === "audio" || Ue === "video" && rn === "single", [Gt, un] = T(0), vn = I(-1), yt = I(!1), Sr = I(tt);
  Sr.current = tt, X(() => {
    const b = () => {
      const q = Sr.current;
      if (!q && Kn.current) {
        yt.current = !0;
        return;
      }
      vn.current = -1, lr(), q || un((R) => R + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const $ = xe === "audio" ? h : d, B = Ue === "tag" ? "Tag" : xe === "audio" ? "Audio" : "Video", oe = Ue === "tag" ? y : $, Ee = I(
    null
  ), Ce = nh(de), [le, ue] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Ae, wt] = T({
    page: 1,
    perPage: 40
  }), [ge, vt] = T({ items: [], totalCount: 0 }), [Lt, Ba] = T(S);
  Lt !== S && (Ba(S), vt({ items: [], totalCount: 0 }), Q(!1));
  const [ke, jn] = T(!1), [Te, kr] = T(""), [Un, da] = T(!1), [ua, fa] = T(!1), [Dt, fn] = T(() => /* @__PURE__ */ new Set()), Er = I(Dt);
  Er.current = Dt;
  const St = I(/* @__PURE__ */ new Map()), $n = (K == null ? void 0 : K.view.selectAllOnLoad) === !0, [Ke, it] = T(null), mt = I(Ke);
  mt.current = Ke;
  const [kt, an] = T(!1), Yt = I(kt);
  Yt.current = kt;
  const Vr = I(null), [rr, Nn] = T(!1), [qn, Ar] = T("grid"), [Xt, Ga] = T(Zo), [Me, ar] = T(!1), [On, za] = T(!1), Kn = I(!1), [Fo, Et] = T(""), [or, on] = T(""), [Cr, Sn] = T(""), [Be, Nt] = T(null), [Va, pn] = T(""), [Tr, Ir] = T(!1), [pa, kn] = T({}), $r = I(/* @__PURE__ */ new Map()), ha = I(null), Bn = I(null), Or = !!K, ma = Si(Ih, $h, () => !1) && Or, [Ja, Ha] = T({ top: 0, bottom: 0 });
  Mt(() => {
    if (!Or) return;
    const b = () => {
      const R = Bn.current;
      if (!R) return;
      const z = Math.round(R.getBoundingClientRect().top + window.scrollY), ne = R.closest("main"), ae = ne ? Math.round(parseFloat(getComputedStyle(ne).paddingBottom) || 0) : 0;
      Ha(
        (Y) => Y.top === z && Y.bottom === ae ? Y : { top: z, bottom: ae }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [Or]);
  const [ga, xo] = T(0), ba = I(null), Jr = Cn((b) => {
    var R;
    if ((R = ba.current) == null || R.disconnect(), ba.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => xo(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), ba.current = q;
  }, []), hn = I(0), Hr = I(0), ir = I(null), Gn = I(null), sr = ll(
    K && !tt ? we ? [...K.actions, ...we.draft.actions] : K.actions : uc
  ), sn = ve(
    () => we && K && fe ? Eh(we.draft, K, le, fe) : null,
    [we, K, le, fe]
  ), En = ve(
    () => K && fe ? td(
      { ...fe, view: { ...K.view, filter: { ...le, page: 1 } } },
      fe
    ) : null,
    [K, fe, le]
  ), Qr = ve(
    () => fe ? oa(_r(fe)) : "",
    [fe]
  ), Qa = ve(
    () => En != null && oa(_r(En)) !== Qr,
    [En, Qr]
  ), ya = ve(
    () => sn != null && oa(_r(sn)) !== Qr,
    [sn, Qr]
  );
  X(() => {
    if (!or) return;
    const b = window.setTimeout(() => on(""), 4e3);
    return () => window.clearTimeout(b);
  }, [or]), X(() => {
    if (!Ye || Ye.alert) return;
    const b = window.setTimeout(() => Le(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Ye]), X(() => {
    const b = de ? os(de.view.objectFilter) : [];
    if (kn({}), !b.length) return;
    const q = new AbortController();
    let R = !0;
    return Promise.all(
      b.map(async (z) => {
        var ne;
        try {
          const ae = await me(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (ne = ae.name) != null && ne.trim() ? [String(z), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      R && kn(
        Object.fromEntries(z.filter((ne) => ne !== null))
      );
    }), () => {
      R = !1, q.abort();
    };
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.view.objectFilter]);
  const Wa = ve(
    () => de ? is(
      de.view.objectFilter,
      pa
    ) : (K == null ? void 0 : K.view.objectFilter) ?? {},
    [pa, K, de]
  ), Ya = Cn(async () => {
    c(!0), f("");
    try {
      const b = await hu();
      n(b.reviews), i(b.storageKey), Gu(b.storageKey), p(b.canWriteVideos ?? b.canWrite), m(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), P(b.canConfigure ?? !0), re(b.storage ?? "account"), j(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (ce(""), ei(""));
    } catch (b) {
      f(
        b instanceof Error ? b.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [S]);
  X(() => {
    if (!v) {
      M([]), O("");
      return;
    }
    const b = new AbortController();
    return O(""), Cu(b.signal).then(M).catch((q) => {
      b.signal.aborted || O(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), X(() => {
    Ya();
  }, []), X(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof be.current[q.id] == "number") continue;
      (Oe(q) ? ji(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : na(Oo(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : ze(q) === "tag" ? Ko(
        q,
        Ht({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : na(
        q,
        Ht({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || se((ne) => ({
          ...ne,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || se((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), Mt(() => {
    var R, z;
    const b = ct.current;
    if (S || s || !b) return;
    ct.current = null, (z = (b === "heading" ? null : [...((R = Bn.current) == null ? void 0 : R.querySelectorAll("[data-review-id]")) ?? []].find(
      (ne) => ne.dataset.reviewId === b.reviewId
    )) ?? wn.current) == null || z.focus();
  }, [S, s, ot, t]);
  const Wr = I(0), Rr = Cn(async () => {
    const b = ++Wr.current;
    Nt(null), pn("");
    try {
      const q = await (tn ? Gc(xe) : Kc(xe));
      b === Wr.current && Nt(q);
    } catch (q) {
      if (b !== Wr.current) return;
      Nt(null), pn(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [tn, xe]);
  X(() => {
    Rr();
  }, [Rr]);
  const An = Cn(
    async (b, q, R = !1, z = !1, ne = () => !0) => {
      var Pe, et;
      const ae = ++hn.current;
      (Pe = ir.current) == null || Pe.abort();
      const Y = new AbortController();
      ir.current = Y, q = Ht(q);
      const Qe = Number(q.page);
      R && (q = { ...q, page: 1 }), ue(q), fa(R), jn(!0), kr("");
      try {
        const dt = (bt) => ze(b) === "tag" ? Ko(
          b,
          bt,
          Y.signal
        ) : na(
          b,
          bt,
          Y.signal
        );
        let st = await dt(q);
        const It = Math.max(
          1,
          Math.ceil(st.totalCount / Number(q.perPage))
        ), Ge = R ? It : Math.min(Qe, It);
        return Number(q.page) !== Ge && (q = { ...q, page: Ge }, st = await dt(q)), ae === hn.current && ne(st) && (((et = Gn.current) == null ? void 0 : et.page) !== Ge && (Gn.current = {
          page: Ge,
          ids: new Set(st.items.map((bt) => bt.id))
        }), vt(st), z && te(
          () => new Set(st.items.map((bt) => bt.id))
        ), ue(q), wt(q)), st;
      } catch (dt) {
        throw ae === hn.current && kr(
          dt instanceof Error ? dt.message : "Could not load the review queue."
        ), dt;
      } finally {
        ae === hn.current && jn(!1);
      }
    },
    []
  );
  X(() => {
    var q;
    if (Hr.current += 1, vn.current = -1, hn.current += 1, (q = ir.current) == null || q.abort(), Bt(null), _n.current = null, Q(!1), W(""), L(""), D(!1), fn(/* @__PURE__ */ new Set()), St.current.clear(), it(null), an(!1), ar(!1), Kn.current = !1, Et(""), on(""), Sn(""), vt({ items: [], totalCount: 0 }), Gn.current = null, da(!1), !K || tt) {
      jn(!1), ft(null);
      return;
    }
    let b = !0;
    return jn(!0), (async () => {
      let R = fe ?? K;
      ft(null);
      let z = null;
      const ne = new URLSearchParams(window.location.search);
      if (ze(K) === "video" && Mo.some((Pe) => ne.has(Pe)))
        try {
          const Pe = R;
          z = qi(Pe, ne);
          const et = xn(Pe, z.query);
          (z.query.startFrom !== (Pe.view.startFrom ?? "end") || !wr(
            JSON.parse(hr(et)),
            JSON.parse(hr(xn(Pe, Ur(Pe))))
          )) && (R = et, ft(R));
        } catch (Pe) {
          da(!0), kr(Pe instanceof Error ? Pe.message : "Could not read review URL."), jn(!1);
          return;
        }
      let ae = null;
      try {
        ae = await vu(o, K.id);
      } catch (Pe) {
        b && (D(!0), L(
          Pe instanceof Error ? Pe.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const Y = (ae == null ? void 0 : ae.signature) === hr(R) ? ae : null, Qe = z ? z.query.filter : Y ? Ht(Y.filter) : Ah(R.view.filter);
      ue(Qe), Ar(
        Y ? lc(Y.displayMode, ze(K)) : cc(K)
      ), Ga(
        Y ? Y.cardSize ?? Zo : Zo
      );
      try {
        const Pe = await An(
          R,
          Qe,
          z ? z.startAtEnd : !Y && R.view.startFrom !== "beginning",
          R.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const et = ws(
          Pe.items.map((dt) => dt.id),
          (Y == null ? void 0 : Y.focusedId) ?? null,
          (Y == null ? void 0 : Y.index) ?? 0
        );
        it(et), V(et);
      } catch {
      }
      b && (vn.current = Gt, Q(!0), W(`${K.id}:${Gt}`));
    })(), () => {
      var R;
      b = !1, Hr.current++, hn.current++, (R = ir.current) == null || R.abort();
    };
  }, [K == null ? void 0 : K.id, tt, Gt]), X(() => {
    if (!(!Tn || tt || !K)) {
      if (Un) {
        Pt(0);
        return;
      }
      Me || we || On || ie !== `${K.id}:${Gt}` || (Pt(0), jo());
    }
  }, [
    Tn,
    tt,
    K == null ? void 0 : K.id,
    ie,
    Me,
    On,
    Gt,
    Un
  ]), X(() => {
    !de || tt || !Z || ke || Te || Me || yt.current || vn.current !== Gt || Aa(de.id, {
      filter: le,
      objectFilter: de.view.objectFilter,
      searchMode: de.view.searchMode,
      startFrom: de.view.startFrom ?? "end"
    });
  }, [de, tt, Z, ke, Te, le, Me, Gt]);
  const _e = ve(
    () => ge.items.map((b) => b.id),
    [ge.items]
  );
  X(() => {
    if (!Z || !K || !o || ke || Te || Me || (De == null ? void 0 : De.id) === K.id || F || vn.current !== Gt)
      return;
    const b = {
      version: 1,
      signature: hr(K),
      filter: le,
      focusedId: Ke,
      index: Math.max(0, _e.indexOf(Ke ?? -1)),
      displayMode: qn,
      cardSize: Xt,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + K.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (J) return;
    let q = !0;
    const R = window.setTimeout(() => {
      Nu(o, K.id, b).catch((z) => {
        q && L(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(R);
    };
  }, [
    Z,
    o,
    K,
    ke,
    Te,
    Me,
    le,
    Ke,
    _e,
    qn,
    Xt,
    De,
    J,
    F,
    Gt
  ]);
  const Xa = ge.items.find((b) => b.id === Ke) ?? null, Yr = Ue === "video" ? Xa : null;
  kt && Yr && (Vr.current = Yr);
  const g = Yr ?? (kt ? Vr.current : null), A = qs(Dt, Ke), U = _e.length > 0 && _e.every((b) => Dt.has(b)), V = Cn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (Wt.current || cu(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const R = $r.current.get(b);
      R == null || R.focus({ preventScroll: !0 }), q && (R == null || R.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  X(() => {
    Z && !Yt.current && V(mt.current);
  }, [Z, V]), X(() => {
    ke || !_e.length || (mt.current == null || !_e.includes(mt.current)) && (it(_e[0]), Yt.current || V(_e[0]));
  }, [V, _e, ke]);
  const te = Cn(
    (b) => {
      fn((q) => {
        const R = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...R]))
          q.has(z) !== R.has(z) && St.current.set(
            z,
            (St.current.get(z) ?? 0) + 1
          );
        return R;
      });
    },
    []
  ), pe = Cn(
    (b) => {
      if (!_e.length) return;
      const q = Math.max(
        0,
        _e.indexOf(mt.current ?? _e[0])
      ), R = _e[Math.max(0, Math.min(_e.length - 1, q + b))];
      it(R), Yt.current || V(R);
    },
    [V, _e]
  ), Fe = Cn(
    async (b, q = !1) => {
      const R = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, ne = z != null && (!v || !k.some((Ze) => Ze.id === z)), ae = "effect" in b && R && !v, Y = qs(
        Er.current,
        mt.current
      );
      if (!K || Kn.current || ke || Te) return;
      const Qe = R && !oe ? `${B} write permission is required to apply ${b.label}.` : ae || ne ? `${b.label} needs a tag group that is unavailable.` : br(b) && (Be == null ? void 0 : Be.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : Y.length ? "" : `Select or focus a ${Ue} before applying ${b.label}.`;
      if (Qe) {
        Sn(Qe);
        return;
      }
      const Pe = ++Hr.current, et = K.id, dt = [..._e], st = ge, It = mt.current, Ge = new Set(Er.current), bt = new Map(
        Y.map((Ze) => [Ze, St.current.get(Ze) ?? 0])
      ), Mr = () => Pe === Hr.current && K.id === et;
      Kn.current = !0, ar(!0), Et(
        Er.current.size ? `${Y.length} selected ${Ue}s` : `the focused ${Ue}`
      ), on(""), Sn("");
      const hs = st.items.filter(
        (Ze) => !Y.includes(Ze.id)
      ), yd = hs.map((Ze) => Ze.id), ms = Ss(
        dt,
        yd,
        It,
        Y.includes(It ?? -1)
      );
      q || (vt({
        items: hs,
        totalCount: st.totalCount
      }), fn((Ze) => {
        const $t = new Set(Ze);
        for (const jt of Y) $t.delete(jt);
        return $t;
      }), it(ms), Yt.current || V(ms));
      let Uo = !1, to = "";
      try {
        if ("effect" in b)
          await Fu(b, Y);
        else if (!R)
          await oi(xe, b, Y);
        else {
          const Ze = (await ja(b)).flatMap((mn) => mn.tagIds), $t = Y.map((mn) => ({
            key: String(mn),
            media: st.items.find((Fn) => Fn.id === mn) ?? {
              id: mn
            }
          })), jt = () => Xu($t, (mn) => Qt(xe, mn).catch(() => null)), ur = await jt();
          let va = !1;
          try {
            await oi(xe, b, Y), va = !0;
          } finally {
            const mn = await jt(), Fn = $t.flatMap((zn, Ut) => {
              const Kt = ur[Ut], Xr = mn[Ut];
              return Kt && Xr ? [Vi(zn, Fi(zn.media, xe), Kt, Xr, Ze)] : [];
            }), ut = $t.length - Fn.length;
            to = zi({
              id: Ji(),
              at: Date.now(),
              label: b.label,
              reviewName: K.name,
              kind: xe,
              items: Fn
            }) ? ut && va ? ` Recent changes could not read ${ut} of them, so their change cannot be undone there.` : "" : " Recent changes could not record it, so it cannot be undone there.";
          }
        }
        if (Uo = !0, !Mr()) return;
        q || fn((Ze) => {
          const $t = new Set(Ze);
          for (const jt of Y)
            (St.current.get(jt) ?? 0) === bt.get(jt) && $t.delete(jt);
          return $t;
        }), on(
          `${b.label}: ${Y.length} ${Ue}${Y.length === 1 ? "" : "s"} ${R ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        ), to && Sn(`${b.label} was applied.${to}`);
      } catch (Ze) {
        if (!Mr()) return;
        vt(st), fn(($t) => {
          const jt = new Set($t);
          for (const ur of Y)
            Ge.has(ur) && (St.current.get(ur) ?? 0) === bt.get(ur) && jt.add(ur);
          return jt;
        }), it(It), Yt.current || V(It), Sn(
          `${b.label}: ${Ze instanceof Error ? Ze.message : "Action failed."}${to}`
        );
      }
      try {
        if (!Mr()) return;
        if (q) {
          const ut = Ue === "tag" ? await Ko(K, le) : await na(K, le), gn = new Map(
            ut.items.map((Jt) => [Jt.id, Jt])
          );
          if (Ue !== "tag" && await Promise.all(
            Y.filter((Jt) => !gn.has(Jt)).map(async (Jt) => {
              const Na = await wo(xe, Jt).catch(() => null);
              Na && gn.set(Jt, Na);
            })
          ), !Mr()) return;
          const zn = new Set(Y), Ut = "effect" in b ? b.effect : null, Kt = (Ut == null ? void 0 : Ut.mode) === "SET_TAG_GROUP" ? k.find((Jt) => Jt.id === Ut.tagGroupId) : void 0, Xr = (Jt) => Ut && Ut.mode !== "SKIP" && zn.has(Jt.id) ? {
            ...Jt,
            tagGroupId: (Kt == null ? void 0 : Kt.id) ?? null,
            tagGroupName: (Kt == null ? void 0 : Kt.name) ?? null,
            tagGroupColor: (Kt == null ? void 0 : Kt.color) ?? null
          } : Jt;
          vt((Jt) => ({
            items: Jt.items.map((Na) => gn.get(Na.id) ?? Xr(Na)),
            totalCount: ut.totalCount
          }));
          return;
        }
        const Ze = new Set(Y), $t = $n && dt.length > 0 && dt.every((ut) => Ze.has(ut)), jt = Gn.current, ur = (K.view.startFrom ?? "end") !== "beginning", va = (ut) => {
          const gn = ut.items.map((Ut) => Ut.id), zn = (jt == null ? void 0 : jt.page) === Number(le.page) && gn.some((Ut) => jt.ids.has(Ut));
          return ut.totalCount > 0 && Number(le.page) > 1 && (!gn.length || ur && !zn);
        }, mn = await An(K, le, !1, $t, (ut) => !va(ut));
        if (!Mr()) return;
        let Fn = mn.items.map((ut) => ut.id);
        if (va(mn)) {
          const ut = Math.max(1, Number(le.page) - 1), gn = { ...le, page: ut };
          ue(gn), Fn = (await An(
            K,
            gn,
            !1,
            $t
          )).items.map((Kt) => Kt.id), fn(
            (Kt) => new Set([...Kt].filter((Xr) => Fn.includes(Xr)))
          );
          const Ut = Fn.at(-1) ?? null;
          it(Ut), Yt.current || V(Ut);
        } else {
          fn(
            (gn) => new Set([...gn].filter((zn) => Fn.includes(zn)))
          );
          const ut = Ss(
            dt,
            Fn,
            It,
            Uo && Y.includes(It ?? -1)
          );
          it(ut), Yt.current && ut == null && an(!1), Yt.current || V(ut);
        }
      } catch (Ze) {
        Mr() && Sn(
          ($t) => `${$t ? `${$t} ` : ""}${Uo ? "The action completed, but " : ""}the queue could not be refreshed. ${Ze instanceof Error ? Ze.message : "Refresh failed."}`
        );
      } finally {
        Mr() && (Kn.current = !1, ar(!1), Et(""), yt.current && (yt.current = !1, lr(), un((Ze) => Ze + 1)));
      }
    },
    [
      oe,
      v,
      k,
      Ue,
      Be,
      An,
      le,
      V,
      _e,
      ge,
      ke,
      Te,
      K
    ]
  );
  function At() {
    var R;
    if (qn === "list") return 1;
    const b = (R = ha.current) == null ? void 0 : R.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Ct = I(() => {
  });
  Ct.current = (b) => {
    var ae;
    if (tt || b.defaultPrevented || b.repeat || yn(b) || b.ctrlKey || b.altKey || b.metaKey || en) return;
    const q = b.target, R = q instanceof Node && ((ae = Bn.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z) return;
    if (rr) {
      b.key === "Escape" && (ea(b), Nn(!1));
      return;
    }
    if (kt && b.key === "Escape") {
      ea(b), an(!1), V(mt.current);
      return;
    }
    if (!su(q)) return;
    const ne = iu(q);
    if (b.key === "Escape") {
      ea(b), te(() => /* @__PURE__ */ new Set()), q instanceof HTMLElement && q.closest(".dq-action-bar") && V(mt.current, !1);
      return;
    }
    if (!kt && b.key === " " && ne) {
      ea(b), Ke != null && te((Y) => co(Y, Ke));
      return;
    }
    if (!(Me || ke) && !kt && b.key === "Enter" && Ke != null && ne) {
      if (Ue !== "tag" && we) return;
      ea(b), Ue === "tag" ? window.open(`/tag/${Ke}`, "_blank", "noopener,noreferrer") : an(!0);
      return;
    }
  }, X(() => {
    const b = (q) => Ct.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const Tt = I(
    () => {
    }
  );
  Tt.current = (b) => {
    var ae;
    if (tt || en || kt || rr || Me || ke || !_e.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, R = q instanceof Node && ((ae = Bn.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!R && !z || !b.key.startsWith("Arrow") || !lu(q)) return;
    const ne = du(b.key, At());
    ne && (b.preventDefault(), R ? b.stopImmediatePropagation() : b.stopPropagation(), pe(ne));
  }, X(() => {
    const b = (q) => Tt.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []), X(() => {
    const b = () => {
      var R;
      const q = document.activeElement;
      !(q instanceof HTMLInputElement) || q.type !== "range" || !((R = Bn.current) != null && R.contains(q)) || Sr.current || q.closest('[role="dialog"], .dq-preview, .dq-drawer, [data-review-player-controls]') || (q.blur(), V(mt.current, !1));
    };
    return document.addEventListener("pointerup", b), () => document.removeEventListener("pointerup", b);
  }, [V]);
  const _t = (we == null ? void 0 : we.saving) === !0 || On, gt = Me || ke && !Z || _t, Zt = Xi();
  Yi({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!K && !tt && !en && !we && !kt && !rr && !Te && (ge.items.length > 0 || ke || Me),
    actions: (K == null ? void 0 : K.actions) ?? uc,
    onAction: (b, q) => {
      const R = K == null ? void 0 : K.actions[b];
      R && Fe(R, q);
    },
    onFind: () => Nn(!0),
    onSelectAll: () => te((b) => ou(b, _e))
  }), X(() => Nn(!1), [tt, kt, K == null ? void 0 : K.id]);
  function Rn(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", R = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = R != null && !k.some((ne) => ne.id === R);
    return Me || ke || !!Te || q && !oe || "effect" in b && q && (!v || z) || br(b) && (Be == null ? void 0 : Be.kind) !== "ready" || !A.length;
  }
  function Mn(b) {
    ht(null), Pt(0), Le(null), ce(b), ei(b, !!b && !K);
  }
  function cr() {
    Ie.current || (Zl() ? (Ie.current = !0, window.history.back()) : Mn(""));
  }
  function lr() {
    const b = Ie.current;
    Ie.current = !1;
    let q = dc();
    q && !qe.current && !G.current.some((z) => z.id === q) && (q = "", ei(""));
    const R = C.current;
    q !== R && (Pt(0), b || Le(null), !q && R && (ct.current ?? (ct.current = { reviewId: R }))), ce(q);
  }
  function nt() {
    ct.current = "heading", Le(null), cr();
  }
  function rt(b) {
    b !== S && Mn(b), Pt((q) => q + 1);
  }
  function zt() {
    Le(null), $e({
      review: ad("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Vt(b) {
    if (xt || !E) return;
    Le(null);
    const q = crypto.randomUUID();
    let R;
    const z = S;
    Nr(!0);
    try {
      if (!await wa((ae) => (R = Ns(
        ae.find((Y) => Y.id === b.id) ?? b,
        ae,
        q
      ), [...ae, R]))) throw new Error("Could not save reviews.");
      if (!ye.current) return;
      C.current !== z ? Le({ text: `Saved the copy “${R.name}”.`, alert: !1 }) : rt(R.id);
    } catch (ne) {
      Le({
        text: `“${b.name}” was not duplicated. ${Za(ne)}`,
        alert: !0
      });
    } finally {
      Nr(!1);
    }
  }
  async function dr() {
    if (!Ve || Ve.saving) return;
    const b = { ...Ve.review, name: Ve.review.name.trim() }, q = $a(b);
    if (q) {
      $e({ ...Ve, error: q });
      return;
    }
    $e({ ...Ve, saving: !0, error: "" });
    try {
      if (!await wa((R) => [...R, b]))
        throw new Error("Could not save reviews.");
      if (!ye.current) return;
      $e(null), rt(b.id);
    } catch (R) {
      $e(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (R instanceof Error ? R.message : "Retry saving.")
        }
      );
    }
  }
  async function Po() {
    if (!ot || ot.pending) return;
    const b = ot.review, q = rd(t, ee, Ne, We).map((ne) => ne.id), R = q.filter((ne) => ne !== b.id), z = R[Math.min(q.indexOf(b.id), R.length - 1)];
    Je({ review: b, pending: !0 });
    try {
      if (!await wa((ne) => ne.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      ct.current = b.id !== S && z ? { reviewId: z } : "heading", Le({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (ne) {
      Le({ text: `“${b.name}” was not deleted. ${Za(ne)}`, alert: !0 });
    } finally {
      Je(null);
    }
  }
  async function sd(b) {
    if (!(xt || !E)) {
      Le(null), Xn(!0);
      try {
        const q = await dp(b);
        let R = 0, z = 0;
        if (q.length && !await wa((ae) => {
          const Y = [...ae];
          R = z = 0;
          for (const Qe of q) {
            const Pe = Y.find((et) => et.id === Qe.id);
            if (!Pe) Y.push(Qe);
            else if (lo(Pe, !0) !== lo(Qe, !0) && // Imported before, its copy is listed already under its own id and name.
            !Y.some(
              (et) => et.id !== Qe.id && lo(et) === lo(Qe)
            ))
              Y.push(Ns(Qe, Y, crypto.randomUUID())), z++;
            else continue;
            R++;
          }
          return R ? Y : ae;
        }))
          throw new Error("Could not save reviews.");
        const ne = q.length - R;
        Le({
          alert: !1,
          text: q.length ? R ? `Imported ${R === 1 ? "1 review" : `${R} reviews`}` + (z ? ` (${z === 1 ? "1 as a copy" : `${z} as copies`} beside a listed version that differs)` : "") + "." + (ne === 1 ? " 1 review already in the list stays as it is." : ne ? ` ${ne} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Le({ alert: !0, text: `Could not import “${b.name}”. ${Za(q)}` });
      } finally {
        Xn(!1);
      }
    }
  }
  function Za(b) {
    return b instanceof Error ? b.message : "Try again.";
  }
  function ls(b) {
    const q = !E || xt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(qc, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void Vt(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Tc, { "aria-hidden": "true" }),
        onSelect: () => ts(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(Eo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Le(null), Je({ review: b, pending: !1 });
        }
      }
    ];
  }
  function ds(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(ia, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || Ft
      },
      ...ls(b),
      {
        label: "Recent changes…",
        icon: /* @__PURE__ */ a(Fa, { "aria-hidden": "true" }),
        separated: !0,
        onSelect: () => Zn(!0)
      },
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Ft,
        onSelect: nt
      }
    ];
  }
  async function wa(b) {
    if (!o) return !1;
    let q = [];
    const R = await yu(o, (Y) => {
      q = Y;
      const Qe = b(Y);
      return Qe === Y ? Y : Qe.map(Fh);
    });
    if (n(R), !ye.current) return !0;
    const z = C.current;
    z && !R.some((Y) => Y.id === z) && cr();
    const ne = q.find((Y) => Y.id === z), ae = R.find((Y) => Y.id === z);
    return ae && ne && ((ae.view.reviewMode ?? "single") !== (ne.view.reviewMode ?? "single") && ht(null), ae.view.displayMode !== ne.view.displayMode && Ar(cc(ae))), !0;
  }
  function Lo(b) {
    return wa((q) => Mh(q, b));
  }
  function cd(b) {
    return Lo(b).catch((q) => {
      throw C.current !== b.id && Do(b, q), q;
    });
  }
  function Do(b, q) {
    var z;
    if (!ye.current) return;
    const R = ((z = G.current.find((ne) => ne.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Le({ text: `“${R}” was not saved. ${Za(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(fc, { label: "Loading reviews…" });
  if (l)
    return /* @__PURE__ */ u(he, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void _h().catch(
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        pc,
        {
          message: l,
          onRetry: () => void Ya()
        }
      )
    ] });
  const _o = /* @__PURE__ */ u(he, { children: [
    H && /* @__PURE__ */ a("p", { className: "dq-status", children: H }),
    nn && (Be == null ? void 0 : Be.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Be.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Tr,
          onClick: () => {
            Ir(!0), pn(""), (tn ? Ru(xe) : Ou(xe)).then(Rr).catch(
              (b) => pn(
                `Could not create the ${tn ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => Ir(!1));
          },
          children: Tr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    nn && ((Be == null ? void 0 : Be.kind) === "incompatible" || Va) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Vn, {}),
      Va || (Be == null ? void 0 : Be.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Tr,
          onClick: () => {
            Ir(!0), Rr().finally(
              () => Ir(!1)
            );
          },
          children: Tr ? "Checking…" : "Check again"
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
    J && /* @__PURE__ */ u("p", { role: "alert", children: [
      J,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            L(""), D(!1);
          },
          children: F ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    Ye && (Ye.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
      Ye.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Ye.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Bn,
      className: `data-quality-page${Or ? " dq-page-fit" : ""}`,
      style: Or ? {
        "--dq-fit-top": `${Ja.top}px`,
        "--dq-fit-bottom": `${Ja.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Ye && !Ye.alert ? Ye.text : "" }),
        K && tt ? /* @__PURE__ */ a(
          bh,
          {
            review: fe ?? K,
            canWrite: pt ? y : $,
            canAssess: (Be == null ? void 0 : Be.kind) === "ready" && $,
            onBusy: ar,
            editRequest: Tn,
            onEditRequestHandled: () => Pt(0),
            undoRevision: er,
            onSaveDefaults: E ? cd : void 0,
            pageControls: {
              onBack: nt,
              moreItems: (b) => ds(fe ?? K, b),
              onGrid: de ? () => ht({ id: de.id, mode: "multiple" }) : void 0,
              notices: _o,
              busy: Ft
            },
            stayOnTap: qt,
            onStayOnTapChange: qr
          },
          K.id
        ) : K ? gd(K) : /* @__PURE__ */ a(
          qh,
          {
            reviews: t,
            counts: ee,
            sort: Ne,
            direction: We,
            onSortChange: (b) => ln({ sort: b }),
            onDirectionChange: (b) => ln({ direction: b }),
            storage: kh[_],
            canConfigure: E,
            busy: xt,
            headingRef: wn,
            notices: _o,
            onOpen: Mn,
            onNew: () => zt(),
            onImport: (b) => void sd(b),
            onExportAll: () => Rl(t, "data-quality-reviews.json"),
            onHistory: () => Zn(!0),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(ia, { "aria-hidden": "true" }),
                disabled: !E || xt,
                onSelect: () => rt(b.id)
              },
              ...ls(b)
            ]
          }
        ),
        kt && g && de && /* @__PURE__ */ a(
          Dh,
          {
            video: g,
            review: de,
            details: rh(g, de, Ce.ids),
            selectedCount: Dt.size,
            pending: Me,
            refreshing: ke || !!Te,
            error: Cr,
            canWrite: d,
            assessmentReady: (Be == null ? void 0 : Be.kind) === "ready",
            trees: sr,
            selected: Dt.has(g.id),
            hasPrevious: _e.indexOf(g.id) > 0,
            hasNext: _e.indexOf(g.id) >= 0 && _e.indexOf(g.id) < _e.length - 1,
            onToggleSelected: () => te((b) => co(b, g.id)),
            onPrevious: () => pe(-1),
            onNext: () => pe(1),
            onClose: () => {
              an(!1), V(mt.current);
            },
            onAction: Fe,
            findOpen: rr,
            onFindOpenChange: Nn
          }
        ),
        rr && K && !tt && !kt && /* @__PURE__ */ a(
          Zi,
          {
            actions: K.actions,
            tagGroups: k,
            trees: sr,
            isDisabled: Rn,
            onApply: (b, q) => {
              Nn(!1), Fe(b, q);
            },
            onClose: () => Nn(!1)
          }
        ),
        dn && /* @__PURE__ */ a(
          tf,
          {
            onClose: () => Zn(!1),
            onUndone: () => {
              tr((b) => b + 1), K && !tt && !Kn.current && An(K, le).catch(() => {
              });
            }
          }
        ),
        Ve && /* @__PURE__ */ a(
          Sh,
          {
            draft: Ve,
            onChange: (b) => $e((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void dr(),
            onCancel: () => $e(null)
          }
        ),
        /* @__PURE__ */ a(
          $d,
          {
            open: !!ot,
            title: "Delete review?",
            message: ot ? `“${ot.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ot == null ? void 0 : ot.pending) ?? !1,
            onConfirm: () => void Po(),
            onCancel: () => Je((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function eo(b, q, R = !1, z = !0) {
    const ne = mt.current, ae = Math.max(0, _e.indexOf(ne ?? -1));
    try {
      const Y = An(
        b,
        q,
        R,
        b.view.selectAllOnLoad === !0
      ), Qe = hn.current, Pe = await Y;
      if (Qe !== hn.current) return;
      const et = Pe.items.map((st) => st.id);
      fn(
        (st) => new Set([...st].filter((It) => et.includes(It)))
      );
      const dt = ws(et, ne, ae);
      it(dt), z && !Yt.current && V(dt, !1);
    } catch {
    }
  }
  function ld(b) {
    const q = Ee.current;
    if (Ee.current = null, gt || !K || !fe) return;
    const R = q ?? K.view.objectFilter, z = wr(
      R,
      fe.view.objectFilter
    ) ? fe.view.objectFilter : R, ne = Ht({ ...b, page: 1 }), ae = {
      ...K,
      view: {
        ...K.view,
        filter: ne,
        objectFilter: z
      }
    }, Y = !sc(ae, fe), Qe = Y ? ae : fe;
    ft(Y ? ae : null);
    const { page: Pe, ...et } = Ht(b), { page: dt, ...st } = Ht(Te ? Ae : le), It = !q && JSON.stringify(et) === JSON.stringify(st);
    on(Y || It ? "" : "Review queue defaults restored."), eo(Qe, ne, It || Qe.view.startFrom !== "beginning");
  }
  function dd() {
    if (Me || ke || _t || !fe) return;
    Ee.current = null;
    const b = Ht({
      ...fe.view.filter,
      page: 1
    });
    ft(null), on("Review queue defaults restored."), eo(
      fe,
      b,
      fe.view.startFrom !== "beginning",
      !1
    );
  }
  function ud() {
    if (Me || ke || Te || _t || !K || !En || !E)
      return;
    const b = K, q = En;
    za(!0), Lo(q).then((R) => {
      !R || C.current !== q.id || (ft(ic(q, b)), on("Queue saved to this review."));
    }).catch((R) => {
      C.current !== q.id ? Do(q, R) : Sn(R instanceof Error ? R.message : "Could not save queue.");
    }).finally(() => za(!1));
  }
  function jo() {
    if (!K || !fe || Kn.current || we || On) return;
    nr.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, _n.current = {
      temporaryReview: De,
      filter: le,
      loadedFilter: Ae,
      queue: ge,
      queueError: Te,
      retryFromEnd: ua,
      selectedIds: new Set(Dt),
      focusedId: Ke,
      pageCursor: Gn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...fe,
      view: { ...fe.view, startFrom: K.view.startFrom ?? "end" }
    });
    Nn(!1), an(!1), on(""), Sn(""), Bt({ draft: b, saving: !1, error: "" });
  }
  function us() {
    Bt(null), _n.current = null;
    const b = nr.current;
    nr.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : V(mt.current, !1);
    });
  }
  function fd() {
    var q;
    if (!we || we.saving) return;
    const b = _n.current;
    b && (hn.current += 1, (q = ir.current) == null || q.abort(), Ee.current = null, jn(!1), ft(b.temporaryReview), ue(b.filter), wt(b.loadedFilter), vt(b.queue), kr(b.queueError), fa(b.retryFromEnd), te(() => b.selectedIds), it(b.focusedId), Gn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), us();
  }
  async function pd() {
    if (!we || we.saving || !sn || !K) return;
    const b = K, q = { ...sn, name: sn.name.trim() }, R = $a(q);
    if (R) {
      Bt((z) => z && { ...z, error: R });
      return;
    }
    Bt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await Lo(q)) throw new Error("Could not save reviews.");
      if (!ye.current || C.current !== q.id) return;
      ft(ic(q, b)), ze(q) === "video" && Aa(q.id, {
        filter: le,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), on("Review saved."), us();
    } catch (z) {
      if (C.current !== q.id) {
        Do(q, z);
        return;
      }
      Bt(
        (ne) => ne && {
          ...ne,
          saving: !1,
          error: xc(z)
        }
      );
    }
  }
  function fs() {
    K && An(K, le, ua, $n).catch(() => {
    });
  }
  function hd() {
    fn(/* @__PURE__ */ new Set()), St.current.clear(), it(null);
  }
  function md(b) {
    !K || Me || _t || b === Number(le.page) || Rh(
      { ...le, page: b },
      K,
      (q, R) => An(q, R, !1, $n),
      hd
    );
  }
  function ps(b) {
    if (!de || !fe || Me || ke || _t) return;
    const q = Xl(de, b, fe.view.objectFilter), R = !sc(q, fe);
    ft(R ? q : null), R ? eo(q, { ...le, page: 1 }) : eo(
      fe,
      { ...le, page: 1 },
      fe.view.startFrom !== "beginning"
    );
  }
  function gd(b) {
    var Pe, et, dt, st, It;
    const q = Ue === "tag", R = q ? "tag" : "video", z = Math.max(1, Number(le.perPage) || 40), ne = Math.max(1, Math.ceil(ge.totalCount / z)), ae = Math.min(Math.max(1, Number(le.page) || 1), ne), Y = [
      oe ? "" : `${B} write permission is required to apply actions.`,
      q && x ? `Tag groups are unavailable. ${x}` : ""
    ].filter(Boolean), Qe = !!Cr && !kt;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            xl,
            {
              name: b.name,
              description: b.description,
              entityType: Ue,
              onBack: nt,
              backDisabled: Me || !!we || Ft,
              onEdit: we ? () => {
                var Ge;
                return (Ge = In.current) == null ? void 0 : Ge.focus();
              } : jo,
              editDisabled: !we && (Me || ke || Un || On || Ft || !E),
              editing: !!we,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: gt, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  Ca,
                  {
                    filter: Te ? Ae : le,
                    onFilterChange: ld,
                    totalCount: ge.totalCount,
                    sortOptions: q ? Rd : bc,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: qn,
                    zoomLevel: (Xt - 225) / 50,
                    onZoomChange: (Ge) => Ga(Math.round(225 + Ge * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Od : ko,
                    customFieldEntityType: Ue === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: Wa,
                    onObjectFilterChange: (Ge) => {
                      gt || (Ee.current = Ue === "video" ? Dl(
                        Ge,
                        pa,
                        b.view.objectFilter
                      ) : Ge);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(Pl, { page: ae, pages: ne, onPage: md })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(he, { children: [
                de && /* @__PURE__ */ a(
                  Ll,
                  {
                    mode: "multiple",
                    disabled: Me || ke || en || !!we || On || Ft,
                    onChange: () => ht({ id: de.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  Sp,
                  {
                    options: q ? Th : Ch,
                    value: qn,
                    onChange: (Ge) => Ar(lc(Ge, Ue))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                ns,
                {
                  disabled: Me || !!we,
                  items: ds(fe ?? b, {
                    onSelect: jo,
                    disabled: ke || Un || On || !E
                  })
                }
              ),
              queueDiffers: Z ? (De == null ? void 0 : De.id) === S : void 0,
              queueChange: !we && (De == null ? void 0 : De.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Qa ? ud : void 0,
                saveDisabled: Me || ke || !!Te || _t || !E,
                onReset: dd,
                resetDisabled: Me || ke || _t
              } : void 0,
              chipsAfter: (et = (Pe = de == null ? void 0 : de.presentation) == null ? void 0 : Pe.binParents) != null && et.length || (st = (dt = de == null ? void 0 : de.presentation) == null ? void 0 : dt.filterBins) != null && st.length ? /* @__PURE__ */ u(he, { children: [
                !!((It = de.presentation.binParents) != null && It.length) && /* @__PURE__ */ a(
                  ah,
                  {
                    videos: ge.items,
                    review: de,
                    savedObjectFilter: (fe ?? de).view.objectFilter,
                    trees: Ce.ids,
                    disabled: Me || ke || _t,
                    onToggle: ps
                  }
                ),
                /* @__PURE__ */ a(
                  oh,
                  {
                    review: de,
                    savedObjectFilter: (fe ?? de).view.objectFilter,
                    queueFilter: le,
                    queueCount: ke || Te ? null : ge.totalCount,
                    disabled: Me || ke || _t,
                    countsPaused: Me || ke || _t || !Z,
                    onToggle: ps
                  }
                )
              ] }) : void 0,
              chipsEnd: we ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          _o,
          de && Ce.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: Ce.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            we && sn && /* @__PURE__ */ a(
              Fl,
              {
                drawerRef: In,
                draft: sn,
                onChange: (Ge) => Bt((bt) => bt && { ...bt, draft: Ge }),
                direction: we.draft.view.startFrom ?? "end",
                onDirectionChange: (Ge) => Bt(
                  (bt) => bt && {
                    ...bt,
                    draft: { ...bt.draft, view: { ...bt.draft.view, startFrom: Ge } }
                  }
                ),
                tagGroups: k,
                trees: sr,
                saving: we.saving,
                saveDisabled: ke || !!Te,
                error: we.error,
                dirty: ya,
                criteriaChanged: Qa,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Te && !ke ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Te,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: fs, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void pd(),
                onCancel: fd
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${ga}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ke && !ge.items.length && /* @__PURE__ */ a(fc, { label: "Loading review queue…" }),
                    Te && !ke && /* @__PURE__ */ a(
                      pc,
                      {
                        message: Te,
                        retryLabel: Un ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Un && fe && ze(fe) === "video") {
                            const Ge = Ur(fe);
                            Aa(fe.id, { ...Ge, filter: { ...Ge.filter, page: void 0 } }), un((bt) => bt + 1);
                            return;
                          }
                          fs();
                        }
                      }
                    ),
                    !Me && !ke && !Te && !ge.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(Ao, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        R,
                        "s match this review."
                      ] })
                    ] }),
                    !!ge.items.length && /* @__PURE__ */ a("div", { ref: ha, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: qn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Xt}px` },
                        children: ge.items.map(bd)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Jr, children: /* @__PURE__ */ a(
                    kl,
                    {
                      actions: we ? we.draft.actions : b.actions,
                      tagGroups: k,
                      trees: sr,
                      isDisabled: Rn,
                      paused: !!we,
                      busy: Me || ke,
                      onApply: (Ge) => void Fe(Ge),
                      onFind: () => Nn(!0),
                      status: Me ? `Applying action to ${Fo}…` : "",
                      summary: /* @__PURE__ */ u(he, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Dt.size ? `${Dt.size} selected` : Ke == null ? "Nothing to apply to" : `Applies to the focused ${R}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !_e.length || U,
                            onClick: () => te((Ge) => /* @__PURE__ */ new Set([...Ge, ..._e])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Rt, { binding: Zt.selectAll, hidden: !0 })
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
                            onClick: () => te(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Rt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: Y.length ? Y.join(" ") : void 0,
                      keyHints: q ? we ? "Arrows move · Space selects · Enter opens" : "Arrows move · Space selects · Enter opens · Shift + key stays" : we ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: Qe || or ? /* @__PURE__ */ u(he, { children: [
                        Qe && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Vn, { "aria-hidden": "true" }),
                          Cr
                        ] }),
                        or && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: or })
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
  function bd(b) {
    var R, z, ne;
    if (Ue === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        xh,
        {
          tag: ae,
          displayMode: qn === "list" ? "list" : "grid",
          focused: ae.id === Ke,
          selected: Dt.has(ae.id),
          setRef: (Y) => {
            Y ? $r.current.set(ae.id, Y) : $r.current.delete(ae.id);
          },
          onFocus: () => it(ae.id),
          onToggle: () => {
            te((Y) => co(Y, ae.id)), V(ae.id, !1);
          },
          onOpen: () => window.open(`/tag/${ae.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ae.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      Ph,
      {
        video: Wl(q, de, Ce.ids),
        showTagBins: ((z = (R = de == null ? void 0 : de.presentation) == null ? void 0 : R.annotations) == null ? void 0 : z.includes("tags")) && !!((ne = de.presentation.annotationParents) != null && ne.length),
        displayMode: qn,
        cardsScroll: ma,
        focused: q.id === Ke,
        selected: Dt.has(q.id),
        setRef: (ae) => {
          ae ? $r.current.set(q.id, ae) : $r.current.delete(q.id);
        },
        onFocus: () => it(q.id),
        onToggle: () => te((ae) => co(ae, q.id)),
        onPreview: () => {
          we || (it(q.id), an(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Rh(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function co(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Mh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Fh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function lo(e, t = !1) {
  const { id: n, name: r, ...o } = e;
  return JSON.stringify(
    t ? { ...o, id: n, name: r } : o,
    (i, s) => s && typeof s == "object" && !Array.isArray(s) ? Object.fromEntries(Object.entries(s).sort(([c], [l]) => c < l ? -1 : c > l ? 1 : 0)) : s
  );
}
function xh({
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
  const f = I(null), d = Cn(
    (p) => {
      f.current = p, o(p);
    },
    [o]
  );
  return Mt(() => {
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
        Md,
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
function Ph({
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
  const p = od(e), h = I(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(m.date || m.studioName), N = !!(m.performers.length || m.tags.length);
  return Mt(() => {
    const k = h.current;
    if (!k) return;
    const M = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), x = k.querySelector(".card-title"), O = `dq-card-title-${e.id}`;
    x && (x.id = O), M && (M.target = "_blank", M.rel = "noreferrer", M.removeAttribute("aria-label"), M.setAttribute("aria-labelledby", O), M.classList.add("dq-card-link"));
    const E = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    E && E.setAttribute(
      "aria-label",
      i ? `Deselect ${p}` : `Select ${p}`
    );
    const P = k.querySelector(
      'button[title="Quick View"]'
    );
    P && P.setAttribute("aria-label", `Preview ${p}`);
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
          Fd,
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
          (v = e.tags) == null ? void 0 : v.map((k) => /* @__PURE__ */ a("span", { children: k.name }, k.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Lh, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Lh({ video: e, cardsScroll: t }) {
  const n = I(null), r = I(null), [o, i] = T(!1), [s, c] = T(!1), [l, f] = T(!1);
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
    return me(Iu(e.id), {
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
      src: Tu(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Dh({
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
  findOpen: k,
  onFindOpenChange: M
}) {
  const x = I(null), O = Ka(), E = I(null), P = I(null), _ = e.files[0], re = od(e), H = (D) => o || i || "steps" in D && D.steps.length > 0 && !c || br(D) && !l;
  Yi({
    surface: "overlay",
    enabled: !k,
    actions: t.actions,
    onAction: (D, Z) => {
      const Q = t.actions[D];
      Q && w(Q, Z);
    },
    onFind: () => M(!0)
  }), X(() => {
    var Z;
    const D = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Z = x.current) == null || Z.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = D;
    };
  }, []);
  function j(D) {
    var ie, W, S;
    if (D.key !== "Tab") return;
    const Z = [
      ...((ie = x.current) == null ? void 0 : ie.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ce) => ce.offsetParent !== null);
    if (!Z.length) {
      D.preventDefault(), (W = x.current) == null || W.focus();
      return;
    }
    const Q = Z.indexOf(
      document.activeElement
    );
    D.shiftKey && Q <= 0 ? (D.preventDefault(), (S = Z.at(-1)) == null || S.focus()) : !D.shiftKey && Q === Z.length - 1 && (D.preventDefault(), Z[0].focus());
  }
  function J(D) {
    if (k || D.defaultPrevented || D.ctrlKey || D.metaKey || D.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Z = D.key === "ArrowLeft" || D.key === "ArrowRight";
    if (D.altKey && !Z) return;
    const Q = E.current, ie = D.currentTarget.querySelector("video");
    if (D.key === "Enter" || D.key === "Escape")
      D.repeat || v();
    else if (D.key === " " && Q)
      D.repeat || Q.toggle();
    else if (Z && Q)
      Q.seekBy(
        (D.key === "ArrowLeft" ? -1 : 1) * (D.shiftKey ? 5 : D.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(D.key) && Q) {
      const W = P.current;
      if (!D.repeat && (W == null ? void 0 : W.videoId) === e.id) {
        const S = [_ == null ? void 0 : _.duration, ie == null ? void 0 : ie.duration].find(
          (se) => se != null && Number.isFinite(se) && se > 0
        ) ?? 0, ce = e.parentVideoId != null, C = ce ? e.clipStartSec ?? 0 : 0, ee = (ce ? e.clipEndSec ?? S : S) - C;
        Number.isFinite(ee) && ee > 0 && Number.isFinite(W.time) && Q.seekBy(C + ee * Number(D.key) / 10 - W.time);
      }
    } else if (D.key === "ArrowUp" || D.key === "ArrowDown")
      !D.repeat && !o && !i && (D.key === "ArrowUp" && p && y(), D.key === "ArrowDown" && h && N());
    else return;
    ea(D);
  }
  function L(D) {
    const Z = x.current, Q = D.target instanceof Element ? D.target.closest("button, a[href]") : null;
    !Z || !Q || !Z.contains(Q) || Q.closest(".dq-player, .dq-find-action") || D.detail === 0 || Z.focus({ preventScroll: !0 });
  }
  X(() => {
    if (k) return;
    let D = 0;
    const Z = requestAnimationFrame(() => {
      D = requestAnimationFrame(() => {
        var ie;
        const Q = document.activeElement;
        (ie = x.current) != null && ie.isConnected && (!Q || Q === document.body || Q === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Z), cancelAnimationFrame(D);
    };
  }, [k, o, i, h, p, e.id, O]);
  const F = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: x,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
      className: `dq-preview${O ? " dq-preview-mobile" : ""}`,
      onKeyDown: j,
      onKeyDownCapture: J,
      onMouseDown: (D) => {
        D.target === D.currentTarget && v();
      },
      onClick: L,
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
                  /* @__PURE__ */ a(La, { "aria-hidden": "true" }),
                  !O && /* @__PURE__ */ a(Rt, { binding: "↑", hidden: !0 })
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
                  !O && /* @__PURE__ */ a(Rt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ac, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: re }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((D) => /* @__PURE__ */ a("li", { children: D.name }, D.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Actions apply to ",
                F
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
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: d && /* @__PURE__ */ a(ca, {}) }),
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
                children: /* @__PURE__ */ a(Cc, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(sa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: _ ? /* @__PURE__ */ a(
            yc,
            {
              autostart: !0,
              streamUrl: ai("video", e.id),
              posterUrl: Es(e),
              format: _.format,
              audioCodec: _.audioCodec,
              duration: _.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (D) => {
                P.current = { videoId: e.id, time: D };
              },
              onPlaybackControlRegister: (D) => (E.current = D, () => {
                E.current === D && (E.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: Es(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !O && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            kl,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: H,
              busy: o || i,
              onApply: (D) => void w(D),
              onFind: () => M(!0),
              status: o ? `Applying action to ${F}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ a(
          Zi,
          {
            actions: t.actions,
            trees: f,
            isDisabled: H,
            onApply: (D, Z) => {
              M(!1), w(D, Z);
            },
            onClose: () => M(!1)
          }
        )
      ]
    }
  );
}
async function _h() {
  const e = await me("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function fc({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(zd, { className: "dq-spin" }),
    e
  ] });
}
function pc({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Vn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Jh = { components: { DataQualityPage: Oh } };
export {
  Oh as DataQualityPage,
  Jh as default,
  wr as objectFiltersEqual
};
