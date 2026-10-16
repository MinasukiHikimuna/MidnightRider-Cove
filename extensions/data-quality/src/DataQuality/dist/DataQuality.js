import { jsxs as u, Fragment as pe, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as R, useEffect as ee, useLayoutEffect as qt, useMemo as ve, useCallback as vn, useSyncExternalStore as zi, useId as tt, createContext as Ml, useContext as Fl, Fragment as Hi } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as Qn, SortableList as As, TagBadge as Pl, EntityReferenceSelector as Lo, EntityDetailTabs as Ll, FilterDialog as Cs, VIDEO_CRITERIA as Qa, DetailListToolbar as da, PERFORMER_CRITERIA as Ji, AUDIO_CRITERIA as Ts, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as Is, AudioPlayer as jl, VideoPlayer as Rs, formatDuration as $s, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as ma, Flag as On, Check as Vr, Pencil as Kr, Ban as Ba, ChevronDown as Qi, Plus as ga, Pin as Os, GripVertical as Ms, AlertTriangle as Rn, Copy as Fs, Trash2 as Wa, X as ba, Mic as Hl, Users as xs, Tag as Ps, Headphones as Ls, Film as Ya, ChevronLeft as ya, MoreHorizontal as Jl, RectangleHorizontal as Ql, LayoutGrid as Wi, ChevronRight as Ds, Save as Wl, RotateCcw as Yl, Layers as Do, Undo2 as Xl, RefreshCw as Zl, ExternalLink as _s, SkipForward as ed, Upload as td, Download as js, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
import { extensionFetch as sd } from "@cove/runtime/api";
import { createPortal as cd } from "react-dom";
const Yi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Xi = Object.keys(
  Yi
);
function ua(e) {
  return e === "excludes" || e === "excludesAll";
}
function Zi(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Us(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function ld(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...i } = e, o = [];
  for (const s of t)
    o.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || o.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return o.length ? { ...i, performerFlags: o } : i;
}
const Bs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function Ie(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function eo(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function _e(e) {
  return eo(Pe(e));
}
function dd(e) {
  return Pe(e) === "video";
}
function Pe(e) {
  return e.entityType ?? "video";
}
const zn = [
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
], Xa = [
  zn.slice(0, 11),
  zn.slice(11, 22),
  zn.slice(22)
];
function ca(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function fa(e) {
  return ca(e) ?? e.toLocaleUpperCase();
}
const Hn = "none";
function wr(e) {
  return typeof e == "string" && zn.includes(e);
}
function to(e) {
  const t = e.shortcut;
  return wr(t) || t === Hn ? t : "auto";
}
function Ks(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = to(s);
    if (d !== Hn) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, c), t[c] = d;
          return;
        }
        r.add(c);
      }
      i.push(c);
    }
  });
  const o = zn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = Ks(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (wr(n)) {
    const c = i.get(n), d = r[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(wr));
  return e.map((c, d) => {
    const f = o.has(d) ? o.get(d) : wr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: l, ...h } = c;
    return f === void 0 ? h : { ...h, shortcut: f };
  });
}
function pa(e) {
  var n;
  return Ie(e) && !Vs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Pe(e) !== "tag" && e.actions.some(
    (r) => no(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Mn(r, Pe(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
  video: 1e3,
  audio: 250
};
function Vt(e, t = "video") {
  const n = (r, i) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : i;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(fd[t], n(e.perPage, 40))
    )
  };
}
function _o(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Vn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Ie(e) ? [e.entityType, ...r, e.occurrence] : Pe(e) === "video" ? r : [Pe(e), ...r]
  );
}
function Mn(e, t) {
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
  ) && !no(e) : !1;
}
function pd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function $n(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Yn(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Gs(e) {
  return "steps" in e && e.steps.length > 0;
}
function Jn(e) {
  return "steps" in e ? e.steps.some((t) => $n(t.mode)) : !1;
}
function no(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if ($n(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function wa(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Bs.includes(n.entityType)) && (!pd(n.entityType) || Vs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && hd(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Mn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Mn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => pa(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function hd(e, t) {
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
function Ei(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const i of r)
      n.has(i.id) || (n.add(i.id), t.push(i));
  return t;
}
function md(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), s = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(d))) return d;
  }
}
function gd(e, t, n) {
  return { ...structuredClone(e), id: n, name: md(e.name, t) };
}
function Vs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((i) => Number.isSafeInteger(i) && i > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Xi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || bd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function bd(e) {
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
function jo(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Uo(e, t, n, r) {
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
function yd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((i) => n.has(i));
  for (const i of t)
    r ? n.delete(i) : n.add(i);
  return n;
}
function wd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function nn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function vd(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function Nd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function qd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function Sd(e, t) {
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
const zs = "ext:com.midnightrider.data-quality:configuration", kd = "ext:cove-data-quality:video-reviews", Ai = "ext:com.midnightrider.data-quality:progress";
class Hs extends Error {
}
const va = /* @__PURE__ */ new Map(), Ma = /* @__PURE__ */ new Map(), gr = (e, t) => e.includes("*") || e.includes(t), Ka = (e) => be(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ci(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Lr(e) {
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
    reviews: wa(JSON.stringify(t.reviews)),
    deletedIds: Ci(t.deletedIds),
    importedIds: Ci(t.importedIds)
  };
}
function Ad(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const i of t) {
    const o = localStorage.getItem(i);
    if (o !== null) {
      const s = wa(o);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    Ci(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function Js(e) {
  const t = await be("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ro(e, t) {
  const n = (Ma.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ma.set(e, n), n.finally(() => {
    Ma.get(e) === n && Ma.delete(e);
  }).catch(() => {
  }), n;
}
let ia = null;
function Cd() {
  if (ia) return ia;
  const e = Td();
  return ia = e, e.finally(() => {
    ia === e && (ia = null);
  }).catch(() => {
  }), e;
}
async function Td() {
  const e = await be("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return ro(t, () => Id(e, t));
}
async function Id(e, t) {
  var p;
  const n = String(e.user.id), r = gr(e.permissions, "savedfilters.read"), i = r && gr(e.permissions, "savedfilters.write"), o = r ? (await Ka(zs)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
  if (o.length > 1) {
    const m = (y) => {
      const { revision: N, ...v } = Lr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (o.some((y) => m(y) !== m(o[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (i)
      for (const y of o.slice(1))
        await be(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    o.splice(1);
  }
  let s = o.length ? Lr(o[0].uiOptions) : Ed();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (s = Lr(d));
  let l = !o.length;
  if (o.length && f && d) {
    const m = Lr(d);
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
      reviews: Ei(s.reviews, m.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...m.importedIds])
      ]
    }, l = !0;
  }
  if (!c) {
    const m = JSON.stringify(s), y = Ad(n);
    if (o.length && y.reviews.some((k) => {
      const O = s.reviews.find((F) => F.id === k.id);
      return O && JSON.stringify(O) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Ka(kd)).flatMap(
      (k) => wa(k.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (k) => !y.reviews.some((O) => O.id === k)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Ei(
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
    }, l || (l = JSON.stringify(s) !== m);
  }
  const h = {
    userId: n,
    recordId: (p = o[0]) == null ? void 0 : p.id,
    config: s,
    readable: r,
    writable: i,
    durable: i
  };
  if (va.set(t, h), l && i) {
    const m = s;
    o.length && (h.config = Lr(o[0].uiOptions)), await Qs(t, m), s = h.config;
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
    canWrite: gr(e.permissions, "videos.write"),
    canWriteVideos: gr(e.permissions, "videos.write"),
    canWriteAudios: gr(e.permissions, "audios.write"),
    canWriteTags: gr(e.permissions, "tags.write"),
    canReadTagGroups: gr(e.permissions, "taggroups.read"),
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Qs(e, t) {
  const n = va.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Js(n), n.recordId != null) {
      const o = await be(
        `/api/savedfilters/${n.recordId}`
      );
      if (Lr(o.uiOptions).revision !== n.config.revision)
        throw new Hs(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await be(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: zs,
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
function Rd(e, t) {
  return ro(e, async () => {
    const n = va.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, i = t(r);
    if (i === r) return r;
    wa(JSON.stringify(i));
    const o = r.filter((s) => !i.some((c) => c.id === s.id)).map((s) => s.id);
    return await Qs(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((s) => !i.some((c) => c.id === s))
    }), i;
  });
}
function Bo(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function $d(e, t) {
  const n = va.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Bo(r) : null;
  if (!n.readable) return i;
  const o = (await Ka(Ai)).find(
    (c) => c.name === t
  ), s = o ? Bo(o.uiOptions) : null;
  return i && (!s || i.updatedAt > s.updatedAt) ? i : s;
}
function Od(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return ro(r, async () => {
    const i = va.get(e);
    if (!(i != null && i.writable)) return;
    await Js(i);
    const o = (await Ka(Ai)).find(
      (s) => s.name === t
    );
    await be(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ai,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Xn(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function qn(e) {
  return Md[e];
}
const Ga = "confirmed_absent_tags", ao = "Confirmed absent tags", Za = "confirmed_absent_occurrence_tags", Ws = {
  key: Ga,
  label: ao,
  type: "tag",
  subject: "tag assessments"
}, io = {
  key: Za,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, Fd = {
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
function Fn(e) {
  return Array.isArray(e) ? e.map(Fn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Ga,
        Za
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Fn(n)
    ])
  ) : e;
}
async function Ys(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await sd(e, { ...t, headers: r });
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
async function be(e, t = {}) {
  return await Ys(e, t, "fail");
}
function xd(e, t = {}) {
  return Ys(e, t, "null");
}
const Pd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ld = 0;
function Va(e, t) {
  return be(
    `/api/${Xn(e)}/${t}?dqRead=${Pd}-${++Ld}`,
    { cache: "no-store" }
  );
}
function Xs(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Fn({
      findFilter: Vt(t, _e(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function _r(e, t, n) {
  return be(
    `/api/${Xn(_e(e))}/find`,
    { method: "POST", signal: n, body: Xs(e, t) }
  );
}
async function Zs(e, t, n) {
  return (await be(
    `/api/${Xn(_e(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Xs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function pi(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, be("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Fn({
        findFilter: Vt(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return be("/api/taggroups", { signal: e });
}
function Ti(e, t, n = 1280) {
  return `/api/${Xn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Ii(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Ko(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function _d(e) {
  return `/api/stream/video/${e}/preview`;
}
function jd(e) {
  return `/api/stream/video/${e}/preview/status`;
}
async function ei(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await be(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await be("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Fn({
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
async function oo(e, t) {
  const n = Yn(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ei(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Ud(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function so(e, t) {
  const r = (await be("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Ud(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${qn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function ec(e, t) {
  const n = await so(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await be(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await be("/api/custom-fields", {
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
function tc(e = "video") {
  return so(Ws, e);
}
function Bd(e = "video") {
  return ec(Ws, e);
}
function nc(e = "video") {
  return so(io, e);
}
function Kd(e = "video") {
  return ec(io, e);
}
function za(e) {
  return [...new Set(e)];
}
function rc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === Za
  ), i = r === void 0 ? [] : n[r];
  return za(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Gd(e) {
  let t;
  try {
    t = await nc(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${io.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Vd(e, t, n, r, i, o) {
  await be(`/api/${Xn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: za(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function zd(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${ao} custom field is not available.`
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
async function ac(e, t, n) {
  if (!Mn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${qn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (Jn(t)) {
    let d;
    try {
      d = await tc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${ao} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const i = za(n), o = (await oo(t)).map((d) => ({
    mode: d.mode,
    tagIds: za(d.tagIds)
  })), c = [
    ...o.filter((d) => !$n(d.mode)),
    ...o.filter((d) => $n(d.mode))
  ].map(
    (d) => zd(d, i, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await be(`/api/${Xn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${qn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Hd(e, t) {
  if (!Mn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await be("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Fa = (e) => e >= "0" && e <= "9";
function Go(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Vo(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if (Fa(e[n]) && Fa(t[r])) {
      const c = n, d = r;
      for (; n < e.length && Fa(e[n]); ) n++;
      for (; r < t.length && Fa(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), l = t.slice(d, r).replace(/^0+/, "");
      if (f.length !== l.length) return f.length < l.length ? -1 : 1;
      if (f !== l) return f < l ? -1 : 1;
      continue;
    }
    const o = Go(e[n]), s = Go(t[r]);
    if (o !== s) return o < s ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function ic(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Vo(e.tagGroupName, t.tagGroupName) || Vo(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function vr(e) {
  return [...e].sort(ic);
}
const Ri = /* @__PURE__ */ new Map();
function Jd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function co(e, t, n) {
  const r = Yn(e), i = [], o = [];
  for (const p of e.steps) {
    if (p.mode !== "REMOVE_TREE") {
      o.push(p);
      continue;
    }
    const m = p.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: m.filter((y) => !r.has(y)) });
  }
  const s = [
    ...o.filter((p) => !$n(p.mode)),
    ...o.filter((p) => $n(p.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const p of s)
    for (const m of p.tagIds)
      switch (p.mode) {
        case "ADD":
          c.add(m);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(m);
          break;
        case "MARK_PRESENT":
          c.add(m), d.delete(m);
          break;
        case "MARK_ABSENT":
          c.delete(m), d.add(m);
          break;
        case "CLEAR_ABSENCE":
          d.delete(m);
          break;
      }
  const f = new Set(t.ids), l = new Set(t.absent), h = [...new Set(e.steps.flatMap((p) => p.tagIds))];
  return {
    added: h.filter((p) => c.has(p) && !f.has(p)),
    removed: [...f].filter((p) => !c.has(p)),
    markedAbsent: h.filter((p) => d.has(p) && !l.has(p)),
    absenceCleared: [...l].filter((p) => !d.has(p)),
    unresolvedTrees: [...new Set(i)]
  };
}
function Qd(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return vr(t);
}
function oc(e) {
  return sc(Jd(e));
}
function sc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return ee(() => (o.current = !0, () => {
    o.current = !1;
  }), []), ee(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), ei([c]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function gt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function qr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = gt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function zo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => gt(t.group) !== "");
}
function cc(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function lc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function dc(e) {
  return Yn(e).size > 0 || lc(e).size > 0;
}
function Wd(e) {
  return qr(e).filter(
    (t) => !t.actions.some((n) => dc(e[n]))
  );
}
function $i(e, t) {
  const n = cc(t), r = new Set(t.absent);
  return qr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...Yn(e[c])], f = [...lc(e[c])], l = [
        ...d.map((h) => n.has(h)),
        ...f.map((h) => r.has(h))
      ];
      l.some(Boolean) && (s.push(c), l.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function Oi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Yd(e, t, n) {
  const r = { ids: [...cc(t)], absent: t.absent }, i = co(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !o.has(c)), ...i.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...i.markedAbsent]
  };
}
const jr = "review";
function Xd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Zd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function br(e, t) {
  const n = new Set(Xd(e));
  return t.filter((r) => n.has(r.id));
}
function Ho(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of br(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const d = c.categoryTagId === void 0 ? i(jr, () => ({
        key: jr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: l, resolved: h } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: l,
          flags: [],
          mixed: [],
          ...h ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(s.name) || d.flags.push(s.name);
    }
  const o = [...r.values()];
  return [
    ...o.filter((s) => s.key === jr),
    ...o.filter((s) => s.key !== jr)
  ];
}
function Mi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function lo(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Mi(s.key, s.members, i) && !(c > o && Mi(i.key, i.members, s))
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
function eu(e, t) {
  return t.filter(
    (n) => n.key === e.key || Mi(n.key, n.tagIds ?? [], e)
  );
}
function uc(...e) {
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
    ...n.filter((r) => r.key === jr),
    ...n.filter((r) => r.key !== jr)
  ];
}
function tu(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const i of r.tagIds)
        for (const o of r.mode === "REMOVE_TREE" ? t.get(i) ?? [i] : [i])
          n.add(o);
  return n;
}
function fc(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = tu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function nu(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => fc(i, r, n))
  );
}
function ru(e, t, n) {
  return t.filter((r) => r.tagIds !== null && fc(e, r, n));
}
function au(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function uo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [au(e.mixed)] : []
  ];
}
function iu(e) {
  const t = uo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function ou(e, t, n) {
  const r = br(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Fi = "-", Jo = "Ctrl+a", su = "Ctrl/⌘A", cu = ["f", "g", "k", "n", "m", ",", "."], hi = "Shift+", pc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, lu = new Set(Object.values(pc).flat()), Qo = { Comma: ",", Period: "." };
function du(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(Qo, t.code) ? Qo[t.code] : void 0;
}
function zr(e) {
  return ve(() => Ks(e), [e]);
}
function fo({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = zr(n), c = R({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  qt(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, l = zn.filter(
    (p) => s.actionOn.has(p) || cu.includes(p)
  ).join(" "), h = ve(() => {
    const p = (N, v) => {
      var k, O;
      const w = c.current;
      if (N === Jo) (k = w.onSelectAll) == null || k.call(w);
      else if (N === Fi) (O = w.onFind) == null || O.call(w);
      else {
        const F = lu.has(N), B = F || N.startsWith(hi), C = F ? du(v) : B ? N.slice(hi.length) : N, L = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        L !== void 0 && w.onAction(L, B);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || p((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Jo, "local")), d && y.push(m(Fi));
    for (const N of l ? l.split(" ") : []) {
      const v = pc[N];
      y.push(m(N), ...(v ?? [`${hi}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, l, d, f]);
  xl(h, t);
}
const uu = {
  find: Fi,
  selectAll: su
};
function po() {
  return uu;
}
const fu = 600 * 1e3, ho = /* @__PURE__ */ new Map(), hc = /* @__PURE__ */ new Map(), Gn = /* @__PURE__ */ new Map();
function mc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = hc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function gc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && hc.set(e.tagGroupId, e.tagGroupSortOrder), ho.set(e.id, { tag: e, at: Date.now() });
}
function bc(e) {
  const t = ho.get(e);
  if (!(!t || Date.now() - t.at > fu))
    return mc(t.tag);
}
function yc(e) {
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
function xi(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && gc(yc({ ...n, name: r }));
  }
}
function pu(e) {
  const t = Gn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: be(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var l, h;
        const o = ((l = i == null ? void 0 : i.name) == null ? void 0 : l.trim()) || null;
        if (Gn.get(e) === r && Gn.delete(e), !o) return null;
        const s = yc({ ...i, id: e, name: o }), c = (h = ho.get(e)) == null ? void 0 : h.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return gc(f), mc(f);
      },
      () => (Gn.get(e) === r && Gn.delete(e), null)
    )
  };
  return Gn.set(e, r), r;
}
function Wo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function mi(e) {
  const t = {};
  for (const n of e) {
    const r = bc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function hu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Wo());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = bc(i);
    if (o !== void 0) n[i] = o;
    else {
      const s = pu(i);
      s.waiters += 1, r.push({ id: i, entry: s });
    }
  }
  return r.length ? new Promise((i, o) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: l } of r)
        l.waiters -= 1, l.waiters === 0 && Gn.get(f) === l && (Gn.delete(f), l.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(Wo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: l }) => l.promise.then((h) => [f, h])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [l, h] of f) n[l] = h;
        i(n);
      }
    });
  }) : Promise.resolve(n);
}
function wc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function Na(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: mi(gi(t))
  }));
  return ee(() => {
    const i = gi(t), o = mi(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return hu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : mi(gi(t));
}
function Hr(e) {
  const t = Na(e);
  return ve(() => wc(t), [t]);
}
function gi(e) {
  return e ? e.split(",").map(Number) : [];
}
const mu = "(max-width: 760px)";
function vc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = vn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return zi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function qa() {
  return vc(mu);
}
function gu(e, t, n = !1) {
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
function kr(e, t, n = [], r) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const c = n.find((d) => d.id === s.tagGroupId);
    return [
      {
        text: c ? `Assign ${c.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = Yn(e), o = (s) => i.has(s) || [...i].some((c) => {
    var d;
    return (d = r == null ? void 0 : r.get(s)) == null ? void 0 : d.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => gu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && o(c)
      )
    )
  );
}
function ti(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function mo({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = qa(), [f, l] = T(""), [h, p] = T(0), m = R(null), y = R(null), N = R(null), v = R(null), w = R(null), k = R(/* @__PURE__ */ new Set()), O = tt(), F = Hr(ve(() => ti(e), [e])), B = zr(e), C = ve(() => {
    const _ = f.trim().toLocaleLowerCase(), V = (M) => M ? zn.indexOf(M) : zn.length;
    return e.map((M, D) => ({ action: M, index: D, key: B.keys[D] })).sort((M, D) => V(M.key) - V(D.key)).filter((M) => !_ || M.action.label.toLocaleLowerCase().includes(_));
  }, [e, B, f]), L = C.length ? Math.min(h, C.length - 1) : -1, x = (_) => `${O}-option-${_}`;
  qt(() => {
    var _, V, M;
    return v.current = document.activeElement, w.current = ((V = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = m.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var _, V, M;
    L < 0 || (M = (V = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${x(C[L].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [L, C]);
  function ae(_, V) {
    !_ || r != null && r(_.action) || s(_.action, i && V);
  }
  function Q(_) {
    var M;
    _.stopPropagation();
    const V = _.code || _.key;
    if (_.repeat || k.current.add(V), !nn(_)) {
      if (_.repeat && !k.current.has(V)) {
        _.preventDefault();
        return;
      }
      if (_.key === "Escape")
        _.preventDefault(), _.repeat || c();
      else if (_.key === "Enter")
        _.preventDefault(), _.repeat || ae(C[L], _.shiftKey);
      else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
        if (_.preventDefault(), !C.length) return;
        const D = _.key === "ArrowDown" ? 1 : -1;
        p((L + D + C.length) % C.length);
      } else _.key === "Tab" && (_.preventDefault(), (M = m.current) == null || M.focus());
    }
  }
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ u(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: Q,
        onMouseDown: (_) => {
          _.target !== m.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: m,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${O}-list`,
                "aria-activedescendant": L >= 0 ? x(C[L].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (_) => {
                  l(_.target.value), p(0);
                }
              }
            ),
            !d && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          C.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${O}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: C.map((_, V) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: x(_.index),
                  tabIndex: -1,
                  "aria-selected": V === L,
                  disabled: (r == null ? void 0 : r(_.action)) ?? !1,
                  onClick: (M) => ae(_, M.shiftKey || o && Gs(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ u(pe, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ca(_.key) ? !0 : void 0, children: _.key }),
                      ca(_.key) && /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ca(_.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: kr(_.action, F, t, n).map(
                      (M, D) => /* @__PURE__ */ a("span", { "data-effect-tone": M.tone, children: M.text }, D)
                    ) })
                  ]
                }
              ) }, _.action.id))
            }
          ) : /* @__PURE__ */ u("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            f.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ u("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
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
function Nc() {
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
function go(e) {
  return zi(e.subscribe, e.get, e.get);
}
function qc(e, t) {
  const n = R(t);
  qt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function Sc(e, t) {
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
const bu = [], Pi = Xa.map(
  (e, t) => ({ indent: t, keys: e })
), Yo = Pi.length - 1;
function bt({ binding: e, hidden: t }) {
  const n = t ? void 0 : ca(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ u(pe, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function xa(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kc(e) {
  return Xa.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Ec({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(pe, { children: r.map((i, o) => /* @__PURE__ */ u("div", { className: "dq-mobile-group", children: [
    i.map(t),
    o === r.length - 1 && n
  ] }, o)) });
}
function Ac({
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
          /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
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
function yu({
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
        const o = t ? i.answers : null, s = o ? o.length ? "answered" : "open" : "unknown", c = o == null ? void 0 : o.map((l) => n[l].label).join(", "), d = r(i), f = s === "answered" ? `${i.name}: ${c}` : s === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ u(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": d ? !0 : void 0,
            title: d ? `${f}. Needs attention: ${d}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: i.name }),
              d && /* @__PURE__ */ u("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ a(Vr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ u(pe, { children: [
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
function wu({ checked: e, onChange: t }) {
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
function vu({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: i,
  preview: o,
  onApply: s,
  onFind: c,
  findDisabled: d,
  paused: f = !1,
  waitForGroups: l = !1,
  attention: h = bu,
  stayOnTap: p = !1,
  onStayOnTapChange: m
}) {
  const y = po(), N = zr(e), v = qa();
  qc(o, v);
  const w = tt(), k = Hr(
    ve(() => e.flatMap((S) => S.steps.flatMap((se) => se.tagIds)), [e])
  ), O = Pi.filter((S) => S.keys.some((se) => N.actionOn.has(se))), F = O.includes(Pi[Yo]), B = e.length - N.actionOn.size, C = ve(
    () => l && !f ? qr(e) : [],
    [l, f, e]
  ), L = ve(
    () => C.length && r ? $i(e, r) : null,
    [C, e, r]
  ), x = new Map(
    Oi(L ?? []).flatMap(
      (S) => S.actions.filter((se) => dc(e[se])).map((se) => [se, S.name])
    )
  ), ae = ve(
    () => e.map((S) => f ? [] : ru(S, h, i)),
    [e, h, i, f]
  ), Q = (S) => S.map(iu).join("; "), _ = ae.map(Q), V = C.length > 0 && /* @__PURE__ */ a(
    yu,
    {
      groups: C,
      statuses: L,
      actions: e,
      attentionOf: (S) => Q([
        ...new Map(
          S.actions.flatMap((se) => ae[se]).map((se) => [se.key, se])
        ).values()
      ])
    }
  ), M = (S) => {
    const se = kr(e[S], k, [], i).map((ce) => ce.text).join(", "), E = x.get(S), Z = _[S];
    return [
      se,
      E === void 0 ? "" : `${E}: not answered yet`,
      Z ? `Needs attention: ${Z}` : ""
    ].filter(Boolean).join(". ");
  }, D = (S) => _[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${_[S]}`,
        children: /* @__PURE__ */ a(On, {})
      }
    )
  ) : null, P = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), X = (S) => {
    const se = N.actionOn.get(S), E = se === void 0 ? void 0 : e[se];
    if (!E)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(bt, { binding: S, hidden: !0 })
        },
        S
      );
    const Z = t(E), ce = `${w}-effect-${S}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : P(E), children: [
      /* @__PURE__ */ a("span", { id: ce, className: "dq-sr-only", children: M(se) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: E.label,
          "aria-keyshortcuts": S,
          "aria-describedby": ce,
          "data-group-open": x.has(se) || void 0,
          "data-attention": _[se] ? !0 : void 0,
          disabled: Z,
          onClick: (ue) => s(E, ue.shiftKey),
          children: [
            /* @__PURE__ */ a(bt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: E.label }),
            xa(E) && " ",
            xa(E) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(se)
          ]
        }
      )
    ] }, S);
  }, Y = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = kc(N), se = (E) => {
      const Z = e[E], ce = N.keys[E];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Z.label,
          "aria-keyshortcuts": ce,
          "aria-describedby": `${w}-effect-${ce}`,
          "data-group-open": x.has(E) || void 0,
          "data-attention": _[E] ? !0 : void 0,
          disabled: t(Z),
          onClick: (ue) => {
            o.clear(Z), s(Z, ue.shiftKey || p && Gs(Z));
          },
          ...f ? {} : Sc(o, Z),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Z.label }),
            xa(Z) && " ",
            xa(Z) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(E)
          ]
        },
        ce
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
            f ? Y : /* @__PURE__ */ a(
              Xo,
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
            m && /* @__PURE__ */ a(wu, { checked: p, onChange: m })
          ] }),
          V,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Ec,
            {
              groups: S,
              renderAction: se,
              find: /* @__PURE__ */ a(
                Ac,
                {
                  extra: B,
                  findKey: y.find,
                  disabled: d,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((E) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[E]}`, children: M(E) }, E)) })
        ]
      }
    );
  }
  const ie = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), W = !F && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": B ? `Find action, ${B} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: c,
      children: [
        /* @__PURE__ */ a(bt, { binding: y.find }),
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
          f ? Y : /* @__PURE__ */ a(
            Xo,
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
          V ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              V,
              ie,
              W
            ] })
          ) : /* @__PURE__ */ u(pe, { children: [
            !f && ie,
            W
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(X),
          S.indent === Yo && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": B ? `Find action, ${B} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(bt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
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
function Xo({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: i,
  preview: o,
  findKey: s,
  mobile: c = !1
}) {
  const d = go(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && m < e.length && /* @__PURE__ */ u(pe, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(bt, { binding: s })
      ] })
    ] });
  }
  const l = t.keys[f], h = r && d.steps.length ? co(d, r, i) : null, p = h && !h.unresolvedTrees.length && ![h.added, h.removed, h.markedAbsent, h.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    l && !c && /* @__PURE__ */ a(bt, { binding: l }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    kr(d, n, [], i).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
    p && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Cc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: i,
  onApply: o,
  onFind: s,
  summary: c,
  hints: d,
  keyHints: f,
  notices: l,
  status: h,
  className: p = "",
  paused: m = !1
}) {
  const y = po(), N = zr(e), v = qa(), w = tt(), k = Hr(ve(() => ti(e), [e])), [O] = T(() => Nc());
  qc(O, v);
  const F = R(null), B = Nu(F, e, !v), C = kc(N);
  !C.length && e.length && C.push([]);
  const L = C.flat(), x = e.length - L.length, ae = (M) => kr(M, k, t, n).map((D) => D.text).join(", "), Q = (M) => ({
    onMouseEnter: () => O.set(M),
    onMouseLeave: () => O.clear(M),
    onFocus: () => O.set(M),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || O.clear(M);
    }
  }), _ = d ?? (v ? void 0 : f), V = (M) => {
    const D = e[M];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: D.label,
        "aria-keyshortcuts": N.keys[M] || void 0,
        "aria-describedby": `${w}-effect-${M}`,
        disabled: m || r(D),
        onClick: () => {
          O.clear(D), o(D);
        },
        ...m ? {} : Sc(O, D),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: D.label })
      },
      D.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: F,
      className: `dq-action-bar${v ? " dq-bar-mobile" : B ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${p ? ` ${p}` : ""}`,
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
                Ec,
                {
                  groups: C,
                  renderAction: V,
                  find: /* @__PURE__ */ a(
                    Ac,
                    {
                      extra: x,
                      findKey: y.find,
                      disabled: m,
                      onFind: s
                    }
                  )
                }
              ),
              !v && C.map((M, D) => /* @__PURE__ */ u("div", { className: "dq-bar-line", children: [
                M.map((P) => {
                  const X = e[P], Y = N.keys[P];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: X.label,
                      "aria-keyshortcuts": Y || void 0,
                      "aria-describedby": `${w}-effect-${P}`,
                      disabled: m || r(X),
                      onClick: () => o(X),
                      ...m ? {} : Q(X),
                      children: [
                        Y && /* @__PURE__ */ a(bt, { binding: Y }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: X.label })
                      ]
                    },
                    X.id
                  );
                }),
                D === C.length - 1 && /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": x > 0 ? `Find action, ${x} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: m,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(bt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: x > 0 ? `${x} more` : "Find action" })
                    ]
                  }
                )
              ] }, D)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        _ && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: _ }),
        m ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          qu,
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
        l && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: l }),
        /* @__PURE__ */ a("div", { hidden: !0, children: L.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: ae(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: h })
      ]
    }
  );
}
function Nu(e, t, n) {
  const [r, i] = T(!1);
  return qt(() => {
    var l;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const h = getComputedStyle(o), p = parseFloat(h.columnGap) || 0, m = o.clientWidth - (parseFloat(h.paddingLeft) || 0) - (parseFloat(h.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (L) => [...L.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + p : 0) + 1 + // the divider
      2 * p, O = (L) => y.map((x) => {
        let ae = 1, Q = 0;
        for (const _ of x)
          Q > 0 && Q + v + _ > L ? (ae += 1, Q = _) : Q += (Q > 0 ? v : 0) + _;
        return ae;
      }), F = (L) => Math.max(1, L.reduce((x, ae) => x + ae, 0)), B = O(m), C = F(O(m - k));
      i(
        1 + F(B) < C || 1 + F(B) === C && B.every((L) => L === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(o);
    for (const h of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(h);
    c();
    let f = !0;
    return (l = document.fonts) == null || l.ready.then(() => {
      f && c();
    }), () => {
      f = !1, d.disconnect();
    };
  }, [e, t, n]), r;
}
function qu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: i,
  trees: o,
  showKey: s
}) {
  const c = go(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(bt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    kr(c, r, i, o).map((l, h) => /* @__PURE__ */ a("span", { "data-effect-tone": l.tone, children: l.text }, h))
  ] });
}
const Zo = 1e3;
async function Su(e, t, n) {
  const r = await be(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await be(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Fn({
            findFilter: {
              page: d,
              perPage: Zo,
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
    for (const l of f.items) i.set(l.id, l);
    if (d * Zo >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], s = _e(e), c = Ie(e) ? await Eu(
    s,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: o.map((d, f) => ({ id: d.id, name: d.name, uses: c[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function ku(e) {
  return JSON.stringify(
    Fn({
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
async function Eu(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !i.signal.aborted; ) {
            const c = s++;
            r[c] = (await be(
              `/api/${Xn(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: ku(t[c])
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
function Au(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Cu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Tu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of Yn(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Iu(e, t, n) {
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
function Ru(e, t) {
  var r;
  const n = gt(e);
  return ((r = qr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const $u = (e) => e instanceof Error ? e.message : "Request failed.";
function Ou({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, d] = T({}), [f, l] = T({}), [h, p] = T({}), m = R(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const M of m.current.values()) M.abort();
    },
    []
  );
  const y = qn(_e(t)), N = Ie(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = m.current.get(M)) == null || P.abort();
    const D = new AbortController();
    m.current.set(M, D), d((X) => ({ ...X, [M]: { status: "loading" } })), Su(t, M, D.signal).then(
      (X) => {
        D.signal.aborted || d((Y) => ({
          ...Y,
          [M]: { status: "ready", group: X }
        }));
      },
      (X) => {
        D.signal.aborted || d((Y) => ({
          ...Y,
          [M]: { status: "failed", message: $u(X) }
        }));
      }
    );
  }
  function k(M) {
    var ie;
    const D = o.filter((W) => !M.includes(W));
    for (const W of D)
      (ie = m.current.get(W)) == null || ie.abort(), m.current.delete(W);
    const P = (W) => {
      const S = c[W];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((se) => se.id) : [];
    }, X = new Set(M.flatMap(P)), Y = D.flatMap(P).filter((W) => !X.has(W));
    l(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => !Y.includes(Number(S)))
      )
    ), p(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => M.includes(Number(S)))
      )
    ), d(
      (W) => Object.fromEntries(
        Object.entries(W).filter(([S]) => M.includes(Number(S)))
      )
    ), s(M);
    for (const W of M) o.includes(W) || w(W);
  }
  const O = o.flatMap((M) => {
    const D = c[M];
    return (D == null ? void 0 : D.status) === "ready" ? [D.group] : [];
  }), F = O.length === o.length, B = o.some(
    (M) => {
      var D;
      return (((D = c[M]) == null ? void 0 : D.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Au(O).map((M) => [M.parent.id, M])
  ), L = Cu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), ae = Tu(t.actions), Q = (M) => f[M] ?? !ae.has(M), _ = F ? [...C.values()].flatMap((M) => {
    const D = Ru(M.parent.name, t.actions);
    return M.children.filter((P) => Q(P.id)).map((P) => ({ child: P, answerGroup: D }));
  }) : [], V = (M, D) => l((P) => ({
    ...P,
    ...Object.fromEntries(M.children.map((X) => [X.id, D]))
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
      Qn,
      {
        entityType: "tag",
        values: o,
        onChange: k,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((M) => {
      const D = c[M];
      if (!D || D.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, M);
      if (D.status === "failed")
        return /* @__PURE__ */ u("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ u("span", { children: [
            "Child tags could not be loaded. ",
            D.message
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
      const X = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: X }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: h[M] ?? !1,
                disabled: n,
                onChange: (Y) => p((ie) => ({
                  ...ie,
                  [M]: Y.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            X,
            " tree"
          ] }),
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(pe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${X}`,
                  onClick: () => V(P, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${X}`,
                  onClick: () => V(P, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: P.children.map((Y) => {
              const ie = ae.get(Y.id) ?? [], W = (L.get(Y.id) ?? []).filter((S) => S !== M).map((S) => `“${x.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: Q(Y.id),
                    disabled: n,
                    onChange: (S) => l((se) => ({
                      ...se,
                      [Y.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ u("span", { children: [
                  Y.name,
                  " ",
                  /* @__PURE__ */ u("small", { children: [
                    Y.uses.toLocaleString(),
                    " ",
                    Y.uses === 1 ? y.one : y.many
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
              ] }, Y.id);
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
          disabled: n || !_.length,
          onClick: () => r(
            _.map(
              ({ child: M, answerGroup: D }) => Iu(
                M,
                (L.get(M.id) ?? []).filter(
                  (P) => h[P]
                ),
                D
              )
            )
          ),
          children: _.length ? `Add ${_.length} action${_.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: B ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Mu(e, t, n, r) {
  const i = gt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: gt(c) === i });
    return o;
  }
  const s = gt(r);
  for (const c of t)
    gt(c).includes(s) && o.push({ kind: "group", name: c, selected: gt(c) === i });
  return s && !t.some((c) => gt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Fu(e) {
  return e.kind === "group" ? `group:${gt(e.name)}` : e.kind;
}
function xu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Pu = /* @__PURE__ */ new Set([
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
]), Lu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Pa = 4, es = 240;
function Du(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function _u(e, t, n, r) {
  for (const o of r) {
    const s = o.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function ju({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = tt(), s = tt(), c = tt(), d = R(null), f = R(null), l = R(null), h = R(null), p = R(null), m = R([]), y = R(!1), N = R(!1), [v, w] = T(!1), [k, O] = T(null), [F, B] = T(null), [C, L] = T(!1), x = e.group ?? "", ae = ve(
    () => Mu(t, n, x, k),
    [t, n, x, k]
  ), Q = ae.map(Fu), _ = F === null ? -1 : Q.indexOf(F), V = (E) => `${s}-option-${E}`, M = (E) => i(E ? { ...e, group: E } : xu(e)), D = () => {
    var Z;
    const E = ((Z = l.current) == null ? void 0 : Z.value) ?? x;
    E.trim() !== E && M(E.trim());
  };
  function P(E) {
    O(null), B(E), w(!0);
  }
  const X = (E) => {
    var Z, ce;
    return E instanceof Node && (((Z = d.current) == null ? void 0 : Z.contains(E)) || ((ce = h.current) == null ? void 0 : ce.contains(E))) === !0;
  };
  function Y() {
    var E, Z;
    (E = h.current) != null && E.contains(document.activeElement) && ((Z = p.current) == null || Z.focus({ preventScroll: !0 })), w(!1), O(null), B(null), L(!1);
  }
  function ie(E) {
    E.kind === "group" && E.selected && k === null || M(E.kind === "none" ? "" : E.name), Y();
  }
  function W() {
    const E = f.current, Z = h.current;
    if (!E || !Z) return;
    const ce = E.getBoundingClientRect(), ue = window.visualViewport, G = (ue == null ? void 0 : ue.offsetTop) ?? 0, Te = (ue ? ue.offsetTop + ue.height : window.innerHeight) - ce.bottom - Pa, ke = ce.top - G - Pa, ye = Math.min(Z.scrollHeight, es), Ve = Te < ye && ke > Te;
    Z.style.left = `${ce.left}px`, Z.style.width = `${ce.width}px`, Z.style.top = `${Ve ? ce.top - Pa : ce.bottom + Pa}px`, Z.style.transform = Ve ? "translateY(-100%)" : "", Z.style.maxHeight = `${Math.max(0, Math.min(es, Ve ? ke : Te))}px`, _u(E, Z, ce, m.current) || Y();
  }
  qt(() => {
    var E;
    v && (f.current && (m.current = Du(f.current)), N.current && ((E = h.current) == null || E.focus({ preventScroll: !0 }), L(!0)), N.current = !1);
  }, [v]), qt(() => {
    v && W();
  }), ee(() => {
    if (!v) return;
    const E = () => W(), Z = (G) => {
      X(G.target) || Y();
    }, ce = [...m.current, window], ue = window.visualViewport;
    for (const G of ce) G.addEventListener("scroll", E);
    return window.addEventListener("resize", E), ue == null || ue.addEventListener("resize", E), ue == null || ue.addEventListener("scroll", E), document.addEventListener("pointerdown", Z), () => {
      for (const G of ce) G.removeEventListener("scroll", E);
      window.removeEventListener("resize", E), ue == null || ue.removeEventListener("resize", E), ue == null || ue.removeEventListener("scroll", E), document.removeEventListener("pointerdown", Z);
    };
  }, [v]), ee(() => {
    var E, Z, ce;
    _ >= 0 && ((ce = (Z = (E = h.current) == null ? void 0 : E.children[_]) == null ? void 0 : Z.scrollIntoView) == null || ce.call(Z, { block: "nearest" }));
  }, [_]);
  function S(E) {
    if (nn(E)) return;
    const Z = E.key === "ArrowDown" || E.key === "ArrowUp";
    if (Z && !v) {
      if (E.altKey && E.key === "ArrowUp") return;
      E.preventDefault(), P(E.altKey ? null : gt(x) ? `group:${gt(x)}` : "none");
      return;
    }
    if (v)
      if (Z) {
        if (E.preventDefault(), E.altKey) {
          E.key === "ArrowUp" && Y();
          return;
        }
        const ce = E.key === "ArrowDown" ? 1 : -1, ue = k !== null && gt(k) && Q.length > 1 ? 1 : 0, G = _ < 0 ? ce > 0 ? ue : Q.length - 1 : (_ + ce + Q.length) % Q.length;
        B(Q[G]);
      } else E.key === "Enter" && (E.preventDefault(), _ >= 0 ? ie(ae[_]) : (D(), Y()));
  }
  function se(E) {
    var ce;
    if (E.key === "Tab") {
      Y(), E.shiftKey && ((ce = l.current) == null || ce.focus());
      return;
    }
    if (E.key === "Dead" || E.key === "Process" || nn(E) && !Lu.has(E.key) || E.key === "Backspace" || E.key === "Delete" || [...E.key].length === 1 && !E.metaKey && (!E.ctrlKey || E.altKey)) {
      const ue = l.current;
      ue && (ue.focus(), ue.setSelectionRange(ue.value.length, ue.value.length));
      return;
    }
    !Pu.has(E.key) && !nn(E) && L(!1), S(E);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (E) => {
        !v || E.key !== "Escape" || nn(E) || (E.preventDefault(), E.stopPropagation(), Y());
      },
      children: [
        /* @__PURE__ */ u("div", { ref: d, className: "dq-action-field", children: [
          /* @__PURE__ */ a(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: o,
              onMouseDown: (E) => {
                v && E.preventDefault();
              },
              children: "Group"
            }
          ),
          /* @__PURE__ */ u("div", { ref: f, className: "dq-combobox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                ref: l,
                id: o,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && _ >= 0 ? V(_) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: x,
                onChange: (E) => {
                  M(E.target.value), O(E.target.value), B(null), w(!0);
                },
                onClick: () => {
                  v || P(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  Y(), D();
                }
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: p,
                type: "button",
                className: "dq-combobox-toggle",
                tabIndex: -1,
                "aria-label": "Show groups",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                onPointerDown: (E) => {
                  y.current = E.pointerType === "touch";
                },
                onMouseDown: (E) => E.preventDefault(),
                onClick: () => {
                  var ce;
                  const E = y.current;
                  y.current = !1;
                  const Z = document.activeElement === l.current;
                  v ? Y() : (N.current = E && !Z, P(null)), (!E || Z) && ((ce = l.current) == null || ce.focus());
                },
                children: /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && cd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: h,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": _ >= 0 ? V(_) : void 0,
              "data-tap-focus": C || void 0,
              onMouseDown: (E) => E.preventDefault(),
              onKeyDown: se,
              onBlur: (E) => {
                X(E.relatedTarget) || Y();
              },
              children: ae.map((E, Z) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(Z),
                  role: "option",
                  "aria-selected": E.selected,
                  className: "dq-combobox-option",
                  "data-kind": E.kind,
                  "data-active": Z === _ || void 0,
                  onMouseMove: () => {
                    Z !== _ && B(Q[Z]);
                  },
                  onClick: () => ie(E),
                  children: [
                    E.kind === "new" && /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: E.kind === "none" ? "No group" : E.kind === "new" ? `New group “${E.name}”` : E.name }),
                    E.selected && /* @__PURE__ */ a(Vr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                Q[Z]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Kn = [
  ...Xa,
  ["auto", Hn]
];
function Tc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : to(e[n]);
}
function Uu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = R(null), d = n.keys[t], f = Tc(e, n, t), l = wr(f), h = n.duplicatePins.has(t) ? ` (${fa(e[t].shortcut ?? "")} is pinned twice)` : "", p = d ? `${fa(d)}, ${l ? "pinned" : "Auto"}${h}` : f === Hn ? "no key, Find action only" : `no key: Auto found no free key${h}`, m = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${p}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ a(bt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          l && /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ a(
      Bu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          i(y), m();
        },
        onClose: m
      }
    )
  ] });
}
function Bu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i,
  onClose: o
}) {
  const s = R(null), c = n.keys[t], d = Tc(e, n, t), [f, l] = T(c || "q"), h = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  qt(() => {
    var N, v, w;
    (N = h(c || d)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function p(N) {
    var v;
    wr(N) && l(N), (v = h(N)) == null || v.focus();
  }
  function m(N) {
    var C, L, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ae = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], Q = ae.indexOf(document.activeElement);
      N.preventDefault(), (L = ae[(Q + (N.shiftKey ? -1 : 1) + ae.length) % ae.length]) == null || L.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? Kn.findIndex((ae) => ae.includes(v)) : -1;
    if (!v || w < 0) return;
    const k = Kn[w].indexOf(v), O = (ae) => ae == null ? void 0 : ae[Math.min(k, ae.length - 1)], F = {
      ArrowLeft: Kn[w][k - 1],
      ArrowRight: Kn[w][k + 1],
      ArrowUp: O(Kn[w - 1]),
      ArrowDown: O(Kn[w + 1]),
      Home: Kn[w][0],
      End: Kn[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const B = F[N.key];
    B && p(B);
  }
  const y = (N) => {
    const v = wr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: to(e[v]) === N
    };
  };
  return /* @__PURE__ */ u(pe, { children: [
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
        onKeyDown: m,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ u("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Xa.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const k = y(w), O = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${fa(w)}: ${O}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => l(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(bt, { binding: w }),
                    (k == null ? void 0 : k.pinned) && /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
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
                "aria-pressed": d === "auto",
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
                "data-choice": Hn,
                tabIndex: 0,
                "aria-pressed": d === Hn,
                onClick: () => i(Hn),
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
const Ku = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Gu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Vu(e, t) {
  if (Mn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (no(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Ic(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function zu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Hu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: s,
  reveal: c
}) {
  const d = Pe(e), f = d !== "tag", l = e.actions, h = zr(l), p = Hr(ve(() => ti(l), [l])), m = ve(
    () => f ? qr(l).map((G) => G.name) : [],
    [f, l]
  ), y = l.findIndex((G) => G.id === o), N = ve(
    () => f && y >= 0 ? qr(
      l.filter((G, ge) => ge !== y)
    ).map((G) => G.name) : [],
    [f, l, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ve(
    () => new Set(
      v ? Wd(l).map((G) => G.key) : []
    ),
    [v, l]
  ), [k, O] = T(""), [F, B] = T(!1), [C, L] = T(
    null
  ), x = tt(), ae = `${x}-from-tags`, Q = R(null), _ = R(null), V = R(null), M = R(null), D = R(/* @__PURE__ */ new WeakMap()), P = (G) => {
    let ge = D.current.get(G);
    return ge || (ge = crypto.randomUUID(), D.current.set(G, ge)), ge;
  }, X = k.trim().toLocaleLowerCase(), Y = X ? l.filter((G) => G.label.toLocaleLowerCase().includes(X)) : l, ie = (G) => t({ ...e, actions: G }), W = (G, ge) => ie(l.map((Te, ke) => ke === G ? ge : Te));
  function S(G) {
    var ge;
    return [...((ge = V.current) == null ? void 0 : ge.querySelectorAll("[data-action-id]")) ?? []].find(
      (Te) => Te.dataset.actionId === G
    );
  }
  function se(G, ge) {
    const Te = S(G), ke = Te == null ? void 0 : Te.querySelector(
      ge === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ke == null || ke.focus(), !!ke;
  }
  qt(() => {
    var ge;
    const G = M.current;
    G && (M.current = null, (G === "add" || !se(G.id, G.part)) && ((ge = _.current) == null || ge.focus()));
  }), ee(() => {
    !c || !o || (Y.some((G) => G.id === o) ? se(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function E() {
    const G = zu(d);
    O(""), ie([...l, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function Z(G) {
    const ge = l[G], { shortcut: Te, ...ke } = structuredClone(ge), ye = {
      ...ke,
      ...Te === Hn ? { shortcut: Te } : {},
      id: crypto.randomUUID(),
      label: `${ge.label} copy`
    };
    ie([...l.slice(0, G + 1), ye, ...l.slice(G + 1)]), s(ye.id), M.current = { id: ye.id, part: "label" };
  }
  function ce(G) {
    const ge = l[G], Te = Y.indexOf(ge), ke = Y[Te + 1] ?? Y[Te - 1];
    ie(l.filter((ye, Ve) => Ve !== G)), o === ge.id && s(null), M.current = ke ? { id: ke.id, part: "toggle" } : "add";
  }
  function ue() {
    B(!1), requestAnimationFrame(() => {
      var G;
      return (G = Q.current) == null ? void 0 : G.focus();
    });
  }
  return /* @__PURE__ */ u("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ u("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ u("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ u(
          "button",
          {
            ref: _,
            type: "button",
            className: "dq-header-button",
            onClick: E,
            children: [
              /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: Q,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": F,
            "aria-controls": F ? ae : void 0,
            onClick: () => {
              L(null), B(!F);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
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
                G.key === "Escape" && k && !nn(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${x}-groups-note`, children: v && !m.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === l ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && F && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || nn(G) || (G.preventDefault(), G.stopPropagation(), ue());
        },
        children: /* @__PURE__ */ a(
          Ou,
          {
            id: ae,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const ge = [...l, ...G];
              ie(ge), L({ actions: ge, count: G.length }), ue();
            },
            onCancel: ue
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: Y.length > 0 && /* @__PURE__ */ a(
      As,
      {
        items: Y,
        getKey: (G) => G.id,
        disabled: i || !!X,
        className: "dq-action-list",
        onReorder: (G) => ie(G),
        renderItem: (G, { dragHandleProps: ge, isOver: Te }) => {
          const ke = l.indexOf(G), ye = o === G.id;
          return /* @__PURE__ */ a(
            Ju,
            {
              action: G,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Uu,
                {
                  actions: l,
                  index: ke,
                  keyMap: h,
                  name: G.label.trim() || "New action",
                  onChoose: (Ve) => ie(ud(l, ke, Ve))
                }
              ),
              takenPin: h.duplicatePins.has(ke) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(gt(G.group)),
              effect: kr(G, p, n, r),
              open: ye,
              detailId: `${x}-detail-${G.id}`,
              dragHandleProps: ge,
              isOver: Te,
              reorderDisabled: i || !!X,
              onToggle: () => s(ye ? null : G.id),
              onDuplicate: () => Z(ke),
              onDelete: () => ce(ke),
              children: "steps" in G ? /* @__PURE__ */ a(
                Qu,
                {
                  action: G,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: Ie(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Ve, me) => D.current.set(Ve, P(me)),
                  onChange: (Ve) => W(ke, Ve)
                }
              ) : /* @__PURE__ */ a(
                Yu,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Ve) => W(ke, Ve)
                }
              )
            }
          );
        }
      }
    ) }),
    l.length ? !Y.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      k.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Ju({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: i = !1,
  effect: o,
  open: s,
  detailId: c,
  dragHandleProps: d,
  isOver: f,
  reorderDisabled: l,
  onToggle: h,
  onDuplicate: p,
  onDelete: m,
  children: y
}) {
  const N = e.label.trim() || "New action", v = Vu(e, t), w = "steps" in e && gt(e.group) ? e.group.trim() : "";
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
              ...d,
              style: Ic(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: l ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: l,
              children: /* @__PURE__ */ a(Ms, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: h, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((k, O) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${fa(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
                  `${fa(r)} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
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
              onClick: p,
              children: /* @__PURE__ */ a(Fs, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(Wa, { "aria-hidden": "true" })
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
              onClick: h,
              children: /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Rc({
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
function Qu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: i,
  stepKey: o,
  rememberStepKey: s,
  onChange: c
}) {
  const d = tt(), f = R(null), l = R(null);
  qt(() => {
    var m, y;
    const p = l.current;
    p != null && (l.current = null, (y = (m = f.current) == null ? void 0 : m.querySelector(`[data-step-index="${p}"] input`)) == null || y.focus());
  });
  const h = (p) => c({ ...e, steps: p });
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(Rc, { action: e, onChange: (p) => c({ ...e, label: p }) }),
    /* @__PURE__ */ a(
      ju,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: r,
        onChange: c
      }
    ),
    /* @__PURE__ */ u("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": d, children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", id: d, children: "Steps" }),
      /* @__PURE__ */ u("div", { className: "dq-steps", ref: f, children: [
        e.steps.length > 0 ? /* @__PURE__ */ a(
          As,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: h,
            renderItem: (p, { index: m, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              Wu,
              {
                step: p,
                index: m,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, p), h(e.steps.map((w, k) => k === m ? v : w));
                },
                onRemove: () => h(e.steps.filter((v, w) => w !== m))
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
              l.current = e.steps.length, h([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Wu({
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
      "data-step-tone": Gu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            ...n,
            style: Ic(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(Ms, { "aria-hidden": "true" }),
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
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: Ku.map(({ mode: d, label: f }) => /* @__PURE__ */ a("option", { value: d, children: f }, d))
          }
        ),
        /* @__PURE__ */ a(
          Qn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => o({ ...e, tagIds: d }),
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
            children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Yu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, i = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, o = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(Rc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
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
const $c = Ml(!1);
function Xu({ children: e }) {
  return /* @__PURE__ */ a($c.Provider, { value: !0, children: e });
}
function zt({ tag: e, name: t }) {
  const n = Fl($c), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = qn(_e(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      Qn,
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
function ef({
  review: e,
  onChange: t
}) {
  const n = qn(_e(e)).many, r = e.occurrence, i = Us(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Na([
    ...i.flatMap((l) => [l.tagId, ...l.categoryTagId ? [l.categoryTagId] : []]),
    ...o
  ]), c = (l) => {
    var h;
    return ((h = s[l]) == null ? void 0 : h.name) ?? (s[l] === null ? `Unavailable tag ${l}` : `Tag ${l}`);
  }, d = (l) => t({ ...e, occurrence: ld(r, l) }), f = (l, h) => d(
    i.map(
      (p, m) => m !== l ? p : h === void 0 ? { tagId: p.tagId } : { tagId: p.tagId, categoryTagId: h }
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
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((l, h) => {
      const p = c(l.tagId), m = i.filter(
        (v, w) => w !== h && v.tagId === l.tagId
      ), y = (v) => m.some((w) => w.categoryTagId === v), N = `${l.tagId}#${i.slice(0, h).filter((v) => v.tagId === l.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(zt, { tag: s[l.tagId], name: p })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Lo,
            {
              entityType: "tag",
              value: l.categoryTagId,
              onChange: (v) => f(h, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${p}`,
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
            "aria-label": `Remove flag ${p}`,
            title: "Remove flag",
            onClick: () => d(i.filter((v, w) => w !== h)),
            children: /* @__PURE__ */ a(Wa, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ u(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${p}`,
            children: [
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": l.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => f(h, void 0),
                  children: "Whole review"
                }
              ),
              o.map((v) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": l.categoryTagId === v,
                  disabled: y(v),
                  onClick: () => f(h, v),
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
      Lo,
      {
        entityType: "tag",
        value: void 0,
        onChange: (l) => {
          l !== void 0 && d([...i, { tagId: l }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: i.flatMap((l) => l.categoryTagId === void 0 ? [l.tagId] : [])
      }
    )
  ] });
}
const Oc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Mc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, tf = {
  video: Ya,
  audio: Ls,
  tag: Ps,
  performerOccurrence: xs,
  audioPerformerOccurrence: Hl
};
function Fc({ entityType: e }) {
  const t = tf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Oc[e] });
}
const nf = 2e6;
function xc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function rf(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function bo(e) {
  xc([e], rf(e));
}
async function af(e) {
  if (e.size > nf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return wa(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Br(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, i) => i && typeof i == "object" && !Array.isArray(i) ? Object.fromEntries(
      Object.keys(i).sort().map((o) => [o, i[o]])
    ) : i
  );
}
function Pc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: i,
  autoFocus: o = !1
}) {
  return /* @__PURE__ */ u(pe, { children: [
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
          children: Bs.map((s) => /* @__PURE__ */ a("option", { value: s, children: Mc[s] }, s))
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
function of(e, t) {
  const n = Pe(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function sf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), r = R(null), i = tt(), o = tt();
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
function Lc({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: r,
  tagGroups: i,
  trees: o,
  saving: s,
  saveDisabled: c = !1,
  error: d,
  dirty: f,
  criteriaChanged: l = !1,
  notices: h,
  onSave: p,
  onCancel: m,
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => Ie(e) && e.occurrence.tagIds.length > 0
  ), [k, O] = T(""), [F, B] = T(null), [C, L] = T(0), [x, ae] = T(!1), Q = R(null), _ = R(null), V = R(null), M = of(e, w), D = Pe(e), P = ve(() => Br(e), [e]);
  ee(() => O(""), [P]), ee(() => {
    var se, E;
    if (x) return;
    const W = Q.current;
    if (Q.current = null, !W) return;
    (E = W.isConnected && !!((se = V.current) != null && se.contains(W)) && !(W instanceof HTMLButtonElement && W.disabled) ? W : V.current) == null || E.focus({ preventScroll: !0 });
  }, [x]);
  function X() {
    if (!(s || x)) {
      if (!f) {
        m();
        return;
      }
      Q.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ae(!0);
    }
  }
  function Y() {
    const W = { ...e, name: e.name.trim() }, S = pa(W);
    if (!S) {
      O(""), p();
      return;
    }
    if (O(S), !W.name) {
      v("Review"), requestAnimationFrame(() => {
        var E;
        return (E = _.current) == null ? void 0 : E.focus();
      });
      return;
    }
    const se = e.actions.find(
      (E) => !Mn(E, D)
    );
    se && (v("Actions"), B(se.id), L((E) => E + 1));
  }
  const ie = k || d;
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (W) => {
          V.current = W, y && (y.current = W);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (W) => {
          W.key !== "Escape" || W.defaultPrevented || s || nn(W) || (W.preventDefault(), W.stopPropagation(), X());
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
                children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ll,
            {
              tabs: M.map((W) => ({
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
                    Pc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: _,
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
                  Ie(e) && /* @__PURE__ */ a(ef, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => bo(e),
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
                children: /* @__PURE__ */ a(cf, { review: e, onChange: t })
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
                  Hu,
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
            w && Ie(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(Zu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (ie || h) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            h,
            ie && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
              ie
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? l ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
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
                  s || Y();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    x && /* @__PURE__ */ a(
      sf,
      {
        onKeepEditing: () => ae(!1),
        onDiscard: () => {
          Q.current = null, ae(!1), m();
        }
      }
    )
  ] });
}
function cf({
  review: e,
  onChange: t
}) {
  const n = tt(), r = e.view, i = (l) => t({ ...e, view: { ...r, ...l } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (l) => i({ selectAllOnLoad: l.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Pe(e) === "tag")
    return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        ts,
        {
          label: "View",
          value: r.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (l) => i({ displayMode: l })
        }
      ),
      o,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (l) => t({ ...e, presentation: { ...s, ...l } }), d = s.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ u("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          ns,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(df, {}),
            onChoose: () => i({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          ns,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(uf, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        ts,
        {
          label: "Cards",
          value: r.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (l) => i({ displayMode: l })
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
        ].map(([l, h]) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(l),
              onChange: (p) => c({
                annotations: p.target.checked ? [...d, l] : d.filter((m) => m !== l)
              })
            }
          ),
          h
        ] }, l)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ u("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ u("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            Qn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (l) => c({ annotationParents: l }),
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
        Qn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (l) => c({ binParents: l }),
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
      lf,
      {
        bins: s.filterBins ?? [],
        onChange: (l) => c({ filterBins: l.length ? l : void 0 })
      }
    )
  ] });
}
function lf({
  bins: e,
  onChange: t
}) {
  const n = tt(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, d) => t(
    e.map((f) => {
      var h;
      if (f.key !== c) return f;
      const l = { ...f, ...d };
      return (h = l.group) != null && h.trim() || delete l.group, l;
    })
  );
  return /* @__PURE__ */ u("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-title`, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-title`, children: "Queue filter bins" }),
    e.map((c, d) => {
      const f = c.label.trim() || `Filter bin ${d + 1}`, l = Object.keys(c.filter).length;
      return /* @__PURE__ */ u("div", { className: "dq-filter-bin", role: "group", "aria-label": f, children: [
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Name of ${f}`,
            placeholder: "Bin name",
            value: c.label,
            onChange: (h) => s(c.key, { label: h.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: c.group ?? "",
            onChange: (h) => s(c.key, { group: h.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": `Edit filter of ${f}`,
            onClick: () => i(c.key),
            children: l ? "Edit filter…" : "Set filter…"
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Delete ${f}`,
            title: "Delete",
            onClick: () => t(e.filter((h) => h.key !== c.key)),
            children: /* @__PURE__ */ a(Wa, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || nn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Cs,
          {
            open: !0,
            onClose: () => i(null),
            criteria: Qa,
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
function ts({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const i = tt();
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
function ns({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: i,
  onChoose: o
}) {
  const s = tt(), c = tt();
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
function df() {
  return /* @__PURE__ */ u("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function uf() {
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
const Li = "The queue differs from the saved review.";
function Dc({
  name: e,
  description: t,
  entityType: n,
  onBack: r,
  backDisabled: i,
  onEdit: o,
  editDisabled: s,
  editing: c = !1,
  toolbar: d,
  trailing: f,
  trailingEnd: l,
  queueChange: h,
  queueDiffers: p,
  chipsStart: m,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = R(null);
  gf(v);
  const w = bf(v), [k, O] = T({ differs: p, text: "" });
  return k.differs !== p && O({
    differs: p,
    text: p ? k.differs === !1 ? Li : k.text : ""
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
          children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: Oc[n], children: /* @__PURE__ */ a(Fc, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(Kr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      h && /* @__PURE__ */ a(ff, { change: h, onPress: w }),
      l
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    m,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function ff({
  change: e,
  onPress: t
}) {
  const n = tt(), r = tt(), i = `${Li} Save these filters to the review.`, o = e.onSave ? `${Li} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ u(pe, { children: [
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
          /* @__PURE__ */ a(Wl, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Yl, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: o })
        ]
      }
    )
  ] });
}
const pf = ["queue", "summary", "name", "layout", "range"], hf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, mf = "(min-width: 1400px)";
function ja(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function rs(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const i = pf.filter(
    (o) => e.querySelector(hf[o])
  );
  for (let o = 1; o <= i.length && !ja(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !ja(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return ja(e) ? !0 : (r(), !1);
}
function gf(e) {
  const t = vc(mf), [n, r] = T(0), i = R(!1);
  qt(() => {
    e.current && (i.current = !rs(e.current, t));
  }, [e, t, n]), qt(() => {
    const o = e.current;
    o && t && !i.current && !ja(o) && (i.current = !rs(o, t));
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
function bf(e) {
  const t = R(!1);
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
function _c({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, i] = T(!1), [o, s] = T(""), c = R(null), d = R(null);
  ee(() => {
    var h;
    r && ((h = c.current) == null || h.select());
  }, [r]);
  const f = (h) => {
    i(!1), h && requestAnimationFrame(() => {
      var p;
      return (p = d.current) == null ? void 0 : p.focus();
    });
  }, l = () => {
    const h = Math.round(Number(o));
    f(!0), Number.isFinite(h) && h >= 1 && h !== e && n(Math.min(t, h));
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
        children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
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
        onChange: (h) => s(h.target.value),
        onKeyDown: (h) => {
          nn(h) || (h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), h.stopPropagation(), f(!0)));
        },
        onBlur: () => f(!1)
      }
    ) : /* @__PURE__ */ u(
      "button",
      {
        ref: d,
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
        children: /* @__PURE__ */ a(Ds, { "aria-hidden": "true" })
      }
    )
  ] });
}
function jc({
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
          /* @__PURE__ */ a(Ql, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Wi, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function yf({
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
function yo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = R(null), d = R(null), f = tt();
  qt(() => {
    if (!r || !d.current || !c.current) return;
    const p = c.current.getBoundingClientRect(), m = d.current.offsetHeight + 12, y = window.innerHeight - p.bottom;
    s(y < m && p.top > y);
  }, [r]), ee(() => {
    var p, m;
    r && ((m = (p = d.current) == null ? void 0 : p.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus({ preventScroll: !0 }));
  }, [r]), ee(() => {
    t && i(!1);
  }, [t]);
  const l = (p = !0) => {
    var m;
    i(!1), p && ((m = c.current) == null || m.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (p) => {
    var N, v;
    if (!r) return;
    const m = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = m.indexOf(document.activeElement);
    if (p.key === "Escape")
      p.preventDefault(), p.stopPropagation(), l();
    else if (p.key === "Tab")
      l(!1);
    else if (p.key === "ArrowDown" || p.key === "ArrowUp") {
      if (p.preventDefault(), !m.length) return;
      const w = p.key === "ArrowDown" ? 1 : -1;
      m[(y + w + m.length) % m.length].focus();
    } else (p.key === "Home" || p.key === "End") && (p.preventDefault(), (v = m.at(p.key === "Home" ? 0 : -1)) == null || v.focus());
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
        onClick: () => i((p) => !p),
        children: /* @__PURE__ */ a(Jl, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => l(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((p) => /* @__PURE__ */ u(Hi, { children: [
            p.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: p.danger ? "dq-menu-danger" : void 0,
                disabled: p.disabled,
                onClick: () => {
                  l(), p.onSelect();
                },
                children: [
                  p.icon,
                  p.label
                ]
              }
            )
          ] }, p.label))
        }
      )
    ] })
  ] });
}
function Ha(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function wo(e) {
  return String(e.type).toLowerCase() === "tag";
}
function vo(e) {
  return !!String(e ?? "").trim();
}
function No(e) {
  return [
    ...new Set(
      Ha(e.customFieldCriteria).filter(wo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !vo(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function qo(e, t) {
  const n = Ha(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!wo(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !vo(o[d]) && (s[d] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Uc(e, t, n) {
  const r = Ha(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Ha(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (l) => (d[l] ?? void 0) === (f[l] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!wo(d)) return d;
    const f = i.find((h) => o(h, d));
    if (!f) return d;
    const l = { ...d };
    for (const [h, p] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(d[h] ?? "")];
      m && d[p] === m && !vo(f[p]) && (delete l[p], s = !0);
    }
    return l;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function wf(e, t, n) {
  if (!Mn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = _e(e), i = n.steps.some((c) => $n(c.mode)) ? await Gd(r) : "", o = await oo(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !$n(d.mode)),
    ...o.filter((d) => $n(d.mode))
  ]) {
    const d = (f) => Vd(
      i,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Vc(
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
    )), c.mode === "MARK_ABSENT" && await d("ADD");
  }
  return s;
}
async function So(e, t) {
  const n = e.occurrence;
  if (Zi(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await be("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Fn({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (c.items.forEach((d) => r.add(d.id)), s * 1e3 >= c.totalCount) return [...r];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Bc(e) {
  return ua(e.condition) && e.hideConfirmedAbsent !== !1;
}
function ko(e, t) {
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
  }, s = Bc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
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
                      key: Za,
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
async function Eo(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ei([n], t))
  );
}
function Kc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function vf(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function Nf(e, t, n, r, i) {
  if (!Bc(e)) return !1;
  const o = rc(t, n);
  return e.conditionTagIds.every(
    (s, c) => o.includes(s) || i[c].some((d) => r.includes(d))
  );
}
async function Gc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || Kc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = _e(e), o = await _r(
    ko(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Eo(c, r) : [], f = new Array(o.items.length);
  let l = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; l < o.items.length; ) {
        const h = l++, p = o.items[h], m = await be(
          `/api/tagapplications?hostType=${i}&hostId=${p.id}&contextType=performer`,
          { signal: r }
        );
        f[h] = p.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = m.filter(
            (w) => w.hostType === i && w.hostId === p.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return vf(e.occurrence, v, d) && !Nf(c, p, y.id, v, d) ? [
            {
              key: `${p.id}:${y.id}`,
              media: p,
              performer: y,
              applications: N
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: o.totalCount };
}
async function Vc(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = _e(e), o = await Va(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await be(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      c.some((l) => l.tag.id === f) || await be("/api/tagapplications", {
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
      r.has(f.tag.id) && !d.has(f.tag.id) && await be(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await be(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Gr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function qf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function dn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? rc(
      await Va(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await be(qf(e, t))).filter(
      (l) => l.hostType === e && l.hostId === t.media.id && l.contextType === "performer" && l.contextId === t.occurrence.performer.id
    );
    return xi(f.map((l) => l.tag)), {
      ids: [...new Set(f.map((l) => l.tag.id))],
      names: [...new Set(f.map((l) => l.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await Va(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  xi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Ga
  ) ?? Ga, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
  if (!Array.isArray(s) || s.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((d) => d.id),
    names: i.map((d) => d.name),
    absent: s,
    tags: i
  };
}
async function Ao(e, t, n) {
  if (t.occurrence && Ie(e))
    await Vc(
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
      i.length && await be(
        `/api/${Xn(_e(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function Sf(e, t, n) {
  t.occurrence && Ie(e) ? await wf(e, t.occurrence, n) : await ac(_e(e), n, [t.media.id]);
}
function Di(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Gr(i(t.ids), i(n.ids)),
    absence: Gr(i(t.absent), i(n.absent))
  };
}
function kf(e, t) {
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
class zc extends Error {
}
const _i = (e) => e instanceof Error ? e.message : "Request failed.", as = (e) => [...e].sort((t, n) => t - n), ha = (e, t) => JSON.stringify(as(e)) === JSON.stringify(as(t)), ji = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ja(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const l of t.steps)
    for (const h of l.tagIds)
      l.mode === "ADD" ? o.add(h) : o.delete(h);
  const s = e.some((l) => !o.has(l));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((l) => l.mode === "ADD").flatMap((l) => l.tagIds)
  ), d = [], f = [];
  for (const l of n) {
    const h = l.filter((m) => o.has(m) && !i.has(m)), p = l.filter(
      (m) => o.has(m) && i.has(m) && !c.has(m)
    );
    !h.length || !p.length || (r ? (p.forEach((m) => o.delete(m)), f.push(...p)) : (h.forEach((m) => o.delete(m)), d.push({ tagIds: h, existing: p })));
  }
  return { desired: [...o], conflict: s, skipped: !1, kept: d, replaced: f };
}
function Ef(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Af(e, t, n, r) {
  for (const [i, o] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (l) => l.mode === "ADD" && l.tagIds.some((h) => o.includes(h))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[i];
    let d = `tag ${c}`;
    try {
      d = (await be(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new zc(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Cf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (p) => !Mn(p, e.entityType) || !p.steps.length || p.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ua(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Eo(i.occurrence, n) : [];
  await Af(i, o, s, n);
  const c = await Promise.all(
    o.map(async (p) => ({
      ...p,
      steps: await oo(p, n)
    }))
  ), d = structuredClone(Ef(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((p) => p.tagIds),
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
  const l = await So(i, n), h = /* @__PURE__ */ new Map();
  for (let p = 1; ; p++) {
    n.throwIfAborted();
    const m = await Gc(i, l, p, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Ja(N.ids, d, s, !0);
      h.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ha(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(h.size), p * 250 >= m.totalCount) break;
    if (p > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: d,
    categories: s,
    touched: f,
    entries: [...h.values()]
  };
}
function Tf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!ha(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ha(i(e), i(t));
}
async function Hc(e, t, n, r) {
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
function Jc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Qc(e) {
  return e.entries.filter((t) => t.operation);
}
async function If(e, t, n, r, i = !1) {
  await Hc(
    Jc(e, i),
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
        if (s = await dn(_e(e.review), o.item, !1), !Tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (p) {
        o.status = "failed", o.error = _i(p);
        return;
      }
      const c = Ja(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((p) => !e.touched.includes(p)),
        ...c.desired.filter((p) => e.touched.includes(p))
      ], f = Gr(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const p = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : p ? "skipped" : "unchanged", o.error = p ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let l;
      try {
        await Ao(e.review, o.item, f);
      } catch (p) {
        l = p;
      }
      let h = !1;
      try {
        const p = await dn(_e(e.review), o.item, !1);
        h = !0, o.expected = p;
        const m = Di(
          o.item,
          o.before,
          p,
          e.touched
        );
        if (o.operation = ji(m) ? m : void 0, l) throw l;
        if (!ha(
          p.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (p) {
        if (o.status = "failed", o.error = _i(p), !h)
          try {
            const m = await dn(_e(e.review), o.item, !1);
            o.expected = m;
            const y = Di(
              o.item,
              o.before,
              m,
              e.touched
            );
            o.operation = ji(y) ? y : void 0;
          } catch {
            o.unverified = !0;
          }
      }
    },
    r
  );
}
async function Rf(e, t, n) {
  await Hc(
    Qc(e),
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
        const c = await dn(_e(e.review), r.item, !1);
        kf(i, c), s = !0, await Ao(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await dn(_e(e.review), r.item, !1);
        if (!ha(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${_i(c)}`, r.status = "failed", s)
          try {
            const d = await dn(_e(e.review), r.item, !1), f = Di(
              r.item,
              r.before,
              d,
              o
            );
            r.operation = ji(f) ? f : void 0, r.expected = d;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const Wc = (e, t) => t.count - e.count || ic(e, t);
async function $f(e, t, n) {
  const r = _e(e), i = e.occurrence, [o, s] = await Promise.all([
    be(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Eo(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  xi(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await be(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), l = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !f.has(y))
  ), h = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!y.has(v.tag.id)) continue;
      const w = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), N.set(v.tag.id, w);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Wc);
  }, p = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: h(new Set(y))
  }));
  l.size && p.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...l],
    tags: h(l)
  });
  const m = /* @__PURE__ */ new Set([...f, ...l]);
  return {
    answered: new Set(
      c.filter((y) => m.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: p
  };
}
function Of(e, t, n, r) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const d = new Set(c);
    return [...i].every((f) => d.has(f));
  };
  return n.some(
    (s) => [...Yn(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function Co(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const i = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Wc), o = (m) => m.members ?? m.tags.map((y) => y.id), s = qr(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...Yn(t[N])]))
    ];
    return y.length ? [{ ...m, answers: y, tags: i(y) }] : [];
  }), c = (m) => m.tags.length > 1 ? [m] : [], d = e.groups.filter((m) => m.id !== null).map((m) => {
    const y = `tag:${m.id}`, N = o(m), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: m.name,
      members: N,
      tags: m.tags,
      mixed: Of(m.id, N, t, n) ? c({ key: y, name: m.name, members: N, tags: m.tags }) : (
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
  }), f = d.map((m) => new Set(m.members)), l = /* @__PURE__ */ new Set();
  for (const m of s) {
    if (f.some((N) => m.answers.every((v) => N.has(v)))) continue;
    m.answers.forEach((N) => l.add(N));
    const y = `group:${m.key}`;
    d.push({
      key: y,
      kind: "group",
      name: m.name,
      members: m.answers,
      tags: m.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: m.name, members: m.answers, tags: m.tags })
    });
  }
  const h = e.groups.find((m) => m.id === null), p = (h == null ? void 0 : h.tags.filter((m) => !l.has(m.id))) ?? [];
  return h && p.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: o(h).filter((m) => !l.has(m)),
    tags: p,
    mixed: []
  }), d;
}
const bi = { summary: null, error: "" };
function Yc(e, t, n = 0) {
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
    value: bi
  });
  return ee(() => {
    if (s((d) => d.key === i ? d : { key: i, value: bi }), e === null || t === null) return;
    const c = new AbortController();
    return $f(e, t, c.signal).then((d) => {
      c.signal.aborted || s({ key: i, value: { summary: d, error: "" } });
    }).catch((d) => {
      c.signal.aborted || s((f) => ({
        key: i,
        value: {
          summary: f.key === i ? f.value.summary : null,
          error: d instanceof Error ? d.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [i, n]), o.key === i ? o.value : bi;
}
function Mf(e, t) {
  const n = (f) => {
    var l;
    return ((l = f.tagIds) == null ? void 0 : l.every((h) => e.members.includes(h))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const l = eu(f, t).filter((p) => p.key !== e.key), h = f.key === e.key ? [] : l.filter(n);
    h.length ? h.forEach((p) => r.add(p.name)) : l.forEach((p) => i.add(p.name));
  }
  const o = gt(e.name), s = [...r].filter((f) => gt(f) !== o), c = s.length < r.size, d = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: d };
}
function Ff(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Ui({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = Ri,
  flags: o = [],
  className: s = ""
}) {
  const c = qn(n), d = (p) => `${p.toLocaleString()} ${p === 1 ? c.one : c.many}`, f = e ? Co(e, r, i) : [], l = lo(f), h = (p) => [
    ...new Set(
      o.filter((m) => {
        var y;
        return (y = m.tagIds) == null ? void 0 : y.some((N) => p.includes(N));
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
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ u("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((p) => {
          const m = p.kind === "other" ? [] : h(p.members), y = Mf(p, l), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: p.name }),
              p.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Ff(p, y),
                  children: [
                    /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            p.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": p.name, children: p.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(zt, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                ", ",
                d(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, p.key);
        }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Ur({
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
const is = 5;
function xf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await be(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
const os = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Bi = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], ss = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Pf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, yi = 250;
function sa(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Lf({ step: e }) {
  const t = Bi.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Bi.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Vr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function cs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(Hi, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function oa({
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
        n && /* @__PURE__ */ u(pe, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function ls({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": r, children: [
    vr(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(zt, { tag: i })
    ] }) }, `added-${i.id}`)),
    vr(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(zt, { tag: i })
    ] }) }, `removed-${i.id}`))
  ] });
}
function ds({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: i
}) {
  return /* @__PURE__ */ u("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > yi && /* @__PURE__ */ u("span", { children: [
        "First ",
        yi.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, yi).map((o) => {
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
                sa(o, n)
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
function Df(e) {
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
function _f({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o
}) {
  const [s, c] = T(!1), [d, f] = T("answers"), [l, h] = T(null), [p, m] = T({}), [y, N] = T([]), [v, w] = T(!1), [k, O] = T(!1), [F, B] = T(""), [C, L] = T(!1), [x, ae] = T(""), [Q, _] = T(null), [V, M] = T(null), [D, P] = T([]), [X, Y] = T(0), ie = R(null), W = R(null), S = R(null), se = R(!1), E = R(!1), Z = R(null), ce = R(!1), ue = R(!1), G = R({ onClose: o });
  G.current = { onClose: o };
  const ge = tt(), Te = d === "run", ke = (Q == null ? void 0 : Q.kind) === "undo", ye = Te && l ? l.review : e, Ve = zr(ye.actions), me = ye.occurrence, nt = _e(ye), rt = qn(nt), _t = rt.queue, St = Te && l ? l.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !Jn(I))
  ), Ht = St.filter((I) => y.includes(I.id)), Re = me.targetMode === "selected" && me.performerIds.length === 1, st = Yc(
    ye,
    s && Re ? me.performerIds[0] : null,
    X
  ), Fe = No(ye.view.objectFilter), ze = Na(
    s ? [...ti(St), ...me.conditionTagIds, ...Fe] : []
  ), rn = ve(() => wc(ze), [ze]), $e = (I) => p[I] ?? ze[I] ?? { id: I, name: `Tag ${I}` }, un = JSON.stringify(
    Object.fromEntries(
      Fe.flatMap((I) => {
        var J;
        const U = (J = ze[I]) == null ? void 0 : J.name;
        return U ? [[String(I), U]] : [];
      })
    )
  ), $t = ve(
    () => qo(ye.view.objectFilter, JSON.parse(un)),
    [ye.view.objectFilter, un]
  );
  ee(() => {
    var I, U, J;
    s && ((I = ie.current) == null || I.showModal(), (J = (U = ie.current) == null ? void 0 : U.querySelector(".dq-batch-answer input")) == null || J.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var we;
      const U = ie.current, J = document.activeElement;
      if (!U || J && J !== document.body && U.contains(J)) return;
      (we = (d === "answers" ? U.querySelector(".dq-batch-answer input:checked") ?? U.querySelector(".dq-batch-answer input") : U.querySelector("[data-batch-focus]")) ?? W.current) == null || we.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, d, k, l]), ee(() => {
    if (s || t || !se.current) return;
    const I = requestAnimationFrame(() => {
      const U = S.current;
      if (!se.current || !U || U.disabled) return;
      se.current = !1;
      const J = document.activeElement;
      (!J || J === document.body) && U.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || me.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), xf(me.performerIds.slice(0, is), I.signal).then((U) => {
      I.signal.aborted || P(U);
    }).catch(() => {
    }), () => I.abort();
  }, [s, me.targetMode, JSON.stringify(me.performerIds)]), ee(
    () => () => {
      var I;
      E.current = !0, (I = Z.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!k) return;
    const I = (U) => {
      U.preventDefault(), U.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [k]);
  function Ot() {
    f("answers"), h(null), m({}), _(null), w(!1), N([]), ae(""), B(""), L(!1), M(null);
  }
  function We() {
    ue.current || (c(!1), G.current.onClose(ce.current), ce.current = !1, Ot(), se.current = !0);
  }
  function fn(I, U) {
    N(
      (J) => U ? [...J, I] : J.filter((de) => de !== I)
    ), h(null), m({}), ae(""), B(""), L(!1), M(null);
  }
  function kt() {
    f("answers"), M(null), ae("");
  }
  function Zn() {
    f("preview"), l || Sn();
  }
  function jt() {
    var I;
    E.current = !0, (I = Z.current) == null || I.abort(), ae("Stopping after in-flight operations settle…");
  }
  function Mt(I) {
    M(
      (U) => (U == null ? void 0 : U.group) === I.group && U.reason === I.reason ? null : I
    );
  }
  const yt = (I, U) => (V == null ? void 0 : V.group) === I && V.reason === U;
  async function Sn() {
    if (!Ht.length || ue.current) return;
    ue.current = !0, O(!0), B(""), L(!1), ae("Loading all matching occurrences…"), h(null), m({}), M(null);
    const I = new AbortController();
    Z.current = I;
    try {
      const U = await Cf(
        e,
        Ht,
        I.signal,
        (de) => ae(`Loaded ${de.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const J = {};
      for (const de of U.entries)
        for (const we of de.before.applications ?? [])
          J[we.tag.id] = we.tag;
      m(J), h(U), ae("Preview ready. No tags have been changed.");
    } catch (U) {
      B(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : U instanceof Error ? U.message : String(U)
      ), L(!I.signal.aborted && U instanceof zc), ae("");
    } finally {
      ue.current = !1, O(!1), Z.current = null;
    }
  }
  async function xn(I) {
    if (!l || ue.current) return;
    const U = (I === "undo" ? Qc(l) : Jc(l, I === "retry")).length;
    ue.current = !0, E.current = !1, ce.current = !0, O(!0), f("run"), B(""), _({ kind: I, total: U, done: 0, stopped: !1 }), ae(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const J = () => _((we) => we && { ...we, done: we.done + 1 });
    let de = !1;
    try {
      I === "undo" ? await Rf(l, () => E.current, J) : await If(l, v, () => E.current, J, I === "retry"), ae(
        E.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (we) {
      de = !0, ae(""), B(we instanceof Error ? we.message : String(we));
    } finally {
      ue.current = !1;
      const we = E.current || de;
      _((De) => De && { ...De, stopped: we }), O(!1), Y((De) => De + 1);
    }
  }
  const he = (l == null ? void 0 : l.entries) ?? [], Ut = ve(
    () => new Map(
      ((l == null ? void 0 : l.entries) ?? []).map((I) => [
        I.item.key,
        Ja(I.before.ids, l.action, l.categories, v)
      ])
    ),
    [l, v]
  ), Jt = (I) => Ut.get(I.item.key), pn = (I) => Gr(I.before.ids, Jt(I).desired), hn = (I) => {
    const U = pn(I);
    return I.status === "pending" && (U.added.length > 0 || U.removed.length > 0);
  }, Le = (I) => I.conflict || Jt(I).kept.length > 0 || Jt(I).replaced.length > 0, wt = ve(() => {
    const I = (l == null ? void 0 : l.entries) ?? [];
    return {
      willChange: I.filter(hn).length,
      correct: I.filter((U) => U.status === "unchanged").length,
      different: I.filter(Le).length,
      hosts: new Set(I.map((U) => U.item.media.id)).size,
      added: [...new Set(I.flatMap((U) => pn(U).added))],
      removed: [...new Set(I.flatMap((U) => pn(U).removed))]
    };
  }, [Ut]), le = ve(
    () => ((l == null ? void 0 : l.entries) ?? []).filter((I) => I.item.media.date).sort((I, U) => I.item.media.date.localeCompare(U.item.media.date)),
    [l]
  ), j = Te ? Df(he) : null, Oe = (I) => Ve.keys[ye.actions.findIndex((U) => U.id === I)] ?? "", Ft = (I) => kr(I, rn, [], r), er = ua(me.condition) && me.includeSubtags !== !1 && me.conditionTagIds.length > 0, re = le[0], He = le.length > 1 ? le[le.length - 1] : void 0, ft = (I) => `/${nt}/${I.item.media.id}`, at = Re ? D[0] : void 0, Et = ve(
    () => n ? uc(
      n,
      st.summary ? lo(
        Co(st.summary, ye.actions, r ?? Ri)
      ) : []
    ) : [],
    [n, st.summary, ye.actions, r]
  ), tr = nu(Ht, Et, r ?? Ri), Ye = n ?? [], ct = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: hn },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Le }
  };
  function mn() {
    const I = Pf[me.condition], U = !!I && me.conditionTagIds.length > 0, J = me.performerIds.slice(0, is), de = String(ye.view.filter.q ?? "").trim(), we = me.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Zi(me) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : me.targetMode === "selected" ? /* @__PURE__ */ u(pe, { children: [
        J.map((De, Se) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Ur, { performer: { id: De, name: D[Se] ?? "" } }),
          D[Se] ?? "…"
        ] }, De)),
        me.performerIds.length > J.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (me.performerIds.length - J.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ u(pe, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              da,
              {
                filter: {},
                objectFilter: me.performerFilter,
                criteriaDefinitions: Ji,
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
        U ? I : Yi[me.condition],
        U && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: vr(me.conditionTagIds.map($e)).map((De) => /* @__PURE__ */ a(zt, { tag: De }, De.id)) })
      ] }),
      U && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: me.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ua(me.condition) && me.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: we, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          we
        ] })
      ] }),
      de && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        de,
        "”"
      ] }),
      Object.keys(ye.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${_t} filters`,
          children: /* @__PURE__ */ a(
            da,
            {
              filter: ye.view.filter,
              objectFilter: $t,
              criteriaDefinitions: nt === "audio" ? Ts : Qa,
              customFieldEntityType: nt,
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
  function Ze(I, U, J = !0) {
    if (!I.length) return null;
    const de = /* @__PURE__ */ a("strong", { children: at || "This performer" }), we = J ? `Check the earliest and latest ${rt.many} before applying, or narrow the batch with a date filter.` : "", De = I.every((Se) => Se.tagIds === null && !Se.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        De ? /* @__PURE__ */ u("p", { children: [
          de,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Se) => Se.flags).join(", ") }),
          ".",
          " ",
          we
        ] }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("p", { children: [
            de,
            " needs attention where the chosen answers apply.",
            we && ` ${we}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Se) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Se.tagIds === null ? "Whole review" : Se.name }),
            ":",
            " ",
            uo(Se).join("; ")
          ] }, Se.key)) })
        ] }),
        U && re && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: ft(re), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            sa(re, nt),
            " · ",
            re.item.media.date
          ] }),
          He && /* @__PURE__ */ u("a", { href: ft(He), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            sa(He, nt),
            " · ",
            He.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Pn() {
    const I = tr.filter((J) => J.tagIds === null), U = tr.filter((J) => J.tagIds !== null);
    return /* @__PURE__ */ u(pe, { children: [
      mn(),
      Ze(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${Re ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: St.map((J, de) => {
            const we = Oe(J.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(J.id),
                  "aria-labelledby": `${ge}-answer-${de}`,
                  "aria-describedby": `${ge}-effect-${de}`,
                  onChange: (De) => fn(J.id, De.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: we && /* @__PURE__ */ a(bt, { binding: we, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ge}-answer-${de}`,
                    className: "dq-batch-answer-label",
                    title: J.label,
                    children: J.label
                  }
                ),
                /* @__PURE__ */ a(cs, { id: `${ge}-effect-${de}`, parts: Ft(J) })
              ] })
            ] }, J.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: Ze(U, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Ui,
            {
              ...st,
              mediaKind: nt,
              actions: ye.actions,
              trees: r,
              flags: Ye,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function an(I) {
    const U = wt, J = V && os.has(V.group) ? V.group : null, de = J ? he.filter(ct[J].test) : [], we = (De) => {
      const Se = Jt(De), je = Se.skipped ? Gr(
        De.before.ids,
        Ja(De.before.ids, I.action, I.categories, !0).desired
      ) : pn(De), An = !je.added.length && !je.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Se.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        An ? !Se.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ls, { added: je.added, removed: je.removed, tag: $e }),
        Se.kept.map((Ae, Ne) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          vr(Ae.existing.map($e)).map((Ke) => /* @__PURE__ */ a(zt, { tag: Ke }, Ke.id)),
          " ",
          "instead of",
          " ",
          vr(Ae.tagIds.map($e)).map((Ke) => /* @__PURE__ */ a(zt, { tag: Ke }, Ke.id))
        ] }, Ne))
      ] });
    };
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            oa,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${U.hosts.toLocaleString()} ${U.hosts === 1 ? _t : `${_t}s`}`,
              pressed: yt("matching"),
              onToggle: () => Mt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: U.willChange,
              label: "will change",
              tone: "add",
              pressed: yt("change"),
              onToggle: () => Mt({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: U.correct,
              label: "already correct, no write",
              pressed: yt("correct"),
              onToggle: () => Mt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: U.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: yt("different"),
              onToggle: () => Mt({ group: "different" })
            }
          )
        ] }),
        de.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: ct[J].title,
            entries: de,
            mediaKind: nt,
            resultHeading: "Planned change",
            describe: we
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: re ? `Dates ${re.item.media.date}${He ? ` to ${He.item.media.date}` : ""}` : "No dates" }),
          re && /* @__PURE__ */ a(
            "a",
            {
              href: ft(re),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${rt.one}, ${re.item.media.date}`,
              title: sa(re, nt),
              children: "Open earliest"
            }
          ),
          He && /* @__PURE__ */ a(
            "a",
            {
              href: ft(He),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${rt.one}, ${He.item.media.date}`,
              title: sa(He, nt),
              children: "Open latest"
            }
          ),
          le.length < he.length && /* @__PURE__ */ u("span", { children: [
            (he.length - le.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (U.added.length > 0 || U.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            ls,
            {
              added: U.added,
              removed: U.removed,
              tag: $e,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      U.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
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
          er ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function kn() {
    return /* @__PURE__ */ u(pe, { children: [
      mn(),
      Ze(tr, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${Re ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${ge}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ge}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: kt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Ht.map((I) => {
            const U = Oe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                U && /* @__PURE__ */ a(bt, { binding: U, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(cs, { parts: Ft(I) })
            ] }, I.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ a(
          Ui,
          {
            ...st,
            mediaKind: nt,
            actions: ye.actions,
            trees: r,
            flags: Ye,
            className: "dq-batch-card"
          }
        )
      ] }),
      k ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : l && an(l)
    ] });
  }
  function on(I) {
    const U = Q ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, J = U.kind === "apply" ? he.length - I.counts.pending : U.done, de = U.kind === "apply" ? he.length : U.total, we = k ? U.kind === "undo" ? "Undoing batch…" : U.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : U.kind === "undo" ? U.stopped ? "Undo stopped" : "Undo finished" : U.stopped ? "Stopped" : "Finished", De = de ? Math.round(J / de * 100) : 100, Se = V && !os.has(V.group) ? V.group : null, je = (Ae) => ss.find((Ne) => Ne.status === Ae).label, An = Se ? he.filter(
      (Ae) => Ae.status === Se && (!V.reason || Ae.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: we }),
          /* @__PURE__ */ u("span", { children: [
            J.toLocaleString(),
            " of ",
            de.toLocaleString(),
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
            "aria-valuemax": de,
            "aria-valuenow": J,
            children: /* @__PURE__ */ a("span", { style: { width: `${De}%` } })
          }
        ),
        !k && U.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (U.total - I.recorded).toLocaleString(),
          " of",
          " ",
          U.total.toLocaleString(),
          " ",
          U.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ss.map((Ae) => /* @__PURE__ */ a(
          oa,
          {
            value: I.counts[Ae.status],
            label: Ae.label,
            tone: Ae.tone,
            pressed: yt(Ae.status),
            onToggle: () => Mt({ group: Ae.status })
          },
          Ae.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((Ae) => {
          const Ne = yt(Ae.status, Ae.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              Ae.count.toLocaleString(),
              " ",
              Ae.status,
              ": ",
              Ae.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Ne,
                onClick: () => Mt({ group: Ae.status, reason: Ae.error }),
                children: Ne ? "Hide them" : "Show them"
              }
            )
          ] }, `${Ae.status}-${Ae.error}`);
        }) }),
        An.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: V.reason ? `${je(Se)}: ${V.reason}` : `${je(Se)} occurrences`,
            entries: An,
            mediaKind: nt,
            resultHeading: "Result",
            describe: (Ae) => Ae.error ?? je(Ae.status)
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
            onClick: () => void xn("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          ke ? U.stopped || k ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function En() {
    return d === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Ht.length,
        onClick: Zn,
        children: "Preview all matches"
      },
      "preview"
    ) : d === "preview" ? k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: jt, children: "Cancel preview" }, "cancel-preview") : l ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !wt.willChange,
        onClick: () => void xn("apply"),
        children: [
          "Apply to ",
          wt.willChange.toLocaleString(),
          " ",
          wt.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: kt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Sn(),
        children: "Preview again"
      },
      "again"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: jt, children: ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : ke || !j ? null : /* @__PURE__ */ u(Hi, { children: [
      j.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void xn("retry"), children: "Retry failed" }),
      j.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void xn("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ u(Xu, { children: [
    /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: S,
        title: "Apply answers to all matching occurrences",
        disabled: t || !St.length,
        onClick: () => {
          Ot(), i(), c(!0);
        },
        children: [
          /* @__PURE__ */ a(Do, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ u(
      "dialog",
      {
        ref: ie,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ge}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), We();
        },
        onClose: () => {
          var I;
          ue.current ? (I = ie.current) == null || I.showModal() : We();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Do, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ge}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: k,
                onClick: We,
                children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Lf, { step: d }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: W,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": d === "preview" ? "" : void 0,
              "aria-label": `${Bi.find((I) => I.id === d).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  x && /* @__PURE__ */ a("p", { role: "status", children: x }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                d === "answers" ? Pn() : d === "preview" ? kn() : on(j)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            d === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: k, onClick: kt, children: [
              /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
              "Back"
            ] }),
            d === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Ot, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: We, children: "Close" }),
            En()
          ] })
        ]
      }
    )
  ] });
}
const Xc = "data-quality.description-collapsed.v1";
function jf() {
  try {
    return localStorage.getItem(Xc) === "true";
  } catch {
    return !1;
  }
}
function Uf({
  details: e,
  label: t
}) {
  const [n, r] = T(jf), i = vn(() => {
    r((o) => {
      const s = !o;
      try {
        localStorage.setItem(Xc, String(s));
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Dl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Bf = (e) => "";
function Kf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: s = Bf,
  onFocus: c,
  onMore: d,
  onRefresh: f
}) {
  var p;
  const l = e ? e.ranked.slice(0, e.limit) : [], h = !!e && (e.ranked.length > e.limit || (((p = e.candidates[e.cursor]) == null ? void 0 : p.total) ?? 0) > 0);
  return /* @__PURE__ */ u("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ u("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ u("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ u("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: l.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || i,
          onClick: f,
          children: /* @__PURE__ */ a(Zl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: l.map((m) => {
      const y = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, N = s(m.tags);
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => c(m.id),
          children: [
            /* @__PURE__ */ a(Ur, { performer: m }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m.name }),
            N && /* @__PURE__ */ a(On, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: m.count.toLocaleString() })
          ]
        },
        m.id
      );
    }) }),
    h && !t && !n && /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: i,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const Gf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Vf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function zf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function La(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Hf(e, t) {
  const n = Zi(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${La(r, "or")}`,
    includesAll: `has ${La(r, "and")}`,
    excludes: `has none of ${La(r, "or")}`,
    excludesAll: `missing ${La(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Jf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, d] = T(null), f = R(null), l = R(null), h = tt(), p = Hr(e.conditionTagIds), m = Hf(e, p);
  qt(() => {
    const w = f.current;
    if (!o || !w) return;
    const k = () => d(zf(w));
    k(), window.addEventListener("resize", k);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const B of F) B && (O == null || O.observe(B));
    return () => {
      window.removeEventListener("resize", k), O == null || O.disconnect();
    };
  }, [o]), ee(() => {
    var k, O;
    if (!o) return;
    const w = (k = l.current) == null ? void 0 : k.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (O = l.current) == null || O.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== l.current || w.defaultPrevented || nn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && l.current) {
        const O = [...l.current.querySelectorAll(Vf)].filter((L) => L.closest('[role="dialog"]') === l.current).sort(
          (L, x) => L.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const F = O[0], B = O[O.length - 1], C = document.activeElement;
        w.shiftKey && (C === F || C === l.current) ? (w.preventDefault(), B.focus()) : !w.shiftKey && C === B && (w.preventDefault(), F.focus());
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
        "aria-controls": o ? h : void 0,
        title: m,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(xs, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: m }),
          /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ u(
        "div",
        {
          ref: l,
          id: h,
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Gf.map(({ mode: w, label: k }) => /* @__PURE__ */ a(
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
                Qn,
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
                  da,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Ji,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ u("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
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
                  children: Xi.map((w) => /* @__PURE__ */ a("option", { value: w, children: Yi[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ a(
                  Qn,
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
                  ua(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
function Ua(e) {
  const {
    page: t,
    perPage: n,
    sort: r,
    direction: i,
    sorts: o,
    seed: s,
    ...c
  } = e.view.filter, {
    performerFlags: d,
    flagPerformerTagIds: f,
    ...l
  } = e.occurrence;
  return JSON.stringify([
    e.entityType,
    c,
    e.view.objectFilter,
    e.view.searchMode,
    l
  ]);
}
function Qf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    _e(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wf(e, t) {
  const n = _e(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const s of i.performerIds) {
      const c = await xd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && o.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let d = 1; ; d++) {
      const f = await be(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Fn({
              findFilter: {
                page: d,
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
      if (o.push(...f.items.map(r)), d * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return o.sort((s, c) => c.total - s.total || s.id - c.id);
}
function Zc(e, t, n) {
  const r = ko(e, [t]);
  return Zs(r, r.view.filter, n);
}
function el(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Ki(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function Yf(e, t, n, r, i = {}) {
  const o = Ua(e), s = Qf(e), c = Kc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Wf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, l = [...d.ranked];
  let h = d.cursor, p = !1;
  const m = (y) => ({
    ...d,
    cursor: h,
    ranked: [...l],
    limit: n,
    complete: !y && Ki(f, h, l, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !p && !Ki(f, h, l, n); ) {
          r.throwIfAborted();
          const N = f[h++], v = await Zc(e, N.id, r);
          v > 0 && el(l, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, m(!0));
        }
      })
    );
  } catch (y) {
    throw p = !0, y;
  }
  return r.throwIfAborted(), m(!1);
}
function Xf(e, t, n) {
  const r = e.candidates.findIndex((o) => o.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const i = e.ranked.filter((o) => o.id !== t);
  return n > 0 && el(i, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: i,
    complete: Ki(e.candidates, e.cursor, i, e.limit)
  };
}
const Gi = /* @__PURE__ */ new Map();
function Zf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function tl(e, t) {
  const n = Zf(t);
  return Gi.set(e, n), n;
}
function ep(e) {
  const [t, n] = T(null);
  if (ee(() => {
    if (e === null || Gi.has(e)) return;
    const r = new AbortController();
    return be(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = tl(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Gi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var wi = { exports: {} }, us;
function tp() {
  return us || (us = 1, (function(e) {
    var t = (function() {
      var n = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", o = {};
      function s(d, f) {
        if (!o[d]) {
          o[d] = {};
          for (var l = 0; l < d.length; l++)
            o[d][d.charAt(l)] = l;
        }
        return o[d][f];
      }
      var c = {
        compressToBase64: function(d) {
          if (d == null) return "";
          var f = c._compress(d, 6, function(l) {
            return r.charAt(l);
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
        decompressFromBase64: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 32, function(f) {
            return s(r, d.charAt(f));
          });
        },
        compressToUTF16: function(d) {
          return d == null ? "" : c._compress(d, 15, function(f) {
            return n(f + 32);
          }) + " ";
        },
        decompressFromUTF16: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 16384, function(f) {
            return d.charCodeAt(f) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(d) {
          for (var f = c.compress(d), l = new Uint8Array(f.length * 2), h = 0, p = f.length; h < p; h++) {
            var m = f.charCodeAt(h);
            l[h * 2] = m >>> 8, l[h * 2 + 1] = m % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(d) {
          if (d == null)
            return c.decompress(d);
          for (var f = new Array(d.length / 2), l = 0, h = f.length; l < h; l++)
            f[l] = d[l * 2] * 256 + d[l * 2 + 1];
          var p = [];
          return f.forEach(function(m) {
            p.push(n(m));
          }), c.decompress(p.join(""));
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(d) {
          return d == null ? "" : c._compress(d, 6, function(f) {
            return i.charAt(f);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(d) {
          return d == null ? "" : d == "" ? null : (d = d.replace(/ /g, "+"), c._decompress(d.length, 32, function(f) {
            return s(i, d.charAt(f));
          }));
        },
        compress: function(d) {
          return c._compress(d, 16, function(f) {
            return n(f);
          });
        },
        _compress: function(d, f, l) {
          if (d == null) return "";
          var h, p, m = {}, y = {}, N = "", v = "", w = "", k = 2, O = 3, F = 2, B = [], C = 0, L = 0, x;
          for (x = 0; x < d.length; x += 1)
            if (N = d.charAt(x), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (h = 0; h < F; h++)
                    C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                  for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
                } else {
                  for (p = 1, h = 0; h < F; h++)
                    C = C << 1 | p, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = 0;
                  for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
                }
                k--, k == 0 && (k = Math.pow(2, F), F++), delete y[w];
              } else
                for (p = m[w], h = 0; h < F; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              k--, k == 0 && (k = Math.pow(2, F), F++), m[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (h = 0; h < F; h++)
                  C = C << 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++;
                for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              } else {
                for (p = 1, h = 0; h < F; h++)
                  C = C << 1 | p, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = 0;
                for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
              }
              k--, k == 0 && (k = Math.pow(2, F), F++), delete y[w];
            } else
              for (p = m[w], h = 0; h < F; h++)
                C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
            k--, k == 0 && (k = Math.pow(2, F), F++);
          }
          for (p = 2, h = 0; h < F; h++)
            C = C << 1 | p & 1, L == f - 1 ? (L = 0, B.push(l(C)), C = 0) : L++, p = p >> 1;
          for (; ; )
            if (C = C << 1, L == f - 1) {
              B.push(l(C));
              break;
            } else L++;
          return B.join("");
        },
        decompress: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 32768, function(f) {
            return d.charCodeAt(f);
          });
        },
        _decompress: function(d, f, l) {
          var h = [], p = 4, m = 4, y = 3, N = "", v = [], w, k, O, F, B, C, L, x = { val: l(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            h[w] = w;
          for (O = 0, B = Math.pow(2, 2), C = 1; C != B; )
            F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 1:
              for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 2:
              return "";
          }
          for (h[3] = L, k = L, v.push(L); ; ) {
            if (x.index > d)
              return "";
            for (O = 0, B = Math.pow(2, y), C = 1; C != B; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (L = O) {
              case 0:
                for (O = 0, B = Math.pow(2, 8), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[m++] = n(O), L = m - 1, p--;
                break;
              case 1:
                for (O = 0, B = Math.pow(2, 16), C = 1; C != B; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[m++] = n(O), L = m - 1, p--;
                break;
              case 2:
                return v.join("");
            }
            if (p == 0 && (p = Math.pow(2, y), y++), h[L])
              N = h[L];
            else if (L === m)
              N = k + k.charAt(0);
            else
              return null;
            v.push(N), h[m++] = k + N.charAt(0), p--, k = N, p == 0 && (p = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(wi)), wi.exports;
}
var nl = tp();
function Wn(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => Wn(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && Wn(n[s], r[s])
  );
}
function np(e) {
  var c, d, f;
  const [t, n] = T({}), [r, i] = T(""), o = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return ee(() => {
    let l = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (h) => [h, await ei([h])]
      )
    ).then((h) => {
      l && n(Object.fromEntries(h));
    }).catch(() => {
      l && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      l = !1;
    };
  }, [s]), { ids: t, error: r };
}
function rl(e, t, n) {
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
          var d;
          return c !== s.id && ((d = n[c]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function rp(e, t, n) {
  var s;
  const r = rl(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((c) => c.name) : [],
    tags: o.includes("tags") && ((s = i == null ? void 0 : i.annotationParents) != null && s.length) ? r.tags ?? [] : null
  };
}
function ap({
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
  ), d = s.every((v) => r[v]), f = Er(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!d || c.has(v))
  ), l = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (c.has(w.id)) {
        const k = l.get(w.id) ?? { name: w.name, count: 0 };
        k.count++, l.set(w.id, k);
      }
  const h = f.filter((v) => !l.has(v)), p = Hr(h);
  for (const v of h)
    l.set(v, {
      name: p[v] === void 0 ? "…" : p[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const m = [...l].sort((v, w) => v[1].name.localeCompare(w[1].name));
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
          disabled: i,
          onClick: () => o(v),
          children: [
            k && /* @__PURE__ */ a(Vr, { "aria-hidden": "true" }),
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
function ip({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var h, p;
  const c = ((h = e.presentation) == null ? void 0 : h.filterBins) ?? [], d = Er(e.view.objectFilter, t, c).bins, f = op(e, t, n, o);
  if (!c.length) return null;
  const l = /* @__PURE__ */ new Map();
  for (const m of c) {
    const y = ((p = m.group) == null ? void 0 : p.trim()) ?? "";
    l.set(y, [...l.get(y) ?? [], m]);
  }
  return /* @__PURE__ */ a(pe, { children: [...l].map(([m, y]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": m ? `${m} bins` : "Filter bins",
      children: [
        m && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: m }),
        y.map((N) => {
          const v = d.includes(N.key), w = v ? r : f[N.key];
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
                v && /* @__PURE__ */ a(Vr, { "aria-hidden": "true" }),
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
function op(e, t, n, r) {
  var l;
  const [i, o] = T({}), { page: s, ...c } = n, d = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((l = e.presentation) == null ? void 0 : l.filterBins) ?? [],
    t,
    c
  ]), f = R(null);
  return ee(() => {
    var y, N;
    if (r || f.current === d) return;
    f.current = d, o({});
    let h = 0;
    const p = new AbortController(), m = Er(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (h++, Zs(il(e, v.key, t), n, p.signal).then((w) => {
        p.signal.aborted || o((k) => ({ ...k, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        p.signal.aborted || h--;
      }));
    return () => {
      h > 0 && (f.current = null), p.abort();
    };
  }, [d, r]), i;
}
function yr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sp(e) {
  if (!yr(e) || Object.keys(e).length !== 1 || !yr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !yr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function al(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function cp(e, t) {
  const n = t.find(
    (r) => Wn(e, al(r.filter))
  );
  return n ? n.key : sp(e);
}
function Er(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && Wn(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!yr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, d = cp(c.at(-1), n);
    if (d == null || c.length > 3) break;
    let f = {}, l = null, h = !0;
    for (const [p, m] of c.slice(0, -1).entries())
      !yr(m) || Object.keys(m).length !== 1 ? h = !1 : p === 0 && yr(m.filter) && Object.keys(m.filter).length ? f = m.filter : !l && yr(m.group) ? l = m.group : h = !1;
    if (!h) break;
    i.unshift(d), r = l ? { ...f, _filterExpression: l } : f;
  }
  return { base: r, bins: i };
}
function il(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Er(e.view.objectFilter, n, r), s = (l) => {
    var h, p;
    return ((p = (h = r.find((m) => m.key === l)) == null ? void 0 : h.group) == null ? void 0 : p.trim()) || null;
  }, c = s(t);
  return (o.includes(t) ? o.filter((l) => l !== t) : [...o.filter((l) => !c || s(l) !== c), t]).reduce(lp, { ...e, view: { ...e.view, objectFilter: i } });
}
function lp(e, t) {
  var o, s;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const c = (s = (o = e.presentation) == null ? void 0 : o.filterBins) == null ? void 0 : s.find((d) => d.key === t);
    if (!c || !Object.keys(c.filter).length) return e;
    n = al(c.filter);
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
const ni = [
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
], dp = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Sr(e) {
  const t = Ie(e) ? e.occurrence : void 0;
  return {
    filter: Vt({
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
function fs(e) {
  return nl.compressToEncodedURIComponent(JSON.stringify(e));
}
function ps(e) {
  if (!e) return {};
  const t = e.startsWith("{") ? e : nl.decompressFromEncodedURIComponent(e), n = t ? JSON.parse(t) : null;
  if (!n || typeof n != "object" || Array.isArray(n))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return n;
}
function Vi(e, t) {
  let n;
  if (Ie(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ni.some((c) => c !== "performer" && t.has(c))) {
    const c = Sr(e);
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
    const c = t.get("sorts").split(",").map((d) => {
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (c.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = c, i.sort = c[0].key, i.direction = c[0].direction;
  }
  let o;
  if (Ie(e) && (o = {
    ...dp,
    ...ps(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Xi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Vt(i, _e(e)),
      objectFilter: ps(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const hs = { dataQualityOpenedFromList: !0 };
function ol() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function sl(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...hs }, "", e) : window.history.replaceState(ol() ? { ...hs } : null, "", e);
}
function la(e, t) {
  const n = new URLSearchParams(window.location.search);
  ni.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", fs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", fs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), sl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function Nn(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Ie(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function Nr(e) {
  const t = e;
  return Nn(t, Sr(t));
}
function ms(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !Wn(
    JSON.parse(Vn(Nn(e, t))),
    JSON.parse(Vn(Nn(e, Sr(e))))
  );
}
function To(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return Pe(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function cl(e, t) {
  if (Pe(e) !== "video") return e;
  const { base: n, bins: r } = Er(
    e.view.objectFilter,
    t.view.objectFilter,
    To(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Da(e, t) {
  if (Pe(e) !== "video") return t;
  const { base: n, bins: r } = Er(
    t.objectFilter,
    e.view.objectFilter,
    To(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function gs(e, t) {
  return !t || !Ie(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function vi(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const tn = (e) => e instanceof Error ? e.message : "Request failed.", Ni = 50, up = [], bs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function fp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Ul(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? $s(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function pp({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ls, {}) : /* @__PURE__ */ a(Ya, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Ti(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function hp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: s
}) {
  const c = !!n && !r, d = go(t), f = n ? null : d, l = e == null ? void 0 : e.absent, h = Na(
    ve(() => [...o, ...l ?? []], [o, l])
  ), p = (Q) => h[Q] ?? { id: Q, name: h[Q] === void 0 ? "…" : "Unavailable tag" }, m = (Q) => vr(Q.map(p)), y = f && e ? co(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((Q) => Q.id)), w = new Set(y == null ? void 0 : y.removed), k = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
    "absent"
  ] }), B = m((y == null ? void 0 : y.added) ?? []), C = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((Q) => !v.has(Q))), L = c ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(L, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((Q) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(Q.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Ba, { "aria-hidden": "true" }),
          O.has(Q.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(zt, { tag: Q })
          ] }) : /* @__PURE__ */ a(zt, { tag: Q })
        ]
      },
      Q.id
    )) })
  ] }), ae = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(pe, { children: [
      N.length || B.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (Q) => w.has(Q.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(zt, { tag: Q })
            ] }),
            k.has(Q.id) && F
          ] }, Q.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(zt, { tag: Q }) }, Q.id)
        ),
        B.map((Q) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(zt, { tag: Q })
        ] }) }, `added-${Q.id}`)),
        C.map((Q) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(zt, { tag: Q }) }),
          F
        ] }, `absent-${Q.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(pe, { children: [
    !c && ae,
    n,
    c && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function mp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    uo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function gp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: d,
  onStayOnTapChange: f
}) {
  var ea;
  const l = _e(e), h = qn(l), p = l === "audio" ? "Audio" : "Scene", m = (b) => {
    var A;
    return b.title || ((A = b.files[0]) == null ? void 0 : A.basename) || p;
  }, y = (b) => `${b.occurrence ? `${b.occurrence.performer.name} — ` : ""}${m(b.media)}`, N = R(null), v = R("");
  if (!N.current)
    try {
      N.current = Vi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (b) {
      v.current = tn(b), N.current = { query: Sr(e), startAtEnd: !1 };
    }
  const [w, k] = T(null), [O, F] = T(""), B = R(null), C = R(null), L = R(null), x = R(null), [ae, Q] = T(!!v.current), _ = R(0), [V, M] = T(N.current.query), D = R(V);
  D.current = V;
  const [P, X] = T(0), Y = R(N.current.startAtEnd), [ie, W] = T([]), [S, se] = T(null), E = R(null), [Z, ce] = T(null), [ue, G] = T(0), ge = ve(() => {
    if (!S) return null;
    const b = ie.findIndex((A) => A.key === S.key);
    return b < 0 ? null : ie.slice(b + 1).find((A) => A.media.id !== S.media.id) ?? null;
  }, [S, ie]), [Te, ke] = T(0), [ye, Ve] = T(!1), [me, nt] = T(!1), rt = R(!1), _t = R(!0), St = R(null);
  ee(() => (_t.current = !0, () => {
    _t.current = !1;
  }), []);
  const [Ht, Re] = T(v.current), [st, Fe] = T(""), [ze, rn] = T(null), [$e, un] = T(!1), [$t, Ot] = T([]), We = R([]), fn = R(null), kt = R(null), Zn = R(null);
  ee(() => {
    var b, A;
    $e && ((A = (b = Zn.current) == null ? void 0 : b.querySelector("input")) == null || A.focus());
  }, [$e]);
  const [jt, Mt] = T(!1), [yt, Sn] = T(!1), xn = qa(), [he, Ut] = T(!1), Jt = d ?? he, pn = f ?? Ut;
  ee(() => {
    if (ye || jt || !kt.current) return;
    const b = requestAnimationFrame(() => {
      if (document.querySelector(bs)) return;
      const A = kt.current;
      kt.current = null;
      const K = document.activeElement;
      K && K !== document.body || A != null && A.isConnected && !A.disabled && A.focus();
    });
    return () => cancelAnimationFrame(b);
  }, [ye, jt, P]);
  const [hn, Le] = T([]), [wt, le] = T({}), j = R(null), [Oe, Ft] = T({});
  ee(() => {
    let b = !0;
    return Promise.all(
      No(V.objectFilter).map(
        async (A) => [
          String(A),
          (await be(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      b && Ft(Object.fromEntries(A));
    }).catch(() => {
    }), () => {
      b = !1;
    };
  }, [V.objectFilter]);
  const er = ve(
    () => qo(V.objectFilter, Oe),
    [Oe, V.objectFilter]
  ), re = R(0), He = R(e);
  He.current = e;
  const ft = w ?? e, at = ve(
    () => Nn(ft, V),
    [ft, V]
  ), Et = ve(
    () => gs(at, V.performerFocus),
    [at, V.performerFocus]
  ), tr = R(Et);
  tr.current = Et;
  const Ye = R(at);
  Ye.current = at;
  const [ct, mn] = T("items"), [Ze, Pn] = T(null), an = R(null), kn = R("");
  function on(b) {
    const A = typeof b == "function" ? b(an.current) : b;
    an.current = A, Pn(A);
  }
  const [En, I] = T(!1), [U, J] = T(null), de = R(null), we = Ie(at) ? Ua(at) : "", [De, Se] = T(0), [je, An] = T(null);
  ee(() => () => {
    var b;
    return (b = de.current) == null ? void 0 : b.controller.abort();
  }, []), ee(() => {
    const b = de.current;
    !b || b.signature === we || (b.controller.abort(), de.current = null, I(!1));
  }, [we]), ee(() => {
    var K;
    const b = an.current;
    if (ct !== "performers" || !we || ((K = de.current) == null ? void 0 : K.signature) === we || kn.current === we || (b == null ? void 0 : b.signature) === we && b.complete)
      return;
    const A = (b == null ? void 0 : b.signature) === we ? b : null;
    cn(b, (A == null ? void 0 : A.limit) ?? Ni);
  }, [ct, we, Ze, U, En]);
  const Ae = V.performerFocus;
  ee(() => {
    if (!Ae) {
      An(null);
      return;
    }
    let b = !0;
    return be(`/api/performers/${Ae}`).then((A) => {
      const K = tl(Ae, A.tags);
      b && An({ id: Ae, name: A.name, tags: K });
    }).catch(() => {
    }), () => {
      b = !1;
    };
  }, [Ae]);
  const Ne = JSON.stringify(
    Ie(at) ? Us(at.occurrence) : []
  ), Ke = ve(() => JSON.parse(Ne), [Ne]), Je = ve(() => Zd(Ke), [Ke]), nr = sc(Je), Cn = Na(Je), Jr = (b) => {
    var A;
    return ((A = Cn[b]) == null ? void 0 : A.name) ?? (Cn[b] === null ? "Unavailable tag" : "…");
  }, Qr = (b) => ({
    name: Jr(b),
    tagIds: nr.get(b) ?? [b],
    resolved: nr.has(b)
  }), Ar = Yc(
    Ie(at) ? at : null,
    Ae ?? null,
    De
  ), At = ms(e, V), Qt = ms(e, Da(e, V)), xt = me || ye || $e, Pt = Number(V.filter.page);
  function Ct(b, A = !1) {
    rt.current || (v.current = "", Y.current = A, D.current = b, M(b), ke(0), Ve(!0), A || la(e.id, b), X((K) => K + 1));
  }
  function et() {
    if (rt.current = !1, nt(!1), _t.current && St.current) {
      const b = St.current;
      St.current = null, Ct(b.query, b.startAtEnd);
    }
  }
  ee(() => {
    const b = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const A = Vi(
            He.current,
            new URLSearchParams(window.location.search)
          );
          rt.current ? St.current = A : Ct(A.query, A.startAtEnd);
        } catch (A) {
          Re(tn(A));
        }
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, [e.id]), ee(() => (r(me || ye || $e || !!w), () => r(!1)), [me, ye, $e, !!w, r]);
  async function it(b, A, K) {
    if (Ie(b)) {
      const fe = await Gc(
        b,
        j.current,
        A,
        K
      );
      return {
        items: fe.items.map((Ee) => ({
          key: Ee.key,
          media: Ee.media,
          occurrence: Ee
        })),
        totalCount: fe.totalCount
      };
    }
    const H = await _r(
      b,
      { ...b.view.filter, page: A },
      K
    );
    return {
      items: H.items.map((fe) => ({ key: String(fe.id), media: fe })),
      totalCount: H.totalCount
    };
  }
  function Tt(b, A, K, H = !1, fe = !1) {
    if (!_t.current || St.current) return;
    Q(!0), W(
      fe ? b.items : vi(b.items, D.current.startFrom === "end")
    ), ke(b.totalCount), lt(K, H);
    const Ee = {
      ...D.current,
      filter: { ...D.current.filter, page: A }
    };
    D.current = Ee, M(Ee), la(e.id, Ee);
  }
  function lt(b, A = !1) {
    (b == null ? void 0 : b.key) !== (S == null ? void 0 : S.key) && (E.current = null), (b == null ? void 0 : b.media.id) !== (S == null ? void 0 : S.media.id) && ce(A && b ? b.media.id : null), se(b);
  }
  ee(() => {
    if (v.current) return;
    const b = new AbortController();
    x.current = b;
    const A = ++re.current;
    return Ve(!0), Re(""), Fe(""), E.current = null, ce(null), se(null), W([]), un(!1), (async () => {
      const K = gs(
        Nn(He.current, D.current),
        D.current.performerFocus
      );
      j.current = Ie(K) ? await So(K, b.signal) : null;
      let H = Number(K.view.filter.page), fe = await it(K, H, b.signal);
      const Ee = Math.max(
        1,
        Math.ceil(fe.totalCount / Number(K.view.filter.perPage))
      );
      (Y.current || H > Ee) && (H = Ee, fe = await it(K, H, b.signal)), Y.current = !1;
      const Qe = K.view.startFrom === "end" ? -1 : 1;
      for (; Ie(K) && !fe.items.length && H + Qe >= 1 && H + Qe <= Ee && !b.signal.aborted; )
        H += Qe, fe = await it(K, H, b.signal);
      if (A !== re.current || b.signal.aborted) return;
      const Lt = vi(fe.items, K.view.startFrom === "end");
      Tt(fe, H, Lt[0] ?? null);
    })().catch((K) => {
      !b.signal.aborted && A === re.current && Re(tn(K));
    }).finally(() => {
      !b.signal.aborted && A === re.current && (Q(!0), Ve(!1));
    }), () => {
      b.abort(), re.current++;
    };
  }, [P, e.id]), ee(() => {
    if (rn(null), !S) return;
    let b = !0;
    return dn(l, S).then((A) => {
      b && (rn(A), Le(
        Ie(e) ? A.ids.filter((K) => e.occurrence.tagIds.includes(K)) : []
      ));
    }).catch((A) => {
      b && Re(`Could not load current tags. ${tn(A)}`);
    }), () => {
      b = !1;
    };
  }, [S]), ee(() => {
    if (!Ie(e) || e.actions.length)
      return;
    let b = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (A) => [
          A,
          (await be(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      b && le(Object.fromEntries(A));
    }).catch((A) => {
      b && Re(tn(A));
    }), () => {
      b = !1;
    };
  }, [e]);
  async function gn(b = !1, A = !1, K = !1) {
    var Rt;
    if (!S) return;
    const H = ie.findIndex((xe) => xe.key === S.key), fe = V.startFrom === "end" ? -1 : 1, Ee = ((Rt = E.current) == null ? void 0 : Rt.key) === S.key ? E.current : { key: S.key, page: Pt, before: ie.slice(0, H + 1).map((xe) => xe.key), after: ie.slice(H + 1).map((xe) => xe.key) }, Qe = new Set(Ee.after), Lt = new Set(Ee.before), jn = ie.find((xe) => {
      var In;
      return Qe.has(xe.key) || (fe === 1 || Pt < Ee.page) && ((In = E.current) == null ? void 0 : In.key) === S.key && !Lt.has(xe.key);
    });
    if (!b && jn) {
      lt(jn, K);
      return;
    }
    const Ge = b ? Lt : new Set(ie.map((xe) => xe.key));
    let Ce = fe === -1 && !b ? Math.max(1, Pt - 1) : Pt;
    for (; _t.current && !St.current; ) {
      let xe = await it(Et, Ce);
      const In = Math.max(
        1,
        Math.ceil(xe.totalCount / Number(V.filter.perPage))
      );
      Ce > In && (Ce = In, xe = await it(Et, Ce));
      const hr = vi(xe.items, fe === -1), xr = new Map(hr.map((vt) => [vt.key, vt])), Bt = b ? Ee.after.flatMap((vt) => {
        const ra = xr.get(vt);
        return ra ? [ra] : [];
      }) : [], ta = new Set(Bt.map((vt) => vt.key)), na = b ? {
        ...xe,
        items: [
          ...Bt,
          ...hr.filter(
            (vt) => vt.key !== S.key && !ta.has(vt.key)
          )
        ]
      } : xe;
      if (A) {
        E.current = Ee, Tt(na, Ce, S, !1, b);
        return;
      }
      const Pr = fe === -1 && Pt === 1 && !b ? void 0 : na.items.find(
        (vt) => !Ge.has(vt.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(b && fe === -1 && Ce === Ee.page) || Qe.has(vt.key))
      );
      if (Pr || (fe === -1 ? Ce <= 1 : Ce >= In)) {
        Tt(
          na,
          Ce,
          Pr ?? null,
          K,
          b
        ), Pr || Fe(
          xe.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      Ce += fe;
    }
  }
  async function dt(b, A = !1, K = !1, H = !1) {
    if (w || !S || rt.current || ye || $e && !K)
      return;
    const fe = K || H || !!(b != null && b.steps.length);
    if (fe && (!t || !ze) || b && Jn(b) && !n) return;
    const Ee = !A && !K && !H && fe && b !== void 0 && ze !== null && zo(e) && Oi($i(e.actions, Yd(b, ze, Yt))).length > 0;
    rt.current = !0, nt(!0), Re(""), Fe("");
    const Qe = ie.findIndex((Ce) => Ce.key === S.key), Lt = fe && !A && !Ee && Qe >= 0 ? ie[Qe + 1] ?? null : null;
    Lt && (W(
      (Ce) => Ce.filter((Rt) => Rt.key !== S.key)
    ), lt(Lt, !0));
    let jn = !1, Ge = [];
    try {
      if (fe) {
        const Ce = await dn(l, S);
        if (b)
          await Sf(Et, S, b);
        else {
          const xe = H && Ie(e) ? e.occurrence.tagIds.filter((xr) => Ce.ids.includes(xr)) : We.current, hr = Gr(xe, H ? hn : $t);
          await Ao(Et, S, hr);
        }
        const Rt = await dn(l, S);
        Lt || rn(Rt), jn = !0, un(!1), Ee && (Ge = Oi($i(e.actions, Rt))), Fe(
          Ge.length ? `Tags saved. Staying until answered: ${Ge.map((xe) => xe.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (Tn(S.occurrence.performer.id), Se((xe) => xe + 1));
      }
      if (!_t.current || St.current) return;
      fe ? Ge.length || await gn(!0, A, !A) : A || await gn(), A && K && requestAnimationFrame(() => {
        var Ce;
        return (Ce = fn.current) == null ? void 0 : Ce.focus();
      });
    } catch (Ce) {
      if (Re(
        jn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${tn(Ce)}` : fe ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${tn(Ce)}` : `Could not advance. ${tn(Ce)}`
      ), fe && !jn) {
        Lt && (W(ie), ce(null), G((Rt) => Rt + 1), se(S));
        try {
          rn(await dn(l, S));
        } catch {
          rn(null), Re(
            (Rt) => `${Rt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      et();
    }
  }
  const Sa = !$e && !w && !jt && !yt && (S != null || ye || me);
  fo({
    surface: "local",
    enabled: Sa,
    actions: e.actions,
    onAction: (b, A) => {
      const K = e.actions[b];
      K && dt(K, A);
    },
    onFind: () => Sn(!0)
  });
  const Ln = (b) => me || ye || !ze || !!w || !t && b.steps.length > 0 || !n && Jn(b);
  function Wt() {
    !i || w || rt.current || $e || (L.current = document.activeElement, C.current = {
      error: Ht,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: ie,
      current: S,
      total: Te,
      targets: j.current,
      stayedCursor: E.current
    }, k(structuredClone(e)), F(""), Fe(""), Re(""));
  }
  ee(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && ae && !ye && (_.current = o, Wt(), s == null || s());
  }, [o, ye, ae]);
  function sn() {
    k(null), F(""), requestAnimationFrame(() => {
      const b = L.current;
      b != null && b.isConnected && b !== document.body && b.focus();
    });
  }
  function Wr() {
    var A;
    const b = C.current;
    !b || me || ((A = x.current) == null || A.abort(), re.current++, D.current = b.query, M(b.query), W(b.items), se(b.current), ke(b.total), j.current = b.targets, E.current = b.stayedCursor, Ve(!1), Re(b.error), Fe(""), window.history.replaceState(window.history.state, "", b.url), sn());
  }
  async function Cr() {
    if (!w || !i || rt.current) return;
    const b = Nn(
      { ...w, name: w.name.trim() },
      Da(He.current, D.current)
    ), A = pa(b);
    if (A) {
      F(A);
      return;
    }
    rt.current = !0, nt(!0), F("");
    try {
      if (await i(b) === !1) throw new Error("Could not save review.");
      sn(), Fe("Review saved.");
    } catch (K) {
      F(
        "Could not save review. Your edits are still open. " + tn(K)
      );
    } finally {
      et();
    }
  }
  async function ka() {
    if (!i || rt.current) return;
    const b = Da(He.current, D.current), A = Nn(He.current, {
      ...b,
      filter: { ...b.filter, page: 1 }
    });
    rt.current = !0, nt(!0), Re("");
    try {
      if (await i(A) === !1) throw new Error("Could not save review.");
      Fe("Queue saved to this review.");
    } catch (K) {
      Re("Could not save queue. " + tn(K));
    } finally {
      et();
    }
  }
  const qe = V.performerScope, rr = (b) => {
    const { performerFocus: A, ...K } = D.current, H = A && !("targetMode" in b || "performerIds" in b || "performerFilter" in b);
    Ct({
      ...K,
      ...H ? { performerFocus: A } : {},
      filter: { ...K.filter, page: 1 },
      performerScope: { ...qe, ...b }
    });
  };
  async function cn(b, A) {
    var fe;
    const K = Ye.current;
    if (!Ie(K)) return;
    (fe = de.current) == null || fe.controller.abort();
    const H = {
      signature: Ua(K),
      controller: new AbortController()
    };
    de.current = H, kn.current = "", I(!0), J(null);
    try {
      const Ee = await Yf(K, b, A, H.controller.signal, {
        onProgress: (Qe) => {
          de.current === H && on(Qe);
        }
      });
      de.current === H && on(Ee);
    } catch (Ee) {
      de.current === H && !H.controller.signal.aborted && (kn.current = H.signature, J({ signature: H.signature, message: tn(Ee) }));
    } finally {
      de.current === H && (de.current = null, I(!1));
    }
  }
  function Tr() {
    var b;
    (b = de.current) == null || b.controller.abort(), de.current = null, I(!1), on((A) => A && { ...A, partial: !0, complete: !1 });
  }
  async function Tn(b) {
    var H;
    const A = Ye.current;
    if (!Ie(A)) return;
    if (de.current) {
      Tr();
      return;
    }
    const K = Ua(A);
    if (!(((H = an.current) == null ? void 0 : H.signature) !== K || an.current.partial))
      try {
        const fe = await Zc(A, b);
        if (de.current) {
          Tr();
          return;
        }
        on(
          (Ee) => (Ee == null ? void 0 : Ee.signature) === K ? Xf(Ee, b, fe) : Ee
        );
      } catch {
        on(
          (fe) => (fe == null ? void 0 : fe.signature) === K ? { ...fe, partial: !0, complete: !1 } : fe
        );
      }
  }
  const Yr = V.performerFocus ? Ze == null ? void 0 : Ze.candidates.find((b) => b.id === V.performerFocus) : void 0, pt = je && je.id === V.performerFocus ? { ...je, flags: br(Ke, je.tags) } : Yr ? { ...Yr, flags: br(Ke, Yr.tags) } : null, ar = (b) => {
    if ((je == null ? void 0 : je.id) === b)
      return br(Ke, je.tags);
    const A = Ze == null ? void 0 : Ze.candidates.find((K) => K.id === b);
    return A ? br(Ke, A.tags) : void 0;
  }, mt = ((ea = S == null ? void 0 : S.occurrence) == null ? void 0 : ea.performer.id) ?? null, Ir = mt === null ? void 0 : ar(mt), bn = ep(
    Ke.length > 0 && mt !== null && mt !== V.performerFocus && Ir === void 0 ? mt : null
  ), Ue = Ir ?? (bn ? br(Ke, bn) : []), Yt = oc(ft.actions), Ea = Ar.summary && V.performerFocus ? lo(Co(Ar.summary, ft.actions, Yt)) : [], ir = Ho(Ke, (pt == null ? void 0 : pt.flags) ?? [], Qr), or = uc(
    Ho(Ke, Ue, Qr),
    mt !== null && mt === V.performerFocus ? Ea : []
  ), Rr = JSON.stringify(or), sr = ve(() => or, [Rr]), Aa = JSON.stringify(ir), Dn = ve(() => ir, [Aa]), $r = (b) => ou(Ke, b, Jr);
  function cr(b) {
    if (rt.current) return;
    const A = {
      ...D.current,
      performerFocus: b,
      filter: { ...D.current.filter, page: 1 }
    };
    Ct(A, A.startFrom === "end"), mn("items");
  }
  function lr() {
    const { performerFocus: b, ...A } = D.current;
    Ct(
      { ...A, filter: { ...A.filter, page: 1 } },
      A.startFrom === "end"
    );
  }
  const Or = R(null);
  Or.current ?? (Or.current = Nc());
  const Xr = Or.current, ri = ve(
    () => ft.actions.flatMap((b) => b.steps.flatMap((A) => A.tagIds)),
    [ft.actions]
  ), Ca = R(null);
  ee(() => {
    const b = Ca.current, A = b == null ? void 0 : b.querySelector('[aria-current="true"]');
    if (!b || !A) return;
    const K = b.getBoundingClientRect(), H = A.getBoundingClientRect();
    H.top < K.top ? b.scrollTop -= K.top - H.top : H.bottom > K.bottom && (b.scrollTop += H.bottom - K.bottom);
  }, [S == null ? void 0 : S.key, ct]);
  const Ta = R(null), dr = R(null);
  ee(() => {
    var K, H;
    const b = dr.current;
    if (!b) return;
    dr.current = null;
    const A = [...((K = Ta.current) == null ? void 0 : K.querySelectorAll(".dq-partner")) ?? []];
    (H = A.find((fe) => fe.dataset.partnerKey === b) ?? A[0]) == null || H.focus();
  }, [S == null ? void 0 : S.key]);
  const Mr = me || ye || $e || !!w, It = ve(
    () => w ? Nn(w, Da(e, V)) : null,
    [w, e, V]
  ), Fr = ve(
    () => It != null && Br(Nr(It)) !== Br(Nr(e)),
    [It, e]
  );
  function ur() {
    S ? dn(l, S).then(rn).catch((b) => Re(tn(b))) : Ct(D.current);
  }
  const yn = Ht ? /* @__PURE__ */ u("p", { role: "alert", children: [
    Ht,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: me, onClick: ur, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, fr = me || ye || S != null && !ze, wn = Math.max(1, Number(V.filter.perPage) || 1), _n = R(1);
  ye || (_n.current = Math.max(1, Math.ceil(Te / wn)));
  const pr = _n.current, Zr = qe && S ? ie.filter(
    (b) => b.media.id === S.media.id && b.key !== S.key
  ) : [], ai = (b) => {
    var A;
    return b.title || ((A = b.files[0]) == null ? void 0 : A.basename) || `${l === "audio" ? "Audio" : "Video"} ${b.id}`;
  }, Ia = S ? fp(S.media, l) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}`,
      "aria-label": qe ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (b) => {
        var H;
        const A = b.target instanceof Element ? b.target.closest("button") : null, K = (A == null ? void 0 : A.getAttribute("aria-label")) ?? ((H = A == null ? void 0 : A.textContent) == null ? void 0 : H.trim()) ?? "";
        A && !A.closest(bs) && /^(Filters|Edit filter:|Edit criteria)/.test(K) && (kt.current = A);
      },
      children: [
        /* @__PURE__ */ a(
          Dc,
          {
            name: e.name,
            description: e.description,
            entityType: Pe(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Mr || !!(c != null && c.busy),
            onEdit: w ? () => {
              var b;
              return (b = B.current) == null ? void 0 : b.focus();
            } : Wt,
            editDisabled: !w && (Mr || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: me || $e, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  da,
                  {
                    filter: V.filter,
                    objectFilter: er,
                    criteriaDefinitions: l === "audio" ? Ts : Qa,
                    customFieldEntityType: l,
                    supportsFilterExpressions: !0,
                    totalCount: Te,
                    sortOptions: l === "audio" ? _l : Is,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      _c,
                      {
                        page: Math.min(Math.max(1, Pt || 1), pr),
                        pages: pr,
                        onPage: (b) => Ct({
                          ...D.current,
                          filter: Vt(
                            { ...D.current.filter, page: b },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (b) => {
                      (b.sort !== D.current.filter.sort || b.direction !== D.current.filter.direction) && (b = { ...b, sorts: void 0 }), Ct({
                        ...D.current,
                        filter: Vt(b, l)
                      });
                    },
                    onObjectFilterChange: (b) => {
                      Ct({
                        ...D.current,
                        objectFilter: Uc(
                          b,
                          Oe,
                          D.current.objectFilter
                        ),
                        filter: { ...D.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(pe, { children: [
              qe && /* @__PURE__ */ a(
                Jf,
                {
                  scope: qe,
                  disabled: me || $e,
                  editing: !!w,
                  onChange: rr,
                  onEditCriteria: () => Mt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                jc,
                {
                  mode: "single",
                  disabled: Mr || !!c.busy,
                  onChange: () => {
                    var b;
                    return (b = c.onGrid) == null ? void 0 : b.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(pe, { children: [
              Ie(Et) && t && /* @__PURE__ */ a(
                _f,
                {
                  review: Et,
                  disabled: xt || !!w,
                  performerAttention: V.performerFocus ? Dn : void 0,
                  trees: Yt,
                  onOpen: () => {
                    rt.current = !0, nt(!0);
                  },
                  onClose: (b) => {
                    if (b) {
                      const A = D.current.performerFocus;
                      A ? Tn(A) : Tr(), Se((K) => K + 1), et(), v.current || Ve(!0), X((K) => K + 1);
                    } else et();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                yo,
                {
                  disabled: Mr,
                  items: c.moreItems({
                    onSelect: Wt,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Ur,
                {
                  performer: {
                    id: V.performerFocus,
                    name: (pt == null ? void 0 : pt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (pt == null ? void 0 : pt.name) ?? `performer ${V.performerFocus}` })
              ] }),
              pt != null && pt.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: $r(pt.flags), children: [
                /* @__PURE__ */ a(On, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: $r(pt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: xt,
                  onClick: lr,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: At,
            queueChange: !w && At ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: Qt ? () => void ka() : void 0,
              saveDisabled: xt || !i,
              onReset: () => {
                const b = Sr(e);
                Ct(b, b.startFrom === "end");
              },
              resetDisabled: xt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && It && /* @__PURE__ */ a(
            Lc,
            {
              drawerRef: B,
              draft: It,
              onChange: (b) => k(b),
              direction: V.startFrom,
              onDirectionChange: (b) => Ct({ ...D.current, startFrom: b }),
              tagGroups: up,
              trees: Yt,
              saving: me,
              saveDisabled: ye,
              error: O,
              dirty: Fr,
              criteriaChanged: Qt,
              notices: yn && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: yn }),
              onSave: () => void Cr(),
              onCancel: Wr
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${l}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: ai(S.media) }),
                        /* @__PURE__ */ a(_s, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Ia && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Ia })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, ge].filter(Boolean).map((b) => {
                    var H, fe, Ee, Qe, Lt;
                    const A = b, K = A.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: K ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": K ? void 0 : !0,
                        inert: K ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Ii("audio", A.media.id),
                            format: ((H = A.media.files[0]) == null ? void 0 : H.format) ?? "",
                            title: m(A.media),
                            coverUrl: K ? Ti("audio", A.media) : void 0,
                            duration: ((fe = A.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            autostart: K && Z === A.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Rs,
                          {
                            videoId: A.media.id,
                            streamUrl: Ii("video", A.media.id),
                            posterUrl: K ? Ti("video", A.media) : void 0,
                            duration: ((Ee = A.media.files[0]) == null ? void 0 : Ee.duration) ?? 0,
                            format: (Qe = A.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (Lt = A.media.files[0]) == null ? void 0 : Lt.audioCodec,
                            extensionSurface: K ? "quick-view" : void 0,
                            autostart: K && Z === A.media.id,
                            keyboardShortcutsEnabled: K,
                            showAbLoop: K,
                            clip: A.media.parentVideoId != null ? {
                              start: A.media.clipStartSec ?? 0,
                              end: A.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${A.media.id}:${ue}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ a(
                    Uf,
                    {
                      details: S.media.details,
                      label: h.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: ye ? "Loading review…" : Te ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              ft.actions.length > 0 ? /* @__PURE__ */ a(
                vu,
                {
                  actions: ft.actions,
                  isDisabled: (b) => $e || Ln(b),
                  busy: fr,
                  tags: ze,
                  trees: Yt,
                  preview: Xr,
                  onApply: (b, A) => void dt(b, A),
                  onFind: () => Sn(!0),
                  findDisabled: $e || !!w,
                  paused: !!w,
                  waitForGroups: zo(ft),
                  attention: sr,
                  stayOnTap: Jt,
                  onStayOnTapChange: pn
                }
              ) : Ie(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || me || $e || !ze || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((b) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: hn.includes(b),
                          onChange: (A) => Le(
                            e.occurrence.multiple ? A.target.checked ? [...hn, b] : hn.filter((K) => K !== b) : [b]
                          )
                        }
                      ),
                      wt[b] ?? "Loading tag…"
                    ] }, b)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Le([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void dt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void dt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Ta, children: [
                S && /* @__PURE__ */ u(pe, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Ur, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: qe ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    sr.length > 0 && /* @__PURE__ */ a(mp, { entries: sr })
                  ] }),
                  Zr.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Zr.map((b) => {
                          var A, K, H;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (A = b.occurrence) == null ? void 0 : A.performer.name,
                              "aria-label": (K = b.occurrence) == null ? void 0 : K.performer.name,
                              "data-partner-key": b.key,
                              disabled: xt,
                              onClick: () => {
                                dr.current = S.key, lt(b), Re("");
                              },
                              children: [
                                b.occurrence && /* @__PURE__ */ a(Ur, { performer: b.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (H = b.occurrence) == null ? void 0 : H.performer.name })
                              ]
                            },
                            b.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    hp,
                    {
                      tags: ze,
                      preview: Xr,
                      trees: Yt,
                      actionTagIds: ri,
                      label: `Current ${qe ? "occurrence" : h.one} tags`,
                      tagsChangedSinceEditing: $e && !me && (!ze || ze.ids.length !== We.current.length || ze.ids.some((b) => !We.current.includes(b))),
                      editor: $e && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: Zn,
                          disabled: me,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              qe ? "occurrence" : h.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              Qn,
                              {
                                entityType: "tag",
                                values: $t,
                                onChange: Ot,
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
                                  disabled: !ze,
                                  onClick: () => void dt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !ze,
                                  onClick: () => void dt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    un(!1), requestAnimationFrame(() => {
                                      var b;
                                      return (b = fn.current) == null ? void 0 : b.focus();
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
                Ie(at) && V.performerFocus && /* @__PURE__ */ a(
                  Ui,
                  {
                    ...Ar,
                    mediaKind: l,
                    actions: ft.actions,
                    trees: Yt,
                    flags: Dn
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && yn,
                  st && /* @__PURE__ */ a("p", { role: "status", children: st })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": fr || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: fn,
                      className: "dq-button",
                      disabled: xt || !!w || !t || !ze,
                      onClick: () => {
                        We.current = [...ze.ids], Ot([...ze.ids]), un(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Ps, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: xt || !!w,
                      onClick: () => void dt(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        qe ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              qe && /* @__PURE__ */ u(
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
                        "aria-pressed": ct === "items",
                        onClick: () => mn("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": ct === "performers",
                        onClick: () => mn("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              qe && ct === "performers" ? /* @__PURE__ */ a(
                Kf,
                {
                  ranking: (Ze == null ? void 0 : Ze.signature) === we ? Ze : null,
                  busy: En,
                  error: (U == null ? void 0 : U.signature) === we ? U.message : "",
                  focus: V.performerFocus,
                  disabled: xt,
                  labels: h,
                  flagLabel: $r,
                  onFocus: cr,
                  onMore: () => {
                    const b = an.current;
                    b && cn(b, b.limit + Ni);
                  },
                  onRefresh: () => {
                    on(null), cn(null, Ni);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Ca, children: ie.map((b) => {
                var K;
                const A = (S == null ? void 0 : S.key) === b.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(b),
                    "aria-label": y(b),
                    "aria-current": A ? "true" : void 0,
                    disabled: xt,
                    onClick: () => {
                      lt(b), Re(""), Fe("");
                    },
                    children: [
                      /* @__PURE__ */ a(pp, { media: b.media, kind: l }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m(b.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          b.occurrence && /* @__PURE__ */ u(pe, { children: [
                            /* @__PURE__ */ a(Ur, { performer: b.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: b.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            b.media.date,
                            b.occurrence ? "" : (K = b.media.files[0]) != null && K.duration ? $s(b.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  b.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        qe && /* @__PURE__ */ a(
          Cs,
          {
            open: jt,
            onClose: () => Mt(!1),
            criteria: Ji,
            activeFilter: qe.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (b) => {
              Mt(!1), rr({ performerFilter: b });
            }
          }
        ),
        yt && /* @__PURE__ */ a(
          mo,
          {
            actions: e.actions,
            trees: Yt,
            isDisabled: (b) => Ln(b),
            tapStays: xn && Jt,
            onApply: (b, A) => {
              Sn(!1), dt(b, A);
            },
            onClose: () => Sn(!1)
          }
        )
      ]
    }
  );
}
const ll = "data-quality.reviews-sort.v1", bp = { sort: "name", direction: "asc" };
function yp() {
  try {
    const e = JSON.parse(localStorage.getItem(ll) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return bp;
}
function wp(e) {
  try {
    localStorage.setItem(
      ll,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function dl(e, t, n, r) {
  const i = r === "asc" ? 1 : -1;
  return [...e].sort((o, s) => {
    if (n === "count") {
      const c = t[o.id], d = t[s.id], f = typeof c == "number", l = typeof d == "number";
      if (f !== l) return f ? -1 : 1;
      if (f && l && c !== d)
        return (c - d) * i;
    }
    return o.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function qi(e, t) {
  const n = Pe(e), r = qn(eo(n)), i = n === "tag" ? "tag" : Ie(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function vp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      qi(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      qi(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      qi(e, t)
    ] })
  ] });
}
function Np({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: i,
  onDirectionChange: o,
  storage: s,
  canConfigure: c,
  busy: d,
  headingRef: f,
  notices: l,
  onOpen: h,
  onNew: p,
  onImport: m,
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = R(null), w = ve(
    () => dl(e, t, n, r),
    [e, t, n, r]
  ), k = e.every((F) => t[F.id] !== void 0), O = r === "asc" ? "ascending" : "descending";
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
            disabled: !c || d,
            onClick: () => {
              var F;
              return (F = v.current) == null ? void 0 : F.click();
            },
            children: [
              /* @__PURE__ */ a(td, { "aria-hidden": "true" }),
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
              F.target.value = "", B && m(B);
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
              /* @__PURE__ */ a(js, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ u(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || d,
            onClick: p,
            children: [
              /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    l,
    e.length ? /* @__PURE__ */ u("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ u("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ u("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: k ? e.some((F) => t[F.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
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
              children: r === "asc" ? /* @__PURE__ */ a(nd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(rd, { "aria-hidden": "true" })
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
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), h(F.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Fc, { entityType: B }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Mc[B] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(vp, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(yo, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(Ya, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function ul(e, { id: t, name: n, description: r }) {
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
function qp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: s } = e, c = R(null), d = R(null), f = R(o);
  f.current = o;
  const l = R(null), h = tt();
  ee(() => {
    var y;
    return l.current ?? (l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = l.current) != null && N.isConnected && l.current.focus({ preventScroll: !0 });
    };
  }, []);
  const p = R(o);
  ee(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!i.name.trim() || p.current && !o && N) && ((w = d.current) == null || w.focus()), p.current = o;
  }, [s, o]);
  const m = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": h,
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
              /* @__PURE__ */ a("h2", { id: h, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: m,
                  children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ u("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ u("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Pc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Pe(i) && t(ul(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => bo(i), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: o, onClick: m, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": o || void 0, children: o ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const Sp = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function kp(e, t, n, r) {
  return cl(
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
function ys(e, t) {
  return Pe(t) === "video" && Er(t.view.objectFilter, e.view.objectFilter, To(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ws(e, t) {
  return Wn(
    JSON.parse(Vn(Nr(e))),
    JSON.parse(Vn(Nr(t)))
  );
}
const Si = 180;
function vs(e) {
  return Pe(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ns(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function qs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function ki(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ni.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  sl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ep(e) {
  return Vt({ ...e, page: 1 });
}
function fl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Dr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ap = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Wi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(od, { "aria-hidden": "true" }) }
], Cp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Wi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(id, { "aria-hidden": "true" }) }
], Ss = [], pl = "(min-width: 900px)";
function Tp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(pl);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function Ip() {
  return typeof window.matchMedia == "function" && window.matchMedia(pl).matches;
}
function Rp({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = T(""), [s, c] = T(!0), [d, f] = T(""), [l, h] = T(!1), [p, m] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [k, O] = T([]), [F, B] = T(""), [C, L] = T(!0), [x, ae] = T("account"), [Q, _] = T(""), [V, M] = T(""), [D, P] = T(!1), [X, Y] = T(!1), [ie, W] = T(""), [S, se] = T(qs), E = R(S);
  E.current = S;
  const [Z, ce] = T({}), ue = R(Z);
  ue.current = Z;
  const G = R(t);
  G.current = t;
  const ge = R(s);
  ge.current = s;
  const Te = R(!1), ke = R(!0);
  ee(() => (ke.current = !0, () => {
    ke.current = !1;
  }), []);
  const [ye, Ve] = T(!S);
  ye !== !S && (Ve(!S), S || ce({}));
  const [me, nt] = T(yp), { sort: rt, direction: _t } = me, St = (g) => {
    const q = { ...me, ...g };
    nt(q), wp(q);
  }, Ht = R(null), Re = R(null), [st, Fe] = T(null), [ze, rn] = T(!1), [$e, un] = T(!1), [$t, Ot] = T(null), [We, fn] = T(null), kt = !!$t || !!We, Zn = R(kt);
  Zn.current = kt;
  const jt = ze || !!We || $e, [Mt, yt] = T(0), [Sn, xn] = T(!1), [he, Ut] = T(null), Jt = R(null), pn = R(null), hn = R(null), [Le, wt] = T(
    null
  ), le = t.find((g) => g.id === S) ?? null, j = ve(
    () => (Le == null ? void 0 : Le.id) === S && le ? { ...le, view: {
      ...le.view,
      filter: Le.view.filter,
      objectFilter: Le.view.objectFilter,
      searchMode: Le.view.searchMode,
      startFrom: Le.view.startFrom
    } } : le,
    [Le, S, le]
  ), Oe = j ? Pe(j) : "video", Ft = eo(Oe), er = j ? Ie(j) : !1, re = Oe === "video" ? j : null, He = er && !!(j != null && j.actions.some(Jn)), ft = !!re || Oe === "audio" || He, [at, Et] = T(null), tr = (at == null ? void 0 : at.id) === (j == null ? void 0 : j.id) ? at == null ? void 0 : at.mode : (j == null ? void 0 : j.view.reviewMode) ?? "single", Ye = er || Oe === "audio" || Oe === "video" && tr === "single", [ct, mn] = T(0), Ze = R(-1), Pn = R(!1), an = R(Ye);
  an.current = Ye, ee(() => {
    const g = () => {
      const q = an.current;
      if (!q && Tn.current) {
        Pn.current = !0;
        return;
      }
      Ze.current = -1, Io(), q || mn(($) => $ + 1);
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, []);
  const kn = Ft === "audio" ? p : l, on = Oe === "tag" ? "Tag" : Ft === "audio" ? "Audio" : "Video", En = Oe === "tag" ? y : kn, I = R(
    null
  ), U = np(re), [J, de] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [we, De] = T({
    page: 1,
    perPage: 40
  }), [Se, je] = T({ items: [], totalCount: 0 }), [An, Ae] = T(S);
  An !== S && (Ae(S), je({ items: [], totalCount: 0 }), Y(!1));
  const [Ne, Ke] = T(!1), [Je, nr] = T(""), [Cn, Jr] = T(!1), [Qr, Ar] = T(!1), [At, Qt] = T(() => /* @__PURE__ */ new Set()), xt = R(At);
  xt.current = At;
  const Pt = R(/* @__PURE__ */ new Map()), Ct = (j == null ? void 0 : j.view.selectAllOnLoad) === !0, [et, it] = T(null), Tt = R(et);
  Tt.current = et;
  const [lt, gn] = T(!1), dt = R(lt);
  dt.current = lt;
  const Sa = R(null), [Ln, Wt] = T(!1), [sn, Wr] = T("grid"), [Cr, ka] = T(Si), [qe, rr] = T(!1), [cn, Tr] = T(!1), Tn = R(!1), [Yr, pt] = T(""), [ar, mt] = T(""), [Ir, bn] = T(""), [Ue, Yt] = T(null), [Ea, ir] = T(""), [or, Rr] = T(!1), [sr, Aa] = T({}), Dn = R(/* @__PURE__ */ new Map()), $r = R(null), cr = R(null), lr = !!j, Or = zi(Tp, Ip, () => !1) && lr, [Xr, ri] = T({ top: 0, bottom: 0 });
  qt(() => {
    if (!lr) return;
    const g = () => {
      const $ = cr.current;
      if (!$) return;
      const z = Math.round($.getBoundingClientRect().top + window.scrollY), te = $.closest("main"), oe = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      ri(
        (ne) => ne.top === z && ne.bottom === oe ? ne : { top: z, bottom: oe }
      );
    };
    g();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(g);
    return q == null || q.observe(document.body), window.addEventListener("resize", g), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", g);
    };
  }, [lr]);
  const [Ca, Ta] = T(0), dr = R(null), Mr = vn((g) => {
    var $;
    if (($ = dr.current) == null || $.disconnect(), dr.current = null, !g || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => Ta(Math.round(g.getBoundingClientRect().height))
    );
    q.observe(g), dr.current = q;
  }, []), It = R(0), Fr = R(0), ur = R(null), yn = R(null), fr = oc(
    j && !Ye ? he ? [...j.actions, ...he.draft.actions] : j.actions : Ss
  ), wn = ve(
    () => he && j && le ? kp(he.draft, j, J, le) : null,
    [he, j, J, le]
  ), _n = ve(
    () => j && le ? cl(
      { ...le, view: { ...j.view, filter: { ...J, page: 1 } } },
      le
    ) : null,
    [j, le, J]
  ), pr = ve(
    () => le ? Br(Nr(le)) : "",
    [le]
  ), Zr = ve(
    () => _n != null && Br(Nr(_n)) !== pr,
    [_n, pr]
  ), ai = ve(
    () => wn != null && Br(Nr(wn)) !== pr,
    [wn, pr]
  );
  ee(() => {
    if (!ar) return;
    const g = window.setTimeout(() => mt(""), 4e3);
    return () => window.clearTimeout(g);
  }, [ar]), ee(() => {
    if (!st || st.alert) return;
    const g = window.setTimeout(() => Fe(null), 6e3);
    return () => window.clearTimeout(g);
  }, [st]), ee(() => {
    const g = re ? No(re.view.objectFilter) : [];
    if (Aa({}), !g.length) return;
    const q = new AbortController();
    let $ = !0;
    return Promise.all(
      g.map(async (z) => {
        var te;
        try {
          const oe = await be(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (te = oe.name) != null && te.trim() ? [String(z), oe.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      $ && Aa(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      $ = !1, q.abort();
    };
  }, [re == null ? void 0 : re.id, re == null ? void 0 : re.view.objectFilter]);
  const Ia = ve(
    () => re ? qo(
      re.view.objectFilter,
      sr
    ) : (j == null ? void 0 : j.view.objectFilter) ?? {},
    [sr, j, re]
  ), ea = vn(async () => {
    c(!0), f("");
    try {
      const g = await Cd();
      n(g.reviews), o(g.storageKey), h(g.canWriteVideos ?? g.canWrite), m(g.canWriteAudios ?? !1), N(g.canWriteTags ?? !1), w(g.canReadTagGroups ?? !1), L(g.canConfigure ?? !0), ae(g.storage ?? "account"), _(g.storageNotice ?? ""), S && !g.reviews.some((q) => q.id === S) && (se(""), ki(""));
    } catch (g) {
      f(
        g instanceof Error ? g.message : "Could not load reviews."
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
    const g = new AbortController();
    return B(""), Dd(g.signal).then(O).catch((q) => {
      g.signal.aborted || B(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => g.abort();
  }, [v]), ee(() => {
    ea();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const g = new AbortController();
    for (const q of t) {
      if (typeof ue.current[q.id] == "number") continue;
      (Ie(q) ? So(q, g.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : _r(ko(q, z), { ...q.view.filter, page: 1, perPage: 1 }, g.signal)) : Pe(q) === "tag" ? pi(
        q,
        Vt({ ...q.view.filter, page: 1, perPage: 1 }),
        g.signal
      ) : _r(
        q,
        Vt({ ...q.view.filter, page: 1, perPage: 1 }),
        g.signal
      )).then((z) => {
        g.signal.aborted || ce((te) => ({
          ...te,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        g.signal.aborted || ce((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => g.abort();
  }, [S, t]), qt(() => {
    var $, z;
    const g = Re.current;
    if (S || s || !g) return;
    Re.current = null, (z = (g === "heading" ? null : [...(($ = cr.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === g.reviewId
    )) ?? Ht.current) == null || z.focus();
  }, [S, s, We, t]);
  const b = R(0), A = vn(async () => {
    const g = ++b.current;
    Yt(null), ir("");
    try {
      const q = await (He ? nc(Ft) : tc(Ft));
      g === b.current && Yt(q);
    } catch (q) {
      if (g !== b.current) return;
      Yt(null), ir(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [He, Ft]);
  ee(() => {
    A();
  }, [A]);
  const K = vn(
    async (g, q, $ = !1, z = !1) => {
      var ht, Be;
      const te = ++It.current;
      (ht = ur.current) == null || ht.abort();
      const oe = new AbortController();
      ur.current = oe, q = Vt(q);
      const ne = Number(q.page);
      $ && (q = { ...q, page: 1 }), de(q), Ar($), Ke(!0), nr("");
      try {
        const ot = (Me) => Pe(g) === "tag" ? pi(
          g,
          Me,
          oe.signal
        ) : _r(
          g,
          Me,
          oe.signal
        );
        let ut = await ot(q);
        const Kt = Math.max(
          1,
          Math.ceil(ut.totalCount / Number(q.perPage))
        ), Nt = $ ? Kt : Math.min(ne, Kt);
        return Number(q.page) !== Nt && (q = { ...q, page: Nt }, ut = await ot(q)), te === It.current && (((Be = yn.current) == null ? void 0 : Be.page) !== Nt && (yn.current = {
          page: Nt,
          ids: new Set(ut.items.map((Me) => Me.id))
        }), je(ut), z && Ce(
          () => new Set(ut.items.map((Me) => Me.id))
        ), de(q), De(q)), ut;
      } catch (ot) {
        throw te === It.current && nr(
          ot instanceof Error ? ot.message : "Could not load the review queue."
        ), ot;
      } finally {
        te === It.current && Ke(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (Fr.current += 1, Ze.current = -1, It.current += 1, (q = ur.current) == null || q.abort(), Ut(null), Jt.current = null, Y(!1), W(""), M(""), P(!1), Qt(/* @__PURE__ */ new Set()), Pt.current.clear(), it(null), gn(!1), rr(!1), Tn.current = !1, pt(""), mt(""), bn(""), je({ items: [], totalCount: 0 }), yn.current = null, Jr(!1), !j || Ye) {
      Ke(!1), wt(null);
      return;
    }
    let g = !0;
    return Ke(!0), (async () => {
      let $ = le ?? j;
      wt(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (Pe(j) === "video" && ni.some((Be) => te.has(Be)))
        try {
          const Be = $;
          z = Vi(Be, te);
          const ot = Nn(Be, z.query);
          (z.query.startFrom !== (Be.view.startFrom ?? "end") || !Wn(
            JSON.parse(Vn(ot)),
            JSON.parse(Vn(Nn(Be, Sr(Be))))
          )) && ($ = ot, wt($));
        } catch (Be) {
          Jr(!0), nr(Be instanceof Error ? Be.message : "Could not read review URL."), Ke(!1);
          return;
        }
      let oe = null;
      try {
        oe = await $d(i, j.id);
      } catch (Be) {
        g && (P(!0), M(
          Be instanceof Error ? Be.message : "Could not load progress."
        ));
      }
      if (!g) return;
      const ne = (oe == null ? void 0 : oe.signature) === Vn($) ? oe : null, ht = z ? z.query.filter : ne ? Vt(ne.filter) : Ep($.view.filter);
      de(ht), Wr(
        ne ? Ns(ne.displayMode, Pe(j)) : vs(j)
      ), ka(
        ne ? ne.cardSize ?? Si : Si
      );
      try {
        const Be = await K(
          $,
          ht,
          z ? z.startAtEnd : !ne && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!g) return;
        const ot = _o(
          Be.items.map((ut) => ut.id),
          (ne == null ? void 0 : ne.focusedId) ?? null,
          (ne == null ? void 0 : ne.index) ?? 0
        );
        it(ot), Ge(ot);
      } catch {
      }
      g && (Ze.current = ct, Y(!0), W(`${j.id}:${ct}`));
    })(), () => {
      var $;
      g = !1, Fr.current++, It.current++, ($ = ur.current) == null || $.abort();
    };
  }, [j == null ? void 0 : j.id, Ye, ct]), ee(() => {
    if (!(!Mt || Ye || !j)) {
      if (Cn) {
        yt(0);
        return;
      }
      qe || he || cn || ie !== `${j.id}:${ct}` || (yt(0), di());
    }
  }, [
    Mt,
    Ye,
    j == null ? void 0 : j.id,
    ie,
    qe,
    cn,
    ct,
    Cn
  ]), ee(() => {
    !re || Ye || !X || Ne || Je || qe || Pn.current || Ze.current !== ct || la(re.id, {
      filter: J,
      objectFilter: re.view.objectFilter,
      searchMode: re.view.searchMode,
      startFrom: re.view.startFrom ?? "end"
    });
  }, [re, Ye, X, Ne, Je, J, qe, ct]);
  const H = ve(
    () => Se.items.map((g) => g.id),
    [Se.items]
  );
  ee(() => {
    if (!X || !j || !i || Ne || Je || qe || (Le == null ? void 0 : Le.id) === j.id || D || Ze.current !== ct)
      return;
    const g = {
      version: 1,
      signature: Vn(j),
      filter: J,
      focusedId: et,
      index: Math.max(0, H.indexOf(et ?? -1)),
      displayMode: sn,
      cardSize: Cr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + j.id,
        JSON.stringify(g)
      );
    } catch {
    }
    if (V) return;
    let q = !0;
    const $ = window.setTimeout(() => {
      Od(i, j.id, g).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout($);
    };
  }, [
    X,
    i,
    j,
    Ne,
    Je,
    qe,
    J,
    et,
    H,
    sn,
    Cr,
    Le,
    V,
    D,
    ct
  ]);
  const fe = Se.items.find((g) => g.id === et) ?? null, Ee = Oe === "video" ? fe : null;
  lt && Ee && (Sa.current = Ee);
  const Qe = Ee ?? (lt ? Sa.current : null), Lt = jo(At, et), jn = H.length > 0 && H.every((g) => At.has(g)), Ge = vn((g, q = !0) => {
    g != null && window.requestAnimationFrame(() => {
      var z;
      if (Zn.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const $ = Dn.current.get(g);
      $ == null || $.focus({ preventScroll: !0 }), q && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    X && !dt.current && Ge(Tt.current);
  }, [X, Ge]), ee(() => {
    Ne || !H.length || (Tt.current == null || !H.includes(Tt.current)) && (it(H[0]), dt.current || Ge(H[0]));
  }, [Ge, H, Ne]);
  const Ce = vn(
    (g) => {
      Qt((q) => {
        const $ = g(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...$]))
          q.has(z) !== $.has(z) && Pt.current.set(
            z,
            (Pt.current.get(z) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), Rt = vn(
    (g) => {
      if (!H.length) return;
      const q = Math.max(
        0,
        H.indexOf(Tt.current ?? H[0])
      ), $ = H[Math.max(0, Math.min(H.length - 1, q + g))];
      it($), dt.current || Ge($);
    },
    [Ge, H]
  ), xe = vn(
    async (g, q = !1) => {
      const $ = "steps" in g ? g.steps.length > 0 : g.effect.mode !== "SKIP", z = "effect" in g && g.effect.mode === "SET_TAG_GROUP" ? g.effect.tagGroupId : null, te = z != null && (!v || !k.some((Xe) => Xe.id === z)), oe = "effect" in g && $ && !v, ne = jo(
        xt.current,
        Tt.current
      );
      if (!j || Tn.current || Ne || Je) return;
      const ht = $ && !En ? `${on} write permission is required to apply ${g.label}.` : oe || te ? `${g.label} needs a tag group that is unavailable.` : Jn(g) && (Ue == null ? void 0 : Ue.kind) !== "ready" ? `Set up tag assessments before applying ${g.label}.` : ne.length ? "" : `Select or focus a ${Oe} before applying ${g.label}.`;
      if (ht) {
        bn(ht);
        return;
      }
      const Be = ++Fr.current, ot = j.id, ut = [...H], Kt = Se, Nt = Tt.current, Me = new Set(xt.current), Xt = new Map(
        ne.map((Xe) => [Xe, Pt.current.get(Xe) ?? 0])
      ), mr = () => Be === Fr.current && j.id === ot;
      Tn.current = !0, rr(!0), pt(
        xt.current.size ? `${ne.length} selected ${Oe}s` : `the focused ${Oe}`
      ), mt(""), bn("");
      const xo = Kt.items.filter(
        (Xe) => !ne.includes(Xe.id)
      ), Il = xo.map((Xe) => Xe.id), Po = Uo(
        ut,
        Il,
        Nt,
        ne.includes(Nt ?? -1)
      );
      q || (je({
        items: xo,
        totalCount: Kt.totalCount
      }), Qt((Xe) => {
        const Gt = new Set(Xe);
        for (const ln of ne) Gt.delete(ln);
        return Gt;
      }), it(Po), dt.current || Ge(Po));
      let ui = !1;
      try {
        if ("effect" in g ? await Hd(g, ne) : await ac(Ft, g, ne), ui = !0, !mr()) return;
        q || Qt((Xe) => {
          const Gt = new Set(Xe);
          for (const ln of ne)
            (Pt.current.get(ln) ?? 0) === Xt.get(ln) && Gt.delete(ln);
          return Gt;
        }), mt(
          `${g.label}: ${ne.length} ${Oe}${ne.length === 1 ? "" : "s"} ${$ ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (Xe) {
        if (!mr()) return;
        je(Kt), Qt((Gt) => {
          const ln = new Set(Gt);
          for (const Zt of ne)
            Me.has(Zt) && (Pt.current.get(Zt) ?? 0) === Xt.get(Zt) && ln.add(Zt);
          return ln;
        }), it(Nt), dt.current || Ge(Nt), bn(
          Xe instanceof Error ? Xe.message : "Action failed."
        );
      }
      try {
        if (!mr()) return;
        if (q) {
          const Dt = Oe === "tag" ? await pi(j, J) : await _r(j, J), Un = new Map(
            Dt.items.map((en) => [en.id, en])
          );
          if (Oe !== "tag" && await Promise.all(
            ne.filter((en) => !Un.has(en)).map(async (en) => {
              const Bn = await Va(Ft, en).catch(() => null);
              Bn && Un.set(en, Bn);
            })
          ), !mr()) return;
          je((en) => ({
            items: en.items.map((Bn) => Un.get(Bn.id) ?? Bn),
            totalCount: Dt.totalCount
          }));
          return;
        }
        const Xe = new Set(ne), Gt = Ct && ut.length > 0 && ut.every((Dt) => Xe.has(Dt)), ln = await K(j, J, !1, Gt);
        if (!mr()) return;
        let Zt = ln.items.map((Dt) => Dt.id);
        const Oa = yn.current, Rl = (Oa == null ? void 0 : Oa.page) === Number(J.page) && Zt.some((Dt) => Oa.ids.has(Dt)), $l = (j.view.startFrom ?? "end") !== "beginning";
        if (ln.totalCount > 0 && Number(J.page) > 1 && (!Zt.length || $l && !Rl)) {
          const Dt = Math.max(1, Number(J.page) - 1), Un = { ...J, page: Dt };
          de(Un), Zt = (await K(
            j,
            Un,
            !1,
            Gt
          )).items.map((fi) => fi.id), Qt(
            (fi) => new Set([...fi].filter((Ol) => Zt.includes(Ol)))
          );
          const Bn = Zt.at(-1) ?? null;
          it(Bn), dt.current || Ge(Bn);
        } else {
          Qt(
            (Un) => new Set([...Un].filter((en) => Zt.includes(en)))
          );
          const Dt = Uo(
            ut,
            Zt,
            Nt,
            ui && ne.includes(Nt ?? -1)
          );
          it(Dt), dt.current && Dt == null && gn(!1), dt.current || Ge(Dt);
        }
      } catch (Xe) {
        mr() && bn(
          (Gt) => `${Gt ? `${Gt} ` : ""}${ui ? "The action completed, but " : ""}the queue could not be refreshed. ${Xe instanceof Error ? Xe.message : "Refresh failed."}`
        );
      } finally {
        mr() && (Tn.current = !1, rr(!1), pt(""), Pn.current && (Pn.current = !1, Io(), mn((Xe) => Xe + 1)));
      }
    },
    [
      En,
      v,
      k,
      Oe,
      Ue,
      K,
      J,
      Ge,
      H,
      Se,
      Ne,
      Je,
      j
    ]
  );
  function In() {
    var $;
    if (sn === "list") return 1;
    const g = ($ = $r.current) == null ? void 0 : $.firstElementChild, q = g ? getComputedStyle(g).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const hr = R(() => {
  });
  hr.current = (g) => {
    var oe;
    if (Ye || g.defaultPrevented || g.repeat || nn(g) || g.ctrlKey || g.altKey || g.metaKey || kt) return;
    const q = g.target, $ = q instanceof Node && ((oe = cr.current) == null ? void 0 : oe.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z) return;
    if (Ln) {
      g.key === "Escape" && (Dr(g), Wt(!1));
      return;
    }
    if (lt && g.key === "Escape") {
      Dr(g), gn(!1), Ge(Tt.current);
      return;
    }
    if (!vd(q)) return;
    const te = wd(q);
    if (g.key === "Escape") {
      Dr(g), Ce(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!lt && g.key === " " && te) {
      Dr(g), et != null && Ce((ne) => _a(ne, et));
      return;
    }
    if (!(qe || Ne) && !lt && g.key === "Enter" && et != null && te) {
      if (Oe !== "tag" && he) return;
      Dr(g), Oe === "tag" ? window.open(`/tag/${et}`, "_blank", "noopener,noreferrer") : gn(!0);
      return;
    }
  }, ee(() => {
    const g = (q) => hr.current(q);
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, []);
  const xr = R(
    () => {
    }
  );
  xr.current = (g) => {
    var oe;
    if (Ye || kt || lt || Ln || qe || Ne || !H.length || g.defaultPrevented || g.repeat || g.ctrlKey || g.altKey || g.metaKey)
      return;
    const q = g.target, $ = q instanceof Node && ((oe = cr.current) == null ? void 0 : oe.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z || !g.key.startsWith("Arrow") || !qd(q)) return;
    const te = Sd(g.key, In());
    te && (g.preventDefault(), $ ? g.stopImmediatePropagation() : g.stopPropagation(), Rt(te));
  }, ee(() => {
    const g = (q) => xr.current(q);
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, []);
  const Bt = (he == null ? void 0 : he.saving) === !0 || cn, ta = qe || Ne && !X || Bt, na = po();
  fo({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!j && !Ye && !kt && !he && !lt && !Ln && !Je && (Se.items.length > 0 || Ne || qe),
    actions: (j == null ? void 0 : j.actions) ?? Ss,
    onAction: (g, q) => {
      const $ = j == null ? void 0 : j.actions[g];
      $ && xe($, q);
    },
    onFind: () => Wt(!0),
    onSelectAll: () => Ce((g) => yd(g, H))
  }), ee(() => Wt(!1), [Ye, lt, j == null ? void 0 : j.id]);
  function Pr(g) {
    const q = "steps" in g ? g.steps.length > 0 : g.effect.mode !== "SKIP", $ = "effect" in g && g.effect.mode === "SET_TAG_GROUP" ? g.effect.tagGroupId : null, z = $ != null && !k.some((te) => te.id === $);
    return qe || Ne || !!Je || q && !En || "effect" in g && q && (!v || z) || Jn(g) && (Ue == null ? void 0 : Ue.kind) !== "ready" || !Lt.length;
  }
  function vt(g) {
    Et(null), yt(0), Fe(null), se(g), ki(g, !!g && !j);
  }
  function ra() {
    Te.current || (ol() ? (Te.current = !0, window.history.back()) : vt(""));
  }
  function Io() {
    const g = Te.current;
    Te.current = !1;
    let q = qs();
    q && !ge.current && !G.current.some((z) => z.id === q) && (q = "", ki(""));
    const $ = E.current;
    q !== $ && (yt(0), g || Fe(null), !q && $ && (Re.current ?? (Re.current = { reviewId: $ }))), se(q);
  }
  function ii() {
    Re.current = "heading", Fe(null), ra();
  }
  function oi(g) {
    g !== S && vt(g), yt((q) => q + 1);
  }
  function hl() {
    Fe(null), Ot({
      review: ul("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function ml(g) {
    if (jt || !C) return;
    Fe(null);
    const q = crypto.randomUUID();
    let $;
    const z = S;
    un(!0);
    try {
      if (!await aa((oe) => ($ = gd(
        oe.find((ne) => ne.id === g.id) ?? g,
        oe,
        q
      ), [...oe, $]))) throw new Error("Could not save reviews.");
      if (!ke.current) return;
      E.current !== z ? Fe({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : oi($.id);
    } catch (te) {
      Fe({
        text: `“${g.name}” was not duplicated. ${Ra(te)}`,
        alert: !0
      });
    } finally {
      un(!1);
    }
  }
  async function gl() {
    if (!$t || $t.saving) return;
    const g = { ...$t.review, name: $t.review.name.trim() }, q = pa(g);
    if (q) {
      Ot({ ...$t, error: q });
      return;
    }
    Ot({ ...$t, saving: !0, error: "" });
    try {
      if (!await aa(($) => [...$, g]))
        throw new Error("Could not save reviews.");
      if (!ke.current) return;
      Ot(null), oi(g.id);
    } catch ($) {
      Ot(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!We || We.pending) return;
    const g = We.review, q = dl(t, Z, rt, _t).map((te) => te.id), $ = q.filter((te) => te !== g.id), z = $[Math.min(q.indexOf(g.id), $.length - 1)];
    fn({ review: g, pending: !0 });
    try {
      if (!await aa((te) => te.filter((oe) => oe.id !== g.id)))
        throw new Error("Could not save reviews.");
      Re.current = g.id !== S && z ? { reviewId: z } : "heading", Fe({ text: `Deleted “${g.name}”.`, alert: !1 });
    } catch (te) {
      Fe({ text: `“${g.name}” was not deleted. ${Ra(te)}`, alert: !0 });
    } finally {
      fn(null);
    }
  }
  async function yl(g) {
    if (!(jt || !C)) {
      Fe(null), rn(!0);
      try {
        const q = await af(g);
        let $ = 0;
        if (q.length && !await aa((te) => {
          const oe = Ei(te, q);
          return $ = oe.length - te.length, $ ? oe : te;
        }))
          throw new Error("Could not save reviews.");
        const z = q.length - $;
        Fe({
          alert: !1,
          text: q.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Fe({ alert: !0, text: `Could not import “${g.name}”. ${Ra(q)}` });
      } finally {
        rn(!1);
      }
    }
  }
  function Ra(g) {
    return g instanceof Hs ? "Reviews changed in another browser. Reload the page to get them, then try again." : g instanceof Error ? g.message : "Try again.";
  }
  function Ro(g) {
    const q = !C || jt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Fs, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void ml(g)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(js, { "aria-hidden": "true" }),
        onSelect: () => bo(g)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(Wa, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Fe(null), fn({ review: g, pending: !1 });
        }
      }
    ];
  }
  function $o(g, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || $e
      },
      ...Ro(g),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
        separated: !0,
        disabled: $e,
        onSelect: ii
      }
    ];
  }
  async function aa(g) {
    if (!i) return !1;
    let q = [];
    const $ = await Rd(i, (ne) => {
      q = ne;
      const ht = g(ne);
      return ht === ne ? ne : ht.map(Mp);
    });
    if (n($), !ke.current) return !0;
    const z = E.current;
    z && !$.some((ne) => ne.id === z) && ra();
    const te = q.find((ne) => ne.id === z), oe = $.find((ne) => ne.id === z);
    return oe && te && ((oe.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && Et(null), oe.view.displayMode !== te.view.displayMode && Wr(vs(oe))), !0;
  }
  function si(g) {
    return aa((q) => Op(q, g));
  }
  function wl(g) {
    return si(g).catch((q) => {
      throw E.current !== g.id && ci(g, q), q;
    });
  }
  function ci(g, q) {
    var z;
    if (!ke.current) return;
    const $ = ((z = G.current.find((te) => te.id === g.id)) == null ? void 0 : z.name) ?? g.name;
    Fe({ text: `“${$}” was not saved. ${Ra(q)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(ks, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Dp().catch(
            (g) => f(
              "Could not export browser reviews. " + (g instanceof Error ? g.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Es,
        {
          message: d,
          onRetry: () => void ea()
        }
      )
    ] });
  const li = /* @__PURE__ */ u(pe, { children: [
    Q && /* @__PURE__ */ a("p", { className: "dq-status", children: Q }),
    ft && (Ue == null ? void 0 : Ue.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Ue.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: or,
          onClick: () => {
            Rr(!0), ir(""), (He ? Kd(Ft) : Bd(Ft)).then(A).catch(
              (g) => ir(
                `Could not create the ${He ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (g instanceof Error ? g.message : "Request failed.")
              )
            ).finally(() => Rr(!1));
          },
          children: or ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    ft && ((Ue == null ? void 0 : Ue.kind) === "incompatible" || Ea) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Rn, {}),
      Ea || (Ue == null ? void 0 : Ue.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: or,
          onClick: () => {
            Rr(!0), A().finally(
              () => Rr(!1)
            );
          },
          children: or ? "Checking…" : "Check again"
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
            const g = localStorage.getItem("page-videos") ?? "[]", q = URL.createObjectURL(
              new Blob([g], { type: "application/json" })
            ), $ = document.createElement("a");
            $.href = q, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(q);
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
          children: D ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    st && (st.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
      st.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: st.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: cr,
      className: `data-quality-page${lr ? " dq-page-fit" : ""}`,
      style: lr ? {
        "--dq-fit-top": `${Xr.top}px`,
        "--dq-fit-bottom": `${Xr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: st && !st.alert ? st.text : "" }),
        j && Ye ? /* @__PURE__ */ a(
          gp,
          {
            review: le ?? j,
            canWrite: er ? y : kn,
            canAssess: (Ue == null ? void 0 : Ue.kind) === "ready" && kn,
            onBusy: rr,
            editRequest: Mt,
            onEditRequestHandled: () => yt(0),
            onSaveDefaults: C ? wl : void 0,
            pageControls: {
              onBack: ii,
              moreItems: (g) => $o(le ?? j, g),
              onGrid: re ? () => Et({ id: re.id, mode: "multiple" }) : void 0,
              notices: li,
              busy: $e
            },
            stayOnTap: Sn,
            onStayOnTapChange: xn
          },
          j.id
        ) : j ? Cl(j) : /* @__PURE__ */ a(
          Np,
          {
            reviews: t,
            counts: Z,
            sort: rt,
            direction: _t,
            onSortChange: (g) => St({ sort: g }),
            onDirectionChange: (g) => St({ direction: g }),
            storage: Sp[x],
            canConfigure: C,
            busy: jt,
            headingRef: Ht,
            notices: li,
            onOpen: vt,
            onNew: () => hl(),
            onImport: (g) => void yl(g),
            onExportAll: () => xc(t, "data-quality-reviews.json"),
            rowMenuItems: (g) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
                disabled: !C || jt,
                onSelect: () => oi(g.id)
              },
              ...Ro(g)
            ]
          }
        ),
        lt && Qe && re && /* @__PURE__ */ a(
          Lp,
          {
            video: Qe,
            review: re,
            details: rp(Qe, re, U.ids),
            selectedCount: At.size,
            pending: qe,
            refreshing: Ne || !!Je,
            error: Ir,
            canWrite: l,
            assessmentReady: (Ue == null ? void 0 : Ue.kind) === "ready",
            trees: fr,
            selected: At.has(Qe.id),
            hasPrevious: H.indexOf(Qe.id) > 0,
            hasNext: H.indexOf(Qe.id) >= 0 && H.indexOf(Qe.id) < H.length - 1,
            onToggleSelected: () => Ce((g) => _a(g, Qe.id)),
            onPrevious: () => Rt(-1),
            onNext: () => Rt(1),
            onClose: () => {
              gn(!1), Ge(Tt.current);
            },
            onAction: xe,
            findOpen: Ln,
            onFindOpenChange: Wt
          }
        ),
        Ln && j && !Ye && !lt && /* @__PURE__ */ a(
          mo,
          {
            actions: j.actions,
            tagGroups: k,
            trees: fr,
            isDisabled: Pr,
            onApply: (g, q) => {
              Wt(!1), xe(g, q);
            },
            onClose: () => Wt(!1)
          }
        ),
        $t && /* @__PURE__ */ a(
          qp,
          {
            draft: $t,
            onChange: (g) => Ot((q) => q && { ...q, review: g, error: "" }),
            onCreate: () => void gl(),
            onCancel: () => Ot(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!We,
            title: "Delete review?",
            message: We ? `“${We.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (We == null ? void 0 : We.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => fn((g) => g != null && g.pending ? g : null)
          }
        )
      ]
    }
  );
  async function $a(g, q, $ = !1, z = !0) {
    const te = Tt.current, oe = Math.max(0, H.indexOf(te ?? -1));
    try {
      const ne = K(
        g,
        q,
        $,
        g.view.selectAllOnLoad === !0
      ), ht = It.current, Be = await ne;
      if (ht !== It.current) return;
      const ot = Be.items.map((Kt) => Kt.id);
      Qt(
        (Kt) => new Set([...Kt].filter((Nt) => ot.includes(Nt)))
      );
      const ut = _o(ot, te, oe);
      it(ut), z && !dt.current && Ge(ut, !1);
    } catch {
    }
  }
  function vl(g) {
    const q = I.current;
    if (I.current = null, ta || !j || !le) return;
    const $ = q ?? j.view.objectFilter, z = Wn(
      $,
      le.view.objectFilter
    ) ? le.view.objectFilter : $, te = Vt({ ...g, page: 1 }), oe = {
      ...j,
      view: {
        ...j.view,
        filter: te,
        objectFilter: z
      }
    }, ne = !ws(oe, le), ht = ne ? oe : le;
    wt(ne ? oe : null), mt(ne ? "" : "Review queue defaults restored."), $a(ht, te, !0);
  }
  function Nl() {
    if (qe || Ne || Bt || !le) return;
    I.current = null;
    const g = Vt({
      ...le.view.filter,
      page: 1
    });
    wt(null), mt("Review queue defaults restored."), $a(
      le,
      g,
      le.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (qe || Ne || Je || Bt || !j || !_n || !C)
      return;
    const g = j, q = _n;
    Tr(!0), si(q).then(($) => {
      !$ || E.current !== q.id || (wt(ys(q, g)), mt("Queue saved to this review."));
    }).catch(($) => {
      E.current !== q.id ? ci(q, $) : bn($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Tr(!1));
  }
  function di() {
    if (!j || !le || Tn.current || he || cn) return;
    pn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, Jt.current = {
      temporaryReview: Le,
      filter: J,
      loadedFilter: we,
      queue: Se,
      queueError: Je,
      retryFromEnd: Qr,
      selectedIds: new Set(At),
      focusedId: et,
      pageCursor: yn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const g = structuredClone({
      ...le,
      view: { ...le.view, startFrom: j.view.startFrom ?? "end" }
    });
    Wt(!1), gn(!1), mt(""), bn(""), Ut({ draft: g, saving: !1, error: "" });
  }
  function Oo() {
    Ut(null), Jt.current = null;
    const g = pn.current;
    pn.current = null, requestAnimationFrame(() => {
      (g == null ? void 0 : g.isConnected) && g !== document.body && !(g instanceof HTMLButtonElement && g.disabled) ? g.focus({ preventScroll: !0 }) : Ge(Tt.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!he || he.saving) return;
    const g = Jt.current;
    g && (It.current += 1, (q = ur.current) == null || q.abort(), I.current = null, Ke(!1), wt(g.temporaryReview), de(g.filter), De(g.loadedFilter), je(g.queue), nr(g.queueError), Ar(g.retryFromEnd), Ce(() => g.selectedIds), it(g.focusedId), yn.current = g.pageCursor, window.history.replaceState(window.history.state, "", g.url)), Oo();
  }
  async function kl() {
    if (!he || he.saving || !wn || !j) return;
    const g = j, q = { ...wn, name: wn.name.trim() }, $ = pa(q);
    if ($) {
      Ut((z) => z && { ...z, error: $ });
      return;
    }
    Ut((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await si(q)) throw new Error("Could not save reviews.");
      if (!ke.current || E.current !== q.id) return;
      wt(ys(q, g)), Pe(q) === "video" && la(q.id, {
        filter: J,
        objectFilter: g.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), mt("Review saved."), Oo();
    } catch (z) {
      if (E.current !== q.id) {
        ci(q, z);
        return;
      }
      Ut(
        (te) => te && {
          ...te,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (z instanceof Error ? z.message : "Retry saving.")
        }
      );
    }
  }
  function Mo() {
    j && K(j, J, Qr, Ct).catch(() => {
    });
  }
  function El() {
    Qt(/* @__PURE__ */ new Set()), Pt.current.clear(), it(null);
  }
  function Al(g) {
    !j || qe || Bt || g === Number(J.page) || $p(
      { ...J, page: g },
      j,
      (q, $) => K(q, $, !1, Ct),
      El
    );
  }
  function Fo(g) {
    if (!re || !le || qe || Ne || Bt) return;
    const q = il(re, g, le.view.objectFilter), $ = !ws(q, le);
    wt($ ? q : null), $ ? $a(q, { ...J, page: 1 }) : $a(
      le,
      { ...J, page: 1 },
      le.view.startFrom !== "beginning"
    );
  }
  function Cl(g) {
    var Be, ot, ut, Kt, Nt;
    const q = Oe === "tag", $ = q ? "tag" : "video", z = Math.max(1, Number(J.perPage) || 40), te = Math.max(1, Math.ceil(Se.totalCount / z)), oe = Math.min(Math.max(1, Number(J.page) || 1), te), ne = [
      En ? "" : `${on} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), ht = !!Ir && !lt;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Dc,
            {
              name: g.name,
              description: g.description,
              entityType: Oe,
              onBack: ii,
              backDisabled: qe || !!he || $e,
              onEdit: he ? () => {
                var Me;
                return (Me = hn.current) == null ? void 0 : Me.focus();
              } : di,
              editDisabled: !he && (qe || Ne || Cn || cn || $e || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: ta, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  da,
                  {
                    filter: Je ? we : J,
                    onFilterChange: vl,
                    totalCount: Se.totalCount,
                    sortOptions: q ? Gl : Is,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: sn,
                    zoomLevel: (Cr - 225) / 50,
                    onZoomChange: (Me) => ka(Math.round(225 + Me * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : Qa,
                    customFieldEntityType: Oe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: Ia,
                    onObjectFilterChange: (Me) => {
                      ta || (I.current = Oe === "video" ? Uc(
                        Me,
                        sr,
                        g.view.objectFilter
                      ) : Me);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_c, { page: oe, pages: te, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(pe, { children: [
                re && /* @__PURE__ */ a(
                  jc,
                  {
                    mode: "multiple",
                    disabled: qe || Ne || kt || !!he || cn || $e,
                    onChange: () => Et({ id: re.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  yf,
                  {
                    options: q ? Cp : Ap,
                    value: sn,
                    onChange: (Me) => Wr(Ns(Me, Oe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                yo,
                {
                  disabled: qe || !!he,
                  items: $o(le ?? g, {
                    onSelect: di,
                    disabled: Ne || Cn || cn || !C
                  })
                }
              ),
              queueDiffers: X ? (Le == null ? void 0 : Le.id) === S : void 0,
              queueChange: !he && (Le == null ? void 0 : Le.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Zr ? ql : void 0,
                saveDisabled: qe || Ne || !!Je || Bt || !C,
                onReset: Nl,
                resetDisabled: qe || Ne || Bt
              } : void 0,
              chipsAfter: (ot = (Be = re == null ? void 0 : re.presentation) == null ? void 0 : Be.binParents) != null && ot.length || (Kt = (ut = re == null ? void 0 : re.presentation) == null ? void 0 : ut.filterBins) != null && Kt.length ? /* @__PURE__ */ u(pe, { children: [
                !!((Nt = re.presentation.binParents) != null && Nt.length) && /* @__PURE__ */ a(
                  ap,
                  {
                    videos: Se.items,
                    review: re,
                    savedObjectFilter: (le ?? re).view.objectFilter,
                    trees: U.ids,
                    disabled: qe || Ne || Bt,
                    onToggle: Fo
                  }
                ),
                /* @__PURE__ */ a(
                  ip,
                  {
                    review: re,
                    savedObjectFilter: (le ?? re).view.objectFilter,
                    queueFilter: J,
                    queueCount: Ne || Je ? null : Se.totalCount,
                    disabled: qe || Ne || Bt,
                    countsPaused: qe || Ne || Bt || !X,
                    onToggle: Fo
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          li,
          re && U.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: U.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && wn && /* @__PURE__ */ a(
              Lc,
              {
                drawerRef: hn,
                draft: wn,
                onChange: (Me) => Ut((Xt) => Xt && { ...Xt, draft: Me }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Me) => Ut(
                  (Xt) => Xt && {
                    ...Xt,
                    draft: { ...Xt.draft, view: { ...Xt.draft.view, startFrom: Me } }
                  }
                ),
                tagGroups: k,
                trees: fr,
                saving: he.saving,
                saveDisabled: Ne || !!Je,
                error: he.error,
                dirty: ai,
                criteriaChanged: Zr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Je && !Ne ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Je,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Mo, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void kl(),
                onCancel: Sl
              }
            ),
            /* @__PURE__ */ u(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Ca}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    Ne && !Se.items.length && /* @__PURE__ */ a(ks, { label: "Loading review queue…" }),
                    Je && !Ne && /* @__PURE__ */ a(
                      Es,
                      {
                        message: Je,
                        retryLabel: Cn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Cn && le && Pe(le) === "video") {
                            const Me = Sr(le);
                            la(le.id, { ...Me, filter: { ...Me.filter, page: void 0 } }), mn((Xt) => Xt + 1);
                            return;
                          }
                          Mo();
                        }
                      }
                    ),
                    !qe && !Ne && !Je && !Se.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(Ya, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!Se.items.length && /* @__PURE__ */ a("div", { ref: $r, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: sn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Cr}px` },
                        children: Se.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Mr, children: /* @__PURE__ */ a(
                    Cc,
                    {
                      actions: he ? he.draft.actions : g.actions,
                      tagGroups: k,
                      trees: fr,
                      isDisabled: Pr,
                      paused: !!he,
                      busy: qe || Ne,
                      onApply: (Me) => void xe(Me),
                      onFind: () => Wt(!0),
                      status: qe ? `Applying action to ${Yr}…` : "",
                      summary: /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: At.size ? `${At.size} selected` : et == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !H.length || jn,
                            onClick: () => Ce((Me) => /* @__PURE__ */ new Set([...Me, ...H])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(bt, { binding: na.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !At.size,
                            onClick: () => Ce(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(bt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ne.length ? ne.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: ht || ar ? /* @__PURE__ */ u(pe, { children: [
                        ht && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Rn, { "aria-hidden": "true" }),
                          Ir
                        ] }),
                        ar && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: ar })
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
  function Tl(g) {
    var $, z, te;
    if (Oe === "tag") {
      const oe = g;
      return /* @__PURE__ */ a(
        Fp,
        {
          tag: oe,
          displayMode: sn === "list" ? "list" : "grid",
          focused: oe.id === et,
          selected: At.has(oe.id),
          setRef: (ne) => {
            ne ? Dn.current.set(oe.id, ne) : Dn.current.delete(oe.id);
          },
          onFocus: () => it(oe.id),
          onToggle: () => {
            Ce((ne) => _a(ne, oe.id)), Ge(oe.id, !1);
          },
          onOpen: () => window.open(`/tag/${oe.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        oe.id
      );
    }
    const q = g;
    return /* @__PURE__ */ a(
      xp,
      {
        video: rl(q, re, U.ids),
        showTagBins: ((z = ($ = re == null ? void 0 : re.presentation) == null ? void 0 : $.annotations) == null ? void 0 : z.includes("tags")) && !!((te = re.presentation.annotationParents) != null && te.length),
        displayMode: sn,
        cardsScroll: Or,
        focused: q.id === et,
        selected: At.has(q.id),
        setRef: (oe) => {
          oe ? Dn.current.set(q.id, oe) : Dn.current.delete(q.id);
        },
        onFocus: () => it(q.id),
        onToggle: () => Ce((oe) => _a(oe, q.id)),
        onPreview: () => {
          he || (it(q.id), gn(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function $p(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function _a(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Op(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function Mp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Fp({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: i,
  onFocus: o,
  onToggle: s,
  onOpen: c,
  onNavigate: d
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
        Vl,
        {
          tag: e,
          selected: r,
          onSelect: s,
          onClick: c,
          onNavigate: d
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
function xp({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: i,
  selected: o,
  setRef: s,
  onFocus: c,
  onToggle: d,
  onPreview: f,
  onNavigate: l
}) {
  var v, w;
  const h = fl(e), p = R(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(m.date || m.studioName), N = !!(m.performers.length || m.tags.length);
  return qt(() => {
    const k = p.current;
    if (!k) return;
    const O = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = k.querySelector(".card-title"), B = `dq-card-title-${e.id}`;
    F && (F.id = B), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", B), O.classList.add("dq-card-link"));
    const C = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${h}` : `Select ${h}`
    );
    const L = k.querySelector(
      'button[title="Quick View"]'
    );
    L && L.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (k) => {
        p.current = k, s(k);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${h}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (k) => {
        c(), k.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          zl,
          {
            video: m,
            selected: o,
            onSelect: d,
            onNavigate: l,
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
        n === "wall" && /* @__PURE__ */ a(Pp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Pp({ video: e, cardsScroll: t }) {
  const n = R(null), r = R(null), [i, o] = T(!1), [s, c] = T(!1), [d, f] = T(!1);
  return ee(() => {
    const l = n.current;
    if (!l || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), c(!0);
      return;
    }
    const h = t ? l.closest(".dq-grid-stage") : null, p = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: h, rootMargin: "320px 0px", threshold: 0 }
    ), m = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: h, threshold: [0, 0.6, 1] }
    );
    return p.observe(l), m.observe(l), () => {
      p.disconnect(), m.disconnect();
    };
  }, [e.id, e.files.length, t]), ee(() => {
    if (!i) {
      f(!1);
      return;
    }
    const l = new AbortController();
    return be(jd(e.id), {
      signal: l.signal
    }).then((h) => {
      l.signal.aborted || f(h.available === !0);
    }).catch(() => {
      l.signal.aborted || f(!1);
    }), () => l.abort();
  }, [i, e.id]), ee(() => {
    const l = r.current;
    l && (s ? Promise.resolve(l.play()).catch(() => {
    }) : l.pause());
  }, [d, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: _d(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Lp({
  video: e,
  review: t,
  details: n,
  selectedCount: r,
  pending: i,
  refreshing: o,
  error: s,
  canWrite: c,
  assessmentReady: d,
  trees: f,
  selected: l,
  hasPrevious: h,
  hasNext: p,
  onToggleSelected: m,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: k,
  onFindOpenChange: O
}) {
  const F = R(null), B = qa(), C = R(null), L = R(null), x = e.files[0], ae = fl(e), Q = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || Jn(P) && !d;
  fo({
    surface: "overlay",
    enabled: !k,
    actions: t.actions,
    onAction: (P, X) => {
      const Y = t.actions[P];
      Y && w(Y, X);
    },
    onFind: () => O(!0)
  }), ee(() => {
    var X;
    const P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (X = F.current) == null || X.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P;
    };
  }, []);
  function _(P) {
    var ie, W, S;
    if (P.key !== "Tab") return;
    const X = [
      ...((ie = F.current) == null ? void 0 : ie.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((se) => se.offsetParent !== null);
    if (!X.length) {
      P.preventDefault(), (W = F.current) == null || W.focus();
      return;
    }
    const Y = X.indexOf(
      document.activeElement
    );
    P.shiftKey && Y <= 0 ? (P.preventDefault(), (S = X.at(-1)) == null || S.focus()) : !P.shiftKey && Y === X.length - 1 && (P.preventDefault(), X[0].focus());
  }
  function V(P) {
    if (k || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const X = P.key === "ArrowLeft" || P.key === "ArrowRight";
    if (P.altKey && !X) return;
    const Y = C.current, ie = P.currentTarget.querySelector("video");
    if (P.key === "Enter" || P.key === "Escape")
      P.repeat || v();
    else if (P.key === " " && Y)
      P.repeat || Y.toggle();
    else if (X && Y)
      Y.seekBy(
        (P.key === "ArrowLeft" ? -1 : 1) * (P.shiftKey ? 5 : P.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(P.key) && Y) {
      const W = L.current;
      if (!P.repeat && (W == null ? void 0 : W.videoId) === e.id) {
        const S = [x == null ? void 0 : x.duration, ie == null ? void 0 : ie.duration].find(
          (ce) => ce != null && Number.isFinite(ce) && ce > 0
        ) ?? 0, se = e.parentVideoId != null, E = se ? e.clipStartSec ?? 0 : 0, Z = (se ? e.clipEndSec ?? S : S) - E;
        Number.isFinite(Z) && Z > 0 && Number.isFinite(W.time) && Y.seekBy(E + Z * Number(P.key) / 10 - W.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && h && y(), P.key === "ArrowDown" && p && N());
    else return;
    Dr(P);
  }
  function M(P) {
    const X = F.current, Y = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !X || !Y || !X.contains(Y) || Y.closest(".dq-player, .dq-find-action") || P.detail === 0 || X.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (k) return;
    let P = 0;
    const X = requestAnimationFrame(() => {
      P = requestAnimationFrame(() => {
        var ie;
        const Y = document.activeElement;
        (ie = F.current) != null && ie.isConnected && (!Y || Y === document.body || Y === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(X), cancelAnimationFrame(P);
    };
  }, [k, i, o, p, h, e.id, B]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ae}`,
      className: `dq-preview${B ? " dq-preview-mobile" : ""}`,
      onKeyDown: _,
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
                disabled: !h || i || o,
                onClick: y,
                children: [
                  /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
                  !B && /* @__PURE__ */ a(bt, { binding: "↑", hidden: !0 })
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
                disabled: !p || i || o,
                onClick: N,
                children: [
                  !B && /* @__PURE__ */ a(bt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ds, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ae }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ u("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((P) => /* @__PURE__ */ a("li", { children: P.name }, P.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ u("p", { children: [
                "Actions apply to ",
                D
              ] })
            ] }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": l,
                disabled: o,
                onClick: m,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: l && /* @__PURE__ */ a(Vr, {}) }),
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
                "aria-label": `Open ${ae} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a(_s, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: x ? /* @__PURE__ */ a(
            Rs,
            {
              autostart: !0,
              streamUrl: Ii("video", e.id),
              posterUrl: Ko(e),
              format: x.format,
              audioCodec: x.audioCodec,
              duration: x.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (P) => {
                L.current = { videoId: e.id, time: P };
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
          ) : /* @__PURE__ */ a("img", { src: Ko(e), alt: "" }) }) }),
          s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: s }),
          !B && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            Cc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: f,
              isDisabled: Q,
              busy: i || o,
              onApply: (P) => void w(P),
              onFind: () => O(!0),
              status: i ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        k && /* @__PURE__ */ a(
          mo,
          {
            actions: t.actions,
            trees: f,
            isDisabled: Q,
            onApply: (P, X) => {
              O(!1), w(P, X);
            },
            onClose: () => O(!1)
          }
        )
      ]
    }
  );
}
async function Dp() {
  const e = await be("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
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
function ks({ label: e }) {
  return /* @__PURE__ */ u("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(ad, { className: "dq-spin" }),
    e
  ] });
}
function Es({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ u("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Rn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Vp = { components: { DataQualityPage: Rp } };
export {
  Rp as DataQualityPage,
  Vp as default,
  Wn as objectFiltersEqual
};
