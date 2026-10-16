import { jsxs as u, Fragment as pe, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as R, useEffect as Z, useLayoutEffect as $t, useMemo as ve, useCallback as En, useSyncExternalStore as Hi, useId as Ze, createContext as Ml, useContext as Fl, Fragment as Ji } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as Xn, SortableList as As, TagBadge as Pl, EntityReferenceSelector as Lo, EntityDetailTabs as Ll, FilterDialog as Cs, VIDEO_CRITERIA as Xa, DetailListToolbar as da, PERFORMER_CRITERIA as Qi, AUDIO_CRITERIA as Ts, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as Is, AudioPlayer as jl, VideoPlayer as Rs, formatDuration as $s, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as ma, Flag as Ln, Check as Vr, Pencil as Kr, Ban as Va, ChevronDown as Wi, Plus as ga, Pin as Os, GripVertical as Ms, AlertTriangle as xn, Copy as Fs, Trash2 as Za, X as ba, Mic as Hl, Users as xs, Tag as Ps, Headphones as Ls, Film as ei, ChevronLeft as ya, MoreHorizontal as Jl, RectangleHorizontal as Ql, LayoutGrid as Yi, ChevronRight as Ds, Save as Wl, RotateCcw as Yl, Layers as Do, Undo2 as Xl, RefreshCw as Zl, ExternalLink as _s, SkipForward as ed, Upload as td, Download as js, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
import { extensionFetch as sd } from "@cove/runtime/api";
import { createPortal as cd } from "react-dom";
const Xi = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Zi = Object.keys(
  Xi
);
function ua(e) {
  return e === "excludes" || e === "excludesAll";
}
function eo(e) {
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
function Re(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function to(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ue(e) {
  return to(De(e));
}
function dd(e) {
  return De(e) === "video";
}
function De(e) {
  return e.entityType ?? "video";
}
const Qn = [
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
], ti = [
  Qn.slice(0, 11),
  Qn.slice(11, 22),
  Qn.slice(22)
];
function ca(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function fa(e) {
  return ca(e) ?? e.toLocaleUpperCase();
}
const Wn = "none";
function mr(e) {
  return typeof e == "string" && Qn.includes(e);
}
function no(e) {
  const t = e.shortcut;
  return mr(t) || t === Wn ? t : "auto";
}
function Ks(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = no(s);
    if (d !== Wn) {
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
  const o = Qn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = Ks(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (mr(n)) {
    const c = i.get(n), d = r[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(mr));
  return e.map((c, d) => {
    const f = o.has(d) ? o.get(d) : mr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: l, ...h } = c;
    return f === void 0 ? h : { ...h, shortcut: f };
  });
}
function pa(e) {
  var n;
  return Re(e) && !Vs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : De(e) !== "tag" && e.actions.some(
    (r) => ro(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Dn(r, De(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
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
      Math.min(fd[t], n(e.perPage, 40))
    )
  };
}
function _o(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Jn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    Re(e) ? [e.entityType, ...r, e.occurrence] : De(e) === "video" ? r : [De(e), ...r]
  );
}
function Dn(e, t) {
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
  ) && !ro(e) : !1;
}
function pd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Pn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function er(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Gs(e) {
  return "steps" in e && e.steps.length > 0;
}
function Yn(e) {
  return "steps" in e ? e.steps.some((t) => Pn(t.mode)) : !1;
}
function ro(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Pn(n.mode))
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
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Dn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Dn(r, "video"))
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
function Ai(...e) {
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
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Zi.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || bd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
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
function dn(e) {
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
const zs = "ext:com.midnightrider.data-quality:configuration", kd = "ext:cove-data-quality:video-reviews", Ci = "ext:com.midnightrider.data-quality:progress";
class Hs extends Error {
}
const va = /* @__PURE__ */ new Map(), Pa = /* @__PURE__ */ new Map(), fr = (e, t) => e.includes("*") || e.includes(t), za = (e) => ye(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function Ti(e) {
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
    deletedIds: Ti(t.deletedIds),
    importedIds: Ti(t.importedIds)
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
    Ti(
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
  const t = await ye("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ao(e, t) {
  const n = (Pa.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Pa.set(e, n), n.finally(() => {
    Pa.get(e) === n && Pa.delete(e);
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
  const e = await ye("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return ao(t, () => Id(e, t));
}
async function Id(e, t) {
  var p;
  const n = String(e.user.id), r = fr(e.permissions, "savedfilters.read"), i = r && fr(e.permissions, "savedfilters.write"), o = r ? (await za(zs)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
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
        await ye(`/api/savedfilters/${y.id}`, {
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
      reviews: Ai(s.reviews, m.reviews).filter(
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
    if (o.length && y.reviews.some((E) => {
      const O = s.reviews.find((F) => F.id === E.id);
      return O && JSON.stringify(O) !== JSON.stringify(E);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await za(kd)).flatMap(
      (E) => wa(E.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (E) => !y.reviews.some((O) => O.id === E)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Ai(
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
    canWrite: fr(e.permissions, "videos.write"),
    canWriteVideos: fr(e.permissions, "videos.write"),
    canWriteAudios: fr(e.permissions, "audios.write"),
    canWriteTags: fr(e.permissions, "tags.write"),
    canReadTagGroups: fr(e.permissions, "taggroups.read"),
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
      const o = await ye(
        `/api/savedfilters/${n.recordId}`
      );
      if (Lr(o.uiOptions).revision !== n.config.revision)
        throw new Hs(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const i = await ye(
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
  return ao(e, async () => {
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
  const o = (await za(Ci)).find(
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
  return ao(r, async () => {
    const i = va.get(e);
    if (!(i != null && i.writable)) return;
    await Js(i);
    const o = (await za(Ci)).find(
      (s) => s.name === t
    );
    await ye(
      o ? `/api/savedfilters/${o.id}` : "/api/savedfilters",
      {
        method: o ? "PUT" : "POST",
        body: JSON.stringify({
          mode: Ci,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function tr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Cn(e) {
  return Md[e];
}
const Ha = "confirmed_absent_tags", io = "Confirmed absent tags", ni = "confirmed_absent_occurrence_tags", Ws = {
  key: Ha,
  label: io,
  type: "tag",
  subject: "tag assessments"
}, oo = {
  key: ni,
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
function _n(e) {
  return Array.isArray(e) ? e.map(_n) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Ha,
        ni
      ].includes(n.toLowerCase()) ? n.toLowerCase() : _n(n)
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
async function ye(e, t = {}) {
  return await Ys(e, t, "fail");
}
function xd(e, t = {}) {
  return Ys(e, t, "null");
}
const Pd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ld = 0;
function Ja(e, t) {
  return ye(
    `/api/${tr(e)}/${t}?dqRead=${Pd}-${++Ld}`,
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
    _n({
      findFilter: tn(t, Ue(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function _r(e, t, n) {
  return ye(
    `/api/${tr(Ue(e))}/find`,
    { method: "POST", signal: n, body: Xs(e, t) }
  );
}
async function Zs(e, t, n) {
  return (await ye(
    `/api/${tr(Ue(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Xs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function hi(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, ye("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      _n({
        findFilter: tn(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return ye("/api/taggroups", { signal: e });
}
function Ii(e, t, n = 1280) {
  return `/api/${tr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function Ri(e, t) {
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
async function ri(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ye(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await ye("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          _n({
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
async function so(e, t) {
  const n = er(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ri(i.tagIds, t)).filter(
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
async function co(e, t) {
  const r = (await ye("/api/custom-fields")).find(
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
    message: `Add ${Cn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function ec(e, t) {
  const n = await co(e, t);
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
function tc(e = "video") {
  return co(Ws, e);
}
function Bd(e = "video") {
  return ec(Ws, e);
}
function nc(e = "video") {
  return co(oo, e);
}
function Kd(e = "video") {
  return ec(oo, e);
}
function Qa(e) {
  return [...new Set(e)];
}
function rc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ni
  ), i = r === void 0 ? [] : n[r];
  return Qa(
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
      `Could not verify the ${oo.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Vd(e, t, n, r, i, o) {
  await ye(`/api/${tr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Qa(i).map((s) => `${r}:${s}`)
      },
      customFieldMode: o
    })
  });
}
function zd(e, t, n) {
  const r = [...e.tagIds], i = (o) => {
    if (n === null)
      throw new Error(
        `The ${io} custom field is not available.`
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
  if (!Dn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Cn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (Yn(t)) {
    let d;
    try {
      d = await tc(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${io} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const i = Qa(n), o = (await so(t)).map((d) => ({
    mode: d.mode,
    tagIds: Qa(d.tagIds)
  })), c = [
    ...o.filter((d) => !Pn(d.mode)),
    ...o.filter((d) => Pn(d.mode))
  ].map(
    (d) => zd(d, i, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await ye(`/api/${tr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Cn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Hd(e, t) {
  if (!Dn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ye("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const La = (e) => e >= "0" && e <= "9";
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
    if (La(e[n]) && La(t[r])) {
      const c = n, d = r;
      for (; n < e.length && La(e[n]); ) n++;
      for (; r < t.length && La(t[r]); ) r++;
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
function gr(e) {
  return [...e].sort(ic);
}
const $i = /* @__PURE__ */ new Map();
function Jd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function lo(e, t, n) {
  const r = er(e), i = [], o = [];
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
    ...o.filter((p) => !Pn(p.mode)),
    ...o.filter((p) => Pn(p.mode))
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
  return gr(t);
}
function oc(e) {
  return sc(Jd(e));
}
function sc(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), i = R(/* @__PURE__ */ new Set()), o = R(!0);
  return Z(() => (o.current = !0, () => {
    o.current = !1;
  }), []), Z(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      i.current.has(c) || (i.current.add(c), ri([c]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function wt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function yr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = wt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function zo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => wt(t.group) !== "");
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
  return er(e).size > 0 || lc(e).size > 0;
}
function Wd(e) {
  return yr(e).filter(
    (t) => !t.actions.some((n) => dc(e[n]))
  );
}
function Oi(e, t) {
  const n = cc(t), r = new Set(t.absent);
  return yr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...er(e[c])], f = [...lc(e[c])], l = [
        ...d.map((h) => n.has(h)),
        ...f.map((h) => r.has(h))
      ];
      l.some(Boolean) && (s.push(c), l.every(Boolean) && o.push(c));
    }
    return { ...i, answers: o.length ? o : s };
  });
}
function Mi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Yd(e, t, n) {
  const r = { ids: [...cc(t)], absent: t.absent }, i = lo(e, r, n), o = new Set(i.removed), s = new Set(i.absenceCleared);
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
function pr(e, t) {
  const n = new Set(Xd(e));
  return t.filter((r) => n.has(r.id));
}
function Ho(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of pr(e, t))
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
function Fi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function uo(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (s, c) => Fi(s.key, s.members, i) && !(c > o && Fi(i.key, i.members, s))
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
    (n) => n.key === e.key || Fi(n.key, n.tagIds ?? [], e)
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
function fo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [au(e.mixed)] : []
  ];
}
function iu(e) {
  const t = fo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function ou(e, t, n) {
  const r = pr(e, t).map((i) => {
    const o = e.filter((c) => c.tagId === i.id);
    if (o.every((c) => c.categoryTagId === void 0)) return i.name;
    const s = o.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const xi = "-", Jo = "Ctrl+a", su = "Ctrl/⌘A", cu = ["f", "g", "k", "n", "m", ",", "."], mi = "Shift+", pc = {
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
function po({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const s = zr(n), c = R({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  $t(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, l = Qn.filter(
    (p) => s.actionOn.has(p) || cu.includes(p)
  ).join(" "), h = ve(() => {
    const p = (N, v) => {
      var E, O;
      const w = c.current;
      if (N === Jo) (E = w.onSelectAll) == null || E.call(w);
      else if (N === xi) (O = w.onFind) == null || O.call(w);
      else {
        const F = lu.has(N), U = F || N.startsWith(mi), C = F ? du(v) : U ? N.slice(mi.length) : N, L = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        L !== void 0 && w.onAction(L, U);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || p((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Jo, "local")), d && y.push(m(xi));
    for (const N of l ? l.split(" ") : []) {
      const v = pc[N];
      y.push(m(N), ...(v ?? [`${mi}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, l, d, f]);
  xl(h, t);
}
const uu = {
  find: xi,
  selectAll: su
};
function ho() {
  return uu;
}
const fu = 600 * 1e3, mo = /* @__PURE__ */ new Map(), hc = /* @__PURE__ */ new Map(), Hn = /* @__PURE__ */ new Map();
function mc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = hc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function gc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && hc.set(e.tagGroupId, e.tagGroupSortOrder), mo.set(e.id, { tag: e, at: Date.now() });
}
function bc(e) {
  const t = mo.get(e);
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
function Pi(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && gc(yc({ ...n, name: r }));
  }
}
function pu(e) {
  const t = Hn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ye(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var l, h;
        const o = ((l = i == null ? void 0 : i.name) == null ? void 0 : l.trim()) || null;
        if (Hn.get(e) === r && Hn.delete(e), !o) return null;
        const s = yc({ ...i, id: e, name: o }), c = (h = mo.get(e)) == null ? void 0 : h.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return gc(f), mc(f);
      },
      () => (Hn.get(e) === r && Hn.delete(e), null)
    )
  };
  return Hn.set(e, r), r;
}
function Wo() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function gi(e) {
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
        l.waiters -= 1, l.waiters === 0 && Hn.get(f) === l && (Hn.delete(f), l.controller.abort());
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
    tags: gi(bi(t))
  }));
  return Z(() => {
    const i = bi(t), o = gi(i);
    if (r({ key: t, tags: o }), i.every((c) => c in o)) return;
    const s = new AbortController();
    return hu(i, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : gi(bi(t));
}
function Hr(e) {
  const t = Na(e);
  return ve(() => wc(t), [t]);
}
function bi(e) {
  return e ? e.split(",").map(Number) : [];
}
const mu = "(max-width: 760px)";
function vc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = En(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Hi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
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
function vr(e, t, n = [], r) {
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
  const i = er(e), o = (s) => i.has(s) || [...i].some((c) => {
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
function ai(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function go({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: i = !0,
  tapStays: o = !1,
  onApply: s,
  onClose: c
}) {
  const d = qa(), [f, l] = T(""), [h, p] = T(0), m = R(null), y = R(null), N = R(null), v = R(null), w = R(null), E = R(/* @__PURE__ */ new Set()), O = Ze(), F = Hr(ve(() => ai(e), [e])), U = zr(e), C = ve(() => {
    const _ = f.trim().toLocaleLowerCase(), G = (M) => M ? Qn.indexOf(M) : Qn.length;
    return e.map((M, D) => ({ action: M, index: D, key: U.keys[D] })).sort((M, D) => G(M.key) - G(D.key)).filter((M) => !_ || M.action.label.toLocaleLowerCase().includes(_));
  }, [e, U, f]), L = C.length ? Math.min(h, C.length - 1) : -1, x = (_) => `${O}-option-${_}`;
  $t(() => {
    var _, G, M;
    return v.current = document.activeElement, w.current = ((G = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : G.closest('[role="dialog"]')) ?? null, (M = m.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), Z(() => {
    var _, G, M;
    L < 0 || (M = (G = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${x(C[L].index)}"]`)) == null ? void 0 : G.scrollIntoView) == null || M.call(G, { block: "nearest" });
  }, [L, C]);
  function ne(_, G) {
    !_ || r != null && r(_.action) || s(_.action, i && G);
  }
  function J(_) {
    var M;
    _.stopPropagation();
    const G = _.code || _.key;
    if (_.repeat || E.current.add(G), !dn(_)) {
      if (_.repeat && !E.current.has(G)) {
        _.preventDefault();
        return;
      }
      if (_.key === "Escape")
        _.preventDefault(), _.repeat || c();
      else if (_.key === "Enter")
        _.preventDefault(), _.repeat || ne(C[L], _.shiftKey);
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
        onKeyDown: J,
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
              children: C.map((_, G) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ u(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: x(_.index),
                  tabIndex: -1,
                  "aria-selected": G === L,
                  disabled: (r == null ? void 0 : r(_.action)) ?? !1,
                  onClick: (M) => ne(_, M.shiftKey || o && Gs(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ u(pe, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": ca(_.key) ? !0 : void 0, children: _.key }),
                      ca(_.key) && /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ca(_.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: vr(_.action, F, t, n).map(
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
function bo(e) {
  return Hi(e.subscribe, e.get, e.get);
}
function qc(e, t) {
  const n = R(t);
  $t(() => {
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
const bu = [], Li = ti.map(
  (e, t) => ({ indent: t, keys: e })
), Yo = Li.length - 1;
function vt({ binding: e, hidden: t }) {
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
function Da(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kc(e) {
  return ti.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
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
                /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
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
  const y = ho(), N = zr(e), v = qa();
  qc(o, v);
  const w = Ze(), E = Hr(
    ve(() => e.flatMap((k) => k.steps.flatMap((oe) => oe.tagIds)), [e])
  ), O = Li.filter((k) => k.keys.some((oe) => N.actionOn.has(oe))), F = O.includes(Li[Yo]), U = e.length - N.actionOn.size, C = ve(
    () => l && !f ? yr(e) : [],
    [l, f, e]
  ), L = ve(
    () => C.length && r ? Oi(e, r) : null,
    [C, e, r]
  ), x = new Map(
    Mi(L ?? []).flatMap(
      (k) => k.actions.filter((oe) => dc(e[oe])).map((oe) => [oe, k.name])
    )
  ), ne = ve(
    () => e.map((k) => f ? [] : ru(k, h, i)),
    [e, h, i, f]
  ), J = (k) => k.map(iu).join("; "), _ = ne.map(J), G = C.length > 0 && /* @__PURE__ */ a(
    yu,
    {
      groups: C,
      statuses: L,
      actions: e,
      attentionOf: (k) => J([
        ...new Map(
          k.actions.flatMap((oe) => ne[oe]).map((oe) => [oe.key, oe])
        ).values()
      ])
    }
  ), M = (k) => {
    const oe = vr(e[k], E, [], i).map((ce) => ce.text).join(", "), A = x.get(k), X = _[k];
    return [
      oe,
      A === void 0 ? "" : `${A}: not answered yet`,
      X ? `Needs attention: ${X}` : ""
    ].filter(Boolean).join(". ");
  }, D = (k) => _[k] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${_[k]}`,
        children: /* @__PURE__ */ a(Ln, {})
      }
    )
  ) : null, P = (k) => ({
    onMouseEnter: () => o.set(k),
    onMouseLeave: () => o.clear(k),
    onFocus: () => o.set(k),
    onBlur: () => o.clear(k)
  }), Y = (k) => {
    const oe = N.actionOn.get(k), A = oe === void 0 ? void 0 : e[oe];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(vt, { binding: k, hidden: !0 })
        },
        k
      );
    const X = t(A), ce = `${w}-effect-${k}`;
    return /* @__PURE__ */ u("div", { className: "dq-pad-slot", ...f ? {} : P(A), children: [
      /* @__PURE__ */ a("span", { id: ce, className: "dq-sr-only", children: M(oe) }),
      /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": k,
          "aria-describedby": ce,
          "data-group-open": x.has(oe) || void 0,
          "data-attention": _[oe] ? !0 : void 0,
          disabled: X,
          onClick: (ue) => s(A, ue.shiftKey),
          children: [
            /* @__PURE__ */ a(vt, { binding: k }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            Da(A) && " ",
            Da(A) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(oe)
          ]
        }
      )
    ] }, k);
  }, W = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const k = kc(N), oe = (A) => {
      const X = e[A], ce = N.keys[A];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": ce,
          "aria-describedby": `${w}-effect-${ce}`,
          "data-group-open": x.has(A) || void 0,
          "data-attention": _[A] ? !0 : void 0,
          disabled: t(X),
          onClick: (ue) => {
            o.clear(X), s(X, ue.shiftKey || p && Gs(X));
          },
          ...f ? {} : Sc(o, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            Da(X) && " ",
            Da(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(A)
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
            f ? W : /* @__PURE__ */ a(
              Xo,
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
            m && /* @__PURE__ */ a(wu, { checked: p, onChange: m })
          ] }),
          G,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Ec,
            {
              groups: k,
              renderAction: oe,
              find: /* @__PURE__ */ a(
                Ac,
                {
                  extra: U,
                  findKey: y.find,
                  disabled: d,
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
  const re = /* @__PURE__ */ u("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), Q = !F && /* @__PURE__ */ u(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": U ? `Find action, ${U} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: c,
      children: [
        /* @__PURE__ */ a(vt, { binding: y.find }),
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
        /* @__PURE__ */ u("div", { className: `dq-pad-header${G ? " dq-pad-header-groups" : ""}`, children: [
          f ? W : /* @__PURE__ */ a(
            Xo,
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
          G ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ u("div", { className: "dq-pad-header-end", children: [
              G,
              re,
              Q
            ] })
          ) : /* @__PURE__ */ u(pe, { children: [
            !f && re,
            Q
          ] })
        ] }),
        O.map((k) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": k.indent, children: [
          k.keys.map(Y),
          k.indent === Yo && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": U ? `Find action, ${U} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(vt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(ma, { "aria-hidden": "true" }),
                  U ? `${U} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, k.indent))
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
  const d = bo(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && m < e.length && /* @__PURE__ */ u(pe, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(vt, { binding: s })
      ] })
    ] });
  }
  const l = t.keys[f], h = r && d.steps.length ? lo(d, r, i) : null, p = h && !h.unresolvedTrees.length && ![h.added, h.removed, h.markedAbsent, h.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    l && !c && /* @__PURE__ */ a(vt, { binding: l }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    vr(d, n, [], i).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
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
  const y = ho(), N = zr(e), v = qa(), w = Ze(), E = Hr(ve(() => ai(e), [e])), [O] = T(() => Nc());
  qc(O, v);
  const F = R(null), U = Nu(F, e, !v), C = kc(N);
  !C.length && e.length && C.push([]);
  const L = C.flat(), x = e.length - L.length, ne = (M) => vr(M, E, t, n).map((D) => D.text).join(", "), J = (M) => ({
    onMouseEnter: () => O.set(M),
    onMouseLeave: () => O.clear(M),
    onFocus: () => O.set(M),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || O.clear(M);
    }
  }), _ = d ?? (v ? void 0 : f), G = (M) => {
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
      className: `dq-action-bar${v ? " dq-bar-mobile" : U ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${p ? ` ${p}` : ""}`,
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
                  renderAction: G,
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
                  const Y = e[P], W = N.keys[P];
                  return /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": W || void 0,
                      "aria-describedby": `${w}-effect-${P}`,
                      disabled: m || r(Y),
                      onClick: () => o(Y),
                      ...m ? {} : J(Y),
                      children: [
                        W && /* @__PURE__ */ a(vt, { binding: W }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: Y.label })
                      ]
                    },
                    Y.id
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
                      /* @__PURE__ */ a(vt, { binding: y.find, hidden: !0 }),
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
            names: E,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        l && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: l }),
        /* @__PURE__ */ a("div", { hidden: !0, children: L.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: ne(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: h })
      ]
    }
  );
}
function Nu(e, t, n) {
  const [r, i] = T(!1);
  return $t(() => {
    var l;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const s = o.querySelector(".dq-bar-summary"), c = () => {
      const h = getComputedStyle(o), p = parseFloat(h.columnGap) || 0, m = o.clientWidth - (parseFloat(h.paddingLeft) || 0) - (parseFloat(h.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (L) => [...L.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), E = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + p : 0) + 1 + // the divider
      2 * p, O = (L) => y.map((x) => {
        let ne = 1, J = 0;
        for (const _ of x)
          J > 0 && J + v + _ > L ? (ne += 1, J = _) : J += (J > 0 ? v : 0) + _;
        return ne;
      }), F = (L) => Math.max(1, L.reduce((x, ne) => x + ne, 0)), U = O(m), C = F(O(m - E));
      i(
        1 + F(U) < C || 1 + F(U) === C && U.every((L) => L === 1)
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
  const c = bo(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ u("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(vt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    vr(c, r, i, o).map((l, h) => /* @__PURE__ */ a("span", { "data-effect-tone": l.tone, children: l.text }, h))
  ] });
}
const Zo = 1e3;
async function Su(e, t, n) {
  const r = await ye(
    `/api/tags/${t}`,
    { signal: n }
  ), i = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await ye(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          _n({
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
  const o = [...i.values()], s = Ue(e), c = Re(e) ? await Eu(
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
    _n({
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
            r[c] = (await ye(
              `/api/${tr(e)}/aggregate`,
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
    for (const r of er(n))
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
  const n = wt(e);
  return ((r = yr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
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
  Z(
    () => () => {
      for (const M of m.current.values()) M.abort();
    },
    []
  );
  const y = Cn(Ue(t)), N = Re(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = m.current.get(M)) == null || P.abort();
    const D = new AbortController();
    m.current.set(M, D), d((Y) => ({ ...Y, [M]: { status: "loading" } })), Su(t, M, D.signal).then(
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [M]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [M]: { status: "failed", message: $u(Y) }
        }));
      }
    );
  }
  function E(M) {
    var re;
    const D = o.filter((Q) => !M.includes(Q));
    for (const Q of D)
      (re = m.current.get(Q)) == null || re.abort(), m.current.delete(Q);
    const P = (Q) => {
      const k = c[Q];
      return (k == null ? void 0 : k.status) === "ready" ? k.group.children.map((oe) => oe.id) : [];
    }, Y = new Set(M.flatMap(P)), W = D.flatMap(P).filter((Q) => !Y.has(Q));
    l(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => !W.includes(Number(k)))
      )
    ), p(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => M.includes(Number(k)))
      )
    ), d(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([k]) => M.includes(Number(k)))
      )
    ), s(M);
    for (const Q of M) o.includes(Q) || w(Q);
  }
  const O = o.flatMap((M) => {
    const D = c[M];
    return (D == null ? void 0 : D.status) === "ready" ? [D.group] : [];
  }), F = O.length === o.length, U = o.some(
    (M) => {
      var D;
      return (((D = c[M]) == null ? void 0 : D.status) ?? "loading") === "loading";
    }
  ), C = new Map(
    Au(O).map((M) => [M.parent.id, M])
  ), L = Cu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), ne = Tu(t.actions), J = (M) => f[M] ?? !ne.has(M), _ = F ? [...C.values()].flatMap((M) => {
    const D = Ru(M.parent.name, t.actions);
    return M.children.filter((P) => J(P.id)).map((P) => ({ child: P, answerGroup: D }));
  }) : [], G = (M, D) => l((P) => ({
    ...P,
    ...Object.fromEntries(M.children.map((Y) => [Y.id, D]))
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
      Xn,
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
      const Y = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: h[M] ?? !1,
                disabled: n,
                onChange: (W) => p((re) => ({
                  ...re,
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
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(pe, { children: [
            /* @__PURE__ */ u("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Y}`,
                  onClick: () => G(P, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Y}`,
                  onClick: () => G(P, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: P.children.map((W) => {
              const re = ne.get(W.id) ?? [], Q = (L.get(W.id) ?? []).filter((k) => k !== M).map((k) => `“${x.get(k)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: J(W.id),
                    disabled: n,
                    onChange: (k) => l((oe) => ({
                      ...oe,
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
                  re.length > 0 && /* @__PURE__ */ u("small", { children: [
                    " ",
                    "· Already in “",
                    re[0].label || "New action",
                    "”",
                    re.length > 1 ? ` and ${re.length - 1} more` : ""
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
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: U ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Mu(e, t, n, r) {
  const i = wt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: wt(c) === i });
    return o;
  }
  const s = wt(r);
  for (const c of t)
    wt(c).includes(s) && o.push({ kind: "group", name: c, selected: wt(c) === i });
  return s && !t.some((c) => wt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Fu(e) {
  return e.kind === "group" ? `group:${wt(e.name)}` : e.kind;
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
]), Lu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), _a = 4, es = 240;
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
  const o = Ze(), s = Ze(), c = Ze(), d = R(null), f = R(null), l = R(null), h = R(null), p = R(null), m = R([]), y = R(!1), N = R(!1), [v, w] = T(!1), [E, O] = T(null), [F, U] = T(null), [C, L] = T(!1), x = e.group ?? "", ne = ve(
    () => Mu(t, n, x, E),
    [t, n, x, E]
  ), J = ne.map(Fu), _ = F === null ? -1 : J.indexOf(F), G = (A) => `${s}-option-${A}`, M = (A) => i(A ? { ...e, group: A } : xu(e)), D = () => {
    var X;
    const A = ((X = l.current) == null ? void 0 : X.value) ?? x;
    A.trim() !== A && M(A.trim());
  };
  function P(A) {
    O(null), U(A), w(!0);
  }
  const Y = (A) => {
    var X, ce;
    return A instanceof Node && (((X = d.current) == null ? void 0 : X.contains(A)) || ((ce = h.current) == null ? void 0 : ce.contains(A))) === !0;
  };
  function W() {
    var A, X;
    (A = h.current) != null && A.contains(document.activeElement) && ((X = p.current) == null || X.focus({ preventScroll: !0 })), w(!1), O(null), U(null), L(!1);
  }
  function re(A) {
    A.kind === "group" && A.selected && E === null || M(A.kind === "none" ? "" : A.name), W();
  }
  function Q() {
    const A = f.current, X = h.current;
    if (!A || !X) return;
    const ce = A.getBoundingClientRect(), ue = window.visualViewport, K = (ue == null ? void 0 : ue.offsetTop) ?? 0, Ae = (ue ? ue.offsetTop + ue.height : window.innerHeight) - ce.bottom - _a, qe = ce.top - K - _a, we = Math.min(X.scrollHeight, es), Ge = Ae < we && qe > Ae;
    X.style.left = `${ce.left}px`, X.style.width = `${ce.width}px`, X.style.top = `${Ge ? ce.top - _a : ce.bottom + _a}px`, X.style.transform = Ge ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(es, Ge ? qe : Ae))}px`, _u(A, X, ce, m.current) || W();
  }
  $t(() => {
    var A;
    v && (f.current && (m.current = Du(f.current)), N.current && ((A = h.current) == null || A.focus({ preventScroll: !0 }), L(!0)), N.current = !1);
  }, [v]), $t(() => {
    v && Q();
  }), Z(() => {
    if (!v) return;
    const A = () => Q(), X = (K) => {
      Y(K.target) || W();
    }, ce = [...m.current, window], ue = window.visualViewport;
    for (const K of ce) K.addEventListener("scroll", A);
    return window.addEventListener("resize", A), ue == null || ue.addEventListener("resize", A), ue == null || ue.addEventListener("scroll", A), document.addEventListener("pointerdown", X), () => {
      for (const K of ce) K.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), ue == null || ue.removeEventListener("resize", A), ue == null || ue.removeEventListener("scroll", A), document.removeEventListener("pointerdown", X);
    };
  }, [v]), Z(() => {
    var A, X, ce;
    _ >= 0 && ((ce = (X = (A = h.current) == null ? void 0 : A.children[_]) == null ? void 0 : X.scrollIntoView) == null || ce.call(X, { block: "nearest" }));
  }, [_]);
  function k(A) {
    if (dn(A)) return;
    const X = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (X && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), P(A.altKey ? null : wt(x) ? `group:${wt(x)}` : "none");
      return;
    }
    if (v)
      if (X) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && W();
          return;
        }
        const ce = A.key === "ArrowDown" ? 1 : -1, ue = E !== null && wt(E) && J.length > 1 ? 1 : 0, K = _ < 0 ? ce > 0 ? ue : J.length - 1 : (_ + ce + J.length) % J.length;
        U(J[K]);
      } else A.key === "Enter" && (A.preventDefault(), _ >= 0 ? re(ne[_]) : (D(), W()));
  }
  function oe(A) {
    var ce;
    if (A.key === "Tab") {
      W(), A.shiftKey && ((ce = l.current) == null || ce.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || dn(A) && !Lu.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const ue = l.current;
      ue && (ue.focus(), ue.setSelectionRange(ue.value.length, ue.value.length));
      return;
    }
    !Pu.has(A.key) && !dn(A) && L(!1), k(A);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || dn(A) || (A.preventDefault(), A.stopPropagation(), W());
      },
      children: [
        /* @__PURE__ */ u("div", { ref: d, className: "dq-action-field", children: [
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
                ref: l,
                id: o,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && _ >= 0 ? G(_) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: x,
                onChange: (A) => {
                  M(A.target.value), O(A.target.value), U(null), w(!0);
                },
                onClick: () => {
                  v || P(null);
                },
                onKeyDown: k,
                onBlur: () => {
                  W(), D();
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
                onPointerDown: (A) => {
                  y.current = A.pointerType === "touch";
                },
                onMouseDown: (A) => A.preventDefault(),
                onClick: () => {
                  var ce;
                  const A = y.current;
                  y.current = !1;
                  const X = document.activeElement === l.current;
                  v ? W() : (N.current = A && !X, P(null)), (!A || X) && ((ce = l.current) == null || ce.focus());
                },
                children: /* @__PURE__ */ a(Wi, { "aria-hidden": "true" })
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
              "aria-activedescendant": _ >= 0 ? G(_) : void 0,
              "data-tap-focus": C || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: oe,
              onBlur: (A) => {
                Y(A.relatedTarget) || W();
              },
              children: ne.map((A, X) => /* @__PURE__ */ u(
                "li",
                {
                  id: G(X),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": X === _ || void 0,
                  onMouseMove: () => {
                    X !== _ && U(J[X]);
                  },
                  onClick: () => re(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(Vr, { className: "dq-combobox-check", "aria-hidden": "true" })
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
const zn = [
  ...ti,
  ["auto", Wn]
];
function Tc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : no(e[n]);
}
function Uu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, s] = T(!1), c = R(null), d = n.keys[t], f = Tc(e, n, t), l = mr(f), h = n.duplicatePins.has(t) ? ` (${fa(e[t].shortcut ?? "")} is pinned twice)` : "", p = d ? `${fa(d)}, ${l ? "pinned" : "Auto"}${h}` : f === Wn ? "no key, Find action only" : `no key: Auto found no free key${h}`, m = () => {
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
          d ? /* @__PURE__ */ a(vt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
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
  $t(() => {
    var N, v, w;
    (N = h(c || d)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function p(N) {
    var v;
    mr(N) && l(N), (v = h(N)) == null || v.focus();
  }
  function m(N) {
    var C, L, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const ne = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], J = ne.indexOf(document.activeElement);
      N.preventDefault(), (L = ne[(J + (N.shiftKey ? -1 : 1) + ne.length) % ne.length]) == null || L.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? zn.findIndex((ne) => ne.includes(v)) : -1;
    if (!v || w < 0) return;
    const E = zn[w].indexOf(v), O = (ne) => ne == null ? void 0 : ne[Math.min(E, ne.length - 1)], F = {
      ArrowLeft: zn[w][E - 1],
      ArrowRight: zn[w][E + 1],
      ArrowUp: O(zn[w - 1]),
      ArrowDown: O(zn[w + 1]),
      Home: zn[w][0],
      End: zn[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const U = F[N.key];
    U && p(U);
  }
  const y = (N) => {
    const v = mr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: no(e[v]) === N
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
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ti.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const E = y(w), O = E ? `${E.own ? "this action" : E.label}, ${E.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${E ? "" : " dq-key-choice-free"}${E != null && E.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${fa(w)}: ${O}`,
                "aria-pressed": !!(E != null && E.own && E.pinned),
                title: E ? `${E.label} (${E.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => l(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(vt, { binding: w }),
                    (E == null ? void 0 : E.pinned) && /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
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
                "data-choice": Wn,
                tabIndex: 0,
                "aria-pressed": d === Wn,
                onClick: () => i(Wn),
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
  if (Dn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (ro(e)) return "Contradictory assessments";
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
  const d = De(e), f = d !== "tag", l = e.actions, h = zr(l), p = Hr(ve(() => ai(l), [l])), m = ve(
    () => f ? yr(l).map((K) => K.name) : [],
    [f, l]
  ), y = l.findIndex((K) => K.id === o), N = ve(
    () => f && y >= 0 ? yr(
      l.filter((K, be) => be !== y)
    ).map((K) => K.name) : [],
    [f, l, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ve(
    () => new Set(
      v ? Wd(l).map((K) => K.key) : []
    ),
    [v, l]
  ), [E, O] = T(""), [F, U] = T(!1), [C, L] = T(
    null
  ), x = Ze(), ne = `${x}-from-tags`, J = R(null), _ = R(null), G = R(null), M = R(null), D = R(/* @__PURE__ */ new WeakMap()), P = (K) => {
    let be = D.current.get(K);
    return be || (be = crypto.randomUUID(), D.current.set(K, be)), be;
  }, Y = E.trim().toLocaleLowerCase(), W = Y ? l.filter((K) => K.label.toLocaleLowerCase().includes(Y)) : l, re = (K) => t({ ...e, actions: K }), Q = (K, be) => re(l.map((Ae, qe) => qe === K ? be : Ae));
  function k(K) {
    var be;
    return [...((be = G.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ae) => Ae.dataset.actionId === K
    );
  }
  function oe(K, be) {
    const Ae = k(K), qe = Ae == null ? void 0 : Ae.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return qe == null || qe.focus(), !!qe;
  }
  $t(() => {
    var be;
    const K = M.current;
    K && (M.current = null, (K === "add" || !oe(K.id, K.part)) && ((be = _.current) == null || be.focus()));
  }), Z(() => {
    !c || !o || (W.some((K) => K.id === o) ? oe(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function A() {
    const K = zu(d);
    O(""), re([...l, K]), s(K.id), M.current = { id: K.id, part: "label" };
  }
  function X(K) {
    const be = l[K], { shortcut: Ae, ...qe } = structuredClone(be), we = {
      ...qe,
      ...Ae === Wn ? { shortcut: Ae } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    re([...l.slice(0, K + 1), we, ...l.slice(K + 1)]), s(we.id), M.current = { id: we.id, part: "label" };
  }
  function ce(K) {
    const be = l[K], Ae = W.indexOf(be), qe = W[Ae + 1] ?? W[Ae - 1];
    re(l.filter((we, Ge) => Ge !== K)), o === be.id && s(null), M.current = qe ? { id: qe.id, part: "toggle" } : "add";
  }
  function ue() {
    U(!1), requestAnimationFrame(() => {
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
            ref: _,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
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
              L(null), U(!F);
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
              value: E,
              onChange: (K) => O(K.target.value),
              onKeyDown: (K) => {
                K.key === "Escape" && E && !dn(K) && (K.preventDefault(), K.stopPropagation(), O(""));
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
              onChange: (K) => t({
                ...e,
                stayUntilGroupsAnswered: K.target.checked ? !0 : void 0
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
        onKeyDown: (K) => {
          K.key !== "Escape" || K.defaultPrevented || dn(K) || (K.preventDefault(), K.stopPropagation(), ue());
        },
        children: /* @__PURE__ */ a(
          Ou,
          {
            id: ne,
            review: e,
            disabled: i,
            onAdd: (K) => {
              const be = [...l, ...K];
              re(be), L({ actions: be, count: K.length }), ue();
            },
            onCancel: ue
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: G, children: W.length > 0 && /* @__PURE__ */ a(
      As,
      {
        items: W,
        getKey: (K) => K.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (K) => re(K),
        renderItem: (K, { dragHandleProps: be, isOver: Ae }) => {
          const qe = l.indexOf(K), we = o === K.id;
          return /* @__PURE__ */ a(
            Ju,
            {
              action: K,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Uu,
                {
                  actions: l,
                  index: qe,
                  keyMap: h,
                  name: K.label.trim() || "New action",
                  onChoose: (Ge) => re(ud(l, qe, Ge))
                }
              ),
              takenPin: h.duplicatePins.has(qe) ? K.shortcut : void 0,
              groupUnanswerable: "steps" in K && w.has(wt(K.group)),
              effect: vr(K, p, n, r),
              open: we,
              detailId: `${x}-detail-${K.id}`,
              dragHandleProps: be,
              isOver: Ae,
              reorderDisabled: i || !!Y,
              onToggle: () => s(we ? null : K.id),
              onDuplicate: () => X(qe),
              onDelete: () => ce(qe),
              children: "steps" in K ? /* @__PURE__ */ a(
                Qu,
                {
                  action: K,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: Re(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Ge, me) => D.current.set(Ge, P(me)),
                  onChange: (Ge) => Q(qe, Ge)
                }
              ) : /* @__PURE__ */ a(
                Yu,
                {
                  action: K,
                  tagGroups: n,
                  onChange: (Ge) => Q(qe, Ge)
                }
              )
            }
          );
        }
      }
    ) }),
    l.length ? !W.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      E.trim(),
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
  const N = e.label.trim() || "New action", v = Vu(e, t), w = "steps" in e && wt(e.group) ? e.group.trim() : "";
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
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((E, O) => /* @__PURE__ */ a("span", { "data-effect-tone": E.tone, children: E.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${fa(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
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
                  /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
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
              children: /* @__PURE__ */ a(Wi, { "aria-hidden": "true" })
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
  const d = Ze(), f = R(null), l = R(null);
  $t(() => {
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
                  s(v, p), h(e.steps.map((w, E) => E === m ? v : w));
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
          Xn,
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
function nn({ tag: e, name: t }) {
  const n = Fl($c), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Cn(Ue(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      Xn,
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
  const n = Cn(Ue(e)).many, r = e.occurrence, i = Us(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Na([
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
          /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(nn, { tag: s[l.tagId], name: p })
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
            children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
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
  video: ei,
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
function yo(e) {
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
          value: De(e),
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
  const n = De(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function sf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), r = R(null), i = Ze(), o = Ze();
  return Z(() => {
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
    () => Re(e) && e.occurrence.tagIds.length > 0
  ), [E, O] = T(""), [F, U] = T(null), [C, L] = T(0), [x, ne] = T(!1), J = R(null), _ = R(null), G = R(null), M = of(e, w), D = De(e), P = ve(() => Br(e), [e]);
  Z(() => O(""), [P]), Z(() => {
    var oe, A;
    if (x) return;
    const Q = J.current;
    if (J.current = null, !Q) return;
    (A = Q.isConnected && !!((oe = G.current) != null && oe.contains(Q)) && !(Q instanceof HTMLButtonElement && Q.disabled) ? Q : G.current) == null || A.focus({ preventScroll: !0 });
  }, [x]);
  function Y() {
    if (!(s || x)) {
      if (!f) {
        m();
        return;
      }
      J.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ne(!0);
    }
  }
  function W() {
    const Q = { ...e, name: e.name.trim() }, k = pa(Q);
    if (!k) {
      O(""), p();
      return;
    }
    if (O(k), !Q.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = _.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const oe = e.actions.find(
      (A) => !Dn(A, D)
    );
    oe && (v("Actions"), U(oe.id), L((A) => A + 1));
  }
  const re = E || d;
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ u(
      "aside",
      {
        ref: (Q) => {
          G.current = Q, y && (y.current = Q);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (Q) => {
          Q.key !== "Escape" || Q.defaultPrevented || s || dn(Q) || (Q.preventDefault(), Q.stopPropagation(), Y());
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
                children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ll,
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
                        onChange: (Q) => r(Q.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  Re(e) && /* @__PURE__ */ a(ef, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => yo(e),
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
                    onExpand: U,
                    reveal: C
                  }
                )
              }
            ),
            w && Re(e) && /* @__PURE__ */ a(
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
          (re || h) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            h,
            re && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
              re
            ] })
          ] }),
          /* @__PURE__ */ u("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? l ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
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
      sf,
      {
        onKeepEditing: () => ne(!1),
        onDiscard: () => {
          J.current = null, ne(!1), m();
        }
      }
    )
  ] });
}
function cf({
  review: e,
  onChange: t
}) {
  const n = Ze(), r = e.view, i = (l) => t({ ...e, view: { ...r, ...l } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (De(e) === "tag")
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
            Xn,
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
        Xn,
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
  const n = Ze(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, d) => t(
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
            children: /* @__PURE__ */ a(Za, { "aria-hidden": "true" })
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
          c.key !== "Escape" || dn(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Cs,
          {
            open: !0,
            onClose: () => i(null),
            criteria: Xa,
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
  const i = Ze();
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
  const s = Ze(), c = Ze();
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
const Di = "The queue differs from the saved review.";
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
  const w = bf(v), [E, O] = T({ differs: p, text: "" });
  return E.differs !== p && O({
    differs: p,
    text: p ? E.differs === !1 ? Di : E.text : ""
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
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: E.text })
  ] });
}
function ff({
  change: e,
  onPress: t
}) {
  const n = Ze(), r = Ze(), i = `${Di} Save these filters to the review.`, o = e.onSave ? `${Di} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
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
function Ka(e) {
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
  for (let o = 1; o <= i.length && !Ka(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ka(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ka(e) ? !0 : (r(), !1);
}
function gf(e) {
  const t = vc(mf), [n, r] = T(0), i = R(!1);
  $t(() => {
    e.current && (i.current = !rs(e.current, t));
  }, [e, t, n]), $t(() => {
    const o = e.current;
    o && t && !i.current && !Ka(o) && (i.current = !rs(o, t));
  }), Z(() => {
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
  return Z(() => {
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
  Z(() => {
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
          dn(h) || (h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), h.stopPropagation(), f(!0)));
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
          /* @__PURE__ */ a(Yi, { "aria-hidden": "true" }),
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
function wo({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, i] = T(!1), [o, s] = T(!1), c = R(null), d = R(null), f = Ze();
  $t(() => {
    if (!r || !d.current || !c.current) return;
    const p = c.current.getBoundingClientRect(), m = d.current.offsetHeight + 12, y = window.innerHeight - p.bottom;
    s(y < m && p.top > y);
  }, [r]), Z(() => {
    var p, m;
    r && ((m = (p = d.current) == null ? void 0 : p.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus({ preventScroll: !0 }));
  }, [r]), Z(() => {
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
          children: e.map((p) => /* @__PURE__ */ u(Ji, { children: [
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
function Wa(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function vo(e) {
  return String(e.type).toLowerCase() === "tag";
}
function No(e) {
  return !!String(e ?? "").trim();
}
function qo(e) {
  return [
    ...new Set(
      Wa(e.customFieldCriteria).filter(vo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !No(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function So(e, t) {
  const n = Wa(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!vo(o)) return o;
    const s = { ...o };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[c] ?? "")];
      f && !No(o[d]) && (s[d] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Uc(e, t, n) {
  const r = Wa(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Wa(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (l) => (d[l] ?? void 0) === (f[l] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!vo(d)) return d;
    const f = i.find((h) => o(h, d));
    if (!f) return d;
    const l = { ...d };
    for (const [h, p] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(d[h] ?? "")];
      m && d[p] === m && !No(f[p]) && (delete l[p], s = !0);
    }
    return l;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function wf(e, t, n) {
  if (!Dn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Ue(e), i = n.steps.some((c) => Pn(c.mode)) ? await Gd(r) : "", o = await so(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !Pn(d.mode)),
    ...o.filter((d) => Pn(d.mode))
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
async function ko(e, t) {
  const n = e.occurrence;
  if (eo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await ye("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        _n({
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
function Eo(e, t) {
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
            { filter: { performerFilterCriterion: o } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: ni,
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
async function Ao(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => ri([n], t))
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
  const i = Ue(e), o = await _r(
    Eo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Ao(c, r) : [], f = new Array(o.items.length);
  let l = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; l < o.items.length; ) {
        const h = l++, p = o.items[h], m = await ye(
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
  const i = Ue(e), o = await Ja(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, c = (await ye(s)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      c.some((l) => l.tag.id === f) || await ye("/api/tagapplications", {
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
      r.has(f.tag.id) && !d.has(f.tag.id) && await ye(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await ye(s);
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
async function vn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? rc(
      await Ja(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await ye(qf(e, t))).filter(
      (l) => l.hostType === e && l.hostId === t.media.id && l.contextType === "performer" && l.contextId === t.occurrence.performer.id
    );
    return Pi(f.map((l) => l.tag)), {
      ids: [...new Set(f.map((l) => l.tag.id))],
      names: [...new Set(f.map((l) => l.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await Ja(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Pi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Ha
  ) ?? Ha, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
async function Co(e, t, n) {
  if (t.occurrence && Re(e))
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
      i.length && await ye(
        `/api/${tr(Ue(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function Sf(e, t, n) {
  t.occurrence && Re(e) ? await wf(e, t.occurrence, n) : await ac(Ue(e), n, [t.media.id]);
}
function _i(e, t, n, r) {
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
const ji = (e) => e instanceof Error ? e.message : "Request failed.", as = (e) => [...e].sort((t, n) => t - n), ha = (e, t) => JSON.stringify(as(e)) === JSON.stringify(as(t)), Ui = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ya(e, t, n, r) {
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
      d = (await ye(`/api/tags/${c}`, { signal: r })).name;
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
    (p) => !Dn(p, e.entityType) || !p.steps.length || p.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ua(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Ao(i.occurrence, n) : [];
  await Af(i, o, s, n);
  const c = await Promise.all(
    o.map(async (p) => ({
      ...p,
      steps: await so(p, n)
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
  const l = await ko(i, n), h = /* @__PURE__ */ new Map();
  for (let p = 1; ; p++) {
    n.throwIfAborted();
    const m = await Gc(i, l, p, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Ya(N.ids, d, s, !0);
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
        if (s = await vn(Ue(e.review), o.item, !1), !Tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (p) {
        o.status = "failed", o.error = ji(p);
        return;
      }
      const c = Ya(
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
        await Co(e.review, o.item, f);
      } catch (p) {
        l = p;
      }
      let h = !1;
      try {
        const p = await vn(Ue(e.review), o.item, !1);
        h = !0, o.expected = p;
        const m = _i(
          o.item,
          o.before,
          p,
          e.touched
        );
        if (o.operation = Ui(m) ? m : void 0, l) throw l;
        if (!ha(
          p.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (p) {
        if (o.status = "failed", o.error = ji(p), !h)
          try {
            const m = await vn(Ue(e.review), o.item, !1);
            o.expected = m;
            const y = _i(
              o.item,
              o.before,
              m,
              e.touched
            );
            o.operation = Ui(y) ? y : void 0;
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
        const c = await vn(Ue(e.review), r.item, !1);
        kf(i, c), s = !0, await Co(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await vn(Ue(e.review), r.item, !1);
        if (!ha(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${ji(c)}`, r.status = "failed", s)
          try {
            const d = await vn(Ue(e.review), r.item, !1), f = _i(
              r.item,
              r.before,
              d,
              o
            );
            r.operation = Ui(f) ? f : void 0, r.expected = d;
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
  const r = Ue(e), i = e.occurrence, [o, s] = await Promise.all([
    ye(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ao(i, n)
  ]), c = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Pi(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await ye(`/api/tags/${v}`, { signal: n })).name;
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
    (s) => [...er(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function To(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const i = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Wc), o = (m) => m.members ?? m.tags.map((y) => y.id), s = yr(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...er(t[N])]))
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
const yi = { summary: null, error: "" };
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
    value: yi
  });
  return Z(() => {
    if (s((d) => d.key === i ? d : { key: i, value: yi }), e === null || t === null) return;
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
  }, [i, n]), o.key === i ? o.value : yi;
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
  const o = wt(e.name), s = [...r].filter((f) => wt(f) !== o), c = s.length < r.size, d = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: s, here: c || i.size > 0, note: d };
}
function Ff(e, { names: t, here: n, note: r }) {
  const i = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${i} and in ${t.join(", ")}` : t.join(", ") : i}.`;
}
function Bi({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: i = $i,
  flags: o = [],
  className: s = ""
}) {
  const c = Cn(n), d = (p) => `${p.toLocaleString()} ${p === 1 ? c.one : c.many}`, f = e ? To(e, r, i) : [], l = uo(f), h = (p) => [
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
                    /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            p.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": p.name, children: p.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(nn, { tag: v }),
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
        return (await ye(`/api/performers/${n}`, { signal: t })).name;
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
]), Ki = [
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
}, wi = 250;
function sa(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Lf({ step: e }) {
  const t = Ki.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ki.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(Vr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function cs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ u(Ji, { children: [
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
    gr(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(nn, { tag: i })
    ] }) }, `added-${i.id}`)),
    gr(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(nn, { tag: i })
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
      t.length > wi && /* @__PURE__ */ u("span", { children: [
        "First ",
        wi.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, wi).map((o) => {
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
  const [s, c] = T(!1), [d, f] = T("answers"), [l, h] = T(null), [p, m] = T({}), [y, N] = T([]), [v, w] = T(!1), [E, O] = T(!1), [F, U] = T(""), [C, L] = T(!1), [x, ne] = T(""), [J, _] = T(null), [G, M] = T(null), [D, P] = T([]), [Y, W] = T(0), re = R(null), Q = R(null), k = R(null), oe = R(!1), A = R(!1), X = R(null), ce = R(!1), ue = R(!1), K = R({ onClose: o });
  K.current = { onClose: o };
  const be = Ze(), Ae = d === "run", qe = (J == null ? void 0 : J.kind) === "undo", we = Ae && l ? l.review : e, Ge = zr(we.actions), me = we.occurrence, et = Ue(we), Je = Cn(et), Pt = Je.queue, Lt = Ae && l ? l.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !Yn(I))
  ), Nt = Lt.filter((I) => y.includes(I.id)), dt = me.targetMode === "selected" && me.performerIds.length === 1, Ce = Yc(
    we,
    s && dt ? me.performerIds[0] : null,
    Y
  ), Qe = qo(we.view.objectFilter), qt = Na(
    s ? [...ai(Lt), ...me.conditionTagIds, ...Qe] : []
  ), We = ve(() => wc(qt), [qt]), tt = (I) => p[I] ?? qt[I] ?? { id: I, name: `Tag ${I}` }, ze = JSON.stringify(
    Object.fromEntries(
      Qe.flatMap((I) => {
        var H;
        const j = (H = qt[I]) == null ? void 0 : H.name;
        return j ? [[String(I), j]] : [];
      })
    )
  ), St = ve(
    () => So(we.view.objectFilter, JSON.parse(ze)),
    [we.view.objectFilter, ze]
  );
  Z(() => {
    var I, j, H;
    s && ((I = re.current) == null || I.showModal(), (H = (j = re.current) == null ? void 0 : j.querySelector(".dq-batch-answer input")) == null || H.focus());
  }, [s]), Z(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var fe;
      const j = re.current, H = document.activeElement;
      if (!j || H && H !== document.body && j.contains(H)) return;
      (fe = (d === "answers" ? j.querySelector(".dq-batch-answer input:checked") ?? j.querySelector(".dq-batch-answer input") : j.querySelector("[data-batch-focus]")) ?? Q.current) == null || fe.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, d, E, l]), Z(() => {
    if (s || t || !oe.current) return;
    const I = requestAnimationFrame(() => {
      const j = k.current;
      if (!oe.current || !j || j.disabled) return;
      oe.current = !1;
      const H = document.activeElement;
      (!H || H === document.body) && j.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), Z(() => {
    if (!s || me.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), xf(me.performerIds.slice(0, is), I.signal).then((j) => {
      I.signal.aborted || P(j);
    }).catch(() => {
    }), () => I.abort();
  }, [s, me.targetMode, JSON.stringify(me.performerIds)]), Z(
    () => () => {
      var I;
      A.current = !0, (I = X.current) == null || I.abort();
    },
    []
  ), Z(() => {
    if (!E) return;
    const I = (j) => {
      j.preventDefault(), j.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [E]);
  function Dt() {
    f("answers"), h(null), m({}), _(null), w(!1), N([]), ne(""), U(""), L(!1), M(null);
  }
  function nt() {
    ue.current || (c(!1), K.current.onClose(ce.current), ce.current = !1, Dt(), oe.current = !0);
  }
  function un(I, j) {
    N(
      (H) => j ? [...H, I] : H.filter((Se) => Se !== I)
    ), h(null), m({}), ne(""), U(""), L(!1), M(null);
  }
  function _t() {
    f("answers"), M(null), ne("");
  }
  function Tn() {
    f("preview"), l || nr();
  }
  function fn() {
    var I;
    A.current = !0, (I = X.current) == null || I.abort(), ne("Stopping after in-flight operations settle…");
  }
  function Ot(I) {
    M(
      (j) => (j == null ? void 0 : j.group) === I.group && j.reason === I.reason ? null : I
    );
  }
  const mt = (I, j) => (G == null ? void 0 : G.group) === I && G.reason === j;
  async function nr() {
    if (!Nt.length || ue.current) return;
    ue.current = !0, O(!0), U(""), L(!1), ne("Loading all matching occurrences…"), h(null), m({}), M(null);
    const I = new AbortController();
    X.current = I;
    try {
      const j = await Cf(
        e,
        Nt,
        I.signal,
        (Se) => ne(`Loaded ${Se.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const H = {};
      for (const Se of j.entries)
        for (const fe of Se.before.applications ?? [])
          H[fe.tag.id] = fe.tag;
      m(H), h(j), ne("Preview ready. No tags have been changed.");
    } catch (j) {
      U(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : j instanceof Error ? j.message : String(j)
      ), L(!I.signal.aborted && j instanceof zc), ne("");
    } finally {
      ue.current = !1, O(!1), X.current = null;
    }
  }
  async function pn(I) {
    if (!l || ue.current) return;
    const j = (I === "undo" ? Qc(l) : Jc(l, I === "retry")).length;
    ue.current = !0, A.current = !1, ce.current = !0, O(!0), f("run"), U(""), _({ kind: I, total: j, done: 0, stopped: !1 }), ne(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const H = () => _((fe) => fe && { ...fe, done: fe.done + 1 });
    let Se = !1;
    try {
      I === "undo" ? await Rf(l, () => A.current, H) : await If(l, v, () => A.current, H, I === "retry"), ne(
        A.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (fe) {
      Se = !0, ne(""), U(fe instanceof Error ? fe.message : String(fe));
    } finally {
      ue.current = !1;
      const fe = A.current || Se;
      _((Ee) => Ee && { ...Ee, stopped: fe }), O(!1), W((Ee) => Ee + 1);
    }
  }
  const he = (l == null ? void 0 : l.entries) ?? [], Gt = ve(
    () => new Map(
      ((l == null ? void 0 : l.entries) ?? []).map((I) => [
        I.item.key,
        Ya(I.before.ids, l.action, l.categories, v)
      ])
    ),
    [l, v]
  ), hn = (I) => Gt.get(I.item.key), mn = (I) => Gr(I.before.ids, hn(I).desired), rr = (I) => {
    const j = mn(I);
    return I.status === "pending" && (j.added.length > 0 || j.removed.length > 0);
  }, Pe = (I) => I.conflict || hn(I).kept.length > 0 || hn(I).replaced.length > 0, ut = ve(() => {
    const I = (l == null ? void 0 : l.entries) ?? [];
    return {
      willChange: I.filter(rr).length,
      correct: I.filter((j) => j.status === "unchanged").length,
      different: I.filter(Pe).length,
      hosts: new Set(I.map((j) => j.item.media.id)).size,
      added: [...new Set(I.flatMap((j) => mn(j).added))],
      removed: [...new Set(I.flatMap((j) => mn(j).removed))]
    };
  }, [Gt]), le = ve(
    () => ((l == null ? void 0 : l.entries) ?? []).filter((I) => I.item.media.date).sort((I, j) => I.item.media.date.localeCompare(j.item.media.date)),
    [l]
  ), B = Ae ? Df(he) : null, $e = (I) => Ge.keys[we.actions.findIndex((j) => j.id === I)] ?? "", kt = (I) => vr(I, We, [], r), ar = ua(me.condition) && me.includeSubtags !== !1 && me.conditionTagIds.length > 0, ie = le[0], Ve = le.length > 1 ? le[le.length - 1] : void 0, jt = (I) => `/${et}/${I.item.media.id}`, ot = dt ? D[0] : void 0, ft = ve(
    () => n ? uc(
      n,
      Ce.summary ? uo(
        To(Ce.summary, we.actions, r ?? $i)
      ) : []
    ) : [],
    [n, Ce.summary, we.actions, r]
  ), Ut = nu(Nt, ft, r ?? $i), rt = n ?? [], Et = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: rr },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Pe }
  };
  function Vt() {
    const I = Pf[me.condition], j = !!I && me.conditionTagIds.length > 0, H = me.performerIds.slice(0, is), Se = String(we.view.filter.q ?? "").trim(), fe = me.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      eo(me) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : me.targetMode === "selected" ? /* @__PURE__ */ u(pe, { children: [
        H.map((Ee, Ne) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Ur, { performer: { id: Ee, name: D[Ne] ?? "" } }),
          D[Ne] ?? "…"
        ] }, Ee)),
        me.performerIds.length > H.length && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
          (me.performerIds.length - H.length).toLocaleString(),
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
                criteriaDefinitions: Qi,
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
        j ? I : Xi[me.condition],
        j && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: gr(me.conditionTagIds.map(tt)).map((Ee) => /* @__PURE__ */ a(nn, { tag: Ee }, Ee.id)) })
      ] }),
      j && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: me.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ua(me.condition) && me.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: fe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          fe
        ] })
      ] }),
      Se && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        Se,
        "”"
      ] }),
      Object.keys(we.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${Pt} filters`,
          children: /* @__PURE__ */ a(
            da,
            {
              filter: we.view.filter,
              objectFilter: St,
              criteriaDefinitions: et === "audio" ? Ts : Xa,
              customFieldEntityType: et,
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
  function zt(I, j, H = !0) {
    if (!I.length) return null;
    const Se = /* @__PURE__ */ a("strong", { children: ot || "This performer" }), fe = H ? `Check the earliest and latest ${Je.many} before applying, or narrow the batch with a date filter.` : "", Ee = I.every((Ne) => Ne.tagIds === null && !Ne.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Ee ? /* @__PURE__ */ u("p", { children: [
          Se,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((Ne) => Ne.flags).join(", ") }),
          ".",
          " ",
          fe
        ] }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("p", { children: [
            Se,
            " needs attention where the chosen answers apply.",
            fe && ` ${fe}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((Ne) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: Ne.tagIds === null ? "Whole review" : Ne.name }),
            ":",
            " ",
            fo(Ne).join("; ")
          ] }, Ne.key)) })
        ] }),
        j && ie && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: jt(ie), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            sa(ie, et),
            " · ",
            ie.item.media.date
          ] }),
          Ve && /* @__PURE__ */ u("a", { href: jt(Ve), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            sa(Ve, et),
            " · ",
            Ve.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function pt() {
    const I = Ut.filter((H) => H.tagIds === null), j = Ut.filter((H) => H.tagIds !== null);
    return /* @__PURE__ */ u(pe, { children: [
      Vt(),
      zt(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${dt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Lt.map((H, Se) => {
            const fe = $e(H.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(H.id),
                  "aria-labelledby": `${be}-answer-${Se}`,
                  "aria-describedby": `${be}-effect-${Se}`,
                  onChange: (Ee) => un(H.id, Ee.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: fe && /* @__PURE__ */ a(vt, { binding: fe, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${be}-answer-${Se}`,
                    className: "dq-batch-answer-label",
                    title: H.label,
                    children: H.label
                  }
                ),
                /* @__PURE__ */ a(cs, { id: `${be}-effect-${Se}`, parts: kt(H) })
              ] })
            ] }, H.id);
          }) })
        ] }),
        dt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: zt(j, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Bi,
            {
              ...Ce,
              mediaKind: et,
              actions: we.actions,
              trees: r,
              flags: rt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function qr(I) {
    const j = ut, H = G && os.has(G.group) ? G.group : null, Se = H ? he.filter(Et[H].test) : [], fe = (Ee) => {
      const Ne = hn(Ee), st = Ne.skipped ? Gr(
        Ee.before.ids,
        Ya(Ee.before.ids, I.action, I.categories, !0).desired
      ) : mn(Ee), Mt = !st.added.length && !st.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        Ne.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Mt ? !Ne.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ls, { added: st.added, removed: st.removed, tag: tt }),
        Ne.kept.map((Te, ge) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          gr(Te.existing.map(tt)).map((Ft) => /* @__PURE__ */ a(nn, { tag: Ft }, Ft.id)),
          " ",
          "instead of",
          " ",
          gr(Te.tagIds.map(tt)).map((Ft) => /* @__PURE__ */ a(nn, { tag: Ft }, Ft.id))
        ] }, ge))
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
              detail: `in ${j.hosts.toLocaleString()} ${j.hosts === 1 ? Pt : `${Pt}s`}`,
              pressed: mt("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: j.willChange,
              label: "will change",
              tone: "add",
              pressed: mt("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: j.correct,
              label: "already correct, no write",
              pressed: mt("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            oa,
            {
              value: j.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mt("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        Se.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: Et[H].title,
            entries: Se,
            mediaKind: et,
            resultHeading: "Planned change",
            describe: fe
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: ie ? `Dates ${ie.item.media.date}${Ve ? ` to ${Ve.item.media.date}` : ""}` : "No dates" }),
          ie && /* @__PURE__ */ a(
            "a",
            {
              href: jt(ie),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Je.one}, ${ie.item.media.date}`,
              title: sa(ie, et),
              children: "Open earliest"
            }
          ),
          Ve && /* @__PURE__ */ a(
            "a",
            {
              href: jt(Ve),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Je.one}, ${Ve.item.media.date}`,
              title: sa(Ve, et),
              children: "Open latest"
            }
          ),
          le.length < he.length && /* @__PURE__ */ u("span", { children: [
            (he.length - le.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (j.added.length > 0 || j.removed.length > 0) && /* @__PURE__ */ u("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            ls,
            {
              added: j.added,
              removed: j.removed,
              tag: tt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      j.different > 0 && /* @__PURE__ */ u("div", { className: "dq-batch-choice", children: [
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
          ar ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function rn() {
    return /* @__PURE__ */ u(pe, { children: [
      Vt(),
      zt(Ut, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${dt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${be}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${be}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: E, onClick: _t, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: Nt.map((I) => {
            const j = $e(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                j && /* @__PURE__ */ a(vt, { binding: j, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(cs, { parts: kt(I) })
            ] }, I.id);
          }) })
        ] }),
        dt && /* @__PURE__ */ a(
          Bi,
          {
            ...Ce,
            mediaKind: et,
            actions: we.actions,
            trees: r,
            flags: rt,
            className: "dq-batch-card"
          }
        )
      ] }),
      E ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : l && qr(l)
    ] });
  }
  function jn(I) {
    const j = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, H = j.kind === "apply" ? he.length - I.counts.pending : j.done, Se = j.kind === "apply" ? he.length : j.total, fe = E ? j.kind === "undo" ? "Undoing batch…" : j.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : j.kind === "undo" ? j.stopped ? "Undo stopped" : "Undo finished" : j.stopped ? "Stopped" : "Finished", Ee = Se ? Math.round(H / Se * 100) : 100, Ne = G && !os.has(G.group) ? G.group : null, st = (Te) => ss.find((ge) => ge.status === Te).label, Mt = Ne ? he.filter(
      (Te) => Te.status === Ne && (!G.reason || Te.error === G.reason)
    ) : [];
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: fe }),
          /* @__PURE__ */ u("span", { children: [
            H.toLocaleString(),
            " of ",
            Se.toLocaleString(),
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
            "aria-valuemax": Se,
            "aria-valuenow": H,
            children: /* @__PURE__ */ a("span", { style: { width: `${Ee}%` } })
          }
        ),
        !E && j.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (j.total - I.recorded).toLocaleString(),
          " of",
          " ",
          j.total.toLocaleString(),
          " ",
          j.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ss.map((Te) => /* @__PURE__ */ a(
          oa,
          {
            value: I.counts[Te.status],
            label: Te.label,
            tone: Te.tone,
            pressed: mt(Te.status),
            onToggle: () => Ot({ group: Te.status })
          },
          Te.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((Te) => {
          const ge = mt(Te.status, Te.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              Te.count.toLocaleString(),
              " ",
              Te.status,
              ": ",
              Te.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ge,
                onClick: () => Ot({ group: Te.status, reason: Te.error }),
                children: ge ? "Hide them" : "Show them"
              }
            )
          ] }, `${Te.status}-${Te.error}`);
        }) }),
        Mt.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: G.reason ? `${st(Ne)}: ${G.reason}` : `${st(Ne)} occurrences`,
            entries: Mt,
            mediaKind: et,
            resultHeading: "Result",
            describe: (Te) => Te.error ?? st(Te.status)
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
            onClick: () => void pn("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          qe ? j.stopped || E ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Ht() {
    return d === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !Nt.length,
        onClick: Tn,
        children: "Preview all matches"
      },
      "preview"
    ) : d === "preview" ? E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: fn, children: "Cancel preview" }, "cancel-preview") : l ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !ut.willChange,
        onClick: () => void pn("apply"),
        children: [
          "Apply to ",
          ut.willChange.toLocaleString(),
          " ",
          ut.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: _t, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void nr(),
        children: "Preview again"
      },
      "again"
    ) : E ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: fn, children: qe ? "Cancel undo" : "Cancel run" }, "cancel-run") : qe || !B ? null : /* @__PURE__ */ u(Ji, { children: [
      B.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void pn("retry"), children: "Retry failed" }),
      B.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void pn("apply"),
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
        ref: k,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Lt.length,
        onClick: () => {
          Dt(), i(), c(!0);
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
        ref: re,
        className: "dq-batch-dialog",
        "aria-labelledby": `${be}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), nt();
        },
        onClose: () => {
          var I;
          ue.current ? (I = re.current) == null || I.showModal() : nt();
        },
        children: [
          /* @__PURE__ */ u("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Do, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${be}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: E,
                onClick: nt,
                children: /* @__PURE__ */ a(ba, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(Lf, { step: d }),
          /* @__PURE__ */ u(
            "div",
            {
              className: "dq-batch-body",
              ref: Q,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": d === "preview" ? "" : void 0,
              "aria-label": `${Ki.find((I) => I.id === d).label} step`,
              children: [
                /* @__PURE__ */ u("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  x && /* @__PURE__ */ a("p", { role: "status", children: x }),
                  F && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: F })
                ] }),
                d === "answers" ? pt() : d === "preview" ? rn() : jn(B)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            d === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: E, onClick: _t, children: [
              /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
              "Back"
            ] }),
            d === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: Dt, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: E, onClick: nt, children: "Close" }),
            Ht()
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
  const [n, r] = T(jf), i = En(() => {
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
            N && /* @__PURE__ */ a(Ln, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
function ja(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Hf(e, t) {
  const n = eo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${ja(r, "or")}`,
    includesAll: `has ${ja(r, "and")}`,
    excludes: `has none of ${ja(r, "or")}`,
    excludesAll: `missing ${ja(r, "or")}`
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
  const [o, s] = T(!1), [c, d] = T(null), f = R(null), l = R(null), h = Ze(), p = Hr(e.conditionTagIds), m = Hf(e, p);
  $t(() => {
    const w = f.current;
    if (!o || !w) return;
    const E = () => d(zf(w));
    E(), window.addEventListener("resize", E);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(E), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const U of F) U && (O == null || O.observe(U));
    return () => {
      window.removeEventListener("resize", E), O == null || O.disconnect();
    };
  }, [o]), Z(() => {
    var E, O;
    if (!o) return;
    const w = (E = l.current) == null ? void 0 : E.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (O = l.current) == null || O.focus();
  }, [o]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== l.current || w.defaultPrevented || dn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && l.current) {
        const O = [...l.current.querySelectorAll(Vf)].filter((L) => L.closest('[role="dialog"]') === l.current).sort(
          (L, x) => L.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!O.length) return;
        const F = O[0], U = O[O.length - 1], C = document.activeElement;
        w.shiftKey && (C === F || C === l.current) ? (w.preventDefault(), U.focus()) : !w.shiftKey && C === U && (w.preventDefault(), F.focus());
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
          /* @__PURE__ */ a(Wi, { "aria-hidden": "true" })
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
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Gf.map(({ mode: w, label: E }) => /* @__PURE__ */ a(
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
                Xn,
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
                    criteriaDefinitions: Qi,
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
                  children: Zi.map((w) => /* @__PURE__ */ a("option", { value: w, children: Xi[w] }, w))
                }
              ),
              v && /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ a(
                  Xn,
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
function Ga(e) {
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
    Ue(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Wf(e, t) {
  const n = Ue(e) === "audio", r = (s) => ({
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
      const f = await ye(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            _n({
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
  const r = Eo(e, [t]);
  return Zs(r, r.view.filter, n);
}
function el(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Gi(e, t, n, r) {
  if (t >= e.length) return !0;
  const i = e[t].total;
  return i <= 0 ? !0 : n.length >= r && i < n[r - 1].count;
}
async function Yf(e, t, n, r, i = {}) {
  const o = Ga(e), s = Qf(e), c = Kc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
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
    complete: !y && Gi(f, h, l, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !p && !Gi(f, h, l, n); ) {
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
    complete: Gi(e.candidates, e.cursor, i, e.limit)
  };
}
const Vi = /* @__PURE__ */ new Map();
function Zf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function tl(e, t) {
  const n = Zf(t);
  return Vi.set(e, n), n;
}
function ep(e) {
  const [t, n] = T(null);
  if (Z(() => {
    if (e === null || Vi.has(e)) return;
    const r = new AbortController();
    return ye(`/api/performers/${e}`, { signal: r.signal }).then(
      (i) => {
        const o = tl(e, i == null ? void 0 : i.tags);
        r.signal.aborted || n({ id: e, tags: o });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return Vi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var vi = { exports: {} }, us;
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
          var h, p, m = {}, y = {}, N = "", v = "", w = "", E = 2, O = 3, F = 2, U = [], C = 0, L = 0, x;
          for (x = 0; x < d.length; x += 1)
            if (N = d.charAt(x), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (h = 0; h < F; h++)
                    C = C << 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++;
                  for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
                } else {
                  for (p = 1, h = 0; h < F; h++)
                    C = C << 1 | p, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = 0;
                  for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                    C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
                }
                E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
              } else
                for (p = m[w], h = 0; h < F; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
              E--, E == 0 && (E = Math.pow(2, F), F++), m[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (h = 0; h < F; h++)
                  C = C << 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++;
                for (p = w.charCodeAt(0), h = 0; h < 8; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
              } else {
                for (p = 1, h = 0; h < F; h++)
                  C = C << 1 | p, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = 0;
                for (p = w.charCodeAt(0), h = 0; h < 16; h++)
                  C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
              }
              E--, E == 0 && (E = Math.pow(2, F), F++), delete y[w];
            } else
              for (p = m[w], h = 0; h < F; h++)
                C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
            E--, E == 0 && (E = Math.pow(2, F), F++);
          }
          for (p = 2, h = 0; h < F; h++)
            C = C << 1 | p & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, p = p >> 1;
          for (; ; )
            if (C = C << 1, L == f - 1) {
              U.push(l(C));
              break;
            } else L++;
          return U.join("");
        },
        decompress: function(d) {
          return d == null ? "" : d == "" ? null : c._decompress(d.length, 32768, function(f) {
            return d.charCodeAt(f);
          });
        },
        _decompress: function(d, f, l) {
          var h = [], p = 4, m = 4, y = 3, N = "", v = [], w, E, O, F, U, C, L, x = { val: l(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            h[w] = w;
          for (O = 0, U = Math.pow(2, 2), C = 1; C != U; )
            F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
          switch (O) {
            case 0:
              for (O = 0, U = Math.pow(2, 8), C = 1; C != U; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 1:
              for (O = 0, U = Math.pow(2, 16), C = 1; C != U; )
                F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
              L = n(O);
              break;
            case 2:
              return "";
          }
          for (h[3] = L, E = L, v.push(L); ; ) {
            if (x.index > d)
              return "";
            for (O = 0, U = Math.pow(2, y), C = 1; C != U; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (L = O) {
              case 0:
                for (O = 0, U = Math.pow(2, 8), C = 1; C != U; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[m++] = n(O), L = m - 1, p--;
                break;
              case 1:
                for (O = 0, U = Math.pow(2, 16), C = 1; C != U; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                h[m++] = n(O), L = m - 1, p--;
                break;
              case 2:
                return v.join("");
            }
            if (p == 0 && (p = Math.pow(2, y), y++), h[L])
              N = h[L];
            else if (L === m)
              N = E + E.charAt(0);
            else
              return null;
            v.push(N), h[m++] = E + N.charAt(0), p--, E = N, p == 0 && (p = Math.pow(2, y), y++);
          }
        }
      };
      return c;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(vi)), vi.exports;
}
var nl = tp();
function Zn(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => Zn(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && Zn(n[s], r[s])
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
  return Z(() => {
    let l = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(s).map(
        async (h) => [h, await ri([h])]
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
  ), d = s.every((v) => r[v]), f = Nr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!d || c.has(v))
  ), l = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (c.has(w.id)) {
        const E = l.get(w.id) ?? { name: w.name, count: 0 };
        E.count++, l.set(w.id, E);
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
            E && /* @__PURE__ */ a(Vr, { "aria-hidden": "true" }),
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
  const c = ((h = e.presentation) == null ? void 0 : h.filterBins) ?? [], d = Nr(e.view.objectFilter, t, c).bins, f = op(e, t, n, o);
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
  return Z(() => {
    var y, N;
    if (r || f.current === d) return;
    f.current = d, o({});
    let h = 0;
    const p = new AbortController(), m = Nr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (h++, Zs(il(e, v.key, t), n, p.signal).then((w) => {
        p.signal.aborted || o((E) => ({ ...E, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        p.signal.aborted || h--;
      }));
    return () => {
      h > 0 && (f.current = null), p.abort();
    };
  }, [d, r]), i;
}
function hr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sp(e) {
  if (!hr(e) || Object.keys(e).length !== 1 || !hr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !hr(t.tagsCriterion)) return null;
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
    (r) => Zn(e, al(r.filter))
  );
  return n ? n.key : sp(e);
}
function Nr(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && Zn(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!hr(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, d = cp(c.at(-1), n);
    if (d == null || c.length > 3) break;
    let f = {}, l = null, h = !0;
    for (const [p, m] of c.slice(0, -1).entries())
      !hr(m) || Object.keys(m).length !== 1 ? h = !1 : p === 0 && hr(m.filter) && Object.keys(m.filter).length ? f = m.filter : !l && hr(m.group) ? l = m.group : h = !1;
    if (!h) break;
    i.unshift(d), r = l ? { ...f, _filterExpression: l } : f;
  }
  return { base: r, bins: i };
}
function il(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Nr(e.view.objectFilter, n, r), s = (l) => {
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
const ii = [
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
function wr(e) {
  const t = Re(e) ? e.occurrence : void 0;
  return {
    filter: tn({
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
function zi(e, t) {
  let n;
  if (Re(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ii.some((c) => c !== "performer" && t.has(c))) {
    const c = wr(e);
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
  if (Re(e) && (o = {
    ...dp,
    ...ps(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Zi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: tn(i, Ue(e)),
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
  ii.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", fs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", fs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), sl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function An(e, t) {
  const n = {
    ...e.view,
    filter: t.filter,
    objectFilter: t.objectFilter,
    searchMode: t.searchMode,
    startFrom: t.startFrom
  };
  return Re(e) ? {
    ...e,
    view: n,
    occurrence: { ...e.occurrence, ...t.performerScope }
  } : { ...e, view: n };
}
function br(e) {
  const t = e;
  return An(t, wr(t));
}
function ms(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !Zn(
    JSON.parse(Jn(An(e, t))),
    JSON.parse(Jn(An(e, wr(e))))
  );
}
function Io(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return De(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function cl(e, t) {
  if (De(e) !== "video") return e;
  const { base: n, bins: r } = Nr(
    e.view.objectFilter,
    t.view.objectFilter,
    Io(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ua(e, t) {
  if (De(e) !== "video") return t;
  const { base: n, bins: r } = Nr(
    t.objectFilter,
    e.view.objectFilter,
    Io(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function gs(e, t) {
  return !t || !Re(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function Ni(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const en = (e) => e instanceof Error ? e.message : "Request failed.", qi = 50, up = [], bs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
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
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ls, {}) : /* @__PURE__ */ a(ei, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Ii(t, e, 160),
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
  const c = !!n && !r, d = bo(t), f = n ? null : d, l = e == null ? void 0 : e.absent, h = Na(
    ve(() => [...o, ...l ?? []], [o, l])
  ), p = (J) => h[J] ?? { id: J, name: h[J] === void 0 ? "…" : "Unavailable tag" }, m = (J) => gr(J.map(p)), y = f && e ? lo(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((J) => J.id)), w = new Set(y == null ? void 0 : y.removed), E = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
    "absent"
  ] }), U = m((y == null ? void 0 : y.added) ?? []), C = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((J) => !v.has(J))), L = c ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(L, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
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
    e ? /* @__PURE__ */ u(pe, { children: [
      N.length || U.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (J) => w.has(J.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(nn, { tag: J })
            ] }),
            E.has(J.id) && F
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(nn, { tag: J }) }, J.id)
        ),
        U.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(nn, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(nn, { tag: J }) }),
          F
        ] }, `absent-${J.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(pe, { children: [
    !c && ne,
    n,
    c && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function mp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    fo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
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
  var dr;
  const l = Ue(e), h = Cn(l), p = l === "audio" ? "Audio" : "Scene", m = (g) => {
    var S;
    return g.title || ((S = g.files[0]) == null ? void 0 : S.basename) || p;
  }, y = (g) => `${g.occurrence ? `${g.occurrence.performer.name} — ` : ""}${m(g.media)}`, N = R(null), v = R("");
  if (!N.current)
    try {
      N.current = zi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (g) {
      v.current = en(g), N.current = { query: wr(e), startAtEnd: !1 };
    }
  const [w, E] = T(null), [O, F] = T(""), U = R(null), C = R(null), L = R(null), x = R(null), [ne, J] = T(!!v.current), _ = R(0), [G, M] = T(N.current.query), D = R(G);
  D.current = G;
  const [P, Y] = T(0), W = R(N.current.startAtEnd), [re, Q] = T([]), [k, oe] = T(null), A = R(null), [X, ce] = T(null), [ue, K] = T(0), be = ve(() => {
    if (!k) return null;
    const g = re.findIndex((S) => S.key === k.key);
    return g < 0 ? null : re.slice(g + 1).find((S) => S.media.id !== k.media.id) ?? null;
  }, [k, re]), [Ae, qe] = T(0), [we, Ge] = T(!1), [me, et] = T(!1), Je = R(!1), Pt = R(0), Lt = R(!0), Nt = R(null);
  Z(() => (Lt.current = !0, () => {
    Lt.current = !1;
  }), []);
  const [dt, Ce] = T(v.current), [Qe, qt] = T(""), [We, tt] = T(null), [ze, St] = T(!1), [Dt, nt] = T([]), un = R([]), _t = R(null), Tn = R(null), fn = R(null);
  Z(() => {
    var g, S;
    ze && ((S = (g = fn.current) == null ? void 0 : g.querySelector("input")) == null || S.focus());
  }, [ze]);
  const [Ot, mt] = T(!1), [nr, pn] = T(!1), he = qa(), [Gt, hn] = T(!1), mn = d ?? Gt, rr = f ?? hn;
  Z(() => {
    if (we || Ot || !Tn.current) return;
    const g = requestAnimationFrame(() => {
      if (document.querySelector(bs)) return;
      const S = Tn.current;
      Tn.current = null;
      const V = document.activeElement;
      V && V !== document.body || S != null && S.isConnected && !S.disabled && S.focus();
    });
    return () => cancelAnimationFrame(g);
  }, [we, Ot, P]);
  const [Pe, ut] = T([]), [le, B] = T({}), $e = R(null), [kt, ar] = T({});
  Z(() => {
    let g = !0;
    return Promise.all(
      qo(G.objectFilter).map(
        async (S) => [
          String(S),
          (await ye(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      g && ar(Object.fromEntries(S));
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [G.objectFilter]);
  const ie = ve(
    () => So(G.objectFilter, kt),
    [kt, G.objectFilter]
  ), Ve = R(0), jt = R(e);
  jt.current = e;
  const ot = w ?? e, ft = ve(
    () => An(ot, G),
    [ot, G]
  ), Ut = ve(
    () => gs(ft, G.performerFocus),
    [ft, G.performerFocus]
  ), rt = R(Ut);
  rt.current = Ut;
  const Et = R(ft);
  Et.current = ft;
  const [Vt, zt] = T("items"), [pt, qr] = T(null), rn = R(null), jn = R("");
  function Ht(g) {
    const S = typeof g == "function" ? g(rn.current) : g;
    rn.current = S, qr(S);
  }
  const [I, j] = T(!1), [H, Se] = T(null), fe = R(null), Ee = Re(ft) ? Ga(ft) : "", [Ne, st] = T(0), [Mt, Te] = T(null);
  Z(() => () => {
    var g;
    return (g = fe.current) == null ? void 0 : g.controller.abort();
  }, []), Z(() => {
    const g = fe.current;
    !g || g.signature === Ee || (g.controller.abort(), fe.current = null, j(!1));
  }, [Ee]), Z(() => {
    var V;
    const g = rn.current;
    if (Vt !== "performers" || !Ee || ((V = fe.current) == null ? void 0 : V.signature) === Ee || jn.current === Ee || (g == null ? void 0 : g.signature) === Ee && g.complete)
      return;
    const S = (g == null ? void 0 : g.signature) === Ee ? g : null;
    Sn(g, (S == null ? void 0 : S.limit) ?? qi);
  }, [Vt, Ee, pt, H, I]);
  const ge = G.performerFocus;
  Z(() => {
    if (!ge) {
      Te(null);
      return;
    }
    let g = !0;
    return ye(`/api/performers/${ge}`).then((S) => {
      const V = tl(ge, S.tags);
      g && Te({ id: ge, name: S.name, tags: V });
    }).catch(() => {
    }), () => {
      g = !1;
    };
  }, [ge]);
  const Ft = JSON.stringify(
    Re(ft) ? Us(ft.occurrence) : []
  ), Ie = ve(() => JSON.parse(Ft), [Ft]), ir = ve(() => Zd(Ie), [Ie]), In = sc(ir), Jr = Na(ir), Qr = (g) => {
    var S;
    return ((S = Jr[g]) == null ? void 0 : S.name) ?? (Jr[g] === null ? "Unavailable tag" : "…");
  }, Wr = (g) => ({
    name: Qr(g),
    tagIds: In.get(g) ?? [g],
    resolved: In.has(g)
  }), At = Yc(
    Re(ft) ? ft : null,
    ge ?? null,
    Ne
  ), an = ms(e, G), or = ms(e, Ua(e, G)), gt = me || we || ze, Nn = Number(G.filter.page);
  function Le(g, S = !1) {
    Je.current || (Pt.current++, v.current = "", W.current = S, D.current = g, M(g), qe(0), Ge(!0), S || la(e.id, g), Y((V) => V + 1));
  }
  function Ye() {
    if (Je.current = !1, et(!1), Lt.current && Nt.current) {
      const g = Nt.current;
      Nt.current = null, Le(g.query, g.startAtEnd);
    }
  }
  Z(() => {
    const g = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const S = zi(
            jt.current,
            new URLSearchParams(window.location.search)
          );
          Je.current ? Nt.current = S : Le(S.query, S.startAtEnd);
        } catch (S) {
          Ce(en(S));
        }
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, [e.id]), Z(() => (r(me || we || ze || !!w), () => r(!1)), [me, we, ze, !!w, r]);
  async function bt(g, S, V) {
    if (Re(g)) {
      const de = await Gc(
        g,
        $e.current,
        S,
        V
      );
      return {
        items: de.items.map((ke) => ({
          key: ke.key,
          media: ke.media,
          occurrence: ke
        })),
        totalCount: de.totalCount
      };
    }
    const se = await _r(
      g,
      { ...g.view.filter, page: S },
      V
    );
    return {
      items: se.items.map((de) => ({ key: String(de.id), media: de })),
      totalCount: se.totalCount
    };
  }
  function yt(g, S, V, se = !1, de = !1) {
    if (!Lt.current || Nt.current) return;
    J(!0), Q(
      de ? g.items : Ni(g.items, D.current.startFrom === "end")
    ), qe(g.totalCount), Jt(V, se);
    const ke = {
      ...D.current,
      filter: { ...D.current.filter, page: S }
    };
    D.current = ke, M(ke), la(e.id, ke);
  }
  function Jt(g, S = !1) {
    Pt.current++, (g == null ? void 0 : g.key) !== (k == null ? void 0 : k.key) && (A.current = null), (g == null ? void 0 : g.media.id) !== (k == null ? void 0 : k.media.id) && ce(S && g ? g.media.id : null), oe(g);
  }
  Z(() => {
    if (v.current) return;
    const g = new AbortController();
    x.current = g;
    const S = ++Ve.current;
    return Ge(!0), Ce(""), qt(""), A.current = null, ce(null), oe(null), Q([]), St(!1), (async () => {
      const V = gs(
        An(jt.current, D.current),
        D.current.performerFocus
      );
      $e.current = Re(V) ? await ko(V, g.signal) : null;
      let se = Number(V.view.filter.page), de = await bt(V, se, g.signal);
      const ke = Math.max(
        1,
        Math.ceil(de.totalCount / Number(V.view.filter.perPage))
      );
      (W.current || se > ke) && (se = ke, de = await bt(V, se, g.signal)), W.current = !1;
      const at = V.view.startFrom === "end" ? -1 : 1;
      for (; Re(V) && !de.items.length && se + at >= 1 && se + at <= ke && !g.signal.aborted; )
        se += at, de = await bt(V, se, g.signal);
      if (S !== Ve.current || g.signal.aborted) return;
      const Oe = Ni(de.items, V.view.startFrom === "end");
      yt(de, se, Oe[0] ?? null);
    })().catch((V) => {
      !g.signal.aborted && S === Ve.current && Ce(en(V));
    }).finally(() => {
      !g.signal.aborted && S === Ve.current && (J(!0), Ge(!1));
    }), () => {
      g.abort(), Ve.current++;
    };
  }, [P, e.id]);
  const Qt = R(null);
  Z(() => {
    if ((k == null ? void 0 : k.key) !== Qt.current && tt(null), Qt.current = (k == null ? void 0 : k.key) ?? null, !k) return;
    let g = !0;
    return vn(l, k).then((S) => {
      g && (tt(S), ut(
        Re(e) ? S.ids.filter((V) => e.occurrence.tagIds.includes(V)) : []
      ));
    }).catch((S) => {
      g && Ce(`Could not load current tags. ${en(S)}`);
    }), () => {
      g = !1;
    };
  }, [k]), Z(() => {
    if (!Re(e) || e.actions.length)
      return;
    let g = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (S) => [
          S,
          (await ye(`/api/tags/${S}`)).name
        ]
      )
    ).then((S) => {
      g && B(Object.fromEntries(S));
    }).catch((S) => {
      g && Ce(en(S));
    }), () => {
      g = !1;
    };
  }, [e]);
  async function Sr(g = !1, S = !1, V = !1, se = () => !0) {
    var Tt;
    if (!k) return;
    const de = re.findIndex((je) => je.key === k.key), ke = G.startFrom === "end" ? -1 : 1, at = ((Tt = A.current) == null ? void 0 : Tt.key) === k.key ? A.current : { key: k.key, page: Nn, before: re.slice(0, de + 1).map((je) => je.key), after: re.slice(de + 1).map((je) => je.key) }, Oe = new Set(at.after), Ct = new Set(at.before), kn = re.find((je) => {
      var ht;
      return Oe.has(je.key) || (ke === 1 || Nn < at.page) && ((ht = A.current) == null ? void 0 : ht.key) === k.key && !Ct.has(je.key);
    });
    if (!g && kn) {
      Jt(kn, V);
      return;
    }
    const yn = g ? Ct : new Set(re.map((je) => je.key));
    let xe = ke === -1 && !g ? Math.max(1, Nn - 1) : Nn;
    for (; Lt.current && !Nt.current; ) {
      let je = await bt(Ut, xe);
      const ht = Math.max(
        1,
        Math.ceil(je.totalCount / Number(G.filter.perPage))
      );
      xe > ht && (xe = ht, je = await bt(Ut, xe));
      const Fn = Ni(je.items, ke === -1), ta = new Map(Fn.map((It) => [It.key, It])), na = g ? at.after.flatMap((It) => {
        const Pr = ta.get(It);
        return Pr ? [Pr] : [];
      }) : [], ra = new Set(na.map((It) => It.key)), Fr = g ? {
        ...je,
        items: [
          ...na,
          ...Fn.filter(
            (It) => It.key !== k.key && !ra.has(It.key)
          )
        ]
      } : { ...je, items: Fn };
      if (!se()) return;
      if (S) {
        A.current = at, yt(Fr, xe, k, !1, !0);
        return;
      }
      const xr = ke === -1 && Nn === 1 && !g ? void 0 : Fr.items.find(
        (It) => !yn.has(It.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(g && ke === -1 && xe === at.page) || Oe.has(It.key))
      );
      if (xr || (ke === -1 ? xe <= 1 : xe >= ht)) {
        yt(
          Fr,
          xe,
          xr ?? null,
          V,
          !0
        ), xr || qt(
          je.totalCount ? `Reached the end in this direction. Matching items remain available from the ${h.queue} pages.` : `No matching ${h.many}.`
        );
        return;
      }
      xe += ke;
    }
  }
  async function Bt(g, S = !1, V = !1, se = !1) {
    if (w || !k || Je.current || we || ze && !V)
      return;
    const de = V || se || !!(g != null && g.steps.length);
    if (de && (!t || !We) || g && Yn(g) && !n) return;
    const ke = !S && !V && !se && de && g !== void 0 && We !== null && zo(e) && Mi(Oi(e.actions, Yd(g, We, Wt))).length > 0;
    Je.current = !0, et(!0), Ce(""), qt("");
    const at = re.findIndex((xe) => xe.key === k.key), Oe = de && !S && !ke && at >= 0 ? re[at + 1] ?? null : null;
    Oe && (Q(
      (xe) => xe.filter((Tt) => Tt.key !== k.key)
    ), Jt(Oe, !0));
    let Ct = !1, kn = !1, yn = [];
    try {
      if (de) {
        const xe = await vn(l, k);
        if (g)
          await Sf(Ut, k, g);
        else {
          const je = se && Re(e) ? e.occurrence.tagIds.filter((ta) => xe.ids.includes(ta)) : un.current, Fn = Gr(je, se ? Pe : Dt);
          await Co(Ut, k, Fn);
        }
        const Tt = await vn(l, k);
        Oe || tt(Tt), kn = !0, St(!1), ke && (yn = Mi(Oi(e.actions, Tt))), qt(
          yn.length ? `Tags saved. Staying until answered: ${yn.map((je) => je.name).join(", ")}.` : "Tags saved."
        ), k.occurrence && (Er(k.occurrence.performer.id), st((je) => je + 1));
      }
      if (!Lt.current || Nt.current) return;
      if (de)
        if (Oe) {
          const xe = Pt.current;
          Ct = !0, Ye(), Sr(!0, !1, !0, () => Pt.current === xe && !Je.current).catch((Tt) => {
            Pt.current === xe && Ce(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${en(Tt)}`);
          });
        } else yn.length || await Sr(!0, S, !S);
      else S || await Sr();
      S && V && requestAnimationFrame(() => {
        var xe;
        return (xe = _t.current) == null ? void 0 : xe.focus();
      });
    } catch (xe) {
      if (Ce(
        kn ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${en(xe)}` : de ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${en(xe)}` : `Could not advance. ${en(xe)}`
      ), de && !kn) {
        Oe && (Q(re), ce(null), K((Tt) => Tt + 1), oe(k));
        try {
          tt(await vn(l, k));
        } catch {
          tt(null), Ce(
            (Tt) => `${Tt} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      Ct || Ye();
    }
  }
  const qn = !ze && !w && !Ot && !nr && (k != null || we || me);
  po({
    surface: "local",
    enabled: qn,
    actions: e.actions,
    onAction: (g, S) => {
      const V = e.actions[g];
      V && Bt(V, S);
    },
    onFind: () => pn(!0)
  });
  const gn = (g) => me || we || !We || !!w || !t && g.steps.length > 0 || !n && Yn(g);
  function sr() {
    !i || w || Je.current || ze || (L.current = document.activeElement, C.current = {
      error: dt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: re,
      current: k,
      total: Ae,
      targets: $e.current,
      stayedCursor: A.current
    }, Pt.current++, E(structuredClone(e)), F(""), qt(""), Ce(""));
  }
  Z(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && ne && !we && (_.current = o, sr(), s == null || s());
  }, [o, we, ne]);
  function cr() {
    E(null), F(""), requestAnimationFrame(() => {
      const g = L.current;
      g != null && g.isConnected && g !== document.body && g.focus();
    });
  }
  function Sa() {
    var S;
    const g = C.current;
    !g || me || ((S = x.current) == null || S.abort(), Ve.current++, D.current = g.query, M(g.query), Q(g.items), oe(g.current), qe(g.total), $e.current = g.targets, A.current = g.stayedCursor, Ge(!1), Ce(g.error), qt(""), window.history.replaceState(window.history.state, "", g.url), cr());
  }
  async function Me() {
    if (!w || !i || Je.current) return;
    const g = An(
      { ...w, name: w.name.trim() },
      Ua(jt.current, D.current)
    ), S = pa(g);
    if (S) {
      F(S);
      return;
    }
    Je.current = !0, et(!0), F("");
    try {
      if (await i(g) === !1) throw new Error("Could not save review.");
      cr(), qt("Review saved.");
    } catch (V) {
      F(
        "Could not save review. Your edits are still open. " + en(V)
      );
    } finally {
      Ye();
    }
  }
  async function kr() {
    if (!i || Je.current) return;
    const g = Ua(jt.current, D.current), S = An(jt.current, {
      ...g,
      filter: { ...g.filter, page: 1 }
    });
    Je.current = !0, et(!0), Ce("");
    try {
      if (await i(S) === !1) throw new Error("Could not save review.");
      qt("Queue saved to this review.");
    } catch (V) {
      Ce("Could not save queue. " + en(V));
    } finally {
      Ye();
    }
  }
  const Xe = G.performerScope, Yr = (g) => {
    const { performerFocus: S, ...V } = D.current, se = S && !("targetMode" in g || "performerIds" in g || "performerFilter" in g);
    Le(
      {
        ...V,
        ...se ? { performerFocus: S } : {},
        filter: { ...V.filter, page: 1 },
        performerScope: { ...Xe, ...g }
      },
      V.startFrom === "end"
    );
  };
  async function Sn(g, S) {
    var de;
    const V = Et.current;
    if (!Re(V)) return;
    (de = fe.current) == null || de.controller.abort();
    const se = {
      signature: Ga(V),
      controller: new AbortController()
    };
    fe.current = se, jn.current = "", j(!0), Se(null);
    try {
      const ke = await Yf(V, g, S, se.controller.signal, {
        onProgress: (at) => {
          fe.current === se && Ht(at);
        }
      });
      fe.current === se && Ht(ke);
    } catch (ke) {
      fe.current === se && !se.controller.signal.aborted && (jn.current = se.signature, Se({ signature: se.signature, message: en(ke) }));
    } finally {
      fe.current === se && (fe.current = null, j(!1));
    }
  }
  function Xr() {
    var g;
    (g = fe.current) == null || g.controller.abort(), fe.current = null, j(!1), Ht((S) => S && { ...S, partial: !0, complete: !1 });
  }
  async function Er(g) {
    var se;
    const S = Et.current;
    if (!Re(S)) return;
    if (fe.current) {
      Xr();
      return;
    }
    const V = Ga(S);
    if (!(((se = rn.current) == null ? void 0 : se.signature) !== V || rn.current.partial))
      try {
        const de = await Zc(S, g);
        if (fe.current) {
          Xr();
          return;
        }
        Ht(
          (ke) => (ke == null ? void 0 : ke.signature) === V ? Xf(ke, g, de) : ke
        );
      } catch {
        Ht(
          (de) => (de == null ? void 0 : de.signature) === V ? { ...de, partial: !0, complete: !1 } : de
        );
      }
  }
  const Rn = G.performerFocus ? pt == null ? void 0 : pt.candidates.find((g) => g.id === G.performerFocus) : void 0, Ke = Mt && Mt.id === G.performerFocus ? { ...Mt, flags: pr(Ie, Mt.tags) } : Rn ? { ...Rn, flags: pr(Ie, Rn.tags) } : null, Zr = (g) => {
    if ((Mt == null ? void 0 : Mt.id) === g)
      return pr(Ie, Mt.tags);
    const S = pt == null ? void 0 : pt.candidates.find((V) => V.id === g);
    return S ? pr(Ie, S.tags) : void 0;
  }, xt = ((dr = k == null ? void 0 : k.occurrence) == null ? void 0 : dr.performer.id) ?? null, _e = xt === null ? void 0 : Zr(xt), Ar = ep(
    Ie.length > 0 && xt !== null && xt !== G.performerFocus && _e === void 0 ? xt : null
  ), ka = _e ?? (Ar ? pr(Ie, Ar) : []), Wt = oc(ot.actions), Cr = At.summary && G.performerFocus ? uo(To(At.summary, ot.actions, Wt)) : [], lr = Ho(Ie, (Ke == null ? void 0 : Ke.flags) ?? [], Wr), Tr = uc(
    Ho(Ie, ka, Wr),
    xt !== null && xt === G.performerFocus ? Cr : []
  ), Ea = JSON.stringify(Tr), $n = ve(() => Tr, [Ea]), Aa = JSON.stringify(lr), Un = ve(() => lr, [Aa]), On = (g) => ou(Ie, g, Qr);
  function oi(g) {
    if (Je.current) return;
    const S = {
      ...D.current,
      performerFocus: g,
      filter: { ...D.current.filter, page: 1 }
    };
    Le(S, S.startFrom === "end"), zt("items");
  }
  function Ca() {
    const { performerFocus: g, ...S } = D.current;
    Le(
      { ...S, filter: { ...S.filter, page: 1 } },
      S.startFrom === "end"
    );
  }
  const Ir = R(null);
  Ir.current ?? (Ir.current = Nc());
  const Ta = Ir.current, si = ve(
    () => ot.actions.flatMap((g) => g.steps.flatMap((S) => S.tagIds)),
    [ot.actions]
  ), Rr = R(null);
  Z(() => {
    const g = Rr.current, S = g == null ? void 0 : g.querySelector('[aria-current="true"]');
    if (!g || !S) return;
    const V = g.getBoundingClientRect(), se = S.getBoundingClientRect();
    se.top < V.top ? g.scrollTop -= V.top - se.top : se.bottom > V.bottom && (g.scrollTop += se.bottom - V.bottom);
  }, [k == null ? void 0 : k.key, Vt]);
  const Ia = R(null), Yt = R(null);
  Z(() => {
    var V, se;
    const g = Yt.current;
    if (!g) return;
    Yt.current = null;
    const S = [...((V = Ia.current) == null ? void 0 : V.querySelectorAll(".dq-partner")) ?? []];
    (se = S.find((de) => de.dataset.partnerKey === g) ?? S[0]) == null || se.focus();
  }, [k == null ? void 0 : k.key]);
  const Mn = me || we || ze || !!w, bn = ve(
    () => w ? An(w, Ua(e, G)) : null,
    [w, e, G]
  ), Bn = ve(
    () => bn != null && Br(br(bn)) !== Br(br(e)),
    [bn, e]
  );
  function $r() {
    k ? vn(l, k).then(tt).catch((g) => Ce(en(g))) : Le(D.current);
  }
  const on = dt ? /* @__PURE__ */ u("p", { role: "alert", children: [
    dt,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: me, onClick: $r, children: k ? "Reload tags" : "Retry queue" })
  ] }) : null, Kn = me || we || k != null && !We, Or = Math.max(1, Number(G.filter.perPage) || 1), ea = R(1);
  we || (ea.current = Math.max(1, Math.ceil(Ae / Or)));
  const Ra = ea.current, $a = Xe && k ? re.filter(
    (g) => g.media.id === k.media.id && g.key !== k.key
  ) : [], Oa = (g) => {
    var S;
    return g.title || ((S = g.files[0]) == null ? void 0 : S.basename) || `${l === "audio" ? "Audio" : "Video"} ${g.id}`;
  }, Mr = k ? fp(k.media, l) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}`,
      "aria-label": Xe ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (g) => {
        var se;
        const S = g.target instanceof Element ? g.target.closest("button") : null, V = (S == null ? void 0 : S.getAttribute("aria-label")) ?? ((se = S == null ? void 0 : S.textContent) == null ? void 0 : se.trim()) ?? "";
        S && !S.closest(bs) && /^(Filters|Edit filter:|Edit criteria)/.test(V) && (Tn.current = S);
      },
      children: [
        /* @__PURE__ */ a(
          Dc,
          {
            name: e.name,
            description: e.description,
            entityType: De(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: Mn || !!(c != null && c.busy),
            onEdit: w ? () => {
              var g;
              return (g = U.current) == null ? void 0 : g.focus();
            } : sr,
            editDisabled: !w && (Mn || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: me || ze, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  da,
                  {
                    filter: G.filter,
                    objectFilter: ie,
                    criteriaDefinitions: l === "audio" ? Ts : Xa,
                    customFieldEntityType: l,
                    supportsFilterExpressions: !0,
                    totalCount: Ae,
                    sortOptions: l === "audio" ? _l : Is,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      _c,
                      {
                        page: Math.min(Math.max(1, Nn || 1), Ra),
                        pages: Ra,
                        onPage: (g) => Le({
                          ...D.current,
                          filter: tn(
                            { ...D.current.filter, page: g },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (g) => {
                      (g.sort !== D.current.filter.sort || g.direction !== D.current.filter.direction) && (g = { ...g, sorts: void 0 }), Le(
                        {
                          ...D.current,
                          filter: tn(g, l)
                        },
                        D.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (g) => {
                      Le(
                        {
                          ...D.current,
                          objectFilter: Uc(
                            g,
                            kt,
                            D.current.objectFilter
                          ),
                          filter: { ...D.current.filter, page: 1 }
                        },
                        D.current.startFrom === "end"
                      );
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ u(pe, { children: [
              Xe && /* @__PURE__ */ a(
                Jf,
                {
                  scope: Xe,
                  disabled: me || ze,
                  editing: !!w,
                  onChange: Yr,
                  onEditCriteria: () => mt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                jc,
                {
                  mode: "single",
                  disabled: Mn || !!c.busy,
                  onChange: () => {
                    var g;
                    return (g = c.onGrid) == null ? void 0 : g.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(pe, { children: [
              Re(Ut) && t && /* @__PURE__ */ a(
                _f,
                {
                  review: Ut,
                  disabled: gt || !!w,
                  performerAttention: G.performerFocus ? Un : void 0,
                  trees: Wt,
                  onOpen: () => {
                    Je.current = !0, et(!0);
                  },
                  onClose: (g) => {
                    if (g) {
                      const S = D.current.performerFocus;
                      S ? Er(S) : Xr(), st((V) => V + 1), Ye(), v.current || Ge(!0), Y((V) => V + 1);
                    } else Ye();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                wo,
                {
                  disabled: Mn,
                  items: c.moreItems({
                    onSelect: sr,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: G.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Ur,
                {
                  performer: {
                    id: G.performerFocus,
                    name: (Ke == null ? void 0 : Ke.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (Ke == null ? void 0 : Ke.name) ?? `performer ${G.performerFocus}` })
              ] }),
              Ke != null && Ke.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: On(Ke.flags), children: [
                /* @__PURE__ */ a(Ln, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: On(Ke.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: Ca,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: an,
            queueChange: !w && an ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: or ? () => void kr() : void 0,
              saveDisabled: gt || !i,
              onReset: () => {
                const g = wr(e);
                Le(g, g.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && bn && /* @__PURE__ */ a(
            Lc,
            {
              drawerRef: U,
              draft: bn,
              onChange: (g) => E(g),
              direction: G.startFrom,
              onDirectionChange: (g) => Le({ ...D.current, startFrom: g }),
              tagGroups: up,
              trees: Wt,
              saving: me,
              saveDisabled: we,
              error: O,
              dirty: Bn,
              criteriaChanged: or,
              notices: on && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: on }),
              onSave: () => void Me(),
              onCancel: Sa
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ u("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ u("div", { className: "dq-review-stage", children: [
              k ? /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ u("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ u(
                    "a",
                    {
                      href: `/${l}/${k.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${h.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: Oa(k.media) }),
                        /* @__PURE__ */ a(_s, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Mr && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Mr })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [k, be].filter(Boolean).map((g) => {
                    var se, de, ke, at, Oe;
                    const S = g, V = S.key === k.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: V ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": V ? void 0 : !0,
                        inert: V ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Ri("audio", S.media.id),
                            format: ((se = S.media.files[0]) == null ? void 0 : se.format) ?? "",
                            title: m(S.media),
                            coverUrl: V ? Ii("audio", S.media) : void 0,
                            duration: ((de = S.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            autostart: V && X === S.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Rs,
                          {
                            videoId: S.media.id,
                            streamUrl: Ri("video", S.media.id),
                            posterUrl: V ? Ii("video", S.media) : void 0,
                            duration: ((ke = S.media.files[0]) == null ? void 0 : ke.duration) ?? 0,
                            format: (at = S.media.files[0]) == null ? void 0 : at.format,
                            audioCodec: (Oe = S.media.files[0]) == null ? void 0 : Oe.audioCodec,
                            extensionSurface: V ? "quick-view" : void 0,
                            autostart: V && X === S.media.id,
                            keyboardShortcutsEnabled: V,
                            showAbLoop: V,
                            clip: S.media.parentVideoId != null ? {
                              start: S.media.clipStartSec ?? 0,
                              end: S.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${S.media.id}:${ue}`
                    );
                  }) }),
                  l === "audio" && /* @__PURE__ */ a(
                    Uf,
                    {
                      details: k.media.details,
                      label: h.one
                    },
                    k.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: we ? "Loading review…" : Ae ? "Reached the end in this direction." : `No matching ${h.many}.` }),
              ot.actions.length > 0 ? /* @__PURE__ */ a(
                vu,
                {
                  actions: ot.actions,
                  isDisabled: (g) => ze || gn(g),
                  busy: Kn,
                  tags: We,
                  trees: Wt,
                  preview: Ta,
                  onApply: (g, S) => void Bt(g, S),
                  onFind: () => pn(!0),
                  findDisabled: ze || !!w,
                  paused: !!w,
                  waitForGroups: zo(ot),
                  attention: $n,
                  stayOnTap: mn,
                  onStayOnTapChange: rr
                }
              ) : Re(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || me || ze || !We || !!w || !k,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((g) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Pe.includes(g),
                          onChange: (S) => ut(
                            e.occurrence.multiple ? S.target.checked ? [...Pe, g] : Pe.filter((V) => V !== g) : [g]
                          )
                        }
                      ),
                      le[g] ?? "Loading tag…"
                    ] }, g)),
                    /* @__PURE__ */ u("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => ut([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void Bt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void Bt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: Ia, children: [
                k && /* @__PURE__ */ u(pe, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: k.occurrence ? k.occurrence.performer.name : `this ${h.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      k.occurrence && /* @__PURE__ */ a(Ur, { performer: k.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: k.occurrence ? k.occurrence.performer.name : `This ${h.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: Xe ? `Tags apply to this performer in this ${h.queue}` : `Tags apply to the whole ${h.one}` })
                      ] })
                    ] }),
                    $n.length > 0 && /* @__PURE__ */ a(mp, { entries: $n })
                  ] }),
                  $a.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${h.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          h.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: $a.map((g) => {
                          var S, V, se;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (S = g.occurrence) == null ? void 0 : S.performer.name,
                              "aria-label": (V = g.occurrence) == null ? void 0 : V.performer.name,
                              "data-partner-key": g.key,
                              disabled: gt,
                              onClick: () => {
                                Yt.current = k.key, Jt(g), Ce("");
                              },
                              children: [
                                g.occurrence && /* @__PURE__ */ a(Ur, { performer: g.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (se = g.occurrence) == null ? void 0 : se.performer.name })
                              ]
                            },
                            g.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    hp,
                    {
                      tags: We,
                      preview: Ta,
                      trees: Wt,
                      actionTagIds: si,
                      label: `Current ${Xe ? "occurrence" : h.one} tags`,
                      tagsChangedSinceEditing: ze && !me && (!We || We.ids.length !== un.current.length || We.ids.some((g) => !un.current.includes(g))),
                      editor: ze && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: fn,
                          disabled: me,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              Xe ? "occurrence" : h.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              Xn,
                              {
                                entityType: "tag",
                                values: Dt,
                                onChange: nt,
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
                                  disabled: !We,
                                  onClick: () => void Bt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !We,
                                  onClick: () => void Bt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    St(!1), requestAnimationFrame(() => {
                                      var g;
                                      return (g = _t.current) == null ? void 0 : g.focus();
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
                Re(ft) && G.performerFocus && /* @__PURE__ */ a(
                  Bi,
                  {
                    ...At,
                    mediaKind: l,
                    actions: ot.actions,
                    trees: Wt,
                    flags: Un
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && on,
                  Qe && /* @__PURE__ */ a("p", { role: "status", children: Qe })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                k && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": Kn || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: _t,
                      className: "dq-button",
                      disabled: gt || !!w || !t || !We,
                      onClick: () => {
                        Pt.current++, un.current = [...We.ids], nt([...We.ids]), St(!0);
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
                      disabled: gt || !!w,
                      onClick: () => void Bt(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        Xe ? " performer" : ` ${h.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Xe && /* @__PURE__ */ u(
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
                        "aria-pressed": Vt === "items",
                        onClick: () => zt("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Vt === "performers",
                        onClick: () => zt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Xe && Vt === "performers" ? /* @__PURE__ */ a(
                Kf,
                {
                  ranking: (pt == null ? void 0 : pt.signature) === Ee ? pt : null,
                  busy: I,
                  error: (H == null ? void 0 : H.signature) === Ee ? H.message : "",
                  focus: G.performerFocus,
                  disabled: gt,
                  labels: h,
                  flagLabel: On,
                  onFocus: oi,
                  onMore: () => {
                    const g = rn.current;
                    g && Sn(g, g.limit + qi);
                  },
                  onRefresh: () => {
                    Ht(null), Sn(null, qi);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Rr, children: re.map((g) => {
                var V;
                const S = (k == null ? void 0 : k.key) === g.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(g),
                    "aria-label": y(g),
                    "aria-current": S ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      Jt(g), Ce(""), qt("");
                    },
                    children: [
                      /* @__PURE__ */ a(pp, { media: g.media, kind: l }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m(g.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          g.occurrence && /* @__PURE__ */ u(pe, { children: [
                            /* @__PURE__ */ a(Ur, { performer: g.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: g.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            g.media.date,
                            g.occurrence ? "" : (V = g.media.files[0]) != null && V.duration ? $s(g.media.files[0].duration) : ""
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
        Xe && /* @__PURE__ */ a(
          Cs,
          {
            open: Ot,
            onClose: () => mt(!1),
            criteria: Qi,
            activeFilter: Xe.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (g) => {
              mt(!1), Yr({ performerFilter: g });
            }
          }
        ),
        nr && /* @__PURE__ */ a(
          go,
          {
            actions: e.actions,
            trees: Wt,
            isDisabled: (g) => gn(g),
            tapStays: he && mn,
            onApply: (g, S) => {
              pn(!1), Bt(g, S);
            },
            onClose: () => pn(!1)
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
function Si(e, t) {
  const n = De(e), r = Cn(to(n)), i = n === "tag" ? "tag" : Re(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function vp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Si(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      "Matching ",
      Si(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Si(e, t)
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
              const U = (C = F.target.files) == null ? void 0 : C[0];
              F.target.value = "", U && m(U);
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
          const U = De(F);
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
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Fc, { entityType: U }) }),
                  /* @__PURE__ */ u("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: F.name }),
                    F.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: F.description, children: F.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Mc[U] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(vp, { review: F, count: t[F.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(wo, { label: `Actions for ${F.name}`, items: N(F) }) })
          ] }, F.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ u("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(ei, { "aria-hidden": "true" }),
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
  const l = R(null), h = Ze();
  Z(() => {
    var y;
    return l.current ?? (l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = l.current) != null && N.isConnected && l.current.focus({ preventScroll: !0 });
    };
  }, []);
  const p = R(o);
  Z(() => {
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
                      y !== De(i) && t(ul(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => yo(i), children: "Export draft" }),
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
  return De(t) === "video" && Nr(t.view.objectFilter, e.view.objectFilter, Io(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ws(e, t) {
  return Zn(
    JSON.parse(Jn(br(e))),
    JSON.parse(Jn(br(t)))
  );
}
const ki = 180;
function vs(e) {
  return De(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ns(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function qs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ei(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ii.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  sl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ep(e) {
  return tn({ ...e, page: 1 });
}
function fl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Dr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Ap = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Yi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(od, { "aria-hidden": "true" }) }
], Cp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Yi, { "aria-hidden": "true" }) },
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
  }), [i, o] = T(""), [s, c] = T(!0), [d, f] = T(""), [l, h] = T(!1), [p, m] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [E, O] = T([]), [F, U] = T(""), [C, L] = T(!0), [x, ne] = T("account"), [J, _] = T(""), [G, M] = T(""), [D, P] = T(!1), [Y, W] = T(!1), [re, Q] = T(""), [k, oe] = T(qs), A = R(k);
  A.current = k;
  const [X, ce] = T({}), ue = R(X);
  ue.current = X;
  const K = R(t);
  K.current = t;
  const be = R(s);
  be.current = s;
  const Ae = R(!1), qe = R(!0);
  Z(() => (qe.current = !0, () => {
    qe.current = !1;
  }), []);
  const [we, Ge] = T(!k);
  we !== !k && (Ge(!k), k || ce({}));
  const [me, et] = T(yp), { sort: Je, direction: Pt } = me, Lt = (b) => {
    const q = { ...me, ...b };
    et(q), wp(q);
  }, Nt = R(null), dt = R(null), [Ce, Qe] = T(null), [qt, We] = T(!1), [tt, ze] = T(!1), [St, Dt] = T(null), [nt, un] = T(null), _t = !!St || !!nt, Tn = R(_t);
  Tn.current = _t;
  const fn = qt || !!nt || tt, [Ot, mt] = T(0), [nr, pn] = T(!1), [he, Gt] = T(null), hn = R(null), mn = R(null), rr = R(null), [Pe, ut] = T(
    null
  ), le = t.find((b) => b.id === k) ?? null, B = ve(
    () => (Pe == null ? void 0 : Pe.id) === k && le ? { ...le, view: {
      ...le.view,
      filter: Pe.view.filter,
      objectFilter: Pe.view.objectFilter,
      searchMode: Pe.view.searchMode,
      startFrom: Pe.view.startFrom
    } } : le,
    [Pe, k, le]
  ), $e = B ? De(B) : "video", kt = to($e), ar = B ? Re(B) : !1, ie = $e === "video" ? B : null, Ve = ar && !!(B != null && B.actions.some(Yn)), jt = !!ie || $e === "audio" || Ve, [ot, ft] = T(null), Ut = (ot == null ? void 0 : ot.id) === (B == null ? void 0 : B.id) ? ot == null ? void 0 : ot.mode : (B == null ? void 0 : B.view.reviewMode) ?? "single", rt = ar || $e === "audio" || $e === "video" && Ut === "single", [Et, Vt] = T(0), zt = R(-1), pt = R(!1), qr = R(rt);
  qr.current = rt, Z(() => {
    const b = () => {
      const q = qr.current;
      if (!q && Sn.current) {
        pt.current = !0;
        return;
      }
      zt.current = -1, xr(), q || Vt(($) => $ + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const rn = kt === "audio" ? p : l, jn = $e === "tag" ? "Tag" : kt === "audio" ? "Audio" : "Video", Ht = $e === "tag" ? y : rn, I = R(
    null
  ), j = np(ie), [H, Se] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [fe, Ee] = T({
    page: 1,
    perPage: 40
  }), [Ne, st] = T({ items: [], totalCount: 0 }), [Mt, Te] = T(k);
  Mt !== k && (Te(k), st({ items: [], totalCount: 0 }), W(!1));
  const [ge, Ft] = T(!1), [Ie, ir] = T(""), [In, Jr] = T(!1), [Qr, Wr] = T(!1), [At, an] = T(() => /* @__PURE__ */ new Set()), or = R(At);
  or.current = At;
  const gt = R(/* @__PURE__ */ new Map()), Nn = (B == null ? void 0 : B.view.selectAllOnLoad) === !0, [Le, Ye] = T(null), bt = R(Le);
  bt.current = Le;
  const [yt, Jt] = T(!1), Qt = R(yt);
  Qt.current = yt;
  const Sr = R(null), [Bt, qn] = T(!1), [gn, sr] = T("grid"), [cr, Sa] = T(ki), [Me, kr] = T(!1), [Xe, Yr] = T(!1), Sn = R(!1), [Xr, Er] = T(""), [Rn, Ke] = T(""), [Zr, xt] = T(""), [_e, Ar] = T(null), [ka, Wt] = T(""), [Cr, lr] = T(!1), [Tr, Ea] = T({}), $n = R(/* @__PURE__ */ new Map()), Aa = R(null), Un = R(null), On = !!B, oi = Hi(Tp, Ip, () => !1) && On, [Ca, Ir] = T({ top: 0, bottom: 0 });
  $t(() => {
    if (!On) return;
    const b = () => {
      const $ = Un.current;
      if (!$) return;
      const z = Math.round($.getBoundingClientRect().top + window.scrollY), ee = $.closest("main"), ae = ee ? Math.round(parseFloat(getComputedStyle(ee).paddingBottom) || 0) : 0;
      Ir(
        (te) => te.top === z && te.bottom === ae ? te : { top: z, bottom: ae }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [On]);
  const [Ta, si] = T(0), Rr = R(null), Ia = En((b) => {
    var $;
    if (($ = Rr.current) == null || $.disconnect(), Rr.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => si(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), Rr.current = q;
  }, []), Yt = R(0), Mn = R(0), bn = R(null), Bn = R(null), $r = oc(
    B && !rt ? he ? [...B.actions, ...he.draft.actions] : B.actions : Ss
  ), on = ve(
    () => he && B && le ? kp(he.draft, B, H, le) : null,
    [he, B, H, le]
  ), Kn = ve(
    () => B && le ? cl(
      { ...le, view: { ...B.view, filter: { ...H, page: 1 } } },
      le
    ) : null,
    [B, le, H]
  ), Or = ve(
    () => le ? Br(br(le)) : "",
    [le]
  ), ea = ve(
    () => Kn != null && Br(br(Kn)) !== Or,
    [Kn, Or]
  ), Ra = ve(
    () => on != null && Br(br(on)) !== Or,
    [on, Or]
  );
  Z(() => {
    if (!Rn) return;
    const b = window.setTimeout(() => Ke(""), 4e3);
    return () => window.clearTimeout(b);
  }, [Rn]), Z(() => {
    if (!Ce || Ce.alert) return;
    const b = window.setTimeout(() => Qe(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Ce]), Z(() => {
    const b = ie ? qo(ie.view.objectFilter) : [];
    if (Ea({}), !b.length) return;
    const q = new AbortController();
    let $ = !0;
    return Promise.all(
      b.map(async (z) => {
        var ee;
        try {
          const ae = await ye(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (ee = ae.name) != null && ee.trim() ? [String(z), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      $ && Ea(
        Object.fromEntries(z.filter((ee) => ee !== null))
      );
    }), () => {
      $ = !1, q.abort();
    };
  }, [ie == null ? void 0 : ie.id, ie == null ? void 0 : ie.view.objectFilter]);
  const $a = ve(
    () => ie ? So(
      ie.view.objectFilter,
      Tr
    ) : (B == null ? void 0 : B.view.objectFilter) ?? {},
    [Tr, B, ie]
  ), Oa = En(async () => {
    c(!0), f("");
    try {
      const b = await Cd();
      n(b.reviews), o(b.storageKey), h(b.canWriteVideos ?? b.canWrite), m(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), L(b.canConfigure ?? !0), ne(b.storage ?? "account"), _(b.storageNotice ?? ""), k && !b.reviews.some((q) => q.id === k) && (oe(""), Ei(""));
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
      O([]), U("");
      return;
    }
    const b = new AbortController();
    return U(""), Dd(b.signal).then(O).catch((q) => {
      b.signal.aborted || U(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), Z(() => {
    Oa();
  }, []), Z(() => {
    if (k || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof ue.current[q.id] == "number") continue;
      (Re(q) ? ko(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : _r(Eo(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : De(q) === "tag" ? hi(
        q,
        tn({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : _r(
        q,
        tn({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || ce((ee) => ({
          ...ee,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || ce((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [k, t]), $t(() => {
    var $, z;
    const b = dt.current;
    if (k || s || !b) return;
    dt.current = null, (z = (b === "heading" ? null : [...(($ = Un.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (ee) => ee.dataset.reviewId === b.reviewId
    )) ?? Nt.current) == null || z.focus();
  }, [k, s, nt, t]);
  const Mr = R(0), dr = En(async () => {
    const b = ++Mr.current;
    Ar(null), Wt("");
    try {
      const q = await (Ve ? nc(kt) : tc(kt));
      b === Mr.current && Ar(q);
    } catch (q) {
      if (b !== Mr.current) return;
      Ar(null), Wt(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Ve, kt]);
  Z(() => {
    dr();
  }, [dr]);
  const g = En(
    async (b, q, $ = !1, z = !1) => {
      var ct, Be;
      const ee = ++Yt.current;
      (ct = bn.current) == null || ct.abort();
      const ae = new AbortController();
      bn.current = ae, q = tn(q);
      const te = Number(q.page);
      $ && (q = { ...q, page: 1 }), Se(q), Wr($), Ft(!0), ir("");
      try {
        const it = (Fe) => De(b) === "tag" ? hi(
          b,
          Fe,
          ae.signal
        ) : _r(
          b,
          Fe,
          ae.signal
        );
        let lt = await it(q);
        const Xt = Math.max(
          1,
          Math.ceil(lt.totalCount / Number(q.perPage))
        ), Rt = $ ? Xt : Math.min(te, Xt);
        return Number(q.page) !== Rt && (q = { ...q, page: Rt }, lt = await it(q)), ee === Yt.current && (((Be = Bn.current) == null ? void 0 : Be.page) !== Rt && (Bn.current = {
          page: Rt,
          ids: new Set(lt.items.map((Fe) => Fe.id))
        }), st(lt), z && Ct(
          () => new Set(lt.items.map((Fe) => Fe.id))
        ), Se(q), Ee(q)), lt;
      } catch (it) {
        throw ee === Yt.current && ir(
          it instanceof Error ? it.message : "Could not load the review queue."
        ), it;
      } finally {
        ee === Yt.current && Ft(!1);
      }
    },
    []
  );
  Z(() => {
    var q;
    if (Mn.current += 1, zt.current = -1, Yt.current += 1, (q = bn.current) == null || q.abort(), Gt(null), hn.current = null, W(!1), Q(""), M(""), P(!1), an(/* @__PURE__ */ new Set()), gt.current.clear(), Ye(null), Jt(!1), kr(!1), Sn.current = !1, Er(""), Ke(""), xt(""), st({ items: [], totalCount: 0 }), Bn.current = null, Jr(!1), !B || rt) {
      Ft(!1), ut(null);
      return;
    }
    let b = !0;
    return Ft(!0), (async () => {
      let $ = le ?? B;
      ut(null);
      let z = null;
      const ee = new URLSearchParams(window.location.search);
      if (De(B) === "video" && ii.some((Be) => ee.has(Be)))
        try {
          const Be = $;
          z = zi(Be, ee);
          const it = An(Be, z.query);
          (z.query.startFrom !== (Be.view.startFrom ?? "end") || !Zn(
            JSON.parse(Jn(it)),
            JSON.parse(Jn(An(Be, wr(Be))))
          )) && ($ = it, ut($));
        } catch (Be) {
          Jr(!0), ir(Be instanceof Error ? Be.message : "Could not read review URL."), Ft(!1);
          return;
        }
      let ae = null;
      try {
        ae = await $d(i, B.id);
      } catch (Be) {
        b && (P(!0), M(
          Be instanceof Error ? Be.message : "Could not load progress."
        ));
      }
      if (!b) return;
      const te = (ae == null ? void 0 : ae.signature) === Jn($) ? ae : null, ct = z ? z.query.filter : te ? tn(te.filter) : Ep($.view.filter);
      Se(ct), sr(
        te ? Ns(te.displayMode, De(B)) : vs(B)
      ), Sa(
        te ? te.cardSize ?? ki : ki
      );
      try {
        const Be = await g(
          $,
          ct,
          z ? z.startAtEnd : !te && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const it = _o(
          Be.items.map((lt) => lt.id),
          (te == null ? void 0 : te.focusedId) ?? null,
          (te == null ? void 0 : te.index) ?? 0
        );
        Ye(it), Oe(it);
      } catch {
      }
      b && (zt.current = Et, W(!0), Q(`${B.id}:${Et}`));
    })(), () => {
      var $;
      b = !1, Mn.current++, Yt.current++, ($ = bn.current) == null || $.abort();
    };
  }, [B == null ? void 0 : B.id, rt, Et]), Z(() => {
    if (!(!Ot || rt || !B)) {
      if (In) {
        mt(0);
        return;
      }
      Me || he || Xe || re !== `${B.id}:${Et}` || (mt(0), ui());
    }
  }, [
    Ot,
    rt,
    B == null ? void 0 : B.id,
    re,
    Me,
    Xe,
    Et,
    In
  ]), Z(() => {
    !ie || rt || !Y || ge || Ie || Me || pt.current || zt.current !== Et || la(ie.id, {
      filter: H,
      objectFilter: ie.view.objectFilter,
      searchMode: ie.view.searchMode,
      startFrom: ie.view.startFrom ?? "end"
    });
  }, [ie, rt, Y, ge, Ie, H, Me, Et]);
  const S = ve(
    () => Ne.items.map((b) => b.id),
    [Ne.items]
  );
  Z(() => {
    if (!Y || !B || !i || ge || Ie || Me || (Pe == null ? void 0 : Pe.id) === B.id || D || zt.current !== Et)
      return;
    const b = {
      version: 1,
      signature: Jn(B),
      filter: H,
      focusedId: Le,
      index: Math.max(0, S.indexOf(Le ?? -1)),
      displayMode: gn,
      cardSize: cr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + B.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (G) return;
    let q = !0;
    const $ = window.setTimeout(() => {
      Od(i, B.id, b).catch((z) => {
        q && M(
          "Progress is kept in this browser, but account sync failed. " + (z instanceof Error ? z.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout($);
    };
  }, [
    Y,
    i,
    B,
    ge,
    Ie,
    Me,
    H,
    Le,
    S,
    gn,
    cr,
    Pe,
    G,
    D,
    Et
  ]);
  const V = Ne.items.find((b) => b.id === Le) ?? null, se = $e === "video" ? V : null;
  yt && se && (Sr.current = se);
  const de = se ?? (yt ? Sr.current : null), ke = jo(At, Le), at = S.length > 0 && S.every((b) => At.has(b)), Oe = En((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (Tn.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const $ = $n.current.get(b);
      $ == null || $.focus({ preventScroll: !0 }), q && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  Z(() => {
    Y && !Qt.current && Oe(bt.current);
  }, [Y, Oe]), Z(() => {
    ge || !S.length || (bt.current == null || !S.includes(bt.current)) && (Ye(S[0]), Qt.current || Oe(S[0]));
  }, [Oe, S, ge]);
  const Ct = En(
    (b) => {
      an((q) => {
        const $ = b(q);
        for (const z of /* @__PURE__ */ new Set([...q, ...$]))
          q.has(z) !== $.has(z) && gt.current.set(
            z,
            (gt.current.get(z) ?? 0) + 1
          );
        return $;
      });
    },
    []
  ), kn = En(
    (b) => {
      if (!S.length) return;
      const q = Math.max(
        0,
        S.indexOf(bt.current ?? S[0])
      ), $ = S[Math.max(0, Math.min(S.length - 1, q + b))];
      Ye($), Qt.current || Oe($);
    },
    [Oe, S]
  ), yn = En(
    async (b, q = !1) => {
      const $ = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, ee = z != null && (!v || !E.some((He) => He.id === z)), ae = "effect" in b && $ && !v, te = jo(
        or.current,
        bt.current
      );
      if (!B || Sn.current || ge || Ie) return;
      const ct = $ && !Ht ? `${jn} write permission is required to apply ${b.label}.` : ae || ee ? `${b.label} needs a tag group that is unavailable.` : Yn(b) && (_e == null ? void 0 : _e.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : te.length ? "" : `Select or focus a ${$e} before applying ${b.label}.`;
      if (ct) {
        xt(ct);
        return;
      }
      const Be = ++Mn.current, it = B.id, lt = [...S], Xt = Ne, Rt = bt.current, Fe = new Set(or.current), sn = new Map(
        te.map((He) => [He, gt.current.get(He) ?? 0])
      ), ur = () => Be === Mn.current && B.id === it;
      Sn.current = !0, kr(!0), Er(
        or.current.size ? `${te.length} selected ${$e}s` : `the focused ${$e}`
      ), Ke(""), xt("");
      const xo = Xt.items.filter(
        (He) => !te.includes(He.id)
      ), Il = xo.map((He) => He.id), Po = Uo(
        lt,
        Il,
        Rt,
        te.includes(Rt ?? -1)
      );
      q || (st({
        items: xo,
        totalCount: Xt.totalCount
      }), an((He) => {
        const Zt = new Set(He);
        for (const wn of te) Zt.delete(wn);
        return Zt;
      }), Ye(Po), Qt.current || Oe(Po));
      let fi = !1;
      try {
        if ("effect" in b ? await Hd(b, te) : await ac(kt, b, te), fi = !0, !ur()) return;
        q || an((He) => {
          const Zt = new Set(He);
          for (const wn of te)
            (gt.current.get(wn) ?? 0) === sn.get(wn) && Zt.delete(wn);
          return Zt;
        }), Ke(
          `${b.label}: ${te.length} ${$e}${te.length === 1 ? "" : "s"} ${$ ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (He) {
        if (!ur()) return;
        st(Xt), an((Zt) => {
          const wn = new Set(Zt);
          for (const cn of te)
            Fe.has(cn) && (gt.current.get(cn) ?? 0) === sn.get(cn) && wn.add(cn);
          return wn;
        }), Ye(Rt), Qt.current || Oe(Rt), xt(
          He instanceof Error ? He.message : "Action failed."
        );
      }
      try {
        if (!ur()) return;
        if (q) {
          const Kt = $e === "tag" ? await hi(B, H) : await _r(B, H), Gn = new Map(
            Kt.items.map((ln) => [ln.id, ln])
          );
          if ($e !== "tag" && await Promise.all(
            te.filter((ln) => !Gn.has(ln)).map(async (ln) => {
              const Vn = await Ja(kt, ln).catch(() => null);
              Vn && Gn.set(ln, Vn);
            })
          ), !ur()) return;
          st((ln) => ({
            items: ln.items.map((Vn) => Gn.get(Vn.id) ?? Vn),
            totalCount: Kt.totalCount
          }));
          return;
        }
        const He = new Set(te), Zt = Nn && lt.length > 0 && lt.every((Kt) => He.has(Kt)), wn = await g(B, H, !1, Zt);
        if (!ur()) return;
        let cn = wn.items.map((Kt) => Kt.id);
        const xa = Bn.current, Rl = (xa == null ? void 0 : xa.page) === Number(H.page) && cn.some((Kt) => xa.ids.has(Kt)), $l = (B.view.startFrom ?? "end") !== "beginning";
        if (wn.totalCount > 0 && Number(H.page) > 1 && (!cn.length || $l && !Rl)) {
          const Kt = Math.max(1, Number(H.page) - 1), Gn = { ...H, page: Kt };
          Se(Gn), cn = (await g(
            B,
            Gn,
            !1,
            Zt
          )).items.map((pi) => pi.id), an(
            (pi) => new Set([...pi].filter((Ol) => cn.includes(Ol)))
          );
          const Vn = cn.at(-1) ?? null;
          Ye(Vn), Qt.current || Oe(Vn);
        } else {
          an(
            (Gn) => new Set([...Gn].filter((ln) => cn.includes(ln)))
          );
          const Kt = Uo(
            lt,
            cn,
            Rt,
            fi && te.includes(Rt ?? -1)
          );
          Ye(Kt), Qt.current && Kt == null && Jt(!1), Qt.current || Oe(Kt);
        }
      } catch (He) {
        ur() && xt(
          (Zt) => `${Zt ? `${Zt} ` : ""}${fi ? "The action completed, but " : ""}the queue could not be refreshed. ${He instanceof Error ? He.message : "Refresh failed."}`
        );
      } finally {
        ur() && (Sn.current = !1, kr(!1), Er(""), pt.current && (pt.current = !1, xr(), Vt((He) => He + 1)));
      }
    },
    [
      Ht,
      v,
      E,
      $e,
      _e,
      g,
      H,
      Oe,
      S,
      Ne,
      ge,
      Ie,
      B
    ]
  );
  function xe() {
    var $;
    if (gn === "list") return 1;
    const b = ($ = Aa.current) == null ? void 0 : $.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const Tt = R(() => {
  });
  Tt.current = (b) => {
    var ae;
    if (rt || b.defaultPrevented || b.repeat || dn(b) || b.ctrlKey || b.altKey || b.metaKey || _t) return;
    const q = b.target, $ = q instanceof Node && ((ae = Un.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z) return;
    if (Bt) {
      b.key === "Escape" && (Dr(b), qn(!1));
      return;
    }
    if (yt && b.key === "Escape") {
      Dr(b), Jt(!1), Oe(bt.current);
      return;
    }
    if (!vd(q)) return;
    const ee = wd(q);
    if (b.key === "Escape") {
      Dr(b), Ct(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && b.key === " " && ee) {
      Dr(b), Le != null && Ct((te) => Ba(te, Le));
      return;
    }
    if (!(Me || ge) && !yt && b.key === "Enter" && Le != null && ee) {
      if ($e !== "tag" && he) return;
      Dr(b), $e === "tag" ? window.open(`/tag/${Le}`, "_blank", "noopener,noreferrer") : Jt(!0);
      return;
    }
  }, Z(() => {
    const b = (q) => Tt.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const je = R(
    () => {
    }
  );
  je.current = (b) => {
    var ae;
    if (rt || _t || yt || Bt || Me || ge || !S.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, $ = q instanceof Node && ((ae = Un.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z || !b.key.startsWith("Arrow") || !qd(q)) return;
    const ee = Sd(b.key, xe());
    ee && (b.preventDefault(), $ ? b.stopImmediatePropagation() : b.stopPropagation(), kn(ee));
  }, Z(() => {
    const b = (q) => je.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const ht = (he == null ? void 0 : he.saving) === !0 || Xe, Fn = Me || ge && !Y || ht, ta = ho();
  po({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!B && !rt && !_t && !he && !yt && !Bt && !Ie && (Ne.items.length > 0 || ge || Me),
    actions: (B == null ? void 0 : B.actions) ?? Ss,
    onAction: (b, q) => {
      const $ = B == null ? void 0 : B.actions[b];
      $ && yn($, q);
    },
    onFind: () => qn(!0),
    onSelectAll: () => Ct((b) => yd(b, S))
  }), Z(() => qn(!1), [rt, yt, B == null ? void 0 : B.id]);
  function na(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", $ = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = $ != null && !E.some((ee) => ee.id === $);
    return Me || ge || !!Ie || q && !Ht || "effect" in b && q && (!v || z) || Yn(b) && (_e == null ? void 0 : _e.kind) !== "ready" || !ke.length;
  }
  function ra(b) {
    ft(null), mt(0), Qe(null), oe(b), Ei(b, !!b && !B);
  }
  function Fr() {
    Ae.current || (ol() ? (Ae.current = !0, window.history.back()) : ra(""));
  }
  function xr() {
    const b = Ae.current;
    Ae.current = !1;
    let q = qs();
    q && !be.current && !K.current.some((z) => z.id === q) && (q = "", Ei(""));
    const $ = A.current;
    q !== $ && (mt(0), b || Qe(null), !q && $ && (dt.current ?? (dt.current = { reviewId: $ }))), oe(q);
  }
  function It() {
    dt.current = "heading", Qe(null), Fr();
  }
  function Pr(b) {
    b !== k && ra(b), mt((q) => q + 1);
  }
  function hl() {
    Qe(null), Dt({
      review: ul("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function ml(b) {
    if (fn || !C) return;
    Qe(null);
    const q = crypto.randomUUID();
    let $;
    const z = k;
    ze(!0);
    try {
      if (!await aa((ae) => ($ = gd(
        ae.find((te) => te.id === b.id) ?? b,
        ae,
        q
      ), [...ae, $]))) throw new Error("Could not save reviews.");
      if (!qe.current) return;
      A.current !== z ? Qe({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : Pr($.id);
    } catch (ee) {
      Qe({
        text: `“${b.name}” was not duplicated. ${Ma(ee)}`,
        alert: !0
      });
    } finally {
      ze(!1);
    }
  }
  async function gl() {
    if (!St || St.saving) return;
    const b = { ...St.review, name: St.review.name.trim() }, q = pa(b);
    if (q) {
      Dt({ ...St, error: q });
      return;
    }
    Dt({ ...St, saving: !0, error: "" });
    try {
      if (!await aa(($) => [...$, b]))
        throw new Error("Could not save reviews.");
      if (!qe.current) return;
      Dt(null), Pr(b.id);
    } catch ($) {
      Dt(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!nt || nt.pending) return;
    const b = nt.review, q = dl(t, X, Je, Pt).map((ee) => ee.id), $ = q.filter((ee) => ee !== b.id), z = $[Math.min(q.indexOf(b.id), $.length - 1)];
    un({ review: b, pending: !0 });
    try {
      if (!await aa((ee) => ee.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      dt.current = b.id !== k && z ? { reviewId: z } : "heading", Qe({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (ee) {
      Qe({ text: `“${b.name}” was not deleted. ${Ma(ee)}`, alert: !0 });
    } finally {
      un(null);
    }
  }
  async function yl(b) {
    if (!(fn || !C)) {
      Qe(null), We(!0);
      try {
        const q = await af(b);
        let $ = 0;
        if (q.length && !await aa((ee) => {
          const ae = Ai(ee, q);
          return $ = ae.length - ee.length, $ ? ae : ee;
        }))
          throw new Error("Could not save reviews.");
        const z = q.length - $;
        Qe({
          alert: !1,
          text: q.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Qe({ alert: !0, text: `Could not import “${b.name}”. ${Ma(q)}` });
      } finally {
        We(!1);
      }
    }
  }
  function Ma(b) {
    return b instanceof Hs ? "Reviews changed in another browser. Reload the page to get them, then try again." : b instanceof Error ? b.message : "Try again.";
  }
  function Ro(b) {
    const q = !C || fn;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(Fs, { "aria-hidden": "true" }),
        disabled: q,
        onSelect: () => void ml(b)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(js, { "aria-hidden": "true" }),
        onSelect: () => yo(b)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(Za, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Qe(null), un({ review: b, pending: !1 });
        }
      }
    ];
  }
  function $o(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || tt
      },
      ...Ro(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ya, { "aria-hidden": "true" }),
        separated: !0,
        disabled: tt,
        onSelect: It
      }
    ];
  }
  async function aa(b) {
    if (!i) return !1;
    let q = [];
    const $ = await Rd(i, (te) => {
      q = te;
      const ct = b(te);
      return ct === te ? te : ct.map(Mp);
    });
    if (n($), !qe.current) return !0;
    const z = A.current;
    z && !$.some((te) => te.id === z) && Fr();
    const ee = q.find((te) => te.id === z), ae = $.find((te) => te.id === z);
    return ae && ee && ((ae.view.reviewMode ?? "single") !== (ee.view.reviewMode ?? "single") && ft(null), ae.view.displayMode !== ee.view.displayMode && sr(vs(ae))), !0;
  }
  function ci(b) {
    return aa((q) => Op(q, b));
  }
  function wl(b) {
    return ci(b).catch((q) => {
      throw A.current !== b.id && li(b, q), q;
    });
  }
  function li(b, q) {
    var z;
    if (!qe.current) return;
    const $ = ((z = K.current.find((ee) => ee.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Qe({ text: `“${$}” was not saved. ${Ma(q)}`, alert: !0 });
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
            (b) => f(
              "Could not export browser reviews. " + (b instanceof Error ? b.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        Es,
        {
          message: d,
          onRetry: () => void Oa()
        }
      )
    ] });
  const di = /* @__PURE__ */ u(pe, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    jt && (_e == null ? void 0 : _e.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      _e.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Cr,
          onClick: () => {
            lr(!0), Wt(""), (Ve ? Kd(kt) : Bd(kt)).then(dr).catch(
              (b) => Wt(
                `Could not create the ${Ve ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => lr(!1));
          },
          children: Cr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    jt && ((_e == null ? void 0 : _e.kind) === "incompatible" || ka) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(xn, {}),
      ka || (_e == null ? void 0 : _e.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Cr,
          onClick: () => {
            lr(!0), dr().finally(
              () => lr(!1)
            );
          },
          children: Cr ? "Checking…" : "Check again"
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
            ), $ = document.createElement("a");
            $.href = q, $.download = "data-quality-unassigned-legacy-reviews.json", $.click(), URL.revokeObjectURL(q);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    G && /* @__PURE__ */ u("p", { role: "alert", children: [
      G,
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
    Ce && (Ce.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
      Ce.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Ce.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: Un,
      className: `data-quality-page${On ? " dq-page-fit" : ""}`,
      style: On ? {
        "--dq-fit-top": `${Ca.top}px`,
        "--dq-fit-bottom": `${Ca.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Ce && !Ce.alert ? Ce.text : "" }),
        B && rt ? /* @__PURE__ */ a(
          gp,
          {
            review: le ?? B,
            canWrite: ar ? y : rn,
            canAssess: (_e == null ? void 0 : _e.kind) === "ready" && rn,
            onBusy: kr,
            editRequest: Ot,
            onEditRequestHandled: () => mt(0),
            onSaveDefaults: C ? wl : void 0,
            pageControls: {
              onBack: It,
              moreItems: (b) => $o(le ?? B, b),
              onGrid: ie ? () => ft({ id: ie.id, mode: "multiple" }) : void 0,
              notices: di,
              busy: tt
            },
            stayOnTap: nr,
            onStayOnTapChange: pn
          },
          B.id
        ) : B ? Cl(B) : /* @__PURE__ */ a(
          Np,
          {
            reviews: t,
            counts: X,
            sort: Je,
            direction: Pt,
            onSortChange: (b) => Lt({ sort: b }),
            onDirectionChange: (b) => Lt({ direction: b }),
            storage: Sp[x],
            canConfigure: C,
            busy: fn,
            headingRef: Nt,
            notices: di,
            onOpen: ra,
            onNew: () => hl(),
            onImport: (b) => void yl(b),
            onExportAll: () => xc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Kr, { "aria-hidden": "true" }),
                disabled: !C || fn,
                onSelect: () => Pr(b.id)
              },
              ...Ro(b)
            ]
          }
        ),
        yt && de && ie && /* @__PURE__ */ a(
          Lp,
          {
            video: de,
            review: ie,
            details: rp(de, ie, j.ids),
            selectedCount: At.size,
            pending: Me,
            refreshing: ge || !!Ie,
            error: Zr,
            canWrite: l,
            assessmentReady: (_e == null ? void 0 : _e.kind) === "ready",
            trees: $r,
            selected: At.has(de.id),
            hasPrevious: S.indexOf(de.id) > 0,
            hasNext: S.indexOf(de.id) >= 0 && S.indexOf(de.id) < S.length - 1,
            onToggleSelected: () => Ct((b) => Ba(b, de.id)),
            onPrevious: () => kn(-1),
            onNext: () => kn(1),
            onClose: () => {
              Jt(!1), Oe(bt.current);
            },
            onAction: yn,
            findOpen: Bt,
            onFindOpenChange: qn
          }
        ),
        Bt && B && !rt && !yt && /* @__PURE__ */ a(
          go,
          {
            actions: B.actions,
            tagGroups: E,
            trees: $r,
            isDisabled: na,
            onApply: (b, q) => {
              qn(!1), yn(b, q);
            },
            onClose: () => qn(!1)
          }
        ),
        St && /* @__PURE__ */ a(
          qp,
          {
            draft: St,
            onChange: (b) => Dt((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void gl(),
            onCancel: () => Dt(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!nt,
            title: "Delete review?",
            message: nt ? `“${nt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (nt == null ? void 0 : nt.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => un((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function Fa(b, q, $ = !1, z = !0) {
    const ee = bt.current, ae = Math.max(0, S.indexOf(ee ?? -1));
    try {
      const te = g(
        b,
        q,
        $,
        b.view.selectAllOnLoad === !0
      ), ct = Yt.current, Be = await te;
      if (ct !== Yt.current) return;
      const it = Be.items.map((Xt) => Xt.id);
      an(
        (Xt) => new Set([...Xt].filter((Rt) => it.includes(Rt)))
      );
      const lt = _o(it, ee, ae);
      Ye(lt), z && !Qt.current && Oe(lt, !1);
    } catch {
    }
  }
  function vl(b) {
    const q = I.current;
    if (I.current = null, Fn || !B || !le) return;
    const $ = q ?? B.view.objectFilter, z = Zn(
      $,
      le.view.objectFilter
    ) ? le.view.objectFilter : $, ee = tn({ ...b, page: 1 }), ae = {
      ...B,
      view: {
        ...B.view,
        filter: ee,
        objectFilter: z
      }
    }, te = !ws(ae, le), ct = te ? ae : le;
    ut(te ? ae : null), Ke(te ? "" : "Review queue defaults restored."), Fa(ct, ee, ct.view.startFrom !== "beginning");
  }
  function Nl() {
    if (Me || ge || ht || !le) return;
    I.current = null;
    const b = tn({
      ...le.view.filter,
      page: 1
    });
    ut(null), Ke("Review queue defaults restored."), Fa(
      le,
      b,
      le.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (Me || ge || Ie || ht || !B || !Kn || !C)
      return;
    const b = B, q = Kn;
    Yr(!0), ci(q).then(($) => {
      !$ || A.current !== q.id || (ut(ys(q, b)), Ke("Queue saved to this review."));
    }).catch(($) => {
      A.current !== q.id ? li(q, $) : xt($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Yr(!1));
  }
  function ui() {
    if (!B || !le || Sn.current || he || Xe) return;
    mn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, hn.current = {
      temporaryReview: Pe,
      filter: H,
      loadedFilter: fe,
      queue: Ne,
      queueError: Ie,
      retryFromEnd: Qr,
      selectedIds: new Set(At),
      focusedId: Le,
      pageCursor: Bn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...le,
      view: { ...le.view, startFrom: B.view.startFrom ?? "end" }
    });
    qn(!1), Jt(!1), Ke(""), xt(""), Gt({ draft: b, saving: !1, error: "" });
  }
  function Oo() {
    Gt(null), hn.current = null;
    const b = mn.current;
    mn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : Oe(bt.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!he || he.saving) return;
    const b = hn.current;
    b && (Yt.current += 1, (q = bn.current) == null || q.abort(), I.current = null, Ft(!1), ut(b.temporaryReview), Se(b.filter), Ee(b.loadedFilter), st(b.queue), ir(b.queueError), Wr(b.retryFromEnd), Ct(() => b.selectedIds), Ye(b.focusedId), Bn.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Oo();
  }
  async function kl() {
    if (!he || he.saving || !on || !B) return;
    const b = B, q = { ...on, name: on.name.trim() }, $ = pa(q);
    if ($) {
      Gt((z) => z && { ...z, error: $ });
      return;
    }
    Gt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await ci(q)) throw new Error("Could not save reviews.");
      if (!qe.current || A.current !== q.id) return;
      ut(ys(q, b)), De(q) === "video" && la(q.id, {
        filter: H,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), Ke("Review saved."), Oo();
    } catch (z) {
      if (A.current !== q.id) {
        li(q, z);
        return;
      }
      Gt(
        (ee) => ee && {
          ...ee,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (z instanceof Error ? z.message : "Retry saving.")
        }
      );
    }
  }
  function Mo() {
    B && g(B, H, Qr, Nn).catch(() => {
    });
  }
  function El() {
    an(/* @__PURE__ */ new Set()), gt.current.clear(), Ye(null);
  }
  function Al(b) {
    !B || Me || ht || b === Number(H.page) || $p(
      { ...H, page: b },
      B,
      (q, $) => g(q, $, !1, Nn),
      El
    );
  }
  function Fo(b) {
    if (!ie || !le || Me || ge || ht) return;
    const q = il(ie, b, le.view.objectFilter), $ = !ws(q, le);
    ut($ ? q : null), $ ? Fa(q, { ...H, page: 1 }) : Fa(
      le,
      { ...H, page: 1 },
      le.view.startFrom !== "beginning"
    );
  }
  function Cl(b) {
    var Be, it, lt, Xt, Rt;
    const q = $e === "tag", $ = q ? "tag" : "video", z = Math.max(1, Number(H.perPage) || 40), ee = Math.max(1, Math.ceil(Ne.totalCount / z)), ae = Math.min(Math.max(1, Number(H.page) || 1), ee), te = [
      Ht ? "" : `${jn} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), ct = !!Zr && !yt;
    return /* @__PURE__ */ u(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": q ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Dc,
            {
              name: b.name,
              description: b.description,
              entityType: $e,
              onBack: It,
              backDisabled: Me || !!he || tt,
              onEdit: he ? () => {
                var Fe;
                return (Fe = rr.current) == null ? void 0 : Fe.focus();
              } : ui,
              editDisabled: !he && (Me || ge || In || Xe || tt || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Fn, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  da,
                  {
                    filter: Ie ? fe : H,
                    onFilterChange: vl,
                    totalCount: Ne.totalCount,
                    sortOptions: q ? Gl : Is,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: gn,
                    zoomLevel: (cr - 225) / 50,
                    onZoomChange: (Fe) => Sa(Math.round(225 + Fe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : Xa,
                    customFieldEntityType: $e === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: $a,
                    onObjectFilterChange: (Fe) => {
                      Fn || (I.current = $e === "video" ? Uc(
                        Fe,
                        Tr,
                        b.view.objectFilter
                      ) : Fe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_c, { page: ae, pages: ee, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(pe, { children: [
                ie && /* @__PURE__ */ a(
                  jc,
                  {
                    mode: "multiple",
                    disabled: Me || ge || _t || !!he || Xe || tt,
                    onChange: () => ft({ id: ie.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  yf,
                  {
                    options: q ? Cp : Ap,
                    value: gn,
                    onChange: (Fe) => sr(Ns(Fe, $e))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                wo,
                {
                  disabled: Me || !!he,
                  items: $o(le ?? b, {
                    onSelect: ui,
                    disabled: ge || In || Xe || !C
                  })
                }
              ),
              queueDiffers: Y ? (Pe == null ? void 0 : Pe.id) === k : void 0,
              queueChange: !he && (Pe == null ? void 0 : Pe.id) === k ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: ea ? ql : void 0,
                saveDisabled: Me || ge || !!Ie || ht || !C,
                onReset: Nl,
                resetDisabled: Me || ge || ht
              } : void 0,
              chipsAfter: (it = (Be = ie == null ? void 0 : ie.presentation) == null ? void 0 : Be.binParents) != null && it.length || (Xt = (lt = ie == null ? void 0 : ie.presentation) == null ? void 0 : lt.filterBins) != null && Xt.length ? /* @__PURE__ */ u(pe, { children: [
                !!((Rt = ie.presentation.binParents) != null && Rt.length) && /* @__PURE__ */ a(
                  ap,
                  {
                    videos: Ne.items,
                    review: ie,
                    savedObjectFilter: (le ?? ie).view.objectFilter,
                    trees: j.ids,
                    disabled: Me || ge || ht,
                    onToggle: Fo
                  }
                ),
                /* @__PURE__ */ a(
                  ip,
                  {
                    review: ie,
                    savedObjectFilter: (le ?? ie).view.objectFilter,
                    queueFilter: H,
                    queueCount: ge || Ie ? null : Ne.totalCount,
                    disabled: Me || ge || ht,
                    countsPaused: Me || ge || ht || !Y,
                    onToggle: Fo
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          di,
          ie && j.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: j.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && on && /* @__PURE__ */ a(
              Lc,
              {
                drawerRef: rr,
                draft: on,
                onChange: (Fe) => Gt((sn) => sn && { ...sn, draft: Fe }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (Fe) => Gt(
                  (sn) => sn && {
                    ...sn,
                    draft: { ...sn.draft, view: { ...sn.draft.view, startFrom: Fe } }
                  }
                ),
                tagGroups: E,
                trees: $r,
                saving: he.saving,
                saveDisabled: ge || !!Ie,
                error: he.error,
                dirty: Ra,
                criteriaChanged: ea,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Ie && !ge ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Ie,
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
                style: { "--dq-dock-height": `${Ta}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ge && !Ne.items.length && /* @__PURE__ */ a(ks, { label: "Loading review queue…" }),
                    Ie && !ge && /* @__PURE__ */ a(
                      Es,
                      {
                        message: Ie,
                        retryLabel: In ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (In && le && De(le) === "video") {
                            const Fe = wr(le);
                            la(le.id, { ...Fe, filter: { ...Fe.filter, page: void 0 } }), Vt((sn) => sn + 1);
                            return;
                          }
                          Mo();
                        }
                      }
                    ),
                    !Me && !ge && !Ie && !Ne.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ei, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!Ne.items.length && /* @__PURE__ */ a("div", { ref: Aa, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: gn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${cr}px` },
                        children: Ne.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Ia, children: /* @__PURE__ */ a(
                    Cc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: E,
                      trees: $r,
                      isDisabled: na,
                      paused: !!he,
                      busy: Me || ge,
                      onApply: (Fe) => void yn(Fe),
                      onFind: () => qn(!0),
                      status: Me ? `Applying action to ${Xr}…` : "",
                      summary: /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: At.size ? `${At.size} selected` : Le == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !S.length || at,
                            onClick: () => Ct((Fe) => /* @__PURE__ */ new Set([...Fe, ...S])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(vt, { binding: ta.selectAll, hidden: !0 })
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
                            onClick: () => Ct(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(vt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: te.length ? te.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: ct || Rn ? /* @__PURE__ */ u(pe, { children: [
                        ct && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                          Zr
                        ] }),
                        Rn && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: Rn })
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
  function Tl(b) {
    var $, z, ee;
    if ($e === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Fp,
        {
          tag: ae,
          displayMode: gn === "list" ? "list" : "grid",
          focused: ae.id === Le,
          selected: At.has(ae.id),
          setRef: (te) => {
            te ? $n.current.set(ae.id, te) : $n.current.delete(ae.id);
          },
          onFocus: () => Ye(ae.id),
          onToggle: () => {
            Ct((te) => Ba(te, ae.id)), Oe(ae.id, !1);
          },
          onOpen: () => window.open(`/tag/${ae.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ae.id
      );
    }
    const q = b;
    return /* @__PURE__ */ a(
      xp,
      {
        video: rl(q, ie, j.ids),
        showTagBins: ((z = ($ = ie == null ? void 0 : ie.presentation) == null ? void 0 : $.annotations) == null ? void 0 : z.includes("tags")) && !!((ee = ie.presentation.annotationParents) != null && ee.length),
        displayMode: gn,
        cardsScroll: oi,
        focused: q.id === Le,
        selected: At.has(q.id),
        setRef: (ae) => {
          ae ? $n.current.set(q.id, ae) : $n.current.delete(q.id);
        },
        onFocus: () => Ye(q.id),
        onToggle: () => Ct((ae) => Ba(ae, q.id)),
        onPreview: () => {
          he || (Ye(q.id), Jt(!0));
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
function Ba(e, t) {
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
  return $t(() => {
    const E = p.current;
    if (!E) return;
    const O = E.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = E.querySelector(".card-title"), U = `dq-card-title-${e.id}`;
    F && (F.id = U), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", U), O.classList.add("dq-card-link"));
    const C = E.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${h}` : `Select ${h}`
    );
    const L = E.querySelector(
      'button[title="Quick View"]'
    );
    L && L.setAttribute("aria-label", `Preview ${h}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (E) => {
        p.current = E, s(E);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${h}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (E) => {
        c(), E.currentTarget.focus({ preventScroll: !0 });
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
          (v = e.tags) == null ? void 0 : v.map((E) => /* @__PURE__ */ a("span", { children: E.name }, E.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Pp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Pp({ video: e, cardsScroll: t }) {
  const n = R(null), r = R(null), [i, o] = T(!1), [s, c] = T(!1), [d, f] = T(!1);
  return Z(() => {
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
  }, [e.id, e.files.length, t]), Z(() => {
    if (!i) {
      f(!1);
      return;
    }
    const l = new AbortController();
    return ye(jd(e.id), {
      signal: l.signal
    }).then((h) => {
      l.signal.aborted || f(h.available === !0);
    }).catch(() => {
      l.signal.aborted || f(!1);
    }), () => l.abort();
  }, [i, e.id]), Z(() => {
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
  findOpen: E,
  onFindOpenChange: O
}) {
  const F = R(null), U = qa(), C = R(null), L = R(null), x = e.files[0], ne = fl(e), J = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || Yn(P) && !d;
  po({
    surface: "overlay",
    enabled: !E,
    actions: t.actions,
    onAction: (P, Y) => {
      const W = t.actions[P];
      W && w(W, Y);
    },
    onFind: () => O(!0)
  }), Z(() => {
    var Y;
    const P = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = F.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = P;
    };
  }, []);
  function _(P) {
    var re, Q, k;
    if (P.key !== "Tab") return;
    const Y = [
      ...((re = F.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((oe) => oe.offsetParent !== null);
    if (!Y.length) {
      P.preventDefault(), (Q = F.current) == null || Q.focus();
      return;
    }
    const W = Y.indexOf(
      document.activeElement
    );
    P.shiftKey && W <= 0 ? (P.preventDefault(), (k = Y.at(-1)) == null || k.focus()) : !P.shiftKey && W === Y.length - 1 && (P.preventDefault(), Y[0].focus());
  }
  function G(P) {
    if (E || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = P.key === "ArrowLeft" || P.key === "ArrowRight";
    if (P.altKey && !Y) return;
    const W = C.current, re = P.currentTarget.querySelector("video");
    if (P.key === "Enter" || P.key === "Escape")
      P.repeat || v();
    else if (P.key === " " && W)
      P.repeat || W.toggle();
    else if (Y && W)
      W.seekBy(
        (P.key === "ArrowLeft" ? -1 : 1) * (P.shiftKey ? 5 : P.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(P.key) && W) {
      const Q = L.current;
      if (!P.repeat && (Q == null ? void 0 : Q.videoId) === e.id) {
        const k = [x == null ? void 0 : x.duration, re == null ? void 0 : re.duration].find(
          (ce) => ce != null && Number.isFinite(ce) && ce > 0
        ) ?? 0, oe = e.parentVideoId != null, A = oe ? e.clipStartSec ?? 0 : 0, X = (oe ? e.clipEndSec ?? k : k) - A;
        Number.isFinite(X) && X > 0 && Number.isFinite(Q.time) && W.seekBy(A + X * Number(P.key) / 10 - Q.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && h && y(), P.key === "ArrowDown" && p && N());
    else return;
    Dr(P);
  }
  function M(P) {
    const Y = F.current, W = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !Y || !W || !Y.contains(W) || W.closest(".dq-player, .dq-find-action") || P.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  Z(() => {
    if (E) return;
    let P = 0;
    const Y = requestAnimationFrame(() => {
      P = requestAnimationFrame(() => {
        var re;
        const W = document.activeElement;
        (re = F.current) != null && re.isConnected && (!W || W === document.body || W === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(P);
    };
  }, [E, i, o, p, h, e.id, U]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ne}`,
      className: `dq-preview${U ? " dq-preview-mobile" : ""}`,
      onKeyDown: _,
      onKeyDownCapture: G,
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
                  !U && /* @__PURE__ */ a(vt, { binding: "↑", hidden: !0 })
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
                  !U && /* @__PURE__ */ a(vt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ds, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ u("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ne }),
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
                "aria-label": `Open ${ne} in a new tab`,
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
              streamUrl: Ri("video", e.id),
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
          !U && /* @__PURE__ */ u("p", { className: "dq-preview-hints", children: [
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
              isDisabled: J,
              busy: i || o,
              onApply: (P) => void w(P),
              onFind: () => O(!0),
              status: i ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        E && /* @__PURE__ */ a(
          go,
          {
            actions: t.actions,
            trees: f,
            isDisabled: J,
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
async function Dp() {
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
    /* @__PURE__ */ a(xn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Vp = { components: { DataQualityPage: Rp } };
export {
  Rp as DataQualityPage,
  Vp as default,
  Zn as objectFiltersEqual
};
