import { jsxs as l, Fragment as we, jsx as r } from "react/jsx-runtime";
import { useState as A, useRef as $, useEffect as H, useLayoutEffect as kt, useMemo as ge, useCallback as kn, useSyncExternalStore as _o, useId as at, createContext as yl, useContext as wl, Fragment as jo } from "react";
import { useKeySequence as vl, EntityReferenceMultiSelector as Yn, SortableList as bs, TagBadge as Nl, EntityReferenceSelector as Ri, EntityDetailTabs as ql, DetailListToolbar as aa, PERFORMER_CRITERIA as Uo, AUDIO_CRITERIA as ys, VIDEO_CRITERIA as Ko, NarrativeText as Sl, AUDIO_SORT_OPTIONS as kl, VIDEO_SORT_OPTIONS as ws, AudioPlayer as El, VideoPlayer as vs, formatDuration as Ns, FilterDialog as Cl, getResolutionLabel as Al, ConfirmDialog as Tl, TAG_CRITERIA as Il, TAG_SORT_OPTIONS as Rl, TagTile as $l, VideoCard as Ol } from "@cove/runtime/components";
import { Search as la, Flag as xn, Check as da, Pencil as Dr, Ban as Da, ChevronDown as Go, Plus as Va, Pin as qs, GripVertical as Ss, AlertTriangle as Mn, Copy as ks, Trash2 as Bo, X as ua, Mic as Ml, Users as Es, Tag as Cs, Headphones as As, Film as za, ChevronLeft as fa, MoreHorizontal as Fl, RectangleHorizontal as xl, LayoutGrid as Vo, ChevronRight as Ts, Save as Pl, RotateCcw as Ll, Layers as $i, Undo2 as Dl, RefreshCw as _l, ExternalLink as Is, SkipForward as jl, Upload as Ul, Download as Rs, ArrowUp as Kl, ArrowDown as Gl, Loader2 as Bl, List as Vl, Grid3X3 as zl } from "@cove/runtime/lucide-react";
import { extensionFetch as Jl } from "@cove/runtime/api";
import { createPortal as Wl } from "react-dom";
const zo = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags"
}, Jo = Object.keys(
  zo
);
function oa(e) {
  return e === "excludes" || e === "excludesAll";
}
function Wo(e) {
  return e.targetMode === "all" || e.targetMode === "selected" && e.performerIds.length === 0 || e.targetMode === "filter" && Object.keys(e.performerFilter).length === 0;
}
function $s(e) {
  const t = [...e.performerFlags ?? []];
  for (const n of e.flagPerformerTagIds ?? [])
    t.some((a) => a.tagId === n && a.categoryTagId === void 0) || t.push({ tagId: n });
  return t;
}
function Hl(e, t) {
  const { performerFlags: n, flagPerformerTagIds: a, ...o } = e, i = [];
  for (const s of t)
    i.some(
      (c) => c.tagId === s.tagId && c.categoryTagId === s.categoryTagId
    ) || i.push(
      s.categoryTagId === void 0 ? { tagId: s.tagId } : { tagId: s.tagId, categoryTagId: s.categoryTagId }
    );
  return i.length ? { ...o, performerFlags: i } : o;
}
const Os = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence"
];
function $e(e) {
  return e.entityType === "performerOccurrence" || e.entityType === "audioPerformerOccurrence";
}
function Ho(e) {
  return e === "audio" || e === "audioPerformerOccurrence" ? "audio" : "video";
}
function Ke(e) {
  return Ho(Ue(e));
}
function Ql(e) {
  return Ue(e) === "video";
}
function Ue(e) {
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
  "b"
], ia = [
  Wn.slice(0, 11),
  Wn.slice(11, 22),
  Wn.slice(22)
], Hn = "none";
function gr(e) {
  return typeof e == "string" && Wn.includes(e);
}
function Qo(e) {
  const t = e.shortcut;
  return gr(t) || t === Hn ? t : "auto";
}
function Ms(e) {
  const t = e.map(() => ""), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = [];
  e.forEach((s, c) => {
    const u = Qo(s);
    if (u !== Hn) {
      if (u !== "auto") {
        if (!n.has(u)) {
          n.set(u, c), t[c] = u;
          return;
        }
        a.add(c);
      }
      o.push(c);
    }
  });
  const i = Wn.filter((s) => !n.has(s));
  return o.forEach((s, c) => {
    const u = i[c];
    u !== void 0 && (t[s] = u, n.set(u, s));
  }), { keys: t, actionOn: n, duplicatePins: a };
}
function Yl(e, t, n) {
  const { keys: a, actionOn: o } = Ms(e), i = /* @__PURE__ */ new Map([[t, n === "auto" ? void 0 : n]]);
  if (gr(n)) {
    const c = o.get(n), u = a[t];
    c !== void 0 && c !== t && i.set(c, u && e[t].shortcut === u ? u : void 0);
  }
  const s = new Set([...i.values()].filter(gr));
  return e.map((c, u) => {
    const p = i.has(u) ? i.get(u) : gr(c.shortcut) && s.has(c.shortcut) ? void 0 : c.shortcut;
    if (p === c.shortcut) return c;
    const { shortcut: d, ...g } = c;
    return p === void 0 ? g : { ...g, shortcut: p };
  });
}
function sa(e) {
  return $e(e) && !xs(e.occurrence) ? "Complete the optional occurrence condition before saving." : !Ql(e) && e.view.reviewMode === "multiple" ? "Only video reviews support the multiple-item layout." : Ue(e) !== "tag" && e.actions.some(
    (t) => Yo(t)
  ) ? "An action cannot contain contradictory assessments for the same tag." : !e.name.trim() || !e.actions.every((t) => Pn(t, Ue(e))) ? "Name the review and complete every action step before saving." : new Set(e.actions.map((t) => t.id)).size !== e.actions.length ? "Action IDs must be unique within a review." : "";
}
const Xl = {
  video: 1e3,
  audio: 250
};
function Gt(e, t = "video") {
  const n = (a, o) => Number.isFinite(Number(a)) && Number(a) > 0 ? Math.floor(Number(a)) : o;
  return {
    ...e,
    page: Math.max(1, n(e.page, 1)),
    perPage: Math.max(
      1,
      Math.min(Xl[t], n(e.perPage, 40))
    )
  };
}
function Oi(e, t, n) {
  return t != null && e.includes(t) ? t : e[Math.max(0, Math.min(n, e.length - 1))] ?? null;
}
function Jn(e) {
  const { page: t, ...n } = e.view.filter, a = [
    n,
    e.view.objectFilter,
    e.view.searchMode
  ];
  return JSON.stringify(
    $e(e) ? [e.entityType, ...a, e.occurrence] : Ue(e) === "video" ? a : [Ue(e), ...a]
  );
}
function Pn(e, t) {
  const n = t ?? ("effect" in e ? "tag" : "video");
  return e.label.trim() ? n === "tag" ? !("effect" in e) || "steps" in e || !e.effect || typeof e.effect != "object" ? !1 : ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
    e.effect.mode
  ) && (e.effect.mode !== "SET_TAG_GROUP" || Number.isSafeInteger(e.effect.tagGroupId) && e.effect.tagGroupId > 0) : !("steps" in e) || "effect" in e ? !1 : e.steps.every(
    (a) => [
      "ADD",
      "REMOVE",
      "REMOVE_TREE",
      "MARK_PRESENT",
      "MARK_ABSENT",
      "CLEAR_ABSENCE"
    ].includes(a.mode) && a.tagIds.length > 0 && a.tagIds.every((o) => Number.isSafeInteger(o) && o > 0)
  ) && !Yo(e) : !1;
}
function Zl(e) {
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
function Fs(e) {
  return "steps" in e && e.steps.length > 0;
}
function Qn(e) {
  return "steps" in e ? e.steps.some((t) => Fn(t.mode)) : !1;
}
function Yo(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e.steps)
    if (Fn(n.mode))
      for (const a of n.tagIds) {
        const o = t.get(a);
        if (o && o !== n.mode) return !0;
        t.set(a, n.mode);
      }
  return !1;
}
function ha(e) {
  if (!e) return [];
  const t = JSON.parse(e);
  if (!Array.isArray(t) || !t.every(
    (n) => n && typeof n == "object" && typeof n.id == "string" && typeof n.name == "string" && typeof n.description == "string" && (n.entityType === void 0 || Os.includes(n.entityType)) && (!Zl(n.entityType) || xs(n.occurrence)) && n.view && typeof n.view == "object" && (n.entityType === "tag" ? ["grid", "list"].includes(n.view.displayMode) : ["grid", "list", "wall", "tagger"].includes(
      n.view.displayMode
    )) && typeof n.view.searchMode == "string" && (n.view.startFrom === void 0 || ["beginning", "end"].includes(n.view.startFrom)) && (n.view.reviewMode === void 0 || ["single", "multiple"].includes(n.view.reviewMode)) && (n.view.reviewMode !== "multiple" || (n.entityType ?? "video") === "video") && (n.view.selectAllOnLoad === void 0 || typeof n.view.selectAllOnLoad == "boolean") && n.view.filter && typeof n.view.filter == "object" && !Array.isArray(n.view.filter) && n.view.objectFilter && typeof n.view.objectFilter == "object" && !Array.isArray(n.view.objectFilter) && ed(
      n.presentation,
      (n.entityType ?? "video") !== "video"
    ) && (n.importNotes === void 0 || Array.isArray(n.importNotes) && n.importNotes.every(
      (a) => typeof a == "string"
    )) && // Answer groups belong to actions that write tags; tag reviews have neither.
    (n.stayUntilGroupsAnswered === void 0 || typeof n.stayUntilGroupsAnswered == "boolean" && n.entityType !== "tag") && Array.isArray(n.actions) && n.actions.every(
      (a) => typeof (a == null ? void 0 : a.id) == "string" && typeof a.label == "string" && (a.shortcut === void 0 || typeof a.shortcut == "string") && (n.entityType === "tag" ? "effect" in a && !("steps" in a) && !("group" in a) && Pn(a, "tag") : "steps" in a && !("effect" in a) && Array.isArray(a.steps) && a.steps.every(
        (o) => o && Array.isArray(o.tagIds)
      ) && (a.group === void 0 || typeof a.group == "string") && Pn(a, "video"))
    )
  ))
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept."
    );
  if (t.some((n) => sa(n)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept."
    );
  if (new Set(t.map((n) => n.id)).size !== t.length)
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept."
    );
  return t;
}
function ed(e, t) {
  if (e === void 0) return !0;
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const n = e;
  return (n.cardSize === void 0 || n.cardSize === null || Number.isFinite(n.cardSize) && n.cardSize >= 115 && n.cardSize <= 380) && (!t || n.annotations === void 0 && n.annotationParents === void 0 && n.binParents === void 0) && (n.annotations === void 0 || Array.isArray(n.annotations) && n.annotations.every(
    (a) => ["date", "studio", "performers", "tags"].includes(a)
  )) && [n.annotationParents, n.binParents].every(
    (a) => a === void 0 || Array.isArray(a) && a.every((o) => Number.isSafeInteger(o) && o > 0)
  );
}
function yo(...e) {
  const t = [], n = /* @__PURE__ */ new Set();
  for (const a of e)
    for (const o of a)
      n.has(o.id) || (n.add(o.id), t.push(o));
  return t;
}
function td(e, t) {
  const n = (c) => c.trim().toLocaleLowerCase(), a = new Set(t.map((c) => n(c.name))), o = e.trim(), i = o.replace(/ copy(?: \d+)?$/i, ""), s = `${i !== o && a.has(n(i)) ? i : o} copy`;
  for (let c = 1; ; c++) {
    const u = c === 1 ? s : `${s} ${c}`;
    if (!a.has(n(u))) return u;
  }
}
function nd(e, t, n) {
  return { ...structuredClone(e), id: n, name: td(e.name, t) };
}
function xs(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return !1;
  const t = e, n = (a) => Array.isArray(a) && a.every((o) => Number.isSafeInteger(o) && o > 0) && new Set(a).size === a.length;
  return ["all", "selected", "filter"].includes(t.targetMode) && n(t.performerIds) && !!t.performerFilter && typeof t.performerFilter == "object" && !Array.isArray(t.performerFilter) && Jo.includes(t.condition) && n(t.conditionTagIds) && (["any", "isNull"].includes(t.condition) || t.conditionTagIds.length > 0) && (t.includeSubtags === void 0 || typeof t.includeSubtags == "boolean") && (t.hideConfirmedAbsent === void 0 || typeof t.hideConfirmedAbsent == "boolean") && (t.performerFlags === void 0 || rd(t.performerFlags)) && (t.flagPerformerTagIds === void 0 || n(t.flagPerformerTagIds)) && n(t.tagIds) && typeof t.multiple == "boolean";
}
function rd(e) {
  if (!Array.isArray(e)) return !1;
  const t = (a) => Number.isSafeInteger(a) && a > 0, n = /* @__PURE__ */ new Set();
  return e.every((a) => {
    if (!a || typeof a != "object" || Array.isArray(a)) return !1;
    const { tagId: o, categoryTagId: i } = a;
    if (!t(o) || i !== void 0 && !t(i))
      return !1;
    const s = `${o}:${i ?? ""}`;
    return n.has(s) ? !1 : (n.add(s), !0);
  });
}
function Mi(e, t) {
  return e.size > 0 ? [...e].sort((n, a) => n - a) : t == null ? [] : [t];
}
function Fi(e, t, n, a) {
  if (t.length === 0) return null;
  if (n == null) return t[0];
  if (!a && t.includes(n)) return n;
  const o = Math.max(0, e.indexOf(n));
  if (a) {
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
function ad(e, t) {
  const n = new Set(e), a = t.length > 0 && t.every((o) => n.has(o));
  for (const o of t)
    a ? n.delete(o) : n.add(o);
  return n;
}
function od(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]'
  ) : !1;
}
function pn(e) {
  const t = "nativeEvent" in e ? e.nativeEvent : e;
  return t.isComposing || t.keyCode === 229;
}
function id(e) {
  return e instanceof HTMLElement ? e === document.body || e === document.documentElement ? !0 : e.closest(
    ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview"
  ) ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]'
  ) : !1 : !1;
}
function sd(e) {
  return !(e instanceof HTMLElement) || !e.isConnected ? !1 : ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName) || e.isContentEditable || e.closest('[contenteditable]:not([contenteditable="false"])') != null;
}
function cd(e) {
  return e instanceof HTMLElement ? !e.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]'
  ) : !1;
}
function ld(e, t) {
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
const Ps = "ext:com.midnightrider.data-quality:configuration", dd = "ext:cove-data-quality:video-reviews", wo = "ext:com.midnightrider.data-quality:progress";
class Ls extends Error {
}
const pa = /* @__PURE__ */ new Map(), Ia = /* @__PURE__ */ new Map(), hr = (e, t) => e.includes("*") || e.includes(t), _a = (e) => pe(`/api/savedfilters?mode=${encodeURIComponent(e)}`), ud = () => ({
  version: 2,
  revision: crypto.randomUUID(),
  reviews: [],
  deletedIds: [],
  importedIds: []
});
function vo(e) {
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
    reviews: ha(JSON.stringify(t.reviews)),
    deletedIds: vo(t.deletedIds),
    importedIds: vo(t.importedIds)
  };
}
function fd(e) {
  const t = [
    `cove-data-quality-reviews-v1:${e}`,
    `cove-video-reviews-v1:${e}`
  ];
  let n;
  const a = /* @__PURE__ */ new Set();
  for (const o of t) {
    const i = localStorage.getItem(o);
    if (i !== null) {
      const s = ha(i);
      n ?? (n = s), s.forEach((c) => a.add(c.id));
    }
    vo(
      JSON.parse(localStorage.getItem(`${o}:account-imports`) ?? "[]")
    ).forEach((s) => a.add(s));
  }
  return {
    reviews: n ?? [],
    known: [...a],
    present: n !== void 0
  };
}
async function Ds(e) {
  const t = await pe("/api/auth/me");
  if (String(t.user.id) !== e.userId)
    throw new Error("The signed-in account changed. Reload before saving.");
}
function Xo(e, t) {
  const n = (Ia.get(e) ?? Promise.resolve()).catch(() => {
  }).then(t);
  return Ia.set(e, n), n.finally(() => {
    Ia.get(e) === n && Ia.delete(e);
  }).catch(() => {
  }), n;
}
let Zr = null;
function hd() {
  if (Zr) return Zr;
  const e = pd();
  return Zr = e, e.finally(() => {
    Zr === e && (Zr = null);
  }).catch(() => {
  }), e;
}
async function pd() {
  const e = await pe("/api/auth/me"), t = `cove-data-quality-v2:${String(e.user.id)}`;
  return Xo(t, () => md(e, t));
}
async function md(e, t) {
  var m;
  const n = String(e.user.id), a = hr(e.permissions, "savedfilters.read"), o = a && hr(e.permissions, "savedfilters.write"), i = a ? (await _a(Ps)).filter((b) => b.name === "Data Quality configuration").sort((b, y) => b.id - y.id) : [];
  if (i.length > 1) {
    const b = (y) => {
      const { revision: q, ...v } = Mr(y.uiOptions);
      return JSON.stringify(v);
    };
    if (i.some((y) => b(y) !== b(i[0])))
      throw new Error(
        "Conflicting Data Quality configurations were found. Existing data has been kept; resolve the duplicate account records before saving."
      );
    if (o)
      for (const y of i.slice(1))
        await pe(`/api/savedfilters/${y.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: `Data Quality recovery ${y.id}` })
        });
    i.splice(1);
  }
  let s = i.length ? Mr(i[0].uiOptions) : ud();
  const c = localStorage.getItem(`${t}:migrated`) === "true", u = localStorage.getItem(t), p = localStorage.getItem(`${t}:local-only`) === "true";
  !i.length && u && (s = Mr(u));
  let d = !i.length;
  if (i.length && p && u) {
    const b = Mr(u);
    if (b.reviews.some((q) => {
      const v = s.reviews.find((w) => w.id === q.id);
      return v && JSON.stringify(v) !== JSON.stringify(q);
    }))
      throw new Error(
        "Browser-only reviews conflict with account edits. Neither version was overwritten. Export the browser reviews before reconciling them with the account configuration."
      );
    const y = [
      .../* @__PURE__ */ new Set([...s.deletedIds, ...b.deletedIds])
    ];
    s = {
      ...s,
      reviews: yo(s.reviews, b.reviews).filter(
        (q) => !y.includes(q.id)
      ),
      deletedIds: y,
      importedIds: [
        .../* @__PURE__ */ new Set([...s.importedIds, ...b.importedIds])
      ]
    }, d = !0;
  }
  if (!c) {
    const b = JSON.stringify(s), y = fd(n);
    if (i.length && y.reviews.some((T) => {
      const F = s.reviews.find((U) => U.id === T.id);
      return F && JSON.stringify(F) !== JSON.stringify(T);
    }))
      throw new Error(
        "Unmigrated browser reviews conflict with account edits. Neither version was overwritten. Export the browser reviews for recovery, then use a fresh browser to review the account configuration."
      );
    const q = a ? (await _a(dd)).flatMap(
      (T) => ha(T.uiOptions ?? "[]")
    ) : [], v = y.known.filter(
      (T) => !y.reviews.some((F) => F.id === T)
    ), w = /* @__PURE__ */ new Set([...s.deletedIds, ...v]);
    s = {
      ...s,
      reviews: yo(
        y.reviews,
        s.reviews,
        q.filter(
          (T) => !y.known.includes(T.id) && !s.importedIds.includes(T.id)
        )
      ).filter((T) => !w.has(T.id)),
      deletedIds: [...w],
      importedIds: [
        .../* @__PURE__ */ new Set([
          ...s.importedIds,
          ...y.known,
          ...q.map((T) => T.id)
        ])
      ]
    }, d || (d = JSON.stringify(s) !== b);
  }
  const g = {
    userId: n,
    recordId: (m = i[0]) == null ? void 0 : m.id,
    config: s,
    readable: a,
    writable: o,
    durable: o
  };
  if (pa.set(t, g), d && o) {
    const b = s;
    i.length && (g.config = Mr(i[0].uiOptions)), await _s(t, b), s = g.config;
  } else i.length || (localStorage.setItem(t, JSON.stringify(s)), !a && (!c || p) && localStorage.setItem(`${t}:local-only`, "true"));
  if (!a) localStorage.setItem(`${t}:migrated`, "true");
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
    canConfigure: !a || o,
    /** Where the configuration is kept: the account, the account without write access, or this browser. */
    storage: a ? o ? "account" : "readOnly" : "browser",
    storageNotice: a ? o ? "" : "Account reviews are read-only. Saved filter write permission is required to save configuration and progress." : "Reviews and progress are saved only in this browser. Saved filter read and write permissions enable account storage."
  };
}
async function _s(e, t) {
  const n = pa.get(e);
  if (!n) throw new Error("Reload reviews before saving.");
  if (n.readable && !n.writable)
    throw new Error(
      "Saved filter write permission is required to save account reviews."
    );
  const a = { ...t, revision: crypto.randomUUID() };
  if (n.durable) {
    if (await Ds(n), n.recordId != null) {
      const i = await pe(
        `/api/savedfilters/${n.recordId}`
      );
      if (Mr(i.uiOptions).revision !== n.config.revision)
        throw new Ls(
          "Reviews changed in another browser. Your draft is still open. Export it, then reload before saving."
        );
    }
    const o = await pe(
      n.recordId == null ? "/api/savedfilters" : `/api/savedfilters/${n.recordId}`,
      {
        method: n.recordId == null ? "POST" : "PUT",
        body: JSON.stringify({
          mode: Ps,
          name: "Data Quality configuration",
          uiOptions: JSON.stringify(a)
        })
      }
    );
    n.recordId = o.id;
  } else
    localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:local-only`, "true");
  if (n.config = a, n.durable)
    try {
      localStorage.setItem(e, JSON.stringify(a)), localStorage.setItem(`${e}:migrated`, "true"), localStorage.removeItem(`${e}:local-only`);
    } catch {
    }
}
function gd(e, t) {
  return Xo(e, async () => {
    const n = pa.get(e);
    if (!n) throw new Error("Reload reviews before saving.");
    const a = n.config.reviews, o = t(a);
    if (o === a) return a;
    ha(JSON.stringify(o));
    const i = a.filter((s) => !o.some((c) => c.id === s.id)).map((s) => s.id);
    return await _s(e, {
      ...n.config,
      reviews: o,
      deletedIds: [
        .../* @__PURE__ */ new Set([...n.config.deletedIds, ...i])
      ].filter((s) => !o.some((c) => c.id === s))
    }), o;
  });
}
function xi(e) {
  const t = JSON.parse(e);
  if ((t == null ? void 0 : t.version) !== 1 || typeof t.signature != "string" || !t.filter || typeof t.filter != "object" || Array.isArray(t.filter) || !Number.isSafeInteger(t.index) || t.index < 0 || t.focusedId !== null && (!Number.isSafeInteger(t.focusedId) || t.focusedId <= 0) || !["grid", "list", "wall"].includes(t.displayMode) || t.cardSize !== null && (!Number.isFinite(t.cardSize) || t.cardSize < 115 || t.cardSize > 380) || !Number.isFinite(t.updatedAt) || t.occurrence !== void 0 && (!t.occurrence || t.occurrence.answerSignature !== void 0 && typeof t.occurrence.answerSignature != "string" || t.occurrence.focusedKey !== null && !/^[1-9]\d*:[1-9]\d*$/.test(t.occurrence.focusedKey) || !t.occurrence.outcomes || typeof t.occurrence.outcomes != "object" || Array.isArray(t.occurrence.outcomes) || !Object.entries(t.occurrence.outcomes).every(([n, a]) => /^[1-9]\d*:[1-9]\d*$/.test(n) && ["reviewed", "cannotDetermine"].includes(String(a)))))
    throw new Error(
      "Saved review progress could not be read. Existing progress has been kept."
    );
  return t;
}
async function bd(e, t) {
  const n = pa.get(e);
  if (!n) return null;
  const a = localStorage.getItem(`${e}:progress:${t}`), o = a ? xi(a) : null;
  if (!n.readable) return o;
  const i = (await _a(wo)).find(
    (c) => c.name === t
  ), s = i ? xi(i.uiOptions) : null;
  return o && (!s || o.updatedAt > s.updatedAt) ? o : s;
}
function yd(e, t, n) {
  const a = `${e}:progress:${t}`;
  try {
    localStorage.setItem(a, JSON.stringify(n));
  } catch {
  }
  return Xo(a, async () => {
    const o = pa.get(e);
    if (!(o != null && o.writable)) return;
    await Ds(o);
    const i = (await _a(wo)).find(
      (s) => s.name === t
    );
    await pe(
      i ? `/api/savedfilters/${i.id}` : "/api/savedfilters",
      {
        method: i ? "PUT" : "POST",
        body: JSON.stringify({
          mode: wo,
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
const wd = {
  video: { one: "video", many: "videos", queue: "scene" },
  audio: { one: "audio", many: "audios", queue: "audio" }
};
function Cn(e) {
  return wd[e];
}
const ja = "confirmed_absent_tags", Zo = "Confirmed absent tags", Ja = "confirmed_absent_occurrence_tags", js = {
  key: ja,
  label: Zo,
  type: "tag",
  subject: "tag assessments"
}, ei = {
  key: Ja,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments"
}, vd = {
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
      t === "modifier" && typeof n == "string" ? vd[n] ?? n : t === "key" && typeof n == "string" && [
        ja,
        Ja
      ].includes(n.toLowerCase()) ? n.toLowerCase() : Ln(n)
    ])
  ) : e;
}
async function Us(e, t, n) {
  const a = new Headers(t.headers);
  !(t.body instanceof FormData) && !a.has("Content-Type") && a.set("Content-Type", "application/json");
  const o = await Jl(e, { ...t, headers: a });
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
async function pe(e, t = {}) {
  return await Us(e, t, "fail");
}
function Nd(e, t = {}) {
  return Us(e, t, "null");
}
const qd = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let Sd = 0;
function No(e, t) {
  return pe(
    `/api/${Zn(e)}/${t}?dqRead=${qd}-${++Sd}`,
    { cache: "no-store" }
  );
}
function Ks(e, t) {
  const n = { ...e.view.objectFilter }, a = n._filterExpression;
  if (delete n._filterExpression, delete n.includeCompilationGroups, e.view.searchMode === "visual" && typeof t.q == "string" && t.q.trim())
    throw new Error(
      "Visual similarity review searches are not available to extensions yet."
    );
  return JSON.stringify(
    Ln({
      findFilter: Gt(t, Ke(e)),
      objectFilter: n,
      filterExpression: a
    })
  );
}
async function na(e, t, n) {
  return pe(
    `/api/${Zn(Ke(e))}/find`,
    { method: "POST", signal: n, body: Ks(e, t) }
  );
}
async function kd(e, t, n) {
  return (await pe(
    `/api/${Zn(Ke(e))}/aggregate`,
    {
      method: "POST",
      signal: n,
      body: Ks(e, { ...t, page: 1, perPage: 1 })
    }
  )).count;
}
async function Pi(e, t, n) {
  const a = { ...e.view.objectFilter };
  return delete a._filterExpression, pe("/api/tags/find", {
    method: "POST",
    signal: n,
    body: JSON.stringify(
      Ln({
        findFilter: Gt(t),
        objectFilter: a
      })
    )
  });
}
function Ed(e) {
  return pe("/api/taggroups", { signal: e });
}
function qo(e, t, n = 1280) {
  return `/api/${Zn(e)}/${t.id}/image?max=${n}&v=${encodeURIComponent(t.updatedAt)}`;
}
function So(e, t) {
  return e === "audio" ? `/api/audios/${t}/stream` : `/api/stream/video/${t}`;
}
function Li(e) {
  return `/api/stream/video/${e.id}/screenshot?v=${encodeURIComponent(e.updatedAt)}`;
}
function Cd(e) {
  return `/api/stream/video/${e}/preview`;
}
function Ad(e) {
  return `/api/stream/video/${e}/preview/status`;
}
function Td(e) {
  return "steps" in e && e.steps.length ? new Promise((t) => window.setTimeout(t, 1100)) : Promise.resolve();
}
async function Wa(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e) {
    await pe(`/api/tags/${a}`, { signal: t }), n.add(a);
    for (let o = 1; ; o++) {
      const i = await pe("/api/tags/find", {
        method: "POST",
        signal: t,
        body: JSON.stringify(
          Ln({
            findFilter: { page: o, perPage: 1e3, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [a],
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
async function ti(e, t) {
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
function Id(e, t) {
  const n = [];
  return t.type !== e.type && n.push(`type "${e.type}"`), t.isMultiValue || n.push("multiple values enabled"), t.filterable || n.push("filtering enabled"), n.length ? `The ${e.key} custom field is incompatible. It must have ${n.join(", ")}.` : "";
}
async function ni(e, t) {
  const a = (await pe("/api/custom-fields")).find(
    (i) => i.key.toLowerCase() === e.key
  );
  if (!a)
    return {
      kind: "missing",
      message: `Create the ${e.label} custom field before applying ${e.subject}.`
    };
  const o = Id(e, a);
  return o ? { kind: "incompatible", message: o } : a.entityTypes.includes(t) ? { kind: "ready", definition: a, message: "" } : {
    kind: "missing",
    message: `Add ${Cn(t).many} to the ${e.label} custom field before applying ${e.subject}.`,
    definition: a
  };
}
async function Gs(e, t) {
  const n = await ni(e, t);
  if (n.kind !== "ready") {
    if (n.kind === "incompatible") throw new Error(n.message);
    if (n.definition) {
      await pe(`/api/custom-fields/${n.definition.id}`, {
        method: "PUT",
        body: JSON.stringify({
          entityTypes: [.../* @__PURE__ */ new Set([...n.definition.entityTypes, t])]
        })
      });
      return;
    }
    await pe("/api/custom-fields", {
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
function Bs(e = "video") {
  return ni(js, e);
}
function Rd(e = "video") {
  return Gs(js, e);
}
function Vs(e = "video") {
  return ni(ei, e);
}
function $d(e = "video") {
  return Gs(ei, e);
}
function Ua(e) {
  return [...new Set(e)];
}
function zs(e, t) {
  const n = e.customFields ?? {}, a = Object.keys(n).find(
    (i) => i.toLowerCase() === Ja
  ), o = a === void 0 ? [] : n[a];
  return Ua(
    (Array.isArray(o) ? o : []).filter(
      (i) => typeof i == "string" && /^[1-9]\d*:[1-9]\d*$/.test(i)
    ).map((i) => i.split(":").map(Number)).filter(([i]) => i === t).map(([, i]) => i)
  );
}
async function Od(e) {
  let t;
  try {
    t = await Vs(e);
  } catch (n) {
    throw new Error(
      `Could not verify the ${ei.label} custom field. ${n instanceof Error ? n.message : "Request failed."}`
    );
  }
  if (t.kind !== "ready") throw new Error(t.message);
  return t.definition.key;
}
async function Md(e, t, n, a, o, i) {
  await pe(`/api/${Zn(t)}/bulk`, {
    method: "POST",
    body: JSON.stringify({
      ids: [n],
      customFields: {
        [e]: Ua(o).map((s) => `${a}:${s}`)
      },
      customFieldMode: i
    })
  });
}
function Fd(e, t, n) {
  const a = [...e.tagIds], o = (i) => {
    if (n === null)
      throw new Error(
        `The ${Zo} custom field is not available.`
      );
    return { customFields: { [n]: a }, customFieldMode: i };
  };
  switch (e.mode) {
    case "ADD":
      return { ids: t, tagIds: a, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids: t, tagIds: a, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids: t, tagIds: a, tagMode: "ADD", ...o("REMOVE") };
    case "MARK_ABSENT":
      return { ids: t, tagIds: a, tagMode: "REMOVE", ...o("ADD") };
    case "CLEAR_ABSENCE":
      return { ids: t, ...o("REMOVE") };
  }
}
async function Js(e, t, n) {
  if (!Pn(t) || n.length === 0 || n.some((u) => !Number.isSafeInteger(u) || u <= 0))
    throw new Error(
      `Choose ${Cn(e).many} and configure a valid action first.`
    );
  let a = null;
  if (Qn(t)) {
    let u;
    try {
      u = await Bs(e);
    } catch (p) {
      throw new Error(
        `Could not verify the ${Zo} custom field. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
    if (u.kind !== "ready") throw new Error(u.message);
    a = u.definition.key;
  }
  const o = Ua(n), i = (await ti(t)).map((u) => ({
    mode: u.mode,
    tagIds: Ua(u.tagIds)
  })), c = [
    ...i.filter((u) => !Fn(u.mode)),
    ...i.filter((u) => Fn(u.mode))
  ].map(
    (u) => Fd(u, o, a)
  );
  for (let u = 0; u < c.length; u++)
    try {
      await pe(`/api/${Zn(e)}/bulk`, {
        method: "POST",
        body: JSON.stringify(c[u])
      });
    } catch (p) {
      throw new Error(
        `Step ${u + 1} failed; ${u} earlier step(s) completed. Refresh and check the selected ${Cn(e).many} before retrying. ${p instanceof Error ? p.message : "Request failed."}`
      );
    }
}
async function xd(e, t) {
  if (!Pn(e, "tag") || t.length === 0 || t.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Choose tags and configure a valid action first.");
  e.effect.mode !== "SKIP" && await pe("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      e.effect.mode === "SET_TAG_GROUP" ? { ids: [...new Set(t)], tagGroupId: e.effect.tagGroupId } : { ids: [...new Set(t)], clearFields: ["tagGroupId"] }
    )
  });
}
const Ra = (e) => e >= "0" && e <= "9";
function Di(e) {
  const t = e.toUpperCase();
  return t.length === 1 ? t : e;
}
function _i(e, t) {
  if (e == null) return t == null ? 0 : -1;
  if (t == null) return 1;
  if (e === t) return 0;
  let n = 0, a = 0;
  for (; n < e.length && a < t.length; ) {
    if (Ra(e[n]) && Ra(t[a])) {
      const c = n, u = a;
      for (; n < e.length && Ra(e[n]); ) n++;
      for (; a < t.length && Ra(t[a]); ) a++;
      const p = e.slice(c, n).replace(/^0+/, ""), d = t.slice(u, a).replace(/^0+/, "");
      if (p.length !== d.length) return p.length < d.length ? -1 : 1;
      if (p !== d) return p < d ? -1 : 1;
      continue;
    }
    const i = Di(e[n]), s = Di(t[a]);
    if (i !== s) return i < s ? -1 : 1;
    n++, a++;
  }
  const o = e.length - n - (t.length - a);
  return o !== 0 ? o < 0 ? -1 : 1 : e < t ? -1 : e > t ? 1 : 0;
}
function Ws(e, t) {
  const n = (o) => o.tagGroupId != null ? 0 : 1, a = (o) => o.tagGroupSortOrder ?? Number.MAX_SAFE_INTEGER;
  return n(e) - n(t) || Math.sign(a(e) - a(t)) || _i(e.tagGroupName, t.tagGroupName) || _i(e.sortName ?? e.name, t.sortName ?? t.name) || Math.sign(e.id - t.id);
}
function br(e) {
  return [...e].sort(Ws);
}
const ko = /* @__PURE__ */ new Map();
function Pd(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if ("steps" in n)
      for (const a of n.steps)
        a.mode === "REMOVE_TREE" && a.tagIds.forEach((o) => t.add(o));
  return [...t];
}
function ri(e, t, n) {
  const a = Xn(e), o = [], i = [];
  for (const m of e.steps) {
    if (m.mode !== "REMOVE_TREE") {
      i.push(m);
      continue;
    }
    const b = m.tagIds.flatMap((y) => {
      const q = n.get(y);
      return q || o.push(y), q ?? [y];
    });
    i.push({ mode: "REMOVE", tagIds: b.filter((y) => !a.has(y)) });
  }
  const s = [
    ...i.filter((m) => !Fn(m.mode)),
    ...i.filter((m) => Fn(m.mode))
  ], c = new Set(t.ids), u = new Set(t.absent);
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
          c.add(b), u.delete(b);
          break;
        case "MARK_ABSENT":
          c.delete(b), u.add(b);
          break;
        case "CLEAR_ABSENCE":
          u.delete(b);
          break;
      }
  const p = new Set(t.ids), d = new Set(t.absent), g = [...new Set(e.steps.flatMap((m) => m.tagIds))];
  return {
    added: g.filter((m) => c.has(m) && !p.has(m)),
    removed: [...p].filter((m) => !c.has(m)),
    markedAbsent: g.filter((m) => u.has(m) && !d.has(m)),
    absenceCleared: [...d].filter((m) => !u.has(m)),
    unresolvedTrees: [...new Set(o)]
  };
}
function Ld(e) {
  let t;
  if (e.applications) {
    const n = /* @__PURE__ */ new Map();
    for (const a of e.applications)
      n.has(a.tag.id) || n.set(a.tag.id, a.tag);
    t = [...n.values()];
  } else
    t = e.tags ?? e.ids.map((n, a) => ({ id: n, name: e.names[a] ?? "" }));
  return br(t);
}
function Hs(e) {
  return Qs(Pd(e));
}
function Qs(e) {
  const t = [...new Set(e)].sort((s, c) => s - c).join(","), [n, a] = A(() => /* @__PURE__ */ new Map()), o = $(/* @__PURE__ */ new Set()), i = $(!0);
  return H(() => (i.current = !0, () => {
    i.current = !1;
  }), []), H(() => {
    const s = t ? t.split(",").map(Number) : [];
    for (const c of s)
      o.current.has(c) || (o.current.add(c), Wa([c]).then(
        (u) => {
          i.current && a((p) => new Map(p).set(c, u));
        },
        () => {
          o.current.delete(c);
        }
      ));
  }, [t]), n;
}
function Nt(e) {
  return (e ?? "").trim().toLocaleLowerCase();
}
function wr(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, a) => {
    const o = Nt(n.group);
    if (!o) return;
    const i = t.get(o);
    i ? i.actions.push(a) : t.set(o, { key: o, name: n.group.trim(), actions: [a] });
  }), [...t.values()];
}
function ji(e) {
  return e.stayUntilGroupsAnswered === !0 && e.actions.some((t) => Nt(t.group) !== "");
}
function Ys(e) {
  return new Set(
    e.applications ? e.applications.map((t) => t.tag.id) : e.ids
  );
}
function Xs(e) {
  return new Set(
    e.steps.filter((t) => t.mode === "MARK_ABSENT").flatMap((t) => t.tagIds)
  );
}
function Zs(e) {
  return Xn(e).size > 0 || Xs(e).size > 0;
}
function Dd(e) {
  return wr(e).filter(
    (t) => !t.actions.some((n) => Zs(e[n]))
  );
}
function Eo(e, t) {
  const n = Ys(t), a = new Set(t.absent);
  return wr(e).map((o) => {
    const i = [], s = [];
    for (const c of o.actions) {
      const u = [...Xn(e[c])], p = [...Xs(e[c])], d = [
        ...u.map((g) => n.has(g)),
        ...p.map((g) => a.has(g))
      ];
      d.some(Boolean) && (s.push(c), d.every(Boolean) && i.push(c));
    }
    return { ...o, answers: i.length ? i : s };
  });
}
function Co(e) {
  return e.filter((t) => t.answers.length === 0);
}
function _d(e, t, n) {
  const a = { ids: [...Ys(t)], absent: t.absent }, o = ri(e, a, n), i = new Set(o.removed), s = new Set(o.absenceCleared);
  return {
    ids: [...a.ids.filter((c) => !i.has(c)), ...o.added],
    absent: [...a.absent.filter((c) => !s.has(c)), ...o.markedAbsent]
  };
}
const xr = "review";
function jd(e) {
  return [...new Set(e.map((t) => t.tagId))];
}
function Ud(e) {
  return [
    ...new Set(e.flatMap((t) => t.categoryTagId === void 0 ? [] : [t.categoryTagId]))
  ];
}
function pr(e, t) {
  const n = new Set(jd(e));
  return t.filter((a) => n.has(a.id));
}
function Ui(e, t, n) {
  const a = /* @__PURE__ */ new Map(), o = (s, c) => {
    const u = a.get(s) ?? c();
    return a.set(s, u), u;
  };
  for (const s of pr(e, t))
    for (const c of e) {
      if (c.tagId !== s.id) continue;
      const u = c.categoryTagId === void 0 ? o(xr, () => ({
        key: xr,
        name: "",
        tagIds: null,
        flags: [],
        mixed: []
      })) : o(`tag:${c.categoryTagId}`, () => {
        const { name: p, tagIds: d, resolved: g } = n(c.categoryTagId);
        return {
          key: `tag:${c.categoryTagId}`,
          name: p,
          tagIds: d,
          flags: [],
          mixed: [],
          ...g ? {} : { unresolved: !0 }
        };
      });
      u.flags.includes(s.name) || u.flags.push(s.name);
    }
  const i = [...a.values()];
  return [
    ...i.filter((s) => s.key === xr),
    ...i.filter((s) => s.key !== xr)
  ];
}
function Ao(e, t, n) {
  return e !== n.key && e.startsWith("tag:") && n.members.every((a) => t.includes(a));
}
function ai(e) {
  const t = e.flatMap((o) => o.mixed), n = (o, i) => t.some(
    (s, c) => Ao(s.key, s.members, o) && !(c > i && Ao(o.key, o.members, s))
  ), a = /* @__PURE__ */ new Map();
  return t.forEach((o, i) => {
    !a.has(o.key) && !n(o, i) && a.set(o.key, {
      key: o.key,
      name: o.name,
      tagIds: o.members,
      flags: [],
      mixed: o.tags
    });
  }), [...a.values()];
}
function Kd(e, t) {
  return t.filter(
    (n) => n.key === e.key || Ao(n.key, n.tagIds ?? [], e)
  );
}
function ec(...e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e.flat()) {
    const o = t.get(a.key);
    if (!o) {
      t.set(a.key, { ...a, flags: [...a.flags] });
      continue;
    }
    for (const i of a.flags) o.flags.includes(i) || o.flags.push(i);
    o.mixed.length || (o.mixed = a.mixed), o.unresolved && !a.unresolved && delete o.unresolved, o.tagIds !== null && a.tagIds !== null && (o.tagIds = [.../* @__PURE__ */ new Set([...o.tagIds, ...a.tagIds])]);
  }
  const n = [...t.values()];
  return [
    ...n.filter((a) => a.key === xr),
    ...n.filter((a) => a.key !== xr)
  ];
}
function Gd(e, t) {
  const n = /* @__PURE__ */ new Set();
  for (const a of e.steps)
    if (a.mode !== "CLEAR_ABSENCE")
      for (const o of a.tagIds)
        for (const i of a.mode === "REMOVE_TREE" ? t.get(o) ?? [o] : [o])
          n.add(i);
  return n;
}
function tc(e, t, n) {
  if (t.tagIds === null) return !0;
  const a = Gd(e, n);
  return t.tagIds.some((o) => a.has(o));
}
function Bd(e, t, n) {
  return t.filter(
    (a) => a.tagIds === null || a.unresolved && e.length > 0 || e.some((o) => tc(o, a, n))
  );
}
function Vd(e, t, n) {
  return t.filter((a) => a.tagIds !== null && tc(e, a, n));
}
function zd(e) {
  return `Mixed: ${e.map((t) => `${t.name} ${t.count.toLocaleString()}`).join(" · ")}`;
}
function oi(e) {
  return [
    ...e.flags.length ? [`Flagged: ${e.flags.join(", ")}`] : [],
    ...e.mixed.length ? [zd(e.mixed)] : []
  ];
}
function Jd(e) {
  const t = oi(e).join("; ");
  return e.tagIds === null ? t : `${e.name} (${t})`;
}
function Wd(e, t, n) {
  const a = pr(e, t).map((o) => {
    const i = e.filter((c) => c.tagId === o.id);
    if (i.every((c) => c.categoryTagId === void 0)) return o.name;
    const s = i.map(
      (c) => c.categoryTagId === void 0 ? "whole review" : n(c.categoryTagId)
    );
    return `${o.name} (affects ${[...new Set(s)].join(", ")})`;
  });
  return a.length ? `Flagged: ${a.join(", ")}` : "";
}
const To = "-", Ki = "Ctrl+a", Hd = "Ctrl/⌘A", Qd = ["f", "g", "k"], so = "Shift+";
function jr(e) {
  return ge(() => Ms(e), [e]);
}
function ii({
  surface: e,
  enabled: t,
  actions: n,
  onAction: a,
  onFind: o,
  onSelectAll: i
}) {
  const s = jr(n), c = $({ keyMap: s, onAction: a, onFind: o, onSelectAll: i });
  kt(() => {
    c.current = { keyMap: s, onAction: a, onFind: o, onSelectAll: i };
  });
  const u = !!o && n.length > 0, p = e === "local" && !!i, d = Wn.filter(
    (m) => s.actionOn.has(m) || e === "local" && Qd.includes(m)
  ).join(" "), g = ge(() => {
    const m = (q) => {
      var w, T;
      const v = c.current;
      if (q === Ki) (w = v.onSelectAll) == null || w.call(v);
      else if (q === To) (T = v.onFind) == null || T.call(v);
      else {
        const F = q.startsWith(so), U = v.keyMap.actionOn.get(
          F ? q.slice(so.length) : q
        );
        U !== void 0 && v.onAction(U, F);
      }
    }, b = (q, v = e) => ({
      keys: q,
      surface: v,
      action: (w) => {
        w != null && w.repeat || m((w == null ? void 0 : w.sequence) ?? q);
      }
    }), y = [];
    p && y.push(b(Ki, "local")), u && y.push(b(To));
    for (const q of d ? d.split(" ") : [])
      y.push(b(q), b(`${so}${q}`));
    return y;
  }, [e, d, u, p]);
  vl(g, t);
}
const Yd = {
  find: To,
  selectAll: Hd
};
function si() {
  return Yd;
}
const Xd = 600 * 1e3, ci = /* @__PURE__ */ new Map(), nc = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map();
function rc(e) {
  if (e.tagGroupId == null || e.tagGroupSortOrder != null) return e;
  const t = nc.get(e.tagGroupId);
  return t === void 0 ? e : { ...e, tagGroupSortOrder: t };
}
function ac(e) {
  e.tagGroupId != null && typeof e.tagGroupSortOrder == "number" && nc.set(e.tagGroupId, e.tagGroupSortOrder), ci.set(e.id, { tag: e, at: Date.now() });
}
function oc(e) {
  const t = ci.get(e);
  if (!(!t || Date.now() - t.at > Xd))
    return rc(t.tag);
}
function ic(e) {
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
function Io(e) {
  var t;
  for (const n of e) {
    const a = (t = n.name) == null ? void 0 : t.trim();
    Number.isSafeInteger(n.id) && a && ac(ic({ ...n, name: a }));
  }
}
function Zd(e) {
  const t = zn.get(e);
  if (t) return t;
  const n = new AbortController(), a = {
    controller: n,
    waiters: 0,
    promise: pe(`/api/tags/${e}`, {
      signal: n.signal
    }).then(
      (o) => {
        var d, g;
        const i = ((d = o == null ? void 0 : o.name) == null ? void 0 : d.trim()) || null;
        if (zn.get(e) === a && zn.delete(e), !i) return null;
        const s = ic({ ...o, id: e, name: i }), c = (g = ci.get(e)) == null ? void 0 : g.tag, u = (c == null ? void 0 : c.tagGroupId) === s.tagGroupId, p = {
          ...s,
          tagGroupSortOrder: s.tagGroupSortOrder ?? (u ? c == null ? void 0 : c.tagGroupSortOrder : void 0),
          hasImage: s.hasImage ?? (c == null ? void 0 : c.hasImage),
          imagePath: s.imagePath ?? (c == null ? void 0 : c.imagePath)
        };
        return ac(p), rc(p);
      },
      () => (zn.get(e) === a && zn.delete(e), null)
    )
  };
  return zn.set(e, a), a;
}
function Gi() {
  return new DOMException("The tag request was aborted.", "AbortError");
}
function co(e) {
  const t = {};
  for (const n of e) {
    const a = oc(n);
    a !== void 0 && (t[n] = a);
  }
  return t;
}
function eu(e, t) {
  if (t != null && t.aborted) return Promise.reject(Gi());
  const n = {}, a = [];
  for (const o of new Set(e)) {
    const i = oc(o);
    if (i !== void 0) n[o] = i;
    else {
      const s = Zd(o);
      s.waiters += 1, a.push({ id: o, entry: s });
    }
  }
  return a.length ? new Promise((o, i) => {
    let s = !1;
    const c = () => {
      for (const { id: p, entry: d } of a)
        d.waiters -= 1, d.waiters === 0 && zn.get(p) === d && (zn.delete(p), d.controller.abort());
    }, u = () => {
      s || (s = !0, c(), i(Gi()));
    };
    t == null || t.addEventListener("abort", u, { once: !0 }), Promise.all(
      a.map(
        ({ id: p, entry: d }) => d.promise.then((g) => [p, g])
      )
    ).then((p) => {
      if (!s) {
        s = !0, t == null || t.removeEventListener("abort", u), c();
        for (const [d, g] of p) n[d] = g;
        o(n);
      }
    });
  }) : Promise.resolve(n);
}
function sc(e) {
  const t = {};
  for (const [n, a] of Object.entries(e)) t[Number(n)] = (a == null ? void 0 : a.name) ?? null;
  return t;
}
function ma(e) {
  const t = [...new Set(e)].sort((o, i) => o - i).join(","), [n, a] = A(() => ({
    key: t,
    tags: co(lo(t))
  }));
  return H(() => {
    const o = lo(t), i = co(o);
    if (a({ key: t, tags: i }), o.every((c) => c in i)) return;
    const s = new AbortController();
    return eu(o, s.signal).then(
      (c) => a({ key: t, tags: c }),
      () => {
      }
    ), () => s.abort();
  }, [t]), n.key === t ? n.tags : co(lo(t));
}
function Ur(e) {
  const t = ma(e);
  return ge(() => sc(t), [t]);
}
function lo(e) {
  return e ? e.split(",").map(Number) : [];
}
const tu = "(max-width: 760px)";
function cc(e) {
  const [t] = A(
    () => typeof window.matchMedia == "function" ? window.matchMedia(e) : null
  ), n = kn(
    (a) => (t == null || t.addEventListener("change", a), () => t == null ? void 0 : t.removeEventListener("change", a)),
    [t]
  );
  return _o(n, () => (t == null ? void 0 : t.matches) ?? !1, () => !1);
}
function ga() {
  return cc(tu);
}
function nu(e, t, n = !1) {
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
function qr(e, t, n = [], a) {
  if ("effect" in e) {
    const s = e.effect;
    if (s.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (s.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const c = n.find((u) => u.id === s.tagGroupId);
    return [
      {
        text: c ? `Assign ${c.name}` : "Unavailable tag group",
        tone: "neutral"
      }
    ];
  }
  if (!e.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const o = Xn(e), i = (s) => o.has(s) || [...o].some((c) => {
    var u;
    return (u = a == null ? void 0 : a.get(s)) == null ? void 0 : u.includes(c);
  });
  return e.steps.flatMap(
    (s) => s.tagIds.map(
      (c) => nu(
        s.mode,
        t[c] === void 0 ? "…" : t[c] ?? "Unavailable tag",
        s.mode === "REMOVE_TREE" && i(c)
      )
    )
  );
}
function Ha(e) {
  return e.flatMap(
    (t) => "steps" in t ? t.steps.flatMap((n) => n.tagIds) : []
  );
}
function li({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  canStay: o = !0,
  tapStays: i = !1,
  onApply: s,
  onClose: c
}) {
  const u = ga(), [p, d] = A(""), [g, m] = A(0), b = $(null), y = $(null), q = $(null), v = $(null), w = $(null), T = $(/* @__PURE__ */ new Set()), F = at(), U = Ur(ge(() => Ha(e), [e])), G = jr(e), _ = ge(() => {
    const D = p.trim().toLocaleLowerCase(), K = (S) => S ? Wn.indexOf(S) : Wn.length;
    return e.map((S, I) => ({ action: S, index: I, key: G.keys[I] })).sort((S, I) => K(S.key) - K(I.key)).filter((S) => !D || S.action.label.toLocaleLowerCase().includes(D));
  }, [e, G, p]), ee = _.length ? Math.min(g, _.length - 1) : -1, ne = (D) => `${F}-option-${D}`;
  kt(() => {
    var D, K, S;
    return v.current = document.activeElement, w.current = ((K = (D = q.current) == null ? void 0 : D.parentElement) == null ? void 0 : K.closest('[role="dialog"]')) ?? null, (S = b.current) == null || S.focus({ preventScroll: !0 }), () => {
      var J;
      const I = v.current;
      I instanceof HTMLElement && I.isConnected && I.focus({ preventScroll: !0 }), document.activeElement !== I && ((J = w.current) != null && J.isConnected) && w.current.focus({ preventScroll: !0 });
    };
  }, []), H(() => {
    var D, K, S;
    ee < 0 || (S = (K = (D = y.current) == null ? void 0 : D.querySelector(`[id="${ne(_[ee].index)}"]`)) == null ? void 0 : K.scrollIntoView) == null || S.call(K, { block: "nearest" });
  }, [ee, _]);
  function se(D, K) {
    !D || a != null && a(D.action) || s(D.action, o && K);
  }
  function ae(D) {
    var S;
    D.stopPropagation();
    const K = D.code || D.key;
    if (D.repeat || T.current.add(K), !pn(D)) {
      if (D.repeat && !T.current.has(K)) {
        D.preventDefault();
        return;
      }
      if (D.key === "Escape")
        D.preventDefault(), D.repeat || c();
      else if (D.key === "Enter")
        D.preventDefault(), D.repeat || se(_[ee], D.shiftKey);
      else if (D.key === "ArrowDown" || D.key === "ArrowUp") {
        if (D.preventDefault(), !_.length) return;
        const I = D.key === "ArrowDown" ? 1 : -1;
        m((ee + I + _.length) % _.length);
      } else D.key === "Tab" && (D.preventDefault(), (S = b.current) == null || S.focus());
    }
  }
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r("div", { className: "dq-find-backdrop", "aria-hidden": "true", onMouseDown: c }),
    /* @__PURE__ */ l(
      "div",
      {
        ref: q,
        role: "dialog",
        "aria-label": "Find an action",
        className: `dq-find-action${u ? " dq-find-mobile" : ""}`,
        onKeyDown: ae,
        onMouseDown: (D) => {
          D.target !== b.current && D.preventDefault();
        },
        children: [
          /* @__PURE__ */ l("label", { className: "dq-find-search", children: [
            /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
            /* @__PURE__ */ r(
              "input",
              {
                ref: b,
                type: "text",
                role: "combobox",
                "aria-label": "Find an action",
                "aria-autocomplete": "list",
                "aria-expanded": "true",
                "aria-controls": `${F}-list`,
                "aria-activedescendant": ee >= 0 ? ne(_[ee].index) : void 0,
                autoComplete: "off",
                spellCheck: !1,
                value: p,
                onChange: (D) => {
                  d(D.target.value), m(0);
                }
              }
            ),
            !u && /* @__PURE__ */ r("kbd", { "aria-hidden": "true", children: "Esc" })
          ] }),
          _.length ? /* @__PURE__ */ r(
            "ul",
            {
              ref: y,
              id: `${F}-list`,
              role: "listbox",
              "aria-label": "Review actions",
              className: "dq-find-list",
              children: _.map((D, K) => /* @__PURE__ */ r("li", { role: "none", children: /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  role: "option",
                  id: ne(D.index),
                  tabIndex: -1,
                  "aria-selected": K === ee,
                  disabled: (a == null ? void 0 : a(D.action)) ?? !1,
                  onClick: (S) => se(D, S.shiftKey || i && Fs(D.action)),
                  children: [
                    u ? null : D.key ? /* @__PURE__ */ r("kbd", { children: D.key }) : /* @__PURE__ */ r("span", { className: "dq-find-no-key", "aria-hidden": "true", children: "·" }),
                    /* @__PURE__ */ r("span", { className: "dq-find-label", children: D.action.label }),
                    /* @__PURE__ */ r("span", { className: "dq-find-effect", children: qr(D.action, U, t, n).map(
                      (S, I) => /* @__PURE__ */ r("span", { "data-effect-tone": S.tone, children: S.text }, I)
                    ) })
                  ]
                }
              ) }, D.action.id))
            }
          ) : /* @__PURE__ */ l("p", { className: "dq-find-empty", role: "status", children: [
            "No action matches “",
            p.trim(),
            "”."
          ] }),
          !u && /* @__PURE__ */ l("p", { className: "dq-find-hints", "aria-hidden": "true", children: [
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies"
            ] }),
            o && /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "Shift" }),
              /* @__PURE__ */ r("kbd", { children: "Enter" }),
              " applies and stays"
            ] }),
            /* @__PURE__ */ l("span", { children: [
              /* @__PURE__ */ r("kbd", { children: "↑" }),
              /* @__PURE__ */ r("kbd", { children: "↓" }),
              " choose"
            ] })
          ] })
        ]
      }
    )
  ] });
}
function lc() {
  let e = null;
  const t = /* @__PURE__ */ new Set(), n = (a) => {
    a !== e && (e = a, t.forEach((o) => o()));
  };
  return {
    get: () => e,
    set: n,
    clear: (a) => {
      e === a && n(null);
    },
    subscribe: (a) => (t.add(a), () => t.delete(a))
  };
}
function di(e) {
  return _o(e.subscribe, e.get, e.get);
}
function dc(e, t) {
  const n = $(t);
  kt(() => {
    n.current !== t && (n.current = t, e.set(null));
  }, [e, t]);
}
function uc(e, t) {
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
const ru = [], Bi = ia.map((e, t) => ({
  indent: t,
  keys: e,
  fixed: t === 2 ? ["n", "m", ",", "."] : []
}));
function au(e, t) {
  return t === "video" && e === "m" ? "Mute" : "";
}
function dt({ binding: e, hidden: t }) {
  return /* @__PURE__ */ r(
    "kbd",
    {
      className: Array.from(e).length === 1 ? "dq-key dq-key-letter" : "dq-key",
      "aria-hidden": t || void 0,
      children: e
    }
  );
}
function $a(e) {
  return e.steps.some((t) => t.mode === "MARK_ABSENT");
}
function fc(e) {
  return ia.map((t) => t.flatMap((n) => e.actionOn.get(n) ?? [])).filter(
    (t) => t.length > 0
  );
}
function hc({
  groups: e,
  renderAction: t,
  find: n
}) {
  const a = e.length ? e : [[]];
  return /* @__PURE__ */ r(we, { children: a.map((o, i) => /* @__PURE__ */ l("div", { className: "dq-mobile-group", children: [
    o.map(t),
    i === a.length - 1 && n
  ] }, i)) });
}
function pc({
  extra: e,
  findKey: t,
  disabled: n,
  onFind: a
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-mobile-tile dq-mobile-find",
      "aria-label": e > 0 ? `Find, ${e} more` : "Find",
      "aria-keyshortcuts": t,
      disabled: n,
      onClick: a,
      children: [
        /* @__PURE__ */ l("span", { className: "dq-mobile-find-name", children: [
          /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
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
function ou({
  groups: e,
  statuses: t,
  actions: n,
  attentionOf: a
}) {
  return /* @__PURE__ */ r(
    "ul",
    {
      className: "dq-group-checklist",
      "aria-label": "Answer groups",
      title: "A plain action moves on once every group has an answer",
      children: (t ?? e).map((o) => {
        const i = t ? o.answers : null, s = i ? i.length ? "answered" : "open" : "unknown", c = i == null ? void 0 : i.map((d) => n[d].label).join(", "), u = a(o), p = s === "answered" ? `${o.name}: ${c}` : s === "open" ? `${o.name}: not answered yet` : o.name;
        return /* @__PURE__ */ l(
          "li",
          {
            className: "dq-group",
            "data-state": s,
            "data-attention": u ? !0 : void 0,
            title: u ? `${p}. Needs attention: ${u}` : p,
            children: [
              /* @__PURE__ */ r("span", { className: "dq-group-name", children: o.name }),
              u && /* @__PURE__ */ l("span", { className: "dq-group-flag", children: [
                /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                  ", needs attention: ",
                  u
                ] })
              ] }),
              s === "answered" && /* @__PURE__ */ l(we, { children: [
                /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", answered:" }),
                " ",
                /* @__PURE__ */ r("span", { className: "dq-group-answer", children: c })
              ] }),
              s === "open" && /* @__PURE__ */ l(we, { children: [
                /* @__PURE__ */ r("span", { className: "dq-group-ring", "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", not answered yet" })
              ] })
            ]
          },
          o.key
        );
      })
    }
  );
}
function iu({ checked: e, onChange: t }) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": e,
      className: "dq-stay-switch",
      onClick: () => t(!e),
      children: [
        /* @__PURE__ */ r("span", { className: "dq-stay-track", "aria-hidden": "true" }),
        "Stay on this item"
      ]
    }
  );
}
function su({
  actions: e,
  mediaKind: t,
  isDisabled: n,
  busy: a,
  tags: o,
  trees: i,
  preview: s,
  onApply: c,
  onFind: u,
  findDisabled: p,
  paused: d = !1,
  waitForGroups: g = !1,
  attention: m = ru,
  stayOnTap: b = !1,
  onStayOnTapChange: y
}) {
  const q = si(), v = jr(e), w = ga();
  dc(s, w);
  const T = at(), F = Ur(
    ge(() => e.flatMap((W) => W.steps.flatMap((E) => E.tagIds)), [e])
  ), U = Bi.filter((W) => W.keys.some((E) => v.actionOn.has(E))), G = U.includes(Bi[2]), _ = e.length - v.actionOn.size, ee = ge(
    () => g && !d ? wr(e) : [],
    [g, d, e]
  ), ne = ge(
    () => ee.length && o ? Eo(e, o) : null,
    [ee, e, o]
  ), se = new Map(
    Co(ne ?? []).flatMap(
      (W) => W.actions.filter((E) => Zs(e[E])).map((E) => [E, W.name])
    )
  ), ae = ge(
    () => e.map((W) => d ? [] : Vd(W, m, i)),
    [e, m, i, d]
  ), D = (W) => W.map(Jd).join("; "), K = ae.map(D), S = ee.length > 0 && /* @__PURE__ */ r(
    ou,
    {
      groups: ee,
      statuses: ne,
      actions: e,
      attentionOf: (W) => D([
        ...new Map(
          W.actions.flatMap((E) => ae[E]).map((E) => [E.key, E])
        ).values()
      ])
    }
  ), I = (W) => {
    const E = qr(e[W], F, [], i).map((ce) => ce.text).join(", "), B = se.get(W), re = K[W];
    return [
      E,
      B === void 0 ? "" : `${B}: not answered yet`,
      re ? `Needs attention: ${re}` : ""
    ].filter(Boolean).join(". ");
  }, J = (W) => K[W] ? (
    // The tile's description says it; the mark is for the eye, with the reasons on hover.
    /* @__PURE__ */ r(
      "span",
      {
        className: "dq-pad-flag",
        "aria-hidden": "true",
        title: `Needs attention: ${K[W]}`,
        children: /* @__PURE__ */ r(xn, {})
      }
    )
  ) : null, Q = (W) => ({
    onMouseEnter: () => s.set(W),
    onMouseLeave: () => s.clear(W),
    onFocus: () => s.set(W),
    onBlur: () => s.clear(W)
  }), Z = (W) => {
    const E = v.actionOn.get(W), B = E === void 0 ? void 0 : e[E];
    if (!B)
      return /* @__PURE__ */ r(
        "div",
        {
          className: "dq-pad-slot dq-pad-free",
          "aria-hidden": "true",
          title: "No action on this key: it does nothing here",
          children: /* @__PURE__ */ r(dt, { binding: W })
        },
        W
      );
    const re = n(B), ce = `${T}-effect-${W}`;
    return /* @__PURE__ */ l("div", { className: "dq-pad-slot", ...d ? {} : Q(B), children: [
      /* @__PURE__ */ r("span", { id: ce, className: "dq-sr-only", children: I(E) }),
      /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-pad-tile",
          title: B.label,
          "aria-keyshortcuts": W,
          "aria-describedby": ce,
          "data-group-open": se.has(E) || void 0,
          "data-attention": K[E] ? !0 : void 0,
          disabled: re,
          onClick: (P) => c(B, P.shiftKey),
          children: [
            /* @__PURE__ */ r(dt, { binding: W }),
            " ",
            /* @__PURE__ */ r("span", { className: "dq-pad-label", children: B.label }),
            $a(B) && " ",
            $a(B) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              "absent"
            ] }),
            J(E)
          ]
        }
      )
    ] }, W);
  }, oe = /* @__PURE__ */ l("p", { className: "dq-pad-paused-note", children: [
    /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
    "Actions are paused while you edit the review"
  ] });
  if (w) {
    const W = fc(v), E = (B) => {
      const re = e[B], ce = v.keys[B];
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-mobile-tile",
          title: re.label,
          "aria-keyshortcuts": ce,
          "aria-describedby": `${T}-effect-${ce}`,
          "data-group-open": se.has(B) || void 0,
          "data-attention": K[B] ? !0 : void 0,
          disabled: n(re),
          onClick: (P) => {
            s.clear(re), c(re, P.shiftKey || b && Fs(re));
          },
          ...d ? {} : uc(s, re),
          children: [
            /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: re.label }),
            $a(re) && " ",
            $a(re) && /* @__PURE__ */ l("span", { className: "dq-pad-marker", children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              "absent"
            ] }),
            J(B)
          ]
        },
        ce
      );
    };
    return /* @__PURE__ */ l(
      "section",
      {
        className: `dq-pad dq-pad-mobile${d ? " dq-pad-paused" : ""}`,
        "aria-label": d ? "Actions, paused while editing" : "Actions",
        "aria-busy": a || void 0,
        children: [
          /* @__PURE__ */ l("div", { className: "dq-pad-header", children: [
            d ? oe : /* @__PURE__ */ r(
              Vi,
              {
                actions: e,
                keyMap: v,
                names: F,
                tags: o,
                trees: i,
                preview: s,
                findKey: q.find,
                mobile: !0
              }
            ),
            y && /* @__PURE__ */ r(iu, { checked: b, onChange: y })
          ] }),
          S,
          /* @__PURE__ */ r("div", { className: "dq-mobile-actions", children: /* @__PURE__ */ r(
            hc,
            {
              groups: W,
              renderAction: E,
              find: /* @__PURE__ */ r(
                pc,
                {
                  extra: _,
                  findKey: q.find,
                  disabled: p,
                  onFind: u
                }
              )
            }
          ) }),
          /* @__PURE__ */ r("div", { hidden: !0, children: W.flat().map((B) => /* @__PURE__ */ r("span", { id: `${T}-effect-${v.keys[B]}`, children: I(B) }, B)) })
        ]
      }
    );
  }
  const V = /* @__PURE__ */ l("span", { className: "dq-pad-hint", children: [
    /* @__PURE__ */ r("kbd", { className: "dq-key", children: "Shift" }),
    /* @__PURE__ */ r("span", { children: "+ key or Shift-click applies and stays" })
  ] }), R = !G && /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-pad-find-button",
      "aria-label": _ ? `Find action, ${_} more` : "Find action",
      "aria-keyshortcuts": q.find,
      disabled: p,
      onClick: u,
      children: [
        /* @__PURE__ */ r(dt, { binding: q.find }),
        /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Find action" })
      ]
    }
  );
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-pad${d ? " dq-pad-paused" : ""}`,
      "aria-label": d ? "Actions, paused while editing" : "Actions",
      "aria-busy": a || void 0,
      children: [
        /* @__PURE__ */ l("div", { className: `dq-pad-header${S ? " dq-pad-header-groups" : ""}`, children: [
          d ? oe : /* @__PURE__ */ r(
            Vi,
            {
              actions: e,
              keyMap: v,
              names: F,
              tags: o,
              trees: i,
              preview: s,
              findKey: q.find
            }
          ),
          S ? (
            // The checklist, then the hint and Find action, on the header's second line, under the
            // effect line: the pad keeps its height as answers of any length come in.
            /* @__PURE__ */ l("div", { className: "dq-pad-header-end", children: [
              S,
              V,
              R
            ] })
          ) : /* @__PURE__ */ l(we, { children: [
            !d && V,
            R
          ] })
        ] }),
        U.map((W) => /* @__PURE__ */ l("div", { className: "dq-pad-row", "data-indent": W.indent, children: [
          W.keys.map(Z),
          W.fixed.map((E) => {
            const B = au(E, t);
            return /* @__PURE__ */ l(
              "div",
              {
                className: `dq-pad-slot dq-pad-free dq-pad-fixed${B ? " dq-pad-reserved" : ""}`,
                "aria-hidden": "true",
                children: [
                  /* @__PURE__ */ r(dt, { binding: E }),
                  B && /* @__PURE__ */ r("span", { className: "dq-pad-label", children: B })
                ]
              },
              E
            );
          }),
          W.fixed.length > 0 && /* @__PURE__ */ r("div", { className: "dq-pad-slot", children: /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              className: "dq-pad-tile dq-pad-find",
              "aria-label": _ ? `Find action, ${_} more` : "Find action",
              "aria-keyshortcuts": q.find,
              disabled: p,
              onClick: u,
              children: [
                /* @__PURE__ */ r(dt, { binding: q.find }),
                /* @__PURE__ */ l("span", { className: "dq-pad-label", children: [
                  /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
                  _ ? `${_} more` : "Find action"
                ] })
              ]
            }
          ) })
        ] }, W.indent))
      ]
    }
  );
}
function Vi({
  actions: e,
  keyMap: t,
  names: n,
  tags: a,
  trees: o,
  preview: i,
  findKey: s,
  mobile: c = !1
}) {
  const u = di(i), p = u ? e.indexOf(u) : -1;
  if (!u || p < 0) {
    const b = t.actionOn.size;
    return /* @__PURE__ */ l("p", { className: "dq-pad-effect dq-pad-summary", children: [
      e.length === 1 ? "1 action" : `${e.length} actions`,
      !c && b < e.length && /* @__PURE__ */ l(we, { children: [
        ` · ${b} on keys, ${e.length - b} more under `,
        /* @__PURE__ */ r(dt, { binding: s })
      ] })
    ] });
  }
  const d = t.keys[p], g = a && u.steps.length ? ri(u, a, o) : null, m = g && !g.unresolvedTrees.length && ![g.added, g.removed, g.markedAbsent, g.absenceCleared].some(
    (b) => b.length
  );
  return /* @__PURE__ */ l("p", { className: "dq-pad-effect", children: [
    d && !c && /* @__PURE__ */ r(dt, { binding: d }),
    /* @__PURE__ */ r("strong", { children: u.label }),
    qr(u, n, [], o).map((b, y) => /* @__PURE__ */ r("span", { "data-effect-tone": b.tone, children: b.text }, y)),
    m && /* @__PURE__ */ r("span", { className: "dq-pad-unchanged", children: "· already so here" })
  ] });
}
function mc({
  actions: e,
  tagGroups: t,
  trees: n,
  isDisabled: a,
  busy: o,
  onApply: i,
  onFind: s,
  summary: c,
  hints: u,
  keyHints: p,
  notices: d,
  status: g,
  className: m = "",
  paused: b = !1
}) {
  const y = si(), q = jr(e), v = ga(), w = at(), T = Ur(ge(() => Ha(e), [e])), [F] = A(() => lc());
  dc(F, v);
  const U = $(null), G = cu(U, e, !v), _ = fc(q);
  !_.length && e.length && _.push([]);
  const ee = _.flat(), ne = e.length - ee.length, se = (S) => qr(S, T, t, n).map((I) => I.text).join(", "), ae = (S) => ({
    onMouseEnter: () => F.set(S),
    onMouseLeave: () => F.clear(S),
    onFocus: () => F.set(S),
    onBlur: (I) => {
      I.currentTarget.contains(I.relatedTarget) || F.clear(S);
    }
  }), D = u ?? (v ? void 0 : p), K = (S) => {
    const I = e[S];
    return /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-mobile-tile",
        title: I.label,
        "aria-keyshortcuts": q.keys[S] || void 0,
        "aria-describedby": `${w}-effect-${S}`,
        disabled: b || a(I),
        onClick: () => {
          F.clear(I), i(I);
        },
        ...b ? {} : uc(F, I),
        children: /* @__PURE__ */ r("span", { className: "dq-mobile-label", children: I.label })
      },
      I.id
    );
  };
  return /* @__PURE__ */ l(
    "section",
    {
      ref: U,
      className: `dq-action-bar${v ? " dq-bar-mobile" : G ? " dq-bar-stacked" : ""}${o ? " dq-bar-busy" : ""}${b ? " dq-bar-paused" : ""}${m ? ` ${m}` : ""}`,
      "aria-label": "Actions",
      children: [
        /* @__PURE__ */ r("div", { className: "dq-bar-summary", children: c }),
        /* @__PURE__ */ r("span", { className: "dq-bar-divider", "aria-hidden": "true" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: `dq-bar-tiles${v ? " dq-mobile-actions" : ""}`,
            "aria-busy": o || void 0,
            children: [
              v && e.length > 0 && /* @__PURE__ */ r(
                hc,
                {
                  groups: _,
                  renderAction: K,
                  find: /* @__PURE__ */ r(
                    pc,
                    {
                      extra: ne,
                      findKey: y.find,
                      disabled: b,
                      onFind: s
                    }
                  )
                }
              ),
              !v && _.map((S, I) => /* @__PURE__ */ l("div", { className: "dq-bar-line", children: [
                S.map((J) => {
                  const Q = e[J], Z = q.keys[J];
                  return /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      className: "dq-bar-tile",
                      title: Q.label,
                      "aria-keyshortcuts": Z || void 0,
                      "aria-describedby": `${w}-effect-${J}`,
                      disabled: b || a(Q),
                      onClick: () => i(Q),
                      ...b ? {} : ae(Q),
                      children: [
                        Z && /* @__PURE__ */ r(dt, { binding: Z }),
                        " ",
                        /* @__PURE__ */ r("span", { className: "dq-bar-label", children: Q.label })
                      ]
                    },
                    Q.id
                  );
                }),
                I === _.length - 1 && /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-bar-tile dq-bar-find",
                    "aria-label": ne > 0 ? `Find action, ${ne} more` : "Find action",
                    "aria-keyshortcuts": y.find,
                    disabled: b,
                    onClick: s,
                    children: [
                      /* @__PURE__ */ r(dt, { binding: y.find, hidden: !0 }),
                      /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
                      /* @__PURE__ */ r("span", { className: "dq-bar-label", children: ne > 0 ? `${ne} more` : "Find action" })
                    ]
                  }
                )
              ] }, I)),
              !e.length && /* @__PURE__ */ r("p", { className: "dq-bar-empty", children: "This review has no actions." })
            ]
          }
        ),
        D && /* @__PURE__ */ r("p", { className: "dq-bar-hints", children: D }),
        b ? /* @__PURE__ */ l("p", { className: "dq-bar-effect dq-bar-paused-note", children: [
          /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
          "Actions are paused while you edit the review"
        ] }) : /* @__PURE__ */ r(
          lu,
          {
            actions: e,
            keyMap: q,
            preview: F,
            names: T,
            tagGroups: t,
            trees: n,
            showKey: !v
          }
        ),
        d && /* @__PURE__ */ r("div", { className: "dq-bar-notices", children: d }),
        /* @__PURE__ */ r("div", { hidden: !0, children: ee.map((S) => /* @__PURE__ */ r("span", { id: `${w}-effect-${S}`, children: se(e[S]) }, e[S].id)) }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: g })
      ]
    }
  );
}
function cu(e, t, n) {
  const [a, o] = A(!1);
  return kt(() => {
    var d;
    const i = e.current;
    if (!i || !n || typeof ResizeObserver > "u") return;
    const s = i.querySelector(".dq-bar-summary"), c = () => {
      const g = getComputedStyle(i), m = parseFloat(g.columnGap) || 0, b = i.clientWidth - (parseFloat(g.paddingLeft) || 0) - (parseFloat(g.paddingRight) || 0), y = [...i.querySelectorAll(".dq-bar-line")].map(
        (ee) => [...ee.children].map((ne) => ne.offsetWidth)
      ), q = i.querySelector(".dq-bar-line"), v = q && parseFloat(getComputedStyle(q).columnGap) || 0, w = i.querySelector(".dq-bar-hints"), T = ((s == null ? void 0 : s.offsetWidth) ?? 0) + (w ? w.offsetWidth + m : 0) + 1 + // the divider
      2 * m, F = (ee) => y.map((ne) => {
        let se = 1, ae = 0;
        for (const D of ne)
          ae > 0 && ae + v + D > ee ? (se += 1, ae = D) : ae += (ae > 0 ? v : 0) + D;
        return se;
      }), U = (ee) => Math.max(1, ee.reduce((ne, se) => ne + se, 0)), G = F(b), _ = U(F(b - T));
      o(
        1 + U(G) < _ || 1 + U(G) === _ && G.every((ee) => ee === 1)
      );
    }, u = new ResizeObserver(c);
    u.observe(i);
    for (const g of i.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      u.observe(g);
    c();
    let p = !0;
    return (d = document.fonts) == null || d.ready.then(() => {
      p && c();
    }), () => {
      p = !1, u.disconnect();
    };
  }, [e, t, n]), a;
}
function lu({
  actions: e,
  keyMap: t,
  preview: n,
  names: a,
  tagGroups: o,
  trees: i,
  showKey: s
}) {
  const c = di(n), u = c ? e.indexOf(c) : -1;
  if (!c || u < 0) return null;
  const p = t.keys[u];
  return /* @__PURE__ */ l("p", { className: "dq-bar-effect", "aria-hidden": "true", children: [
    p && s && /* @__PURE__ */ r(dt, { binding: p }),
    /* @__PURE__ */ r("strong", { children: c.label }),
    qr(c, a, o, i).map((d, g) => /* @__PURE__ */ r("span", { "data-effect-tone": d.tone, children: d.text }, g))
  ] });
}
const zi = 1e3;
async function du(e, t, n) {
  const a = await pe(
    `/api/tags/${t}`,
    { signal: n }
  ), o = /* @__PURE__ */ new Map();
  for (let u = 1; ; u++) {
    const p = await pe(
      "/api/tags/find",
      {
        method: "POST",
        signal: n,
        body: JSON.stringify(
          Ln({
            findFilter: {
              page: u,
              perPage: zi,
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
    for (const d of p.items) o.set(d.id, d);
    if (u * zi >= p.totalCount) break;
    if (!p.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const i = [...o.values()], s = Ke(e), c = $e(e) ? await fu(
    s,
    i.map((u) => u.id),
    n
  ) : i.map((u) => (s === "audio" ? u.audioCount : u.videoCount) ?? 0);
  return {
    parent: { id: t, name: a.name },
    children: i.map((u, p) => ({ id: u.id, name: u.name, uses: c[p] })).sort(
      (u, p) => p.uses - u.uses || u.name.localeCompare(p.name, void 0, {
        numeric: !0,
        sensitivity: "base"
      })
    )
  };
}
function uu(e) {
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
async function fu(e, t, n) {
  const a = new Array(t.length).fill(0), o = new AbortController(), i = () => o.abort(n == null ? void 0 : n.reason);
  n != null && n.aborted && i(), n == null || n.addEventListener("abort", i, { once: !0 });
  let s = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, t.length) }, async () => {
        try {
          for (; s < t.length && !o.signal.aborted; ) {
            const c = s++;
            a[c] = (await pe(
              `/api/${Zn(e)}/aggregate`,
              {
                method: "POST",
                signal: o.signal,
                body: uu(t[c])
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
  return o.signal.throwIfAborted(), a;
}
function hu(e) {
  const t = /* @__PURE__ */ new Set();
  return e.map((n) => ({
    ...n,
    children: n.children.filter((a) => t.has(a.id) ? !1 : (t.add(a.id), !0))
  }));
}
function pu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of n.children)
      t.set(a.id, [...t.get(a.id) ?? [], n.parent.id]);
  return t;
}
function mu(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    for (const a of Xn(n))
      t.set(a, [...t.get(a) ?? [], n]);
  return t;
}
function gu(e, t, n) {
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
function bu(e, t) {
  var a;
  const n = Nt(e);
  return ((a = wr(t).find((o) => o.key === n)) == null ? void 0 : a.name) ?? e.trim();
}
const yu = (e) => e instanceof Error ? e.message : "Request failed.";
function wu({
  id: e,
  review: t,
  disabled: n,
  onAdd: a,
  onCancel: o
}) {
  const [i, s] = A([]), [c, u] = A({}), [p, d] = A({}), [g, m] = A({}), b = $(/* @__PURE__ */ new Map());
  H(
    () => () => {
      for (const S of b.current.values()) S.abort();
    },
    []
  );
  const y = Cn(Ke(t)), q = $e(t), v = q ? "performer" : y.one;
  function w(S) {
    var J;
    (J = b.current.get(S)) == null || J.abort();
    const I = new AbortController();
    b.current.set(S, I), u((Q) => ({ ...Q, [S]: { status: "loading" } })), du(t, S, I.signal).then(
      (Q) => {
        I.signal.aborted || u((Z) => ({
          ...Z,
          [S]: { status: "ready", group: Q }
        }));
      },
      (Q) => {
        I.signal.aborted || u((Z) => ({
          ...Z,
          [S]: { status: "failed", message: yu(Q) }
        }));
      }
    );
  }
  function T(S) {
    var oe;
    const I = i.filter((V) => !S.includes(V));
    for (const V of I)
      (oe = b.current.get(V)) == null || oe.abort(), b.current.delete(V);
    const J = (V) => {
      const R = c[V];
      return (R == null ? void 0 : R.status) === "ready" ? R.group.children.map((W) => W.id) : [];
    }, Q = new Set(S.flatMap(J)), Z = I.flatMap(J).filter((V) => !Q.has(V));
    d(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([R]) => !Z.includes(Number(R)))
      )
    ), m(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([R]) => S.includes(Number(R)))
      )
    ), u(
      (V) => Object.fromEntries(
        Object.entries(V).filter(([R]) => S.includes(Number(R)))
      )
    ), s(S);
    for (const V of S) i.includes(V) || w(V);
  }
  const F = i.flatMap((S) => {
    const I = c[S];
    return (I == null ? void 0 : I.status) === "ready" ? [I.group] : [];
  }), U = F.length === i.length, G = i.some(
    (S) => {
      var I;
      return (((I = c[S]) == null ? void 0 : I.status) ?? "loading") === "loading";
    }
  ), _ = new Map(
    hu(F).map((S) => [S.parent.id, S])
  ), ee = pu(F), ne = new Map(F.map((S) => [S.parent.id, S.parent.name])), se = mu(t.actions), ae = (S) => p[S] ?? !se.has(S), D = U ? [..._.values()].flatMap((S) => {
    const I = bu(S.parent.name, t.actions);
    return S.children.filter((J) => ae(J.id)).map((J) => ({ child: J, answerGroup: I }));
  }) : [], K = (S, I) => d((J) => ({
    ...J,
    ...Object.fromEntries(S.children.map((Q) => [Q.id, I]))
  }));
  return /* @__PURE__ */ l("fieldset", { id: e, className: "dq-actions-from-tags", children: [
    /* @__PURE__ */ r("legend", { children: "Add actions from parent tags" }),
    /* @__PURE__ */ l("p", { className: "dq-drawer-note", children: [
      "Each ticked child tag becomes an action that adds it, most used",
      " ",
      q ? "on performers " : "",
      "first, in a group named after its parent. Tags an action already adds start unticked. The new actions go at the end, ready to reorder and edit."
    ] }),
    /* @__PURE__ */ r(
      Yn,
      {
        entityType: "tag",
        values: i,
        onChange: T,
        placeholder: "Search parent tags...",
        allowCreate: !1,
        disabled: n
      }
    ),
    i.map((S) => {
      const I = c[S];
      if (!I || I.status === "loading")
        return /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Loading child tags…" }, S);
      if (I.status === "failed")
        return /* @__PURE__ */ l("div", { role: "alert", className: "dq-row", children: [
          /* @__PURE__ */ l("span", { children: [
            "Child tags could not be loaded. ",
            I.message
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-button",
              disabled: n,
              onClick: () => w(S),
              children: "Retry"
            }
          )
        ] }, S);
      const J = _.get(S);
      if (!J) return null;
      const Q = J.parent.name;
      return /* @__PURE__ */ l("fieldset", { className: "dq-child-tag-group", children: [
        /* @__PURE__ */ r("legend", { children: Q }),
        I.group.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "This tag has no child tags." }) : /* @__PURE__ */ l(we, { children: [
          /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                type: "checkbox",
                checked: g[S] ?? !1,
                disabled: n,
                onChange: (Z) => m((oe) => ({
                  ...oe,
                  [S]: Z.target.checked
                }))
              }
            ),
            "Only one per ",
            v,
            ": each action removes every other tag in the ",
            Q,
            " tree"
          ] }),
          J.children.length === 0 ? /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Every child tag is already listed under an earlier parent." }) : /* @__PURE__ */ l(we, { children: [
            /* @__PURE__ */ l("div", { className: "dq-row", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select all child tags of ${Q}`,
                  onClick: () => K(J, !0),
                  children: "Select all"
                }
              ),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  disabled: n,
                  "aria-label": `Select none of the child tags of ${Q}`,
                  onClick: () => K(J, !1),
                  children: "Select none"
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "dq-child-tags", children: J.children.map((Z) => {
              const oe = se.get(Z.id) ?? [], V = (ee.get(Z.id) ?? []).filter((R) => R !== S).map((R) => `“${ne.get(R)}”`);
              return /* @__PURE__ */ l("label", { className: "dq-checkbox dq-child-tag", children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "checkbox",
                    checked: ae(Z.id),
                    disabled: n,
                    onChange: (R) => d((W) => ({
                      ...W,
                      [Z.id]: R.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ l("span", { children: [
                  Z.name,
                  " ",
                  /* @__PURE__ */ l("small", { children: [
                    Z.uses.toLocaleString(),
                    " ",
                    Z.uses === 1 ? y.one : y.many
                  ] }),
                  V.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " · Also under ",
                    V.join(", ")
                  ] }),
                  oe.length > 0 && /* @__PURE__ */ l("small", { children: [
                    " ",
                    "· Already in “",
                    oe[0].label || "New action",
                    "”",
                    oe.length > 1 ? ` and ${oe.length - 1} more` : ""
                  ] })
                ] })
              ] }, Z.id);
            }) })
          ] })
        ] })
      ] }, S);
    }),
    /* @__PURE__ */ l("div", { className: "dq-row", children: [
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-button primary",
          disabled: n || !D.length,
          onClick: () => a(
            D.map(
              ({ child: S, answerGroup: I }) => gu(
                S,
                (ee.get(S.id) ?? []).filter(
                  (J) => g[J]
                ),
                I
              )
            )
          ),
          children: D.length ? `Add ${D.length} action${D.length === 1 ? "" : "s"}` : "Add actions"
        }
      ),
      /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: o, children: "Cancel" }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-sr-only", children: G ? "Loading child tags…" : "" })
    ] })
  ] });
}
function vu(e, t, n, a) {
  const o = Nt(n), i = [{ kind: "none", name: "", selected: !o }];
  if (a === null) {
    for (const c of e)
      i.push({ kind: "group", name: c, selected: Nt(c) === o });
    return i;
  }
  const s = Nt(a);
  for (const c of t)
    Nt(c).includes(s) && i.push({ kind: "group", name: c, selected: Nt(c) === o });
  return s && !t.some((c) => Nt(c) === s) && i.push({ kind: "new", name: a.trim(), selected: s === o }), i;
}
function Nu(e) {
  return e.kind === "group" ? `group:${Nt(e.name)}` : e.kind;
}
function qu(e) {
  const { group: t, ...n } = e;
  return n;
}
const Su = /* @__PURE__ */ new Set([
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
]), ku = /* @__PURE__ */ new Set(["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"]), Oa = 4, Ji = 240;
function Eu(e) {
  const t = [];
  for (let n = e.parentElement; n && n !== document.body; n = n.parentElement) {
    const a = getComputedStyle(n);
    (a.overflowX !== "visible" || a.overflowY !== "visible") && t.push(n);
  }
  return t;
}
function Cu(e, t, n, a) {
  for (const i of a) {
    const s = i.getBoundingClientRect();
    if (n.bottom < s.top || n.top > s.bottom || n.right < s.left || n.left > s.right)
      return !1;
  }
  if (typeof document.elementFromPoint != "function") return !0;
  const o = document.elementFromPoint(n.left + n.width / 2, n.top + n.height / 2);
  return !o || e.contains(o) || t.contains(o);
}
function Au({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  onChange: o
}) {
  const i = at(), s = at(), c = at(), u = $(null), p = $(null), d = $(null), g = $(null), m = $(null), b = $([]), y = $(!1), q = $(!1), [v, w] = A(!1), [T, F] = A(null), [U, G] = A(null), [_, ee] = A(!1), ne = e.group ?? "", se = ge(
    () => vu(t, n, ne, T),
    [t, n, ne, T]
  ), ae = se.map(Nu), D = U === null ? -1 : ae.indexOf(U), K = (E) => `${s}-option-${E}`, S = (E) => o(E ? { ...e, group: E } : qu(e)), I = () => {
    var B;
    const E = ((B = d.current) == null ? void 0 : B.value) ?? ne;
    E.trim() !== E && S(E.trim());
  };
  function J(E) {
    F(null), G(E), w(!0);
  }
  const Q = (E) => {
    var B, re;
    return E instanceof Node && (((B = u.current) == null ? void 0 : B.contains(E)) || ((re = g.current) == null ? void 0 : re.contains(E))) === !0;
  };
  function Z() {
    var E, B;
    (E = g.current) != null && E.contains(document.activeElement) && ((B = m.current) == null || B.focus({ preventScroll: !0 })), w(!1), F(null), G(null), ee(!1);
  }
  function oe(E) {
    E.kind === "group" && E.selected && T === null || S(E.kind === "none" ? "" : E.name), Z();
  }
  function V() {
    const E = p.current, B = g.current;
    if (!E || !B) return;
    const re = E.getBoundingClientRect(), ce = window.visualViewport, P = (ce == null ? void 0 : ce.offsetTop) ?? 0, Te = (ce ? ce.offsetTop + ce.height : window.innerHeight) - re.bottom - Oa, fe = re.top - P - Oa, Oe = Math.min(B.scrollHeight, Ji), Ge = Te < Oe && fe > Te;
    B.style.left = `${re.left}px`, B.style.width = `${re.width}px`, B.style.top = `${Ge ? re.top - Oa : re.bottom + Oa}px`, B.style.transform = Ge ? "translateY(-100%)" : "", B.style.maxHeight = `${Math.max(0, Math.min(Ji, Ge ? fe : Te))}px`, Cu(E, B, re, b.current) || Z();
  }
  kt(() => {
    var E;
    v && (p.current && (b.current = Eu(p.current)), q.current && ((E = g.current) == null || E.focus({ preventScroll: !0 }), ee(!0)), q.current = !1);
  }, [v]), kt(() => {
    v && V();
  }), H(() => {
    if (!v) return;
    const E = () => V(), B = (P) => {
      Q(P.target) || Z();
    }, re = [...b.current, window], ce = window.visualViewport;
    for (const P of re) P.addEventListener("scroll", E);
    return window.addEventListener("resize", E), ce == null || ce.addEventListener("resize", E), ce == null || ce.addEventListener("scroll", E), document.addEventListener("pointerdown", B), () => {
      for (const P of re) P.removeEventListener("scroll", E);
      window.removeEventListener("resize", E), ce == null || ce.removeEventListener("resize", E), ce == null || ce.removeEventListener("scroll", E), document.removeEventListener("pointerdown", B);
    };
  }, [v]), H(() => {
    var E, B, re;
    D >= 0 && ((re = (B = (E = g.current) == null ? void 0 : E.children[D]) == null ? void 0 : B.scrollIntoView) == null || re.call(B, { block: "nearest" }));
  }, [D]);
  function R(E) {
    if (pn(E)) return;
    const B = E.key === "ArrowDown" || E.key === "ArrowUp";
    if (B && !v) {
      if (E.altKey && E.key === "ArrowUp") return;
      E.preventDefault(), J(E.altKey ? null : Nt(ne) ? `group:${Nt(ne)}` : "none");
      return;
    }
    if (v)
      if (B) {
        if (E.preventDefault(), E.altKey) {
          E.key === "ArrowUp" && Z();
          return;
        }
        const re = E.key === "ArrowDown" ? 1 : -1, ce = T !== null && Nt(T) && ae.length > 1 ? 1 : 0, P = D < 0 ? re > 0 ? ce : ae.length - 1 : (D + re + ae.length) % ae.length;
        G(ae[P]);
      } else E.key === "Enter" && (E.preventDefault(), D >= 0 ? oe(se[D]) : (I(), Z()));
  }
  function W(E) {
    var re;
    if (E.key === "Tab") {
      Z(), E.shiftKey && ((re = d.current) == null || re.focus());
      return;
    }
    if (E.key === "Dead" || E.key === "Process" || pn(E) && !ku.has(E.key) || E.key === "Backspace" || E.key === "Delete" || [...E.key].length === 1 && !E.metaKey && (!E.ctrlKey || E.altKey)) {
      const ce = d.current;
      ce && (ce.focus(), ce.setSelectionRange(ce.value.length, ce.value.length));
      return;
    }
    !Su.has(E.key) && !pn(E) && ee(!1), R(E);
  }
  return /* @__PURE__ */ l(
    "div",
    {
      onKeyDown: (E) => {
        !v || E.key !== "Escape" || pn(E) || (E.preventDefault(), E.stopPropagation(), Z());
      },
      children: [
        /* @__PURE__ */ l("div", { ref: u, className: "dq-action-field", children: [
          /* @__PURE__ */ r(
            "label",
            {
              className: "dq-action-field-name",
              htmlFor: i,
              onMouseDown: (E) => {
                v && E.preventDefault();
              },
              children: "Group"
            }
          ),
          /* @__PURE__ */ l("div", { ref: p, className: "dq-combobox", children: [
            /* @__PURE__ */ r(
              "input",
              {
                ref: d,
                id: i,
                className: "dq-input dq-action-group-input",
                role: "combobox",
                "aria-expanded": v,
                "aria-controls": v ? s : void 0,
                "aria-autocomplete": "list",
                "aria-activedescendant": v && D >= 0 ? K(D) : void 0,
                "aria-describedby": c,
                placeholder: "No group",
                autoComplete: "off",
                spellCheck: !1,
                value: ne,
                onChange: (E) => {
                  S(E.target.value), F(E.target.value), G(null), w(!0);
                },
                onClick: () => {
                  v || J(null);
                },
                onKeyDown: R,
                onBlur: () => {
                  Z(), I();
                }
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                ref: m,
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
                  var re;
                  const E = y.current;
                  y.current = !1;
                  const B = document.activeElement === d.current;
                  v ? Z() : (q.current = E && !B, J(null)), (!E || B) && ((re = d.current) == null || re.focus());
                },
                children: /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint dq-action-field-help", id: c, children: a ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed." : "A group is one question with one answer per item." }),
        v && Wl(
          /* @__PURE__ */ r(
            "ul",
            {
              ref: g,
              id: s,
              role: "listbox",
              "aria-label": "Groups",
              className: "dq-combobox-list",
              tabIndex: -1,
              "aria-activedescendant": D >= 0 ? K(D) : void 0,
              "data-tap-focus": _ || void 0,
              onMouseDown: (E) => E.preventDefault(),
              onKeyDown: W,
              onBlur: (E) => {
                Q(E.relatedTarget) || Z();
              },
              children: se.map((E, B) => /* @__PURE__ */ l(
                "li",
                {
                  id: K(B),
                  role: "option",
                  "aria-selected": E.selected,
                  className: "dq-combobox-option",
                  "data-kind": E.kind,
                  "data-active": B === D || void 0,
                  onMouseMove: () => {
                    B !== D && G(ae[B]);
                  },
                  onClick: () => oe(E),
                  children: [
                    E.kind === "new" && /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
                    /* @__PURE__ */ r("span", { className: "dq-combobox-option-name", children: E.kind === "none" ? "No group" : E.kind === "new" ? `New group “${E.name}”` : E.name }),
                    E.selected && /* @__PURE__ */ r(da, { className: "dq-combobox-check", "aria-hidden": "true" })
                  ]
                },
                ae[B]
              ))
            }
          ),
          document.body
        )
      ]
    }
  );
}
const Tu = ["n", "m"], Vn = [
  ...ia,
  ["auto", Hn]
];
function Ka(e) {
  return e.toLocaleUpperCase();
}
function gc(e, t, n) {
  return t.duplicatePins.has(n) ? "auto" : Qo(e[n]);
}
function Iu({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: o
}) {
  const [i, s] = A(!1), c = $(null), u = n.keys[t], p = gc(e, n, t), d = gr(p), g = n.duplicatePins.has(t) ? ` (${Ka(e[t].shortcut ?? "")} is pinned twice)` : "", m = u ? `${Ka(u)}, ${d ? "pinned" : "Auto"}${g}` : p === Hn ? "no key, Find action only" : `no key: Auto found no free key${g}`, b = () => {
    var y;
    s(!1), (y = c.current) == null || y.focus();
  };
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-key-button",
        "aria-label": `Key for ${a}: ${m}`,
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        title: "Choose the key",
        onClick: () => s(!i),
        children: [
          u ? /* @__PURE__ */ r(dt, { binding: u }) : /* @__PURE__ */ r("span", { className: "dq-key dq-key-none", children: "·" }),
          d && /* @__PURE__ */ r(qs, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ r(
      Ru,
      {
        actions: e,
        index: t,
        keyMap: n,
        name: a,
        onChoose: (y) => {
          o(y), b();
        },
        onClose: b
      }
    )
  ] });
}
function Ru({
  actions: e,
  index: t,
  keyMap: n,
  name: a,
  onChoose: o,
  onClose: i
}) {
  const s = $(null), c = n.keys[t], u = gc(e, n, t), [p, d] = A(c || "q"), g = (q) => {
    var v;
    return ((v = s.current) == null ? void 0 : v.querySelector(`[data-choice="${q}"]`)) ?? null;
  };
  kt(() => {
    var q, v, w;
    (q = g(c || u)) == null || q.focus(), (w = (v = s.current) == null ? void 0 : v.scrollIntoView) == null || w.call(v, { block: "nearest" });
  }, []);
  function m(q) {
    var v;
    gr(q) && d(q), (v = g(q)) == null || v.focus();
  }
  function b(q) {
    var _, ee, ne;
    if (q.key === "Escape") {
      q.preventDefault(), q.stopPropagation(), i();
      return;
    }
    if (q.key === "Tab") {
      const se = [...((_ = s.current) == null ? void 0 : _.querySelectorAll("button[tabindex='0']")) ?? []], ae = se.indexOf(document.activeElement);
      q.preventDefault(), (ee = se[(ae + (q.shiftKey ? -1 : 1) + se.length) % se.length]) == null || ee.focus();
      return;
    }
    const v = (ne = q.target.dataset) == null ? void 0 : ne.choice, w = v ? Vn.findIndex((se) => se.includes(v)) : -1;
    if (!v || w < 0) return;
    const T = Vn[w].indexOf(v), F = (se) => se == null ? void 0 : se[Math.min(T, se.length - 1)], U = {
      ArrowLeft: Vn[w][T - 1],
      ArrowRight: Vn[w][T + 1],
      ArrowUp: F(Vn[w - 1]),
      ArrowDown: F(Vn[w + 1]),
      Home: Vn[w][0],
      End: Vn[w].at(-1)
    };
    if (!Object.hasOwn(U, q.key)) return;
    q.preventDefault();
    const G = U[q.key];
    G && m(G);
  }
  const y = (q) => {
    const v = gr(q) ? n.actionOn.get(q) : void 0;
    return v === void 0 ? null : {
      own: v === t,
      label: e[v].label.trim() || "New action",
      pinned: Qo(e[v]) === q
    };
  };
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r(
      "div",
      {
        className: "dq-key-picker-backdrop",
        "aria-hidden": "true",
        onMouseDown: (q) => {
          q.preventDefault(), i();
        }
      }
    ),
    /* @__PURE__ */ l(
      "div",
      {
        ref: s,
        role: "dialog",
        "aria-label": `Key for ${a}`,
        className: "dq-key-picker",
        onKeyDown: b,
        onMouseDown: (q) => q.preventDefault(),
        children: [
          /* @__PURE__ */ l("p", { className: "dq-key-picker-title", children: [
            "Key for ",
            /* @__PURE__ */ r("strong", { children: a })
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-key-picker-keys", role: "group", "aria-label": "Keys", children: ia.map((q, v) => /* @__PURE__ */ l("div", { className: "dq-key-picker-row", "data-indent": v, children: [
            q.map((w) => {
              const T = y(w), F = T ? `${T.own ? "this action" : T.label}, ${T.pinned ? "pinned" : "Auto"}` : "free";
              return /* @__PURE__ */ l(
                "button",
                {
                  type: "button",
                  className: `dq-key-choice${T ? "" : " dq-key-choice-free"}${T != null && T.own ? " dq-key-choice-own" : ""}`,
                  "data-choice": w,
                  tabIndex: w === p ? 0 : -1,
                  "aria-label": `${Ka(w)}: ${F}`,
                  "aria-pressed": !!(T != null && T.own && T.pinned),
                  title: T ? `${T.label} (${T.pinned ? "pinned" : "Auto"})` : void 0,
                  onFocus: () => d(w),
                  onClick: () => o(w),
                  children: [
                    /* @__PURE__ */ l("span", { className: "dq-key-choice-head", children: [
                      /* @__PURE__ */ r(dt, { binding: w }),
                      (T == null ? void 0 : T.pinned) && /* @__PURE__ */ r(qs, { "aria-hidden": "true" })
                    ] }),
                    T && /* @__PURE__ */ r("span", { className: "dq-key-choice-label", children: T.label })
                  ]
                },
                w
              );
            }),
            v === ia.length - 1 && Tu.map((w) => (
              // Unavailable, yet not disabled: a browser gives a disabled button no press for
              // the panel to keep, and moves focus out of the picker. This one chooses nothing
              // and is never focused (the arrow keys and Tab pass it by).
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-key-choice dq-key-choice-free",
                  "aria-label": `${Ka(w)}: not available, it steps through the grid preview`,
                  title: "Steps through the grid preview",
                  "aria-disabled": "true",
                  tabIndex: -1,
                  children: /* @__PURE__ */ r("span", { className: "dq-key-choice-head", children: /* @__PURE__ */ r(dt, { binding: w }) })
                },
                w
              )
            ))
          ] }, v)) }),
          /* @__PURE__ */ l("div", { className: "dq-key-picker-choices", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": "auto",
                tabIndex: 0,
                "aria-pressed": u === "auto",
                onClick: () => o("auto"),
                children: [
                  /* @__PURE__ */ r("strong", { children: "Auto" }),
                  /* @__PURE__ */ r("span", { children: "the next free key" })
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-key-picker-choice",
                "data-choice": Hn,
                tabIndex: 0,
                "aria-pressed": u === Hn,
                onClick: () => o(Hn),
                children: [
                  /* @__PURE__ */ r("strong", { children: "No key" }),
                  /* @__PURE__ */ r("span", { children: "Find action only" })
                ]
              }
            ),
            /* @__PURE__ */ r("p", { className: "dq-key-picker-hint", children: "The action on the key you choose takes this one's pinned key, or Auto." })
          ] })
        ]
      }
    )
  ] });
}
const $u = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" }
];
function Ou(e) {
  return e === "ADD" || e === "MARK_PRESENT" ? "add" : e === "CLEAR_ABSENCE" ? "neutral" : "remove";
}
function Mu(e, t) {
  if (Pn(e, t)) return "";
  if (!e.label.trim()) return "Needs a label";
  if ("steps" in e) {
    if (e.steps.some((n) => !n.tagIds.length)) return "A step has no tags";
    if (Yo(e)) return "Contradictory assessments";
  }
  return "Incomplete";
}
function bc(e) {
  return { ...e, minWidth: void 0, minHeight: void 0 };
}
function Fu(e) {
  return e === "tag" ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } } : { id: crypto.randomUUID(), label: "", steps: [] };
}
function xu({
  review: e,
  onChange: t,
  tagGroups: n,
  trees: a,
  saving: o,
  expandedId: i,
  onExpand: s,
  reveal: c
}) {
  const u = Ue(e), p = u !== "tag", d = e.actions, g = jr(d), m = Ur(ge(() => Ha(d), [d])), b = ge(
    () => p ? wr(d).map((P) => P.name) : [],
    [p, d]
  ), y = d.findIndex((P) => P.id === i), q = ge(
    () => p && y >= 0 ? wr(
      d.filter((P, be) => be !== y)
    ).map((P) => P.name) : [],
    [p, d, y]
  ), v = p && e.stayUntilGroupsAnswered === !0, w = ge(
    () => new Set(
      v ? Dd(d).map((P) => P.key) : []
    ),
    [v, d]
  ), [T, F] = A(""), [U, G] = A(!1), [_, ee] = A(
    null
  ), ne = at(), se = `${ne}-from-tags`, ae = $(null), D = $(null), K = $(null), S = $(null), I = $(/* @__PURE__ */ new WeakMap()), J = (P) => {
    let be = I.current.get(P);
    return be || (be = crypto.randomUUID(), I.current.set(P, be)), be;
  }, Q = T.trim().toLocaleLowerCase(), Z = Q ? d.filter((P) => P.label.toLocaleLowerCase().includes(Q)) : d, oe = (P) => t({ ...e, actions: P }), V = (P, be) => oe(d.map((Te, fe) => fe === P ? be : Te));
  function R(P) {
    var be;
    return [...((be = K.current) == null ? void 0 : be.querySelectorAll("[data-action-id]")) ?? []].find(
      (Te) => Te.dataset.actionId === P
    );
  }
  function W(P, be) {
    const Te = R(P), fe = Te == null ? void 0 : Te.querySelector(
      be === "label" ? ".dq-action-label-input" : ".dq-action-toggle"
    );
    return fe == null || fe.focus(), !!fe;
  }
  kt(() => {
    var be;
    const P = S.current;
    P && (S.current = null, (P === "add" || !W(P.id, P.part)) && ((be = D.current) == null || be.focus()));
  }), H(() => {
    !c || !i || (Z.some((P) => P.id === i) ? W(i, "label") : (F(""), S.current = { id: i, part: "label" }));
  }, [c]);
  function E() {
    const P = Fu(u);
    F(""), oe([...d, P]), s(P.id), S.current = { id: P.id, part: "label" };
  }
  function B(P) {
    const be = d[P], { shortcut: Te, ...fe } = structuredClone(be), Oe = {
      ...fe,
      ...Te === Hn ? { shortcut: Te } : {},
      id: crypto.randomUUID(),
      label: `${be.label} copy`
    };
    oe([...d.slice(0, P + 1), Oe, ...d.slice(P + 1)]), s(Oe.id), S.current = { id: Oe.id, part: "label" };
  }
  function re(P) {
    const be = d[P], Te = Z.indexOf(be), fe = Z[Te + 1] ?? Z[Te - 1];
    oe(d.filter((Oe, Ge) => Ge !== P)), i === be.id && s(null), S.current = fe ? { id: fe.id, part: "toggle" } : "add";
  }
  function ce() {
    G(!1), requestAnimationFrame(() => {
      var P;
      return (P = ae.current) == null ? void 0 : P.focus();
    });
  }
  return /* @__PURE__ */ l("div", { className: "dq-actions-editor", children: [
    /* @__PURE__ */ l("div", { className: "dq-actions-head", children: [
      /* @__PURE__ */ l("div", { className: "dq-actions-toolbar", children: [
        /* @__PURE__ */ l(
          "button",
          {
            ref: D,
            type: "button",
            className: "dq-header-button",
            onClick: E,
            children: [
              /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
              "Add action"
            ]
          }
        ),
        p && /* @__PURE__ */ r(
          "button",
          {
            ref: ae,
            type: "button",
            className: "dq-header-button",
            "aria-expanded": U,
            "aria-controls": U ? se : void 0,
            onClick: () => {
              ee(null), G(!U);
            },
            children: "Add from parent tags…"
          }
        ),
        /* @__PURE__ */ l("label", { className: "dq-actions-filter", children: [
          /* @__PURE__ */ r(la, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "search",
              "aria-label": "Find an action",
              placeholder: "Find an action…",
              autoComplete: "off",
              spellCheck: !1,
              value: T,
              onChange: (P) => F(P.target.value),
              onKeyDown: (P) => {
                P.key === "Escape" && T && !pn(P) && (P.preventDefault(), P.stopPropagation(), F(""));
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-actions-hint", children: "Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle, or press Alt + ↑ / ↓, to reorder." }),
      p && /* @__PURE__ */ l("div", { className: "dq-actions-groups", children: [
        /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: v,
              "aria-describedby": `${ne}-groups-note`,
              onChange: (P) => t({
                ...e,
                stayUntilGroupsAnswered: P.target.checked ? !0 : void 0
              })
            }
          ),
          "Stay until every group is answered"
        ] }),
        /* @__PURE__ */ r("p", { className: "dq-actions-hint", id: `${ne}-groups-note`, children: v && !b.length ? "No action has a group yet: give the actions of each question the same group." : "Single-item view: a plain action moves on once every group has an answer." })
      ] }),
      /* @__PURE__ */ r("span", { role: "status", className: "dq-actions-status", children: (_ == null ? void 0 : _.actions) === d ? `Added ${_.count} action${_.count === 1 ? "" : "s"} at the end.` : "" })
    ] }),
    p && U && // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
    // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
    /* @__PURE__ */ r(
      "div",
      {
        onKeyDown: (P) => {
          P.key !== "Escape" || P.defaultPrevented || pn(P) || (P.preventDefault(), P.stopPropagation(), ce());
        },
        children: /* @__PURE__ */ r(
          wu,
          {
            id: se,
            review: e,
            disabled: o,
            onAdd: (P) => {
              const be = [...d, ...P];
              oe(be), ee({ actions: be, count: P.length }), ce();
            },
            onCancel: ce
          }
        )
      }
    ),
    /* @__PURE__ */ r("div", { ref: K, children: Z.length > 0 && /* @__PURE__ */ r(
      bs,
      {
        items: Z,
        getKey: (P) => P.id,
        disabled: o || !!Q,
        className: "dq-action-list",
        onReorder: (P) => oe(P),
        renderItem: (P, { dragHandleProps: be, isOver: Te }) => {
          const fe = d.indexOf(P), Oe = i === P.id;
          return /* @__PURE__ */ r(
            Pu,
            {
              action: P,
              entityType: u,
              keyButton: /* @__PURE__ */ r(
                Iu,
                {
                  actions: d,
                  index: fe,
                  keyMap: g,
                  name: P.label.trim() || "New action",
                  onChoose: (Ge) => oe(Yl(d, fe, Ge))
                }
              ),
              takenPin: g.duplicatePins.has(fe) ? P.shortcut : void 0,
              groupUnanswerable: "steps" in P && w.has(Nt(P.group)),
              effect: qr(P, m, n, a),
              open: Oe,
              detailId: `${ne}-detail-${P.id}`,
              dragHandleProps: be,
              isOver: Te,
              reorderDisabled: o || !!Q,
              onToggle: () => s(Oe ? null : P.id),
              onDuplicate: () => B(fe),
              onDelete: () => re(fe),
              children: "steps" in P ? /* @__PURE__ */ r(
                Lu,
                {
                  action: P,
                  groupNames: b,
                  otherGroupNames: q,
                  occurrence: $e(e),
                  saving: o,
                  stepKey: J,
                  rememberStepKey: (Ge, Ce) => I.current.set(Ge, J(Ce)),
                  onChange: (Ge) => V(fe, Ge)
                }
              ) : /* @__PURE__ */ r(
                _u,
                {
                  action: P,
                  tagGroups: n,
                  onChange: (Ge) => V(fe, Ge)
                }
              )
            }
          );
        }
      }
    ) }),
    d.length ? !Z.length && /* @__PURE__ */ l("p", { className: "dq-actions-empty", role: "status", children: [
      "No action matches “",
      T.trim(),
      "”."
    ] }) : /* @__PURE__ */ r("p", { className: "dq-actions-empty", children: p ? "No actions yet. Add one, or add them from parent tags." : "No actions yet." })
  ] });
}
function Pu({
  action: e,
  entityType: t,
  keyButton: n,
  takenPin: a,
  groupUnanswerable: o = !1,
  effect: i,
  open: s,
  detailId: c,
  dragHandleProps: u,
  isOver: p,
  reorderDisabled: d,
  onToggle: g,
  onDuplicate: m,
  onDelete: b,
  children: y
}) {
  const q = e.label.trim() || "New action", v = Mu(e, t), w = "steps" in e && Nt(e.group) ? e.group.trim() : "";
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-action-row${s ? " dq-action-row-open" : ""}${p ? " dq-drag-over" : ""}`,
      "data-action-id": e.id,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-action-row-head", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              ...u,
              style: bc(u.style),
              className: "dq-drag-handle",
              "aria-label": `Reorder ${q}`,
              title: d ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder",
              disabled: d,
              children: /* @__PURE__ */ r(Ss, { "aria-hidden": "true" })
            }
          ),
          n,
          /* @__PURE__ */ l("div", { className: "dq-action-row-summary", onClick: g, children: [
            /* @__PURE__ */ r("span", { className: "dq-action-row-label", title: q, children: q }),
            w && /* @__PURE__ */ l("span", { className: "dq-action-row-group", title: `Group: ${w}`, children: [
              /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Group: " }),
              w
            ] }),
            !s && /* @__PURE__ */ r("span", { className: "dq-action-row-effect", children: i.map((T, F) => /* @__PURE__ */ r("span", { "data-effect-tone": T.tone, children: T.text }, F)) }),
            v && /* @__PURE__ */ l("span", { className: "dq-action-problem", children: [
              /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
              v
            ] }),
            a && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: `An earlier action is pinned to ${a.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`,
                children: [
                  /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                  `${a.toLocaleUpperCase()} is pinned twice`
                ]
              }
            ),
            o && /* @__PURE__ */ l(
              "span",
              {
                className: "dq-action-problem",
                title: "No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped.",
                children: [
                  /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                  `${w} can't be answered`
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Duplicate ${q}`,
              title: "Duplicate",
              onClick: m,
              children: /* @__PURE__ */ r(ks, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small",
              "aria-label": `Delete ${q}`,
              title: "Delete",
              onClick: b,
              children: /* @__PURE__ */ r(Bo, { "aria-hidden": "true" })
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-icon-button-small dq-action-toggle",
              "aria-label": `${s ? "Collapse" : "Expand"} ${q}`,
              "aria-expanded": s,
              "aria-controls": s ? c : void 0,
              onClick: g,
              children: /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
            }
          )
        ] }),
        s && /* @__PURE__ */ r("div", { id: c, className: "dq-action-detail", children: y })
      ]
    }
  );
}
function yc({
  action: e,
  onChange: t
}) {
  return /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
    /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Button label" }),
    /* @__PURE__ */ r(
      "input",
      {
        className: "dq-input dq-action-label-input",
        value: e.label,
        onChange: (n) => t(n.target.value)
      }
    )
  ] });
}
function Lu({
  action: e,
  groupNames: t,
  otherGroupNames: n,
  occurrence: a,
  saving: o,
  stepKey: i,
  rememberStepKey: s,
  onChange: c
}) {
  const u = at(), p = $(null), d = $(null);
  kt(() => {
    var b, y;
    const m = d.current;
    m != null && (d.current = null, (y = (b = p.current) == null ? void 0 : b.querySelector(`[data-step-index="${m}"] input`)) == null || y.focus());
  });
  const g = (m) => c({ ...e, steps: m });
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r(yc, { action: e, onChange: (m) => c({ ...e, label: m }) }),
    /* @__PURE__ */ r(
      Au,
      {
        action: e,
        groupNames: t,
        otherGroupNames: n,
        occurrence: a,
        onChange: c
      }
    ),
    /* @__PURE__ */ l("div", { className: "dq-action-field dq-action-field-top", role: "group", "aria-labelledby": u, children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", id: u, children: "Steps" }),
      /* @__PURE__ */ l("div", { className: "dq-steps", ref: p, children: [
        e.steps.length > 0 ? /* @__PURE__ */ r(
          bs,
          {
            items: e.steps,
            getKey: i,
            disabled: o,
            className: "dq-step-list",
            onReorder: g,
            renderItem: (m, { index: b, dragHandleProps: y, isOver: q }) => /* @__PURE__ */ r(
              Du,
              {
                step: m,
                index: b,
                dragHandleProps: y,
                isOver: q,
                saving: o,
                onChange: (v) => {
                  s(v, m), g(e.steps.map((w, T) => T === b ? v : w));
                },
                onRemove: () => g(e.steps.filter((v, w) => w !== b))
              }
            )
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "No steps: the action skips the item." }),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-add-step",
            onClick: () => {
              d.current = e.steps.length, g([...e.steps, { mode: "ADD", tagIds: [] }]);
            },
            children: [
              /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
              "Add step"
            ]
          }
        ),
        /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Steps run in order; if one fails, earlier ones stay applied. Removing tags and descendants never removes a tag the same action adds." })
      ] })
    ] })
  ] });
}
function Du({
  step: e,
  index: t,
  dragHandleProps: n,
  isOver: a,
  saving: o,
  onChange: i,
  onRemove: s
}) {
  const c = t + 1;
  return /* @__PURE__ */ l(
    "div",
    {
      className: `dq-step${a ? " dq-drag-over" : ""}`,
      "data-step-tone": Ou(e.mode),
      "data-step-index": t,
      children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            ...n,
            style: bc(n.style),
            className: "dq-step-handle",
            "aria-label": `Reorder step ${c}`,
            title: "Drag, or Alt + ↑ / ↓, to reorder",
            disabled: o,
            children: [
              /* @__PURE__ */ r(Ss, { "aria-hidden": "true" }),
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: c })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "select",
          {
            className: "dq-select dq-step-mode",
            "aria-label": `Step ${c} operation`,
            value: e.mode,
            onChange: (u) => i({ ...e, mode: u.target.value }),
            children: $u.map(({ mode: u, label: p }) => /* @__PURE__ */ r("option", { value: u, children: p }, u))
          }
        ),
        /* @__PURE__ */ r(
          Yn,
          {
            entityType: "tag",
            values: e.tagIds,
            onChange: (u) => i({ ...e, tagIds: u }),
            placeholder: "Add tag…",
            inputAriaLabel: `Add a tag to step ${c}`,
            containerClassName: "dq-chip-input dq-step-tags",
            inputClassName: "dq-chip-input-field",
            allowCreate: !1,
            disabled: o
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button dq-icon-button-small",
            "aria-label": `Remove step ${c}`,
            title: "Remove step",
            onClick: s,
            children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
          }
        )
      ]
    }
  );
}
function _u({
  action: e,
  tagGroups: t,
  onChange: n
}) {
  const a = e.effect, o = a.mode === "SET_TAG_GROUP" ? `group:${a.tagGroupId}` : a.mode, i = a.mode === "SET_TAG_GROUP" && !t.some((s) => s.id === a.tagGroupId);
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r(yc, { action: e, onChange: (s) => n({ ...e, label: s }) }),
    /* @__PURE__ */ l("label", { className: "dq-action-field", children: [
      /* @__PURE__ */ r("span", { className: "dq-action-field-name", children: "Effect" }),
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
            /* @__PURE__ */ r("option", { value: "SKIP", children: "Skip" }),
            /* @__PURE__ */ r("option", { value: "CLEAR_TAG_GROUP", children: "Ungrouped" }),
            i && /* @__PURE__ */ r("option", { value: o, disabled: !0, children: "Unavailable tag group" }),
            t.map((s) => /* @__PURE__ */ r("option", { value: `group:${s.id}`, children: s.name }, s.id))
          ]
        }
      )
    ] })
  ] });
}
const wc = yl(!1);
function ju({ children: e }) {
  return /* @__PURE__ */ r(wc.Provider, { value: !0, children: e });
}
function Bt({ tag: e, name: t }) {
  const n = wl(wc), a = e && n ? { color: e.color, tagGroupColor: e.tagGroupColor } : e;
  return /* @__PURE__ */ r(Nl, { name: (e == null ? void 0 : e.name) ?? t ?? "", tag: a ?? void 0 });
}
function Uu({
  review: e,
  onChange: t
}) {
  const n = e.occurrence, a = Cn(Ke(e)).queue, o = (i) => t({ ...e, occurrence: { ...n, ...i } });
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group", children: [
    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
    /* @__PURE__ */ l("p", { children: [
      "Choose the tags this review can change on the active performer’s appearance in one ",
      a,
      ". Other tags are preserved."
    ] }),
    /* @__PURE__ */ r(
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
      /* @__PURE__ */ r(
        "input",
        {
          type: "checkbox",
          checked: n.multiple,
          onChange: (i) => o({ multiple: i.target.checked })
        }
      ),
      "Allow multiple tags, for example when something changes part-way through the ",
      a
    ] }),
    /* @__PURE__ */ r("p", { children: "Save & next performer applies the selected tags and advances. Save choices stays on the performer. Skip only moves the cursor; eligibility comes from the filters." })
  ] });
}
function Ku({
  review: e,
  onChange: t
}) {
  const n = Cn(Ke(e)).many, a = e.occurrence, o = $s(a), i = ["any", "isNull"].includes(a.condition) ? [] : a.conditionTagIds, s = ma([
    ...o.flatMap((d) => [d.tagId, ...d.categoryTagId ? [d.categoryTagId] : []]),
    ...i
  ]), c = (d) => {
    var g;
    return ((g = s[d]) == null ? void 0 : g.name) ?? (s[d] === null ? `Unavailable tag ${d}` : `Tag ${d}`);
  }, u = (d) => t({ ...e, occurrence: Hl(a, d) }), p = (d, g) => u(
    o.map(
      (m, b) => b !== d ? m : g === void 0 ? { tagId: m.tagId } : { tagId: m.tagId, categoryTagId: g }
    )
  );
  return /* @__PURE__ */ l("fieldset", { className: "dq-settings-group dq-flag-settings", children: [
    /* @__PURE__ */ r("legend", { children: "Performer flags" }),
    /* @__PURE__ */ l("p", { children: [
      "Flag performers whose profile has one of these tags, for example a tag noting that something changed during their career. ",
      /* @__PURE__ */ r("strong", { children: "Affects" }),
      " names the category the flag is about, that tag and everything under it: the flag then asks for attention only where an answer changes that category. Leave it empty for the whole review. Check a flagged performer’s earliest and latest ",
      n,
      " before applying one batch to all of them."
    ] }),
    o.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-flag-pairs", "aria-label": "Performer flags", children: o.map((d, g) => {
      const m = c(d.tagId), b = o.filter(
        (v, w) => w !== g && v.tagId === d.tagId
      ), y = (v) => b.some((w) => w.categoryTagId === v), q = `${d.tagId}#${o.slice(0, g).filter((v) => v.tagId === d.tagId).length}`;
      return /* @__PURE__ */ l("li", { className: "dq-flag-pair", children: [
        /* @__PURE__ */ l("span", { className: "dq-flag-pair-tag", children: [
          /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
          /* @__PURE__ */ r(Bt, { tag: s[d.tagId], name: m })
        ] }),
        /* @__PURE__ */ l("div", { className: "dq-flag-pair-affects", children: [
          /* @__PURE__ */ r("span", { className: "dq-flag-pair-label", "aria-hidden": "true", children: "Affects" }),
          /* @__PURE__ */ r(
            Ri,
            {
              entityType: "tag",
              value: d.categoryTagId,
              onChange: (v) => p(g, v),
              placeholder: "Whole review",
              allowCreate: !1,
              selectedDisplay: "input",
              inputClassName: "dq-input",
              inputAriaLabel: `Affects, ${m}`,
              excludeIds: b.flatMap(
                (v) => v.categoryTagId === void 0 ? [] : [v.categoryTagId]
              )
            }
          )
        ] }),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            className: "dq-icon-button",
            "aria-label": `Remove flag ${m}`,
            title: "Remove flag",
            onClick: () => u(o.filter((v, w) => w !== g)),
            children: /* @__PURE__ */ r(Bo, { "aria-hidden": "true" })
          }
        ),
        i.length > 0 && /* @__PURE__ */ l(
          "div",
          {
            className: "dq-flag-suggestions",
            role: "group",
            "aria-label": `Suggested categories for ${m}`,
            children: [
              /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "Condition categories" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === void 0,
                  disabled: y(void 0),
                  onClick: () => p(g, void 0),
                  children: "Whole review"
                }
              ),
              i.map((v) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-flag-suggestion",
                  "aria-pressed": d.categoryTagId === v,
                  disabled: y(v),
                  onClick: () => p(g, v),
                  children: c(v)
                },
                v
              ))
            ]
          }
        )
      ] }, q);
    }) }),
    /* @__PURE__ */ r(
      Ri,
      {
        entityType: "tag",
        value: void 0,
        onChange: (d) => {
          d !== void 0 && u([...o, { tagId: d }]);
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
const vc = {
  video: "Video review",
  audio: "Audio review",
  tag: "Tag review",
  performerOccurrence: "Performer occurrence review",
  audioPerformerOccurrence: "Audio performer occurrence review"
}, Nc = {
  video: "Videos",
  audio: "Audios",
  tag: "Tags",
  performerOccurrence: "Performer occurrence tags",
  audioPerformerOccurrence: "Audio performer occurrence tags"
}, Gu = {
  video: za,
  audio: As,
  tag: Cs,
  performerOccurrence: Es,
  audioPerformerOccurrence: Ml
};
function qc({ entityType: e }) {
  const t = Gu[e];
  return /* @__PURE__ */ r(t, { role: "img", "aria-label": vc[e] });
}
const Bu = 2e6;
function Sc(e, t) {
  const n = URL.createObjectURL(
    new Blob([JSON.stringify(e, null, 2)], { type: "application/json" })
  ), a = document.createElement("a");
  a.href = n, a.download = t, a.click(), URL.revokeObjectURL(n);
}
function Vu(e) {
  const t = e.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60).replace(/^-+|-+$/g, "");
  return t ? `data-quality-review-${t}.json` : "data-quality-review.json";
}
function ui(e) {
  Sc([e], Vu(e));
}
async function zu(e) {
  if (e.size > Bu) throw new Error("Review files must be smaller than 2 MB.");
  const t = await e.text();
  try {
    return ha(t);
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
    (a, o) => o && typeof o == "object" && !Array.isArray(o) ? Object.fromEntries(
      Object.keys(o).sort().map((i) => [i, o[i]])
    ) : o
  );
}
function kc({
  review: e,
  onChange: t,
  entityTypeLocked: n,
  onEntityTypeChange: a,
  nameRef: o,
  autoFocus: i = !1
}) {
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Entity type" }),
      /* @__PURE__ */ r(
        "select",
        {
          className: "dq-select",
          "aria-label": "Entity type",
          value: Ue(e),
          disabled: n,
          onChange: (s) => a == null ? void 0 : a(s.target.value),
          children: Os.map((s) => /* @__PURE__ */ r("option", { value: s, children: Nc[s] }, s))
        }
      )
    ] }),
    /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
      /* @__PURE__ */ r("span", { children: "Review name" }),
      /* @__PURE__ */ r(
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
      /* @__PURE__ */ r("span", { children: "Description" }),
      /* @__PURE__ */ r(
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
function Ju(e, t) {
  const n = Ue(e), a = ["Review"];
  return (n === "video" || n === "tag") && a.push("Appearance"), a.push("Actions"), t && a.push("Tag choices"), a;
}
function Wu({
  onKeepEditing: e,
  onDiscard: t
}) {
  const n = $(null), a = $(null), o = at(), i = at();
  return H(() => {
    var s;
    n.current && !n.current.open && n.current.showModal(), (s = a.current) == null || s.focus();
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
        /* @__PURE__ */ r("h2", { id: o, children: "Discard unsaved changes?" }),
        /* @__PURE__ */ r("p", { id: i, children: "Closing the editor leaves the review as it was last saved." }),
        /* @__PURE__ */ l("div", { className: "dq-confirm-dialog-actions", children: [
          /* @__PURE__ */ r("button", { ref: a, type: "button", className: "dq-button", onClick: e, children: "Keep editing" }),
          /* @__PURE__ */ r("button", { type: "button", className: "dq-button dq-button-danger", onClick: t, children: "Discard" })
        ] })
      ]
    }
  );
}
function Ec({
  draft: e,
  onChange: t,
  direction: n,
  onDirectionChange: a,
  tagGroups: o,
  trees: i,
  saving: s,
  saveDisabled: c = !1,
  error: u,
  dirty: p,
  criteriaChanged: d = !1,
  notices: g,
  onSave: m,
  onCancel: b,
  drawerRef: y
}) {
  const [q, v] = A("Review"), [w] = A(
    () => $e(e) && e.occurrence.tagIds.length > 0
  ), [T, F] = A(""), [U, G] = A(null), [_, ee] = A(0), [ne, se] = A(!1), ae = $(null), D = $(null), K = $(null), S = Ju(e, w), I = Ue(e), J = ge(() => Lr(e), [e]);
  H(() => F(""), [J]), H(() => {
    var W, E;
    if (ne) return;
    const V = ae.current;
    if (ae.current = null, !V) return;
    (E = V.isConnected && !!((W = K.current) != null && W.contains(V)) && !(V instanceof HTMLButtonElement && V.disabled) ? V : K.current) == null || E.focus({ preventScroll: !0 });
  }, [ne]);
  function Q() {
    if (!(s || ne)) {
      if (!p) {
        b();
        return;
      }
      ae.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, se(!0);
    }
  }
  function Z() {
    const V = { ...e, name: e.name.trim() }, R = sa(V);
    if (!R) {
      F(""), m();
      return;
    }
    if (F(R), !V.name) {
      v("Review"), requestAnimationFrame(() => {
        var E;
        return (E = D.current) == null ? void 0 : E.focus();
      });
      return;
    }
    const W = e.actions.find(
      (E) => !Pn(E, I)
    );
    W && (v("Actions"), G(W.id), ee((E) => E + 1));
  }
  const oe = T || u;
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ l(
      "aside",
      {
        ref: (V) => {
          K.current = V, y && (y.current = V);
        },
        className: "dq-drawer",
        role: "dialog",
        "aria-label": "Edit review",
        tabIndex: -1,
        onKeyDown: (V) => {
          V.key !== "Escape" || V.defaultPrevented || s || pn(V) || (V.preventDefault(), V.stopPropagation(), Q());
        },
        children: [
          /* @__PURE__ */ l("header", { className: "dq-drawer-header", children: [
            /* @__PURE__ */ l("div", { className: "dq-drawer-title", children: [
              /* @__PURE__ */ r("span", { className: "dq-eyebrow", children: "Edit review" }),
              /* @__PURE__ */ r("h2", { children: e.name.trim() || "Untitled review" })
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-icon-button",
                "aria-label": "Close editor",
                title: "Close without saving",
                disabled: s,
                onClick: Q,
                children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-tabs", children: /* @__PURE__ */ r(
            ql,
            {
              tabs: S.map((V) => ({
                key: V,
                label: V,
                count: V === "Actions" ? e.actions.length : void 0
              })),
              activeTab: q,
              onTabChange: (V) => v(V)
            }
          ) }),
          /* @__PURE__ */ r("div", { className: "dq-drawer-body", children: /* @__PURE__ */ l("fieldset", { className: "dq-drawer-fields", disabled: s, children: [
            /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review settings" }),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Review",
                "aria-label": "Review",
                children: [
                  /* @__PURE__ */ r(
                    kc,
                    {
                      review: e,
                      onChange: t,
                      entityTypeLocked: !0,
                      nameRef: D,
                      autoFocus: !0
                    }
                  ),
                  /* @__PURE__ */ l("label", { className: "dq-drawer-field", children: [
                    /* @__PURE__ */ r("span", { children: "Review direction" }),
                    /* @__PURE__ */ l(
                      "select",
                      {
                        className: "dq-select",
                        "aria-label": "Review direction",
                        value: n,
                        onChange: (V) => a(V.target.value),
                        children: [
                          /* @__PURE__ */ r("option", { value: "end", children: "Start from the end" }),
                          /* @__PURE__ */ r("option", { value: "beginning", children: "Start from the beginning" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("small", { className: "dq-drawer-note", children: "From the end, the queue opens on its last page and works towards the first." })
                  ] }),
                  $e(e) && /* @__PURE__ */ r(Ku, { review: e, onChange: t }),
                  /* @__PURE__ */ r("div", { children: /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      className: "dq-text-button",
                      onClick: () => ui(e),
                      children: "Export draft"
                    }
                  ) })
                ]
              }
            ),
            S.includes("Appearance") && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Appearance",
                "aria-label": "Appearance",
                children: /* @__PURE__ */ r(Hu, { review: e, onChange: t })
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel dq-actions-panel",
                role: "tabpanel",
                hidden: q !== "Actions",
                "aria-label": "Actions",
                children: /* @__PURE__ */ r(
                  xu,
                  {
                    review: e,
                    onChange: t,
                    tagGroups: o,
                    trees: i,
                    saving: s,
                    expandedId: U,
                    onExpand: G,
                    reveal: _
                  }
                )
              }
            ),
            w && $e(e) && /* @__PURE__ */ r(
              "div",
              {
                className: "dq-drawer-panel",
                role: "tabpanel",
                hidden: q !== "Tag choices",
                "aria-label": "Tag choices",
                children: /* @__PURE__ */ r(Uu, { review: e, onChange: t })
              }
            )
          ] }) }),
          (oe || g) && /* @__PURE__ */ l("div", { className: "dq-drawer-notices", children: [
            g,
            oe && /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
              /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
              oe
            ] })
          ] }),
          /* @__PURE__ */ l("footer", { className: "dq-drawer-footer", children: [
            /* @__PURE__ */ r("p", { className: "dq-drawer-dirty", children: p ? d ? "Unsaved changes, including the queue's criteria" : "Unsaved changes" : "" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: s, onClick: Q, children: "Cancel" }),
            /* @__PURE__ */ r(
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
    ne && /* @__PURE__ */ r(
      Wu,
      {
        onKeepEditing: () => se(!1),
        onDiscard: () => {
          ae.current = null, se(!1), b();
        }
      }
    )
  ] });
}
function Hu({
  review: e,
  onChange: t
}) {
  const n = at(), a = e.view, o = (d) => t({ ...e, view: { ...a, ...d } }), i = /* @__PURE__ */ l("label", { className: "dq-checkbox dq-setting-indent", children: [
    /* @__PURE__ */ r(
      "input",
      {
        type: "checkbox",
        checked: a.selectAllOnLoad ?? !1,
        onChange: (d) => o({ selectAllOnLoad: d.target.checked ? !0 : void 0 })
      }
    ),
    "Select every card when a page opens"
  ] });
  if (Ue(e) === "tag")
    return /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-cards`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-cards`, children: "Cards" }),
      /* @__PURE__ */ r(
        Wi,
        {
          label: "View",
          value: a.displayMode === "list" ? "list" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" }
          ],
          onChange: (d) => o({ displayMode: d })
        }
      ),
      i,
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review opens with these. The Cards / List switch in the header changes only the current visit." })
    ] });
  const s = e.presentation ?? {}, c = (d) => t({ ...e, presentation: { ...s, ...d } }), u = s.annotations ?? [], p = a.reviewMode ?? "single";
  return /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-layout`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-layout`, children: "Layout" }),
      /* @__PURE__ */ l("div", { className: "dq-layout-cards", role: "radiogroup", "aria-labelledby": `${n}-layout`, children: [
        /* @__PURE__ */ r(
          Hi,
          {
            name: `${n}-layout-choice`,
            checked: p === "single",
            title: "Single video",
            text: "One video at a time, with the player and the action keys under it.",
            picture: /* @__PURE__ */ r(Qu, {}),
            onChoose: () => o({ reviewMode: "single" })
          }
        ),
        /* @__PURE__ */ r(
          Hi,
          {
            name: `${n}-layout-choice`,
            checked: p === "multiple",
            title: "Grid",
            text: "Many videos at once. Select cards, then press an action key.",
            picture: /* @__PURE__ */ r(Yu, {}),
            onChoose: () => o({ reviewMode: "multiple" })
          }
        )
      ] }),
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "The review always opens in this layout. The Single / Grid switch in the header only changes the current visit." })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-grid`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-grid`, children: "Grid" }),
      /* @__PURE__ */ r(
        Wi,
        {
          label: "Cards",
          value: a.displayMode === "wall" ? "wall" : "grid",
          options: [
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" }
          ],
          onChange: (d) => o({ displayMode: d })
        }
      ),
      i,
      /* @__PURE__ */ l("div", { className: "dq-setting-row", role: "group", "aria-labelledby": `${n}-details`, children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", id: `${n}-details`, children: "Card details" }),
        /* @__PURE__ */ r("div", { className: "dq-setting-options", children: [
          ["date", "Date"],
          ["studio", "Studio"],
          ["performers", "Performers"],
          ["tags", "Tags"]
        ].map(([d, g]) => /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
          /* @__PURE__ */ r(
            "input",
            {
              type: "checkbox",
              checked: u.includes(d),
              onChange: (m) => c({
                annotations: m.target.checked ? [...u, d] : u.filter((b) => b !== d)
              })
            }
          ),
          g
        ] }, d)) })
      ] }),
      u.includes("tags") && /* @__PURE__ */ l("div", { className: "dq-setting-row dq-setting-row-top", children: [
        /* @__PURE__ */ r("span", { className: "dq-setting-name", children: "Tags on cards" }),
        /* @__PURE__ */ l("div", { className: "dq-setting-value", children: [
          /* @__PURE__ */ r(
            Yn,
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
          /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "Cards show only the tags under these parents, whatever the queue filters." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ l("div", { className: "dq-drawer-section", role: "group", "aria-labelledby": `${n}-bins`, children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", id: `${n}-bins`, children: "Queue tag bins" }),
      /* @__PURE__ */ r(
        Yn,
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
      /* @__PURE__ */ r("p", { className: "dq-drawer-note", children: "In the grid, tags under these parents become one-click filters in the filter row, counted on the loaded page." })
    ] })
  ] });
}
function Wi({
  label: e,
  value: t,
  options: n,
  onChange: a
}) {
  const o = at();
  return /* @__PURE__ */ l("div", { className: "dq-setting-row", children: [
    /* @__PURE__ */ r("span", { className: "dq-setting-name", id: o, children: e }),
    /* @__PURE__ */ r("div", { className: "dq-segmented", role: "group", "aria-labelledby": o, children: n.map((i) => /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        "aria-pressed": t === i.value,
        onClick: () => t !== i.value && a(i.value),
        children: i.label
      },
      i.value
    )) })
  ] });
}
function Hi({
  name: e,
  checked: t,
  title: n,
  text: a,
  picture: o,
  onChoose: i
}) {
  const s = at(), c = at();
  return /* @__PURE__ */ l("label", { className: "dq-layout-card", children: [
    o,
    /* @__PURE__ */ l("span", { className: "dq-layout-card-name", children: [
      /* @__PURE__ */ r(
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
      /* @__PURE__ */ r("span", { id: s, children: n })
    ] }),
    /* @__PURE__ */ r("span", { className: "dq-layout-card-text", id: c, children: a })
  ] });
}
function Qu() {
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 21, 34, 47, 60].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "8", y: e, width: "52", height: "9", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-strong", x: "68", y: "8", width: "164", height: "58", rx: "3" }),
    [68, 85, 102, 119, 136, 153, 170].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "72", width: "14", height: "8", rx: "2" }, e)),
    [72, 89, 106].map((e) => /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: e, y: "83", width: "14", height: "8", rx: "2" }, e)),
    /* @__PURE__ */ r("rect", { className: "dq-picture-part", x: "240", y: "8", width: "52", height: "83", rx: "3" })
  ] });
}
function Yu() {
  const e = /* @__PURE__ */ new Set(["80,8", "152,8", "8,44", "224,44"]);
  return /* @__PURE__ */ l("svg", { className: "dq-layout-picture", viewBox: "0 0 300 96", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("rect", { className: "dq-picture-ground", x: "0", y: "0", width: "300", height: "96", rx: "6" }),
    [8, 44].flatMap(
      (t) => [8, 80, 152, 224].map((n) => /* @__PURE__ */ r(
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
    /* @__PURE__ */ r("rect", { className: "dq-picture-key", x: "8", y: "80", width: "282", height: "10", rx: "3" })
  ] });
}
const Ro = "The queue differs from the saved review.";
function Cc({
  name: e,
  description: t,
  entityType: n,
  onBack: a,
  backDisabled: o,
  onEdit: i,
  editDisabled: s,
  editing: c = !1,
  toolbar: u,
  trailing: p,
  trailingEnd: d,
  queueChange: g,
  queueDiffers: m,
  chipsStart: b,
  chipsAfter: y,
  chipsEnd: q
}) {
  const v = $(null);
  nf(v);
  const w = rf(v), [T, F] = A({ differs: m, text: "" });
  return T.differs !== m && F({
    differs: m,
    text: m ? T.differs === !1 ? Ro : T.text : ""
  }), /* @__PURE__ */ l("header", { ref: v, className: "dq-review-header", children: [
    /* @__PURE__ */ l("div", { className: "dq-review-header-lead", children: [
      a && /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "All reviews",
          title: "All reviews",
          disabled: o,
          onClick: a,
          children: /* @__PURE__ */ r(fa, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-type", title: vc[n], children: /* @__PURE__ */ r(qc, { entityType: n }) }),
      /* @__PURE__ */ r("h1", { title: t || e, children: e }),
      t && /* @__PURE__ */ r("p", { className: "dq-sr-only", children: t }),
      i && /* @__PURE__ */ r(
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
          children: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" })
        }
      ),
      /* @__PURE__ */ r("span", { className: "dq-review-header-divider", "aria-hidden": "true" })
    ] }),
    u,
    /* @__PURE__ */ l("div", { className: "dq-review-header-trail", children: [
      p,
      g && /* @__PURE__ */ r(Xu, { change: g, onPress: w }),
      d
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-review-header-break", "aria-hidden": "true" }),
    b,
    y && /* @__PURE__ */ r("div", { className: "dq-review-chips-after", children: y }),
    q && /* @__PURE__ */ r("div", { className: "dq-review-chips-end", children: q }),
    /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: T.text })
  ] });
}
function Xu({
  change: e,
  onPress: t
}) {
  const n = at(), a = at(), o = `${Ro} Save these filters to the review.`, i = e.onSave ? `${Ro} Go back to the review's saved filters.` : "Only the queue's tag bins differ from the saved review, and no save keeps them. Go back to the review's saved filters.";
  return /* @__PURE__ */ l(we, { children: [
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
          /* @__PURE__ */ r(Pl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Save to review" }),
          /* @__PURE__ */ r("span", { id: n, hidden: !0, children: o })
        ]
      }
    ),
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button dq-queue-button",
        title: i,
        "aria-describedby": a,
        disabled: e.resetDisabled,
        onClick: () => {
          t(), e.onReset();
        },
        children: [
          /* @__PURE__ */ r(Ll, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-queue-label", children: "Reset" }),
          /* @__PURE__ */ r("span", { id: a, hidden: !0, children: i })
        ]
      }
    )
  ] });
}
const Zu = ["queue", "summary", "name", "layout", "range"], ef = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child"
}, tf = "(min-width: 1400px)";
function Pa(e) {
  const t = e.querySelector(".dq-review-header-lead"), n = e.querySelector(".dq-review-header-trail");
  if (!t || !n) return !0;
  const a = t.getBoundingClientRect();
  return !a.height || n.getBoundingClientRect().top < a.bottom;
}
function Qi(e, t) {
  const n = e.querySelector(".dq-review-header-lead h1"), a = () => {
    e.removeAttribute("data-compact"), n == null || n.style.removeProperty("max-width");
  };
  if (a(), !t) return !0;
  const o = Zu.filter(
    (i) => e.querySelector(ef[i])
  );
  for (let i = 1; i <= o.length && !Pa(e); i++) {
    if (e.dataset.compact = o.slice(0, i).join(" "), o[i - 1] !== "name" || !n) continue;
    const s = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let c = n.getBoundingClientRect().width;
    for (; !Pa(e) && c > 6 * s; )
      c = Math.max(6 * s, c - s), n.style.maxWidth = `${c}px`;
  }
  return Pa(e) ? !0 : (a(), !1);
}
function nf(e) {
  const t = cc(tf), [n, a] = A(0), o = $(!1);
  kt(() => {
    e.current && (o.current = !Qi(e.current, t));
  }, [e, t, n]), kt(() => {
    const i = e.current;
    i && t && !o.current && !Pa(i) && (o.current = !Qi(i, t));
  }), H(() => {
    const i = e.current;
    if (!i || !t || typeof ResizeObserver > "u") return;
    const s = new ResizeObserver(() => a((c) => c + 1));
    s.observe(i);
    for (const c of i.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      s.observe(c);
    return () => s.disconnect();
  }, [e, t]);
}
function rf(e) {
  const t = $(!1);
  return H(() => {
    const n = e.current;
    if (!t.current || !n) return;
    const a = document.activeElement, o = (a == null ? void 0 : a.closest(".dq-queue-button")) ?? null;
    if (a && a !== document.body && !o) {
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
function Ac({
  page: e,
  pages: t,
  onPage: n
}) {
  const [a, o] = A(!1), [i, s] = A(""), c = $(null), u = $(null);
  H(() => {
    var g;
    a && ((g = c.current) == null || g.select());
  }, [a]);
  const p = (g) => {
    o(!1), g && requestAnimationFrame(() => {
      var m;
      return (m = u.current) == null ? void 0 : m.focus();
    });
  }, d = () => {
    const g = Math.round(Number(i));
    p(!0), Number.isFinite(g) && g >= 1 && g !== e && n(Math.min(t, g));
  };
  return /* @__PURE__ */ l("span", { className: "dq-pager", children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Previous page",
        title: "Previous page",
        disabled: e <= 1,
        onClick: () => n(e - 1),
        children: /* @__PURE__ */ r(fa, { "aria-hidden": "true" })
      }
    ),
    a ? /* @__PURE__ */ r(
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
          pn(g) || (g.key === "Enter" ? (g.preventDefault(), d()) : g.key === "Escape" && (g.preventDefault(), g.stopPropagation(), p(!0)));
        },
        onBlur: () => p(!1)
      }
    ) : /* @__PURE__ */ l(
      "button",
      {
        ref: u,
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
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-icon-button",
        "aria-label": "Next page",
        title: "Next page",
        disabled: e >= t,
        onClick: () => n(e + 1),
        children: /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
      }
    )
  ] });
}
function Tc({
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
          /* @__PURE__ */ r(xl, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Single" })
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
          /* @__PURE__ */ r(Vo, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-layout-label", children: "Grid" })
        ]
      }
    )
  ] });
}
function af({
  options: e,
  value: t,
  disabled: n,
  onChange: a
}) {
  return /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-icons", role: "group", "aria-label": "Card view", children: e.map((o) => /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      "aria-label": o.label,
      title: o.label,
      "aria-pressed": t === o.value,
      disabled: n,
      onClick: () => t !== o.value && a(o.value),
      children: o.icon
    },
    o.value
  )) });
}
function fi({
  items: e,
  disabled: t,
  label: n = "More review options"
}) {
  const [a, o] = A(!1), [i, s] = A(!1), c = $(null), u = $(null), p = at();
  kt(() => {
    if (!a || !u.current || !c.current) return;
    const m = c.current.getBoundingClientRect(), b = u.current.offsetHeight + 12, y = window.innerHeight - m.bottom;
    s(y < b && m.top > y);
  }, [a]), H(() => {
    var m, b;
    a && ((b = (m = u.current) == null ? void 0 : m.querySelector('[role="menuitem"]:not(:disabled)')) == null || b.focus({ preventScroll: !0 }));
  }, [a]), H(() => {
    t && o(!1);
  }, [t]);
  const d = (m = !0) => {
    var b;
    o(!1), m && ((b = c.current) == null || b.focus());
  };
  return /* @__PURE__ */ l("div", { className: `dq-menu${a ? " dq-menu-open" : ""}`, onKeyDown: (m) => {
    var q, v;
    if (!a) return;
    const b = [
      ...((q = u.current) == null ? void 0 : q.querySelectorAll('[role="menuitem"]:not(:disabled)')) ?? []
    ], y = b.indexOf(document.activeElement);
    if (m.key === "Escape")
      m.preventDefault(), m.stopPropagation(), d();
    else if (m.key === "Tab")
      d(!1);
    else if (m.key === "ArrowDown" || m.key === "ArrowUp") {
      if (m.preventDefault(), !b.length) return;
      const w = m.key === "ArrowDown" ? 1 : -1;
      b[(y + w + b.length) % b.length].focus();
    } else (m.key === "Home" || m.key === "End") && (m.preventDefault(), (v = b.at(m.key === "Home" ? 0 : -1)) == null || v.focus());
  }, children: [
    /* @__PURE__ */ r(
      "button",
      {
        ref: c,
        type: "button",
        className: "dq-icon-button",
        "aria-label": n,
        title: n,
        "aria-haspopup": "menu",
        "aria-expanded": a,
        "aria-controls": a ? p : void 0,
        disabled: t,
        onClick: () => o((m) => !m),
        children: /* @__PURE__ */ r(Fl, { "aria-hidden": "true" })
      }
    ),
    a && /* @__PURE__ */ l(we, { children: [
      /* @__PURE__ */ r("div", { className: "dq-menu-backdrop", "aria-hidden": "true", onMouseDown: () => d(!1) }),
      /* @__PURE__ */ r(
        "div",
        {
          ref: u,
          id: p,
          role: "menu",
          "aria-label": n,
          className: `dq-menu-list${i ? " dq-menu-list-up" : ""}`,
          children: e.map((m) => /* @__PURE__ */ l(jo, { children: [
            m.separated && /* @__PURE__ */ r("div", { role: "separator", className: "dq-menu-separator" }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: m.danger ? "dq-menu-danger" : void 0,
                disabled: m.disabled,
                onClick: () => {
                  d(), m.onSelect();
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
function hi(e) {
  return String(e.type).toLowerCase() === "tag";
}
function pi(e) {
  return !!String(e ?? "").trim();
}
function mi(e) {
  return [
    ...new Set(
      Ga(e.customFieldCriteria).filter(hi).flatMap((t) => [
        [t.value, t.displayValue],
        [t.value2, t.displayValue2]
      ]).filter(([, t]) => !pi(t)).map(([t]) => t).map(Number).filter((t) => Number.isSafeInteger(t) && t > 0)
    )
  ];
}
function gi(e, t) {
  const n = Ga(e.customFieldCriteria);
  if (!n.length) return e;
  let a = !1;
  const o = n.map((i) => {
    if (!hi(i)) return i;
    const s = { ...i };
    for (const [c, u] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const p = t[String(i[c] ?? "")];
      p && !pi(i[u]) && (s[u] = p, a = !0);
    }
    return s;
  });
  return a ? { ...e, customFieldCriteria: o } : e;
}
function Ic(e, t, n) {
  const a = Ga(e.customFieldCriteria);
  if (!a.length) return e;
  const o = Ga(n.customFieldCriteria), i = (u, p) => ["key", "jsonPath", "modifier", "value", "value2"].every(
    (d) => (u[d] ?? void 0) === (p[d] ?? void 0)
  );
  let s = !1;
  const c = a.map((u) => {
    if (!hi(u)) return u;
    const p = o.find((g) => i(g, u));
    if (!p) return u;
    const d = { ...u };
    for (const [g, m] of [
      ["value", "displayValue"],
      ["value2", "displayValue2"]
    ]) {
      const b = t[String(u[g] ?? "")];
      b && u[m] === b && !pi(p[m]) && (delete d[m], s = !0);
    }
    return d;
  });
  return s ? { ...e, customFieldCriteria: c } : e;
}
async function of(e, t, n) {
  if (!Pn(n))
    throw new Error("Configure an occurrence tag action first.");
  if (!n.steps.length) return t.applications;
  const a = Ke(e), o = n.steps.some((c) => Fn(c.mode)) ? await Od(a) : "", i = await ti(n);
  let s = t.applications;
  for (const c of [
    ...i.filter((u) => !Fn(u.mode)),
    ...i.filter((u) => Fn(u.mode))
  ]) {
    const u = (p) => Md(
      o,
      a,
      t.media.id,
      t.performer.id,
      c.tagIds,
      p
    );
    (c.mode === "MARK_PRESENT" || c.mode === "CLEAR_ABSENCE") && await u("REMOVE"), c.mode !== "CLEAR_ABSENCE" && (s = await Mc(
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
    )), c.mode === "MARK_ABSENT" && await u("ADD");
  }
  return s;
}
async function bi(e, t) {
  const n = e.occurrence;
  if (Wo(n)) return null;
  if (n.targetMode === "selected") return n.performerIds;
  const a = /* @__PURE__ */ new Set(), { _filterExpression: o, ...i } = n.performerFilter;
  for (let s = 1; ; s++) {
    const c = await pe("/api/performers/find", {
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
    if (c.items.forEach((u) => a.add(u.id)), s * 1e3 >= c.totalCount) return [...a];
    if (!c.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}
function Rc(e) {
  return oa(e.condition) && e.hideConfirmedAbsent !== !1;
}
function yi(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter, o = e.occurrence, i = {
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
  }, s = Rc(o) && (t == null ? void 0 : t.length) === 1 && o.conditionTagIds.length === 1 ? `${t[0]}:${o.conditionTagIds[0]}` : null;
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
            { filter: a },
            { filter: { performerFilterCriterion: i } },
            ...s ? [
              {
                filter: {
                  customFieldCriteria: [
                    {
                      key: Ja,
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
async function wi(e, t) {
  return ["any", "isNull"].includes(e.condition) ? [] : e.includeSubtags === !1 ? e.conditionTagIds.map((n) => [n]) : Promise.all(
    e.conditionTagIds.map((n) => Wa([n], t))
  );
}
function $c(e) {
  return ["includes", "excludesAll"].includes(e.condition) && !e.conditionTagIds.length;
}
function sf(e, t, n = e.conditionTagIds.map((a) => [a])) {
  const a = new Set(t), o = (i) => i.some((s) => a.has(s));
  switch (e.condition) {
    case "any":
      return !0;
    case "isNull":
      return a.size === 0;
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
function cf(e, t, n, a, o) {
  if (!Rc(e)) return !1;
  const i = zs(t, n);
  return e.conditionTagIds.every(
    (s, c) => i.includes(s) || o[c].some((u) => a.includes(u))
  );
}
async function Oc(e, t, n, a) {
  if ((t == null ? void 0 : t.length) === 0 || $c(e.occurrence))
    return { items: [], totalCount: 0 };
  const o = Ke(e), i = await na(
    yi(e, t),
    { ...e.view.filter, page: n },
    a
  ), s = t === null ? null : new Set(t), c = e.occurrence, u = i.items.length ? await wi(c, a) : [], p = new Array(i.items.length);
  let d = 0;
  return await Promise.all(
    Array.from({ length: Math.min(5, i.items.length) }, async () => {
      for (; d < i.items.length; ) {
        const g = d++, m = i.items[g], b = await pe(
          `/api/tagapplications?hostType=${o}&hostId=${m.id}&contextType=performer`,
          { signal: a }
        );
        p[g] = m.performers.filter((y) => s === null || s.has(y.id)).flatMap((y) => {
          const q = b.filter(
            (w) => w.hostType === o && w.hostId === m.id && w.contextType === "performer" && w.contextId === y.id
          ), v = q.map((w) => w.tag.id);
          return sf(e.occurrence, v, u) && !cf(c, m, y.id, v, u) ? [
            {
              key: `${m.id}:${y.id}`,
              media: m,
              performer: y,
              applications: q
            }
          ] : [];
        });
      }
    })
  ), { items: p.flat(), totalCount: i.totalCount };
}
async function Mc(e, t, n) {
  const a = new Set(e.occurrence.tagIds);
  if (n.some((p) => !a.has(p)) || !e.occurrence.multiple && n.length > 1)
    throw new Error("Choose only the configured tags for this review.");
  const o = Ke(e), i = await No(o, t.media.id);
  if (!i.performers.some(
    (p) => p.id === t.performer.id
  ))
    throw new Error(
      `This performer is no longer linked to the ${o}. Refresh the queue.`
    );
  const s = `/api/tagapplications?hostType=${o}&hostId=${i.id}&contextType=performer&contextId=${t.performer.id}`, c = (await pe(s)).filter(
    (p) => p.hostType === o && p.hostId === i.id && p.contextType === "performer" && p.contextId === t.performer.id
  ), u = new Set(n);
  try {
    for (const p of u)
      c.some((d) => d.tag.id === p) || await pe("/api/tagapplications", {
        method: "POST",
        body: JSON.stringify({
          hostType: o,
          hostId: i.id,
          contextType: "performer",
          contextId: t.performer.id,
          tagId: p,
          sourceKey: "user"
        })
      });
    for (const p of c)
      a.has(p.tag.id) && !u.has(p.tag.id) && await pe(`/api/tagapplications/${p.id}`, {
        method: "DELETE"
      });
    return await pe(s);
  } catch (p) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${p instanceof Error ? p.message : "Request failed."}`
    );
  }
}
function _r(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
function lf(e, t) {
  return `/api/tagapplications?hostType=${e}&hostId=${t.media.id}&contextType=performer&contextId=${t.occurrence.performer.id}`;
}
async function hn(e, t, n = !0) {
  var c;
  if (t.occurrence) {
    const u = n ? zs(
      await No(e, t.media.id),
      t.occurrence.performer.id
    ) : [], p = (await pe(lf(e, t))).filter(
      (d) => d.hostType === e && d.hostId === t.media.id && d.contextType === "performer" && d.contextId === t.occurrence.performer.id
    );
    return Io(p.map((d) => d.tag)), {
      ids: [...new Set(p.map((d) => d.tag.id))],
      names: [...new Set(p.map((d) => d.tag.name))],
      absent: u,
      applications: p
    };
  }
  const a = await No(e, t.media.id), o = (a.tags ?? []).filter(
    (u) => u.canRemove !== !1 || u.isDerived !== !0
  );
  Io(o);
  const i = Object.keys(a.customFields ?? {}).find(
    (u) => u.toLowerCase() === ja
  ) ?? ja, s = ((c = a.customFields) == null ? void 0 : c[i]) ?? [];
  if (!Array.isArray(s) || s.some((u) => !Number.isSafeInteger(u)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${e} before editing.`
    );
  return {
    ids: o.map((u) => u.id),
    names: o.map((u) => u.name),
    absent: s,
    tags: o
  };
}
async function vi(e, t, n) {
  if (t.occurrence && $e(e))
    await Mc(
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
    for (const [a, o] of [
      ["ADD", n.added],
      ["REMOVE", n.removed]
    ])
      o.length && await pe(
        `/api/${Zn(Ke(e))}/bulk`,
        {
          method: "POST",
          body: JSON.stringify({ ids: [t.media.id], tagMode: a, tagIds: o })
        }
      );
}
async function df(e, t, n) {
  t.occurrence && $e(e) ? await of(e, t.occurrence, n) : await Js(Ke(e), n, [t.media.id]);
}
function $o(e, t, n, a) {
  const o = (i) => i.filter((s) => a.includes(s));
  return {
    item: e,
    before: t,
    after: n,
    tags: _r(o(t.ids), o(n.ids)),
    absence: _r(o(t.absent), o(n.absent))
  };
}
function uf(e, t) {
  var n;
  for (const [a, o] of [
    [e.tags, t.ids],
    [e.absence, t.absent]
  ])
    if (a.added.some((i) => !o.includes(i)) || a.removed.some((i) => o.includes(i)))
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made."
      );
  if (t.applications)
    for (const a of e.tags.added) {
      const o = (n = e.after.applications) == null ? void 0 : n.filter((s) => s.tag.id === a).map((s) => s.id).sort(), i = t.applications.filter((s) => s.tag.id === a).map((s) => s.id).sort();
      if (JSON.stringify(o) !== JSON.stringify(i))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made."
        );
    }
}
class Fc extends Error {
}
const Oo = (e) => e instanceof Error ? e.message : "Request failed.", Yi = (e) => [...e].sort((t, n) => t - n), ca = (e, t) => JSON.stringify(Yi(e)) === JSON.stringify(Yi(t)), Mo = (e) => !!(e.tags.added.length || e.tags.removed.length);
function Ba(e, t, n, a) {
  const o = new Set(e), i = new Set(e);
  for (const d of t.steps)
    for (const g of d.tagIds)
      d.mode === "ADD" ? i.add(g) : i.delete(g);
  const s = e.some((d) => !i.has(d));
  if (s && !a)
    return { desired: [...e], conflict: s, skipped: !0, kept: [], replaced: [] };
  const c = new Set(
    t.steps.filter((d) => d.mode === "ADD").flatMap((d) => d.tagIds)
  ), u = [], p = [];
  for (const d of n) {
    const g = d.filter((b) => i.has(b) && !o.has(b)), m = d.filter(
      (b) => i.has(b) && o.has(b) && !c.has(b)
    );
    !g.length || !m.length || (a ? (m.forEach((b) => i.delete(b)), p.push(...m)) : (g.forEach((b) => i.delete(b)), u.push({ tagIds: g, existing: m })));
  }
  return { desired: [...i], conflict: s, skipped: !1, kept: u, replaced: p };
}
function ff(e) {
  return e.length === 1 ? e[0] : {
    id: e.map((t) => t.id).join("+"),
    label: e.map((t) => t.label).join(" + "),
    steps: e.flatMap((t) => t.steps)
  };
}
async function hf(e, t, n, a) {
  for (const [o, i] of n.entries()) {
    const s = t.filter(
      (p) => p.steps.some(
        (d) => d.mode === "ADD" && d.tagIds.some((g) => i.includes(g))
      )
    );
    if (s.length < 2) continue;
    const c = e.occurrence.conditionTagIds[o];
    let u = `tag ${c}`;
    try {
      u = (await pe(`/api/tags/${c}`, { signal: a })).name;
    } catch {
      a.throwIfAborted();
    }
    throw new Fc(
      `${s.map((p) => p.label).join(" and ")} answer the same condition tag, ${u}. Choose one of them.`
    );
  }
}
async function pf(e, t, n, a = () => {
}) {
  if (!t.length || t.some(
    (m) => !Pn(m, e.entityType) || !m.steps.length || m.steps.some(
      (b) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(b.mode)
    )
  ))
    throw new Error("Choose a configured occurrence tag action.");
  const o = structuredClone(e), i = structuredClone(t), s = oa(o.occurrence.condition) && o.occurrence.includeSubtags !== !1 ? await wi(o.occurrence, n) : [];
  await hf(o, i, s, n);
  const c = await Promise.all(
    i.map(async (m) => ({
      ...m,
      steps: await ti(m, n)
    }))
  ), u = structuredClone(ff(c));
  n.throwIfAborted();
  const p = [
    .../* @__PURE__ */ new Set([
      ...u.steps.flatMap((m) => m.tagIds),
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
  const d = await bi(o, n), g = /* @__PURE__ */ new Map();
  for (let m = 1; ; m++) {
    n.throwIfAborted();
    const b = await Oc(o, d, m, n);
    for (const y of b.items) {
      const q = {
        ids: [...new Set(y.applications.map((w) => w.tag.id))],
        names: y.applications.map((w) => w.tag.name),
        absent: [],
        applications: y.applications
      }, v = Ba(q.ids, u, s, !0);
      g.set(y.key, {
        item: { key: y.key, media: y.media, occurrence: y },
        before: q,
        expected: q,
        conflict: v.conflict,
        status: ca(q.ids, v.desired) ? "unchanged" : "pending"
      });
    }
    if (a(g.size), m * 250 >= b.totalCount) break;
    if (m > 1e5)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry."
      );
  }
  return n.throwIfAborted(), {
    review: o,
    actions: i,
    action: u,
    categories: s,
    touched: p,
    entries: [...g.values()]
  };
}
function mf(e, t, n) {
  const a = (i) => i.ids.filter((s) => n.includes(s));
  if (!ca(a(e), a(t))) return !1;
  const o = (i) => (i.applications ?? []).filter((s) => n.includes(s.tag.id)).map((s) => s.id);
  return ca(o(e), o(t));
}
async function xc(e, t, n, a) {
  let o = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, e.length) }, async () => {
      for (; !t() && o < e.length; ) {
        const i = e[o++];
        await n(i), a();
      }
    })
  );
}
function Pc(e, t = !1) {
  return e.entries.filter(
    (n) => t ? n.status === "failed" : n.status === "pending"
  );
}
function Lc(e) {
  return e.entries.filter((t) => t.operation);
}
async function gf(e, t, n, a, o = !1) {
  await xc(
    Pc(e, o),
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
        if (s = await hn(Ke(e.review), i.item, !1), !mf(i.expected, s, e.touched)) {
          i.status = "skipped", i.error = "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (m) {
        i.status = "failed", i.error = Oo(m);
        return;
      }
      const c = Ba(
        i.before.ids,
        e.action,
        e.categories,
        t
      ), u = [
        ...s.ids.filter((m) => !e.touched.includes(m)),
        ...c.desired.filter((m) => e.touched.includes(m))
      ], p = _r(s.ids, u);
      if (!p.added.length && !p.removed.length) {
        const m = !i.operation && c.kept.length > 0;
        i.status = i.operation ? "changed" : m ? "skipped" : "unchanged", i.error = m ? "Kept the existing answer in each category it would fill." : void 0;
        return;
      }
      let d;
      try {
        await vi(e.review, i.item, p);
      } catch (m) {
        d = m;
      }
      let g = !1;
      try {
        const m = await hn(Ke(e.review), i.item, !1);
        g = !0, i.expected = m;
        const b = $o(
          i.item,
          i.before,
          m,
          e.touched
        );
        if (i.operation = Mo(b) ? b : void 0, d) throw d;
        if (!ca(
          m.ids.filter((y) => e.touched.includes(y)),
          u.filter((y) => e.touched.includes(y))
        ))
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying."
          );
        i.status = i.operation ? "changed" : "unchanged", i.error = void 0;
      } catch (m) {
        if (i.status = "failed", i.error = Oo(m), !g)
          try {
            const b = await hn(Ke(e.review), i.item, !1);
            i.expected = b;
            const y = $o(
              i.item,
              i.before,
              b,
              e.touched
            );
            i.operation = Mo(y) ? y : void 0;
          } catch {
            i.unverified = !0;
          }
      }
    },
    a
  );
}
async function bf(e, t, n) {
  await xc(
    Lc(e),
    t,
    async (a) => {
      const o = a.operation;
      if (a.unverified) {
        a.error = "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const i = [...o.tags.added, ...o.tags.removed];
      let s = !1;
      try {
        const c = await hn(Ke(e.review), a.item, !1);
        uf(o, c), s = !0, await vi(e.review, a.item, {
          added: o.tags.removed,
          removed: o.tags.added
        });
        const u = await hn(Ke(e.review), a.item, !1);
        if (!ca(
          u.ids.filter((p) => i.includes(p)),
          a.before.ids.filter((p) => i.includes(p))
        ))
          throw new Error("Undo did not restore all affected tags.");
        a.operation = void 0, a.expected = u, a.status = "unchanged", a.error = void 0;
      } catch (c) {
        if (a.error = `Undo stopped: ${Oo(c)}`, a.status = "failed", s)
          try {
            const u = await hn(Ke(e.review), a.item, !1), p = $o(
              a.item,
              a.before,
              u,
              i
            );
            a.operation = Mo(p) ? p : void 0, a.expected = u;
          } catch {
            a.unverified = !0;
          }
      }
    },
    n
  );
}
const Dc = (e, t) => t.count - e.count || Ws(e, t);
async function yf(e, t, n) {
  const a = Ke(e), o = e.occurrence, [i, s] = await Promise.all([
    pe(
      `/api/tagapplications?hostType=${a}&contextType=performer&contextId=${t}`,
      { signal: n }
    ),
    wi(o, n)
  ]), c = i.filter(
    (y) => y.hostType === a && y.contextType === "performer" && y.contextId === t
  );
  Io(c.map((y) => y.tag));
  const u = await Promise.all(
    s.map(async (y, q) => {
      const v = o.conditionTagIds[q];
      return (await pe(`/api/tags/${v}`, { signal: n })).name;
    })
  ), p = new Set(s.flat()), d = new Set(
    [
      ...e.actions.flatMap((y) => y.steps).filter((y) => y.mode === "ADD" || y.mode === "MARK_PRESENT").flatMap((y) => y.tagIds),
      ...o.tagIds
    ].filter((y) => !p.has(y))
  ), g = (y) => {
    const q = /* @__PURE__ */ new Map();
    for (const v of c) {
      if (!y.has(v.tag.id)) continue;
      const w = q.get(v.tag.id) ?? {
        tag: v.tag,
        hosts: /* @__PURE__ */ new Set()
      };
      w.hosts.add(v.hostId), q.set(v.tag.id, w);
    }
    return [...q.values()].map((v) => ({ ...v.tag, count: v.hosts.size })).sort(Dc);
  }, m = s.map((y, q) => ({
    id: o.conditionTagIds[q],
    name: u[q],
    members: y,
    tags: g(new Set(y))
  }));
  d.size && m.push({
    id: null,
    name: s.length ? "Other review tags" : "Review tags",
    members: [...d],
    tags: g(d)
  });
  const b = /* @__PURE__ */ new Set([...p, ...d]);
  return {
    answered: new Set(
      c.filter((y) => b.has(y.tag.id)).map((y) => y.hostId)
    ).size,
    groups: m
  };
}
function wf(e, t, n, a) {
  const o = /* @__PURE__ */ new Set([e, ...t]), i = (s) => {
    if (s === e) return !0;
    const c = a.get(s);
    if (!c) return !1;
    const u = new Set(c);
    return [...o].every((p) => u.has(p));
  };
  return n.some(
    (s) => [...Xn(s)].some((c) => o.has(c)) && s.steps.some(
      (c) => c.mode === "REMOVE_TREE" && c.tagIds.some(i)
    )
  );
}
function Ni(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const b of e.groups) for (const y of b.tags) a.set(y.id, y);
  const o = (b) => b.flatMap((y) => a.get(y) ?? []).sort(Dc), i = (b) => b.members ?? b.tags.map((y) => y.id), s = wr(t).flatMap((b) => {
    const y = [
      ...new Set(b.actions.flatMap((q) => [...Xn(t[q])]))
    ];
    return y.length ? [{ ...b, answers: y, tags: o(y) }] : [];
  }), c = (b) => b.tags.length > 1 ? [b] : [], u = e.groups.filter((b) => b.id !== null).map((b) => {
    const y = `tag:${b.id}`, q = i(b), v = new Set(q);
    return {
      key: y,
      kind: "condition",
      name: b.name,
      members: q,
      tags: b.tags,
      mixed: wf(b.id, q, t, n) ? c({ key: y, name: b.name, members: q, tags: b.tags }) : (
        // A category that holds several answers is mixed where a group inside it is.
        s.filter((w) => w.answers.every((T) => v.has(T))).flatMap(
          (w) => c({
            key: `group:${w.key}`,
            name: w.name,
            members: w.answers,
            tags: w.tags
          })
        )
      )
    };
  }), p = u.map((b) => new Set(b.members)), d = /* @__PURE__ */ new Set();
  for (const b of s) {
    if (p.some((q) => b.answers.every((v) => q.has(v)))) continue;
    b.answers.forEach((q) => d.add(q));
    const y = `group:${b.key}`;
    u.push({
      key: y,
      kind: "group",
      name: b.name,
      members: b.answers,
      tags: b.tags,
      // An answer group is one question: it takes one answer.
      mixed: c({ key: y, name: b.name, members: b.answers, tags: b.tags })
    });
  }
  const g = e.groups.find((b) => b.id === null), m = (g == null ? void 0 : g.tags.filter((b) => !d.has(b.id))) ?? [];
  return g && m.length && u.push({
    key: "other",
    kind: "other",
    name: u.length ? "Other review tags" : "Review tags",
    members: i(g).filter((b) => !d.has(b)),
    tags: m,
    mixed: []
  }), u;
}
const uo = { summary: null, error: "" };
function _c(e, t, n = 0) {
  const a = e == null ? void 0 : e.occurrence, o = JSON.stringify([
    e == null ? void 0 : e.entityType,
    t,
    a == null ? void 0 : a.condition,
    a == null ? void 0 : a.conditionTagIds,
    a == null ? void 0 : a.includeSubtags,
    a == null ? void 0 : a.tagIds,
    e == null ? void 0 : e.actions.map((c) => c.steps)
  ]), [i, s] = A({
    key: o,
    value: uo
  });
  return H(() => {
    if (s((u) => u.key === o ? u : { key: o, value: uo }), e === null || t === null) return;
    const c = new AbortController();
    return yf(e, t, c.signal).then((u) => {
      c.signal.aborted || s({ key: o, value: { summary: u, error: "" } });
    }).catch((u) => {
      c.signal.aborted || s((p) => ({
        key: o,
        value: {
          summary: p.key === o ? p.value.summary : null,
          error: u instanceof Error ? u.message : "Request failed."
        }
      }));
    }), () => c.abort();
  }, [o, n]), i.key === o ? i.value : uo;
}
function vf(e, t) {
  const n = (p) => {
    var d;
    return ((d = p.tagIds) == null ? void 0 : d.every((g) => e.members.includes(g))) ?? !1;
  }, a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
  for (const p of e.mixed) {
    const d = Kd(p, t).filter((m) => m.key !== e.key), g = p.key === e.key ? [] : d.filter(n);
    g.length ? g.forEach((m) => a.add(m.name)) : d.forEach((m) => o.add(m.name));
  }
  const i = Nt(e.name), s = [...a].filter((p) => Nt(p) !== i), c = s.length < a.size, u = o.size ? ` (${c ? "partly " : ""}listed under ${[...o].join(", ")})` : "";
  return { names: s, here: c || o.size > 0, note: u };
}
function Nf(e, { names: t, here: n, note: a }) {
  const o = `this ${e.kind === "group" ? "group" : "category"}${a}`;
  return `This performer has different answers in ${t.length ? n ? `${o} and in ${t.join(", ")}` : t.join(", ") : o}.`;
}
function Fo({
  summary: e,
  error: t,
  mediaKind: n,
  actions: a = [],
  trees: o = ko,
  flags: i = [],
  className: s = ""
}) {
  const c = Cn(n), u = (m) => `${m.toLocaleString()} ${m === 1 ? c.one : c.many}`, p = e ? Ni(e, a, o) : [], d = ai(p), g = (m) => [
    ...new Set(
      i.filter((b) => {
        var y;
        return (y = b.tagIds) == null ? void 0 : y.some((q) => m.includes(q));
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
          /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Existing answers" }),
          e && /* @__PURE__ */ r("span", { children: e.answered ? `${u(e.answered)} answered` : "none answered yet" })
        ] }),
        t ? /* @__PURE__ */ l("p", { role: "alert", children: [
          "Could not load existing answers. ",
          t
        ] }) : e ? p.map((m) => {
          const b = m.kind === "other" ? [] : g(m.members), y = vf(m, d), q = y.note ? /* @__PURE__ */ r("span", { className: "dq-sr-only", children: y.note }) : null;
          return /* @__PURE__ */ l("div", { className: "dq-answer-group", children: [
            /* @__PURE__ */ l("div", { className: "dq-answer-category", children: [
              /* @__PURE__ */ r("span", { children: m.name }),
              m.mixed.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-mixed",
                  title: Nf(m, y),
                  children: [
                    /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
                    "Mixed",
                    y.names.length > 0 ? /* @__PURE__ */ l("span", { className: "dq-answer-mixed-names", children: [
                      y.here && " here",
                      q,
                      ` ${y.here ? "and in" : "in"} ${y.names.join(", ")}`
                    ] }) : q
                  ]
                }
              ),
              b.length > 0 && /* @__PURE__ */ l(
                "span",
                {
                  className: "dq-badge dq-badge-warning dq-answer-flag",
                  title: `Flagged: ${b.join(", ")}`,
                  children: [
                    /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { className: "dq-answer-flag-names", children: [
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Flagged: " }),
                      b.join(", ")
                    ] })
                  ]
                }
              )
            ] }),
            m.tags.length ? /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": m.name, children: m.tags.map((v) => /* @__PURE__ */ l("li", { className: "dq-tag", children: [
              /* @__PURE__ */ r(Bt, { tag: v }),
              /* @__PURE__ */ r("span", { className: "dq-chip-count", "aria-hidden": "true", children: v.count.toLocaleString() }),
              /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
                ", ",
                u(v.count)
              ] })
            ] }, v.id)) }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" })
          ] }, m.key);
        }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading existing answers…" })
      ]
    }
  );
}
function Pr({
  performer: e
}) {
  return /* @__PURE__ */ l("span", { className: "dq-performer-avatar", "aria-hidden": "true", children: [
    /* @__PURE__ */ r("span", { children: e.name.trim().split(/\s+/).slice(0, 2).map((t) => t[0]).join("").toUpperCase() || "?" }),
    /* @__PURE__ */ r(
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
const Xi = 5;
function qf(e, t) {
  return Promise.all(
    e.map(async (n) => {
      try {
        return (await pe(`/api/performers/${n}`, { signal: t })).name;
      } catch {
        return t.throwIfAborted(), `Performer ${n}`;
      }
    })
  );
}
function Sf(e, t) {
  const n = 1100 - (Date.now() - e);
  return n <= 0 ? Promise.resolve() : new Promise((a, o) => {
    const i = window.setTimeout(a, n);
    t.addEventListener(
      "abort",
      () => {
        window.clearTimeout(i), o(t.reason);
      },
      { once: !0 }
    );
  });
}
const Zi = /* @__PURE__ */ new Set([
  "matching",
  "change",
  "correct",
  "different"
]), xo = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" }
], es = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" }
], kf = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of"
}, fo = 250;
function ta(e, t) {
  var a, o;
  const n = e.item.media;
  return n.title || ((o = (a = n.files) == null ? void 0 : a[0]) == null ? void 0 : o.basename) || (t === "audio" ? "Audio" : "Scene");
}
function Ef({ step: e }) {
  const t = xo.findIndex((n) => n.id === e);
  return /* @__PURE__ */ r("ol", { className: "dq-batch-steps", "aria-label": "Steps", children: xo.map((n, a) => {
    const o = a < t ? "done" : a === t ? "current" : "next";
    return /* @__PURE__ */ l("li", { "data-state": o, "aria-current": o === "current" ? "step" : void 0, children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-step-mark", "aria-hidden": "true", children: o === "done" ? /* @__PURE__ */ r(da, {}) : a + 1 }),
      n.label,
      o === "done" && /* @__PURE__ */ r("span", { className: "dq-sr-only", children: ", done" })
    ] }, n.id);
  }) });
}
function ts({ parts: e, id: t }) {
  return /* @__PURE__ */ r("span", { className: "dq-batch-effect", id: t, children: e.map((n, a) => /* @__PURE__ */ l(jo, { children: [
    a > 0 && " ",
    /* @__PURE__ */ r("span", { "data-effect-tone": n.tone, children: n.text })
  ] }, a)) });
}
function ea({
  value: e,
  label: t,
  detail: n,
  tone: a,
  pressed: o,
  onToggle: i
}) {
  return /* @__PURE__ */ l(
    "button",
    {
      type: "button",
      className: "dq-batch-stat",
      "data-tone": e ? a : void 0,
      "aria-pressed": o && e > 0,
      disabled: !e,
      onClick: i,
      children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-value", children: e.toLocaleString() }),
        " ",
        /* @__PURE__ */ r("span", { className: "dq-batch-stat-label", children: t }),
        n && /* @__PURE__ */ l(we, { children: [
          " ",
          /* @__PURE__ */ r("span", { className: "dq-batch-stat-detail", children: n })
        ] })
      ]
    }
  );
}
function ns({
  added: e,
  removed: t,
  tag: n,
  label: a
}) {
  return /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": a, children: [
    br(e.map(n)).map((o) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
      "+ ",
      /* @__PURE__ */ r(Bt, { tag: o })
    ] }) }, `added-${o.id}`)),
    br(t.map(n)).map((o) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-removed", children: /* @__PURE__ */ l("del", { children: [
      "− ",
      /* @__PURE__ */ r(Bt, { tag: o })
    ] }) }, `removed-${o.id}`))
  ] });
}
function rs({
  title: e,
  entries: t,
  mediaKind: n,
  resultHeading: a,
  describe: o
}) {
  return /* @__PURE__ */ l("section", { className: "dq-batch-list", "aria-label": e, children: [
    /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
      /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: e }),
      t.length > fo && /* @__PURE__ */ l("span", { children: [
        "First ",
        fo.toLocaleString(),
        " of ",
        t.length.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-batch-list-scroll", children: /* @__PURE__ */ l("table", { children: [
      /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
        /* @__PURE__ */ r("th", { scope: "col", children: "Occurrence" }),
        /* @__PURE__ */ r("th", { scope: "col", children: "Date" }),
        /* @__PURE__ */ r("th", { scope: "col", children: a })
      ] }) }),
      /* @__PURE__ */ r("tbody", { children: t.slice(0, fo).map((i) => {
        var s;
        return /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
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
          /* @__PURE__ */ r("td", { className: "dq-batch-list-date", children: i.item.media.date ?? "" }),
          /* @__PURE__ */ r("td", { children: o(i) })
        ] }, i.item.key);
      }) })
    ] }) })
  ] });
}
function Cf(e) {
  const t = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0
  }, n = /* @__PURE__ */ new Map();
  let a = 0, o = !1;
  for (const i of e)
    if (t[i.status] += 1, i.operation && (a += 1), i.status === "failed" && !i.unverified && (o = !0), (i.status === "skipped" || i.status === "failed") && i.error) {
      const s = `${i.status}\0${i.error}`, c = n.get(s) ?? { status: i.status, error: i.error, count: 0 };
      c.count += 1, n.set(s, c);
    }
  return { counts: t, reasons: [...n.values()], recorded: a, retryable: o };
}
function Af({
  review: e,
  disabled: t,
  performerAttention: n,
  trees: a,
  onOpen: o,
  onClose: i,
  onWrite: s
}) {
  const [c, u] = A(!1), [p, d] = A("answers"), [g, m] = A(null), [b, y] = A({}), [q, v] = A([]), [w, T] = A(!1), [F, U] = A(!1), [G, _] = A(""), [ee, ne] = A(!1), [se, ae] = A(""), [D, K] = A(null), [S, I] = A(null), [J, Q] = A([]), [Z, oe] = A(0), V = $(null), R = $(null), W = $(null), E = $(!1), B = $(!1), re = $(null), ce = $(!1), P = $(0), be = $(!1), Te = $({ onClose: i, onWrite: s });
  Te.current = { onClose: i, onWrite: s };
  const fe = at(), Oe = p === "run", Ge = (D == null ? void 0 : D.kind) === "undo", Ce = Oe && g ? g.review : e, An = jr(Ce.actions), ve = Ce.occurrence, Je = Ke(Ce), Et = Cn(Je), mn = Et.queue, xe = Oe && g ? g.actions : (
    // Batches change tags only; assessments are answered one occurrence at a time.
    e.actions.filter((C) => C.steps.length && !Qn(C))
  ), ot = xe.filter((C) => q.includes(C.id)), Re = ve.targetMode === "selected" && ve.performerIds.length === 1, Ze = _c(
    Ce,
    c && Re ? ve.performerIds[0] : null,
    Z
  ), Vt = mi(Ce.view.objectFilter), Fe = ma(
    c ? [...Ha(xe), ...ve.conditionTagIds, ...Vt] : []
  ), Tn = ge(() => sc(Fe), [Fe]), ut = (C) => b[C] ?? Fe[C] ?? { id: C, name: `Tag ${C}` }, Mt = JSON.stringify(
    Object.fromEntries(
      Vt.flatMap((C) => {
        var Y;
        const L = (Y = Fe[C]) == null ? void 0 : Y.name;
        return L ? [[String(C), L]] : [];
      })
    )
  ), ht = ge(
    () => gi(Ce.view.objectFilter, JSON.parse(Mt)),
    [Ce.view.objectFilter, Mt]
  );
  H(() => {
    var C, L, Y;
    c && ((C = V.current) == null || C.showModal(), (Y = (L = V.current) == null ? void 0 : L.querySelector(".dq-batch-answer input")) == null || Y.focus());
  }, [c]), H(() => {
    if (!c) return;
    const C = requestAnimationFrame(() => {
      var de;
      const L = V.current, Y = document.activeElement;
      if (!L || Y && Y !== document.body && L.contains(Y)) return;
      (de = (p === "answers" ? L.querySelector(".dq-batch-answer input:checked") ?? L.querySelector(".dq-batch-answer input") : L.querySelector("[data-batch-focus]")) ?? R.current) == null || de.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, p, F, g]), H(() => {
    if (c || t || !E.current) return;
    const C = requestAnimationFrame(() => {
      const L = W.current;
      if (!E.current || !L || L.disabled) return;
      E.current = !1;
      const Y = document.activeElement;
      (!Y || Y === document.body) && L.focus();
    });
    return () => cancelAnimationFrame(C);
  }, [c, t]), H(() => {
    if (!c || ve.targetMode !== "selected") return;
    const C = new AbortController();
    return Q([]), qf(ve.performerIds.slice(0, Xi), C.signal).then((L) => {
      C.signal.aborted || Q(L);
    }).catch(() => {
    }), () => C.abort();
  }, [c, ve.targetMode, JSON.stringify(ve.performerIds)]), H(
    () => () => {
      var C;
      B.current = !0, (C = re.current) == null || C.abort();
    },
    []
  ), H(() => {
    if (!F) return;
    const C = (L) => {
      L.preventDefault(), L.returnValue = "";
    };
    return window.addEventListener("beforeunload", C), () => window.removeEventListener("beforeunload", C);
  }, [F]);
  function zt() {
    d("answers"), m(null), y({}), K(null), T(!1), v([]), ae(""), _(""), ne(!1), I(null);
  }
  function qt() {
    be.current || (u(!1), Te.current.onClose(ce.current), ce.current = !1, zt(), E.current = !0);
  }
  function er(C, L) {
    v(
      (Y) => L ? [...Y, C] : Y.filter((ye) => ye !== C)
    ), m(null), y({}), ae(""), _(""), ne(!1), I(null);
  }
  function Tt() {
    d("answers"), I(null), ae("");
  }
  function In() {
    d("preview"), g || qe();
  }
  function Jt() {
    var C;
    B.current = !0, (C = re.current) == null || C.abort(), ae("Stopping after in-flight operations settle…");
  }
  function Ft(C) {
    I(
      (L) => (L == null ? void 0 : L.group) === C.group && L.reason === C.reason ? null : C
    );
  }
  const gn = (C, L) => (S == null ? void 0 : S.group) === C && S.reason === L;
  async function qe() {
    if (!ot.length || be.current) return;
    be.current = !0, U(!0), _(""), ne(!1), ae("Loading all matching occurrences…"), m(null), y({}), I(null);
    const C = new AbortController();
    re.current = C;
    try {
      await Sf(P.current, C.signal);
      const L = await pf(
        e,
        ot,
        C.signal,
        (ye) => ae(`Loaded ${ye.toLocaleString()} matching occurrences…`)
      );
      C.signal.throwIfAborted();
      const Y = {};
      for (const ye of L.entries)
        for (const de of ye.before.applications ?? [])
          Y[de.tag.id] = de.tag;
      y(Y), m(L), ae("Preview ready. No tags have been changed.");
    } catch (L) {
      _(
        C.signal.aborted ? "Preview cancelled. No tags were changed." : L instanceof Error ? L.message : String(L)
      ), ne(!C.signal.aborted && L instanceof Fc), ae("");
    } finally {
      be.current = !1, U(!1), re.current = null;
    }
  }
  async function Ct(C) {
    if (!g || be.current) return;
    const L = (C === "undo" ? Lc(g) : Pc(g, C === "retry")).length;
    be.current = !0, B.current = !1, ce.current = !0, Te.current.onWrite(), U(!0), d("run"), _(""), K({ kind: C, total: L, done: 0, stopped: !1 }), ae(
      C === "undo" ? "Undoing the batch. Keep this page open until it finishes." : "Applying the answers. Keep this page open until it finishes."
    );
    const Y = () => K((de) => de && { ...de, done: de.done + 1 });
    let ye = !1;
    try {
      C === "undo" ? await bf(g, () => B.current, Y) : await gf(g, w, () => B.current, Y, C === "retry"), ae(
        B.current ? "Stopped after in-flight operations settled. Completed changes are retained." : C === "undo" ? "Batch undo finished. Inspect any failures below." : "Batch finished. Inspect skipped or failed occurrences below."
      );
    } catch (de) {
      ye = !0, ae(""), _(de instanceof Error ? de.message : String(de));
    } finally {
      P.current = Date.now(), be.current = !1;
      const de = B.current || ye;
      K((Me) => Me && { ...Me, stopped: de }), U(!1), oe((Me) => Me + 1);
    }
  }
  const it = (g == null ? void 0 : g.entries) ?? [], Dn = ge(
    () => new Map(
      ((g == null ? void 0 : g.entries) ?? []).map((C) => [
        C.item.key,
        Ba(C.before.ids, g.action, g.categories, w)
      ])
    ),
    [g, w]
  ), Wt = (C) => Dn.get(C.item.key), Pe = (C) => _r(C.before.ids, Wt(C).desired), It = (C) => {
    const L = Pe(C);
    return C.status === "pending" && (L.added.length > 0 || L.removed.length > 0);
  }, le = (C) => C.conflict || Wt(C).kept.length > 0 || Wt(C).replaced.length > 0, x = ge(() => {
    const C = (g == null ? void 0 : g.entries) ?? [];
    return {
      willChange: C.filter(It).length,
      correct: C.filter((L) => L.status === "unchanged").length,
      different: C.filter(le).length,
      hosts: new Set(C.map((L) => L.item.media.id)).size,
      added: [...new Set(C.flatMap((L) => Pe(L).added))],
      removed: [...new Set(C.flatMap((L) => Pe(L).removed))]
    };
  }, [Dn]), Ae = ge(
    () => ((g == null ? void 0 : g.entries) ?? []).filter((C) => C.item.media.date).sort((C, L) => C.item.media.date.localeCompare(L.item.media.date)),
    [g]
  ), pt = Oe ? Cf(it) : null, _n = (C) => An.keys[Ce.actions.findIndex((L) => L.id === C)] ?? "", me = (C) => qr(C, Tn, [], a), Rt = oa(ve.condition) && ve.includeSubtags !== !1 && ve.conditionTagIds.length > 0, tt = Ae[0], Le = Ae.length > 1 ? Ae[Ae.length - 1] : void 0, et = (C) => `/${Je}/${C.item.media.id}`, Ht = Re ? J[0] : void 0, st = ge(
    () => n ? ec(
      n,
      Ze.summary ? ai(
        Ni(Ze.summary, Ce.actions, a ?? ko)
      ) : []
    ) : [],
    [n, Ze.summary, Ce.actions, a]
  ), mt = Bd(ot, st, a ?? ko), xt = n ?? [], Qt = {
    matching: { title: "Matching occurrences", test: () => !0 },
    change: { title: "Occurrences that will change", test: It },
    correct: { title: "Occurrences already correct", test: (C) => C.status === "unchanged" },
    different: { title: "Occurrences with a different answer", test: le }
  };
  function ct() {
    const C = kf[ve.condition], L = !!C && ve.conditionTagIds.length > 0, Y = ve.performerIds.slice(0, Xi), ye = String(Ce.view.filter.q ?? "").trim(), de = ve.condition === "excludes" ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged." : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return /* @__PURE__ */ l("div", { className: "dq-batch-scope", role: "group", "aria-label": "Batch scope", children: [
      /* @__PURE__ */ r("span", { className: "dq-batch-scope-label", children: "Uses this queue" }),
      Wo(ve) ? /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "All performers" }) : ve.targetMode === "selected" ? /* @__PURE__ */ l(we, { children: [
        Y.map((Me, Ie) => /* @__PURE__ */ l("span", { className: "dq-batch-chip dq-batch-chip-performer", children: [
          /* @__PURE__ */ r(Pr, { performer: { id: Me, name: J[Ie] ?? "" } }),
          J[Ie] ?? "…"
        ] }, Me)),
        ve.performerIds.length > Y.length && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
          (ve.performerIds.length - Y.length).toLocaleString(),
          " more performers"
        ] })
      ] }) : /* @__PURE__ */ l(we, { children: [
        /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: "Performer criteria" }),
        /* @__PURE__ */ r(
          "fieldset",
          {
            className: "dq-batch-filter-summary",
            disabled: !0,
            "aria-label": "Batch performer criteria",
            children: /* @__PURE__ */ r(
              aa,
              {
                filter: {},
                objectFilter: ve.performerFilter,
                criteriaDefinitions: Uo,
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
        L ? C : zo[ve.condition],
        L && /* @__PURE__ */ r("span", { className: "dq-batch-chip-tags", children: br(ve.conditionTagIds.map(ut)).map((Me) => /* @__PURE__ */ r(Bt, { tag: Me }, Me.id)) })
      ] }),
      L && /* @__PURE__ */ r("span", { className: "dq-batch-chip", children: ve.includeSubtags === !1 ? "Exact tags only" : "Include subtags" }),
      oa(ve.condition) && ve.hideConfirmedAbsent !== !1 && /* @__PURE__ */ l("span", { className: "dq-batch-chip", title: de, children: [
        "Hides confirmed absent",
        /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
          ": ",
          de
        ] })
      ] }),
      ye && /* @__PURE__ */ l("span", { className: "dq-batch-chip", children: [
        "Search “",
        ye,
        "”"
      ] }),
      Object.keys(Ce.view.objectFilter).length > 0 && /* @__PURE__ */ r(
        "fieldset",
        {
          className: "dq-batch-filter-summary",
          disabled: !0,
          "aria-label": `Batch ${mn} filters`,
          children: /* @__PURE__ */ r(
            aa,
            {
              filter: Ce.view.filter,
              objectFilter: ht,
              criteriaDefinitions: Je === "audio" ? ys : Ko,
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
  function jn(C, L, Y = !0) {
    if (!C.length) return null;
    const ye = /* @__PURE__ */ r("strong", { children: Ht || "This performer" }), de = Y ? `Check the earliest and latest ${Et.many} before applying, or narrow the batch with a date filter.` : "", Me = C.every((Ie) => Ie.tagIds === null && !Ie.mixed.length);
    return /* @__PURE__ */ l("div", { className: "dq-batch-flag", role: "note", children: [
      /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
      /* @__PURE__ */ l("div", { children: [
        Me ? /* @__PURE__ */ l("p", { children: [
          ye,
          " is flagged: ",
          /* @__PURE__ */ r("strong", { children: C.flatMap((Ie) => Ie.flags).join(", ") }),
          ".",
          " ",
          de
        ] }) : /* @__PURE__ */ l(we, { children: [
          /* @__PURE__ */ l("p", { children: [
            ye,
            " needs attention where the chosen answers apply.",
            de && ` ${de}`
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-attention", "aria-label": "Needs attention", children: C.map((Ie) => /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ r("strong", { children: Ie.tagIds === null ? "Whole review" : Ie.name }),
            ":",
            " ",
            oi(Ie).join("; ")
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
    const C = mt.filter((Y) => Y.tagIds === null), L = mt.filter((Y) => Y.tagIds !== null);
    return /* @__PURE__ */ l(we, { children: [
      ct(),
      jn(C, !1),
      /* @__PURE__ */ l("div", { className: `dq-batch-pick${Re ? " dq-batch-pick-answers" : ""}`, children: [
        /* @__PURE__ */ l("fieldset", { className: "dq-batch-answers-field", children: [
          /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Answers" }),
          /* @__PURE__ */ r("p", { className: "dq-muted", children: "Tick the answers to apply to every matching occurrence, on all pages. They run together in review order, with one preview, one run and one undo. To include already answered occurrences, remove filters that exclude them." }),
          /* @__PURE__ */ r("div", { className: "dq-batch-answers", children: xe.map((Y, ye) => {
            const de = _n(Y.id);
            return /* @__PURE__ */ l("label", { className: "dq-batch-answer", children: [
              /* @__PURE__ */ r(
                "input",
                {
                  type: "checkbox",
                  checked: q.includes(Y.id),
                  "aria-labelledby": `${fe}-answer-${ye}`,
                  "aria-describedby": `${fe}-effect-${ye}`,
                  onChange: (Me) => er(Y.id, Me.target.checked)
                }
              ),
              /* @__PURE__ */ r("span", { className: "dq-batch-answer-key", children: de && /* @__PURE__ */ r(dt, { binding: de, hidden: !0 }) }),
              /* @__PURE__ */ l("span", { className: "dq-batch-answer-text", children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    id: `${fe}-answer-${ye}`,
                    className: "dq-batch-answer-label",
                    title: Y.label,
                    children: Y.label
                  }
                ),
                /* @__PURE__ */ r(ts, { id: `${fe}-effect-${ye}`, parts: me(Y) })
              ] })
            ] }, Y.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ l("div", { className: "dq-batch-side", children: [
          /* @__PURE__ */ r("div", { className: "dq-batch-attention-live", "aria-live": "polite", children: jn(L, !1, C.length === 0) }),
          /* @__PURE__ */ r(
            Fo,
            {
              ...Ze,
              mediaKind: Je,
              actions: Ce.actions,
              trees: a,
              flags: xt,
              className: "dq-batch-card"
            }
          )
        ] })
      ] })
    ] });
  }
  function Un(C) {
    const L = x, Y = S && Zi.has(S.group) ? S.group : null, ye = Y ? it.filter(Qt[Y].test) : [], de = (Me) => {
      const Ie = Wt(Me), Lt = Ie.skipped ? _r(
        Me.before.ids,
        Ba(Me.before.ids, C.action, C.categories, !0).desired
      ) : Pe(Me), Ne = !Lt.added.length && !Lt.removed.length;
      return /* @__PURE__ */ l("div", { className: "dq-batch-plan", children: [
        Ie.skipped && /* @__PURE__ */ r("span", { className: "dq-batch-plan-note", children: "Keeps its answer unless replaced:" }),
        Ne ? !Ie.kept.length && /* @__PURE__ */ r("span", { className: "dq-muted", children: "No change" }) : /* @__PURE__ */ r(ns, { added: Lt.added, removed: Lt.removed, tag: ut }),
        Ie.kept.map((ke, Se) => /* @__PURE__ */ l("span", { className: "dq-batch-plan-kept", children: [
          "Keeps",
          " ",
          br(ke.existing.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id)),
          " ",
          "instead of",
          " ",
          br(ke.tagIds.map(ut)).map((Dt) => /* @__PURE__ */ r(Bt, { tag: Dt }, Dt.id))
        ] }, Se))
      ] });
    };
    return /* @__PURE__ */ l(we, { children: [
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Preview", children: [
        /* @__PURE__ */ l("div", { className: "dq-batch-stats", children: [
          /* @__PURE__ */ r(
            ea,
            {
              value: it.length,
              label: it.length === 1 ? "matching occurrence" : "matching occurrences",
              detail: `in ${L.hosts.toLocaleString()} ${L.hosts === 1 ? mn : `${mn}s`}`,
              pressed: gn("matching"),
              onToggle: () => Ft({ group: "matching" })
            }
          ),
          /* @__PURE__ */ r(
            ea,
            {
              value: L.willChange,
              label: "will change",
              tone: "add",
              pressed: gn("change"),
              onToggle: () => Ft({ group: "change" })
            }
          ),
          /* @__PURE__ */ r(
            ea,
            {
              value: L.correct,
              label: "already correct, no write",
              pressed: gn("correct"),
              onToggle: () => Ft({ group: "correct" })
            }
          ),
          /* @__PURE__ */ r(
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
        ye.length > 0 ? /* @__PURE__ */ r(
          rs,
          {
            title: Qt[Y].title,
            entries: ye,
            mediaKind: Je,
            resultHeading: "Planned change",
            describe: de
          }
        ) : it.length > 0 && /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." }),
        it.length > 0 && /* @__PURE__ */ l("p", { className: "dq-batch-dates", children: [
          /* @__PURE__ */ r("span", { children: tt ? `Dates ${tt.item.media.date}${Le ? ` to ${Le.item.media.date}` : ""}` : "No dates" }),
          tt && /* @__PURE__ */ r(
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
          Le && /* @__PURE__ */ r(
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
          /* @__PURE__ */ r("span", { className: "dq-batch-planned-label", children: "Tag changes" }),
          /* @__PURE__ */ r(
            ns,
            {
              added: L.added,
              removed: L.removed,
              tag: ut,
              label: "Tag changes"
            }
          )
        ] })
      ] }),
      L.different > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-choice", children: [
        /* @__PURE__ */ r("span", { id: `${fe}-choice`, className: "dq-batch-choice-label", children: "Occurrences with a different answer" }),
        /* @__PURE__ */ l(
          "div",
          {
            className: "dq-segmented dq-segmented-fill",
            role: "group",
            "aria-labelledby": `${fe}-choice`,
            children: [
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": !w, onClick: () => T(!1), children: "Keep their answer" }),
              /* @__PURE__ */ r("button", { type: "button", "aria-pressed": w, onClick: () => T(!0), children: "Replace it" })
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
    return /* @__PURE__ */ l(we, { children: [
      ct(),
      jn(mt, !0),
      /* @__PURE__ */ l("div", { className: `dq-batch-cards${Re ? "" : " dq-batch-cards-one"}`, children: [
        /* @__PURE__ */ l("section", { className: "dq-batch-card", "aria-labelledby": `${fe}-chosen`, children: [
          /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
            /* @__PURE__ */ r("h3", { id: `${fe}-chosen`, className: "dq-eyebrow", children: "Answers to apply" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", disabled: F, onClick: Tt, children: "Change" })
          ] }),
          /* @__PURE__ */ r("ul", { className: "dq-batch-chosen", children: ot.map((C) => {
            const L = _n(C.id);
            return /* @__PURE__ */ l("li", { children: [
              /* @__PURE__ */ l("span", { className: "dq-batch-chosen-chip", children: [
                L && /* @__PURE__ */ r(dt, { binding: L, hidden: !0 }),
                C.label
              ] }),
              /* @__PURE__ */ r(ts, { parts: me(C) })
            ] }, C.id);
          }) })
        ] }),
        Re && /* @__PURE__ */ r(
          Fo,
          {
            ...Ze,
            mediaKind: Je,
            actions: Ce.actions,
            trees: a,
            flags: xt,
            className: "dq-batch-card"
          }
        )
      ] }),
      F ? /* @__PURE__ */ r("div", { className: "dq-batch-loading", "aria-hidden": "true", children: /* @__PURE__ */ r("span", { className: "dq-batch-bar dq-batch-bar-busy", children: /* @__PURE__ */ r("span", {}) }) }) : g && Un(g)
    ] });
  }
  function bn(C) {
    const L = D ?? { kind: "apply", total: 0, done: 0, stopped: !1 }, Y = L.kind === "apply" ? it.length - C.counts.pending : L.done, ye = L.kind === "apply" ? it.length : L.total, de = F ? L.kind === "undo" ? "Undoing batch…" : L.kind === "retry" ? "Retrying failed occurrences…" : "Applying answers…" : L.kind === "undo" ? L.stopped ? "Undo stopped" : "Undo finished" : L.stopped ? "Stopped" : "Finished", Me = ye ? Math.round(Y / ye * 100) : 100, Ie = S && !Zi.has(S.group) ? S.group : null, Lt = (ke) => es.find((Se) => Se.status === ke).label, Ne = Ie ? it.filter(
      (ke) => ke.status === Ie && (!S.reason || ke.error === S.reason)
    ) : [];
    return /* @__PURE__ */ l(we, { children: [
      /* @__PURE__ */ l("div", { className: "dq-batch-progress", children: [
        /* @__PURE__ */ l("div", { className: "dq-panel-heading", children: [
          /* @__PURE__ */ r("h3", { tabIndex: -1, "data-batch-focus": "", children: de }),
          /* @__PURE__ */ l("span", { children: [
            Y.toLocaleString(),
            " of ",
            ye.toLocaleString(),
            " processed"
          ] })
        ] }),
        /* @__PURE__ */ r(
          "span",
          {
            className: "dq-batch-bar",
            role: "progressbar",
            "aria-label": "Batch progress",
            "aria-valuemin": 0,
            "aria-valuemax": ye,
            "aria-valuenow": Y,
            children: /* @__PURE__ */ r("span", { style: { width: `${Me}%` } })
          }
        ),
        !F && L.kind === "undo" && /* @__PURE__ */ l("p", { className: "dq-batch-undone", children: [
          "Restored ",
          (L.total - C.recorded).toLocaleString(),
          " of",
          " ",
          L.total.toLocaleString(),
          " ",
          L.total === 1 ? "change" : "changes",
          "."
        ] })
      ] }),
      /* @__PURE__ */ l("section", { className: "dq-batch-results", "aria-label": "Results", children: [
        /* @__PURE__ */ r("div", { className: "dq-batch-stats", "data-count": "5", children: es.map((ke) => /* @__PURE__ */ r(
          ea,
          {
            value: C.counts[ke.status],
            label: ke.label,
            tone: ke.tone,
            pressed: gn(ke.status),
            onToggle: () => Ft({ group: ke.status })
          },
          ke.status
        )) }),
        C.reasons.length > 0 && /* @__PURE__ */ r("ul", { className: "dq-batch-reasons", children: C.reasons.map((ke) => {
          const Se = gn(ke.status, ke.error);
          return /* @__PURE__ */ l("li", { children: [
            /* @__PURE__ */ l("span", { children: [
              ke.count.toLocaleString(),
              " ",
              ke.status,
              ": ",
              ke.error
            ] }),
            /* @__PURE__ */ r(
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
        Ne.length > 0 ? /* @__PURE__ */ r(
          rs,
          {
            title: S.reason ? `${Lt(Ie)}: ${S.reason}` : `${Lt(Ie)} occurrences`,
            entries: Ne,
            mediaKind: Je,
            resultHeading: "Result",
            describe: (ke) => ke.error ?? Lt(ke.status)
          }
        ) : /* @__PURE__ */ r("p", { className: "dq-batch-hint", children: "Select a count to list its occurrences." })
      ] }),
      C.recorded > 0 && /* @__PURE__ */ l("div", { className: "dq-batch-undo", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-button",
            disabled: F,
            onClick: () => void Ct("undo"),
            children: [
              /* @__PURE__ */ r(Dl, { "aria-hidden": "true" }),
              "Undo batch"
            ]
          }
        ),
        /* @__PURE__ */ l("p", { children: [
          Ge ? L.stopped || F ? `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change is" : "changes are"} still recorded.` : `${C.recorded.toLocaleString()} ${C.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.` : `Undo reverses ${C.recorded === 1 ? "this change" : `these ${C.recorded.toLocaleString()} changes`} and keeps later edits.`,
          " ",
          "It lasts until you close this dialog or start a new batch."
        ] })
      ] })
    ] });
  }
  function nn() {
    return p === "answers" ? /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !ot.length,
        onClick: In,
        children: "Preview all matches"
      },
      "preview"
    ) : p === "preview" ? F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Jt, children: "Cancel preview" }, "cancel-preview") : g ? /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        disabled: !x.willChange,
        onClick: () => void Ct("apply"),
        children: [
          "Apply to ",
          x.willChange.toLocaleString(),
          " ",
          x.willChange === 1 ? "occurrence" : "occurrences"
        ]
      },
      "apply"
    ) : ee ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button primary", onClick: Tt, children: "Change answers" }, "change-answers") : /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button primary",
        onClick: () => void qe(),
        children: "Preview again"
      },
      "again"
    ) : F ? /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: Jt, children: Ge ? "Cancel undo" : "Cancel run" }, "cancel-run") : Ge || !pt ? null : /* @__PURE__ */ l(jo, { children: [
      pt.retryable && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: () => void Ct("retry"), children: "Retry failed" }),
      pt.counts.pending > 0 && /* @__PURE__ */ r(
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
  return /* @__PURE__ */ l(ju, { children: [
    /* @__PURE__ */ l(
      "button",
      {
        type: "button",
        className: "dq-header-button",
        ref: W,
        title: "Apply answers to all matching occurrences",
        disabled: t || !xe.length,
        onClick: () => {
          zt(), o(), u(!0);
        },
        children: [
          /* @__PURE__ */ r($i, { "aria-hidden": "true" }),
          "Batch…"
        ]
      }
    ),
    c && /* @__PURE__ */ l(
      "dialog",
      {
        ref: V,
        className: "dq-batch-dialog",
        "aria-labelledby": `${fe}-title`,
        "aria-modal": "true",
        onCancel: (C) => {
          C.preventDefault(), qt();
        },
        onClose: () => {
          var C;
          be.current ? (C = V.current) == null || C.showModal() : qt();
        },
        children: [
          /* @__PURE__ */ l("div", { className: "dq-batch-header", children: [
            /* @__PURE__ */ r($i, { "aria-hidden": "true" }),
            /* @__PURE__ */ r("h2", { id: `${fe}-title`, children: "Apply to all matching occurrences" }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-batch-close",
                "aria-label": "Close dialog",
                disabled: F,
                onClick: qt,
                children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r(Ef, { step: p }),
          /* @__PURE__ */ l(
            "div",
            {
              className: "dq-batch-body",
              ref: R,
              role: "group",
              tabIndex: -1,
              "data-batch-focus": p === "preview" ? "" : void 0,
              "aria-label": `${xo.find((C) => C.id === p).label} step`,
              children: [
                /* @__PURE__ */ l("div", { className: "dq-batch-messages", "aria-live": "polite", children: [
                  se && /* @__PURE__ */ r("p", { role: "status", children: se }),
                  G && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: G })
                ] }),
                p === "answers" ? Yt() : p === "preview" ? Pt() : bn(pt)
              ]
            }
          ),
          /* @__PURE__ */ l("div", { className: "dq-batch-footer", children: [
            p === "preview" && /* @__PURE__ */ l("button", { type: "button", className: "dq-button", disabled: F, onClick: Tt, children: [
              /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
              "Back"
            ] }),
            p === "run" && /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: zt, children: "New batch" }),
            /* @__PURE__ */ r("span", { className: "dq-batch-footer-space" }),
            /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: F, onClick: qt, children: "Close" }),
            nn()
          ] })
        ]
      }
    )
  ] });
}
const jc = "data-quality.description-collapsed.v1";
function Tf() {
  try {
    return localStorage.getItem(jc) === "true";
  } catch {
    return !1;
  }
}
function If({
  details: e,
  label: t
}) {
  const [n, a] = A(Tf), o = kn(() => {
    a((i) => {
      const s = !i;
      try {
        localStorage.setItem(jc, String(s));
      } catch {
      }
      return s;
    });
  }, []);
  return /* @__PURE__ */ l("section", { className: "dq-media-description", "aria-label": `${t} description`, children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-description-toggle",
        "aria-expanded": !n,
        onClick: o,
        children: "Description"
      }
    ),
    !n && (e != null && e.trim() ? /* @__PURE__ */ r(Sl, { className: "dq-description-body", children: e }) : /* @__PURE__ */ r("p", { className: "dq-description-body dq-description-empty", children: "No description." }))
  ] });
}
const Rf = (e) => "";
function $f({
  ranking: e,
  busy: t,
  error: n,
  focus: a,
  disabled: o,
  labels: i,
  flagLabel: s = Rf,
  onFocus: c,
  onMore: u,
  onRefresh: p
}) {
  var m;
  const d = e ? e.ranked.slice(0, e.limit) : [], g = !!e && (e.ranked.length > e.limit || (((m = e.candidates[e.cursor]) == null ? void 0 : m.total) ?? 0) > 0);
  return /* @__PURE__ */ l("div", { className: "dq-performer-ranking", children: [
    /* @__PURE__ */ l("div", { className: "dq-performer-ranking-status", children: [
      n ? /* @__PURE__ */ l("p", { role: "alert", children: [
        "Could not rank performers. ",
        n
      ] }) : t ? /* @__PURE__ */ l("p", { role: "status", children: [
        "Counting matching ",
        i.many,
        " per performer…"
      ] }) : e ? /* @__PURE__ */ r("p", { children: d.length ? `Most matching ${i.queue}s first` : `No performer has matching ${i.many}.` }) : null,
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          className: "dq-icon-button",
          "aria-label": "Refresh counts",
          title: "Refresh counts",
          disabled: t || o,
          onClick: p,
          children: /* @__PURE__ */ r(_l, { "aria-hidden": "true" })
        }
      )
    ] }),
    /* @__PURE__ */ r("div", { className: "dq-queue-list", children: d.map((b) => {
      const y = `${b.count.toLocaleString()} matching ${b.count === 1 ? i.one : i.many}`, q = s(b.tags);
      return /* @__PURE__ */ l(
        "button",
        {
          type: "button",
          className: "dq-queue-row dq-ranked-performer",
          "aria-label": `${b.name}, ${y}${q ? `. ${q}` : ""}`,
          title: q || void 0,
          "aria-current": a === b.id ? "true" : void 0,
          disabled: o,
          onClick: () => c(b.id),
          children: [
            /* @__PURE__ */ r(Pr, { performer: b }),
            /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b.name }),
            q && /* @__PURE__ */ r(xn, { className: "dq-flag-icon", "aria-hidden": "true" }),
            /* @__PURE__ */ r("span", { className: "dq-ranked-count", "aria-hidden": "true", children: b.count.toLocaleString() })
          ]
        },
        b.id
      );
    }) }),
    g && !t && !n && /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        className: "dq-button dq-ranking-more",
        disabled: o,
        onClick: u,
        children: "Show more performers"
      }
    )
  ] });
}
const Of = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" }
], Mf = 'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
function Ff(e) {
  const t = e.getBoundingClientRect(), n = Math.min(600, window.innerWidth - 32), a = Math.min(Math.max(16, t.right - n), window.innerWidth - n - 16), o = t.bottom + 8;
  return { top: o, left: a, width: n, maxHeight: Math.max(160, window.innerHeight - o - 16) };
}
function Ma(e, t) {
  return e.length ? e.length <= 2 ? e.join(` ${t} `) : `${e.slice(0, 2).join(", ")} ${t} ${e.length - 2} more` : "the chosen tags";
}
function xf(e, t) {
  const n = Wo(e) ? "All performers" : e.targetMode === "selected" ? e.performerIds.length === 1 ? "1 performer" : `${e.performerIds.length} performers` : "Performer criteria", a = e.conditionTagIds.map(
    (i) => t[i] === void 0 ? "…" : t[i] ?? "Unavailable tag"
  ), o = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${Ma(a, "or")}`,
    includesAll: `has ${Ma(a, "and")}`,
    excludes: `has none of ${Ma(a, "or")}`,
    excludesAll: `missing ${Ma(a, "or")}`
  };
  return `${n} · ${o[e.condition]}`;
}
function Pf({
  scope: e,
  disabled: t,
  editing: n = !1,
  onChange: a,
  onEditCriteria: o
}) {
  const [i, s] = A(!1), [c, u] = A(null), p = $(null), d = $(null), g = at(), m = Ur(e.conditionTagIds), b = xf(e, m);
  kt(() => {
    const w = p.current;
    if (!i || !w) return;
    const T = () => u(Ff(w));
    T(), window.addEventListener("resize", T);
    const F = typeof ResizeObserver > "u" ? null : new ResizeObserver(T), U = [w, w.closest(".dq-review-header-trail"), w.closest("header")];
    for (const G of U) G && (F == null || F.observe(G));
    return () => {
      window.removeEventListener("resize", T), F == null || F.disconnect();
    };
  }, [i]), H(() => {
    var T, F;
    if (!i) return;
    const w = (T = d.current) == null ? void 0 : T.querySelector('[aria-pressed="true"]');
    w && !w.disabled ? w.focus() : (F = d.current) == null || F.focus();
  }, [i]);
  const y = () => {
    s(!1), requestAnimationFrame(() => {
      var w;
      return (w = p.current) == null ? void 0 : w.focus();
    });
  }, q = (w) => {
    if (!(w.target instanceof Element && w.target.closest('[role="dialog"]') !== d.current || w.defaultPrevented || pn(w))) {
      if (w.key === "Escape")
        w.preventDefault(), y();
      else if (w.key === "Tab" && d.current) {
        const F = [...d.current.querySelectorAll(Mf)].filter((ee) => ee.closest('[role="dialog"]') === d.current).sort(
          (ee, ne) => ee.compareDocumentPosition(ne) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        );
        if (!F.length) return;
        const U = F[0], G = F[F.length - 1], _ = document.activeElement;
        w.shiftKey && (_ === U || _ === d.current) ? (w.preventDefault(), G.focus()) : !w.shiftKey && _ === G && (w.preventDefault(), U.focus());
      }
    }
  }, v = !["any", "isNull"].includes(e.condition);
  return /* @__PURE__ */ l("div", { className: "dq-scope", children: [
    /* @__PURE__ */ l(
      "button",
      {
        ref: p,
        type: "button",
        className: "dq-header-button dq-scope-button",
        "aria-haspopup": "dialog",
        "aria-expanded": i,
        "aria-controls": i ? g : void 0,
        title: b,
        onClick: () => i ? y() : s(!0),
        children: [
          /* @__PURE__ */ r(Es, { "aria-hidden": "true" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-name", children: "Scope" }),
          /* @__PURE__ */ r("span", { className: "dq-scope-summary", children: b }),
          /* @__PURE__ */ r(Go, { "aria-hidden": "true" })
        ]
      }
    ),
    i && /* @__PURE__ */ l(we, { children: [
      /* @__PURE__ */ r("div", { className: "dq-scope-backdrop", "aria-hidden": "true", onMouseDown: y }),
      /* @__PURE__ */ l(
        "div",
        {
          ref: d,
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
          onKeyDown: q,
          children: [
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Performers to review" }),
              /* @__PURE__ */ r("div", { className: "dq-segmented dq-segmented-fill", role: "group", "aria-label": "Performers to review", children: Of.map(({ mode: w, label: T }) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  "aria-pressed": e.targetMode === w,
                  onClick: () => e.targetMode !== w && a({ targetMode: w }),
                  children: T
                },
                w
              )) }),
              e.targetMode === "selected" && /* @__PURE__ */ r(
                Yn,
                {
                  entityType: "performer",
                  values: e.performerIds,
                  onChange: (w) => a({ performerIds: w }),
                  placeholder: "All performers...",
                  allowCreate: !1
                }
              ),
              e.targetMode === "filter" && /* @__PURE__ */ l("div", { className: "dq-scope-criteria", children: [
                /* @__PURE__ */ r("div", { className: "dq-performer-criteria", children: /* @__PURE__ */ r(
                  aa,
                  {
                    filter: {},
                    onFilterChange: () => {
                    },
                    totalCount: 0,
                    sortOptions: [],
                    showSearch: !1,
                    showSort: !1,
                    showPagingControls: !1,
                    criteriaDefinitions: Uo,
                    objectFilter: e.performerFilter,
                    onObjectFilterChange: (w) => a({ performerFilter: w })
                  }
                ) }),
                /* @__PURE__ */ l("button", { type: "button", className: "dq-button", onClick: o, children: [
                  /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
                  "Edit criteria"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("fieldset", { className: "dq-scope-section", disabled: t, children: [
              /* @__PURE__ */ r("legend", { className: "dq-eyebrow", children: "Occurrence tags" }),
              /* @__PURE__ */ r(
                "select",
                {
                  className: "dq-select",
                  "aria-label": "Occurrence condition",
                  value: e.condition,
                  onChange: (w) => a({ condition: w.target.value }),
                  children: Jo.map((w) => /* @__PURE__ */ r("option", { value: w, children: zo[w] }, w))
                }
              ),
              v && /* @__PURE__ */ l(we, { children: [
                /* @__PURE__ */ r(
                  Yn,
                  {
                    entityType: "tag",
                    values: e.conditionTagIds,
                    onChange: (w) => a({ conditionTagIds: w }),
                    placeholder: "Add a condition tag…",
                    allowCreate: !1
                  }
                ),
                /* @__PURE__ */ l("div", { className: "dq-scope-options", children: [
                  /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.includeSubtags ?? !0,
                        onChange: (w) => a({ includeSubtags: w.target.checked })
                      }
                    ),
                    "Include subtags"
                  ] }),
                  oa(e.condition) && /* @__PURE__ */ l("label", { className: "dq-checkbox", children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "checkbox",
                        checked: e.hideConfirmedAbsent ?? !0,
                        onChange: (w) => a({ hideConfirmedAbsent: w.target.checked })
                      }
                    ),
                    "Hide occurrences confirmed absent"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-scope-footer", children: [
              /* @__PURE__ */ r("p", { children: n ? "Applies to this queue at once, and Save review keeps it." : "Applies to this queue at once; Save to review in the header keeps it." }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", onClick: y, children: "Done" })
            ] })
          ]
        }
      )
    ] })
  ] });
}
function La(e) {
  const {
    page: t,
    perPage: n,
    sort: a,
    direction: o,
    sorts: i,
    seed: s,
    ...c
  } = e.view.filter, {
    performerFlags: u,
    flagPerformerTagIds: p,
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
function Lf(e) {
  const t = e.occurrence;
  return JSON.stringify([
    Ke(e),
    t.targetMode,
    t.targetMode === "selected" ? t.performerIds : [],
    t.targetMode === "filter" ? t.performerFilter : {}
  ]);
}
async function Df(e, t) {
  const n = Ke(e) === "audio", a = (s) => ({
    id: s.id,
    name: s.name,
    total: (n ? s.audioCount : s.videoCount) ?? 0,
    tags: (s.tags ?? []).map((c) => ({ id: c.id, name: c.name }))
  }), o = e.occurrence, i = [];
  if (o.targetMode === "selected" && o.performerIds.length > 0)
    for (const s of o.performerIds) {
      const c = await Nd(
        `/api/performers/${s}`,
        { signal: t }
      );
      c && i.push(a(c));
    }
  else {
    const { _filterExpression: s, ...c } = o.targetMode === "filter" ? o.performerFilter : {};
    for (let u = 1; ; u++) {
      const p = await pe(
        "/api/performers/find",
        {
          method: "POST",
          signal: t,
          body: JSON.stringify(
            Ln({
              findFilter: {
                page: u,
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
      if (i.push(...p.items.map(a)), u * 1e3 >= p.totalCount || !p.items.length) break;
    }
  }
  return i.sort((s, c) => c.total - s.total || s.id - c.id);
}
function Uc(e, t, n) {
  const a = yi(e, [t]);
  return kd(a, a.view.filter, n);
}
function Kc(e, t) {
  const n = e.findIndex(
    (a) => a.count < t.count || a.count === t.count && a.name.localeCompare(t.name) > 0
  );
  e.splice(n < 0 ? e.length : n, 0, t);
}
function Po(e, t, n, a) {
  if (t >= e.length) return !0;
  const o = e[t].total;
  return o <= 0 ? !0 : n.length >= a && o < n[a - 1].count;
}
async function _f(e, t, n, a, o = {}) {
  const i = La(e), s = Lf(e), c = $c(e.occurrence), u = (t == null ? void 0 : t.signature) === i && !t.partial ? t : {
    signature: i,
    // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
    candidatesKey: c ? "" : s,
    candidates: c ? [] : (t == null ? void 0 : t.candidatesKey) === s ? t.candidates : await Df(e, a),
    cursor: 0,
    ranked: [],
    limit: n,
    complete: !1
  }, { candidates: p } = u, d = [...u.ranked];
  let g = u.cursor, m = !1;
  const b = (y) => ({
    ...u,
    cursor: g,
    ranked: [...d],
    limit: n,
    complete: !y && Po(p, g, d, n),
    ...y ? { partial: y } : {}
  });
  try {
    await Promise.all(
      Array.from({ length: o.concurrency ?? 6 }, async () => {
        var y;
        for (; !m && !Po(p, g, d, n); ) {
          a.throwIfAborted();
          const q = p[g++], v = await Uc(e, q.id, a);
          v > 0 && Kc(d, { ...q, count: v }), (y = o.onProgress) == null || y.call(o, b(!0));
        }
      })
    );
  } catch (y) {
    throw m = !0, y;
  }
  return a.throwIfAborted(), b(!1);
}
function jf(e, t, n) {
  const a = e.candidates.findIndex((i) => i.id === t);
  if (e.partial || a < 0 || a >= e.cursor) return e;
  const o = e.ranked.filter((i) => i.id !== t);
  return n > 0 && Kc(o, { ...e.candidates[a], count: n }), {
    ...e,
    ranked: o,
    complete: Po(e.candidates, e.cursor, o, e.limit)
  };
}
const Lo = /* @__PURE__ */ new Map();
function Uf(e) {
  return Array.isArray(e) ? e.flatMap(
    (t) => t && Number.isSafeInteger(t.id) && typeof t.name == "string" ? [{ id: t.id, name: t.name }] : []
  ) : [];
}
function Gc(e, t) {
  const n = Uf(t);
  return Lo.set(e, n), n;
}
function Kf(e) {
  const [t, n] = A(null);
  if (H(() => {
    if (e === null || Lo.has(e)) return;
    const a = new AbortController();
    return pe(`/api/performers/${e}`, { signal: a.signal }).then(
      (o) => {
        const i = Gc(e, o == null ? void 0 : o.tags);
        a.signal.aborted || n({ id: e, tags: i });
      },
      () => {
      }
    ), () => a.abort();
  }, [e]), e !== null)
    return Lo.get(e) ?? ((t == null ? void 0 : t.id) === e ? t.tags : void 0);
}
function vr(e, t) {
  if (Object.is(e, t)) return !0;
  if (Array.isArray(e) || Array.isArray(t))
    return Array.isArray(e) && Array.isArray(t) && e.length === t.length && e.every((s, c) => vr(s, t[c]));
  if (!e || !t || typeof e != "object" || typeof t != "object")
    return !1;
  const n = e, a = t, o = Object.keys(n).sort(), i = Object.keys(a).sort();
  return o.length === i.length && o.every(
    (s, c) => s === i[c] && vr(n[s], a[s])
  );
}
function Gf(e) {
  var c, u, p;
  const [t, n] = A({}), [a, o] = A(""), i = (((c = e == null ? void 0 : e.presentation) == null ? void 0 : c.annotations) ?? []).includes("tags") ? ((u = e == null ? void 0 : e.presentation) == null ? void 0 : u.annotationParents) ?? [] : [], s = JSON.stringify([
    .../* @__PURE__ */ new Set([
      ...i,
      ...((p = e == null ? void 0 : e.presentation) == null ? void 0 : p.binParents) ?? []
    ])
  ]);
  return H(() => {
    let d = !0;
    return n({}), o(""), Promise.all(
      JSON.parse(s).map(
        async (g) => [g, await Wa([g])]
      )
    ).then((g) => {
      d && n(Object.fromEntries(g));
    }).catch(() => {
      d && o(
        "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry."
      );
    }), () => {
      d = !1;
    };
  }, [s]), { ids: t, error: a };
}
function Bf(e, t, n) {
  const a = t == null ? void 0 : t.presentation, o = (a == null ? void 0 : a.annotations) ?? [], i = (a == null ? void 0 : a.annotationParents) ?? [];
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
          var u;
          return c !== s.id && ((u = n[c]) == null ? void 0 : u.includes(s.id));
        }
      )
    ) : []
  };
}
function Vf({
  videos: e,
  review: t,
  savedObjectFilter: n,
  trees: a,
  disabled: o,
  onToggle: i
}) {
  var y;
  const s = ((y = t.presentation) == null ? void 0 : y.binParents) ?? [], c = new Set(
    s.flatMap((q) => (a[q] ?? []).filter((v) => v !== q))
  ), u = s.every((q) => a[q]), p = ba(t.view.objectFilter, n).bins.filter(
    (q) => !u || c.has(q)
  ), d = /* @__PURE__ */ new Map();
  for (const q of e)
    for (const v of q.tags ?? [])
      if (c.has(v.id)) {
        const w = d.get(v.id) ?? { name: v.name, count: 0 };
        w.count++, d.set(v.id, w);
      }
  const g = p.filter((q) => !d.has(q)), m = Ur(g);
  for (const q of g)
    d.set(q, {
      name: m[q] === void 0 ? "…" : m[q] ?? "Unavailable tag",
      count: 0
    });
  if (!s.length) return null;
  const b = [...d].sort((q, v) => q[1].name.localeCompare(v[1].name));
  return /* @__PURE__ */ l("div", { className: "dq-bins", role: "group", "aria-label": "Tag bins on this page", children: [
    /* @__PURE__ */ r("span", { className: "dq-bins-label", "aria-hidden": "true", children: "On this page" }),
    b.map(([q, v]) => {
      const w = p.includes(q);
      return /* @__PURE__ */ l(
        "button",
        {
          className: "dq-bin",
          type: "button",
          "aria-pressed": w,
          title: w ? `Show every video again, not only ${v.name}` : `Show only videos tagged ${v.name}`,
          disabled: o,
          onClick: () => i(q),
          children: [
            w && /* @__PURE__ */ r(da, { "aria-hidden": "true" }),
            v.name,
            " ",
            /* @__PURE__ */ r("span", { className: "dq-bin-count", children: v.count })
          ]
        },
        q
      );
    }),
    !b.length && /* @__PURE__ */ r("span", { className: "dq-bins-empty", children: "No matching tag bins on this page." })
  ] });
}
function mr(e) {
  return typeof e == "object" && e !== null && !Array.isArray(e);
}
function zf(e) {
  if (!mr(e) || Object.keys(e).length !== 1 || !mr(e.filter)) return null;
  const t = e.filter;
  if (Object.keys(t).length !== 1 || !mr(t.tagsCriterion)) return null;
  const { value: n, modifier: a, depth: o, ...i } = t.tagsCriterion;
  return Array.isArray(n) && n.length === 1 && typeof n[0] == "number" && a === "INCLUDES" && o === 0 && !Object.keys(i).length ? n[0] : null;
}
function ba(e, t) {
  let n = e;
  const a = [];
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
    const s = i.children, c = zf(s.at(-1));
    if (c == null || s.length > 3) break;
    let u = {}, p = null, d = !0;
    for (const [g, m] of s.slice(0, -1).entries())
      !mr(m) || Object.keys(m).length !== 1 ? d = !1 : g === 0 && mr(m.filter) && Object.keys(m.filter).length ? u = m.filter : !p && mr(m.group) ? p = m.group : d = !1;
    if (!d) break;
    a.unshift(c), n = p ? { ...u, _filterExpression: p } : u;
  }
  return { base: n, bins: a };
}
function Jf(e, t, n) {
  const { base: a, bins: o } = ba(e.view.objectFilter, n);
  return (o.includes(t) ? o.filter((s) => s !== t) : [...o, t]).reduce(Wf, { ...e, view: { ...e.view, objectFilter: a } });
}
function Wf(e, t) {
  const { _filterExpression: n, ...a } = e.view.objectFilter;
  return {
    ...e,
    view: {
      ...e.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...Object.keys(a).length ? [{ filter: a }] : [],
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
const Qa = [
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
], Hf = {
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
function as(e) {
  if (!e) return {};
  const t = JSON.parse(e);
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover."
    );
  return t;
}
function Do(e, t) {
  let n;
  if ($e(e) && t.has("performer") && (n = Number(t.get("performer")), !Number.isSafeInteger(n) || n <= 0))
    throw new Error("Invalid performer focus in review URL.");
  if (!Qa.some((c) => c !== "performer" && t.has(c))) {
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
    const c = t.get("sorts").split(",").map((u) => {
      const p = u.lastIndexOf(":");
      return { key: u.slice(0, p), direction: u.slice(p + 1) };
    });
    if (c.some((u) => !u.key || !["asc", "desc"].includes(u.direction)))
      throw new Error("Invalid review URL sort.");
    o.sorts = c, o.sort = c[0].key, o.direction = c[0].direction;
  }
  let i;
  if ($e(e) && (i = {
    ...Hf,
    ...as(t.get("performerScope"))
  }, !["all", "selected", "filter"].includes(i.targetMode) || !Jo.includes(i.condition) || !Array.isArray(i.performerIds) || !Array.isArray(i.conditionTagIds) || typeof i.includeSubtags != "boolean" || typeof i.hideConfirmedAbsent != "boolean" || [...i.performerIds, ...i.conditionTagIds].some(
    (c) => !Number.isSafeInteger(c) || c <= 0
  ) || !i.performerFilter || typeof i.performerFilter != "object" || Array.isArray(i.performerFilter)))
    throw new Error("Invalid performer scope in review URL.");
  const s = t.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: Gt(o, Ke(e)),
      objectFilter: as(t.get("filters")),
      searchMode: t.get("searchMode") ?? "text",
      startFrom: s,
      performerScope: i,
      ...n ? { performerFocus: n } : {}
    },
    startAtEnd: !t.has("page") && s === "end"
  };
}
const os = { dataQualityOpenedFromList: !0 };
function Bc() {
  const e = window.history.state;
  return !!e && typeof e == "object" && e.dataQualityOpenedFromList === !0;
}
function Vc(e, { openingFromList: t = !1 } = {}) {
  t ? window.history.pushState({ ...os }, "", e) : window.history.replaceState(Bc() ? { ...os } : null, "", e);
}
function ra(e, t) {
  const n = new URLSearchParams(window.location.search);
  Qa.forEach((a) => n.delete(a)), n.set("review", e);
  for (const a of ["q", "page", "perPage", "sort", "direction", "seed"])
    t.filter[a] !== void 0 && n.set(a, String(t.filter[a]));
  Array.isArray(t.filter.sorts) && n.set(
    "sorts",
    t.filter.sorts.map((a) => `${a.key}:${a.direction}`).join(",")
  ), n.set("filters", JSON.stringify(t.objectFilter)), n.set("searchMode", t.searchMode), n.set("startFrom", t.startFrom), t.performerScope && n.set("performerScope", JSON.stringify(t.performerScope)), t.performerFocus && n.set("performer", String(t.performerFocus)), Vc(`${window.location.pathname}?${n}${window.location.hash}`);
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
function is(e, t) {
  return t.startFrom !== (e.view.startFrom ?? "end") || !vr(
    JSON.parse(Jn(En(e, t))),
    JSON.parse(Jn(En(e, Nr(e))))
  );
}
function zc(e, t) {
  if (Ue(e) !== "video") return e;
  const { base: n, bins: a } = ba(e.view.objectFilter, t.view.objectFilter);
  return a.length ? { ...e, view: { ...e.view, objectFilter: n } } : e;
}
function Fa(e, t) {
  if (Ue(e) !== "video") return t;
  const { base: n, bins: a } = ba(t.objectFilter, e.view.objectFilter);
  return a.length ? { ...t, objectFilter: n } : t;
}
function ss(e, t) {
  return !t || !$e(e) ? e : {
    ...e,
    occurrence: {
      ...e.occurrence,
      targetMode: "selected",
      performerIds: [t]
    }
  };
}
function ho(e, t) {
  if (!t) return e;
  const n = /* @__PURE__ */ new Map();
  for (const a of e)
    n.set(a.media.id, [...n.get(a.media.id) ?? [], a]);
  return [...n.values()].reverse().flat();
}
const tn = (e) => e instanceof Error ? e.message : "Request failed.", po = 50, Qf = [], cs = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';
function Yf(e, t) {
  const n = e.files[0];
  return [
    e.studioName,
    e.date,
    t === "video" ? Al(n == null ? void 0 : n.width, n == null ? void 0 : n.height) : "",
    n != null && n.duration ? Ns(n.duration) : ""
  ].filter(Boolean).join(" · ");
}
function Xf({ media: e, kind: t }) {
  const [n, a] = A(!1);
  return /* @__PURE__ */ r("span", { className: "dq-queue-thumb", "aria-hidden": "true", children: n ? t === "audio" ? /* @__PURE__ */ r(As, {}) : /* @__PURE__ */ r(za, {}) : /* @__PURE__ */ r(
    "img",
    {
      src: qo(t, e, 160),
      alt: "",
      loading: "lazy",
      onError: () => a(!0)
    }
  ) });
}
function Zf({
  tags: e,
  preview: t,
  showPreview: n,
  trees: a,
  actionTagIds: o,
  label: i
}) {
  const s = di(t), c = n ? s : null, u = e == null ? void 0 : e.absent, p = ma(
    ge(() => [...o, ...u ?? []], [o, u])
  ), d = (G) => p[G] ?? { id: G, name: p[G] === void 0 ? "…" : "Unavailable tag" }, g = (G) => br(G.map(d)), m = c && e ? ri(c, e, a) : null, b = e ? Ld(e) : [], y = new Set(b.map((G) => G.id)), q = new Set(m == null ? void 0 : m.removed), v = new Set(m == null ? void 0 : m.markedAbsent), w = new Set(m == null ? void 0 : m.absenceCleared), T = /* @__PURE__ */ l("span", { className: "dq-chip-marker", children: [
    /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
    "absent"
  ] }), F = g((m == null ? void 0 : m.added) ?? []), U = g(((m == null ? void 0 : m.markedAbsent) ?? []).filter((G) => !y.has(G)));
  return /* @__PURE__ */ l("section", { className: "dq-panel-section", "aria-label": i, children: [
    /* @__PURE__ */ r("h3", { className: "dq-eyebrow", children: "Current tags" }),
    e ? /* @__PURE__ */ l(we, { children: [
      b.length || F.length || U.length ? /* @__PURE__ */ l("ul", { className: "dq-tags", "aria-label": "Current tags", children: [
        b.map(
          (G) => q.has(G.id) ? /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-removed", children: [
            /* @__PURE__ */ l("del", { children: [
              "− ",
              /* @__PURE__ */ r(Bt, { tag: G })
            ] }),
            v.has(G.id) && T
          ] }, G.id) : /* @__PURE__ */ r("li", { className: "dq-tag", children: /* @__PURE__ */ r(Bt, { tag: G }) }, G.id)
        ),
        F.map((G) => /* @__PURE__ */ r("li", { className: "dq-tag dq-tag-added", children: /* @__PURE__ */ l("ins", { children: [
          "+ ",
          /* @__PURE__ */ r(Bt, { tag: G })
        ] }) }, `added-${G.id}`)),
        U.map((G) => /* @__PURE__ */ l("li", { className: "dq-tag dq-tag-absent-new", children: [
          /* @__PURE__ */ r("ins", { children: /* @__PURE__ */ r(Bt, { tag: G }) }),
          T
        ] }, `absent-${G.id}`))
      ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "None" }),
      e.absent.length > 0 && /* @__PURE__ */ l(we, { children: [
        /* @__PURE__ */ r("h4", { className: "dq-subheading", children: "Confirmed absent" }),
        /* @__PURE__ */ r("ul", { className: "dq-tags", "aria-label": "Confirmed absent tags", children: g(e.absent).map((G) => /* @__PURE__ */ l(
          "li",
          {
            className: `dq-tag dq-tag-absent${w.has(G.id) ? " dq-tag-removed" : ""}`,
            children: [
              /* @__PURE__ */ r(Da, { "aria-hidden": "true" }),
              w.has(G.id) ? /* @__PURE__ */ l("del", { children: [
                "− ",
                /* @__PURE__ */ r(Bt, { tag: G })
              ] }) : /* @__PURE__ */ r(Bt, { tag: G })
            ]
          },
          G.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ r("p", { className: "dq-muted", children: "Loading…" })
  ] });
}
function eh({ entries: e }) {
  return /* @__PURE__ */ r("ul", { className: "dq-attention", "aria-label": "Needs attention", children: e.map((t) => /* @__PURE__ */ l("li", { className: "dq-attention-item", children: [
    t.tagIds !== null && /* @__PURE__ */ r("span", { className: "dq-attention-category", children: t.name }),
    oi(t).map((n) => /* @__PURE__ */ l("span", { className: "dq-badge dq-badge-warning dq-flag-badge", children: [
      /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
      n
    ] }, n))
  ] }, t.key)) });
}
function th({
  review: e,
  canWrite: t,
  canAssess: n = !0,
  onBusy: a,
  onSaveDefaults: o,
  editRequest: i = 0,
  onEditRequestHandled: s,
  pageControls: c,
  stayOnTap: u,
  onStayOnTapChange: p
}) {
  var Ir;
  const d = Ke(e), g = Cn(d), m = d === "audio" ? "Audio" : "Scene", b = (h) => {
    var k;
    return h.title || ((k = h.files[0]) == null ? void 0 : k.basename) || m;
  }, y = (h) => `${h.occurrence ? `${h.occurrence.performer.name} — ` : ""}${b(h.media)}`, q = $(null), v = $("");
  if (!q.current)
    try {
      q.current = Do(
        e,
        new URLSearchParams(window.location.search)
      );
    } catch (h) {
      v.current = tn(h), q.current = { query: Nr(e), startAtEnd: !1 };
    }
  const [w, T] = A(null), [F, U] = A(""), G = $(null), _ = $(null), ee = $(null), ne = $(null), [se, ae] = A(!!v.current), D = $(0), [K, S] = A(q.current.query), I = $(K);
  I.current = K;
  const [J, Q] = A(0), Z = $(q.current.startAtEnd), [oe, V] = A([]), [R, W] = A(null), E = $(null), [B, re] = A(null), [ce, P] = A(0), be = ge(() => {
    if (!R) return null;
    const h = oe.findIndex((k) => k.key === R.key);
    return h < 0 ? null : oe.slice(h + 1).find((k) => k.media.id !== R.media.id) ?? null;
  }, [R, oe]), [Te, fe] = A(0), [Oe, Ge] = A(!1), [Ce, An] = A(!1), ve = $(!1), Je = $(!0), Et = $(null);
  H(() => (Je.current = !0, () => {
    Je.current = !1;
  }), []);
  const [mn, xe] = A(v.current), [ot, Re] = A(""), [Ze, Vt] = A(null), [Fe, Tn] = A(!1), [ut, Mt] = A([]), ht = $([]), zt = $(null), qt = $(null), er = $(null);
  H(() => {
    var h, k;
    Fe && ((k = (h = er.current) == null ? void 0 : h.querySelector("input")) == null || k.focus());
  }, [Fe]);
  const [Tt, In] = A(!1), [Jt, Ft] = A(!1), gn = ga(), [qe, Ct] = A(!1), it = u ?? qe, Dn = p ?? Ct;
  H(() => {
    if (Oe || Tt || !qt.current) return;
    const h = requestAnimationFrame(() => {
      if (document.querySelector(cs)) return;
      const k = qt.current;
      qt.current = null;
      const O = document.activeElement;
      O && O !== document.body || k != null && k.isConnected && !k.disabled && k.focus();
    });
    return () => cancelAnimationFrame(h);
  }, [Oe, Tt, J]);
  const [Wt, Pe] = A([]), [It, le] = A({}), x = $(null), Ae = $(0), [pt, _n] = A({});
  H(() => {
    let h = !0;
    return Promise.all(
      mi(K.objectFilter).map(
        async (k) => [
          String(k),
          (await pe(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      h && _n(Object.fromEntries(k));
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [K.objectFilter]);
  const me = ge(
    () => gi(K.objectFilter, pt),
    [pt, K.objectFilter]
  ), Rt = $(0), tt = $(e);
  tt.current = e;
  const Le = w ?? e, et = ge(
    () => En(Le, K),
    [Le, K]
  ), Ht = ge(
    () => ss(et, K.performerFocus),
    [et, K.performerFocus]
  ), st = $(Ht);
  st.current = Ht;
  const mt = $(et);
  mt.current = et;
  const [xt, Qt] = A("items"), [ct, jn] = A(null), Yt = $(null), Un = $("");
  function Pt(h) {
    const k = typeof h == "function" ? h(Yt.current) : h;
    Yt.current = k, jn(k);
  }
  const [bn, nn] = A(!1), [C, L] = A(null), Y = $(null), ye = $e(et) ? La(et) : "", [de, Me] = A(0), [Ie, Lt] = A(null);
  H(() => () => {
    var h;
    return (h = Y.current) == null ? void 0 : h.controller.abort();
  }, []), H(() => {
    const h = Y.current;
    !h || h.signature === ye || (h.controller.abort(), Y.current = null, nn(!1));
  }, [ye]), H(() => {
    var O;
    const h = Yt.current;
    if (xt !== "performers" || !ye || ((O = Y.current) == null ? void 0 : O.signature) === ye || Un.current === ye || (h == null ? void 0 : h.signature) === ye && h.complete)
      return;
    const k = (h == null ? void 0 : h.signature) === ye ? h : null;
    Er(h, (k == null ? void 0 : k.limit) ?? po);
  }, [xt, ye, ct, C, bn]);
  const Ne = K.performerFocus;
  H(() => {
    if (!Ne) {
      Lt(null);
      return;
    }
    let h = !0;
    return pe(`/api/performers/${Ne}`).then((k) => {
      const O = Gc(Ne, k.tags);
      h && Lt({ id: Ne, name: k.name, tags: O });
    }).catch(() => {
    }), () => {
      h = !1;
    };
  }, [Ne]);
  const ke = JSON.stringify(
    $e(et) ? $s(et.occurrence) : []
  ), Se = ge(() => JSON.parse(ke), [ke]), Dt = ge(() => Ud(Se), [Se]), Rn = Qs(Dt), Kr = ma(Dt), Gr = (h) => {
    var k;
    return ((k = Kr[h]) == null ? void 0 : k.name) ?? (Kr[h] === null ? "Unavailable tag" : "…");
  }, Br = (h) => ({
    name: Gr(h),
    tagIds: Rn.get(h) ?? [h],
    resolved: Rn.has(h)
  }), St = _c(
    $e(et) ? et : null,
    Ne ?? null,
    de
  ), Xt = is(e, K), tr = is(e, Fa(e, K)), gt = Ce || Oe || Fe, yn = Number(K.filter.page);
  function _e(h, k = !1) {
    ve.current || (v.current = "", Z.current = k, I.current = h, S(h), fe(0), Ge(!0), k || ra(e.id, h), Q((O) => O + 1));
  }
  function nt() {
    if (ve.current = !1, An(!1), Je.current && Et.current) {
      const h = Et.current;
      Et.current = null, _e(h.query, h.startAtEnd);
    }
  }
  H(() => {
    const h = () => {
      if (new URLSearchParams(window.location.search).get("review") === e.id)
        try {
          const k = Do(
            tt.current,
            new URLSearchParams(window.location.search)
          );
          ve.current ? Et.current = k : _e(k.query, k.startAtEnd);
        } catch (k) {
          xe(tn(k));
        }
    };
    return window.addEventListener("popstate", h), () => window.removeEventListener("popstate", h);
  }, [e.id]), H(() => (a(Ce || Oe || Fe || !!w), () => a(!1)), [Ce, Oe, Fe, !!w, a]);
  async function bt(h, k, O) {
    if ($e(h)) {
      const he = await Oc(
        h,
        x.current,
        k,
        O
      );
      return {
        items: he.items.map((ue) => ({
          key: ue.key,
          media: ue.media,
          occurrence: ue
        })),
        totalCount: he.totalCount
      };
    }
    const te = await na(
      h,
      { ...h.view.filter, page: k },
      O
    );
    return {
      items: te.items.map((he) => ({ key: String(he.id), media: he })),
      totalCount: te.totalCount
    };
  }
  function yt(h, k, O, te = !1, he = !1) {
    if (!Je.current || Et.current) return;
    ae(!0), V(
      he ? h.items : ho(h.items, I.current.startFrom === "end")
    ), fe(h.totalCount), _t(O, te);
    const ue = {
      ...I.current,
      filter: { ...I.current.filter, page: k }
    };
    I.current = ue, S(ue), ra(e.id, ue);
  }
  function _t(h, k = !1) {
    (h == null ? void 0 : h.key) !== (R == null ? void 0 : R.key) && (E.current = null), (h == null ? void 0 : h.media.id) !== (R == null ? void 0 : R.media.id) && re(k && h ? h.media.id : null), W(h);
  }
  H(() => {
    if (v.current) return;
    const h = new AbortController();
    ne.current = h;
    const k = ++Rt.current;
    return Ge(!0), xe(""), Re(""), E.current = null, re(null), W(null), V([]), Tn(!1), (async () => {
      const O = ss(
        En(tt.current, I.current),
        I.current.performerFocus
      );
      x.current = $e(O) ? await bi(O, h.signal) : null;
      let te = Number(O.view.filter.page), he = await bt(O, te, h.signal);
      const ue = Math.max(
        1,
        Math.ceil(he.totalCount / Number(O.view.filter.perPage))
      );
      (Z.current || te > ue) && (te = ue, he = await bt(O, te, h.signal)), Z.current = !1;
      const Ye = O.view.startFrom === "end" ? -1 : 1;
      for (; $e(O) && !he.items.length && te + Ye >= 1 && te + Ye <= ue && !h.signal.aborted; )
        te += Ye, he = await bt(O, te, h.signal);
      if (k !== Rt.current || h.signal.aborted) return;
      const Ot = ho(he.items, O.view.startFrom === "end");
      yt(he, te, Ot[0] ?? null);
    })().catch((O) => {
      !h.signal.aborted && k === Rt.current && xe(tn(O));
    }).finally(() => {
      !h.signal.aborted && k === Rt.current && (ae(!0), Ge(!1));
    }), () => {
      h.abort(), Rt.current++;
    };
  }, [J, e.id]), H(() => {
    if (Vt(null), !R) return;
    let h = !0;
    return hn(d, R).then((k) => {
      h && (Vt(k), Pe(
        $e(e) ? k.ids.filter((O) => e.occurrence.tagIds.includes(O)) : []
      ));
    }).catch((k) => {
      h && xe(`Could not load current tags. ${tn(k)}`);
    }), () => {
      h = !1;
    };
  }, [R]), H(() => {
    if (!$e(e) || e.actions.length)
      return;
    let h = !0;
    return Promise.all(
      e.occurrence.tagIds.map(
        async (k) => [
          k,
          (await pe(`/api/tags/${k}`)).name
        ]
      )
    ).then((k) => {
      h && le(Object.fromEntries(k));
    }).catch((k) => {
      h && xe(tn(k));
    }), () => {
      h = !1;
    };
  }, [e]);
  async function jt(h = !1, k = !1, O = !1) {
    var Sn;
    if (!R) return;
    const te = oe.findIndex((We) => We.key === R.key), he = K.startFrom === "end" ? -1 : 1, ue = ((Sn = E.current) == null ? void 0 : Sn.key) === R.key ? E.current : { key: R.key, page: yn, before: oe.slice(0, te + 1).map((We) => We.key), after: oe.slice(te + 1).map((We) => We.key) }, Ye = new Set(ue.after), Ot = new Set(ue.before), Ve = oe.find((We) => {
      var dn;
      return Ye.has(We.key) || (he === 1 || yn < ue.page) && ((dn = E.current) == null ? void 0 : dn.key) === R.key && !Ot.has(We.key);
    });
    if (!h && Ve) {
      _t(Ve, O);
      return;
    }
    const wt = h ? Ot : new Set(oe.map((We) => We.key)), lt = 1100 - (Date.now() - Ae.current);
    lt > 0 && await new Promise((We) => window.setTimeout(We, lt));
    let ze = he === -1 && !h ? Math.max(1, yn - 1) : yn;
    for (; Je.current && !Et.current; ) {
      let We = await bt(Ht, ze);
      const dn = Math.max(
        1,
        Math.ceil(We.totalCount / Number(K.filter.perPage))
      );
      ze > dn && (ze = dn, We = await bt(Ht, ze));
      const Ut = ho(We.items, he === -1), Yr = new Map(Ut.map((At) => [At.key, At])), Sa = h ? ue.after.flatMap((At) => {
        const $r = Yr.get(At);
        return $r ? [$r] : [];
      }) : [], ka = new Set(Sa.map((At) => At.key)), fr = h ? {
        ...We,
        items: [
          ...Sa,
          ...Ut.filter(
            (At) => At.key !== R.key && !ka.has(At.key)
          )
        ]
      } : We;
      if (k) {
        E.current = ue, yt(fr, ze, R, !1, h);
        return;
      }
      const Rr = he === -1 && yn === 1 && !h ? void 0 : fr.items.find(
        (At) => !wt.has(At.key) && // A reverse-page refill comes from scenes already traversed.
        // Keep remaining partners, then continue on the preceding page.
        (!(h && he === -1 && ze === ue.page) || Ye.has(At.key))
      );
      if (Rr || (he === -1 ? ze <= 1 : ze >= dn)) {
        yt(
          fr,
          ze,
          Rr ?? null,
          O,
          h
        ), Rr || Re(
          We.totalCount ? `Reached the end in this direction. Matching items remain available from the ${g.queue} pages.` : `No matching ${g.many}.`
        );
        return;
      }
      ze += he;
    }
  }
  async function rn(h, k = !1, O = !1, te = !1) {
    if (w || !R || ve.current || Oe || Fe && !O)
      return;
    const he = O || te || !!(h != null && h.steps.length);
    if (he && (!t || !Ze) || h && Qn(h) && !n) return;
    const ue = !k && !O && !te && he && h !== void 0 && Ze !== null && ji(e) && Co(Eo(e.actions, _d(h, Ze, cn))).length > 0;
    ve.current = !0, An(!0), xe(""), Re("");
    const Ye = oe.findIndex((lt) => lt.key === R.key), Ot = he && !k && !ue && Ye >= 0 ? oe[Ye + 1] ?? null : null;
    Ot && (V(
      (lt) => lt.filter((ze) => ze.key !== R.key)
    ), _t(Ot, !0));
    let Ve = !1, wt = [];
    try {
      if (he) {
        const lt = await hn(d, R);
        if (h)
          await df(Ht, R, h);
        else {
          const Sn = te && $e(e) ? e.occurrence.tagIds.filter((Ut) => lt.ids.includes(Ut)) : ht.current, dn = _r(Sn, te ? Wt : ut);
          await vi(Ht, R, dn);
        }
        Ae.current = Date.now();
        const ze = await hn(d, R);
        Ot || Vt(ze), Ve = !0, Tn(!1), ue && (wt = Co(Eo(e.actions, ze))), Re(
          wt.length ? `Tags saved. Staying until answered: ${wt.map((Sn) => Sn.name).join(", ")}.` : "Tags saved."
        ), R.occurrence && (wa(R.occurrence.performer.id), Me((Sn) => Sn + 1));
      }
      if (!Je.current || Et.current) return;
      he ? wt.length || await jt(!0, k, !k) : k || await jt(), k && O && requestAnimationFrame(() => {
        var lt;
        return (lt = zt.current) == null ? void 0 : lt.focus();
      });
    } catch (lt) {
      if (xe(
        Ve ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${tn(lt)}` : he ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${tn(lt)}` : `Could not advance. ${tn(lt)}`
      ), he && !Ve) {
        Ot && (V(oe), re(null), P((ze) => ze + 1), W(R)), Ae.current = Date.now();
        try {
          Vt(await hn(d, R));
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
  const nr = !Fe && !w && !Tt && !Jt && (R != null || Oe || Ce);
  ii({
    surface: "local",
    enabled: nr,
    actions: e.actions,
    onAction: (h, k) => {
      const O = e.actions[h];
      O && rn(O, k);
    },
    onFind: () => Ft(!0)
  });
  const an = (h) => Ce || Oe || !Ze || !!w || !t && h.steps.length > 0 || !n && Qn(h);
  function Zt() {
    !o || w || ve.current || Fe || (ee.current = document.activeElement, _.current = {
      error: mn,
      url: window.location.pathname + window.location.search + window.location.hash,
      query: structuredClone(I.current),
      items: oe,
      current: R,
      total: Te,
      targets: x.current,
      stayedCursor: E.current
    }, T(structuredClone(e)), U(""), Re(""), xe(""));
  }
  H(() => {
    if (!i) {
      D.current = 0;
      return;
    }
    i !== D.current && se && !Oe && (D.current = i, Zt(), s == null || s());
  }, [i, Oe, se]);
  function Sr() {
    T(null), U(""), requestAnimationFrame(() => {
      const h = ee.current;
      h != null && h.isConnected && h !== document.body && h.focus();
    });
  }
  function kr() {
    var k;
    const h = _.current;
    !h || Ce || ((k = ne.current) == null || k.abort(), Rt.current++, I.current = h.query, S(h.query), V(h.items), W(h.current), fe(h.total), x.current = h.targets, E.current = h.stayedCursor, Ge(!1), xe(h.error), Re(""), window.history.replaceState(window.history.state, "", h.url), Sr());
  }
  async function ya() {
    if (!w || !o || ve.current) return;
    const h = En(
      { ...w, name: w.name.trim() },
      Fa(tt.current, I.current)
    ), k = sa(h);
    if (k) {
      U(k);
      return;
    }
    ve.current = !0, An(!0), U("");
    try {
      if (await o(h) === !1) throw new Error("Could not save review.");
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
    const h = Fa(tt.current, I.current), k = En(tt.current, {
      ...h,
      filter: { ...h.filter, page: 1 }
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
  const ft = K.performerScope, wn = (h) => {
    const { performerFocus: k, ...O } = I.current, te = k && !("targetMode" in h || "performerIds" in h || "performerFilter" in h);
    _e({
      ...O,
      ...te ? { performerFocus: k } : {},
      filter: { ...O.filter, page: 1 },
      performerScope: { ...ft, ...h }
    });
  };
  async function Er(h, k) {
    var he;
    const O = mt.current;
    if (!$e(O)) return;
    (he = Y.current) == null || he.controller.abort();
    const te = {
      signature: La(O),
      controller: new AbortController()
    };
    Y.current = te, Un.current = "", nn(!0), L(null);
    try {
      const ue = await _f(O, h, k, te.controller.signal, {
        onProgress: (Ye) => {
          Y.current === te && Pt(Ye);
        }
      });
      Y.current === te && Pt(ue);
    } catch (ue) {
      Y.current === te && !te.controller.signal.aborted && (Un.current = te.signature, L({ signature: te.signature, message: tn(ue) }));
    } finally {
      Y.current === te && (Y.current = null, nn(!1));
    }
  }
  function vn() {
    var h;
    (h = Y.current) == null || h.controller.abort(), Y.current = null, nn(!1), Pt((k) => k && { ...k, partial: !0, complete: !1 });
  }
  async function wa(h) {
    var he;
    const k = mt.current;
    if (!$e(k)) return;
    if (Y.current) {
      vn();
      return;
    }
    const O = La(k);
    if (((he = Yt.current) == null ? void 0 : he.signature) !== O || Yt.current.partial) return;
    const te = 1100 - (Date.now() - Ae.current);
    te > 0 && await new Promise((ue) => window.setTimeout(ue, te));
    try {
      const ue = await Uc(k, h);
      if (Y.current) {
        vn();
        return;
      }
      Pt(
        (Ye) => (Ye == null ? void 0 : Ye.signature) === O ? jf(Ye, h, ue) : Ye
      );
    } catch {
      Pt(
        (ue) => (ue == null ? void 0 : ue.signature) === O ? { ...ue, partial: !0, complete: !1 } : ue
      );
    }
  }
  const rr = K.performerFocus ? ct == null ? void 0 : ct.candidates.find((h) => h.id === K.performerFocus) : void 0, rt = Ie && Ie.id === K.performerFocus ? { ...Ie, flags: pr(Se, Ie.tags) } : rr ? { ...rr, flags: pr(Se, rr.tags) } : null, on = (h) => {
    if ((Ie == null ? void 0 : Ie.id) === h)
      return pr(Se, Ie.tags);
    const k = ct == null ? void 0 : ct.candidates.find((O) => O.id === h);
    return k ? pr(Se, k.tags) : void 0;
  }, sn = ((Ir = R == null ? void 0 : R.occurrence) == null ? void 0 : Ir.performer.id) ?? null, Nn = sn === null ? void 0 : on(sn), je = Kf(
    Se.length > 0 && sn !== null && sn !== K.performerFocus && Nn === void 0 ? sn : null
  ), Vr = Nn ?? (je ? pr(Se, je) : []), cn = Hs(Le.actions), Cr = St.summary && K.performerFocus ? ai(Ni(St.summary, Le.actions, cn)) : [], ar = Ui(Se, (rt == null ? void 0 : rt.flags) ?? [], Br), or = ec(
    Ui(Se, Vr, Br),
    sn !== null && sn === K.performerFocus ? Cr : []
  ), zr = JSON.stringify(or), Ar = ge(() => or, [zr]), ir = JSON.stringify(ar), Jr = ge(() => ar, [ir]), $n = (h) => Wd(Se, h, Gr);
  function sr(h) {
    if (ve.current) return;
    const k = {
      ...I.current,
      performerFocus: h,
      filter: { ...I.current.filter, page: 1 }
    };
    _e(k, k.startFrom === "end"), Qt("items");
  }
  function Ya() {
    const { performerFocus: h, ...k } = I.current;
    _e(
      { ...k, filter: { ...k.filter, page: 1 } },
      k.startFrom === "end"
    );
  }
  const cr = $(null);
  cr.current ?? (cr.current = lc());
  const va = cr.current, Xa = ge(
    () => Le.actions.flatMap((h) => h.steps.flatMap((k) => k.tagIds)),
    [Le.actions]
  ), Na = $(null);
  H(() => {
    const h = Na.current, k = h == null ? void 0 : h.querySelector('[aria-current="true"]');
    if (!h || !k) return;
    const O = h.getBoundingClientRect(), te = k.getBoundingClientRect();
    te.top < O.top ? h.scrollTop -= O.top - te.top : te.bottom > O.bottom && (h.scrollTop += te.bottom - O.bottom);
  }, [R == null ? void 0 : R.key, xt]);
  const Tr = $(null), Wr = $(null);
  H(() => {
    var O, te;
    const h = Wr.current;
    if (!h) return;
    Wr.current = null;
    const k = [...((O = Tr.current) == null ? void 0 : O.querySelectorAll(".dq-partner")) ?? []];
    (te = k.find((he) => he.dataset.partnerKey === h) ?? k[0]) == null || te.focus();
  }, [R == null ? void 0 : R.key]);
  const $t = Ce || Oe || Fe || !!w, qn = ge(
    () => w ? En(w, Fa(e, K)) : null,
    [w, e, K]
  ), lr = ge(
    () => qn != null && Lr(yr(qn)) !== Lr(yr(e)),
    [qn, e]
  );
  function Kn() {
    R ? hn(d, R).then(Vt).catch((h) => xe(tn(h))) : _e(I.current);
  }
  const Gn = mn ? /* @__PURE__ */ l("p", { role: "alert", children: [
    mn,
    " ",
    /* @__PURE__ */ r("button", { type: "button", disabled: Ce, onClick: Kn, children: R ? "Reload tags" : "Retry queue" })
  ] }) : null, ln = Ce || Oe || R != null && !Ze, dr = Math.max(1, Number(K.filter.perPage) || 1), ur = $(1);
  Oe || (ur.current = Math.max(1, Math.ceil(Te / dr)));
  const Hr = ur.current, qa = ft && R ? oe.filter(
    (h) => h.media.id === R.media.id && h.key !== R.key
  ) : [], Za = (h) => {
    var k;
    return h.title || ((k = h.files[0]) == null ? void 0 : k.basename) || `${d === "audio" ? "Audio" : "Video"} ${h.id}`;
  }, Qr = R ? Yf(R.media, d) : "";
  return /* @__PURE__ */ l(
    "section",
    {
      className: `dq-review-workspace${d === "audio" ? " dq-audio" : ""}`,
      "aria-label": ft ? d === "audio" ? "Audio performer occurrence review" : "Performer occurrence review" : d === "audio" ? "Audio review" : "Video review",
      onClickCapture: (h) => {
        var te;
        const k = h.target instanceof Element ? h.target.closest("button") : null, O = (k == null ? void 0 : k.getAttribute("aria-label")) ?? ((te = k == null ? void 0 : k.textContent) == null ? void 0 : te.trim()) ?? "";
        k && !k.closest(cs) && /^(Filters|Edit filter:|Edit criteria)/.test(O) && (qt.current = k);
      },
      children: [
        /* @__PURE__ */ r(
          Cc,
          {
            name: e.name,
            description: e.description,
            entityType: Ue(e),
            onBack: c == null ? void 0 : c.onBack,
            backDisabled: $t || !!(c != null && c.busy),
            onEdit: w ? () => {
              var h;
              return (h = G.current) == null ? void 0 : h.focus();
            } : Zt,
            editDisabled: !w && ($t || !o || !!(c != null && c.busy)),
            editing: !!w,
            toolbar: (
              // Not disabled while the queue reloads: a search being typed keeps its focus (a
              // disabled field would drop it to the page, where the next letters are action keys),
              // and a newer query supersedes the load in flight.
              /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Ce || Fe, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: d === "audio" ? "Audio filters" : "Scene filters" }),
                /* @__PURE__ */ r(
                  aa,
                  {
                    filter: K.filter,
                    objectFilter: me,
                    criteriaDefinitions: d === "audio" ? ys : Ko,
                    customFieldEntityType: d,
                    totalCount: Te,
                    sortOptions: d === "audio" ? kl : ws,
                    showSearch: !0,
                    showSort: !0,
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(
                      Ac,
                      {
                        page: Math.min(Math.max(1, yn || 1), Hr),
                        pages: Hr,
                        onPage: (h) => _e({
                          ...I.current,
                          filter: Gt(
                            { ...I.current.filter, page: h },
                            d
                          )
                        })
                      }
                    ),
                    onFilterChange: (h) => {
                      (h.sort !== I.current.filter.sort || h.direction !== I.current.filter.direction) && (h = { ...h, sorts: void 0 }), _e({
                        ...I.current,
                        filter: Gt(h, d)
                      });
                    },
                    onObjectFilterChange: (h) => {
                      _e({
                        ...I.current,
                        objectFilter: Ic(
                          h,
                          pt,
                          I.current.objectFilter
                        ),
                        filter: { ...I.current.filter, page: 1 }
                      });
                    }
                  }
                )
              ] })
            ),
            trailing: /* @__PURE__ */ l(we, { children: [
              ft && /* @__PURE__ */ r(
                Pf,
                {
                  scope: ft,
                  disabled: Ce || Fe,
                  editing: !!w,
                  onChange: wn,
                  onEditCriteria: () => In(!0)
                }
              ),
              (c == null ? void 0 : c.onGrid) && /* @__PURE__ */ r(
                Tc,
                {
                  mode: "single",
                  disabled: $t || !!c.busy,
                  onChange: () => {
                    var h;
                    return (h = c.onGrid) == null ? void 0 : h.call(c);
                  }
                }
              )
            ] }),
            trailingEnd: /* @__PURE__ */ l(we, { children: [
              $e(Ht) && t && /* @__PURE__ */ r(
                Af,
                {
                  review: Ht,
                  disabled: gt || !!w,
                  performerAttention: K.performerFocus ? Jr : void 0,
                  trees: cn,
                  onOpen: () => {
                    ve.current = !0, An(!0);
                  },
                  onWrite: () => {
                    Ae.current = Date.now();
                  },
                  onClose: (h) => {
                    if (h) {
                      Ae.current = Date.now();
                      const k = I.current.performerFocus;
                      k ? wa(k) : vn(), Me((O) => O + 1), new Promise((O) => window.setTimeout(O, 1100)).then(() => {
                        nt(), Je.current && (v.current || Ge(!0), Q((O) => O + 1));
                      });
                    } else nt();
                  }
                }
              ),
              (c == null ? void 0 : c.moreItems) && /* @__PURE__ */ r(
                fi,
                {
                  disabled: $t,
                  items: c.moreItems({
                    onSelect: Zt,
                    disabled: !o
                  })
                }
              )
            ] }),
            chipsStart: K.performerFocus ? /* @__PURE__ */ l("div", { className: "dq-focus-chip", role: "group", "aria-label": "Performer focus", children: [
              /* @__PURE__ */ r(
                Pr,
                {
                  performer: {
                    id: K.performerFocus,
                    name: (rt == null ? void 0 : rt.name) ?? ""
                  }
                }
              ),
              /* @__PURE__ */ l("span", { children: [
                "Only",
                " ",
                /* @__PURE__ */ r("strong", { children: (rt == null ? void 0 : rt.name) ?? `performer ${K.performerFocus}` })
              ] }),
              rt != null && rt.flags.length ? /* @__PURE__ */ l("span", { className: "dq-focus-flag", title: $n(rt.flags), children: [
                /* @__PURE__ */ r(xn, { "aria-hidden": "true" }),
                /* @__PURE__ */ r("span", { className: "dq-sr-only", children: $n(rt.flags) })
              ] }) : null,
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-chip-button",
                  disabled: gt,
                  onClick: Ya,
                  children: "Show all performers"
                }
              )
            ] }) : void 0,
            queueDiffers: Xt,
            queueChange: !w && Xt ? {
              // Tag bins alone leave nothing to save: a review never keeps them.
              onSave: tr ? () => void De() : void 0,
              saveDisabled: gt || !o,
              onReset: () => {
                const h = Nr(e);
                _e(h, h.startFrom === "end");
              },
              resetDisabled: gt
            } : void 0,
            chipsEnd: w ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
          }
        ),
        c == null ? void 0 : c.notices,
        /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
          w && qn && /* @__PURE__ */ r(
            Ec,
            {
              drawerRef: G,
              draft: qn,
              onChange: (h) => T(h),
              direction: K.startFrom,
              onDirectionChange: (h) => _e({ ...I.current, startFrom: h }),
              tagGroups: Qf,
              trees: cn,
              saving: Ce,
              saveDisabled: Oe,
              error: F,
              dirty: lr,
              criteriaChanged: tr,
              notices: Gn && /* @__PURE__ */ r("div", { className: "dq-review-feedback", children: Gn }),
              onSave: () => void ya(),
              onCancel: kr
            }
          ),
          /* @__PURE__ */ r("div", { className: "dq-review-main", children: /* @__PURE__ */ l("div", { className: "dq-review-body", children: [
            /* @__PURE__ */ l("div", { className: "dq-review-stage", children: [
              R ? /* @__PURE__ */ l(we, { children: [
                /* @__PURE__ */ l("div", { className: "dq-stage-title", children: [
                  /* @__PURE__ */ r("h2", { className: "dq-review-video-title", children: /* @__PURE__ */ l(
                    "a",
                    {
                      href: `/${d}/${R.media.id}`,
                      target: "_blank",
                      rel: "noreferrer",
                      title: `Open this ${g.one} in a new tab`,
                      children: [
                        /* @__PURE__ */ r("span", { children: Za(R.media) }),
                        /* @__PURE__ */ r(Is, { "aria-hidden": "true" })
                      ]
                    }
                  ) }),
                  Qr && /* @__PURE__ */ r("span", { className: "dq-stage-meta", children: Qr })
                ] }),
                /* @__PURE__ */ l("div", { className: "dq-review-media", children: [
                  /* @__PURE__ */ r("div", { className: "dq-player-frame", children: [R, be].filter(Boolean).map((h) => {
                    var te, he, ue, Ye, Ot;
                    const k = h, O = k.key === R.key;
                    return /* @__PURE__ */ r(
                      "div",
                      {
                        className: O ? "dq-review-video-current" : "dq-review-video-preload",
                        "aria-hidden": O ? void 0 : !0,
                        inert: O ? void 0 : !0,
                        children: d === "audio" ? /* @__PURE__ */ r(
                          El,
                          {
                            streamUrl: So("audio", k.media.id),
                            format: ((te = k.media.files[0]) == null ? void 0 : te.format) ?? "",
                            title: b(k.media),
                            coverUrl: O ? qo("audio", k.media) : void 0,
                            duration: ((he = k.media.files[0]) == null ? void 0 : he.duration) ?? 0,
                            autostart: O && B === k.media.id
                          }
                        ) : /* @__PURE__ */ r(
                          vs,
                          {
                            videoId: k.media.id,
                            streamUrl: So("video", k.media.id),
                            posterUrl: O ? qo("video", k.media) : void 0,
                            duration: ((ue = k.media.files[0]) == null ? void 0 : ue.duration) ?? 0,
                            format: (Ye = k.media.files[0]) == null ? void 0 : Ye.format,
                            audioCodec: (Ot = k.media.files[0]) == null ? void 0 : Ot.audioCodec,
                            extensionSurface: O ? "quick-view" : void 0,
                            autostart: O && B === k.media.id,
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
                      `${k.media.id}:${ce}`
                    );
                  }) }),
                  d === "audio" && /* @__PURE__ */ r(
                    If,
                    {
                      details: R.media.details,
                      label: g.one
                    },
                    R.media.id
                  )
                ] })
              ] }) : /* @__PURE__ */ r("p", { role: "status", className: "dq-stage-status", children: Oe ? "Loading review…" : Te ? "Reached the end in this direction." : `No matching ${g.many}.` }),
              Le.actions.length > 0 ? /* @__PURE__ */ r(
                su,
                {
                  actions: Le.actions,
                  mediaKind: d,
                  isDisabled: (h) => Fe || an(h),
                  busy: ln,
                  tags: Ze,
                  trees: cn,
                  preview: va,
                  onApply: (h, k) => void rn(h, k),
                  onFind: () => Ft(!0),
                  findDisabled: Fe || !!w,
                  paused: !!w,
                  waitForGroups: ji(Le),
                  attention: Ar,
                  stayOnTap: it,
                  onStayOnTapChange: Dn
                }
              ) : $e(e) && e.occurrence.tagIds.length > 0 && /* @__PURE__ */ l(
                "fieldset",
                {
                  className: "dq-tag-choices",
                  disabled: !t || Ce || Fe || !Ze || !!w || !R,
                  children: [
                    /* @__PURE__ */ r("legend", { children: "Tag choices" }),
                    e.occurrence.tagIds.map((h) => /* @__PURE__ */ l("label", { children: [
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: e.occurrence.multiple ? "checkbox" : "radio",
                          name: "legacy-choice",
                          checked: Wt.includes(h),
                          onChange: (k) => Pe(
                            e.occurrence.multiple ? k.target.checked ? [...Wt, h] : Wt.filter((O) => O !== h) : [h]
                          )
                        }
                      ),
                      It[h] ?? "Loading tag…"
                    ] }, h)),
                    /* @__PURE__ */ l("div", { className: "dq-row", children: [
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => Pe([]),
                          children: "No applicable tags"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          className: "dq-button",
                          onClick: () => void rn(void 0, !0, !1, !0),
                          children: "Save choices"
                        }
                      ),
                      /* @__PURE__ */ r(
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
                R && /* @__PURE__ */ l(we, { children: [
                  /* @__PURE__ */ l("section", { className: "dq-panel-section dq-reviewing", children: [
                    /* @__PURE__ */ l("h2", { className: "dq-eyebrow", children: [
                      "Reviewing",
                      " ",
                      /* @__PURE__ */ r("span", { className: "dq-sr-only", children: R.occurrence ? R.occurrence.performer.name : `this ${g.one}` })
                    ] }),
                    /* @__PURE__ */ l("div", { className: "dq-reviewing-who", children: [
                      R.occurrence && /* @__PURE__ */ r(Pr, { performer: R.occurrence.performer }),
                      /* @__PURE__ */ l("div", { children: [
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-name", "aria-hidden": "true", children: R.occurrence ? R.occurrence.performer.name : `This ${g.one}` }),
                        /* @__PURE__ */ r("p", { className: "dq-reviewing-note", children: ft ? `Tags apply to this performer in this ${g.queue}` : `Tags apply to the whole ${g.one}` })
                      ] })
                    ] }),
                    Ar.length > 0 && /* @__PURE__ */ r(eh, { entries: Ar })
                  ] }),
                  qa.length > 0 && /* @__PURE__ */ l(
                    "section",
                    {
                      className: "dq-panel-section",
                      "aria-label": `Also in this ${g.queue}`,
                      children: [
                        /* @__PURE__ */ l("h3", { className: "dq-eyebrow", children: [
                          "Also in this ",
                          g.queue
                        ] }),
                        /* @__PURE__ */ r("div", { className: "dq-partners", children: qa.map((h) => {
                          var k, O, te;
                          return /* @__PURE__ */ l(
                            "button",
                            {
                              type: "button",
                              className: "dq-partner",
                              title: (k = h.occurrence) == null ? void 0 : k.performer.name,
                              "aria-label": (O = h.occurrence) == null ? void 0 : O.performer.name,
                              "data-partner-key": h.key,
                              disabled: gt,
                              onClick: () => {
                                Wr.current = R.key, _t(h), xe("");
                              },
                              children: [
                                h.occurrence && /* @__PURE__ */ r(Pr, { performer: h.occurrence.performer }),
                                /* @__PURE__ */ r("span", { children: (te = h.occurrence) == null ? void 0 : te.performer.name })
                              ]
                            },
                            h.key
                          );
                        }) })
                      ]
                    }
                  ),
                  /* @__PURE__ */ r(
                    Zf,
                    {
                      tags: Ze,
                      preview: va,
                      showPreview: !Fe,
                      trees: cn,
                      actionTagIds: Xa,
                      label: `Current ${ft ? "occurrence" : g.one} tags`
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
                          ft ? "occurrence" : g.one,
                          " tags"
                        ] }),
                        /* @__PURE__ */ r(
                          Yn,
                          {
                            entityType: "tag",
                            values: ut,
                            onChange: Mt,
                            placeholder: "Choose tags for this item...",
                            allowCreate: !1
                          }
                        ),
                        /* @__PURE__ */ l("div", { className: "dq-row", children: [
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button primary",
                              disabled: !Ze,
                              onClick: () => void rn(void 0, !0, !0),
                              children: "Save"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              disabled: !Ze,
                              onClick: () => void rn(void 0, !1, !0),
                              children: "Save & next"
                            }
                          ),
                          /* @__PURE__ */ r(
                            "button",
                            {
                              type: "button",
                              className: "dq-button",
                              onClick: () => {
                                Tn(!1), requestAnimationFrame(() => {
                                  var h;
                                  return (h = zt.current) == null ? void 0 : h.focus();
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
                $e(et) && K.performerFocus && /* @__PURE__ */ r(
                  Fo,
                  {
                    ...St,
                    mediaKind: d,
                    actions: Le.actions,
                    trees: cn,
                    flags: Jr
                  }
                )
              ] }),
              /* @__PURE__ */ l("div", { className: "dq-panel-footer", children: [
                /* @__PURE__ */ l("div", { className: "dq-review-feedback", "aria-live": "polite", children: [
                  !w && Gn,
                  ot && /* @__PURE__ */ r("p", { role: "status", children: ot })
                ] }),
                !t && /* @__PURE__ */ r("p", { className: "dq-muted", children: "Write permission is required to change tags." }),
                R && /* @__PURE__ */ l("div", { className: "dq-panel-actions", "aria-busy": ln || void 0, children: [
                  /* @__PURE__ */ l(
                    "button",
                    {
                      type: "button",
                      ref: zt,
                      className: "dq-button",
                      disabled: gt || !!w || !t || !Ze,
                      onClick: () => {
                        ht.current = [...Ze.ids], Mt([...Ze.ids]), Tn(!0);
                      },
                      children: [
                        /* @__PURE__ */ r(Cs, { "aria-hidden": "true" }),
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
                      onClick: () => void rn(),
                      children: [
                        /* @__PURE__ */ r(jl, { "aria-hidden": "true" }),
                        "Skip",
                        ft ? " performer" : ` ${g.one}`
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ l("aside", { className: "dq-review-queue", "aria-label": "Review queue", children: [
              ft && /* @__PURE__ */ l(
                "div",
                {
                  className: "dq-segmented dq-segmented-fill",
                  role: "group",
                  "aria-label": "Queue view",
                  children: [
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        "aria-pressed": xt === "items",
                        onClick: () => Qt("items"),
                        children: d === "audio" ? "Audios" : "Scenes"
                      }
                    ),
                    /* @__PURE__ */ r(
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
              ft && xt === "performers" ? /* @__PURE__ */ r(
                $f,
                {
                  ranking: (ct == null ? void 0 : ct.signature) === ye ? ct : null,
                  busy: bn,
                  error: (C == null ? void 0 : C.signature) === ye ? C.message : "",
                  focus: K.performerFocus,
                  disabled: gt,
                  labels: g,
                  flagLabel: $n,
                  onFocus: sr,
                  onMore: () => {
                    const h = Yt.current;
                    h && Er(h, h.limit + po);
                  },
                  onRefresh: () => {
                    Pt(null), Er(null, po);
                  }
                }
              ) : /* @__PURE__ */ r("div", { className: "dq-queue-list", ref: Na, children: oe.map((h) => {
                var O;
                const k = (R == null ? void 0 : R.key) === h.key;
                return /* @__PURE__ */ l(
                  "button",
                  {
                    type: "button",
                    className: "dq-queue-row",
                    title: y(h),
                    "aria-label": y(h),
                    "aria-current": k ? "true" : void 0,
                    disabled: gt,
                    onClick: () => {
                      _t(h), xe(""), Re("");
                    },
                    children: [
                      /* @__PURE__ */ r(Xf, { media: h.media, kind: d }),
                      /* @__PURE__ */ l("span", { className: "dq-queue-row-text", children: [
                        /* @__PURE__ */ r("span", { className: "dq-queue-row-title", children: b(h.media) }),
                        /* @__PURE__ */ l("span", { className: "dq-queue-row-meta", children: [
                          h.occurrence && /* @__PURE__ */ l(we, { children: [
                            /* @__PURE__ */ r(Pr, { performer: h.occurrence.performer }),
                            /* @__PURE__ */ r("span", { className: "dq-queue-row-performer", children: h.occurrence.performer.name })
                          ] }),
                          /* @__PURE__ */ r("span", { className: "dq-queue-row-detail", children: [
                            h.media.date,
                            h.occurrence ? "" : (O = h.media.files[0]) != null && O.duration ? Ns(h.media.files[0].duration) : ""
                          ].filter(Boolean).join(" · ") })
                        ] })
                      ] })
                    ]
                  },
                  h.key
                );
              }) })
            ] })
          ] }) })
        ] }),
        ft && /* @__PURE__ */ r(
          Cl,
          {
            open: Tt,
            onClose: () => In(!1),
            criteria: Uo,
            activeFilter: ft.performerFilter,
            supportsFilterExpressions: !0,
            subjectLabel: "performers to review",
            onApply: (h) => {
              In(!1), wn({ performerFilter: h });
            }
          }
        ),
        Jt && /* @__PURE__ */ r(
          li,
          {
            actions: e.actions,
            trees: cn,
            isDisabled: (h) => an(h),
            tapStays: gn && it,
            onApply: (h, k) => {
              Ft(!1), rn(h, k);
            },
            onClose: () => Ft(!1)
          }
        )
      ]
    }
  );
}
const Jc = "data-quality.reviews-sort.v1", nh = { sort: "name", direction: "asc" };
function rh() {
  try {
    const e = JSON.parse(localStorage.getItem(Jc) ?? "null");
    if (e && typeof e == "object") {
      const { sort: t, direction: n } = e;
      if ((t === "name" || t === "count") && (n === "asc" || n === "desc"))
        return { sort: t, direction: n };
    }
  } catch {
  }
  return nh;
}
function ah(e) {
  try {
    localStorage.setItem(
      Jc,
      JSON.stringify({ sort: e.sort, direction: e.direction })
    );
  } catch {
  }
}
function Wc(e, t, n, a) {
  const o = a === "asc" ? 1 : -1;
  return [...e].sort((i, s) => {
    if (n === "count") {
      const c = t[i.id], u = t[s.id], p = typeof c == "number", d = typeof u == "number";
      if (p !== d) return p ? -1 : 1;
      if (p && d && c !== u)
        return (c - u) * o;
    }
    return i.name.localeCompare(s.name, void 0, { numeric: !0, sensitivity: "base" }) * o;
  });
}
function mo(e, t) {
  const n = Ue(e), a = Cn(Ho(n)), o = n === "tag" ? "tag" : $e(e) ? a.queue : a.one;
  return t === 1 ? o : `${o}s`;
}
function oh({ review: e, count: t }) {
  return t === void 0 ? /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: "…" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Counting matching ",
      mo(e, 2)
    ] })
  ] }) : t === null ? /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", title: "The count could not be loaded", children: "—" }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      "Matching ",
      mo(e, 1),
      " count unavailable"
    ] })
  ] }) : /* @__PURE__ */ l(we, { children: [
    /* @__PURE__ */ r("span", { "aria-hidden": "true", children: t.toLocaleString() }),
    /* @__PURE__ */ l("span", { className: "dq-sr-only", children: [
      t.toLocaleString(),
      " matching ",
      mo(e, t)
    ] })
  ] });
}
function ih({
  reviews: e,
  counts: t,
  sort: n,
  direction: a,
  onSortChange: o,
  onDirectionChange: i,
  storage: s,
  canConfigure: c,
  busy: u,
  headingRef: p,
  notices: d,
  onOpen: g,
  onNew: m,
  onImport: b,
  onExportAll: y,
  rowMenuItems: q
}) {
  const v = $(null), w = ge(
    () => Wc(e, t, n, a),
    [e, t, n, a]
  ), T = e.every((U) => t[U.id] !== void 0), F = a === "asc" ? "ascending" : "descending";
  return /* @__PURE__ */ l("div", { className: "dq-reviews-page", children: [
    /* @__PURE__ */ l("header", { className: "dq-reviews-header", children: [
      /* @__PURE__ */ r("h1", { ref: p, tabIndex: -1, children: "Data Quality" }),
      /* @__PURE__ */ l("div", { className: "dq-reviews-header-actions", children: [
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button",
            title: "Add the reviews in a review file",
            disabled: !c || u,
            onClick: () => {
              var U;
              return (U = v.current) == null ? void 0 : U.click();
            },
            children: [
              /* @__PURE__ */ r(Ul, { "aria-hidden": "true" }),
              "Import"
            ]
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            ref: v,
            type: "file",
            accept: "application/json,.json",
            hidden: !0,
            tabIndex: -1,
            onChange: (U) => {
              var _;
              const G = (_ = U.target.files) == null ? void 0 : _[0];
              U.target.value = "", G && b(G);
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
              /* @__PURE__ */ r(Rs, { "aria-hidden": "true" }),
              "Export all"
            ]
          }
        ),
        /* @__PURE__ */ l(
          "button",
          {
            type: "button",
            className: "dq-header-button dq-header-button-primary",
            disabled: !c || u,
            onClick: m,
            children: [
              /* @__PURE__ */ r(Va, { "aria-hidden": "true" }),
              "New review"
            ]
          }
        )
      ] })
    ] }),
    d,
    e.length ? /* @__PURE__ */ l("section", { className: "dq-reviews", "aria-label": "Reviews", children: [
      /* @__PURE__ */ l("div", { className: "dq-reviews-bar", children: [
        /* @__PURE__ */ l("p", { className: "dq-reviews-summary", children: [
          e.length === 1 ? "1 review" : `${e.length.toLocaleString()} reviews`,
          " ·",
          " ",
          s
        ] }),
        /* @__PURE__ */ r("span", { className: "dq-sr-only", role: "status", children: T ? e.some((U) => t[U.id] === null) ? "Review counts loaded; some counts are unavailable." : "Review counts loaded." : "" }),
        /* @__PURE__ */ l("div", { className: "dq-reviews-sort", children: [
          /* @__PURE__ */ l("label", { children: [
            /* @__PURE__ */ r("span", { children: "Sort by" }),
            /* @__PURE__ */ l(
              "select",
              {
                className: "dq-select",
                value: n,
                onChange: (U) => o(U.target.value),
                children: [
                  /* @__PURE__ */ r("option", { value: "name", children: "Name" }),
                  /* @__PURE__ */ r("option", { value: "count", children: "Matching items" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              className: "dq-icon-button dq-reviews-direction",
              "aria-label": `Sort direction: ${F}`,
              title: `Sort direction: ${F}`,
              onClick: () => i(a === "asc" ? "desc" : "asc"),
              children: a === "asc" ? /* @__PURE__ */ r(Kl, { "aria-hidden": "true" }) : /* @__PURE__ */ r(Gl, { "aria-hidden": "true" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("table", { className: "dq-reviews-table", children: [
        /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ l("tr", { children: [
          /* @__PURE__ */ r("th", { scope: "col", "aria-sort": n === "name" ? F : void 0, children: "Review" }),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-type", children: "Type" }),
          /* @__PURE__ */ r(
            "th",
            {
              scope: "col",
              className: "dq-reviews-count",
              "aria-sort": n === "count" ? F : void 0,
              children: "Matching"
            }
          ),
          /* @__PURE__ */ r("th", { scope: "col", className: "dq-reviews-actions", children: /* @__PURE__ */ r("span", { className: "dq-sr-only", children: "Actions" }) })
        ] }) }),
        /* @__PURE__ */ r("tbody", { children: w.map((U) => {
          const G = Ue(U);
          return /* @__PURE__ */ l("tr", { children: [
            /* @__PURE__ */ r("td", { children: /* @__PURE__ */ l(
              "a",
              {
                className: "dq-reviews-link",
                href: `?review=${encodeURIComponent(U.id)}`,
                "data-review-id": U.id,
                onClick: (_) => {
                  _.button !== 0 || _.metaKey || _.ctrlKey || _.shiftKey || _.altKey || (_.preventDefault(), g(U.id));
                },
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-reviews-icon", children: /* @__PURE__ */ r(qc, { entityType: G }) }),
                  /* @__PURE__ */ l("span", { className: "dq-reviews-text", children: [
                    /* @__PURE__ */ r("span", { className: "dq-reviews-name", children: U.name }),
                    U.description && /* @__PURE__ */ r("span", { className: "dq-reviews-description", title: U.description, children: U.description })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-type", children: Nc[G] }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-count", children: /* @__PURE__ */ r(oh, { review: U, count: t[U.id] }) }),
            /* @__PURE__ */ r("td", { className: "dq-reviews-actions", children: /* @__PURE__ */ r(fi, { label: `Actions for ${U.name}`, items: q(U) }) })
          ] }, U.id);
        }) })
      ] })
    ] }) : /* @__PURE__ */ l("div", { className: "dq-empty", children: [
      /* @__PURE__ */ r(za, { "aria-hidden": "true" }),
      /* @__PURE__ */ r("p", { children: "No reviews yet." }),
      /* @__PURE__ */ r("p", { children: c ? "New review creates one; Import adds the reviews in a review file." : "Reviews can be added once saved filter write permission is granted." })
    ] })
  ] });
}
function Hc(e, { id: t, name: n, description: a }) {
  const o = { id: t, name: n, description: a }, i = (s, c = {}) => ({
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
function sh({
  draft: e,
  onChange: t,
  onCreate: n,
  onCancel: a
}) {
  const { review: o, saving: i, error: s } = e, c = $(null), u = $(null), p = $(i);
  p.current = i;
  const d = $(null), g = at();
  H(() => {
    var y;
    return d.current ?? (d.current = document.activeElement instanceof HTMLElement ? document.activeElement : null), c.current && !c.current.open && c.current.showModal(), (y = u.current) == null || y.focus(), () => {
      var q;
      (q = d.current) != null && q.isConnected && d.current.focus({ preventScroll: !0 });
    };
  }, []);
  const m = $(i);
  H(() => {
    var v, w;
    const y = document.activeElement, q = !y || y === document.body || !((v = c.current) != null && v.contains(y));
    s && (!o.name.trim() || m.current && !i && q) && ((w = u.current) == null || w.focus()), m.current = i;
  }, [s, i]);
  const b = () => {
    p.current || a();
  };
  return /* @__PURE__ */ r(
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
        p.current ? (y = c.current) == null || y.showModal() : a();
      },
      children: /* @__PURE__ */ l(
        "form",
        {
          onSubmit: (y) => {
            y.preventDefault(), p.current || n();
          },
          children: [
            /* @__PURE__ */ l("header", { className: "dq-form-dialog-header", children: [
              /* @__PURE__ */ r("h2", { id: g, children: "New review" }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  className: "dq-icon-button",
                  "aria-label": "Close dialog",
                  title: "Close",
                  disabled: i,
                  onClick: b,
                  children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
                }
              )
            ] }),
            /* @__PURE__ */ l("div", { className: "dq-form-dialog-body", children: [
              /* @__PURE__ */ r("p", { className: "dq-form-dialog-intro", children: "Name the review, then configure its queue and actions." }),
              s && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: s }),
              /* @__PURE__ */ l("fieldset", { className: "dq-form-dialog-fields", disabled: i, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: "Review details" }),
                /* @__PURE__ */ r(
                  kc,
                  {
                    review: o,
                    onChange: t,
                    entityTypeLocked: !1,
                    onEntityTypeChange: (y) => {
                      y !== Ue(o) && t(Hc(y, o));
                    },
                    nameRef: u
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ l("footer", { className: "dq-form-dialog-footer", children: [
              /* @__PURE__ */ r("button", { type: "button", className: "dq-text-button", onClick: () => ui(o), children: "Export draft" }),
              /* @__PURE__ */ r("span", { className: "dq-form-dialog-space" }),
              /* @__PURE__ */ r("button", { type: "button", className: "dq-button", disabled: i, onClick: b, children: "Cancel" }),
              /* @__PURE__ */ r("button", { type: "submit", className: "dq-button primary", "aria-disabled": i || void 0, children: i ? "Creating…" : "Create & configure" })
            ] })
          ]
        }
      )
    }
  );
}
const ch = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only"
};
function lh(e, t, n, a) {
  return zc(
    {
      ...e,
      view: {
        ...e.view,
        filter: { ...n, page: 1 },
        objectFilter: t.view.objectFilter,
        searchMode: t.view.searchMode
      }
    },
    a
  );
}
function ls(e, t) {
  return Ue(t) === "video" && ba(t.view.objectFilter, e.view.objectFilter).bins.length > 0 ? { ...e, view: { ...e.view, objectFilter: t.view.objectFilter } } : null;
}
function ds(e, t) {
  return vr(
    JSON.parse(Jn(yr(e))),
    JSON.parse(Jn(yr(t)))
  );
}
const go = 180;
function us(e) {
  return Ue(e) === "tag" ? e.view.displayMode === "list" ? "list" : "grid" : e.view.displayMode === "wall" ? "wall" : "grid";
}
function fs(e, t = "video") {
  return t === "tag" ? e === "list" ? "list" : "grid" : e === "wall" ? "wall" : "grid";
}
function hs() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}
function bo(e, t = !1) {
  const n = new URLSearchParams(window.location.search);
  Qa.forEach((o) => n.delete(o)), e ? n.set("review", e) : n.delete("review");
  const a = n.toString();
  Vc(`${window.location.pathname}${a ? `?${a}` : ""}`, { openingFromList: t });
}
function dh(e) {
  return Gt({ ...e, page: 1 });
}
function Qc(e) {
  var t;
  return e.title || ((t = e.files[0]) == null ? void 0 : t.basename) || `Video ${e.id}`;
}
function Fr(e) {
  e.preventDefault(), e.stopPropagation(), "nativeEvent" in e ? e.nativeEvent.stopImmediatePropagation() : e.stopImmediatePropagation();
}
const uh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Vo, { "aria-hidden": "true" }) },
  { value: "wall", label: "Wall", icon: /* @__PURE__ */ r(zl, { "aria-hidden": "true" }) }
], fh = [
  { value: "grid", label: "Cards", icon: /* @__PURE__ */ r(Vo, { "aria-hidden": "true" }) },
  { value: "list", label: "List", icon: /* @__PURE__ */ r(Vl, { "aria-hidden": "true" }) }
], ps = [], Yc = "(min-width: 900px)";
function hh(e) {
  if (typeof window.matchMedia != "function") return () => {
  };
  const t = window.matchMedia(Yc);
  return t.addEventListener("change", e), () => t.removeEventListener("change", e);
}
function ph() {
  return typeof window.matchMedia == "function" && window.matchMedia(Yc).matches;
}
function mh({
  onNavigate: e
}) {
  const [t, n] = A([]), [a] = A(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return !1;
    }
  }), [o, i] = A(""), [s, c] = A(!0), [u, p] = A(""), [d, g] = A(!1), [m, b] = A(!1), [y, q] = A(!1), [v, w] = A(!1), [T, F] = A([]), [U, G] = A(""), [_, ee] = A(!0), [ne, se] = A("account"), [ae, D] = A(""), [K, S] = A(""), [I, J] = A(!1), [Q, Z] = A(!1), [oe, V] = A(""), [R, W] = A(hs), E = $(R);
  E.current = R;
  const [B, re] = A({}), ce = $(B);
  ce.current = B;
  const P = $(t);
  P.current = t;
  const be = $(s);
  be.current = s;
  const Te = $(!1), fe = $(!0);
  H(() => (fe.current = !0, () => {
    fe.current = !1;
  }), []);
  const [Oe, Ge] = A(!R);
  Oe !== !R && (Ge(!R), R || re({}));
  const [Ce, An] = A(rh), { sort: ve, direction: Je } = Ce, Et = (f) => {
    const N = { ...Ce, ...f };
    An(N), ah(N);
  }, mn = $(null), xe = $(null), [ot, Re] = A(null), [Ze, Vt] = A(!1), [Fe, Tn] = A(!1), [ut, Mt] = A(null), [ht, zt] = A(null), qt = !!ut || !!ht, er = $(qt);
  er.current = qt;
  const Tt = Ze || !!ht || Fe, [In, Jt] = A(0), [Ft, gn] = A(!1), [qe, Ct] = A(null), it = $(null), Dn = $(null), Wt = $(null), [Pe, It] = A(
    null
  ), le = t.find((f) => f.id === R) ?? null, x = ge(
    () => (Pe == null ? void 0 : Pe.id) === R && le ? { ...le, view: {
      ...le.view,
      filter: Pe.view.filter,
      objectFilter: Pe.view.objectFilter,
      searchMode: Pe.view.searchMode,
      startFrom: Pe.view.startFrom
    } } : le,
    [Pe, R, le]
  ), Ae = x ? Ue(x) : "video", pt = Ho(Ae), _n = x ? $e(x) : !1, me = Ae === "video" ? x : null, Rt = _n && !!(x != null && x.actions.some(Qn)), tt = !!me || Ae === "audio" || Rt, [Le, et] = A(null), Ht = (Le == null ? void 0 : Le.id) === (x == null ? void 0 : x.id) ? Le == null ? void 0 : Le.mode : (x == null ? void 0 : x.view.reviewMode) ?? "single", st = _n || Ae === "audio" || Ae === "video" && Ht === "single", [mt, xt] = A(0), Qt = $(-1), ct = $(!1), jn = $(st);
  jn.current = st, H(() => {
    const f = () => {
      const N = jn.current;
      if (!N && vn.current) {
        ct.current = !0;
        return;
      }
      Qt.current = -1, At(), N || xt((M) => M + 1);
    };
    return window.addEventListener("popstate", f), () => window.removeEventListener("popstate", f);
  }, []);
  const Yt = pt === "audio" ? m : d, Un = Ae === "tag" ? "Tag" : pt === "audio" ? "Audio" : "Video", Pt = Ae === "tag" ? y : Yt, bn = $(
    null
  ), nn = Gf(me), [C, L] = A({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc"
  }), [Y, ye] = A({
    page: 1,
    perPage: 40
  }), [de, Me] = A({ items: [], totalCount: 0 }), [Ie, Lt] = A(R);
  Ie !== R && (Lt(R), Me({ items: [], totalCount: 0 }), Z(!1));
  const [Ne, ke] = A(!1), [Se, Dt] = A(""), [Rn, Kr] = A(!1), [Gr, Br] = A(!1), [St, Xt] = A(() => /* @__PURE__ */ new Set()), tr = $(St);
  tr.current = St;
  const gt = $(/* @__PURE__ */ new Map()), yn = (x == null ? void 0 : x.view.selectAllOnLoad) === !0, [_e, nt] = A(null), bt = $(_e);
  bt.current = _e;
  const [yt, _t] = A(!1), jt = $(yt);
  jt.current = yt;
  const rn = $(null), [nr, an] = A(!1), [Zt, Sr] = A("grid"), [kr, ya] = A(go), [De, ft] = A(!1), [wn, Er] = A(!1), vn = $(!1), [wa, rr] = A(""), [rt, on] = A(""), [sn, Nn] = A(""), [je, Vr] = A(null), [cn, Cr] = A(""), [ar, or] = A(!1), [zr, Ar] = A({}), ir = $(/* @__PURE__ */ new Map()), Jr = $(null), $n = $(null), sr = !!x, Ya = _o(hh, ph, () => !1) && sr, [cr, va] = A({ top: 0, bottom: 0 });
  kt(() => {
    if (!sr) return;
    const f = () => {
      const M = $n.current;
      if (!M) return;
      const j = Math.round(M.getBoundingClientRect().top + window.scrollY), X = M.closest("main"), z = X ? Math.round(parseFloat(getComputedStyle(X).paddingBottom) || 0) : 0;
      va(
        (ie) => ie.top === j && ie.bottom === z ? ie : { top: j, bottom: z }
      );
    };
    f();
    const N = typeof ResizeObserver > "u" ? null : new ResizeObserver(f);
    return N == null || N.observe(document.body), window.addEventListener("resize", f), () => {
      N == null || N.disconnect(), window.removeEventListener("resize", f);
    };
  }, [sr]);
  const [Xa, Na] = A(0), Tr = $(null), Wr = kn((f) => {
    var M;
    if ((M = Tr.current) == null || M.disconnect(), Tr.current = null, !f || typeof ResizeObserver > "u") return;
    const N = new ResizeObserver(
      () => Na(Math.round(f.getBoundingClientRect().height))
    );
    N.observe(f), Tr.current = N;
  }, []), $t = $(0), qn = $(0), lr = $(null), Kn = $(null), Gn = Hs(
    x && !st ? qe ? [...x.actions, ...qe.draft.actions] : x.actions : ps
  ), ln = ge(
    () => qe && x && le ? lh(qe.draft, x, C, le) : null,
    [qe, x, C, le]
  ), dr = ge(
    () => x && le ? zc(
      { ...le, view: { ...x.view, filter: { ...C, page: 1 } } },
      le
    ) : null,
    [x, le, C]
  ), ur = ge(
    () => le ? Lr(yr(le)) : "",
    [le]
  ), Hr = ge(
    () => dr != null && Lr(yr(dr)) !== ur,
    [dr, ur]
  ), qa = ge(
    () => ln != null && Lr(yr(ln)) !== ur,
    [ln, ur]
  );
  H(() => {
    if (!rt) return;
    const f = window.setTimeout(() => on(""), 4e3);
    return () => window.clearTimeout(f);
  }, [rt]), H(() => {
    if (!ot || ot.alert) return;
    const f = window.setTimeout(() => Re(null), 6e3);
    return () => window.clearTimeout(f);
  }, [ot]), H(() => {
    const f = me ? mi(me.view.objectFilter) : [];
    if (Ar({}), !f.length) return;
    const N = new AbortController();
    let M = !0;
    return Promise.all(
      f.map(async (j) => {
        var X;
        try {
          const z = await pe(`/api/tags/${j}`, {
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
  }, [me == null ? void 0 : me.id, me == null ? void 0 : me.view.objectFilter]);
  const Za = ge(
    () => me ? gi(
      me.view.objectFilter,
      zr
    ) : (x == null ? void 0 : x.view.objectFilter) ?? {},
    [zr, x, me]
  ), Qr = kn(async () => {
    c(!0), p("");
    try {
      const f = await hd();
      n(f.reviews), i(f.storageKey), g(f.canWriteVideos ?? f.canWrite), b(f.canWriteAudios ?? !1), q(f.canWriteTags ?? !1), w(f.canReadTagGroups ?? !1), ee(f.canConfigure ?? !0), se(f.storage ?? "account"), D(f.storageNotice ?? ""), R && !f.reviews.some((N) => N.id === R) && (W(""), bo(""));
    } catch (f) {
      p(
        f instanceof Error ? f.message : "Could not load reviews."
      );
    } finally {
      c(!1);
    }
  }, [R]);
  H(() => {
    if (!v) {
      F([]), G("");
      return;
    }
    const f = new AbortController();
    return G(""), Ed(f.signal).then(F).catch((N) => {
      f.signal.aborted || G(
        N instanceof Error ? N.message : "Could not load tag groups."
      );
    }), () => f.abort();
  }, [v]), H(() => {
    Qr();
  }, []), H(() => {
    if (R || t.length === 0) return;
    const f = new AbortController();
    for (const N of t) {
      if (typeof ce.current[N.id] == "number") continue;
      ($e(N) ? bi(N, f.signal).then((j) => (j == null ? void 0 : j.length) === 0 ? { items: [], totalCount: 0 } : na(yi(N, j), { ...N.view.filter, page: 1, perPage: 1 }, f.signal)) : Ue(N) === "tag" ? Pi(
        N,
        Gt({ ...N.view.filter, page: 1, perPage: 1 }),
        f.signal
      ) : na(
        N,
        Gt({ ...N.view.filter, page: 1, perPage: 1 }),
        f.signal
      )).then((j) => {
        f.signal.aborted || re((X) => ({
          ...X,
          [N.id]: j.totalCount
        }));
      }).catch(() => {
        f.signal.aborted || re((j) => ({ ...j, [N.id]: null }));
      });
    }
    return () => f.abort();
  }, [R, t]), kt(() => {
    var M, j;
    const f = xe.current;
    if (R || s || !f) return;
    xe.current = null, (j = (f === "heading" ? null : [...((M = $n.current) == null ? void 0 : M.querySelectorAll("[data-review-id]")) ?? []].find(
      (X) => X.dataset.reviewId === f.reviewId
    )) ?? mn.current) == null || j.focus();
  }, [R, s, ht, t]);
  const Ir = $(0), h = kn(async () => {
    const f = ++Ir.current;
    Vr(null), Cr("");
    try {
      const N = await (Rt ? Vs(pt) : Bs(pt));
      f === Ir.current && Vr(N);
    } catch (N) {
      if (f !== Ir.current) return;
      Vr(null), Cr(
        "Tag assessment setup could not be checked. " + (N instanceof Error ? N.message : "Request failed.")
      );
    }
  }, [Rt, pt]);
  H(() => {
    h();
  }, [h]);
  const k = kn(
    async (f, N, M = !1, j = !1) => {
      var vt, Be;
      const X = ++$t.current;
      (vt = lr.current) == null || vt.abort();
      const z = new AbortController();
      lr.current = z, N = Gt(N);
      const ie = Number(N.page);
      M && (N = { ...N, page: 1 }), L(N), Br(M), ke(!0), Dt("");
      try {
        const He = (On) => Ue(f) === "tag" ? Pi(
          f,
          On,
          z.signal
        ) : na(
          f,
          On,
          z.signal
        );
        let Ee = await He(N);
        const Qe = Math.max(
          1,
          Math.ceil(Ee.totalCount / Number(N.perPage))
        ), Bn = M ? Qe : Math.min(ie, Qe);
        return Number(N.page) !== Bn && (N = { ...N, page: Bn }, Ee = await He(N)), X === $t.current && (((Be = Kn.current) == null ? void 0 : Be.page) !== Bn && (Kn.current = {
          page: Bn,
          ids: new Set(Ee.items.map((On) => On.id))
        }), Me(Ee), j && wt(
          () => new Set(Ee.items.map((On) => On.id))
        ), L(N), ye(N)), Ee;
      } catch (He) {
        throw X === $t.current && Dt(
          He instanceof Error ? He.message : "Could not load the review queue."
        ), He;
      } finally {
        X === $t.current && ke(!1);
      }
    },
    []
  );
  H(() => {
    var N;
    if (qn.current += 1, Qt.current = -1, $t.current += 1, (N = lr.current) == null || N.abort(), Ct(null), it.current = null, Z(!1), V(""), S(""), J(!1), Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null), _t(!1), ft(!1), vn.current = !1, rr(""), on(""), Nn(""), Me({ items: [], totalCount: 0 }), Kn.current = null, Kr(!1), !x || st) {
      ke(!1), It(null);
      return;
    }
    let f = !0;
    return ke(!0), (async () => {
      let M = le ?? x;
      It(null);
      let j = null;
      const X = new URLSearchParams(window.location.search);
      if (Ue(x) === "video" && Qa.some((Be) => X.has(Be)))
        try {
          const Be = M;
          j = Do(Be, X);
          const He = En(Be, j.query);
          (j.query.startFrom !== (Be.view.startFrom ?? "end") || !vr(
            JSON.parse(Jn(He)),
            JSON.parse(Jn(En(Be, Nr(Be))))
          )) && (M = He, It(M));
        } catch (Be) {
          Kr(!0), Dt(Be instanceof Error ? Be.message : "Could not read review URL."), ke(!1);
          return;
        }
      let z = null;
      try {
        z = await bd(o, x.id);
      } catch (Be) {
        f && (J(!0), S(
          Be instanceof Error ? Be.message : "Could not load progress."
        ));
      }
      if (!f) return;
      const ie = (z == null ? void 0 : z.signature) === Jn(M) ? z : null, vt = j ? j.query.filter : ie ? Gt(ie.filter) : dh(M.view.filter);
      L(vt), Sr(
        ie ? fs(ie.displayMode, Ue(x)) : us(x)
      ), ya(
        ie ? ie.cardSize ?? go : go
      );
      try {
        const Be = await k(
          M,
          vt,
          j ? j.startAtEnd : !ie && M.view.startFrom !== "beginning",
          M.view.selectAllOnLoad === !0
        );
        if (!f) return;
        const He = Oi(
          Be.items.map((Ee) => Ee.id),
          (ie == null ? void 0 : ie.focusedId) ?? null,
          (ie == null ? void 0 : ie.index) ?? 0
        );
        nt(He), Ve(He);
      } catch {
      }
      f && (Qt.current = mt, Z(!0), V(`${x.id}:${mt}`));
    })(), () => {
      var M;
      f = !1, qn.current++, $t.current++, (M = lr.current) == null || M.abort();
    };
  }, [x == null ? void 0 : x.id, st, mt]), H(() => {
    if (!(!In || st || !x)) {
      if (Rn) {
        Jt(0);
        return;
      }
      De || qe || wn || oe !== `${x.id}:${mt}` || (Jt(0), ao());
    }
  }, [
    In,
    st,
    x == null ? void 0 : x.id,
    oe,
    De,
    wn,
    mt,
    Rn
  ]), H(() => {
    !me || st || !Q || Ne || Se || De || ct.current || Qt.current !== mt || ra(me.id, {
      filter: C,
      objectFilter: me.view.objectFilter,
      searchMode: me.view.searchMode,
      startFrom: me.view.startFrom ?? "end"
    });
  }, [me, st, Q, Ne, Se, C, De, mt]);
  const O = ge(
    () => de.items.map((f) => f.id),
    [de.items]
  );
  H(() => {
    if (!Q || !x || !o || Ne || Se || De || (Pe == null ? void 0 : Pe.id) === x.id || I || Qt.current !== mt)
      return;
    const f = {
      version: 1,
      signature: Jn(x),
      filter: C,
      focusedId: _e,
      index: Math.max(0, O.indexOf(_e ?? -1)),
      displayMode: Zt,
      cardSize: kr,
      updatedAt: Date.now()
    };
    try {
      localStorage.setItem(
        o + ":progress:" + x.id,
        JSON.stringify(f)
      );
    } catch {
    }
    if (K) return;
    let N = !0;
    const M = window.setTimeout(() => {
      yd(o, x.id, f).catch((j) => {
        N && S(
          "Progress is kept in this browser, but account sync failed. " + (j instanceof Error ? j.message : "Retry.")
        );
      });
    }, 600);
    return () => {
      N = !1, window.clearTimeout(M);
    };
  }, [
    Q,
    o,
    x,
    Ne,
    Se,
    De,
    C,
    _e,
    O,
    Zt,
    kr,
    Pe,
    K,
    I,
    mt
  ]);
  const te = de.items.find((f) => f.id === _e) ?? null, he = Ae === "video" ? te : null;
  yt && he && (rn.current = he);
  const ue = he ?? (yt ? rn.current : null), Ye = Mi(St, _e), Ot = O.length > 0 && O.every((f) => St.has(f)), Ve = kn((f, N = !0) => {
    f != null && window.requestAnimationFrame(() => {
      var j;
      if (er.current || sd(document.activeElement) || // The drawer's Group list hangs on the page, outside the drawer.
      (j = document.activeElement) != null && j.closest(".dq-drawer, .dq-combobox-list"))
        return;
      const M = ir.current.get(f);
      M == null || M.focus({ preventScroll: !0 }), N && (M == null || M.scrollIntoView({ block: "nearest", inline: "nearest" }));
    });
  }, []);
  H(() => {
    Q && !jt.current && Ve(bt.current);
  }, [Q, Ve]), H(() => {
    Ne || !O.length || (bt.current == null || !O.includes(bt.current)) && (nt(O[0]), jt.current || Ve(O[0]));
  }, [Ve, O, Ne]);
  const wt = kn(
    (f) => {
      Xt((N) => {
        const M = f(N);
        for (const j of /* @__PURE__ */ new Set([...N, ...M]))
          N.has(j) !== M.has(j) && gt.current.set(
            j,
            (gt.current.get(j) ?? 0) + 1
          );
        return M;
      });
    },
    []
  ), lt = kn(
    (f) => {
      if (!O.length) return;
      const N = Math.max(
        0,
        O.indexOf(bt.current ?? O[0])
      ), M = O[Math.max(0, Math.min(O.length - 1, N + f))];
      nt(M), jt.current || Ve(M);
    },
    [Ve, O]
  ), ze = kn(
    async (f) => {
      const N = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", M = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, j = M != null && (!v || !T.some((Xe) => Xe.id === M)), X = "effect" in f && N && !v, z = Mi(
        tr.current,
        bt.current
      );
      if (!x || vn.current || Ne || Se) return;
      const ie = N && !Pt ? `${Un} write permission is required to apply ${f.label}.` : X || j ? `${f.label} needs a tag group that is unavailable.` : Qn(f) && (je == null ? void 0 : je.kind) !== "ready" ? `Set up tag assessments before applying ${f.label}.` : z.length ? "" : `Select or focus a ${Ae} before applying ${f.label}.`;
      if (ie) {
        Nn(ie);
        return;
      }
      const vt = ++qn.current, Be = x.id, He = [...O], Ee = de, Qe = bt.current, Bn = new Set(tr.current), On = new Map(
        z.map((Xe) => [Xe, gt.current.get(Xe) ?? 0])
      ), Or = () => vt === qn.current && x.id === Be;
      vn.current = !0, ft(!0), rr(
        tr.current.size ? `${z.length} selected ${Ae}s` : `the focused ${Ae}`
      ), on(""), Nn("");
      const Ci = Ee.items.filter(
        (Xe) => !z.includes(Xe.id)
      ), pl = Ci.map((Xe) => Xe.id), Ai = Fi(
        He,
        pl,
        Qe,
        z.includes(Qe ?? -1)
      );
      Me({
        items: Ci,
        totalCount: Ee.totalCount
      }), Xt((Xe) => {
        const Kt = new Set(Xe);
        for (const un of z) Kt.delete(un);
        return Kt;
      }), nt(Ai), jt.current || Ve(Ai);
      let oo = !1;
      try {
        if ("effect" in f ? await xd(f, z) : await Js(pt, f, z), oo = !0, !Or()) return;
        Xt((Xe) => {
          const Kt = new Set(Xe);
          for (const un of z)
            (gt.current.get(un) ?? 0) === On.get(un) && Kt.delete(un);
          return Kt;
        }), on(
          `${f.label}: ${z.length} ${Ae}${z.length === 1 ? "" : "s"} ${N ? "updated" : "skipped"}.`
        );
      } catch (Xe) {
        if (!Or()) return;
        Me(Ee), Xt((Kt) => {
          const un = new Set(Kt);
          for (const en of z)
            Bn.has(en) && (gt.current.get(en) ?? 0) === On.get(en) && un.add(en);
          return un;
        }), nt(Qe), jt.current || Ve(Qe), Nn(
          Xe instanceof Error ? Xe.message : "Action failed."
        );
      }
      try {
        if (await Td(f), !Or()) return;
        const Xe = new Set(z), Kt = yn && He.length > 0 && He.every((fn) => Xe.has(fn)), un = await k(x, C, !1, Kt);
        if (!Or()) return;
        let en = un.items.map((fn) => fn.id);
        const Aa = Kn.current, ml = (Aa == null ? void 0 : Aa.page) === Number(C.page) && en.some((fn) => Aa.ids.has(fn)), gl = (x.view.startFrom ?? "end") !== "beginning";
        if (un.totalCount > 0 && Number(C.page) > 1 && (!en.length || gl && !ml)) {
          const fn = Math.max(1, Number(C.page) - 1), Ta = { ...C, page: fn };
          L(Ta), en = (await k(
            x,
            Ta,
            !1,
            Kt
          )).items.map((io) => io.id), Xt(
            (io) => new Set([...io].filter((bl) => en.includes(bl)))
          );
          const Ii = en.at(-1) ?? null;
          nt(Ii), jt.current || Ve(Ii);
        } else {
          Xt(
            (Ta) => new Set([...Ta].filter((Ti) => en.includes(Ti)))
          );
          const fn = Fi(
            He,
            en,
            Qe,
            oo && z.includes(Qe ?? -1)
          );
          nt(fn), jt.current && fn == null && _t(!1), jt.current || Ve(fn);
        }
      } catch (Xe) {
        Or() && Nn(
          (Kt) => `${Kt ? `${Kt} ` : ""}${oo ? "The action completed, but " : ""}the queue could not be refreshed. ${Xe instanceof Error ? Xe.message : "Refresh failed."}`
        );
      } finally {
        Or() && (vn.current = !1, ft(!1), rr(""), ct.current && (ct.current = !1, At(), xt((Xe) => Xe + 1)));
      }
    },
    [
      Pt,
      v,
      T,
      Ae,
      je,
      k,
      C,
      Ve,
      O,
      de,
      Ne,
      Se,
      x
    ]
  );
  function Sn() {
    var M;
    if (Zt === "list") return 1;
    const f = (M = Jr.current) == null ? void 0 : M.firstElementChild, N = f ? getComputedStyle(f).gridTemplateColumns : "";
    return Math.max(1, N.split(" ").filter(Boolean).length);
  }
  const We = $(() => {
  });
  We.current = (f) => {
    var z;
    if (st || f.defaultPrevented || f.repeat || pn(f) || f.ctrlKey || f.altKey || f.metaKey || qt) return;
    const N = f.target, M = N instanceof Node && ((z = $n.current) == null ? void 0 : z.contains(N)) === !0, j = N === document.body || N === document.documentElement;
    if (!M && !j) return;
    if (nr) {
      f.key === "Escape" && (Fr(f), an(!1));
      return;
    }
    if (yt && f.key === "Escape") {
      Fr(f), _t(!1), Ve(bt.current);
      return;
    }
    if (!id(N)) return;
    const X = od(N);
    if (f.key === "Escape") {
      Fr(f), wt(() => /* @__PURE__ */ new Set());
      return;
    }
    if (!yt && f.key === " " && X) {
      Fr(f), _e != null && wt((ie) => xa(ie, _e));
      return;
    }
    if (!(De || Ne) && !yt && f.key === "Enter" && _e != null && X) {
      if (Ae !== "tag" && qe) return;
      Fr(f), Ae === "tag" ? window.open(`/tag/${_e}`, "_blank", "noopener,noreferrer") : _t(!0);
      return;
    }
  }, H(() => {
    const f = (N) => We.current(N);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const dn = $(
    () => {
    }
  );
  dn.current = (f) => {
    var z;
    if (st || qt || yt || nr || De || Ne || !O.length || f.defaultPrevented || f.repeat || f.ctrlKey || f.altKey || f.metaKey)
      return;
    const N = f.target, M = N instanceof Node && ((z = $n.current) == null ? void 0 : z.contains(N)) === !0, j = N === document.body || N === document.documentElement;
    if (!M && !j || !f.key.startsWith("Arrow") || !cd(N)) return;
    const X = ld(f.key, Sn());
    X && (f.preventDefault(), M ? f.stopImmediatePropagation() : f.stopPropagation(), lt(X));
  }, H(() => {
    const f = (N) => dn.current(N);
    return document.addEventListener("keydown", f), () => document.removeEventListener("keydown", f);
  }, []);
  const Ut = (qe == null ? void 0 : qe.saving) === !0 || wn, Yr = De || Ne && !Q || Ut, Sa = si();
  ii({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled: !!x && !st && !qt && !qe && !yt && !nr && !Se && (de.items.length > 0 || Ne || De),
    actions: (x == null ? void 0 : x.actions) ?? ps,
    onAction: (f) => {
      const N = x == null ? void 0 : x.actions[f];
      N && ze(N);
    },
    onFind: () => an(!0),
    onSelectAll: () => wt((f) => ad(f, O))
  }), H(() => an(!1), [st, yt, x == null ? void 0 : x.id]);
  function ka(f) {
    const N = "steps" in f ? f.steps.length > 0 : f.effect.mode !== "SKIP", M = "effect" in f && f.effect.mode === "SET_TAG_GROUP" ? f.effect.tagGroupId : null, j = M != null && !T.some((X) => X.id === M);
    return De || Ne || !!Se || N && !Pt || "effect" in f && N && (!v || j) || Qn(f) && (je == null ? void 0 : je.kind) !== "ready" || !Ye.length;
  }
  function fr(f) {
    et(null), Jt(0), Re(null), W(f), bo(f, !!f && !x);
  }
  function Rr() {
    Te.current || (Bc() ? (Te.current = !0, window.history.back()) : fr(""));
  }
  function At() {
    const f = Te.current;
    Te.current = !1;
    let N = hs();
    N && !be.current && !P.current.some((j) => j.id === N) && (N = "", bo(""));
    const M = E.current;
    N !== M && (Jt(0), f || Re(null), !N && M && (xe.current ?? (xe.current = { reviewId: M }))), W(N);
  }
  function $r() {
    xe.current = "heading", Re(null), Rr();
  }
  function eo(f) {
    f !== R && fr(f), Jt((N) => N + 1);
  }
  function Xc() {
    Re(null), Mt({
      review: Hc("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: !1,
      error: ""
    });
  }
  async function Zc(f) {
    if (Tt || !_) return;
    Re(null);
    const N = crypto.randomUUID();
    let M;
    const j = R;
    Tn(!0);
    try {
      if (!await Xr((z) => (M = nd(
        z.find((ie) => ie.id === f.id) ?? f,
        z,
        N
      ), [...z, M]))) throw new Error("Could not save reviews.");
      if (!fe.current) return;
      E.current !== j ? Re({ text: `Saved the copy “${M.name}”.`, alert: !1 }) : eo(M.id);
    } catch (X) {
      Re({
        text: `“${f.name}” was not duplicated. ${Ea(X)}`,
        alert: !0
      });
    } finally {
      Tn(!1);
    }
  }
  async function el() {
    if (!ut || ut.saving) return;
    const f = { ...ut.review, name: ut.review.name.trim() }, N = sa(f);
    if (N) {
      Mt({ ...ut, error: N });
      return;
    }
    Mt({ ...ut, saving: !0, error: "" });
    try {
      if (!await Xr((M) => [...M, f]))
        throw new Error("Could not save reviews.");
      if (!fe.current) return;
      Mt(null), eo(f.id);
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
  async function tl() {
    if (!ht || ht.pending) return;
    const f = ht.review, N = Wc(t, B, ve, Je).map((X) => X.id), M = N.filter((X) => X !== f.id), j = M[Math.min(N.indexOf(f.id), M.length - 1)];
    zt({ review: f, pending: !0 });
    try {
      if (!await Xr((X) => X.filter((z) => z.id !== f.id)))
        throw new Error("Could not save reviews.");
      xe.current = f.id !== R && j ? { reviewId: j } : "heading", Re({ text: `Deleted “${f.name}”.`, alert: !1 });
    } catch (X) {
      Re({ text: `“${f.name}” was not deleted. ${Ea(X)}`, alert: !0 });
    } finally {
      zt(null);
    }
  }
  async function nl(f) {
    if (!(Tt || !_)) {
      Re(null), Vt(!0);
      try {
        const N = await zu(f);
        let M = 0;
        if (N.length && !await Xr((X) => {
          const z = yo(X, N);
          return M = z.length - X.length, M ? z : X;
        }))
          throw new Error("Could not save reviews.");
        const j = N.length - M;
        Re({
          alert: !1,
          text: N.length ? M ? `Imported ${M === 1 ? "1 review" : `${M} reviews`}.` + (j === 1 ? " 1 review already in the list stays as it is." : j ? ` ${j} reviews already in the list stay as they are.` : "") : "Nothing imported: the reviews in this file are already in the list." : "Nothing to import: the file holds no reviews."
        });
      } catch (N) {
        Re({ alert: !0, text: `Could not import “${f.name}”. ${Ea(N)}` });
      } finally {
        Vt(!1);
      }
    }
  }
  function Ea(f) {
    return f instanceof Ls ? "Reviews changed in another browser. Reload the page to get them, then try again." : f instanceof Error ? f.message : "Try again.";
  }
  function qi(f) {
    const N = !_ || Tt;
    return [
      {
        label: "Duplicate",
        icon: /* @__PURE__ */ r(ks, { "aria-hidden": "true" }),
        disabled: N,
        onSelect: () => void Zc(f)
      },
      {
        label: "Export",
        icon: /* @__PURE__ */ r(Rs, { "aria-hidden": "true" }),
        onSelect: () => ui(f)
      },
      {
        label: "Delete…",
        icon: /* @__PURE__ */ r(Bo, { "aria-hidden": "true" }),
        danger: !0,
        separated: !0,
        disabled: N,
        onSelect: () => {
          Re(null), zt({ review: f, pending: !1 });
        }
      }
    ];
  }
  function Si(f, N) {
    return [
      {
        label: "Edit review",
        icon: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
        ...N,
        disabled: N.disabled || Fe
      },
      ...qi(f),
      {
        label: "All reviews",
        icon: /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
        separated: !0,
        disabled: Fe,
        onSelect: $r
      }
    ];
  }
  async function Xr(f) {
    if (!o) return !1;
    let N = [];
    const M = await gd(o, (ie) => {
      N = ie;
      const vt = f(ie);
      return vt === ie ? ie : vt.map(yh);
    });
    if (n(M), !fe.current) return !0;
    const j = E.current;
    j && !M.some((ie) => ie.id === j) && Rr();
    const X = N.find((ie) => ie.id === j), z = M.find((ie) => ie.id === j);
    return z && X && ((z.view.reviewMode ?? "single") !== (X.view.reviewMode ?? "single") && et(null), z.view.displayMode !== X.view.displayMode && Sr(us(z))), !0;
  }
  function to(f) {
    return Xr((N) => bh(N, f));
  }
  function rl(f) {
    return to(f).catch((N) => {
      throw E.current !== f.id && no(f, N), N;
    });
  }
  function no(f, N) {
    var j;
    if (!fe.current) return;
    const M = ((j = P.current.find((X) => X.id === f.id)) == null ? void 0 : j.name) ?? f.name;
    Re({ text: `“${M}” was not saved. ${Ea(N)}`, alert: !0 });
  }
  if (s)
    return /* @__PURE__ */ r(ms, { label: "Loading reviews…" });
  if (u)
    return /* @__PURE__ */ l(we, { children: [
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          onClick: () => void Sh().catch(
            (f) => p(
              "Could not export browser reviews. " + (f instanceof Error ? f.message : "Retry.")
            )
          ),
          children: "Export browser reviews"
        }
      ),
      /* @__PURE__ */ r(
        gs,
        {
          message: u,
          onRetry: () => void Qr()
        }
      )
    ] });
  const ro = /* @__PURE__ */ l(we, { children: [
    ae && /* @__PURE__ */ r("p", { className: "dq-status", children: ae }),
    tt && (je == null ? void 0 : je.kind) === "missing" && /* @__PURE__ */ l("div", { role: "status", className: "dq-status", children: [
      je.message,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: ar,
          onClick: () => {
            or(!0), Cr(""), (Rt ? $d(pt) : Rd(pt)).then(h).catch(
              (f) => Cr(
                `Could not create the ${Rt ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` + (f instanceof Error ? f.message : "Request failed.")
              )
            ).finally(() => or(!1));
          },
          children: ar ? "Setting up…" : "Set up tag assessments"
        }
      )
    ] }),
    tt && ((je == null ? void 0 : je.kind) === "incompatible" || cn) && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Mn, {}),
      cn || (je == null ? void 0 : je.message),
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          disabled: ar,
          onClick: () => {
            or(!0), h().finally(
              () => or(!1)
            );
          },
          children: ar ? "Checking…" : "Check again"
        }
      )
    ] }),
    a && /* @__PURE__ */ l("details", { children: [
      /* @__PURE__ */ r("summary", { children: "Unassigned legacy browser reviews" }),
      /* @__PURE__ */ r("p", { children: "These old reviews have no account owner. They have not been copied into this account. Export them for recovery, then import the reviews only into the intended account. The original data and deletion history stay in this browser." }),
      /* @__PURE__ */ r(
        "button",
        {
          className: "dq-button",
          type: "button",
          onClick: () => {
            const f = localStorage.getItem("page-videos") ?? "[]", N = URL.createObjectURL(
              new Blob([f], { type: "application/json" })
            ), M = document.createElement("a");
            M.href = N, M.download = "data-quality-unassigned-legacy-reviews.json", M.click(), URL.revokeObjectURL(N);
          },
          children: "Export unassigned reviews"
        }
      )
    ] }),
    K && /* @__PURE__ */ l("p", { role: "alert", children: [
      K,
      " ",
      /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: () => {
            S(""), J(!1);
          },
          children: I ? "Start fresh progress" : "Retry progress sync"
        }
      )
    ] }),
    ot && (ot.alert ? /* @__PURE__ */ l("p", { role: "alert", className: "dq-alert", children: [
      /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
      ot.text
    ] }) : (
      // The page's live region announces it.
      /* @__PURE__ */ r("p", { className: "dq-status", "aria-hidden": "true", children: ot.text })
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
        /* @__PURE__ */ r("p", { className: "dq-sr-only", "aria-live": "polite", children: ot && !ot.alert ? ot.text : "" }),
        x && st ? /* @__PURE__ */ r(
          th,
          {
            review: le ?? x,
            canWrite: _n ? y : Yt,
            canAssess: (je == null ? void 0 : je.kind) === "ready" && Yt,
            onBusy: ft,
            editRequest: In,
            onEditRequestHandled: () => Jt(0),
            onSaveDefaults: _ ? rl : void 0,
            pageControls: {
              onBack: $r,
              moreItems: (f) => Si(le ?? x, f),
              onGrid: me ? () => et({ id: me.id, mode: "multiple" }) : void 0,
              notices: ro,
              busy: Fe
            },
            stayOnTap: Ft,
            onStayOnTapChange: gn
          },
          x.id
        ) : x ? fl(x) : /* @__PURE__ */ r(
          ih,
          {
            reviews: t,
            counts: B,
            sort: ve,
            direction: Je,
            onSortChange: (f) => Et({ sort: f }),
            onDirectionChange: (f) => Et({ direction: f }),
            storage: ch[ne],
            canConfigure: _,
            busy: Tt,
            headingRef: mn,
            notices: ro,
            onOpen: fr,
            onNew: () => Xc(),
            onImport: (f) => void nl(f),
            onExportAll: () => Sc(t, "data-quality-reviews.json"),
            rowMenuItems: (f) => [
              {
                label: "Edit",
                icon: /* @__PURE__ */ r(Dr, { "aria-hidden": "true" }),
                disabled: !_ || Tt,
                onSelect: () => eo(f.id)
              },
              ...qi(f)
            ]
          }
        ),
        yt && ue && me && /* @__PURE__ */ r(
          qh,
          {
            video: ue,
            review: me,
            selectedCount: St.size,
            pending: De,
            refreshing: Ne || !!Se,
            error: sn,
            canWrite: d,
            assessmentReady: (je == null ? void 0 : je.kind) === "ready",
            trees: Gn,
            selected: St.has(ue.id),
            hasPrevious: O.indexOf(ue.id) > 0,
            hasNext: O.indexOf(ue.id) >= 0 && O.indexOf(ue.id) < O.length - 1,
            onToggleSelected: () => wt((f) => xa(f, ue.id)),
            onPrevious: () => lt(-1),
            onNext: () => lt(1),
            onClose: () => {
              _t(!1), Ve(bt.current);
            },
            onAction: ze,
            findOpen: nr,
            onFindOpenChange: an
          }
        ),
        nr && x && !st && !yt && /* @__PURE__ */ r(
          li,
          {
            actions: x.actions,
            tagGroups: T,
            trees: Gn,
            isDisabled: ka,
            canStay: !1,
            onApply: (f) => {
              an(!1), ze(f);
            },
            onClose: () => an(!1)
          }
        ),
        ut && /* @__PURE__ */ r(
          sh,
          {
            draft: ut,
            onChange: (f) => Mt((N) => N && { ...N, review: f, error: "" }),
            onCreate: () => void el(),
            onCancel: () => Mt(null)
          }
        ),
        /* @__PURE__ */ r(
          Tl,
          {
            open: !!ht,
            title: "Delete review?",
            message: ht ? `“${ht.review.name}” will be deleted. Export it first to keep a copy you can import again.` : "",
            confirmLabel: "Delete review",
            isPending: (ht == null ? void 0 : ht.pending) ?? !1,
            onConfirm: () => void tl(),
            onCancel: () => zt((f) => f != null && f.pending ? f : null)
          }
        )
      ]
    }
  );
  async function Ca(f, N, M = !1, j = !0) {
    const X = bt.current, z = Math.max(0, O.indexOf(X ?? -1));
    try {
      const ie = k(
        f,
        N,
        M,
        f.view.selectAllOnLoad === !0
      ), vt = $t.current, Be = await ie;
      if (vt !== $t.current) return;
      const He = Be.items.map((Qe) => Qe.id);
      Xt(
        (Qe) => new Set([...Qe].filter((Bn) => He.includes(Bn)))
      );
      const Ee = Oi(He, X, z);
      nt(Ee), j && !jt.current && Ve(Ee, !1);
    } catch {
    }
  }
  function al(f) {
    const N = bn.current;
    if (bn.current = null, Yr || !x || !le) return;
    const M = N ?? x.view.objectFilter, j = vr(
      M,
      le.view.objectFilter
    ) ? le.view.objectFilter : M, X = Gt({ ...f, page: 1 }), z = {
      ...x,
      view: {
        ...x.view,
        filter: X,
        objectFilter: j
      }
    }, ie = !ds(z, le), vt = ie ? z : le;
    It(ie ? z : null), on(ie ? "" : "Review queue defaults restored."), Ca(vt, X, !0);
  }
  function ol() {
    if (De || Ne || Ut || !le) return;
    bn.current = null;
    const f = Gt({
      ...le.view.filter,
      page: 1
    });
    It(null), on("Review queue defaults restored."), Ca(
      le,
      f,
      le.view.startFrom !== "beginning",
      !1
    );
  }
  function il() {
    if (De || Ne || Se || Ut || !x || !dr || !_)
      return;
    const f = x, N = dr;
    Er(!0), to(N).then((M) => {
      !M || E.current !== N.id || (It(ls(N, f)), on("Queue saved to this review."));
    }).catch((M) => {
      E.current !== N.id ? no(N, M) : Nn(M instanceof Error ? M.message : "Could not save queue.");
    }).finally(() => Er(!1));
  }
  function ao() {
    if (!x || !le || vn.current || qe || wn) return;
    Dn.current = document.activeElement instanceof HTMLElement ? document.activeElement : null, it.current = {
      temporaryReview: Pe,
      filter: C,
      loadedFilter: Y,
      queue: de,
      queueError: Se,
      retryFromEnd: Gr,
      selectedIds: new Set(St),
      focusedId: _e,
      pageCursor: Kn.current,
      url: window.location.pathname + window.location.search + window.location.hash
    };
    const f = structuredClone({
      ...le,
      view: { ...le.view, startFrom: x.view.startFrom ?? "end" }
    });
    an(!1), _t(!1), on(""), Nn(""), Ct({ draft: f, saving: !1, error: "" });
  }
  function ki() {
    Ct(null), it.current = null;
    const f = Dn.current;
    Dn.current = null, requestAnimationFrame(() => {
      (f == null ? void 0 : f.isConnected) && f !== document.body && !(f instanceof HTMLButtonElement && f.disabled) ? f.focus({ preventScroll: !0 }) : Ve(bt.current, !1);
    });
  }
  function sl() {
    var N;
    if (!qe || qe.saving) return;
    const f = it.current;
    f && ($t.current += 1, (N = lr.current) == null || N.abort(), bn.current = null, ke(!1), It(f.temporaryReview), L(f.filter), ye(f.loadedFilter), Me(f.queue), Dt(f.queueError), Br(f.retryFromEnd), wt(() => f.selectedIds), nt(f.focusedId), Kn.current = f.pageCursor, window.history.replaceState(window.history.state, "", f.url)), ki();
  }
  async function cl() {
    if (!qe || qe.saving || !ln || !x) return;
    const f = x, N = { ...ln, name: ln.name.trim() }, M = sa(N);
    if (M) {
      Ct((j) => j && { ...j, error: M });
      return;
    }
    Ct((j) => j && { ...j, saving: !0, error: "" });
    try {
      if (!await to(N)) throw new Error("Could not save reviews.");
      if (!fe.current || E.current !== N.id) return;
      It(ls(N, f)), Ue(N) === "video" && ra(N.id, {
        filter: C,
        objectFilter: f.view.objectFilter,
        searchMode: N.view.searchMode,
        startFrom: N.view.startFrom ?? "end"
      }), on("Review saved."), ki();
    } catch (j) {
      if (E.current !== N.id) {
        no(N, j);
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
  function Ei() {
    x && k(x, C, Gr, yn).catch(() => {
    });
  }
  function ll() {
    Xt(/* @__PURE__ */ new Set()), gt.current.clear(), nt(null);
  }
  function dl(f) {
    !x || De || Ut || f === Number(C.page) || gh(
      { ...C, page: f },
      x,
      (N, M) => k(N, M, !1, yn),
      ll
    );
  }
  function ul(f) {
    if (!me || !le || De || Ne || Ut) return;
    const N = Jf(me, f, le.view.objectFilter), M = !ds(N, le);
    It(M ? N : null), M ? Ca(N, { ...C, page: 1 }) : Ca(
      le,
      { ...C, page: 1 },
      le.view.startFrom !== "beginning"
    );
  }
  function fl(f) {
    var Be, He;
    const N = Ae === "tag", M = N ? "tag" : "video", j = Math.max(1, Number(C.perPage) || 40), X = Math.max(1, Math.ceil(de.totalCount / j)), z = Math.min(Math.max(1, Number(C.page) || 1), X), ie = [
      Pt ? "" : `${Un} write permission is required to apply actions.`,
      N && U ? `Tag groups are unavailable. ${U}` : ""
    ].filter(Boolean), vt = !!sn && !yt;
    return /* @__PURE__ */ l(
      "section",
      {
        className: "dq-grid-review",
        "aria-label": N ? "Tag review" : "Video review grid",
        children: [
          /* @__PURE__ */ r(
            Cc,
            {
              name: f.name,
              description: f.description,
              entityType: Ae,
              onBack: $r,
              backDisabled: De || !!qe || Fe,
              onEdit: qe ? () => {
                var Ee;
                return (Ee = Wt.current) == null ? void 0 : Ee.focus();
              } : ao,
              editDisabled: !qe && (De || Ne || Rn || wn || Fe || !_),
              editing: !!qe,
              toolbar: /* @__PURE__ */ l("fieldset", { className: "dq-review-toolbar", disabled: Yr, children: [
                /* @__PURE__ */ r("legend", { className: "dq-sr-only", children: N ? "Tag filters" : "Video filters" }),
                /* @__PURE__ */ r(
                  aa,
                  {
                    filter: Se ? Y : C,
                    onFilterChange: al,
                    totalCount: de.totalCount,
                    sortOptions: N ? Rl : ws,
                    showSearch: !0,
                    showSort: !0,
                    displayMode: Zt,
                    zoomLevel: (kr - 225) / 50,
                    onZoomChange: (Ee) => ya(Math.round(225 + Ee * 50)),
                    cardSizeEntityType: N ? "tags" : "videos",
                    criteriaDefinitions: N ? Il : Ko,
                    customFieldEntityType: Ae === "video" ? "video" : void 0,
                    objectFilter: Za,
                    onObjectFilterChange: (Ee) => {
                      Yr || (bn.current = Ae === "video" ? Ic(
                        Ee,
                        zr,
                        f.view.objectFilter
                      ) : Ee);
                    },
                    showPagingControls: !1,
                    metadataByline: /* @__PURE__ */ r(Ac, { page: z, pages: X, onPage: dl })
                  }
                )
              ] }),
              trailing: /* @__PURE__ */ l(we, { children: [
                me && /* @__PURE__ */ r(
                  Tc,
                  {
                    mode: "multiple",
                    disabled: De || Ne || qt || !!qe || wn || Fe,
                    onChange: () => et({ id: me.id, mode: "single" })
                  }
                ),
                /* @__PURE__ */ r(
                  af,
                  {
                    options: N ? fh : uh,
                    value: Zt,
                    onChange: (Ee) => Sr(fs(Ee, Ae))
                  }
                )
              ] }),
              trailingEnd: /* @__PURE__ */ r(
                fi,
                {
                  disabled: De || !!qe,
                  items: Si(le ?? f, {
                    onSelect: ao,
                    disabled: Ne || Rn || wn || !_
                  })
                }
              ),
              queueDiffers: Q ? (Pe == null ? void 0 : Pe.id) === R : void 0,
              queueChange: !qe && (Pe == null ? void 0 : Pe.id) === R ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: Hr ? il : void 0,
                saveDisabled: De || Ne || !!Se || Ut || !_,
                onReset: ol,
                resetDisabled: De || Ne || Ut
              } : void 0,
              chipsAfter: (He = (Be = me == null ? void 0 : me.presentation) == null ? void 0 : Be.binParents) != null && He.length ? /* @__PURE__ */ r(
                Vf,
                {
                  videos: de.items,
                  review: me,
                  savedObjectFilter: (le ?? me).view.objectFilter,
                  trees: nn.ids,
                  disabled: De || Ne || Ut,
                  onToggle: ul
                }
              ) : void 0,
              chipsEnd: qe ? /* @__PURE__ */ r("span", { className: "dq-defaults-note", children: "Previewing the draft" }) : void 0
            }
          ),
          ro,
          me && nn.error && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert", children: nn.error }),
          /* @__PURE__ */ l("div", { className: "dq-review-area", children: [
            qe && ln && /* @__PURE__ */ r(
              Ec,
              {
                drawerRef: Wt,
                draft: ln,
                onChange: (Ee) => Ct((Qe) => Qe && { ...Qe, draft: Ee }),
                direction: qe.draft.view.startFrom ?? "end",
                onDirectionChange: (Ee) => Ct(
                  (Qe) => Qe && {
                    ...Qe,
                    draft: { ...Qe.draft, view: { ...Qe.draft.view, startFrom: Ee } }
                  }
                ),
                tagGroups: T,
                trees: Gn,
                saving: qe.saving,
                saveDisabled: Ne || !!Se,
                error: qe.error,
                dirty: qa,
                criteriaChanged: Hr,
                notices: (
                  // The grid's own error sits under the drawer at narrower widths.
                  Se && !Ne ? /* @__PURE__ */ l("p", { className: "dq-alert", children: [
                    /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                    /* @__PURE__ */ l("span", { children: [
                      "The queue could not load: ",
                      Se,
                      " ",
                      /* @__PURE__ */ r("button", { type: "button", className: "dq-link-button", onClick: Ei, children: "Retry" })
                    ] })
                  ] }) : void 0
                ),
                onSave: () => void cl(),
                onCancel: sl
              }
            ),
            /* @__PURE__ */ l(
              "div",
              {
                className: "dq-grid-stage",
                style: { "--dq-dock-height": `${Xa}px` },
                children: [
                  /* @__PURE__ */ l("div", { className: "dq-grid-content", children: [
                    Ne && !de.items.length && /* @__PURE__ */ r(ms, { label: "Loading review queue…" }),
                    Se && !Ne && /* @__PURE__ */ r(
                      gs,
                      {
                        message: Se,
                        retryLabel: Rn ? "Reset to review defaults" : "Retry",
                        onRetry: () => {
                          if (Rn && le && Ue(le) === "video") {
                            const Ee = Nr(le);
                            ra(le.id, { ...Ee, filter: { ...Ee.filter, page: void 0 } }), xt((Qe) => Qe + 1);
                            return;
                          }
                          Ei();
                        }
                      }
                    ),
                    !De && !Ne && !Se && !de.items.length && /* @__PURE__ */ l("div", { className: "dq-empty", children: [
                      /* @__PURE__ */ r(za, {}),
                      /* @__PURE__ */ l("p", { children: [
                        "No ",
                        M,
                        "s match this review."
                      ] })
                    ] }),
                    !!de.items.length && /* @__PURE__ */ r("div", { ref: Jr, children: /* @__PURE__ */ r(
                      "div",
                      {
                        className: Zt === "list" ? "dq-tag-list" : "dq-grid",
                        style: { "--dq-card-width": `${kr}px` },
                        children: de.items.map(hl)
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ r("div", { className: "dq-bar-dock", ref: Wr, children: /* @__PURE__ */ r(
                    mc,
                    {
                      actions: qe ? qe.draft.actions : f.actions,
                      tagGroups: T,
                      trees: Gn,
                      isDisabled: ka,
                      paused: !!qe,
                      busy: De || Ne,
                      onApply: (Ee) => void ze(Ee),
                      onFind: () => an(!0),
                      status: De ? `Applying action to ${wa}…` : "",
                      summary: /* @__PURE__ */ l(we, { children: [
                        /* @__PURE__ */ r("p", { className: "dq-bar-target", children: St.size ? `${St.size} selected` : _e == null ? "Nothing to apply to" : `Applies to the focused ${M}` }),
                        /* @__PURE__ */ l(
                          "button",
                          {
                            type: "button",
                            className: "dq-text-button",
                            "aria-keyshortcuts": "Control+A Meta+A",
                            title: "Select every card on this page",
                            disabled: !O.length || Ot,
                            onClick: () => wt((Ee) => /* @__PURE__ */ new Set([...Ee, ...O])),
                            children: [
                              "Select all",
                              /* @__PURE__ */ r(dt, { binding: Sa.selectAll, hidden: !0 })
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
                              /* @__PURE__ */ r(dt, { binding: "Esc", hidden: !0 })
                            ]
                          }
                        )
                      ] }),
                      hints: ie.length ? ie.join(" ") : void 0,
                      keyHints: N ? "Arrows move · Space selects · Enter opens" : qe ? "Arrows move · Space selects" : "Arrows move · Space selects · Enter previews",
                      notices: vt || rt ? /* @__PURE__ */ l(we, { children: [
                        vt && /* @__PURE__ */ l("div", { role: "alert", className: "dq-alert", children: [
                          /* @__PURE__ */ r(Mn, { "aria-hidden": "true" }),
                          sn
                        ] }),
                        rt && /* @__PURE__ */ r("p", { role: "status", className: "dq-status", children: rt })
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
  function hl(f) {
    var M, j, X;
    if (Ae === "tag") {
      const z = f;
      return /* @__PURE__ */ r(
        wh,
        {
          tag: z,
          displayMode: Zt === "list" ? "list" : "grid",
          focused: z.id === _e,
          selected: St.has(z.id),
          setRef: (ie) => {
            ie ? ir.current.set(z.id, ie) : ir.current.delete(z.id);
          },
          onFocus: () => nt(z.id),
          onToggle: () => {
            wt((ie) => xa(ie, z.id)), Ve(z.id, !1);
          },
          onOpen: () => window.open(`/tag/${z.id}`, "_blank", "noopener,noreferrer"),
          onNavigate: e
        },
        z.id
      );
    }
    const N = f;
    return /* @__PURE__ */ r(
      vh,
      {
        video: Bf(N, me, nn.ids),
        showTagBins: ((j = (M = me == null ? void 0 : me.presentation) == null ? void 0 : M.annotations) == null ? void 0 : j.includes("tags")) && !!((X = me.presentation.annotationParents) != null && X.length),
        displayMode: Zt,
        cardsScroll: Ya,
        focused: N.id === _e,
        selected: St.has(N.id),
        setRef: (z) => {
          z ? ir.current.set(N.id, z) : ir.current.delete(N.id);
        },
        onFocus: () => nt(N.id),
        onToggle: () => wt((z) => xa(z, N.id)),
        onPreview: () => {
          qe || (nt(N.id), _t(!0));
        },
        onNavigate: e
      },
      N.id
    );
  }
}
function gh(e, t, n, a) {
  a(), n(t, e).catch(() => {
  });
}
function xa(e, t) {
  const n = new Set(e);
  return n.has(t) ? n.delete(t) : n.add(t), n;
}
function bh(e, t) {
  if (!e.some((n) => n.id === t.id)) throw new Error("This review was deleted.");
  return e.map((n) => n.id === t.id ? t : n);
}
function yh(e) {
  var n;
  if (((n = e.presentation) == null ? void 0 : n.cardSize) === void 0) return e;
  const t = { ...e.presentation };
  return delete t.cardSize, { ...e, presentation: t };
}
function wh({
  tag: e,
  displayMode: t,
  focused: n,
  selected: a,
  setRef: o,
  onFocus: i,
  onToggle: s,
  onOpen: c,
  onNavigate: u
}) {
  return /* @__PURE__ */ r(
    "article",
    {
      ref: o,
      tabIndex: 0,
      "aria-current": n ? "true" : void 0,
      "aria-label": `${e.name}${a ? ", selected" : ""}`,
      onFocus: i,
      onClick: (p) => {
        i(), p.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card dq-tag-card ${t} ${n ? "focused" : ""} ${a ? "selected" : ""}`,
      children: t === "grid" ? /* @__PURE__ */ r(
        $l,
        {
          tag: e,
          selected: a,
          onSelect: s,
          onClick: c,
          onNavigate: u
        }
      ) : /* @__PURE__ */ l("div", { className: "dq-tag-list-row", children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            "aria-label": a ? `Deselect ${e.name}` : `Select ${e.name}`,
            "aria-pressed": a,
            onClick: (p) => {
              p.stopPropagation(), s();
            },
            children: a ? "✓" : ""
          }
        ),
        /* @__PURE__ */ r("button", { type: "button", className: "dq-tag-list-name", onClick: c, children: e.name }),
        /* @__PURE__ */ r("span", { children: e.tagGroupName || "Ungrouped" }),
        /* @__PURE__ */ r("span", { children: e.description || "" }),
        /* @__PURE__ */ l("span", { children: [
          e.videoCount ?? 0,
          " videos"
        ] })
      ] })
    }
  );
}
function vh({
  video: e,
  showTagBins: t,
  displayMode: n,
  cardsScroll: a,
  focused: o,
  selected: i,
  setRef: s,
  onFocus: c,
  onToggle: u,
  onPreview: p,
  onNavigate: d
}) {
  var v, w;
  const g = Qc(e), m = $(null), b = {
    ...e,
    organized: e.organized ?? !1,
    urls: e.urls ?? [],
    tags: e.tags ?? [],
    groups: e.groups ?? [],
    galleries: e.galleries ?? [],
    createdAt: e.createdAt ?? e.updatedAt
  }, y = !!(b.date || b.studioName), q = !!(b.performers.length || b.tags.length);
  return kt(() => {
    const T = m.current;
    if (!T) return;
    const F = T.querySelector(
      `a[href="/video/${e.id}"]`
    ), U = T.querySelector(".card-title"), G = `dq-card-title-${e.id}`;
    U && (U.id = G), F && (F.target = "_blank", F.rel = "noreferrer", F.removeAttribute("aria-label"), F.setAttribute("aria-labelledby", G), F.classList.add("dq-card-link"));
    const _ = T.querySelector(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]'
    );
    _ && _.setAttribute(
      "aria-label",
      i ? `Deselect ${g}` : `Select ${g}`
    );
    const ee = T.querySelector(
      'button[title="Quick View"]'
    );
    ee && ee.setAttribute("aria-label", `Preview ${g}`);
  }), /* @__PURE__ */ l(
    "article",
    {
      ref: (T) => {
        m.current = T, s(T);
      },
      tabIndex: 0,
      "aria-current": o ? "true" : void 0,
      "aria-label": `${g}${i ? ", selected" : ""}`,
      onFocus: c,
      onClick: (T) => {
        c(), T.currentTarget.focus({ preventScroll: !0 });
      },
      className: `dq-review-card relative h-full ${n} ${y ? "has-card-metadata" : "no-card-metadata"} ${q ? "has-card-footer" : "no-card-footer"} ${o ? "focused" : ""} ${i ? "selected" : ""}`,
      children: [
        /* @__PURE__ */ r(
          Ol,
          {
            video: b,
            selected: i,
            onSelect: u,
            onNavigate: d,
            onQuickView: p,
            onClick: () => {
              window.open(`/video/${e.id}`, "_blank", "noopener,noreferrer");
            }
          }
        ),
        t && /* @__PURE__ */ l("section", { className: "dq-card-tag-bins", "aria-label": "Card tag bins", children: [
          (v = e.tags) == null ? void 0 : v.map((T) => /* @__PURE__ */ r("span", { children: T.name }, T.id)),
          !((w = e.tags) != null && w.length) && /* @__PURE__ */ r("small", { children: "No matching tags" })
        ] }),
        n === "wall" && /* @__PURE__ */ r(Nh, { video: e, cardsScroll: a })
      ]
    }
  );
}
function Nh({ video: e, cardsScroll: t }) {
  const n = $(null), a = $(null), [o, i] = A(!1), [s, c] = A(!1), [u, p] = A(!1);
  return H(() => {
    const d = n.current;
    if (!d || !e.files.length) return;
    if (typeof IntersectionObserver > "u") {
      i(!0), c(!0);
      return;
    }
    const g = t ? d.closest(".dq-grid-stage") : null, m = new IntersectionObserver(
      ([y]) => i(y.isIntersecting),
      { root: g, rootMargin: "320px 0px", threshold: 0 }
    ), b = new IntersectionObserver(
      ([y]) => c(y.isIntersecting && y.intersectionRatio >= 0.6),
      { root: g, threshold: [0, 0.6, 1] }
    );
    return m.observe(d), b.observe(d), () => {
      m.disconnect(), b.disconnect();
    };
  }, [e.id, e.files.length, t]), H(() => {
    if (!o) {
      p(!1);
      return;
    }
    const d = new AbortController();
    return pe(Ad(e.id), {
      signal: d.signal
    }).then((g) => {
      d.signal.aborted || p(g.available === !0);
    }).catch(() => {
      d.signal.aborted || p(!1);
    }), () => d.abort();
  }, [o, e.id]), H(() => {
    const d = a.current;
    d && (s ? Promise.resolve(d.play()).catch(() => {
    }) : d.pause());
  }, [u, s]), /* @__PURE__ */ r("div", { ref: n, className: "dq-wall-autoplay", "aria-hidden": "true", children: u && /* @__PURE__ */ r(
    "video",
    {
      ref: a,
      src: Cd(e.id),
      muted: !0,
      loop: !0,
      playsInline: !0,
      preload: "metadata",
      className: "dq-wall-preview-video"
    }
  ) });
}
function qh({
  video: e,
  review: t,
  selectedCount: n,
  pending: a,
  refreshing: o,
  error: i,
  canWrite: s,
  assessmentReady: c,
  trees: u,
  selected: p,
  hasPrevious: d,
  hasNext: g,
  onToggleSelected: m,
  onPrevious: b,
  onNext: y,
  onClose: q,
  onAction: v,
  findOpen: w,
  onFindOpenChange: T
}) {
  const F = $(null), U = ga(), G = $(null), _ = e.files[0], ee = Qc(e), ne = (S) => a || o || "steps" in S && S.steps.length > 0 && !s || Qn(S) && !c;
  ii({
    surface: "overlay",
    enabled: !w,
    actions: t.actions,
    onAction: (S) => {
      const I = t.actions[S];
      I && v(I);
    },
    onFind: () => T(!0)
  }), H(() => {
    var I;
    const S = document.body.style.overflow;
    return document.body.style.overflow = "hidden", (I = F.current) == null || I.focus({ preventScroll: !0 }), () => {
      document.body.style.overflow = S;
    };
  }, []);
  function se(S) {
    var Q, Z, oe;
    if (S.key !== "Tab") return;
    const I = [
      ...((Q = F.current) == null ? void 0 : Q.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )) ?? []
    ].filter((V) => V.offsetParent !== null);
    if (!I.length) {
      S.preventDefault(), (Z = F.current) == null || Z.focus();
      return;
    }
    const J = I.indexOf(
      document.activeElement
    );
    S.shiftKey && J <= 0 ? (S.preventDefault(), (oe = I.at(-1)) == null || oe.focus()) : !S.shiftKey && J === I.length - 1 && (S.preventDefault(), I[0].focus());
  }
  function ae(S) {
    if (w || S.defaultPrevented || S.ctrlKey || S.metaKey || S.target.closest(
      'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]'
    ))
      return;
    const I = S.key === "ArrowLeft" || S.key === "ArrowRight";
    if (S.altKey && !I) return;
    const J = G.current, Q = S.currentTarget.querySelector("video");
    if (S.key === "Enter" || S.key === "Escape")
      S.repeat || q();
    else if (S.key === " " && J)
      S.repeat || J.toggle();
    else if (I && J)
      J.seekBy(
        (S.key === "ArrowLeft" ? -1 : 1) * (S.shiftKey ? 5 : S.altKey ? 10 : 60)
      );
    else if ((S.key === "," || S.key === ".") && J) {
      const Z = [_ == null ? void 0 : _.duration, Q == null ? void 0 : Q.duration].find(
        (V) => V != null && Number.isFinite(V) && V > 0
      ) ?? 0, oe = e.parentVideoId != null ? (e.clipEndSec ?? Z) - (e.clipStartSec ?? 0) : Z;
      Number.isFinite(oe) && oe > 0 && J.seekBy((S.key === "," ? -1 : 1) * oe * 0.1);
    } else if (S.key.toLowerCase() === "n" || S.key.toLowerCase() === "m")
      !S.repeat && !a && !o && (S.key.toLowerCase() === "n" && d && b(), S.key.toLowerCase() === "m" && g && y());
    else if (S.key === "ArrowUp" && Q)
      Q.volume = Math.min(1, Q.volume + 0.1);
    else if (S.key === "ArrowDown" && Q)
      Q.volume = Math.max(0, Q.volume - 0.1);
    else return;
    Fr(S);
  }
  function D(S) {
    const I = F.current, J = S.target instanceof Element ? S.target.closest("button, a[href]") : null;
    !I || !J || !I.contains(J) || J.closest(".dq-player, .dq-find-action") || S.detail === 0 || I.focus({ preventScroll: !0 });
  }
  H(() => {
    if (w) return;
    let S = 0;
    const I = requestAnimationFrame(() => {
      S = requestAnimationFrame(() => {
        var Q;
        const J = document.activeElement;
        (Q = F.current) != null && Q.isConnected && (!J || J === document.body || J === document.documentElement) && F.current.focus({ preventScroll: !0 });
      });
    });
    return () => {
      cancelAnimationFrame(I), cancelAnimationFrame(S);
    };
  }, [w, a, o, g, d, e.id, U]);
  const K = n ? `the ${n} selected video${n === 1 ? "" : "s"}` : "this video";
  return /* @__PURE__ */ l(
    "div",
    {
      ref: F,
      tabIndex: -1,
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `Review preview: ${ee}`,
      className: `dq-preview${U ? " dq-preview-mobile" : ""}`,
      onKeyDown: se,
      onKeyDownCapture: ae,
      onMouseDown: (S) => {
        S.target === S.currentTarget && q();
      },
      onClick: D,
      children: [
        /* @__PURE__ */ l("div", { className: "dq-preview-shell", children: [
          /* @__PURE__ */ l("header", { className: "dq-preview-header", children: [
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Previous video",
                "aria-keyshortcuts": "n",
                title: "Previous video",
                disabled: !d || a || o,
                onClick: b,
                children: [
                  /* @__PURE__ */ r(fa, { "aria-hidden": "true" }),
                  !U && /* @__PURE__ */ r(dt, { binding: "n", hidden: !0 })
                ]
              }
            ),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button",
                "aria-label": "Next video",
                "aria-keyshortcuts": "m",
                title: "Next video",
                disabled: !g || a || o,
                onClick: y,
                children: [
                  !U && /* @__PURE__ */ r(dt, { binding: "m", hidden: !0 }),
                  /* @__PURE__ */ r(Ts, { "aria-hidden": "true" })
                ]
              }
            ),
            /* @__PURE__ */ l("div", { className: "dq-preview-title", children: [
              /* @__PURE__ */ r("h2", { children: ee }),
              /* @__PURE__ */ l("p", { children: [
                "Actions apply to ",
                K
              ] })
            ] }),
            /* @__PURE__ */ l(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-select",
                "aria-pressed": p,
                disabled: o,
                onClick: m,
                children: [
                  /* @__PURE__ */ r("span", { className: "dq-preview-check", "aria-hidden": "true", children: p && /* @__PURE__ */ r(da, {}) }),
                  "Selected"
                ]
              }
            ),
            /* @__PURE__ */ r(
              "a",
              {
                href: `/video/${e.id}`,
                target: "_blank",
                rel: "noreferrer",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": `Open ${ee} in a new tab`,
                title: "Open video in a new tab",
                children: /* @__PURE__ */ r(Is, { "aria-hidden": "true" })
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                className: "dq-preview-button dq-preview-icon",
                "aria-label": "Close preview",
                "aria-keyshortcuts": "Escape",
                title: "Close preview",
                onClick: q,
                children: /* @__PURE__ */ r(ua, { "aria-hidden": "true" })
              }
            )
          ] }),
          /* @__PURE__ */ r("div", { className: "dq-player", "data-review-player-controls": !0, tabIndex: 0, children: /* @__PURE__ */ r("div", { className: "dq-preview-video", children: _ ? /* @__PURE__ */ r(
            vs,
            {
              autostart: !0,
              streamUrl: So("video", e.id),
              posterUrl: Li(e),
              format: _.format,
              audioCodec: _.audioCodec,
              duration: _.duration ?? 0,
              videoId: e.id,
              showAbLoop: !1,
              extensionSurface: "quick-view",
              onPlaybackControlRegister: (S) => (G.current = S, () => {
                G.current === S && (G.current = null);
              }),
              clip: e.parentVideoId != null ? {
                start: e.clipStartSec ?? 0,
                end: e.clipEndSec,
                loop: !1
              } : void 0
            }
          ) : /* @__PURE__ */ r("img", { src: Li(e), alt: "" }) }) }),
          i && /* @__PURE__ */ r("p", { role: "alert", className: "dq-alert dq-preview-alert", children: i }),
          !U && /* @__PURE__ */ l("p", { className: "dq-preview-hints", children: [
            /* @__PURE__ */ r("span", { children: "Space play / pause" }),
            /* @__PURE__ */ r("span", { children: "← → ±60 s · Alt ±10 s · Shift ±5 s" }),
            /* @__PURE__ */ r("span", { children: ", . ±10 %" }),
            /* @__PURE__ */ r("span", { children: "↑ ↓ volume" }),
            /* @__PURE__ */ r("span", { children: "N M previous / next" }),
            /* @__PURE__ */ r("span", { children: "Enter or Esc closes" })
          ] }),
          /* @__PURE__ */ r(
            mc,
            {
              className: "dq-action-bar-docked",
              actions: t.actions,
              trees: u,
              isDisabled: ne,
              busy: a || o,
              onApply: (S) => void v(S),
              onFind: () => T(!0),
              status: a ? `Applying action to ${K}…` : "",
              summary: /* @__PURE__ */ r("p", { className: "dq-bar-target", children: n ? `${n} selected` : "This video" })
            }
          )
        ] }),
        w && /* @__PURE__ */ r(
          li,
          {
            actions: t.actions,
            trees: u,
            isDisabled: ne,
            canStay: !1,
            onApply: (S) => {
              T(!1), v(S);
            },
            onClose: () => T(!1)
          }
        )
      ]
    }
  );
}
async function Sh() {
  const e = await pe("/api/auth/me"), t = String(e.user.id), n = localStorage.getItem("cove-data-quality-v2:" + t);
  let a = n ?? localStorage.getItem("cove-data-quality-reviews-v1:" + t) ?? localStorage.getItem("cove-video-reviews-v1:" + t) ?? "[]";
  if (n)
    try {
      const s = JSON.parse(n);
      Array.isArray(s.reviews) && (a = JSON.stringify(s.reviews, null, 2));
    } catch {
    }
  const o = URL.createObjectURL(
    new Blob([a], { type: "application/json" })
  ), i = document.createElement("a");
  i.href = o, i.download = "data-quality-browser-recovery.json", i.click(), URL.revokeObjectURL(o);
}
function ms({ label: e }) {
  return /* @__PURE__ */ l("div", { role: "status", className: "dq-centered", children: [
    /* @__PURE__ */ r(Bl, { className: "dq-spin" }),
    e
  ] });
}
function gs({
  message: e,
  onRetry: t,
  retryLabel: n = "Retry"
}) {
  return /* @__PURE__ */ l("div", { role: "alert", className: "dq-error", children: [
    /* @__PURE__ */ r(Mn, {}),
    /* @__PURE__ */ r("p", { children: e }),
    /* @__PURE__ */ r("button", { className: "dq-button", type: "button", onClick: t, children: n })
  ] });
}
const Rh = { components: { DataQualityPage: mh } };
export {
  mh as DataQualityPage,
  Rh as default,
  vr as objectFiltersEqual
};
