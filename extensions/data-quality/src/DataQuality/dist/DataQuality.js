import { jsxs as u, Fragment as pe, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as R, useEffect as ee, useLayoutEffect as $t, useMemo as ve, useCallback as Sn, useSyncExternalStore as Hi, useId as Xe, createContext as Ml, useContext as Fl, Fragment as Ji } from "react";
import { useKeySequence as xl, EntityReferenceMultiSelector as Zn, SortableList as As, TagBadge as Pl, EntityReferenceSelector as Lo, EntityDetailTabs as Ll, FilterDialog as Cs, VIDEO_CRITERIA as Za, DetailListToolbar as ma, PERFORMER_CRITERIA as Qi, AUDIO_CRITERIA as Ts, NarrativeText as Dl, AUDIO_SORT_OPTIONS as _l, VIDEO_SORT_OPTIONS as Is, AudioPlayer as jl, VideoPlayer as Rs, formatDuration as $s, getResolutionLabel as Ul, ConfirmDialog as Bl, TAG_CRITERIA as Kl, TAG_SORT_OPTIONS as Gl, TagTile as Vl, VideoCard as zl } from "@cove/runtime/components";
import { Search as va, Flag as xn, Check as zr, Pencil as Gr, Ban as za, ChevronDown as Wi, Plus as Na, Pin as Os, GripVertical as Ms, AlertTriangle as Mn, Copy as Fs, Trash2 as ei, X as qa, Mic as Hl, Users as xs, Tag as Ps, Headphones as Ls, Film as ti, ChevronLeft as Sa, MoreHorizontal as Jl, RectangleHorizontal as Ql, LayoutGrid as Yi, ChevronRight as Ds, Save as Wl, RotateCcw as Yl, Layers as Do, Undo2 as Xl, RefreshCw as Zl, ExternalLink as _s, SkipForward as ed, Upload as td, Download as js, ArrowUp as nd, ArrowDown as rd, Loader2 as ad, List as id, Grid3X3 as od } from "@cove/runtime/lucide-react";
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
function ga(e) {
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
function $e(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function to(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ue(e) {
  return to(_e(e));
}
function dd(e) {
  return _e(e) === "video";
}
function _e(e) {
  return e.entityType ?? "video";
}
const Wn = [
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
], ni = [
  Wn.slice(0, 11),
  Wn.slice(11, 22),
  Wn.slice(22)
];
function pa(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function ba(e) {
  return pa(e) ?? e.toLocaleUpperCase();
}
const Yn = "none";
function yr(e) {
  return typeof e == "string" && Wn.includes(e);
}
function no(e) {
  const t = e.shortcut;
  return yr(t) || t === Yn ? t : "auto";
}
function Ks(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = [];
  e.forEach((s, c) => {
    const d = no(s);
    if (d !== Yn) {
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
  const o = Wn.filter((s) => !n.has(s));
  return i.forEach((s, c) => {
    const d = o[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function ud(e, t, n) {
  const { keys: r, actionOn: i } = Ks(e), o = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (yr(n)) {
    const c = i.get(n), d = r[t];
    c !== void 0 && c !== t && o.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...o.values()].filter(yr));
  return e.map((c, d) => {
    const f = o.has(d) ? o.get(d) : yr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: l, ...m } = c;
    return f === void 0 ? m : { ...m, shortcut: f };
  });
}
function ya(e) {
  var n;
  return $e(e) && !Vs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !dd(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : _e(e) !== "tag" && e.actions.some(
    (r) => ro(r)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((r) => Pn(r, _e(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((r) => r.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : (((n = e.presentation) == null ? void 0 : n.filterBins) ?? []).some((r) => !r.label.trim() || !Object.keys(r.filter).length) ? "Name every filter bin and give it a filter before saving." : "";
}
const fd = {
  video: 1e3,
  audio: 250
};
function Zt(e, t = "video") {
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
function Qn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    $e(e) ? [e.entityType, ...r, e.occurrence] : _e(e) === "video" ? r : [_e(e), ...r]
  );
}
function Pn(e, t) {
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
function Fn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function tr(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Gs(e) {
  return "steps" in e && e.steps.length > 0;
}
function Xn(e) {
  return "steps" in e ? e.steps.some((t) => Fn(t.mode)) : !1;
}
function ro(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Fn(n.mode))
      for (const r of n.tagIds) {
        const i = t.get(r);
        if (i && i !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function ka(e) {
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
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Pn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (i) => i && Array.isArray(i.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Pn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => ya(n)))
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
const Ea = /* @__PURE__ */ new Map(), La = /* @__PURE__ */ new Map(), mr = (e, t) => e.includes("*") || e.includes(t), Ha = (e) => ye(`/api/savedfilters?mode=${encodeURIComponent(e)}`), Ed = () => ({
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
    reviews: ka(JSON.stringify(t.reviews)),
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
      const s = ka(o);
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
  const n = (La.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return La.set(e, n), n.finally(() => {
    La.get(e) === n && La.delete(e);
  }).catch(() => {
  }), n;
}
let da = null;
function Cd() {
  if (da) return da;
  const e = Td();
  return da = e, e.finally(() => {
    da === e && (da = null);
  }).catch(() => {
  }), e;
}
async function Td() {
  const e = await ye("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return ao(t, () => Id(e, t));
}
async function Id(e, t) {
  var h;
  const n = String(e.user.id), r = mr(e.permissions, "savedfilters.read"), i = r && mr(e.permissions, "savedfilters.write"), o = r ? (await Ha(zs)).filter((g) => g.name === "Data Quality configuration").sort((g, y) => g.id - y.id) : [];
  if (o.length > 1) {
    const g = (y) => {
      const { revision: N, ...v } = Dr(y.uiOptions);
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
  let s = o.length ? Dr(o[0].uiOptions) : Ed();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !o.length && d && (s = Dr(d));
  let l = !o.length;
  if (o.length && f && d) {
    const g = Dr(d);
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
      reviews: Ai(s.reviews, g.reviews).filter(
        (N) => !y.includes(N.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...g.importedIds])
      ]
    }, l = !0;
  }
  if (!c) {
    const g = JSON.stringify(s), y = Ad(n);
    if (o.length && y.reviews.some((k) => {
      const O = s.reviews.find((F) => F.id === k.id);
      return O && JSON.stringify(O) !== JSON.stringify(k);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const N = r ? (await Ha(kd)).flatMap(
      (k) => ka(k.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (k) => !y.reviews.some((O) => O.id === k)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: Ai(
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
    }, l || (l = JSON.stringify(s) !== g);
  }
  const m = {
    userId: n,
    recordId: (h = o[0]) == null ? void 0 : h.id,
    config: s,
    readable: r,
    writable: i,
    durable: i
  };
  if (Ea.set(t, m), l && i) {
    const g = s;
    o.length && (m.config = Dr(o[0].uiOptions)), await Qs(t, g), s = m.config;
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
    canWrite: mr(e.permissions, "videos.write"),
    canWriteVideos: mr(e.permissions, "videos.write"),
    canWriteAudios: mr(e.permissions, "audios.write"),
    canWriteTags: mr(e.permissions, "tags.write"),
    canReadTagGroups: mr(e.permissions, "taggroups.read"),
    canConfigure: !r || i,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? i ? "account" : "readOnly" : "browser",
    storageNotice: r ? i ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Qs(e, t) {
  const n = Ea.get(e);
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
      if (Dr(o.uiOptions).revision !== n.config.revision)
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
    const n = Ea.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, i = t(r);
    if (i === r) return r;
    ka(JSON.stringify(i));
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
  const n = Ea.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), i = r ? Bo(r) : null;
  if (!n.readable) return i;
  const o = (await Ha(Ci)).find(
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
    const i = Ea.get(e);
    if (!(i != null && i.writable)) return;
    await Js(i);
    const o = (await Ha(Ci)).find(
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
function nr(e) {
  return e === "audio" ? "audios" : "videos";
}
const Md = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function En(e) {
  return Md[e];
}
const Ja = "confirmed_absent_tags", io = "Confirmed absent tags", ri = "confirmed_absent_occurrence_tags", Ws = {
  key: Ja,
  label: io,
  type: "tag",
  subject: "tag assessments"
}, oo = {
  key: ri,
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
function Ln(e) {
  return Array.isArray(e) ? e.map(Ln) : e && typeof e == "object" ? Object.fromEntries(
    Object.entries(e).map(([t, n]) => [
      t,
      t === "modifier" && typeof n == "string" ? Fd[n] ?? n : t === "key" && typeof n == "string" && [
        Ja,
        ri
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Ln(n)
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
function Qa(e, t) {
  return ye(
    `/api/${nr(e)}/${t}?dqRead=${Pd}-${++Ld}`,
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
    Ln({
      findFilter: Zt(t, Ue(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function jr(e, t, n) {
  return ye(
    `/api/${nr(Ue(e))}/find`,
    { method: "POST", signal: n, body: Xs(e, t) }
  );
}
async function Zs(e, t, n) {
  return (await ye(
    `/api/${nr(Ue(e))}/aggregate`,
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
      Ln({
        findFilter: Zt(t),
        objectFilter: r
      })
    )
  });
}
function Dd(e) {
  return ye("/api/taggroups", { signal: e });
}
function Ii(e, t, n = 1280) {
  return `/api/${nr(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
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
async function ai(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await ye(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let i = 1; ; i++) {
      const o = await ye("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ln({
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
  const n = tr(e);
  return (await Promise.all(
    e.steps.map(
      async (i) => i.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await ai(i.tagIds, t)).filter(
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
    message: `Add ${En(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
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
function Wa(e) {
  return [...new Set(e)];
}
function rc(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (o) => o.toLowerCase() === ri
  ), i = r === void 0 ? [] : n[r];
  return Wa(
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
  await ye(`/api/${nr(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Wa(i).map((s) => `${r}:${s}`)
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
  if (!Pn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${En(e).many} and configure a valid action first.`
    );
  let r = null;
  if (Xn(t)) {
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
  const i = Wa(n), o = (await so(t)).map((d) => ({
    mode: d.mode,
    tagIds: Wa(d.tagIds)
  })), c = [
    ...o.filter((d) => !Fn(d.mode)),
    ...o.filter((d) => Fn(d.mode))
  ].map(
    (d) => zd(d, i, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await ye(`/api/${nr(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${En(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function Hd(e, t) {
  if (!Pn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await ye("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Da = (e) => e >= "0" && e <= "9";
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
    if (Da(e[n]) && Da(t[r])) {
      const c = n, d = r;
      for (; n < e.length && Da(e[n]); ) n++;
      for (; r < t.length && Da(t[r]); ) r++;
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
function wr(e) {
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
  const r = tr(e), i = [], o = [];
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
    ...o.filter((h) => !Fn(h.mode)),
    ...o.filter((h) => Fn(h.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
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
          c.add(g), d.delete(g);
          break;
        case "MARK_ABSENT":
          c.delete(g), d.add(g);
          break;
        case "CLEAR_ABSENCE":
          d.delete(g);
          break;
      }
  const f = new Set(t.ids), l = new Set(t.absent), m = [...new Set(e.steps.flatMap((h) => h.tagIds))];
  return {
    added: m.filter((h) => c.has(h) && !f.has(h)),
    removed: [...f].filter((h) => !c.has(h)),
    markedAbsent: m.filter((h) => d.has(h) && !l.has(h)),
    absenceCleared: [...l].filter((h) => !d.has(h)),
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
  return wr(t);
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
      i.current.has(c) || (i.current.add(c), ai([c]).then(
        (d) => {
          o.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          i.current.delete(c);
        }
      ));
  }, [t]), n;
}
function vt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function Nr(e) {
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
  return tr(e).size > 0 || lc(e).size > 0;
}
function Wd(e) {
  return Nr(e).filter(
    (t) => !t.actions.some((n) => dc(e[n]))
  );
}
function Oi(e, t) {
  const n = cc(t), r = new Set(t.absent);
  return Nr(e).map((i) => {
    const o = [], s = [];
    for (const c of i.actions) {
      const d = [...tr(e[c])], f = [...lc(e[c])], l = [
        ...d.map((m) => n.has(m)),
        ...f.map((m) => r.has(m))
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
const Ur = "review";
function Xd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Zd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function gr(e, t) {
  const n = new Set(Xd(e));
  return t.filter((r) => n.has(r.id));
}
function Ho(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of gr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const d = c.categoryTagId === void 0 ? i(Ur, () => ({
        key: Ur,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : i(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: l, resolved: m } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: l,
          flags: [],
          mixed: [],
          ...m ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(s.name) || d.flags.push(s.name);
    }
  const o = [...r.values()];
  return [
    ...o.filter((s) => s.key === Ur),
    ...o.filter((s) => s.key !== Ur)
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
    ...n.filter((r) => r.key === Ur),
    ...n.filter((r) => r.key !== Ur)
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
  const r = gr(e, t).map((i) => {
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
function Hr(e) {
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
  const s = Hr(n), c = R({ keyMap: s, onAction: r, onFind: i, onSelectAll: o });
  $t(() => {
    c.current = { keyMap: s, onAction: r, onFind: i, onSelectAll: o };
  });
  const d = !!i && n.length > 0, f = e === "local" && !!o, l = Wn.filter(
    (h) => s.actionOn.has(h) || cu.includes(h)
  ).join(" "), m = ve(() => {
    const h = (N, v) => {
      var k, O;
      const w = c.current;
      if (N === Jo) (k = w.onSelectAll) == null || k.call(w);
      else if (N === xi) (O = w.onFind) == null || O.call(w);
      else {
        const F = lu.has(N), U = F || N.startsWith(mi), C = F ? du(v) : U ? N.slice(mi.length) : N, L = C === void 0 ? void 0 : w.keyMap.actionOn.get(C);
        L !== void 0 && w.onAction(L, U);
      }
    }, g = (N, v = e) => ({
      keys: N,
      surface: v,
      action: (w) => {
        w != null && w.repeat || h((w == null ? void 0 : w.sequence) ?? N, w);
      }
    }), y = [];
    f && y.push(g(Jo, "local")), d && y.push(g(xi));
    for (const N of l ? l.split(" ") : []) {
      const v = pc[N];
      y.push(g(N), ...(v ?? [`${mi}${N}`]).map((w) => g(w)));
    }
    return y;
  }, [e, l, d, f]);
  xl(m, t);
}
const uu = {
  find: xi,
  selectAll: su
};
function ho() {
  return uu;
}
const fu = 600 * 1e3, mo = /* @__PURE__ */ new Map(), hc = /* @__PURE__ */ new Map(), Jn = /* @__PURE__ */ new Map();
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
  const t = Jn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: ye(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (i) => {
        var l, m;
        const o = ((l = i == null ? void 0 : i.name) == null ? void 0 : l.trim()) || null;
        if (Jn.get(e) === r && Jn.delete(e), !o) return null;
        const s = yc({ ...i, id: e, name: o }), c = (m = mo.get(e)) == null ? void 0 : m.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return gc(f), mc(f);
      },
      () => (Jn.get(e) === r && Jn.delete(e), null)
    )
  };
  return Jn.set(e, r), r;
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
        l.waiters -= 1, l.waiters === 0 && Jn.get(f) === l && (Jn.delete(f), l.controller.abort());
    }, d = () => {
      s || (s = !0, c(), o(Wo()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: l }) => l.promise.then((m) => [f, m])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [l, m] of f) n[l] = m;
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
function Aa(e) {
  const t = [...new Set(e)].sort((i, o) => i - o).join(","), [n, r] = T(() => ({
    key: t,
    tags: gi(bi(t))
  }));
  return ee(() => {
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
function Jr(e) {
  const t = Aa(e);
  return ve(() => wc(t), [t]);
}
function bi(e) {
  return e ? e.split(",").map(Number) : [];
}
const mu = "(max-width: 760px)";
function vc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = Sn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Hi(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function Ca() {
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
function Sr(e, t, n = [], r) {
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
  const i = tr(e), o = (s) => i.has(s) || [...i].some((c) => {
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
function ii(e) {
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
  const d = Ca(), [f, l] = T(""), [m, h] = T(0), g = R(null), y = R(null), N = R(null), v = R(null), w = R(null), k = R(/* @__PURE__ */ new Set()), O = Xe(), F = Jr(ve(() => ii(e), [e])), U = Hr(e), C = ve(() => {
    const _ = f.trim().toLocaleLowerCase(), V = (M) => M ? Wn.indexOf(M) : Wn.length;
    return e.map((M, D) => ({ action: M, index: D, key: U.keys[D] })).sort((M, D) => V(M.key) - V(D.key)).filter((M) => !_ || M.action.label.toLocaleLowerCase().includes(_));
  }, [e, U, f]), L = C.length ? Math.min(m, C.length - 1) : -1, x = (_) => `${O}-option-${_}`;
  $t(() => {
    var _, V, M;
    return v.current = document.activeElement, w.current = ((V = (_ = N.current) == null ? void 0 : _.parentElement) == null ? void 0 : V.closest('[role="dialog"]')) ?? null, (M = g.current) == null || M.focus({ preventScroll: !0 }), () => {
      var P;
      const D = v.current;
      D instanceof HTMLElement && D.isConnected && D.focus({ preventScroll: !0 }), document.activeElement !== D && ((P = w.current) != null && P.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), ee(() => {
    var _, V, M;
    L < 0 || (M = (V = (_ = y.current) == null ? void 0 : _.querySelector(`[id="${x(C[L].index)}"]`)) == null ? void 0 : V.scrollIntoView) == null || M.call(V, { block: "nearest" });
  }, [L, C]);
  function re(_, V) {
    !_ || r != null && r(_.action) || s(_.action, i && V);
  }
  function J(_) {
    var M;
    _.stopPropagation();
    const V = _.code || _.key;
    if (_.repeat || k.current.add(V), !ln(_)) {
      if (_.repeat && !k.current.has(V)) {
        _.preventDefault();
        return;
      }
      if (_.key === "Escape")
        _.preventDefault(), _.repeat || c();
      else if (_.key === "Enter")
        _.preventDefault(), _.repeat || re(C[L], _.shiftKey);
      else if (_.key === "ArrowDown" || _.key === "ArrowUp") {
        if (_.preventDefault(), !C.length) return;
        const D = _.key === "ArrowDown" ? 1 : -1;
        h((L + D + C.length) % C.length);
      } else _.key === "Tab" && (_.preventDefault(), (M = g.current) == null || M.focus());
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
          _.target !== g.current && _.preventDefault();
        },
        children: [
          /* @__PURE__ */ u("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(va, { "aria-hidden": "true" }),
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
                "aria-activedescendant": L >= 0 ? x(C[L].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (_) => {
                  l(_.target.value), h(0);
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
                  onClick: (M) => re(_, M.shiftKey || o && Gs(_.action)),
                  children: [
                    d ? null : _.key ? /* @__PURE__ */ u(pe, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": pa(_.key) ? !0 : void 0, children: _.key }),
                      pa(_.key) && /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: pa(_.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: _.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: Sr(_.action, F, t, n).map(
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
const bu = [], Li = ni.map(
  (e, t) => ({ indent: t, keys: e })
), Yo = Li.length - 1;
function Nt({ binding: e, hidden: t }) {
  const n = t ? void 0 : pa(e), r = /* @__PURE__ */ a(
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
function _a(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function kc(e) {
  return ni.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
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
          /* @__PURE__ */ a(va, { "aria-hidden": "true" }),
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
                /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ u(pe, { children: [
                /* @__PURE__ */ a(zr, { "aria-hidden": "true" }),
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
  attention: m = bu,
  stayOnTap: h = !1,
  onStayOnTapChange: g
}) {
  const y = ho(), N = Hr(e), v = Ca();
  qc(o, v);
  const w = Xe(), k = Jr(
    ve(() => e.flatMap((S) => S.steps.flatMap((se) => se.tagIds)), [e])
  ), O = Li.filter((S) => S.keys.some((se) => N.actionOn.has(se))), F = O.includes(Li[Yo]), U = e.length - N.actionOn.size, C = ve(
    () => l && !f ? Nr(e) : [],
    [l, f, e]
  ), L = ve(
    () => C.length && r ? Oi(e, r) : null,
    [C, e, r]
  ), x = new Map(
    Mi(L ?? []).flatMap(
      (S) => S.actions.filter((se) => dc(e[se])).map((se) => [se, S.name])
    )
  ), re = ve(
    () => e.map((S) => f ? [] : ru(S, m, i)),
    [e, m, i, f]
  ), J = (S) => S.map(iu).join("; "), _ = re.map(J), V = C.length > 0 && /* @__PURE__ */ a(
    yu,
    {
      groups: C,
      statuses: L,
      actions: e,
      attentionOf: (S) => J([
        ...new Map(
          S.actions.flatMap((se) => re[se]).map((se) => [se.key, se])
        ).values()
      ])
    }
  ), M = (S) => {
    const se = Sr(e[S], k, [], i).map((ce) => ce.text).join(", "), E = x.get(S), X = _[S];
    return [
      se,
      E === void 0 ? "" : `${E}: not answered yet`,
      X ? `Needs attention: ${X}` : ""
    ].filter(Boolean).join(". ");
  }, D = (S) => _[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${_[S]}`,
        children: /* @__PURE__ */ a(xn, {})
      }
    )
  ) : null, P = (S) => ({
    onMouseEnter: () => o.set(S),
    onMouseLeave: () => o.clear(S),
    onFocus: () => o.set(S),
    onBlur: () => o.clear(S)
  }), Y = (S) => {
    const se = N.actionOn.get(S), E = se === void 0 ? void 0 : e[se];
    if (!E)
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
    const X = t(E), ce = `${w}-effect-${S}`;
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
          disabled: X,
          onClick: (ue) => s(E, ue.shiftKey),
          children: [
            /* @__PURE__ */ a(Nt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: E.label }),
            _a(E) && " ",
            _a(E) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
              "absent"
            ] }),
            D(se)
          ]
        }
      )
    ] }, S);
  }, W = /* @__PURE__ */ u("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (v) {
    const S = kc(N), se = (E) => {
      const X = e[E], ce = N.keys[E];
      return /* @__PURE__ */ u(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: X.label,
          "aria-keyshortcuts": ce,
          "aria-describedby": `${w}-effect-${ce}`,
          "data-group-open": x.has(E) || void 0,
          "data-attention": _[E] ? !0 : void 0,
          disabled: t(X),
          onClick: (ue) => {
            o.clear(X), s(X, ue.shiftKey || h && Gs(X));
          },
          ...f ? {} : Sc(o, X),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: X.label }),
            _a(X) && " ",
            _a(X) && /* @__PURE__ */ u("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
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
            f ? W : /* @__PURE__ */ a(
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
            g && /* @__PURE__ */ a(wu, { checked: h, onChange: g })
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
                  extra: U,
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
        /* @__PURE__ */ a(Nt, { binding: y.find }),
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
              Q
            ] })
          ) : /* @__PURE__ */ u(pe, { children: [
            !f && ie,
            Q
          ] })
        ] }),
        O.map((S) => /* @__PURE__ */ u("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(Y),
          S.indent === Yo && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ u(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": U ? `Find action, ${U} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(Nt, { binding: y.find }),
                /* @__PURE__ */ u("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(va, { "aria-hidden": "true" }),
                  U ? `${U} more` : "Find action"
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
  const d = bo(o), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const g = t.actionOn.size;
    return /* @__PURE__ */ u("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && g < e.length && /* @__PURE__ */ u(pe, { children: [
        ` · ${g} on keys, ${e.length - g} more under `,
        /* @__PURE__ */ a(Nt, { binding: s })
      ] })
    ] });
  }
  const l = t.keys[f], m = r && d.steps.length ? lo(d, r, i) : null, h = m && !m.unresolvedTrees.length && ![m.added, m.removed, m.markedAbsent, m.absenceCleared].some(
    (g) => g.length
  );
  return /* @__PURE__ */ u("p", { className: "dq-pad-effect", children: [
    l && !c && /* @__PURE__ */ a(Nt, { binding: l }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    Sr(d, n, [], i).map((g, y) => /* @__PURE__ */ a("span", { "data-effect-tone": g.tone, children: g.text }, y)),
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
  onFind: s,
  summary: c,
  hints: d,
  keyHints: f,
  notices: l,
  status: m,
  className: h = "",
  paused: g = !1
}) {
  const y = ho(), N = Hr(e), v = Ca(), w = Xe(), k = Jr(ve(() => ii(e), [e])), [O] = T(() => Nc());
  qc(O, v);
  const F = R(null), U = Nu(F, e, !v), C = kc(N);
  !C.length && e.length && C.push([]);
  const L = C.flat(), x = e.length - L.length, re = (M) => Sr(M, k, t, n).map((D) => D.text).join(", "), J = (M) => ({
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
        disabled: g || r(D),
        onClick: () => {
          O.clear(D), o(D);
        },
        ...g ? {} : Sc(O, D),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: D.label })
      },
      D.id
    );
  };
  return /* @__PURE__ */ u(
    "section",
    {
      ref: F,
      className: `dq-action-bar${v ? " dq-bar-mobile" : U ? " dq-bar-stacked" : ""}${i ? " dq-bar-busy" : ""}${g ? " dq-bar-paused" : ""}${h ? ` ${h}` : ""}`,
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
                      disabled: g,
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
                      disabled: g || r(Y),
                      onClick: () => o(Y),
                      ...g ? {} : J(Y),
                      children: [
                        W && /* @__PURE__ */ a(Nt, { binding: W }),
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
                    disabled: g,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(Nt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(va, { "aria-hidden": "true" }),
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
        g ? /* @__PURE__ */ u("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
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
        /* @__PURE__ */ a("div", { hidden: !0, children: L.map((M) => /* @__PURE__ */ a("span", { id: `${w}-effect-${M}`, children: re(e[M]) }, e[M].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: m })
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
      const m = getComputedStyle(o), h = parseFloat(m.columnGap) || 0, g = o.clientWidth - (parseFloat(m.paddingLeft) || 0) - (parseFloat(m.paddingRight) || 0), y = [...o.querySelectorAll(".dq-bar-line")].map(
        (L) => [...L.children].map((x) => x.offsetWidth)
      ), N = o.querySelector(".dq-bar-line"), v = N && parseFloat(getComputedStyle(N).columnGap) || 0, w = o.querySelector(".dq-bar-hints"), k = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + h : 0) + 1 + // the divider
      2 * h, O = (L) => y.map((x) => {
        let re = 1, J = 0;
        for (const _ of x)
          J > 0 && J + v + _ > L ? (re += 1, J = _) : J += (J > 0 ? v : 0) + _;
        return re;
      }), F = (L) => Math.max(1, L.reduce((x, re) => x + re, 0)), U = O(g), C = F(O(g - k));
      i(
        1 + F(U) < C || 1 + F(U) === C && U.every((L) => L === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(o);
    for (const m of o.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(m);
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
    f && s && /* @__PURE__ */ a(Nt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    Sr(c, r, i, o).map((l, m) => /* @__PURE__ */ a("span", { "data-effect-tone": l.tone, children: l.text }, m))
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
          Ln({
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
  const o = [...i.values()], s = Ue(e), c = $e(e) ? await Eu(
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
    Ln({
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
              `/api/${nr(e)}/aggregate`,
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
    for (const r of tr(n))
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
  const n = vt(e);
  return ((r = Nr(t).find((i) => i.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const $u = (e) => e instanceof Error ? e.message : "Request failed.";
function Ou({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: i
}) {
  const [o, s] = T([]), [c, d] = T({}), [f, l] = T({}), [m, h] = T({}), g = R(/* @__PURE__ */ new Map());
  ee(
    () => () => {
      for (const M of g.current.values()) M.abort();
    },
    []
  );
  const y = En(Ue(t)), N = $e(t), v = N ? "performer" : y.one;
  function w(M) {
    var P;
    (P = g.current.get(M)) == null || P.abort();
    const D = new AbortController();
    g.current.set(M, D), d((Y) => ({ ...Y, [M]: { status: "loading" } })), Su(t, M, D.signal).then(
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
  function k(M) {
    var ie;
    const D = o.filter((Q) => !M.includes(Q));
    for (const Q of D)
      (ie = g.current.get(Q)) == null || ie.abort(), g.current.delete(Q);
    const P = (Q) => {
      const S = c[Q];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((se) => se.id) : [];
    }, Y = new Set(M.flatMap(P)), W = D.flatMap(P).filter((Q) => !Y.has(Q));
    l(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => !W.includes(Number(S)))
      )
    ), h(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => M.includes(Number(S)))
      )
    ), d(
      (Q) => Object.fromEntries(
        Object.entries(Q).filter(([S]) => M.includes(Number(S)))
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
  ), L = Cu(O), x = new Map(O.map((M) => [M.parent.id, M.parent.name])), re = Tu(t.actions), J = (M) => f[M] ?? !re.has(M), _ = F ? [...C.values()].flatMap((M) => {
    const D = Ru(M.parent.name, t.actions);
    return M.children.filter((P) => J(P.id)).map((P) => ({ child: P, answerGroup: D }));
  }) : [], V = (M, D) => l((P) => ({
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
      Zn,
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
      const Y = P.parent.name;
      return /* @__PURE__ */ u("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: Y }),
        D.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: m[M] ?? !1,
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
          P.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ u(pe, { children: [
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
              const ie = re.get(W.id) ?? [], Q = (L.get(W.id) ?? []).filter((S) => S !== M).map((S) => `“${x.get(S)}”`);
              return /* @__PURE__ */ u("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: J(W.id),
                    disabled: n,
                    onChange: (S) => l((se) => ({
                      ...se,
                      [W.id]: S.target.checked
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
          disabled: n || !_.length,
          onClick: () => r(
            _.map(
              ({ child: M, answerGroup: D }) => Iu(
                M,
                (L.get(M.id) ?? []).filter(
                  (P) => m[P]
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
  const i = vt(n), o = [{ kind: "none", name: "", selected: !i }];
  if (r === null) {
    for (const c of e)
      o.push({ kind: "group", name: c, selected: vt(c) === i });
    return o;
  }
  const s = vt(r);
  for (const c of t)
    vt(c).includes(s) && o.push({ kind: "group", name: c, selected: vt(c) === i });
  return s && !t.some((c) => vt(c) === s) && o.push({ kind: "new", name: r.trim(), selected: s === i }), o;
}
function Fu(e) {
  return e.kind === "group" ? `group:${vt(e.name)}` : e.kind;
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
]), Lu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), ja = 4, es = 240;
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
  const o = Xe(), s = Xe(), c = Xe(), d = R(null), f = R(null), l = R(null), m = R(null), h = R(null), g = R([]), y = R(!1), N = R(!1), [v, w] = T(!1), [k, O] = T(null), [F, U] = T(null), [C, L] = T(!1), x = e.group ?? "", re = ve(
    () => Mu(t, n, x, k),
    [t, n, x, k]
  ), J = re.map(Fu), _ = F === null ? -1 : J.indexOf(F), V = (E) => `${s}-option-${E}`, M = (E) => i(E ? { ...e, group: E } : xu(e)), D = () => {
    var X;
    const E = ((X = l.current) == null ? void 0 : X.value) ?? x;
    E.trim() !== E && M(E.trim());
  };
  function P(E) {
    O(null), U(E), w(!0);
  }
  const Y = (E) => {
    var X, ce;
    return E instanceof Node && (((X = d.current) == null ? void 0 : X.contains(E)) || ((ce = m.current) == null ? void 0 : ce.contains(E))) === !0;
  };
  function W() {
    var E, X;
    (E = m.current) != null && E.contains(document.activeElement) && ((X = h.current) == null || X.focus({ preventScroll: !0 })), w(!1), O(null), U(null), L(!1);
  }
  function ie(E) {
    E.kind === "group" && E.selected && k === null || M(E.kind === "none" ? "" : E.name), W();
  }
  function Q() {
    const E = f.current, X = m.current;
    if (!E || !X) return;
    const ce = E.getBoundingClientRect(), ue = window.visualViewport, G = (ue == null ? void 0 : ue.offsetTop) ?? 0, Ce = (ue ? ue.offsetTop + ue.height : window.innerHeight) - ce.bottom - ja, Se = ce.top - G - ja, we = Math.min(X.scrollHeight, es), Ke = Ce < we && Se > Ce;
    X.style.left = `${ce.left}px`, X.style.width = `${ce.width}px`, X.style.top = `${Ke ? ce.top - ja : ce.bottom + ja}px`, X.style.transform = Ke ? "translateY(-100%)" : "", X.style.maxHeight = `${Math.max(0, Math.min(es, Ke ? Se : Ce))}px`, _u(E, X, ce, g.current) || W();
  }
  $t(() => {
    var E;
    v && (f.current && (g.current = Du(f.current)), N.current && ((E = m.current) == null || E.focus({ preventScroll: !0 }), L(!0)), N.current = !1);
  }, [v]), $t(() => {
    v && Q();
  }), ee(() => {
    if (!v) return;
    const E = () => Q(), X = (G) => {
      Y(G.target) || W();
    }, ce = [...g.current, window], ue = window.visualViewport;
    for (const G of ce) G.addEventListener("scroll", E);
    return window.addEventListener("resize", E), ue == null || ue.addEventListener("resize", E), ue == null || ue.addEventListener("scroll", E), document.addEventListener("pointerdown", X), () => {
      for (const G of ce) G.removeEventListener("scroll", E);
      window.removeEventListener("resize", E), ue == null || ue.removeEventListener("resize", E), ue == null || ue.removeEventListener("scroll", E), document.removeEventListener("pointerdown", X);
    };
  }, [v]), ee(() => {
    var E, X, ce;
    _ >= 0 && ((ce = (X = (E = m.current) == null ? void 0 : E.children[_]) == null ? void 0 : X.scrollIntoView) == null || ce.call(X, { block: "nearest" }));
  }, [_]);
  function S(E) {
    if (ln(E)) return;
    const X = E.key === "ArrowDown" || E.key === "ArrowUp";
    if (X && !v) {
      if (E.altKey && E.key === "ArrowUp") return;
      E.preventDefault(), P(E.altKey ? null : vt(x) ? `group:${vt(x)}` : "none");
      return;
    }
    if (v)
      if (X) {
        if (E.preventDefault(), E.altKey) {
          E.key === "ArrowUp" && W();
          return;
        }
        const ce = E.key === "ArrowDown" ? 1 : -1, ue = k !== null && vt(k) && J.length > 1 ? 1 : 0, G = _ < 0 ? ce > 0 ? ue : J.length - 1 : (_ + ce + J.length) % J.length;
        U(J[G]);
      } else E.key === "Enter" && (E.preventDefault(), _ >= 0 ? ie(re[_]) : (D(), W()));
  }
  function se(E) {
    var ce;
    if (E.key === "Tab") {
      W(), E.shiftKey && ((ce = l.current) == null || ce.focus());
      return;
    }
    if (E.key === "Dead" || E.key === "Process" || ln(E) && !Lu.has(E.key) || E.key === "Backspace" || E.key === "Delete" || [...E.key].length === 1 && !E.metaKey && (!E.ctrlKey || E.altKey)) {
      const ue = l.current;
      ue && (ue.focus(), ue.setSelectionRange(ue.value.length, ue.value.length));
      return;
    }
    !Pu.has(E.key) && !ln(E) && L(!1), S(E);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      onKeyDown: (E) => {
        !v || E.key !== "Escape" || ln(E) || (E.preventDefault(), E.stopPropagation(), W());
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
                  M(E.target.value), O(E.target.value), U(null), w(!0);
                },
                onClick: () => {
                  v || P(null);
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
                "aria-controls": v ? s : void 0,
                onPointerDown: (E) => {
                  y.current = E.pointerType === "touch";
                },
                onMouseDown: (E) => E.preventDefault(),
                onClick: () => {
                  var ce;
                  const E = y.current;
                  y.current = !1;
                  const X = document.activeElement === l.current;
                  v ? W() : (N.current = E && !X, P(null)), (!E || X) && ((ce = l.current) == null || ce.focus());
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
              ref: m,
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
                Y(E.relatedTarget) || W();
              },
              children: re.map((E, X) => /* @__PURE__ */ u(
                "li",
                {
                  id: V(X),
                  role: "option",
                  "aria-selected": E.selected,
                  className: "dq-combobox-option",
                  "data-kind": E.kind,
                  "data-active": X === _ || void 0,
                  onMouseMove: () => {
                    X !== _ && U(J[X]);
                  },
                  onClick: () => ie(E),
                  children: [
                    E.kind === "new" && /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: E.kind === "none" ? "No group" : E.kind === "new" ? `New group “${E.name}”` : E.name }),
                    E.selected && /* @__PURE__ */ a(zr, { className: "dq-combobox-check", "aria-hidden": "true" })
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
const Hn = [
  ...ni,
  ["auto", Yn]
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
  const [o, s] = T(!1), c = R(null), d = n.keys[t], f = Tc(e, n, t), l = yr(f), m = n.duplicatePins.has(t) ? ` (${ba(e[t].shortcut ?? "")} is pinned twice)` : "", h = d ? `${ba(d)}, ${l ? "pinned" : "Auto"}${m}` : f === Yn ? "no key, Find action only" : `no key: Auto found no free key${m}`, g = () => {
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
        "aria-label": `Key for ${r}: ${h}`,
        "aria-haspopup": "dialog",
        "aria-expanded": o,
        title: "Choose the key",
        onClick: () => s(!o),
        children: [
          d ? /* @__PURE__ */ a(Nt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
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
          i(y), g();
        },
        onClose: g
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
  const s = R(null), c = n.keys[t], d = Tc(e, n, t), [f, l] = T(c || "q"), m = (N) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${N}"]`)) ?? null;
  };
  $t(() => {
    var N, v, w;
    (N = m(c || d)) == null || N.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function h(N) {
    var v;
    yr(N) && l(N), (v = m(N)) == null || v.focus();
  }
  function g(N) {
    var C, L, x;
    if (N.key === "Escape") {
      N.preventDefault(), N.stopPropagation(), o();
      return;
    }
    if (N.key === "Tab") {
      const re = [...((C = s.current) == null ? void 0 : C.querySelectorAll("button[tabindex='0']")) ?? []], J = re.indexOf(document.activeElement);
      N.preventDefault(), (L = re[(J + (N.shiftKey ? -1 : 1) + re.length) % re.length]) == null || L.focus();
      return;
    }
    const v = (x = N.target.dataset) == null ? void 0 : x.choice, w = v ? Hn.findIndex((re) => re.includes(v)) : -1;
    if (!v || w < 0) return;
    const k = Hn[w].indexOf(v), O = (re) => re == null ? void 0 : re[Math.min(k, re.length - 1)], F = {
      ArrowLeft: Hn[w][k - 1],
      ArrowRight: Hn[w][k + 1],
      ArrowUp: O(Hn[w - 1]),
      ArrowDown: O(Hn[w + 1]),
      Home: Hn[w][0],
      End: Hn[w].at(-1)
    };
    if (!Object.hasOwn(F, N.key)) return;
    N.preventDefault();
    const U = F[N.key];
    U && h(U);
  }
  const y = (N) => {
    const v = yr(N) ? n.actionOn.get(N) : void 0;
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
        onKeyDown: g,
        onMouseDown: (N) => N.preventDefault(),
        children: [
          /* @__PURE__ */ u("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ni.map((N, v) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": v, children: N.map((w) => {
            const k = y(w), O = k ? `${k.own ? "this action" : k.label}, ${k.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                className: `dq-key-choice${k ? "" : " dq-key-choice-free"}${k != null && k.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${ba(w)}: ${O}`,
                "aria-pressed": !!(k != null && k.own && k.pinned),
                title: k ? `${k.label} (${k.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => l(w),
                onClick: () => i(w),
                children: [
                  /* @__PURE__ */ u("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Nt, { binding: w }),
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
                "data-choice": Yn,
                tabIndex: 0,
                "aria-pressed": d === Yn,
                onClick: () => i(Yn),
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
  if (Pn(e, t)) return "";
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
  const d = _e(e), f = d !== "tag", l = e.actions, m = Hr(l), h = Jr(ve(() => ii(l), [l])), g = ve(
    () => f ? Nr(l).map((G) => G.name) : [],
    [f, l]
  ), y = l.findIndex((G) => G.id === o), N = ve(
    () => f && y >= 0 ? Nr(
      l.filter((G, be) => be !== y)
    ).map((G) => G.name) : [],
    [f, l, y]
  ), v = f && e.stayUntilGroupsAnswered === !0, w = ve(
    () => new Set(
      v ? Wd(l).map((G) => G.key) : []
    ),
    [v, l]
  ), [k, O] = T(""), [F, U] = T(!1), [C, L] = T(
    null
  ), x = Xe(), re = `${x}-from-tags`, J = R(null), _ = R(null), V = R(null), M = R(null), D = R(/* @__PURE__ */ new WeakMap()), P = (G) => {
    let be = D.current.get(G);
    return be || (be = crypto.randomUUID(), D.current.set(G, be)), be;
  }, Y = k.trim().toLocaleLowerCase(), W = Y ? l.filter((G) => G.label.toLocaleLowerCase().includes(Y)) : l, ie = (G) => t({ ...e, actions: G }), Q = (G, be) => ie(l.map((Ce, Se) => Se === G ? be : Ce));
  function S(G) {
    var be;
    return [...((be = V.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      (Ce) => Ce.dataset.actionId === G
    );
  }
  function se(G, be) {
    const Ce = S(G), Se = Ce == null ? void 0 : Ce.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return Se == null || Se.focus(), !!Se;
  }
  $t(() => {
    var be;
    const G = M.current;
    G && (M.current = null, (G === "add" || !se(G.id, G.part)) && ((be = _.current) == null || be.focus()));
  }), ee(() => {
    !c || !o || (W.some((G) => G.id === o) ? se(o, "label") : (O(""), M.current = { id: o, part: "label" }));
  }, [c]);
  function E() {
    const G = zu(d);
    O(""), ie([...l, G]), s(G.id), M.current = { id: G.id, part: "label" };
  }
  function X(G) {
    const be = l[G], { shortcut: Ce, ...Se } = structuredClone(be), we = {
      ...Se,
      ...Ce === Yn ? { shortcut: Ce } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    ie([...l.slice(0, G + 1), we, ...l.slice(G + 1)]), s(we.id), M.current = { id: we.id, part: "label" };
  }
  function ce(G) {
    const be = l[G], Ce = W.indexOf(be), Se = W[Ce + 1] ?? W[Ce - 1];
    ie(l.filter((we, Ke) => Ke !== G)), o === be.id && s(null), M.current = Se ? { id: Se.id, part: "toggle" } : "add";
  }
  function ue() {
    U(!1), requestAnimationFrame(() => {
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
            ref: _,
            type: "button",
            className: "dq-header-button",
            onClick: E,
            children: [
              /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
            "aria-controls": F ? re : void 0,
            onClick: () => {
              L(null), U(!F);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ u("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(va, { "aria-hidden": "true" }),
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
                G.key === "Escape" && k && !ln(G) && (G.preventDefault(), G.stopPropagation(), O(""));
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
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (C == null ? void 0 : C.actions) === l ? `Added ${C.count} action${C.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && F && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (G) => {
          G.key !== "Escape" || G.defaultPrevented || ln(G) || (G.preventDefault(), G.stopPropagation(), ue());
        },
        children: /* @__PURE__ */ a(
          Ou,
          {
            id: re,
            review: e,
            disabled: i,
            onAdd: (G) => {
              const be = [...l, ...G];
              ie(be), L({ actions: be, count: G.length }), ue();
            },
            onCancel: ue
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: V, children: W.length > 0 && /* @__PURE__ */ a(
      As,
      {
        items: W,
        getKey: (G) => G.id,
        disabled: i || !!Y,
        className: "dq-action-list",
        onReorder: (G) => ie(G),
        renderItem: (G, { dragHandleProps: be, isOver: Ce }) => {
          const Se = l.indexOf(G), we = o === G.id;
          return /* @__PURE__ */ a(
            Ju,
            {
              action: G,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Uu,
                {
                  actions: l,
                  index: Se,
                  keyMap: m,
                  name: G.label.trim() || "New action",
                  onChoose: (Ke) => ie(ud(l, Se, Ke))
                }
              ),
              takenPin: m.duplicatePins.has(Se) ? G.shortcut : void 0,
              groupUnanswerable: "steps" in G && w.has(vt(G.group)),
              effect: Sr(G, h, n, r),
              open: we,
              detailId: `${x}-detail-${G.id}`,
              dragHandleProps: be,
              isOver: Ce,
              reorderDisabled: i || !!Y,
              onToggle: () => s(we ? null : G.id),
              onDuplicate: () => X(Se),
              onDelete: () => ce(Se),
              children: "steps" in G ? /* @__PURE__ */ a(
                Qu,
                {
                  action: G,
                  groupNames: g,
                  otherGroupNames: N,
                  occurrence: $e(e),
                  saving: i,
                  stepKey: P,
                  rememberStepKey: (Ke, me) => D.current.set(Ke, P(me)),
                  onChange: (Ke) => Q(Se, Ke)
                }
              ) : /* @__PURE__ */ a(
                Yu,
                {
                  action: G,
                  tagGroups: n,
                  onChange: (Ke) => Q(Se, Ke)
                }
              )
            }
          );
        }
      }
    ) }),
    l.length ? !W.length && /* @__PURE__ */ u("p", { className: "dq-actions-empty", role: "status", children: [
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
  onToggle: m,
  onDuplicate: h,
  onDelete: g,
  children: y
}) {
  const N = e.label.trim() || "New action", v = Vu(e, t), w = "steps" in e && vt(e.group) ? e.group.trim() : "";
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
          /* @__PURE__ */ u("div", { className: "dq-action-row-summary", onClick: m, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: N, children: N }),
            w && /* @__PURE__ */ u("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: o.map((k, O) => /* @__PURE__ */ a("span", { "data-effect-tone": k.tone, children: k.text }, O)) }),
            v && /* @__PURE__ */ u("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
              v
            ] }),
            r && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${ba(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                  `${ba(r)} is pinned twice`
                ]
              }
            ),
            i && /* @__PURE__ */ u(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
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
              onClick: g,
              children: /* @__PURE__ */ a(ei, { "aria-hidden": "true" })
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
              onClick: m,
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
  const d = Xe(), f = R(null), l = R(null);
  $t(() => {
    var g, y;
    const h = l.current;
    h != null && (l.current = null, (y = (g = f.current) == null ? void 0 : g.querySelector(`[data-step-index="${h}"] input`)) == null || y.focus());
  });
  const m = (h) => c({ ...e, steps: h });
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(Rc, { action: e, onChange: (h) => c({ ...e, label: h }) }),
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
            onReorder: m,
            renderItem: (h, { index: g, dragHandleProps: y, isOver: N }) => /* @__PURE__ */ a(
              Wu,
              {
                step: h,
                index: g,
                dragHandleProps: y,
                isOver: N,
                saving: i,
                onChange: (v) => {
                  s(v, h), m(e.steps.map((w, k) => k === g ? v : w));
                },
                onRemove: () => m(e.steps.filter((v, w) => w !== g))
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
              l.current = e.steps.length, m([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
          Zn,
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
            children: /* @__PURE__ */ a(qa, { "aria-hidden": "true" })
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
function en({ tag: e, name: t }) {
  const n = Fl($c), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(Pl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = En(Ue(e)).queue, i = (o) => t({ ...e, occurrence: { ...n, ...o } });
  return /* @__PURE__ */ u("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ u("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      Zn,
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
  const n = En(Ue(e)).many, r = e.occurrence, i = Us(r), o = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = Aa([
    ...i.flatMap((l) => [l.tagId, ...l.categoryTagId ? [l.categoryTagId] : []]),
    ...o
  ]), c = (l) => {
    var m;
    return ((m = s[l]) == null ? void 0 : m.name) ?? (s[l] === null ? `Unavailable tag ${l}` : `Tag ${l}`);
  }, d = (l) => t({ ...e, occurrence: ld(r, l) }), f = (l, m) => d(
    i.map(
      (h, g) => g !== l ? h : m === void 0 ? { tagId: h.tagId } : { tagId: h.tagId, categoryTagId: m }
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
    i.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: i.map((l, m) => {
      const h = c(l.tagId), g = i.filter(
        (v, w) => w !== m && v.tagId === l.tagId
      ), y = (v) => g.some((w) => w.categoryTagId === v), N = `${l.tagId}#${i.slice(0, m).filter((v) => v.tagId === l.tagId).length}`;
      return /* @__PURE__ */ u("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ u("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(en, { tag: s[l.tagId], name: h })
        ] }),
        /* @__PURE__ */ u("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Lo,
            {
              entityType: "tag",
              value: l.categoryTagId,
              onChange: (v) => f(m, v),
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
            onClick: () => d(i.filter((v, w) => w !== m)),
            children: /* @__PURE__ */ a(ei, { "aria-hidden": "true" })
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
                  "aria-pressed": l.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => f(m, void 0),
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
                  onClick: () => f(m, v),
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
  video: ti,
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
    return ka(t);
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
  return /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ u("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: _e(e),
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
  const n = _e(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function sf({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = R(null), r = R(null), i = Xe(), o = Xe();
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
  notices: m,
  onSave: h,
  onCancel: g,
  drawerRef: y
}) {
  const [N, v] = T("Review"), [w] = T(
    () => $e(e) && e.occurrence.tagIds.length > 0
  ), [k, O] = T(""), [F, U] = T(null), [C, L] = T(0), [x, re] = T(!1), J = R(null), _ = R(null), V = R(null), M = of(e, w), D = _e(e), P = ve(() => Kr(e), [e]);
  ee(() => O(""), [P]), ee(() => {
    var se, E;
    if (x) return;
    const Q = J.current;
    if (J.current = null, !Q) return;
    (E = Q.isConnected && !!((se = V.current) != null && se.contains(Q)) && !(Q instanceof HTMLButtonElement && Q.disabled) ? Q : V.current) == null || E.focus({ preventScroll: !0 });
  }, [x]);
  function Y() {
    if (!(s || x)) {
      if (!f) {
        g();
        return;
      }
      J.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, re(!0);
    }
  }
  function W() {
    const Q = { ...e, name: e.name.trim() }, S = ya(Q);
    if (!S) {
      O(""), h();
      return;
    }
    if (O(S), !Q.name) {
      v("Review"), requestAnimationFrame(() => {
        var E;
        return (E = _.current) == null ? void 0 : E.focus();
      });
      return;
    }
    const se = e.actions.find(
      (E) => !Pn(E, D)
    );
    se && (v("Actions"), U(se.id), L((E) => E + 1));
  }
  const ie = k || d;
  return /* @__PURE__ */ u(pe, { children: [
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
          Q.key !== "Escape" || Q.defaultPrevented || s || ln(Q) || (Q.preventDefault(), Q.stopPropagation(), Y());
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
                children: /* @__PURE__ */ a(qa, { "aria-hidden": "true" })
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
                  $e(e) && /* @__PURE__ */ a(ef, { review: e, onChange: t }),
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
            w && $e(e) && /* @__PURE__ */ a(
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
          (ie || m) && /* @__PURE__ */ u("div", { className: "dq-drawer-notices", children: [
            m,
            ie && /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
              ie
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
        onKeepEditing: () => re(!1),
        onDiscard: () => {
          J.current = null, re(!1), g();
        }
      }
    )
  ] });
}
function cf({
  review: e,
  onChange: t
}) {
  const n = Xe(), r = e.view, i = (l) => t({ ...e, view: { ...r, ...l } }), o = /* @__PURE__ */ u("label", { className: "dq-checkbox dq-setting-indent", children: [
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
  if (_e(e) === "tag")
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
        ].map(([l, m]) => /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(l),
              onChange: (h) => c({
                annotations: h.target.checked ? [...d, l] : d.filter((g) => g !== l)
              })
            }
          ),
          m
        ] }, l)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ u("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ u("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            Zn,
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
        Zn,
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
  const n = Xe(), [r, i] = T(null), o = e.find((c) => c.key === r), s = (c, d) => t(
    e.map((f) => {
      var m;
      if (f.key !== c) return f;
      const l = { ...f, ...d };
      return (m = l.group) != null && m.trim() || delete l.group, l;
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
            onChange: (m) => s(c.key, { label: m.target.value })
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            className: "dq-input",
            "aria-label": `Pick-one group of ${f}`,
            placeholder: "Group (optional)",
            value: c.group ?? "",
            onChange: (m) => s(c.key, { group: m.target.value })
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
            onClick: () => t(e.filter((m) => m.key !== c.key)),
            children: /* @__PURE__ */ a(ei, { "aria-hidden": "true" })
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
          /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
          "Add filter bin"
        ]
      }
    ),
    /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, each bin becomes a one-click filter after the tag bins, counted over the whole queue. Bins with the same group are pick-one: pressing one lifts the other." }),
    o && /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (c) => {
          c.key !== "Escape" || ln(c) || (c.stopPropagation(), !c.defaultPrevented && (c.preventDefault(), i(null)));
        },
        children: /* @__PURE__ */ a(
          Cs,
          {
            open: !0,
            onClose: () => i(null),
            criteria: Za,
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
  const i = Xe();
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
  const s = Xe(), c = Xe();
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
  queueChange: m,
  queueDiffers: h,
  chipsStart: g,
  chipsAfter: y,
  chipsEnd: N
}) {
  const v = R(null);
  gf(v);
  const w = bf(v), [k, O] = T({ differs: h, text: "" });
  return k.differs !== h && O({
    differs: h,
    text: h ? k.differs === !1 ? Di : k.text : ""
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
          children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
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
          children: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ u("div", { className: "dq-review-header-trail", children: [
      f,
      m && /* @__PURE__ */ a(ff, { change: m, onPress: w }),
      l
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    g,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    N && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: N }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: k.text })
  ] });
}
function ff({
  change: e,
  onPress: t
}) {
  const n = Xe(), r = Xe(), i = `${Di} Save these filters to the review.`, o = e.onSave ? `${Di} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
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
function Ga(e) {
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
  for (let o = 1; o <= i.length && !Ga(e); o++) {
    if (e.dataset.compact = i.slice(0, o).join(" "), i[o - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Ga(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Ga(e) ? !0 : (r(), !1);
}
function gf(e) {
  const t = vc(mf), [n, r] = T(0), i = R(!1);
  $t(() => {
    e.current && (i.current = !rs(e.current, t));
  }, [e, t, n]), $t(() => {
    const o = e.current;
    o && t && !i.current && !Ga(o) && (i.current = !rs(o, t));
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
    var m;
    r && ((m = c.current) == null || m.select());
  }, [r]);
  const f = (m) => {
    i(!1), m && requestAnimationFrame(() => {
      var h;
      return (h = d.current) == null ? void 0 : h.focus();
    });
  }, l = () => {
    const m = Math.round(Number(o));
    f(!0), Number.isFinite(m) && m >= 1 && m !== e && n(Math.min(t, m));
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
        children: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" })
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
        onChange: (m) => s(m.target.value),
        onKeyDown: (m) => {
          ln(m) || (m.key === "Enter" ? (m.preventDefault(), l()) : m.key === "Escape" && (m.preventDefault(), m.stopPropagation(), f(!0)));
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
  const [r, i] = T(!1), [o, s] = T(!1), c = R(null), d = R(null), f = Xe();
  $t(() => {
    if (!r || !d.current || !c.current) return;
    const h = c.current.getBoundingClientRect(), g = d.current.offsetHeight + 12, y = window.innerHeight - h.bottom;
    s(y < g && h.top > y);
  }, [r]), ee(() => {
    var h, g;
    r && ((g = (h = d.current) == null ? void 0 : h.querySelector('[role="menuitem"]:not(:disabled)')) == null || g.focus({ preventScroll: !0 }));
  }, [r]), ee(() => {
    t && i(!1);
  }, [t]);
  const l = (h = !0) => {
    var g;
    i(!1), h && ((g = c.current) == null || g.focus());
  };
  return /* @__PURE__ */ u("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (h) => {
    var N, v;
    if (!r) return;
    const g = [
      ...((N = d.current) == null ? void 0 : N.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = g.indexOf(document.activeElement);
    if (h.key === "Escape")
      h.preventDefault(), h.stopPropagation(), l();
    else if (h.key === "Tab")
      l(!1);
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
          children: e.map((h) => /* @__PURE__ */ u(Ji, { children: [
            h.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ u(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: h.danger ? "dq-menu-danger" : void 0,
                disabled: h.disabled,
                onClick: () => {
                  l(), h.onSelect();
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
function Ya(e) {
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
      Ya(e.customFieldCriteria).filter(vo).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !No(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function So(e, t) {
  const n = Ya(e.customFieldCriteria);
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
  const r = Ya(e.customFieldCriteria);
  if (!r.length) return e;
  const i = Ya(n.customFieldCriteria), o = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (l) => (d[l] ?? void 0) === (f[l] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!vo(d)) return d;
    const f = i.find((m) => o(m, d));
    if (!f) return d;
    const l = { ...d };
    for (const [m, h] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const g = t[String(d[m] ?? "")];
      g && d[h] === g && !No(f[h]) && (delete l[h], s = !0);
    }
    return l;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function wf(e, t, n) {
  if (!Pn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Ue(e), i = n.steps.some((c) => Fn(c.mode)) ? await Gd(r) : "", o = await so(n);
  let s = t.applications;
  for (const c of [
    ...o.filter((d) => !Fn(d.mode)),
    ...o.filter((d) => Fn(d.mode))
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
        Ln({
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
  return ga(e.condition) && e.hideConfirmedAbsent !== !1;
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
                      key: ri,
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
    e.conditionTagIds.map((n) => ai([n], t))
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
  const i = Ue(e), o = await jr(
    Eo(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = o.items.length ? await Ao(c, r) : [], f = new Array(o.items.length);
  let l = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, o.items.length) }, async () => {
      for (; l < o.items.length; ) {
        const m = l++, h = o.items[m], g = await ye(
          `/api/tagapplications?hostType=${i}&hostId=${h.id}&contextType=performer`,
          { signal: r }
        );
        f[m] = h.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const N = g.filter(
            (w) => w.hostType === i && w.hostId === h.id && w.contextType === "performer" && w.contextId === y.id
          ), v = N.map((w) => w.tag.id);
          return vf(e.occurrence, v, d) && !Nf(c, h, y.id, v, d) ? [
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
  const i = Ue(e), o = await Qa(i, t.media.id);
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
function Vr(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function qf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function gn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? rc(
      await Qa(e, t.media.id),
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
  const r = await Qa(e, t.media.id), i = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Pi(i);
  const o = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Ja
  ) ?? Ja, s = ((c = r.customFields) == null ? void 0 : c[o]) ?? [];
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
      i.length && await ye(
        `/api/${nr(Ue(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: i })
        }
      );
}
async function Sf(e, t, n) {
  t.occurrence && $e(e) ? await wf(e, t.occurrence, n) : await ac(Ue(e), n, [t.media.id]);
}
function _i(e, t, n, r) {
  const i = (o) => o.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: Vr(i(t.ids), i(n.ids)),
    absence: Vr(i(t.absent), i(n.absent))
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
const ji = (e) => e instanceof Error ? e.message : "Request failed.", as = (e) => [...e].sort((t, n) => t - n), wa = (e, t) => JSON.stringify(as(e)) === JSON.stringify(as(t)), Ui = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Xa(e, t, n, r) {
  const i = new Set(e), o = new Set(e);
  for (const l of t.steps)
    for (const m of l.tagIds)
      l.mode === "ADD" ? o.add(m) : o.delete(m);
  const s = e.some((l) => !o.has(l));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((l) => l.mode === "ADD").flatMap((l) => l.tagIds)
  ), d = [], f = [];
  for (const l of n) {
    const m = l.filter((g) => o.has(g) && !i.has(g)), h = l.filter(
      (g) => o.has(g) && i.has(g) && !c.has(g)
    );
    !m.length || !h.length || (r ? (h.forEach((g) => o.delete(g)), f.push(...h)) : (m.forEach((g) => o.delete(g)), d.push({ tagIds: m, existing: h })));
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
        (l) => l.mode === "ADD" && l.tagIds.some((m) => o.includes(m))
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
    (h) => !Pn(h, e.entityType) || !h.steps.length || h.steps.some(
      (g) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(g.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const i = structuredClone(e), o = structuredClone(t), s = ga(i.occurrence.condition) && i.occurrence.includeSubtags !== !1 ? await Ao(i.occurrence, n) : [];
  await Af(i, o, s, n);
  const c = await Promise.all(
    o.map(async (h) => ({
      ...h,
      steps: await so(h, n)
    }))
  ), d = structuredClone(Ef(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((h) => h.tagIds),
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
  const l = await ko(i, n), m = /* @__PURE__ */ new Map();
  for (let h = 1; ; h++) {
    n.throwIfAborted();
    const g = await Gc(i, l, h, n);
    for (const y of g.items) {
      const N = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Xa(N.ids, d, s, !0);
      m.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: N,
        expected: N,
        conflict: v.conflict,
        status: wa(N.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (r(m.size), h * 250 >= g.totalCount) break;
    if (h > 1e5)
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
    entries: [...m.values()]
  };
}
function Tf(e, t, n) {
  const r = (o) => o.ids.filter((s) => n.includes(s));
  if (!wa(r(e), r(t))) return !1;
  const i = (o) => (o.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return wa(i(e), i(t));
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
        if (s = await gn(Ue(e.review), o.item, !1), !Tf(o.expected, s, e.touched)) {
          o.status = "skipped", o.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (h) {
        o.status = "failed", o.error = ji(h);
        return;
      }
      const c = Xa(
        o.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((h) => !e.touched.includes(h)),
        ...c.desired.filter((h) => e.touched.includes(h))
      ], f = Vr(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const h = !o.operation && c.kept.length > 0;
        o.status = o.operation ? "changed" : h ? "skipped" : "unchanged", o.error = h ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let l;
      try {
        await Co(e.review, o.item, f);
      } catch (h) {
        l = h;
      }
      let m = !1;
      try {
        const h = await gn(Ue(e.review), o.item, !1);
        m = !0, o.expected = h;
        const g = _i(
          o.item,
          o.before,
          h,
          e.touched
        );
        if (o.operation = Ui(g) ? g : void 0, l) throw l;
        if (!wa(
          h.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        o.status = o.operation ? "changed" : "unchanged", o.error = void 0;
      } catch (h) {
        if (o.status = "failed", o.error = ji(h), !m)
          try {
            const g = await gn(Ue(e.review), o.item, !1);
            o.expected = g;
            const y = _i(
              o.item,
              o.before,
              g,
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
        const c = await gn(Ue(e.review), r.item, !1);
        kf(i, c), s = !0, await Co(e.review, r.item, {
          added: i.tags.removed,
          removed: i.tags.added
        });
        const d = await gn(Ue(e.review), r.item, !1);
        if (!wa(
          d.ids.filter((f) => o.includes(f)),
          r.before.ids.filter((f) => o.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${ji(c)}`, r.status = "failed", s)
          try {
            const d = await gn(Ue(e.review), r.item, !1), f = _i(
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
  ), m = (y) => {
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
  }, h = s.map((y, N) => ({
    id: i.conditionTagIds[N],
    name: d[N],
    members: y,
    tags: m(new Set(y))
  }));
  l.size && h.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...l],
    tags: m(l)
  });
  const g = /* @__PURE__ */ new Set([...f, ...l]);
  return {
    answered: new Set(
      c.filter((y) => g.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: h
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
    (s) => [...tr(s)].some((c) => i.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(o)
    )
  );
}
function To(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const g of e.groups) for (const y of g.tags) r.set(y.id, y);
  const i = (g) => g.flatMap((y) => r.get(y) ?? []).sort(Wc), o = (g) => g.members ?? g.tags.map((y) => y.id), s = Nr(t).flatMap((g) => {
    const y = [
      ...new Set(g.actions.flatMap((N) => [...tr(t[N])]))
    ];
    return y.length ? [{ ...g, answers: y, tags: i(y) }] : [];
  }), c = (g) => g.tags.length > 1 ? [g] : [], d = e.groups.filter((g) => g.id !== null).map((g) => {
    const y = `tag:${g.id}`, N = o(g), v = new Set(N);
    return {
      key: y,
      kind: "condition",
      name: g.name,
      members: N,
      tags: g.tags,
      mixed: Of(g.id, N, t, n) ? c({ key: y, name: g.name, members: N, tags: g.tags }) : (
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
  }), f = d.map((g) => new Set(g.members)), l = /* @__PURE__ */ new Set();
  for (const g of s) {
    if (f.some((N) => g.answers.every((v) => N.has(v)))) continue;
    g.answers.forEach((N) => l.add(N));
    const y = `group:${g.key}`;
    d.push({
      key: y,
      kind: "group",
      name: g.name,
      members: g.answers,
      tags: g.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: g.name, members: g.answers, tags: g.tags })
    });
  }
  const m = e.groups.find((g) => g.id === null), h = (m == null ? void 0 : m.tags.filter((g) => !l.has(g.id))) ?? [];
  return m && h.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: o(m).filter((g) => !l.has(g)),
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
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [o, s] = T({
    key: i,
    value: yi
  });
  return ee(() => {
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
    return ((l = f.tagIds) == null ? void 0 : l.every((m) => e.members.includes(m))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const l = eu(f, t).filter((h) => h.key !== e.key), m = f.key === e.key ? [] : l.filter(n);
    m.length ? m.forEach((h) => r.add(h.name)) : l.forEach((h) => i.add(h.name));
  }
  const o = vt(e.name), s = [...r].filter((f) => vt(f) !== o), c = s.length < r.size, d = i.size ? ` (${c ? "partly " : ""}listed under ${[...i].join(", ")})` : "";
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
  const c = En(n), d = (h) => `${h.toLocaleString()} ${h === 1 ? c.one : c.many}`, f = e ? To(e, r, i) : [], l = uo(f), m = (h) => [
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
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ u("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((h) => {
          const g = h.kind === "other" ? [] : m(h.members), y = Mf(h, l), N = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ u("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ u("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: h.name }),
              h.mixed.length > 0 && /* @__PURE__ */ u(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Ff(h, y),
                  children: [
                    /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
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
                    /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      g.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            h.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": h.name, children: h.tags.map((v) => /* @__PURE__ */ u("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(en, { tag: v }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
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
function fa(e, t) {
  var r, i;
  const n = e.item.media;
  return n.title || ((i = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : i.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Lf({ step: e }) {
  const t = Ki.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Ki.map((n, r) => {
    const i = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ u("li", { "data-state": i, "aria-current": i === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: i === "done" ? /* @__PURE__ */ a(zr, {}) : r + 1 }),
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
function ua({
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
    wr(e.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(en, { tag: i })
    ] }) }, `added-${i.id}`)),
    wr(t.map(n)).map((i) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ u("del", { children: [
      "− ",
      /* @__PURE__ */ a(en, { tag: i })
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
                fa(o, n)
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
  const [s, c] = T(!1), [d, f] = T("answers"), [l, m] = T(null), [h, g] = T({}), [y, N] = T([]), [v, w] = T(!1), [k, O] = T(!1), [F, U] = T(""), [C, L] = T(!1), [x, re] = T(""), [J, _] = T(null), [V, M] = T(null), [D, P] = T([]), [Y, W] = T(0), ie = R(null), Q = R(null), S = R(null), se = R(!1), E = R(!1), X = R(null), ce = R(!1), ue = R(!1), G = R({ onClose: o });
  G.current = { onClose: o };
  const be = Xe(), Ce = d === "run", Se = (J == null ? void 0 : J.kind) === "undo", we = Ce && l ? l.review : e, Ke = Hr(we.actions), me = we.occurrence, Ze = Ue(we), Je = En(Ze), xt = Je.queue, Pt = Ce && l ? l.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((I) => I.steps.length && !Xn(I))
  ), qt = Pt.filter((I) => y.includes(I.id)), dt = me.targetMode === "selected" && me.performerIds.length === 1, Te = Yc(
    we,
    s && dt ? me.performerIds[0] : null,
    Y
  ), Qe = qo(we.view.objectFilter), St = Aa(
    s ? [...ii(Pt), ...me.conditionTagIds, ...Qe] : []
  ), We = ve(() => wc(St), [St]), et = (I) => h[I] ?? St[I] ?? { id: I, name: `Tag ${I}` }, Ve = JSON.stringify(
    Object.fromEntries(
      Qe.flatMap((I) => {
        var H;
        const j = (H = St[I]) == null ? void 0 : H.name;
        return j ? [[String(I), j]] : [];
      })
    )
  ), kt = ve(
    () => So(we.view.objectFilter, JSON.parse(Ve)),
    [we.view.objectFilter, Ve]
  );
  ee(() => {
    var I, j, H;
    s && ((I = ie.current) == null || I.showModal(), (H = (j = ie.current) == null ? void 0 : j.querySelector(".dq-batch-answer input")) == null || H.focus());
  }, [s]), ee(() => {
    if (!s) return;
    const I = requestAnimationFrame(() => {
      var fe;
      const j = ie.current, H = document.activeElement;
      if (!j || H && H !== document.body && j.contains(H)) return;
      (fe = (d === "answers" ? j.querySelector(".dq-batch-answer input:checked") ?? j.querySelector(".dq-batch-answer input") : j.querySelector("[data-batch-focus]")) ?? Q.current) == null || fe.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, d, k, l]), ee(() => {
    if (s || t || !se.current) return;
    const I = requestAnimationFrame(() => {
      const j = S.current;
      if (!se.current || !j || j.disabled) return;
      se.current = !1;
      const H = document.activeElement;
      (!H || H === document.body) && j.focus();
    });
    return () => cancelAnimationFrame(I);
  }, [s, t]), ee(() => {
    if (!s || me.targetMode !== "selected") return;
    const I = new AbortController();
    return P([]), xf(me.performerIds.slice(0, is), I.signal).then((j) => {
      I.signal.aborted || P(j);
    }).catch(() => {
    }), () => I.abort();
  }, [s, me.targetMode, JSON.stringify(me.performerIds)]), ee(
    () => () => {
      var I;
      E.current = !0, (I = X.current) == null || I.abort();
    },
    []
  ), ee(() => {
    if (!k) return;
    const I = (j) => {
      j.preventDefault(), j.returnValue = "";
    };
    return window.addEventListener("beforeunload", I), () => window.removeEventListener("beforeunload", I);
  }, [k]);
  function Lt() {
    f("answers"), m(null), g({}), _(null), w(!1), N([]), re(""), U(""), L(!1), M(null);
  }
  function tt() {
    ue.current || (c(!1), G.current.onClose(ce.current), ce.current = !1, Lt(), se.current = !0);
  }
  function dn(I, j) {
    N(
      (H) => j ? [...H, I] : H.filter((ke) => ke !== I)
    ), m(null), g({}), re(""), U(""), L(!1), M(null);
  }
  function Dt() {
    f("answers"), M(null), re("");
  }
  function An() {
    f("preview"), l || rr();
  }
  function un() {
    var I;
    E.current = !0, (I = X.current) == null || I.abort(), re("Stopping after in-flight operations settle…");
  }
  function Ot(I) {
    M(
      (j) => (j == null ? void 0 : j.group) === I.group && j.reason === I.reason ? null : I
    );
  }
  const mt = (I, j) => (V == null ? void 0 : V.group) === I && V.reason === j;
  async function rr() {
    if (!qt.length || ue.current) return;
    ue.current = !0, O(!0), U(""), L(!1), re("Loading all matching occurrences…"), m(null), g({}), M(null);
    const I = new AbortController();
    X.current = I;
    try {
      const j = await Cf(
        e,
        qt,
        I.signal,
        (ke) => re(`Loaded ${ke.toLocaleString()} matching occurrences…`)
      );
      I.signal.throwIfAborted();
      const H = {};
      for (const ke of j.entries)
        for (const fe of ke.before.applications ?? [])
          H[fe.tag.id] = fe.tag;
      g(H), m(j), re("Preview ready. No tags have been changed.");
    } catch (j) {
      U(
        I.signal.aborted ? "Preview cancelled. No tags were changed." : j instanceof Error ? j.message : String(j)
      ), L(!I.signal.aborted && j instanceof zc), re("");
    } finally {
      ue.current = !1, O(!1), X.current = null;
    }
  }
  async function fn(I) {
    if (!l || ue.current) return;
    const j = (I === "undo" ? Qc(l) : Jc(l, I === "retry")).length;
    ue.current = !0, E.current = !1, ce.current = !0, O(!0), f("run"), U(""), _({ kind: I, total: j, done: 0, stopped: !1 }), re(
      I === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const H = () => _((fe) => fe && { ...fe, done: fe.done + 1 });
    let ke = !1;
    try {
      I === "undo" ? await Rf(l, () => E.current, H) : await If(l, v, () => E.current, H, I === "retry"), re(
        E.current ? "Stopped after in-flight operations settled. Completed changes are retained." : I === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (fe) {
      ke = !0, re(""), U(fe instanceof Error ? fe.message : String(fe));
    } finally {
      ue.current = !1;
      const fe = E.current || ke;
      _((Ae) => Ae && { ...Ae, stopped: fe }), O(!1), W((Ae) => Ae + 1);
    }
  }
  const he = (l == null ? void 0 : l.entries) ?? [], Bt = ve(
    () => new Map(
      ((l == null ? void 0 : l.entries) ?? []).map((I) => [
        I.item.key,
        Xa(I.before.ids, l.action, l.categories, v)
      ])
    ),
    [l, v]
  ), pn = (I) => Bt.get(I.item.key), hn = (I) => Vr(I.before.ids, pn(I).desired), ar = (I) => {
    const j = hn(I);
    return I.status === "pending" && (j.added.length > 0 || j.removed.length > 0);
  }, Pe = (I) => I.conflict || pn(I).kept.length > 0 || pn(I).replaced.length > 0, ut = ve(() => {
    const I = (l == null ? void 0 : l.entries) ?? [];
    return {
      willChange: I.filter(ar).length,
      correct: I.filter((j) => j.status === "unchanged").length,
      different: I.filter(Pe).length,
      hosts: new Set(I.map((j) => j.item.media.id)).size,
      added: [...new Set(I.flatMap((j) => hn(j).added))],
      removed: [...new Set(I.flatMap((j) => hn(j).removed))]
    };
  }, [Bt]), le = ve(
    () => ((l == null ? void 0 : l.entries) ?? []).filter((I) => I.item.media.date).sort((I, j) => I.item.media.date.localeCompare(j.item.media.date)),
    [l]
  ), B = Ce ? Df(he) : null, Oe = (I) => Ke.keys[we.actions.findIndex((j) => j.id === I)] ?? "", Et = (I) => Sr(I, We, [], r), ir = ga(me.condition) && me.includeSubtags !== !1 && me.conditionTagIds.length > 0, oe = le[0], Ge = le.length > 1 ? le[le.length - 1] : void 0, _t = (I) => `/${Ze}/${I.item.media.id}`, ot = dt ? D[0] : void 0, ft = ve(
    () => n ? uc(
      n,
      Te.summary ? uo(
        To(Te.summary, we.actions, r ?? $i)
      ) : []
    ) : [],
    [n, Te.summary, we.actions, r]
  ), jt = nu(qt, ft, r ?? $i), nt = n ?? [], At = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: ar },
    correct: { title: "Occurrences already correct", test: (I) => I.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: Pe }
  };
  function Kt() {
    const I = Pf[me.condition], j = !!I && me.conditionTagIds.length > 0, H = me.performerIds.slice(0, is), ke = String(we.view.filter.q ?? "").trim(), fe = me.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ u("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      eo(me) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : me.targetMode === "selected" ? /* @__PURE__ */ u(pe, { children: [
        H.map((Ae, qe) => /* @__PURE__ */ u("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Br, { performer: { id: Ae, name: D[qe] ?? "" } }),
          D[qe] ?? "…"
        ] }, Ae)),
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
              ma,
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
        j && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: wr(me.conditionTagIds.map(et)).map((Ae) => /* @__PURE__ */ a(en, { tag: Ae }, Ae.id)) })
      ] }),
      j && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: me.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ga(me.condition) && me.hideConfirmedAbsent !== !1 && /* @__PURE__ */ u("span", { className: "dq-batch-chip", title: fe, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ u("span", { className: "dq-sr-only", children: [
          ": ",
          fe
        ] })
      ] }),
      ke && /* @__PURE__ */ u("span", { className: "dq-batch-chip", children: [
        "Search “",
        ke,
        "”"
      ] }),
      Object.keys(we.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${xt} filters`,
          children: /* @__PURE__ */ a(
            ma,
            {
              filter: we.view.filter,
              objectFilter: kt,
              criteriaDefinitions: Ze === "audio" ? Ts : Za,
              customFieldEntityType: Ze,
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
  function Gt(I, j, H = !0) {
    if (!I.length) return null;
    const ke = /* @__PURE__ */ a("strong", { children: ot || "This performer" }), fe = H ? `Check the earliest and latest ${Je.many} before applying, or narrow the batch with a date filter.` : "", Ae = I.every((qe) => qe.tagIds === null && !qe.mixed.length);
    return /* @__PURE__ */ u("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
      /* @__PURE__ */ u("div", { children: [
        Ae ? /* @__PURE__ */ u("p", { children: [
          ke,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: I.flatMap((qe) => qe.flags).join(", ") }),
          ".",
          " ",
          fe
        ] }) : /* @__PURE__ */ u(pe, { children: [
          /* @__PURE__ */ u("p", { children: [
            ke,
            " needs attention where the chosen answers apply.",
            fe && ` ${fe}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: I.map((qe) => /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ a("strong", { children: qe.tagIds === null ? "Whole review" : qe.name }),
            ":",
            " ",
            fo(qe).join("; ")
          ] }, qe.key)) })
        ] }),
        j && oe && /* @__PURE__ */ u("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ u("a", { href: _t(oe), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            fa(oe, Ze),
            " · ",
            oe.item.media.date
          ] }),
          Ge && /* @__PURE__ */ u("a", { href: _t(Ge), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            fa(Ge, Ze),
            " · ",
            Ge.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function pt() {
    const I = jt.filter((H) => H.tagIds === null), j = jt.filter((H) => H.tagIds !== null);
    return /* @__PURE__ */ u(pe, { children: [
      Kt(),
      Gt(I, !1),
      /* @__PURE__ */ u("div", { className: `dq-batch-pick${dt ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ u("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: Pt.map((H, ke) => {
            const fe = Oe(H.id);
            return /* @__PURE__ */ u("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: y.includes(H.id),
                  "aria-labelledby": `${be}-answer-${ke}`,
                  "aria-describedby": `${be}-effect-${ke}`,
                  onChange: (Ae) => dn(H.id, Ae.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: fe && /* @__PURE__ */ a(Nt, { binding: fe, hidden: !0 }) }),
              /* @__PURE__ */ u("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${be}-answer-${ke}`,
                    className: "dq-batch-answer-label",
                    title: H.label,
                    children: H.label
                  }
                ),
                /* @__PURE__ */ a(cs, { id: `${be}-effect-${ke}`, parts: Et(H) })
              ] })
            ] }, H.id);
          }) })
        ] }),
        dt && /* @__PURE__ */ u("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: Gt(j, !1, I.length === 0) }),
          /* @__PURE__ */ a(
            Bi,
            {
              ...Te,
              mediaKind: Ze,
              actions: we.actions,
              trees: r,
              flags: nt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Er(I) {
    const j = ut, H = V && os.has(V.group) ? V.group : null, ke = H ? he.filter(At[H].test) : [], fe = (Ae) => {
      const qe = pn(Ae), st = qe.skipped ? Vr(
        Ae.before.ids,
        Xa(Ae.before.ids, I.action, I.categories, !0).desired
      ) : hn(Ae), Mt = !st.added.length && !st.removed.length;
      return /* @__PURE__ */ u("div", { className: "dq-batch-plan", children: [
        qe.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Mt ? !qe.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(ls, { added: st.added, removed: st.removed, tag: et }),
        qe.kept.map((Ie, ge) => /* @__PURE__ */ u("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          wr(Ie.existing.map(et)).map((Ft) => /* @__PURE__ */ a(en, { tag: Ft }, Ft.id)),
          " ",
          "instead of",
          " ",
          wr(Ie.tagIds.map(et)).map((Ft) => /* @__PURE__ */ a(en, { tag: Ft }, Ft.id))
        ] }, ge))
      ] });
    };
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ u("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ u("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            ua,
            {
              value: he.length,
              label: he.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${j.hosts.toLocaleString()} ${j.hosts === 1 ? xt : `${xt}s`}`,
              pressed: mt("matching"),
              onToggle: () => Ot({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            ua,
            {
              value: j.willChange,
              label: "will change",
              tone: "add",
              pressed: mt("change"),
              onToggle: () => Ot({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            ua,
            {
              value: j.correct,
              label: "already correct, no write",
              pressed: mt("correct"),
              onToggle: () => Ot({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            ua,
            {
              value: j.different,
              label: v ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: mt("different"),
              onToggle: () => Ot({ group: "different" })
            }
          )
        ] }),
        ke.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: At[H].title,
            entries: ke,
            mediaKind: Ze,
            resultHeading: "Planned change",
            describe: fe
          }
        ) : he.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        he.length > 0 && /* @__PURE__ */ u("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: oe ? `Dates ${oe.item.media.date}${Ge ? ` to ${Ge.item.media.date}` : ""}` : "No dates" }),
          oe && /* @__PURE__ */ a(
            "a",
            {
              href: _t(oe),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Je.one}, ${oe.item.media.date}`,
              title: fa(oe, Ze),
              children: "Open earliest"
            }
          ),
          Ge && /* @__PURE__ */ a(
            "a",
            {
              href: _t(Ge),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Je.one}, ${Ge.item.media.date}`,
              title: fa(Ge, Ze),
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
              tag: et,
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
          ir ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function tn() {
    return /* @__PURE__ */ u(pe, { children: [
      Kt(),
      Gt(jt, !0),
      /* @__PURE__ */ u("div", { className: `dq-batch-cards${dt ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ u("section", { className: "dq-batch-card", "aria-labelledby": `${be}-chosen`, children: [
          /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${be}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: k, onClick: Dt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: qt.map((I) => {
            const j = Oe(I.id);
            return /* @__PURE__ */ u("li", { children: [
              /* @__PURE__ */ u("span", { className: "dq-batch-chosen-chip", children: [
                j && /* @__PURE__ */ a(Nt, { binding: j, hidden: !0 }),
                I.label
              ] }),
              /* @__PURE__ */ a(cs, { parts: Et(I) })
            ] }, I.id);
          }) })
        ] }),
        dt && /* @__PURE__ */ a(
          Bi,
          {
            ...Te,
            mediaKind: Ze,
            actions: we.actions,
            trees: r,
            flags: nt,
            className: "dq-batch-card"
          }
        )
      ] }),
      k ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : l && Er(l)
    ] });
  }
  function Dn(I) {
    const j = J ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, H = j.kind === "apply" ? he.length - I.counts.pending : j.done, ke = j.kind === "apply" ? he.length : j.total, fe = k ? j.kind === "undo" ? "Undoing batch…" : j.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : j.kind === "undo" ? j.stopped ? "Undo stopped" : "Undo finished" : j.stopped ? "Stopped" : "Finished", Ae = ke ? Math.round(H / ke * 100) : 100, qe = V && !os.has(V.group) ? V.group : null, st = (Ie) => ss.find((ge) => ge.status === Ie).label, Mt = qe ? he.filter(
      (Ie) => Ie.status === qe && (!V.reason || Ie.error === V.reason)
    ) : [];
    return /* @__PURE__ */ u(pe, { children: [
      /* @__PURE__ */ u("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ u("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: fe }),
          /* @__PURE__ */ u("span", { children: [
            H.toLocaleString(),
            " of ",
            ke.toLocaleString(),
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
            "aria-valuemax": ke,
            "aria-valuenow": H,
            children: /* @__PURE__ */ a("span", { style: { width: `${Ae}%` } })
          }
        ),
        !k && j.kind === "undo" && /* @__PURE__ */ u("p", { className: "dq-batch-undone", children: [
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
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: ss.map((Ie) => /* @__PURE__ */ a(
          ua,
          {
            value: I.counts[Ie.status],
            label: Ie.label,
            tone: Ie.tone,
            pressed: mt(Ie.status),
            onToggle: () => Ot({ group: Ie.status })
          },
          Ie.status
        )) }),
        I.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: I.reasons.map((Ie) => {
          const ge = mt(Ie.status, Ie.error);
          return /* @__PURE__ */ u("li", { children: [
            /* @__PURE__ */ u("span", { children: [
              Ie.count.toLocaleString(),
              " ",
              Ie.status,
              ": ",
              Ie.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": ge,
                onClick: () => Ot({ group: Ie.status, reason: Ie.error }),
                children: ge ? "Hide them" : "Show them"
              }
            )
          ] }, `${Ie.status}-${Ie.error}`);
        }) }),
        Mt.length > 0 ? /* @__PURE__ */ a(
          ds,
          {
            title: V.reason ? `${st(qe)}: ${V.reason}` : `${st(qe)} occurrences`,
            entries: Mt,
            mediaKind: Ze,
            resultHeading: "Result",
            describe: (Ie) => Ie.error ?? st(Ie.status)
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
            onClick: () => void fn("undo"),
            children: [
              /* @__PURE__ */ a(Xl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ u("p", { children: [
          Se ? j.stopped || k ? `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${I.recorded.toLocaleString()} ${I.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${I.recorded === 1 ? "this change" : `these ${I.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function Vt() {
    return d === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !qt.length,
        onClick: An,
        children: "Preview all matches"
      },
      "preview"
    ) : d === "preview" ? k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: un, children: "Cancel preview" }, "cancel-preview") : l ? /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !ut.willChange,
        onClick: () => void fn("apply"),
        children: [
          "Apply to ",
          ut.willChange.toLocaleString(),
          " ",
          ut.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : C ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Dt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void rr(),
        children: "Preview again"
      },
      "again"
    ) : k ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: un, children: Se ? "Cancel undo" : "Cancel run" }, "cancel-run") : Se || !B ? null : /* @__PURE__ */ u(Ji, { children: [
      B.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void fn("retry"), children: "Retry failed" }),
      B.counts.pending > 0 && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          onClick: () => void fn("apply"),
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
        disabled: t || !Pt.length,
        onClick: () => {
          Lt(), i(), c(!0);
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
        "aria-labelledby": `${be}-title`,
        "aria-modal": "true",
        onCancel: (I) => {
          I.preventDefault(), tt();
        },
        onClose: () => {
          var I;
          ue.current ? (I = ie.current) == null || I.showModal() : tt();
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
                disabled: k,
                onClick: tt,
                children: /* @__PURE__ */ a(qa, { "aria-hidden": "true" })
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
                d === "answers" ? pt() : d === "preview" ? tn() : Dn(B)
              ]
            }
          ),
          /* @__PURE__ */ u("div", { className: "dq-batch-footer", children: [
            d === "preview" && /* @__PURE__ */ u("button", { type: "button", className: "dq-button", disabled: k, onClick: Dt, children: [
              /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
              "Back"
            ] }),
            d === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: Lt, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: k, onClick: tt, children: "Close" }),
            Vt()
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
  const [n, r] = T(jf), i = Sn(() => {
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
  var h;
  const l = e ? e.ranked.slice(0, e.limit) : [], m = !!e && (e.ranked.length > e.limit || (((h = e.candidates[e.cursor]) == null ? void 0 : h.total) ?? 0) > 0);
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
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: l.map((g) => {
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
            /* @__PURE__ */ a(Br, { performer: g }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g.name }),
            N && /* @__PURE__ */ a(xn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: g.count.toLocaleString() })
          ]
        },
        g.id
      );
    }) }),
    m && !t && !n && /* @__PURE__ */ a(
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
function Ua(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function Hf(e, t) {
  const n = eo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
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
function Jf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: i
}) {
  const [o, s] = T(!1), [c, d] = T(null), f = R(null), l = R(null), m = Xe(), h = Jr(e.conditionTagIds), g = Hf(e, h);
  $t(() => {
    const w = f.current;
    if (!o || !w) return;
    const k = () => d(zf(w));
    k(), window.addEventListener("resize", k);
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(k), F = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const U of F) U && (O == null || O.observe(U));
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
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== l.current || w.defaultPrevented || ln(w))) {
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
        "aria-controls": o ? m : void 0,
        title: g,
        onClick: () => o ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(xs, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: g }),
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
          id: m,
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
                Zn,
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
                  ma,
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
                  /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
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
                  Zn,
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
                  ga(e.condition) && /* @__PURE__ */ u("label", { className: "dq-checkbox", children: [
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
            Ln({
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
  const o = Va(e), s = Qf(e), c = Kc(e.occurrence), d = (t == null ? void 0 : t.signature) === o && !t.partial ? t : {
    signature: o,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Wf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, l = [...d.ranked];
  let m = d.cursor, h = !1;
  const g = (y) => ({
    ...d,
    cursor: m,
    ranked: [...l],
    limit: n,
    complete: !y && Gi(f, m, l, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: i.concurrency ?? 6 }, async () => {
        var y;
        for (; !h && !Gi(f, m, l, n); ) {
          r.throwIfAborted();
          const N = f[m++], v = await Zc(e, N.id, r);
          v > 0 && el(l, { ...N, count: v }), (y = i.onProgress) == null || y.call(i, g(!0));
        }
      })
    );
  } catch (y) {
    throw h = !0, y;
  }
  return r.throwIfAborted(), g(!1);
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
  if (ee(() => {
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
          for (var f = c.compress(d), l = new Uint8Array(f.length * 2), m = 0, h = f.length; m < h; m++) {
            var g = f.charCodeAt(m);
            l[m * 2] = g >>> 8, l[m * 2 + 1] = g % 256;
          }
          return l;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(d) {
          if (d == null)
            return c.decompress(d);
          for (var f = new Array(d.length / 2), l = 0, m = f.length; l < m; l++)
            f[l] = d[l * 2] * 256 + d[l * 2 + 1];
          var h = [];
          return f.forEach(function(g) {
            h.push(n(g));
          }), c.decompress(h.join(""));
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
          var m, h, g = {}, y = {}, N = "", v = "", w = "", k = 2, O = 3, F = 2, U = [], C = 0, L = 0, x;
          for (x = 0; x < d.length; x += 1)
            if (N = d.charAt(x), Object.prototype.hasOwnProperty.call(g, N) || (g[N] = O++, y[N] = !0), v = w + N, Object.prototype.hasOwnProperty.call(g, v))
              w = v;
            else {
              if (Object.prototype.hasOwnProperty.call(y, w)) {
                if (w.charCodeAt(0) < 256) {
                  for (m = 0; m < F; m++)
                    C = C << 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++;
                  for (h = w.charCodeAt(0), m = 0; m < 8; m++)
                    C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
                } else {
                  for (h = 1, m = 0; m < F; m++)
                    C = C << 1 | h, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = 0;
                  for (h = w.charCodeAt(0), m = 0; m < 16; m++)
                    C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
                }
                k--, k == 0 && (k = Math.pow(2, F), F++), delete y[w];
              } else
                for (h = g[w], m = 0; m < F; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
              k--, k == 0 && (k = Math.pow(2, F), F++), g[v] = O++, w = String(N);
            }
          if (w !== "") {
            if (Object.prototype.hasOwnProperty.call(y, w)) {
              if (w.charCodeAt(0) < 256) {
                for (m = 0; m < F; m++)
                  C = C << 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++;
                for (h = w.charCodeAt(0), m = 0; m < 8; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
              } else {
                for (h = 1, m = 0; m < F; m++)
                  C = C << 1 | h, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = 0;
                for (h = w.charCodeAt(0), m = 0; m < 16; m++)
                  C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
              }
              k--, k == 0 && (k = Math.pow(2, F), F++), delete y[w];
            } else
              for (h = g[w], m = 0; m < F; m++)
                C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
            k--, k == 0 && (k = Math.pow(2, F), F++);
          }
          for (h = 2, m = 0; m < F; m++)
            C = C << 1 | h & 1, L == f - 1 ? (L = 0, U.push(l(C)), C = 0) : L++, h = h >> 1;
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
          var m = [], h = 4, g = 4, y = 3, N = "", v = [], w, k, O, F, U, C, L, x = { val: l(0), position: f, index: 1 };
          for (w = 0; w < 3; w += 1)
            m[w] = w;
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
          for (m[3] = L, k = L, v.push(L); ; ) {
            if (x.index > d)
              return "";
            for (O = 0, U = Math.pow(2, y), C = 1; C != U; )
              F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
            switch (L = O) {
              case 0:
                for (O = 0, U = Math.pow(2, 8), C = 1; C != U; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                m[g++] = n(O), L = g - 1, h--;
                break;
              case 1:
                for (O = 0, U = Math.pow(2, 16), C = 1; C != U; )
                  F = x.val & x.position, x.position >>= 1, x.position == 0 && (x.position = f, x.val = l(x.index++)), O |= (F > 0 ? 1 : 0) * C, C <<= 1;
                m[g++] = n(O), L = g - 1, h--;
                break;
              case 2:
                return v.join("");
            }
            if (h == 0 && (h = Math.pow(2, y), y++), m[L])
              N = m[L];
            else if (L === g)
              N = k + k.charAt(0);
            else
              return null;
            v.push(N), m[g++] = k + N.charAt(0), h--, k = N, h == 0 && (h = Math.pow(2, y), y++);
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
function er(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => er(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, i = Object.keys(n).sort(), o = Object.keys(r).sort();
  return i.length === o.length && i.every(
    (s, c) => s === o[c] && er(n[s], r[s])
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
        async (m) => [m, await ai([m])]
      )
    ).then((m) => {
      l && n(Object.fromEntries(m));
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
  ), d = s.every((v) => r[v]), f = kr(
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
  const m = f.filter((v) => !l.has(v)), h = Jr(m);
  for (const v of m)
    l.set(v, {
      name: h[v] === void 0 ? "…" : h[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const g = [...l].sort((v, w) => v[1].name.localeCompare(w[1].name));
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
          disabled: i,
          onClick: () => o(v),
          children: [
            k && /* @__PURE__ */ a(zr, { "aria-hidden": "true" }),
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
function ip({
  review: e,
  savedObjectFilter: t,
  queueFilter: n,
  queueCount: r,
  disabled: i,
  countsPaused: o,
  onToggle: s
}) {
  var m, h;
  const c = ((m = e.presentation) == null ? void 0 : m.filterBins) ?? [], d = kr(e.view.objectFilter, t, c).bins, f = op(e, t, n, o);
  if (!c.length) return null;
  const l = /* @__PURE__ */ new Map();
  for (const g of c) {
    const y = ((h = g.group) == null ? void 0 : h.trim()) ?? "";
    l.set(y, [...l.get(y) ?? [], g]);
  }
  return /* @__PURE__ */ a(pe, { children: [...l].map(([g, y]) => /* @__PURE__ */ u(
    "div",
    {
      className: "dq-bins",
      role: "group",
      "aria-label": g ? `${g} bins` : "Filter bins",
      children: [
        g && /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: g }),
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
    g
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
    let m = 0;
    const h = new AbortController(), g = kr(
      e.view.objectFilter,
      t,
      (y = e.presentation) == null ? void 0 : y.filterBins
    ).bins;
    for (const v of ((N = e.presentation) == null ? void 0 : N.filterBins) ?? [])
      g.includes(v.key) || (m++, Zs(il(e, v.key, t), n, h.signal).then((w) => {
        h.signal.aborted || o((k) => ({ ...k, [v.key]: w }));
      }).catch(() => {
      }).finally(() => {
        h.signal.aborted || m--;
      }));
    return () => {
      m > 0 && (f.current = null), h.abort();
    };
  }, [d, r]), i;
}
function br(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function sp(e) {
  if (!br(e) || Object.keys(e).length !== 1 || !br(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !br(t.tagsCriterion)) return null;
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
    (r) => er(e, al(r.filter))
  );
  return n ? n.key : sp(e);
}
function kr(e, t, n = []) {
  let r = e;
  const i = [];
  for (; ; ) {
    if (t && er(r, t)) {
      r = t;
      break;
    }
    const o = Object.keys(r);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const s = r._filterExpression;
    if (!br(s) || s.operator !== "AND" || !Array.isArray(s.children))
      break;
    const c = s.children, d = cp(c.at(-1), n);
    if (d == null || c.length > 3) break;
    let f = {}, l = null, m = !0;
    for (const [h, g] of c.slice(0, -1).entries())
      !br(g) || Object.keys(g).length !== 1 ? m = !1 : h === 0 && br(g.filter) && Object.keys(g.filter).length ? f = g.filter : !l && br(g.group) ? l = g.group : m = !1;
    if (!m) break;
    i.unshift(d), r = l ? { ...f, _filterExpression: l } : f;
  }
  return { base: r, bins: i };
}
function il(e, t, n) {
  var f;
  const r = ((f = e.presentation) == null ? void 0 : f.filterBins) ?? [], { base: i, bins: o } = kr(e.view.objectFilter, n, r), s = (l) => {
    var m, h;
    return ((h = (m = r.find((g) => g.key === l)) == null ? void 0 : m.group) == null ? void 0 : h.trim()) || null;
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
const oi = [
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
function qr(e) {
  const t = $e(e) ? e.occurrence : void 0;
  return {
    filter: Zt({
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
  if ($e(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!oi.some((c) => c !== "performer" && t.has(c))) {
    const c = qr(e);
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
  if ($e(e) && (o = {
    ...dp,
    ...ps(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(o.targetMode) || !Zi.includes(o.condition) || !Array.isArray(o.performerIds) || !Array.isArray(o.conditionTagIds) || typeof o.includeSubtags != "boolean" || typeof o.hideConfirmedAbsent != "boolean" || [...o.performerIds, ...o.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !o.performerFilter || typeof o.performerFilter != "object" || Array.isArray(o.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Zt(i, Ue(e)),
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
function ha(e, t) {
  const n = new URLSearchParams(window.location.search);
  oi.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", fs(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", fs(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), sl(`${window.location.pathname}?${n}${window.location.hash}`);
}
function kn(e, t) {
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
function vr(e) {
  const t = e;
  return kn(t, qr(t));
}
function ms(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !er(
    JSON.parse(Qn(kn(e, t))),
    JSON.parse(Qn(kn(e, qr(e))))
  );
}
function Io(...e) {
  return e.flatMap(
    (t) => {
      var n;
      return _e(t) === "video" ? ((n = t.presentation) == null ? void 0 : n.filterBins) ?? [] : [];
    }
  );
}
function cl(e, t) {
  if (_e(e) !== "video") return e;
  const { base: n, bins: r } = kr(
    e.view.objectFilter,
    t.view.objectFilter,
    Io(e, t)
  );
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Ba(e, t) {
  if (_e(e) !== "video") return t;
  const { base: n, bins: r } = kr(
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
const Xt = (e) => e instanceof Error ? e.message : "Request failed.", qi = 50, up = [], bs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
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
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Ls, {}) : /* @__PURE__ */ a(ti, {}) : /* @__PURE__ */ a(
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
  const c = !!n && !r, d = bo(t), f = n ? null : d, l = e == null ? void 0 : e.absent, m = Aa(
    ve(() => [...o, ...l ?? []], [o, l])
  ), h = (J) => m[J] ?? { id: J, name: m[J] === void 0 ? "…" : "Unavailable tag" }, g = (J) => wr(J.map(h)), y = f && e ? lo(f, e, i) : null, N = e ? Qd(e) : [], v = new Set(N.map((J) => J.id)), w = new Set(y == null ? void 0 : y.removed), k = new Set(y == null ? void 0 : y.markedAbsent), O = new Set(y == null ? void 0 : y.absenceCleared), F = /* @__PURE__ */ u("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
    "absent"
  ] }), U = g((y == null ? void 0 : y.added) ?? []), C = g(((y == null ? void 0 : y.markedAbsent) ?? []).filter((J) => !v.has(J))), L = c ? "h3" : "h4", x = !!(e != null && e.absent.length) && /* @__PURE__ */ u(pe, { children: [
    /* @__PURE__ */ a(L, { className: "dq-subheading", children: "Confirmed absent" }),
    /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((J) => /* @__PURE__ */ u(
      "li",
      {
        className: `dq-tag dq-tag-absent${O.has(J.id) ? " dq-tag-removed" : ""}`,
        children: [
          /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
          O.has(J.id) ? /* @__PURE__ */ u("del", { children: [
            "− ",
            /* @__PURE__ */ a(en, { tag: J })
          ] }) : /* @__PURE__ */ a(en, { tag: J })
        ]
      },
      J.id
    )) })
  ] }), re = /* @__PURE__ */ u("section", { className: "dq-panel-section", "aria-label": s, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ u(pe, { children: [
      N.length || U.length || C.length ? /* @__PURE__ */ u("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        N.map(
          (J) => w.has(J.id) ? /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ u("del", { children: [
              "− ",
              /* @__PURE__ */ a(en, { tag: J })
            ] }),
            k.has(J.id) && F
          ] }, J.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(en, { tag: J }) }, J.id)
        ),
        U.map((J) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ u("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(en, { tag: J })
        ] }) }, `added-${J.id}`)),
        C.map((J) => /* @__PURE__ */ u("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(en, { tag: J }) }),
          F
        ] }, `absent-${J.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      x
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
  return /* @__PURE__ */ u(pe, { children: [
    !c && re,
    n,
    c && x && /* @__PURE__ */ a("section", { className: "dq-panel-section", "aria-label": "Confirmed absent", children: x })
  ] });
}
function mp({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ u("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    fo(t).map((n) => /* @__PURE__ */ u("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
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
  var Nn;
  const l = Ue(e), m = En(l), h = l === "audio" ? "Audio" : "Scene", g = (p) => {
    var A;
    return p.title || ((A = p.files[0]) == null ? void 0 : A.basename) || h;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${g(p.media)}`, N = R(null), v = R("");
  if (!N.current)
    try {
      N.current = zi(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      v.current = Xt(p), N.current = { query: qr(e), startAtEnd: !1 };
    }
  const [w, k] = T(null), [O, F] = T(""), U = R(null), C = R(null), L = R(null), x = R(null), [re, J] = T(!!v.current), _ = R(0), [V, M] = T(N.current.query), D = R(V);
  D.current = V;
  const [P, Y] = T(0), W = R(N.current.startAtEnd), [ie, Q] = T([]), [S, se] = T(null), E = R(null), [X, ce] = T(null), [ue, G] = T(0), be = ve(() => {
    var Z;
    if (!S) return null;
    const p = ie.findIndex((de) => de.key === S.key), A = ((Z = E.current) == null ? void 0 : Z.key) === S.key ? E.current : null;
    return (p >= 0 ? ie.slice(p + 1) : A ? ie.filter((de) => !A.before.includes(de.key)) : []).find((de) => de.media.id !== S.media.id) ?? null;
  }, [S, ie]), [Ce, Se] = T(0), [we, Ke] = T(!1), [me, Ze] = T(!1), Je = R(!1), xt = R(0), Pt = R(!0), qt = R(null);
  ee(() => (Pt.current = !0, () => {
    Pt.current = !1;
  }), []);
  const [dt, Te] = T(v.current), [Qe, St] = T(""), [We, et] = T(null), [Ve, kt] = T(!1), [Lt, tt] = T([]), dn = R([]), Dt = R(null), An = R(null), un = R(null);
  ee(() => {
    var p, A;
    Ve && ((A = (p = un.current) == null ? void 0 : p.querySelector("input")) == null || A.focus());
  }, [Ve]);
  const [Ot, mt] = T(!1), [rr, fn] = T(!1), he = Ca(), [Bt, pn] = T(!1), hn = d ?? Bt, ar = f ?? pn;
  ee(() => {
    if (we || Ot || !An.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(bs)) return;
      const A = An.current;
      An.current = null;
      const K = document.activeElement;
      K && K !== document.body || A != null && A.isConnected && !A.disabled && A.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [we, Ot, P]);
  const [Pe, ut] = T([]), [le, B] = T({}), Oe = R(null), [Et, ir] = T({});
  ee(() => {
    let p = !0;
    return Promise.all(
      qo(V.objectFilter).map(
        async (A) => [
          String(A),
          (await ye(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      p && ir(Object.fromEntries(A));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [V.objectFilter]);
  const oe = ve(
    () => So(V.objectFilter, Et),
    [Et, V.objectFilter]
  ), Ge = R(0), _t = R(e);
  _t.current = e;
  const ot = w ?? e, ft = ve(
    () => kn(ot, V),
    [ot, V]
  ), jt = ve(
    () => gs(ft, V.performerFocus),
    [ft, V.performerFocus]
  ), nt = R(jt);
  nt.current = jt;
  const At = R(ft);
  At.current = ft;
  const [Kt, Gt] = T("items"), [pt, Er] = T(null), tn = R(null), Dn = R("");
  function Vt(p) {
    const A = typeof p == "function" ? p(tn.current) : p;
    tn.current = A, Er(A);
  }
  const [I, j] = T(!1), [H, ke] = T(null), fe = R(null), Ae = $e(ft) ? Va(ft) : "", [qe, st] = T(0), [Mt, Ie] = T(null);
  ee(() => () => {
    var p;
    return (p = fe.current) == null ? void 0 : p.controller.abort();
  }, []), ee(() => {
    const p = fe.current;
    !p || p.signature === Ae || (p.controller.abort(), fe.current = null, j(!1));
  }, [Ae]), ee(() => {
    var K;
    const p = tn.current;
    if (Kt !== "performers" || !Ae || ((K = fe.current) == null ? void 0 : K.signature) === Ae || Dn.current === Ae || (p == null ? void 0 : p.signature) === Ae && p.complete)
      return;
    const A = (p == null ? void 0 : p.signature) === Ae ? p : null;
    ea(p, (A == null ? void 0 : A.limit) ?? qi);
  }, [Kt, Ae, pt, H, I]);
  const ge = V.performerFocus;
  ee(() => {
    if (!ge) {
      Ie(null);
      return;
    }
    let p = !0;
    return ye(`/api/performers/${ge}`).then((A) => {
      const K = tl(ge, A.tags);
      p && Ie({ id: ge, name: A.name, tags: K });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [ge]);
  const Ft = JSON.stringify(
    $e(ft) ? Us(ft.occurrence) : []
  ), Re = ve(() => JSON.parse(Ft), [Ft]), or = ve(() => Zd(Re), [Re]), Cn = sc(or), Qr = Aa(or), Wr = (p) => {
    var A;
    return ((A = Qr[p]) == null ? void 0 : A.name) ?? (Qr[p] === null ? "Unavailable tag" : "…");
  }, Yr = (p) => ({
    name: Wr(p),
    tagIds: Cn.get(p) ?? [p],
    resolved: Cn.has(p)
  }), Ct = Yc(
    $e(ft) ? ft : null,
    ge ?? null,
    qe
  ), nn = ms(e, V), sr = ms(e, Ba(e, V)), gt = me || we || Ve, bn = Number(V.filter.page);
  function Le(p, A = !1) {
    Je.current || (xt.current++, v.current = "", W.current = A, D.current = p, M(p), Se(0), Ke(!0), A || ha(e.id, p), Y((K) => K + 1));
  }
  function Ye() {
    if (Je.current = !1, Ze(!1), Pt.current && qt.current) {
      const p = qt.current;
      qt.current = null, Le(p.query, p.startAtEnd);
    }
  }
  ee(() => {
    const p = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const A = zi(
            _t.current,
            new URLSearchParams(window.location.search)
          );
          Je.current ? qt.current = A : Le(A.query, A.startAtEnd);
        } catch (A) {
          Te(Xt(A));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), ee(() => (r(me || we || Ve || !!w), () => r(!1)), [me, we, Ve, !!w, r]);
  async function bt(p, A, K) {
    if ($e(p)) {
      const de = await Gc(
        p,
        Oe.current,
        A,
        K
      );
      return {
        items: de.items.map((Ne) => ({
          key: Ne.key,
          media: Ne.media,
          occurrence: Ne
        })),
        totalCount: de.totalCount
      };
    }
    const Z = await jr(
      p,
      { ...p.view.filter, page: A },
      K
    );
    return {
      items: Z.items.map((de) => ({ key: String(de.id), media: de })),
      totalCount: Z.totalCount
    };
  }
  function yt(p, A, K, Z = !1, de = !1) {
    if (!Pt.current || qt.current) return;
    J(!0), Q(
      de ? p.items : Ni(p.items, D.current.startFrom === "end")
    ), Se(p.totalCount), zt(K, Z);
    const Ne = {
      ...D.current,
      filter: { ...D.current.filter, page: A }
    };
    D.current = Ne, M(Ne), ha(e.id, Ne);
  }
  function zt(p, A = !1) {
    xt.current++, (p == null ? void 0 : p.key) !== (S == null ? void 0 : S.key) && (E.current = null), (p == null ? void 0 : p.media.id) !== (S == null ? void 0 : S.media.id) && ce(A && p ? p.media.id : null), se(p);
  }
  ee(() => {
    if (v.current) return;
    const p = new AbortController();
    x.current = p;
    const A = ++Ge.current;
    return Ke(!0), Te(""), St(""), E.current = null, ce(null), se(null), Q([]), kt(!1), (async () => {
      const K = gs(
        kn(_t.current, D.current),
        D.current.performerFocus
      );
      Oe.current = $e(K) ? await ko(K, p.signal) : null;
      let Z = Number(K.view.filter.page), de = await bt(K, Z, p.signal);
      const Ne = Math.max(
        1,
        Math.ceil(de.totalCount / Number(K.view.filter.perPage))
      );
      (W.current || Z > Ne) && (Z = Ne, de = await bt(K, Z, p.signal)), W.current = !1;
      const Ee = K.view.startFrom === "end" ? -1 : 1;
      for (; $e(K) && !de.items.length && Z + Ee >= 1 && Z + Ee <= Ne && !p.signal.aborted; )
        Z += Ee, de = await bt(K, Z, p.signal);
      if (A !== Ge.current || p.signal.aborted) return;
      const je = Ni(de.items, K.view.startFrom === "end");
      yt(de, Z, je[0] ?? null);
    })().catch((K) => {
      !p.signal.aborted && A === Ge.current && Te(Xt(K));
    }).finally(() => {
      !p.signal.aborted && A === Ge.current && (J(!0), Ke(!1));
    }), () => {
      p.abort(), Ge.current++;
    };
  }, [P, e.id]);
  const Ht = R(null);
  ee(() => {
    if ((S == null ? void 0 : S.key) !== Ht.current && et(null), Ht.current = (S == null ? void 0 : S.key) ?? null, !S) return;
    let p = !0;
    return gn(l, S).then((A) => {
      p && (et(A), ut(
        $e(e) ? A.ids.filter((K) => e.occurrence.tagIds.includes(K)) : []
      ));
    }).catch((A) => {
      p && Te(`Could not load current tags. ${Xt(A)}`);
    }), () => {
      p = !1;
    };
  }, [S]), ee(() => {
    if (!$e(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (A) => [
          A,
          (await ye(`/api/tags/${A}`)).name
        ]
      )
    ).then((A) => {
      p && B(Object.fromEntries(A));
    }).catch((A) => {
      p && Te(Xt(A));
    }), () => {
      p = !1;
    };
  }, [e]);
  function Xr(p, A = E.current) {
    const K = ie.findIndex((rt) => rt.key === p.key), Z = V.startFrom === "end" ? -1 : 1, de = (A == null ? void 0 : A.key) === p.key, Ne = de ? A : { key: p.key, page: bn, before: ie.slice(0, K + 1).map((rt) => rt.key), after: ie.slice(K + 1).map((rt) => rt.key) }, Ee = new Set(Ne.after), je = new Set(Ne.before), qn = ie.find((rt) => Ee.has(rt.key) || (Z === 1 || bn < Ne.page) && de && !je.has(rt.key));
    return { direction: Z, cursor: Ne, remainingKeys: Ee, visitedKeys: je, nextLoaded: qn };
  }
  async function Tn(p = !1, A = !1, K = !1, Z = () => !0, de = E.current) {
    if (!S) return;
    const { direction: Ne, cursor: Ee, remainingKeys: je, visitedKeys: qn, nextLoaded: rt } = Xr(S, de);
    if (!p && rt) {
      zt(rt, K);
      return;
    }
    const Kn = p ? qn : new Set(ie.map((ze) => ze.key));
    let De = Ne === -1 && !p ? Math.max(1, bn - 1) : bn;
    for (; Pt.current && !qt.current; ) {
      let ze = await bt(jt, De);
      const at = Math.max(
        1,
        Math.ceil(ze.totalCount / Number(V.filter.perPage))
      );
      De > at && (De = at, ze = await bt(jt, De));
      const Gn = Ni(ze.items, Ne === -1), sa = new Map(Gn.map((It) => [It.key, It])), pr = p ? Ee.after.flatMap((It) => {
        const Lr = sa.get(It);
        return Lr ? [Lr] : [];
      }) : [], ca = new Set(pr.map((It) => It.key)), xr = p ? {
        ...ze,
        items: [
          ...pr,
          ...Gn.filter(
            (It) => It.key !== S.key && !ca.has(It.key)
          )
        ]
      } : { ...ze, items: Gn };
      if (!Z()) return;
      if (A) {
        E.current = Ee, yt(xr, De, S, !1, !0);
        return;
      }
      const Pr = Ne === -1 && bn === 1 && !p ? void 0 : xr.items.find(
        (It) => !Kn.has(It.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && Ne === -1 && De === Ee.page) || je.has(It.key))
      );
      if (Pr || (Ne === -1 ? De <= 1 : De >= at)) {
        yt(
          xr,
          De,
          Pr ?? null,
          K,
          !0
        ), Pr || St(
          ze.totalCount ? `Reached the end in this direction. Matching items remain available from the ${m.queue} pages.` : `No matching ${m.many}.`
        );
        return;
      }
      De += Ne;
    }
  }
  async function wt(p, A = !1, K = !1, Z = !1) {
    if (w || !S || Je.current || we || Ve && !K)
      return;
    const de = K || Z || !!(p != null && p.steps.length);
    if (de && (!t || !We) || p && Xn(p) && !n) return;
    const Ne = !A && !K && !Z && de && p !== void 0 && We !== null && zo(e) && Mi(Oi(e.actions, Yd(p, We, Qt))).length > 0;
    Je.current = !0, Ze(!0), Te(""), St("");
    const Ee = E.current, je = de && !A && !Ne ? Xr(S).nextLoaded ?? null : null;
    je && (Q(
      (De) => De.filter((ze) => ze.key !== S.key)
    ), zt(je, !0));
    let qn = !1, rt = !1, Kn = [];
    try {
      if (de) {
        const De = await gn(l, S);
        if (p)
          await Sf(jt, S, p);
        else {
          const at = Z && $e(e) ? e.occurrence.tagIds.filter((pr) => De.ids.includes(pr)) : dn.current, sa = Vr(at, Z ? Pe : Lt);
          await Co(jt, S, sa);
        }
        const ze = await gn(l, S);
        je || et(ze), rt = !0, kt(!1), Ne && (Kn = Mi(Oi(e.actions, ze))), St(
          Kn.length ? `Tags saved. Staying until answered: ${Kn.map((at) => at.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (jn(S.occurrence.performer.id), st((at) => at + 1));
      }
      if (!Pt.current || qt.current) return;
      if (de)
        if (je) {
          const De = xt.current;
          qn = !0, Ye(), Tn(!0, !1, !0, () => xt.current === De && !Je.current, Ee).catch((ze) => {
            xt.current === De && Te(`Tags saved, but the queue could not refresh. Retry navigation with Skip. ${Xt(ze)}`);
          });
        } else Kn.length || await Tn(!0, A, !A);
      else A || await Tn();
      A && K && requestAnimationFrame(() => {
        var De;
        return (De = Dt.current) == null ? void 0 : De.focus();
      });
    } catch (De) {
      if (Te(
        rt ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${Xt(De)}` : de ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${Xt(De)}` : `Could not advance. ${Xt(De)}`
      ), de && !rt) {
        je && (Q(ie), ce(null), G((ze) => ze + 1), se(S), E.current = Ee);
        try {
          et(await gn(l, S));
        } catch {
          et(null), Te(
            (ze) => `${ze} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      qn || Ye();
    }
  }
  const yn = !Ve && !w && !Ot && !rr && (S != null || we || me);
  po({
    surface: "local",
    enabled: yn,
    actions: e.actions,
    onAction: (p, A) => {
      const K = e.actions[p];
      K && wt(K, A);
    },
    onFind: () => fn(!0)
  });
  const Ar = (p) => me || we || !We || !!w || !t && p.steps.length > 0 || !n && Xn(p);
  function _n() {
    !i || w || Je.current || Ve || (L.current = document.activeElement, C.current = {
      error: dt,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(D.current),
      items: ie,
      current: S,
      total: Ce,
      targets: Oe.current,
      stayedCursor: E.current
    }, xt.current++, k(structuredClone(e)), F(""), St(""), Te(""));
  }
  ee(() => {
    if (!o) {
      _.current = 0;
      return;
    }
    o !== _.current && re && !we && (_.current = o, _n(), s == null || s());
  }, [o, we, re]);
  function Zr() {
    k(null), F(""), requestAnimationFrame(() => {
      const p = L.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function Fe() {
    var A;
    const p = C.current;
    !p || me || ((A = x.current) == null || A.abort(), Ge.current++, D.current = p.query, M(p.query), Q(p.items), se(p.current), Se(p.total), Oe.current = p.targets, E.current = p.stayedCursor, Ke(!1), Te(p.error), St(""), window.history.replaceState(window.history.state, "", p.url), Zr());
  }
  async function Cr() {
    if (!w || !i || Je.current) return;
    const p = kn(
      { ...w, name: w.name.trim() },
      Ba(_t.current, D.current)
    ), A = ya(p);
    if (A) {
      F(A);
      return;
    }
    Je.current = !0, Ze(!0), F("");
    try {
      if (await i(p) === !1) throw new Error("Could not save review.");
      Zr(), St("Review saved.");
    } catch (K) {
      F(
        "Could not save review. Your edits are still open. " + Xt(K)
      );
    } finally {
      Ye();
    }
  }
  async function In() {
    if (!i || Je.current) return;
    const p = Ba(_t.current, D.current), A = kn(_t.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    Je.current = !0, Ze(!0), Te("");
    try {
      if (await i(A) === !1) throw new Error("Could not save review.");
      St("Queue saved to this review.");
    } catch (K) {
      Te("Could not save queue. " + Xt(K));
    } finally {
      Ye();
    }
  }
  const Tt = V.performerScope, Rn = (p) => {
    const { performerFocus: A, ...K } = D.current, Z = A && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    Le(
      {
        ...K,
        ...Z ? { performerFocus: A } : {},
        filter: { ...K.filter, page: 1 },
        performerScope: { ...Tt, ...p }
      },
      K.startFrom === "end"
    );
  };
  async function ea(p, A) {
    var de;
    const K = At.current;
    if (!$e(K)) return;
    (de = fe.current) == null || de.controller.abort();
    const Z = {
      signature: Va(K),
      controller: new AbortController()
    };
    fe.current = Z, Dn.current = "", j(!0), ke(null);
    try {
      const Ne = await Yf(K, p, A, Z.controller.signal, {
        onProgress: (Ee) => {
          fe.current === Z && Vt(Ee);
        }
      });
      fe.current === Z && Vt(Ne);
    } catch (Ne) {
      fe.current === Z && !Z.controller.signal.aborted && (Dn.current = Z.signature, ke({ signature: Z.signature, message: Xt(Ne) }));
    } finally {
      fe.current === Z && (fe.current = null, j(!1));
    }
  }
  function cr() {
    var p;
    (p = fe.current) == null || p.controller.abort(), fe.current = null, j(!1), Vt((A) => A && { ...A, partial: !0, complete: !1 });
  }
  async function jn(p) {
    var Z;
    const A = At.current;
    if (!$e(A)) return;
    if (fe.current) {
      cr();
      return;
    }
    const K = Va(A);
    if (!(((Z = tn.current) == null ? void 0 : Z.signature) !== K || tn.current.partial))
      try {
        const de = await Zc(A, p);
        if (fe.current) {
          cr();
          return;
        }
        Vt(
          (Ne) => (Ne == null ? void 0 : Ne.signature) === K ? Xf(Ne, p, de) : Ne
        );
      } catch {
        Vt(
          (de) => (de == null ? void 0 : de.signature) === K ? { ...de, partial: !0, complete: !1 } : de
        );
      }
  }
  const Jt = V.performerFocus ? pt == null ? void 0 : pt.candidates.find((p) => p.id === V.performerFocus) : void 0, ht = Mt && Mt.id === V.performerFocus ? { ...Mt, flags: gr(Re, Mt.tags) } : Jt ? { ...Jt, flags: gr(Re, Jt.tags) } : null, $n = (p) => {
    if ((Mt == null ? void 0 : Mt.id) === p)
      return gr(Re, Mt.tags);
    const A = pt == null ? void 0 : pt.candidates.find((K) => K.id === p);
    return A ? gr(Re, A.tags) : void 0;
  }, Me = ((Nn = S == null ? void 0 : S.occurrence) == null ? void 0 : Nn.performer.id) ?? null, Tr = Me === null ? void 0 : $n(Me), ta = ep(
    Re.length > 0 && Me !== null && Me !== V.performerFocus && Tr === void 0 ? Me : null
  ), Ir = Tr ?? (ta ? gr(Re, ta) : []), Qt = oc(ot.actions), Rr = Ct.summary && V.performerFocus ? uo(To(Ct.summary, ot.actions, Qt)) : [], $r = Ho(Re, (ht == null ? void 0 : ht.flags) ?? [], Yr), na = uc(
    Ho(Re, Ir, Yr),
    Me !== null && Me === V.performerFocus ? Rr : []
  ), lr = JSON.stringify(na), Or = ve(() => na, [lr]), dr = JSON.stringify($r), Un = ve(() => $r, [dr]), ra = (p) => ou(Re, p, Wr);
  function Ta(p) {
    if (Je.current) return;
    const A = {
      ...D.current,
      performerFocus: p,
      filter: { ...D.current.filter, page: 1 }
    };
    Le(A, A.startFrom === "end"), Gt("items");
  }
  function si() {
    const { performerFocus: p, ...A } = D.current;
    Le(
      { ...A, filter: { ...A.filter, page: 1 } },
      A.startFrom === "end"
    );
  }
  const Mr = R(null);
  Mr.current ?? (Mr.current = Nc());
  const Ia = Mr.current, aa = ve(
    () => ot.actions.flatMap((p) => p.steps.flatMap((A) => A.tagIds)),
    [ot.actions]
  ), Ra = R(null);
  ee(() => {
    const p = Ra.current, A = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !A) return;
    const K = p.getBoundingClientRect(), Z = A.getBoundingClientRect();
    Z.top < K.top ? p.scrollTop -= K.top - Z.top : Z.bottom > K.bottom && (p.scrollTop += Z.bottom - K.bottom);
  }, [S == null ? void 0 : S.key, Kt]);
  const rn = R(null), Bn = R(null);
  ee(() => {
    var K, Z;
    const p = Bn.current;
    if (!p) return;
    Bn.current = null;
    const A = [...((K = rn.current) == null ? void 0 : K.querySelectorAll(".dq-partner")) ?? []];
    (Z = A.find((de) => de.dataset.partnerKey === p) ?? A[0]) == null || Z.focus();
  }, [S == null ? void 0 : S.key]);
  const wn = me || we || Ve || !!w, an = ve(
    () => w ? kn(w, Ba(e, V)) : null,
    [w, e, V]
  ), Fr = ve(
    () => an != null && Kr(vr(an)) !== Kr(vr(e)),
    [an, e]
  );
  function vn() {
    S ? gn(l, S).then(et).catch((p) => Te(Xt(p))) : Le(D.current);
  }
  const On = dt ? /* @__PURE__ */ u("p", { role: "alert", children: [
    dt,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: me, onClick: vn, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, ur = me || we || S != null && !We, $a = Math.max(1, Number(V.filter.perPage) || 1), Oa = R(1);
  we || (Oa.current = Math.max(1, Math.ceil(Ce / $a)));
  const Ma = Oa.current, ia = Tt && S ? ie.filter(
    (p) => p.media.id === S.media.id && p.key !== S.key
  ) : [], oa = (p) => {
    var A;
    return p.title || ((A = p.files[0]) == null ? void 0 : A.basename) || `${l === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, fr = S ? fp(S.media, l) : "";
  return /* @__PURE__ */ u(
    "section",
    {
      className: `dq-review-workspace${l === "audio" ? " dq-audio" : ""}`,
      "aria-label": Tt ? l === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : l === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var Z;
        const A = p.target instanceof Element ? p.target.closest("button") : null, K = (A == null ? void 0 : A.getAttribute("aria-label")) ?? ((Z = A == null ? void 0 : A.textContent) == null ? void 0 : Z.trim()) ?? "";
        A && !A.closest(bs) && /^(Filters|Edit filter:|Edit criteria)/.test(K) && (An.current = A);
      },
      children: [
        /* @__PURE__ */ a(
          Dc,
          {
            name: e.name,
            description: e.description,
            entityType: _e(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: wn || !!(c != null && c.busy),
            onEdit: w ? () => {
              var p;
              return (p = U.current) == null ? void 0 : p.focus();
            } : _n,
            editDisabled: !w && (wn || !i || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: me || Ve, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: l === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  ma,
                  {
                    filter: V.filter,
                    objectFilter: oe,
                    criteriaDefinitions: l === "audio" ? Ts : Za,
                    customFieldEntityType: l,
                    supportsFilterExpressions: !0,
                    totalCount: Ce,
                    sortOptions: l === "audio" ? _l : Is,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      _c,
                      {
                        page: Math.min(Math.max(1, bn || 1), Ma),
                        pages: Ma,
                        onPage: (p) => Le({
                          ...D.current,
                          filter: Zt(
                            { ...D.current.filter, page: p },
                            l
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== D.current.filter.sort || p.direction !== D.current.filter.direction) && (p = { ...p, sorts: void 0 }), Le(
                        {
                          ...D.current,
                          filter: Zt(p, l)
                        },
                        D.current.startFrom === "end"
                      );
                    },
                    onObjectFilterChange: (p) => {
                      Le(
                        {
                          ...D.current,
                          objectFilter: Uc(
                            p,
                            Et,
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
              Tt && /* @__PURE__ */ a(
                Jf,
                {
                  scope: Tt,
                  disabled: me || Ve,
                  editing: !!w,
                  onChange: Rn,
                  onEditCriteria: () => mt(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                jc,
                {
                  mode: "single",
                  disabled: wn || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ u(pe, { children: [
              $e(jt) && t && /* @__PURE__ */ a(
                _f,
                {
                  review: jt,
                  disabled: gt || !!w,
                  performerAttention: V.performerFocus ? Un : void 0,
                  trees: Qt,
                  onOpen: () => {
                    Je.current = !0, Ze(!0);
                  },
                  onClose: (p) => {
                    if (p) {
                      const A = D.current.performerFocus;
                      A ? jn(A) : cr(), st((K) => K + 1), Ye(), v.current || Ke(!0), Y((K) => K + 1);
                    } else Ye();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                wo,
                {
                  disabled: wn,
                  items: c.moreItems({
                    onSelect: _n,
                    disabled: !i
                  })
                }
              )
            ] }),
            chipsStart: V.performerFocus ? /* @__PURE__ */ u("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Br,
                {
                  performer: {
                    id: V.performerFocus,
                    name: (ht == null ? void 0 : ht.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ u("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (ht == null ? void 0 : ht.name) ?? `performer ${V.performerFocus}` })
              ] }),
              ht != null && ht.flags.length ? /* @__PURE__ */ u("span", { className: "dq-focus-flag", title: ra(ht.flags), children: [
                /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ra(ht.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: si,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: nn,
            queueChange: !w && nn ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: sr ? () => void In() : void 0,
              saveDisabled: gt || !i,
              onReset: () => {
                const p = qr(e);
                Le(p, p.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
          w && an && /* @__PURE__ */ a(
            Lc,
            {
              drawerRef: U,
              draft: an,
              onChange: (p) => k(p),
              direction: V.startFrom,
              onDirectionChange: (p) => Le({ ...D.current, startFrom: p }),
              tagGroups: up,
              trees: Qt,
              saving: me,
              saveDisabled: we,
              error: O,
              dirty: Fr,
              criteriaChanged: sr,
              notices: On && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: On }),
              onSave: () => void Cr(),
              onCancel: Fe
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
                      title: `Open this ${m.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: oa(S.media) }),
                        /* @__PURE__ */ a(_s, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  fr && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: fr })
                ] }),
                /* @__PURE__ */ u("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, be].filter(Boolean).map((p) => {
                    var Z, de, Ne, Ee, je;
                    const A = p, K = A.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: K ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": K ? void 0 : !0,
                        inert: K ? void 0 : !0,
                        children: l === "audio" ? /* @__PURE__ */ a(
                          jl,
                          {
                            streamUrl: Ri("audio", A.media.id),
                            format: ((Z = A.media.files[0]) == null ? void 0 : Z.format) ?? "",
                            title: g(A.media),
                            coverUrl: K ? Ii("audio", A.media) : void 0,
                            duration: ((de = A.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            autostart: K && X === A.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Rs,
                          {
                            videoId: A.media.id,
                            streamUrl: Ri("video", A.media.id),
                            posterUrl: K ? Ii("video", A.media) : void 0,
                            duration: ((Ne = A.media.files[0]) == null ? void 0 : Ne.duration) ?? 0,
                            format: (Ee = A.media.files[0]) == null ? void 0 : Ee.format,
                            audioCodec: (je = A.media.files[0]) == null ? void 0 : je.audioCodec,
                            extensionSurface: K ? "quick-view" : void 0,
                            autostart: K && X === A.media.id,
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
                      label: m.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: we ? "Loading review…" : Ce ? "Reached the end in this direction." : `No matching ${m.many}.` }),
              ot.actions.length > 0 ? /* @__PURE__ */ a(
                vu,
                {
                  actions: ot.actions,
                  isDisabled: (p) => Ve || Ar(p),
                  busy: ur,
                  tags: We,
                  trees: Qt,
                  preview: Ia,
                  onApply: (p, A) => void wt(p, A),
                  onFind: () => fn(!0),
                  findDisabled: Ve || !!w,
                  paused: !!w,
                  waitForGroups: zo(ot),
                  attention: Or,
                  stayOnTap: hn,
                  onStayOnTapChange: ar
                }
              ) : $e(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ u(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || me || Ve || !We || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ u("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Pe.includes(p),
                          onChange: (A) => ut(
                            e.occurrence.multiple ? A.target.checked ? [...Pe, p] : Pe.filter((K) => K !== p) : [p]
                          )
                        }
                      ),
                      le[p] ?? "Loading tag…"
                    ] }, p)),
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
                          onClick: () => void wt(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void wt(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ u("div", { className: "dq-panel-body", ref: rn, children: [
                S && /* @__PURE__ */ u(pe, { children: [
                  /* @__PURE__ */ u("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ u("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${m.one}` })
                    ] }),
                    /* @__PURE__ */ u("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Br, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ u("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${m.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: Tt ? `Tags apply to this performer in this ${m.queue}` : `Tags apply to the whole ${m.one}` })
                      ] })
                    ] }),
                    Or.length > 0 && /* @__PURE__ */ a(mp, { entries: Or })
                  ] }),
                  ia.length > 0 && /* @__PURE__ */ u(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${m.queue}`,
                      children: [
                        /* @__PURE__ */ u("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          m.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: ia.map((p) => {
                          var A, K, Z;
                          return /* @__PURE__ */ u(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (A = p.occurrence) == null ? void 0 : A.performer.name,
                              "aria-label": (K = p.occurrence) == null ? void 0 : K.performer.name,
                              "data-partner-key": p.key,
                              disabled: gt,
                              onClick: () => {
                                Bn.current = S.key, zt(p), Te("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ a(Br, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (Z = p.occurrence) == null ? void 0 : Z.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    hp,
                    {
                      tags: We,
                      preview: Ia,
                      trees: Qt,
                      actionTagIds: aa,
                      label: `Current ${Tt ? "occurrence" : m.one} tags`,
                      tagsChangedSinceEditing: Ve && !me && (!We || We.ids.length !== dn.current.length || We.ids.some((p) => !dn.current.includes(p))),
                      editor: Ve && /* @__PURE__ */ u(
                        "fieldset",
                        {
                          ref: un,
                          disabled: me,
                          className: "dq-panel-section dq-tag-editor",
                          children: [
                            /* @__PURE__ */ u("legend", { className: "dq-eyebrow", children: [
                              "Edit ",
                              Tt ? "occurrence" : m.one,
                              " tags"
                            ] }),
                            /* @__PURE__ */ a(
                              Zn,
                              {
                                entityType: "tag",
                                values: Lt,
                                onChange: tt,
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
                                  onClick: () => void wt(void 0, !0, !0),
                                  children: "Save"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  disabled: !We,
                                  onClick: () => void wt(void 0, !1, !0),
                                  children: "Save & next"
                                }
                              ),
                              /* @__PURE__ */ a(
                                "button",
                                {
                                  type: "button",
                                  className: "dq-button",
                                  onClick: () => {
                                    kt(!1), requestAnimationFrame(() => {
                                      var p;
                                      return (p = Dt.current) == null ? void 0 : p.focus();
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
                $e(ft) && V.performerFocus && /* @__PURE__ */ a(
                  Bi,
                  {
                    ...Ct,
                    mediaKind: l,
                    actions: ot.actions,
                    trees: Qt,
                    flags: Un
                  }
                )
              ] }),
              /* @__PURE__ */ u("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ u("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && On,
                  Qe && /* @__PURE__ */ a("p", { role: "status", children: Qe })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ u("div", { className: "dq-panel-actions", "aria-busy": ur || void 0, children: [
                  /* @__PURE__ */ u(
                    "button",
                    {
                      type: "button",
                      ref: Dt,
                      className: "dq-button",
                      disabled: gt || !!w || !t || !We,
                      onClick: () => {
                        xt.current++, dn.current = [...We.ids], tt([...We.ids]), kt(!0);
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
                      onClick: () => void wt(),
                      children: [
                        /* @__PURE__ */ a(ed, { "aria-hidden": "true" }),
                        "Skip",
                        Tt ? " performer" : ` ${m.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              Tt && /* @__PURE__ */ u(
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
                        "aria-pressed": Kt === "items",
                        onClick: () => Gt("items"),
                        children: l === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": Kt === "performers",
                        onClick: () => Gt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              Tt && Kt === "performers" ? /* @__PURE__ */ a(
                Kf,
                {
                  ranking: (pt == null ? void 0 : pt.signature) === Ae ? pt : null,
                  busy: I,
                  error: (H == null ? void 0 : H.signature) === Ae ? H.message : "",
                  focus: V.performerFocus,
                  disabled: gt,
                  labels: m,
                  flagLabel: ra,
                  onFocus: Ta,
                  onMore: () => {
                    const p = tn.current;
                    p && ea(p, p.limit + qi);
                  },
                  onRefresh: () => {
                    Vt(null), ea(null, qi);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: Ra, children: ie.map((p) => {
                var K;
                const A = (S == null ? void 0 : S.key) === p.key;
                return /* @__PURE__ */ u(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(p),
                    "aria-label": y(p),
                    "aria-current": A ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      zt(p), Te(""), St("");
                    },
                    children: [
                      /* @__PURE__ */ a(pp, { media: p.media, kind: l }),
                      /* @__PURE__ */ u("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: g(p.media) }),
                        /* @__PURE__ */ u("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ u(pe, { children: [
                            /* @__PURE__ */ a(Br, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (K = p.media.files[0]) != null && K.duration ? $s(p.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  p.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        Tt && /* @__PURE__ */ a(
          Cs,
          {
            open: Ot,
            onClose: () => mt(!1),
            criteria: Qi,
            activeFilter: Tt.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              mt(!1), Rn({ performerFilter: p });
            }
          }
        ),
        rr && /* @__PURE__ */ a(
          go,
          {
            actions: e.actions,
            trees: Qt,
            isDisabled: (p) => Ar(p),
            tapStays: he && hn,
            onApply: (p, A) => {
              fn(!1), wt(p, A);
            },
            onClose: () => fn(!1)
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
  const n = _e(e), r = En(to(n)), i = n === "tag" ? "tag" : $e(e) ? r.queue : r.one;
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
  onOpen: m,
  onNew: h,
  onImport: g,
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
              const U = (C = F.target.files) == null ? void 0 : C[0];
              F.target.value = "", U && g(U);
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
            onClick: h,
            children: [
              /* @__PURE__ */ a(Na, { "aria-hidden": "true" }),
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
          const U = _e(F);
          return /* @__PURE__ */ u("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ u(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(F.id)}`,
                "data-review-id": F.id,
                onClick: (C) => {
                  C.button !== 0 || C.metaKey || C.ctrlKey || C.shiftKey || C.altKey || (C.preventDefault(), m(F.id));
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
      /* @__PURE__ */ a(ti, { "aria-hidden": "true" }),
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
  const l = R(null), m = Xe();
  ee(() => {
    var y;
    return l.current ?? (l.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var N;
      (N = l.current) != null && N.isConnected && l.current.focus({ preventScroll: !0 });
    };
  }, []);
  const h = R(o);
  ee(() => {
    var v, w;
    const y = document.activeElement, N = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!i.name.trim() || h.current && !o && N) && ((w = d.current) == null || w.focus()), h.current = o;
  }, [s, o]);
  const g = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": m,
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
              /* @__PURE__ */ a("h2", { id: m, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: o,
                  onClick: g,
                  children: /* @__PURE__ */ a(qa, { "aria-hidden": "true" })
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
                      y !== _e(i) && t(ul(y, i));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => yo(i), children: "Export draft" }),
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
  return _e(t) === "video" && kr(t.view.objectFilter, e.view.objectFilter, Io(t, e)).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ws(e, t) {
  return er(
    JSON.parse(Qn(vr(e))),
    JSON.parse(Qn(vr(t)))
  );
}
const ki = 180;
function vs(e) {
  return _e(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function Ns(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function qs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function Ei(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  oi.forEach((i) => n.delete(i)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  sl(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function Ep(e) {
  return Zt({ ...e, page: 1 });
}
function fl(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function _r(e) {
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
  }), [i, o] = T(""), [s, c] = T(!0), [d, f] = T(""), [l, m] = T(!1), [h, g] = T(!1), [y, N] = T(!1), [v, w] = T(!1), [k, O] = T([]), [F, U] = T(""), [C, L] = T(!0), [x, re] = T("account"), [J, _] = T(""), [V, M] = T(""), [D, P] = T(!1), [Y, W] = T(!1), [ie, Q] = T(""), [S, se] = T(qs), E = R(S);
  E.current = S;
  const [X, ce] = T({}), ue = R(X);
  ue.current = X;
  const G = R(t);
  G.current = t;
  const be = R(s);
  be.current = s;
  const Ce = R(!1), Se = R(!0);
  ee(() => (Se.current = !0, () => {
    Se.current = !1;
  }), []);
  const [we, Ke] = T(!S);
  we !== !S && (Ke(!S), S || ce({}));
  const [me, Ze] = T(yp), { sort: Je, direction: xt } = me, Pt = (b) => {
    const q = { ...me, ...b };
    Ze(q), wp(q);
  }, qt = R(null), dt = R(null), [Te, Qe] = T(null), [St, We] = T(!1), [et, Ve] = T(!1), [kt, Lt] = T(null), [tt, dn] = T(null), Dt = !!kt || !!tt, An = R(Dt);
  An.current = Dt;
  const un = St || !!tt || et, [Ot, mt] = T(0), [rr, fn] = T(!1), [he, Bt] = T(null), pn = R(null), hn = R(null), ar = R(null), [Pe, ut] = T(
    null
  ), le = t.find((b) => b.id === S) ?? null, B = ve(
    () => (Pe == null ? void 0 : Pe.id) === S && le ? { ...le, view: {
      ...le.view,
      filter: Pe.view.filter,
      objectFilter: Pe.view.objectFilter,
      searchMode: Pe.view.searchMode,
      startFrom: Pe.view.startFrom
    } } : le,
    [Pe, S, le]
  ), Oe = B ? _e(B) : "video", Et = to(Oe), ir = B ? $e(B) : !1, oe = Oe === "video" ? B : null, Ge = ir && !!(B != null && B.actions.some(Xn)), _t = !!oe || Oe === "audio" || Ge, [ot, ft] = T(null), jt = (ot == null ? void 0 : ot.id) === (B == null ? void 0 : B.id) ? ot == null ? void 0 : ot.mode : (B == null ? void 0 : B.view.reviewMode) ?? "single", nt = ir || Oe === "audio" || Oe === "video" && jt === "single", [At, Kt] = T(0), Gt = R(-1), pt = R(!1), Er = R(nt);
  Er.current = nt, ee(() => {
    const b = () => {
      const q = Er.current;
      if (!q && Rn.current) {
        pt.current = !0;
        return;
      }
      Gt.current = -1, Pr(), q || Kt(($) => $ + 1);
    };
    return window.addEventListener("popstate", b), () => window.removeEventListener("popstate", b);
  }, []);
  const tn = Et === "audio" ? h : l, Dn = Oe === "tag" ? "Tag" : Et === "audio" ? "Audio" : "Video", Vt = Oe === "tag" ? y : tn, I = R(
    null
  ), j = np(oe), [H, ke] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [fe, Ae] = T({
    page: 1,
    perPage: 40
  }), [qe, st] = T({ items: [], totalCount: 0 }), [Mt, Ie] = T(S);
  Mt !== S && (Ie(S), st({ items: [], totalCount: 0 }), W(!1));
  const [ge, Ft] = T(!1), [Re, or] = T(""), [Cn, Qr] = T(!1), [Wr, Yr] = T(!1), [Ct, nn] = T(() => /* @__PURE__ */ new Set()), sr = R(Ct);
  sr.current = Ct;
  const gt = R(/* @__PURE__ */ new Map()), bn = (B == null ? void 0 : B.view.selectAllOnLoad) === !0, [Le, Ye] = T(null), bt = R(Le);
  bt.current = Le;
  const [yt, zt] = T(!1), Ht = R(yt);
  Ht.current = yt;
  const Xr = R(null), [Tn, wt] = T(!1), [yn, Ar] = T("grid"), [_n, Zr] = T(ki), [Fe, Cr] = T(!1), [In, Tt] = T(!1), Rn = R(!1), [ea, cr] = T(""), [jn, Jt] = T(""), [ht, $n] = T(""), [Me, Tr] = T(null), [ta, Ir] = T(""), [Qt, Rr] = T(!1), [$r, na] = T({}), lr = R(/* @__PURE__ */ new Map()), Or = R(null), dr = R(null), Un = !!B, ra = Hi(Tp, Ip, () => !1) && Un, [Ta, si] = T({ top: 0, bottom: 0 });
  $t(() => {
    if (!Un) return;
    const b = () => {
      const $ = dr.current;
      if (!$) return;
      const z = Math.round($.getBoundingClientRect().top + window.scrollY), te = $.closest("main"), ae = te ? Math.round(parseFloat(getComputedStyle(te).paddingBottom) || 0) : 0;
      si(
        (ne) => ne.top === z && ne.bottom === ae ? ne : { top: z, bottom: ae }
      );
    };
    b();
    const q = typeof ResizeObserver > "u" ? null : new ResizeObserver(b);
    return q == null || q.observe(document.body), window.addEventListener("resize", b), () => {
      q == null || q.disconnect(), window.removeEventListener("resize", b);
    };
  }, [Un]);
  const [Mr, Ia] = T(0), aa = R(null), Ra = Sn((b) => {
    var $;
    if (($ = aa.current) == null || $.disconnect(), aa.current = null, !b || typeof ResizeObserver > "u") return;
    const q = new ResizeObserver(
      () => Ia(Math.round(b.getBoundingClientRect().height))
    );
    q.observe(b), aa.current = q;
  }, []), rn = R(0), Bn = R(0), wn = R(null), an = R(null), Fr = oc(
    B && !nt ? he ? [...B.actions, ...he.draft.actions] : B.actions : Ss
  ), vn = ve(
    () => he && B && le ? kp(he.draft, B, H, le) : null,
    [he, B, H, le]
  ), On = ve(
    () => B && le ? cl(
      { ...le, view: { ...B.view, filter: { ...H, page: 1 } } },
      le
    ) : null,
    [B, le, H]
  ), ur = ve(
    () => le ? Kr(vr(le)) : "",
    [le]
  ), $a = ve(
    () => On != null && Kr(vr(On)) !== ur,
    [On, ur]
  ), Oa = ve(
    () => vn != null && Kr(vr(vn)) !== ur,
    [vn, ur]
  );
  ee(() => {
    if (!jn) return;
    const b = window.setTimeout(() => Jt(""), 4e3);
    return () => window.clearTimeout(b);
  }, [jn]), ee(() => {
    if (!Te || Te.alert) return;
    const b = window.setTimeout(() => Qe(null), 6e3);
    return () => window.clearTimeout(b);
  }, [Te]), ee(() => {
    const b = oe ? qo(oe.view.objectFilter) : [];
    if (na({}), !b.length) return;
    const q = new AbortController();
    let $ = !0;
    return Promise.all(
      b.map(async (z) => {
        var te;
        try {
          const ae = await ye(`/api/tags/${z}`, {
            signal: q.signal
          });
          return (te = ae.name) != null && te.trim() ? [String(z), ae.name] : null;
        } catch {
          return null;
        }
      })
    ).then((z) => {
      $ && na(
        Object.fromEntries(z.filter((te) => te !== null))
      );
    }), () => {
      $ = !1, q.abort();
    };
  }, [oe == null ? void 0 : oe.id, oe == null ? void 0 : oe.view.objectFilter]);
  const Ma = ve(
    () => oe ? So(
      oe.view.objectFilter,
      $r
    ) : (B == null ? void 0 : B.view.objectFilter) ?? {},
    [$r, B, oe]
  ), ia = Sn(async () => {
    c(!0), f("");
    try {
      const b = await Cd();
      n(b.reviews), o(b.storageKey), m(b.canWriteVideos ?? b.canWrite), g(b.canWriteAudios ?? !1), N(b.canWriteTags ?? !1), w(b.canReadTagGroups ?? !1), L(b.canConfigure ?? !0), re(b.storage ?? "account"), _(b.storageNotice ?? ""), S && !b.reviews.some((q) => q.id === S) && (se(""), Ei(""));
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
      O([]), U("");
      return;
    }
    const b = new AbortController();
    return U(""), Dd(b.signal).then(O).catch((q) => {
      b.signal.aborted || U(
        q instanceof Error ? q.message : "Could not load tag groups."
      );
    }), () => b.abort();
  }, [v]), ee(() => {
    ia();
  }, []), ee(() => {
    if (S || t.length === 0) return;
    const b = new AbortController();
    for (const q of t) {
      if (typeof ue.current[q.id] == "number") continue;
      ($e(q) ? ko(q, b.signal).then((z) => (z == null ? void 0 : z.length) === 0 ? { items: [], totalCount: 0 } : jr(Eo(q, z), { ...q.view.filter, page: 1, perPage: 1 }, b.signal)) : _e(q) === "tag" ? hi(
        q,
        Zt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      ) : jr(
        q,
        Zt({ ...q.view.filter, page: 1, perPage: 1 }),
        b.signal
      )).then((z) => {
        b.signal.aborted || ce((te) => ({
          ...te,
          [q.id]: z.totalCount
        }));
      }).catch(() => {
        b.signal.aborted || ce((z) => ({ ...z, [q.id]: null }));
      });
    }
    return () => b.abort();
  }, [S, t]), $t(() => {
    var $, z;
    const b = dt.current;
    if (S || s || !b) return;
    dt.current = null, (z = (b === "heading" ? null : [...(($ = dr.current) == null ? void 0 : $.querySelectorAll("[data-review-id]")) ?? []].find(
      (te) => te.dataset.reviewId === b.reviewId
    )) ?? qt.current) == null || z.focus();
  }, [S, s, tt, t]);
  const oa = R(0), fr = Sn(async () => {
    const b = ++oa.current;
    Tr(null), Ir("");
    try {
      const q = await (Ge ? nc(Et) : tc(Et));
      b === oa.current && Tr(q);
    } catch (q) {
      if (b !== oa.current) return;
      Tr(null), Ir(
        "Tag assessment setup could not be checked. " + (q instanceof Error ? q.message : "Request failed.")
      );
    }
  }, [Ge, Et]);
  ee(() => {
    fr();
  }, [fr]);
  const Nn = Sn(
    async (b, q, $ = !1, z = !1) => {
      var ct, Be;
      const te = ++rn.current;
      (ct = wn.current) == null || ct.abort();
      const ae = new AbortController();
      wn.current = ae, q = Zt(q);
      const ne = Number(q.page);
      $ && (q = { ...q, page: 1 }), ke(q), Yr($), Ft(!0), or("");
      try {
        const it = (xe) => _e(b) === "tag" ? hi(
          b,
          xe,
          ae.signal
        ) : jr(
          b,
          xe,
          ae.signal
        );
        let lt = await it(q);
        const Wt = Math.max(
          1,
          Math.ceil(lt.totalCount / Number(q.perPage))
        ), Rt = $ ? Wt : Math.min(ne, Wt);
        return Number(q.page) !== Rt && (q = { ...q, page: Rt }, lt = await it(q)), te === rn.current && (((Be = an.current) == null ? void 0 : Be.page) !== Rt && (an.current = {
          page: Rt,
          ids: new Set(lt.items.map((xe) => xe.id))
        }), st(lt), z && je(
          () => new Set(lt.items.map((xe) => xe.id))
        ), ke(q), Ae(q)), lt;
      } catch (it) {
        throw te === rn.current && or(
          it instanceof Error ? it.message : "Could not load the review queue."
        ), it;
      } finally {
        te === rn.current && Ft(!1);
      }
    },
    []
  );
  ee(() => {
    var q;
    if (Bn.current += 1, Gt.current = -1, rn.current += 1, (q = wn.current) == null || q.abort(), Bt(null), pn.current = null, W(!1), Q(""), M(""), P(!1), nn(/* @__PURE__ */ new Set()), gt.current.clear(), Ye(null), zt(!1), Cr(!1), Rn.current = !1, cr(""), Jt(""), $n(""), st({ items: [], totalCount: 0 }), an.current = null, Qr(!1), !B || nt) {
      Ft(!1), ut(null);
      return;
    }
    let b = !0;
    return Ft(!0), (async () => {
      let $ = le ?? B;
      ut(null);
      let z = null;
      const te = new URLSearchParams(window.location.search);
      if (_e(B) === "video" && oi.some((Be) => te.has(Be)))
        try {
          const Be = $;
          z = zi(Be, te);
          const it = kn(Be, z.query);
          (z.query.startFrom !== (Be.view.startFrom ?? "end") || !er(
            JSON.parse(Qn(it)),
            JSON.parse(Qn(kn(Be, qr(Be))))
          )) && ($ = it, ut($));
        } catch (Be) {
          Qr(!0), or(Be instanceof Error ? Be.message : "Could not read review URL."), Ft(!1);
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
      const ne = (ae == null ? void 0 : ae.signature) === Qn($) ? ae : null, ct = z ? z.query.filter : ne ? Zt(ne.filter) : Ep($.view.filter);
      ke(ct), Ar(
        ne ? Ns(ne.displayMode, _e(B)) : vs(B)
      ), Zr(
        ne ? ne.cardSize ?? ki : ki
      );
      try {
        const Be = await Nn(
          $,
          ct,
          z ? z.startAtEnd : !ne && $.view.startFrom !== "beginning",
          $.view.selectAllOnLoad === !0
        );
        if (!b) return;
        const it = _o(
          Be.items.map((lt) => lt.id),
          (ne == null ? void 0 : ne.focusedId) ?? null,
          (ne == null ? void 0 : ne.index) ?? 0
        );
        Ye(it), Ee(it);
      } catch {
      }
      b && (Gt.current = At, W(!0), Q(`${B.id}:${At}`));
    })(), () => {
      var $;
      b = !1, Bn.current++, rn.current++, ($ = wn.current) == null || $.abort();
    };
  }, [B == null ? void 0 : B.id, nt, At]), ee(() => {
    if (!(!Ot || nt || !B)) {
      if (Cn) {
        mt(0);
        return;
      }
      Fe || he || In || ie !== `${B.id}:${At}` || (mt(0), ui());
    }
  }, [
    Ot,
    nt,
    B == null ? void 0 : B.id,
    ie,
    Fe,
    In,
    At,
    Cn
  ]), ee(() => {
    !oe || nt || !Y || ge || Re || Fe || pt.current || Gt.current !== At || ha(oe.id, {
      filter: H,
      objectFilter: oe.view.objectFilter,
      searchMode: oe.view.searchMode,
      startFrom: oe.view.startFrom ?? "end"
    });
  }, [oe, nt, Y, ge, Re, H, Fe, At]);
  const p = ve(
    () => qe.items.map((b) => b.id),
    [qe.items]
  );
  ee(() => {
    if (!Y || !B || !i || ge || Re || Fe || (Pe == null ? void 0 : Pe.id) === B.id || D || Gt.current !== At)
      return;
    const b = {
      version: 1,
      signature: Qn(B),
      filter: H,
      focusedId: Le,
      index: Math.max(0, p.indexOf(Le ?? -1)),
      displayMode: yn,
      cardSize: _n,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        i + ":progress:" + B.id,
        JSON.stringify(b)
      );
    } catch {
    }
    if (V) return;
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
    Re,
    Fe,
    H,
    Le,
    p,
    yn,
    _n,
    Pe,
    V,
    D,
    At
  ]);
  const A = qe.items.find((b) => b.id === Le) ?? null, K = Oe === "video" ? A : null;
  yt && K && (Xr.current = K);
  const Z = K ?? (yt ? Xr.current : null), de = jo(Ct, Le), Ne = p.length > 0 && p.every((b) => Ct.has(b)), Ee = Sn((b, q = !0) => {
    b != null && window.requestAnimationFrame(() => {
      var z;
      if (An.current || Nd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (z = document.activeElement) != null && z.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const $ = lr.current.get(b);
      $ == null || $.focus({ preventScroll: !0 }), q && ($ == null || $.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  ee(() => {
    Y && !Ht.current && Ee(bt.current);
  }, [Y, Ee]), ee(() => {
    ge || !p.length || (bt.current == null || !p.includes(bt.current)) && (Ye(p[0]), Ht.current || Ee(p[0]));
  }, [Ee, p, ge]);
  const je = Sn(
    (b) => {
      nn((q) => {
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
  ), qn = Sn(
    (b) => {
      if (!p.length) return;
      const q = Math.max(
        0,
        p.indexOf(bt.current ?? p[0])
      ), $ = p[Math.max(0, Math.min(p.length - 1, q + b))];
      Ye($), Ht.current || Ee($);
    },
    [Ee, p]
  ), rt = Sn(
    async (b, q = !1) => {
      const $ = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", z = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, te = z != null && (!v || !k.some((He) => He.id === z)), ae = "effect" in b && $ && !v, ne = jo(
        sr.current,
        bt.current
      );
      if (!B || Rn.current || ge || Re) return;
      const ct = $ && !Vt ? `${Dn} write permission is required to apply ${b.label}.` : ae || te ? `${b.label} needs a tag group that is unavailable.` : Xn(b) && (Me == null ? void 0 : Me.kind) !== "ready" ? `Set up tag assessments before applying ${b.label}.` : ne.length ? "" : `Select or focus a ${Oe} before applying ${b.label}.`;
      if (ct) {
        $n(ct);
        return;
      }
      const Be = ++Bn.current, it = B.id, lt = [...p], Wt = qe, Rt = bt.current, xe = new Set(sr.current), on = new Map(
        ne.map((He) => [He, gt.current.get(He) ?? 0])
      ), hr = () => Be === Bn.current && B.id === it;
      Rn.current = !0, Cr(!0), cr(
        sr.current.size ? `${ne.length} selected ${Oe}s` : `the focused ${Oe}`
      ), Jt(""), $n("");
      const xo = Wt.items.filter(
        (He) => !ne.includes(He.id)
      ), Il = xo.map((He) => He.id), Po = Uo(
        lt,
        Il,
        Rt,
        ne.includes(Rt ?? -1)
      );
      q || (st({
        items: xo,
        totalCount: Wt.totalCount
      }), nn((He) => {
        const Yt = new Set(He);
        for (const mn of ne) Yt.delete(mn);
        return Yt;
      }), Ye(Po), Ht.current || Ee(Po));
      let fi = !1;
      try {
        if ("effect" in b ? await Hd(b, ne) : await ac(Et, b, ne), fi = !0, !hr()) return;
        q || nn((He) => {
          const Yt = new Set(He);
          for (const mn of ne)
            (gt.current.get(mn) ?? 0) === on.get(mn) && Yt.delete(mn);
          return Yt;
        }), Jt(
          `${b.label}: ${ne.length} ${Oe}${ne.length === 1 ? "" : "s"} ${$ ? "updated" : "skipped"}${q ? ", kept in place" : ""}.`
        );
      } catch (He) {
        if (!hr()) return;
        st(Wt), nn((Yt) => {
          const mn = new Set(Yt);
          for (const sn of ne)
            xe.has(sn) && (gt.current.get(sn) ?? 0) === on.get(sn) && mn.add(sn);
          return mn;
        }), Ye(Rt), Ht.current || Ee(Rt), $n(
          He instanceof Error ? He.message : "Action failed."
        );
      }
      try {
        if (!hr()) return;
        if (q) {
          const Ut = Oe === "tag" ? await hi(B, H) : await jr(B, H), Vn = new Map(
            Ut.items.map((cn) => [cn.id, cn])
          );
          if (Oe !== "tag" && await Promise.all(
            ne.filter((cn) => !Vn.has(cn)).map(async (cn) => {
              const zn = await Qa(Et, cn).catch(() => null);
              zn && Vn.set(cn, zn);
            })
          ), !hr()) return;
          st((cn) => ({
            items: cn.items.map((zn) => Vn.get(zn.id) ?? zn),
            totalCount: Ut.totalCount
          }));
          return;
        }
        const He = new Set(ne), Yt = bn && lt.length > 0 && lt.every((Ut) => He.has(Ut)), mn = await Nn(B, H, !1, Yt);
        if (!hr()) return;
        let sn = mn.items.map((Ut) => Ut.id);
        const Pa = an.current, Rl = (Pa == null ? void 0 : Pa.page) === Number(H.page) && sn.some((Ut) => Pa.ids.has(Ut)), $l = (B.view.startFrom ?? "end") !== "beginning";
        if (mn.totalCount > 0 && Number(H.page) > 1 && (!sn.length || $l && !Rl)) {
          const Ut = Math.max(1, Number(H.page) - 1), Vn = { ...H, page: Ut };
          ke(Vn), sn = (await Nn(
            B,
            Vn,
            !1,
            Yt
          )).items.map((pi) => pi.id), nn(
            (pi) => new Set([...pi].filter((Ol) => sn.includes(Ol)))
          );
          const zn = sn.at(-1) ?? null;
          Ye(zn), Ht.current || Ee(zn);
        } else {
          nn(
            (Vn) => new Set([...Vn].filter((cn) => sn.includes(cn)))
          );
          const Ut = Uo(
            lt,
            sn,
            Rt,
            fi && ne.includes(Rt ?? -1)
          );
          Ye(Ut), Ht.current && Ut == null && zt(!1), Ht.current || Ee(Ut);
        }
      } catch (He) {
        hr() && $n(
          (Yt) => `${Yt ? `${Yt} ` : ""}${fi ? "The action completed, but " : ""}the queue could not be refreshed. ${He instanceof Error ? He.message : "Refresh failed."}`
        );
      } finally {
        hr() && (Rn.current = !1, Cr(!1), cr(""), pt.current && (pt.current = !1, Pr(), Kt((He) => He + 1)));
      }
    },
    [
      Vt,
      v,
      k,
      Oe,
      Me,
      Nn,
      H,
      Ee,
      p,
      qe,
      ge,
      Re,
      B
    ]
  );
  function Kn() {
    var $;
    if (yn === "list") return 1;
    const b = ($ = Or.current) == null ? void 0 : $.firstElementChild, q = b ? getComputedStyle(b).gridTemplateColumns : "";
    return Math.max(1, q.split(" ").filter(Boolean).length);
  }
  const De = R(() => {
  });
  De.current = (b) => {
    var ae;
    if (nt || b.defaultPrevented || b.repeat || ln(b) || b.ctrlKey || b.altKey || b.metaKey || Dt) return;
    const q = b.target, $ = q instanceof Node && ((ae = dr.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z) return;
    if (Tn) {
      b.key === "Escape" && (_r(b), wt(!1));
      return;
    }
    if (yt && b.key === "Escape") {
      _r(b), zt(!1), Ee(bt.current);
      return;
    }
    if (!vd(q)) return;
    const te = wd(q);
    if (b.key === "Escape") {
      _r(b), je(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && b.key === " " && te) {
      _r(b), Le != null && je((ne) => Ka(ne, Le));
      return;
    }
    if (!(Fe || ge) && !yt && b.key === "Enter" && Le != null && te) {
      if (Oe !== "tag" && he) return;
      _r(b), Oe === "tag" ? window.open(`/tag/${Le}`, "_blank", "noopener,noreferrer") : zt(!0);
      return;
    }
  }, ee(() => {
    const b = (q) => De.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const ze = R(
    () => {
    }
  );
  ze.current = (b) => {
    var ae;
    if (nt || Dt || yt || Tn || Fe || ge || !p.length || b.defaultPrevented || b.repeat || b.ctrlKey || b.altKey || b.metaKey)
      return;
    const q = b.target, $ = q instanceof Node && ((ae = dr.current) == null ? void 0 : ae.contains(q)) === !0, z = q === document.body || q === document.documentElement;
    if (!$ && !z || !b.key.startsWith("Arrow") || !qd(q)) return;
    const te = Sd(b.key, Kn());
    te && (b.preventDefault(), $ ? b.stopImmediatePropagation() : b.stopPropagation(), qn(te));
  }, ee(() => {
    const b = (q) => ze.current(q);
    return document.addEventListener("keydown", b), () => document.removeEventListener("keydown", b);
  }, []);
  const at = (he == null ? void 0 : he.saving) === !0 || In, Gn = Fe || ge && !Y || at, sa = ho();
  po({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!B && !nt && !Dt && !he && !yt && !Tn && !Re && (qe.items.length > 0 || ge || Fe),
    actions: (B == null ? void 0 : B.actions) ?? Ss,
    onAction: (b, q) => {
      const $ = B == null ? void 0 : B.actions[b];
      $ && rt($, q);
    },
    onFind: () => wt(!0),
    onSelectAll: () => je((b) => yd(b, p))
  }), ee(() => wt(!1), [nt, yt, B == null ? void 0 : B.id]);
  function pr(b) {
    const q = "steps" in b ? b.steps.length > 0 : b.effect.mode !== "SKIP", $ = "effect" in b && b.effect.mode === "SET_TAG_GROUP" ? b.effect.tagGroupId : null, z = $ != null && !k.some((te) => te.id === $);
    return Fe || ge || !!Re || q && !Vt || "effect" in b && q && (!v || z) || Xn(b) && (Me == null ? void 0 : Me.kind) !== "ready" || !de.length;
  }
  function ca(b) {
    ft(null), mt(0), Qe(null), se(b), Ei(b, !!b && !B);
  }
  function xr() {
    Ce.current || (ol() ? (Ce.current = !0, window.history.back()) : ca(""));
  }
  function Pr() {
    const b = Ce.current;
    Ce.current = !1;
    let q = qs();
    q && !be.current && !G.current.some((z) => z.id === q) && (q = "", Ei(""));
    const $ = E.current;
    q !== $ && (mt(0), b || Qe(null), !q && $ && (dt.current ?? (dt.current = { reviewId: $ }))), se(q);
  }
  function It() {
    dt.current = "heading", Qe(null), xr();
  }
  function Lr(b) {
    b !== S && ca(b), mt((q) => q + 1);
  }
  function hl() {
    Qe(null), Lt({
      review: ul("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function ml(b) {
    if (un || !C) return;
    Qe(null);
    const q = crypto.randomUUID();
    let $;
    const z = S;
    Ve(!0);
    try {
      if (!await la((ae) => ($ = gd(
        ae.find((ne) => ne.id === b.id) ?? b,
        ae,
        q
      ), [...ae, $]))) throw new Error("Could not save reviews.");
      if (!Se.current) return;
      E.current !== z ? Qe({ text: `Saved the copy “${$.name}”.`, alert: !1 }) : Lr($.id);
    } catch (te) {
      Qe({
        text: `“${b.name}” was not duplicated. ${Fa(te)}`,
        alert: !0
      });
    } finally {
      Ve(!1);
    }
  }
  async function gl() {
    if (!kt || kt.saving) return;
    const b = { ...kt.review, name: kt.review.name.trim() }, q = ya(b);
    if (q) {
      Lt({ ...kt, error: q });
      return;
    }
    Lt({ ...kt, saving: !0, error: "" });
    try {
      if (!await la(($) => [...$, b]))
        throw new Error("Could not save reviews.");
      if (!Se.current) return;
      Lt(null), Lr(b.id);
    } catch ($) {
      Lt(
        (z) => z && {
          ...z,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + ($ instanceof Error ? $.message : "Retry saving.")
        }
      );
    }
  }
  async function bl() {
    if (!tt || tt.pending) return;
    const b = tt.review, q = dl(t, X, Je, xt).map((te) => te.id), $ = q.filter((te) => te !== b.id), z = $[Math.min(q.indexOf(b.id), $.length - 1)];
    dn({ review: b, pending: !0 });
    try {
      if (!await la((te) => te.filter((ae) => ae.id !== b.id)))
        throw new Error("Could not save reviews.");
      dt.current = b.id !== S && z ? { reviewId: z } : "heading", Qe({ text: `Deleted “${b.name}”.`, alert: !1 });
    } catch (te) {
      Qe({ text: `“${b.name}” was not deleted. ${Fa(te)}`, alert: !0 });
    } finally {
      dn(null);
    }
  }
  async function yl(b) {
    if (!(un || !C)) {
      Qe(null), We(!0);
      try {
        const q = await af(b);
        let $ = 0;
        if (q.length && !await la((te) => {
          const ae = Ai(te, q);
          return $ = ae.length - te.length, $ ? ae : te;
        }))
          throw new Error("Could not save reviews.");
        const z = q.length - $;
        Qe({
          alert: !1,
          text: q.length ? $ ? `Imported ${$ === 1 ? "1 review" : `${$} reviews`}.` + (z === 1 ? " 1 review already in the list stays as it is." : z ? ` ${z} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (q) {
        Qe({ alert: !0, text: `Could not import “${b.name}”. ${Fa(q)}` });
      } finally {
        We(!1);
      }
    }
  }
  function Fa(b) {
    return b instanceof Hs ? "Reviews changed in another browser. Reload the page to get them, then try again." : b instanceof Error ? b.message : "Try again.";
  }
  function Ro(b) {
    const q = !C || un;
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
        icon: /* @__PURE__ */ a(ei, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: q,
        onSelect: () => {
          Qe(null), dn({ review: b, pending: !1 });
        }
      }
    ];
  }
  function $o(b, q) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
        ...q,
        disabled: q.disabled || et
      },
      ...Ro(b),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
        separated: !0,
        disabled: et,
        onSelect: It
      }
    ];
  }
  async function la(b) {
    if (!i) return !1;
    let q = [];
    const $ = await Rd(i, (ne) => {
      q = ne;
      const ct = b(ne);
      return ct === ne ? ne : ct.map(Mp);
    });
    if (n($), !Se.current) return !0;
    const z = E.current;
    z && !$.some((ne) => ne.id === z) && xr();
    const te = q.find((ne) => ne.id === z), ae = $.find((ne) => ne.id === z);
    return ae && te && ((ae.view.reviewMode ?? "single") !== (te.view.reviewMode ?? "single") && ft(null), ae.view.displayMode !== te.view.displayMode && Ar(vs(ae))), !0;
  }
  function ci(b) {
    return la((q) => Op(q, b));
  }
  function wl(b) {
    return ci(b).catch((q) => {
      throw E.current !== b.id && li(b, q), q;
    });
  }
  function li(b, q) {
    var z;
    if (!Se.current) return;
    const $ = ((z = G.current.find((te) => te.id === b.id)) == null ? void 0 : z.name) ?? b.name;
    Qe({ text: `“${$}” was not saved. ${Fa(q)}`, alert: !0 });
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
          onRetry: () => void ia()
        }
      )
    ] });
  const di = /* @__PURE__ */ u(pe, { children: [
    J && /* @__PURE__ */ a("p", { className: "dq-status", children: J }),
    _t && (Me == null ? void 0 : Me.kind) === "missing" && /* @__PURE__ */ u("div", { role: "status", className: "dq-status", children: [
      Me.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Qt,
          onClick: () => {
            Rr(!0), Ir(""), (Ge ? Kd(Et) : Bd(Et)).then(fr).catch(
              (b) => Ir(
                `Could not create the ${Ge ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (b instanceof Error ? b.message : "Request failed.")
              )
            ).finally(() => Rr(!1));
          },
          children: Qt ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    _t && ((Me == null ? void 0 : Me.kind) === "incompatible" || ta) && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Mn, {}),
      ta || (Me == null ? void 0 : Me.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: Qt,
          onClick: () => {
            Rr(!0), fr().finally(
              () => Rr(!1)
            );
          },
          children: Qt ? "Checking…" : "Check again"
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
    Te && (Te.alert ? /* @__PURE__ */ u("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
      Te.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: Te.text })
    ))
  ] });
  return /* @__PURE__ */ u(
    "div",
    {
      ref: dr,
      className: `data-quality-page${Un ? " dq-page-fit" : ""}`,
      style: Un ? {
        "--dq-fit-top": `${Ta.top}px`,
        "--dq-fit-bottom": `${Ta.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: Te && !Te.alert ? Te.text : "" }),
        B && nt ? /* @__PURE__ */ a(
          gp,
          {
            review: le ?? B,
            canWrite: ir ? y : tn,
            canAssess: (Me == null ? void 0 : Me.kind) === "ready" && tn,
            onBusy: Cr,
            editRequest: Ot,
            onEditRequestHandled: () => mt(0),
            onSaveDefaults: C ? wl : void 0,
            pageControls: {
              onBack: It,
              moreItems: (b) => $o(le ?? B, b),
              onGrid: oe ? () => ft({ id: oe.id, mode: "multiple" }) : void 0,
              notices: di,
              busy: et
            },
            stayOnTap: rr,
            onStayOnTapChange: fn
          },
          B.id
        ) : B ? Cl(B) : /* @__PURE__ */ a(
          Np,
          {
            reviews: t,
            counts: X,
            sort: Je,
            direction: xt,
            onSortChange: (b) => Pt({ sort: b }),
            onDirectionChange: (b) => Pt({ direction: b }),
            storage: Sp[x],
            canConfigure: C,
            busy: un,
            headingRef: qt,
            notices: di,
            onOpen: ca,
            onNew: () => hl(),
            onImport: (b) => void yl(b),
            onExportAll: () => xc(t, "data-quality-reviews.json"),
            rowMenuItems: (b) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Gr, { "aria-hidden": "true" }),
                disabled: !C || un,
                onSelect: () => Lr(b.id)
              },
              ...Ro(b)
            ]
          }
        ),
        yt && Z && oe && /* @__PURE__ */ a(
          Lp,
          {
            video: Z,
            review: oe,
            details: rp(Z, oe, j.ids),
            selectedCount: Ct.size,
            pending: Fe,
            refreshing: ge || !!Re,
            error: ht,
            canWrite: l,
            assessmentReady: (Me == null ? void 0 : Me.kind) === "ready",
            trees: Fr,
            selected: Ct.has(Z.id),
            hasPrevious: p.indexOf(Z.id) > 0,
            hasNext: p.indexOf(Z.id) >= 0 && p.indexOf(Z.id) < p.length - 1,
            onToggleSelected: () => je((b) => Ka(b, Z.id)),
            onPrevious: () => qn(-1),
            onNext: () => qn(1),
            onClose: () => {
              zt(!1), Ee(bt.current);
            },
            onAction: rt,
            findOpen: Tn,
            onFindOpenChange: wt
          }
        ),
        Tn && B && !nt && !yt && /* @__PURE__ */ a(
          go,
          {
            actions: B.actions,
            tagGroups: k,
            trees: Fr,
            isDisabled: pr,
            onApply: (b, q) => {
              wt(!1), rt(b, q);
            },
            onClose: () => wt(!1)
          }
        ),
        kt && /* @__PURE__ */ a(
          qp,
          {
            draft: kt,
            onChange: (b) => Lt((q) => q && { ...q, review: b, error: "" }),
            onCreate: () => void gl(),
            onCancel: () => Lt(null)
          }
        ),
        /* @__PURE__ */ a(
          Bl,
          {
            open: !!tt,
            title: "Delete review?",
            message: tt ? `“${tt.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (tt == null ? void 0 : tt.pending) ?? !1,
            onConfirm: () => void bl(),
            onCancel: () => dn((b) => b != null && b.pending ? b : null)
          }
        )
      ]
    }
  );
  async function xa(b, q, $ = !1, z = !0) {
    const te = bt.current, ae = Math.max(0, p.indexOf(te ?? -1));
    try {
      const ne = Nn(
        b,
        q,
        $,
        b.view.selectAllOnLoad === !0
      ), ct = rn.current, Be = await ne;
      if (ct !== rn.current) return;
      const it = Be.items.map((Wt) => Wt.id);
      nn(
        (Wt) => new Set([...Wt].filter((Rt) => it.includes(Rt)))
      );
      const lt = _o(it, te, ae);
      Ye(lt), z && !Ht.current && Ee(lt, !1);
    } catch {
    }
  }
  function vl(b) {
    const q = I.current;
    if (I.current = null, Gn || !B || !le) return;
    const $ = q ?? B.view.objectFilter, z = er(
      $,
      le.view.objectFilter
    ) ? le.view.objectFilter : $, te = Zt({ ...b, page: 1 }), ae = {
      ...B,
      view: {
        ...B.view,
        filter: te,
        objectFilter: z
      }
    }, ne = !ws(ae, le), ct = ne ? ae : le;
    ut(ne ? ae : null), Jt(ne ? "" : "Review queue defaults restored."), xa(ct, te, ct.view.startFrom !== "beginning");
  }
  function Nl() {
    if (Fe || ge || at || !le) return;
    I.current = null;
    const b = Zt({
      ...le.view.filter,
      page: 1
    });
    ut(null), Jt("Review queue defaults restored."), xa(
      le,
      b,
      le.view.startFrom !== "beginning",
      !1
    );
  }
  function ql() {
    if (Fe || ge || Re || at || !B || !On || !C)
      return;
    const b = B, q = On;
    Tt(!0), ci(q).then(($) => {
      !$ || E.current !== q.id || (ut(ys(q, b)), Jt("Queue saved to this review."));
    }).catch(($) => {
      E.current !== q.id ? li(q, $) : $n($ instanceof Error ? $.message : "Could not save queue.");
    }).finally(() => Tt(!1));
  }
  function ui() {
    if (!B || !le || Rn.current || he || In) return;
    hn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, pn.current = {
      temporaryReview: Pe,
      filter: H,
      loadedFilter: fe,
      queue: qe,
      queueError: Re,
      retryFromEnd: Wr,
      selectedIds: new Set(Ct),
      focusedId: Le,
      pageCursor: an.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const b = structuredClone({
      ...le,
      view: { ...le.view, startFrom: B.view.startFrom ?? "end" }
    });
    wt(!1), zt(!1), Jt(""), $n(""), Bt({ draft: b, saving: !1, error: "" });
  }
  function Oo() {
    Bt(null), pn.current = null;
    const b = hn.current;
    hn.current = null, requestAnimationFrame(() => {
      (b == null ? void 0 : b.isConnected) && b !== document.body && !(b instanceof HTMLButtonElement && b.disabled) ? b.focus({ preventScroll: !0 }) : Ee(bt.current, !1);
    });
  }
  function Sl() {
    var q;
    if (!he || he.saving) return;
    const b = pn.current;
    b && (rn.current += 1, (q = wn.current) == null || q.abort(), I.current = null, Ft(!1), ut(b.temporaryReview), ke(b.filter), Ae(b.loadedFilter), st(b.queue), or(b.queueError), Yr(b.retryFromEnd), je(() => b.selectedIds), Ye(b.focusedId), an.current = b.pageCursor, window.history.replaceState(window.history.state, "", b.url)), Oo();
  }
  async function kl() {
    if (!he || he.saving || !vn || !B) return;
    const b = B, q = { ...vn, name: vn.name.trim() }, $ = ya(q);
    if ($) {
      Bt((z) => z && { ...z, error: $ });
      return;
    }
    Bt((z) => z && { ...z, saving: !0, error: "" });
    try {
      if (!await ci(q)) throw new Error("Could not save reviews.");
      if (!Se.current || E.current !== q.id) return;
      ut(ys(q, b)), _e(q) === "video" && ha(q.id, {
        filter: H,
        objectFilter: b.view.objectFilter,
        searchMode: q.view.searchMode,
        startFrom: q.view.startFrom ?? "end"
      }), Jt("Review saved."), Oo();
    } catch (z) {
      if (E.current !== q.id) {
        li(q, z);
        return;
      }
      Bt(
        (te) => te && {
          ...te,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (z instanceof Error ? z.message : "Retry saving.")
        }
      );
    }
  }
  function Mo() {
    B && Nn(B, H, Wr, bn).catch(() => {
    });
  }
  function El() {
    nn(/* @__PURE__ */ new Set()), gt.current.clear(), Ye(null);
  }
  function Al(b) {
    !B || Fe || at || b === Number(H.page) || $p(
      { ...H, page: b },
      B,
      (q, $) => Nn(q, $, !1, bn),
      El
    );
  }
  function Fo(b) {
    if (!oe || !le || Fe || ge || at) return;
    const q = il(oe, b, le.view.objectFilter), $ = !ws(q, le);
    ut($ ? q : null), $ ? xa(q, { ...H, page: 1 }) : xa(
      le,
      { ...H, page: 1 },
      le.view.startFrom !== "beginning"
    );
  }
  function Cl(b) {
    var Be, it, lt, Wt, Rt;
    const q = Oe === "tag", $ = q ? "tag" : "video", z = Math.max(1, Number(H.perPage) || 40), te = Math.max(1, Math.ceil(qe.totalCount / z)), ae = Math.min(Math.max(1, Number(H.page) || 1), te), ne = [
      Vt ? "" : `${Dn} write permission is required to apply actions.`,
      q && F ? `Tag groups are unavailable. ${F}` : ""
    ].filter(Boolean), ct = !!ht && !yt;
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
              entityType: Oe,
              onBack: It,
              backDisabled: Fe || !!he || et,
              onEdit: he ? () => {
                var xe;
                return (xe = ar.current) == null ? void 0 : xe.focus();
              } : ui,
              editDisabled: !he && (Fe || ge || Cn || In || et || !C),
              editing: !!he,
              toolbar: /* @__PURE__ */ u("fieldset", { className: "dq-review-toolbar", disabled: Gn, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: q ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  ma,
                  {
                    filter: Re ? fe : H,
                    onFilterChange: vl,
                    totalCount: qe.totalCount,
                    sortOptions: q ? Gl : Is,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: yn,
                    zoomLevel: (_n - 225) / 50,
                    onZoomChange: (xe) => Zr(Math.round(225 + xe * 50)),
                    cardSizeEntityType: q ? "tags" : "videos",
                    criteriaDefinitions: q ? Kl : Za,
                    customFieldEntityType: Oe === "video" ? "video" : void 0,
                    supportsFilterExpressions: !q,
                    objectFilter: Ma,
                    onObjectFilterChange: (xe) => {
                      Gn || (I.current = Oe === "video" ? Uc(
                        xe,
                        $r,
                        b.view.objectFilter
                      ) : xe);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(_c, { page: ae, pages: te, onPage: Al })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ u(pe, { children: [
                oe && /* @__PURE__ */ a(
                  jc,
                  {
                    mode: "multiple",
                    disabled: Fe || ge || Dt || !!he || In || et,
                    onChange: () => ft({ id: oe.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  yf,
                  {
                    options: q ? Cp : Ap,
                    value: yn,
                    onChange: (xe) => Ar(Ns(xe, Oe))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                wo,
                {
                  disabled: Fe || !!he,
                  items: $o(le ?? b, {
                    onSelect: ui,
                    disabled: ge || Cn || In || !C
                  })
                }
              ),
              queueDiffers: Y ? (Pe == null ? void 0 : Pe.id) === S : void 0,
              queueChange: !he && (Pe == null ? void 0 : Pe.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: $a ? ql : void 0,
                saveDisabled: Fe || ge || !!Re || at || !C,
                onReset: Nl,
                resetDisabled: Fe || ge || at
              } : void 0,
              chipsAfter: (it = (Be = oe == null ? void 0 : oe.presentation) == null ? void 0 : Be.binParents) != null && it.length || (Wt = (lt = oe == null ? void 0 : oe.presentation) == null ? void 0 : lt.filterBins) != null && Wt.length ? /* @__PURE__ */ u(pe, { children: [
                !!((Rt = oe.presentation.binParents) != null && Rt.length) && /* @__PURE__ */ a(
                  ap,
                  {
                    videos: qe.items,
                    review: oe,
                    savedObjectFilter: (le ?? oe).view.objectFilter,
                    trees: j.ids,
                    disabled: Fe || ge || at,
                    onToggle: Fo
                  }
                ),
                /* @__PURE__ */ a(
                  ip,
                  {
                    review: oe,
                    savedObjectFilter: (le ?? oe).view.objectFilter,
                    queueFilter: H,
                    queueCount: ge || Re ? null : qe.totalCount,
                    disabled: Fe || ge || at,
                    countsPaused: Fe || ge || at || !Y,
                    onToggle: Fo
                  }
                )
              ] }) : void 0,
              chipsEnd: he ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          di,
          oe && j.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: j.error }),
          /* @__PURE__ */ u("div", { className: "dq-review-area", children: [
            he && vn && /* @__PURE__ */ a(
              Lc,
              {
                drawerRef: ar,
                draft: vn,
                onChange: (xe) => Bt((on) => on && { ...on, draft: xe }),
                direction: he.draft.view.startFrom ?? "end",
                onDirectionChange: (xe) => Bt(
                  (on) => on && {
                    ...on,
                    draft: { ...on.draft, view: { ...on.draft.view, startFrom: xe } }
                  }
                ),
                tagGroups: k,
                trees: Fr,
                saving: he.saving,
                saveDisabled: ge || !!Re,
                error: he.error,
                dirty: Oa,
                criteriaChanged: $a,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Re && !ge ? /* @__PURE__ */ u("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ u("span", { children: [
                      "The queue could not load: ",
                      Re,
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
                style: { "--dq-dock-height": `${Mr}px` },
                children: [
                  /* @__PURE__ */ u("div", { className: "dq-grid-content", children: [
                    ge && !qe.items.length && /* @__PURE__ */ a(ks, { label: "Loading review queue…" }),
                    Re && !ge && /* @__PURE__ */ a(
                      Es,
                      {
                        message: Re,
                        retryLabel: Cn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Cn && le && _e(le) === "video") {
                            const xe = qr(le);
                            ha(le.id, { ...xe, filter: { ...xe.filter, page: void 0 } }), Kt((on) => on + 1);
                            return;
                          }
                          Mo();
                        }
                      }
                    ),
                    !Fe && !ge && !Re && !qe.items.length && /* @__PURE__ */ u("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(ti, {}),
                      /* @__PURE__ */ u("p", { children: [
                        "No ",
                        $,
                        "s match this review."
                      ] })
                    ] }),
                    !!qe.items.length && /* @__PURE__ */ a("div", { ref: Or, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: yn === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${_n}px` },
                        children: qe.items.map(Tl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Ra, children: /* @__PURE__ */ a(
                    Cc,
                    {
                      actions: he ? he.draft.actions : b.actions,
                      tagGroups: k,
                      trees: Fr,
                      isDisabled: pr,
                      paused: !!he,
                      busy: Fe || ge,
                      onApply: (xe) => void rt(xe),
                      onFind: () => wt(!0),
                      status: Fe ? `Applying action to ${ea}…` : "",
                      summary: /* @__PURE__ */ u(pe, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: Ct.size ? `${Ct.size} selected` : Le == null ? "Nothing to apply to" : `Applies to the focused ${$}` }),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !p.length || Ne,
                            onClick: () => je((xe) => /* @__PURE__ */ new Set([...xe, ...p])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Nt, { binding: sa.selectAll, hidden: !0 })
                            ]
                          }
                        ),
                        /* @__PURE__ */ u(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Escape",
                            disabled: !Ct.size,
                            onClick: () => je(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Nt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ne.length ? ne.join(" ") : void 0,
                      keyHints: q ? "Arrows move · Space selects · Enter opens" : he ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews · Shift + key stays",
                      notices: ct || jn ? /* @__PURE__ */ u(pe, { children: [
                        ct && /* @__PURE__ */ u("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                          ht
                        ] }),
                        jn && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: jn })
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
    var $, z, te;
    if (Oe === "tag") {
      const ae = b;
      return /* @__PURE__ */ a(
        Fp,
        {
          tag: ae,
          displayMode: yn === "list" ? "list" : "grid",
          focused: ae.id === Le,
          selected: Ct.has(ae.id),
          setRef: (ne) => {
            ne ? lr.current.set(ae.id, ne) : lr.current.delete(ae.id);
          },
          onFocus: () => Ye(ae.id),
          onToggle: () => {
            je((ne) => Ka(ne, ae.id)), Ee(ae.id, !1);
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
        video: rl(q, oe, j.ids),
        showTagBins: ((z = ($ = oe == null ? void 0 : oe.presentation) == null ? void 0 : $.annotations) == null ? void 0 : z.includes("tags")) && !!((te = oe.presentation.annotationParents) != null && te.length),
        displayMode: yn,
        cardsScroll: ra,
        focused: q.id === Le,
        selected: Ct.has(q.id),
        setRef: (ae) => {
          ae ? lr.current.set(q.id, ae) : lr.current.delete(q.id);
        },
        onFocus: () => Ye(q.id),
        onToggle: () => je((ae) => Ka(ae, q.id)),
        onPreview: () => {
          he || (Ye(q.id), zt(!0));
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
function Ka(e, t) {
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
  const m = fl(e), h = R(null), g = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(g.date || g.studioName), N = !!(g.performers.length || g.tags.length);
  return $t(() => {
    const k = h.current;
    if (!k) return;
    const O = k.querySelector(
      `a[href="/video/${e.id}"]`
    ), F = k.querySelector(".card-title"), U = `dq-card-title-${e.id}`;
    F && (F.id = U), O && (O.target = "_blank", O.rel = "noreferrer", O.removeAttribute("aria-label"), O.setAttribute("aria-labelledby", U), O.classList.add("dq-card-link"));
    const C = k.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    C && C.setAttribute(
      "aria-label",
      o ? `Deselect ${m}` : `Select ${m}`
    );
    const L = k.querySelector(
      'button[title="Quick View"]'
    );
    L && L.setAttribute("aria-label", `Preview ${m}`);
  }), /* @__PURE__ */ u(
    "article",
    {
      ref: (k) => {
        h.current = k, s(k);
      },
      tabIndex: 0,
      "aria-current": i ? "true" : void 0,
      "aria-label": `${m}${o ? ", selected" : ""}`,
      onFocus: c,
      onClick: (k) => {
        c(), k.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${N ? "has-card-footer" : "no-card-footer"} ${i ? "focused" : ""} ${o ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          zl,
          {
            video: g,
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
    const m = t ? l.closest(".dq-grid-stage") : null, h = new IntersectionObserver(
      ([y]) => o(y.isIntersecting),
      { root: m, rootMargin: "320px 0px", threshold: 0 }
    ), g = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: m, threshold: [0, 0.6, 1] }
    );
    return h.observe(l), g.observe(l), () => {
      h.disconnect(), g.disconnect();
    };
  }, [e.id, e.files.length, t]), ee(() => {
    if (!i) {
      f(!1);
      return;
    }
    const l = new AbortController();
    return ye(jd(e.id), {
      signal: l.signal
    }).then((m) => {
      l.signal.aborted || f(m.available === !0);
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
  hasPrevious: m,
  hasNext: h,
  onToggleSelected: g,
  onPrevious: y,
  onNext: N,
  onClose: v,
  onAction: w,
  findOpen: k,
  onFindOpenChange: O
}) {
  const F = R(null), U = Ca(), C = R(null), L = R(null), x = e.files[0], re = fl(e), J = (P) => i || o || "steps" in P && P.steps.length > 0 && !c || Xn(P) && !d;
  po({
    surface: "overlay",
    enabled: !k,
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
  function _(P) {
    var ie, Q, S;
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
    P.shiftKey && W <= 0 ? (P.preventDefault(), (S = Y.at(-1)) == null || S.focus()) : !P.shiftKey && W === Y.length - 1 && (P.preventDefault(), Y[0].focus());
  }
  function V(P) {
    if (k || P.defaultPrevented || P.ctrlKey || P.metaKey || P.target.closest(
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
      const Q = L.current;
      if (!P.repeat && (Q == null ? void 0 : Q.videoId) === e.id) {
        const S = [x == null ? void 0 : x.duration, ie == null ? void 0 : ie.duration].find(
          (ce) => ce != null && Number.isFinite(ce) && ce > 0
        ) ?? 0, se = e.parentVideoId != null, E = se ? e.clipStartSec ?? 0 : 0, X = (se ? e.clipEndSec ?? S : S) - E;
        Number.isFinite(X) && X > 0 && Number.isFinite(Q.time) && W.seekBy(E + X * Number(P.key) / 10 - Q.time);
      }
    } else if (P.key === "ArrowUp" || P.key === "ArrowDown")
      !P.repeat && !i && !o && (P.key === "ArrowUp" && m && y(), P.key === "ArrowDown" && h && N());
    else return;
    _r(P);
  }
  function M(P) {
    const Y = F.current, W = P.target instanceof Element ? P.target.closest("button, a[href]") : null;
    !Y || !W || !Y.contains(W) || W.closest(".dq-player, .dq-find-action") || P.detail === 0 || Y.focus({ preventScroll: !0 });
  }
  ee(() => {
    if (k) return;
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
  }, [k, i, o, h, m, e.id, U]);
  const D = r ? `the ${r} selected video${r === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ u(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${re}`,
      className: `dq-preview${U ? " dq-preview-mobile" : ""}`,
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
                disabled: !m || i || o,
                onClick: y,
                children: [
                  /* @__PURE__ */ a(Sa, { "aria-hidden": "true" }),
                  !U && /* @__PURE__ */ a(Nt, { binding: "↑", hidden: !0 })
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
                  !U && /* @__PURE__ */ a(Nt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a(Ds, { "aria-hidden": "true" })
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
                onClick: g,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: l && /* @__PURE__ */ a(zr, {}) }),
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
                children: /* @__PURE__ */ a(qa, { "aria-hidden": "true" })
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
        k && /* @__PURE__ */ a(
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
    /* @__PURE__ */ a(Mn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Vp = { components: { DataQualityPage: Rp } };
export {
  Rp as DataQualityPage,
  Vp as default,
  er as objectFiltersEqual
};
