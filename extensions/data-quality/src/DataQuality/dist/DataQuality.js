import { jsxs as l, Fragment as he, jsx as a } from "react/jsx-runtime";
import { useState as T, useRef as $, useEffect as W, useLayoutEffect as kt, useMemo as be, useCallback as kn, useSyncExternalStore as Uo, useId as at, createContext as ql, useContext as Sl, Fragment as Ko } from "react";
import { useKeySequence as kl, EntityReferenceMultiSelector as Yn, SortableList as vs, TagBadge as El, EntityReferenceSelector as Oi, EntityDetailTabs as Cl, DetailListToolbar as oa, PERFORMER_CRITERIA as Go, AUDIO_CRITERIA as Ns, VIDEO_CRITERIA as Bo, NarrativeText as Al, AUDIO_SORT_OPTIONS as Tl, VIDEO_SORT_OPTIONS as qs, AudioPlayer as Il, VideoPlayer as Ss, formatDuration as ks, FilterDialog as Rl, getResolutionLabel as $l, ConfirmDialog as Ol, TAG_CRITERIA as Ml, TAG_SORT_OPTIONS as Fl, TagTile as xl, VideoCard as Pl } from "@cove/runtime/components";
import { Search as da, Flag as xn, Check as ua, Pencil as Dr, Ban as _a, ChevronDown as Vo, Plus as Va, Pin as Es, GripVertical as Cs, AlertTriangle as Mn, Copy as As, Trash2 as zo, X as fa, Mic as Ll, Users as Ts, Tag as Is, Headphones as Rs, Film as za, ChevronLeft as ha, MoreHorizontal as Dl, RectangleHorizontal as _l, LayoutGrid as Jo, ChevronRight as $s, Save as jl, RotateCcw as Ul, Layers as Mi, Undo2 as Kl, RefreshCw as Gl, ExternalLink as Os, SkipForward as Bl, Upload as Vl, Download as Ms, ArrowUp as zl, ArrowDown as Jl, Loader2 as Hl, List as Wl, Grid3X3 as Ql } from "@cove/runtime/lucide-react";
import { extensionFetch as Yl } from "@cove/runtime/api";
import { createPortal as Xl } from "react-dom";
const Ho = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Wo = Object.keys(
  Ho
);
function ia(e) {
  return e === "excludes" || e === "excludesAll";
}
function Qo(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function Fs(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((r) => r.tagId === n && r.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Zl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: r, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const xs = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function $e(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Yo(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ke(e) {
  return Yo(Ue(e));
}
function ed(e) {
  return Ue(e) === "video";
}
function Ue(e) {
  return e.entityType ?? "video";
}
const Hn = [
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
], Ja = [
  Hn.slice(0, 11),
  Hn.slice(11, 22),
  Hn.slice(22)
];
function na(e) {
  return e === "," ? "Comma" : e === "." ? "Period" : void 0;
}
function sa(e) {
  return na(e) ?? e.toLocaleUpperCase();
}
const Wn = "none";
function gr(e) {
  return typeof e == "string" && Hn.includes(e);
}
function Xo(e) {
  const t = e.shortcut;
  return gr(t) || t === Wn ? t : "auto";
}
function Ps(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const d = Xo(s);
    if (d !== Wn) {
      if (d !== "auto") {
        if (!n.has(d)) {
          n.set(d, c), t[c] = d;
          return;
        }
        r.add(c);
      }
      o.push(c);
    }
  });
  const i = Hn.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const d = i[c];
    d !== void 0 && (t[s] = d, n.set(d, s));
  }), { keys: t, actionOn: n, duplicatePins: r };
}
function td(e, t, n) {
  const { keys: r, actionOn: o } = Ps(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (gr(n)) {
    const c = o.get(n), d = r[t];
    c !== void 0 && c !== t && i.set(c, d && e[t].shortcut === d ? d : void 0);
  }
  const s = new Set([...i.values()].filter(gr));
  return e.map((c, d) => {
    const f = i.has(d) ? i.get(d) : gr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (f === c.shortcut) return c;
    const { shortcut: u, ...g } = c;
    return f === void 0 ? g : { ...g, shortcut: f };
  });
}
function ca(e) {
  return $e(e) && !Ds(e.occurrence) ? "Complete the optional occurrence condition before saving." : !ed(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ue(e) !== "tag" && e.actions.some(
    (t) => Zo(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Pn(t, Ue(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const nd = {
  video: 1e3,
  audio: 250
};
function Gt(e, t = "video") {
  const n = (r, o) => Number.isFinite(Number(r)) && Number(r) > 0 ? Math.floor(Number(r)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(nd[t], n(e.perPage, 40))
    )
  };
}
function Fi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Jn(e) {
  const { page: t, ...n } = e.view.filter, r = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    $e(e) ? [e.entityType, ...r, e.occurrence] : Ue(e) === "video" ? r : [Ue(e), ...r]
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
    ].includes(r.mode) && r.tagIds.length > 0 && r.tagIds.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && !Zo(e) : !1;
}
function rd(e) {
  return e === "performerOccurrence" || e === "audioPerformerOccurrence";
}
function Fn(e) {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(e);
}
function Xn(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "ADD" || t.mode === "MARK_PRESENT").flatMap((t) => t.tagIds)
  );
}
function Ls(e) {
  return "steps" in e && e.steps.length > 0;
}
function Qn(e) {
  return "steps" in e ? e.steps.some((t) => Fn(t.mode)) : !1;
}
function Zo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Fn(n.mode))
      for (const r of n.tagIds) {
        const o = t.get(r);
        if (o && o !== n.mode) return !0;
        t.set(r, n.mode);
      }
  return !1;
}
function pa(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || xs.includes(n.entityType)) && (!rd(n.entityType) || Ds(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && ad(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (r) => typeof r == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (r) => typeof (r == null ? void 0 : r.id) == "string" && typeof r.label == "string" && (r.shortcut === void 0 || typeof r.shortcut == "string") && (n.entityType === "tag" ? "effect" in r && !("steps" in r) && !("group" in r) && Pn(r, "tag") : "steps" in r && !("effect" in r) && Array.isArray(r.steps) && r.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (r.group === void 0 || typeof r.group == "string") && Pn(r, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => ca(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function ad(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (r) => ["date", "studio", "performers", "tags"].includes(r)
  )) && [n.annotationParents, n.binParents].every(
    (r) => r === void 0 || Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function wo(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const r of e)
    for (const o of r)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function od(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), r = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && r.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const d = c === 1 ? s : `${s} ${c}`;
    if (!r.has(n(d))) return d;
  }
}
function id(e, t, n) {
  return { ...structuredClone(e), id: n, name: od(e.name, t) };
}
function Ds(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (r) => Array.isArray(r) && r.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(r).size === r.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Wo.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || sd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function sd(e) {
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
function xi(e, t) {
  return e.size > 0 ? [...e].sort((n, r) => n - r) : t == null ? [] : [t];
}
function Pi(e, t, n, r) {
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
function cd(e, t) {
  const n = new Set(e), r = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    r ? n.delete(o) : n.add(o);
  return n;
}
function ld(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function pn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function dd(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function ud(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function fd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function hd(e, t) {
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
const _s = "ext:com.midnightrider.data-quality:configuration", pd = "ext:cove-data-quality:video-reviews", vo = "ext:com.midnightrider.data-quality:progress";
class js extends Error {
}
const ma = /* @__PURE__ */ new Map(), Ra = /* @__PURE__ */ new Map(), hr = (e, t) => e.includes("*") || e.includes(t), ja = (e) => me(`/api/savedfilters?mode=${encodeURIComponent(e)}`), md = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function No(e) {
  if (!Array.isArray(e) || !e.every((t) => typeof t == "string"))
    throw new Error(
      "Review migration history is invalid. Existing data has been kept."
    );
  return e;
}
function Mr(e) {
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
    reviews: pa(JSON.stringify(t.reviews)),
    deletedIds: No(t.deletedIds),
    importedIds: No(t.importedIds)
  };
}
function gd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const r = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = pa(i);
      n ?? (n = s), s.forEach((c) => r.add(c.id));
    }
    No(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => r.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...r],
    present: n !== void 0
  };
}
async function Us(e) {
  const t = await me("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function ei(e, t) {
  const n = (Ra.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ra.set(e, n), n.finally(() => {
    Ra.get(e) === n && Ra.delete(e);
  }).catch(() => {
  }), n;
}
let Zr = null;
function bd() {
  if (Zr) return Zr;
  const e = yd();
  return Zr = e, e.finally(() => {
    Zr === e && (Zr = null);
  }).catch(() => {
  }), e;
}
async function yd() {
  const e = await me("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return ei(t, () => wd(e, t));
}
async function wd(e, t) {
  var m;
  const n = String(e.user.id), r = hr(e.permissions, "savedfilters.read"), o = r && hr(e.permissions, "savedfilters.write"), i = r ? (await ja(_s)).filter((b) => b.name === "Data Quality configuration").sort((b, y) => b.id - y.id) : [];
  if (i.length > 1) {
    const b = (y) => {
      const { revision: v, ...q } = Mr(y.uiOptions);
      return JSON.stringify(q);
    };
    if (i.some((y) => b(y) !== b(i[0])))
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
  let s = i.length ? Mr(i[0].uiOptions) : md();
  const c = localStorage.getItem(`${t}:migrated`) === "true", d = localStorage.getItem(t), f = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && d && (s = Mr(d));
  let u = !i.length;
  if (i.length && f && d) {
    const b = Mr(d);
    if (b.reviews.some((v) => {
      const q = s.reviews.find((w) => w.id === v.id);
      return q && JSON.stringify(q) !== JSON.stringify(v);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...b.deletedIds])
    ];
    s = {
      ...s,
      reviews: wo(s.reviews, b.reviews).filter(
        (v) => !y.includes(v.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...b.importedIds])
      ]
    }, u = !0;
  }
  if (!c) {
    const b = JSON.stringify(s), y = gd(n);
    if (i.length && y.reviews.some((I) => {
      const F = s.reviews.find((U) => U.id === I.id);
      return F && JSON.stringify(F) !== JSON.stringify(I);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const v = r ? (await ja(pd)).flatMap(
      (I) => pa(I.uiOptions ?? "[]")
    ) : [], q = y.known.filter(
      (I) => !y.reviews.some((F) => F.id === I)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...q]);
    s = {
      ...s,
      reviews: wo(
        y.reviews,
        s.reviews,
        v.filter(
          (I) => !y.known.includes(I.id) && !s.importedIds.includes(I.id)
        )
      ).filter((I) => !w.has(I.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...v.map((I) => I.id)
        ])
      ]
    }, u || (u = JSON.stringify(s) !== b);
  }
  const g = {
    userId: n,
    recordId: (m = i[0]) == null ? void 0 : m.id,
    config: s,
    readable: r,
    writable: o,
    durable: o
  };
  if (ma.set(t, g), u && o) {
    const b = s;
    i.length && (g.config = Mr(i[0].uiOptions)), await Ks(t, b), s = g.config;
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
    canWrite: hr(e.permissions, "videos.write"),
    canWriteVideos: hr(e.permissions, "videos.write"),
    canWriteAudios: hr(e.permissions, "audios.write"),
    canWriteTags: hr(e.permissions, "tags.write"),
    canReadTagGroups: hr(e.permissions, "taggroups.read"),
    canConfigure: !r || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: r ? o ? "account" : "readOnly" : "browser",
    storageNotice: r ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function Ks(e, t) {
  const n = ma.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const r = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Us(n), n.recordId != null) {
      const i = await me(
        `/api/savedfilters/${n.recordId}`
      );
      if (Mr(i.uiOptions).revision !== n.config.revision)
        throw new js(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await me(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: _s,
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
function vd(e, t) {
  return ei(e, async () => {
    const n = ma.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const r = n.config.reviews, o = t(r);
    if (o === r) return r;
    pa(JSON.stringify(o));
    const i = r.filter((s) => !o.some((c) => c.id === s.id)).map((s) => s.id);
    return await Ks(e, {
      ...n.config,
      reviews: o,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...i])
      ].filter((s) => !o.some((c) => c.id === s))
    }), o;
  });
}
function Li(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, r]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(r)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function Nd(e, t) {
  const n = ma.get(e);
  if (!n) return null;
  const r = localStorage.getItem(`${e}:progress:${t}`), o = r ? Li(r) : null;
  if (!n.readable) return o;
  const i = (await ja(vo)).find(
    (c) => c.name === t
  ), s = i ? Li(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function qd(e, t, n) {
  const r = `${e}:progress:${t}`;
  try {
    localStorage.setItem(r, JSON.stringify(n));
  } catch {
  }
  return ei(r, async () => {
    const o = ma.get(e);
    if (!(o != null && o.writable)) return;
    await Us(o);
    const i = (await ja(vo)).find(
      (s) => s.name === t
    );
    await me(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: vo,
          name: t,
          uiOptions: JSON.stringify(n)
        })
      }
    );
  });
}
function Zn(e) {
  return e === "audio" ? "audios" : "videos";
}
const Sd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Cn(e) {
  return Sd[e];
}
const Ua = "confirmed_absent_tags", ti = "Confirmed absent tags", Ha = "confirmed_absent_occurrence_tags", Gs = {
  key: Ua,
  label: ti,
  type: "tag",
  subject: "tag assessments"
}, ni = {
  key: Ha,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, kd = {
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
      t === "modifier" && typeof n == "string" ? kd[n] ?? n : t === "key" && typeof n == "string" && [
        Ua,
        Ha
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Ln(n)
    ])
  ) : e;
}
async function Bs(e, t, n) {
  const r = new Headers(t.headers);
  !(t.body instanceof FormData) && !r.has("Content-Type") && r.set("Content-Type", "application/json");
  const o = await Yl(e, { ...t, headers: r });
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
  return await Bs(e, t, "fail");
}
function Ed(e, t = {}) {
  return Bs(e, t, "null");
}
const Cd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Ad = 0;
function qo(e, t) {
  return me(
    `/api/${Zn(e)}/${t}?dqRead=${Cd}-${++Ad}`,
    { cache: "no-store" }
  );
}
function Vs(e, t) {
  const n = { ...e.view.objectFilter }, r = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Ln({
      findFilter: Gt(t, Ke(e)),
      objectFilter: n,
      filterExpression: r
    })
  );
}
async function ra(e, t, n) {
  return me(
    `/api/${Zn(Ke(e))}/find`,
    { method: "POST", signal: n, body: Vs(e, t) }
  );
}
async function Td(e, t, n) {
  return (await me(
    `/api/${Zn(Ke(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Vs(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Di(e, t, n) {
  const r = { ...e.view.objectFilter };
  return delete r._filterExpression, me("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Ln({
        findFilter: Gt(t),
        objectFilter: r
      })
    )
  });
}
function Id(e) {
  return me("/api/taggroups", { signal: e });
}
function So(e, t, n = 1280) {
  return `/api/${Zn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function ko(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function _i(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Rd(e) {
  return `/api/stream/video/${e}/preview`;
}
function $d(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Od(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Wa(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e) {
    await me(`/api/tags/${r}`, { signal: t }), n.add(r);
    for (let o = 1; ; o++) {
      const i = await me("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ln({
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
async function ri(e, t) {
  const n = Xn(e);
  return (await Promise.all(
    e.steps.map(
      async (o) => o.mode === "REMOVE_TREE" ? {
        mode: "REMOVE",
        tagIds: (await Wa(o.tagIds, t)).filter(
          (i) => !n.has(i)
        )
      } : o
    )
  )).filter((o) => o.tagIds.length > 0);
}
function Md(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function ai(e, t) {
  const r = (await me("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!r)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Md(e, r);
  return o ? { kind: "incompatible", message: o } : r.entityTypes.includes(t) ? { kind: "ready", definition: r, message: "" } : {
    kind: "missing",
    message: `Add ${Cn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: r
  };
}
async function zs(e, t) {
  const n = await ai(e, t);
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
function Js(e = "video") {
  return ai(Gs, e);
}
function Fd(e = "video") {
  return zs(Gs, e);
}
function Hs(e = "video") {
  return ai(ni, e);
}
function xd(e = "video") {
  return zs(ni, e);
}
function Ka(e) {
  return [...new Set(e)];
}
function Ws(e, t) {
  const n = e.customFields ?? {}, r = Object.keys(n).find(
    (i) => i.toLowerCase() === Ha
  ), o = r === void 0 ? [] : n[r];
  return Ka(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function Pd(e) {
  let t;
  try {
    t = await Hs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${ni.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Ld(e, t, n, r, o, i) {
  await me(`/api/${Zn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ka(o).map((s) => `${r}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function Dd(e, t, n) {
  const r = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${ti} custom field is not available.`
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
async function Qs(e, t, n) {
  if (!Pn(t) || n.length === 0 || n.some((d) => !Number.isSafeInteger(d) || d <= 0))
    throw new Error(
      `Choose ${Cn(e).many} and configure a valid action first.`
    );
  let r = null;
  if (Qn(t)) {
    let d;
    try {
      d = await Js(e);
    } catch (f) {
      throw new Error(
        `Could not verify the ${ti} custom field. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
    if (d.kind !== "ready") throw new Error(d.message);
    r = d.definition.key;
  }
  const o = Ka(n), i = (await ri(t)).map((d) => ({
    mode: d.mode,
    tagIds: Ka(d.tagIds)
  })), c = [
    ...i.filter((d) => !Fn(d.mode)),
    ...i.filter((d) => Fn(d.mode))
  ].map(
    (d) => Dd(d, o, r)
  );
  for (let d = 0; d < c.length; d++)
    try {
      await me(`/api/${Zn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[d])
      });
    } catch (f) {
      throw new Error(
        `Step ${d + 1} failed; ${d} earlier step(s) completed. Refresh and check the selected ${Cn(e).many} before retrying. ${f instanceof Error ? f.message : "Request failed."}`
      );
    }
}
async function _d(e, t) {
  if (!Pn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await me("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const $a = (e) => e >= "0" && e <= "9";
function ji(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function Ui(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, r = 0;
  for (; n < e.length && r < t.length; ) {
    if ($a(e[n]) && $a(t[r])) {
      const c = n, d = r;
      for (; n < e.length && $a(e[n]); ) n++;
      for (; r < t.length && $a(t[r]); ) r++;
      const f = e.slice(c, n).replace(/^0+/, ""), u = t.slice(d, r).replace(/^0+/, "");
      if (f.length !== u.length) return f.length < u.length ? -1 : 1;
      if (f !== u) return f < u ? -1 : 1;
      continue;
    }
    const i = ji(e[n]), s = ji(t[r]);
    if (i !== s) return i < s ? -1 : 1;
    n++, r++;
  }
  const o = e.length - n - (t.length - r);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ys(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, r = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(r(e) - r(t)) || Ui(e.tagGroupName, t.tagGroupName) || Ui(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function br(e) {
  return [...e].sort(Ys);
}
const Eo = /* @__PURE__ */ new Map();
function jd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const r of n.steps)
        r.mode === "REMOVE_TREE" && r.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function oi(e, t, n) {
  const r = Xn(e), o = [], i = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      i.push(m);
      continue;
    }
    const b = m.tagIds.flatMap((y) => {
      const v = n.get(y);
      return v || o.push(y), v ?? [y];
    });
    i.push({ mode: "REMOVE", tagIds: b.filter((y) => !r.has(y)) });
  }
  const s = [
    ...i.filter((m) => !Fn(m.mode)),
    ...i.filter((m) => Fn(m.mode))
  ], c = new Set(t.ids), d = new Set(t.absent);
  for (const m of s)
    for (const b of m.tagIds)
      switch (m.mode) {
        case "ADD":
          c.add(b);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          c.delete(b);
          break;
        case "MARK_PRESENT":
          c.add(b), d.delete(b);
          break;
        case "MARK_ABSENT":
          c.delete(b), d.add(b);
          break;
        case "CLEAR_ABSENCE":
          d.delete(b);
          break;
      }
  const f = new Set(t.ids), u = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => c.has(m) && !f.has(m)),
    removed: [...f].filter((m) => !c.has(m)),
    markedAbsent: g.filter((m) => d.has(m) && !u.has(m)),
    absenceCleared: [...u].filter((m) => !d.has(m)),
    unresolvedTrees: [...new Set(o)]
  };
}
function Ud(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const r of e.applications)
      n.has(r.tag.id) || n.set(r.tag.id, r.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, r) => ({ id: n, name: e.names[r] ?? "" }));
  return br(t);
}
function Xs(e) {
  return Zs(jd(e));
}
function Zs(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, r] = T(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return W(() => (i.current = !0, () => {
    i.current = !1;
  }), []), W(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), Wa([c]).then(
        (d) => {
          i.current && r((f) => new Map(f).set(c, d));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function vt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function wr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => {
    const o = vt(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(r) : t.set(o, { key: o, name: n.group.trim(), actions: [r] });
  }), [...t.values()];
}
function Ki(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => vt(t.group) !== "");
}
function ec(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function tc(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function nc(e) {
  return Xn(e).size > 0 || tc(e).size > 0;
}
function Kd(e) {
  return wr(e).filter(
    (t) => !t.actions.some((n) => nc(e[n]))
  );
}
function Co(e, t) {
  const n = ec(t), r = new Set(t.absent);
  return wr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const d = [...Xn(e[c])], f = [...tc(e[c])], u = [
        ...d.map((g) => n.has(g)),
        ...f.map((g) => r.has(g))
      ];
      u.some(Boolean) && (s.push(c), u.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function Ao(e) {
  return e.filter((t) => t.answers.length === 0);
}
function Gd(e, t, n) {
  const r = { ids: [...ec(t)], absent: t.absent }, o = oi(e, r, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...r.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...r.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const xr = "review";
function Bd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Vd(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function pr(e, t) {
  const n = new Set(Bd(e));
  return t.filter((r) => n.has(r.id));
}
function Gi(e, t, n) {
  const r = /* @__PURE__ */ new Map(), o = (s, c) => {
    const d = r.get(s) ?? c();
    return r.set(s, d), d;
  };
  for (const s of pr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const d = c.categoryTagId === void 0 ? o(xr, () => ({
        key: xr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : o(`tag:${c.categoryTagId}`, () => {
        const { name: f, tagIds: u, resolved: g } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: f,
          tagIds: u,
          flags: [],
          mixed: [],
          ...g ? {} : { unresolved: !0 }
        };
      });
      d.flags.includes(s.name) || d.flags.push(s.name);
    }
  const i = [...r.values()];
  return [
    ...i.filter((s) => s.key === xr),
    ...i.filter((s) => s.key !== xr)
  ];
}
function To(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((r) => t.includes(r));
}
function ii(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => To(s.key, s.members, o) && !(c > i && To(o.key, o.members, s))
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
function zd(e, t) {
  return t.filter(
    (n) => n.key === e.key || To(n.key, n.tagIds ?? [], e)
  );
}
function rc(...e) {
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
    ...n.filter((r) => r.key === xr),
    ...n.filter((r) => r.key !== xr)
  ];
}
function Jd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const r of e.steps)
    if (r.mode !== "CLEAR_ABSENCE")
      for (const o of r.tagIds)
        for (const i of r.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function ac(e, t, n) {
  if (t.tagIds === null) return !0;
  const r = Jd(e, n);
  return t.tagIds.some((o) => r.has(o));
}
function Hd(e, t, n) {
  return t.filter(
    (r) => r.tagIds === null || r.unresolved && e.length > 0 || e.some((o) => ac(o, r, n))
  );
}
function Wd(e, t, n) {
  return t.filter((r) => r.tagIds !== null && ac(e, r, n));
}
function Qd(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function si(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [Qd(e.mixed)] : []
  ];
}
function Yd(e) {
  const t = si(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Xd(e, t, n) {
  const r = pr(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return r.length ? `Flagged: ${r.join(", ")}` : "";
}
const Io = "-", Bi = "Ctrl+a", Zd = "Ctrl/⌘A", eu = ["f", "g", "k", "n", "m", ",", "."], co = "Shift+", oc = {
  ",": [";", "<"],
  ".": [":", ">"]
}, tu = new Set(Object.values(oc).flat()), Vi = { Comma: ",", Period: "." };
function nu(e) {
  const t = typeof window > "u" ? void 0 : window.event;
  if (!(!(t instanceof KeyboardEvent) || t.type !== "keydown" || e && t.target !== e.target || !t.shiftKey))
    return Object.hasOwn(Vi, t.code) ? Vi[t.code] : void 0;
}
function jr(e) {
  return be(() => Ps(e), [e]);
}
function ci({
  surface: e,
  enabled: t,
  actions: n,
  onAction: r,
  onFind: o,
  onSelectAll: i
}) {
  const s = jr(n), c = $({ keyMap: s, onAction: r, onFind: o, onSelectAll: i });
  kt(() => {
    c.current = { keyMap: s, onAction: r, onFind: o, onSelectAll: i };
  });
  const d = !!o && n.length > 0, f = e === "local" && !!i, u = Hn.filter(
    (m) => s.actionOn.has(m) || eu.includes(m)
  ).join(" "), g = be(() => {
    const m = (v, q) => {
      var I, F;
      const w = c.current;
      if (v === Bi) (I = w.onSelectAll) == null || I.call(w);
      else if (v === Io) (F = w.onFind) == null || F.call(w);
      else {
        const U = tu.has(v), _ = U || v.startsWith(co), K = U ? nu(q) : _ ? v.slice(co.length) : v, Z = K === void 0 ? void 0 : w.keyMap.actionOn.get(K);
        Z !== void 0 && w.onAction(Z, _);
      }
    }, b = (v, q = e) => ({
      keys: v,
      surface: q,
      action: (w) => {
        w != null && w.repeat || m((w == null ? void 0 : w.sequence) ?? v, w);
      }
    }), y = [];
    f && y.push(b(Bi, "local")), d && y.push(b(Io));
    for (const v of u ? u.split(" ") : []) {
      const q = oc[v];
      y.push(b(v), ...(q ?? [`${co}${v}`]).map((w) => b(w)));
    }
    return y;
  }, [e, u, d, f]);
  kl(g, t);
}
const ru = {
  find: Io,
  selectAll: Zd
};
function li() {
  return ru;
}
const au = 600 * 1e3, di = /* @__PURE__ */ new Map(), ic = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map();
function sc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = ic.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function cc(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && ic.set(e.tagGroupId, e.tagGroupSortOrder), di.set(e.id, { tag: e, at: Date.now() });
}
function lc(e) {
  const t = di.get(e);
  if (!(!t || Date.now() - t.at > au))
    return sc(t.tag);
}
function dc(e) {
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
function Ro(e) {
  var t;
  for (const n of e) {
    const r = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && r && cc(dc({ ...n, name: r }));
  }
}
function ou(e) {
  const t = zn.get(e);
  if (t) return t;
  const n = new AbortController(), r = {
    controller: n,
    waiters: 0,
    promise: me(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var u, g;
        const i = ((u = o == null ? void 0 : o.name) == null ? void 0 : u.trim()) || null;
        if (zn.get(e) === r && zn.delete(e), !i) return null;
        const s = dc({ ...o, id: e, name: i }), c = (g = di.get(e)) == null ? void 0 : g.tag, d = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, f = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (d ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return cc(f), sc(f);
      },
      () => (zn.get(e) === r && zn.delete(e), null)
    )
  };
  return zn.set(e, r), r;
}
function zi() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function lo(e) {
  const t = {};
  for (const n of e) {
    const r = lc(n);
    r !== void 0 && (t[n] = r);
  }
  return t;
}
function iu(e, t) {
  if (t != null && t.aborted) return Promise.reject(zi());
  const n = {}, r = [];
  for (const o of new Set(e)) {
    const i = lc(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = ou(o);
      s.waiters += 1, r.push({ id: o, entry: s });
    }
  }
  return r.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: f, entry: u } of r)
        u.waiters -= 1, u.waiters === 0 && zn.get(f) === u && (zn.delete(f), u.controller.abort());
    }, d = () => {
      s || (s = !0, c(), i(zi()));
    };
    t == null || t.addEventListener("abort", d, { once: !0 }), Promise.all(
      r.map(
        ({ id: f, entry: u }) => u.promise.then((g) => [f, g])
      )
    ).then((f) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", d), c();
        for (const [u, g] of f) n[u] = g;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function uc(e) {
  const t = {};
  for (const [n, r] of Object.entries(e)) t[Number(n)] = (r == null ? void 0 : r.name) ?? null;
  return t;
}
function ga(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, r] = T(() => ({
    key: t,
    tags: lo(uo(t))
  }));
  return W(() => {
    const o = uo(t), i = lo(o);
    if (r({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return iu(o, s.signal).then(
      (c) => r({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : lo(uo(t));
}
function Ur(e) {
  const t = ga(e);
  return be(() => uc(t), [t]);
}
function uo(e) {
  return e ? e.split(",").map(Number) : [];
}
const su = "(max-width: 760px)";
function fc(e) {
  const [t] = T(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = kn(
    (r) => (t == null || t.addEventListener("change", r), () => t == null ? void 0 : t.removeEventListener("change", r)),
    [t]
  );
  return Uo(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function ba() {
  return fc(su);
}
function cu(e, t, n = !1) {
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
function qr(e, t, n = [], r) {
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
  const o = Xn(e), i = (s) => o.has(s) || [...o].some((c) => {
    var d;
    return (d = r == null ? void 0 : r.get(s)) == null ? void 0 : d.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => cu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function Qa(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function ui({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const d = ba(), [f, u] = T(""), [g, m] = T(0), b = $(null), y = $(null), v = $(null), q = $(null), w = $(null), I = $(/* @__PURE__ */ new Set()), F = at(), U = Ur(be(() => Qa(e), [e])), _ = jr(e), K = be(() => {
    const x = f.trim().toLocaleLowerCase(), G = (R) => R ? Hn.indexOf(R) : Hn.length;
    return e.map((R, E) => ({ action: R, index: E, key: _.keys[E] })).sort((R, E) => G(R.key) - G(E.key)).filter((R) => !x || R.action.label.toLocaleLowerCase().includes(x));
  }, [e, _, f]), Z = K.length ? Math.min(g, K.length - 1) : -1, ee = (x) => `${F}-option-${x}`;
  kt(() => {
    var x, G, R;
    return q.current = document.activeElement, w.current = ((G = (x = v.current) == null ? void 0 : x.parentElement) == null ? void 0 : G.closest('[role="dialog"]')) ?? null, (R = b.current) == null || R.focus({ preventScroll: !0 }), () => {
      var J;
      const E = q.current;
      E instanceof HTMLElement && E.isConnected && E.focus({ preventScroll: !0 }), document.activeElement !== E && ((J = w.current) != null && J.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), W(() => {
    var x, G, R;
    Z < 0 || (R = (G = (x = y.current) == null ? void 0 : x.querySelector(`[id="${ee(K[Z].index)}"]`)) == null ? void 0 : G.scrollIntoView) == null || R.call(G, { block: "nearest" });
  }, [Z, K]);
  function ie(x, G) {
    !x || r != null && r(x.action) || s(x.action, o && G);
  }
  function re(x) {
    var R;
    x.stopPropagation();
    const G = x.code || x.key;
    if (x.repeat || I.current.add(G), !pn(x)) {
      if (x.repeat && !I.current.has(G)) {
        x.preventDefault();
        return;
      }
      if (x.key === "Escape")
        x.preventDefault(), x.repeat || c();
      else if (x.key === "Enter")
        x.preventDefault(), x.repeat || ie(K[Z], x.shiftKey);
      else if (x.key === "ArrowDown" || x.key === "ArrowUp") {
        if (x.preventDefault(), !K.length) return;
        const E = x.key === "ArrowDown" ? 1 : -1;
        m((Z + E + K.length) % K.length);
      } else x.key === "Tab" && (x.preventDefault(), (R = b.current) == null || R.focus());
    }
  }
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: v,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${d ? " dq-find-mobile" : ""}`,
        onKeyDown: re,
        onMouseDown: (x) => {
          x.target !== b.current && x.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
            /* @__PURE__ */ a(
              "input",
              {
                ref: b,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${F}-list`,
                "aria-activedescendant": Z >= 0 ? ee(K[Z].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: f,
                onChange: (x) => {
                  u(x.target.value), m(0);
                }
              }
            ),
            !d && /* @__PURE__ */ a("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          K.length ? /* @__PURE__ */ a(
            "ul",
            {
              ref: y,
              id: `${F}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: K.map((x, G) => /* @__PURE__ */ a("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: ee(x.index),
                  tabIndex: -1,
                  "aria-selected": G === Z,
                  disabled: (r == null ? void 0 : r(x.action)) ?? !1,
                  onClick: (R) => ie(x, R.shiftKey || i && Ls(x.action)),
                  children: [
                    d ? null : x.key ? /* @__PURE__ */ l(he, { children: [
                      /* @__PURE__ */ a("kbd", { "aria-hidden": na(x.key) ? !0 : void 0, children: x.key }),
                      na(x.key) && /* @__PURE__ */ l(he, { children: [
                        /* @__PURE__ */ a("span", { className: "dq-sr-only", children: na(x.key) }),
                        " "
                      ] })
                    ] }) : /* @__PURE__ */ a("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ a("span", { className: "dq-find-label", children: x.action.label }),
                    /* @__PURE__ */ a("span", { className: "dq-find-effect", children: qr(x.action, U, t, n).map(
                      (R, E) => /* @__PURE__ */ a("span", { "data-effect-tone": R.tone, children: R.text }, E)
                    ) })
                  ]
                }
              ) }, x.action.id))
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
            o && /* @__PURE__ */ l("span", { children: [
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
function hc() {
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
function fi(e) {
  return Uo(e.subscribe, e.get, e.get);
}
function pc(e, t) {
  const n = $(t);
  kt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function mc(e, t) {
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
const lu = [], $o = Ja.map(
  (e, t) => ({ indent: t, keys: e })
), Ji = $o.length - 1;
function Nt({ binding: e, hidden: t }) {
  const n = t ? void 0 : na(e), r = /* @__PURE__ */ a(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || n ? !0 : void 0,
      children: e
    }
  );
  return n ? /* @__PURE__ */ l(he, { children: [
    r,
    /* @__PURE__ */ a("span", { className: "dq-sr-only", children: n })
  ] }) : r;
}
function Oa(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function gc(e) {
  return Ja.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function bc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const r = e.length ? e : [[]];
  return /* @__PURE__ */ a(he, { children: r.map((o, i) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === r.length - 1 && n
  ] }, i)) });
}
function yc({
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
          /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
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
function du({
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
        const i = t ? o.answers : null, s = i ? i.length ? "answered" : "open" : "unknown", c = i == null ? void 0 : i.map((u) => n[u].label).join(", "), d = r(o), f = s === "answered" ? `${o.name}: ${c}` : s === "open" ? `${o.name}: not answered yet` : o.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": d ? !0 : void 0,
            title: d ? `${f}. Needs attention: ${d}` : f,
            children: [
              /* @__PURE__ */ a("span", { className: "dq-group-name", children: o.name }),
              d && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  d
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ l(he, { children: [
                /* @__PURE__ */ a(ua, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ a("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ l(he, { children: [
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
function uu({ checked: e, onChange: t }) {
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
function fu({
  actions: e,
  isDisabled: t,
  busy: n,
  tags: r,
  trees: o,
  preview: i,
  onApply: s,
  onFind: c,
  findDisabled: d,
  paused: f = !1,
  waitForGroups: u = !1,
  attention: g = lu,
  stayOnTap: m = !1,
  onStayOnTapChange: b
}) {
  const y = li(), v = jr(e), q = ba();
  pc(i, q);
  const w = at(), I = Ur(
    be(() => e.flatMap((S) => S.steps.flatMap((ae) => ae.tagIds)), [e])
  ), F = $o.filter((S) => S.keys.some((ae) => v.actionOn.has(ae))), U = F.includes($o[Ji]), _ = e.length - v.actionOn.size, K = be(
    () => u && !f ? wr(e) : [],
    [u, f, e]
  ), Z = be(
    () => K.length && r ? Co(e, r) : null,
    [K, e, r]
  ), ee = new Map(
    Ao(Z ?? []).flatMap(
      (S) => S.actions.filter((ae) => nc(e[ae])).map((ae) => [ae, S.name])
    )
  ), ie = be(
    () => e.map((S) => f ? [] : Wd(S, g, o)),
    [e, g, o, f]
  ), re = (S) => S.map(Yd).join("; "), x = ie.map(re), G = K.length > 0 && /* @__PURE__ */ a(
    du,
    {
      groups: K,
      statuses: Z,
      actions: e,
      attentionOf: (S) => re([
        ...new Map(
          S.actions.flatMap((ae) => ie[ae]).map((ae) => [ae.key, ae])
        ).values()
      ])
    }
  ), R = (S) => {
    const ae = qr(e[S], I, [], o).map((se) => se.text).join(", "), C = ee.get(S), V = x[S];
    return [
      ae,
      C === void 0 ? "" : `${C}: not answered yet`,
      V ? `Needs attention: ${V}` : ""
    ].filter(Boolean).join(". ");
  }, E = (S) => x[S] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ a(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${x[S]}`,
        children: /* @__PURE__ */ a(xn, {})
      }
    )
  ) : null, J = (S) => ({
    onMouseEnter: () => i.set(S),
    onMouseLeave: () => i.clear(S),
    onFocus: () => i.set(S),
    onBlur: () => i.clear(S)
  }), H = (S) => {
    const ae = v.actionOn.get(S), C = ae === void 0 ? void 0 : e[ae];
    if (!C)
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
    const V = t(C), se = `${w}-effect-${S}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...f ? {} : J(C), children: [
      /* @__PURE__ */ a("span", { id: se, className: "dq-sr-only", children: R(ae) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: C.label,
          "aria-keyshortcuts": S,
          "aria-describedby": se,
          "data-group-open": ee.has(ae) || void 0,
          "data-attention": x[ae] ? !0 : void 0,
          disabled: V,
          onClick: (pe) => s(C, pe.shiftKey),
          children: [
            /* @__PURE__ */ a(Nt, { binding: S }),
            " ",
            /* @__PURE__ */ a("span", { className: "dq-pad-label", children: C.label }),
            Oa(C) && " ",
            Oa(C) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
              "absent"
            ] }),
            E(ae)
          ]
        }
      )
    ] }, S);
  }, Y = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ a(Dr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (q) {
    const S = gc(v), ae = (C) => {
      const V = e[C], se = v.keys[C];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: V.label,
          "aria-keyshortcuts": se,
          "aria-describedby": `${w}-effect-${se}`,
          "data-group-open": ee.has(C) || void 0,
          "data-attention": x[C] ? !0 : void 0,
          disabled: t(V),
          onClick: (pe) => {
            i.clear(V), s(V, pe.shiftKey || m && Ls(V));
          },
          ...f ? {} : mc(i, V),
          children: [
            /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: V.label }),
            Oa(V) && " ",
            Oa(V) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
              "absent"
            ] }),
            E(C)
          ]
        },
        se
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
            f ? Y : /* @__PURE__ */ a(
              Hi,
              {
                actions: e,
                keyMap: v,
                names: I,
                tags: r,
                trees: o,
                preview: i,
                findKey: y.find,
                mobile: !0
              }
            ),
            b && /* @__PURE__ */ a(uu, { checked: m, onChange: b })
          ] }),
          G,
          /* @__PURE__ */ a("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ a(
            bc,
            {
              groups: S,
              renderAction: ae,
              find: /* @__PURE__ */ a(
                yc,
                {
                  extra: _,
                  findKey: y.find,
                  disabled: d,
                  onFind: c
                }
              )
            }
          ) }),
          /* @__PURE__ */ a("div", { hidden: !0, children: S.flat().map((C) => /* @__PURE__ */ a("span", { id: `${w}-effect-${v.keys[C]}`, children: R(C) }, C)) })
        ]
      }
    );
  }
  const te = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ a("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ a("span", { children: "+ key or Shift-click applies and stays" })
  ] }), B = !U && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": _ ? `Find action, ${_} more` : "Find action",
      "aria-keyshortcuts": y.find,
      disabled: d,
      onClick: c,
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
        /* @__PURE__ */ l("div", { className: `dq-pad-header${G ? " dq-pad-header-groups" : ""}`, children: [
          f ? Y : /* @__PURE__ */ a(
            Hi,
            {
              actions: e,
              keyMap: v,
              names: I,
              tags: r,
              trees: o,
              preview: i,
              findKey: y.find
            }
          ),
          G ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              G,
              te,
              B
            ] })
          ) : /* @__PURE__ */ l(he, { children: [
            !f && te,
            B
          ] })
        ] }),
        F.map((S) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": S.indent, children: [
          S.keys.map(H),
          S.indent === Ji && /* @__PURE__ */ a("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": _ ? `Find action, ${_} more` : "Find action",
              "aria-keyshortcuts": y.find,
              disabled: d,
              onClick: c,
              children: [
                /* @__PURE__ */ a(Nt, { binding: y.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
                  _ ? `${_} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, S.indent))
      ]
    }
  );
}
function Hi({
  actions: e,
  keyMap: t,
  names: n,
  tags: r,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const d = fi(i), f = d ? e.indexOf(d) : -1;
  if (!d || f < 0) {
    const b = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && b < e.length && /* @__PURE__ */ l(he, { children: [
        ` · ${b} on keys, ${e.length - b} more under `,
        /* @__PURE__ */ a(Nt, { binding: s })
      ] })
    ] });
  }
  const u = t.keys[f], g = r && d.steps.length ? oi(d, r, o) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (b) => b.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    u && !c && /* @__PURE__ */ a(Nt, { binding: u }),
    /* @__PURE__ */ a("strong", { children: d.label }),
    qr(d, n, [], o).map((b, y) => /* @__PURE__ */ a("span", { "data-effect-tone": b.tone, children: b.text }, y)),
    m && /* @__PURE__ */ a("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function wc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: r,
  busy: o,
  onApply: i,
  onFind: s,
  summary: c,
  hints: d,
  keyHints: f,
  notices: u,
  status: g,
  className: m = "",
  paused: b = !1
}) {
  const y = li(), v = jr(e), q = ba(), w = at(), I = Ur(be(() => Qa(e), [e])), [F] = T(() => hc());
  pc(F, q);
  const U = $(null), _ = hu(U, e, !q), K = gc(v);
  !K.length && e.length && K.push([]);
  const Z = K.flat(), ee = e.length - Z.length, ie = (R) => qr(R, I, t, n).map((E) => E.text).join(", "), re = (R) => ({
    onMouseEnter: () => F.set(R),
    onMouseLeave: () => F.clear(R),
    onFocus: () => F.set(R),
    onBlur: (E) => {
      E.currentTarget.contains(E.relatedTarget) || F.clear(R);
    }
  }), x = d ?? (q ? void 0 : f), G = (R) => {
    const E = e[R];
    return /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: E.label,
        "aria-keyshortcuts": v.keys[R] || void 0,
        "aria-describedby": `${w}-effect-${R}`,
        disabled: b || r(E),
        onClick: () => {
          F.clear(E), i(E);
        },
        ...b ? {} : mc(F, E),
        children: /* @__PURE__ */ a("span", { className: "dq-mobile-label", children: E.label })
      },
      E.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: U,
      className: `dq-action-bar${q ? " dq-bar-mobile" : _ ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${b ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ a("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ a("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${q ? " dq-mobile-actions" : ""}`,
            "aria-busy": o || void 0,
            children: [
              q && e.length > 0 && /* @__PURE__ */ a(
                bc,
                {
                  groups: K,
                  renderAction: G,
                  find: /* @__PURE__ */ a(
                    yc,
                    {
                      extra: ee,
                      findKey: y.find,
                      disabled: b,
                      onFind: s
                    }
                  )
                }
              ),
              !q && K.map((R, E) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                R.map((J) => {
                  const H = e[J], Y = v.keys[J];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: H.label,
                      "aria-keyshortcuts": Y || void 0,
                      "aria-describedby": `${w}-effect-${J}`,
                      disabled: b || r(H),
                      onClick: () => i(H),
                      ...b ? {} : re(H),
                      children: [
                        Y && /* @__PURE__ */ a(Nt, { binding: Y }),
                        " ",
                        /* @__PURE__ */ a("span", { className: "dq-bar-label", children: H.label })
                      ]
                    },
                    H.id
                  );
                }),
                E === K.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": ee > 0 ? `Find action, ${ee} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: b,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ a(Nt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
                      /* @__PURE__ */ a("span", { className: "dq-bar-label", children: ee > 0 ? `${ee} more` : "Find action" })
                    ]
                  }
                )
              ] }, E)),
              !e.length && /* @__PURE__ */ a("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        x && /* @__PURE__ */ a("p", { className: "dq-bar-hints", children: x }),
        b ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ a(Dr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ a(
          pu,
          {
            actions: e,
            keyMap: v,
            preview: F,
            names: I,
            tagGroups: t,
            trees: n,
            showKey: !q
          }
        ),
        u && /* @__PURE__ */ a("div", { className: "dq-bar-notices", children: u }),
        /* @__PURE__ */ a("div", { hidden: !0, children: Z.map((R) => /* @__PURE__ */ a("span", { id: `${w}-effect-${R}`, children: ie(e[R]) }, e[R].id)) }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function hu(e, t, n) {
  const [r, o] = T(!1);
  return kt(() => {
    var u;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(i), m = parseFloat(g.columnGap) || 0, b = i.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (Z) => [...Z.children].map((ee) => ee.offsetWidth)
      ), v = i.querySelector(".dq-bar-line"), q = v && parseFloat(getComputedStyle(v).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), I = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + m : 0) + 1 + // the divider
      2 * m, F = (Z) => y.map((ee) => {
        let ie = 1, re = 0;
        for (const x of ee)
          re > 0 && re + q + x > Z ? (ie += 1, re = x) : re += (re > 0 ? q : 0) + x;
        return ie;
      }), U = (Z) => Math.max(1, Z.reduce((ee, ie) => ee + ie, 0)), _ = F(b), K = U(F(b - I));
      o(
        1 + U(_) < K || 1 + U(_) === K && _.every((Z) => Z === 1)
      );
    }, d = new ResizeObserver(c);
    d.observe(i);
    for (const g of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      d.observe(g);
    c();
    let f = !0;
    return (u = document.fonts) == null || u.ready.then(() => {
      f && c();
    }), () => {
      f = !1, d.disconnect();
    };
  }, [e, t, n]), r;
}
function pu({
  actions: e,
  keyMap: t,
  preview: n,
  names: r,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = fi(n), d = c ? e.indexOf(c) : -1;
  if (!c || d < 0) return null;
  const f = t.keys[d];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    f && s && /* @__PURE__ */ a(Nt, { binding: f }),
    /* @__PURE__ */ a("strong", { children: c.label }),
    qr(c, r, o, i).map((u, g) => /* @__PURE__ */ a("span", { "data-effect-tone": u.tone, children: u.text }, g))
  ] });
}
const Wi = 1e3;
async function mu(e, t, n) {
  const r = await me(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let d = 1; ; d++) {
    const f = await me(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Ln({
            findFilter: {
              page: d,
              perPage: Wi,
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
    for (const u of f.items) o.set(u.id, u);
    if (d * Wi >= f.totalCount) break;
    if (!f.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = Ke(e), c = $e(e) ? await bu(
    s,
    i.map((d) => d.id),
    n
  ) : i.map((d) => (s === "audio" ? d.audioCount : d.videoCount) ?? 0);
  return {
    parent: { id: t, name: r.name },
    children: i.map((d, f) => ({ id: d.id, name: d.name, uses: c[f] })).sort(
      (d, f) => f.uses - d.uses || d.name.localeCompare(f.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function gu(e) {
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
async function bu(e, t, n) {
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
              `/api/${Zn(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: gu(t[c])
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
function yu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((r) => t.has(r.id) ? !1 : (t.add(r.id), !0))
  }));
}
function wu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of n.children)
      t.set(r.id, [...t.get(r.id) ?? [], n.parent.id]);
  return t;
}
function vu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const r of Xn(n))
      t.set(r, [...t.get(r) ?? [], n]);
  return t;
}
function Nu(e, t, n) {
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
function qu(e, t) {
  var r;
  const n = vt(e);
  return ((r = wr(t).find((o) => o.key === n)) == null ? void 0 : r.name) ?? e.trim();
}
const Su = (e) => e instanceof Error ? e.message : "Request failed.";
function ku({
  id: e,
  review: t,
  disabled: n,
  onAdd: r,
  onCancel: o
}) {
  const [i, s] = T([]), [c, d] = T({}), [f, u] = T({}), [g, m] = T({}), b = $(/* @__PURE__ */ new Map());
  W(
    () => () => {
      for (const R of b.current.values()) R.abort();
    },
    []
  );
  const y = Cn(Ke(t)), v = $e(t), q = v ? "performer" : y.one;
  function w(R) {
    var J;
    (J = b.current.get(R)) == null || J.abort();
    const E = new AbortController();
    b.current.set(R, E), d((H) => ({ ...H, [R]: { status: "loading" } })), mu(t, R, E.signal).then(
      (H) => {
        E.signal.aborted || d((Y) => ({
          ...Y,
          [R]: { status: "ready", group: H }
        }));
      },
      (H) => {
        E.signal.aborted || d((Y) => ({
          ...Y,
          [R]: { status: "failed", message: Su(H) }
        }));
      }
    );
  }
  function I(R) {
    var te;
    const E = i.filter((B) => !R.includes(B));
    for (const B of E)
      (te = b.current.get(B)) == null || te.abort(), b.current.delete(B);
    const J = (B) => {
      const S = c[B];
      return (S == null ? void 0 : S.status) === "ready" ? S.group.children.map((ae) => ae.id) : [];
    }, H = new Set(R.flatMap(J)), Y = E.flatMap(J).filter((B) => !H.has(B));
    u(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([S]) => !Y.includes(Number(S)))
      )
    ), m(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([S]) => R.includes(Number(S)))
      )
    ), d(
      (B) => Object.fromEntries(
        Object.entries(B).filter(([S]) => R.includes(Number(S)))
      )
    ), s(R);
    for (const B of R) i.includes(B) || w(B);
  }
  const F = i.flatMap((R) => {
    const E = c[R];
    return (E == null ? void 0 : E.status) === "ready" ? [E.group] : [];
  }), U = F.length === i.length, _ = i.some(
    (R) => {
      var E;
      return (((E = c[R]) == null ? void 0 : E.status) ?? "loading") === "loading";
    }
  ), K = new Map(
    yu(F).map((R) => [R.parent.id, R])
  ), Z = wu(F), ee = new Map(F.map((R) => [R.parent.id, R.parent.name])), ie = vu(t.actions), re = (R) => f[R] ?? !ie.has(R), x = U ? [...K.values()].flatMap((R) => {
    const E = qu(R.parent.name, t.actions);
    return R.children.filter((J) => re(J.id)).map((J) => ({ child: J, answerGroup: E }));
  }) : [], G = (R, E) => u((J) => ({
    ...J,
    ...Object.fromEntries(R.children.map((H) => [H.id, E]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ a("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      v ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ a(
      Yn,
      {
        entityType: "tag",
        values: i,
        onChange: I,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((R) => {
      const E = c[R];
      if (!E || E.status === "loading")
        return /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Loading child tags…" }, R);
      if (E.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
            "Child tags could not be loaded. ",
            E.message
          ] }),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(R),
              children: "Retry"
            }
          )
        ] }, R);
      const J = K.get(R);
      if (!J) return null;
      const H = J.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ a("legend", { children: H }),
        E.group.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(he, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                type: "checkbox",
                checked: g[R] ?? !1,
                disabled: n,
                onChange: (Y) => m((te) => ({
                  ...te,
                  [R]: Y.target.checked
                }))
              }
            ),
            "Only one per ",
            q,
            ": each action removes every other tag in the ",
            H,
            " tree"
          ] }),
          J.children.length === 0 ? /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(he, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${H}`,
                  onClick: () => G(J, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${H}`,
                  onClick: () => G(J, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ a("div", { className: "dq-child-tags", children: J.children.map((Y) => {
              const te = ie.get(Y.id) ?? [], B = (Z.get(Y.id) ?? []).filter((S) => S !== R).map((S) => `“${ee.get(S)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ a(
                  "input",
                  {
                    type: "checkbox",
                    checked: re(Y.id),
                    disabled: n,
                    onChange: (S) => u((ae) => ({
                      ...ae,
                      [Y.id]: S.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  Y.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    Y.uses.toLocaleString(),
                    " ",
                    Y.uses === 1 ? y.one : y.many
                  ] }),
                  B.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    B.join(", ")
                  ] }),
                  te.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    te[0].label || "New action",
                    "”",
                    te.length > 1 ? ` and ${te.length - 1} more` : ""
                  ] })
                ] })
              ] }, Y.id);
            }) })
          ] })
        ] })
      ] }, R);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !x.length,
          onClick: () => r(
            x.map(
              ({ child: R, answerGroup: E }) => Nu(
                R,
                (Z.get(R.id) ?? []).filter(
                  (J) => g[J]
                ),
                E
              )
            )
          ),
          children: x.length ? `Add ${x.length} action${x.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-sr-only", children: _ ? "Loading child tags…" : "" })
    ] })
  ] });
}
function Eu(e, t, n, r) {
  const o = vt(n), i = [{ kind: "none", name: "", selected: !o }];
  if (r === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: vt(c) === o });
    return i;
  }
  const s = vt(r);
  for (const c of t)
    vt(c).includes(s) && i.push({ kind: "group", name: c, selected: vt(c) === o });
  return s && !t.some((c) => vt(c) === s) && i.push({ kind: "new", name: r.trim(), selected: s === o }), i;
}
function Cu(e) {
  return e.kind === "group" ? `group:${vt(e.name)}` : e.kind;
}
function Au(e) {
  const { group: t, ...n } = e;
  return n;
}
const Tu = /* @__PURE__ */ new Set([
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
]), Iu = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Ma = 4, Qi = 240;
function Ru(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const r = getComputedStyle(n);
    (r.overflowX !== "visible" || r.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function $u(e, t, n, r) {
  for (const i of r) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Ou({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), d = $(null), f = $(null), u = $(null), g = $(null), m = $(null), b = $([]), y = $(!1), v = $(!1), [q, w] = T(!1), [I, F] = T(null), [U, _] = T(null), [K, Z] = T(!1), ee = e.group ?? "", ie = be(
    () => Eu(t, n, ee, I),
    [t, n, ee, I]
  ), re = ie.map(Cu), x = U === null ? -1 : re.indexOf(U), G = (C) => `${s}-option-${C}`, R = (C) => o(C ? { ...e, group: C } : Au(e)), E = () => {
    var V;
    const C = ((V = u.current) == null ? void 0 : V.value) ?? ee;
    C.trim() !== C && R(C.trim());
  };
  function J(C) {
    F(null), _(C), w(!0);
  }
  const H = (C) => {
    var V, se;
    return C instanceof Node && (((V = d.current) == null ? void 0 : V.contains(C)) || ((se = g.current) == null ? void 0 : se.contains(C))) === !0;
  };
  function Y() {
    var C, V;
    (C = g.current) != null && C.contains(document.activeElement) && ((V = m.current) == null || V.focus({ preventScroll: !0 })), w(!1), F(null), _(null), Z(!1);
  }
  function te(C) {
    C.kind === "group" && C.selected && I === null || R(C.kind === "none" ? "" : C.name), Y();
  }
  function B() {
    const C = f.current, V = g.current;
    if (!C || !V) return;
    const se = C.getBoundingClientRect(), pe = window.visualViewport, D = (pe == null ? void 0 : pe.offsetTop) ?? 0, Te = (pe ? pe.offsetTop + pe.height : window.innerHeight) - se.bottom - Ma, ue = se.top - D - Ma, Oe = Math.min(V.scrollHeight, Qi), Ge = Te < Oe && ue > Te;
    V.style.left = `${se.left}px`, V.style.width = `${se.width}px`, V.style.top = `${Ge ? se.top - Ma : se.bottom + Ma}px`, V.style.transform = Ge ? "translateY(-100%)" : "", V.style.maxHeight = `${Math.max(0, Math.min(Qi, Ge ? ue : Te))}px`, $u(C, V, se, b.current) || Y();
  }
  kt(() => {
    var C;
    q && (f.current && (b.current = Ru(f.current)), v.current && ((C = g.current) == null || C.focus({ preventScroll: !0 }), Z(!0)), v.current = !1);
  }, [q]), kt(() => {
    q && B();
  }), W(() => {
    if (!q) return;
    const C = () => B(), V = (D) => {
      H(D.target) || Y();
    }, se = [...b.current, window], pe = window.visualViewport;
    for (const D of se) D.addEventListener("scroll", C);
    return window.addEventListener("resize", C), pe == null || pe.addEventListener("resize", C), pe == null || pe.addEventListener("scroll", C), document.addEventListener("pointerdown", V), () => {
      for (const D of se) D.removeEventListener("scroll", C);
      window.removeEventListener("resize", C), pe == null || pe.removeEventListener("resize", C), pe == null || pe.removeEventListener("scroll", C), document.removeEventListener("pointerdown", V);
    };
  }, [q]), W(() => {
    var C, V, se;
    x >= 0 && ((se = (V = (C = g.current) == null ? void 0 : C.children[x]) == null ? void 0 : V.scrollIntoView) == null || se.call(V, { block: "nearest" }));
  }, [x]);
  function S(C) {
    if (pn(C)) return;
    const V = C.key === "ArrowDown" || C.key === "ArrowUp";
    if (V && !q) {
      if (C.altKey && C.key === "ArrowUp") return;
      C.preventDefault(), J(C.altKey ? null : vt(ee) ? `group:${vt(ee)}` : "none");
      return;
    }
    if (q)
      if (V) {
        if (C.preventDefault(), C.altKey) {
          C.key === "ArrowUp" && Y();
          return;
        }
        const se = C.key === "ArrowDown" ? 1 : -1, pe = I !== null && vt(I) && re.length > 1 ? 1 : 0, D = x < 0 ? se > 0 ? pe : re.length - 1 : (x + se + re.length) % re.length;
        _(re[D]);
      } else C.key === "Enter" && (C.preventDefault(), x >= 0 ? te(ie[x]) : (E(), Y()));
  }
  function ae(C) {
    var se;
    if (C.key === "Tab") {
      Y(), C.shiftKey && ((se = u.current) == null || se.focus());
      return;
    }
    if (C.key === "Dead" || C.key === "Process" || pn(C) && !Iu.has(C.key) || C.key === "Backspace" || C.key === "Delete" || [...C.key].length === 1 && !C.metaKey && (!C.ctrlKey || C.altKey)) {
      const pe = u.current;
      pe && (pe.focus(), pe.setSelectionRange(pe.value.length, pe.value.length));
      return;
    }
    !Tu.has(C.key) && !pn(C) && Z(!1), S(C);
  }
  return /* @__PURE__ */ l(
    "div",
    {
      onKeyDown: (C) => {
        !q || C.key !== "Escape" || pn(C) || (C.preventDefault(), C.stopPropagation(), Y());
      },
      children: [
        /* @__PURE__ */ l("div", { ref: d, className: "dq-action-field", children: [
          /* @__PURE__ */ a(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: i,
              onMouseDown: (C) => {
                q && C.preventDefault();
              },
              children: "Group"
            }
          ),
          /* @__PURE__ */ l("div", { ref: f, className: "dq-combobox", children: [
            /* @__PURE__ */ a(
              "input",
              {
                ref: u,
                id: i,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": q,
                "aria-controls": q ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": q && x >= 0 ? G(x) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: ee,
                onChange: (C) => {
                  R(C.target.value), F(C.target.value), _(null), w(!0);
                },
                onClick: () => {
                  q || J(null);
                },
                onKeyDown: S,
                onBlur: () => {
                  Y(), E();
                }
              }
            ),
            /* @__PURE__ */ a(
              "button",
              {
                ref: m,
                type: "button",
                className: "dq-combobox-toggle",
                tabIndex: -1,
                "aria-label": "Show groups",
                "aria-expanded": q,
                "aria-controls": q ? s : void 0,
                onPointerDown: (C) => {
                  y.current = C.pointerType === "touch";
                },
                onMouseDown: (C) => C.preventDefault(),
                onClick: () => {
                  var se;
                  const C = y.current;
                  y.current = !1;
                  const V = document.activeElement === u.current;
                  q ? Y() : (v.current = C && !V, J(null)), (!C || V) && ((se = u.current) == null || se.focus());
                },
                children: /* @__PURE__ */ a(Vo, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: r ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        q && Xl(
          /* @__PURE__ */ a(
            "ul",
            {
              ref: g,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": x >= 0 ? G(x) : void 0,
              "data-tap-focus": K || void 0,
              onMouseDown: (C) => C.preventDefault(),
              onKeyDown: ae,
              onBlur: (C) => {
                H(C.relatedTarget) || Y();
              },
              children: ie.map((C, V) => /* @__PURE__ */ l(
                "li",
                {
                  id: G(V),
                  role: "option",
                  "aria-selected": C.selected,
                  className: "dq-combobox-option",
                  "data-kind": C.kind,
                  "data-active": V === x || void 0,
                  onMouseMove: () => {
                    V !== x && _(re[V]);
                  },
                  onClick: () => te(C),
                  children: [
                    C.kind === "new" && /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
                    /* @__PURE__ */ a("span", { className: "dq-combobox-option-name", children: C.kind === "none" ? "No group" : C.kind === "new" ? `New group “${C.name}”` : C.name }),
                    C.selected && /* @__PURE__ */ a(ua, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                re[V]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Vn = [
  ...Ja,
  ["auto", Wn]
];
function vc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Xo(e[n]);
}
function Mu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o
}) {
  const [i, s] = T(!1), c = $(null), d = n.keys[t], f = vc(e, n, t), u = gr(f), g = n.duplicatePins.has(t) ? ` (${sa(e[t].shortcut ?? "")} is pinned twice)` : "", m = d ? `${sa(d)}, ${u ? "pinned" : "Auto"}${g}` : f === Wn ? "no key, Find action only" : `no key: Auto found no free key${g}`, b = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${r}: ${m}`,
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        title: "Choose the key",
        onClick: () => s(!i),
        children: [
          d ? /* @__PURE__ */ a(Nt, { binding: d }) : /* @__PURE__ */ a("span", { className: "dq-key dq-key-none", children: "·" }),
          u && /* @__PURE__ */ a(Es, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ a(
      Fu,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: r,
        onChoose: (y) => {
          o(y), b();
        },
        onClose: b
      }
    )
  ] });
}
function Fu({
  actions: e,
  index: t,
  keyMap: n,
  name: r,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], d = vc(e, n, t), [f, u] = T(c || "q"), g = (v) => {
    var q;
    return ((q = s.current) == null ? void 0 : q.querySelector(`[data-choice="${v}"]`)) ?? null;
  };
  kt(() => {
    var v, q, w;
    (v = g(c || d)) == null || v.focus(), (w = (q = s.current) == null ? void 0 : q.scrollIntoView) == null || w.call(q, { block: "nearest" });
  }, []);
  function m(v) {
    var q;
    gr(v) && u(v), (q = g(v)) == null || q.focus();
  }
  function b(v) {
    var K, Z, ee;
    if (v.key === "Escape") {
      v.preventDefault(), v.stopPropagation(), i();
      return;
    }
    if (v.key === "Tab") {
      const ie = [...((K = s.current) == null ? void 0 : K.querySelectorAll("button[tabindex='0']")) ?? []], re = ie.indexOf(document.activeElement);
      v.preventDefault(), (Z = ie[(re + (v.shiftKey ? -1 : 1) + ie.length) % ie.length]) == null || Z.focus();
      return;
    }
    const q = (ee = v.target.dataset) == null ? void 0 : ee.choice, w = q ? Vn.findIndex((ie) => ie.includes(q)) : -1;
    if (!q || w < 0) return;
    const I = Vn[w].indexOf(q), F = (ie) => ie == null ? void 0 : ie[Math.min(I, ie.length - 1)], U = {
      ArrowLeft: Vn[w][I - 1],
      ArrowRight: Vn[w][I + 1],
      ArrowUp: F(Vn[w - 1]),
      ArrowDown: F(Vn[w + 1]),
      Home: Vn[w][0],
      End: Vn[w].at(-1)
    };
    if (!Object.hasOwn(U, v.key)) return;
    v.preventDefault();
    const _ = U[v.key];
    _ && m(_);
  }
  const y = (v) => {
    const q = gr(v) ? n.actionOn.get(v) : void 0;
    return q === void 0 ? null : {
      own: q === t,
      label: e[q].label.trim() || "New action",
      pinned: Xo(e[q]) === v
    };
  };
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (v) => {
          v.preventDefault(), i();
        }
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${r}`,
        className: "dq-key-picker",
        onKeyDown: b,
        onMouseDown: (v) => v.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ a("strong", { children: r })
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: Ja.map((v, q) => /* @__PURE__ */ a("div", { className: "dq-key-picker-row", "data-indent": q, children: v.map((w) => {
            const I = y(w), F = I ? `${I.own ? "this action" : I.label}, ${I.pinned ? "pinned" : "Auto"}` : "free";
            return /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: `dq-key-choice${I ? "" : " dq-key-choice-free"}${I != null && I.own ? " dq-key-choice-own" : ""}`,
                "data-choice": w,
                tabIndex: w === f ? 0 : -1,
                "aria-label": `${sa(w)}: ${F}`,
                "aria-pressed": !!(I != null && I.own && I.pinned),
                title: I ? `${I.label} (${I.pinned ? "pinned" : "Auto"})` : void 0,
                onFocus: () => u(w),
                onClick: () => o(w),
                children: [
                  /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                    /* @__PURE__ */ a(Nt, { binding: w }),
                    (I == null ? void 0 : I.pinned) && /* @__PURE__ */ a(Es, { "aria-hidden": "true" })
                  ] }),
                  I && /* @__PURE__ */ a("span", { className: "dq-key-choice-label", children: I.label })
                ]
              },
              w
            );
          }) }, q)) }),
          /* @__PURE__ */ l("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": "auto",
                tabIndex: 0,
                "aria-pressed": d === "auto",
                onClick: () => o("auto"),
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
                "data-choice": Wn,
                tabIndex: 0,
                "aria-pressed": d === Wn,
                onClick: () => o(Wn),
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
const xu = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Pu(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Lu(e, t) {
  if (Pn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Zo(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function Nc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Du(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function _u({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: r,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const d = Ue(e), f = d !== "tag", u = e.actions, g = jr(u), m = Ur(be(() => Qa(u), [u])), b = be(
    () => f ? wr(u).map((D) => D.name) : [],
    [f, u]
  ), y = u.findIndex((D) => D.id === i), v = be(
    () => f && y >= 0 ? wr(
      u.filter((D, ye) => ye !== y)
    ).map((D) => D.name) : [],
    [f, u, y]
  ), q = f && e.stayUntilGroupsAnswered === !0, w = be(
    () => new Set(
      q ? Kd(u).map((D) => D.key) : []
    ),
    [q, u]
  ), [I, F] = T(""), [U, _] = T(!1), [K, Z] = T(
    null
  ), ee = at(), ie = `${ee}-from-tags`, re = $(null), x = $(null), G = $(null), R = $(null), E = $(/* @__PURE__ */ new WeakMap()), J = (D) => {
    let ye = E.current.get(D);
    return ye || (ye = crypto.randomUUID(), E.current.set(D, ye)), ye;
  }, H = I.trim().toLocaleLowerCase(), Y = H ? u.filter((D) => D.label.toLocaleLowerCase().includes(H)) : u, te = (D) => t({ ...e, actions: D }), B = (D, ye) => te(u.map((Te, ue) => ue === D ? ye : Te));
  function S(D) {
    var ye;
    return [...((ye = G.current) == null ? void 0 : ye.querySelectorAll("[data-action-id]")) ?? []].find(
      (Te) => Te.dataset.actionId === D
    );
  }
  function ae(D, ye) {
    const Te = S(D), ue = Te == null ? void 0 : Te.querySelector(
      ye === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return ue == null || ue.focus(), !!ue;
  }
  kt(() => {
    var ye;
    const D = R.current;
    D && (R.current = null, (D === "add" || !ae(D.id, D.part)) && ((ye = x.current) == null || ye.focus()));
  }), W(() => {
    !c || !i || (Y.some((D) => D.id === i) ? ae(i, "label") : (F(""), R.current = { id: i, part: "label" }));
  }, [c]);
  function C() {
    const D = Du(d);
    F(""), te([...u, D]), s(D.id), R.current = { id: D.id, part: "label" };
  }
  function V(D) {
    const ye = u[D], { shortcut: Te, ...ue } = structuredClone(ye), Oe = {
      ...ue,
      ...Te === Wn ? { shortcut: Te } : {},
      id: crypto.randomUUID(),
      label: `${ye.label} copy`
    };
    te([...u.slice(0, D + 1), Oe, ...u.slice(D + 1)]), s(Oe.id), R.current = { id: Oe.id, part: "label" };
  }
  function se(D) {
    const ye = u[D], Te = Y.indexOf(ye), ue = Y[Te + 1] ?? Y[Te - 1];
    te(u.filter((Oe, Ge) => Ge !== D)), i === ye.id && s(null), R.current = ue ? { id: ue.id, part: "toggle" } : "add";
  }
  function pe() {
    _(!1), requestAnimationFrame(() => {
      var D;
      return (D = re.current) == null ? void 0 : D.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: x,
            type: "button",
            className: "dq-header-button",
            onClick: C,
            children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        f && /* @__PURE__ */ a(
          "button",
          {
            ref: re,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": U,
            "aria-controls": U ? ie : void 0,
            onClick: () => {
              Z(null), _(!U);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ a(da, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: I,
              onChange: (D) => F(D.target.value),
              onKeyDown: (D) => {
                D.key === "Escape" && I && !pn(D) && (D.preventDefault(), D.stopPropagation(), F(""));
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
              checked: q,
              "aria-describedby": `${ee}-groups-note`,
              onChange: (D) => t({
                ...e,
                stayUntilGroupsAnswered: D.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ a("p", { className: "dq-actions-hint", id: `${ee}-groups-note`, children: q && !b.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ a("span", { role: "status", className: "dq-actions-status", children: (K == null ? void 0 : K.actions) === u ? `Added ${K.count} action${K.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    f && U && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ a(
      "div",
      {
        onKeyDown: (D) => {
          D.key !== "Escape" || D.defaultPrevented || pn(D) || (D.preventDefault(), D.stopPropagation(), pe());
        },
        children: /* @__PURE__ */ a(
          ku,
          {
            id: ie,
            review: e,
            disabled: o,
            onAdd: (D) => {
              const ye = [...u, ...D];
              te(ye), Z({ actions: ye, count: D.length }), pe();
            },
            onCancel: pe
          }
        )
      }
    ),
    /* @__PURE__ */ a("div", { ref: G, children: Y.length > 0 && /* @__PURE__ */ a(
      vs,
      {
        items: Y,
        getKey: (D) => D.id,
        disabled: o || !!H,
        className: "dq-action-list",
        onReorder: (D) => te(D),
        renderItem: (D, { dragHandleProps: ye, isOver: Te }) => {
          const ue = u.indexOf(D), Oe = i === D.id;
          return /* @__PURE__ */ a(
            ju,
            {
              action: D,
              entityType: d,
              keyButton: /* @__PURE__ */ a(
                Mu,
                {
                  actions: u,
                  index: ue,
                  keyMap: g,
                  name: D.label.trim() || "New action",
                  onChoose: (Ge) => te(td(u, ue, Ge))
                }
              ),
              takenPin: g.duplicatePins.has(ue) ? D.shortcut : void 0,
              groupUnanswerable: "steps" in D && w.has(vt(D.group)),
              effect: qr(D, m, n, r),
              open: Oe,
              detailId: `${ee}-detail-${D.id}`,
              dragHandleProps: ye,
              isOver: Te,
              reorderDisabled: o || !!H,
              onToggle: () => s(Oe ? null : D.id),
              onDuplicate: () => V(ue),
              onDelete: () => se(ue),
              children: "steps" in D ? /* @__PURE__ */ a(
                Uu,
                {
                  action: D,
                  groupNames: b,
                  otherGroupNames: v,
                  occurrence: $e(e),
                  saving: o,
                  stepKey: J,
                  rememberStepKey: (Ge, Ce) => E.current.set(Ge, J(Ce)),
                  onChange: (Ge) => B(ue, Ge)
                }
              ) : /* @__PURE__ */ a(
                Gu,
                {
                  action: D,
                  tagGroups: n,
                  onChange: (Ge) => B(ue, Ge)
                }
              )
            }
          );
        }
      }
    ) }),
    u.length ? !Y.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      I.trim(),
      "”."
    ] }) : /* @__PURE__ */ a("p", { className: "dq-actions-empty", children: f ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function ju({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: r,
  groupUnanswerable: o = !1,
  effect: i,
  open: s,
  detailId: c,
  dragHandleProps: d,
  isOver: f,
  reorderDisabled: u,
  onToggle: g,
  onDuplicate: m,
  onDelete: b,
  children: y
}) {
  const v = e.label.trim() || "New action", q = Lu(e, t), w = "steps" in e && vt(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${f ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              ...d,
              style: Nc(d.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${v}`,
              title: u ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: u,
              children: /* @__PURE__ */ a(Cs, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ a("span", { className: "dq-action-row-label", title: v, children: v }),
            w && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ a("span", { className: "dq-action-row-effect", children: i.map((I, F) => /* @__PURE__ */ a("span", { "data-effect-tone": I.tone, children: I.text }, F)) }),
            q && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
              q
            ] }),
            r && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${sa(r)} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                  `${sa(r)} is pinned twice`
                ]
              }
            ),
            o && /* @__PURE__ */ l(
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
              "aria-label": `Duplicate ${v}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ a(As, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${v}`,
              title: "Delete",
              onClick: b,
              children: /* @__PURE__ */ a(zo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ a(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${v}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ a(Vo, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ a("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function qc({
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
function Uu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: r,
  saving: o,
  stepKey: i,
  rememberStepKey: s,
  onChange: c
}) {
  const d = at(), f = $(null), u = $(null);
  kt(() => {
    var b, y;
    const m = u.current;
    m != null && (u.current = null, (y = (b = f.current) == null ? void 0 : b.querySelector(`[data-step-index="${m}"] input`)) == null || y.focus());
  });
  const g = (m) => c({ ...e, steps: m });
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a(qc, { action: e, onChange: (m) => c({ ...e, label: m }) }),
    /* @__PURE__ */ a(
      Ou,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: r,
        onChange: c
      }
    ),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": d, children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", id: d, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: f, children: [
        e.steps.length > 0 ? /* @__PURE__ */ a(
          vs,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: g,
            renderItem: (m, { index: b, dragHandleProps: y, isOver: v }) => /* @__PURE__ */ a(
              Ku,
              {
                step: m,
                index: b,
                dragHandleProps: y,
                isOver: v,
                saving: o,
                onChange: (q) => {
                  s(q, m), g(e.steps.map((w, I) => I === b ? q : w));
                },
                onRemove: () => g(e.steps.filter((q, w) => w !== b))
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
              u.current = e.steps.length, g([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Ku({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: r,
  saving: o,
  onChange: i,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${r ? " dq-drag-over" : ""}`,
      "data-step-tone": Pu(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: Nc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ a(Cs, { "aria-hidden": "true" }),
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
            onChange: (d) => i({ ...e, mode: d.target.value }),
            children: xu.map(({ mode: d, label: f }) => /* @__PURE__ */ a("option", { value: d, children: f }, d))
          }
        ),
        /* @__PURE__ */ a(
          Yn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (d) => i({ ...e, tagIds: d }),
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
            children: /* @__PURE__ */ a(fa, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function Gu({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const r = e.effect, o = r.mode === "SET_TAG_GROUP" ? `group:${r.tagGroupId}` : r.mode, i = r.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === r.tagGroupId);
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a(qc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ a("span", { className: "dq-action-field-name", children: "Effect" }),
      /* @__PURE__ */ l(
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
const Sc = ql(!1);
function Bu({ children: e }) {
  return /* @__PURE__ */ a(Sc.Provider, { value: !0, children: e });
}
function Bt({ tag: e, name: t }) {
  const n = Sl(Sc), r = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ a(El, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: r ?? void 0 });
}
function Vu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, r = Cn(Ke(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      r,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ a(
      Yn,
      {
        entityType: "tag",
        values: n.tagIds,
        onChange: (i) => o({ tagIds: i }),
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
          onChange: (i) => o({ multiple: i.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      r
    ] }),
    /* @__PURE__ */ a("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function zu({
  review: e,
  onChange: t
}) {
  const n = Cn(Ke(e)).many, r = e.occurrence, o = Fs(r), i = ["any", "isNull"].includes(r.condition) ? [] : r.conditionTagIds, s = ga([
    ...o.flatMap((u) => [u.tagId, ...u.categoryTagId ? [u.categoryTagId] : []]),
    ...i
  ]), c = (u) => {
    var g;
    return ((g = s[u]) == null ? void 0 : g.name) ?? (s[u] === null ? `Unavailable tag ${u}` : `Tag ${u}`);
  }, d = (u) => t({ ...e, occurrence: Zl(r, u) }), f = (u, g) => d(
    o.map(
      (m, b) => b !== u ? m : g === void 0 ? { tagId: m.tagId } : { tagId: m.tagId, categoryTagId: g }
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
    o.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: o.map((u, g) => {
      const m = c(u.tagId), b = o.filter(
        (q, w) => w !== g && q.tagId === u.tagId
      ), y = (q) => b.some((w) => w.categoryTagId === q), v = `${u.tagId}#${o.slice(0, g).filter((q) => q.tagId === u.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
          /* @__PURE__ */ a(Bt, { tag: s[u.tagId], name: m })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ a("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ a(
            Oi,
            {
              entityType: "tag",
              value: u.categoryTagId,
              onChange: (q) => f(g, q),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${m}`,
              excludeIds: b.flatMap(
                (q) => q.categoryTagId === void 0 ? [] : [q.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ a(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${m}`,
            title: "Remove flag",
            onClick: () => d(o.filter((q, w) => w !== g)),
            children: /* @__PURE__ */ a(zo, { "aria-hidden": "true" })
          }
        ),
        i.length > 0 && /* @__PURE__ */ l(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${m}`,
            children: [
              /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": u.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => f(g, void 0),
                  children: "Whole review"
                }
              ),
              i.map((q) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": u.categoryTagId === q,
                  disabled: y(q),
                  onClick: () => f(g, q),
                  children: c(q)
                },
                q
              ))
            ]
          }
        )
      ] }, v);
    }) }),
    /* @__PURE__ */ a(
      Oi,
      {
        entityType: "tag",
        value: void 0,
        onChange: (u) => {
          u !== void 0 && d([...o, { tagId: u }]);
        },
        placeholder: "Search performer flag tags...",
        allowCreate: !1,
        inputClassName: "dq-input",
        inputAriaLabel: "Add a performer flag",
        excludeIds: o.flatMap((u) => u.categoryTagId === void 0 ? [u.tagId] : [])
      }
    )
  ] });
}
const kc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Ec = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Ju = {
  video: za,
  audio: Rs,
  tag: Is,
  performerOccurrence: Ts,
  audioPerformerOccurrence: Ll
};
function Cc({ entityType: e }) {
  const t = Ju[e];
  return /* @__PURE__ */ a(t, { role: "img", "aria-label": kc[e] });
}
const Hu = 2e6;
function Ac(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), r = document.createElement("a");
  r.href = n, r.download = t, r.click(), URL.revokeObjectURL(n);
}
function Wu(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function hi(e) {
  Ac([e], Wu(e));
}
async function Qu(e) {
  if (e.size > Hu) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return pa(t);
  } catch (n) {
    throw new Error(
      n instanceof SyntaxError ? "It is not a JSON file." : "It does not hold valid Data Quality reviews."
    );
  }
}
function Lr(e) {
  const { page: t, ...n } = e.view.filter;
  return JSON.stringify(
    { ...e, view: { ...e.view, filter: n } },
    (r, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function Tc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: r,
  nameRef: o,
  autoFocus: i = !1
}) {
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ a("span", { children: "Entity type" }),
      /* @__PURE__ */ a(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Ue(e),
          disabled: n,
          onChange: (s) => r == null ? void 0 : r(s.target.value),
          children: xs.map((s) => /* @__PURE__ */ a("option", { value: s, children: Ec[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
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
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
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
function Yu(e, t) {
  const n = Ue(e), r = ["Review"];
  return (n === "video" || n === "tag") && r.push("Appearance"), r.push("Actions"), t && r.push("Tag choices"), r;
}
function Xu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), r = $(null), o = at(), i = at();
  return W(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = r.current) == null || s.focus();
  }, []), /* @__PURE__ */ l(
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
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ a("button", { ref: r, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ a("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Ic({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: r,
  tagGroups: o,
  trees: i,
  saving: s,
  saveDisabled: c = !1,
  error: d,
  dirty: f,
  criteriaChanged: u = !1,
  notices: g,
  onSave: m,
  onCancel: b,
  drawerRef: y
}) {
  const [v, q] = T("Review"), [w] = T(
    () => $e(e) && e.occurrence.tagIds.length > 0
  ), [I, F] = T(""), [U, _] = T(null), [K, Z] = T(0), [ee, ie] = T(!1), re = $(null), x = $(null), G = $(null), R = Yu(e, w), E = Ue(e), J = be(() => Lr(e), [e]);
  W(() => F(""), [J]), W(() => {
    var ae, C;
    if (ee) return;
    const B = re.current;
    if (re.current = null, !B) return;
    (C = B.isConnected && !!((ae = G.current) != null && ae.contains(B)) && !(B instanceof HTMLButtonElement && B.disabled) ? B : G.current) == null || C.focus({ preventScroll: !0 });
  }, [ee]);
  function H() {
    if (!(s || ee)) {
      if (!f) {
        b();
        return;
      }
      re.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, ie(!0);
    }
  }
  function Y() {
    const B = { ...e, name: e.name.trim() }, S = ca(B);
    if (!S) {
      F(""), m();
      return;
    }
    if (F(S), !B.name) {
      q("Review"), requestAnimationFrame(() => {
        var C;
        return (C = x.current) == null ? void 0 : C.focus();
      });
      return;
    }
    const ae = e.actions.find(
      (C) => !Pn(C, E)
    );
    ae && (q("Actions"), _(ae.id), Z((C) => C + 1));
  }
  const te = I || d;
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (B) => {
          G.current = B, y && (y.current = B);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (B) => {
          B.key !== "Escape" || B.defaultPrevented || s || pn(B) || (B.preventDefault(), B.stopPropagation(), H());
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
                disabled: s,
                onClick: H,
                children: /* @__PURE__ */ a(fa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ a(
            Cl,
            {
              tabs: R.map((B) => ({
                key: B,
                label: B,
                count: B === "Actions" ? e.actions.length : void 0
              })),
              activeTab: v,
              onTabChange: (B) => q(B)
            }
          ) }),
          /* @__PURE__ */ a("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: v !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ a(
                    Tc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: x,
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
                        onChange: (B) => r(B.target.value),
                        children: [
                          /* @__PURE__ */ a("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ a("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ a("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  $e(e) && /* @__PURE__ */ a(zu, { review: e, onChange: t }),
                  /* @__PURE__ */ a("div", { children: /* @__PURE__ */ a(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => hi(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            R.includes("Appearance") && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: v !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ a(Zu, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: v !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ a(
                  _u,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: U,
                    onExpand: _,
                    reveal: K
                  }
                )
              }
            ),
            w && $e(e) && /* @__PURE__ */ a(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: v !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ a(Vu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (te || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            te && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
              te
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ a("p", { className: "dq-drawer-dirty", children: f ? u ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: s, onClick: H, children: "Cancel" }),
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
    ee && /* @__PURE__ */ a(
      Xu,
      {
        onKeepEditing: () => ie(!1),
        onDiscard: () => {
          re.current = null, ie(!1), b();
        }
      }
    )
  ] });
}
function Zu({
  review: e,
  onChange: t
}) {
  const n = at(), r = e.view, o = (u) => t({ ...e, view: { ...r, ...u } }), i = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ a(
      "input",
      {
        type: "checkbox",
        checked: r.selectAllOnLoad ?? !1,
        onChange: (u) => o({ selectAllOnLoad: u.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Ue(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ a(
        Yi,
        {
          label: "View",
          value: r.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (u) => o({ displayMode: u })
        }
      ),
      i,
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (u) => t({ ...e, presentation: { ...s, ...u } }), d = s.annotations ?? [], f = r.reviewMode ?? "single";
  return /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ a(
          Xi,
          {
            name: `${n}-layout-choice`,
            checked: f === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ a(ef, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ a(
          Xi,
          {
            name: `${n}-layout-choice`,
            checked: f === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ a(tf, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ a(
        Yi,
        {
          label: "Cards",
          value: r.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (u) => o({ displayMode: u })
        }
      ),
      i,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ a("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([u, g]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ a(
            "input",
            {
              type: "checkbox",
              checked: d.includes(u),
              onChange: (m) => c({
                annotations: m.target.checked ? [...d, u] : d.filter((b) => b !== u)
              })
            }
          ),
          g
        ] }, u)) })
      ] }),
      d.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ a("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ a(
            Yn,
            {
              entityType: "tag",
              values: s.annotationParents ?? [],
              onChange: (u) => c({ annotationParents: u }),
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
        Yn,
        {
          entityType: "tag",
          values: s.binParents ?? [],
          onChange: (u) => c({ binParents: u }),
          placeholder: "Add a parent tag…",
          inputAriaLabel: "Add a parent tag for queue bins",
          containerClassName: "dq-chip-input",
          inputClassName: "dq-chip-input-field",
          allowCreate: !1
        }
      ),
      /* @__PURE__ */ a("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] })
  ] });
}
function Yi({
  label: e,
  value: t,
  options: n,
  onChange: r
}) {
  const o = at();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
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
function Xi({
  name: e,
  checked: t,
  title: n,
  text: r,
  picture: o,
  onChoose: i
}) {
  const s = at(), c = at();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    o,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
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
function ef() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ a("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ a("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ a("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function tf() {
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
const Oo = "The queue differs from the saved review.";
function Rc({
  name: e,
  description: t,
  entityType: n,
  onBack: r,
  backDisabled: o,
  onEdit: i,
  editDisabled: s,
  editing: c = !1,
  toolbar: d,
  trailing: f,
  trailingEnd: u,
  queueChange: g,
  queueDiffers: m,
  chipsStart: b,
  chipsAfter: y,
  chipsEnd: v
}) {
  const q = $(null);
  sf(q);
  const w = cf(q), [I, F] = T({ differs: m, text: "" });
  return I.differs !== m && F({
    differs: m,
    text: m ? I.differs === !1 ? Oo : I.text : ""
  }), /* @__PURE__ */ l("header", { ref: q, className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      r && /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: o,
          onClick: r,
          children: /* @__PURE__ */ a(ha, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-type", title: kc[n], children: /* @__PURE__ */ a(Cc, { entityType: n }) }),
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
          children: /* @__PURE__ */ a(Dr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ a("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    d,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      f,
      g && /* @__PURE__ */ a(nf, { change: g, onPress: w }),
      u
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    b,
    y && /* @__PURE__ */ a("div", { className: "dq-review-chips-after", children: y }),
    v && /* @__PURE__ */ a("div", { className: "dq-review-chips-end", children: v }),
    /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: I.text })
  ] });
}
function nf({
  change: e,
  onPress: t
}) {
  const n = at(), r = at(), o = `${Oo} Save these filters to the review.`, i = e.onSave ? `${Oo} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(he, { children: [
    e.onSave && /* @__PURE__ */ l(
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
          /* @__PURE__ */ a(jl, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ a("span", { id: n, hidden: !0, children: o })
        ]
      }
    ),
    /* @__PURE__ */ l(
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
          /* @__PURE__ */ a(Ul, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ a("span", { id: r, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const rf = ["queue", "summary", "name", "layout", "range"], af = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, of = "(min-width: 1400px)";
function La(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const r = t.getBoundingClientRect();
  return !r.height || n.getBoundingClientRect().top < r.bottom;
}
function Zi(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), r = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (r(), !t) return !0;
  const o = rf.filter(
    (i) => e.querySelector(af[i])
  );
  for (let i = 1; i <= o.length && !La(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !La(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return La(e) ? !0 : (r(), !1);
}
function sf(e) {
  const t = fc(of), [n, r] = T(0), o = $(!1);
  kt(() => {
    e.current && (o.current = !Zi(e.current, t));
  }, [e, t, n]), kt(() => {
    const i = e.current;
    i && t && !o.current && !La(i) && (o.current = !Zi(i, t));
  }), W(() => {
    const i = e.current;
    if (!i || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => r((c) => c + 1));
    s.observe(i);
    for (const c of i.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function cf(e) {
  const t = $(!1);
  return W(() => {
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
function $c({
  page: e,
  pages: t,
  onPage: n
}) {
  const [r, o] = T(!1), [i, s] = T(""), c = $(null), d = $(null);
  W(() => {
    var g;
    r && ((g = c.current) == null || g.select());
  }, [r]);
  const f = (g) => {
    o(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = d.current) == null ? void 0 : m.focus();
    });
  }, u = () => {
    const g = Math.round(Number(i));
    f(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
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
        children: /* @__PURE__ */ a(ha, { "aria-hidden": "true" })
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
        onChange: (g) => s(g.target.value),
        onKeyDown: (g) => {
          pn(g) || (g.key === "Enter" ? (g.preventDefault(), u()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), f(!0)));
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
        children: /* @__PURE__ */ a($s, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Oc({
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
          /* @__PURE__ */ a(_l, { "aria-hidden": "true" }),
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
          /* @__PURE__ */ a(Jo, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function lf({
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
function pi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [r, o] = T(!1), [i, s] = T(!1), c = $(null), d = $(null), f = at();
  kt(() => {
    if (!r || !d.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), b = d.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < b && m.top > y);
  }, [r]), W(() => {
    var m, b;
    r && ((b = (m = d.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || b.focus({ preventScroll: !0 }));
  }, [r]), W(() => {
    t && o(!1);
  }, [t]);
  const u = (m = !0) => {
    var b;
    o(!1), m && ((b = c.current) == null || b.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${r ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var v, q;
    if (!r) return;
    const b = [
      ...((v = d.current) == null ? void 0 : v.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = b.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), u();
    else if (m.key === "Tab")
      u(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !b.length) return;
      const w = m.key === "ArrowDown" ? 1 : -1;
      b[(y + w + b.length) % b.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (q = b.at(m.key === "Home" ? 0 : -1)) == null || q.focus());
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
        onClick: () => o((m) => !m),
        children: /* @__PURE__ */ a(Dl, { "aria-hidden": "true" })
      }
    ),
    r && /* @__PURE__ */ l(he, { children: [
      /* @__PURE__ */ a("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => u(!1) }),
      /* @__PURE__ */ a(
        "div",
        {
          ref: d,
          id: f,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ l(Ko, { children: [
            m.separated && /* @__PURE__ */ a("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  u(), m.onSelect();
                },
                children: [
                  m.icon,
                  m.label
                ]
              }
            )
          ] }, m.label))
        }
      )
    ] })
  ] });
}
function Ga(e) {
  return Array.isArray(e) ? e.filter(
    (t) => !!t && typeof t == "object" && !Array.isArray(t)
  ) : [];
}
function mi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function gi(e) {
  return !!String(e ?? "").trim();
}
function bi(e) {
  return [
    ...new Set(
      Ga(e.customFieldCriteria).filter(mi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !gi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function yi(e, t) {
  const n = Ga(e.customFieldCriteria);
  if (!n.length) return e;
  let r = !1;
  const o = n.map((i) => {
    if (!mi(i)) return i;
    const s = { ...i };
    for (const [c, d] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const f = t[String(i[c] ?? "")];
      f && !gi(i[d]) && (s[d] = f, r = !0);
    }
    return s;
  });
  return r ? { ...e, customFieldCriteria: o } : e;
}
function Mc(e, t, n) {
  const r = Ga(e.customFieldCriteria);
  if (!r.length) return e;
  const o = Ga(n.customFieldCriteria), i = (d, f) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (u) => (d[u] ?? void 0) === (f[u] ?? void 0)
  );
  let s = !1;
  const c = r.map((d) => {
    if (!mi(d)) return d;
    const f = o.find((g) => i(g, d));
    if (!f) return d;
    const u = { ...d };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const b = t[String(d[g] ?? "")];
      b && d[m] === b && !gi(f[m]) && (delete u[m], s = !0);
    }
    return u;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function df(e, t, n) {
  if (!Pn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const r = Ke(e), o = n.steps.some((c) => Fn(c.mode)) ? await Pd(r) : "", i = await ri(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((d) => !Fn(d.mode)),
    ...i.filter((d) => Fn(d.mode))
  ]) {
    const d = (f) => Ld(
      o,
      r,
      t.media.id,
      t.performer.id,
      c.tagIds,
      f
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await d("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Lc(
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
async function wi(e, t) {
  const n = e.occurrence;
  if (Qo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const r = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await me("/api/performers/find", {
      method: "POST",
      signal: t,
      body: JSON.stringify(
        Ln({
          findFilter: { page: s, perPage: 1e3, sort: "id", direction: "asc" },
          objectFilter: i,
          filterExpression: o
        })
      )
    });
    if (c.items.forEach((d) => r.add(d.id)), s * 1e3 >= c.totalCount) return [...r];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Fc(e) {
  return ia(e.condition) && e.hideConfirmedAbsent !== !1;
}
function vi(e, t) {
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
  }, s = Fc(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
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
                      key: Ha,
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
async function Ni(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Wa([n], t))
  );
}
function xc(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function uf(e, t, n = e.conditionTagIds.map((r) => [r])) {
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
function ff(e, t, n, r, o) {
  if (!Fc(e)) return !1;
  const i = Ws(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((d) => r.includes(d))
  );
}
async function Pc(e, t, n, r) {
  if ((t == null ? void 0 : t.length) === 0 || xc(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = Ke(e), i = await ra(
    vi(e, t),
    { ...e.view.filter, page: n },
    r
  ), s = t === null ? null : new Set(t), c = e.occurrence, d = i.items.length ? await Ni(c, r) : [], f = new Array(i.items.length);
  let u = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; u < i.items.length; ) {
        const g = u++, m = i.items[g], b = await me(
          `/api/tagapplications?hostType=${o}&hostId=${m.id}&contextType=performer`,
          { signal: r }
        );
        f[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const v = b.filter(
            (w) => w.hostType === o && w.hostId === m.id && w.contextType === "performer" && w.contextId === y.id
          ), q = v.map((w) => w.tag.id);
          return uf(e.occurrence, q, d) && !ff(c, m, y.id, q, d) ? [
            {
              key: `${m.id}:${y.id}`,
              media: m,
              performer: y,
              applications: v
            }
          ] : [];
        });
      }
    })
  ), { items: f.flat(), totalCount: i.totalCount };
}
async function Lc(e, t, n) {
  const r = new Set(e.occurrence.tagIds);
  if (n.some((f) => !r.has(f)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = Ke(e), i = await qo(o, t.media.id);
  if (!i.performers.some(
    (f) => f.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await me(s)).filter(
    (f) => f.hostType === o && f.hostId === i.id && f.contextType === "performer" && f.contextId === t.performer.id
  ), d = new Set(n);
  try {
    for (const f of d)
      c.some((u) => u.tag.id === f) || await me("/api/tagapplications", {
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
      r.has(f.tag.id) && !d.has(f.tag.id) && await me(`/api/tagapplications/${f.id}`, {
        method: "DELETE"
      });
    return await me(s);
  } catch (f) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${f instanceof Error ? f.message : "Request failed."}`
    );
  }
}
function _r(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function hf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function hn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const d = n ? Ws(
      await qo(e, t.media.id),
      t.occurrence.performer.id
    ) : [], f = (await me(hf(e, t))).filter(
      (u) => u.hostType === e && u.hostId === t.media.id && u.contextType === "performer" && u.contextId === t.occurrence.performer.id
    );
    return Ro(f.map((u) => u.tag)), {
      ids: [...new Set(f.map((u) => u.tag.id))],
      names: [...new Set(f.map((u) => u.tag.name))],
      absent: d,
      applications: f
    };
  }
  const r = await qo(e, t.media.id), o = (r.tags ?? []).filter(
    (d) => d.canRemove !== !1 || d.isDerived !== !0
  );
  Ro(o);
  const i = Object.keys(r.customFields ?? {}).find(
    (d) => d.toLowerCase() === Ua
  ) ?? Ua, s = ((c = r.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((d) => !Number.isSafeInteger(d)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: o.map((d) => d.id),
    names: o.map((d) => d.name),
    absent: s,
    tags: o
  };
}
async function qi(e, t, n) {
  if (t.occurrence && $e(e))
    await Lc(
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
        `/api/${Zn(Ke(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: r, tagIds: o })
        }
      );
}
async function pf(e, t, n) {
  t.occurrence && $e(e) ? await df(e, t.occurrence, n) : await Qs(Ke(e), n, [t.media.id]);
}
function Mo(e, t, n, r) {
  const o = (i) => i.filter((s) => r.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: _r(o(t.ids), o(n.ids)),
    absence: _r(o(t.absent), o(n.absent))
  };
}
function mf(e, t) {
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
class Dc extends Error {
}
const Fo = (e) => e instanceof Error ? e.message : "Request failed.", es = (e) => [...e].sort((t, n) => t - n), la = (e, t) => JSON.stringify(es(e)) === JSON.stringify(es(t)), xo = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ba(e, t, n, r) {
  const o = new Set(e), i = new Set(e);
  for (const u of t.steps)
    for (const g of u.tagIds)
      u.mode === "ADD" ? i.add(g) : i.delete(g);
  const s = e.some((u) => !i.has(u));
  if (s && !r)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((u) => u.mode === "ADD").flatMap((u) => u.tagIds)
  ), d = [], f = [];
  for (const u of n) {
    const g = u.filter((b) => i.has(b) && !o.has(b)), m = u.filter(
      (b) => i.has(b) && o.has(b) && !c.has(b)
    );
    !g.length || !m.length || (r ? (m.forEach((b) => i.delete(b)), f.push(...m)) : (g.forEach((b) => i.delete(b)), d.push({ tagIds: g, existing: m })));
  }
  return { desired: [...i], conflict: s, skipped: !1, kept: d, replaced: f };
}
function gf(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function bf(e, t, n, r) {
  for (const [o, i] of n.entries()) {
    const s = t.filter(
      (f) => f.steps.some(
        (u) => u.mode === "ADD" && u.tagIds.some((g) => i.includes(g))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[o];
    let d = `tag ${c}`;
    try {
      d = (await me(`/api/tags/${c}`, { signal: r })).name;
    } catch {
      r.throwIfAborted();
    }
    throw new Dc(
      `${s.map((f) => f.label).join(" and ")} answer the same condition tag, ${d}. Choose one of them.`
    );
  }
}
async function yf(e, t, n, r = () => {
}) {
  if (!t.length || t.some(
    (m) => !Pn(m, e.entityType) || !m.steps.length || m.steps.some(
      (b) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(b.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = ia(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await Ni(o.occurrence, n) : [];
  await bf(o, i, s, n);
  const c = await Promise.all(
    i.map(async (m) => ({
      ...m,
      steps: await ri(m, n)
    }))
  ), d = structuredClone(gf(c));
  n.throwIfAborted();
  const f = [
    .../* @__PURE__ */ new Set([
      ...d.steps.flatMap((m) => m.tagIds),
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
  const u = await wi(o, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const b = await Pc(o, u, m, n);
    for (const y of b.items) {
      const v = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, q = Ba(v.ids, d, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: v,
        expected: v,
        conflict: q.conflict,
        status: la(v.ids, q.desired) ? "unchanged" : "pending"
      });
    }
    if (r(g.size), m * 250 >= b.totalCount) break;
    if (m > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: i,
    action: d,
    categories: s,
    touched: f,
    entries: [...g.values()]
  };
}
function wf(e, t, n) {
  const r = (i) => i.ids.filter((s) => n.includes(s));
  if (!la(r(e), r(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return la(o(e), o(t));
}
async function _c(e, t, n, r) {
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
function jc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Uc(e) {
  return e.entries.filter((t) => t.operation);
}
async function vf(e, t, n, r, o = !1) {
  await _c(
    jc(e, o),
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
        if (s = await hn(Ke(e.review), i.item, !1), !wf(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        i.status = "failed", i.error = Fo(m);
        return;
      }
      const c = Ba(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), d = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...c.desired.filter((m) => e.touched.includes(m))
      ], f = _r(s.ids, d);
      if (!f.added.length && !f.removed.length) {
        const m = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : m ? "skipped" : "unchanged", i.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let u;
      try {
        await qi(e.review, i.item, f);
      } catch (m) {
        u = m;
      }
      let g = !1;
      try {
        const m = await hn(Ke(e.review), i.item, !1);
        g = !0, i.expected = m;
        const b = Mo(
          i.item,
          i.before,
          m,
          e.touched
        );
        if (i.operation = xo(b) ? b : void 0, u) throw u;
        if (!la(
          m.ids.filter((y) => e.touched.includes(y)),
          d.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (m) {
        if (i.status = "failed", i.error = Fo(m), !g)
          try {
            const b = await hn(Ke(e.review), i.item, !1);
            i.expected = b;
            const y = Mo(
              i.item,
              i.before,
              b,
              e.touched
            );
            i.operation = xo(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    r
  );
}
async function Nf(e, t, n) {
  await _c(
    Uc(e),
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
        const c = await hn(Ke(e.review), r.item, !1);
        mf(o, c), s = !0, await qi(e.review, r.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const d = await hn(Ke(e.review), r.item, !1);
        if (!la(
          d.ids.filter((f) => i.includes(f)),
          r.before.ids.filter((f) => i.includes(f))
        ))
          throw new Error("Undo did not restore all affected tags.");
        r.operation = void 0, r.expected = d, r.status = "unchanged", r.error = void 0;
      } catch (c) {
        if (r.error = `Undo stopped: ${Fo(c)}`, r.status = "failed", s)
          try {
            const d = await hn(Ke(e.review), r.item, !1), f = Mo(
              r.item,
              r.before,
              d,
              i
            );
            r.operation = xo(f) ? f : void 0, r.expected = d;
          } catch {
            r.unverified = !0;
          }
      }
    },
    n
  );
}
const Kc = (e, t) => t.count - e.count || Ys(e, t);
async function qf(e, t, n) {
  const r = Ke(e), o = e.occurrence, [i, s] = await Promise.all([
    me(
      `/api/tagapplications?hostType=${r}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    Ni(o, n)
  ]), c = i.filter(
    (y) => y.hostType === r && y.contextType === "performer" && y.contextId === t
  );
  Ro(c.map((y) => y.tag));
  const d = await Promise.all(
    s.map(async (y, v) => {
      const q = o.conditionTagIds[v];
      return (await me(`/api/tags/${q}`, { signal: n })).name;
    })
  ), f = new Set(s.flat()), u = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...o.tagIds
    ].filter((y) => !f.has(y))
  ), g = (y) => {
    const v = /* @__PURE__ */ new Map();
    for (const q of c) {
      if (!y.has(q.tag.id)) continue;
      const w = v.get(q.tag.id) ?? {
        tag: q.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(q.hostId), v.set(q.tag.id, w);
    }
    return [...v.values()].map((q) => ({ ...q.tag, count: q.hosts.size })).sort(Kc);
  }, m = s.map((y, v) => ({
    id: o.conditionTagIds[v],
    name: d[v],
    members: y,
    tags: g(new Set(y))
  }));
  u.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...u],
    tags: g(u)
  });
  const b = /* @__PURE__ */ new Set([...f, ...u]);
  return {
    answered: new Set(
      c.filter((y) => b.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
function Sf(e, t, n, r) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = r.get(s);
    if (!c) return !1;
    const d = new Set(c);
    return [...o].every((f) => d.has(f));
  };
  return n.some(
    (s) => [...Xn(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function Si(e, t, n) {
  const r = /* @__PURE__ */ new Map();
  for (const b of e.groups) for (const y of b.tags) r.set(y.id, y);
  const o = (b) => b.flatMap((y) => r.get(y) ?? []).sort(Kc), i = (b) => b.members ?? b.tags.map((y) => y.id), s = wr(t).flatMap((b) => {
    const y = [
      ...new Set(b.actions.flatMap((v) => [...Xn(t[v])]))
    ];
    return y.length ? [{ ...b, answers: y, tags: o(y) }] : [];
  }), c = (b) => b.tags.length > 1 ? [b] : [], d = e.groups.filter((b) => b.id !== null).map((b) => {
    const y = `tag:${b.id}`, v = i(b), q = new Set(v);
    return {
      key: y,
      kind: "condition",
      name: b.name,
      members: v,
      tags: b.tags,
      mixed: Sf(b.id, v, t, n) ? c({ key: y, name: b.name, members: v, tags: b.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((I) => q.has(I))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), f = d.map((b) => new Set(b.members)), u = /* @__PURE__ */ new Set();
  for (const b of s) {
    if (f.some((v) => b.answers.every((q) => v.has(q)))) continue;
    b.answers.forEach((v) => u.add(v));
    const y = `group:${b.key}`;
    d.push({
      key: y,
      kind: "group",
      name: b.name,
      members: b.answers,
      tags: b.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: b.name, members: b.answers, tags: b.tags })
    });
  }
  const g = e.groups.find((b) => b.id === null), m = (g == null ? void 0 : g.tags.filter((b) => !u.has(b.id))) ?? [];
  return g && m.length && d.push({
    key: "other",
    kind: "other",
    name: d.length ? "Other review tags" : "Review tags",
    members: i(g).filter((b) => !u.has(b)),
    tags: m,
    mixed: []
  }), d;
}
const fo = { summary: null, error: "" };
function Gc(e, t, n = 0) {
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
    value: fo
  });
  return W(() => {
    if (s((d) => d.key === o ? d : { key: o, value: fo }), e === null || t === null) return;
    const c = new AbortController();
    return qf(e, t, c.signal).then((d) => {
      c.signal.aborted || s({ key: o, value: { summary: d, error: "" } });
    }).catch((d) => {
      c.signal.aborted || s((f) => ({
        key: o,
        value: {
          summary: f.key === o ? f.value.summary : null,
          error: d instanceof Error ? d.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [o, n]), i.key === o ? i.value : fo;
}
function kf(e, t) {
  const n = (f) => {
    var u;
    return ((u = f.tagIds) == null ? void 0 : u.every((g) => e.members.includes(g))) ?? !1;
  }, r = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const f of e.mixed) {
    const u = zd(f, t).filter((m) => m.key !== e.key), g = f.key === e.key ? [] : u.filter(n);
    g.length ? g.forEach((m) => r.add(m.name)) : u.forEach((m) => o.add(m.name));
  }
  const i = vt(e.name), s = [...r].filter((f) => vt(f) !== i), c = s.length < r.size, d = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: d };
}
function Ef(e, { names: t, here: n, note: r }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${r}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function Po({
  summary: e,
  error: t,
  mediaKind: n,
  actions: r = [],
  trees: o = Eo,
  flags: i = [],
  className: s = ""
}) {
  const c = Cn(n), d = (m) => `${m.toLocaleString()} ${m === 1 ? c.one : c.many}`, f = e ? Si(e, r, o) : [], u = ii(f), g = (m) => [
    ...new Set(
      i.filter((b) => {
        var y;
        return (y = b.tagIds) == null ? void 0 : y.some((v) => m.includes(v));
      }).flatMap((b) => b.flags)
    )
  ];
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-panel-section dq-performer-answers ${s}`.trim(),
      "aria-label": "Existing answers",
      children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ a("span", { children: e.answered ? `${d(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? f.map((m) => {
          const b = m.kind === "other" ? [] : g(m.members), y = kf(m, u), v = y.note ? /* @__PURE__ */ a("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ a("span", { children: m.name }),
              m.mixed.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Ef(m, y),
                  children: [
                    /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ l("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      v,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
                    ] }) : v
                  ]
                }
              ),
              b.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${b.join(", ")}`,
                  children: [
                    /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Flagged: " }),
                      b.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            m.tags.length ? /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": m.name, children: m.tags.map((q) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ a(Bt, { tag: q }),
              /* @__PURE__ */ a("span", { className: "dq-chip-count", "aria-hidden": "true", children: q.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                d(q.count)
              ] })
            ] }, q.id)) }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" })
          ] }, m.key);
        }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Pr({
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
const ts = 5;
function Cf(e, t) {
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
function Af(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((r, o) => {
    const i = window.setTimeout(r, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(i), o(t.reason);
      },
      { once: !0 }
    );
  });
}
const ns = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), Lo = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], rs = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], Tf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, ho = 250;
function ta(e, t) {
  var r, o;
  const n = e.item.media;
  return n.title || ((o = (r = n.files) == null ? void 0 : r[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function If({ step: e }) {
  const t = Lo.findIndex((n) => n.id === e);
  return /* @__PURE__ */ a("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: Lo.map((n, r) => {
    const o = r < t ? "done" : r === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ a(ua, {}) : r + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ a("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function as({ parts: e, id: t }) {
  return /* @__PURE__ */ a("span", { className: "dq-batch-effect", id: t, children: e.map((n, r) => /* @__PURE__ */ l(Ko, { children: [
    r > 0 && " ",
    /* @__PURE__ */ a("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, r)) });
}
function ea({
  value: e,
  label: t,
  detail: n,
  tone: r,
  pressed: o,
  onToggle: i
}) {
  return /* @__PURE__ */ l(
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
        n && /* @__PURE__ */ l(he, { children: [
          " ",
          /* @__PURE__ */ a("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function os({
  added: e,
  removed: t,
  tag: n,
  label: r
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": r, children: [
    br(e.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ a(Bt, { tag: o })
    ] }) }, `added-${o.id}`)),
    br(t.map(n)).map((o) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ a(Bt, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function is({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: r,
  describe: o
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: e }),
      t.length > ho && /* @__PURE__ */ l("span", { children: [
        "First ",
        ho.toLocaleString(),
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
      /* @__PURE__ */ a("tbody", { children: t.slice(0, ho).map((i) => {
        var s;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ a("td", { children: /* @__PURE__ */ l(
            "a",
            {
              href: `/${n}/${i.item.media.id}`,
              target: "_blank",
              rel: "noreferrer",
              children: [
                (s = i.item.occurrence) == null ? void 0 : s.performer.name,
                " — ",
                ta(i, n)
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
function Rf(e) {
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
function $f({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: r,
  onOpen: o,
  onClose: i,
  onWrite: s
}) {
  const [c, d] = T(!1), [f, u] = T("answers"), [g, m] = T(null), [b, y] = T({}), [v, q] = T([]), [w, I] = T(!1), [F, U] = T(!1), [_, K] = T(""), [Z, ee] = T(!1), [ie, re] = T(""), [x, G] = T(null), [R, E] = T(null), [J, H] = T([]), [Y, te] = T(0), B = $(null), S = $(null), ae = $(null), C = $(!1), V = $(!1), se = $(null), pe = $(!1), D = $(0), ye = $(!1), Te = $({ onClose: i, onWrite: s });
  Te.current = { onClose: i, onWrite: s };
  const ue = at(), Oe = f === "run", Ge = (x == null ? void 0 : x.kind) === "undo", Ce = Oe && g ? g.review : e, An = jr(Ce.actions), ve = Ce.occurrence, Je = Ke(Ce), Et = Cn(Je), mn = Et.queue, xe = Oe && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((A) => A.steps.length && !Qn(A))
  ), ot = xe.filter((A) => v.includes(A.id)), Re = ve.targetMode === "selected" && ve.performerIds.length === 1, Ze = Gc(
    Ce,
    c && Re ? ve.performerIds[0] : null,
    Y
  ), Vt = bi(Ce.view.objectFilter), Fe = ga(
    c ? [...Qa(xe), ...ve.conditionTagIds, ...Vt] : []
  ), Tn = be(() => uc(Fe), [Fe]), dt = (A) => b[A] ?? Fe[A] ?? { id: A, name: `Tag ${A}` }, Mt = JSON.stringify(
    Object.fromEntries(
      Vt.flatMap((A) => {
        var Q;
        const L = (Q = Fe[A]) == null ? void 0 : Q.name;
        return L ? [[String(A), L]] : [];
      })
    )
  ), ft = be(
    () => yi(Ce.view.objectFilter, JSON.parse(Mt)),
    [Ce.view.objectFilter, Mt]
  );
  W(() => {
    var A, L, Q;
    c && ((A = B.current) == null || A.showModal(), (Q = (L = B.current) == null ? void 0 : L.querySelector(".dq-batch-answer input")) == null || Q.focus());
  }, [c]), W(() => {
    if (!c) return;
    const A = requestAnimationFrame(() => {
      var le;
      const L = B.current, Q = document.activeElement;
      if (!L || Q && Q !== document.body && L.contains(Q)) return;
      (le = (f === "answers" ? L.querySelector(".dq-batch-answer input:checked") ?? L.querySelector(".dq-batch-answer input") : L.querySelector("[data-batch-focus]")) ?? S.current) == null || le.focus();
    });
    return () => cancelAnimationFrame(A);
  }, [c, f, F, g]), W(() => {
    if (c || t || !C.current) return;
    const A = requestAnimationFrame(() => {
      const L = ae.current;
      if (!C.current || !L || L.disabled) return;
      C.current = !1;
      const Q = document.activeElement;
      (!Q || Q === document.body) && L.focus();
    });
    return () => cancelAnimationFrame(A);
  }, [c, t]), W(() => {
    if (!c || ve.targetMode !== "selected") return;
    const A = new AbortController();
    return H([]), Cf(ve.performerIds.slice(0, ts), A.signal).then((L) => {
      A.signal.aborted || H(L);
    }).catch(() => {
    }), () => A.abort();
  }, [c, ve.targetMode, JSON.stringify(ve.performerIds)]), W(
    () => () => {
      var A;
      V.current = !0, (A = se.current) == null || A.abort();
    },
    []
  ), W(() => {
    if (!F) return;
    const A = (L) => {
      L.preventDefault(), L.returnValue = "";
    };
    return window.addEventListener("beforeunload", A), () => window.removeEventListener("beforeunload", A);
  }, [F]);
  function zt() {
    u("answers"), m(null), y({}), G(null), I(!1), q([]), re(""), K(""), ee(!1), E(null);
  }
  function qt() {
    ye.current || (d(!1), Te.current.onClose(pe.current), pe.current = !1, zt(), C.current = !0);
  }
  function er(A, L) {
    q(
      (Q) => L ? [...Q, A] : Q.filter((we) => we !== A)
    ), m(null), y({}), re(""), K(""), ee(!1), E(null);
  }
  function Tt() {
    u("answers"), E(null), re("");
  }
  function In() {
    u("preview"), g || qe();
  }
  function Jt() {
    var A;
    V.current = !0, (A = se.current) == null || A.abort(), re("Stopping after in-flight operations settle…");
  }
  function Ft(A) {
    E(
      (L) => (L == null ? void 0 : L.group) === A.group && L.reason === A.reason ? null : A
    );
  }
  const gn = (A, L) => (R == null ? void 0 : R.group) === A && R.reason === L;
  async function qe() {
    if (!ot.length || ye.current) return;
    ye.current = !0, U(!0), K(""), ee(!1), re("Loading all matching occurrences…"), m(null), y({}), E(null);
    const A = new AbortController();
    se.current = A;
    try {
      await Af(D.current, A.signal);
      const L = await yf(
        e,
        ot,
        A.signal,
        (we) => re(`Loaded ${we.toLocaleString()} matching occurrences…`)
      );
      A.signal.throwIfAborted();
      const Q = {};
      for (const we of L.entries)
        for (const le of we.before.applications ?? [])
          Q[le.tag.id] = le.tag;
      y(Q), m(L), re("Preview ready. No tags have been changed.");
    } catch (L) {
      K(
        A.signal.aborted ? "Preview cancelled. No tags were changed." : L instanceof Error ? L.message : String(L)
      ), ee(!A.signal.aborted && L instanceof Dc), re("");
    } finally {
      ye.current = !1, U(!1), se.current = null;
    }
  }
  async function Ct(A) {
    if (!g || ye.current) return;
    const L = (A === "undo" ? Uc(g) : jc(g, A === "retry")).length;
    ye.current = !0, V.current = !1, pe.current = !0, Te.current.onWrite(), U(!0), u("run"), K(""), G({ kind: A, total: L, done: 0, stopped: !1 }), re(
      A === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const Q = () => G((le) => le && { ...le, done: le.done + 1 });
    let we = !1;
    try {
      A === "undo" ? await Nf(g, () => V.current, Q) : await vf(g, w, () => V.current, Q, A === "retry"), re(
        V.current ? "Stopped after in-flight operations settled. Completed changes are retained." : A === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (le) {
      we = !0, re(""), K(le instanceof Error ? le.message : String(le));
    } finally {
      D.current = Date.now(), ye.current = !1;
      const le = V.current || we;
      G((Me) => Me && { ...Me, stopped: le }), U(!1), te((Me) => Me + 1);
    }
  }
  const it = (g == null ? void 0 : g.entries) ?? [], Dn = be(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((A) => [
        A.item.key,
        Ba(A.before.ids, g.action, g.categories, w)
      ])
    ),
    [g, w]
  ), Ht = (A) => Dn.get(A.item.key), Pe = (A) => _r(A.before.ids, Ht(A).desired), It = (A) => {
    const L = Pe(A);
    return A.status === "pending" && (L.added.length > 0 || L.removed.length > 0);
  }, ce = (A) => A.conflict || Ht(A).kept.length > 0 || Ht(A).replaced.length > 0, P = be(() => {
    const A = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: A.filter(It).length,
      correct: A.filter((L) => L.status === "unchanged").length,
      different: A.filter(ce).length,
      hosts: new Set(A.map((L) => L.item.media.id)).size,
      added: [...new Set(A.flatMap((L) => Pe(L).added))],
      removed: [...new Set(A.flatMap((L) => Pe(L).removed))]
    };
  }, [Dn]), Ae = be(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((A) => A.item.media.date).sort((A, L) => A.item.media.date.localeCompare(L.item.media.date)),
    [g]
  ), ht = Oe ? Rf(it) : null, _n = (A) => An.keys[Ce.actions.findIndex((L) => L.id === A)] ?? "", ge = (A) => qr(A, Tn, [], r), Rt = ia(ve.condition) && ve.includeSubtags !== !1 && ve.conditionTagIds.length > 0, tt = Ae[0], Le = Ae.length > 1 ? Ae[Ae.length - 1] : void 0, et = (A) => `/${Je}/${A.item.media.id}`, Wt = Re ? J[0] : void 0, st = be(
    () => n ? rc(
      n,
      Ze.summary ? ii(
        Si(Ze.summary, Ce.actions, r ?? Eo)
      ) : []
    ) : [],
    [n, Ze.summary, Ce.actions, r]
  ), pt = Hd(ot, st, r ?? Eo), xt = n ?? [], Qt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: It },
    correct: { title: "Occurrences already correct", test: (A) => A.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: ce }
  };
  function ct() {
    const A = Tf[ve.condition], L = !!A && ve.conditionTagIds.length > 0, Q = ve.performerIds.slice(0, ts), we = String(Ce.view.filter.q ?? "").trim(), le = ve.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ a("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Qo(ve) ? /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "All performers" }) : ve.targetMode === "selected" ? /* @__PURE__ */ l(he, { children: [
        Q.map((Me, Ie) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ a(Pr, { performer: { id: Me, name: J[Ie] ?? "" } }),
          J[Ie] ?? "…"
        ] }, Me)),
        ve.performerIds.length > Q.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (ve.performerIds.length - Q.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(he, { children: [
        /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ a(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ a(
              oa,
              {
                filter: {},
                objectFilter: ve.performerFilter,
                criteriaDefinitions: Go,
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
        L ? A : Ho[ve.condition],
        L && /* @__PURE__ */ a("span", { className: "dq-batch-chip-tags", children: br(ve.conditionTagIds.map(dt)).map((Me) => /* @__PURE__ */ a(Bt, { tag: Me }, Me.id)) })
      ] }),
      L && /* @__PURE__ */ a("span", { className: "dq-batch-chip", children: ve.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      ia(ve.condition) && ve.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: le, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          le
        ] })
      ] }),
      we && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        we,
        "”"
      ] }),
      Object.keys(Ce.view.objectFilter).length > 0 && /* @__PURE__ */ a(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${mn} filters`,
          children: /* @__PURE__ */ a(
            oa,
            {
              filter: Ce.view.filter,
              objectFilter: ft,
              criteriaDefinitions: Je === "audio" ? Ns : Bo,
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
  function jn(A, L, Q = !0) {
    if (!A.length) return null;
    const we = /* @__PURE__ */ a("strong", { children: Wt || "This performer" }), le = Q ? `Check the earliest and latest ${Et.many} before applying, or narrow the batch with a date filter.` : "", Me = A.every((Ie) => Ie.tagIds === null && !Ie.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Me ? /* @__PURE__ */ l("p", { children: [
          we,
          " is flagged: ",
          /* @__PURE__ */ a("strong", { children: A.flatMap((Ie) => Ie.flags).join(", ") }),
          ".",
          " ",
          le
        ] }) : /* @__PURE__ */ l(he, { children: [
          /* @__PURE__ */ l("p", { children: [
            we,
            " needs attention where the chosen answers apply.",
            le && ` ${le}`
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: A.map((Ie) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ a("strong", { children: Ie.tagIds === null ? "Whole review" : Ie.name }),
            ":",
            " ",
            si(Ie).join("; ")
          ] }, Ie.key)) })
        ] }),
        L && tt && /* @__PURE__ */ l("p", { className: "dq-batch-flag-links", children: [
          /* @__PURE__ */ l("a", { href: et(tt), target: "_blank", rel: "noreferrer", children: [
            "Earliest · ",
            ta(tt, Je),
            " · ",
            tt.item.media.date
          ] }),
          Le && /* @__PURE__ */ l("a", { href: et(Le), target: "_blank", rel: "noreferrer", children: [
            "Latest · ",
            ta(Le, Je),
            " · ",
            Le.item.media.date
          ] })
        ] })
      ] })
    ] });
  }
  function Yt() {
    const A = pt.filter((Q) => Q.tagIds === null), L = pt.filter((Q) => Q.tagIds !== null);
    return /* @__PURE__ */ l(he, { children: [
      ct(),
      jn(A, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Re ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ a("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ a("div", { className: "dq-batch-answers", children: xe.map((Q, we) => {
            const le = _n(Q.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ a(
                "input",
                {
                  type: "checkbox",
                  checked: v.includes(Q.id),
                  "aria-labelledby": `${ue}-answer-${we}`,
                  "aria-describedby": `${ue}-effect-${we}`,
                  onChange: (Me) => er(Q.id, Me.target.checked)
                }
              ),
              /* @__PURE__ */ a("span", { className: "dq-batch-answer-key", children: le && /* @__PURE__ */ a(Nt, { binding: le, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ a(
                  "span",
                  {
                    id: `${ue}-answer-${we}`,
                    className: "dq-batch-answer-label",
                    title: Q.label,
                    children: Q.label
                  }
                ),
                /* @__PURE__ */ a(as, { id: `${ue}-effect-${we}`, parts: ge(Q) })
              ] })
            ] }, Q.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ a("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: jn(L, !1, A.length === 0) }),
          /* @__PURE__ */ a(
            Po,
            {
              ...Ze,
              mediaKind: Je,
              actions: Ce.actions,
              trees: r,
              flags: xt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Un(A) {
    const L = P, Q = R && ns.has(R.group) ? R.group : null, we = Q ? it.filter(Qt[Q].test) : [], le = (Me) => {
      const Ie = Ht(Me), Lt = Ie.skipped ? _r(
        Me.before.ids,
        Ba(Me.before.ids, A.action, A.categories, !0).desired
      ) : Pe(Me), Ne = !Lt.added.length && !Lt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ie.skipped && /* @__PURE__ */ a("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ne ? !Ie.kept.length && /* @__PURE__ */ a("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ a(os, { added: Lt.added, removed: Lt.removed, tag: dt }),
        Ie.kept.map((ke, Se) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          br(ke.existing.map(dt)).map((Dt) => /* @__PURE__ */ a(Bt, { tag: Dt }, Dt.id)),
          " ",
          "instead of",
          " ",
          br(ke.tagIds.map(dt)).map((Dt) => /* @__PURE__ */ a(Bt, { tag: Dt }, Dt.id))
        ] }, Se))
      ] });
    };
    return /* @__PURE__ */ l(he, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ a(
            ea,
            {
              value: it.length,
              label: it.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${L.hosts.toLocaleString()} ${L.hosts === 1 ? mn : `${mn}s`}`,
              pressed: gn("matching"),
              onToggle: () => Ft({ group: "matching" })
            }
          ),
          /* @__PURE__ */ a(
            ea,
            {
              value: L.willChange,
              label: "will change",
              tone: "add",
              pressed: gn("change"),
              onToggle: () => Ft({ group: "change" })
            }
          ),
          /* @__PURE__ */ a(
            ea,
            {
              value: L.correct,
              label: "already correct, no write",
              pressed: gn("correct"),
              onToggle: () => Ft({ group: "correct" })
            }
          ),
          /* @__PURE__ */ a(
            ea,
            {
              value: L.different,
              label: w ? "replace a different answer" : "keep a different answer",
              tone: "warn",
              pressed: gn("different"),
              onToggle: () => Ft({ group: "different" })
            }
          )
        ] }),
        we.length > 0 ? /* @__PURE__ */ a(
          is,
          {
            title: Qt[Q].title,
            entries: we,
            mediaKind: Je,
            resultHeading: "Planned change",
            describe: le
          }
        ) : it.length > 0 && /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        it.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ a("span", { children: tt ? `Dates ${tt.item.media.date}${Le ? ` to ${Le.item.media.date}` : ""}` : "No dates" }),
          tt && /* @__PURE__ */ a(
            "a",
            {
              href: et(tt),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open earliest ${Et.one}, ${tt.item.media.date}`,
              title: ta(tt, Je),
              children: "Open earliest"
            }
          ),
          Le && /* @__PURE__ */ a(
            "a",
            {
              href: et(Le),
              target: "_blank",
              rel: "noreferrer",
              "aria-label": `Open latest ${Et.one}, ${Le.item.media.date}`,
              title: ta(Le, Je),
              children: "Open latest"
            }
          ),
          Ae.length < it.length && /* @__PURE__ */ l("span", { children: [
            (it.length - Ae.length).toLocaleString(),
            " without a date"
          ] })
        ] }),
        (L.added.length > 0 || L.removed.length > 0) && /* @__PURE__ */ l("div", { className: "dq-batch-planned", children: [
          /* @__PURE__ */ a("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ a(
            os,
            {
              added: L.added,
              removed: L.removed,
              tag: dt,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      L.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ a("span", { id: `${ue}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${ue}-choice`,
            children: [
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": !w, onClick: () => I(!1), children: "Keep their answer" }),
              /* @__PURE__ */ a("button", { type: "button", "aria-pressed": w, onClick: () => I(!0), children: "Replace it" })
            ]
          }
        ),
        /* @__PURE__ */ l("p", { className: "dq-muted", children: [
          "A different answer is a tag the chosen answers would remove",
          Rt ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories" : "",
          ". Configure opposite answers as removals."
        ] })
      ] })
    ] });
  }
  function Pt() {
    return /* @__PURE__ */ l(he, { children: [
      ct(),
      jn(pt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Re ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${ue}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ a("h3", { id: `${ue}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", disabled: F, onClick: Tt, children: "Change" })
          ] }),
          /* @__PURE__ */ a("ul", { className: "dq-batch-chosen", children: ot.map((A) => {
            const L = _n(A.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                L && /* @__PURE__ */ a(Nt, { binding: L, hidden: !0 }),
                A.label
              ] }),
              /* @__PURE__ */ a(as, { parts: ge(A) })
            ] }, A.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ a(
          Po,
          {
            ...Ze,
            mediaKind: Je,
            actions: Ce.actions,
            trees: r,
            flags: xt,
            className: "dq-batch-card"
          }
        )
      ] }),
      F ? /* @__PURE__ */ a("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ a("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ a("span", {}) }) }) : g && Un(g)
    ] });
  }
  function bn(A) {
    const L = x ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, Q = L.kind === "apply" ? it.length - A.counts.pending : L.done, we = L.kind === "apply" ? it.length : L.total, le = F ? L.kind === "undo" ? "Undoing batch…" : L.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : L.kind === "undo" ? L.stopped ? "Undo stopped" : "Undo finished" : L.stopped ? "Stopped" : "Finished", Me = we ? Math.round(Q / we * 100) : 100, Ie = R && !ns.has(R.group) ? R.group : null, Lt = (ke) => rs.find((Se) => Se.status === ke).label, Ne = Ie ? it.filter(
      (ke) => ke.status === Ie && (!R.reason || ke.error === R.reason)
    ) : [];
    return /* @__PURE__ */ l(he, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ a("h3", { tabIndex: -1, "data-batch-focus": "", children: le }),
          /* @__PURE__ */ l("span", { children: [
            Q.toLocaleString(),
            " of ",
            we.toLocaleString(),
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
            "aria-valuemax": we,
            "aria-valuenow": Q,
            children: /* @__PURE__ */ a("span", { style: { width: `${Me}%` } })
          }
        ),
        !F && L.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (L.total - A.recorded).toLocaleString(),
          " of",
          " ",
          L.total.toLocaleString(),
          " ",
          L.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ a("div", { className: "dq-batch-stats", "data-count": "5", children: rs.map((ke) => /* @__PURE__ */ a(
          ea,
          {
            value: A.counts[ke.status],
            label: ke.label,
            tone: ke.tone,
            pressed: gn(ke.status),
            onToggle: () => Ft({ group: ke.status })
          },
          ke.status
        )) }),
        A.reasons.length > 0 && /* @__PURE__ */ a("ul", { className: "dq-batch-reasons", children: A.reasons.map((ke) => {
          const Se = gn(ke.status, ke.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              ke.count.toLocaleString(),
              " ",
              ke.status,
              ": ",
              ke.error
            ] }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-link-button",
                "aria-expanded": Se,
                onClick: () => Ft({ group: ke.status, reason: ke.error }),
                children: Se ? "Hide them" : "Show them"
              }
            )
          ] }, `${ke.status}-${ke.error}`);
        }) }),
        Ne.length > 0 ? /* @__PURE__ */ a(
          is,
          {
            title: R.reason ? `${Lt(Ie)}: ${R.reason}` : `${Lt(Ie)} occurrences`,
            entries: Ne,
            mediaKind: Je,
            resultHeading: "Result",
            describe: (ke) => ke.error ?? Lt(ke.status)
          }
        ) : /* @__PURE__ */ a("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      A.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F,
            onClick: () => void Ct("undo"),
            children: [
              /* @__PURE__ */ a(Kl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          Ge ? L.stopped || F ? `${A.recorded.toLocaleString()} ${A.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${A.recorded.toLocaleString()} ${A.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${A.recorded === 1 ? "this change" : `these ${A.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function nn() {
    return f === "answers" ? /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !ot.length,
        onClick: In,
        children: "Preview all matches"
      },
      "preview"
    ) : f === "preview" ? F ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Jt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !P.willChange,
        onClick: () => void Ct("apply"),
        children: [
          "Apply to ",
          P.willChange.toLocaleString(),
          " ",
          P.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : Z ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button primary", onClick: Tt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void qe(),
        children: "Preview again"
      },
      "again"
    ) : F ? /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: Jt, children: Ge ? "Cancel undo" : "Cancel run" }, "cancel-run") : Ge || !ht ? null : /* @__PURE__ */ l(Ko, { children: [
      ht.retryable && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", onClick: () => void Ct("retry"), children: "Retry failed" }),
      ht.counts.pending > 0 && /* @__PURE__ */ a(
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
  return /* @__PURE__ */ l(Bu, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: ae,
        title: "Apply answers to all matching occurrences",
        disabled: t || !xe.length,
        onClick: () => {
          zt(), o(), d(!0);
        },
        children: [
          /* @__PURE__ */ a(Mi, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: B,
        className: "dq-batch-dialog",
        "aria-labelledby": `${ue}-title`,
        "aria-modal": "true",
        onCancel: (A) => {
          A.preventDefault(), qt();
        },
        onClose: () => {
          var A;
          ye.current ? (A = B.current) == null || A.showModal() : qt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ a(Mi, { "aria-hidden": "true" }),
            /* @__PURE__ */ a("h2", { id: `${ue}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ a(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: F,
                onClick: qt,
                children: /* @__PURE__ */ a(fa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a(If, { step: f }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: S,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": f === "preview" ? "" : void 0,
              "aria-label": `${Lo.find((A) => A.id === f).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  ie && /* @__PURE__ */ a("p", { role: "status", children: ie }),
                  _ && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: _ })
                ] }),
                f === "answers" ? Yt() : f === "preview" ? Pt() : bn(ht)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            f === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: F, onClick: Tt, children: [
              /* @__PURE__ */ a(ha, { "aria-hidden": "true" }),
              "Back"
            ] }),
            f === "run" && /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: F, onClick: zt, children: "New batch" }),
            /* @__PURE__ */ a("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: F, onClick: qt, children: "Close" }),
            nn()
          ] })
        ]
      }
    )
  ] });
}
const Bc = "data-quality.description-collapsed.v1";
function Of() {
  try {
    return localStorage.getItem(Bc) === "true";
  } catch {
    return !1;
  }
}
function Mf({
  details: e,
  label: t
}) {
  const [n, r] = T(Of), o = kn(() => {
    r((i) => {
      const s = !i;
      try {
        localStorage.setItem(Bc, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
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
    !n && (e != null && e.trim() ? /* @__PURE__ */ a(Al, { className: "dq-description-body", children: e }) : /* @__PURE__ */ a("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Ff = (e) => "";
function xf({
  ranking: e,
  busy: t,
  error: n,
  focus: r,
  disabled: o,
  labels: i,
  flagLabel: s = Ff,
  onFocus: c,
  onMore: d,
  onRefresh: f
}) {
  var m;
  const u = e ? e.ranked.slice(0, e.limit) : [], g = !!e && (e.ranked.length > e.limit || (((m = e.candidates[e.cursor]) == null ? void 0 : m.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
        "Counting matching ",
        i.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ a("p", { children: u.length ? `Most matching ${i.queue}s first` : `No performer has matching ${i.many}.` }) : null,
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: f,
          children: /* @__PURE__ */ a(Gl, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ a("div", { className: "dq-queue-list", children: u.map((b) => {
      const y = `${b.count.toLocaleString()} matching ${b.count === 1 ? i.one : i.many}`, v = s(b.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${b.name}, ${y}${v ? `. ${v}` : ""}`,
          title: v || void 0,
          "aria-current": r === b.id ? "true" : void 0,
          disabled: o,
          onClick: () => c(b.id),
          children: [
            /* @__PURE__ */ a(Pr, { performer: b }),
            /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: b.name }),
            v && /* @__PURE__ */ a(xn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ a("span", { className: "dq-ranked-count", "aria-hidden": "true", children: b.count.toLocaleString() })
          ]
        },
        b.id
      );
    }) }),
    g && !t && !n && /* @__PURE__ */ a(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: d,
        children: "Show more performers"
      }
    )
  ] });
}
const Pf = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Lf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Df(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), r = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: r, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Fa(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function _f(e, t) {
  const n = Qo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", r = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Fa(r, "or")}`,
    includesAll: `has ${Fa(r, "and")}`,
    excludes: `has none of ${Fa(r, "or")}`,
    excludesAll: `missing ${Fa(r, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function jf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: r,
  onEditCriteria: o
}) {
  const [i, s] = T(!1), [c, d] = T(null), f = $(null), u = $(null), g = at(), m = Ur(e.conditionTagIds), b = _f(e, m);
  kt(() => {
    const w = f.current;
    if (!i || !w) return;
    const I = () => d(Df(w));
    I(), window.addEventListener("resize", I);
    const F = typeof ResizeObserver > "u" ? null : new ResizeObserver(I), U = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const _ of U) _ && (F == null || F.observe(_));
    return () => {
      window.removeEventListener("resize", I), F == null || F.disconnect();
    };
  }, [i]), W(() => {
    var I, F;
    if (!i) return;
    const w = (I = u.current) == null ? void 0 : I.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (F = u.current) == null || F.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = f.current) == null ? void 0 : w.focus();
    });
  }, v = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== u.current || w.defaultPrevented || pn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && u.current) {
        const F = [...u.current.querySelectorAll(Lf)].filter((Z) => Z.closest('[role="dialog"]') === u.current).sort(
          (Z, ee) => Z.compareDocumentPosition(ee) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!F.length) return;
        const U = F[0], _ = F[F.length - 1], K = document.activeElement;
        w.shiftKey && (K === U || K === u.current) ? (w.preventDefault(), _.focus()) : !w.shiftKey && K === _ && (w.preventDefault(), U.focus());
      }
    }
  }, q = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: f,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        "aria-controls": i ? g : void 0,
        title: b,
        onClick: () => i ? y() : s(!0),
        children: [
          /* @__PURE__ */ a(Ts, { "aria-hidden": "true" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ a("span", { className: "dq-scope-summary", children: b }),
          /* @__PURE__ */ a(Vo, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ l(he, { children: [
      /* @__PURE__ */ a("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: u,
          id: g,
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
          onKeyDown: v,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ a("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ a("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Pf.map(({ mode: w, label: I }) => /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && r({ targetMode: w }),
                  children: I
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ a(
                Yn,
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
                  oa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Go,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => r({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ a(Dr, { "aria-hidden": "true" }),
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
                  children: Wo.map((w) => /* @__PURE__ */ a("option", { value: w, children: Ho[w] }, w))
                }
              ),
              q && /* @__PURE__ */ l(he, { children: [
                /* @__PURE__ */ a(
                  Yn,
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
                  ia(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
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
function Da(e) {
  const {
    page: t,
    perPage: n,
    sort: r,
    direction: o,
    sorts: i,
    seed: s,
    ...c
  } = e.view.filter, {
    performerFlags: d,
    flagPerformerTagIds: f,
    ...u
  } = e.occurrence;
  return JSON.stringify([
    e.entityType,
    c,
    e.view.objectFilter,
    e.view.searchMode,
    u
  ]);
}
function Uf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Ke(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Kf(e, t) {
  const n = Ke(e) === "audio", r = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Ed(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(r(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let d = 1; ; d++) {
      const f = await me(
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
      if (i.push(...f.items.map(r)), d * 1e3 >= f.totalCount || !f.items.length) break;
    }
  }
  return i.sort((s, c) => c.total - s.total || s.id - c.id);
}
function Vc(e, t, n) {
  const r = vi(e, [t]);
  return Td(r, r.view.filter, n);
}
function zc(e, t) {
  const n = e.findIndex(
    (r) => r.count < t.count || r.count === t.count && r.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Do(e, t, n, r) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= r && o < n[r - 1].count;
}
async function Gf(e, t, n, r, o = {}) {
  const i = Da(e), s = Uf(e), c = xc(e.occurrence), d = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Kf(e, r),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: f } = d, u = [...d.ranked];
  let g = d.cursor, m = !1;
  const b = (y) => ({
    ...d,
    cursor: g,
    ranked: [...u],
    limit: n,
    complete: !y && Do(f, g, u, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !Do(f, g, u, n); ) {
          r.throwIfAborted();
          const v = f[g++], q = await Vc(e, v.id, r);
          q > 0 && zc(u, { ...v, count: q }), (y = o.onProgress) == null || y.call(o, b(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return r.throwIfAborted(), b(!1);
}
function Bf(e, t, n) {
  const r = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || r < 0 || r >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && zc(o, { ...e.candidates[r], count: n }), {
    ...e,
    ranked: o,
    complete: Do(e.candidates, e.cursor, o, e.limit)
  };
}
const _o = /* @__PURE__ */ new Map();
function Vf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Jc(e, t) {
  const n = Vf(t);
  return _o.set(e, n), n;
}
function zf(e) {
  const [t, n] = T(null);
  if (W(() => {
    if (e === null || _o.has(e)) return;
    const r = new AbortController();
    return me(`/api/performers/${e}`, { signal: r.signal }).then(
      (o) => {
        const i = Jc(e, o == null ? void 0 : o.tags);
        r.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => r.abort();
  }, [e]), e !== null)
    return _o.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function vr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => vr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, r = t, o = Object.keys(n).sort(), i = Object.keys(r).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && vr(n[s], r[s])
  );
}
function Jf(e) {
  var c, d, f;
  const [t, n] = T({}), [r, o] = T(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((d = e == null ? void 0 : e.presentation) == null ? void 0 : d.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((f = e == null ? void 0 : e.presentation) == null ? void 0 : f.binParents) ?? []
    ])
  ]);
  return W(() => {
    let u = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Wa([g])]
      )
    ).then((g) => {
      u && n(Object.fromEntries(g));
    }).catch(() => {
      u && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      u = !1;
    };
  }, [s]), { ids: t, error: r };
}
function Hf(e, t, n) {
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
          var d;
          return c !== s.id && ((d = n[c]) == null ? void 0 : d.includes(s.id));
        }
      )
    ) : []
  };
}
function Wf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: r,
  disabled: o,
  onToggle: i
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((v) => (r[v] ?? []).filter((q) => q !== v))
  ), d = s.every((v) => r[v]), f = ya(t.view.objectFilter, n).bins.filter(
    (v) => !d || c.has(v)
  ), u = /* @__PURE__ */ new Map();
  for (const v of e)
    for (const q of v.tags ?? [])
      if (c.has(q.id)) {
        const w = u.get(q.id) ?? { name: q.name, count: 0 };
        w.count++, u.set(q.id, w);
      }
  const g = f.filter((v) => !u.has(v)), m = Ur(g);
  for (const v of g)
    u.set(v, {
      name: m[v] === void 0 ? "…" : m[v] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const b = [...u].sort((v, q) => v[1].name.localeCompare(q[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ a("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    b.map(([v, q]) => {
      const w = f.includes(v);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": w,
          title: w ? `Show every video again, not only ${q.name}` : `Show only videos tagged ${q.name}`,
          disabled: o,
          onClick: () => i(v),
          children: [
            w && /* @__PURE__ */ a(ua, { "aria-hidden": "true" }),
            q.name,
            " ",
            /* @__PURE__ */ a("span", { className: "dq-bin-count", children: q.count })
          ]
        },
        v
      );
    }),
    !b.length && /* @__PURE__ */ a("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function mr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function Qf(e) {
  if (!mr(e) || Object.keys(e).length !== 1 || !mr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !mr(t.tagsCriterion)) return null;
  const { value: n, modifier: r, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && r === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function ya(e, t) {
  let n = e;
  const r = [];
  for (; ; ) {
    if (t && vr(n, t)) {
      n = t;
      break;
    }
    const o = Object.keys(n);
    if (o.length !== 1 || o[0] !== "_filterExpression") break;
    const i = n._filterExpression;
    if (!mr(i) || i.operator !== "AND" || !Array.isArray(i.children))
      break;
    const s = i.children, c = Qf(s.at(-1));
    if (c == null || s.length > 3) break;
    let d = {}, f = null, u = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !mr(m) || Object.keys(m).length !== 1 ? u = !1 : g === 0 && mr(m.filter) && Object.keys(m.filter).length ? d = m.filter : !f && mr(m.group) ? f = m.group : u = !1;
    if (!u) break;
    r.unshift(c), n = f ? { ...d, _filterExpression: f } : d;
  }
  return { base: n, bins: r };
}
function Yf(e, t, n) {
  const { base: r, bins: o } = ya(e.view.objectFilter, n);
  return (o.includes(t) ? o.filter((s) => s !== t) : [...o, t]).reduce(Xf, { ...e, view: { ...e.view, objectFilter: r } });
}
function Xf(e, t) {
  const { _filterExpression: n, ...r } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(r).length ? [{ filter: r }] : [],
            ...n ? [{ group: n }] : [],
            {
              filter: {
                tagsCriterion: {
                  value: [t],
                  modifier: "INCLUDES",
                  depth: 0
                }
              }
            }
          ]
        }
      }
    }
  };
}
const Ya = [
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
], Zf = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: !0,
  hideConfirmedAbsent: !0
};
function Nr(e) {
  const t = $e(e) ? e.occurrence : void 0;
  return {
    filter: Gt({
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
function ss(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function jo(e, t) {
  let n;
  if ($e(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Ya.some((c) => c !== "performer" && t.has(c))) {
    const c = Nr(e);
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
    const c = t.get("sorts").split(",").map((d) => {
      const f = d.lastIndexOf(":");
      return { key: d.slice(0, f), direction: d.slice(f + 1) };
    });
    if (c.some((d) => !d.key || !["asc", "desc"].includes(d.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = c, o.sort = c[0].key, o.direction = c[0].direction;
  }
  let i;
  if ($e(e) && (i = {
    ...Zf,
    ...ss(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !Wo.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Gt(o, Ke(e)),
      objectFilter: ss(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const cs = { dataQualityOpenedFromList: !0 };
function Hc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Wc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...cs }, "", e) : window.history.replaceState(Hc() ? { ...cs } : null, "", e);
}
function aa(e, t) {
  const n = new URLSearchParams(window.location.search);
  Ya.forEach((r) => n.delete(r)), n.set("review", e);
  for (const r of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[r] !== void 0 && n.set(r, String(t.filter[r]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((r) => `${r.key}:${r.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Wc(`${window.location.pathname}?${n}${window.location.hash}`);
}
function En(e, t) {
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
function yr(e) {
  const t = e;
  return En(t, Nr(t));
}
function ls(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !vr(
    JSON.parse(Jn(En(e, t))),
    JSON.parse(Jn(En(e, Nr(e))))
  );
}
function Qc(e, t) {
  if (Ue(e) !== "video") return e;
  const { base: n, bins: r } = ya(e.view.objectFilter, t.view.objectFilter);
  return r.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function xa(e, t) {
  if (Ue(e) !== "video") return t;
  const { base: n, bins: r } = ya(t.objectFilter, e.view.objectFilter);
  return r.length ? { ...t, objectFilter: n } : t;
}
function ds(e, t) {
  return !t || !$e(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function po(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const r of e)
    n.set(r.media.id, [...n.get(r.media.id) ?? [], r]);
  return [...n.values()].reverse().flat();
}
const tn = (e) => e instanceof Error ? e.message : "Request failed.", mo = 50, eh = [], us = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function th(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? $l(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? ks(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function nh({ media: e, kind: t }) {
  const [n, r] = T(!1);
  return /* @__PURE__ */ a("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ a(Rs, {}) : /* @__PURE__ */ a(za, {}) : /* @__PURE__ */ a(
    "img",
    {
      src: So(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => r(!0)
    }
  ) });
}
function rh({
  tags: e,
  preview: t,
  showPreview: n,
  trees: r,
  actionTagIds: o,
  label: i
}) {
  const s = fi(t), c = n ? s : null, d = e == null ? void 0 : e.absent, f = ga(
    be(() => [...o, ...d ?? []], [o, d])
  ), u = (_) => f[_] ?? { id: _, name: f[_] === void 0 ? "…" : "Unavailable tag" }, g = (_) => br(_.map(u)), m = c && e ? oi(c, e, r) : null, b = e ? Ud(e) : [], y = new Set(b.map((_) => _.id)), v = new Set(m == null ? void 0 : m.removed), q = new Set(m == null ? void 0 : m.markedAbsent), w = new Set(m == null ? void 0 : m.absenceCleared), I = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
    "absent"
  ] }), F = g((m == null ? void 0 : m.added) ?? []), U = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((_) => !y.has(_)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": i, children: [
    /* @__PURE__ */ a("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(he, { children: [
      b.length || F.length || U.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        b.map(
          (_) => v.has(_.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ a(Bt, { tag: _ })
            ] }),
            q.has(_.id) && I
          ] }, _.id) : /* @__PURE__ */ a("li", { className: "dq-tag", children: /* @__PURE__ */ a(Bt, { tag: _ }) }, _.id)
        ),
        F.map((_) => /* @__PURE__ */ a("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ a(Bt, { tag: _ })
        ] }) }, `added-${_.id}`)),
        U.map((_) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ a("ins", { children: /* @__PURE__ */ a(Bt, { tag: _ }) }),
          I
        ] }, `absent-${_.id}`))
      ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(he, { children: [
        /* @__PURE__ */ a("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ a("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((_) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${w.has(_.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ a(_a, { "aria-hidden": "true" }),
              w.has(_.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ a(Bt, { tag: _ })
              ] }) : /* @__PURE__ */ a(Bt, { tag: _ })
            ]
          },
          _.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ a("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function ah({ entries: e }) {
  return /* @__PURE__ */ a("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ a("span", { className: "dq-attention-category", children: t.name }),
    si(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function oh({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: r,
  onSaveDefaults: o,
  editRequest: i = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: d,
  onStayOnTapChange: f
}) {
  var Ir;
  const u = Ke(e), g = Cn(u), m = u === "audio" ? "Audio" : "Scene", b = (p) => {
    var k;
    return p.title || ((k = p.files[0]) == null ? void 0 : k.basename) || m;
  }, y = (p) => `${p.occurrence ? `${p.occurrence.performer.name} — ` : ""}${b(p.media)}`, v = $(null), q = $("");
  if (!v.current)
    try {
      v.current = jo(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (p) {
      q.current = tn(p), v.current = { query: Nr(e), startAtEnd: !1 };
    }
  const [w, I] = T(null), [F, U] = T(""), _ = $(null), K = $(null), Z = $(null), ee = $(null), [ie, re] = T(!!q.current), x = $(0), [G, R] = T(v.current.query), E = $(G);
  E.current = G;
  const [J, H] = T(0), Y = $(v.current.startAtEnd), [te, B] = T([]), [S, ae] = T(null), C = $(null), [V, se] = T(null), [pe, D] = T(0), ye = be(() => {
    if (!S) return null;
    const p = te.findIndex((k) => k.key === S.key);
    return p < 0 ? null : te.slice(p + 1).find((k) => k.media.id !== S.media.id) ?? null;
  }, [S, te]), [Te, ue] = T(0), [Oe, Ge] = T(!1), [Ce, An] = T(!1), ve = $(!1), Je = $(!0), Et = $(null);
  W(() => (Je.current = !0, () => {
    Je.current = !1;
  }), []);
  const [mn, xe] = T(q.current), [ot, Re] = T(""), [Ze, Vt] = T(null), [Fe, Tn] = T(!1), [dt, Mt] = T([]), ft = $([]), zt = $(null), qt = $(null), er = $(null);
  W(() => {
    var p, k;
    Fe && ((k = (p = er.current) == null ? void 0 : p.querySelector("input")) == null || k.focus());
  }, [Fe]);
  const [Tt, In] = T(!1), [Jt, Ft] = T(!1), gn = ba(), [qe, Ct] = T(!1), it = d ?? qe, Dn = f ?? Ct;
  W(() => {
    if (Oe || Tt || !qt.current) return;
    const p = requestAnimationFrame(() => {
      if (document.querySelector(us)) return;
      const k = qt.current;
      qt.current = null;
      const O = document.activeElement;
      O && O !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(p);
  }, [Oe, Tt, J]);
  const [Ht, Pe] = T([]), [It, ce] = T({}), P = $(null), Ae = $(0), [ht, _n] = T({});
  W(() => {
    let p = !0;
    return Promise.all(
      bi(G.objectFilter).map(
        async (k) => [
          String(k),
          (await me(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      p && _n(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [G.objectFilter]);
  const ge = be(
    () => yi(G.objectFilter, ht),
    [ht, G.objectFilter]
  ), Rt = $(0), tt = $(e);
  tt.current = e;
  const Le = w ?? e, et = be(
    () => En(Le, G),
    [Le, G]
  ), Wt = be(
    () => ds(et, G.performerFocus),
    [et, G.performerFocus]
  ), st = $(Wt);
  st.current = Wt;
  const pt = $(et);
  pt.current = et;
  const [xt, Qt] = T("items"), [ct, jn] = T(null), Yt = $(null), Un = $("");
  function Pt(p) {
    const k = typeof p == "function" ? p(Yt.current) : p;
    Yt.current = k, jn(k);
  }
  const [bn, nn] = T(!1), [A, L] = T(null), Q = $(null), we = $e(et) ? Da(et) : "", [le, Me] = T(0), [Ie, Lt] = T(null);
  W(() => () => {
    var p;
    return (p = Q.current) == null ? void 0 : p.controller.abort();
  }, []), W(() => {
    const p = Q.current;
    !p || p.signature === we || (p.controller.abort(), Q.current = null, nn(!1));
  }, [we]), W(() => {
    var O;
    const p = Yt.current;
    if (xt !== "performers" || !we || ((O = Q.current) == null ? void 0 : O.signature) === we || Un.current === we || (p == null ? void 0 : p.signature) === we && p.complete)
      return;
    const k = (p == null ? void 0 : p.signature) === we ? p : null;
    Er(p, (k == null ? void 0 : k.limit) ?? mo);
  }, [xt, we, ct, A, bn]);
  const Ne = G.performerFocus;
  W(() => {
    if (!Ne) {
      Lt(null);
      return;
    }
    let p = !0;
    return me(`/api/performers/${Ne}`).then((k) => {
      const O = Jc(Ne, k.tags);
      p && Lt({ id: Ne, name: k.name, tags: O });
    }).catch(() => {
    }), () => {
      p = !1;
    };
  }, [Ne]);
  const ke = JSON.stringify(
    $e(et) ? Fs(et.occurrence) : []
  ), Se = be(() => JSON.parse(ke), [ke]), Dt = be(() => Vd(Se), [Se]), Rn = Zs(Dt), Kr = ga(Dt), Gr = (p) => {
    var k;
    return ((k = Kr[p]) == null ? void 0 : k.name) ?? (Kr[p] === null ? "Unavailable tag" : "…");
  }, Br = (p) => ({
    name: Gr(p),
    tagIds: Rn.get(p) ?? [p],
    resolved: Rn.has(p)
  }), St = Gc(
    $e(et) ? et : null,
    Ne ?? null,
    le
  ), Xt = ls(e, G), tr = ls(e, xa(e, G)), mt = Ce || Oe || Fe, yn = Number(G.filter.page);
  function _e(p, k = !1) {
    ve.current || (q.current = "", Y.current = k, E.current = p, R(p), ue(0), Ge(!0), k || aa(e.id, p), H((O) => O + 1));
  }
  function nt() {
    if (ve.current = !1, An(!1), Je.current && Et.current) {
      const p = Et.current;
      Et.current = null, _e(p.query, p.startAtEnd);
    }
  }
  W(() => {
    const p = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = jo(
            tt.current,
            new URLSearchParams(window.location.search)
          );
          ve.current ? Et.current = k : _e(k.query, k.startAtEnd);
        } catch (k) {
          xe(tn(k));
        }
    };
    return window.addEventListener("popstate", p), () => window.removeEventListener("popstate", p);
  }, [e.id]), W(() => (r(Ce || Oe || Fe || !!w), () => r(!1)), [Ce, Oe, Fe, !!w, r]);
  async function gt(p, k, O) {
    if ($e(p)) {
      const fe = await Pc(
        p,
        P.current,
        k,
        O
      );
      return {
        items: fe.items.map((de) => ({
          key: de.key,
          media: de.media,
          occurrence: de
        })),
        totalCount: fe.totalCount
      };
    }
    const ne = await ra(
      p,
      { ...p.view.filter, page: k },
      O
    );
    return {
      items: ne.items.map((fe) => ({ key: String(fe.id), media: fe })),
      totalCount: ne.totalCount
    };
  }
  function bt(p, k, O, ne = !1, fe = !1) {
    if (!Je.current || Et.current) return;
    re(!0), B(
      fe ? p.items : po(p.items, E.current.startFrom === "end")
    ), ue(p.totalCount), _t(O, ne);
    const de = {
      ...E.current,
      filter: { ...E.current.filter, page: k }
    };
    E.current = de, R(de), aa(e.id, de);
  }
  function _t(p, k = !1) {
    (p == null ? void 0 : p.key) !== (S == null ? void 0 : S.key) && (C.current = null), (p == null ? void 0 : p.media.id) !== (S == null ? void 0 : S.media.id) && se(k && p ? p.media.id : null), ae(p);
  }
  W(() => {
    if (q.current) return;
    const p = new AbortController();
    ee.current = p;
    const k = ++Rt.current;
    return Ge(!0), xe(""), Re(""), C.current = null, se(null), ae(null), B([]), Tn(!1), (async () => {
      const O = ds(
        En(tt.current, E.current),
        E.current.performerFocus
      );
      P.current = $e(O) ? await wi(O, p.signal) : null;
      let ne = Number(O.view.filter.page), fe = await gt(O, ne, p.signal);
      const de = Math.max(
        1,
        Math.ceil(fe.totalCount / Number(O.view.filter.perPage))
      );
      (Y.current || ne > de) && (ne = de, fe = await gt(O, ne, p.signal)), Y.current = !1;
      const Ye = O.view.startFrom === "end" ? -1 : 1;
      for (; $e(O) && !fe.items.length && ne + Ye >= 1 && ne + Ye <= de && !p.signal.aborted; )
        ne += Ye, fe = await gt(O, ne, p.signal);
      if (k !== Rt.current || p.signal.aborted) return;
      const Ot = po(fe.items, O.view.startFrom === "end");
      bt(fe, ne, Ot[0] ?? null);
    })().catch((O) => {
      !p.signal.aborted && k === Rt.current && xe(tn(O));
    }).finally(() => {
      !p.signal.aborted && k === Rt.current && (re(!0), Ge(!1));
    }), () => {
      p.abort(), Rt.current++;
    };
  }, [J, e.id]), W(() => {
    if (Vt(null), !S) return;
    let p = !0;
    return hn(u, S).then((k) => {
      p && (Vt(k), Pe(
        $e(e) ? k.ids.filter((O) => e.occurrence.tagIds.includes(O)) : []
      ));
    }).catch((k) => {
      p && xe(`Could not load current tags. ${tn(k)}`);
    }), () => {
      p = !1;
    };
  }, [S]), W(() => {
    if (!$e(e) || e.actions.length)
      return;
    let p = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await me(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      p && ce(Object.fromEntries(k));
    }).catch((k) => {
      p && xe(tn(k));
    }), () => {
      p = !1;
    };
  }, [e]);
  async function jt(p = !1, k = !1, O = !1) {
    var Sn;
    if (!S) return;
    const ne = te.findIndex((He) => He.key === S.key), fe = G.startFrom === "end" ? -1 : 1, de = ((Sn = C.current) == null ? void 0 : Sn.key) === S.key ? C.current : { key: S.key, page: yn, before: te.slice(0, ne + 1).map((He) => He.key), after: te.slice(ne + 1).map((He) => He.key) }, Ye = new Set(de.after), Ot = new Set(de.before), Ve = te.find((He) => {
      var dn;
      return Ye.has(He.key) || (fe === 1 || yn < de.page) && ((dn = C.current) == null ? void 0 : dn.key) === S.key && !Ot.has(He.key);
    });
    if (!p && Ve) {
      _t(Ve, O);
      return;
    }
    const yt = p ? Ot : new Set(te.map((He) => He.key)), lt = 1100 - (Date.now() - Ae.current);
    lt > 0 && await new Promise((He) => window.setTimeout(He, lt));
    let ze = fe === -1 && !p ? Math.max(1, yn - 1) : yn;
    for (; Je.current && !Et.current; ) {
      let He = await gt(Wt, ze);
      const dn = Math.max(
        1,
        Math.ceil(He.totalCount / Number(G.filter.perPage))
      );
      ze > dn && (ze = dn, He = await gt(Wt, ze));
      const Ut = po(He.items, fe === -1), Yr = new Map(Ut.map((At) => [At.key, At])), ka = p ? de.after.flatMap((At) => {
        const $r = Yr.get(At);
        return $r ? [$r] : [];
      }) : [], Ea = new Set(ka.map((At) => At.key)), fr = p ? {
        ...He,
        items: [
          ...ka,
          ...Ut.filter(
            (At) => At.key !== S.key && !Ea.has(At.key)
          )
        ]
      } : He;
      if (k) {
        C.current = de, bt(fr, ze, S, !1, p);
        return;
      }
      const Rr = fe === -1 && yn === 1 && !p ? void 0 : fr.items.find(
        (At) => !yt.has(At.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(p && fe === -1 && ze === de.page) || Ye.has(At.key))
      );
      if (Rr || (fe === -1 ? ze <= 1 : ze >= dn)) {
        bt(
          fr,
          ze,
          Rr ?? null,
          O,
          p
        ), Rr || Re(
          He.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      ze += fe;
    }
  }
  async function rn(p, k = !1, O = !1, ne = !1) {
    if (w || !S || ve.current || Oe || Fe && !O)
      return;
    const fe = O || ne || !!(p != null && p.steps.length);
    if (fe && (!t || !Ze) || p && Qn(p) && !n) return;
    const de = !k && !O && !ne && fe && p !== void 0 && Ze !== null && Ki(e) && Ao(Co(e.actions, Gd(p, Ze, cn))).length > 0;
    ve.current = !0, An(!0), xe(""), Re("");
    const Ye = te.findIndex((lt) => lt.key === S.key), Ot = fe && !k && !de && Ye >= 0 ? te[Ye + 1] ?? null : null;
    Ot && (B(
      (lt) => lt.filter((ze) => ze.key !== S.key)
    ), _t(Ot, !0));
    let Ve = !1, yt = [];
    try {
      if (fe) {
        const lt = await hn(u, S);
        if (p)
          await pf(Wt, S, p);
        else {
          const Sn = ne && $e(e) ? e.occurrence.tagIds.filter((Ut) => lt.ids.includes(Ut)) : ft.current, dn = _r(Sn, ne ? Ht : dt);
          await qi(Wt, S, dn);
        }
        Ae.current = Date.now();
        const ze = await hn(u, S);
        Ot || Vt(ze), Ve = !0, Tn(!1), de && (yt = Ao(Co(e.actions, ze))), Re(
          yt.length ? `Tags saved. Staying until answered: ${yt.map((Sn) => Sn.name).join(", ")}.` : "Tags saved."
        ), S.occurrence && (va(S.occurrence.performer.id), Me((Sn) => Sn + 1));
      }
      if (!Je.current || Et.current) return;
      fe ? yt.length || await jt(!0, k, !k) : k || await jt(), k && O && requestAnimationFrame(() => {
        var lt;
        return (lt = zt.current) == null ? void 0 : lt.focus();
      });
    } catch (lt) {
      if (xe(
        Ve ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${tn(lt)}` : fe ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${tn(lt)}` : `Could not advance. ${tn(lt)}`
      ), fe && !Ve) {
        Ot && (B(te), se(null), D((ze) => ze + 1), ae(S)), Ae.current = Date.now();
        try {
          Vt(await hn(u, S));
        } catch {
          Vt(null), xe(
            (ze) => `${ze} Current tags could not be refreshed; reload tags before retrying.`
          );
        }
      }
    } finally {
      nt();
    }
  }
  const nr = !Fe && !w && !Tt && !Jt && (S != null || Oe || Ce);
  ci({
    surface: "local",
    enabled: nr,
    actions: e.actions,
    onAction: (p, k) => {
      const O = e.actions[p];
      O && rn(O, k);
    },
    onFind: () => Ft(!0)
  });
  const an = (p) => Ce || Oe || !Ze || !!w || !t && p.steps.length > 0 || !n && Qn(p);
  function Zt() {
    !o || w || ve.current || Fe || (Z.current = document.activeElement, K.current = {
      error: mn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(E.current),
      items: te,
      current: S,
      total: Te,
      targets: P.current,
      stayedCursor: C.current
    }, I(structuredClone(e)), U(""), Re(""), xe(""));
  }
  W(() => {
    if (!i) {
      x.current = 0;
      return;
    }
    i !== x.current && ie && !Oe && (x.current = i, Zt(), s == null || s());
  }, [i, Oe, ie]);
  function Sr() {
    I(null), U(""), requestAnimationFrame(() => {
      const p = Z.current;
      p != null && p.isConnected && p !== document.body && p.focus();
    });
  }
  function kr() {
    var k;
    const p = K.current;
    !p || Ce || ((k = ee.current) == null || k.abort(), Rt.current++, E.current = p.query, R(p.query), B(p.items), ae(p.current), ue(p.total), P.current = p.targets, C.current = p.stayedCursor, Ge(!1), xe(p.error), Re(""), window.history.replaceState(window.history.state, "", p.url), Sr());
  }
  async function wa() {
    if (!w || !o || ve.current) return;
    const p = En(
      { ...w, name: w.name.trim() },
      xa(tt.current, E.current)
    ), k = ca(p);
    if (k) {
      U(k);
      return;
    }
    ve.current = !0, An(!0), U("");
    try {
      if (await o(p) === !1) throw new Error("Could not save review.");
      Sr(), Re("Review saved.");
    } catch (O) {
      U(
        "Could not save review. Your edits are still open. " + tn(O)
      );
    } finally {
      nt();
    }
  }
  async function De() {
    if (!o || ve.current) return;
    const p = xa(tt.current, E.current), k = En(tt.current, {
      ...p,
      filter: { ...p.filter, page: 1 }
    });
    ve.current = !0, An(!0), xe("");
    try {
      if (await o(k) === !1) throw new Error("Could not save review.");
      Re("Queue saved to this review.");
    } catch (O) {
      xe("Could not save queue. " + tn(O));
    } finally {
      nt();
    }
  }
  const ut = G.performerScope, wn = (p) => {
    const { performerFocus: k, ...O } = E.current, ne = k && !("targetMode" in p || "performerIds" in p || "performerFilter" in p);
    _e({
      ...O,
      ...ne ? { performerFocus: k } : {},
      filter: { ...O.filter, page: 1 },
      performerScope: { ...ut, ...p }
    });
  };
  async function Er(p, k) {
    var fe;
    const O = pt.current;
    if (!$e(O)) return;
    (fe = Q.current) == null || fe.controller.abort();
    const ne = {
      signature: Da(O),
      controller: new AbortController()
    };
    Q.current = ne, Un.current = "", nn(!0), L(null);
    try {
      const de = await Gf(O, p, k, ne.controller.signal, {
        onProgress: (Ye) => {
          Q.current === ne && Pt(Ye);
        }
      });
      Q.current === ne && Pt(de);
    } catch (de) {
      Q.current === ne && !ne.controller.signal.aborted && (Un.current = ne.signature, L({ signature: ne.signature, message: tn(de) }));
    } finally {
      Q.current === ne && (Q.current = null, nn(!1));
    }
  }
  function vn() {
    var p;
    (p = Q.current) == null || p.controller.abort(), Q.current = null, nn(!1), Pt((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function va(p) {
    var fe;
    const k = pt.current;
    if (!$e(k)) return;
    if (Q.current) {
      vn();
      return;
    }
    const O = Da(k);
    if (((fe = Yt.current) == null ? void 0 : fe.signature) !== O || Yt.current.partial) return;
    const ne = 1100 - (Date.now() - Ae.current);
    ne > 0 && await new Promise((de) => window.setTimeout(de, ne));
    try {
      const de = await Vc(k, p);
      if (Q.current) {
        vn();
        return;
      }
      Pt(
        (Ye) => (Ye == null ? void 0 : Ye.signature) === O ? Bf(Ye, p, de) : Ye
      );
    } catch {
      Pt(
        (de) => (de == null ? void 0 : de.signature) === O ? { ...de, partial: !0, complete: !1 } : de
      );
    }
  }
  const rr = G.performerFocus ? ct == null ? void 0 : ct.candidates.find((p) => p.id === G.performerFocus) : void 0, rt = Ie && Ie.id === G.performerFocus ? { ...Ie, flags: pr(Se, Ie.tags) } : rr ? { ...rr, flags: pr(Se, rr.tags) } : null, on = (p) => {
    if ((Ie == null ? void 0 : Ie.id) === p)
      return pr(Se, Ie.tags);
    const k = ct == null ? void 0 : ct.candidates.find((O) => O.id === p);
    return k ? pr(Se, k.tags) : void 0;
  }, sn = ((Ir = S == null ? void 0 : S.occurrence) == null ? void 0 : Ir.performer.id) ?? null, Nn = sn === null ? void 0 : on(sn), je = zf(
    Se.length > 0 && sn !== null && sn !== G.performerFocus && Nn === void 0 ? sn : null
  ), Vr = Nn ?? (je ? pr(Se, je) : []), cn = Xs(Le.actions), Cr = St.summary && G.performerFocus ? ii(Si(St.summary, Le.actions, cn)) : [], ar = Gi(Se, (rt == null ? void 0 : rt.flags) ?? [], Br), or = rc(
    Gi(Se, Vr, Br),
    sn !== null && sn === G.performerFocus ? Cr : []
  ), zr = JSON.stringify(or), Ar = be(() => or, [zr]), ir = JSON.stringify(ar), Jr = be(() => ar, [ir]), $n = (p) => Xd(Se, p, Gr);
  function sr(p) {
    if (ve.current) return;
    const k = {
      ...E.current,
      performerFocus: p,
      filter: { ...E.current.filter, page: 1 }
    };
    _e(k, k.startFrom === "end"), Qt("items");
  }
  function Xa() {
    const { performerFocus: p, ...k } = E.current;
    _e(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const cr = $(null);
  cr.current ?? (cr.current = hc());
  const Na = cr.current, Za = be(
    () => Le.actions.flatMap((p) => p.steps.flatMap((k) => k.tagIds)),
    [Le.actions]
  ), qa = $(null);
  W(() => {
    const p = qa.current, k = p == null ? void 0 : p.querySelector('[aria-current="true"]');
    if (!p || !k) return;
    const O = p.getBoundingClientRect(), ne = k.getBoundingClientRect();
    ne.top < O.top ? p.scrollTop -= O.top - ne.top : ne.bottom > O.bottom && (p.scrollTop += ne.bottom - O.bottom);
  }, [S == null ? void 0 : S.key, xt]);
  const Tr = $(null), Hr = $(null);
  W(() => {
    var O, ne;
    const p = Hr.current;
    if (!p) return;
    Hr.current = null;
    const k = [...((O = Tr.current) == null ? void 0 : O.querySelectorAll(".dq-partner")) ?? []];
    (ne = k.find((fe) => fe.dataset.partnerKey === p) ?? k[0]) == null || ne.focus();
  }, [S == null ? void 0 : S.key]);
  const $t = Ce || Oe || Fe || !!w, qn = be(
    () => w ? En(w, xa(e, G)) : null,
    [w, e, G]
  ), lr = be(
    () => qn != null && Lr(yr(qn)) !== Lr(yr(e)),
    [qn, e]
  );
  function Kn() {
    S ? hn(u, S).then(Vt).catch((p) => xe(tn(p))) : _e(E.current);
  }
  const Gn = mn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    mn,
    " ",
    /* @__PURE__ */ a("button", { type: "button", disabled: Ce, onClick: Kn, children: S ? "Reload tags" : "Retry queue" })
  ] }) : null, ln = Ce || Oe || S != null && !Ze, dr = Math.max(1, Number(G.filter.perPage) || 1), ur = $(1);
  Oe || (ur.current = Math.max(1, Math.ceil(Te / dr)));
  const Wr = ur.current, Sa = ut && S ? te.filter(
    (p) => p.media.id === S.media.id && p.key !== S.key
  ) : [], eo = (p) => {
    var k;
    return p.title || ((k = p.files[0]) == null ? void 0 : k.basename) || `${u === "audio" ? "Audio" : "Video"} ${p.id}`;
  }, Qr = S ? th(S.media, u) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${u === "audio" ? " dq-audio" : ""}`,
      "aria-label": ut ? u === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : u === "audio" ? "Audio review" : "Video review",
      onClickCapture: (p) => {
        var ne;
        const k = p.target instanceof Element ? p.target.closest("button") : null, O = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((ne = k == null ? void 0 : k.textContent) == null ? void 0 : ne.trim()) ?? "";
        k && !k.closest(us) && /^(Filters|Edit filter:|Edit criteria)/.test(O) && (qt.current = k);
      },
      children: [
        /* @__PURE__ */ a(
          Rc,
          {
            name: e.name,
            description: e.description,
            entityType: Ue(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: $t || !!(c != null && c.busy),
            onEdit: w ? () => {
              var p;
              return (p = _.current) == null ? void 0 : p.focus();
            } : Zt,
            editDisabled: !w && ($t || !o || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Ce || Fe, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: u === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ a(
                  oa,
                  {
                    filter: G.filter,
                    objectFilter: ge,
                    criteriaDefinitions: u === "audio" ? Ns : Bo,
                    customFieldEntityType: u,
                    totalCount: Te,
                    sortOptions: u === "audio" ? Tl : qs,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a(
                      $c,
                      {
                        page: Math.min(Math.max(1, yn || 1), Wr),
                        pages: Wr,
                        onPage: (p) => _e({
                          ...E.current,
                          filter: Gt(
                            { ...E.current.filter, page: p },
                            u
                          )
                        })
                      }
                    ),
                    onFilterChange: (p) => {
                      (p.sort !== E.current.filter.sort || p.direction !== E.current.filter.direction) && (p = { ...p, sorts: void 0 }), _e({
                        ...E.current,
                        filter: Gt(p, u)
                      });
                    },
                    onObjectFilterChange: (p) => {
                      _e({
                        ...E.current,
                        objectFilter: Mc(
                          p,
                          ht,
                          E.current.objectFilter
                        ),
                        filter: { ...E.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(he, { children: [
              ut && /* @__PURE__ */ a(
                jf,
                {
                  scope: ut,
                  disabled: Ce || Fe,
                  editing: !!w,
                  onChange: wn,
                  onEditCriteria: () => In(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ a(
                Oc,
                {
                  mode: "single",
                  disabled: $t || !!c.busy,
                  onChange: () => {
                    var p;
                    return (p = c.onGrid) == null ? void 0 : p.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(he, { children: [
              $e(Wt) && t && /* @__PURE__ */ a(
                $f,
                {
                  review: Wt,
                  disabled: mt || !!w,
                  performerAttention: G.performerFocus ? Jr : void 0,
                  trees: cn,
                  onOpen: () => {
                    ve.current = !0, An(!0);
                  },
                  onWrite: () => {
                    Ae.current = Date.now();
                  },
                  onClose: (p) => {
                    if (p) {
                      Ae.current = Date.now();
                      const k = E.current.performerFocus;
                      k ? va(k) : vn(), Me((O) => O + 1), new Promise((O) => window.setTimeout(O, 1100)).then(() => {
                        nt(), Je.current && (q.current || Ge(!0), H((O) => O + 1));
                      });
                    } else nt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ a(
                pi,
                {
                  disabled: $t,
                  items: c.moreItems({
                    onSelect: Zt,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: G.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ a(
                Pr,
                {
                  performer: {
                    id: G.performerFocus,
                    name: (rt == null ? void 0 : rt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ a("strong", { children: (rt == null ? void 0 : rt.name) ?? `performer ${G.performerFocus}` })
              ] }),
              rt != null && rt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: $n(rt.flags), children: [
                /* @__PURE__ */ a(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ a("span", { className: "dq-sr-only", children: $n(rt.flags) })
              ] }) : null,
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: mt,
                  onClick: Xa,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Xt,
            queueChange: !w && Xt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: tr ? () => void De() : void 0,
              saveDisabled: mt || !o,
              onReset: () => {
                const p = Nr(e);
                _e(p, p.startFrom === "end");
              },
              resetDisabled: mt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          w && qn && /* @__PURE__ */ a(
            Ic,
            {
              drawerRef: _,
              draft: qn,
              onChange: (p) => I(p),
              direction: G.startFrom,
              onDirectionChange: (p) => _e({ ...E.current, startFrom: p }),
              tagGroups: eh,
              trees: cn,
              saving: Ce,
              saveDisabled: Oe,
              error: F,
              dirty: lr,
              criteriaChanged: tr,
              notices: Gn && /* @__PURE__ */ a("div", { className: "dq-review-feedback", children: Gn }),
              onSave: () => void wa(),
              onCancel: kr
            }
          ),
          /* @__PURE__ */ a("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              S ? /* @__PURE__ */ l(he, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ a("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${u}/${S.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ a("span", { children: eo(S.media) }),
                        /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Qr && /* @__PURE__ */ a("span", { className: "dq-stage-meta", children: Qr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ a("div", { className: "dq-player-frame", children: [S, ye].filter(Boolean).map((p) => {
                    var ne, fe, de, Ye, Ot;
                    const k = p, O = k.key === S.key;
                    return /* @__PURE__ */ a(
                      "div",
                      {
                        className: O ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": O ? void 0 : !0,
                        inert: O ? void 0 : !0,
                        children: u === "audio" ? /* @__PURE__ */ a(
                          Il,
                          {
                            streamUrl: ko("audio", k.media.id),
                            format: ((ne = k.media.files[0]) == null ? void 0 : ne.format) ?? "",
                            title: b(k.media),
                            coverUrl: O ? So("audio", k.media) : void 0,
                            duration: ((fe = k.media.files[0]) == null ? void 0 : fe.duration) ?? 0,
                            autostart: O && V === k.media.id
                          }
                        ) : /* @__PURE__ */ a(
                          Ss,
                          {
                            videoId: k.media.id,
                            streamUrl: ko("video", k.media.id),
                            posterUrl: O ? So("video", k.media) : void 0,
                            duration: ((de = k.media.files[0]) == null ? void 0 : de.duration) ?? 0,
                            format: (Ye = k.media.files[0]) == null ? void 0 : Ye.format,
                            audioCodec: (Ot = k.media.files[0]) == null ? void 0 : Ot.audioCodec,
                            extensionSurface: O ? "quick-view" : void 0,
                            autostart: O && V === k.media.id,
                            keyboardShortcutsEnabled: O,
                            showAbLoop: O,
                            clip: k.media.parentVideoId != null ? {
                              start: k.media.clipStartSec ?? 0,
                              end: k.media.clipEndSec,
                              loop: !1
                            } : void 0
                          }
                        )
                      },
                      `${k.media.id}:${pe}`
                    );
                  }) }),
                  u === "audio" && /* @__PURE__ */ a(
                    Mf,
                    {
                      details: S.media.details,
                      label: g.one
                    },
                    S.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ a("p", { role: "status", className: "dq-stage-status", children: Oe ? "Loading review…" : Te ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Le.actions.length > 0 ? /* @__PURE__ */ a(
                fu,
                {
                  actions: Le.actions,
                  isDisabled: (p) => Fe || an(p),
                  busy: ln,
                  tags: Ze,
                  trees: cn,
                  preview: Na,
                  onApply: (p, k) => void rn(p, k),
                  onFind: () => Ft(!0),
                  findDisabled: Fe || !!w,
                  paused: !!w,
                  waitForGroups: Ki(Le),
                  attention: Ar,
                  stayOnTap: it,
                  onStayOnTapChange: Dn
                }
              ) : $e(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ce || Fe || !Ze || !!w || !S,
                  children: [
                    /* @__PURE__ */ a("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((p) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ a(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Ht.includes(p),
                          onChange: (k) => Pe(
                            e.occurrence.multiple ? k.target.checked ? [...Ht, p] : Ht.filter((O) => O !== p) : [p]
                          )
                        }
                      ),
                      It[p] ?? "Loading tag…"
                    ] }, p)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Pe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void rn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ a(
                        "button",
                        {
                          type: "button",
                          className: "dq-button primary",
                          onClick: () => void rn(void 0, !1, !1, !0),
                          children: "Save & next performer"
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-panel", "aria-label": "Current item", children: [
              /* @__PURE__ */ l("div", { className: "dq-panel-body", ref: Tr, children: [
                S && /* @__PURE__ */ l(he, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ a("span", { className: "dq-sr-only", children: S.occurrence ? S.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      S.occurrence && /* @__PURE__ */ a(Pr, { performer: S.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: S.occurrence ? S.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ a("p", { className: "dq-reviewing-note", children: ut ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Ar.length > 0 && /* @__PURE__ */ a(ah, { entries: Ar })
                  ] }),
                  Sa.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ a("div", { className: "dq-partners", children: Sa.map((p) => {
                          var k, O, ne;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = p.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (O = p.occurrence) == null ? void 0 : O.performer.name,
                              "data-partner-key": p.key,
                              disabled: mt,
                              onClick: () => {
                                Hr.current = S.key, _t(p), xe("");
                              },
                              children: [
                                p.occurrence && /* @__PURE__ */ a(Pr, { performer: p.occurrence.performer }),
                                /* @__PURE__ */ a("span", { children: (ne = p.occurrence) == null ? void 0 : ne.performer.name })
                              ]
                            },
                            p.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ a(
                    rh,
                    {
                      tags: Ze,
                      preview: Na,
                      showPreview: !Fe,
                      trees: cn,
                      actionTagIds: Za,
                      label: `Current ${ut ? "occurrence" : g.one} tags`
                    }
                  ),
                  Fe && /* @__PURE__ */ l(
                    "fieldset",
                    {
                      ref: er,
                      disabled: Ce,
                      className: "dq-panel-section dq-tag-editor",
                      children: [
                        /* @__PURE__ */ l("legend", { className: "dq-eyebrow", children: [
                          "Edit ",
                          ut ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ a(
                          Yn,
                          {
                            entityType: "tag",
                            values: dt,
                            onChange: Mt,
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
                              disabled: !Ze,
                              onClick: () => void rn(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ a(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !Ze,
                              onClick: () => void rn(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ a(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Tn(!1), requestAnimationFrame(() => {
                                  var p;
                                  return (p = zt.current) == null ? void 0 : p.focus();
                                });
                              },
                              children: "Cancel"
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] }),
                $e(et) && G.performerFocus && /* @__PURE__ */ a(
                  Po,
                  {
                    ...St,
                    mediaKind: u,
                    actions: Le.actions,
                    trees: cn,
                    flags: Jr
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Gn,
                  ot && /* @__PURE__ */ a("p", { role: "status", children: ot })
                ] }),
                !t && /* @__PURE__ */ a("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                S && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": ln || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: zt,
                      className: "dq-button",
                      disabled: mt || !!w || !t || !Ze,
                      onClick: () => {
                        ft.current = [...Ze.ids], Mt([...Ze.ids]), Tn(!0);
                      },
                      children: [
                        /* @__PURE__ */ a(Is, { "aria-hidden": "true" }),
                        "Edit tags"
                      ]
                    }
                  ),
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-button",
                      disabled: mt || !!w,
                      onClick: () => void rn(),
                      children: [
                        /* @__PURE__ */ a(Bl, { "aria-hidden": "true" }),
                        "Skip",
                        ut ? " performer" : ` ${g.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              ut && /* @__PURE__ */ l(
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
                        "aria-pressed": xt === "items",
                        onClick: () => Qt("items"),
                        children: u === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ a(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": xt === "performers",
                        onClick: () => Qt("performers"),
                        children: "Performers"
                      }
                    )
                  ]
                }
              ),
              ut && xt === "performers" ? /* @__PURE__ */ a(
                xf,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === we ? ct : null,
                  busy: bn,
                  error: (A == null ? void 0 : A.signature) === we ? A.message : "",
                  focus: G.performerFocus,
                  disabled: mt,
                  labels: g,
                  flagLabel: $n,
                  onFocus: sr,
                  onMore: () => {
                    const p = Yt.current;
                    p && Er(p, p.limit + mo);
                  },
                  onRefresh: () => {
                    Pt(null), Er(null, mo);
                  }
                }
              ) : /* @__PURE__ */ a("div", { className: "dq-queue-list", ref: qa, children: te.map((p) => {
                var O;
                const k = (S == null ? void 0 : S.key) === p.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(p),
                    "aria-label": y(p),
                    "aria-current": k ? "true" : void 0,
                    disabled: mt,
                    onClick: () => {
                      _t(p), xe(""), Re("");
                    },
                    children: [
                      /* @__PURE__ */ a(nh, { media: p.media, kind: u }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ a("span", { className: "dq-queue-row-title", children: b(p.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          p.occurrence && /* @__PURE__ */ l(he, { children: [
                            /* @__PURE__ */ a(Pr, { performer: p.occurrence.performer }),
                            /* @__PURE__ */ a("span", { className: "dq-queue-row-performer", children: p.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ a("span", { className: "dq-queue-row-detail", children: [
                            p.media.date,
                            p.occurrence ? "" : (O = p.media.files[0]) != null && O.duration ? ks(p.media.files[0].duration) : ""
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
        ut && /* @__PURE__ */ a(
          Rl,
          {
            open: Tt,
            onClose: () => In(!1),
            criteria: Go,
            activeFilter: ut.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (p) => {
              In(!1), wn({ performerFilter: p });
            }
          }
        ),
        Jt && /* @__PURE__ */ a(
          ui,
          {
            actions: e.actions,
            trees: cn,
            isDisabled: (p) => an(p),
            tapStays: gn && it,
            onApply: (p, k) => {
              Ft(!1), rn(p, k);
            },
            onClose: () => Ft(!1)
          }
        )
      ]
    }
  );
}
const Yc = "data-quality.reviews-sort.v1", ih = { sort: "name", direction: "asc" };
function sh() {
  try {
    const e = JSON.parse(localStorage.getItem(Yc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return ih;
}
function ch(e) {
  try {
    localStorage.setItem(
      Yc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Xc(e, t, n, r) {
  const o = r === "asc" ? 1 : -1;
  return [...e].sort((i, s) => {
    if (n === "count") {
      const c = t[i.id], d = t[s.id], f = typeof c == "number", u = typeof d == "number";
      if (f !== u) return f ? -1 : 1;
      if (f && u && c !== d)
        return (c - d) * o;
    }
    return i.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * o;
  });
}
function go(e, t) {
  const n = Ue(e), r = Cn(Yo(n)), o = n === "tag" ? "tag" : $e(e) ? r.queue : r.one;
  return t === 1 ? o : `${o}s`;
}
function lh({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      go(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      go(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(he, { children: [
    /* @__PURE__ */ a("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      go(e, t)
    ] })
  ] });
}
function dh({
  reviews: e,
  counts: t,
  sort: n,
  direction: r,
  onSortChange: o,
  onDirectionChange: i,
  storage: s,
  canConfigure: c,
  busy: d,
  headingRef: f,
  notices: u,
  onOpen: g,
  onNew: m,
  onImport: b,
  onExportAll: y,
  rowMenuItems: v
}) {
  const q = $(null), w = be(
    () => Xc(e, t, n, r),
    [e, t, n, r]
  ), I = e.every((U) => t[U.id] !== void 0), F = r === "asc" ? "ascending" : "descending";
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
            disabled: !c || d,
            onClick: () => {
              var U;
              return (U = q.current) == null ? void 0 : U.click();
            },
            children: [
              /* @__PURE__ */ a(Vl, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ a(
          "input",
          {
            ref: q,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (U) => {
              var K;
              const _ = (K = U.target.files) == null ? void 0 : K[0];
              U.target.value = "", _ && b(_);
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
              /* @__PURE__ */ a(Ms, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || d,
            onClick: m,
            children: [
              /* @__PURE__ */ a(Va, { "aria-hidden": "true" }),
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
          s
        ] }),
        /* @__PURE__ */ a("span", { className: "dq-sr-only", role: "status", children: I ? e.some((U) => t[U.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ a("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (U) => o(U.target.value),
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
              "aria-label": `Sort direction: ${F}`,
              title: `Sort direction: ${F}`,
              onClick: () => i(r === "asc" ? "desc" : "asc"),
              children: r === "asc" ? /* @__PURE__ */ a(zl, { "aria-hidden": "true" }) : /* @__PURE__ */ a(Jl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ a("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ a("th", { scope: "col", "aria-sort": n === "name" ? F : void 0, children: "Review" }),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ a(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? F : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ a("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ a("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ a("tbody", { children: w.map((U) => {
          const _ = Ue(U);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ a("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(U.id)}`,
                "data-review-id": U.id,
                onClick: (K) => {
                  K.button !== 0 || K.metaKey || K.ctrlKey || K.shiftKey || K.altKey || (K.preventDefault(), g(U.id));
                },
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ a(Cc, { entityType: _ }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ a("span", { className: "dq-reviews-name", children: U.name }),
                    U.description && /* @__PURE__ */ a("span", { className: "dq-reviews-description", title: U.description, children: U.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-type", children: Ec[_] }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-count", children: /* @__PURE__ */ a(lh, { review: U, count: t[U.id] }) }),
            /* @__PURE__ */ a("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ a(pi, { label: `Actions for ${U.name}`, items: v(U) }) })
          ] }, U.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ a(za, { "aria-hidden": "true" }),
      /* @__PURE__ */ a("p", { children: "No reviews yet." }),
      /* @__PURE__ */ a("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Zc(e, { id: t, name: n, description: r }) {
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
function uh({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: r
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), d = $(null), f = $(i);
  f.current = i;
  const u = $(null), g = at();
  W(() => {
    var y;
    return u.current ?? (u.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = d.current) == null || y.focus(), () => {
      var v;
      (v = u.current) != null && v.isConnected && u.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = $(i);
  W(() => {
    var q, w;
    const y = document.activeElement, v = !y || y === document.body || !((q = c.current) != null && q.contains(y));
    s && (!o.name.trim() || m.current && !i && v) && ((w = d.current) == null || w.focus()), m.current = i;
  }, [s, i]);
  const b = () => {
    f.current || r();
  };
  return /* @__PURE__ */ a(
    "dialog",
    {
      ref: c,
      className: "dq-form-dialog",
      "aria-labelledby": g,
      "aria-modal": "true",
      onCancel: (y) => {
        y.preventDefault(), b();
      },
      onClose: () => {
        var y;
        f.current ? (y = c.current) == null || y.showModal() : r();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), f.current || n();
          },
          children: [
            /* @__PURE__ */ l("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ a("h2", { id: g, children: "New review" }),
              /* @__PURE__ */ a(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: i,
                  onClick: b,
                  children: /* @__PURE__ */ a(fa, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ a("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ a(
                  Tc,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Ue(o) && t(Zc(y, o));
                    },
                    nameRef: d
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ a("button", { type: "button", className: "dq-text-button", onClick: () => hi(o), children: "Export draft" }),
              /* @__PURE__ */ a("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ a("button", { type: "button", className: "dq-button", disabled: i, onClick: b, children: "Cancel" }),
              /* @__PURE__ */ a("button", { type: "submit", className: "dq-button primary", "aria-disabled": i || void 0, children: i ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const fh = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function hh(e, t, n, r) {
  return Qc(
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
function fs(e, t) {
  return Ue(t) === "video" && ya(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function hs(e, t) {
  return vr(
    JSON.parse(Jn(yr(e))),
    JSON.parse(Jn(yr(t)))
  );
}
const bo = 180;
function ps(e) {
  return Ue(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function ms(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function gs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function yo(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Ya.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const r = n.toString();
  Wc(`${window.location.pathname}${r ? `?${r}` : ""}`, { openingFromList: t });
}
function ph(e) {
  return Gt({ ...e, page: 1 });
}
function el(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Fr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const mh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Jo, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ a(Ql, { "aria-hidden": "true" }) }
], gh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ a(Jo, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ a(Wl, { "aria-hidden": "true" }) }
], bs = [], tl = "(min-width: 900px)";
function bh(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(tl);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function yh() {
  return typeof window.matchMedia == "function" && window.matchMedia(tl).matches;
}
function wh({
  onNavigate: e
}) {
  const [t, n] = T([]), [r] = T(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = T(""), [s, c] = T(!0), [d, f] = T(""), [u, g] = T(!1), [m, b] = T(!1), [y, v] = T(!1), [q, w] = T(!1), [I, F] = T([]), [U, _] = T(""), [K, Z] = T(!0), [ee, ie] = T("account"), [re, x] = T(""), [G, R] = T(""), [E, J] = T(!1), [H, Y] = T(!1), [te, B] = T(""), [S, ae] = T(gs), C = $(S);
  C.current = S;
  const [V, se] = T({}), pe = $(V);
  pe.current = V;
  const D = $(t);
  D.current = t;
  const ye = $(s);
  ye.current = s;
  const Te = $(!1), ue = $(!0);
  W(() => (ue.current = !0, () => {
    ue.current = !1;
  }), []);
  const [Oe, Ge] = T(!S);
  Oe !== !S && (Ge(!S), S || se({}));
  const [Ce, An] = T(sh), { sort: ve, direction: Je } = Ce, Et = (h) => {
    const N = { ...Ce, ...h };
    An(N), ch(N);
  }, mn = $(null), xe = $(null), [ot, Re] = T(null), [Ze, Vt] = T(!1), [Fe, Tn] = T(!1), [dt, Mt] = T(null), [ft, zt] = T(null), qt = !!dt || !!ft, er = $(qt);
  er.current = qt;
  const Tt = Ze || !!ft || Fe, [In, Jt] = T(0), [Ft, gn] = T(!1), [qe, Ct] = T(null), it = $(null), Dn = $(null), Ht = $(null), [Pe, It] = T(
    null
  ), ce = t.find((h) => h.id === S) ?? null, P = be(
    () => (Pe == null ? void 0 : Pe.id) === S && ce ? { ...ce, view: {
      ...ce.view,
      filter: Pe.view.filter,
      objectFilter: Pe.view.objectFilter,
      searchMode: Pe.view.searchMode,
      startFrom: Pe.view.startFrom
    } } : ce,
    [Pe, S, ce]
  ), Ae = P ? Ue(P) : "video", ht = Yo(Ae), _n = P ? $e(P) : !1, ge = Ae === "video" ? P : null, Rt = _n && !!(P != null && P.actions.some(Qn)), tt = !!ge || Ae === "audio" || Rt, [Le, et] = T(null), Wt = (Le == null ? void 0 : Le.id) === (P == null ? void 0 : P.id) ? Le == null ? void 0 : Le.mode : (P == null ? void 0 : P.view.reviewMode) ?? "single", st = _n || Ae === "audio" || Ae === "video" && Wt === "single", [pt, xt] = T(0), Qt = $(-1), ct = $(!1), jn = $(st);
  jn.current = st, W(() => {
    const h = () => {
      const N = jn.current;
      if (!N && vn.current) {
        ct.current = !0;
        return;
      }
      Qt.current = -1, At(), N || xt((M) => M + 1);
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, []);
  const Yt = ht === "audio" ? m : u, Un = Ae === "tag" ? "Tag" : ht === "audio" ? "Audio" : "Video", Pt = Ae === "tag" ? y : Yt, bn = $(
    null
  ), nn = Jf(ge), [A, L] = T({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Q, we] = T({
    page: 1,
    perPage: 40
  }), [le, Me] = T({ items: [], totalCount: 0 }), [Ie, Lt] = T(S);
  Ie !== S && (Lt(S), Me({ items: [], totalCount: 0 }), Y(!1));
  const [Ne, ke] = T(!1), [Se, Dt] = T(""), [Rn, Kr] = T(!1), [Gr, Br] = T(!1), [St, Xt] = T(() => /* @__PURE__ */ new Set()), tr = $(St);
  tr.current = St;
  const mt = $(/* @__PURE__ */ new Map()), yn = (P == null ? void 0 : P.view.selectAllOnLoad) === !0, [_e, nt] = T(null), gt = $(_e);
  gt.current = _e;
  const [bt, _t] = T(!1), jt = $(bt);
  jt.current = bt;
  const rn = $(null), [nr, an] = T(!1), [Zt, Sr] = T("grid"), [kr, wa] = T(bo), [De, ut] = T(!1), [wn, Er] = T(!1), vn = $(!1), [va, rr] = T(""), [rt, on] = T(""), [sn, Nn] = T(""), [je, Vr] = T(null), [cn, Cr] = T(""), [ar, or] = T(!1), [zr, Ar] = T({}), ir = $(/* @__PURE__ */ new Map()), Jr = $(null), $n = $(null), sr = !!P, Xa = Uo(bh, yh, () => !1) && sr, [cr, Na] = T({ top: 0, bottom: 0 });
  kt(() => {
    if (!sr) return;
    const h = () => {
      const M = $n.current;
      if (!M) return;
      const j = Math.round(M.getBoundingClientRect().top + window.scrollY), X = M.closest("main"), z = X ? Math.round(parseFloat(getComputedStyle(X).paddingBottom) || 0) : 0;
      Na(
        (oe) => oe.top === j && oe.bottom === z ? oe : { top: j, bottom: z }
      );
    };
    h();
    const N = typeof ResizeObserver > "u" ? null : new ResizeObserver(h);
    return N == null || N.observe(document.body), window.addEventListener("resize", h), () => {
      N == null || N.disconnect(), window.removeEventListener("resize", h);
    };
  }, [sr]);
  const [Za, qa] = T(0), Tr = $(null), Hr = kn((h) => {
    var M;
    if ((M = Tr.current) == null || M.disconnect(), Tr.current = null, !h || typeof ResizeObserver > "u") return;
    const N = new ResizeObserver(
      () => qa(Math.round(h.getBoundingClientRect().height))
    );
    N.observe(h), Tr.current = N;
  }, []), $t = $(0), qn = $(0), lr = $(null), Kn = $(null), Gn = Xs(
    P && !st ? qe ? [...P.actions, ...qe.draft.actions] : P.actions : bs
  ), ln = be(
    () => qe && P && ce ? hh(qe.draft, P, A, ce) : null,
    [qe, P, A, ce]
  ), dr = be(
    () => P && ce ? Qc(
      { ...ce, view: { ...P.view, filter: { ...A, page: 1 } } },
      ce
    ) : null,
    [P, ce, A]
  ), ur = be(
    () => ce ? Lr(yr(ce)) : "",
    [ce]
  ), Wr = be(
    () => dr != null && Lr(yr(dr)) !== ur,
    [dr, ur]
  ), Sa = be(
    () => ln != null && Lr(yr(ln)) !== ur,
    [ln, ur]
  );
  W(() => {
    if (!rt) return;
    const h = window.setTimeout(() => on(""), 4e3);
    return () => window.clearTimeout(h);
  }, [rt]), W(() => {
    if (!ot || ot.alert) return;
    const h = window.setTimeout(() => Re(null), 6e3);
    return () => window.clearTimeout(h);
  }, [ot]), W(() => {
    const h = ge ? bi(ge.view.objectFilter) : [];
    if (Ar({}), !h.length) return;
    const N = new AbortController();
    let M = !0;
    return Promise.all(
      h.map(async (j) => {
        var X;
        try {
          const z = await me(`/api/tags/${j}`, {
            signal: N.signal
          });
          return (X = z.name) != null && X.trim() ? [String(j), z.name] : null;
        } catch {
          return null;
        }
      })
    ).then((j) => {
      M && Ar(
        Object.fromEntries(j.filter((X) => X !== null))
      );
    }), () => {
      M = !1, N.abort();
    };
  }, [ge == null ? void 0 : ge.id, ge == null ? void 0 : ge.view.objectFilter]);
  const eo = be(
    () => ge ? yi(
      ge.view.objectFilter,
      zr
    ) : (P == null ? void 0 : P.view.objectFilter) ?? {},
    [zr, P, ge]
  ), Qr = kn(async () => {
    c(!0), f("");
    try {
      const h = await bd();
      n(h.reviews), i(h.storageKey), g(h.canWriteVideos ?? h.canWrite), b(h.canWriteAudios ?? !1), v(h.canWriteTags ?? !1), w(h.canReadTagGroups ?? !1), Z(h.canConfigure ?? !0), ie(h.storage ?? "account"), x(h.storageNotice ?? ""), S && !h.reviews.some((N) => N.id === S) && (ae(""), yo(""));
    } catch (h) {
      f(
        h instanceof Error ? h.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [S]);
  W(() => {
    if (!q) {
      F([]), _("");
      return;
    }
    const h = new AbortController();
    return _(""), Id(h.signal).then(F).catch((N) => {
      h.signal.aborted || _(
        N instanceof Error ? N.message : "Could not load tag groups."
      );
    }), () => h.abort();
  }, [q]), W(() => {
    Qr();
  }, []), W(() => {
    if (S || t.length === 0) return;
    const h = new AbortController();
    for (const N of t) {
      if (typeof pe.current[N.id] == "number") continue;
      ($e(N) ? wi(N, h.signal).then((j) => (j == null ? void 0 : j.length) === 0 ? { items: [], totalCount: 0 } : ra(vi(N, j), { ...N.view.filter, page: 1, perPage: 1 }, h.signal)) : Ue(N) === "tag" ? Di(
        N,
        Gt({ ...N.view.filter, page: 1, perPage: 1 }),
        h.signal
      ) : ra(
        N,
        Gt({ ...N.view.filter, page: 1, perPage: 1 }),
        h.signal
      )).then((j) => {
        h.signal.aborted || se((X) => ({
          ...X,
          [N.id]: j.totalCount
        }));
      }).catch(() => {
        h.signal.aborted || se((j) => ({ ...j, [N.id]: null }));
      });
    }
    return () => h.abort();
  }, [S, t]), kt(() => {
    var M, j;
    const h = xe.current;
    if (S || s || !h) return;
    xe.current = null, (j = (h === "heading" ? null : [...((M = $n.current) == null ? void 0 : M.querySelectorAll("[data-review-id]")) ?? []].find(
      (X) => X.dataset.reviewId === h.reviewId
    )) ?? mn.current) == null || j.focus();
  }, [S, s, ft, t]);
  const Ir = $(0), p = kn(async () => {
    const h = ++Ir.current;
    Vr(null), Cr("");
    try {
      const N = await (Rt ? Hs(ht) : Js(ht));
      h === Ir.current && Vr(N);
    } catch (N) {
      if (h !== Ir.current) return;
      Vr(null), Cr(
        "Tag assessment setup could not be checked. " + (N instanceof Error ? N.message : "Request failed.")
      );
    }
  }, [Rt, ht]);
  W(() => {
    p();
  }, [p]);
  const k = kn(
    async (h, N, M = !1, j = !1) => {
      var wt, Be;
      const X = ++$t.current;
      (wt = lr.current) == null || wt.abort();
      const z = new AbortController();
      lr.current = z, N = Gt(N);
      const oe = Number(N.page);
      M && (N = { ...N, page: 1 }), L(N), Br(M), ke(!0), Dt("");
      try {
        const We = (On) => Ue(h) === "tag" ? Di(
          h,
          On,
          z.signal
        ) : ra(
          h,
          On,
          z.signal
        );
        let Ee = await We(N);
        const Qe = Math.max(
          1,
          Math.ceil(Ee.totalCount / Number(N.perPage))
        ), Bn = M ? Qe : Math.min(oe, Qe);
        return Number(N.page) !== Bn && (N = { ...N, page: Bn }, Ee = await We(N)), X === $t.current && (((Be = Kn.current) == null ? void 0 : Be.page) !== Bn && (Kn.current = {
          page: Bn,
          ids: new Set(Ee.items.map((On) => On.id))
        }), Me(Ee), j && yt(
          () => new Set(Ee.items.map((On) => On.id))
        ), L(N), we(N)), Ee;
      } catch (We) {
        throw X === $t.current && Dt(
          We instanceof Error ? We.message : "Could not load the review queue."
        ), We;
      } finally {
        X === $t.current && ke(!1);
      }
    },
    []
  );
  W(() => {
    var N;
    if (qn.current += 1, Qt.current = -1, $t.current += 1, (N = lr.current) == null || N.abort(), Ct(null), it.current = null, Y(!1), B(""), R(""), J(!1), Xt(/* @__PURE__ */ new Set()), mt.current.clear(), nt(null), _t(!1), ut(!1), vn.current = !1, rr(""), on(""), Nn(""), Me({ items: [], totalCount: 0 }), Kn.current = null, Kr(!1), !P || st) {
      ke(!1), It(null);
      return;
    }
    let h = !0;
    return ke(!0), (async () => {
      let M = ce ?? P;
      It(null);
      let j = null;
      const X = new URLSearchParams(window.location.search);
      if (Ue(P) === "video" && Ya.some((Be) => X.has(Be)))
        try {
          const Be = M;
          j = jo(Be, X);
          const We = En(Be, j.query);
          (j.query.startFrom !== (Be.view.startFrom ?? "end") || !vr(
            JSON.parse(Jn(We)),
            JSON.parse(Jn(En(Be, Nr(Be))))
          )) && (M = We, It(M));
        } catch (Be) {
          Kr(!0), Dt(Be instanceof Error ? Be.message : "Could not read review URL."), ke(!1);
          return;
        }
      let z = null;
      try {
        z = await Nd(o, P.id);
      } catch (Be) {
        h && (J(!0), R(
          Be instanceof Error ? Be.message : "Could not load progress."
        ));
      }
      if (!h) return;
      const oe = (z == null ? void 0 : z.signature) === Jn(M) ? z : null, wt = j ? j.query.filter : oe ? Gt(oe.filter) : ph(M.view.filter);
      L(wt), Sr(
        oe ? ms(oe.displayMode, Ue(P)) : ps(P)
      ), wa(
        oe ? oe.cardSize ?? bo : bo
      );
      try {
        const Be = await k(
          M,
          wt,
          j ? j.startAtEnd : !oe && M.view.startFrom !== "beginning",
          M.view.selectAllOnLoad === !0
        );
        if (!h) return;
        const We = Fi(
          Be.items.map((Ee) => Ee.id),
          (oe == null ? void 0 : oe.focusedId) ?? null,
          (oe == null ? void 0 : oe.index) ?? 0
        );
        nt(We), Ve(We);
      } catch {
      }
      h && (Qt.current = pt, Y(!0), B(`${P.id}:${pt}`));
    })(), () => {
      var M;
      h = !1, qn.current++, $t.current++, (M = lr.current) == null || M.abort();
    };
  }, [P == null ? void 0 : P.id, st, pt]), W(() => {
    if (!(!In || st || !P)) {
      if (Rn) {
        Jt(0);
        return;
      }
      De || qe || wn || te !== `${P.id}:${pt}` || (Jt(0), oo());
    }
  }, [
    In,
    st,
    P == null ? void 0 : P.id,
    te,
    De,
    wn,
    pt,
    Rn
  ]), W(() => {
    !ge || st || !H || Ne || Se || De || ct.current || Qt.current !== pt || aa(ge.id, {
      filter: A,
      objectFilter: ge.view.objectFilter,
      searchMode: ge.view.searchMode,
      startFrom: ge.view.startFrom ?? "end"
    });
  }, [ge, st, H, Ne, Se, A, De, pt]);
  const O = be(
    () => le.items.map((h) => h.id),
    [le.items]
  );
  W(() => {
    if (!H || !P || !o || Ne || Se || De || (Pe == null ? void 0 : Pe.id) === P.id || E || Qt.current !== pt)
      return;
    const h = {
      version: 1,
      signature: Jn(P),
      filter: A,
      focusedId: _e,
      index: Math.max(0, O.indexOf(_e ?? -1)),
      displayMode: Zt,
      cardSize: kr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + P.id,
        JSON.stringify(h)
      );
    } catch {
    }
    if (G) return;
    let N = !0;
    const M = window.setTimeout(() => {
      qd(o, P.id, h).catch((j) => {
        N && R(
          "Progress is kept in this browser, but account sync failed. " + (j instanceof Error ? j.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      N = !1, window.clearTimeout(M);
    };
  }, [
    H,
    o,
    P,
    Ne,
    Se,
    De,
    A,
    _e,
    O,
    Zt,
    kr,
    Pe,
    G,
    E,
    pt
  ]);
  const ne = le.items.find((h) => h.id === _e) ?? null, fe = Ae === "video" ? ne : null;
  bt && fe && (rn.current = fe);
  const de = fe ?? (bt ? rn.current : null), Ye = xi(St, _e), Ot = O.length > 0 && O.every((h) => St.has(h)), Ve = kn((h, N = !0) => {
    h != null && window.requestAnimationFrame(() => {
      var j;
      if (er.current || ud(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (j = document.activeElement) != null && j.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const M = ir.current.get(h);
      M == null || M.focus({ preventScroll: !0 }), N && (M == null || M.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  W(() => {
    H && !jt.current && Ve(gt.current);
  }, [H, Ve]), W(() => {
    Ne || !O.length || (gt.current == null || !O.includes(gt.current)) && (nt(O[0]), jt.current || Ve(O[0]));
  }, [Ve, O, Ne]);
  const yt = kn(
    (h) => {
      Xt((N) => {
        const M = h(N);
        for (const j of /* @__PURE__ */ new Set([...N, ...M]))
          N.has(j) !== M.has(j) && mt.current.set(
            j,
            (mt.current.get(j) ?? 0) + 1
          );
        return M;
      });
    },
    []
  ), lt = kn(
    (h) => {
      if (!O.length) return;
      const N = Math.max(
        0,
        O.indexOf(gt.current ?? O[0])
      ), M = O[Math.max(0, Math.min(O.length - 1, N + h))];
      nt(M), jt.current || Ve(M);
    },
    [Ve, O]
  ), ze = kn(
    async (h) => {
      const N = "steps" in h ? h.steps.length > 0 : h.effect.mode !== "SKIP", M = "effect" in h && h.effect.mode === "SET_TAG_GROUP" ? h.effect.tagGroupId : null, j = M != null && (!q || !I.some((Xe) => Xe.id === M)), X = "effect" in h && N && !q, z = xi(
        tr.current,
        gt.current
      );
      if (!P || vn.current || Ne || Se) return;
      const oe = N && !Pt ? `${Un} write permission is required to apply ${h.label}.` : X || j ? `${h.label} needs a tag group that is unavailable.` : Qn(h) && (je == null ? void 0 : je.kind) !== "ready" ? `Set up tag assessments before applying ${h.label}.` : z.length ? "" : `Select or focus a ${Ae} before applying ${h.label}.`;
      if (oe) {
        Nn(oe);
        return;
      }
      const wt = ++qn.current, Be = P.id, We = [...O], Ee = le, Qe = gt.current, Bn = new Set(tr.current), On = new Map(
        z.map((Xe) => [Xe, mt.current.get(Xe) ?? 0])
      ), Or = () => wt === qn.current && P.id === Be;
      vn.current = !0, ut(!0), rr(
        tr.current.size ? `${z.length} selected ${Ae}s` : `the focused ${Ae}`
      ), on(""), Nn("");
      const Ti = Ee.items.filter(
        (Xe) => !z.includes(Xe.id)
      ), yl = Ti.map((Xe) => Xe.id), Ii = Pi(
        We,
        yl,
        Qe,
        z.includes(Qe ?? -1)
      );
      Me({
        items: Ti,
        totalCount: Ee.totalCount
      }), Xt((Xe) => {
        const Kt = new Set(Xe);
        for (const un of z) Kt.delete(un);
        return Kt;
      }), nt(Ii), jt.current || Ve(Ii);
      let io = !1;
      try {
        if ("effect" in h ? await _d(h, z) : await Qs(ht, h, z), io = !0, !Or()) return;
        Xt((Xe) => {
          const Kt = new Set(Xe);
          for (const un of z)
            (mt.current.get(un) ?? 0) === On.get(un) && Kt.delete(un);
          return Kt;
        }), on(
          `${h.label}: ${z.length} ${Ae}${z.length === 1 ? "" : "s"} ${N ? "updated" : "skipped"}.`
        );
      } catch (Xe) {
        if (!Or()) return;
        Me(Ee), Xt((Kt) => {
          const un = new Set(Kt);
          for (const en of z)
            Bn.has(en) && (mt.current.get(en) ?? 0) === On.get(en) && un.add(en);
          return un;
        }), nt(Qe), jt.current || Ve(Qe), Nn(
          Xe instanceof Error ? Xe.message : "Action failed."
        );
      }
      try {
        if (await Od(h), !Or()) return;
        const Xe = new Set(z), Kt = yn && We.length > 0 && We.every((fn) => Xe.has(fn)), un = await k(P, A, !1, Kt);
        if (!Or()) return;
        let en = un.items.map((fn) => fn.id);
        const Ta = Kn.current, wl = (Ta == null ? void 0 : Ta.page) === Number(A.page) && en.some((fn) => Ta.ids.has(fn)), vl = (P.view.startFrom ?? "end") !== "beginning";
        if (un.totalCount > 0 && Number(A.page) > 1 && (!en.length || vl && !wl)) {
          const fn = Math.max(1, Number(A.page) - 1), Ia = { ...A, page: fn };
          L(Ia), en = (await k(
            P,
            Ia,
            !1,
            Kt
          )).items.map((so) => so.id), Xt(
            (so) => new Set([...so].filter((Nl) => en.includes(Nl)))
          );
          const $i = en.at(-1) ?? null;
          nt($i), jt.current || Ve($i);
        } else {
          Xt(
            (Ia) => new Set([...Ia].filter((Ri) => en.includes(Ri)))
          );
          const fn = Pi(
            We,
            en,
            Qe,
            io && z.includes(Qe ?? -1)
          );
          nt(fn), jt.current && fn == null && _t(!1), jt.current || Ve(fn);
        }
      } catch (Xe) {
        Or() && Nn(
          (Kt) => `${Kt ? `${Kt} ` : ""}${io ? "The action completed, but " : ""}the queue could not be refreshed. ${Xe instanceof Error ? Xe.message : "Refresh failed."}`
        );
      } finally {
        Or() && (vn.current = !1, ut(!1), rr(""), ct.current && (ct.current = !1, At(), xt((Xe) => Xe + 1)));
      }
    },
    [
      Pt,
      q,
      I,
      Ae,
      je,
      k,
      A,
      Ve,
      O,
      le,
      Ne,
      Se,
      P
    ]
  );
  function Sn() {
    var M;
    if (Zt === "list") return 1;
    const h = (M = Jr.current) == null ? void 0 : M.firstElementChild, N = h ? getComputedStyle(h).gridTemplateColumns : "";
    return Math.max(1, N.split(" ").filter(Boolean).length);
  }
  const He = $(() => {
  });
  He.current = (h) => {
    var z;
    if (st || h.defaultPrevented || h.repeat || pn(h) || h.ctrlKey || h.altKey || h.metaKey || qt) return;
    const N = h.target, M = N instanceof Node && ((z = $n.current) == null ? void 0 : z.contains(N)) === !0, j = N === document.body || N === document.documentElement;
    if (!M && !j) return;
    if (nr) {
      h.key === "Escape" && (Fr(h), an(!1));
      return;
    }
    if (bt && h.key === "Escape") {
      Fr(h), _t(!1), Ve(gt.current);
      return;
    }
    if (!dd(N)) return;
    const X = ld(N);
    if (h.key === "Escape") {
      Fr(h), yt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!bt && h.key === " " && X) {
      Fr(h), _e != null && yt((oe) => Pa(oe, _e));
      return;
    }
    if (!(De || Ne) && !bt && h.key === "Enter" && _e != null && X) {
      if (Ae !== "tag" && qe) return;
      Fr(h), Ae === "tag" ? window.open(`/tag/${_e}`, "_blank", "noopener,noreferrer") : _t(!0);
      return;
    }
  }, W(() => {
    const h = (N) => He.current(N);
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
  }, []);
  const dn = $(
    () => {
    }
  );
  dn.current = (h) => {
    var z;
    if (st || qt || bt || nr || De || Ne || !O.length || h.defaultPrevented || h.repeat || h.ctrlKey || h.altKey || h.metaKey)
      return;
    const N = h.target, M = N instanceof Node && ((z = $n.current) == null ? void 0 : z.contains(N)) === !0, j = N === document.body || N === document.documentElement;
    if (!M && !j || !h.key.startsWith("Arrow") || !fd(N)) return;
    const X = hd(h.key, Sn());
    X && (h.preventDefault(), M ? h.stopImmediatePropagation() : h.stopPropagation(), lt(X));
  }, W(() => {
    const h = (N) => dn.current(N);
    return document.addEventListener("keydown", h), () => document.removeEventListener("keydown", h);
  }, []);
  const Ut = (qe == null ? void 0 : qe.saving) === !0 || wn, Yr = De || Ne && !H || Ut, ka = li();
  ci({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!P && !st && !qt && !qe && !bt && !nr && !Se && (le.items.length > 0 || Ne || De),
    actions: (P == null ? void 0 : P.actions) ?? bs,
    onAction: (h) => {
      const N = P == null ? void 0 : P.actions[h];
      N && ze(N);
    },
    onFind: () => an(!0),
    onSelectAll: () => yt((h) => cd(h, O))
  }), W(() => an(!1), [st, bt, P == null ? void 0 : P.id]);
  function Ea(h) {
    const N = "steps" in h ? h.steps.length > 0 : h.effect.mode !== "SKIP", M = "effect" in h && h.effect.mode === "SET_TAG_GROUP" ? h.effect.tagGroupId : null, j = M != null && !I.some((X) => X.id === M);
    return De || Ne || !!Se || N && !Pt || "effect" in h && N && (!q || j) || Qn(h) && (je == null ? void 0 : je.kind) !== "ready" || !Ye.length;
  }
  function fr(h) {
    et(null), Jt(0), Re(null), ae(h), yo(h, !!h && !P);
  }
  function Rr() {
    Te.current || (Hc() ? (Te.current = !0, window.history.back()) : fr(""));
  }
  function At() {
    const h = Te.current;
    Te.current = !1;
    let N = gs();
    N && !ye.current && !D.current.some((j) => j.id === N) && (N = "", yo(""));
    const M = C.current;
    N !== M && (Jt(0), h || Re(null), !N && M && (xe.current ?? (xe.current = { reviewId: M }))), ae(N);
  }
  function $r() {
    xe.current = "heading", Re(null), Rr();
  }
  function to(h) {
    h !== S && fr(h), Jt((N) => N + 1);
  }
  function nl() {
    Re(null), Mt({
      review: Zc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function rl(h) {
    if (Tt || !K) return;
    Re(null);
    const N = crypto.randomUUID();
    let M;
    const j = S;
    Tn(!0);
    try {
      if (!await Xr((z) => (M = id(
        z.find((oe) => oe.id === h.id) ?? h,
        z,
        N
      ), [...z, M]))) throw new Error("Could not save reviews.");
      if (!ue.current) return;
      C.current !== j ? Re({ text: `Saved the copy “${M.name}”.`, alert: !1 }) : to(M.id);
    } catch (X) {
      Re({
        text: `“${h.name}” was not duplicated. ${Ca(X)}`,
        alert: !0
      });
    } finally {
      Tn(!1);
    }
  }
  async function al() {
    if (!dt || dt.saving) return;
    const h = { ...dt.review, name: dt.review.name.trim() }, N = ca(h);
    if (N) {
      Mt({ ...dt, error: N });
      return;
    }
    Mt({ ...dt, saving: !0, error: "" });
    try {
      if (!await Xr((M) => [...M, h]))
        throw new Error("Could not save reviews.");
      if (!ue.current) return;
      Mt(null), to(h.id);
    } catch (M) {
      Mt(
        (j) => j && {
          ...j,
          saving: !1,
          error: "Could not save reviews. Your edits are still open. " + (M instanceof Error ? M.message : "Retry saving.")
        }
      );
    }
  }
  async function ol() {
    if (!ft || ft.pending) return;
    const h = ft.review, N = Xc(t, V, ve, Je).map((X) => X.id), M = N.filter((X) => X !== h.id), j = M[Math.min(N.indexOf(h.id), M.length - 1)];
    zt({ review: h, pending: !0 });
    try {
      if (!await Xr((X) => X.filter((z) => z.id !== h.id)))
        throw new Error("Could not save reviews.");
      xe.current = h.id !== S && j ? { reviewId: j } : "heading", Re({ text: `Deleted “${h.name}”.`, alert: !1 });
    } catch (X) {
      Re({ text: `“${h.name}” was not deleted. ${Ca(X)}`, alert: !0 });
    } finally {
      zt(null);
    }
  }
  async function il(h) {
    if (!(Tt || !K)) {
      Re(null), Vt(!0);
      try {
        const N = await Qu(h);
        let M = 0;
        if (N.length && !await Xr((X) => {
          const z = wo(X, N);
          return M = z.length - X.length, M ? z : X;
        }))
          throw new Error("Could not save reviews.");
        const j = N.length - M;
        Re({
          alert: !1,
          text: N.length ? M ? `Imported ${M === 1 ? "1 review" : `${M} reviews`}.` + (j === 1 ? " 1 review already in the list stays as it is." : j ? ` ${j} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (N) {
        Re({ alert: !0, text: `Could not import “${h.name}”. ${Ca(N)}` });
      } finally {
        Vt(!1);
      }
    }
  }
  function Ca(h) {
    return h instanceof js ? "Reviews changed in another browser. Reload the page to get them, then try again." : h instanceof Error ? h.message : "Try again.";
  }
  function ki(h) {
    const N = !K || Tt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ a(As, { "aria-hidden": "true" }),
        disabled: N,
        onSelect: () => void rl(h)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ a(Ms, { "aria-hidden": "true" }),
        onSelect: () => hi(h)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ a(zo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: N,
        onSelect: () => {
          Re(null), zt({ review: h, pending: !1 });
        }
      }
    ];
  }
  function Ei(h, N) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ a(Dr, { "aria-hidden": "true" }),
        ...N,
        disabled: N.disabled || Fe
      },
      ...ki(h),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ a(ha, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Fe,
        onSelect: $r
      }
    ];
  }
  async function Xr(h) {
    if (!o) return !1;
    let N = [];
    const M = await vd(o, (oe) => {
      N = oe;
      const wt = h(oe);
      return wt === oe ? oe : wt.map(qh);
    });
    if (n(M), !ue.current) return !0;
    const j = C.current;
    j && !M.some((oe) => oe.id === j) && Rr();
    const X = N.find((oe) => oe.id === j), z = M.find((oe) => oe.id === j);
    return z && X && ((z.view.reviewMode ?? "single") !== (X.view.reviewMode ?? "single") && et(null), z.view.displayMode !== X.view.displayMode && Sr(ps(z))), !0;
  }
  function no(h) {
    return Xr((N) => Nh(N, h));
  }
  function sl(h) {
    return no(h).catch((N) => {
      throw C.current !== h.id && ro(h, N), N;
    });
  }
  function ro(h, N) {
    var j;
    if (!ue.current) return;
    const M = ((j = D.current.find((X) => X.id === h.id)) == null ? void 0 : j.name) ?? h.name;
    Re({ text: `“${M}” was not saved. ${Ca(N)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ a(ys, { label: "Loading reviews…" });
  if (d)
    return /* @__PURE__ */ l(he, { children: [
      /* @__PURE__ */ a(
        "button",
        {
          className: "dq-button",
          onClick: () => void Ah().catch(
            (h) => f(
              "Could not export browser reviews. " + (h instanceof Error ? h.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ a(
        ws,
        {
          message: d,
          onRetry: () => void Qr()
        }
      )
    ] });
  const ao = /* @__PURE__ */ l(he, { children: [
    re && /* @__PURE__ */ a("p", { className: "dq-status", children: re }),
    tt && (je == null ? void 0 : je.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      je.message,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: ar,
          onClick: () => {
            or(!0), Cr(""), (Rt ? xd(ht) : Fd(ht)).then(p).catch(
              (h) => Cr(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (h instanceof Error ? h.message : "Request failed.")
              )
            ).finally(() => or(!1));
          },
          children: ar ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    tt && ((je == null ? void 0 : je.kind) === "incompatible" || cn) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Mn, {}),
      cn || (je == null ? void 0 : je.message),
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          disabled: ar,
          onClick: () => {
            or(!0), p().finally(
              () => or(!1)
            );
          },
          children: ar ? "Checking…" : "Check again"
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
            const h = localStorage.getItem("page-videos") ?? "[]", N = URL.createObjectURL(
              new Blob([h], { type: "application/json" })
            ), M = document.createElement("a");
            M.href = N, M.download = "data-quality-unassigned-legacy-reviews.json", M.click(), URL.revokeObjectURL(N);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    G && /* @__PURE__ */ l("p", { role: "alert", children: [
      G,
      " ",
      /* @__PURE__ */ a(
        "button",
        {
          type: "button",
          onClick: () => {
            R(""), J(!1);
          },
          children: E ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    ot && (ot.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
      ot.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ a("p", { className: "dq-status", "aria-hidden": "true", children: ot.text })
    ))
  ] });
  return /* @__PURE__ */ l(
    "div",
    {
      ref: $n,
      className: `data-quality-page${sr ? " dq-page-fit" : ""}`,
      style: sr ? {
        "--dq-fit-top": `${cr.top}px`,
        "--dq-fit-bottom": `${cr.bottom}px`
      } : void 0,
      children: [
        /* @__PURE__ */ a("p", { className: "dq-sr-only", "aria-live": "polite", children: ot && !ot.alert ? ot.text : "" }),
        P && st ? /* @__PURE__ */ a(
          oh,
          {
            review: ce ?? P,
            canWrite: _n ? y : Yt,
            canAssess: (je == null ? void 0 : je.kind) === "ready" && Yt,
            onBusy: ut,
            editRequest: In,
            onEditRequestHandled: () => Jt(0),
            onSaveDefaults: K ? sl : void 0,
            pageControls: {
              onBack: $r,
              moreItems: (h) => Ei(ce ?? P, h),
              onGrid: ge ? () => et({ id: ge.id, mode: "multiple" }) : void 0,
              notices: ao,
              busy: Fe
            },
            stayOnTap: Ft,
            onStayOnTapChange: gn
          },
          P.id
        ) : P ? gl(P) : /* @__PURE__ */ a(
          dh,
          {
            reviews: t,
            counts: V,
            sort: ve,
            direction: Je,
            onSortChange: (h) => Et({ sort: h }),
            onDirectionChange: (h) => Et({ direction: h }),
            storage: fh[ee],
            canConfigure: K,
            busy: Tt,
            headingRef: mn,
            notices: ao,
            onOpen: fr,
            onNew: () => nl(),
            onImport: (h) => void il(h),
            onExportAll: () => Ac(t, "data-quality-reviews.json"),
            rowMenuItems: (h) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ a(Dr, { "aria-hidden": "true" }),
                disabled: !K || Tt,
                onSelect: () => to(h.id)
              },
              ...ki(h)
            ]
          }
        ),
        bt && de && ge && /* @__PURE__ */ a(
          Ch,
          {
            video: de,
            review: ge,
            selectedCount: St.size,
            pending: De,
            refreshing: Ne || !!Se,
            error: sn,
            canWrite: u,
            assessmentReady: (je == null ? void 0 : je.kind) === "ready",
            trees: Gn,
            selected: St.has(de.id),
            hasPrevious: O.indexOf(de.id) > 0,
            hasNext: O.indexOf(de.id) >= 0 && O.indexOf(de.id) < O.length - 1,
            onToggleSelected: () => yt((h) => Pa(h, de.id)),
            onPrevious: () => lt(-1),
            onNext: () => lt(1),
            onClose: () => {
              _t(!1), Ve(gt.current);
            },
            onAction: ze,
            findOpen: nr,
            onFindOpenChange: an
          }
        ),
        nr && P && !st && !bt && /* @__PURE__ */ a(
          ui,
          {
            actions: P.actions,
            tagGroups: I,
            trees: Gn,
            isDisabled: Ea,
            canStay: !1,
            onApply: (h) => {
              an(!1), ze(h);
            },
            onClose: () => an(!1)
          }
        ),
        dt && /* @__PURE__ */ a(
          uh,
          {
            draft: dt,
            onChange: (h) => Mt((N) => N && { ...N, review: h, error: "" }),
            onCreate: () => void al(),
            onCancel: () => Mt(null)
          }
        ),
        /* @__PURE__ */ a(
          Ol,
          {
            open: !!ft,
            title: "Delete review?",
            message: ft ? `“${ft.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ft == null ? void 0 : ft.pending) ?? !1,
            onConfirm: () => void ol(),
            onCancel: () => zt((h) => h != null && h.pending ? h : null)
          }
        )
      ]
    }
  );
  async function Aa(h, N, M = !1, j = !0) {
    const X = gt.current, z = Math.max(0, O.indexOf(X ?? -1));
    try {
      const oe = k(
        h,
        N,
        M,
        h.view.selectAllOnLoad === !0
      ), wt = $t.current, Be = await oe;
      if (wt !== $t.current) return;
      const We = Be.items.map((Qe) => Qe.id);
      Xt(
        (Qe) => new Set([...Qe].filter((Bn) => We.includes(Bn)))
      );
      const Ee = Fi(We, X, z);
      nt(Ee), j && !jt.current && Ve(Ee, !1);
    } catch {
    }
  }
  function cl(h) {
    const N = bn.current;
    if (bn.current = null, Yr || !P || !ce) return;
    const M = N ?? P.view.objectFilter, j = vr(
      M,
      ce.view.objectFilter
    ) ? ce.view.objectFilter : M, X = Gt({ ...h, page: 1 }), z = {
      ...P,
      view: {
        ...P.view,
        filter: X,
        objectFilter: j
      }
    }, oe = !hs(z, ce), wt = oe ? z : ce;
    It(oe ? z : null), on(oe ? "" : "Review queue defaults restored."), Aa(wt, X, !0);
  }
  function ll() {
    if (De || Ne || Ut || !ce) return;
    bn.current = null;
    const h = Gt({
      ...ce.view.filter,
      page: 1
    });
    It(null), on("Review queue defaults restored."), Aa(
      ce,
      h,
      ce.view.startFrom !== "beginning",
      !1
    );
  }
  function dl() {
    if (De || Ne || Se || Ut || !P || !dr || !K)
      return;
    const h = P, N = dr;
    Er(!0), no(N).then((M) => {
      !M || C.current !== N.id || (It(fs(N, h)), on("Queue saved to this review."));
    }).catch((M) => {
      C.current !== N.id ? ro(N, M) : Nn(M instanceof Error ? M.message : "Could not save queue.");
    }).finally(() => Er(!1));
  }
  function oo() {
    if (!P || !ce || vn.current || qe || wn) return;
    Dn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, it.current = {
      temporaryReview: Pe,
      filter: A,
      loadedFilter: Q,
      queue: le,
      queueError: Se,
      retryFromEnd: Gr,
      selectedIds: new Set(St),
      focusedId: _e,
      pageCursor: Kn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const h = structuredClone({
      ...ce,
      view: { ...ce.view, startFrom: P.view.startFrom ?? "end" }
    });
    an(!1), _t(!1), on(""), Nn(""), Ct({ draft: h, saving: !1, error: "" });
  }
  function Ci() {
    Ct(null), it.current = null;
    const h = Dn.current;
    Dn.current = null, requestAnimationFrame(() => {
      (h == null ? void 0 : h.isConnected) && h !== document.body && !(h instanceof HTMLButtonElement && h.disabled) ? h.focus({ preventScroll: !0 }) : Ve(gt.current, !1);
    });
  }
  function ul() {
    var N;
    if (!qe || qe.saving) return;
    const h = it.current;
    h && ($t.current += 1, (N = lr.current) == null || N.abort(), bn.current = null, ke(!1), It(h.temporaryReview), L(h.filter), we(h.loadedFilter), Me(h.queue), Dt(h.queueError), Br(h.retryFromEnd), yt(() => h.selectedIds), nt(h.focusedId), Kn.current = h.pageCursor, window.history.replaceState(window.history.state, "", h.url)), Ci();
  }
  async function fl() {
    if (!qe || qe.saving || !ln || !P) return;
    const h = P, N = { ...ln, name: ln.name.trim() }, M = ca(N);
    if (M) {
      Ct((j) => j && { ...j, error: M });
      return;
    }
    Ct((j) => j && { ...j, saving: !0, error: "" });
    try {
      if (!await no(N)) throw new Error("Could not save reviews.");
      if (!ue.current || C.current !== N.id) return;
      It(fs(N, h)), Ue(N) === "video" && aa(N.id, {
        filter: A,
        objectFilter: h.view.objectFilter,
        searchMode: N.view.searchMode,
        startFrom: N.view.startFrom ?? "end"
      }), on("Review saved."), Ci();
    } catch (j) {
      if (C.current !== N.id) {
        ro(N, j);
        return;
      }
      Ct(
        (X) => X && {
          ...X,
          saving: !1,
          error: "Could not save review. Your edits are still open. " + (j instanceof Error ? j.message : "Retry saving.")
        }
      );
    }
  }
  function Ai() {
    P && k(P, A, Gr, yn).catch(() => {
    });
  }
  function hl() {
    Xt(/* @__PURE__ */ new Set()), mt.current.clear(), nt(null);
  }
  function pl(h) {
    !P || De || Ut || h === Number(A.page) || vh(
      { ...A, page: h },
      P,
      (N, M) => k(N, M, !1, yn),
      hl
    );
  }
  function ml(h) {
    if (!ge || !ce || De || Ne || Ut) return;
    const N = Yf(ge, h, ce.view.objectFilter), M = !hs(N, ce);
    It(M ? N : null), M ? Aa(N, { ...A, page: 1 }) : Aa(
      ce,
      { ...A, page: 1 },
      ce.view.startFrom !== "beginning"
    );
  }
  function gl(h) {
    var Be, We;
    const N = Ae === "tag", M = N ? "tag" : "video", j = Math.max(1, Number(A.perPage) || 40), X = Math.max(1, Math.ceil(le.totalCount / j)), z = Math.min(Math.max(1, Number(A.page) || 1), X), oe = [
      Pt ? "" : `${Un} write permission is required to apply actions.`,
      N && U ? `Tag groups are unavailable. ${U}` : ""
    ].filter(Boolean), wt = !!sn && !bt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": N ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ a(
            Rc,
            {
              name: h.name,
              description: h.description,
              entityType: Ae,
              onBack: $r,
              backDisabled: De || !!qe || Fe,
              onEdit: qe ? () => {
                var Ee;
                return (Ee = Ht.current) == null ? void 0 : Ee.focus();
              } : oo,
              editDisabled: !qe && (De || Ne || Rn || wn || Fe || !K),
              editing: !!qe,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Yr, children: [
                /* @__PURE__ */ a("legend", { className: "dq-sr-only", children: N ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ a(
                  oa,
                  {
                    filter: Se ? Q : A,
                    onFilterChange: cl,
                    totalCount: le.totalCount,
                    sortOptions: N ? Fl : qs,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Zt,
                    zoomLevel: (kr - 225) / 50,
                    onZoomChange: (Ee) => wa(Math.round(225 + Ee * 50)),
                    cardSizeEntityType: N ? "tags" : "videos",
                    criteriaDefinitions: N ? Ml : Bo,
                    customFieldEntityType: Ae === "video" ? "video" : void 0,
                    objectFilter: eo,
                    onObjectFilterChange: (Ee) => {
                      Yr || (bn.current = Ae === "video" ? Mc(
                        Ee,
                        zr,
                        h.view.objectFilter
                      ) : Ee);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ a($c, { page: z, pages: X, onPage: pl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(he, { children: [
                ge && /* @__PURE__ */ a(
                  Oc,
                  {
                    mode: "multiple",
                    disabled: De || Ne || qt || !!qe || wn || Fe,
                    onChange: () => et({ id: ge.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ a(
                  lf,
                  {
                    options: N ? gh : mh,
                    value: Zt,
                    onChange: (Ee) => Sr(ms(Ee, Ae))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ a(
                pi,
                {
                  disabled: De || !!qe,
                  items: Ei(ce ?? h, {
                    onSelect: oo,
                    disabled: Ne || Rn || wn || !K
                  })
                }
              ),
              queueDiffers: H ? (Pe == null ? void 0 : Pe.id) === S : void 0,
              queueChange: !qe && (Pe == null ? void 0 : Pe.id) === S ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Wr ? dl : void 0,
                saveDisabled: De || Ne || !!Se || Ut || !K,
                onReset: ll,
                resetDisabled: De || Ne || Ut
              } : void 0,
              chipsAfter: (We = (Be = ge == null ? void 0 : ge.presentation) == null ? void 0 : Be.binParents) != null && We.length ? /* @__PURE__ */ a(
                Wf,
                {
                  videos: le.items,
                  review: ge,
                  savedObjectFilter: (ce ?? ge).view.objectFilter,
                  trees: nn.ids,
                  disabled: De || Ne || Ut,
                  onToggle: ml
                }
              ) : void 0,
              chipsEnd: qe ? /* @__PURE__ */ a("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ao,
          ge && nn.error && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert", children: nn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            qe && ln && /* @__PURE__ */ a(
              Ic,
              {
                drawerRef: Ht,
                draft: ln,
                onChange: (Ee) => Ct((Qe) => Qe && { ...Qe, draft: Ee }),
                direction: qe.draft.view.startFrom ?? "end",
                onDirectionChange: (Ee) => Ct(
                  (Qe) => Qe && {
                    ...Qe,
                    draft: { ...Qe.draft, view: { ...Qe.draft.view, startFrom: Ee } }
                  }
                ),
                tagGroups: I,
                trees: Gn,
                saving: qe.saving,
                saveDisabled: Ne || !!Se,
                error: qe.error,
                dirty: Sa,
                criteriaChanged: Wr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Se && !Ne ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      Se,
                      " ",
                      /* @__PURE__ */ a("button", { type: "button", className: "dq-link-button", onClick: Ai, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void fl(),
                onCancel: ul
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Za}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    Ne && !le.items.length && /* @__PURE__ */ a(ys, { label: "Loading review queue…" }),
                    Se && !Ne && /* @__PURE__ */ a(
                      ws,
                      {
                        message: Se,
                        retryLabel: Rn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Rn && ce && Ue(ce) === "video") {
                            const Ee = Nr(ce);
                            aa(ce.id, { ...Ee, filter: { ...Ee.filter, page: void 0 } }), xt((Qe) => Qe + 1);
                            return;
                          }
                          Ai();
                        }
                      }
                    ),
                    !De && !Ne && !Se && !le.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ a(za, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        M,
                        "s match this review."
                      ] })
                    ] }),
                    !!le.items.length && /* @__PURE__ */ a("div", { ref: Jr, children: /* @__PURE__ */ a(
                      "div",
                      {
                        className: Zt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${kr}px` },
                        children: le.items.map(bl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ a("div", { className: "dq-bar-dock", ref: Hr, children: /* @__PURE__ */ a(
                    wc,
                    {
                      actions: qe ? qe.draft.actions : h.actions,
                      tagGroups: I,
                      trees: Gn,
                      isDisabled: Ea,
                      paused: !!qe,
                      busy: De || Ne,
                      onApply: (Ee) => void ze(Ee),
                      onFind: () => an(!0),
                      status: De ? `Applying action to ${va}…` : "",
                      summary: /* @__PURE__ */ l(he, { children: [
                        /* @__PURE__ */ a("p", { className: "dq-bar-target", children: St.size ? `${St.size} selected` : _e == null ? "Nothing to apply to" : `Applies to the focused ${M}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !O.length || Ot,
                            onClick: () => yt((Ee) => /* @__PURE__ */ new Set([...Ee, ...O])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ a(Nt, { binding: ka.selectAll, hidden: !0 })
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
                            onClick: () => yt(() => /* @__PURE__ */ new Set()),
                            children: [
                              "Clear",
                              /* @__PURE__ */ a(Nt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: oe.length ? oe.join(" ") : void 0,
                      keyHints: N ? "Arrows move · Space selects · Enter opens" : qe ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: wt || rt ? /* @__PURE__ */ l(he, { children: [
                        wt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ a(Mn, { "aria-hidden": "true" }),
                          sn
                        ] }),
                        rt && /* @__PURE__ */ a("p", { role: "status", className: "dq-status", children: rt })
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
  function bl(h) {
    var M, j, X;
    if (Ae === "tag") {
      const z = h;
      return /* @__PURE__ */ a(
        Sh,
        {
          tag: z,
          displayMode: Zt === "list" ? "list" : "grid",
          focused: z.id === _e,
          selected: St.has(z.id),
          setRef: (oe) => {
            oe ? ir.current.set(z.id, oe) : ir.current.delete(z.id);
          },
          onFocus: () => nt(z.id),
          onToggle: () => {
            yt((oe) => Pa(oe, z.id)), Ve(z.id, !1);
          },
          onOpen: () => window.open(`/tag/${z.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        z.id
      );
    }
    const N = h;
    return /* @__PURE__ */ a(
      kh,
      {
        video: Hf(N, ge, nn.ids),
        showTagBins: ((j = (M = ge == null ? void 0 : ge.presentation) == null ? void 0 : M.annotations) == null ? void 0 : j.includes("tags")) && !!((X = ge.presentation.annotationParents) != null && X.length),
        displayMode: Zt,
        cardsScroll: Xa,
        focused: N.id === _e,
        selected: St.has(N.id),
        setRef: (z) => {
          z ? ir.current.set(N.id, z) : ir.current.delete(N.id);
        },
        onFocus: () => nt(N.id),
        onToggle: () => yt((z) => Pa(z, N.id)),
        onPreview: () => {
          qe || (nt(N.id), _t(!0));
        },
        onNavigate: e
      },
      N.id
    );
  }
}
function vh(e, t, n, r) {
  r(), n(t, e).catch(() => {
  });
}
function Pa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function Nh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function qh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function Sh({
  tag: e,
  displayMode: t,
  focused: n,
  selected: r,
  setRef: o,
  onFocus: i,
  onToggle: s,
  onOpen: c,
  onNavigate: d
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
        xl,
        {
          tag: e,
          selected: r,
          onSelect: s,
          onClick: c,
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
              f.stopPropagation(), s();
            },
            children: r ? "✓" : ""
          }
        ),
        /* @__PURE__ */ a("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
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
function kh({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: r,
  focused: o,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: d,
  onPreview: f,
  onNavigate: u
}) {
  var q, w;
  const g = el(e), m = $(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(b.date || b.studioName), v = !!(b.performers.length || b.tags.length);
  return kt(() => {
    const I = m.current;
    if (!I) return;
    const F = I.querySelector(
      `a[href="/video/${e.id}"]`
    ), U = I.querySelector(".card-title"), _ = `dq-card-title-${e.id}`;
    U && (U.id = _), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", _), F.classList.add("dq-card-link"));
    const K = I.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    K && K.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const Z = I.querySelector(
      'button[title="Quick View"]'
    );
    Z && Z.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (I) => {
        m.current = I, s(I);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (I) => {
        c(), I.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${v ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ a(
          Pl,
          {
            video: b,
            selected: i,
            onSelect: d,
            onNavigate: u,
            onQuickView: f,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (q = e.tags) == null ? void 0 : q.map((I) => /* @__PURE__ */ a("span", { children: I.name }, I.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ a("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ a(Eh, { video: e, cardsScroll: r })
      ]
    }
  );
}
function Eh({ video: e, cardsScroll: t }) {
  const n = $(null), r = $(null), [o, i] = T(!1), [s, c] = T(!1), [d, f] = T(!1);
  return W(() => {
    const u = n.current;
    if (!u || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), c(!0);
      return;
    }
    const g = t ? u.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([y]) => i(y.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), b = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(u), b.observe(u), () => {
      m.disconnect(), b.disconnect();
    };
  }, [e.id, e.files.length, t]), W(() => {
    if (!o) {
      f(!1);
      return;
    }
    const u = new AbortController();
    return me($d(e.id), {
      signal: u.signal
    }).then((g) => {
      u.signal.aborted || f(g.available === !0);
    }).catch(() => {
      u.signal.aborted || f(!1);
    }), () => u.abort();
  }, [o, e.id]), W(() => {
    const u = r.current;
    u && (s ? Promise.resolve(u.play()).catch(() => {
    }) : u.pause());
  }, [d, s]), /* @__PURE__ */ a("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: d && /* @__PURE__ */ a(
    "video",
    {
      ref: r,
      src: Rd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function Ch({
  video: e,
  review: t,
  selectedCount: n,
  pending: r,
  refreshing: o,
  error: i,
  canWrite: s,
  assessmentReady: c,
  trees: d,
  selected: f,
  hasPrevious: u,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: b,
  onNext: y,
  onClose: v,
  onAction: q,
  findOpen: w,
  onFindOpenChange: I
}) {
  const F = $(null), U = ba(), _ = $(null), K = $(null), Z = e.files[0], ee = el(e), ie = (E) => r || o || "steps" in E && E.steps.length > 0 && !s || Qn(E) && !c;
  ci({
    surface: "overlay",
    enabled: !w,
    actions: t.actions,
    onAction: (E) => {
      const J = t.actions[E];
      J && q(J);
    },
    onFind: () => I(!0)
  }), W(() => {
    var J;
    const E = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (J = F.current) == null || J.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = E;
    };
  }, []);
  function re(E) {
    var Y, te, B;
    if (E.key !== "Tab") return;
    const J = [
      ...((Y = F.current) == null ? void 0 : Y.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((S) => S.offsetParent !== null);
    if (!J.length) {
      E.preventDefault(), (te = F.current) == null || te.focus();
      return;
    }
    const H = J.indexOf(
      document.activeElement
    );
    E.shiftKey && H <= 0 ? (E.preventDefault(), (B = J.at(-1)) == null || B.focus()) : !E.shiftKey && H === J.length - 1 && (E.preventDefault(), J[0].focus());
  }
  function x(E) {
    if (w || E.defaultPrevented || E.ctrlKey || E.metaKey || E.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const J = E.key === "ArrowLeft" || E.key === "ArrowRight";
    if (E.altKey && !J) return;
    const H = _.current, Y = E.currentTarget.querySelector("video");
    if (E.key === "Enter" || E.key === "Escape")
      E.repeat || v();
    else if (E.key === " " && H)
      E.repeat || H.toggle();
    else if (J && H)
      H.seekBy(
        (E.key === "ArrowLeft" ? -1 : 1) * (E.shiftKey ? 5 : E.altKey ? 10 : 60)
      );
    else if (/^[0-9]$/.test(E.key) && H) {
      const te = K.current;
      if (!E.repeat && (te == null ? void 0 : te.videoId) === e.id) {
        const B = [Z == null ? void 0 : Z.duration, Y == null ? void 0 : Y.duration].find(
          (V) => V != null && Number.isFinite(V) && V > 0
        ) ?? 0, S = e.parentVideoId != null, ae = S ? e.clipStartSec ?? 0 : 0, C = (S ? e.clipEndSec ?? B : B) - ae;
        Number.isFinite(C) && C > 0 && Number.isFinite(te.time) && H.seekBy(ae + C * Number(E.key) / 10 - te.time);
      }
    } else if (E.key === "ArrowUp" || E.key === "ArrowDown")
      !E.repeat && !r && !o && (E.key === "ArrowUp" && u && b(), E.key === "ArrowDown" && g && y());
    else return;
    Fr(E);
  }
  function G(E) {
    const J = F.current, H = E.target instanceof Element ? E.target.closest("button, a[href]") : null;
    !J || !H || !J.contains(H) || H.closest(".dq-player, .dq-find-action") || E.detail === 0 || J.focus({ preventScroll: !0 });
  }
  W(() => {
    if (w) return;
    let E = 0;
    const J = requestAnimationFrame(() => {
      E = requestAnimationFrame(() => {
        var Y;
        const H = document.activeElement;
        (Y = F.current) != null && Y.isConnected && (!H || H === document.body || H === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(J), cancelAnimationFrame(E);
    };
  }, [w, r, o, g, u, e.id, U]);
  const R = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ee}`,
      className: `dq-preview${U ? " dq-preview-mobile" : ""}`,
      onKeyDown: re,
      onKeyDownCapture: x,
      onMouseDown: (E) => {
        E.target === E.currentTarget && v();
      },
      onClick: G,
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
                disabled: !u || r || o,
                onClick: b,
                children: [
                  /* @__PURE__ */ a(ha, { "aria-hidden": "true" }),
                  !U && /* @__PURE__ */ a(Nt, { binding: "↑", hidden: !0 })
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
                disabled: !g || r || o,
                onClick: y,
                children: [
                  !U && /* @__PURE__ */ a(Nt, { binding: "↓", hidden: !0 }),
                  /* @__PURE__ */ a($s, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ a("h2", { children: ee }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                R
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": f,
                disabled: o,
                onClick: m,
                children: [
                  /* @__PURE__ */ a("span", { className: "dq-preview-check", "aria-hidden": "true", children: f && /* @__PURE__ */ a(ua, {}) }),
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
                "aria-label": `Open ${ee} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ a(Os, { "aria-hidden": "true" })
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
                children: /* @__PURE__ */ a(fa, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ a("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ a("div", { className: "dq-preview-video", children: Z ? /* @__PURE__ */ a(
            Ss,
            {
              autostart: !0,
              streamUrl: ko("video", e.id),
              posterUrl: _i(e),
              format: Z.format,
              audioCodec: Z.audioCodec,
              duration: Z.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onTimeUpdate: (E) => {
                K.current = { videoId: e.id, time: E };
              },
              onPlaybackControlRegister: (E) => (_.current = E, () => {
                _.current === E && (_.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ a("img", { src: _i(e), alt: "" }) }) }),
          i && /* @__PURE__ */ a("p", { role: "alert", className: "dq-alert dq-preview-alert", children: i }),
          !U && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ a("span", { children: "Space play / pause" }),
            /* @__PURE__ */ a("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ a("span", { children: "0–9 jump to 0–90 %" }),
            /* @__PURE__ */ a("span", { children: "↑ ↓ previous / next" }),
            /* @__PURE__ */ a("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ a(
            wc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: d,
              isDisabled: ie,
              busy: r || o,
              onApply: (E) => void q(E),
              onFind: () => I(!0),
              status: r ? `Applying action to ${R}…` : "",
              summary: /* @__PURE__ */ a("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        w && /* @__PURE__ */ a(
          ui,
          {
            actions: t.actions,
            trees: d,
            isDisabled: ie,
            canStay: !1,
            onApply: (E) => {
              I(!1), q(E);
            },
            onClose: () => I(!1)
          }
        )
      ]
    }
  );
}
async function Ah() {
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
function ys({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ a(Hl, { className: "dq-spin" }),
    e
  ] });
}
function ws({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ a(Mn, {}),
    /* @__PURE__ */ a("p", { children: e }),
    /* @__PURE__ */ a("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Fh = { components: { DataQualityPage: wh } };
export {
  wh as DataQualityPage,
  Fh as default,
  vr as objectFiltersEqual
};
