import { jsxs as l, Fragment as le, jsx as a } from "react/jsx-runtime";
import { useState as I, useRef as $, useEffect as X, useLayoutEffect as Et, useMemo as ye, useCallback as Tn, useSyncExternalStore as Hi, useId as Ze, createContext as Ml, useContext as Fl, Fragment as Ji } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as tr, SortableList as As, TagBadge as Pl, EntityReferenceSelector as Lo, EntityDetailTabs as Ll, FilterDialog as Cs, VIDEO_CRITERIA as Qa, DetailListToolbar as ua, PERFORMER_CRITERIA as Wi, AUDIO_CRITERIA as Ts, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as Is, AudioPlayer as jl, VideoPlayer as Rs, formatDuration as $s, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as ga, Flag as Dn, Check as zr, Pencil as Gr, Ban as Ka, ChevronDown as Qi, Plus as ba, Pin as Os, GripVertical as Ms, AlertTriangle as Pn, Copy as Fs, Trash2 as Ya, X as ya, Mic as Hl, Users as xs, Tag as Ps, Headphones as Ls, Film as Xa, ChevronLeft as wa, MoreHorizontal as Jl, RectangleHorizontal as Wl, LayoutGrid as Yi, ChevronRight as Ds, Save as Ql, RotateCcw as Yl, Layers as Do, Undo2 as Xl, RefreshCw as Zl, ExternalLink as _s, SkipForward as ed, Upload as td, Download as js, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
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
function fa(e) {
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
  for (const c of t)
    o.some(
      (s) => s.tagId === c.tagId && s.categoryTagId === c.categoryTagId
    ) || o.push(
      c.categoryTagId === void 0 ? { tagId: c.tagId } : { tagId: c.tagId, categoryTagId: c.categoryTagId }
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
function $e(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function to(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Be(e) {
  return to(je(e));
}
function dd(e) {
  return je(e) === "video";
}
function je(e) {
  return e.entityType ?? "video";
}
const Xn = [
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
], Za = [
  Xn.slice(0, 11),
  Xn.slice(11, 22),
  Xn.slice(22)
];
function la(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function pa(e) {
  return la(e) ?? e.toLocaleUpperCase();
}
const Zn = "none";
function qr(e) {
  return typeof e == "string" && Xn.includes(e);
}
function no(e) {
  const t = e.shortcut;
  return qr(t) || t === Zn ? t : "auto";
}
function Ks(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((c, s) => {
    const d = no(c);
    if (d !== Zn) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, s), t[s] = d;
          return;
        }
        r.add(s);
      }
      i.push(s);
    }
  });
  const o = Xn.filter((c) => !n.has(c));
  return i.forEach((c, s) => {
    const d = o[s];
    d !== void 0 && (t[c] = d, n.set(d, c));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = Ks(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (qr(n)) {
    const s = i.get(n), d = r[t];
    s !== void 0 && s !== t && o.set(s, d && e[t].shortcut === d ? d : void 0);
  }
  const c = new Set([...o.values()].filter(qr));
  return e.map((s, d) => {
    const f = o.has(d) ? o.get(d) : qr(s.shortcut) && c.has(s.shortcut) ? void 0 : s.shortcut;
    if (f === s.shortcut) return s;
    const { shortcut: u, ...p } = s;
    return f === void 0 ? p : { ...p, shortcut: f };
  });
}
function ha(e) {
  var n;
  return $e(e) && !Vs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : je(e) !== "tag" && e.actions.some(
    (r) => ro(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => _n(r, je(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
  video: 1e3,
  audio: 250
};
function zt(e, t = "video") {
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
function Yn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    $e(e) ? [e.entityType, ...r, e.occurrence] : je(e) === "video" ? r : [je(e), ...r]
  );
}
function _n(e, t) {
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
function Ln(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function rr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Gs(e) {
  return "steps" in e && e.steps.length > 0;
}
function er(e) {
  return "steps" in e ? e.steps.some((t) => Ln(t.mode)) : !1;
}
function ro(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Ln(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function va(e) {
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
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && _n(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && _n(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => ha(n)))
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
  const n = (s) => s.trim().toLocaleLowerCase(), r = new Set(t.map((s) => n(s.name))), i = e.trim(), o = i.replace(/ copy(?: \d+)?$/i, ""), c = `${o !== i && r.has(n(o)) ? o : i} copy`;
  for (let s = 1; ; s++) {
    const d = s === 1 ? c : `${c} ${s}`;
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
    const c = `${i}:${o ?? ""}`;
    return n.has(c) ? !1 : (n.add(c), !0);
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
function ln(e) {
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
const Na = /* @__PURE__ */ new Map(), Fa = /* @__PURE__ */ new Map(), wr = (e, t) => e.includes("*") || e.includes(t), Ga = (e) => be(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
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
function Dr(e) {
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
    reviews: va(JSON.stringify(t.reviews)),
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
      const c = va(o);
      n ?? (n = c), c.forEach((s) => r.add(s.id));
    }
    Ti(
      JSON.parse(localStorage.getItem(`${i}:account-imports`) ?? "[]")
    ).forEach((c) => r.add(c));
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
function ao(e, t) {
  const n = (Fa.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Fa.set(e, n), n.finally(() => {
    Fa.get(e) === n && Fa.delete(e);
  }).catch(() => {
  }), n;
}
let oa = null;
function Cd() {
  if (oa) return oa;
  const e = Td();
  return oa = e, e.finally(() => {
    oa === e && (oa = null);
  }).catch(() => {
  }), e;
}
async function Td() {
  const e = await be("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return ao(t, () => Id(e, t));
}
async function Id(e, t) {
  var h;
  const n = String(e.user.id), r = wr(e.permissions, "savedfilters.read"), i = r && wr(e.permissions, "savedfilters.write"), o = r ? (await Ga(zs)).filter((m) => m.name === "Data Quality configuration").sort((m, y) => m.id - y.id) : [];
  if (o.length > 1) {
    const m = (y) => {
      const { revision: N, ...v } = Dr(y.uiOptions);
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
  let c = o.length ? Dr(o[0].uiOptions) : Ed();
  const s = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (c = Dr(d));
  let u = !o.length;
  if (o.length && f && d) {
    const m = Dr(d);
    if (m.reviews.some((N) => {
      const v = c.reviews.find((w) => w.id === N.id);
      return v && JSON.stringify(v) !== JSON.stringify(N);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...c.deletedIds, ...m.deletedIds])
    ];
    c = {
      ...c,
      reviews: Ai(c.reviews, m.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...c.importedIds, ...m.importedIds])
      ]
    }, u = !0;
  }
  if (!s) {
    const m = JSON.stringify(c), y = Ad(n);
    if (o.length && y.reviews.some((T) => {
      const R = c.reviews.find((x) => x.id === T.id);
      return R && JSON.stringify(R) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Ga(kd)).flatMap(
      (T) => va(T.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (T) => !y.reviews.some((R) => R.id === T)
    ), w = /* @__PURE__ */ new Set([...c.deletedIds, ...v]);
    c = {
      ...c,
      reviews: Ai(
        y.reviews,
        c.reviews,
        N.filter(
          (T) => !y.known.includes(T.id) && !c.importedIds.includes(T.id)
        )
      ).filter((T) => !w.has(T.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...c.importedIds,
          ...y.known,
          ...N.map((T) => T.id)
        ])
      ]
    }, u || (u = JSON.stringify(c) !== m);
  }
  const p = {
    userId: n,
    recordId: (h = o[0]) == null ? void 0 : h.id,
    config: c,
    readable: r,
    writable: i,
    durable: i
  };
  if (Na.set(t, p), u && i) {
    const m = c;
    o.length && (p.config = Dr(o[0].uiOptions)), await Ws(t, m), c = p.config;
  } else o.length || (localStorage.setItem(t, JSON.stringify(c)), !r && (!s || f) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!r) localStorage.setItem(`${t}:migrated`, "true");
  else if (i)
    try {
      localStorage.setItem(`${t}:migrated`, "true");
    } catch {
    }
  return {
    reviews: c.reviews,
    storageKey: t,
    canWrite: wr(e.permissions, "videos.write"),
    canWriteVideos: wr(e.permissions, "videos.write"),
    canWriteAudios: wr(e.permissions, "audios.write"),
    canWriteTags: wr(e.permissions, "tags.write"),
    canReadTagGroups: wr(e.permissions, "taggroups.read"),
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ws(e, t) {
  const n = Na.get(e);
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
      if (Dr(o.uiOptions).revision !== n.config.revision)
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
  return ao(e, async () => {
    const n = Na.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, i = t(r);
    if (i === r) return r;
    va(JSON.stringify(i));
    const o = r.filter((c) => !i.some((s) => s.id === c.id)).map((c) => c.id);
    return await Ws(e, {
      ...n.config,
      reviews: i,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...o])
      ].filter((c) => !i.some((s) => s.id === c))
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
  const n = Na.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Bo(r) : null;
  if (!n.readable) return i;
  const o = (await Ga(Ci)).find(
    (s) => s.name === t
  ), c = o ? Bo(o.uiOptions) : null;
  return i && (!c || i.updatedAt > c.updatedAt) ? i : c;
}
function Od(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return ao(r, async () => {
    const i = Na.get(e);
    if (!(i != null && i.writable)) return;
    await Js(i);
    const o = (await Ga(Ci)).find(
      (c) => c.name === t
    );
    await be(
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
function ar(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Rn(e) {
  return Md[e];
}
const Va = "confirmed_absent_tags", io = "Confirmed absent tags", ei = "confirmed_absent_occurrence_tags", Qs = {
  key: Va,
  label: io,
  type: "tag",
  subject: "tag assessments"
}, oo = {
  key: ei,
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
function jn(e) {
  return Array.isArray(e) ? e.map(jn) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Va,
        ei
      ].includes(n.toLowerCase()) ? n.toLowerCase() : jn(n)
    ])
  ) : e;
}
async function Ys(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const i = await sd(e, { ...t, headers: r });
  if (i.status === 404 && n === "null") return null;
  if (!i.ok) {
    let c = i.statusText || `Request failed (${i.status}).`;
    try {
      const s = await i.json();
      c = s.message || s.detail || s.error || c;
    } catch {
    }
    throw new Error(c);
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
function za(e, t) {
  return be(
    `/api/${ar(e)}/${t}?dqRead=${Pd}-${++Ld}`,
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
    jn({
      findFilter: zt(t, Be(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function jr(e, t, n) {
  return be(
    `/api/${ar(Be(e))}/find`,
    { method: "POST", signal: n, body: Xs(e, t) }
  );
}
async function Zs(e, t, n) {
  return (await be(
    `/api/${ar(Be(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Xs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function hi(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, be("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      jn({
        findFilter: zt(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return be("/api/taggroups", { signal: e });
}
function Ii(e, t, n = 1280) {
  return `/api/${ar(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
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
function Ud(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function ti(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await be(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await be("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          jn({
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
      for (const c of o.items) n.add(c.id);
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
  const n = rr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ti(i.tagIds, t)).filter(
          (o) => !n.has(o)
        )
      } : i
    )
  )).filter((i) => i.tagIds.length > 0);
}
function Bd(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function co(e, t) {
  const r = (await be("/api/custom-fields")).find(
    (o) => o.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const i = Bd(e, r);
  return i ? { kind: "incompatible", message: i } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Rn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function ec(e, t) {
  const n = await co(e, t);
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
  return co(Qs, e);
}
function Kd(e = "video") {
  return ec(Qs, e);
}
function nc(e = "video") {
  return co(oo, e);
}
function Gd(e = "video") {
  return ec(oo, e);
}
function Ha(e) {
  return [...new Set(e)];
}
function rc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ei
  ), i = r === void 0 ? [] : n[r];
  return Ha(
    (Array.isArray(i) ? i : []).filter(
      (o) => typeof o == "string" && /^[1-9]\d*:[1-9]\d*$/.test(o)
    ).map((o) => o.split(":").map(Number)).filter(([o]) => o === t).map(([, o]) => o)
  );
}
async function Vd(e) {
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
async function zd(e, t, n, r, i, o) {
  await be(`/api/${ar(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ha(i).map((c) => `${r}:${c}`)
      },
      customFieldMode: o
    })
  });
}
function Hd(e, t, n) {
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
  if (!_n(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Rn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (er(t)) {
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
  const i = Ha(n), o = (await so(t)).map((d) => ({
    mode: d.mode,
    tagIds: Ha(d.tagIds)
  })), s = [
    ...o.filter((d) => !Ln(d.mode)),
    ...o.filter((d) => Ln(d.mode))
  ].map(
    (d) => Hd(d, i, r)
  );
  for (let d = 0; d < s.length; d++)
    try {
      await be(`/api/${ar(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(s[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Rn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Jd(e, t) {
  if (!_n(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await be("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const xa = (e) => e >= "0" && e <= "9";
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
    if (xa(e[n]) && xa(t[r])) {
      const s = n, d = r;
      for (; n < e.length && xa(e[n]); ) n++;
      for (; r < t.length && xa(t[r]); ) r++;
      const f = e.slice(s, n).replace(/^0+/, ""), u = t.slice(d, r).replace(/^0+/, "");
      if (f.length !== u.length) return f.length < u.length ? -1 : 1;
      if (f !== u) return f < u ? -1 : 1;
      continue;
    }
    const o = Go(e[n]), c = Go(t[r]);
    if (o !== c) return o < c ? -1 : 1;
    n++, r++;
  }
  const i = e.length - n - (t.length - r);
  return i !== 0 ? i < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function ic(e, t) {
  const n = (i) => i.tagGroupId != null ? 0 : 1, r = (i) => i.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Vo(e.tagGroupName, t.tagGroupName) || Vo(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function Sr(e) {
  return [...e].sort(ic);
}
const $i = /* @__PURE__ */ new Map();
function Wd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((i) => t.add(i));
  return [...t];
}
function lo(e, t, n) {
  const r = rr(e), i = [], o = [];
  for (const h of e.steps) {
    if (h.mode !== "REMOVE_TREE") {
      o.push(h);
      continue;
    }
    const m = h.tagIds.flatMap((y) => {
      const N = n.get(y);
      return N || i.push(y), N ?? [y];
    });
    o.push({ mode: "REMOVE", tagIds: m.filter((y) => !r.has(y)) });
  }
  const c = [
    ...o.filter((h) => !Ln(h.mode)),
    ...o.filter((h) => Ln(h.mode))
  ], s = new Set(t.ids), d = new Set(t.absent);
  for (const h of c)
    for (const m of h.tagIds)
      switch (h.mode) {
        case "ADD":
          s.add(m);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          s.delete(m);
          break;
        case "MARK_PRESENT":
          s.add(m), d.delete(m);
          break;
        case "MARK_ABSENT":
          s.delete(m), d.add(m);
          break;
        case "CLEAR_ABSENCE":
          d.delete(m);
          break;
      }
  const f = new Set(t.ids), u = new Set(t.absent), p = [...new Set(e.steps.flatMap((h) => h.tagIds))];
  return {
    added: p.filter((h) => s.has(h) && !f.has(h)),
    removed: [...f].filter((h) => !s.has(h)),
    markedAbsent: p.filter((h) => d.has(h) && !u.has(h)),
    absenceCleared: [...u].filter((h) => !d.has(h)),
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
  return Sr(t);
}
function oc(e) {
  return sc(Wd(e));
}
function sc(e) {
  const t = [...new Set(e)].sort((c, s) => c - s).join(","), [n, r] = I(() => /* @__PURE__ */ new Map()), i = $(/* @__PURE__ */ new Set()), o = $(!0);
  return X(() => (o.current = !0, () => {
    o.current = !1;
  }), []), X(() => {
    const c = t ? t.split(",").map(Number) : [];
    for (const s of c)
      i.current.has(s) || (i.current.add(s), ti([s]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(s, d));
        },
        () => {
          i.current.delete(s);
        }
      ));
  }, [t]), n;
}
function vt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Er(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const i = vt(n.group);
    if (!i) return;
    const o = t.get(i);
    o ? o.actions.push(r) : t.set(i, { key: i, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function zo(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => vt(t.group) !== "");
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
  return rr(e).size > 0 || lc(e).size > 0;
}
function Yd(e) {
  return Er(e).filter(
    (t) => !t.actions.some((n) => dc(e[n]))
  );
}
function Oi(e, t) {
  const n = cc(t), r = new Set(t.absent);
  return Er(e).map((i) => {
    const o = [], c = [];
    for (const s of i.actions) {
      const d = [...rr(e[s])], f = [...lc(e[s])], u = [
        ...d.map((p) => n.has(p)),
        ...f.map((p) => r.has(p))
      ];
      u.some(Boolean) && (c.push(s), u.every(Boolean) && o.push(s));
    }
    return { ...i, answers: o.length ? o : c };
  });
}
function Mi(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Xd(e, t, n) {
  const r = { ids: [...cc(t)], absent: t.absent }, i = lo(e, r, n), o = new Set(i.removed), c = new Set(i.absenceCleared);
  return {
    ids: [...r.ids.filter((s) => !o.has(s)), ...i.added],
    absent: [...r.absent.filter((s) => !c.has(s)), ...i.markedAbsent]
  };
}
const Ur = "review";
function Zd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function eu(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function vr(e, t) {
  const n = new Set(Zd(e));
  return t.filter((r) => n.has(r.id));
}
function Ho(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (c, s) => {
    const d = r.get(c) ?? s();
    return r.set(c, d), d;
  };
  for (const c of vr(e, t))
    for (const s of e) {
      if (s.tagId !== c.id) continue;
      const d = s.categoryTagId === void 0 ? i(Ur, () => ({
        key: Ur,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${s.categoryTagId}`, () => {
        const { name: f, tagIds: u, resolved: p } = n(s.categoryTagId);
        return {
          key: `tag:${s.categoryTagId}`,
          name: f,
          tagIds: u,
          flags: [],
          mixed: [],
          ...p ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(c.name) || d.flags.push(c.name);
    }
  const o = [...r.values()];
  return [
    ...o.filter((c) => c.key === Ur),
    ...o.filter((c) => c.key !== Ur)
  ];
}
function Fi(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function uo(e) {
  const t = e.flatMap((i) => i.mixed), n = (i, o) => t.some(
    (c, s) => Fi(c.key, c.members, i) && !(s > o && Fi(i.key, i.members, c))
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
function tu(e, t) {
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
    ...n.filter((r) => r.key === Ur),
    ...n.filter((r) => r.key !== Ur)
  ];
}
function nu(e, t) {
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
  const r = nu(e, n);
  return t.tagIds.some((i) => r.has(i));
}
function ru(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((i) => fc(i, r, n))
  );
}
function au(e, t, n) {
  return t.filter((r) => r.tagIds !== null && fc(e, r, n));
}
function iu(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function fo(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [iu(e.mixed)] : []
  ];
}
function ou(e) {
  const t = fo(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function su(e, t, n) {
  const r = vr(e, t).map((i) => {
    const o = e.filter((s) => s.tagId === i.id);
    if (o.every((s) => s.categoryTagId === void 0)) return i.name;
    const c = o.map(
      (s) => s.categoryTagId === void 0 ? "whole review" : n(s.categoryTagId)
    );
    return `${i.name} (affects ${[...new Set(c)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const xi = "-", Jo = "Ctrl+a", cu = "Ctrl/⌘A", lu = ["f", "g", "k", "n", "m", ",", "."], mi = "Shift+", pc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, du = new Set(Object.values(pc).flat()), Wo = { Comma: ",", Period: "." };
function uu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(Wo, t.code) ? Wo[t.code] : void 0;
}
function Hr(e) {
  return ye(() => Ks(e), [e]);
}
function po({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: i,
  onSelectAll: o
}) {
  const c = Hr(n), s = $({ keyMap: c, onAction: r, onFind: i, onSelectAll: o });
  Et(() => {
    s.current = { keyMap: c, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, u = Xn.filter(
    (h) => c.actionOn.has(h) || lu.includes(h)
  ).join(" "), p = ye(() => {
    const h = (N, v) => {
      var T, R;
      const w = s.current;
      if (N === Jo) (T = w.onSelectAll) == null || T.call(w);
      else if (N === xi) (R = w.onFind) == null || R.call(w);
      else {
        const x = du.has(N), K = x || N.startsWith(mi), E = x ? uu(v) : K ? N.slice(mi.length) : N, _ = E === void 0 ? void 0 : w.keyMap.actionOn.get(E);
        _ !== void 0 && w.onAction(_, K);
      }
    }, m = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(m(Jo, "local")), d && y.push(m(xi));
    for (const N of u ? u.split(" ") : []) {
      const v = pc[N];
      y.push(m(N), ...(v ?? [`${mi}${N}`]).map((w) => m(w)));
    }
    return y;
  }, [e, u, d, f]);
  xl(p, t);
}
const fu = {
  find: xi,
  selectAll: cu
};
function ho() {
  return fu;
}
const pu = 600 * 1e3, mo = /* @__PURE__ */ new Map(), hc = /* @__PURE__ */ new Map(), Qn = /* @__PURE__ */ new Map();
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
  if (!(!t || Date.now() - t.at > pu))
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
function hu(e) {
  const t = Qn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: be(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var u, p;
        const o = ((u = i == null ? void 0 : i.name) == null ? void 0 : u.trim()) || null;
        if (Qn.get(e) === r && Qn.delete(e), !o) return null;
        const c = yc({ ...i, id: e, name: o }), s = (p = mo.get(e)) == null ? void 0 : p.tag, d = (s == null ? void 0 : s.tagGroupId) === c.tagGroupId, f = {
          ...c,
          tagGroupSortOrder: c.tagGroupSortOrder ?? (d ? s == null ? void 0 : s.tagGroupSortOrder : void 0),
          hasImage: c.hasImage ?? (s == null ? void 0 : s.hasImage),
          imagePath: c.imagePath ?? (s == null ? void 0 : s.imagePath)
        };
        return gc(f), mc(f);
      },
      () => (Qn.get(e) === r && Qn.delete(e), null)
    )
  };
  return Qn.set(e, r), r;
}
function Qo() {
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
function mu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Qo());
  const n = {}, r = [];
  for (const i of new Set(e)) {
    const o = bc(i);
    if (o !== void 0) n[i] = o;
    else {
      const c = hu(i);
      c.waiters += 1, r.push({ id: i, entry: c });
    }
  }
  return r.length ? new Promise((i, o) => {
    let c = !1;
    const s = () => {
      for (const { id: f, entry: u } of r)
        u.waiters -= 1, u.waiters === 0 && Qn.get(f) === u && (Qn.delete(f), u.controller.abort());
    }, d = () => {
      c || (c = !0, s(), o(Qo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: u }) => u.promise.then((p) => [f, p])
      )
    ).then((f) => {
      if (!c) {
        c = !0, t == null || t.removeEventListener("abort", d), s();
        for (const [u, p] of f) n[u] = p;
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
function qa(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = I(() => ({
    key: t,
    tags: gi(bi(t))
  }));
  return X(() => {
    const i = bi(t), o = gi(i);
    if (r({ key: t, tags: o }), i.every((s) => s in o)) return;
    const c = new AbortController();
    return mu(i, c.signal).then(
      (s) => r({ key: t, tags: s }),
      () => {
      }
    ), () => c.abort();
  }, [t]), n.key === t ? n.tags : gi(bi(t));
}
function Jr(e) {
  const t = qa(e);
  return ye(() => wc(t), [t]);
}
function bi(e) {
  return e ? e.split(",").map(Number) : [];
}
const gu = "(max-width: 760px)";
function vc(e) {
  const [t] = I(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Tn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Hi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Sa() {
  return vc(gu);
}
function bu(e, t, n = !1) {
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
function Cr(e, t, n = [], r) {
  if ("effect" in e) {
    const c = e.effect;
    if (c.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (c.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const s = n.find((d) => d.id === c.tagGroupId);
    return [
      {
        text: s ? `Assign ${s.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const i = rr(e), o = (c) => i.has(c) || [...i].some((s) => {
    var d;
    return (d = r == null ? void 0 : r.get(c)) == null ? void 0 : d.includes(s);
  });
  return e.steps.flatMap(
    (c) => c.tagIds.map(
      (s) => bu(
        c.mode,
        t[s] === void 0 ? "…" : t[s] ?? "Unavailable tag",
        c.mode === "REMOVE_TREE" && o(s)
      )
    )
  );
}
function ni(e) {
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
  onApply: c,
  onClose: s
}) {
  const d = Sa(), [f, u] = I(""), [p, h] = I(0), m = $(null), y = $(null), N = $(null), v = $(null), w = $(null), T = $(/* @__PURE__ */ new Set()), R = Ze(), x = Jr(ye(() => ni(e), [e])), K = Hr(e), E = ye(() => {
    const j = f.trim().toLocaleLowerCase(), z = (O) => O ? Xn.indexOf(O) : Xn.length;
    return e.map((O, D) => ({ action: O, index: D, key: K.keys[D] })).sort((O, D) => z(O.key) - z(D.key)).filter((O) => !j || O.action.label.toLocaleLowerCase().includes(j));
  }, [e, K, f]), _ = E.length ? Math.min(p, E.length - 1) : -1, P = (j) => `${R}-option-${j}`;
  Et(() => {
    var j, z, O;
    return v.current = document.activeElement, w.current = ((z = (j = N.current) == null ? void 0 : j.parentElement) == null ? void 0 : z.closest('[role="dialog"]')) ?? null, (O = m.current) == null || O.focus({ preventScroll: !0 }), () => {
      var L;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((L = w.current) != null && L.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), X(() => {
    var j, z, O;
    _ < 0 || (O = (z = (j = y.current) == null ? void 0 : j.querySelector(`[id="${P(E[_].index)}"]`)) == null ? void 0 : z.scrollIntoView) == null || O.call(z, { block: "nearest" });
  }, [_, E]);
  function se(j, z) {
    !j || r != null && r(j.action) || c(j.action, i && z);
  }
  function H(j) {
    var O;
    j.stopPropagation();
    const z = j.code || j.key;
    if (j.repeat || T.current.add(z), !ln(j)) {
      if (j.repeat && !T.current.has(z)) {
        j.preventDefault();
        return;
      }
      if (j.key === "Escape")
        j.preventDefault(), j.repeat || s();
      else if (j.key === "Enter")
        j.preventDefault(), j.repeat || se(E[_], j.shiftKey);
      else if (j.key === "ArrowDown" || j.key === "ArrowUp") {
        if (j.preventDefault(), !E.length) return;
        const D = j.key === "ArrowDown" ? 1 : -1;
        h((_ + D + E.length) % E.length);
      } else j.key === "Tab" && (j.preventDefault(), (O = m.current) == null || O.focus());
    }
  }
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: s }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: N,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: H,
        onMouseDown: (j) => {
          j.target !== m.current && j.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: m,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${R}-list`,
                "aria-activedescendant": _ >= 0 ? P(E[_].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (j) => {
                  u(j.target.value), h(0);
                }
              }
            ),
            !d && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          E.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${R}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: E.map((j, z) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: P(j.index),
                  tabIndex: -1,
                  "aria-selected": z === _,
                  disabled: (r == null ? void 0 : r(j.action)) ?? !1,
                  onClick: (O) => se(j, O.shiftKey || o && Gs(j.action)),
                  children: [
                    d ? null : j.key ? /* @__PURE__ */ l(le, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": la(j.key) ? !0 : void 0, children: j.key }),
                      la(j.key) && /* @__PURE__ */ l(le, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: la(j.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: j.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Cr(j.action, x, t, n).map(
                      (O, D) => /* @__PURE__ */ a("span", { "data-effect-tone": O.tone, children: O.text }, D)
                    ) })
                  ]
                }
              ) }, j.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            f.trim(),
            "”."
          ] }),
          !d && /* @__PURE__ */ l("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies"
            ] }),
            i && /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ a("kbd", { children: "Shift" }),
              /* @__PURE__ */ a("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ l("span", { children: [
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
  const n = $(t);
  Et(() => {
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
const yu = [], Li = Za.map(
  (e, t) => ({ indent: t, keys: e })
), Yo = Li.length - 1;
function Nt({ binding: e, hidden: t }) {
  const n = t ? void 0 : la(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ l(le, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function Pa(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kc(e) {
  return Za.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function Ec({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(le, { children: r.map((i, o) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
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
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: r,
      children: [
        /* @__PURE__ */ l("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
          "Find"
        ] }),
        e > 0 && /* @__PURE__ */ l("span", { className: "dq-mobile-more", children: [
          e,
          " more"
        ] })
      ]
    }
  );
}
function wu({
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
        const o = t ? i.answers : null, c = o ? o.length ? "answered" : "open" : "unknown", s = o == null ? void 0 : o.map((u) => n[u].label).join(", "), d = r(i), f = c === "answered" ? `${i.name}: ${s}` : c === "open" ? `${i.name}: not answered yet` : i.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": c,
            "data-attention": d ? !0 : void 0,
            title: d ? `${f}. Needs attention: ${d}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: i.name }),
              d && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              c === "answered" && /* @__PURE__ */ l(le, { children: [
                /* @__PURE__ */ a(zr, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: s })
              ] }),
              c === "open" && /* @__PURE__ */ l(le, { children: [
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
function vu({ checked: e, onChange: t }) {
  return /* @__PURE__ */ l(
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
function Nu({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: i,
  preview: o,
  onApply: c,
  onFind: s,
  findDisabled: d,
  paused: f = !1,
  waitForGroups: u = !1,
  attention: p = yu,
  stayOnTap: h = !1,
  onStayOnTapChange: m
}) {
  const y = ho(), N = Hr(e), v = Sa();
  qc(o, v);
  const w = Ze(), T = Jr(
    ye(() => e.flatMap((S) => S.steps.flatMap((ie) => ie.tagIds)), [e])
  ), R = Li.filter((S) => S.keys.some((ie) => N.actionOn.has(ie))), x = R.includes(Li[Yo]), K = e.length - N.actionOn.size, E = ye(
    () => u && !f ? Er(e) : [],
    [u, f, e]
  ), _ = ye(
    () => E.length && r ? Oi(e, r) : null,
    [E, e, r]
  ), P = new Map(
    Mi(_ ?? []).flatMap(
      (S) => S.actions.filter((ie) => dc(e[ie])).map((ie) => [ie, S.name])
    )
  ), se = ye(
    () => e.map((S) => f ? [] : au(S, p, i)),
    [e, p, i, f]
  ), H = (S) => S.map(ou).join("; "), j = se.map(H), z = E.length > 0 && /* @__PURE__ */ a(
    wu,
    {
      groups: E,
      statuses: _,
      actions: e,
      attentionOf: (S) => H([
        ...new Map(
          S.actions.flatMap((ie) => se[ie]).map((ie) => [ie.key, ie])
        ).values()
      ])
    }
  ), O = (S) => {
    const ie = Cr(e[S], T, [], i).map((oe) => oe.text).join(", "), A = P.get(S), Q = j[S];
    return [
      ie,
      A === void 0 ? "" : `${A}: not answered yet`,
      Q ? `Needs attention: ${Q}` : ""
    ].filter(Boolean).join(". ");
  }, D = (S) => j[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${j[S]}`,
        children: /* @__PURE__ */ a(Dn, {})
      }
    )
  ) : null, L = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), Y = (S) => {
    const ie = N.actionOn.get(S), A = ie === void 0 ? void 0 : e[ie];
    if (!A)
      return /* @__PURE__ */ a(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ a(Nt, { binding: S, hidden: !0 })
        },
        S
      );
    const Q = t(A), oe = `${w}-effect-${S}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...f ? {} : L(A), children: [
      /* @__PURE__ */ a("span", { id: oe, className: "dq-sr-only", children: O(ie) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: A.label,
          "aria-keyshortcuts": S,
          "aria-describedby": oe,
          "data-group-open": P.has(ie) || void 0,
          "data-attention": j[ie] ? !0 : void 0,
          disabled: Q,
          onClick: (me) => c(A, me.shiftKey),
          children: [
            /* @__PURE__ */ a(Nt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: A.label }),
            Pa(A) && " ",
            Pa(A) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(ie)
          ]
        }
      )
    ] }, S);
  }, W = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = kc(N), ie = (A) => {
      const Q = e[A], oe = N.keys[A];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: Q.label,
          "aria-keyshortcuts": oe,
          "aria-describedby": `${w}-effect-${oe}`,
          "data-group-open": P.has(A) || void 0,
          "data-attention": j[A] ? !0 : void 0,
          disabled: t(Q),
          onClick: (me) => {
            o.clear(Q), c(Q, me.shiftKey || h && Gs(Q));
          },
          ...f ? {} : Sc(o, Q),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: Q.label }),
            Pa(Q) && " ",
            Pa(Q) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(A)
          ]
        },
        oe
      );
    };
    return /* @__PURE__ */ l(
      "section",
      {
        className: `dq-pad dq-pad-mobile${f ? " dq-pad-paused" : ""}`,
        "aria-label": f ? "Actions, paused while editing" : "Actions",
        "aria-busy": n || void 0,
        children: [
          /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
            f ? W : /* @__PURE__ */ a(
              Xo,
              {
                actions: e,
                keyMap: N,
                names: T,
                tags: r,
                trees: i,
                preview: o,
                findKey: y.find,
                mobile: !0
              }
            ),
            m && /* @__PURE__ */ a(vu, { checked: h, onChange: m })
          ] }),
          z,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            Ec,
            {
              groups: S,
              renderAction: ie,
              find: /* @__PURE__ */ a(
                Ac,
                {
                  extra: K,
                  findKey: y.find,
                  disabled: d,
                  onFind: s
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((A) => /* @__PURE__ */ a("span", { id: `${w}-effect-${N.keys[A]}`, children: O(A) }, A)) })
        ]
      }
    );
  }
  const re = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), J = !x && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": K ? `Find action, ${K} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: s,
      children: [
        /* @__PURE__ */ a(Nt, { binding: y.find }),
        /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-pad${f ? " dq-pad-paused" : ""}`,
      "aria-label": f ? "Actions, paused while editing" : "Actions",
      "aria-busy": n || void 0,
      children: [
        /* @__PURE__ */ l("div", { className: `dq-pad-header${z ? " dq-pad-header-groups" : ""}`, children: [
          f ? W : /* @__PURE__ */ a(
            Xo,
            {
              actions: e,
              keyMap: N,
              names: T,
              tags: r,
              trees: i,
              preview: o,
              findKey: y.find
            }
          ),
          z ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              z,
              re,
              J
            ] })
          ) : /* @__PURE__ */ l(le, { children: [
            !f && re,
            J
          ] })
        ] }),
        R.map((S) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(Y),
          S.indent === Yo && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": K ? `Find action, ${K} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: s,
              children: [
                /* @__PURE__ */ a(Nt, { binding: y.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
                  K ? `${K} more` : "Find action"
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
  findKey: c,
  mobile: s = !1
}) {
  const d = bo(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const m = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !s && m < e.length && /* @__PURE__ */ l(le, { children: [
        ` · ${m} on keys, ${e.length - m} more under `,
        /* @__PURE__ */ a(Nt, { binding: c })
      ] })
    ] });
  }
  const u = t.keys[f], p = r && d.steps.length ? lo(d, r, i) : null, h = p && !p.unresolvedTrees.length && ![p.added, p.removed, p.markedAbsent, p.absenceCleared].some(
    (m) => m.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    u && !s && /* @__PURE__ */ a(Nt, { binding: u }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    Cr(d, n, [], i).map((m, y) => /* @__PURE__ */ a("span", { "data-effect-tone": m.tone, children: m.text }, y)),
    h && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function Cc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: i,
  onApply: o,
  onFind: c,
  summary: s,
  hints: d,
  keyHints: f,
  notices: u,
  status: p,
  className: h = "",
  paused: m = !1
}) {
  const y = ho(), N = Hr(e), v = Sa(), w = Ze(), T = Jr(ye(() => ni(e), [e])), [R] = I(() => Nc());
  qc(R, v);
  const x = $(null), K = qu(x, e, !v), E = kc(N);
  !E.length && e.length && E.push([]);
  const _ = E.flat(), P = e.length - _.length, se = (O) => Cr(O, T, t, n).map((D) => D.text).join(", "), H = (O) => ({
    onMouseEnter: () => R.set(O),
    onMouseLeave: () => R.clear(O),
    onFocus: () => R.set(O),
    onBlur: (D) => {
      D.currentTarget.contains(D.relatedTarget) || R.clear(O);
    }
  }), j = d ?? (v ? void 0 : f), z = (O) => {
    const D = e[O];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: D.label,
        "aria-keyshortcuts": N.keys[O] || void 0,
        "aria-describedby": `${w}-effect-${O}`,
        disabled: m || r(D),
        onClick: () => {
          R.clear(D), o(D);
        },
        ...m ? {} : Sc(R, D),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: D.label })
      },
      D.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: x,
      className: `dq-action-bar${v ? " dq-bar-mobile" : K ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${m ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ a("div", { className: "dq-bar-summary", children: s }),
        /* @__PURE__ */ a("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${v ? " dq-mobile-actions" : ""}`,
            "aria-busy": i || void 0,
            children: [
              v && e.length > 0 && /* @__PURE__ */ a(
                Ec,
                {
                  groups: E,
                  renderAction: z,
                  find: /* @__PURE__ */ a(
                    Ac,
                    {
                      extra: P,
                      findKey: y.find,
                      disabled: m,
                      onFind: c
                    }
                  )
                }
              ),
              !v && E.map((O, D) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                O.map((L) => {
                  const Y = e[L], W = N.keys[L];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Y.label,
                      "aria-keyshortcuts": W || void 0,
                      "aria-describedby": `${w}-effect-${L}`,
                      disabled: m || r(Y),
                      onClick: () => o(Y),
                      ...m ? {} : H(Y),
                      children: [
                        W && /* @__PURE__ */ a(Nt, { binding: W }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: Y.label })
                      ]
                    },
                    Y.id
                  );
                }),
                D === E.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": P > 0 ? `Find action, ${P} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: m,
                    onClick: c,
                    children: [
                      /* @__PURE__ */ a(Nt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: P > 0 ? `${P} more` : "Find action" })
                    ]
                  }
                )
              ] }, D)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        j && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: j }),
        m ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          Su,
          {
            actions: e,
            keyMap: N,
            preview: R,
            names: T,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        u && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ a("div", { hidden: !0, children: _.map((O) => /* @__PURE__ */ a("span", { id: `${w}-effect-${O}`, children: se(e[O]) }, e[O].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: p })
      ]
    }
  );
}
function qu(e, t, n) {
  const [r, i] = I(!1);
  return Et(() => {
    var u;
    const o = e.current;
    if (!o || !n || typeof ResizeObserver > "u") return;
    const c = o.querySelector(".dq-bar-summary"), s = () => {
      const p = getComputedStyle(o), h = parseFloat(p.columnGap) || 0, m = o.clientWidth - (parseFloat(p.paddingLeft) || 0) - (parseFloat(p.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (_) => [..._.children].map((P) => P.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), T = ((c == null ? void 0 : c.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, R = (_) => y.map((P) => {
        let se = 1, H = 0;
        for (const j of P)
          H > 0 && H + v + j > _ ? (se += 1, H = j) : H += (H > 0 ? v : 0) + j;
        return se;
      }), x = (_) => Math.max(1, _.reduce((P, se) => P + se, 0)), K = R(m), E = x(R(m - T));
      i(
        1 + x(K) < E || 1 + x(K) === E && K.every((_) => _ === 1)
      );
    }, d = new ResizeObserver(s);
    d.observe(o);
    for (const p of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(p);
    s();
    let f = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      f && s();
    }), () => {
      f = !1, d.disconnect();
    };
  }, [e, t, n]), r;
}
function Su({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: i,
  trees: o,
  showKey: c
}) {
  const s = bo(n), d = s ? e.indexOf(s) : -1;
  if (!s || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && c && /* @__PURE__ */ a(Nt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: s.label }),
    Cr(s, r, i, o).map((u, p) => /* @__PURE__ */ a("span", { "data-effect-tone": u.tone, children: u.text }, p))
  ] });
}
const Zo = 1e3;
async function ku(e, t, n) {
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
          jn({
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
    for (const u of f.items) i.set(u.id, u);
    if (d * Zo >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const o = [...i.values()], c = Be(e), s = $e(e) ? await Au(
    c,
    o.map((d) => d.id),
    n
  ) : o.map((d) => (c === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: o.map((d, f) => ({ id: d.id, name: d.name, uses: s[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function Eu(e) {
  return JSON.stringify(
    jn({
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
async function Au(e, t, n) {
  const r = new Array(t.length).fill(0), i = new AbortController(), o = () => i.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && o(), n == null || n.addEventListener("abort", o, { once: !0 });
  let c = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; c < t.length && !i.signal.aborted; ) {
            const s = c++;
            r[s] = (await be(
              `/api/${ar(e)}/aggregate`,
              {
                method: "POST",
                signal: i.signal,
                body: Eu(t[s])
              }
            )).count;
          }
        } catch (s) {
          throw i.abort(), s;
        }
      })
    );
  } finally {
    n == null || n.removeEventListener("abort", o);
  }
  return i.signal.throwIfAborted(), r;
}
function Cu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function Tu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function Iu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of rr(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Ru(e, t, n) {
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
function $u(e, t) {
  var r;
  const n = vt(e);
  return ((r = Er(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Ou = (e) => e instanceof Error ? e.message : "Request failed.";
function Mu({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, c] = I([]), [s, d] = I({}), [f, u] = I({}), [p, h] = I({}), m = $(/* @__PURE__ */ new Map());
  X(
    () => () => {
      for (const O of m.current.values()) O.abort();
    },
    []
  );
  const y = Rn(Be(t)), N = $e(t), v = N ? "performer" : y.one;
  function w(O) {
    var L;
    (L = m.current.get(O)) == null || L.abort();
    const D = new AbortController();
    m.current.set(O, D), d((Y) => ({ ...Y, [O]: { status: "loading" } })), ku(t, O, D.signal).then(
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [O]: { status: "ready", group: Y }
        }));
      },
      (Y) => {
        D.signal.aborted || d((W) => ({
          ...W,
          [O]: { status: "failed", message: Ou(Y) }
        }));
      }
    );
  }
  function T(O) {
    var re;
    const D = o.filter((J) => !O.includes(J));
    for (const J of D)
      (re = m.current.get(J)) == null || re.abort(), m.current.delete(J);
    const L = (J) => {
      const S = s[J];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ie) => ie.id) : [];
    }, Y = new Set(O.flatMap(L)), W = D.flatMap(L).filter((J) => !Y.has(J));
    u(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([S]) => !W.includes(Number(S)))
      )
    ), h(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([S]) => O.includes(Number(S)))
      )
    ), d(
      (J) => Object.fromEntries(
        Object.entries(J).filter(([S]) => O.includes(Number(S)))
      )
    ), c(O);
    for (const J of O) o.includes(J) || w(J);
  }
  const R = o.flatMap((O) => {
    const D = s[O];
    return (D == null ? void 0 : D.status) === "ready" ? [D.group] : [];
  }), x = R.length === o.length, K = o.some(
    (O) => {
      var D;
      return (((D = s[O]) == null ? void 0 : D.status) ?? "loading") === "loading";
    }
  ), E = new Map(
    Cu(R).map((O) => [O.parent.id, O])
  ), _ = Tu(R), P = new Map(R.map((O) => [O.parent.id, O.parent.name])), se = Iu(t.actions), H = (O) => f[O] ?? !se.has(O), j = x ? [...E.values()].flatMap((O) => {
    const D = $u(O.parent.name, t.actions);
    return O.children.filter((L) => H(L.id)).map((L) => ({ child: L, answerGroup: D }));
  }) : [], z = (O, D) => u((L) => ({
    ...L,
    ...Object.fromEntries(O.children.map((Y) => [Y.id, D]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ a("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      N ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ a(
      tr,
      {
        entityType: "tag",
        values: o,
        onChange: T,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    o.map((O) => {
      const D = s[O];
      if (!D || D.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, O);
      if (D.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
            "Child tags could not be loaded. ",
            D.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(O),
              children: "Retry"
            }
          )
        ] }, O);
      const L = E.get(O);
      if (!L) return null;
      const Y = L.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(le, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: p[O] ?? !1,
                disabled: n,
                onChange: (W) => h((re) => ({
                  ...re,
                  [O]: W.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            Y,
            " tree"
          ] }),
          L.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(le, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
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
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: L.children.map((W) => {
              const re = se.get(W.id) ?? [], J = (_.get(W.id) ?? []).filter((S) => S !== O).map((S) => `“${P.get(S)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: H(W.id),
                    disabled: n,
                    onChange: (S) => u((ie) => ({
                      ...ie,
                      [W.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  W.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    W.uses.toLocaleString(),
                    " ",
                    W.uses === 1 ? y.one : y.many
                  ] }),
                  J.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    J.join(", ")
                  ] }),
                  re.length > 0 && /* @__PURE__ */ l("small", { children: [
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
      ] }, O);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !j.length,
          onClick: () => r(
            j.map(
              ({ child: O, answerGroup: D }) => Ru(
                O,
                (_.get(O.id) ?? []).filter(
                  (L) => p[L]
                ),
                D
              )
            )
          ),
          children: j.length ? `Add ${j.length} action${j.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: i, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: K ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Fu(e, t, n, r) {
  const i = vt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const s of e)
      o.push({ kind: "group", name: s, selected: vt(s) === i });
    return o;
  }
  const c = vt(r);
  for (const s of t)
    vt(s).includes(c) && o.push({ kind: "group", name: s, selected: vt(s) === i });
  return c && !t.some((s) => vt(s) === c) && o.push({ kind: "new", name: r.trim(), selected: c === i }), o;
}
function xu(e) {
  return e.kind === "group" ? `group:${vt(e.name)}` : e.kind;
}
function Pu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Lu = /* @__PURE__ */ new Set([
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
]), Du = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), La = 4, es = 240;
function _u(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function ju(e, t, n, r) {
  for (const o of r) {
    const c = o.getBoundingClientRect();
    if (n.bottom < c.top || n.top > c.bottom || n.right < c.left || n.left > c.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const i = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !i || e.contains(i) || t.contains(i);
}
function Uu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: i
}) {
  const o = Ze(), c = Ze(), s = Ze(), d = $(null), f = $(null), u = $(null), p = $(null), h = $(null), m = $([]), y = $(!1), N = $(!1), [v, w] = I(!1), [T, R] = I(null), [x, K] = I(null), [E, _] = I(!1), P = e.group ?? "", se = ye(
    () => Fu(t, n, P, T),
    [t, n, P, T]
  ), H = se.map(xu), j = x === null ? -1 : H.indexOf(x), z = (A) => `${c}-option-${A}`, O = (A) => i(A ? { ...e, group: A } : Pu(e)), D = () => {
    var Q;
    const A = ((Q = u.current) == null ? void 0 : Q.value) ?? P;
    A.trim() !== A && O(A.trim());
  };
  function L(A) {
    R(null), K(A), w(!0);
  }
  const Y = (A) => {
    var Q, oe;
    return A instanceof Node && (((Q = d.current) == null ? void 0 : Q.contains(A)) || ((oe = p.current) == null ? void 0 : oe.contains(A))) === !0;
  };
  function W() {
    var A, Q;
    (A = p.current) != null && A.contains(document.activeElement) && ((Q = h.current) == null || Q.focus({ preventScroll: !0 })), w(!1), R(null), K(null), _(!1);
  }
  function re(A) {
    A.kind === "group" && A.selected && T === null || O(A.kind === "none" ? "" : A.name), W();
  }
  function J() {
    const A = f.current, Q = p.current;
    if (!A || !Q) return;
    const oe = A.getBoundingClientRect(), me = window.visualViewport, G = (me == null ? void 0 : me.offsetTop) ?? 0, Ce = (me ? me.offsetTop + me.height : window.innerHeight) - oe.bottom - La, pe = oe.top - G - La, Oe = Math.min(Q.scrollHeight, es), Ke = Ce < Oe && pe > Ce;
    Q.style.left = `${oe.left}px`, Q.style.width = `${oe.width}px`, Q.style.top = `${Ke ? oe.top - La : oe.bottom + La}px`, Q.style.transform = Ke ? "translateY(-100%)" : "", Q.style.maxHeight = `${Math.max(0, Math.min(es, Ke ? pe : Ce))}px`, ju(A, Q, oe, m.current) || W();
  }
  Et(() => {
    var A;
    v && (f.current && (m.current = _u(f.current)), N.current && ((A = p.current) == null || A.focus({ preventScroll: !0 }), _(!0)), N.current = !1);
  }, [v]), Et(() => {
    v && J();
  }), X(() => {
    if (!v) return;
    const A = () => J(), Q = (G) => {
      Y(G.target) || W();
    }, oe = [...m.current, window], me = window.visualViewport;
    for (const G of oe) G.addEventListener("scroll", A);
    return window.addEventListener("resize", A), me == null || me.addEventListener("resize", A), me == null || me.addEventListener("scroll", A), document.addEventListener("pointerdown", Q), () => {
      for (const G of oe) G.removeEventListener("scroll", A);
      window.removeEventListener("resize", A), me == null || me.removeEventListener("resize", A), me == null || me.removeEventListener("scroll", A), document.removeEventListener("pointerdown", Q);
    };
  }, [v]), X(() => {
    var A, Q, oe;
    j >= 0 && ((oe = (Q = (A = p.current) == null ? void 0 : A.children[j]) == null ? void 0 : Q.scrollIntoView) == null || oe.call(Q, { block: "nearest" }));
  }, [j]);
  function S(A) {
    if (ln(A)) return;
    const Q = A.key === "ArrowDown" || A.key === "ArrowUp";
    if (Q && !v) {
      if (A.altKey && A.key === "ArrowUp") return;
      A.preventDefault(), L(A.altKey ? null : vt(P) ? `group:${vt(P)}` : "none");
      return;
    }
    if (v)
      if (Q) {
        if (A.preventDefault(), A.altKey) {
          A.key === "ArrowUp" && W();
          return;
        }
        const oe = A.key === "ArrowDown" ? 1 : -1, me = T !== null && vt(T) && H.length > 1 ? 1 : 0, G = j < 0 ? oe > 0 ? me : H.length - 1 : (j + oe + H.length) % H.length;
        K(H[G]);
      } else A.key === "Enter" && (A.preventDefault(), j >= 0 ? re(se[j]) : (D(), W()));
  }
  function ie(A) {
    var oe;
    if (A.key === "Tab") {
      W(), A.shiftKey && ((oe = u.current) == null || oe.focus());
      return;
    }
    if (A.key === "Dead" || A.key === "Process" || ln(A) && !Du.has(A.key) || A.key === "Backspace" || A.key === "Delete" || [...A.key].length === 1 && !A.metaKey && (!A.ctrlKey || A.altKey)) {
      const me = u.current;
      me && (me.focus(), me.setSelectionRange(me.value.length, me.value.length));
      return;
    }
    !Lu.has(A.key) && !ln(A) && _(!1), S(A);
  }
  return /* @__PURE__ */ l(
    "div",
    {
      onKeyDown: (A) => {
        !v || A.key !== "Escape" || ln(A) || (A.preventDefault(), A.stopPropagation(), W());
      },
      children: [
        /* @__PURE__ */ l("div", { ref: d, className: "dq-action-field", children: [
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
          /* @__PURE__ */ l("div", { ref: f, className: "dq-combobox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                ref: u,
                id: o,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? c : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && j >= 0 ? z(j) : void 0,
                "aria-describedby": s,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: P,
                onChange: (A) => {
                  O(A.target.value), R(A.target.value), K(null), w(!0);
                },
                onClick: () => {
                  v || L(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  W(), D();
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
                "aria-controls": v ? c : void 0,
                onPointerDown: (A) => {
                  y.current = A.pointerType === "touch";
                },
                onMouseDown: (A) => A.preventDefault(),
                onClick: () => {
                  var oe;
                  const A = y.current;
                  y.current = !1;
                  const Q = document.activeElement === u.current;
                  v ? W() : (N.current = A && !Q, L(null)), (!A || Q) && ((oe = u.current) == null || oe.focus());
                },
                children: /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: s, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && cd(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: p,
              id: c,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": j >= 0 ? z(j) : void 0,
              "data-tap-focus": E || void 0,
              onMouseDown: (A) => A.preventDefault(),
              onKeyDown: ie,
              onBlur: (A) => {
                Y(A.relatedTarget) || W();
              },
              children: se.map((A, Q) => /* @__PURE__ */ l(
                "li",
                {
                  id: z(Q),
                  role: "option",
                  "aria-selected": A.selected,
                  className: "dq-combobox-option",
                  "data-kind": A.kind,
                  "data-active": Q === j || void 0,
                  onMouseMove: () => {
                    Q !== j && K(H[Q]);
                  },
                  onClick: () => re(A),
                  children: [
                    A.kind === "new" && /* @__PURE__ */ a(ba, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: A.kind === "none" ? "No group" : A.kind === "new" ? `New group “${A.name}”` : A.name }),
                    A.selected && /* @__PURE__ */ a(zr, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                H[Q]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Wn = [
  ...Za,
  ["auto", Zn]
];
function Tc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : no(e[n]);
}
function Bu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i
}) {
  const [o, c] = I(!1), s = $(null), d = n.keys[t], f = Tc(e, n, t), u = qr(f), p = n.duplicatePins.has(t) ? ` (${pa(e[t].shortcut ?? "")} is pinned twice)` : "", h = d ? `${pa(d)}, ${u ? "pinned" : "Auto"}${p}` : f === Zn ? "no key, Find action only" : `no key: Auto found no free key${p}`, m = () => {
    var y;
    c(!1), (y = s.current) == null || y.focus();
  };
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: s,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${h}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => c(!o),
        children: [
          d ? /* @__PURE__ */ a(Nt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          u && /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ a(
      Ku,
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
function Ku({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: i,
  onClose: o
}) {
  const c = $(null), s = n.keys[t], d = Tc(e, n, t), [f, u] = I(s || "q"), p = (N) => {
    var v;
    return ((v = c.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  Et(() => {
    var N, v, w;
    (N = p(s || d)) == null || N.focus(), (w = (v = c.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    qr(N) && u(N), (v = p(N)) == null || v.focus();
  }
  function m(N) {
    var E, _, P;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const se = [...((E = c.current) == null ? void 0 : E.querySelectorAll("button[tabindex='0']")) ?? []], H = se.indexOf(document.activeElement);
      N.preventDefault(), (_ = se[(H + (N.shiftKey ? -1 : 1) + se.length) % se.length]) == null || _.focus();
      return;
    }
    const v = (P = N.target.dataset) == null ? void 0 : P.choice, w = v ? Wn.findIndex((se) => se.includes(v)) : -1;
    if (!v || w < 0) return;
    const T = Wn[w].indexOf(v), R = (se) => se == null ? void 0 : se[Math.min(T, se.length - 1)], x = {
      ArrowLeft: Wn[w][T - 1],
      ArrowRight: Wn[w][T + 1],
      ArrowUp: R(Wn[w - 1]),
      ArrowDown: R(Wn[w + 1]),
      Home: Wn[w][0],
      End: Wn[w].at(-1)
    };
    if (!Object.hasOwn(x, N.key)) return;
    N.preventDefault();
    const K = x[N.key];
    K && h(K);
  }
  const y = (N) => {
    const v = qr(N) ? n.actionOn.get(N) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: no(e[v]) === N
    };
  };
  return /* @__PURE__ */ l(le, { children: [
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
    /* @__PURE__ */ l(
      "div",
      {
        ref: c,
        role: "dialog",
        "aria-label": `Key for ${r}`,
        className: "dq-key-picker",
        onKeyDown: m,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Za.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const T = y(w), R = T ? `${T.own ? "this action" : T.label}, ${T.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: `dq-key-choice${T ? "" : " dq-key-choice-free"}${T != null && T.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${pa(w)}: ${R}`,
                "aria-pressed": !!(T != null && T.own && T.pinned),
                title: T ? `${T.label} (${T.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => u(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Nt, { binding: w }),
                    (T == null ? void 0 : T.pinned) && /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
                  ] }),
                  T && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: T.label })
                ]
              },
              w
            );
          }) }, v)) }),
          /* @__PURE__ */ l("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ l(
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
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": Zn,
                tabIndex: 0,
                "aria-pressed": d === Zn,
                onClick: () => i(Zn),
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
const Gu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Vu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function zu(e, t) {
  if (_n(e, t)) return "";
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
function Hu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function Ju({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: i,
  expandedId: o,
  onExpand: c,
  reveal: s
}) {
  const d = je(e), f = d !== "tag", u = e.actions, p = Hr(u), h = Jr(ye(() => ni(u), [u])), m = ye(
    () => f ? Er(u).map((G) => G.name) : [],
    [f, u]
  ), y = u.findIndex((G) => G.id === o), N = ye(
    () => f && y >= 0 ? Er(
      u.filter((G, we) => we !== y)
    ).map((G) => G.name) : [],
    [f, u, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ye(
    () => new Set(
      v ? Yd(u).map((G) => G.key) : []
    ),
    [v, u]
  ), [T, R] = I(""), [x, K] = I(!1), [E, _] = I(
    null
  ), P = Ze(), se = `${P}-from-tags`, H = $(null), j = $(null), z = $(null), O = $(null), D = $(/* @__PURE__ */ new WeakMap()), L = (G) => {
    let we = D.current.get(G);
    return we || (we = crypto.randomUUID(), D.current.set(G, we)), we;
  }, Y = T.trim().toLocaleLowerCase(), W = Y ? u.filter((G) => G.label.toLocaleLowerCase().includes(Y)) : u, re = (G) => t({ ...e, actions: G }), J = (G, we) => re(u.map((Ce, pe) => pe === G ? we : Ce));
  function S(G) {
    var we;
    return [...((we = z.current) == null ? void 0 : we.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ce) => Ce.dataset.actionId === G
    );
  }
  function ie(G, we) {
    const Ce = S(G), pe = Ce == null ? void 0 : Ce.querySelector(
      we === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return pe == null || pe.focus(), !!pe;
  }
  Et(() => {
    var we;
    const G = O.current;
    G && (O.current = null, (G === "add" || !ie(G.id, G.part)) && ((we = j.current) == null || we.focus()));
  }), X(() => {
    !s || !o || (W.some((G) => G.id === o) ? ie(o, "label") : (R(""), O.current = { id: o, part: "label" }));
  }, [s]);
  function A() {
    const G = Hu(d);
    R(""), re([...u, G]), c(G.id), O.current = { id: G.id, part: "label" };
  }
  function Q(G) {
    const we = u[G], { shortcut: Ce, ...pe } = structuredClone(we), Oe = {
      ...pe,
      ...Ce === Zn ? { shortcut: Ce } : {},
      id: crypto.randomUUID(),
      label: `${we.label} copy`
    };
    re([...u.slice(0, G + 1), Oe, ...u.slice(G + 1)]), c(Oe.id), O.current = { id: Oe.id, part: "label" };
  }
  function oe(G) {
    const we = u[G], Ce = W.indexOf(we), pe = W[Ce + 1] ?? W[Ce - 1];
    re(u.filter((Oe, Ke) => Ke !== G)), o === we.id && c(null), O.current = pe ? { id: pe.id, part: "toggle" } : "add";
  }
  function me() {
    K(!1), requestAnimationFrame(() => {
      var G;
      return (G = H.current) == null ? void 0 : G.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: j,
            type: "button",
            className: "dq-header-button",
            onClick: A,
            children: [
              /* @__PURE__ */ a(ba, { "aria-hidden": "true" }),
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
            "aria-controls": x ? se : void 0,
            onClick: () => {
              _(null), K(!x);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(ga, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: T,
              onChange: (G) => R(G.target.value),
              onKeyDown: (G) => {
                G.key === "Escape" && T && !ln(G) && (G.preventDefault(), G.stopPropagation(), R(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      f && /* @__PURE__ */ l("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${P}-groups-note`, children: v && !m.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (E == null ? void 0 : E.actions) === u ? `Added ${E.count} action${E.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && x && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || ln(G) || (G.preventDefault(), G.stopPropagation(), me());
        },
        children: /* @__PURE__ */ a(
          Mu,
          {
            id: se,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const we = [...u, ...G];
              re(we), _({ actions: we, count: G.length }), me();
            },
            onCancel: me
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: z, children: W.length > 0 && /* @__PURE__ */ a(
      As,
      {
        items: W,
        getKey: (G) => G.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (G) => re(G),
        renderItem: (G, { dragHandleProps: we, isOver: Ce }) => {
          const pe = u.indexOf(G), Oe = o === G.id;
          return /* @__PURE__ */ a(
            Wu,
            {
              action: G,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Bu,
                {
                  actions: u,
                  index: pe,
                  keyMap: p,
                  name: G.label.trim() || "New action",
                  onChoose: (Ke) => re(ud(u, pe, Ke))
                }
              ),
              takenPin: p.duplicatePins.has(pe) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(vt(G.group)),
              effect: Cr(G, h, n, r),
              open: Oe,
              detailId: `${P}-detail-${G.id}`,
              dragHandleProps: we,
              isOver: Ce,
              reorderDisabled: i || !!Y,
              onToggle: () => c(Oe ? null : G.id),
              onDuplicate: () => Q(pe),
              onDelete: () => oe(pe),
              children: "steps" in G ? /* @__PURE__ */ a(
                Qu,
                {
                  action: G,
                  groupNames: m,
                  otherGroupNames: N,
                  occurrence: $e(e),
                  saving: i,
                  stepKey: L,
                  rememberStepKey: (Ke, Ae) => D.current.set(Ke, L(Ae)),
                  onChange: (Ke) => J(pe, Ke)
                }
              ) : /* @__PURE__ */ a(
                Xu,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Ke) => J(pe, Ke)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !W.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      T.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Wu({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: i = !1,
  effect: o,
  open: c,
  detailId: s,
  dragHandleProps: d,
  isOver: f,
  reorderDisabled: u,
  onToggle: p,
  onDuplicate: h,
  onDelete: m,
  children: y
}) {
  const N = e.label.trim() || "New action", v = zu(e, t), w = "steps" in e && vt(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${c ? " dq-action-row-open" : ""}${f ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              ...d,
              style: Ic(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${N}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ a(Ms, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: p, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !c && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((T, R) => /* @__PURE__ */ a("span", { "data-effect-tone": T.tone, children: T.text }, R)) }),
            v && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${pa(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
                  `${pa(r)} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
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
              children: /* @__PURE__ */ a(Ya, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${c ? "Collapse" : "Expand"} ${N}`,
              "aria-expanded": c,
              "aria-controls": c ? s : void 0,
              onClick: p,
              children: /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
            }
          )
        ] }),
        c && /* @__PURE__ */ a("div", { id: s, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function Rc({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
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
  rememberStepKey: c,
  onChange: s
}) {
  const d = Ze(), f = $(null), u = $(null);
  Et(() => {
    var m, y;
    const h = u.current;
    h != null && (u.current = null, (y = (m = f.current) == null ? void 0 : m.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const p = (h) => s({ ...e, steps: h });
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a(Rc, { action: e, onChange: (h) => s({ ...e, label: h }) }),
    /* @__PURE__ */ a(
      Uu,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: r,
        onChange: s
      }
    ),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": d, children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", id: d, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: f, children: [
        e.steps.length > 0 ? /* @__PURE__ */ a(
          As,
          {
            items: e.steps,
            getKey: o,
            disabled: i,
            className: "dq-step-list",
            onReorder: p,
            renderItem: (h, { index: m, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              Yu,
              {
                step: h,
                index: m,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  c(v, h), p(e.steps.map((w, T) => T === m ? v : w));
                },
                onRemove: () => p(e.steps.filter((v, w) => w !== m))
              }
            )
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              u.current = e.steps.length, p([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(ba, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Yu({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: r,
  saving: i,
  onChange: o,
  onRemove: c
}) {
  const s = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${r ? " dq-drag-over" : ""}`,
      "data-step-tone": Vu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: Ic(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${s}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: i,
            children: [
              /* @__PURE__ */ a(Ms, { "aria-hidden": "true" }),
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: s })
            ]
          }
        ),
        /* @__PURE__ */ a(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${s} operation`,
            value: e.mode,
            onChange: (d) => o({ ...e, mode: d.target.value }),
            children: Gu.map(({ mode: d, label: f }) => /* @__PURE__ */ a("option", { value: d, children: f }, d))
          }
        ),
        /* @__PURE__ */ a(
          tr,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => o({ ...e, tagIds: d }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${s}`,
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
            "aria-label": `Remove step ${s}`,
            title: "Remove step",
            onClick: c,
            children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Xu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, i = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, o = r.mode === "SET_TAG_GROUP" && !t.some((c) => c.id === r.tagGroupId);
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a(Rc, { action: e, onChange: (c) => n({ ...e, label: c }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
        "select",
        {
          className: "dq-select",
          "aria-label": "Tag group action",
          value: i,
          onChange: (c) => {
            const s = c.target.value;
            n({
              ...e,
              effect: s === "SKIP" ? { mode: "SKIP" } : s === "CLEAR_TAG_GROUP" ? { mode: "CLEAR_TAG_GROUP" } : { mode: "SET_TAG_GROUP", tagGroupId: Number(s.slice(6)) }
            });
          },
          children: [
            /* @__PURE__ */ a("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ a("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            o && /* @__PURE__ */ a("option", { value: i, disabled: !0, children: "Unavailable tag group" }),
            t.map((c) => /* @__PURE__ */ a("option", { value: `group:${c.id}`, children: c.name }, c.id))
          ]
        }
      )
    ] })
  ] });
}
const $c = Ml(!1);
function Zu({ children: e }) {
  return /* @__PURE__ */ a($c.Provider, { value: !0, children: e });
}
function Ht({ tag: e, name: t }) {
  const n = Fl($c), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function ef({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Rn(Be(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      tr,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (o) => i({ tagIds: o }),
        placeholder: "Search review tag choices...",
        allowCreate: !1
      }
    ),
    /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
function tf({
  review: e,
  onChange: t
}) {
  const n = Rn(Be(e)).many, r = e.occurrence, i = Us(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, c = qa([
    ...i.flatMap((u) => [u.tagId, ...u.categoryTagId ? [u.categoryTagId] : []]),
    ...o
  ]), s = (u) => {
    var p;
    return ((p = c[u]) == null ? void 0 : p.name) ?? (c[u] === null ? `Unavailable tag ${u}` : `Tag ${u}`);
  }, d = (u) => t({ ...e, occurrence: ld(r, u) }), f = (u, p) => d(
    i.map(
      (h, m) => m !== u ? h : p === void 0 ? { tagId: h.tagId } : { tagId: h.tagId, categoryTagId: p }
    )
  );
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group dq-flag-settings", children: [
    /* @__PURE__ */ a("legend", { children: "Performer flags" }),
    /* @__PURE__ */ l("p", { children: [
      "Flag performers whose profile has one of these tags, for example a tag noting that something changed during their career. ",
      /* @__PURE__ */ a("strong", { children: "Affects" }),
      " names the category the flag is about, that tag and everything under it: the flag then asks for attention only where an answer changes that category. Leave it empty for the whole review. Check a flagged performer’s earliest and latest ",
      n,
      " before applying one batch to all of them."
    ] }),
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((u, p) => {
      const h = s(u.tagId), m = i.filter(
        (v, w) => w !== p && v.tagId === u.tagId
      ), y = (v) => m.some((w) => w.categoryTagId === v), N = `${u.tagId}#${i.slice(0, p).filter((v) => v.tagId === u.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Ht, { tag: c[u.tagId], name: h })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Lo,
            {
              entityType: "tag",
              value: u.categoryTagId,
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
            onClick: () => d(i.filter((v, w) => w !== p)),
            children: /* @__PURE__ */ a(Ya, { "aria-hidden": "true" })
          }
        ),
        o.length > 0 && /* @__PURE__ */ l(
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
                  "aria-pressed": u.categoryTagId === void 0,
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
                  "aria-pressed": u.categoryTagId === v,
                  disabled: y(v),
                  onClick: () => f(p, v),
                  children: s(v)
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
        onChange: (u) => {
          u !== void 0 && d([...i, { tagId: u }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: i.flatMap((u) => u.categoryTagId === void 0 ? [u.tagId] : [])
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
}, nf = {
  video: Xa,
  audio: Ls,
  tag: Ps,
  performerOccurrence: xs,
  audioPerformerOccurrence: Hl
};
function Fc({ entityType: e }) {
  const t = nf[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": Oc[e] });
}
const rf = 2e6;
function xc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function af(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function yo(e) {
  xc([e], af(e));
}
async function of(e) {
  if (e.size > rf) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return va(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Kr(e) {
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
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: je(e),
          disabled: n,
          onChange: (c) => r == null ? void 0 : r(c.target.value),
          children: Bs.map((c) => /* @__PURE__ */ a("option", { value: c, children: Mc[c] }, c))
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Review name" }),
      /* @__PURE__ */ a(
        "input",
        {
          ref: i,
          className: "dq-input",
          "aria-label": "Review name",
          autoFocus: o,
          value: e.name,
          onChange: (c) => t({ ...e, name: c.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Description" }),
      /* @__PURE__ */ a(
        "textarea",
        {
          className: "dq-input",
          "aria-label": "Description",
          rows: 3,
          value: e.description,
          onChange: (c) => t({ ...e, description: c.target.value })
        }
      )
    ] })
  ] });
}
function sf(e, t) {
  const n = je(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function cf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), i = Ze(), o = Ze();
  return X(() => {
    var c;
    n.current && !n.current.open && n.current.showModal(), (c = r.current) == null || c.focus();
  }, []), /* @__PURE__ */ l(
    "dialog",
    {
      ref: n,
      className: "dq-confirm-dialog",
      "aria-labelledby": i,
      "aria-describedby": o,
      "aria-modal": "true",
      onCancel: (c) => {
        c.preventDefault(), e();
      },
      onClose: e,
      children: [
        /* @__PURE__ */ a("h2", { id: i, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ a("p", { id: o, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
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
  saving: c,
  saveDisabled: s = !1,
  error: d,
  dirty: f,
  criteriaChanged: u = !1,
  notices: p,
  onSave: h,
  onCancel: m,
  drawerRef: y
}) {
  const [N, v] = I("Review"), [w] = I(
    () => $e(e) && e.occurrence.tagIds.length > 0
  ), [T, R] = I(""), [x, K] = I(null), [E, _] = I(0), [P, se] = I(!1), H = $(null), j = $(null), z = $(null), O = sf(e, w), D = je(e), L = ye(() => Kr(e), [e]);
  X(() => R(""), [L]), X(() => {
    var ie, A;
    if (P) return;
    const J = H.current;
    if (H.current = null, !J) return;
    (A = J.isConnected && !!((ie = z.current) != null && ie.contains(J)) && !(J instanceof HTMLButtonElement && J.disabled) ? J : z.current) == null || A.focus({ preventScroll: !0 });
  }, [P]);
  function Y() {
    if (!(c || P)) {
      if (!f) {
        m();
        return;
      }
      H.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, se(!0);
    }
  }
  function W() {
    const J = { ...e, name: e.name.trim() }, S = ha(J);
    if (!S) {
      R(""), h();
      return;
    }
    if (R(S), !J.name) {
      v("Review"), requestAnimationFrame(() => {
        var A;
        return (A = j.current) == null ? void 0 : A.focus();
      });
      return;
    }
    const ie = e.actions.find(
      (A) => !_n(A, D)
    );
    ie && (v("Actions"), K(ie.id), _((A) => A + 1));
  }
  const re = T || d;
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (J) => {
          z.current = J, y && (y.current = J);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (J) => {
          J.key !== "Escape" || J.defaultPrevented || c || ln(J) || (J.preventDefault(), J.stopPropagation(), Y());
        },
        children: [
          /* @__PURE__ */ l("header", { className: "dq-drawer-header", children: [
            /* @__PURE__ */ l("div", { className: "dq-drawer-title", children: [
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
                disabled: c,
                onClick: Y,
                children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Ll,
            {
              tabs: O.map((J) => ({
                key: J,
                label: J,
                count: J === "Actions" ? e.actions.length : void 0
              })),
              activeTab: N,
              onTabChange: (J) => v(J)
            }
          ) }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: c, children: [
            /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
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
                      nameRef: j,
                      autoFocus: !0
                    }
                  ),
                  /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
                    /* @__PURE__ */ a("span", { children: "Review direction" }),
                    /* @__PURE__ */ l(
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
                  $e(e) && /* @__PURE__ */ a(tf, { review: e, onChange: t }),
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
            O.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: N !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(lf, { review: e, onChange: t })
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
                  Ju,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: i,
                    trees: o,
                    saving: c,
                    expandedId: x,
                    onExpand: K,
                    reveal: E
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
                children: /* @__PURE__ */ a(ef, { review: e, onChange: t })
              }
            )
          ] }) }),
          (re || p) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            p,
            re && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
              re
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? u ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: c, onClick: Y, children: "Cancel" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-button primary",
                "aria-busy": c || void 0,
                "aria-disabled": c || void 0,
                disabled: !c && s,
                onClick: () => {
                  c || W();
                },
                children: "Save review"
              }
            )
          ] })
        ]
      }
    ),
    P && /* @__PURE__ */ a(
      cf,
      {
        onKeepEditing: () => se(!1),
        onDiscard: () => {
          H.current = null, se(!1), m();
        }
      }
    )
  ] });
}
function lf({
  review: e,
  onChange: t
}) {
  const n = Ze(), r = e.view, i = (u) => t({ ...e, view: { ...r, ...u } }), o = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (u) => i({ selectAllOnLoad: u.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (je(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
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
          onChange: (u) => i({ displayMode: u })
        }
      ),
      o,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const c = e.presentation ?? {}, s = (u) => t({ ...e, presentation: { ...c, ...u } }), d = c.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          ns,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(uf, {}),
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
            picture: /* @__PURE__ */ a(ff, {}),
            onChoose: () => i({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
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
          onChange: (u) => i({ displayMode: u })
        }
      ),
      o,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ a("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([u, p]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(u),
              onChange: (h) => s({
                annotations: h.target.checked ? [...d, u] : d.filter((m) => m !== u)
              })
            }
          ),
          p
        ] }, u)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            tr,
            {
              entityType: "tag",
              values: c.annotationParents ?? [],
              onChange: (u) => s({ annotationParents: u }),
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
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ a(
        tr,
        {
          entityType: "tag",
          values: c.binParents ?? [],
          onChange: (u) => s({ binParents: u }),
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
      df,
      {
        bins: c.filterBins ?? [],
        onChange: (u) => s({ filterBins: u.length ? u : void 0 })
      }
    )
  ] });
}
function df({
  bins: e,
  onChange: t
}) {
  const n = Ze(), [r, i] = I(null), o = e.find((s) => s.key === r), c = (s, d) => t(
    e.map((f) => {
      var p;
      if (f.key !== s) return f;
      const u = { ...f, ...d };
      return (p = u.group) != null && p.trim() || delete u.group, u;
    })
  );
  return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-title`, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-title`, children: "Queue filter bins" }),
    e.map((s, d) => {
      const f = s.label.trim() || `Filter bin ${d + 1}`, u = Object.keys(s.filter).length;
      return /* @__PURE__ */ l("div", { className: "dq-filter-bin", role: "group", "aria-label": f, children: [
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Name of ${f}`,
            placeholder: "Bin name",
            value: s.label,
            onChange: (p) => c(s.key, { label: p.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: s.group ?? "",
            onChange: (p) => c(s.key, { group: p.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-button",
            "aria-label": `Edit filter of ${f}`,
            onClick: () => i(s.key),
            children: u ? "Edit filter…" : "Set filter…"
          }
        ),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Delete ${f}`,
            title: "Delete",
            onClick: () => t(e.filter((p) => p.key !== s.key)),
            children: /* @__PURE__ */ a(Ya, { "aria-hidden": "true" })
          }
        )
      ] }, s.key);
    }),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button",
        onClick: () => {
          const s = crypto.randomUUID();
          t([...e, { key: s, label: "", filter: {} }]), i(s);
        },
        children: [
          /* @__PURE__ */ a(ba, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (s) => {
          s.key !== "Escape" || ln(s) || (s.stopPropagation(), !s.defaultPrevented && (s.preventDefault(), i(null)));
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
            onApply: (s) => {
              i(null), c(o.key, { filter: s });
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
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
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
  const c = Ze(), s = Ze();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    i,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ a(
        "input",
        {
          type: "radio",
          name: e,
          checked: t,
          "aria-labelledby": c,
          "aria-describedby": s,
          onChange: o
        }
      ),
      /* @__PURE__ */ a("span", { id: c, children: n })
    ] }),
    /* @__PURE__ */ a("span", { className: "dq-layout-card-text", id: s, children: r })
  ] });
}
function uf() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function ff() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
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
  editDisabled: c,
  editing: s = !1,
  toolbar: d,
  trailing: f,
  trailingEnd: u,
  queueChange: p,
  queueDiffers: h,
  chipsStart: m,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = $(null);
  bf(v);
  const w = yf(v), [T, R] = I({ differs: h, text: "" });
  return T.differs !== h && R({
    differs: h,
    text: h ? T.differs === !1 ? Di : T.text : ""
  }), /* @__PURE__ */ l("header", { ref: v, className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      r && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: i,
          onClick: r,
          children: /* @__PURE__ */ a(wa, { "aria-hidden": "true" })
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
          "aria-expanded": s,
          disabled: c,
          onClick: o,
          children: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      f,
      p && /* @__PURE__ */ a(pf, { change: p, onPress: w }),
      u
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    m,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: T.text })
  ] });
}
function pf({
  change: e,
  onPress: t
}) {
  const n = Ze(), r = Ze(), i = `${Di} Save these filters to the review.`, o = e.onSave ? `${Di} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(le, { children: [
    e.onSave && /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": n,
        disabled: e.saveDisabled,
        onClick: () => {
          var c;
          t(), (c = e.onSave) == null || c.call(e);
        },
        children: [
          /* @__PURE__ */ a(Ql, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ a("span", { id: n, hidden: !0, children: i })
        ]
      }
    ),
    /* @__PURE__ */ l(
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
const hf = ["queue", "summary", "name", "layout", "range"], mf = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, gf = "(min-width: 1400px)";
function Ua(e) {
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
  const i = hf.filter(
    (o) => e.querySelector(mf[o])
  );
  for (let o = 1; o <= i.length && !Ua(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const c = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let s = n.getBoundingClientRect().width;
    for (; !Ua(e) && s > 6 * c; )
      s = Math.max(6 * c, s - c), n.style.maxWidth = `${s}px`;
  }
  return Ua(e) ? !0 : (r(), !1);
}
function bf(e) {
  const t = vc(gf), [n, r] = I(0), i = $(!1);
  Et(() => {
    e.current && (i.current = !rs(e.current, t));
  }, [e, t, n]), Et(() => {
    const o = e.current;
    o && t && !i.current && !Ua(o) && (i.current = !rs(o, t));
  }), X(() => {
    const o = e.current;
    if (!o || !t || typeof ResizeObserver > "u") return;
    const c = new ResizeObserver(() => r((s) => s + 1));
    c.observe(o);
    for (const s of o.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      c.observe(s);
    return () => c.disconnect();
  }, [e, t]);
}
function yf(e) {
  const t = $(!1);
  return X(() => {
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
  const [r, i] = I(!1), [o, c] = I(""), s = $(null), d = $(null);
  X(() => {
    var p;
    r && ((p = s.current) == null || p.select());
  }, [r]);
  const f = (p) => {
    i(!1), p && requestAnimationFrame(() => {
      var h;
      return (h = d.current) == null ? void 0 : h.focus();
    });
  }, u = () => {
    const p = Math.round(Number(o));
    f(!0), Number.isFinite(p) && p >= 1 && p !== e && n(Math.min(t, p));
  };
  return /* @__PURE__ */ l("span", { className: "dq-pager", children: [
    /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ a(wa, { "aria-hidden": "true" })
      }
    ),
    r ? /* @__PURE__ */ a(
      "input",
      {
        ref: s,
        type: "number",
        className: "dq-pager-input",
        "aria-label": `Go to page, 1 to ${t}`,
        min: 1,
        max: t,
        value: o,
        onChange: (p) => c(p.target.value),
        onKeyDown: (p) => {
          ln(p) || (p.key === "Enter" ? (p.preventDefault(), u()) : p.key === "Escape" && (p.preventDefault(), p.stopPropagation(), f(!0)));
        },
        onBlur: () => f(!1)
      }
    ) : /* @__PURE__ */ l(
      "button",
      {
        ref: d,
        type: "button",
        className: "dq-pager-page",
        "aria-label": `Page ${e} of ${t}. Go to page`,
        title: "Go to page",
        disabled: t <= 1,
        onClick: () => {
          c(String(e)), i(!0);
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
  return /* @__PURE__ */ l("div", { className: "dq-segmented dq-layout-switch", role: "group", "aria-label": "Review layout", children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        title: "One item at a time",
        "aria-pressed": e === "single",
        disabled: t,
        onClick: () => e !== "single" && n("single"),
        children: [
          /* @__PURE__ */ a(Wl, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Single" })
        ]
      }
    ),
    /* @__PURE__ */ l(
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
function wf({
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
  const [r, i] = I(!1), [o, c] = I(!1), s = $(null), d = $(null), f = Ze();
  Et(() => {
    if (!r || !d.current || !s.current) return;
    const h = s.current.getBoundingClientRect(), m = d.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    c(y < m && h.top > y);
  }, [r]), X(() => {
    var h, m;
    r && ((m = (h = d.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || m.focus({ preventScroll: !0 }));
  }, [r]), X(() => {
    t && i(!1);
  }, [t]);
  const u = (h = !0) => {
    var m;
    i(!1), h && ((m = s.current) == null || m.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const m = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = m.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), u();
    else if (h.key === "Tab")
      u(!1);
    else if (h.key === "ArrowDown" || h.key === "ArrowUp") {
      if (h.preventDefault(), !m.length) return;
      const w = h.key === "ArrowDown" ? 1 : -1;
      m[(y + w + m.length) % m.length].focus();
    } else (h.key === "Home" || h.key === "End") && (h.preventDefault(), (v = m.at(h.key === "Home" ? 0 : -1)) == null || v.focus());
  }, children: [
    /* @__PURE__ */ a(
      "button",
      {
        ref: s,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": r,
        "aria-controls": r ? f : void 0,
        disabled: t,
        onClick: () => i((h) => !h),
        children: /* @__PURE__ */ a(Jl, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ l(le, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => u(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${o ? " dq-menu-list-up" : ""}`,
          children: e.map((h) => /* @__PURE__ */ l(Ji, { children: [
            h.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: h.danger ? "dq-menu-danger" : void 0,
                disabled: h.disabled,
                onClick: () => {
                  u(), h.onSelect();
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
function Ja(e) {
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
      Ja(e.customFieldCriteria).filter(vo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !No(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function So(e, t) {
  const n = Ja(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const i = n.map((o) => {
    if (!vo(o)) return o;
    const c = { ...o };
    for (const [s, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(o[s] ?? "")];
      f && !No(o[d]) && (c[d] = f, r = !0);
    }
    return c;
  });
  return r ? { ...e, customFieldCriteria: i } : e;
}
function Uc(e, t, n) {
  const r = Ja(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Ja(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (f[u] ?? void 0)
  );
  let c = !1;
  const s = r.map((d) => {
    if (!vo(d)) return d;
    const f = i.find((p) => o(p, d));
    if (!f) return d;
    const u = { ...d };
    for (const [p, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const m = t[String(d[p] ?? "")];
      m && d[h] === m && !No(f[h]) && (delete u[h], c = !0);
    }
    return u;
  });
  return c ? { ...e, customFieldCriteria: s } : e;
}
async function vf(e, t, n) {
  if (!_n(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Be(e), i = n.steps.some((s) => Ln(s.mode)) ? await Vd(r) : "", o = await so(n);
  let c = t.applications;
  for (const s of [
    ...o.filter((d) => !Ln(d.mode)),
    ...o.filter((d) => Ln(d.mode))
  ]) {
    const d = (f) => zd(
      i,
      r,
      t.media.id,
      t.performer.id,
      s.tagIds,
      f
    );
    (s.mode === "MARK_PRESENT" || s.mode === "CLEAR_ABSENCE") && await d("REMOVE"), s.mode !== "CLEAR_ABSENCE" && (c = await Vc(
      {
        ...e,
        occurrence: {
          ...e.occurrence,
          tagIds: s.tagIds,
          multiple: !0
        }
      },
      t,
      ["ADD", "MARK_PRESENT"].includes(s.mode) ? s.tagIds : []
    )), s.mode === "MARK_ABSENT" && await d("ADD");
  }
  return c;
}
async function ko(e, t) {
  const n = e.occurrence;
  if (eo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: i, ...o } = n.performerFilter;
  for (let c = 1; ; c++) {
    const s = await be("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        jn({
          findFilter: { page: c, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: o,
          filterExpression: i
        })
      )
    });
    if (s.items.forEach((d) => r.add(d.id)), c * 1e3 >= s.totalCount) return [...r];
    if (!s.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Bc(e) {
  return fa(e.condition) && e.hideConfirmedAbsent !== !1;
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
  }, c = Bc(i) && (t == null ? void 0 : t.length) === 1 && i.conditionTagIds.length === 1 ? `${t[0]}:${i.conditionTagIds[0]}` : null;
  return {
    ...e,
    entityType: Be(e),
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
            ...c ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: ei,
                      type: "text",
                      modifier: "notEquals",
                      value: c
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
    e.conditionTagIds.map((n) => ti([n], t))
  );
}
function Kc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function Nf(e, t, n = e.conditionTagIds.map((r) => [r])) {
  const r = new Set(t), i = (o) => o.some((c) => r.has(c));
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
function qf(e, t, n, r, i) {
  if (!Bc(e)) return !1;
  const o = rc(t, n);
  return e.conditionTagIds.every(
    (c, s) => o.includes(c) || i[s].some((d) => r.includes(d))
  );
}
async function Gc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || Kc(e.occurrence))
    return { items: [], totalCount: 0 };
  const i = Be(e), o = await jr(
    Eo(e, t),
    { ...e.view.filter, page: n },
    r
  ), c = t === null ? null : new Set(t), s = e.occurrence, d = o.items.length ? await Ao(s, r) : [], f = new Array(o.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; u < o.items.length; ) {
        const p = u++, h = o.items[p], m = await be(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[p] = h.performers.filter((y) => c === null || c.has(y.id)).flatMap((y) => {
          const N = m.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return Nf(e.occurrence, v, d) && !qf(s, h, y.id, v, d) ? [
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
async function Vc(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const i = Be(e), o = await za(i, t.media.id);
  if (!o.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${i}. Refresh the queue.`
    );
  const c = `/api/tagapplications?hostType=${i}&hostId=${o.id}&contextType=performer&contextId=${t.performer.id}`, s = (await be(c)).filter(
    (f) => f.hostType === i && f.hostId === o.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      s.some((u) => u.tag.id === f) || await be("/api/tagapplications", {
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
    for (const f of s)
      r.has(f.tag.id) && !d.has(f.tag.id) && await be(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await be(c);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function Vr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function Sf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function yn(e, t, n = !0) {
  var s;
  if (t.occurrence) {
    const d = n ? rc(
      await za(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await be(Sf(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return Pi(f.map((u) => u.tag)), {
      ids: [...new Set(f.map((u) => u.tag.id))],
      names: [...new Set(f.map((u) => u.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await za(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Pi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Va
  ) ?? Va, c = ((s = r.customFields) == null ? void 0 : s[o]) ?? [];
  if (!Array.isArray(c) || c.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: i.map((d) => d.id),
    names: i.map((d) => d.name),
    absent: c,
    tags: i
  };
}
async function Co(e, t, n) {
  if (t.occurrence && $e(e))
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
        `/api/${ar(Be(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function kf(e, t, n) {
  t.occurrence && $e(e) ? await vf(e, t.occurrence, n) : await ac(Be(e), n, [t.media.id]);
}
function _i(e, t, n, r) {
  const i = (o) => o.filter((c) => r.includes(c));
  return {
    item: e,
    before: t,
    after: n,
    tags: Vr(i(t.ids), i(n.ids)),
    absence: Vr(i(t.absent), i(n.absent))
  };
}
function Ef(e, t) {
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
      const i = (n = e.after.applications) == null ? void 0 : n.filter((c) => c.tag.id === r).map((c) => c.id).sort(), o = t.applications.filter((c) => c.tag.id === r).map((c) => c.id).sort();
      if (JSON.stringify(i) !== JSON.stringify(o))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class zc extends Error {
}
const ji = (e) => e instanceof Error ? e.message : "Request failed.", as = (e) => [...e].sort((t, n) => t - n), ma = (e, t) => JSON.stringify(as(e)) === JSON.stringify(as(t)), Ui = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Wa(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const u of t.steps)
    for (const p of u.tagIds)
      u.mode === "ADD" ? o.add(p) : o.delete(p);
  const c = e.some((u) => !o.has(u));
  if (c && !r)
    return { desired: [...e], conflict: c, skipped: !0, kept: [], replaced: [] };
  const s = new Set(
    t.steps.filter((u) => u.mode === "ADD").flatMap((u) => u.tagIds)
  ), d = [], f = [];
  for (const u of n) {
    const p = u.filter((m) => o.has(m) && !i.has(m)), h = u.filter(
      (m) => o.has(m) && i.has(m) && !s.has(m)
    );
    !p.length || !h.length || (r ? (h.forEach((m) => o.delete(m)), f.push(...h)) : (p.forEach((m) => o.delete(m)), d.push({ tagIds: p, existing: h })));
  }
  return { desired: [...o], conflict: c, skipped: !1, kept: d, replaced: f };
}
function Af(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function Cf(e, t, n, r) {
  for (const [i, o] of n.entries()) {
    const c = t.filter(
      (f) => f.steps.some(
        (u) => u.mode === "ADD" && u.tagIds.some((p) => o.includes(p))
      )
    );
    if (c.length < 2) continue;
    const s = e.occurrence.conditionTagIds[i];
    let d = `tag ${s}`;
    try {
      d = (await be(`/api/tags/${s}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new zc(
      `${c.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function Tf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (h) => !_n(h, e.entityType) || !h.steps.length || h.steps.some(
      (m) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(m.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), c = fa(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Ao(i.occurrence, n) : [];
  await Cf(i, o, c, n);
  const s = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await so(h, n)
    }))
  ), d = structuredClone(Af(s));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((h) => h.tagIds),
      ...c.flat()
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
  const u = await ko(i, n), p = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const m = await Gc(i, u, h, n);
    for (const y of m.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Wa(N.ids, d, c, !0);
      p.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: ma(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(p.size), h * 250 >= m.totalCount) break;
    if (h > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: i,
    actions: o,
    action: d,
    categories: c,
    touched: f,
    entries: [...p.values()]
  };
}
function If(e, t, n) {
  const r = (o) => o.ids.filter((c) => n.includes(c));
  if (!ma(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((c) => n.includes(c.tag.id)).map((c) => c.id);
  return ma(i(e), i(t));
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
function Wc(e) {
  return e.entries.filter((t) => t.operation);
}
async function Rf(e, t, n, r, i = !1) {
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
      let c;
      try {
        if (c = await yn(Be(e.review), o.item, !1), !If(o.expected, c, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = ji(h);
        return;
      }
      const s = Wa(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...c.ids.filter((h) => !e.touched.includes(h)),
        ...s.desired.filter((h) => e.touched.includes(h))
      ], f = Vr(c.ids, d);
      if (!f.added.length && !f.removed.length) {
        const h = !o.operation && s.kept.length > 0;
        o.status = o.operation ? "changed" : h ? "skipped" : "unchanged", o.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await Co(e.review, o.item, f);
      } catch (h) {
        u = h;
      }
      let p = !1;
      try {
        const h = await yn(Be(e.review), o.item, !1);
        p = !0, o.expected = h;
        const m = _i(
          o.item,
          o.before,
          h,
          e.touched
        );
        if (o.operation = Ui(m) ? m : void 0, u) throw u;
        if (!ma(
          h.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (h) {
        if (o.status = "failed", o.error = ji(h), !p)
          try {
            const m = await yn(Be(e.review), o.item, !1);
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
async function $f(e, t, n) {
  await Hc(
    Wc(e),
    t,
    async (r) => {
      const i = r.operation;
      if (r.unverified) {
        r.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const o = [...i.tags.added, ...i.tags.removed];
      let c = !1;
      try {
        const s = await yn(Be(e.review), r.item, !1);
        Ef(i, s), c = !0, await Co(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await yn(Be(e.review), r.item, !1);
        if (!ma(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (s) {
        if (r.error = `Undo stopped: ${ji(s)}`, r.status = "failed", c)
          try {
            const d = await yn(Be(e.review), r.item, !1), f = _i(
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
const Qc = (e, t) => t.count - e.count || ic(e, t);
async function Of(e, t, n) {
  const r = Be(e), i = e.occurrence, [o, c] = await Promise.all([
    be(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ao(i, n)
  ]), s = o.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Pi(s.map((y) => y.tag));
  const d = await Promise.all(
    c.map(async (y, N) => {
      const v = i.conditionTagIds[N];
      return (await be(`/api/tags/${v}`, { signal: n })).name;
    })
  ), f = new Set(c.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...i.tagIds
    ].filter((y) => !f.has(y))
  ), p = (y) => {
    const N = /* @__PURE__ */ new Map();
    for (const v of s) {
      if (!y.has(v.tag.id)) continue;
      const w = N.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), N.set(v.tag.id, w);
    }
    return [...N.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Qc);
  }, h = c.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: p(new Set(y))
  }));
  u.size && h.push({
    id: null,
    name: c.length ? "Other review tags" : "Review tags",
    members: [...u],
    tags: p(u)
  });
  const m = /* @__PURE__ */ new Set([...f, ...u]);
  return {
    answered: new Set(
      s.filter((y) => m.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: h
  };
}
function Mf(e, t, n, r) {
  const i = /* @__PURE__ */ new Set([e, ...t]), o = (c) => {
    if (c === e) return !0;
    const s = r.get(c);
    if (!s) return !1;
    const d = new Set(s);
    return [...i].every((f) => d.has(f));
  };
  return n.some(
    (c) => [...rr(c)].some((s) => i.has(s)) && c.steps.some(
      (s) => s.mode === "REMOVE_TREE" && s.tagIds.some(o)
    )
  );
}
function To(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const m of e.groups) for (const y of m.tags) r.set(y.id, y);
  const i = (m) => m.flatMap((y) => r.get(y) ?? []).sort(Qc), o = (m) => m.members ?? m.tags.map((y) => y.id), c = Er(t).flatMap((m) => {
    const y = [
      ...new Set(m.actions.flatMap((N) => [...rr(t[N])]))
    ];
    return y.length ? [{ ...m, answers: y, tags: i(y) }] : [];
  }), s = (m) => m.tags.length > 1 ? [m] : [], d = e.groups.filter((m) => m.id !== null).map((m) => {
    const y = `tag:${m.id}`, N = o(m), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: m.name,
      members: N,
      tags: m.tags,
      mixed: Mf(m.id, N, t, n) ? s({ key: y, name: m.name, members: N, tags: m.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        c.filter((w) => w.answers.every((T) => v.has(T))).flatMap(
          (w) => s({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), f = d.map((m) => new Set(m.members)), u = /* @__PURE__ */ new Set();
  for (const m of c) {
    if (f.some((N) => m.answers.every((v) => N.has(v)))) continue;
    m.answers.forEach((N) => u.add(N));
    const y = `group:${m.key}`;
    d.push({
      key: y,
      kind: "group",
      name: m.name,
      members: m.answers,
      tags: m.tags,
      // An answer group is one question: it takes one answer.
      mixed: s({ key: y, name: m.name, members: m.answers, tags: m.tags })
    });
  }
  const p = e.groups.find((m) => m.id === null), h = (p == null ? void 0 : p.tags.filter((m) => !u.has(m.id))) ?? [];
  return p && h.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: o(p).filter((m) => !u.has(m)),
    tags: h,
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
    e == null ? void 0 : e.actions.map((s) => s.steps)
  ]), [o, c] = I({
    key: i,
    value: yi
  });
  return X(() => {
    if (c((d) => d.key === i ? d : { key: i, value: yi }), e === null || t === null) return;
    const s = new AbortController();
    return Of(e, t, s.signal).then((d) => {
      s.signal.aborted || c({ key: i, value: { summary: d, error: "" } });
    }).catch((d) => {
      s.signal.aborted || c((f) => ({
        key: i,
        value: {
          summary: f.key === i ? f.value.summary : null,
          error: d instanceof Error ? d.message : "Request failed."
        }
      }));
    }), () => s.abort();
  }, [i, n]), o.key === i ? o.value : yi;
}
function Ff(e, t) {
  const n = (f) => {
    var u;
    return ((u = f.tagIds) == null ? void 0 : u.every((p) => e.members.includes(p))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const u = tu(f, t).filter((h) => h.key !== e.key), p = f.key === e.key ? [] : u.filter(n);
    p.length ? p.forEach((h) => r.add(h.name)) : u.forEach((h) => i.add(h.name));
  }
  const o = vt(e.name), c = [...r].filter((f) => vt(f) !== o), s = c.length < r.size, d = i.size ? ` (${s ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
  return { names: c, here: s || i.size > 0, note: d };
}
function xf(e, { names: t, here: n, note: r }) {
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
  className: c = ""
}) {
  const s = Rn(n), d = (h) => `${h.toLocaleString()} ${h === 1 ? s.one : s.many}`, f = e ? To(e, r, i) : [], u = uo(f), p = (h) => [
    ...new Set(
      o.filter((m) => {
        var y;
        return (y = m.tagIds) == null ? void 0 : y.some((N) => h.includes(N));
      }).flatMap((m) => m.flags)
    )
  ];
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${c}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((h) => {
          const m = h.kind === "other" ? [] : p(h.members), y = Ff(h, u), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: xf(h, y),
                  children: [
                    /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ l("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      N,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
                    ] }) : N
                  ]
                }
              ),
              m.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${m.join(", ")}`,
                  children: [
                    /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      m.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Ht, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                d(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, h.key);
        }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Br({
  performer: e
}) {
  return /* @__PURE__ */ l("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
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
function Pf(e, t) {
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
function Lf(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((r, i) => {
    const o = window.setTimeout(r, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(o), i(t.reason);
      },
      { once: !0 }
    );
  });
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
], Df = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, wi = 250;
function ca(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function _f({ step: e }) {
  const t = Ki.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ki.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(zr, {}) : r + 1 }),
      n.label,
      i === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function cs({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ l(Ji, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function sa({
  value: e,
  label: t,
  detail: n,
  tone: r,
  pressed: i,
  onToggle: o
}) {
  return /* @__PURE__ */ l(
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
        n && /* @__PURE__ */ l(le, { children: [
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
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": r, children: [
    Sr(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Ht, { tag: i })
    ] }) }, `added-${i.id}`)),
    Sr(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ a(Ht, { tag: i })
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
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > wi && /* @__PURE__ */ l("span", { children: [
        "First ",
        wi.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ l("table", { children: [
      /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ l("tr", { children: [
        /* @__PURE__ */ a("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ a("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ a("th", { scope: "col", children: r })
      ] }) }),
      /* @__PURE__ */ a("tbody", { children: t.slice(0, wi).map((o) => {
        var c;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ a("td", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${n}/${o.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (c = o.item.occurrence) == null ? void 0 : c.performer.name,
                " — ",
                ca(o, n)
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
function jf(e) {
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
      const c = `${o.status}\0${o.error}`, s = n.get(c) ?? { status: o.status, error: o.error, count: 0 };
      s.count += 1, n.set(c, s);
    }
  return { counts: t, reasons: [...n.values()], recorded: r, retryable: i };
}
function Uf({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: i,
  onClose: o,
  onWrite: c
}) {
  const [s, d] = I(!1), [f, u] = I("answers"), [p, h] = I(null), [m, y] = I({}), [N, v] = I([]), [w, T] = I(!1), [R, x] = I(!1), [K, E] = I(""), [_, P] = I(!1), [se, H] = I(""), [j, z] = I(null), [O, D] = I(null), [L, Y] = I([]), [W, re] = I(0), J = $(null), S = $(null), ie = $(null), A = $(!1), Q = $(!1), oe = $(null), me = $(!1), G = $(0), we = $(!1), Ce = $({ onClose: o, onWrite: c });
  Ce.current = { onClose: o, onWrite: c };
  const pe = Ze(), Oe = f === "run", Ke = (j == null ? void 0 : j.kind) === "undo", Ae = Oe && p ? p.review : e, $n = Hr(Ae.actions), Ne = Ae.occurrence, Je = Be(Ae), At = Rn(Je), wn = At.queue, Pe = Oe && p ? p.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !er(C))
  ), at = Pe.filter((C) => N.includes(C.id)), Ie = Ne.targetMode === "selected" && Ne.performerIds.length === 1, Ve = Yc(
    Ae,
    s && Ie ? Ne.performerIds[0] : null,
    W
  ), Jt = qo(Ae.view.objectFilter), Fe = qa(
    s ? [...ni(Pe), ...Ne.conditionTagIds, ...Jt] : []
  ), On = ye(() => wc(Fe), [Fe]), ut = (C) => m[C] ?? Fe[C] ?? { id: C, name: `Tag ${C}` }, Pt = JSON.stringify(
    Object.fromEntries(
      Jt.flatMap((C) => {
        var Z;
        const B = (Z = Fe[C]) == null ? void 0 : Z.name;
        return B ? [[String(C), B]] : [];
      })
    )
  ), it = ye(
    () => So(Ae.view.objectFilter, JSON.parse(Pt)),
    [Ae.view.objectFilter, Pt]
  );
  X(() => {
    var C, B, Z;
    s && ((C = J.current) == null || C.showModal(), (Z = (B = J.current) == null ? void 0 : B.querySelector(".dq-batch-answer input")) == null || Z.focus());
  }, [s]), X(() => {
    if (!s) return;
    const C = requestAnimationFrame(() => {
      var ue;
      const B = J.current, Z = document.activeElement;
      if (!B || Z && Z !== document.body && B.contains(Z)) return;
      (ue = (f === "answers" ? B.querySelector(".dq-batch-answer input:checked") ?? B.querySelector(".dq-batch-answer input") : B.querySelector("[data-batch-focus]")) ?? S.current) == null || ue.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [s, f, R, p]), X(() => {
    if (s || t || !A.current) return;
    const C = requestAnimationFrame(() => {
      const B = ie.current;
      if (!A.current || !B || B.disabled) return;
      A.current = !1;
      const Z = document.activeElement;
      (!Z || Z === document.body) && B.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [s, t]), X(() => {
    if (!s || Ne.targetMode !== "selected") return;
    const C = new AbortController();
    return Y([]), Pf(Ne.performerIds.slice(0, is), C.signal).then((B) => {
      C.signal.aborted || Y(B);
    }).catch(() => {
    }), () => C.abort();
  }, [s, Ne.targetMode, JSON.stringify(Ne.performerIds)]), X(
    () => () => {
      var C;
      Q.current = !0, (C = oe.current) == null || C.abort();
    },
    []
  ), X(() => {
    if (!R) return;
    const C = (B) => {
      B.preventDefault(), B.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [R]);
  function Wt() {
    u("answers"), h(null), y({}), z(null), T(!1), v([]), H(""), E(""), P(!1), D(null);
  }
  function qt() {
    we.current || (d(!1), Ce.current.onClose(me.current), me.current = !1, Wt(), A.current = !0);
  }
  function ir(C, B) {
    v(
      (Z) => B ? [...Z, C] : Z.filter((ve) => ve !== C)
    ), h(null), y({}), H(""), E(""), P(!1), D(null);
  }
  function Rt() {
    u("answers"), D(null), H("");
  }
  function Mn() {
    u("preview"), p || Se();
  }
  function Qt() {
    var C;
    Q.current = !0, (C = oe.current) == null || C.abort(), H("Stopping after in-flight operations settle…");
  }
  function Lt(C) {
    D(
      (B) => (B == null ? void 0 : B.group) === C.group && B.reason === C.reason ? null : C
    );
  }
  const vn = (C, B) => (O == null ? void 0 : O.group) === C && O.reason === B;
  async function Se() {
    if (!at.length || we.current) return;
    we.current = !0, x(!0), E(""), P(!1), H("Loading all matching occurrences…"), h(null), y({}), D(null);
    const C = new AbortController();
    oe.current = C;
    try {
      await Lf(G.current, C.signal);
      const B = await Tf(
        e,
        at,
        C.signal,
        (ve) => H(`Loaded ${ve.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const Z = {};
      for (const ve of B.entries)
        for (const ue of ve.before.applications ?? [])
          Z[ue.tag.id] = ue.tag;
      y(Z), h(B), H("Preview ready. No tags have been changed.");
    } catch (B) {
      E(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : B instanceof Error ? B.message : String(B)
      ), P(!C.signal.aborted && B instanceof zc), H("");
    } finally {
      we.current = !1, x(!1), oe.current = null;
    }
  }
  async function Ct(C) {
    if (!p || we.current) return;
    const B = (C === "undo" ? Wc(p) : Jc(p, C === "retry")).length;
    we.current = !0, Q.current = !1, me.current = !0, Ce.current.onWrite(), x(!0), u("run"), E(""), z({ kind: C, total: B, done: 0, stopped: !1 }), H(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const Z = () => z((ue) => ue && { ...ue, done: ue.done + 1 });
    let ve = !1;
    try {
      C === "undo" ? await $f(p, () => Q.current, Z) : await Rf(p, w, () => Q.current, Z, C === "retry"), H(
        Q.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (ue) {
      ve = !0, H(""), E(ue instanceof Error ? ue.message : String(ue));
    } finally {
      G.current = Date.now(), we.current = !1;
      const ue = Q.current || ve;
      z((Re) => Re && { ...Re, stopped: ue }), x(!1), re((Re) => Re + 1);
    }
  }
  const ot = (p == null ? void 0 : p.entries) ?? [], Un = ye(
    () => new Map(
      ((p == null ? void 0 : p.entries) ?? []).map((C) => [
        C.item.key,
        Wa(C.before.ids, p.action, p.categories, w)
      ])
    ),
    [p, w]
  ), Yt = (C) => Un.get(C.item.key), Le = (C) => Vr(C.before.ids, Yt(C).desired), $t = (C) => {
    const B = Le(C);
    return C.status === "pending" && (B.added.length > 0 || B.removed.length > 0);
  }, de = (C) => C.conflict || Yt(C).kept.length > 0 || Yt(C).replaced.length > 0, U = ye(() => {
    const C = (p == null ? void 0 : p.entries) ?? [];
    return {
      willChange: C.filter($t).length,
      correct: C.filter((B) => B.status === "unchanged").length,
      different: C.filter(de).length,
      hosts: new Set(C.map((B) => B.item.media.id)).size,
      added: [...new Set(C.flatMap((B) => Le(B).added))],
      removed: [...new Set(C.flatMap((B) => Le(B).removed))]
    };
  }, [Un]), ke = ye(
    () => ((p == null ? void 0 : p.entries) ?? []).filter((C) => C.item.media.date).sort((C, B) => C.item.media.date.localeCompare(B.item.media.date)),
    [p]
  ), ft = Oe ? jf(ot) : null, Bn = (C) => $n.keys[Ae.actions.findIndex((B) => B.id === C)] ?? "", ce = (C) => Cr(C, On, [], r), Ot = fa(Ne.condition) && Ne.includeSubtags !== !1 && Ne.conditionTagIds.length > 0, et = ke[0], De = ke.length > 1 ? ke[ke.length - 1] : void 0, Xe = (C) => `/${Je}/${C.item.media.id}`, Xt = Ie ? L[0] : void 0, st = ye(
    () => n ? uc(
      n,
      Ve.summary ? uo(
        To(Ve.summary, Ae.actions, r ?? $i)
      ) : []
    ) : [],
    [n, Ve.summary, Ae.actions, r]
  ), mt = ru(at, st, r ?? $i), Dt = n ?? [], Zt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: $t },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: de }
  };
  function ct() {
    const C = Df[Ne.condition], B = !!C && Ne.conditionTagIds.length > 0, Z = Ne.performerIds.slice(0, is), ve = String(Ae.view.filter.q ?? "").trim(), ue = Ne.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      eo(Ne) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : Ne.targetMode === "selected" ? /* @__PURE__ */ l(le, { children: [
        Z.map((Re, Te) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Br, { performer: { id: Re, name: L[Te] ?? "" } }),
          L[Te] ?? "…"
        ] }, Re)),
        Ne.performerIds.length > Z.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (Ne.performerIds.length - Z.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(le, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              ua,
              {
                filter: {},
                objectFilter: Ne.performerFilter,
                criteriaDefinitions: Wi,
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
      /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        B ? C : Xi[Ne.condition],
        B && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: Sr(Ne.conditionTagIds.map(ut)).map((Re) => /* @__PURE__ */ a(Ht, { tag: Re }, Re.id)) })
      ] }),
      B && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: Ne.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      fa(Ne.condition) && Ne.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: ue, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          ue
        ] })
      ] }),
      ve && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        ve,
        "”"
      ] }),
      Object.keys(Ae.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${wn} filters`,
          children: /* @__PURE__ */ a(
            ua,
            {
              filter: Ae.view.filter,
              objectFilter: it,
              criteriaDefinitions: Je === "audio" ? Ts : Qa,
              customFieldEntityType: Je,
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
  function Kn(C, B, Z = !0) {
    if (!C.length) return null;
    const ve = /* @__PURE__ */ a("strong", { children: Xt || "This performer" }), ue = Z ? `Check the earliest and latest ${At.many} before applying, or narrow the batch with a date filter.` : "", Re = C.every((Te) => Te.tagIds === null && !Te.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Re ? /* @__PURE__ */ l("p", { children: [
          ve,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: C.flatMap((Te) => Te.flags).join(", ") }),
          ".",
          " ",
          ue
        ] }) : /* @__PURE__ */ l(le, { children: [
          /* @__PURE__ */ l("p", { children: [
            ve,
            " needs attention where the chosen answers apply.",
            ue && ` ${ue}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: C.map((Te) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("strong", { children: Te.tagIds === null ? "Whole review" : Te.name }),
            ":",
            " ",
            fo(Te).join("; ")
          ] }, Te.key)) })
        ] }),
        B && et && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: Xe(et), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ca(et, Je),
            " · ",
            et.item.media.date
          ] }),
          De && /* @__PURE__ */ l("a", { href: Xe(De), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ca(De, Je),
            " · ",
            De.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function en() {
    const C = mt.filter((Z) => Z.tagIds === null), B = mt.filter((Z) => Z.tagIds !== null);
    return /* @__PURE__ */ l(le, { children: [
      ct(),
      Kn(C, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Ie ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Pe.map((Z, ve) => {
            const ue = Bn(Z.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: N.includes(Z.id),
                  "aria-labelledby": `${pe}-answer-${ve}`,
                  "aria-describedby": `${pe}-effect-${ve}`,
                  onChange: (Re) => ir(Z.id, Re.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: ue && /* @__PURE__ */ a(Nt, { binding: ue, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${pe}-answer-${ve}`,
                    className: "dq-batch-answer-label",
                    title: Z.label,
                    children: Z.label
                  }
                ),
                /* @__PURE__ */ a(cs, { id: `${pe}-effect-${ve}`, parts: ce(Z) })
              ] })
            ] }, Z.id);
          }) })
        ] }),
        Ie && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: Kn(B, !1, C.length === 0) }),
          /* @__PURE__ */ a(
            Bi,
            {
              ...Ve,
              mediaKind: Je,
              actions: Ae.actions,
              trees: r,
              flags: Dt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Gn(C) {
    const B = U, Z = O && os.has(O.group) ? O.group : null, ve = Z ? ot.filter(Zt[Z].test) : [], ue = (Re) => {
      const Te = Yt(Re), jt = Te.skipped ? Vr(
        Re.before.ids,
        Wa(Re.before.ids, C.action, C.categories, !0).desired
      ) : Le(Re), ge = !jt.added.length && !jt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Te.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        ge ? !Te.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ls, { added: jt.added, removed: jt.removed, tag: ut }),
        Te.kept.map((Ee, qe) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          Sr(Ee.existing.map(ut)).map((Ut) => /* @__PURE__ */ a(Ht, { tag: Ut }, Ut.id)),
          " ",
          "instead of",
          " ",
          Sr(Ee.tagIds.map(ut)).map((Ut) => /* @__PURE__ */ a(Ht, { tag: Ut }, Ut.id))
        ] }, qe))
      ] });
    };
    return /* @__PURE__ */ l(le, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            sa,
            {
              value: ot.length,
              label: ot.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${B.hosts.toLocaleString()} ${B.hosts === 1 ? wn : `${wn}s`}`,
              pressed: vn("matching"),
              onToggle: () => Lt({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            sa,
            {
              value: B.willChange,
              label: "will change",
              tone: "add",
              pressed: vn("change"),
              onToggle: () => Lt({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            sa,
            {
              value: B.correct,
              label: "already correct, no write",
              pressed: vn("correct"),
              onToggle: () => Lt({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            sa,
            {
              value: B.different,
              label: w ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: vn("different"),
              onToggle: () => Lt({ group: "different" })
            }
          )
        ] }),
        ve.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: Zt[Z].title,
            entries: ve,
            mediaKind: Je,
            resultHeading: "Planned change",
            describe: ue
          }
        ) : ot.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        ot.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: et ? `Dates ${et.item.media.date}${De ? ` to ${De.item.media.date}` : ""}` : "No dates" }),
          et && /* @__PURE__ */ a(
            "a",
            {
              href: Xe(et),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${At.one}, ${et.item.media.date}`,
              title: ca(et, Je),
              children: "Open earliest"
            }
          ),
          De && /* @__PURE__ */ a(
            "a",
            {
              href: Xe(De),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${At.one}, ${De.item.media.date}`,
              title: ca(De, Je),
              children: "Open latest"
            }
          ),
          ke.length < ot.length && /* @__PURE__ */ l("span", { children: [
            (ot.length - ke.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (B.added.length > 0 || B.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            ls,
            {
              added: B.added,
              removed: B.removed,
              tag: ut,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      B.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${pe}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${pe}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !w, onClick: () => T(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": w, onClick: () => T(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ l("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          Ot ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function _t() {
    return /* @__PURE__ */ l(le, { children: [
      ct(),
      Kn(mt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Ie ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${pe}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${pe}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: R, onClick: Rt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: at.map((C) => {
            const B = Bn(C.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                B && /* @__PURE__ */ a(Nt, { binding: B, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ a(cs, { parts: ce(C) })
            ] }, C.id);
          }) })
        ] }),
        Ie && /* @__PURE__ */ a(
          Bi,
          {
            ...Ve,
            mediaKind: Je,
            actions: Ae.actions,
            trees: r,
            flags: Dt,
            className: "dq-batch-card"
          }
        )
      ] }),
      R ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : p && Gn(p)
    ] });
  }
  function Nn(C) {
    const B = j ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, Z = B.kind === "apply" ? ot.length - C.counts.pending : B.done, ve = B.kind === "apply" ? ot.length : B.total, ue = R ? B.kind === "undo" ? "Undoing batch…" : B.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : B.kind === "undo" ? B.stopped ? "Undo stopped" : "Undo finished" : B.stopped ? "Stopped" : "Finished", Re = ve ? Math.round(Z / ve * 100) : 100, Te = O && !os.has(O.group) ? O.group : null, jt = (Ee) => ss.find((qe) => qe.status === Ee).label, ge = Te ? ot.filter(
      (Ee) => Ee.status === Te && (!O.reason || Ee.error === O.reason)
    ) : [];
    return /* @__PURE__ */ l(le, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: ue }),
          /* @__PURE__ */ l("span", { children: [
            Z.toLocaleString(),
            " of ",
            ve.toLocaleString(),
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
            "aria-valuemax": ve,
            "aria-valuenow": Z,
            children: /* @__PURE__ */ a("span", { style: { width: `${Re}%` } })
          }
        ),
        !R && B.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (B.total - C.recorded).toLocaleString(),
          " of",
          " ",
          B.total.toLocaleString(),
          " ",
          B.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ss.map((Ee) => /* @__PURE__ */ a(
          sa,
          {
            value: C.counts[Ee.status],
            label: Ee.label,
            tone: Ee.tone,
            pressed: vn(Ee.status),
            onToggle: () => Lt({ group: Ee.status })
          },
          Ee.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: C.reasons.map((Ee) => {
          const qe = vn(Ee.status, Ee.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              Ee.count.toLocaleString(),
              " ",
              Ee.status,
              ": ",
              Ee.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": qe,
                onClick: () => Lt({ group: Ee.status, reason: Ee.error }),
                children: qe ? "Hide them" : "Show them"
              }
            )
          ] }, `${Ee.status}-${Ee.error}`);
        }) }),
        ge.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: O.reason ? `${jt(Te)}: ${O.reason}` : `${jt(Te)} occurrences`,
            entries: ge,
            mediaKind: Je,
            resultHeading: "Result",
            describe: (Ee) => Ee.error ?? jt(Ee.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: R,
            onClick: () => void Ct("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          Ke ? B.stopped || R ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function tn() {
    return f === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !at.length,
        onClick: Mn,
        children: "Preview all matches"
      },
      "preview"
    ) : f === "preview" ? R ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Qt, children: "Cancel preview" }, "cancel-preview") : p ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !U.willChange,
        onClick: () => void Ct("apply"),
        children: [
          "Apply to ",
          U.willChange.toLocaleString(),
          " ",
          U.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : _ ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Rt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void Se(),
        children: "Preview again"
      },
      "again"
    ) : R ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Qt, children: Ke ? "Cancel undo" : "Cancel run" }, "cancel-run") : Ke || !ft ? null : /* @__PURE__ */ l(Ji, { children: [
      ft.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void Ct("retry"), children: "Retry failed" }),
      ft.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void Ct("apply"),
          children: "Continue"
        }
      )
    ] }, "after-run");
  }
  return /* @__PURE__ */ l(Zu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: ie,
        title: "Apply answers to all matching occurrences",
        disabled: t || !Pe.length,
        onClick: () => {
          Wt(), i(), d(!0);
        },
        children: [
          /* @__PURE__ */ a(Do, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    s && /* @__PURE__ */ l(
      "dialog",
      {
        ref: J,
        className: "dq-batch-dialog",
        "aria-labelledby": `${pe}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), qt();
        },
        onClose: () => {
          var C;
          we.current ? (C = J.current) == null || C.showModal() : qt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Do, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${pe}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: R,
                onClick: qt,
                children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(_f, { step: f }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: S,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": f === "preview" ? "" : void 0,
              "aria-label": `${Ki.find((C) => C.id === f).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  se && /* @__PURE__ */ a("p", { role: "status", children: se }),
                  K && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: K })
                ] }),
                f === "answers" ? en() : f === "preview" ? _t() : Nn(ft)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            f === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: R, onClick: Rt, children: [
              /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
              "Back"
            ] }),
            f === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: R, onClick: Wt, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: R, onClick: qt, children: "Close" }),
            tn()
          ] })
        ]
      }
    )
  ] });
}
const Xc = "data-quality.description-collapsed.v1";
function Bf() {
  try {
    return localStorage.getItem(Xc) === "true";
  } catch {
    return !1;
  }
}
function Kf({
  details: e,
  label: t
}) {
  const [n, r] = I(Bf), i = Tn(() => {
    r((o) => {
      const c = !o;
      try {
        localStorage.setItem(Xc, String(c));
      } catch {
      }
      return c;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
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
const Gf = (e) => "";
function Vf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: i,
  labels: o,
  flagLabel: c = Gf,
  onFocus: s,
  onMore: d,
  onRefresh: f
}) {
  var h;
  const u = e ? e.ranked.slice(0, e.limit) : [], p = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
        "Counting matching ",
        o.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: u.length ? `Most matching ${o.queue}s first` : `No performer has matching ${o.many}.` }) : null,
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
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: u.map((m) => {
      const y = `${m.count.toLocaleString()} matching ${m.count === 1 ? o.one : o.many}`, N = c(m.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${m.name}, ${y}${N ? `. ${N}` : ""}`,
          title: N || void 0,
          "aria-current": r === m.id ? "true" : void 0,
          disabled: i,
          onClick: () => s(m.id),
          children: [
            /* @__PURE__ */ a(Br, { performer: m }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m.name }),
            N && /* @__PURE__ */ a(Dn, { className: "dq-flag-icon", "aria-hidden": "true" }),
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
        disabled: i,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const zf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Hf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Jf(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), i = t.bottom + 8;
  return { top: i, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - i - 16) };
}
function Da(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Wf(e, t) {
  const n = eo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (o) => t[o] === void 0 ? "…" : t[o] ?? "Unavailable tag"
  ), i = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Da(r, "or")}`,
    includesAll: `has ${Da(r, "and")}`,
    excludes: `has none of ${Da(r, "or")}`,
    excludesAll: `missing ${Da(r, "or")}`
  };
  return `${n} · ${i[e.condition]}`;
}
function Qf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, c] = I(!1), [s, d] = I(null), f = $(null), u = $(null), p = Ze(), h = Jr(e.conditionTagIds), m = Wf(e, h);
  Et(() => {
    const w = f.current;
    if (!o || !w) return;
    const T = () => d(Jf(w));
    T(), window.addEventListener("resize", T);
    const R = typeof ResizeObserver > "u" ? null : new ResizeObserver(T), x = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const K of x) K && (R == null || R.observe(K));
    return () => {
      window.removeEventListener("resize", T), R == null || R.disconnect();
    };
  }, [o]), X(() => {
    var T, R;
    if (!o) return;
    const w = (T = u.current) == null ? void 0 : T.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (R = u.current) == null || R.focus();
  }, [o]);
  const y = () => {
    c(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, N = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== u.current || w.defaultPrevented || ln(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && u.current) {
        const R = [...u.current.querySelectorAll(Hf)].filter((_) => _.closest('[role="dialog"]') === u.current).sort(
          (_, P) => _.compareDocumentPosition(P) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!R.length) return;
        const x = R[0], K = R[R.length - 1], E = document.activeElement;
        w.shiftKey && (E === x || E === u.current) ? (w.preventDefault(), K.focus()) : !w.shiftKey && E === K && (w.preventDefault(), x.focus());
      }
    }
  }, v = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        "aria-controls": o ? p : void 0,
        title: m,
        onClick: () => o ? y() : c(!0),
        children: [
          /* @__PURE__ */ a(xs, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: m }),
          /* @__PURE__ */ a(Qi, { "aria-hidden": "true" })
        ]
      }
    ),
    o && /* @__PURE__ */ l(le, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: u,
          id: p,
          role: "dialog",
          "aria-label": "Queue scope",
          className: "dq-scope-popover",
          tabIndex: -1,
          style: s ? {
            top: s.top,
            left: s.left,
            width: s.width,
            maxHeight: s.maxHeight
          } : void 0,
          onKeyDown: N,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: zf.map(({ mode: w, label: T }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: T
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                tr,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => r({ performerIds: w }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ l("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ a("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ a(
                  ua,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Wi,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: i, children: [
                  /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
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
              v && /* @__PURE__ */ l(le, { children: [
                /* @__PURE__ */ a(
                  tr,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => r({ conditionTagIds: w }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ l("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
                  fa(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ a("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function Ba(e) {
  const {
    page: t,
    perPage: n,
    sort: r,
    direction: i,
    sorts: o,
    seed: c,
    ...s
  } = e.view.filter, {
    performerFlags: d,
    flagPerformerTagIds: f,
    ...u
  } = e.occurrence;
  return JSON.stringify([
    e.entityType,
    s,
    e.view.objectFilter,
    e.view.searchMode,
    u
  ]);
}
function Yf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Be(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Xf(e, t) {
  const n = Be(e) === "audio", r = (c) => ({
    id: c.id,
    name: c.name,
    total: (n ? c.audioCount : c.videoCount) ?? 0,
    tags: (c.tags ?? []).map((s) => ({ id: s.id, name: s.name }))
  }), i = e.occurrence, o = [];
  if (i.targetMode === "selected" && i.performerIds.length > 0)
    for (const c of i.performerIds) {
      const s = await xd(
        `/api/performers/${c}`,
        { signal: t }
      );
      s && o.push(r(s));
    }
  else {
    const { _filterExpression: c, ...s } = i.targetMode === "filter" ? i.performerFilter : {};
    for (let d = 1; ; d++) {
      const f = await be(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            jn({
              findFilter: {
                page: d,
                perPage: 1e3,
                sort: n ? "audio_count" : "video_count",
                direction: "desc"
              },
              objectFilter: s,
              filterExpression: c
            })
          )
        }
      );
      if (o.push(...f.items.map(r)), d * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return o.sort((c, s) => s.total - c.total || c.id - s.id);
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
async function Zf(e, t, n, r, i = {}) {
  const o = Ba(e), c = Yf(e), s = Kc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: s ? "" : c,
    candidates: s ? [] : (t == null ? void 0 : t.candidatesKey) === c ? t.candidates : await Xf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, u = [...d.ranked];
  let p = d.cursor, h = !1;
  const m = (y) => ({
    ...d,
    cursor: p,
    ranked: [...u],
    limit: n,
    complete: !y && Gi(f, p, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !Gi(f, p, u, n); ) {
          r.throwIfAborted();
          const N = f[p++], v = await Zc(e, N.id, r);
          v > 0 && el(u, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, m(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), m(!1);
}
function ep(e, t, n) {
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
function tp(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function tl(e, t) {
  const n = tp(t);
  return Vi.set(e, n), n;
}
function np(e) {
  const [t, n] = I(null);
  if (X(() => {
    if (e === null || Vi.has(e)) return;
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
    return Vi.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
var vi = { exports: {} }, us;
function rp() {
  return us || (us = 1, (function(e) {
    var t = (function() {
      var n = String.fromCharCode, r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", o = {};
      function c(d, f) {
        if (!o[d]) {
          o[d] = {};
          for (var u = 0; u < d.length; u++)
            o[d][d.charAt(u)] = u;
        }
        return o[d][f];
      }
      var s = {
        compressToBase64: function(d) {
          if (d == null) return "";
          var f = s._compress(d, 6, function(u) {
            return r.charAt(u);
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
          return d == null ? "" : d == "" ? null : s._decompress(d.length, 32, function(f) {
            return c(r, d.charAt(f));
          });
        },
        compressToUTF16: function(d) {
          return d == null ? "" : s._compress(d, 15, function(f) {
            return n(f + 32);
          }) + " ";
        },
        decompressFromUTF16: function(d) {
          return d == null ? "" : d == "" ? null : s._decompress(d.length, 16384, function(f) {
            return d.charCodeAt(f) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(d) {
          for (var f = s.compress(d), u = new Uint8Array(f.length * 2), p = 0, h = f.length; p < h; p++) {
            var m = f.charCodeAt(p);
            u[p * 2] = m >>> 8, u[p * 2 + 1] = m % 256;
          }
          return u;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(d) {
          if (d == null)
            return s.decompress(d);
          for (var f = new Array(d.length / 2), u = 0, p = f.length; u < p; u++)
            f[u] = d[u * 2] * 256 + d[u * 2 + 1];
          var h = [];
          return f.forEach(function(m) {
            h.push(n(m));
          }), s.decompress(h.join(""));
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(d) {
          return d == null ? "" : s._compress(d, 6, function(f) {
            return i.charAt(f);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(d) {
          return d == null ? "" : d == "" ? null : (d = d.replace(/ /g, "+"), s._decompress(d.length, 32, function(f) {
            return c(i, d.charAt(f));
          }));
        },
        compress: function(d) {
          return s._compress(d, 16, function(f) {
            return n(f);
          });
        },
        _compress: function(d, f, u) {
          if (d == null) return "";
          var p, h, m = {}, y = {}, N = "", v = "", w = "", T = 2, R = 3, x = 2, K = [], E = 0, _ = 0, P;
          for (P = 0; P < d.length; P += 1)
            if (N = d.charAt(P), Object.prototype.hasOwnProperty.call(m, N) || (m[N] = R++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(m, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (p = 0; p < x; p++)
                    E = E << 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++;
                  for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                    E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
                } else {
                  for (h = 1, p = 0; p < x; p++)
                    E = E << 1 | h, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = 0;
                  for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                    E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
                }
                T--, T == 0 && (T = Math.pow(2, x), x++), delete y[w];
              } else
                for (h = m[w], p = 0; p < x; p++)
                  E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
              T--, T == 0 && (T = Math.pow(2, x), x++), m[v] = R++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (p = 0; p < x; p++)
                  E = E << 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++;
                for (h = w.charCodeAt(0), p = 0; p < 8; p++)
                  E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
              } else {
                for (h = 1, p = 0; p < x; p++)
                  E = E << 1 | h, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = 0;
                for (h = w.charCodeAt(0), p = 0; p < 16; p++)
                  E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
              }
              T--, T == 0 && (T = Math.pow(2, x), x++), delete y[w];
            } else
              for (h = m[w], p = 0; p < x; p++)
                E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
            T--, T == 0 && (T = Math.pow(2, x), x++);
          }
          for (h = 2, p = 0; p < x; p++)
            E = E << 1 | h & 1, _ == f - 1 ? (_ = 0, K.push(u(E)), E = 0) : _++, h = h >> 1;
          for (; ; )
            if (E = E << 1, _ == f - 1) {
              K.push(u(E));
              break;
            } else _++;
          return K.join("");
        },
        decompress: function(d) {
          return d == null ? "" : d == "" ? null : s._decompress(d.length, 32768, function(f) {
            return d.charCodeAt(f);
          });
        },
        _decompress: function(d, f, u) {
          var p = [], h = 4, m = 4, y = 3, N = "", v = [], w, T, R, x, K, E, _, P = { val: u(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            p[w] = w;
          for (R = 0, K = Math.pow(2, 2), E = 1; E != K; )
            x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
          switch (R) {
            case 0:
              for (R = 0, K = Math.pow(2, 8), E = 1; E != K; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
              _ = n(R);
              break;
            case 1:
              for (R = 0, K = Math.pow(2, 16), E = 1; E != K; )
                x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
              _ = n(R);
              break;
            case 2:
              return "";
          }
          for (p[3] = _, T = _, v.push(_); ; ) {
            if (P.index > d)
              return "";
            for (R = 0, K = Math.pow(2, y), E = 1; E != K; )
              x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
            switch (_ = R) {
              case 0:
                for (R = 0, K = Math.pow(2, 8), E = 1; E != K; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
                p[m++] = n(R), _ = m - 1, h--;
                break;
              case 1:
                for (R = 0, K = Math.pow(2, 16), E = 1; E != K; )
                  x = P.val & P.position, P.position >>= 1, P.position == 0 && (P.position = f, P.val = u(P.index++)), R |= (x > 0 ? 1 : 0) * E, E <<= 1;
                p[m++] = n(R), _ = m - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), p[_])
              N = p[_];
            else if (_ === m)
              N = T + T.charAt(0);
            else
              return null;
            v.push(N), p[m++] = T + N.charAt(0), h--, T = N, h == 0 && (h = Math.pow(2, y), y++);
          }
        }
      };
      return s;
    })();
    e != null ? e.exports = t : typeof angular < "u" && angular != null && angular.module("LZString", []).factory("LZString", function() {
      return t;
    });
  })(vi)), vi.exports;
}
var nl = rp();
function nr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((c, s) => nr(c, t[s]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (c, s) => c === o[s] && nr(n[c], r[c])
  );
}
function ap(e) {
  var s, d, f;
  const [t, n] = I({}), [r, i] = I(""), o = (((s = e == null ? void 0 : e.presentation) == null ? void 0 : s.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], c = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...o,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return X(() => {
    let u = !0;
    return n({}), i(""), Promise.all(
      JSON.parse(c).map(
        async (p) => [p, await ti([p])]
      )
    ).then((p) => {
      u && n(Object.fromEntries(p));
    }).catch(() => {
      u && i(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      u = !1;
    };
  }, [c]), { ids: t, error: r };
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
      (c) => o.some(
        (s) => {
          var d;
          return s !== c.id && ((d = n[s]) == null ? void 0 : d.includes(c.id));
        }
      )
    ) : []
  };
}
function ip(e, t, n) {
  var c;
  const r = rl(e, t, n), i = t == null ? void 0 : t.presentation, o = (i == null ? void 0 : i.annotations) ?? [];
  return {
    performers: o.includes("performers") ? (r.performers ?? []).map((s) => s.name) : [],
    tags: o.includes("tags") && ((c = i == null ? void 0 : i.annotationParents) != null && c.length) ? r.tags ?? [] : null
  };
}
function op({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: i,
  onToggle: o
}) {
  var y, N;
  const c = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], s = new Set(
    c.flatMap((v) => (r[v] ?? []).filter((w) => w !== v))
  ), d = c.every((v) => r[v]), f = Tr(
    t.view.objectFilter,
    n,
    (N = t.presentation) == null ? void 0 : N.filterBins
  ).bins.filter(
    (v) => typeof v == "number" && (!d || s.has(v))
  ), u = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const w of v.tags ?? [])
      if (s.has(w.id)) {
        const T = u.get(w.id) ?? { name: w.name, count: 0 };
        T.count++, u.set(w.id, T);
      }
  const p = f.filter((v) => !u.has(v)), h = Jr(p);
  for (const v of p)
    u.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
      count: 0
    });
  if (!c.length) return null;
  const m = [...u].sort((v, w) => v[1].name.localeCompare(w[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    m.map(([v, w]) => {
      const T = f.includes(v);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": T,
          title: T ? `Show every video again, not only ${w.name}` : `Show only videos tagged ${w.name}`,
          disabled: i,
          onClick: () => o(v),
          children: [
            T && /* @__PURE__ */ a(zr, { "aria-hidden": "true" }),
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
  disabled: i,
  countsPaused: o,
  onToggle: c
}) {
  var p, h;
  const s = ((p = e.presentation) == null ? void 0 : p.filterBins) ?? [], d = Tr(e.view.objectFilter, t, s).bins, f = cp(e, t, n, o);
  if (!s.length) return null;
  const u = /* @__PURE__ */ new Map();
  for (const m of s) {
    const y = ((h = m.group) == null ? void 0 : h.trim()) ?? "";
    u.set(y, [...u.get(y) ?? [], m]);
  }
  return /* @__PURE__ */ a(le, { children: [...u].map(([m, y]) => /* @__PURE__ */ l(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": m ? `${m} bins` : "Filter bins",
      children: [
        m && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: m }),
        y.map((N) => {
          const v = d.includes(N.key), w = v ? r : f[N.key];
          return /* @__PURE__ */ l(
            "button",
            {
              className: "dq-bin",
              type: "button",
              "aria-pressed": v,
              title: v ? `Show every video again, not only ${N.label}` : `Show only videos matching ${N.label}`,
              disabled: i,
              onClick: () => c(N.key),
              children: [
                v && /* @__PURE__ */ a(zr, { "aria-hidden": "true" }),
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
  var u;
  const [i, o] = I({}), { page: c, ...s } = n, d = JSON.stringify([
    e.view.objectFilter,
    e.view.searchMode,
    ((u = e.presentation) == null ? void 0 : u.filterBins) ?? [],
    t,
    s
  ]), f = $(null);
  return X(() => {
    var y, N;
    if (r || f.current === d) return;
    f.current = d, o({});
    let p = 0;
    const h = new AbortController(), m = Tr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      m.includes(v.key) || (p++, Zs(il(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || o((T) => ({ ...T, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || p--;
      }));
    return () => {
      p > 0 && (f.current = null), h.abort();
    };
  }, [d, r]), i;
}
function Nr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function lp(e) {
  if (!Nr(e) || Object.keys(e).length !== 1 || !Nr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !Nr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: i, ...o } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && i === 0 && !Object.keys(o).length ? n[0] : null;
}
function al(e) {
  const { _filterExpression: t, ...n } = e;
  return t ? Object.keys(n).length ? {
    group: { operator: "AND", children: [{ filter: n }, { group: t }] }
  } : { group: t } : { filter: n };
}
function dp(e, t) {
  const n = t.find(
    (r) => nr(e, al(r.filter))
  );
  return n ? n.key : lp(e);
}
function Tr(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && nr(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const c = r._filterExpression;
    if (!Nr(c) || c.operator !== "AND" || !Array.isArray(c.children))
      break;
    const s = c.children, d = dp(s.at(-1), n);
    if (d == null || s.length > 3) break;
    let f = {}, u = null, p = !0;
    for (const [h, m] of s.slice(0, -1).entries())
      !Nr(m) || Object.keys(m).length !== 1 ? p = !1 : h === 0 && Nr(m.filter) && Object.keys(m.filter).length ? f = m.filter : !u && Nr(m.group) ? u = m.group : p = !1;
    if (!p) break;
    i.unshift(d), r = u ? { ...f, _filterExpression: u } : f;
  }
  return { base: r, bins: i };
}
function il(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = Tr(e.view.objectFilter, n, r), c = (u) => {
    var p, h;
    return ((h = (p = r.find((m) => m.key === u)) == null ? void 0 : p.group) == null ? void 0 : h.trim()) || null;
  }, s = c(t);
  return (o.includes(t) ? o.filter((u) => u !== t) : [...o.filter((u) => !s || c(u) !== s), t]).reduce(up, { ...e, view: { ...e.view, objectFilter: i } });
}
function up(e, t) {
  var o, c;
  let n;
  if (typeof t == "number")
    n = { filter: { tagsCriterion: { value: [t], modifier: "INCLUDES", depth: 0 } } };
  else {
    const s = (c = (o = e.presentation) == null ? void 0 : o.filterBins) == null ? void 0 : c.find((d) => d.key === t);
    if (!s || !Object.keys(s.filter).length) return e;
    n = al(s.filter);
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
const ri = [
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
function Ar(e) {
  const t = $e(e) ? e.occurrence : void 0;
  return {
    filter: zt({
      q: "",
      sort: "date",
      direction: "desc",
      ...e.view.filter,
      page: 1
    }, Be(e)),
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
  if ($e(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!ri.some((s) => s !== "performer" && t.has(s))) {
    const s = Ar(e);
    return {
      query: n ? { ...s, performerFocus: n } : s,
      startAtEnd: s.startFrom === "end"
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
    const s = t.get("sorts").split(",").map((d) => {
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (s.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    i.sorts = s, i.sort = s[0].key, i.direction = s[0].direction;
  }
  let o;
  if ($e(e) && (o = {
    ...fp,
    ...ps(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Zi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (s) => !Number.isSafeInteger(s) || s <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const c = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: zt(i, Be(e)),
      objectFilter: ps(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: c,
      performerScope: o,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && c === "end"
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
function da(e, t) {
  const n = new URLSearchParams(window.location.search);
  ri.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", fs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", fs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), sl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function In(e, t) {
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
function kr(e) {
  const t = e;
  return In(t, Ar(t));
}
function ms(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !nr(
    JSON.parse(Yn(In(e, t))),
    JSON.parse(Yn(In(e, Ar(e))))
  );
}
function Io(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return je(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function cl(e, t) {
  if (je(e) !== "video") return e;
  const { base: n, bins: r } = Tr(
    e.view.objectFilter,
    t.view.objectFilter,
    Io(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function _a(e, t) {
  if (je(e) !== "video") return t;
  const { base: n, bins: r } = Tr(
    t.objectFilter,
    e.view.objectFilter,
    Io(e)
  );
  return r.length ? { ...t, objectFilter: n } : t;
}
function gs(e, t) {
  return !t || !$e(e) ? e : {
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
const cn = (e) => e instanceof Error ? e.message : "Request failed.", qi = 50, pp = [], bs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function hp(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Ul(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? $s(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function mp({ media: e, kind: t }) {
  const [n, r] = I(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ls, {}) : /* @__PURE__ */ a(Xa, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: Ii(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function gp({
  tags: e,
  preview: t,
  editor: n,
  tagsChangedSinceEditing: r = !1,
  trees: i,
  actionTagIds: o,
  label: c
}) {
  const s = !!n && !r, d = bo(t), f = n ? null : d, u = e == null ? void 0 : e.absent, p = qa(
    ye(() => [...o, ...u ?? []], [o, u])
  ), h = (H) => p[H] ?? { id: H, name: p[H] === void 0 ? "…" : "Unavailable tag" }, m = (H) => Sr(H.map(h)), y = f && e ? lo(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((H) => H.id)), w = new Set(y == null ? void 0 : y.removed), T = new Set(y == null ? void 0 : y.markedAbsent), R = new Set(y == null ? void 0 : y.absenceCleared), x = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
    "absent"
  ] }), K = m((y == null ? void 0 : y.added) ?? []), E = m(((y == null ? void 0 : y.markedAbsent) ?? []).filter((H) => !v.has(H))), _ = s ? "h3" : "h4", P = !!(e != null && e.absent.length) && /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a(_, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: m(e.absent).map((H) => /* @__PURE__ */ l(
      "li",
      {
        className: `dq-tag dq-tag-absent${R.has(H.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(Ka, { "aria-hidden": "true" }),
          R.has(H.id) ? /* @__PURE__ */ l("del", { children: [
            "− ",
            /* @__PURE__ */ a(Ht, { tag: H })
          ] }) : /* @__PURE__ */ a(Ht, { tag: H })
        ]
      },
      H.id
    )) })
  ] }), se = /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": c, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(le, { children: [
      N.length || K.length || E.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (H) => w.has(H.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ a(Ht, { tag: H })
            ] }),
            T.has(H.id) && x
          ] }, H.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Ht, { tag: H }) }, H.id)
        ),
        K.map((H) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Ht, { tag: H })
        ] }) }, `added-${H.id}`)),
        E.map((H) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Ht, { tag: H }) }),
          x
        ] }, `absent-${H.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      P
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ l(le, { children: [
    !s && se,
    n,
    s && P && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: P })
  ] });
}
function bp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    fo(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function yp({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: i,
  editRequest: o = 0,
  onEditRequestHandled: c,
  pageControls: s,
  stayOnTap: d,
  onStayOnTapChange: f
}) {
  var xr;
  const u = Be(e), p = Rn(u), h = u === "audio" ? "Audio" : "Scene", m = (b) => {
    var k;
    return b.title || ((k = b.files[0]) == null ? void 0 : k.basename) || h;
  }, y = (b) => `${b.occurrence ? `${b.occurrence.performer.name} — ` : ""}${m(b.media)}`, N = $(null), v = $("");
  if (!N.current)
    try {
      N.current = zi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (b) {
      v.current = cn(b), N.current = { query: Ar(e), startAtEnd: !1 };
    }
  const [w, T] = I(null), [R, x] = I(""), K = $(null), E = $(null), _ = $(null), P = $(null), [se, H] = I(!!v.current), j = $(0), [z, O] = I(N.current.query), D = $(z);
  D.current = z;
  const [L, Y] = I(0), W = $(N.current.startAtEnd), [re, J] = I([]), [S, ie] = I(null), A = $(null), [Q, oe] = I(null), [me, G] = I(0), we = ye(() => {
    if (!S) return null;
    const b = re.findIndex((k) => k.key === S.key);
    return b < 0 ? null : re.slice(b + 1).find((k) => k.media.id !== S.media.id) ?? null;
  }, [S, re]), [Ce, pe] = I(0), [Oe, Ke] = I(!1), [Ae, $n] = I(!1), Ne = $(!1), Je = $(!0), At = $(null);
  X(() => (Je.current = !0, () => {
    Je.current = !1;
  }), []);
  const [wn, Pe] = I(v.current), [at, Ie] = I(""), [Ve, Jt] = I(null), [Fe, On] = I(!1), [ut, Pt] = I([]), it = $([]), Wt = $(null), qt = $(null), ir = $(null);
  X(() => {
    var b, k;
    Fe && ((k = (b = ir.current) == null ? void 0 : b.querySelector("input")) == null || k.focus());
  }, [Fe]);
  const [Rt, Mn] = I(!1), [Qt, Lt] = I(!1), vn = Sa(), [Se, Ct] = I(!1), ot = d ?? Se, Un = f ?? Ct;
  X(() => {
    if (Oe || Rt || !qt.current) return;
    const b = requestAnimationFrame(() => {
      if (document.querySelector(bs)) return;
      const k = qt.current;
      qt.current = null;
      const F = document.activeElement;
      F && F !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(b);
  }, [Oe, Rt, L]);
  const [Yt, Le] = I([]), [$t, de] = I({}), U = $(null), ke = $(0), [ft, Bn] = I({});
  X(() => {
    let b = !0;
    return Promise.all(
      qo(z.objectFilter).map(
        async (k) => [
          String(k),
          (await be(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      b && Bn(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      b = !1;
    };
  }, [z.objectFilter]);
  const ce = ye(
    () => So(z.objectFilter, ft),
    [ft, z.objectFilter]
  ), Ot = $(0), et = $(e);
  et.current = e;
  const De = w ?? e, Xe = ye(
    () => In(De, z),
    [De, z]
  ), Xt = ye(
    () => gs(Xe, z.performerFocus),
    [Xe, z.performerFocus]
  ), st = $(Xt);
  st.current = Xt;
  const mt = $(Xe);
  mt.current = Xe;
  const [Dt, Zt] = I("items"), [ct, Kn] = I(null), en = $(null), Gn = $("");
  function _t(b) {
    const k = typeof b == "function" ? b(en.current) : b;
    en.current = k, Kn(k);
  }
  const [Nn, tn] = I(!1), [C, B] = I(null), Z = $(null), ve = $e(Xe) ? Ba(Xe) : "", [ue, Re] = I(0), [Te, jt] = I(null);
  X(() => () => {
    var b;
    return (b = Z.current) == null ? void 0 : b.controller.abort();
  }, []), X(() => {
    const b = Z.current;
    !b || b.signature === ve || (b.controller.abort(), Z.current = null, tn(!1));
  }, [ve]), X(() => {
    var F;
    const b = en.current;
    if (Dt !== "performers" || !ve || ((F = Z.current) == null ? void 0 : F.signature) === ve || Gn.current === ve || (b == null ? void 0 : b.signature) === ve && b.complete)
      return;
    const k = (b == null ? void 0 : b.signature) === ve ? b : null;
    $r(b, (k == null ? void 0 : k.limit) ?? qi);
  }, [Dt, ve, ct, C, Nn]);
  const ge = z.performerFocus;
  X(() => {
    if (!ge) {
      jt(null);
      return;
    }
    let b = !0;
    return be(`/api/performers/${ge}`).then((k) => {
      const F = tl(ge, k.tags);
      b && jt({ id: ge, name: k.name, tags: F });
    }).catch(() => {
    }), () => {
      b = !1;
    };
  }, [ge]);
  const Ee = JSON.stringify(
    $e(Xe) ? Us(Xe.occurrence) : []
  ), qe = ye(() => JSON.parse(Ee), [Ee]), Ut = ye(() => eu(qe), [qe]), Fn = sc(Ut), Wr = qa(Ut), Qr = (b) => {
    var k;
    return ((k = Wr[b]) == null ? void 0 : k.name) ?? (Wr[b] === null ? "Unavailable tag" : "…");
  }, Yr = (b) => ({
    name: Qr(b),
    tagIds: Fn.get(b) ?? [b],
    resolved: Fn.has(b)
  }), St = Yc(
    $e(Xe) ? Xe : null,
    ge ?? null,
    ue
  ), nn = ms(e, z), or = ms(e, _a(e, z)), gt = Ae || Oe || Fe, qn = Number(z.filter.page);
  function _e(b, k = !1) {
    Ne.current || (v.current = "", W.current = k, D.current = b, O(b), pe(0), Ke(!0), k || da(e.id, b), Y((F) => F + 1));
  }
  function tt() {
    if (Ne.current = !1, $n(!1), Je.current && At.current) {
      const b = At.current;
      At.current = null, _e(b.query, b.startAtEnd);
    }
  }
  X(() => {
    const b = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = zi(
            et.current,
            new URLSearchParams(window.location.search)
          );
          Ne.current ? At.current = k : _e(k.query, k.startAtEnd);
        } catch (k) {
          Pe(cn(k));
        }
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, [e.id]), X(() => (r(Ae || Oe || Fe || !!w), () => r(!1)), [Ae, Oe, Fe, !!w, r]);
  async function bt(b, k, F) {
    if ($e(b)) {
      const he = await Gc(
        b,
        U.current,
        k,
        F
      );
      return {
        items: he.items.map((fe) => ({
          key: fe.key,
          media: fe.media,
          occurrence: fe
        })),
        totalCount: he.totalCount
      };
    }
    const ae = await jr(
      b,
      { ...b.view.filter, page: k },
      F
    );
    return {
      items: ae.items.map((he) => ({ key: String(he.id), media: he })),
      totalCount: ae.totalCount
    };
  }
  function yt(b, k, F, ae = !1, he = !1) {
    if (!Je.current || At.current) return;
    H(!0), J(
      he ? b.items : Ni(b.items, D.current.startFrom === "end")
    ), pe(b.totalCount), Bt(F, ae);
    const fe = {
      ...D.current,
      filter: { ...D.current.filter, page: k }
    };
    D.current = fe, O(fe), da(e.id, fe);
  }
  function Bt(b, k = !1) {
    (b == null ? void 0 : b.key) !== (S == null ? void 0 : S.key) && (A.current = null), (b == null ? void 0 : b.media.id) !== (S == null ? void 0 : S.media.id) && oe(k && b ? b.media.id : null), ie(b);
  }
  X(() => {
    if (v.current) return;
    const b = new AbortController();
    P.current = b;
    const k = ++Ot.current;
    return Ke(!0), Pe(""), Ie(""), A.current = null, oe(null), ie(null), J([]), On(!1), (async () => {
      const F = gs(
        In(et.current, D.current),
        D.current.performerFocus
      );
      U.current = $e(F) ? await ko(F, b.signal) : null;
      let ae = Number(F.view.filter.page), he = await bt(F, ae, b.signal);
      const fe = Math.max(
        1,
        Math.ceil(he.totalCount / Number(F.view.filter.perPage))
      );
      (W.current || ae > fe) && (ae = fe, he = await bt(F, ae, b.signal)), W.current = !1;
      const Qe = F.view.startFrom === "end" ? -1 : 1;
      for (; $e(F) && !he.items.length && ae + Qe >= 1 && ae + Qe <= fe && !b.signal.aborted; )
        ae += Qe, he = await bt(F, ae, b.signal);
      if (k !== Ot.current || b.signal.aborted) return;
      const Ft = Ni(he.items, F.view.startFrom === "end");
      yt(he, ae, Ft[0] ?? null);
    })().catch((F) => {
      !b.signal.aborted && k === Ot.current && Pe(cn(F));
    }).finally(() => {
      !b.signal.aborted && k === Ot.current && (H(!0), Ke(!1));
    }), () => {
      b.abort(), Ot.current++;
    };
  }, [L, e.id]), X(() => {
    if (Jt(null), !S) return;
    let b = !0;
    return yn(u, S).then((k) => {
      b && (Jt(k), Le(
        $e(e) ? k.ids.filter((F) => e.occurrence.tagIds.includes(F)) : []
      ));
    }).catch((k) => {
      b && Pe(`Could not load current tags. ${cn(k)}`);
    }), () => {
      b = !1;
    };
  }, [S]), X(() => {
    if (!$e(e) || e.actions.length)
      return;
    let b = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await be(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      b && de(Object.fromEntries(k));
    }).catch((k) => {
      b && Pe(cn(k));
    }), () => {
      b = !1;
    };
  }, [e]);
  async function Kt(b = !1, k = !1, F = !1) {
    var Cn;
    if (!S) return;
    const ae = re.findIndex((We) => We.key === S.key), he = z.startFrom === "end" ? -1 : 1, fe = ((Cn = A.current) == null ? void 0 : Cn.key) === S.key ? A.current : { key: S.key, page: qn, before: re.slice(0, ae + 1).map((We) => We.key), after: re.slice(ae + 1).map((We) => We.key) }, Qe = new Set(fe.after), Ft = new Set(fe.before), ze = re.find((We) => {
      var gn;
      return Qe.has(We.key) || (he === 1 || qn < fe.page) && ((gn = A.current) == null ? void 0 : gn.key) === S.key && !Ft.has(We.key);
    });
    if (!b && ze) {
      Bt(ze, F);
      return;
    }
    const wt = b ? Ft : new Set(re.map((We) => We.key)), lt = 1100 - (Date.now() - ke.current);
    lt > 0 && await new Promise((We) => window.setTimeout(We, lt));
    let He = he === -1 && !b ? Math.max(1, qn - 1) : qn;
    for (; Je.current && !At.current; ) {
      let We = await bt(Xt, He);
      const gn = Math.max(
        1,
        Math.ceil(We.totalCount / Number(z.filter.perPage))
      );
      He > gn && (He = gn, We = await bt(Xt, He));
      const Tt = Ni(We.items, he === -1), aa = new Map(Tt.map((It) => [It.key, It])), Ia = b ? fe.after.flatMap((It) => {
        const Lr = aa.get(It);
        return Lr ? [Lr] : [];
      }) : [], Ra = new Set(Ia.map((It) => It.key)), br = b ? {
        ...We,
        items: [
          ...Ia,
          ...Tt.filter(
            (It) => It.key !== S.key && !Ra.has(It.key)
          )
        ]
      } : We;
      if (k) {
        A.current = fe, yt(br, He, S, !1, b);
        return;
      }
      const Pr = he === -1 && qn === 1 && !b ? void 0 : br.items.find(
        (It) => !wt.has(It.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(b && he === -1 && He === fe.page) || Qe.has(It.key))
      );
      if (Pr || (he === -1 ? He <= 1 : He >= gn)) {
        yt(
          br,
          He,
          Pr ?? null,
          F,
          b
        ), Pr || Ie(
          We.totalCount ? `Reached the end in this direction. Matching items remain available from the ${p.queue} pages.` : `No matching ${p.many}.`
        );
        return;
      }
      He += he;
    }
  }
  async function dn(b, k = !1, F = !1, ae = !1) {
    if (w || !S || Ne.current || Oe || Fe && !F)
      return;
    const he = F || ae || !!(b != null && b.steps.length);
    if (he && (!t || !Ve) || b && er(b) && !n) return;
    const fe = !k && !F && !ae && he && b !== void 0 && Ve !== null && zo(e) && Mi(Oi(e.actions, Xd(b, Ve, hn))).length > 0;
    Ne.current = !0, $n(!0), Pe(""), Ie("");
    const Qe = re.findIndex((lt) => lt.key === S.key), Ft = he && !k && !fe && Qe >= 0 ? re[Qe + 1] ?? null : null;
    Ft && (J(
      (lt) => lt.filter((He) => He.key !== S.key)
    ), Bt(Ft, !0));
    let ze = !1, wt = [];
    try {
      if (he) {
        const lt = await yn(u, S);
        if (b)
          await kf(Xt, S, b);
        else {
          const Cn = ae && $e(e) ? e.occurrence.tagIds.filter((Tt) => lt.ids.includes(Tt)) : it.current, gn = Vr(Cn, ae ? Yt : ut);
          await Co(Xt, S, gn);
        }
        ke.current = Date.now();
        const He = await yn(u, S);
        Ft || Jt(He), ze = !0, On(!1), fe && (wt = Mi(Oi(e.actions, He))), Ie(
          wt.length ? `Tags saved. Staying until answered: ${wt.map((Cn) => Cn.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (Ea(S.occurrence.performer.id), Re((Cn) => Cn + 1));
      }
      if (!Je.current || At.current) return;
      he ? wt.length || await Kt(!0, k, !k) : k || await Kt(), k && F && requestAnimationFrame(() => {
        var lt;
        return (lt = Wt.current) == null ? void 0 : lt.focus();
      });
    } catch (lt) {
      if (Pe(
        ze ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${cn(lt)}` : he ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${cn(lt)}` : `Could not advance. ${cn(lt)}`
      ), he && !ze) {
        Ft && (J(re), oe(null), G((He) => He + 1), ie(S)), ke.current = Date.now();
        try {
          Jt(await yn(u, S));
        } catch {
          Jt(null), Pe(
            (He) => `${He} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      tt();
    }
  }
  const sr = !Fe && !w && !Rt && !Qt && (S != null || Oe || Ae);
  po({
    surface: "local",
    enabled: sr,
    actions: e.actions,
    onAction: (b, k) => {
      const F = e.actions[b];
      F && dn(F, k);
    },
    onFind: () => Lt(!0)
  });
  const un = (b) => Ae || Oe || !Ve || !!w || !t && b.steps.length > 0 || !n && er(b);
  function rn() {
    !i || w || Ne.current || Fe || (_.current = document.activeElement, E.current = {
      error: wn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: re,
      current: S,
      total: Ce,
      targets: U.current,
      stayedCursor: A.current
    }, T(structuredClone(e)), x(""), Ie(""), Pe(""));
  }
  X(() => {
    if (!o) {
      j.current = 0;
      return;
    }
    o !== j.current && se && !Oe && (j.current = o, rn(), c == null || c());
  }, [o, Oe, se]);
  function Ir() {
    T(null), x(""), requestAnimationFrame(() => {
      const b = _.current;
      b != null && b.isConnected && b !== document.body && b.focus();
    });
  }
  function Rr() {
    var k;
    const b = E.current;
    !b || Ae || ((k = P.current) == null || k.abort(), Ot.current++, D.current = b.query, O(b.query), J(b.items), ie(b.current), pe(b.total), U.current = b.targets, A.current = b.stayedCursor, Ke(!1), Pe(b.error), Ie(""), window.history.replaceState(window.history.state, "", b.url), Ir());
  }
  async function ka() {
    if (!w || !i || Ne.current) return;
    const b = In(
      { ...w, name: w.name.trim() },
      _a(et.current, D.current)
    ), k = ha(b);
    if (k) {
      x(k);
      return;
    }
    Ne.current = !0, $n(!0), x("");
    try {
      if (await i(b) === !1) throw new Error("Could not save review.");
      Ir(), Ie("Review saved.");
    } catch (F) {
      x(
        "Could not save review. Your edits are still open. " + cn(F)
      );
    } finally {
      tt();
    }
  }
  async function Me() {
    if (!i || Ne.current) return;
    const b = _a(et.current, D.current), k = In(et.current, {
      ...b,
      filter: { ...b.filter, page: 1 }
    });
    Ne.current = !0, $n(!0), Pe("");
    try {
      if (await i(k) === !1) throw new Error("Could not save review.");
      Ie("Queue saved to this review.");
    } catch (F) {
      Pe("Could not save queue. " + cn(F));
    } finally {
      tt();
    }
  }
  const pt = z.performerScope, Sn = (b) => {
    const { performerFocus: k, ...F } = D.current, ae = k && !("targetMode" in b || "performerIds" in b || "performerFilter" in b);
    _e({
      ...F,
      ...ae ? { performerFocus: k } : {},
      filter: { ...F.filter, page: 1 },
      performerScope: { ...pt, ...b }
    });
  };
  async function $r(b, k) {
    var he;
    const F = mt.current;
    if (!$e(F)) return;
    (he = Z.current) == null || he.controller.abort();
    const ae = {
      signature: Ba(F),
      controller: new AbortController()
    };
    Z.current = ae, Gn.current = "", tn(!0), B(null);
    try {
      const fe = await Zf(F, b, k, ae.controller.signal, {
        onProgress: (Qe) => {
          Z.current === ae && _t(Qe);
        }
      });
      Z.current === ae && _t(fe);
    } catch (fe) {
      Z.current === ae && !ae.controller.signal.aborted && (Gn.current = ae.signature, B({ signature: ae.signature, message: cn(fe) }));
    } finally {
      Z.current === ae && (Z.current = null, tn(!1));
    }
  }
  function kn() {
    var b;
    (b = Z.current) == null || b.controller.abort(), Z.current = null, tn(!1), _t((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function Ea(b) {
    var he;
    const k = mt.current;
    if (!$e(k)) return;
    if (Z.current) {
      kn();
      return;
    }
    const F = Ba(k);
    if (((he = en.current) == null ? void 0 : he.signature) !== F || en.current.partial) return;
    const ae = 1100 - (Date.now() - ke.current);
    ae > 0 && await new Promise((fe) => window.setTimeout(fe, ae));
    try {
      const fe = await Zc(k, b);
      if (Z.current) {
        kn();
        return;
      }
      _t(
        (Qe) => (Qe == null ? void 0 : Qe.signature) === F ? ep(Qe, b, fe) : Qe
      );
    } catch {
      _t(
        (fe) => (fe == null ? void 0 : fe.signature) === F ? { ...fe, partial: !0, complete: !1 } : fe
      );
    }
  }
  const cr = z.performerFocus ? ct == null ? void 0 : ct.candidates.find((b) => b.id === z.performerFocus) : void 0, nt = Te && Te.id === z.performerFocus ? { ...Te, flags: vr(qe, Te.tags) } : cr ? { ...cr, flags: vr(qe, cr.tags) } : null, fn = (b) => {
    if ((Te == null ? void 0 : Te.id) === b)
      return vr(qe, Te.tags);
    const k = ct == null ? void 0 : ct.candidates.find((F) => F.id === b);
    return k ? vr(qe, k.tags) : void 0;
  }, pn = ((xr = S == null ? void 0 : S.occurrence) == null ? void 0 : xr.performer.id) ?? null, En = pn === null ? void 0 : fn(pn), Ue = np(
    qe.length > 0 && pn !== null && pn !== z.performerFocus && En === void 0 ? pn : null
  ), Xr = En ?? (Ue ? vr(qe, Ue) : []), hn = oc(De.actions), Or = St.summary && z.performerFocus ? uo(To(St.summary, De.actions, hn)) : [], lr = Ho(qe, (nt == null ? void 0 : nt.flags) ?? [], Yr), dr = uc(
    Ho(qe, Xr, Yr),
    pn !== null && pn === z.performerFocus ? Or : []
  ), Zr = JSON.stringify(dr), Mr = ye(() => dr, [Zr]), ur = JSON.stringify(lr), ea = ye(() => lr, [ur]), xn = (b) => su(qe, b, Qr);
  function fr(b) {
    if (Ne.current) return;
    const k = {
      ...D.current,
      performerFocus: b,
      filter: { ...D.current.filter, page: 1 }
    };
    _e(k, k.startFrom === "end"), Zt("items");
  }
  function ai() {
    const { performerFocus: b, ...k } = D.current;
    _e(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const pr = $(null);
  pr.current ?? (pr.current = Nc());
  const Aa = pr.current, ii = ye(
    () => De.actions.flatMap((b) => b.steps.flatMap((k) => k.tagIds)),
    [De.actions]
  ), Ca = $(null);
  X(() => {
    const b = Ca.current, k = b == null ? void 0 : b.querySelector('[aria-current="true"]');
    if (!b || !k) return;
    const F = b.getBoundingClientRect(), ae = k.getBoundingClientRect();
    ae.top < F.top ? b.scrollTop -= F.top - ae.top : ae.bottom > F.bottom && (b.scrollTop += ae.bottom - F.bottom);
  }, [S == null ? void 0 : S.key, Dt]);
  const Fr = $(null), ta = $(null);
  X(() => {
    var F, ae;
    const b = ta.current;
    if (!b) return;
    ta.current = null;
    const k = [...((F = Fr.current) == null ? void 0 : F.querySelectorAll(".dq-partner")) ?? []];
    (ae = k.find((he) => he.dataset.partnerKey === b) ?? k[0]) == null || ae.focus();
  }, [S == null ? void 0 : S.key]);
  const Mt = Ae || Oe || Fe || !!w, An = ye(
    () => w ? In(w, _a(e, z)) : null,
    [w, e, z]
  ), hr = ye(
    () => An != null && Kr(kr(An)) !== Kr(kr(e)),
    [An, e]
  );
  function Vn() {
    S ? yn(u, S).then(Jt).catch((b) => Pe(cn(b))) : _e(D.current);
  }
  const zn = wn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    wn,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: Ae, onClick: Vn, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, mn = Ae || Oe || S != null && !Ve, mr = Math.max(1, Number(z.filter.perPage) || 1), gr = $(1);
  Oe || (gr.current = Math.max(1, Math.ceil(Ce / mr)));
  const na = gr.current, Ta = pt && S ? re.filter(
    (b) => b.media.id === S.media.id && b.key !== S.key
  ) : [], oi = (b) => {
    var k;
    return b.title || ((k = b.files[0]) == null ? void 0 : k.basename) || `${u === "audio" ? "Audio" : "Video"} ${b.id}`;
  }, ra = S ? hp(S.media, u) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": pt ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (b) => {
        var ae;
        const k = b.target instanceof Element ? b.target.closest("button") : null, F = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((ae = k == null ? void 0 : k.textContent) == null ? void 0 : ae.trim()) ?? "";
        k && !k.closest(bs) && /^(Filters|Edit filter:|Edit criteria)/.test(F) && (qt.current = k);
      },
      children: [
        /* @__PURE__ */ a(
          Dc,
          {
            name: e.name,
            description: e.description,
            entityType: je(e),
            onBack: s == null ? void 0 : s.onBack,
            backDisabled: Mt || !!(s != null && s.busy),
            onEdit: w ? () => {
              var b;
              return (b = K.current) == null ? void 0 : b.focus();
            } : rn,
            editDisabled: !w && (Mt || !i || !!(s != null && s.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Ae || Fe, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  ua,
                  {
                    filter: z.filter,
                    objectFilter: ce,
                    criteriaDefinitions: u === "audio" ? Ts : Qa,
                    customFieldEntityType: u,
                    supportsFilterExpressions: !0,
                    totalCount: Ce,
                    sortOptions: u === "audio" ? _l : Is,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      _c,
                      {
                        page: Math.min(Math.max(1, qn || 1), na),
                        pages: na,
                        onPage: (b) => _e({
                          ...D.current,
                          filter: zt(
                            { ...D.current.filter, page: b },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (b) => {
                      (b.sort !== D.current.filter.sort || b.direction !== D.current.filter.direction) && (b = { ...b, sorts: void 0 }), _e({
                        ...D.current,
                        filter: zt(b, u)
                      });
                    },
                    onObjectFilterChange: (b) => {
                      _e({
                        ...D.current,
                        objectFilter: Uc(
                          b,
                          ft,
                          D.current.objectFilter
                        ),
                        filter: { ...D.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(le, { children: [
              pt && /* @__PURE__ */ a(
                Qf,
                {
                  scope: pt,
                  disabled: Ae || Fe,
                  editing: !!w,
                  onChange: Sn,
                  onEditCriteria: () => Mn(!0)
                }
              ),
              (s == null ? void 0 : s.onGrid) && /* @__PURE__ */ a(
                jc,
                {
                  mode: "single",
                  disabled: Mt || !!s.busy,
                  onChange: () => {
                    var b;
                    return (b = s.onGrid) == null ? void 0 : b.call(s);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(le, { children: [
              $e(Xt) && t && /* @__PURE__ */ a(
                Uf,
                {
                  review: Xt,
                  disabled: gt || !!w,
                  performerAttention: z.performerFocus ? ea : void 0,
                  trees: hn,
                  onOpen: () => {
                    Ne.current = !0, $n(!0);
                  },
                  onWrite: () => {
                    ke.current = Date.now();
                  },
                  onClose: (b) => {
                    if (b) {
                      ke.current = Date.now();
                      const k = D.current.performerFocus;
                      k ? Ea(k) : kn(), Re((F) => F + 1), new Promise((F) => window.setTimeout(F, 1100)).then(() => {
                        tt(), Je.current && (v.current || Ke(!0), Y((F) => F + 1));
                      });
                    } else tt();
                  }
                }
              ),
              (s == null ? void 0 : s.moreItems) && /* @__PURE__ */ a(
                wo,
                {
                  disabled: Mt,
                  items: s.moreItems({
                    onSelect: rn,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: z.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Br,
                {
                  performer: {
                    id: z.performerFocus,
                    name: (nt == null ? void 0 : nt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (nt == null ? void 0 : nt.name) ?? `performer ${z.performerFocus}` })
              ] }),
              nt != null && nt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: xn(nt.flags), children: [
                /* @__PURE__ */ a(Dn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: xn(nt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: ai,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: nn,
            queueChange: !w && nn ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: or ? () => void Me() : void 0,
              saveDisabled: gt || !i,
              onReset: () => {
                const b = Ar(e);
                _e(b, b.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        s == null ? void 0 : s.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          w && An && /* @__PURE__ */ a(
            Lc,
            {
              drawerRef: K,
              draft: An,
              onChange: (b) => T(b),
              direction: z.startFrom,
              onDirectionChange: (b) => _e({ ...D.current, startFrom: b }),
              tagGroups: pp,
              trees: hn,
              saving: Ae,
              saveDisabled: Oe,
              error: R,
              dirty: hr,
              criteriaChanged: or,
              notices: zn && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: zn }),
              onSave: () => void ka(),
              onCancel: Rr
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ l(le, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${u}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${p.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: oi(S.media) }),
                        /* @__PURE__ */ a(_s, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  ra && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: ra })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, we].filter(Boolean).map((b) => {
                    var ae, he, fe, Qe, Ft;
                    const k = b, F = k.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: F ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": F ? void 0 : !0,
                        inert: F ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Ri("audio", k.media.id),
                            format: ((ae = k.media.files[0]) == null ? void 0 : ae.format) ?? "",
                            title: m(k.media),
                            coverUrl: F ? Ii("audio", k.media) : void 0,
                            duration: ((he = k.media.files[0]) == null ? void 0 : he.duration) ?? 0,
                            autostart: F && Q === k.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Rs,
                          {
                            videoId: k.media.id,
                            streamUrl: Ri("video", k.media.id),
                            posterUrl: F ? Ii("video", k.media) : void 0,
                            duration: ((fe = k.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            format: (Qe = k.media.files[0]) == null ? void 0 : Qe.format,
                            audioCodec: (Ft = k.media.files[0]) == null ? void 0 : Ft.audioCodec,
                            extensionSurface: F ? "quick-view" : void 0,
                            autostart: F && Q === k.media.id,
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
                      `${k.media.id}:${me}`
                    );
                  }) }),
                  u === "audio" && /* @__PURE__ */ a(
                    Kf,
                    {
                      details: S.media.details,
                      label: p.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Oe ? "Loading review…" : Ce ? "Reached the end in this direction." : `No matching ${p.many}.` }),
              De.actions.length > 0 ? /* @__PURE__ */ a(
                Nu,
                {
                  actions: De.actions,
                  isDisabled: (b) => Fe || un(b),
                  busy: mn,
                  tags: Ve,
                  trees: hn,
                  preview: Aa,
                  onApply: (b, k) => void dn(b, k),
                  onFind: () => Lt(!0),
                  findDisabled: Fe || !!w,
                  paused: !!w,
                  waitForGroups: zo(De),
                  attention: Mr,
                  stayOnTap: ot,
                  onStayOnTapChange: Un
                }
              ) : $e(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ae || Fe || !Ve || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((b) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Yt.includes(b),
                          onChange: (k) => Le(
                            e.occurrence.multiple ? k.target.checked ? [...Yt, b] : Yt.filter((F) => F !== b) : [b]
                          )
                        }
                      ),
                      $t[b] ?? "Loading tag…"
                    ] }, b)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
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
                          onClick: () => void dn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void dn(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Fr, children: [
                S && /* @__PURE__ */ l(le, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${p.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Br, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${p.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: pt ? `Tags apply to this performer in this ${p.queue}` : `Tags apply to the whole ${p.one}` })
                      ] })
                    ] }),
                    Mr.length > 0 && /* @__PURE__ */ a(bp, { entries: Mr })
                  ] }),
                  Ta.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${p.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          p.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Ta.map((b) => {
                          var k, F, ae;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = b.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (F = b.occurrence) == null ? void 0 : F.performer.name,
                              "data-partner-key": b.key,
                              disabled: gt,
                              onClick: () => {
                                ta.current = S.key, Bt(b), Pe("");
                              },
                              children: [
                                b.occurrence && /* @__PURE__ */ a(Br, { performer: b.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (ae = b.occurrence) == null ? void 0 : ae.performer.name })
                              ]
                            },
                            b.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    gp,
                    {
                      tags: Ve,
                      preview: Aa,
                      trees: hn,
                      actionTagIds: ii,
                      label: `Current ${pt ? "occurrence" : p.one} tags`,
                      tagsChangedSinceEditing: Fe && !Ae && (!Ve || Ve.ids.length !== it.current.length || Ve.ids.some((b) => !it.current.includes(b))),
                      editor: Fe && /* @__PURE__ */ l(
                        "fieldset",
                        {
                          ref: ir,
                          disabled: Ae,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              pt ? "occurrence" : p.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              tr,
                              {
                                entityType: "tag",
                                values: ut,
                                onChange: Pt,
                                placeholder: "Choose tags for this item...",
                                allowCreate: !1
                              }
                            ),
                            /* @__PURE__ */ l("div", { className: "dq-row", children: [
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button primary",
                                  disabled: !Ve,
                                  onClick: () => void dn(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !Ve,
                                  onClick: () => void dn(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    On(!1), requestAnimationFrame(() => {
                                      var b;
                                      return (b = Wt.current) == null ? void 0 : b.focus();
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
                $e(Xe) && z.performerFocus && /* @__PURE__ */ a(
                  Bi,
                  {
                    ...St,
                    mediaKind: u,
                    actions: De.actions,
                    trees: hn,
                    flags: ea
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && zn,
                  at && /* @__PURE__ */ a("p", { role: "status", children: at })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": mn || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: Wt,
                      className: "dq-button",
                      disabled: gt || !!w || !t || !Ve,
                      onClick: () => {
                        it.current = [...Ve.ids], Pt([...Ve.ids]), On(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Ps, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: gt || !!w,
                      onClick: () => void dn(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        pt ? " performer" : ` ${p.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              pt && /* @__PURE__ */ l(
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
                        "aria-pressed": Dt === "items",
                        onClick: () => Zt("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Dt === "performers",
                        onClick: () => Zt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              pt && Dt === "performers" ? /* @__PURE__ */ a(
                Vf,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === ve ? ct : null,
                  busy: Nn,
                  error: (C == null ? void 0 : C.signature) === ve ? C.message : "",
                  focus: z.performerFocus,
                  disabled: gt,
                  labels: p,
                  flagLabel: xn,
                  onFocus: fr,
                  onMore: () => {
                    const b = en.current;
                    b && $r(b, b.limit + qi);
                  },
                  onRefresh: () => {
                    _t(null), $r(null, qi);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Ca, children: re.map((b) => {
                var F;
                const k = (S == null ? void 0 : S.key) === b.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(b),
                    "aria-label": y(b),
                    "aria-current": k ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      Bt(b), Pe(""), Ie("");
                    },
                    children: [
                      /* @__PURE__ */ a(mp, { media: b.media, kind: u }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: m(b.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          b.occurrence && /* @__PURE__ */ l(le, { children: [
                            /* @__PURE__ */ a(Br, { performer: b.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: b.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            b.media.date,
                            b.occurrence ? "" : (F = b.media.files[0]) != null && F.duration ? $s(b.media.files[0].duration) : ""
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
        pt && /* @__PURE__ */ a(
          Cs,
          {
            open: Rt,
            onClose: () => Mn(!1),
            criteria: Wi,
            activeFilter: pt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (b) => {
              Mn(!1), Sn({ performerFilter: b });
            }
          }
        ),
        Qt && /* @__PURE__ */ a(
          go,
          {
            actions: e.actions,
            trees: hn,
            isDisabled: (b) => un(b),
            tapStays: vn && ot,
            onApply: (b, k) => {
              Lt(!1), dn(b, k);
            },
            onClose: () => Lt(!1)
          }
        )
      ]
    }
  );
}
const ll = "data-quality.reviews-sort.v1", wp = { sort: "name", direction: "asc" };
function vp() {
  try {
    const e = JSON.parse(localStorage.getItem(ll) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return wp;
}
function Np(e) {
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
  return [...e].sort((o, c) => {
    if (n === "count") {
      const s = t[o.id], d = t[c.id], f = typeof s == "number", u = typeof d == "number";
      if (f !== u) return f ? -1 : 1;
      if (f && u && s !== d)
        return (s - d) * i;
    }
    return o.name.localeCompare(c.name, void 0, { numeric: !0, sensitivity: "base" }) * i;
  });
}
function Si(e, t) {
  const n = je(e), r = Rn(to(n)), i = n === "tag" ? "tag" : $e(e) ? r.queue : r.one;
  return t === 1 ? i : `${i}s`;
}
function qp({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      Si(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      Si(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(le, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      Si(e, t)
    ] })
  ] });
}
function Sp({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: i,
  onDirectionChange: o,
  storage: c,
  canConfigure: s,
  busy: d,
  headingRef: f,
  notices: u,
  onOpen: p,
  onNew: h,
  onImport: m,
  onExportAll: y,
  rowMenuItems: N
}) {
  const v = $(null), w = ye(
    () => dl(e, t, n, r),
    [e, t, n, r]
  ), T = e.every((x) => t[x.id] !== void 0), R = r === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ l("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ l("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ a("h1", { ref: f, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ l("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !s || d,
            onClick: () => {
              var x;
              return (x = v.current) == null ? void 0 : x.click();
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
            onChange: (x) => {
              var E;
              const K = (E = x.target.files) == null ? void 0 : E[0];
              x.target.value = "", K && m(K);
            }
          }
        ),
        /* @__PURE__ */ l(
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
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !s || d,
            onClick: h,
            children: [
              /* @__PURE__ */ a(ba, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    u,
    e.length ? /* @__PURE__ */ l("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ l("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ l("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          c
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: T ? e.some((x) => t[x.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
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
              "aria-label": `Sort direction: ${R}`,
              title: `Sort direction: ${R}`,
              onClick: () => o(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(nd, { "aria-hidden": "true" }) : /* @__PURE__ */ a(rd, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? R : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? R : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: w.map((x) => {
          const K = je(x);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(x.id)}`,
                "data-review-id": x.id,
                onClick: (E) => {
                  E.button !== 0 || E.metaKey || E.ctrlKey || E.shiftKey || E.altKey || (E.preventDefault(), p(x.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Fc, { entityType: K }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: x.name }),
                    x.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: x.description, children: x.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Mc[K] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(qp, { review: x, count: t[x.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(wo, { label: `Actions for ${x.name}`, items: N(x) }) })
          ] }, x.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(Xa, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: s ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function ul(e, { id: t, name: n, description: r }) {
  const i = { id: t, name: n, description: r }, o = (c, s = {}) => ({
    filter: { page: 1, perPage: 40, ...c },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
    ...s
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
function kp({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: i, saving: o, error: c } = e, s = $(null), d = $(null), f = $(o);
  f.current = o;
  const u = $(null), p = Ze();
  X(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), s.current && !s.current.open && s.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = u.current) != null && N.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = $(o);
  X(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = s.current) != null && v.contains(y));
    c && (!i.name.trim() || h.current && !o && N) && ((w = d.current) == null || w.focus()), h.current = o;
  }, [c, o]);
  const m = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: s,
      className: "dq-form-dialog",
      "aria-labelledby": p,
      "aria-modal": "true",
      onCancel: (y) => {
        y.preventDefault(), m();
      },
      onClose: () => {
        var y;
        f.current ? (y = s.current) == null || y.showModal() : r();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), f.current || n();
          },
          children: [
            /* @__PURE__ */ l("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ a("h2", { id: p, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: m,
                  children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              c && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: c }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: o, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Pc,
                  {
                    review: i,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== je(i) && t(ul(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
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
const Ep = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function Ap(e, t, n, r) {
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
  return je(t) === "video" && Tr(t.view.objectFilter, e.view.objectFilter, Io(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ws(e, t) {
  return nr(
    JSON.parse(Yn(kr(e))),
    JSON.parse(Yn(kr(t)))
  );
}
const ki = 180;
function vs(e) {
  return je(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ns(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function qs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ei(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  ri.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  sl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Cp(e) {
  return zt({ ...e, page: 1 });
}
function fl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function _r(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const Tp = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Yi, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(od, { "aria-hidden": "true" }) }
], Ip = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Yi, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(id, { "aria-hidden": "true" }) }
], Ss = [], pl = "(min-width: 900px)";
function Rp(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(pl);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function $p() {
  return typeof window.matchMedia == "function" && window.matchMedia(pl).matches;
}
function Op({
  onNavigate: e
}) {
  const [t, n] = I([]), [r] = I(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [i, o] = I(""), [c, s] = I(!0), [d, f] = I(""), [u, p] = I(!1), [h, m] = I(!1), [y, N] = I(!1), [v, w] = I(!1), [T, R] = I([]), [x, K] = I(""), [E, _] = I(!0), [P, se] = I("account"), [H, j] = I(""), [z, O] = I(""), [D, L] = I(!1), [Y, W] = I(!1), [re, J] = I(""), [S, ie] = I(qs), A = $(S);
  A.current = S;
  const [Q, oe] = I({}), me = $(Q);
  me.current = Q;
  const G = $(t);
  G.current = t;
  const we = $(c);
  we.current = c;
  const Ce = $(!1), pe = $(!0);
  X(() => (pe.current = !0, () => {
    pe.current = !1;
  }), []);
  const [Oe, Ke] = I(!S);
  Oe !== !S && (Ke(!S), S || oe({}));
  const [Ae, $n] = I(vp), { sort: Ne, direction: Je } = Ae, At = (g) => {
    const q = { ...Ae, ...g };
    $n(q), Np(q);
  }, wn = $(null), Pe = $(null), [at, Ie] = I(null), [Ve, Jt] = I(!1), [Fe, On] = I(!1), [ut, Pt] = I(null), [it, Wt] = I(null), qt = !!ut || !!it, ir = $(qt);
  ir.current = qt;
  const Rt = Ve || !!it || Fe, [Mn, Qt] = I(0), [Lt, vn] = I(!1), [Se, Ct] = I(null), ot = $(null), Un = $(null), Yt = $(null), [Le, $t] = I(
    null
  ), de = t.find((g) => g.id === S) ?? null, U = ye(
    () => (Le == null ? void 0 : Le.id) === S && de ? { ...de, view: {
      ...de.view,
      filter: Le.view.filter,
      objectFilter: Le.view.objectFilter,
      searchMode: Le.view.searchMode,
      startFrom: Le.view.startFrom
    } } : de,
    [Le, S, de]
  ), ke = U ? je(U) : "video", ft = to(ke), Bn = U ? $e(U) : !1, ce = ke === "video" ? U : null, Ot = Bn && !!(U != null && U.actions.some(er)), et = !!ce || ke === "audio" || Ot, [De, Xe] = I(null), Xt = (De == null ? void 0 : De.id) === (U == null ? void 0 : U.id) ? De == null ? void 0 : De.mode : (U == null ? void 0 : U.view.reviewMode) ?? "single", st = Bn || ke === "audio" || ke === "video" && Xt === "single", [mt, Dt] = I(0), Zt = $(-1), ct = $(!1), Kn = $(st);
  Kn.current = st, X(() => {
    const g = () => {
      const q = Kn.current;
      if (!q && kn.current) {
        ct.current = !0;
        return;
      }
      Zt.current = -1, It(), q || Dt((M) => M + 1);
    };
    return window.addEventListener("popstate", g), () => window.removeEventListener("popstate", g);
  }, []);
  const en = ft === "audio" ? h : u, Gn = ke === "tag" ? "Tag" : ft === "audio" ? "Audio" : "Video", _t = ke === "tag" ? y : en, Nn = $(
    null
  ), tn = ap(ce), [C, B] = I({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Z, ve] = I({
    page: 1,
    perPage: 40
  }), [ue, Re] = I({ items: [], totalCount: 0 }), [Te, jt] = I(S);
  Te !== S && (jt(S), Re({ items: [], totalCount: 0 }), W(!1));
  const [ge, Ee] = I(!1), [qe, Ut] = I(""), [Fn, Wr] = I(!1), [Qr, Yr] = I(!1), [St, nn] = I(() => /* @__PURE__ */ new Set()), or = $(St);
  or.current = St;
  const gt = $(/* @__PURE__ */ new Map()), qn = (U == null ? void 0 : U.view.selectAllOnLoad) === !0, [_e, tt] = I(null), bt = $(_e);
  bt.current = _e;
  const [yt, Bt] = I(!1), Kt = $(yt);
  Kt.current = yt;
  const dn = $(null), [sr, un] = I(!1), [rn, Ir] = I("grid"), [Rr, ka] = I(ki), [Me, pt] = I(!1), [Sn, $r] = I(!1), kn = $(!1), [Ea, cr] = I(""), [nt, fn] = I(""), [pn, En] = I(""), [Ue, Xr] = I(null), [hn, Or] = I(""), [lr, dr] = I(!1), [Zr, Mr] = I({}), ur = $(/* @__PURE__ */ new Map()), ea = $(null), xn = $(null), fr = !!U, ai = Hi(Rp, $p, () => !1) && fr, [pr, Aa] = I({ top: 0, bottom: 0 });
  Et(() => {
    if (!fr) return;
    const g = () => {
      const M = xn.current;
      if (!M) return;
      const V = Math.round(M.getBoundingClientRect().top + window.scrollY), ee = M.closest("main"), ne = ee ? Math.round(parseFloat(getComputedStyle(ee).paddingBottom) || 0) : 0;
      Aa(
        (te) => te.top === V && te.bottom === ne ? te : { top: V, bottom: ne }
      );
    };
    g();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(g);
    return q == null || q.observe(document.body), window.addEventListener("resize", g), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", g);
    };
  }, [fr]);
  const [ii, Ca] = I(0), Fr = $(null), ta = Tn((g) => {
    var M;
    if ((M = Fr.current) == null || M.disconnect(), Fr.current = null, !g || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => Ca(Math.round(g.getBoundingClientRect().height))
    );
    q.observe(g), Fr.current = q;
  }, []), Mt = $(0), An = $(0), hr = $(null), Vn = $(null), zn = oc(
    U && !st ? Se ? [...U.actions, ...Se.draft.actions] : U.actions : Ss
  ), mn = ye(
    () => Se && U && de ? Ap(Se.draft, U, C, de) : null,
    [Se, U, C, de]
  ), mr = ye(
    () => U && de ? cl(
      { ...de, view: { ...U.view, filter: { ...C, page: 1 } } },
      de
    ) : null,
    [U, de, C]
  ), gr = ye(
    () => de ? Kr(kr(de)) : "",
    [de]
  ), na = ye(
    () => mr != null && Kr(kr(mr)) !== gr,
    [mr, gr]
  ), Ta = ye(
    () => mn != null && Kr(kr(mn)) !== gr,
    [mn, gr]
  );
  X(() => {
    if (!nt) return;
    const g = window.setTimeout(() => fn(""), 4e3);
    return () => window.clearTimeout(g);
  }, [nt]), X(() => {
    if (!at || at.alert) return;
    const g = window.setTimeout(() => Ie(null), 6e3);
    return () => window.clearTimeout(g);
  }, [at]), X(() => {
    const g = ce ? qo(ce.view.objectFilter) : [];
    if (Mr({}), !g.length) return;
    const q = new AbortController();
    let M = !0;
    return Promise.all(
      g.map(async (V) => {
        var ee;
        try {
          const ne = await be(`/api/tags/${V}`, {
            signal: q.signal
          });
          return (ee = ne.name) != null && ee.trim() ? [String(V), ne.name] : null;
        } catch {
          return null;
        }
      })
    ).then((V) => {
      M && Mr(
        Object.fromEntries(V.filter((ee) => ee !== null))
      );
    }), () => {
      M = !1, q.abort();
    };
  }, [ce == null ? void 0 : ce.id, ce == null ? void 0 : ce.view.objectFilter]);
  const oi = ye(
    () => ce ? So(
      ce.view.objectFilter,
      Zr
    ) : (U == null ? void 0 : U.view.objectFilter) ?? {},
    [Zr, U, ce]
  ), ra = Tn(async () => {
    s(!0), f("");
    try {
      const g = await Cd();
      n(g.reviews), o(g.storageKey), p(g.canWriteVideos ?? g.canWrite), m(g.canWriteAudios ?? !1), N(g.canWriteTags ?? !1), w(g.canReadTagGroups ?? !1), _(g.canConfigure ?? !0), se(g.storage ?? "account"), j(g.storageNotice ?? ""), S && !g.reviews.some((q) => q.id === S) && (ie(""), Ei(""));
    } catch (g) {
      f(
        g instanceof Error ? g.message : "Could not load reviews."
      );
    } finally {
      s(!1);
    }
  }, [S]);
  X(() => {
    if (!v) {
      R([]), K("");
      return;
    }
    const g = new AbortController();
    return K(""), Dd(g.signal).then(R).catch((q) => {
      g.signal.aborted || K(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => g.abort();
  }, [v]), X(() => {
    ra();
  }, []), X(() => {
    if (S || t.length === 0) return;
    const g = new AbortController();
    for (const q of t) {
      if (typeof me.current[q.id] == "number") continue;
      ($e(q) ? ko(q, g.signal).then((V) => (V == null ? void 0 : V.length) === 0 ? { items: [], totalCount: 0 } : jr(Eo(q, V), { ...q.view.filter, page: 1, perPage: 1 }, g.signal)) : je(q) === "tag" ? hi(
        q,
        zt({ ...q.view.filter, page: 1, perPage: 1 }),
        g.signal
      ) : jr(
        q,
        zt({ ...q.view.filter, page: 1, perPage: 1 }),
        g.signal
      )).then((V) => {
        g.signal.aborted || oe((ee) => ({
          ...ee,
          [q.id]: V.totalCount
        }));
      }).catch(() => {
        g.signal.aborted || oe((V) => ({ ...V, [q.id]: null }));
      });
    }
    return () => g.abort();
  }, [S, t]), Et(() => {
    var M, V;
    const g = Pe.current;
    if (S || c || !g) return;
    Pe.current = null, (V = (g === "heading" ? null : [...((M = xn.current) == null ? void 0 : M.querySelectorAll("[data-review-id]")) ?? []].find(
      (ee) => ee.dataset.reviewId === g.reviewId
    )) ?? wn.current) == null || V.focus();
  }, [S, c, it, t]);
  const xr = $(0), b = Tn(async () => {
    const g = ++xr.current;
    Xr(null), Or("");
    try {
      const q = await (Ot ? nc(ft) : tc(ft));
      g === xr.current && Xr(q);
    } catch (q) {
      if (g !== xr.current) return;
      Xr(null), Or(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Ot, ft]);
  X(() => {
    b();
  }, [b]);
  const k = Tn(
    async (g, q, M = !1, V = !1) => {
      var ht, Ge;
      const ee = ++Mt.current;
      (ht = hr.current) == null || ht.abort();
      const ne = new AbortController();
      hr.current = ne, q = zt(q);
      const te = Number(q.page);
      M && (q = { ...q, page: 1 }), B(q), Yr(M), Ee(!0), Ut("");
      try {
        const rt = (xe) => je(g) === "tag" ? hi(
          g,
          xe,
          ne.signal
        ) : jr(
          g,
          xe,
          ne.signal
        );
        let dt = await rt(q);
        const Gt = Math.max(
          1,
          Math.ceil(dt.totalCount / Number(q.perPage))
        ), kt = M ? Gt : Math.min(te, Gt);
        return Number(q.page) !== kt && (q = { ...q, page: kt }, dt = await rt(q)), ee === Mt.current && (((Ge = Vn.current) == null ? void 0 : Ge.page) !== kt && (Vn.current = {
          page: kt,
          ids: new Set(dt.items.map((xe) => xe.id))
        }), Re(dt), V && wt(
          () => new Set(dt.items.map((xe) => xe.id))
        ), B(q), ve(q)), dt;
      } catch (rt) {
        throw ee === Mt.current && Ut(
          rt instanceof Error ? rt.message : "Could not load the review queue."
        ), rt;
      } finally {
        ee === Mt.current && Ee(!1);
      }
    },
    []
  );
  X(() => {
    var q;
    if (An.current += 1, Zt.current = -1, Mt.current += 1, (q = hr.current) == null || q.abort(), Ct(null), ot.current = null, W(!1), J(""), O(""), L(!1), nn(/* @__PURE__ */ new Set()), gt.current.clear(), tt(null), Bt(!1), pt(!1), kn.current = !1, cr(""), fn(""), En(""), Re({ items: [], totalCount: 0 }), Vn.current = null, Wr(!1), !U || st) {
      Ee(!1), $t(null);
      return;
    }
    let g = !0;
    return Ee(!0), (async () => {
      let M = de ?? U;
      $t(null);
      let V = null;
      const ee = new URLSearchParams(window.location.search);
      if (je(U) === "video" && ri.some((Ge) => ee.has(Ge)))
        try {
          const Ge = M;
          V = zi(Ge, ee);
          const rt = In(Ge, V.query);
          (V.query.startFrom !== (Ge.view.startFrom ?? "end") || !nr(
            JSON.parse(Yn(rt)),
            JSON.parse(Yn(In(Ge, Ar(Ge))))
          )) && (M = rt, $t(M));
        } catch (Ge) {
          Wr(!0), Ut(Ge instanceof Error ? Ge.message : "Could not read review URL."), Ee(!1);
          return;
        }
      let ne = null;
      try {
        ne = await $d(i, U.id);
      } catch (Ge) {
        g && (L(!0), O(
          Ge instanceof Error ? Ge.message : "Could not load progress."
        ));
      }
      if (!g) return;
      const te = (ne == null ? void 0 : ne.signature) === Yn(M) ? ne : null, ht = V ? V.query.filter : te ? zt(te.filter) : Cp(M.view.filter);
      B(ht), Ir(
        te ? Ns(te.displayMode, je(U)) : vs(U)
      ), ka(
        te ? te.cardSize ?? ki : ki
      );
      try {
        const Ge = await k(
          M,
          ht,
          V ? V.startAtEnd : !te && M.view.startFrom !== "beginning",
          M.view.selectAllOnLoad === !0
        );
        if (!g) return;
        const rt = _o(
          Ge.items.map((dt) => dt.id),
          (te == null ? void 0 : te.focusedId) ?? null,
          (te == null ? void 0 : te.index) ?? 0
        );
        tt(rt), ze(rt);
      } catch {
      }
      g && (Zt.current = mt, W(!0), J(`${U.id}:${mt}`));
    })(), () => {
      var M;
      g = !1, An.current++, Mt.current++, (M = hr.current) == null || M.abort();
    };
  }, [U == null ? void 0 : U.id, st, mt]), X(() => {
    if (!(!Mn || st || !U)) {
      if (Fn) {
        Qt(0);
        return;
      }
      Me || Se || Sn || re !== `${U.id}:${mt}` || (Qt(0), ui());
    }
  }, [
    Mn,
    st,
    U == null ? void 0 : U.id,
    re,
    Me,
    Sn,
    mt,
    Fn
  ]), X(() => {
    !ce || st || !Y || ge || qe || Me || ct.current || Zt.current !== mt || da(ce.id, {
      filter: C,
      objectFilter: ce.view.objectFilter,
      searchMode: ce.view.searchMode,
      startFrom: ce.view.startFrom ?? "end"
    });
  }, [ce, st, Y, ge, qe, C, Me, mt]);
  const F = ye(
    () => ue.items.map((g) => g.id),
    [ue.items]
  );
  X(() => {
    if (!Y || !U || !i || ge || qe || Me || (Le == null ? void 0 : Le.id) === U.id || D || Zt.current !== mt)
      return;
    const g = {
      version: 1,
      signature: Yn(U),
      filter: C,
      focusedId: _e,
      index: Math.max(0, F.indexOf(_e ?? -1)),
      displayMode: rn,
      cardSize: Rr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + U.id,
        JSON.stringify(g)
      );
    } catch {
    }
    if (z) return;
    let q = !0;
    const M = window.setTimeout(() => {
      Od(i, U.id, g).catch((V) => {
        q && O(
          "Progress is kept in this browser, but account sync failed. " + (V instanceof Error ? V.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      q = !1, window.clearTimeout(M);
    };
  }, [
    Y,
    i,
    U,
    ge,
    qe,
    Me,
    C,
    _e,
    F,
    rn,
    Rr,
    Le,
    z,
    D,
    mt
  ]);
  const ae = ue.items.find((g) => g.id === _e) ?? null, he = ke === "video" ? ae : null;
  yt && he && (dn.current = he);
  const fe = he ?? (yt ? dn.current : null), Qe = jo(St, _e), Ft = F.length > 0 && F.every((g) => St.has(g)), ze = Tn((g, q = !0) => {
    g != null && window.requestAnimationFrame(() => {
      var V;
      if (ir.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (V = document.activeElement) != null && V.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const M = ur.current.get(g);
      M == null || M.focus({ preventScroll: !0 }), q && (M == null || M.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  X(() => {
    Y && !Kt.current && ze(bt.current);
  }, [Y, ze]), X(() => {
    ge || !F.length || (bt.current == null || !F.includes(bt.current)) && (tt(F[0]), Kt.current || ze(F[0]));
  }, [ze, F, ge]);
  const wt = Tn(
    (g) => {
      nn((q) => {
        const M = g(q);
        for (const V of /* @__PURE__ */ new Set([...q, ...M]))
          q.has(V) !== M.has(V) && gt.current.set(
            V,
            (gt.current.get(V) ?? 0) + 1
          );
        return M;
      });
    },
    []
  ), lt = Tn(
    (g) => {
      if (!F.length) return;
      const q = Math.max(
        0,
        F.indexOf(bt.current ?? F[0])
      ), M = F[Math.max(0, Math.min(F.length - 1, q + g))];
      tt(M), Kt.current || ze(M);
    },
    [ze, F]
  ), He = Tn(
    async (g, q = !1) => {
      const M = "steps" in g ? g.steps.length > 0 : g.effect.mode !== "SKIP", V = "effect" in g && g.effect.mode === "SET_TAG_GROUP" ? g.effect.tagGroupId : null, ee = V != null && (!v || !T.some((Ye) => Ye.id === V)), ne = "effect" in g && M && !v, te = jo(
        or.current,
        bt.current
      );
      if (!U || kn.current || ge || qe) return;
      const ht = M && !_t ? `${Gn} write permission is required to apply ${g.label}.` : ne || ee ? `${g.label} needs a tag group that is unavailable.` : er(g) && (Ue == null ? void 0 : Ue.kind) !== "ready" ? `Set up tag assessments before applying ${g.label}.` : te.length ? "" : `Select or focus a ${ke} before applying ${g.label}.`;
      if (ht) {
        En(ht);
        return;
      }
      const Ge = ++An.current, rt = U.id, dt = [...F], Gt = ue, kt = bt.current, xe = new Set(or.current), an = new Map(
        te.map((Ye) => [Ye, gt.current.get(Ye) ?? 0])
      ), yr = () => Ge === An.current && U.id === rt;
      kn.current = !0, pt(!0), cr(
        or.current.size ? `${te.length} selected ${ke}s` : `the focused ${ke}`
      ), fn(""), En("");
      const xo = Gt.items.filter(
        (Ye) => !te.includes(Ye.id)
      ), Il = xo.map((Ye) => Ye.id), Po = Uo(
        dt,
        Il,
        kt,
        te.includes(kt ?? -1)
      );
      q || (Re({
        items: xo,
        totalCount: Gt.totalCount
      }), nn((Ye) => {
        const Vt = new Set(Ye);
        for (const bn of te) Vt.delete(bn);
        return Vt;
      }), tt(Po), Kt.current || ze(Po));
      let fi = !1;
      try {
        if ("effect" in g ? await Jd(g, te) : await ac(ft, g, te), fi = !0, !yr()) return;
        q || nn((Ye) => {
          const Vt = new Set(Ye);
          for (const bn of te)
            (gt.current.get(bn) ?? 0) === an.get(bn) && Vt.delete(bn);
          return Vt;
        }), fn(
          `${g.label}: ${te.length} ${ke}${te.length === 1 ? "" : "s"} ${M ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (Ye) {
        if (!yr()) return;
        Re(Gt), nn((Vt) => {
          const bn = new Set(Vt);
          for (const on of te)
            xe.has(on) && (gt.current.get(on) ?? 0) === an.get(on) && bn.add(on);
          return bn;
        }), tt(kt), Kt.current || ze(kt), En(
          Ye instanceof Error ? Ye.message : "Action failed."
        );
      }
      try {
        if (await Ud(g), !yr()) return;
        if (q) {
          const xt = ke === "tag" ? await hi(U, C) : await jr(U, C), Hn = new Map(
            xt.items.map((sn) => [sn.id, sn])
          );
          if (ke !== "tag" && await Promise.all(
            te.filter((sn) => !Hn.has(sn)).map(async (sn) => {
              const Jn = await za(ft, sn).catch(() => null);
              Jn && Hn.set(sn, Jn);
            })
          ), !yr()) return;
          Re((sn) => ({
            items: sn.items.map((Jn) => Hn.get(Jn.id) ?? Jn),
            totalCount: xt.totalCount
          }));
          return;
        }
        const Ye = new Set(te), Vt = qn && dt.length > 0 && dt.every((xt) => Ye.has(xt)), bn = await k(U, C, !1, Vt);
        if (!yr()) return;
        let on = bn.items.map((xt) => xt.id);
        const Ma = Vn.current, Rl = (Ma == null ? void 0 : Ma.page) === Number(C.page) && on.some((xt) => Ma.ids.has(xt)), $l = (U.view.startFrom ?? "end") !== "beginning";
        if (bn.totalCount > 0 && Number(C.page) > 1 && (!on.length || $l && !Rl)) {
          const xt = Math.max(1, Number(C.page) - 1), Hn = { ...C, page: xt };
          B(Hn), on = (await k(
            U,
            Hn,
            !1,
            Vt
          )).items.map((pi) => pi.id), nn(
            (pi) => new Set([...pi].filter((Ol) => on.includes(Ol)))
          );
          const Jn = on.at(-1) ?? null;
          tt(Jn), Kt.current || ze(Jn);
        } else {
          nn(
            (Hn) => new Set([...Hn].filter((sn) => on.includes(sn)))
          );
          const xt = Uo(
            dt,
            on,
            kt,
            fi && te.includes(kt ?? -1)
          );
          tt(xt), Kt.current && xt == null && Bt(!1), Kt.current || ze(xt);
        }
      } catch (Ye) {
        yr() && En(
          (Vt) => `${Vt ? `${Vt} ` : ""}${fi ? "The action completed, but " : ""}the queue could not be refreshed. ${Ye instanceof Error ? Ye.message : "Refresh failed."}`
        );
      } finally {
        yr() && (kn.current = !1, pt(!1), cr(""), ct.current && (ct.current = !1, It(), Dt((Ye) => Ye + 1)));
      }
    },
    [
      _t,
      v,
      T,
      ke,
      Ue,
      k,
      C,
      ze,
      F,
      ue,
      ge,
      qe,
      U
    ]
  );
  function Cn() {
    var M;
    if (rn === "list") return 1;
    const g = (M = ea.current) == null ? void 0 : M.firstElementChild, q = g ? getComputedStyle(g).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const We = $(() => {
  });
  We.current = (g) => {
    var ne;
    if (st || g.defaultPrevented || g.repeat || ln(g) || g.ctrlKey || g.altKey || g.metaKey || qt) return;
    const q = g.target, M = q instanceof Node && ((ne = xn.current) == null ? void 0 : ne.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!M && !V) return;
    if (sr) {
      g.key === "Escape" && (_r(g), un(!1));
      return;
    }
    if (yt && g.key === "Escape") {
      _r(g), Bt(!1), ze(bt.current);
      return;
    }
    if (!vd(q)) return;
    const ee = wd(q);
    if (g.key === "Escape") {
      _r(g), wt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && g.key === " " && ee) {
      _r(g), _e != null && wt((te) => ja(te, _e));
      return;
    }
    if (!(Me || ge) && !yt && g.key === "Enter" && _e != null && ee) {
      if (ke !== "tag" && Se) return;
      _r(g), ke === "tag" ? window.open(`/tag/${_e}`, "_blank", "noopener,noreferrer") : Bt(!0);
      return;
    }
  }, X(() => {
    const g = (q) => We.current(q);
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, []);
  const gn = $(
    () => {
    }
  );
  gn.current = (g) => {
    var ne;
    if (st || qt || yt || sr || Me || ge || !F.length || g.defaultPrevented || g.repeat || g.ctrlKey || g.altKey || g.metaKey)
      return;
    const q = g.target, M = q instanceof Node && ((ne = xn.current) == null ? void 0 : ne.contains(q)) === !0, V = q === document.body || q === document.documentElement;
    if (!M && !V || !g.key.startsWith("Arrow") || !qd(q)) return;
    const ee = Sd(g.key, Cn());
    ee && (g.preventDefault(), M ? g.stopImmediatePropagation() : g.stopPropagation(), lt(ee));
  }, X(() => {
    const g = (q) => gn.current(q);
    return document.addEventListener("keydown", g), () => document.removeEventListener("keydown", g);
  }, []);
  const Tt = (Se == null ? void 0 : Se.saving) === !0 || Sn, aa = Me || ge && !Y || Tt, Ia = ho();
  po({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!U && !st && !qt && !Se && !yt && !sr && !qe && (ue.items.length > 0 || ge || Me),
    actions: (U == null ? void 0 : U.actions) ?? Ss,
    onAction: (g, q) => {
      const M = U == null ? void 0 : U.actions[g];
      M && He(M, q);
    },
    onFind: () => un(!0),
    onSelectAll: () => wt((g) => yd(g, F))
  }), X(() => un(!1), [st, yt, U == null ? void 0 : U.id]);
  function Ra(g) {
    const q = "steps" in g ? g.steps.length > 0 : g.effect.mode !== "SKIP", M = "effect" in g && g.effect.mode === "SET_TAG_GROUP" ? g.effect.tagGroupId : null, V = M != null && !T.some((ee) => ee.id === M);
    return Me || ge || !!qe || q && !_t || "effect" in g && q && (!v || V) || er(g) && (Ue == null ? void 0 : Ue.kind) !== "ready" || !Qe.length;
  }
  function br(g) {
    Xe(null), Qt(0), Ie(null), ie(g), Ei(g, !!g && !U);
  }
  function Pr() {
    Ce.current || (ol() ? (Ce.current = !0, window.history.back()) : br(""));
  }
  function It() {
    const g = Ce.current;
    Ce.current = !1;
    let q = qs();
    q && !we.current && !G.current.some((V) => V.id === q) && (q = "", Ei(""));
    const M = A.current;
    q !== M && (Qt(0), g || Ie(null), !q && M && (Pe.current ?? (Pe.current = { reviewId: M }))), ie(q);
  }
  function Lr() {
    Pe.current = "heading", Ie(null), Pr();
  }
  function si(g) {
    g !== S && br(g), Qt((q) => q + 1);
  }
  function hl() {
    Ie(null), Pt({
      review: ul("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function ml(g) {
    if (Rt || !E) return;
    Ie(null);
    const q = crypto.randomUUID();
    let M;
    const V = S;
    On(!0);
    try {
      if (!await ia((ne) => (M = gd(
        ne.find((te) => te.id === g.id) ?? g,
        ne,
        q
      ), [...ne, M]))) throw new Error("Could not save reviews.");
      if (!pe.current) return;
      A.current !== V ? Ie({ text: `Saved the copy “${M.name}”.`, alert: !1 }) : si(M.id);
    } catch (ee) {
      Ie({
        text: `“${g.name}” was not duplicated. ${$a(ee)}`,
        alert: !0
      });
    } finally {
      On(!1);
    }
  }
  async function gl() {
    if (!ut || ut.saving) return;
    const g = { ...ut.review, name: ut.review.name.trim() }, q = ha(g);
    if (q) {
      Pt({ ...ut, error: q });
      return;
    }
    Pt({ ...ut, saving: !0, error: "" });
    try {
      if (!await ia((M) => [...M, g]))
        throw new Error("Could not save reviews.");
      if (!pe.current) return;
      Pt(null), si(g.id);
    } catch (M) {
      Pt(
        (V) => V && {
          ...V,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (M instanceof Error ? M.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!it || it.pending) return;
    const g = it.review, q = dl(t, Q, Ne, Je).map((ee) => ee.id), M = q.filter((ee) => ee !== g.id), V = M[Math.min(q.indexOf(g.id), M.length - 1)];
    Wt({ review: g, pending: !0 });
    try {
      if (!await ia((ee) => ee.filter((ne) => ne.id !== g.id)))
        throw new Error("Could not save reviews.");
      Pe.current = g.id !== S && V ? { reviewId: V } : "heading", Ie({ text: `Deleted “${g.name}”.`, alert: !1 });
    } catch (ee) {
      Ie({ text: `“${g.name}” was not deleted. ${$a(ee)}`, alert: !0 });
    } finally {
      Wt(null);
    }
  }
  async function yl(g) {
    if (!(Rt || !E)) {
      Ie(null), Jt(!0);
      try {
        const q = await of(g);
        let M = 0;
        if (q.length && !await ia((ee) => {
          const ne = Ai(ee, q);
          return M = ne.length - ee.length, M ? ne : ee;
        }))
          throw new Error("Could not save reviews.");
        const V = q.length - M;
        Ie({
          alert: !1,
          text: q.length ? M ? `Imported ${M === 1 ? "1 review" : `${M} reviews`}.` + (V === 1 ? " 1 review already in the list stays as it is." : V ? ` ${V} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Ie({ alert: !0, text: `Could not import “${g.name}”. ${$a(q)}` });
      } finally {
        Jt(!1);
      }
    }
  }
  function $a(g) {
    return g instanceof Hs ? "Reviews changed in another browser. Reload the page to get them, then try again." : g instanceof Error ? g.message : "Try again.";
  }
  function Ro(g) {
    const q = !E || Rt;
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
        onSelect: () => yo(g)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(Ya, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Ie(null), Wt({ review: g, pending: !1 });
        }
      }
    ];
  }
  function $o(g, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || Fe
      },
      ...Ro(g),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Fe,
        onSelect: Lr
      }
    ];
  }
  async function ia(g) {
    if (!i) return !1;
    let q = [];
    const M = await Rd(i, (te) => {
      q = te;
      const ht = g(te);
      return ht === te ? te : ht.map(xp);
    });
    if (n(M), !pe.current) return !0;
    const V = A.current;
    V && !M.some((te) => te.id === V) && Pr();
    const ee = q.find((te) => te.id === V), ne = M.find((te) => te.id === V);
    return ne && ee && ((ne.view.reviewMode ?? "single") !== (ee.view.reviewMode ?? "single") && Xe(null), ne.view.displayMode !== ee.view.displayMode && Ir(vs(ne))), !0;
  }
  function ci(g) {
    return ia((q) => Fp(q, g));
  }
  function wl(g) {
    return ci(g).catch((q) => {
      throw A.current !== g.id && li(g, q), q;
    });
  }
  function li(g, q) {
    var V;
    if (!pe.current) return;
    const M = ((V = G.current.find((ee) => ee.id === g.id)) == null ? void 0 : V.name) ?? g.name;
    Ie({ text: `“${M}” was not saved. ${$a(q)}`, alert: !0 });
  }
  if (c)
    return /* @__PURE__ */ a(ks, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ l(le, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void jp().catch(
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
          onRetry: () => void ra()
        }
      )
    ] });
  const di = /* @__PURE__ */ l(le, { children: [
    H && /* @__PURE__ */ a("p", { className: "dq-status", children: H }),
    et && (Ue == null ? void 0 : Ue.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      Ue.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: lr,
          onClick: () => {
            dr(!0), Or(""), (Ot ? Gd(ft) : Kd(ft)).then(b).catch(
              (g) => Or(
                `Could not create the ${Ot ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (g instanceof Error ? g.message : "Request failed.")
              )
            ).finally(() => dr(!1));
          },
          children: lr ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    et && ((Ue == null ? void 0 : Ue.kind) === "incompatible" || hn) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Pn, {}),
      hn || (Ue == null ? void 0 : Ue.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: lr,
          onClick: () => {
            dr(!0), b().finally(
              () => dr(!1)
            );
          },
          children: lr ? "Checking…" : "Check again"
        }
      )
    ] }),
    r && /* @__PURE__ */ l("details", { children: [
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
            ), M = document.createElement("a");
            M.href = q, M.download = "data-quality-unassigned-legacy-reviews.json", M.click(), URL.revokeObjectURL(q);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    z && /* @__PURE__ */ l("p", { role: "alert", children: [
      z,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            O(""), L(!1);
          },
          children: D ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    at && (at.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
      at.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: at.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: xn,
      className: `data-quality-page${fr ? " dq-page-fit" : ""}`,
      style: fr ? {
        "--dq-fit-top": `${pr.top}px`,
        "--dq-fit-bottom": `${pr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: at && !at.alert ? at.text : "" }),
        U && st ? /* @__PURE__ */ a(
          yp,
          {
            review: de ?? U,
            canWrite: Bn ? y : en,
            canAssess: (Ue == null ? void 0 : Ue.kind) === "ready" && en,
            onBusy: pt,
            editRequest: Mn,
            onEditRequestHandled: () => Qt(0),
            onSaveDefaults: E ? wl : void 0,
            pageControls: {
              onBack: Lr,
              moreItems: (g) => $o(de ?? U, g),
              onGrid: ce ? () => Xe({ id: ce.id, mode: "multiple" }) : void 0,
              notices: di,
              busy: Fe
            },
            stayOnTap: Lt,
            onStayOnTapChange: vn
          },
          U.id
        ) : U ? Cl(U) : /* @__PURE__ */ a(
          Sp,
          {
            reviews: t,
            counts: Q,
            sort: Ne,
            direction: Je,
            onSortChange: (g) => At({ sort: g }),
            onDirectionChange: (g) => At({ direction: g }),
            storage: Ep[P],
            canConfigure: E,
            busy: Rt,
            headingRef: wn,
            notices: di,
            onOpen: br,
            onNew: () => hl(),
            onImport: (g) => void yl(g),
            onExportAll: () => xc(t, "data-quality-reviews.json"),
            rowMenuItems: (g) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
                disabled: !E || Rt,
                onSelect: () => si(g.id)
              },
              ...Ro(g)
            ]
          }
        ),
        yt && fe && ce && /* @__PURE__ */ a(
          _p,
          {
            video: fe,
            review: ce,
            details: ip(fe, ce, tn.ids),
            selectedCount: St.size,
            pending: Me,
            refreshing: ge || !!qe,
            error: pn,
            canWrite: u,
            assessmentReady: (Ue == null ? void 0 : Ue.kind) === "ready",
            trees: zn,
            selected: St.has(fe.id),
            hasPrevious: F.indexOf(fe.id) > 0,
            hasNext: F.indexOf(fe.id) >= 0 && F.indexOf(fe.id) < F.length - 1,
            onToggleSelected: () => wt((g) => ja(g, fe.id)),
            onPrevious: () => lt(-1),
            onNext: () => lt(1),
            onClose: () => {
              Bt(!1), ze(bt.current);
            },
            onAction: He,
            findOpen: sr,
            onFindOpenChange: un
          }
        ),
        sr && U && !st && !yt && /* @__PURE__ */ a(
          go,
          {
            actions: U.actions,
            tagGroups: T,
            trees: zn,
            isDisabled: Ra,
            onApply: (g, q) => {
              un(!1), He(g, q);
            },
            onClose: () => un(!1)
          }
        ),
        ut && /* @__PURE__ */ a(
          kp,
          {
            draft: ut,
            onChange: (g) => Pt((q) => q && { ...q, review: g, error: "" }),
            onCreate: () => void gl(),
            onCancel: () => Pt(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!it,
            title: "Delete review?",
            message: it ? `“${it.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (it == null ? void 0 : it.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => Wt((g) => g != null && g.pending ? g : null)
          }
        )
      ]
    }
  );
  async function Oa(g, q, M = !1, V = !0) {
    const ee = bt.current, ne = Math.max(0, F.indexOf(ee ?? -1));
    try {
      const te = k(
        g,
        q,
        M,
        g.view.selectAllOnLoad === !0
      ), ht = Mt.current, Ge = await te;
      if (ht !== Mt.current) return;
      const rt = Ge.items.map((Gt) => Gt.id);
      nn(
        (Gt) => new Set([...Gt].filter((kt) => rt.includes(kt)))
      );
      const dt = _o(rt, ee, ne);
      tt(dt), V && !Kt.current && ze(dt, !1);
    } catch {
    }
  }
  function vl(g) {
    const q = Nn.current;
    if (Nn.current = null, aa || !U || !de) return;
    const M = q ?? U.view.objectFilter, V = nr(
      M,
      de.view.objectFilter
    ) ? de.view.objectFilter : M, ee = zt({ ...g, page: 1 }), ne = {
      ...U,
      view: {
        ...U.view,
        filter: ee,
        objectFilter: V
      }
    }, te = !ws(ne, de), ht = te ? ne : de;
    $t(te ? ne : null), fn(te ? "" : "Review queue defaults restored."), Oa(ht, ee, !0);
  }
  function Nl() {
    if (Me || ge || Tt || !de) return;
    Nn.current = null;
    const g = zt({
      ...de.view.filter,
      page: 1
    });
    $t(null), fn("Review queue defaults restored."), Oa(
      de,
      g,
      de.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (Me || ge || qe || Tt || !U || !mr || !E)
      return;
    const g = U, q = mr;
    $r(!0), ci(q).then((M) => {
      !M || A.current !== q.id || ($t(ys(q, g)), fn("Queue saved to this review."));
    }).catch((M) => {
      A.current !== q.id ? li(q, M) : En(M instanceof Error ? M.message : "Could not save queue.");
    }).finally(() => $r(!1));
  }
  function ui() {
    if (!U || !de || kn.current || Se || Sn) return;
    Un.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ot.current = {
      temporaryReview: Le,
      filter: C,
      loadedFilter: Z,
      queue: ue,
      queueError: qe,
      retryFromEnd: Qr,
      selectedIds: new Set(St),
      focusedId: _e,
      pageCursor: Vn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const g = structuredClone({
      ...de,
      view: { ...de.view, startFrom: U.view.startFrom ?? "end" }
    });
    un(!1), Bt(!1), fn(""), En(""), Ct({ draft: g, saving: !1, error: "" });
  }
  function Oo() {
    Ct(null), ot.current = null;
    const g = Un.current;
    Un.current = null, requestAnimationFrame(() => {
      (g == null ? void 0 : g.isConnected) && g !== document.body && !(g instanceof HTMLButtonElement && g.disabled) ? g.focus({ preventScroll: !0 }) : ze(bt.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!Se || Se.saving) return;
    const g = ot.current;
    g && (Mt.current += 1, (q = hr.current) == null || q.abort(), Nn.current = null, Ee(!1), $t(g.temporaryReview), B(g.filter), ve(g.loadedFilter), Re(g.queue), Ut(g.queueError), Yr(g.retryFromEnd), wt(() => g.selectedIds), tt(g.focusedId), Vn.current = g.pageCursor, window.history.replaceState(window.history.state, "", g.url)), Oo();
  }
  async function kl() {
    if (!Se || Se.saving || !mn || !U) return;
    const g = U, q = { ...mn, name: mn.name.trim() }, M = ha(q);
    if (M) {
      Ct((V) => V && { ...V, error: M });
      return;
    }
    Ct((V) => V && { ...V, saving: !0, error: "" });
    try {
      if (!await ci(q)) throw new Error("Could not save reviews.");
      if (!pe.current || A.current !== q.id) return;
      $t(ys(q, g)), je(q) === "video" && da(q.id, {
        filter: C,
        objectFilter: g.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), fn("Review saved."), Oo();
    } catch (V) {
      if (A.current !== q.id) {
        li(q, V);
        return;
      }
      Ct(
        (ee) => ee && {
          ...ee,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (V instanceof Error ? V.message : "Retry saving.")
        }
      );
    }
  }
  function Mo() {
    U && k(U, C, Qr, qn).catch(() => {
    });
  }
  function El() {
    nn(/* @__PURE__ */ new Set()), gt.current.clear(), tt(null);
  }
  function Al(g) {
    !U || Me || Tt || g === Number(C.page) || Mp(
      { ...C, page: g },
      U,
      (q, M) => k(q, M, !1, qn),
      El
    );
  }
  function Fo(g) {
    if (!ce || !de || Me || ge || Tt) return;
    const q = il(ce, g, de.view.objectFilter), M = !ws(q, de);
    $t(M ? q : null), M ? Oa(q, { ...C, page: 1 }) : Oa(
      de,
      { ...C, page: 1 },
      de.view.startFrom !== "beginning"
    );
  }
  function Cl(g) {
    var Ge, rt, dt, Gt, kt;
    const q = ke === "tag", M = q ? "tag" : "video", V = Math.max(1, Number(C.perPage) || 40), ee = Math.max(1, Math.ceil(ue.totalCount / V)), ne = Math.min(Math.max(1, Number(C.page) || 1), ee), te = [
      _t ? "" : `${Gn} write permission is required to apply actions.`,
      q && x ? `Tag groups are unavailable. ${x}` : ""
    ].filter(Boolean), ht = !!pn && !yt;
    return /* @__PURE__ */ l(
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
              entityType: ke,
              onBack: Lr,
              backDisabled: Me || !!Se || Fe,
              onEdit: Se ? () => {
                var xe;
                return (xe = Yt.current) == null ? void 0 : xe.focus();
              } : ui,
              editDisabled: !Se && (Me || ge || Fn || Sn || Fe || !E),
              editing: !!Se,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: aa, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  ua,
                  {
                    filter: qe ? Z : C,
                    onFilterChange: vl,
                    totalCount: ue.totalCount,
                    sortOptions: q ? Gl : Is,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: rn,
                    zoomLevel: (Rr - 225) / 50,
                    onZoomChange: (xe) => ka(Math.round(225 + xe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : Qa,
                    customFieldEntityType: ke === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: oi,
                    onObjectFilterChange: (xe) => {
                      aa || (Nn.current = ke === "video" ? Uc(
                        xe,
                        Zr,
                        g.view.objectFilter
                      ) : xe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_c, { page: ne, pages: ee, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(le, { children: [
                ce && /* @__PURE__ */ a(
                  jc,
                  {
                    mode: "multiple",
                    disabled: Me || ge || qt || !!Se || Sn || Fe,
                    onChange: () => Xe({ id: ce.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  wf,
                  {
                    options: q ? Ip : Tp,
                    value: rn,
                    onChange: (xe) => Ir(Ns(xe, ke))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                wo,
                {
                  disabled: Me || !!Se,
                  items: $o(de ?? g, {
                    onSelect: ui,
                    disabled: ge || Fn || Sn || !E
                  })
                }
              ),
              queueDiffers: Y ? (Le == null ? void 0 : Le.id) === S : void 0,
              queueChange: !Se && (Le == null ? void 0 : Le.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: na ? ql : void 0,
                saveDisabled: Me || ge || !!qe || Tt || !E,
                onReset: Nl,
                resetDisabled: Me || ge || Tt
              } : void 0,
              chipsAfter: (rt = (Ge = ce == null ? void 0 : ce.presentation) == null ? void 0 : Ge.binParents) != null && rt.length || (Gt = (dt = ce == null ? void 0 : ce.presentation) == null ? void 0 : dt.filterBins) != null && Gt.length ? /* @__PURE__ */ l(le, { children: [
                !!((kt = ce.presentation.binParents) != null && kt.length) && /* @__PURE__ */ a(
                  op,
                  {
                    videos: ue.items,
                    review: ce,
                    savedObjectFilter: (de ?? ce).view.objectFilter,
                    trees: tn.ids,
                    disabled: Me || ge || Tt,
                    onToggle: Fo
                  }
                ),
                /* @__PURE__ */ a(
                  sp,
                  {
                    review: ce,
                    savedObjectFilter: (de ?? ce).view.objectFilter,
                    queueFilter: C,
                    queueCount: ge || qe ? null : ue.totalCount,
                    disabled: Me || ge || Tt,
                    countsPaused: Me || ge || Tt || !Y,
                    onToggle: Fo
                  }
                )
              ] }) : void 0,
              chipsEnd: Se ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          di,
          ce && tn.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: tn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            Se && mn && /* @__PURE__ */ a(
              Lc,
              {
                drawerRef: Yt,
                draft: mn,
                onChange: (xe) => Ct((an) => an && { ...an, draft: xe }),
                direction: Se.draft.view.startFrom ?? "end",
                onDirectionChange: (xe) => Ct(
                  (an) => an && {
                    ...an,
                    draft: { ...an.draft, view: { ...an.draft.view, startFrom: xe } }
                  }
                ),
                tagGroups: T,
                trees: zn,
                saving: Se.saving,
                saveDisabled: ge || !!qe,
                error: Se.error,
                dirty: Ta,
                criteriaChanged: na,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  qe && !ge ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      qe,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Mo, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void kl(),
                onCancel: Sl
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${ii}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    ge && !ue.items.length && /* @__PURE__ */ a(ks, { label: "Loading review queue…" }),
                    qe && !ge && /* @__PURE__ */ a(
                      Es,
                      {
                        message: qe,
                        retryLabel: Fn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Fn && de && je(de) === "video") {
                            const xe = Ar(de);
                            da(de.id, { ...xe, filter: { ...xe.filter, page: void 0 } }), Dt((an) => an + 1);
                            return;
                          }
                          Mo();
                        }
                      }
                    ),
                    !Me && !ge && !qe && !ue.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(Xa, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        M,
                        "s match this review."
                      ] })
                    ] }),
                    !!ue.items.length && /* @__PURE__ */ a("div", { ref: ea, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: rn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${Rr}px` },
                        children: ue.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: ta, children: /* @__PURE__ */ a(
                    Cc,
                    {
                      actions: Se ? Se.draft.actions : g.actions,
                      tagGroups: T,
                      trees: zn,
                      isDisabled: Ra,
                      paused: !!Se,
                      busy: Me || ge,
                      onApply: (xe) => void He(xe),
                      onFind: () => un(!0),
                      status: Me ? `Applying action to ${Ea}…` : "",
                      summary: /* @__PURE__ */ l(le, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: St.size ? `${St.size} selected` : _e == null ? "Nothing to apply to" : `Applies to the focused ${M}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !F.length || Ft,
                            onClick: () => wt((xe) => /* @__PURE__ */ new Set([...xe, ...F])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Nt, { binding: Ia.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !St.size,
                            onClick: () => wt(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Nt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: te.length ? te.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : Se ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: ht || nt ? /* @__PURE__ */ l(le, { children: [
                        ht && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Pn, { "aria-hidden": "true" }),
                          pn
                        ] }),
                        nt && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: nt })
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
    var M, V, ee;
    if (ke === "tag") {
      const ne = g;
      return /* @__PURE__ */ a(
        Pp,
        {
          tag: ne,
          displayMode: rn === "list" ? "list" : "grid",
          focused: ne.id === _e,
          selected: St.has(ne.id),
          setRef: (te) => {
            te ? ur.current.set(ne.id, te) : ur.current.delete(ne.id);
          },
          onFocus: () => tt(ne.id),
          onToggle: () => {
            wt((te) => ja(te, ne.id)), ze(ne.id, !1);
          },
          onOpen: () => window.open(`/tag/${ne.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        ne.id
      );
    }
    const q = g;
    return /* @__PURE__ */ a(
      Lp,
      {
        video: rl(q, ce, tn.ids),
        showTagBins: ((V = (M = ce == null ? void 0 : ce.presentation) == null ? void 0 : M.annotations) == null ? void 0 : V.includes("tags")) && !!((ee = ce.presentation.annotationParents) != null && ee.length),
        displayMode: rn,
        cardsScroll: ai,
        focused: q.id === _e,
        selected: St.has(q.id),
        setRef: (ne) => {
          ne ? ur.current.set(q.id, ne) : ur.current.delete(q.id);
        },
        onFocus: () => tt(q.id),
        onToggle: () => wt((ne) => ja(ne, q.id)),
        onPreview: () => {
          Se || (tt(q.id), Bt(!0));
        },
        onNavigate: e
      },
      q.id
    );
  }
}
function Mp(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function ja(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Fp(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function xp(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Pp({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: i,
  onFocus: o,
  onToggle: c,
  onOpen: s,
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
          onSelect: c,
          onClick: s,
          onNavigate: d
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            "aria-label": r ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": r,
            onClick: (f) => {
              f.stopPropagation(), c();
            },
            children: r ? "✓" : ""
          }
        ),
        /* @__PURE__ */ a("button", { type: "button", className: "dq-tag-list-name", onClick: s, children: e.name }),
        /* @__PURE__ */ a("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ a("span", { children: e.description || "" }),
        /* @__PURE__ */ l("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function Lp({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: i,
  selected: o,
  setRef: c,
  onFocus: s,
  onToggle: d,
  onPreview: f,
  onNavigate: u
}) {
  var v, w;
  const p = fl(e), h = $(null), m = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(m.date || m.studioName), N = !!(m.performers.length || m.tags.length);
  return Et(() => {
    const T = h.current;
    if (!T) return;
    const R = T.querySelector(
      `a[href="/video/${e.id}"]`
    ), x = T.querySelector(".card-title"), K = `dq-card-title-${e.id}`;
    x && (x.id = K), R && (R.target = "_blank", R.rel = "noreferrer", R.removeAttribute("aria-label"), R.setAttribute("aria-labelledby", K), R.classList.add("dq-card-link"));
    const E = T.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    E && E.setAttribute(
      "aria-label",
      o ? `Deselect ${p}` : `Select ${p}`
    );
    const _ = T.querySelector(
      'button[title="Quick View"]'
    );
    _ && _.setAttribute("aria-label", `Preview ${p}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (T) => {
        h.current = T, c(T);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${p}${o ? ", selected" : ""}`,
      onFocus: s,
      onClick: (T) => {
        s(), T.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          zl,
          {
            video: m,
            selected: o,
            onSelect: d,
            onNavigate: u,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (v = e.tags) == null ? void 0 : v.map((T) => /* @__PURE__ */ a("span", { children: T.name }, T.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Dp, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Dp({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [i, o] = I(!1), [c, s] = I(!1), [d, f] = I(!1);
  return X(() => {
    const u = n.current;
    if (!u || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      o(!0), s(!0);
      return;
    }
    const p = t ? u.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: p, rootMargin: "320px 0px", threshold: 0 }
    ), m = new IntersectionObserver(
      ([y]) => s(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: p, threshold: [0, 0.6, 1] }
    );
    return h.observe(u), m.observe(u), () => {
      h.disconnect(), m.disconnect();
    };
  }, [e.id, e.files.length, t]), X(() => {
    if (!i) {
      f(!1);
      return;
    }
    const u = new AbortController();
    return be(jd(e.id), {
      signal: u.signal
    }).then((p) => {
      u.signal.aborted || f(p.available === !0);
    }).catch(() => {
      u.signal.aborted || f(!1);
    }), () => u.abort();
  }, [i, e.id]), X(() => {
    const u = r.current;
    u && (c ? Promise.resolve(u.play()).catch(() => {
    }) : u.pause());
  }, [d, c]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ a(
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
function _p({
  video: e,
  review: t,
  details: n,
  selectedCount: r,
  pending: i,
  refreshing: o,
  error: c,
  canWrite: s,
  assessmentReady: d,
  trees: f,
  selected: u,
  hasPrevious: p,
  hasNext: h,
  onToggleSelected: m,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: T,
  onFindOpenChange: R
}) {
  const x = $(null), K = Sa(), E = $(null), _ = $(null), P = e.files[0], se = fl(e), H = (L) => i || o || "steps" in L && L.steps.length > 0 && !s || er(L) && !d;
  po({
    surface: "overlay",
    enabled: !T,
    actions: t.actions,
    onAction: (L, Y) => {
      const W = t.actions[L];
      W && w(W, Y);
    },
    onFind: () => R(!0)
  }), X(() => {
    var Y;
    const L = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (Y = x.current) == null || Y.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = L;
    };
  }, []);
  function j(L) {
    var re, J, S;
    if (L.key !== "Tab") return;
    const Y = [
      ...((re = x.current) == null ? void 0 : re.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((ie) => ie.offsetParent !== null);
    if (!Y.length) {
      L.preventDefault(), (J = x.current) == null || J.focus();
      return;
    }
    const W = Y.indexOf(
      document.activeElement
    );
    L.shiftKey && W <= 0 ? (L.preventDefault(), (S = Y.at(-1)) == null || S.focus()) : !L.shiftKey && W === Y.length - 1 && (L.preventDefault(), Y[0].focus());
  }
  function z(L) {
    if (T || L.defaultPrevented || L.ctrlKey || L.metaKey || L.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const Y = L.key === "ArrowLeft" || L.key === "ArrowRight";
    if (L.altKey && !Y) return;
    const W = E.current, re = L.currentTarget.querySelector("video");
    if (L.key === "Enter" || L.key === "Escape")
      L.repeat || v();
    else if (L.key === " " && W)
      L.repeat || W.toggle();
    else if (Y && W)
      W.seekBy(
        (L.key === "ArrowLeft" ? -1 : 1) * (L.shiftKey ? 5 : L.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(L.key) && W) {
      const J = _.current;
      if (!L.repeat && (J == null ? void 0 : J.videoId) === e.id) {
        const S = [P == null ? void 0 : P.duration, re == null ? void 0 : re.duration].find(
          (oe) => oe != null && Number.isFinite(oe) && oe > 0
        ) ?? 0, ie = e.parentVideoId != null, A = ie ? e.clipStartSec ?? 0 : 0, Q = (ie ? e.clipEndSec ?? S : S) - A;
        Number.isFinite(Q) && Q > 0 && Number.isFinite(J.time) && W.seekBy(A + Q * Number(L.key) / 10 - J.time);
      }
    } else if (L.key === "ArrowUp" || L.key === "ArrowDown")
      !L.repeat && !i && !o && (L.key === "ArrowUp" && p && y(), L.key === "ArrowDown" && h && N());
    else return;
    _r(L);
  }
  function O(L) {
    const Y = x.current, W = L.target instanceof Element ? L.target.closest("button, a[href]") : null;
    !Y || !W || !Y.contains(W) || W.closest(".dq-player, .dq-find-action") || L.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  X(() => {
    if (T) return;
    let L = 0;
    const Y = requestAnimationFrame(() => {
      L = requestAnimationFrame(() => {
        var re;
        const W = document.activeElement;
        (re = x.current) != null && re.isConnected && (!W || W === document.body || W === document.documentElement) && x.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(Y), cancelAnimationFrame(L);
    };
  }, [T, i, o, h, p, e.id, K]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: x,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${se}`,
      className: `dq-preview${K ? " dq-preview-mobile" : ""}`,
      onKeyDown: j,
      onKeyDownCapture: z,
      onMouseDown: (L) => {
        L.target === L.currentTarget && v();
      },
      onClick: O,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ l("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ l(
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
                  /* @__PURE__ */ a(wa, { "aria-hidden": "true" }),
                  !K && /* @__PURE__ */ a(Nt, { binding: "↑", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ l(
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
                  !K && /* @__PURE__ */ a(Nt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ds, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: se }),
              (n.performers.length > 0 || n.tags) && /* @__PURE__ */ l("div", { className: "dq-preview-details", children: [
                n.performers.length > 0 && /* @__PURE__ */ a("span", { className: "dq-preview-performers", children: n.performers.join(", ") }),
                n.tags && (n.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-preview-tags", "aria-label": "Matching tags", children: n.tags.map((L) => /* @__PURE__ */ a("li", { children: L.name }, L.id)) }) : /* @__PURE__ */ a("small", { children: "No matching tags" }))
              ] }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                D
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": u,
                disabled: o,
                onClick: m,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: u && /* @__PURE__ */ a(zr, {}) }),
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
                "aria-label": `Open ${se} in a new tab`,
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
                children: /* @__PURE__ */ a(ya, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: P ? /* @__PURE__ */ a(
            Rs,
            {
              autostart: !0,
              streamUrl: Ri("video", e.id),
              posterUrl: Ko(e),
              format: P.format,
              audioCodec: P.audioCodec,
              duration: P.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (L) => {
                _.current = { videoId: e.id, time: L };
              },
              onPlaybackControlRegister: (L) => (E.current = L, () => {
                E.current === L && (E.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: Ko(e), alt: "" }) }) }),
          c && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: c }),
          !K && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
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
              isDisabled: H,
              busy: i || o,
              onApply: (L) => void w(L),
              onFind: () => R(!0),
              status: i ? `Applying action to ${D}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: r ? `${r} selected` : "This video" })
            }
          )
        ] }),
        T && /* @__PURE__ */ a(
          go,
          {
            actions: t.actions,
            trees: f,
            isDisabled: H,
            onApply: (L, Y) => {
              R(!1), w(L, Y);
            },
            onClose: () => R(!1)
          }
        )
      ]
    }
  );
}
async function jp() {
  const e = await be("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let r = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const c = JSON.parse(n);
      Array.isArray(c.reviews) && (r = JSON.stringify(c.reviews, null, 2));
    } catch {
    }
  const i = URL.createObjectURL(
    new Blob([r], { type: "application/json" })
  ), o = document.createElement("a");
  o.href = i, o.download = "data-quality-browser-recovery.json", o.click(), URL.revokeObjectURL(i);
}
function ks({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(ad, { className: "dq-spin" }),
    e
  ] });
}
function Es({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Pn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Hp = { components: { DataQualityPage: Op } };
export {
  Op as DataQualityPage,
  Hp as default,
  nr as objectFiltersEqual
};
